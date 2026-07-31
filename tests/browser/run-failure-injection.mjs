import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  assertPathSafeEvidenceText,
  assertBrowserFailureSummary,
  assertRetainedBrowserArtifactNames,
  APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS,
  BROWSER_PRIVACY_TRANSFORMATION_STRATEGY,
  BROWSER_SCREENSHOT_CLASSIFICATION,
  sanitizeEvidenceText,
  selectRawScreenshotForSafeRetention,
} from '../evidence/browser-artifact-safety.mjs'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const browserArtifactRoot = fileURLToPath(
  new URL('../../artifacts/ir-001/browser', import.meta.url),
)
const rawResultDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/browser/raw-test-results', import.meta.url),
)
const retainedDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/browser/retained', import.meta.url),
)
const stagingDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/browser/staging', import.meta.url),
)
const stagingScreenshotPath = `${stagingDirectory}/controlled-failure-source.png`

function assertExactArtifactDirectory(directory) {
  const resolvedDirectory = resolve(directory)
  const resolvedArtifactRoot = resolve(browserArtifactRoot)
  if (!resolvedDirectory.startsWith(`${resolvedArtifactRoot}/`)) {
    throw new Error('refusing an artifact path outside the IR-001 browser boundary')
  }
}

function removeArtifactDirectory(directory) {
  assertExactArtifactDirectory(directory)
  if (!existsSync(directory)) {
    return
  }

  const stats = lstatSync(directory)
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new Error('refusing to remove an unexpected browser artifact path')
  }

  rmSync(directory, { recursive: true, force: false })
}

function collectFiles(directory) {
  assertExactArtifactDirectory(directory)
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = `${directory}/${entry.name}`
    if (entry.isSymbolicLink()) {
      throw new Error('refusing a symbolic link in Playwright raw output')
    }
    if (entry.isDirectory()) {
      return collectFiles(entryPath)
    }

    return entry.isFile() ? [entryPath] : []
  })
}

function repositoryRelativeArtifactPath(path) {
  const relativePath = relative(repositoryRoot, path).replaceAll('\\', '/')
  if (relativePath.startsWith('../') || relativePath === '..') {
    throw new Error('refusing an artifact outside the repository boundary')
  }

  return relativePath
}

removeArtifactDirectory(rawResultDirectory)
removeArtifactDirectory(retainedDirectory)
removeArtifactDirectory(stagingDirectory)
mkdirSync(stagingDirectory, { recursive: true })

const result = spawnSync(
  'npx',
  ['--no-install', 'playwright', 'test', 'tests/browser/failure-injection.spec.ts'],
  {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: '0',
      IR001_BROWSER_FAILURE_INJECTION: 'enabled',
      IR001_BROWSER_SAFE_SCREENSHOT_PATH: stagingScreenshotPath,
    },
  },
)

if (result.error || result.status !== 1) {
  throw new Error('controlled browser failure did not return the expected exit code')
}

const stagingFiles = collectFiles(stagingDirectory)
if (stagingFiles.some((path) => path !== stagingScreenshotPath)) {
  throw new Error('controlled browser failure retained an unexpected staging artifact')
}

mkdirSync(retainedDirectory, { recursive: true })
copyFileSync(
  selectRawScreenshotForSafeRetention(stagingFiles),
  `${retainedDirectory}/controlled-failure.png`,
)

const retainedArtifacts = [
  {
    id: 'controlled-failure-summary',
    path: repositoryRelativeArtifactPath(`${retainedDirectory}/controlled-failure.json`),
  },
  {
    id: 'controlled-failure-screenshot',
    path: repositoryRelativeArtifactPath(`${retainedDirectory}/controlled-failure.png`),
  },
]
const failureSummary = {
  schemaVersion: 2,
  capability: 'ir-001-browser-failure-injection',
  result: 'expected-child-failure-observed',
  command: 'npx --no-install playwright test tests/browser/failure-injection.spec.ts',
  expectedChildExitCode: 1,
  actualChildExitCode: result.status,
  failureClass: 'controlled-missing-test-id',
  browser: 'chromium',
  project: 'IR-001',
  correctionBoundary: 'F-IR001-VER-007-008',
  privacyTransformApplied: true,
  privacyTransformationStrategy: BROWSER_PRIVACY_TRANSFORMATION_STRATEGY,
  approvedPlaceholderSet: APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS,
  screenshotClassification: BROWSER_SCREENSHOT_CLASSIFICATION,
  artifactAllowList: 'passed',
  rawDiagnosticExclusion: 'confirmed',
  retainedArtifacts,
}
const serializedFailureSummary = sanitizeEvidenceText(
  `${JSON.stringify(failureSummary, null, 2)}\n`,
  { repositoryRoot },
)
assertPathSafeEvidenceText(serializedFailureSummary, { repositoryRoot })
assertBrowserFailureSummary(JSON.parse(serializedFailureSummary))
writeFileSync(
  `${retainedDirectory}/controlled-failure.json`,
  serializedFailureSummary,
  'utf8',
)
assertRetainedBrowserArtifactNames(readdirSync(retainedDirectory).sort())

removeArtifactDirectory(rawResultDirectory)
removeArtifactDirectory(stagingDirectory)

console.log(
  JSON.stringify({
    capability: 'ir-001-browser-failure-injection',
    result: 'passed',
    expectedChildExitCode: 1,
    retainedArtifacts: retainedArtifacts.length,
  }),
)
