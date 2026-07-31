import { spawnSync } from 'node:child_process'

import {
  LOCAL_PROJECT_NETWORK,
  LOCAL_PROJECT_VOLUME,
  waitForExactProjectDockerCleanup,
} from './local-docker-cleanup.mjs'

function dockerNames(args) {
  const result = spawnSync('docker', args, { encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    throw new Error('local-docker-inspection-failed')
  }
  return result.stdout.trim().split('\n').filter(Boolean)
}

function readExactProjectSnapshot() {
  return {
    containers: dockerNames(['ps', '--all', '--format', '{{.Names}}']).filter((name) =>
      /^supabase_[a-z0-9_]+_bachelor-trip-app-ir001$/i.test(name),
    ),
    networks: dockerNames(['network', 'ls', '--format', '{{.Name}}']).filter(
      (name) => name === LOCAL_PROJECT_NETWORK,
    ),
    volumes: dockerNames(['volume', 'ls', '--format', '{{.Name}}']).filter(
      (name) => name === LOCAL_PROJECT_VOLUME,
    ),
  }
}

try {
  const cleanup = waitForExactProjectDockerCleanup(readExactProjectSnapshot)
  console.log(
    JSON.stringify({
      capability: 'ir-001-local-docker-cleanup',
      result: 'passed',
      cleanup: 'confirmed',
      attempts: cleanup.attempts,
      waitedMilliseconds: cleanup.waitedMilliseconds,
    }),
  )
} catch (error) {
  const reason = error instanceof Error && error.message.startsWith('exact-local-project-docker-cleanup-timeout:')
    ? 'exact-local-project-docker-cleanup-timeout'
    : 'local-docker-inspection-failed'
  console.error(
    JSON.stringify({
      capability: 'ir-001-local-docker-cleanup',
      result: 'failed-safely',
      reason,
    }),
  )
  process.exitCode = 1
}
