import { spawnSync } from 'node:child_process'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DATABASE_ARTIFACT_NAMES,
  HOSTED_NORMAL_FAILURE_ARTIFACT_NAME,
  artifactPhaseFromName,
  assertDatabaseEvidenceRecord,
  assertDatabaseSequenceState,
  assertRawNormalProbeResult,
  assertHostedNormalFailureDiagnostic,
  createDatabaseEvidenceRecord,
  createDatabaseEvidenceSequenceId,
  createDatabaseSequenceState,
  createHostedNormalFailureDiagnostic,
  databaseArtifactName,
} from '../evidence/database-evidence-contract.mjs'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const databaseArtifactDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/database', import.meta.url),
)
const rawResultPath = '/tmp/bachelor-trip-app-ir001-rls-result.json'
const sequenceStatePath = '/tmp/bachelor-trip-app-ir001-database-evidence-sequence.json'

function assertDatabaseArtifactDirectory() {
  const resolvedDirectory = resolve(databaseArtifactDirectory)
  const resolvedRoot = resolve(repositoryRoot, 'artifacts/ir-001')
  if (!resolvedDirectory.startsWith(`${resolvedRoot}/`)) {
    throw new Error('refusing a database artifact path outside the IR-001 boundary')
  }

  if (existsSync(databaseArtifactDirectory)) {
    const stats = lstatSync(databaseArtifactDirectory)
    if (!stats.isDirectory() || stats.isSymbolicLink()) {
      throw new Error('refusing an unexpected database artifact directory')
    }
  } else {
    mkdirSync(databaseArtifactDirectory, { recursive: true })
  }
}

function listedArtifactNames() {
  assertDatabaseArtifactDirectory()
  const entries = readdirSync(databaseArtifactDirectory, { withFileTypes: true })
  if (entries.some((entry) => !entry.isFile() || entry.isSymbolicLink())) {
    throw new Error('refusing a non-file database evidence artifact')
  }

  const names = entries.map((entry) => entry.name).sort()
  if (names.some((name) => !DATABASE_ARTIFACT_NAMES.includes(name))) {
    throw new Error('refusing a database artifact outside the allow-list')
  }
  return names
}

function hostedNormalFailureDiagnosticPath() {
  return `${databaseArtifactDirectory}/${HOSTED_NORMAL_FAILURE_ARTIFACT_NAME}`
}

function removeHostedNormalFailureDiagnostic() {
  const path = hostedNormalFailureDiagnosticPath()
  if (!existsSync(path)) {
    return
  }
  const stats = lstatSync(path)
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error('refusing an unexpected hosted normal failure diagnostic')
  }
  assertHostedNormalFailureDiagnostic(JSON.parse(readFileSync(path, 'utf8')))
  unlinkSync(path)
}

function artifactPath(phase) {
  return `${databaseArtifactDirectory}/${databaseArtifactName(phase)}`
}

function readArtifact(phase) {
  return JSON.parse(readFileSync(artifactPath(phase), 'utf8'))
}

function removeVerifiedFile(path, description) {
  if (!existsSync(path)) {
    return
  }

  const stats = lstatSync(path)
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(`refusing an unexpected ${description}`)
  }
  unlinkSync(path)
}

function removeRawResult() {
  if (!existsSync(rawResultPath)) {
    return
  }
  const rawResult = JSON.parse(readFileSync(rawResultPath, 'utf8'))
  if (rawResult.capability !== 'ir-001-local-rls-probe') {
    throw new Error('refusing to remove an unexpected local result record')
  }
  removeVerifiedFile(rawResultPath, 'local result record')
}

function readSequenceState() {
  if (!existsSync(sequenceStatePath)) {
    return null
  }
  const state = JSON.parse(readFileSync(sequenceStatePath, 'utf8'))
  assertDatabaseSequenceState(state)
  return state
}

