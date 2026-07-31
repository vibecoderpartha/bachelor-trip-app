import assert from 'node:assert/strict'
import test from 'node:test'

import {
  cleanupTwoAccountTwoGroupFixture,
  createTwoAccountTwoGroupFixture,
  resetTwoAccountTwoGroupFixture,
} from '../fixtures/two-account-two-group.ts'

test('the IR-001 fixture has separate synthetic accounts and Groups', () => {
  const fixture = createTwoAccountTwoGroupFixture()

  assert.deepEqual(
    fixture.accounts.map(({ id }) => id),
    ['fixture-account-a', 'fixture-account-b'],
  )
  assert.deepEqual(
    fixture.groups.map(({ id }) => id),
    ['fixture-group-a', 'fixture-group-b'],
  )
  assert.equal(new Set(fixture.accounts.map(({ id }) => id)).size, 2)
  assert.equal(new Set(fixture.groups.map(({ id }) => id)).size, 2)
  assert.deepEqual(
    fixture.activeMemberships.map(({ accountId, groupId }) => [accountId, groupId]),
    [
      ['fixture-account-a', 'fixture-group-a'],
      ['fixture-account-b', 'fixture-group-b'],
    ],
  )
})

test('the IR-001 fixture records expected same-Group and denial cases', () => {
  const fixture = createTwoAccountTwoGroupFixture()

  assert.deepEqual(
    fixture.accessExpectations.map(({ id, expected }) => [id, expected]),
    [
      ['same-group-account-a-group-a', 'allow'],
      ['same-group-account-b-group-b', 'allow'],
      ['cross-group-account-a-group-b', 'deny'],
      ['cross-group-account-b-group-a', 'deny'],
      ['inactive-account-a-group-a', 'deny'],
      ['removed-account-a-group-a', 'deny'],
    ],
  )
})

test('the IR-001 fixture reset and cleanup interfaces are deterministic', () => {
  assert.deepEqual(
    resetTwoAccountTwoGroupFixture(),
    createTwoAccountTwoGroupFixture(),
  )
  assert.deepEqual(cleanupTwoAccountTwoGroupFixture(), {
    scope: 'in-memory',
    affectedResources: 0,
    idempotent: true,
  })
})
