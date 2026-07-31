import assert from 'node:assert/strict'
import test from 'node:test'

const FIXED_TEST_INSTANT = '2030-01-02T03:04:05.000Z'

function createDeterministicClock() {
  return {
    now: () => new Date(FIXED_TEST_INSTANT),
  }
}

test('the IR-001 clock probe returns the documented fixed instant', () => {
  const clock = createDeterministicClock()

  assert.equal(clock.now().toISOString(), FIXED_TEST_INSTANT)
  assert.equal(clock.now().getTime(), Date.parse(FIXED_TEST_INSTANT))
})
