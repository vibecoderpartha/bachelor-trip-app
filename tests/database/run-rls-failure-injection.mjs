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
  assertDatabaseEvidenceRecord,
  assertDatabaseSequenceState,
  assertRawControlledFailureResult,
  createDatabaseEvidenceRecord,
  createDatabaseSequenceState,
  databaseArtifactName,
} from '../evidence/database-evidence-contract.mjs'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const safeResultPath = '/tmp/bachelor-trip-app-ir001-rls-result.json'
const sequenceStatePath = '/tmp/bachelor-trip-app-ir001-database-evidence-sequence.json'
const databaseArtifactDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/database', import.meta.url),
)
const capability = 'ir-001-local-rls-probe'

function assertDatabaseArtifactDirectory() {
  const resolvedDirectory = resolve(databaseArtifactDirectory)
  const resolvedRoot = resolve(repositoryRoot, 'artifacts/ir-001')
  if (!resolvedDirectory.startsWith(`${resolvedRoot}/`)) {
    throw new Error('refusing a database artifact path outside the IR-001 boundary')
  }
  if (!existsSync(databaseArtifactDirectory)) {
    throw new Error('controlled database failure requires an initial normal evidence record')
  }
  const stats = lstatSync(databaseArtifactDirectory)
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new Error('refusing an unexpected database artifact directory')
  }
}

function artifactPath(phase) {
  return `${databaseArtifactDirectory}/${databaseArtifactName(phase)}`
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
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

function assertInitialEvidenceSequence() {
  assertDatabaseArtifactDirectory()
  const entries = readdirSync(databaseArtifactDirectory, { withFileTypes: true })
  if (entries.some((entry) => !entry.isFile() || entry.isSymbolicLink())) {
    throw new Error('refusing a non-file database evidence artifact')
  }
  const names = entries.map((entry) => entry.name).sort()
  const expectedName = databaseArtifactName('initial')
  if (
    names.length !== 1 ||
    names[0] !== expectedName ||
    names.some((name) => !DATABASE_ARTIFACT_NAMES.includes(name))
  ) {
    throw new Error('controlled database failure requires only an initial normal evidence record')
  }
  if (!existsSync(sequenceStatePath)) {
    throw new Error('controlled database failure requires an active evidence sequence')
  }

  const initial = readJson(artifactPath('initial'))
  const state = readJson(sequenceStatePath)
  assertDatabaseEvidenceRecord(initial, 'initial')
  assertDatabaseSequenceState(state, 'initial-normal-complete', initial.sequenceId)
  return initial.sequenceId
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

const sequenceId = assertInitialEvidenceSequence()
const controlledFailurePath = artifactPath('controlledFailure')
if (existsSync(controlledFailurePath)) {
  throw new Error('refusing stale controlled-failure database evidence')
}

if (existsSync(safeResultPath)) {
  const existingResult = readJson(safeResultPath)
  if (existingResult.capability !== capability) {
    throw new Error('refusing to remove an unexpected local result record')
  }

  removeVerifiedFile(safeResultPath, 'local result record')
}

const result = spawnSync(process.execPath, ['tests/database/run-rls-probe.mjs'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
  env: {
    ...process.env,
    IR001_RLS_PROBE_INJECT_FAILURE: 'after-probe-setup',
  },
})

if (result.error || result.status !== 1) {
  throw new Error('controlled database failure did not return the expected exit code')
}

if (!existsSync(safeResultPath)) {
  throw new Error('controlled database failure did not retain a result record')
}

const safeResult = readJson(safeResultPath)
assertRawControlledFailureResult(safeResult)
writeJson(
  controlledFailurePath,
  createDatabaseEvidenceRecord('controlledFailure', sequenceId),
)
writeJson(
  sequenceStatePath,
  createDatabaseSequenceState(sequenceId, 'controlled-failure-complete'),
)

console.log(
  JSON.stringify({
    capability: 'ir-001-database-failure-injection',
    result: 'passed',
    expectedChildExitCode: 1,
    cleanup: 'confirmed',
  }),
)
