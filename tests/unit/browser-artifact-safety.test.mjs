import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertPathSafeEvidenceText,
  assertRetainedBrowserArtifactNames,
  findUnsafePathClasses,
  sanitizeEvidenceText,
  selectRawScreenshotForSafeRetention,
} from '../evidence/browser-artifact-safety.mjs'

const repositoryRoot = '/workspace/trip'

test('browser evidence normalizes POSIX, macOS, Windows, UNC, and temporary paths', () => {
  const cases = [
    '/home/example-user/project/file.ts',
    '/Users/example-user/project/file.ts',
    String.raw`C:\Users\example-user\project\file.ts`,
    String.raw`D:\work\project\file.ts`,
    String.raw`\\server\share\project\file.ts`,
    '/tmp/project/file.ts',
    '/workspace/trip/tests/browser/failure-injection.spec.ts',
  ]

  for (const value of cases) {
    const sanitized = sanitizeEvidenceText(`Failure at ${value}`, { repositoryRoot })
    assertPathSafeEvidenceText(sanitized, { repositoryRoot })
    assert.equal(sanitized.includes('example-user'), false)
    assert.equal(sanitized.includes('/workspace/trip'), false)
  }
})

test('browser evidence preserves repository-relative paths and ordinary failure metadata', () => {
  const value = 'controlled-missing-test-id tests/browser/failure-injection.spec.ts expected child exit 1'
  const sanitized = sanitizeEvidenceText(value, { repositoryRoot })

  assert.equal(sanitized, value)
  assertPathSafeEvidenceText(sanitized, { repositoryRoot })
})

test('browser evidence sanitization is deterministic and path classification is explicit', () => {
  const value = String.raw`Failure at C:\Users\example-user\project\file.ts`
  const first = sanitizeEvidenceText(value, { repositoryRoot })
  const second = sanitizeEvidenceText(value, { repositoryRoot })

  assert.equal(first, second)
  assert.deepEqual(
    findUnsafePathClasses(value, { repositoryRoot }),
    ['windows-drive'],
  )
})

test('browser retention allow-list rejects raw Playwright diagnostics', () => {
  assert.doesNotThrow(() => {
    assertRetainedBrowserArtifactNames([
      'controlled-failure.json',
      'controlled-failure.png',
    ])
  })
  assert.throws(
    () => assertRetainedBrowserArtifactNames([
      'controlled-failure.json',
      'controlled-failure.png',
      'error-context.md',
    ]),
    /allow-list/,
  )
})

test('browser failure retention selects a deterministic screenshot across CI retries', () => {
  assert.equal(
    selectRawScreenshotForSafeRetention([
      '/temporary/raw/failure-retry-0/screenshot.png',
      '/temporary/raw/failure-retry-1/screenshot.png',
      '/temporary/raw/failure-retry-0/error-context.md',
    ]),
    '/temporary/raw/failure-retry-1/screenshot.png',
  )
  assert.throws(
    () => selectRawScreenshotForSafeRetention(['/temporary/raw/error-context.md']),
    /screenshot artifact/,
  )
})
