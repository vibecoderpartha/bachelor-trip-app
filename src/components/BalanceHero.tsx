import { type CSSProperties } from 'react'
import { type User, USERS } from '../constants/users'
import { formatIDR, formatINR, toINR } from '../lib/currency'

interface Props {
  balances: Record<string, number>
  currentUser: User
}

export function BalanceHero({ balances, currentUser }: Props) {
  const mine = balances[currentUser.name] ?? 0
  const absMine = Math.abs(mine)
  const owes = mine < -1
  const owed = mine > 1
  const settled = !owes && !owed

  const statusLabel = settled ? 'all settled up' : owed ? 'you’re owed' : 'you owe'

  const wrap: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
  }

  const others = USERS.filter(u => u.name !== currentUser.name)
    .map(u => ({ user: u, bal: balances[u.name] ?? 0 }))
    .sort((a, b) => Math.abs(b.bal) - Math.abs(a.bal))

  return (
    <div style={wrap} data-testid="balance-hero">
      <p
        className="serif-eyebrow"
        style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}
      >
        {statusLabel}
      </p>
      <p
        className="serif-display"
        style={{
          fontSize: 38,
          color: 'var(--text-primary)',
          fontWeight: 300,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}
        data-testid="balance-hero-amount-idr"
      >
        {settled ? '₹0' : formatINR(toINR(absMine))}
      </p>
      {!settled && (
        <p className="font-mono" style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {formatIDR(absMine)}
        </p>
      )}

      <div className="grid grid-cols-4 gap-2 mt-4">
        {others.map(({ user, bal }) => {
          const abs = Math.abs(bal)
          const owedByMe = mine < 0 && bal > 0
          const owesMe = mine > 0 && bal < 0
          const neutral = abs < 1 || !(owedByMe || owesMe)
          const cell: CSSProperties = {
            background: 'var(--bg-elevated)',
            border: `1px solid ${neutral ? 'var(--border)' : `${user.color}55`}`,
            borderRadius: 'var(--radius-sm)',
            padding: '8px 6px',
            textAlign: 'center',
          }
          return (
            <div key={user.name} style={cell} data-testid={`balance-roster-${user.name.toLowerCase()}`}>
              <span style={{ fontSize: 16 }}>{user.emoji}</span>
              <p
                className="font-mono"
                style={{
                  fontSize: 9.5,
                  color: neutral ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                  marginTop: 3,
                  letterSpacing: 0.3,
                }}
              >
                {neutral ? 'even' : `${owedByMe ? '−' : '+'}${formatIDR(abs)}`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
