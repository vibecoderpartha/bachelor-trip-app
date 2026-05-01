import { useEffect, useState, type CSSProperties } from 'react'
import { type DBEvent } from '../hooks/useEvents'
import { fmtIST, fmtWITA, getCountdown, type CountdownParts } from '../lib/timezone'
import { VIPBadge } from './ui/VIPBadge'

interface Props {
  event: DBEvent | null
  userColor: string
}

const CIRCUMFERENCE = 2 * Math.PI * 80 // ≈ 502.65
const ONE_DAY_MS = 86400000

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export function CountdownClock({ event, userColor }: Props) {
  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    event ? getCountdown(new Date(event.date_ist)) : { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 },
  )

  useEffect(() => {
    if (!event) return
    const target = new Date(event.date_ist)
    setCountdown(getCountdown(target))
    const id = window.setInterval(() => {
      setCountdown(getCountdown(target))
    }, 1000)
    return () => window.clearInterval(id)
  }, [event])

  // ── No flight ─────────────────────────────────────────
  if (!event) {
    return (
      <div
        className="neon-card corner-bracket text-center py-8 px-6"
        style={{ color: 'var(--neon-gold)' }}
        data-testid="countdown-no-flight"
      >
        <VIPBadge color="var(--neon-gold)">NO FLIGHT FOUND</VIPBadge>
        <p className="font-mono mt-3" style={{ fontSize: 10, color: '#666', letterSpacing: 2 }}>
          THE WHEELS HAVE LANDED · ENJOY BALI
        </p>
      </div>
    )
  }

  const dep = new Date(event.date_ist)
  const departed = event.type === 'flight' && countdown.totalMs <= 0

  // ── Departed flight ───────────────────────────────────
  if (departed) {
    return (
      <div
        className="neon-card corner-bracket text-center py-6 px-6"
        style={{ color: userColor }}
        data-testid="countdown-departed"
      >
        <VIPBadge color={userColor}>DEPARTED</VIPBadge>
        <p
          className="font-display mt-3 tracking-widest"
          style={{ fontSize: 22, color: userColor, textShadow: `0 0 12px ${userColor}` }}
        >
          {event.dep_code ?? '---'} → {event.arr_code ?? '---'}
        </p>
        <div className="flex justify-center gap-6 mt-3 font-mono" style={{ fontSize: 11 }}>
          <span style={{ color: userColor }}>
            {fmtIST(dep)} <span style={{ color: '#555' }}>IST</span>
          </span>
          <span style={{ color: userColor }}>
            {fmtWITA(dep)} <span style={{ color: '#555' }}>WITA</span>
          </span>
        </div>
      </div>
    )
  }

  // ── Full clock ────────────────────────────────────────
  const fraction = Math.min(1, Math.max(0, (ONE_DAY_MS - countdown.totalMs) / ONE_DAY_MS))
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2
    return {
      x1: 92 + Math.cos(a) * 74,
      y1: 92 + Math.sin(a) * 74,
      x2: 92 + Math.cos(a) * 68,
      y2: 92 + Math.sin(a) * 68,
    }
  })

  const arcStyle: CSSProperties = {
    filter: `drop-shadow(0 0 8px ${userColor})`,
    transition: 'stroke-dashoffset 1s linear',
  }

  return (
    <div
      className="neon-card corner-bracket px-4 py-5 animate-slide-up"
      style={{ color: userColor }}
      data-testid="countdown-clock"
    >
      <div className="text-center mb-3">
        <VIPBadge color="var(--neon-gold)">⚡ COUNTDOWN TO LIFTOFF</VIPBadge>
      </div>

      {/* Route */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span
          className="font-display tracking-widest"
          style={{ fontSize: 24, color: userColor, textShadow: `0 0 12px ${userColor}` }}
        >
          {event.dep_code ?? '---'}
        </span>
        <span style={{ flex: 1, height: 1, background: `${userColor}44`, maxWidth: 40 }} />
        <span style={{ color: userColor, fontSize: 14 }}>✈</span>
        <span style={{ flex: 1, height: 1, background: `${userColor}44`, maxWidth: 40 }} />
        <span
          className="font-display tracking-widest"
          style={{ fontSize: 24, color: userColor, textShadow: `0 0 12px ${userColor}` }}
        >
          {event.arr_code ?? '---'}
        </span>
      </div>

      {/* SVG dial */}
      <div className="flex justify-center mb-4">
        <svg width={184} height={184} viewBox="0 0 184 184">
          <circle
            cx={92}
            cy={92}
            r={80}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={8}
          />
          <circle
            cx={92}
            cy={92}
            r={80}
            fill="none"
            stroke={userColor}
            strokeWidth={8}
            strokeLinecap="square"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 92 92)"
            style={arcStyle}
          />
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1}
            />
          ))}
          <text
            x={92}
            y={72}
            textAnchor="middle"
            className="font-display"
            fill="#fff"
            style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}
          >
            {countdown.days}d
          </text>
          <text
            x={92}
            y={104}
            textAnchor="middle"
            className="font-display"
            fill={userColor}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              filter: `drop-shadow(0 0 6px ${userColor})`,
            }}
          >
            {pad(countdown.hours)}:{pad(countdown.minutes)}
          </text>
          <text
            x={92}
            y={128}
            textAnchor="middle"
            fill={userColor}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              opacity: 0.85,
            }}
          >
            {pad(countdown.seconds)}
          </text>
        </svg>
      </div>

      {/* IST / WITA */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="text-center py-2 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-display" style={{ fontSize: 16, color: userColor }}>{fmtIST(dep)}</p>
          <p className="font-mono" style={{ fontSize: 9, color: '#666', letterSpacing: 3 }}>IST</p>
        </div>
        <div
          className="text-center py-2 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-display" style={{ fontSize: 16, color: userColor }}>{fmtWITA(dep)}</p>
          <p className="font-mono" style={{ fontSize: 9, color: '#666', letterSpacing: 3 }}>WITA</p>
        </div>
      </div>

      {/* Info */}
      <div
        className="font-mono px-3 py-2 rounded-sm"
        style={{
          fontSize: 10,
          color: '#888',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
          letterSpacing: 1,
        }}
      >
        {[event.airline, event.flight_no].filter(Boolean).join(' ')}
        {event.terminal ? ` · ${event.terminal}` : ''}
        {event.notes ? ` · ${event.notes}` : ''}
      </div>
    </div>
  )
}
