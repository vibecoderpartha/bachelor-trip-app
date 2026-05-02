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
  onDelete?: () => void
}

export function EventCard({ event, status, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = EVENT_TYPE_MAP[event.type] ?? EVENT_TYPE_MAP.other
  const date = new Date(event.date_ist)
  const isLive = status === 'live'
  const isNext = status === 'next'
  const isPast = status === 'past'

  const cardStyle: CSSProperties = {
    background: 'var(--bg-card)',
    border: `1px solid ${isLive ? 'var(--accent)' : isNext ? 'rgba(255,139,77,0.35)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    cursor: event.notes ? 'pointer' : 'default',
    opacity: isPast ? 0.45 : 1,
    transition: 'background-color 0.2s, border-color 0.2s',
  }

  const nodeStyle: CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: `1px solid ${isLive || isNext ? 'var(--accent)' : 'var(--border-strong)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-base)',
    fontSize: 16,
    flexShrink: 0,
    position: 'relative',
  }

  const crewEmojis = !event.for_users || event.for_users.length === 0
    ? USERS.map(u => u.emoji)
    : event.for_users.map(n => USER_MAP[n]?.emoji ?? '·')

  return (
    <div className="flex gap-3 items-start animate-slide-up" data-testid={`event-card-${event.id}`}>
      <div style={nodeStyle} aria-hidden="true">
        <span>{meta.icon}</span>
        {(isLive || isNext) && (
          <span
            className={isLive ? 'animate-pulse-soft' : ''}
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
        )}
      </div>

      <div
        style={cardStyle}
        className="flex-1 min-w-0"
        onClick={() => event.notes && setExpanded(v => !v)}
        data-testid={`event-card-body-${event.id}`}
      >
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3
            className="serif-display"
            style={{ fontSize: 18, fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.25 }}
          >
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {isNext && <VIPBadge color="var(--accent)">Next</VIPBadge>}
            {isLive && <VIPBadge color="var(--accent)">● Live</VIPBadge>}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="font-ui"
                style={{
                  fontSize: 12,
                  color: '#fff',
                  background: '#FF2D78',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                  fontWeight: 500,
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="font-ui" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {fmtDate(date)}
          </span>
          <span style={{ color: 'var(--text-quaternary)', fontSize: 12 }}>·</span>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {fmtIST(date)} <span style={{ color: 'var(--text-tertiary)' }}>IST</span>
            <span style={{ color: 'var(--text-quaternary)', margin: '0 6px' }}>·</span>
            {fmtWITA(date)} <span style={{ color: 'var(--text-tertiary)' }}>WITA</span>
          </span>
        </div>

        <p className="font-ui mb-2.5" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {event.location}
          {event.location_to && (
            <>
              <span style={{ color: 'var(--text-quaternary)', margin: '0 6px' }}>→</span>
              {event.location_to}
            </>
          )}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1" data-testid={`event-crew-${event.id}`}>
            {crewEmojis.map((e, i) => (
              <span key={i} style={{ fontSize: 13, opacity: 0.85 }}>{e}</span>
            ))}
          </div>
          {event.expense && (
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {USER_MAP[event.expense.paid_by]?.emoji ?? '·'}{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{formatIDR(event.expense.amount)}</span>
            </span>
          )}
        </div>

        {expanded && event.notes && (
          <p
            className="font-mono animate-fade-in"
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px solid var(--border)',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              lineHeight: 1.7,
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
