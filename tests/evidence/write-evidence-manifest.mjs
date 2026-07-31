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

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const artifactRoot = `${repositoryRoot}/artifacts/ir-001`
const databaseResultPath = '/tmp/bachelor-trip-app-ir001-rls-result.json'
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
      return entry.isDirectory() ? collectFiles(path) : [path]
    })
    .sort()
}

function toRepositoryRelativePath(path) {
  if (!path.startsWith(`${repositoryRoot}/`)) {
    throw new Error('refusing a generated artifact outside the repository boundary')
  }

  return path.slice(repositoryRoot.length + 1)
}

function assertSafeDatabaseResult(result) {
  if (
    result.capability !== 'ir-001-local-rls-probe' ||
    result.state !== 'cleanup-passed' ||
    result.runMode !== 'injected-after-probe-setup' ||
    result.primaryFailure !== true ||
    result.primaryFailureReason !== 'controlled-failure-injected'
  ) {
    throw new Error('refusing an unexpected database evidence result')
  }
}

mkdirSync(artifactRoot, { recursive: true })

if (job === 'database') {
  if (!existsSync(databaseResultPath)) {
    throw new Error('database evidence result is missing')
  }

  const databaseResult = JSON.parse(readFileSync(databaseResultPath, 'utf8'))
  assertSafeDatabaseResult(databaseResult)
  const databaseArtifactDirectory = artifactPath('database')
  mkdirSync(databaseArtifactDirectory, { recursive: true })
  writeFileSync(
    `${databaseArtifactDirectory}/rls-result.json`,
    `${JSON.stringify({
      capability: databaseResult.capability,
      state: databaseResult.state,
      primaryFailure: databaseResult.primaryFailure,
      primaryFailureStep: databaseResult.primaryFailureStep,
      primaryFailureReason: databaseResult.primaryFailureReason,
      runMode: databaseResult.runMode,
    })}\n`,
    'utf8',
  )
}

const jobArtifactRoot =
  job === 'local' ? artifactRoot : artifactPath(job)

const includedFiles = collectFiles(jobArtifactRoot)
  .filter((path) => !path.endsWith('/evidence-manifest.json'))
  .map((path) => ({
    path: toRepositoryRelativePath(path),
    bytes: statSync(path).size,
    sha256: sha256(path),
  }))

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

writeFileSync(
  artifactPath('evidence-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
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
