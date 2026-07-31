import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FROZEN_TEST_INSTANT,
  createDeterministicClock,
} from '../fixtures/two-account-two-group.ts'

test('the IR-001 clock probe returns the documented fixed instant', () => {
  const clock = createDeterministicClock()

  assert.equal(clock.now().toISOString(), FROZEN_TEST_INSTANT)
  assert.equal(clock.now().getTime(), Date.parse(FROZEN_TEST_INSTANT))
})
