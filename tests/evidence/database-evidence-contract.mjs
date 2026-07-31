import { randomUUID } from 'node:crypto'

import {
  assertPathSafeEvidenceText,
} from './browser-artifact-safety.mjs'

export const DATABASE_EVIDENCE_SCHEMA_VERSION = 1
export const DATABASE_CAPABILITY = 'ir-001-local-rls-probe'
export const DATABASE_ARTIFACT_NAMES = Object.freeze([
  'normal-result.json',
  'controlled-failure-result.json',
  'recovery-result.json',
])

const PHASES = Object.freeze({
  initial: {
    artifactName: 'normal-result.json',
    evidencePhase: 'initial-normal',
    runMode: 'normal',
    expectedProcessResult: 'exit-0',
    observedProcessResult: 'exit-0',
    expectedTestOutcome: 'same-scope-allow-and-required-denials',
    observedTestOutcome: 'passed',
    caseCounts: {
      total: 6,
      sameScopeAllow: 2,
      crossScopeDeny: 2,
      inactiveDeny: 1,
      removedDeny: 1,
    },
  },
  controlledFailure: {
    artifactName: 'controlled-failure-result.json',
    evidencePhase: 'controlled-failure',
    runMode: 'injected-after-probe-setup',
    expectedProcessResult: 'child-exit-1',
    observedProcessResult: 'child-exit-1',
    expectedTestOutcome: 'controlled-failure-and-exact-cleanup',
    observedTestOutcome: 'expected-controlled-failure-observed',
    caseCounts: {
      total: 0,
      sameScopeAllow: 0,
      crossScopeDeny: 0,
      inactiveDeny: 0,
      removedDeny: 0,
    },
  },
  recovery: {
    artifactName: 'recovery-result.json',
    evidencePhase: 'recovery-normal',
    runMode: 'normal',
    expectedProcessResult: 'exit-0',
    observedProcessResult: 'exit-0',
    expectedTestOutcome: 'same-scope-allow-and-required-denials',
    observedTestOutcome: 'passed',
    caseCounts: {
      total: 6,
      sameScopeAllow: 2,
      crossScopeDeny: 2,
      inactiveDeny: 1,
      removedDeny: 1,
    },
  },
})

const PHASE_KEYS = Object.freeze(Object.keys(PHASES))
const RECORD_KEYS = Object.freeze([
  'schemaVersion',
  'capability',
  'evidencePhase',
  'sequenceId',
  'runMode',
  'expectedProcessResult',
  'observedProcessResult',
  'expectedTestOutcome',
  'observedTestOutcome',
  'caseCounts',
  'cleanup',
  'environment',
  'projectId',
  'endpoint',
  'fixture',
])
const CASE_COUNT_KEYS = Object.freeze([
  'total',
  'sameScopeAllow',
  'crossScopeDeny',
  'inactiveDeny',
  'removedDeny',
])
const SEQUENCE_STATE_KEYS = Object.freeze([
  'schemaVersion',
  'capability',
  'sequenceId',
  'state',
])
const SEQUENCE_STATES = Object.freeze([
  'initial-normal-complete',
  'controlled-failure-complete',
  'recovery-normal-complete',
])
const UNSAFE_SECRET_PATTERNS = Object.freeze([
  /(?:postgres(?:ql)?:\/\/|mysql:\/\/|mongodb:\/\/)/i,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\b/,
  /(?:password|token|secret|api[_-]?key|service[_-]?role)\s*[=:]/i,
])

function assertExactKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`refusing a malformed ${label}`)
  }

  const actual = Object.keys(value).sort()
  const expected = [...keys].sort()
  if (
    actual.length !== expected.length ||
    actual.some((key, index) => key !== expected[index])
  ) {
    throw new Error(`refusing an unexpected ${label} shape`)
  }
}

function assertEqual(value, expected, label) {
  if (value !== expected) {
    throw new Error(`refusing an unexpected database evidence ${label}`)
  }
}

function phaseForArtifactName(name) {
  return PHASE_KEYS.find((key) => PHASES[key].artifactName === name) ?? null
}

