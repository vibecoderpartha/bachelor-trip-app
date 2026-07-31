const RESULT_KEYS = Object.freeze(['claims', 'resources', 'role'])

function isExpectedResultRecord(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).sort().join(',') === RESULT_KEYS.join(',') &&
    typeof value.role === 'string' &&
    typeof value.claims === 'string' &&
    typeof value.resources === 'string'
  )
}

/**
 * Parses the one-record protocol emitted by the RLS probe's COPY TO STDOUT
 * query.  The protocol deliberately permits only surrounding whitespace: a
 * status line, table decoration, or a second record is not probe evidence.
 */
export function parseRlsProbeResultContract(output) {
  if (typeof output !== 'string') {
    throw new Error('RLS probe result contract requires textual output')
  }

  const recordText = output.trim()
  if (!recordText || /[\r\n]/.test(recordText)) {
    throw new Error('RLS probe result contract requires exactly one record')
  }

  let record
  try {
    record = JSON.parse(recordText)
  } catch {
    throw new Error('RLS probe result contract requires JSON')
  }

  if (!isExpectedResultRecord(record)) {
    throw new Error('RLS probe result contract has an unexpected record shape')
  }

  return record
}
