import assert from 'node:assert/strict'
import test from 'node:test'

import { parseRlsProbeResultContract } from '../database/rls-probe-result-contract.mjs'

const expectedRecord = {
  role: 'role-authenticated',
  claims: 'claims-matched',
  resources: 'probe-resource-a',
}

test('RLS probe parses one COPY JSON record with surrounding line endings', () => {
  const output = `\r\n${JSON.stringify(expectedRecord)}\r\n`
  assert.deepEqual(parseRlsProbeResultContract(output), expectedRecord)
})

test('RLS probe rejects the hosted display-output condition instead of inferring a JSON line', () => {
  const displayOutput = [
    'BEGIN',
    'SET',
    JSON.stringify(expectedRecord),
    'ROLLBACK',
  ].join('\r\n')

  assert.throws(
    () => parseRlsProbeResultContract(displayOutput),
    /exactly one record/,
  )
})

test('RLS probe rejects malformed or multiple machine records', () => {
  assert.throws(
    () => parseRlsProbeResultContract('{}'),
    /unexpected record shape/,
  )
  assert.throws(
    () => parseRlsProbeResultContract(`${JSON.stringify(expectedRecord)}\n${JSON.stringify(expectedRecord)}`),
    /exactly one record/,
  )
})