function phaseForEvidencePhase(evidencePhase) {
  return PHASE_KEYS.find((key) => PHASES[key].evidencePhase === evidencePhase) ?? null
}

function assertCaseCounts(actual, expected) {
  assertExactKeys(actual, CASE_COUNT_KEYS, 'database evidence case counts')
  for (const key of CASE_COUNT_KEYS) {
    assertEqual(actual[key], expected[key], `case count ${key}`)
  }
}

export function createDatabaseEvidenceSequenceId() {
  return `ir001-db-evidence-${randomUUID()}`
}

export function isDatabaseEvidenceSequenceId(value) {
  return typeof value === 'string' && /^ir001-db-evidence-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function databaseArtifactName(phase) {
  if (!PHASES[phase]) {
    throw new Error('refusing an unrecognised database evidence phase')
  }

  return PHASES[phase].artifactName
}

export function createDatabaseEvidenceRecord(phase, sequenceId) {
  const definition = PHASES[phase]
  if (!definition || !isDatabaseEvidenceSequenceId(sequenceId)) {
    throw new Error('refusing an unsafe database evidence identity')
  }

  const record = {
    schemaVersion: DATABASE_EVIDENCE_SCHEMA_VERSION,
    capability: DATABASE_CAPABILITY,
    evidencePhase: definition.evidencePhase,
    sequenceId,
    runMode: definition.runMode,
    expectedProcessResult: definition.expectedProcessResult,
    observedProcessResult: definition.observedProcessResult,
    expectedTestOutcome: definition.expectedTestOutcome,
    observedTestOutcome: definition.observedTestOutcome,
    caseCounts: definition.caseCounts,
    cleanup: 'confirmed',
    environment: 'local-docker',
    projectId: 'bachelor-trip-app-ir001',
    endpoint: 'loopback:56322',
    fixture: 'two-account-two-group-v1',
  }

  assertDatabaseEvidenceRecord(record, phase)
  return record
}

export function createDatabaseSequenceState(sequenceId, state) {
  if (!isDatabaseEvidenceSequenceId(sequenceId) || !SEQUENCE_STATES.includes(state)) {
    throw new Error('refusing an unsafe database evidence sequence state')
  }

  return {
    schemaVersion: DATABASE_EVIDENCE_SCHEMA_VERSION,
    capability: 'ir-001-database-evidence-sequence',
    sequenceId,
    state,
  }
}

export function assertDatabaseEvidenceTextSafe(value, options = {}) {
  if (typeof value !== 'string') {
    throw new Error('database evidence text must be a string')
  }

  assertPathSafeEvidenceText(value, options)
  if (UNSAFE_SECRET_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new Error('refusing database evidence with unsafe secret-like content')
  }
}

export function assertDatabaseArtifactNames(names, { complete = true } = {}) {
  if (!Array.isArray(names)) {
    throw new Error('database artifact names must be an array')
  }

  const actual = [...names].sort()
  const expected = complete
    ? [...DATABASE_ARTIFACT_NAMES].sort()
    : actual
  if (
    (complete && actual.length !== expected.length) ||
    actual.some((name) => !DATABASE_ARTIFACT_NAMES.includes(name)) ||
    (complete && actual.some((name, index) => name !== expected[index]))
  ) {
    throw new Error('refusing database artifacts outside the retained allow-list')
  }
}

export function assertDatabaseEvidenceRecord(record, expectedPhase) {
  const phase = phaseForEvidencePhase(record?.evidencePhase)
  if (!phase || (expectedPhase && phase !== expectedPhase)) {
    throw new Error('refusing an unexpected database evidence phase')
  }

  const definition = PHASES[phase]
  assertExactKeys(record, RECORD_KEYS, 'database evidence record')
  assertEqual(record.schemaVersion, DATABASE_EVIDENCE_SCHEMA_VERSION, 'schema version')
  assertEqual(record.capability, DATABASE_CAPABILITY, 'capability')
  if (!isDatabaseEvidenceSequenceId(record.sequenceId)) {
    throw new Error('refusing an unsafe database evidence sequence identity')
  }
  assertEqual(record.runMode, definition.runMode, 'run mode')
  assertEqual(record.expectedProcessResult, definition.expectedProcessResult, 'expected process result')
  assertEqual(record.observedProcessResult, definition.observedProcessResult, 'observed process result')
  assertEqual(record.expectedTestOutcome, definition.expectedTestOutcome, 'expected test outcome')
  assertEqual(record.observedTestOutcome, definition.observedTestOutcome, 'observed test outcome')
  assertCaseCounts(record.caseCounts, definition.caseCounts)
  assertEqual(record.cleanup, 'confirmed', 'cleanup status')
  assertEqual(record.environment, 'local-docker', 'environment')
  assertEqual(record.projectId, 'bachelor-trip-app-ir001', 'project identifier')
  assertEqual(record.endpoint, 'loopback:56322', 'loopback endpoint')
  assertEqual(record.fixture, 'two-account-two-group-v1', 'fixture identity')
  assertDatabaseEvidenceTextSafe(JSON.stringify(record), optionsForRecord())
  return phase
}

function optionsForRecord() {
  return {}
}

export function assertDatabaseSequenceState(state, expectedState, sequenceId) {
  assertExactKeys(state, SEQUENCE_STATE_KEYS, 'database evidence sequence state')
  assertEqual(state.schemaVersion, DATABASE_EVIDENCE_SCHEMA_VERSION, 'sequence state schema version')
  assertEqual(state.capability, 'ir-001-database-evidence-sequence', 'sequence state capability')
  if (!isDatabaseEvidenceSequenceId(state.sequenceId)) {
    throw new Error('refusing an unsafe database evidence sequence state identity')
  }
  if (!SEQUENCE_STATES.includes(state.state)) {
    throw new Error('refusing an unexpected database evidence sequence state')
  }
  if (expectedState) {
    assertEqual(state.state, expectedState, 'sequence state')
  }
  if (sequenceId) {
    assertEqual(state.sequenceId, sequenceId, 'sequence state identity')
  }
  assertDatabaseEvidenceTextSafe(JSON.stringify(state))
}

export function assertRawNormalProbeResult(result) {
  if (
    !result ||
    result.capability !== DATABASE_CAPABILITY ||
    result.result !== 'passed' ||
    result.runMode !== 'normal' ||
    result.environment !== 'local-docker' ||
    result.projectId !== 'bachelor-trip-app-ir001' ||
    result.endpoint !== 'loopback:56322' ||
    result.cases !== 6 ||
    result.cleanup !== 'confirmed'
  ) {
    throw new Error('normal database capability did not satisfy the safe evidence contract')
  }
}

export function assertRawControlledFailureResult(result) {
  if (
    !result ||
    result.capability !== DATABASE_CAPABILITY ||
    result.state !== 'cleanup-passed' ||
    result.runMode !== 'injected-after-probe-setup' ||
    result.primaryFailure !== true ||
    result.primaryFailureStep !== 'failure-injection-after-probe-setup' ||
    result.primaryFailureReason !== 'controlled-failure-injected'
  ) {
    throw new Error('controlled database failure did not satisfy the safe cleanup contract')
  }
}

export function validateCompleteDatabaseEvidence(records, sequenceState) {
  if (!Array.isArray(records) || records.length !== PHASE_KEYS.length) {
    throw new Error('database evidence sequence is incomplete')
  }

  const phases = records.map((record) => assertDatabaseEvidenceRecord(record))
  const expectedPhases = [...PHASE_KEYS].sort()
  if (phases.sort().some((phase, index) => phase !== expectedPhases[index])) {
    throw new Error('database evidence sequence has duplicate or missing phases')
  }

  const [sequenceId] = records.map((record) => record.sequenceId)
  if (records.some((record) => record.sequenceId !== sequenceId)) {
    throw new Error('database evidence sequence identities do not match')
  }

  assertDatabaseSequenceState(sequenceState, 'recovery-normal-complete', sequenceId)
  return records
    .slice()
    .sort((left, right) => PHASE_KEYS.indexOf(phaseForEvidencePhase(left.evidencePhase)) - PHASE_KEYS.indexOf(phaseForEvidencePhase(right.evidencePhase)))
}

export function artifactPhaseFromName(name) {
  return phaseForArtifactName(name)
}
