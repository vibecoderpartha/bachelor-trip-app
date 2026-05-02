import { useEffect, useState, type CSSProperties } from 'react'
import { USERS } from '../constants/users'
import { EVENT_TYPE_MAP } from '../constants/eventTypes'
import { type DBEvent, userSeesEvent } from '../hooks/useEvents'

type Phase = 'pre' | 'airborne' | 'in-bali' | 'live-event' | 'home'

interface Status { phase: Phase; label: string; sub?: string }

function statusForUser(events: DBEvent[], name: string, now: number): Status {
  const mine = events.filter(e => userSeesEvent(e, name))
  const live = mine.find(e => {
    const s = new Date(e.date_ist).getTime()
    const en = e.end_date_ist ? new Date(e.end_date_ist).getTime() : s
    return s <= now && now <= en
  })
  if (live) {
    if (live.type === 'flight') {
      return { phase: 'airborne', label: 'Airborne', sub: `${live.dep_code ?? '—'} → ${live.arr_code ?? '—'}` }
    }
    const meta = EVENT_TYPE_MAP[live.type] ?? EVENT_TYPE_MAP.other
    return { phase: 'live-event', label: meta.label, sub: live.title.split('·')[0].trim().slice(0, 22) }
  }
  const flights = mine.filter(e => e.type === 'flight').sort((a, b) => new Date(a.date_ist).getTime() - new Date(b.date_ist).getTime())
  const arrival = flights.find(f => (f.arr_code ?? '').toUpperCase() === 'DPS')
  const returnF = flights.find(f => (f.dep_code ?? '').toUpperCase() === 'DPS')
  const arrivalEnd = arrival ? new Date(arrival.end_date_ist ?? arrival.date_ist).getTime() : null
  const returnEnd = returnF ? new Date(returnF.end_date_ist ?? returnF.date_ist).getTime() : null

  if (returnEnd !== null && now > returnEnd) return { phase: 'home', label: 'Home', sub: 'trip wrapped' }
  if (arrivalEnd !== null && now > arrivalEnd) return { phase: 'in-bali', label: 'In Bali', sub: 'between events' }

  const next = flights.find(f => new Date(f.date_ist).getTime() > now)
  if (next) {
    const ms = new Date(next.date_ist).getTime() - now
    const days = Math.floor(ms / 86400000)
    const hours = Math.floor((ms % 86400000) / 3600000)
    return { phase: 'pre', label: 'Pre-trip', sub: days > 0 ? `T-${days}d ${hours}h` : `T-${hours}h` }
  }
  return { phase: 'pre', label: 'Pre-trip', sub: '—' }
}

interface Props {
  events: DBEvent[]
  currentUserName: string
}

export function CrewStatus({ events, currentUserName }: Props) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div data-testid="crew-status">
      <div className="flex items-center justify-between mb-3">
        <p
          className="serif-eyebrow"
          style={{ fontSize: 12, color: 'var(--text-secondary)' }}
        >
          the crew, right now
        </p>
        <span
          className="font-mono"
          style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.22em' }}
        >
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {USERS.map(u => {
          const s = statusForUser(events, u.name, now)
          const isMe = u.name === currentUserName
          const pulsing = s.phase === 'airborne' || s.phase === 'live-event'
          const tile: CSSProperties = {
            background: isMe ? 'rgba(245,241,235,0.05)' : 'var(--bg-card)',
            border: `1px solid ${isMe ? `${u.color}66` : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '8px 4px 7px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            position: 'relative',
            opacity: s.phase === 'home' ? 0.55 : 1,
          }
          return (
            <div key={u.name} style={tile} data-testid={`crew-chip-${u.name.toLowerCase()}`}>
              <span
                aria-hidden="true"
                className={pulsing ? 'animate-pulse-soft' : ''}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: u.color,
                  opacity: s.phase === 'home' ? 0.4 : 0.95,
                }}
              />
              <span style={{ fontSize: 18 }}>{u.emoji}</span>
              <span
                className="font-ui"
                style={{ fontSize: 9.5, color: 'var(--text-primary)', fontWeight: 500, letterSpacing: 0.2 }}
              >
                {s.label}
              </span>
              {s.sub && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: 8.5,
                    color: 'var(--text-tertiary)',
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {s.sub}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
