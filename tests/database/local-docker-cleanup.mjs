export const LOCAL_PROJECT_ID = 'bachelor-trip-app-ir001'
export const LOCAL_PROJECT_NETWORK = `supabase_network_${LOCAL_PROJECT_ID}`
export const LOCAL_PROJECT_VOLUME = `supabase_db_${LOCAL_PROJECT_ID}`

const PROJECT_CONTAINER_NAME = new RegExp(
  `^supabase_[a-z0-9_]+_${LOCAL_PROJECT_ID}$`,
  'i',
)

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`refusing an invalid local Docker ${label} snapshot`)
  }
}

export function assertExactProjectDockerSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new Error('refusing an invalid local Docker cleanup snapshot')
  }

  const { containers, networks, volumes } = snapshot
  assertStringArray(containers, 'container')
  assertStringArray(networks, 'network')
  assertStringArray(volumes, 'volume')

  if (
    containers.some((name) => !PROJECT_CONTAINER_NAME.test(name)) ||
    networks.some((name) => name !== LOCAL_PROJECT_NETWORK) ||
    volumes.some((name) => name !== LOCAL_PROJECT_VOLUME)
  ) {
    throw new Error('refusing a non-exact IR-001 local Docker resource snapshot')
  }

  return {
    containers: [...containers].sort(),
    networks: [...networks].sort(),
    volumes: [...volumes].sort(),
  }
}

export function remainingProjectDockerResourceTypes(snapshot) {
  const exactSnapshot = assertExactProjectDockerSnapshot(snapshot)
  return [
    exactSnapshot.containers.length > 0 ? 'containers' : null,
    exactSnapshot.networks.length > 0 ? 'networks' : null,
    exactSnapshot.volumes.length > 0 ? 'volumes' : null,
  ].filter(Boolean)
}

function sleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

export function waitForExactProjectDockerCleanup(
  readSnapshot,
  {
    attempts = 11,
    intervalMilliseconds = 1_000,
    wait = sleep,
  } = {},
) {
  if (typeof readSnapshot !== 'function' || typeof wait !== 'function') {
    throw new Error('refusing an invalid local Docker cleanup poller')
  }
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error('refusing an invalid local Docker cleanup attempt count')
  }
  if (!Number.isInteger(intervalMilliseconds) || intervalMilliseconds < 0) {
    throw new Error('refusing an invalid local Docker cleanup interval')
  }

  let remainingTypes = []
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    remainingTypes = remainingProjectDockerResourceTypes(readSnapshot())
    if (remainingTypes.length === 0) {
      return {
        result: 'absent',
        attempts: attempt,
        waitedMilliseconds: (attempt - 1) * intervalMilliseconds,
      }
    }
    if (attempt < attempts) {
      wait(intervalMilliseconds)
    }
  }

  throw new Error(
    `exact-local-project-docker-cleanup-timeout:${remainingTypes.join(',')}`,
  )
}
