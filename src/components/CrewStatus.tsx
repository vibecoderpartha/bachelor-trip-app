import { useEffect, useState, type CSSProperties } from 'react'
import { USERS } from '../constants/users'
import { EVENT_TYPE_MAP } from '../constants/eventTypes'
import { type DBEvent, userSeesEvent } from '../hooks/useEvents'

type Phase = 'pre' | 'airborne' | 'in-bali' | 'live-event' | 'home'

interface Status {
  phase: Phase
  icon: string
  label: string
  sub?: string
}

function statusForUser(events: DBEvent[], name: string, now: number): Status {
  const mine = events.filter(e => userSeesEvent(e, name))

  // Currently in a LIVE event
  const live = mine.find(e => {
    const s = new Date(e.date_ist).getTime()
    const en = e.end_date_ist ? new Date(e.end_date_ist).getTime() : s
    return s <= now && now <= en
  })

  if (live) {
    if (live.type === 'flight') {
      return {
        phase: 'airborne',
        icon: '✈',
        label: 'AIRBORNE',
        sub: `${live.dep_code ?? '---'} → ${live.arr_code ?? '---'}`,
      }
    }
    const meta = EVENT_TYPE_MAP[live.type] ?? EVENT_TYPE_MAP.other
    return {
      phase: 'live-event',
      icon: meta.icon,
      label: meta.label.toUpperCase(),
      sub: live.title.split('·')[0].trim().slice(0, 18),
    }
  }

  // Find arrival & return flights for this user
  const flights = mine
    .filter(e => e.type === 'flight')
    .sort((a, b) => new Date(a.date_ist).getTime() - new Date(b.date_ist).getTime())

  const arrival = flights.find(f => (f.arr_code ?? '').toUpperCase() === 'DPS')
  const returnF = flights.find(f => (f.dep_code ?? '').toUpperCase() === 'DPS')

  const arrivalEnd = arrival?.end_date_ist
    ? new Date(arrival.end_date_ist).getTime()
    : arrival
    ? new Date(arrival.date_ist).getTime()
    : null
  const returnEnd = returnF?.end_date_ist
    ? new Date(returnF.end_date_ist).getTime()
    : returnF
    ? new Date(returnF.date_ist).getTime()
    : null

  if (returnEnd !== null && now > returnEnd) {
    return { phase: 'home', icon: '🏠', label: 'HOME', sub: 'trip wrapped' }
  }

  if (arrivalEnd !== null && now > arrivalEnd) {
    return { phase: 'in-bali', icon: '🌴', label: 'IN BALI', sub: 'off-schedule' }
  }

  // Pre-trip: next flight distance
  const nextFlight = flights.find(f => new Date(f.date_ist).getTime() > now)
  if (nextFlight) {
    const ms = new Date(nextFlight.date_ist).getTime() - now
    const days = Math.floor(ms / 86400000)
    const hours = Math.floor((ms % 86400000) / 3600000)
    const sub = days > 0 ? `T-${days}d ${hours}h` : `T-${hours}h`
    return { phase: 'pre', icon: '🛫', label: 'PRE-TRIP', sub }
  }

  return { phase: 'pre', icon: '🛫', label: 'PRE-TRIP', sub: '—' }
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
    <div
      className="neon-card px-2 py-2 mb-4"
      style={{
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}
      data-testid="crew-status"
    >
      <div className="flex items-center justify-between px-1 mb-2">
        <p
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: 4, color: '#555' }}
        >
          ◆ THE CREW · RIGHT NOW
        </p>
        <span
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: 2, color: '#333' }}
        >
          LIVE
        </span>
      </div>

      <div
        className="flex gap-1.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {USERS.map(u => {
          const s = statusForUser(events, u.name, now)
          const isMe = u.name === currentUserName
          const chipStyle: CSSProperties = {
            flex: '1 0 auto',
            minWidth: 0,
            borderRadius: 6,
            padding: '6px 8px',
            background: isMe ? `${u.color}12` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isMe ? `${u.color}66` : `${u.color}22`}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            transition: 'all 0.3s',
          }
          const pulsing = s.phase === 'airborne' || s.phase === 'live-event'
          const dotStyle: CSSProperties = {
            position: 'absolute',
            top: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: u.color,
            boxShadow: `0 0 6px ${u.color}`,
            animation: pulsing ? 'neonPulse 1.4s ease-in-out infinite' : undefined,
            opacity: s.phase === 'home' ? 0.3 : 1,
          }
          return (
            <div
              key={u.name}
              style={chipStyle}
              data-testid={`crew-chip-${u.name.toLowerCase()}`}
              title={`${u.name} · ${s.label}${s.sub ? ` · ${s.sub}` : ''}`}
            >
              <span style={dotStyle} aria-hidden="true" />
              <span style={{ fontSize: 18, lineHeight: 1 }}>{u.emoji}</span>
              <span
                className="font-mono"
                style={{
                  fontSize: 8,
                  color: u.color,
                  letterSpacing: 1,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {s.icon} {s.label}
              </span>
              {s.sub && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: 8,
                    color: '#666',
                    letterSpacing: 1,
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
