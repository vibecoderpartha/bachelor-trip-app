import { spawnSync } from 'node:child_process'
import {
  existsSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'

import {
  LOCAL_PROJECT_ID,
  LOCAL_PROJECT_NETWORK,
  LOCAL_PROJECT_VOLUME,
  remainingProjectDockerResourceTypes,
  waitForExactProjectDockerCleanup,
} from './local-docker-cleanup.mjs'

const REPOSITORY_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const LOCAL_DATABASE_PORT = '56322'
const STACK_WORKDIR = 'tests/database/local-stack'
const SETUP_SQL = 'tests/database/rls-probe-setup.sql'
const SAFE_RESULT_PATH = '/tmp/bachelor-trip-app-ir001-rls-result.json'
const FAILURE_INJECTION = process.env.IR001_RLS_PROBE_INJECT_FAILURE ?? 'none'
const GENERATED_BRANCH_STATE_DIRECTORY = fileURLToPath(
  new URL('./local-stack/supabase/.branches', import.meta.url),
)
const GENERATED_CLI_TEMP_DIRECTORY = fileURLToPath(
  new URL('./local-stack/supabase/.temp', import.meta.url),
)
const ASSERTION_CASE_IDS = new Set([
  'probe-schema-must-not-preexist',
  'same-scope-account-a',
  'same-scope-account-b',
  'cross-scope-account-a',
  'cross-scope-account-b',
  'inactive-relationship',
  'removed-relationship',
])

function commandVersionCategory(command, args, prefix) {
  const result = spawnSync(command, args, { cwd: REPOSITORY_ROOT, encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    return { available: false, version: 'unavailable' }
  }
  const match = `${result.stdout}\n${result.stderr}`.match(/\d+(?:\.\d+){0,2}/)
  return {
    available: true,
    version: match ? `${prefix}-${match[0].replaceAll('.', '-')}` : `${prefix}-available`,
  }
}

function inspectRequiredTools() {
  const docker = commandVersionCategory('docker', ['version', '--format', '{{.Server.Version}}'], 'docker')
  const supabaseCli = commandVersionCategory('npx', ['--no-install', 'supabase', '--version'], 'supabase-cli')
  const psql = commandVersionCategory('psql', ['--version'], 'postgresql-client')
  return {
    availability: {
      docker: docker.available,
      psql: psql.available,
      supabaseCli: supabaseCli.available,
    },
    versions: {
      docker: docker.version,
      psql: psql.version,
      supabaseCli: supabaseCli.version,
    },
  }
}

const requiredTools = inspectRequiredTools()
const RUNNER_CATEGORY = process.env.GITHUB_ACTIONS === 'true'
  ? 'github-actions-ubuntu-22'
  : 'local-isolated'
const TESTED_COMMIT_SHA = /^[a-f0-9]{40}$/i.test(process.env.IR001_TESTED_COMMIT_SHA ?? '')
  ? process.env.IR001_TESTED_COMMIT_SHA
  : 'unavailable'
const STARTUP_READINESS_ATTEMPTS = 31
const STARTUP_READINESS_INTERVAL_MILLISECONDS = 1_000

function sleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
    ...options,
  })

  if (result.error || result.status !== 0) {
    if (result.error?.code === 'ENOENT') {
      const category = command === 'psql'
        ? 'host-postgresql-client-unavailable'
        : command === 'docker'
          ? 'docker-client-unavailable'
          : command === 'npx'
            ? 'node-package-executor-unavailable'
            : 'command-unavailable'
      throw new Error(`${command}:${category}`)
    }
    const diagnostic = `${result.stdout}\n${result.stderr}`
    const safeReason = [
      ['docker-unavailable', /docker daemon|connect to the docker|docker api/i],
      ['local-port-conflict', /address already in use|port is already allocated/i],
      ['resource-exhausted', /out of memory|insufficient memory|no space left/i],
      ['image-download-failed', /failed to pull|pull access denied|download failed/i],
      ['configuration-invalid', /config\.toml|configuration/i],
      ['service-health-check-failed', /health check|unhealthy/i],
    ].find(([, pattern]) => pattern.test(diagnostic))?.[0] ?? 'redacted-command-failure'
    const safeService = [
      'auth',
      'db',
      'edge-runtime',
      'inbucket',
      'kong',
      'realtime',
      'rest',
      'storage',
      'studio',
      'vector',
    ].find((service) => new RegExp(`\\b${service}\\b`, 'i').test(diagnostic))

    throw new Error(
      safeService ? `${command}:${safeReason}:${safeService}` : `${command}:${safeReason}`,
    )
  }

  return result.stdout
}

