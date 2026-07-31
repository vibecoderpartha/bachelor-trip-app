import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertDatabaseArtifactNames,
  assertDatabaseEvidenceTextSafe,
  assertHostedNormalFailureDiagnostic,
  createHostedNormalFailureDiagnostic,
  createDatabaseEvidenceRecord,
  createDatabaseSequenceState,
  validateCompleteDatabaseEvidence,
} from '../evidence/database-evidence-contract.mjs'

const sequenceId = 'ir001-db-evidence-11111111-1111-4111-8111-111111111111'

function completeRecords() {
  return [
    createDatabaseEvidenceRecord('initial', sequenceId),
    createDatabaseEvidenceRecord('controlledFailure', sequenceId),
    createDatabaseEvidenceRecord('recovery', sequenceId),
  ]
}

function completedSequenceState() {
  return createDatabaseSequenceState(sequenceId, 'recovery-normal-complete')
}

test('database evidence accepts a complete normal, controlled-failure, recovery sequence', () => {
  assert.doesNotThrow(() => {
    validateCompleteDatabaseEvidence(completeRecords(), completedSequenceState())
  })
})

test('database evidence remains valid when recovery is the most recent result', () => {
  const records = completeRecords()
  const first = JSON.stringify(validateCompleteDatabaseEvidence(records, completedSequenceState()))
  const second = JSON.stringify(validateCompleteDatabaseEvidence(records, completedSequenceState()))

  assert.equal(first, second)
})

test('database evidence rejects missing, wrong-mode, and mixed-sequence phases', () => {
  const missingControlledFailure = completeRecords().filter(
    (record) => record.evidencePhase !== 'controlled-failure',
  )
  assert.throws(
    () => validateCompleteDatabaseEvidence(missingControlledFailure, completedSequenceState()),
    /incomplete/,
  )

  const wrongMode = completeRecords()
  wrongMode[2] = { ...wrongMode[2], runMode: 'injected-after-probe-setup' }
  assert.throws(
    () => validateCompleteDatabaseEvidence(wrongMode, completedSequenceState()),
    /run mode/,
  )

  const mixedSequence = completeRecords()
  mixedSequence[2] = createDatabaseEvidenceRecord(
    'recovery',
    'ir001-db-evidence-22222222-2222-4222-8222-222222222222',
  )
  assert.throws(
    () => validateCompleteDatabaseEvidence(mixedSequence, completedSequenceState()),
    /identities do not match/,
  )
})

test('database evidence rejects stale sequence state and unsafe content', () => {
  const staleState = createDatabaseSequenceState(sequenceId, 'controlled-failure-complete')
  assert.throws(
    () => validateCompleteDatabaseEvidence(completeRecords(), staleState),
    /sequence state/,
  )
  assert.throws(
    () => assertDatabaseEvidenceTextSafe('/home/example-user/project/result.json'),
    /unsafe path classes/,
  )
  assert.throws(
    () => assertDatabaseEvidenceTextSafe('postgresql://user:password@127.0.0.1:56322/db'),
    /secret-like/,
  )
  assert.throws(
    () => assertDatabaseEvidenceTextSafe('token=eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.signature'),
    /secret-like/,
  )
})

test('database retention allow-list rejects unexpected artifact files', () => {
  assert.doesNotThrow(() => {
    assertDatabaseArtifactNames([
      'normal-result.json',
      'controlled-failure-result.json',
      'recovery-result.json',
    ])
  })
  assert.throws(
    () => assertDatabaseArtifactNames([
      'normal-result.json',
      'controlled-failure-result.json',
      'recovery-result.json',
      'raw-output.log',
    ]),
    /allow-list/,
  )
})

test('hosted first-normal failure diagnostics retain only safe tool and failure categories', () => {
  const diagnostic = createHostedNormalFailureDiagnostic({
    capability: 'ir-001-local-rls-probe',
    state: 'cleanup-passed',
    primaryFailureStep: 'tool-preflight',
    primaryFailureReason: 'host-postgresql-client-unavailable',
    primaryFailureDetail: null,
    primaryFailureContainerStates: ['diagnostic-unavailable'],
    runner: 'github-actions-ubuntu-22',
    testedCommitSha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    toolAvailability: { docker: true, psql: false, supabaseCli: true },
    toolVersions: {
      docker: 'docker-29-6-2',
      psql: 'unavailable',
      supabaseCli: 'supabase-cli-2-105-0',
    },
  })

  assert.equal(diagnostic.runPhase, 'initial-normal')
  assert.equal(diagnostic.cleanup, 'confirmed')
  assert.doesNotThrow(() => assertHostedNormalFailureDiagnostic(diagnostic))
  assert.throws(
    () => assertHostedNormalFailureDiagnostic({
      ...diagnostic,
      primaryFailureDetailCategory: '/home/example-user/project/result.json',
    }),
    /unsafe/,
  )
  assert.throws(
    () => assertDatabaseArtifactNames([
      'normal-result.json',
      'controlled-failure-result.json',
      'recovery-result.json',
      'hosted-normal-failure.json',
    ]),
    /allow-list/,
  )
  const pathRedacted = createHostedNormalFailureDiagnostic({
    ...diagnostic,
    primaryFailureReason: '/home/example-user/private-failure',
  })
  assert.equal(pathRedacted.primaryFailureCategory, 'safe-result-unavailable')
})
