import { useState, type CSSProperties } from 'react'
import { type DBEvent } from '../hooks/useEvents'
import { EVENT_TYPE_MAP } from '../constants/eventTypes'
import { USERS, USER_MAP } from '../constants/users'
import { fmtDate, fmtIST, fmtWITA } from '../lib/timezone'
import { formatIDR } from '../lib/currency'
import { VIPBadge } from './ui/VIPBadge'

export type EventStatus = 'past' | 'live' | 'next' | 'upcoming'

interface Props {
  event: DBEvent
  status: EventStatus
  userColor: string
}

export function EventCard({ event, status }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = EVENT_TYPE_MAP[event.type] ?? EVENT_TYPE_MAP.other

  const date = new Date(event.date_ist)
  const isLive = status === 'live'
  const isNext = status === 'next'
  const isPast = status === 'past'
  const accent = event.color || meta.color

  const nodeBorder = isLive || isNext ? accent : 'rgba(255,255,255,0.1)'
  const nodeStyle: CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: `2px solid ${nodeBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5,3,8,0.95)',
    boxShadow: isLive || isNext ? `0 0 14px ${accent}88` : 'none',
    flexShrink: 0,
    position: 'relative',
    fontSize: 18,
    transition: 'all 0.3s',
  }

  const cardStyle: CSSProperties = {
    flex: 1,
    background: isPast ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${isLive || isNext ? `${accent}55` : 'rgba(255,255,255,0.06)'}`,
    borderRadius: 8,
    padding: 12,
    opacity: isPast ? 0.45 : 1,
    transition: 'all 0.25s',
    cursor: event.notes ? 'pointer' : 'default',
  }

  const dotStyle = (color: string, pulse: boolean): CSSProperties => ({
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 8px ${color}`,
    animation: pulse ? 'neonPulse 1.4s ease-in-out infinite' : undefined,
  })

  const crewEmojis = !event.for_users || event.for_users.length === 0
    ? USERS.map(u => u.emoji)
    : event.for_users.map(n => USER_MAP[n]?.emoji ?? '◆')

  return (
    <div
      className="flex gap-3 items-start animate-slide-up"
      data-testid={`event-card-${event.id}`}
    >
      <div style={nodeStyle} aria-hidden="true">
        <span>{meta.icon}</span>
        {isLive && <span style={dotStyle('var(--neon-cyan)', true)} />}
        {isNext && <span style={dotStyle('var(--neon-gold)', false)} />}
      </div>

      <div
        style={cardStyle}
        onClick={() => event.notes && setExpanded(v => !v)}
        data-testid={`event-card-body-${event.id}`}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-display tracking-wide text-sm leading-tight"
            style={{ color: isPast ? '#777' : '#fff' }}
          >
            {event.title}
          </h3>
          {isNext && <VIPBadge color="var(--neon-gold)">NEXT</VIPBadge>}
          {isLive && <VIPBadge color="var(--neon-cyan)">● LIVE</VIPBadge>}
        </div>

        <div
          className="font-mono flex flex-wrap items-center gap-2 mb-1.5"
          style={{ fontSize: 10, color: '#888', letterSpacing: 1 }}
        >
          <span>{fmtDate(date)}</span>
          <span style={{ color: '#444' }}>·</span>
          <span style={{ color: accent }}>
            {fmtIST(date)} <span style={{ color: '#555' }}>IST</span>
          </span>
          <span style={{ color: '#444' }}>·</span>
          <span style={{ color: accent }}>
            {fmtWITA(date)} <span style={{ color: '#555' }}>WITA</span>
          </span>
        </div>

        <div
          className="font-ui flex items-center gap-1 mb-2"
          style={{ fontSize: 11, color: '#aaa' }}
        >
          <span>{event.location}</span>
          {event.location_to && (
            <>
              <span style={{ color: '#555' }}> → </span>
              <span>{event.location_to}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-0.5" data-testid={`event-crew-${event.id}`}>
            {crewEmojis.map((e, i) => (
              <span key={i} style={{ fontSize: 13, opacity: 0.85 }}>{e}</span>
            ))}
          </div>
          {event.expense && (
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: USER_MAP[event.expense.paid_by]?.color ?? '#fff',
                letterSpacing: 0.5,
              }}
            >
              {USER_MAP[event.expense.paid_by]?.emoji ?? '◆'} {formatIDR(event.expense.amount)}
            </span>
          )}
        </div>

        {expanded && event.notes && (
          <p
            className="font-mono text-xs mt-2 pt-2 animate-slide-up"
            style={{
              color: 'rgba(255,255,255,0.5)',
              borderTop: '1px dashed rgba(255,255,255,0.08)',
              fontSize: 10,
              letterSpacing: 0.5,
              lineHeight: 1.6,
            }}
            data-testid={`event-notes-${event.id}`}
          >
            {event.notes}
          </p>
        )}
      </div>
    </div>
  )
}
