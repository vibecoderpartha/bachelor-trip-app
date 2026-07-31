import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LOCAL_PROJECT_NETWORK,
  LOCAL_PROJECT_VOLUME,
  assertExactProjectDockerSnapshot,
  remainingProjectDockerResourceTypes,
  waitForExactProjectDockerCleanup,
} from '../database/local-docker-cleanup.mjs'

const dbContainer = 'supabase_db_bachelor-trip-app-ir001'

test('database cleanup state accepts only exact IR-001 resource identities', () => {
  assert.deepEqual(
    assertExactProjectDockerSnapshot({
      containers: [dbContainer],
      networks: [LOCAL_PROJECT_NETWORK],
      volumes: [LOCAL_PROJECT_VOLUME],
    }),
    {
      containers: [dbContainer],
      networks: [LOCAL_PROJECT_NETWORK],
      volumes: [LOCAL_PROJECT_VOLUME],
    },
  )
  assert.throws(
    () => assertExactProjectDockerSnapshot({
      containers: ['unrelated-container'],
      networks: [],
      volumes: [],
    }),
    /non-exact/,
  )
})

test('database cleanup state reports only safe resource categories', () => {
  assert.deepEqual(
    remainingProjectDockerResourceTypes({
      containers: [dbContainer],
      networks: [],
      volumes: [LOCAL_PROJECT_VOLUME],
    }),
    ['containers', 'volumes'],
  )
  assert.deepEqual(
    remainingProjectDockerResourceTypes({ containers: [], networks: [], volumes: [] }),
    [],
  )
})

test('database cleanup polling waits for exact project resources to disappear', () => {
  const snapshots = [
    { containers: [dbContainer], networks: [LOCAL_PROJECT_NETWORK], volumes: [] },
    { containers: [], networks: [], volumes: [LOCAL_PROJECT_VOLUME] },
    { containers: [], networks: [], volumes: [] },
  ]
  const waits = []
  const result = waitForExactProjectDockerCleanup(
    () => snapshots.shift(),
    { attempts: 3, intervalMilliseconds: 25, wait: (milliseconds) => waits.push(milliseconds) },
  )

  assert.deepEqual(result, { result: 'absent', attempts: 3, waitedMilliseconds: 50 })
  assert.deepEqual(waits, [25, 25])
})

test('database cleanup polling fails after the bounded timeout without resource names', () => {
  assert.throws(
    () => waitForExactProjectDockerCleanup(
      () => ({ containers: [], networks: [], volumes: [LOCAL_PROJECT_VOLUME] }),
      { attempts: 2, intervalMilliseconds: 1, wait: () => {} },
    ),
    /exact-local-project-docker-cleanup-timeout:volumes/,
  )
})
