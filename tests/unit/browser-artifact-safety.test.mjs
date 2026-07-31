import assert from 'node:assert/strict'
import test from 'node:test'

import {
  APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS,
  BROWSER_PRIVACY_TRANSFORMATION_STRATEGY,
  BROWSER_SCREENSHOT_CLASSIFICATION,
  assertBrowserFailureSummary,
  assertPathSafeEvidenceText,
  assertRetainedBrowserArtifactNames,
  assertSyntheticBrowserScreenshotText,
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
      '/temporary/staging/controlled-failure-source.png',
    ]),
    '/temporary/staging/controlled-failure-source.png',
  )
  assert.throws(
    () => selectRawScreenshotForSafeRetention(['/temporary/raw/error-context.md']),
    /screenshot artifact/,
  )
  assert.throws(
    () => selectRawScreenshotForSafeRetention([
      '/temporary/staging/controlled-failure-source.png',
      '/temporary/staging/unexpected-screenshot.png',
    ]),
    /ambiguous screenshot/,
  )
})

test('browser failure contract accepts screenshot-only evidence without raw error context', () => {
  const summary = {
    schemaVersion: 2,
    capability: 'ir-001-browser-failure-injection',
    result: 'expected-child-failure-observed',
    command: 'npx --no-install playwright test tests/browser/failure-injection.spec.ts',
    expectedChildExitCode: 1,
    actualChildExitCode: 1,
    failureClass: 'controlled-missing-test-id',
    browser: 'chromium',
    project: 'IR-001',
    correctionBoundary: 'F-IR001-VER-007-008',
    privacyTransformApplied: true,
    privacyTransformationStrategy: BROWSER_PRIVACY_TRANSFORMATION_STRATEGY,
    approvedPlaceholderSet: APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS,
    screenshotClassification: BROWSER_SCREENSHOT_CLASSIFICATION,
    artifactAllowList: 'passed',
    rawDiagnosticExclusion: 'confirmed',
    retainedArtifacts: [
      { id: 'controlled-failure-summary', path: 'artifacts/ir-001/browser/retained/controlled-failure.json' },
      { id: 'controlled-failure-screenshot', path: 'artifacts/ir-001/browser/retained/controlled-failure.png' },
    ],
  }

  assert.doesNotThrow(() => assertBrowserFailureSummary(summary))
  assert.throws(
    () => assertBrowserFailureSummary({ ...summary, rawDiagnosticExclusion: 'missing' }),
    /retained evidence contract/,
  )
})

test('browser screenshot privacy contract permits only approved synthetic visible text', () => {
  const visibleText = APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS.join('\n')
  assert.doesNotThrow(() => assertSyntheticBrowserScreenshotText(visibleText))
  assert.throws(
    () => assertSyntheticBrowserScreenshotText(`${visibleText}\nPartha`),
    /unclassified participant/,
  )
  assert.throws(
    () => assertSyntheticBrowserScreenshotText(`${visibleText}\nUnclassified description`),
    /approved synthetic/,
  )
})
