import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const safeResultPath = '/tmp/bachelor-trip-app-ir001-rls-result.json'
const capability = 'ir-001-local-rls-probe'

if (existsSync(safeResultPath)) {
  const existingResult = JSON.parse(readFileSync(safeResultPath, 'utf8'))
  if (existingResult.capability !== capability) {
    throw new Error('refusing to remove an unexpected local result record')
  }

  unlinkSync(safeResultPath)
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

const safeResult = JSON.parse(readFileSync(safeResultPath, 'utf8'))
if (
  safeResult.capability !== capability ||
  safeResult.state !== 'cleanup-passed' ||
  safeResult.runMode !== 'injected-after-probe-setup' ||
  safeResult.primaryFailure !== true ||
  safeResult.primaryFailureStep !== 'failure-injection-after-probe-setup' ||
  safeResult.primaryFailureReason !== 'controlled-failure-injected'
) {
  throw new Error('controlled database failure did not satisfy the safe cleanup contract')
}

console.log(
  JSON.stringify({
    capability: 'ir-001-database-failure-injection',
    result: 'passed',
    expectedChildExitCode: 1,
    cleanup: 'confirmed',
  }),
)