function clearSequenceState() {
  if (existsSync(sequenceStatePath)) {
    readSequenceState()
    removeVerifiedFile(sequenceStatePath, 'database evidence sequence state')
  }
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function clearPreparedSequence(names) {
  const phases = names.map((name) => {
    const phase = artifactPhaseFromName(name)
    if (!phase) {
      throw new Error('refusing an unknown database evidence artifact')
    }
    assertDatabaseEvidenceRecord(readArtifact(phase), phase)
    return phase
  })
  const sequenceState = readSequenceState()

  for (const phase of phases) {
    removeVerifiedFile(artifactPath(phase), 'database evidence artifact')
  }
  if (sequenceState) {
    removeVerifiedFile(sequenceStatePath, 'database evidence sequence state')
  }
}

function selectNormalEvidencePhase() {
  const names = listedArtifactNames()
  const normalName = databaseArtifactName('initial')
  const controlledName = databaseArtifactName('controlledFailure')

  if (names.length === 0) {
    clearSequenceState()
    return { phase: 'initial', sequenceId: createDatabaseEvidenceSequenceId() }
  }

  if (names.length === 1 && names[0] === normalName) {
    clearPreparedSequence(names)
    return { phase: 'initial', sequenceId: createDatabaseEvidenceSequenceId() }
  }

  if (names.length === 2 && names.includes(normalName) && names.includes(controlledName)) {
    const initial = readArtifact('initial')
    const controlledFailure = readArtifact('controlledFailure')
    assertDatabaseEvidenceRecord(initial, 'initial')
    assertDatabaseEvidenceRecord(controlledFailure, 'controlledFailure')
    if (initial.sequenceId !== controlledFailure.sequenceId) {
      throw new Error('refusing mixed database evidence sequence identities')
    }
    const state = readSequenceState()
    if (!state) {
      throw new Error('refusing database recovery without an active evidence sequence')
    }
    assertDatabaseSequenceState(state, 'controlled-failure-complete', initial.sequenceId)
    return { phase: 'recovery', sequenceId: initial.sequenceId }
  }

  if (names.length === DATABASE_ARTIFACT_NAMES.length) {
    clearPreparedSequence(names)
    return { phase: 'initial', sequenceId: createDatabaseEvidenceSequenceId() }
  }

  throw new Error('refusing an incomplete or stale database evidence sequence')
}

function runNormalCapability(phase) {
  const result = spawnSync(process.execPath, ['tests/database/run-rls-probe.mjs'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: process.env,
  })
  if (result.error || result.status !== 0) {
    let rawResult = null
    let childResult = 'missing-safe-result'
    if (existsSync(rawResultPath)) {
      try {
        rawResult = JSON.parse(readFileSync(rawResultPath, 'utf8'))
        if (rawResult.capability === 'ir-001-local-rls-probe') {
          const category = [
            rawResult.cleanupFailureReason,
            rawResult.primaryFailureReason,
            rawResult.state,
          ].find((value) => typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value))
          childResult = category ?? 'safe-result-without-category'
        } else {
          childResult = 'unexpected-safe-result'
        }
      } catch {
        childResult = 'malformed-safe-result'
      }
    }
    const diagnostic = createHostedNormalFailureDiagnostic(rawResult, {
      childExitCode: result.status ?? 1,
    })
    if (
      phase === 'initial' &&
      process.env.IR001_RETAIN_HOSTED_NORMAL_FAILURE === 'true'
    ) {
      assertDatabaseArtifactDirectory()
      writeJson(hostedNormalFailureDiagnosticPath(), diagnostic)
    }
    console.error(
      JSON.stringify({
        capability: 'ir-001-local-rls-probe',
        result: 'failed-safely',
        childExitCode: result.status ?? null,
        childResult,
        primaryFailureStep: diagnostic.primaryFailureStep,
        primaryFailureCategory: diagnostic.primaryFailureCategory,
      }),
    )
    return false
  }
  if (!existsSync(rawResultPath)) {
    throw new Error('normal database capability did not retain a result record')
  }
  const rawResult = JSON.parse(readFileSync(rawResultPath, 'utf8'))
  assertRawNormalProbeResult(rawResult)
  return true
}

assertDatabaseArtifactDirectory()
removeHostedNormalFailureDiagnostic()
const selection = selectNormalEvidencePhase()
const outputPath = artifactPath(selection.phase)
removeVerifiedFile(outputPath, 'database evidence artifact')
removeRawResult()
if (runNormalCapability(selection.phase)) {
  writeJson(outputPath, createDatabaseEvidenceRecord(selection.phase, selection.sequenceId))
  writeJson(
    sequenceStatePath,
    createDatabaseSequenceState(
      selection.sequenceId,
      selection.phase === 'initial' ? 'initial-normal-complete' : 'recovery-normal-complete',
    ),
  )

  console.log(
    JSON.stringify({
      capability: 'ir-001-local-rls-probe',
      result: 'passed',
      evidencePhase: selection.phase === 'initial' ? 'initial-normal' : 'recovery-normal',
      cleanup: 'confirmed',
    }),
  )
} else {
  process.exitCode = 1
}
