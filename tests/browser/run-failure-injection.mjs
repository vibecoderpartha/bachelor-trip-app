import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const resultDirectory = fileURLToPath(
  new URL('../../artifacts/ir-001/browser/test-results', import.meta.url),
)

function findScreenshots(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = `${directory}/${entry.name}`
    if (entry.isDirectory()) {
      return findScreenshots(entryPath)
    }

    return entry.name.endsWith('.png') ? [entryPath] : []
  })
}

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
    },
  },
)

if (result.error || result.status !== 1) {
  throw new Error('controlled browser failure did not return the expected exit code')
}

const resultMetadataPath = `${resultDirectory}/.last-run.json`
if (!existsSync(resultMetadataPath)) {
  throw new Error('controlled browser failure did not retain result metadata')
}

const resultMetadata = JSON.parse(readFileSync(resultMetadataPath, 'utf8'))
const screenshotCount = findScreenshots(resultDirectory).length
if (resultMetadata.status !== 'failed' || screenshotCount < 1) {
  throw new Error('controlled browser failure did not retain the expected artifact')
}

console.log(
  JSON.stringify({
    capability: 'ir-001-browser-failure-injection',
    result: 'passed',
    expectedChildExitCode: 1,
    retainedScreenshots: screenshotCount,
  }),
)