function projectContainerNames() {
  return runCommand('docker', [
    'ps',
    '--all',
    '--format',
    '{{.Names}}',
  ])
    .trim()
    .split('\n')
    .filter(Boolean)
    .filter((name) => /^supabase_[a-z0-9_]+_bachelor-trip-app-ir001$/i.test(name))
}

function projectDockerResourceNames(resourceType) {
  const expectedName = resourceType === 'network'
    ? LOCAL_PROJECT_NETWORK
    : resourceType === 'volume'
      ? LOCAL_PROJECT_VOLUME
      : null
  if (!expectedName) {
    throw new Error('refusing an unrecognised local Docker resource type')
  }

  return runCommand('docker', [
    resourceType,
    'ls',
    '--format',
    '{{.Name}}',
  ])
    .trim()
    .split('\n')
    .filter(Boolean)
    .filter((name) => name === expectedName)
}

function projectDockerResourceSnapshot() {
  return {
    containers: projectContainerNames(),
    networks: projectDockerResourceNames('network'),
    volumes: projectDockerResourceNames('volume'),
  }
}

function assertNoProjectDockerResources() {
  const remainingResources = remainingProjectDockerResourceTypes(
    projectDockerResourceSnapshot(),
  )

  if (remainingResources.length > 0) {
    throw new Error('refusing to use or leave an existing local project Docker resource')
  }
}

function assertProjectContainersExist() {
  if (projectContainerNames().length === 0) {
    throw new Error('local project containers were not found after start')
  }
}

function safeProjectContainerStates() {
  const output = runCommand('docker', [
    'ps',
    '--all',
    '--format',
    '{{.Names}}|{{.State}}|{{.Status}}',
    '--filter',
    `name=${LOCAL_PROJECT_ID}`,
  ])

  return output
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name = '', state = '', status = ''] = line.split('|', 3)
      const service = [
        'auth',
        'db',
        'edge-runtime',
        'inbucket',
        'kong',
        'realtime',
        'rest',
        'storage',
        'studio',
        'vector',
      ].find((candidate) => name.toLowerCase().includes(candidate))

      return service ? `${service}:${state}:${/unhealthy/i.test(status) ? 'unhealthy' : 'other'}` : null
    })
    .filter(Boolean)
    .sort()
}

function cleanupGeneratedCliBranchState() {
  if (existsSync(GENERATED_BRANCH_STATE_DIRECTORY)) {
    const entries = readdirSync(GENERATED_BRANCH_STATE_DIRECTORY)
    if (entries.length !== 1 || entries[0] !== '_current_branch') {
      throw new Error('refusing to remove unexpected local CLI state')
    }

    unlinkSync(`${GENERATED_BRANCH_STATE_DIRECTORY}/_current_branch`)
    rmdirSync(GENERATED_BRANCH_STATE_DIRECTORY)
  }

  if (existsSync(GENERATED_CLI_TEMP_DIRECTORY)) {
    const tempEntries = readdirSync(GENERATED_CLI_TEMP_DIRECTORY)
    if (tempEntries.length !== 1 || tempEntries[0] !== 'cli-latest') {
      throw new Error('refusing to remove unexpected local CLI temporary state')
    }

    unlinkSync(`${GENERATED_CLI_TEMP_DIRECTORY}/cli-latest`)
    rmdirSync(GENERATED_CLI_TEMP_DIRECTORY)
  }
}

function readLocalDatabaseUrl() {
  const output = runCommand('npx', [
    '--no-install',
    'supabase',
    'status',
    '--workdir',
    STACK_WORKDIR,
    '--output',
    'env',
    '--override-name',
    'db.url=IR001_DATABASE_URL',
  ])
  const line = output
    .split('\n')
    .find((candidate) => candidate.startsWith('IR001_DATABASE_URL='))

  if (!line) {
    throw new Error('local database status did not provide the expected endpoint category')
  }

  const value = line.slice('IR001_DATABASE_URL='.length)
  return value.startsWith('"') ? JSON.parse(value) : value
}

