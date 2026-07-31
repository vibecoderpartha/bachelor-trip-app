import { resolve } from 'node:path'

export const RETAINED_BROWSER_ARTIFACT_NAMES = Object.freeze([
  'controlled-failure.json',
  'controlled-failure.png',
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

  return screenshots.at(-1)
}
