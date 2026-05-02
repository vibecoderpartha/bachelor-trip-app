import { useEffect, useState, type CSSProperties } from 'react'
import { type DBEvent } from '../hooks/useEvents'
import { fmtIST, fmtWITA, getCountdown, type CountdownParts } from '../lib/timezone'
import { VIPBadge } from './ui/VIPBadge'

interface Props {
  event: DBEvent | null
  userColor: string
}

const CIRCUMFERENCE = 2 * Math.PI * 78
const ONE_DAY_MS = 86400000

function pad(n: number): string { return n.toString().padStart(2, '0') }

export function CountdownClock({ event, userColor }: Props) {
  const [c, setC] = useState<CountdownParts>(() =>
    event ? getCountdown(new Date(event.date_ist)) : { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 },
  )

  useEffect(() => {
    if (!event) return
    const target = new Date(event.date_ist)
    setC(getCountdown(target))
    const id = window.setInterval(() => setC(getCountdown(target)), 1000)
    return () => window.clearInterval(id)
  }, [event])

  const wrap: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 22,
  }

  if (!event) {
    return (
      <div style={wrap} className="text-center" data-testid="countdown-no-flight">
        <VIPBadge color="var(--text-tertiary)">No flight scheduled</VIPBadge>
        <p
          className="font-ui mt-3"
          style={{ fontSize: 13, color: 'var(--text-tertiary)' }}
        >
          The wheels have landed. Enjoy Bali.
        </p>
      </div>
    )
  }

  const dep = new Date(event.date_ist)
  const departed = event.type === 'flight' && c.totalMs <= 0

  if (departed) {
    return (
      <div style={wrap} className="text-center" data-testid="countdown-departed">
        <VIPBadge color={userColor}>Departed</VIPBadge>
        <p
          className="serif-display mt-3"
          style={{ fontSize: 28, color: 'var(--text-primary)', fontWeight: 400 }}
        >
          {event.dep_code ?? '—'} → {event.arr_code ?? '—'}
        </p>
        <p className="font-mono mt-2" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {fmtIST(dep)} IST · {fmtWITA(dep)} WITA
        </p>
      </div>
    )
  }

  const fraction = Math.min(1, Math.max(0, (ONE_DAY_MS - c.totalMs) / ONE_DAY_MS))
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  return (
    <div style={wrap} className="animate-slide-up" data-testid="countdown-clock">
      <div className="flex items-center justify-between mb-4">
        <p
          className="serif-eyebrow"
          style={{ fontSize: 12, color: 'var(--accent)' }}
        >
          countdown to liftoff
        </p>
        <VIPBadge color={userColor}>{event.flight_no ?? 'Flight'}</VIPBadge>
      </div>

      <div className="flex items-baseline justify-center gap-3 mb-5">
        <span
          className="serif-display"
          style={{ fontSize: 32, color: 'var(--text-primary)', fontWeight: 400 }}
        >
          {event.dep_code ?? '—'}
        </span>
        <span style={{ color: 'var(--text-quaternary)', fontSize: 14 }}>—</span>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>✈</span>
        <span style={{ color: 'var(--text-quaternary)', fontSize: 14 }}>—</span>
        <span
          className="serif-display"
          style={{ fontSize: 32, color: 'var(--text-primary)', fontWeight: 400 }}
        >
          {event.arr_code ?? '—'}
        </span>
      </div>

      <div className="flex justify-center mb-5">
        <svg width={180} height={180} viewBox="0 0 180 180">
          <circle cx={90} cy={90} r={78} fill="none" stroke="var(--border)" strokeWidth={3} />
          <circle
            cx={90}
            cy={90}
            r={78}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <text
            x={90}
            y={68}
            textAnchor="middle"
            fill="var(--text-tertiary)"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em' }}
          >
            {c.days} DAYS
          </text>
          <text
            x={90}
            y={106}
            textAnchor="middle"
            fill="var(--text-primary)"
            style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 300, letterSpacing: '-0.04em' }}
          >
            {pad(c.hours)}:{pad(c.minutes)}
          </text>
          <text
            x={90}
            y={128}
            textAnchor="middle"
            fill="var(--text-tertiary)"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
          >
            :{pad(c.seconds)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            textAlign: 'center',
          }}
        >
          <p className="serif-display" style={{ fontSize: 17, color: 'var(--text-primary)' }}>{fmtIST(dep)}</p>
          <p className="font-mono" style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.2em', marginTop: 2 }}>IST</p>
        </div>
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            textAlign: 'center',
          }}
        >
          <p className="serif-display" style={{ fontSize: 17, color: 'var(--text-primary)' }}>{fmtWITA(dep)}</p>
          <p className="font-mono" style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.2em', marginTop: 2 }}>WITA</p>
        </div>
      </div>

      <p
        className="font-ui mt-3"
        style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}
      >
        {[event.airline, event.flight_no, event.terminal].filter(Boolean).join(' · ')}
      </p>
    </div>
  )
}
