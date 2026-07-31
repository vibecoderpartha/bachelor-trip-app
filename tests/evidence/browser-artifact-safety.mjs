import { resolve } from 'node:path'

export const RETAINED_BROWSER_ARTIFACT_NAMES = Object.freeze([
  'controlled-failure.json',
  'controlled-failure.png',
])

export const BROWSER_PRIVACY_TRANSFORMATION_STRATEGY =
  'test-page-visible-text-replacement'
export const BROWSER_SCREENSHOT_CLASSIFICATION =
  'synthetic-redacted-browser-evidence'
export const APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS = Object.freeze([
  'Participant A',
  'Participant B',
  'Participant C',
  'Participant D',
  'Participant E',
  'Synthetic test content',
])

// These values are test-page inputs only. They must never enter retained evidence.
export const ORIGINAL_PARTICIPANT_LABELS = Object.freeze([
  'Partha',
  'Astitva',
  'Vaibhav',
  'Suryansh',
  'Bittu',
])

const FAILURE_SUMMARY_KEYS = Object.freeze([
  'schemaVersion',
  'capability',
  'result',
  'command',
  'expectedChildExitCode',
  'actualChildExitCode',
  'failureClass',
  'browser',
  'project',
  'correctionBoundary',
  'privacyTransformApplied',
  'privacyTransformationStrategy',
  'approvedPlaceholderSet',
  'screenshotClassification',
  'artifactAllowList',
  'rawDiagnosticExclusion',
  'retainedArtifacts',
])

const UNSAFE_PATH_PATTERNS = Object.freeze([
  ['file-url', /file:\/\/\/\S+/g],
  ['unc', /\\\\[^\s\\/]+[\\/][^\s]+/g],
  ['windows-drive', /\b[A-Za-z]:[\\/][^\s]+/g],
  ['posix-home', /\/home\/[^\s/]+(?:\/[^\s]+)*/g],
  ['macos-home', /\/Users\/[^\s/]+(?:\/[^\s]+)*/g],
  ['temporary-directory', /\/(?:tmp|private\/tmp|var\/folders)(?:\/[^\s]+)*/g],
])

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function repositoryRootVariants(repositoryRoot) {
  const absoluteRoot = resolve(repositoryRoot)
  return [...new Set([
    absoluteRoot,
    absoluteRoot.replaceAll('\\', '/'),
    absoluteRoot.replaceAll('/', '\\'),
  ])].filter(Boolean)
}

function replaceRepositoryRoots(value, repositoryRoot) {
  return repositoryRootVariants(repositoryRoot).reduce(
    (sanitized, root) => sanitized.replace(new RegExp(escapeRegularExpression(root), 'g'), '<repo-root>'),
    value,
  )
}

export function sanitizeEvidenceText(value, { repositoryRoot } = {}) {
  if (typeof value !== 'string') {
    throw new Error('evidence text must be a string')
  }

  let sanitized = repositoryRoot
    ? replaceRepositoryRoots(value, repositoryRoot)
    : value

  for (const [, pattern] of UNSAFE_PATH_PATTERNS) {
    sanitized = sanitized.replace(pattern, '<absolute-path>')
  }

  return sanitized
}

export function findUnsafePathClasses(value, { repositoryRoot } = {}) {
  if (typeof value !== 'string') {
    throw new Error('evidence text must be a string')
  }

  const classes = new Set()
  if (repositoryRoot && repositoryRootVariants(repositoryRoot).some((root) => value.includes(root))) {
    classes.add('repository-root')
  }

  for (const [pathClass, pattern] of UNSAFE_PATH_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(value)) {
      classes.add(pathClass)
    }
  }

  return [...classes].sort()
}

export function assertPathSafeEvidenceText(value, options = {}) {
  const unsafePathClasses = findUnsafePathClasses(value, options)
  if (unsafePathClasses.length > 0) {
    throw new Error(`refusing retained evidence with unsafe path classes: ${unsafePathClasses.join(',')}`)
  }
}

