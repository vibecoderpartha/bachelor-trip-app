import { type CSSProperties } from 'react'
import { type User, USERS, USER_MAP } from '../constants/users'
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

  const statusLabel = settled
    ? 'ALL SETTLED UP'
    : owed
    ? 'YOU ARE OWED'
    : 'YOU OWE'

  const color = settled
    ? 'var(--neon-cyan)'
    : owed
    ? 'var(--neon-cyan)'
    : 'var(--neon-pink)'

  const heroStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${color}33`,
    borderRadius: 10,
    padding: '16px 16px 12px',
    color,
  }

  // sort other users by their abs balance desc for the mini roster
  const others = USERS.filter(u => u.name !== currentUser.name)
    .map(u => ({ user: u, bal: balances[u.name] ?? 0 }))
    .sort((a, b) => Math.abs(b.bal) - Math.abs(a.bal))

  return (
    <div
      className="corner-bracket"
      style={heroStyle}
      data-testid="balance-hero"
    >
      <p
        className="font-mono text-center mb-1"
        style={{ fontSize: 9, letterSpacing: 5, color: '#666' }}
      >
        ◆ {statusLabel}
      </p>

      <div className="text-center mb-3">
        <p
          className="font-display"
          style={{
            fontSize: 32,
            color,
            textShadow: `0 0 14px ${color}88`,
            letterSpacing: 1,
          }}
          data-testid="balance-hero-amount-idr"
        >
          {settled ? 'Rp 0' : formatIDR(absMine)}
        </p>
        {!settled && (
          <p
            className="font-mono mt-1"
            style={{ fontSize: 11, color: `${color}99`, letterSpacing: 2 }}
          >
            ≈ {formatINR(toINR(absMine))}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {others.map(({ user, bal }) => {
          const abs = Math.abs(bal)
          const owedByMe = (balances[currentUser.name] ?? 0) < 0 && bal > 0
          const owesMe = (balances[currentUser.name] ?? 0) > 0 && bal < 0
          const neutral = abs < 1 || !(owedByMe || owesMe)
          const tint = neutral
            ? 'rgba(255,255,255,0.05)'
            : owedByMe
            ? 'var(--neon-pink)'
            : 'var(--neon-cyan)'
          const cellStyle: CSSProperties = {
            background: 'rgba(0,0,0,0.25)',
            border: `1px solid ${tint}44`,
            borderRadius: 6,
            padding: '6px 4px',
            textAlign: 'center',
          }
          return (
            <div
              key={user.name}
              style={cellStyle}
              data-testid={`balance-roster-${user.name.toLowerCase()}`}
            >
              <span style={{ fontSize: 16 }}>{user.emoji}</span>
              <p
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: tint,
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}
              >
                {neutral
                  ? 'even'
                  : `${owedByMe ? '+' : '-'}${formatIDR(abs)}`}
              </p>
            </div>
          )
        })}
      </div>

      {/* Ensure USER_MAP import is not tree-shaken out by TS noUnusedLocals */}
      <span hidden aria-hidden="true">{USER_MAP[currentUser.name]?.name}</span>
    </div>
  )
}