function localPsqlOptions(databaseUrl) {
  const parsed = new URL(databaseUrl)

  if (
    !['postgres:', 'postgresql:'].includes(parsed.protocol) ||
    !['127.0.0.1', 'localhost'].includes(parsed.hostname) ||
    parsed.port !== LOCAL_DATABASE_PORT
  ) {
    throw new Error('refusing a database endpoint outside the documented local boundary')
  }

  return {
    args: [
      '--no-psqlrc',
      '--quiet',
      '--tuples-only',
      '--no-align',
      '--set',
      'ON_ERROR_STOP=1',
      '--host',
      parsed.hostname,
      '--port',
      parsed.port,
      '--username',
      decodeURIComponent(parsed.username),
      '--dbname',
      parsed.pathname.slice(1),
    ],
    env: {
      ...process.env,
      PGPASSWORD: decodeURIComponent(parsed.password),
    },
  }
}

function runPsql(databaseUrl, queryOrFile, isFile = false) {
  const options = localPsqlOptions(databaseUrl)
  const args = isFile
    ? [...options.args, '--file', queryOrFile]
    : [...options.args, '--command', queryOrFile]

  return runCommand('psql', args, { env: options.env }).trim()
}

function waitForReadyLocalDatabase() {
  let lastReason = 'redacted-command-failure'
  for (let attempt = 1; attempt <= STARTUP_READINESS_ATTEMPTS; attempt += 1) {
    try {
      const url = readLocalDatabaseUrl()
      runPsql(url, 'SELECT 1;')
      return url
    } catch (error) {
      lastReason = safeErrorCategory(error)
      if (attempt < STARTUP_READINESS_ATTEMPTS) {
        sleep(STARTUP_READINESS_INTERVAL_MILLISECONDS)
      }
    }
  }
  throw new Error(`local-database-readiness-timeout:${lastReason}`)
}

function sqlLiteral(value) {
  return `'${value.replaceAll("'", "''")}'`
}

function readAllowedResources(databaseUrl, claims) {
  const claimsLiteral = sqlLiteral(JSON.stringify(claims))
  const query = [
    'BEGIN;',
    'SET LOCAL ROLE authenticated;',
    `SET LOCAL request.jwt.claims = ${claimsLiteral};`,
    'WITH probe_context AS (',
    "  SELECT current_user = 'authenticated' AS authenticated_role,",
    `    (current_setting('request.jwt.claims', true)::jsonb ->> 'relationship_state') = ${sqlLiteral(claims.relationship_state)}`,
    `      AND (current_setting('request.jwt.claims', true)::jsonb ->> 'scope_id') = ${sqlLiteral(claims.scope_id)}`,
    `      AND (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = ${sqlLiteral(claims.sub)} AS expected_claims`,
    '), probe_resources AS (',
    "  SELECT coalesce(string_agg(resource_id, ',' ORDER BY resource_id), '') AS resource_ids",
    '  FROM ir001_probe.resources',
    ')',
    "SELECT concat(CASE WHEN authenticated_role THEN 'role-authenticated' ELSE 'role-mismatch' END,",
    "  '|', CASE WHEN expected_claims THEN 'claims-matched' ELSE 'claims-mismatch' END,",
    "  '|', resource_ids)",
    'FROM probe_context CROSS JOIN probe_resources;',
    'ROLLBACK;',
  ].join('\n')

  const fields = runPsql(databaseUrl, query).split('|')
  if (fields.length !== 3) {
    return {
      role: 'context-unavailable',
      claims: 'context-unavailable',
      resources: '',
    }
  }
  return { role: fields[0], claims: fields[1], resources: fields[2] }
}

function assertEqual(actual, expected, caseId) {
  if (actual !== expected) {
    throw new Error(`local probe assertion failed: ${caseId}`)
  }
}

function assertionResultCategory(actual) {
  if (actual === '') {
    return 'empty-result'
  }
  if (actual === 'probe-resource-a' || actual === 'probe-resource-b') {
    return 'unexpected-synthetic-resource'
  }
  return 'unexpected-result'
}

function assertProbeExpectation(actual, expected, caseId) {
  if (actual.role !== 'role-authenticated') {
    throw new Error(`local probe assertion failed: ${caseId}:${actual.role}`)
  }
  if (actual.claims !== 'claims-matched') {
    throw new Error(`local probe assertion failed: ${caseId}:${actual.claims}`)
  }
  if (actual.resources !== expected) {
    throw new Error(
      `local probe assertion failed: ${caseId}:${assertionResultCategory(actual.resources)}`,
    )
  }
}

function writeSafeResult(result) {
  writeFileSync(
    SAFE_RESULT_PATH,
    `${JSON.stringify({
      ...result,
      runner: RUNNER_CATEGORY,
      testedCommitSha: TESTED_COMMIT_SHA,
      toolAvailability: requiredTools.availability,
      toolVersions: requiredTools.versions,
      runMode:
        FAILURE_INJECTION === 'none'
          ? 'normal'
          : `injected-${FAILURE_INJECTION}`,
    })}\n`,
    'utf8',
  )
}

