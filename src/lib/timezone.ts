// WITA (UTC+8) = IST (UTC+5:30) + 2h30m
const WITA_OFFSET_MS = (8 * 3600 - 5.5 * 3600) * 1000  // 2.5h in ms

export function toWITA(istDate: Date): Date {
  return new Date(istDate.getTime() + WITA_OFFSET_MS)
}

export function fmtIST(d: Date): string {
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

export function fmtWITA(d: Date): string {
  return d.toLocaleTimeString('en-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Makassar',
  })
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export function fmtDateShort(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export function getCountdown(targetIST: Date): CountdownParts {
  const totalMs = targetIST.getTime() - Date.now()
  if (totalMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }

  const days    = Math.floor(totalMs / 86400000)
  const hours   = Math.floor((totalMs % 86400000) / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)

  return { days, hours, minutes, seconds, totalMs }
}
