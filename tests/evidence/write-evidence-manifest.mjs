import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'

import {
  assertPathSafeEvidenceText,
  assertRetainedBrowserArtifactNames,
} from './browser-artifact-safety.mjs'
import {
  DATABASE_ARTIFACT_NAMES,
  artifactPhaseFromName,
  assertDatabaseArtifactNames,
  assertDatabaseEvidenceRecord,
  assertDatabaseEvidenceTextSafe,
  validateCompleteDatabaseEvidence,
} from './database-evidence-contract.mjs'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const artifactRoot = `${repositoryRoot}/artifacts/ir-001`
const retainedBrowserArtifactDirectory = `${artifactRoot}/browser/retained`
const databaseArtifactDirectory = `${artifactRoot}/database`
const databaseSequenceStatePath = '/tmp/bachelor-trip-app-ir001-database-evidence-sequence.json'
const job = process.env.IR001_EVIDENCE_JOB ?? 'local'

if (!['browser', 'database', 'local'].includes(job)) {
  throw new Error('refusing an unrecognised IR-001 evidence job')
}

function artifactPath(relativePath) {
  return `${artifactRoot}/${relativePath}`
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function collectFiles(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = `${directory}/${entry.name}`
      if (entry.isSymbolicLink()) {
        throw new Error('refusing a symbolic link in generated evidence')
      }
      return entry.isDirectory() ? collectFiles(path) : [path]
    })
    .sort()
}

function collectAllowListedBrowserFiles() {
  if (!existsSync(retainedBrowserArtifactDirectory)) {
    throw new Error('browser retained evidence is missing')
  }

  const entries = readdirSync(retainedBrowserArtifactDirectory, { withFileTypes: true })
  if (entries.some((entry) => !entry.isFile() || entry.isSymbolicLink())) {
    throw new Error('refusing a non-file browser retained artifact')
  }

  assertRetainedBrowserArtifactNames(entries.map((entry) => entry.name))
  const failureSummaryPath = `${retainedBrowserArtifactDirectory}/controlled-failure.json`
  assertPathSafeEvidenceText(readFileSync(failureSummaryPath, 'utf8'), { repositoryRoot })

  return entries
    .map((entry) => `${retainedBrowserArtifactDirectory}/${entry.name}`)
    .sort()
}

function toRepositoryRelativePath(path) {
  if (!path.startsWith(`${repositoryRoot}/`)) {
    throw new Error('refusing a generated artifact outside the repository boundary')
  }

  return path.slice(repositoryRoot.length + 1)
}

function collectAllowListedDatabaseFiles() {
  if (!existsSync(databaseArtifactDirectory)) {
    throw new Error('database evidence directory is missing')
  }
  if (!existsSync(databaseSequenceStatePath)) {
    throw new Error('database evidence sequence state is missing')
  }

  const entries = readdirSync(databaseArtifactDirectory, { withFileTypes: true })
  if (entries.some((entry) => !entry.isFile() || entry.isSymbolicLink())) {
    throw new Error('refusing a non-file database retained artifact')
  }
  assertDatabaseArtifactNames(entries.map((entry) => entry.name))

  const records = entries.map((entry) => {
    const phase = artifactPhaseFromName(entry.name)
    if (!phase) {
      throw new Error('refusing an unrecognised database evidence artifact')
    }
    const record = JSON.parse(readFileSync(`${databaseArtifactDirectory}/${entry.name}`, 'utf8'))
    assertDatabaseEvidenceRecord(record, phase)
    assertDatabaseEvidenceTextSafe(JSON.stringify(record), { repositoryRoot })
    return record
  })
  const sequenceState = JSON.parse(readFileSync(databaseSequenceStatePath, 'utf8'))
  validateCompleteDatabaseEvidence(records, sequenceState)

  return DATABASE_ARTIFACT_NAMES.map((name) => `${databaseArtifactDirectory}/${name}`)
}

const jobArtifactRoot = job === 'local' ? artifactRoot : artifactPath(job)
const jobFiles = job === 'browser'
  ? collectAllowListedBrowserFiles()
  : job === 'database'
    ? collectAllowListedDatabaseFiles()
    : collectFiles(jobArtifactRoot).filter((path) => !path.endsWith('/evidence-manifest.json'))

const includedFiles = jobFiles
  .map((path) => {
    const artifact = {
      path: toRepositoryRelativePath(path),
      bytes: statSync(path).size,
      sha256: sha256(path),
    }
    if (job === 'database') {
      const record = JSON.parse(readFileSync(path, 'utf8'))
      return {
        ...artifact,
        capability: record.capability,
        evidencePhase: record.evidencePhase,
        safeResultClassification: record.observedTestOutcome,
      }
    }
    return artifact
  })

const manifest = {
  schemaVersion: 1,
  ir: 'IR-001',
  job,
  environment:
    process.env.GITHUB_ACTIONS === 'true'
      ? 'github-actions-runner-local'
      : 'local-isolated',
  fixture: 'two-account-two-group-v1',
  reviewerStatus: 'unreviewed',
  consumingGates: ['GATE-007', 'GATE-008', 'GATE-009', 'GATE-010'],
  expectedOutcome:
    job === 'database'
      ? 'normal and controlled local RLS evidence with exact cleanup'
      : 'normal and controlled browser evidence without external traffic',
  actualOutcome: 'command evidence retained for review',
  failureDisposition: 'controlled failures are retained as expected evidence',
  artifacts: includedFiles,
}

mkdirSync(artifactRoot, { recursive: true })
const serializedManifest = `${JSON.stringify(manifest, null, 2)}\n`
assertPathSafeEvidenceText(serializedManifest, { repositoryRoot })
assertDatabaseEvidenceTextSafe(serializedManifest, { repositoryRoot })
writeFileSync(
  artifactPath('evidence-manifest.json'),
  serializedManifest,
  'utf8',
)

console.log(
  JSON.stringify({
    capability: 'ir-001-evidence-manifest',
    result: 'passed',
    job,
    artifacts: includedFiles.length,
  }),
)