function injectControlledFailure(step) {
  if (FAILURE_INJECTION === 'none') {
    return
  }

  if (FAILURE_INJECTION !== step) {
    throw new Error('refusing an unrecognised controlled failure injection')
  }

  throw new Error(`controlled failure injected: ${step}`)
}

function safeErrorCategory(error) {
  if (!(error instanceof Error)) {
    return 'redacted-unexpected-failure'
  }

  if (error.message.startsWith('controlled failure injected: ')) {
    return 'controlled-failure-injected'
  }

  if (error.message.startsWith('local probe assertion failed: ')) {
    return 'assertion-failed'
  }

  if (/^(host-postgresql-client-unavailable|docker-client-unavailable|node-package-executor-unavailable)$/.test(error.message)) {
    return error.message
  }

  const [, category] = error.message.split(':', 2)
  if (category && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category)) {
    return category
  }

  if (
    error.message.startsWith('refusing ') ||
    error.message.startsWith('local database status did not')
  ) {
    return 'boundary-refusal'
  }

  return 'redacted-unexpected-failure'
}

function safeErrorDetail(error) {
  if (!(error instanceof Error)) {
    return null
  }

  if (error.message.startsWith('controlled failure injected: ')) {
    return 'after-probe-setup'
  }
  if (error.message.startsWith('local probe assertion failed: ')) {
    const [caseId, detail] = error.message
      .slice('local probe assertion failed: '.length)
      .split(':', 2)
    if (!ASSERTION_CASE_IDS.has(caseId)) {
      return 'assertion-case-redacted'
    }
    return [
      'role-mismatch',
      'claims-mismatch',
      'context-unavailable',
      'empty-result',
      'unexpected-synthetic-resource',
      'unexpected-result',
    ].includes(detail)
      ? detail
      : 'assertion-detail-redacted'
  }
  const [, , detail] = error.message.split(':', 3)
  return detail && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(detail)
    ? detail
    : null
}

let localStartAttempted = false
let probeSchemaCreated = false
let primaryFailure
let cleanupFailure
let primaryFailureStep = 'preflight'
let cleanupFailureStep = 'not-started'
let primaryFailureContainerStates = []
let databaseUrl

try {
  primaryFailureStep = 'tool-preflight'
  if (!requiredTools.availability.docker) {
    throw new Error('docker-client-unavailable')
  }
  if (!requiredTools.availability.supabaseCli) {
    throw new Error('node-package-executor-unavailable')
  }
  if (!requiredTools.availability.psql) {
    throw new Error('host-postgresql-client-unavailable')
  }
  primaryFailureStep = 'resource-preflight'
  assertNoProjectDockerResources()
  primaryFailureStep = 'stack-start'
  localStartAttempted = true
  runCommand('npx', [
    '--no-install',
    'supabase',
    'start',
    '--workdir',
    STACK_WORKDIR,
  ])
  assertProjectContainersExist()

  primaryFailureStep = 'endpoint-readiness'
  databaseUrl = waitForReadyLocalDatabase()
  primaryFailureStep = 'probe-schema-preflight'
  const probeSchemaExists = runPsql(
    databaseUrl,
    "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'ir001_probe');",
  )

  assertEqual(probeSchemaExists, 'f', 'probe-schema-must-not-preexist')
  primaryFailureStep = 'probe-schema-setup'
  runPsql(databaseUrl, SETUP_SQL, true)
  probeSchemaCreated = true

  primaryFailureStep = 'failure-injection-after-probe-setup'
  injectControlledFailure('after-probe-setup')

  primaryFailureStep = 'same-scope-account-a'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-a',
      scope_id: 'fixture-group-a',
      relationship_state: 'active',
    }),
    'probe-resource-a',
    'same-scope-account-a',
  )
  primaryFailureStep = 'same-scope-account-b'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-b',
      scope_id: 'fixture-group-b',
      relationship_state: 'active',
    }),
    'probe-resource-b',
    'same-scope-account-b',
  )
  primaryFailureStep = 'cross-scope-account-a'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-a',
      scope_id: 'fixture-group-b',
      relationship_state: 'active',
    }),
    '',
    'cross-scope-account-a',
  )
  primaryFailureStep = 'cross-scope-account-b'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-b',
      scope_id: 'fixture-group-a',
      relationship_state: 'active',
    }),
    '',
    'cross-scope-account-b',
  )
  primaryFailureStep = 'inactive-relationship'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-a',
      scope_id: 'fixture-group-a',
      relationship_state: 'inactive',
    }),
    '',
    'inactive-relationship',
  )
  primaryFailureStep = 'removed-relationship'
  assertProbeExpectation(
    readAllowedResources(databaseUrl, {
      sub: 'fixture-account-a',
      scope_id: 'fixture-group-a',
      relationship_state: 'removed',
    }),
    '',
    'removed-relationship',
  )
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    state: 'assertions-passed',
    projectId: LOCAL_PROJECT_ID,
    endpoint: `loopback:${LOCAL_DATABASE_PORT}`,
    cases: 6,
  })
} catch (error) {
  primaryFailure = error
  try {
    primaryFailureContainerStates = safeProjectContainerStates()
  } catch {
    primaryFailureContainerStates = ['diagnostic-unavailable']
  }
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    state: 'primary-failure',
    primaryFailureStep,
    primaryFailureContainerStates,
  })
}

