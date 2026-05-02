import { useMemo } from 'react'
import { USERS } from '../constants/users'
import { Avatar } from './ui/Avatar'
import { formatINR, toINR } from '../lib/currency'
import { computeShares, type Expense } from '../lib/splitting'

interface Props {
  expenses: Expense[]
}

export function GroupTotals({ expenses }: Props) {
  const rows = useMemo(() => {
    const paid: Record<string, number> = {}
    const owed: Record<string, number> = {}

    for (const e of expenses) {
      const total = Number(e.amount_idr) || 0

      if (e.paid_by_splits && Object.keys(e.paid_by_splits).length > 0) {
        for (const [u, v] of Object.entries(e.paid_by_splits)) {
          paid[u] = (paid[u] ?? 0) + Number(v)
        }
      } else {
        paid[e.paid_by] = (paid[e.paid_by] ?? 0) + total
      }

      const shares = computeShares(e)
      for (const [u, v] of Object.entries(shares)) {
        owed[u] = (owed[u] ?? 0) + Number(v)
      }
    }

    return USERS.map(u => ({
      user: u,
      paid: paid[u.name] ?? 0,
      owed: owed[u.name] ?? 0,
      net: (paid[u.name] ?? 0) - (owed[u.name] ?? 0),
    }))
  }, [expenses])

  const totalSpend = useMemo(
    () => expenses.reduce((s, e) => s + (Number(e.amount_idr) || 0), 0),
    [expenses],
  )

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
      data-testid="group-totals"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p className="serif-eyebrow" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          group totals
        </p>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.12em' }}>
          {formatINR(toINR(totalSpend))} total
        </p>
      </div>

      {/* Column labels */}
      <div
        className="grid px-4 py-1.5"
        style={{ gridTemplateColumns: '1fr 72px 72px 72px', borderBottom: '1px solid var(--border)' }}
      >
        <span />
        {['Paid', 'Total Share', 'Net'].map(label => (
          <p key={label} className="font-ui text-right" style={{ fontSize: 9.5, color: 'var(--text-quaternary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {label}
          </p>
        ))}
      </div>

      {/* Rows */}
      {rows.map(({ user, paid, owed, net }, i) => {
        const isLast = i === rows.length - 1
        const netColor = net > 1 ? '#00FFD1' : net < -1 ? 'var(--accent)' : 'var(--text-tertiary)'
        return (
          <div
            key={user.name}
            className="grid items-center px-4 py-2.5"
            style={{
              gridTemplateColumns: '1fr 72px 72px 72px',
              borderBottom: isLast ? 'none' : '1px solid var(--border)',
            }}
            data-testid={`group-totals-row-${user.name.toLowerCase()}`}
          >
            <div className="flex items-center gap-2">
              <Avatar name={user.name} color={user.color} size={22} />
              <p className="font-ui" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.name}</p>
            </div>
            <p className="font-mono text-right" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {formatINR(toINR(paid))}
            </p>
            <p className="font-mono text-right" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {formatINR(toINR(owed))}
            </p>
            <p className="font-mono text-right font-semibold" style={{ fontSize: 11, color: netColor }}>
              {net > 1 ? '+' : ''}{formatINR(toINR(net))}
            </p>
          </div>
        )
      })}
    </div>
  )
}
