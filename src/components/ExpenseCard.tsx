import { type CSSProperties } from 'react'
import type { Expense } from '../lib/splitting'
import { USER_MAP, USERS } from '../constants/users'
import { formatIDR, formatINR, toINR } from '../lib/currency'

interface Props {
  expense: Expense
  currentUserName: string
}

export function ExpenseCard({ expense: e, currentUserName }: Props) {
  const payer = USER_MAP[e.paid_by]
  const inr = toINR(Number(e.amount_idr) || 0)
  const perHead =
    e.split_among && e.split_among.length
      ? (Number(e.amount_idr) || 0) / e.split_among.length
      : 0

  const iAmIn = e.split_among.includes(currentUserName)
  const iPaid = e.paid_by === currentUserName

  const cardStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${iAmIn || iPaid ? `${payer?.color ?? '#fff'}22` : 'rgba(255,255,255,0.05)'}`,
    borderRadius: 8,
    padding: 12,
  }

  return (
    <div style={cardStyle} data-testid={`expense-card-${e.id}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            style={{
              fontSize: 20,
              width: 36,
              height: 36,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: `2px solid ${payer?.color ?? '#fff'}`,
              boxShadow: `0 0 10px ${payer?.color ?? '#fff'}44`,
              flexShrink: 0,
            }}
          >
            {payer?.emoji ?? '◆'}
          </span>
          <div className="min-w-0">
            <p
              className="font-ui tracking-wide truncate"
              style={{ fontSize: 13, color: '#fff' }}
            >
              {e.description}
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 10, color: '#666', letterSpacing: 1 }}
            >
              {payer?.name.toUpperCase() ?? '—'} PAID
              {e.split_mode !== 'equal' && ` · ${e.split_mode.toUpperCase()}`}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className="font-display"
            style={{
              fontSize: 14,
              color: payer?.color ?? '#fff',
              textShadow: `0 0 6px ${payer?.color ?? '#fff'}55`,
            }}
          >
            {formatIDR(Number(e.amount_idr) || 0)}
          </p>
          <p className="font-mono" style={{ fontSize: 9, color: '#555' }}>
            ≈ {formatINR(inr)}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-2 mt-2 pt-2"
        style={{ borderTop: '1px dashed rgba(255,255,255,0.05)' }}
      >
        <div className="flex gap-0.5">
          {e.split_among.length === USERS.length
            ? USERS.map(u => (
                <span key={u.name} style={{ fontSize: 12, opacity: 0.85 }}>
                  {u.emoji}
                </span>
              ))
            : e.split_among.map(n => (
                <span key={n} style={{ fontSize: 12, opacity: 0.85 }}>
                  {USER_MAP[n]?.emoji ?? '◆'}
                </span>
              ))}
        </div>
        <p
          className="font-mono"
          style={{ fontSize: 10, color: '#888', letterSpacing: 1 }}
        >
          {formatIDR(perHead)} <span style={{ color: '#444' }}>/ head</span>
        </p>
      </div>
    </div>
  )
}