try {
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    state: 'cleanup-started',
    primaryFailure: Boolean(primaryFailure),
    primaryFailureStep: primaryFailure ? primaryFailureStep : null,
    primaryFailureReason: primaryFailure ? safeErrorCategory(primaryFailure) : null,
    primaryFailureDetail: primaryFailure ? safeErrorDetail(primaryFailure) : null,
    primaryFailureContainerStates,
  })
  if (probeSchemaCreated) {
    cleanupFailureStep = 'probe-schema-drop'
    if (!databaseUrl) {
      throw new Error('local database endpoint was unavailable for probe cleanup')
    }

    runPsql(databaseUrl, 'DROP SCHEMA ir001_probe CASCADE;')
  }

  if (localStartAttempted) {
    cleanupFailureStep = 'stack-stop'
    runCommand('npx', [
      '--no-install',
      'supabase',
      'stop',
      '--workdir',
      STACK_WORKDIR,
      '--project-id',
      LOCAL_PROJECT_ID,
      '--no-backup',
    ])
    waitForExactProjectDockerCleanup(projectDockerResourceSnapshot)
  }

  if (localStartAttempted) {
    cleanupFailureStep = 'generated-cli-state-cleanup'
    cleanupGeneratedCliBranchState()
  }

  cleanupFailureStep = 'complete'
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    state: 'cleanup-passed',
    primaryFailure: Boolean(primaryFailure),
    primaryFailureStep: primaryFailure ? primaryFailureStep : null,
    primaryFailureReason: primaryFailure ? safeErrorCategory(primaryFailure) : null,
    primaryFailureDetail: primaryFailure ? safeErrorDetail(primaryFailure) : null,
    primaryFailureContainerStates,
  })
} catch (error) {
  cleanupFailure = error
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    state: 'cleanup-failure',
    cleanupFailureStep,
    cleanupFailureReason: safeErrorCategory(cleanupFailure),
    cleanupFailureDetail: safeErrorDetail(cleanupFailure),
  })
}

if (primaryFailure || cleanupFailure) {
  console.error(
    JSON.stringify({
      capability: 'ir-001-local-rls-probe',
      result: 'failed-safely',
      primaryFailure: Boolean(primaryFailure),
      primaryFailureStep: primaryFailure ? primaryFailureStep : null,
      primaryFailureReason: primaryFailure ? safeErrorCategory(primaryFailure) : null,
      primaryFailureDetail: primaryFailure ? safeErrorDetail(primaryFailure) : null,
      cleanupFailure: Boolean(cleanupFailure),
      cleanupFailureStep: cleanupFailure ? cleanupFailureStep : 'complete',
    }),
  )
  process.exitCode = 1
} else {
  writeSafeResult({
    capability: 'ir-001-local-rls-probe',
    result: 'passed',
    environment: 'local-docker',
    projectId: LOCAL_PROJECT_ID,
    endpoint: `loopback:${LOCAL_DATABASE_PORT}`,
    cases: 6,
    cleanup: 'confirmed',
  })
  process.stderr.write(
    `${JSON.stringify({
      capability: 'ir-001-local-rls-probe',
      result: 'passed',
      environment: 'local-docker',
      projectId: LOCAL_PROJECT_ID,
      endpoint: `loopback:${LOCAL_DATABASE_PORT}`,
      cases: 6,
      cleanup: 'confirmed',
    })}\n`,
  )
}