export function assertRetainedBrowserArtifactNames(names) {
  if (!Array.isArray(names)) {
    throw new Error('retained browser artifact names must be an array')
  }

  const actual = [...names].sort()
  const expected = [...RETAINED_BROWSER_ARTIFACT_NAMES].sort()
  if (
    actual.length !== expected.length ||
    actual.some((name, index) => name !== expected[index])
  ) {
    throw new Error('refusing browser artifacts outside the retained allow-list')
  }
}

export function selectRawScreenshotForSafeRetention(paths) {
  if (!Array.isArray(paths) || paths.some((path) => typeof path !== 'string')) {
    throw new Error('raw Playwright screenshot paths must be strings')
  }

  const screenshots = paths.filter((path) => path.endsWith('.png')).sort()
  if (screenshots.length === 0) {
    throw new Error('controlled browser failure did not retain a screenshot artifact')
  }

  if (screenshots.length !== 1) {
    throw new Error('controlled browser failure retained ambiguous screenshot artifacts')
  }

  return screenshots[0]
}

export function assertSyntheticBrowserScreenshotText(value) {
  if (typeof value !== 'string') {
    throw new Error('browser screenshot text must be a string')
  }

  assertPathSafeEvidenceText(value)
  if (ORIGINAL_PARTICIPANT_LABELS.some((label) => value.includes(label))) {
    throw new Error('browser screenshot text retains an unclassified participant label')
  }
  if (/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(value) || /https?:\/\//i.test(value)) {
    throw new Error('browser screenshot text retains unsafe contact or URL content')
  }

  const visibleLines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (
    visibleLines.length === 0 ||
    visibleLines.some((line) => !APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS.includes(line)) ||
    !APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS.every((label) => visibleLines.includes(label))
  ) {
    throw new Error('browser screenshot text is not the approved synthetic redaction set')
  }
}

export function assertBrowserFailureSummary(summary) {
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) {
    throw new Error('browser failure summary must be an object')
  }

  const actualKeys = Object.keys(summary).sort()
  const expectedKeys = [...FAILURE_SUMMARY_KEYS].sort()
  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new Error('browser failure summary has an unexpected shape')
  }

  if (
    summary.schemaVersion !== 2 ||
    summary.capability !== 'ir-001-browser-failure-injection' ||
    summary.result !== 'expected-child-failure-observed' ||
    summary.expectedChildExitCode !== 1 ||
    summary.actualChildExitCode !== 1 ||
    summary.failureClass !== 'controlled-missing-test-id' ||
    summary.browser !== 'chromium' ||
    summary.project !== 'IR-001' ||
    summary.correctionBoundary !== 'F-IR001-VER-007-008' ||
    summary.privacyTransformApplied !== true ||
    summary.privacyTransformationStrategy !== BROWSER_PRIVACY_TRANSFORMATION_STRATEGY ||
    summary.screenshotClassification !== BROWSER_SCREENSHOT_CLASSIFICATION ||
    summary.artifactAllowList !== 'passed' ||
    summary.rawDiagnosticExclusion !== 'confirmed'
  ) {
    throw new Error('browser failure summary does not satisfy the retained evidence contract')
  }

  if (
    !Array.isArray(summary.approvedPlaceholderSet) ||
    summary.approvedPlaceholderSet.join('|') !== APPROVED_BROWSER_SCREENSHOT_PLACEHOLDERS.join('|') ||
    !Array.isArray(summary.retainedArtifacts) ||
    summary.retainedArtifacts.length !== 2
  ) {
    throw new Error('browser failure summary has an invalid privacy or artifact declaration')
  }

  assertPathSafeEvidenceText(JSON.stringify(summary))
  if (ORIGINAL_PARTICIPANT_LABELS.some((label) => JSON.stringify(summary).includes(label))) {
    throw new Error('browser failure summary retains an unclassified participant label')
  }
}
