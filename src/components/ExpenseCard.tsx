import { type CSSProperties } from 'react'
import type { Expense } from '../lib/splitting'
import { USER_MAP, USERS } from '../constants/users'
import { formatIDR, formatINR, toINR } from '../lib/currency'

interface Props {
  expense: Expense
  currentUserName: string
  onEdit?: () => void
}

export function ExpenseCard({ expense: e, currentUserName, onEdit }: Props) {
  const payer = USER_MAP[e.paid_by]
  const inr = toINR(Number(e.amount_idr) || 0)
  const perHead = e.split_among.length ? (Number(e.amount_idr) || 0) / e.split_among.length : 0
  const iAmIn = e.split_among.includes(currentUserName)

  const card: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 14,
    transition: 'background-color 0.2s, border-color 0.2s',
    opacity: iAmIn || e.paid_by === currentUserName ? 1 : 0.85,
  }

  return (
    <div style={card} data-testid={`expense-card-${e.id}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span
            style={{
              fontSize: 18,
              width: 36,
              height: 36,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: `1px solid ${payer?.color ?? 'var(--border)'}66`,
              flexShrink: 0,
            }}
          >
            {payer?.emoji ?? '·'}
          </span>
          <div className="min-w-0">
            <p
              className="serif-display truncate"
              style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.2 }}
            >
              {e.description}
            </p>
            <p
              className="font-ui"
              style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}
            >
              {payer?.name ?? '—'} paid
              {e.split_mode !== 'equal' ? ` · ${e.split_mode}` : ''}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className="serif-display"
            style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 400 }}
          >
            {formatINR(inr)}
          </p>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {formatIDR(Number(e.amount_idr) || 0)}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-2 pt-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex gap-0.5">
          {e.split_among.length === USERS.length
            ? USERS.map(u => <span key={u.name} style={{ fontSize: 12, opacity: 0.85 }}>{u.emoji}</span>)
            : e.split_among.map(n => <span key={n} style={{ fontSize: 12, opacity: 0.85 }}>{USER_MAP[n]?.emoji ?? '·'}</span>)}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {formatINR(toINR(perHead))} / head
          </p>
          {onEdit && (
            <button
              onClick={onEdit}
              className="font-ui"
              style={{ fontSize: 11, color: 'var(--text-tertiary)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
