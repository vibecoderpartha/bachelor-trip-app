import { type CSSProperties } from 'react'
import { USERS, type User } from '../constants/users'

interface Props {
  onSelect: (user: User) => void
}

export function PersonaPicker({ onSelect }: Props) {
  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'rgba(15, 11, 8, 0.96)',
    backdropFilter: 'blur(18px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    gap: 28,
  }

  return (
    <div style={overlay} data-testid="persona-picker">
      <div className="text-center">
        <p
          className="font-mono"
          style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.28em', marginBottom: 8 }}
        >
          MAY 22 — 27 · 2026
        </p>
        <p
          className="serif-display"
          style={{ fontSize: 36, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.05 }}
        >
          Bali Bachelor
        </p>
        <p
          className="serif-eyebrow"
          style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 14, fontStyle: 'italic' }}
        >
          who are you?
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full" style={{ maxWidth: 320 }}>
        {USERS.map(u => (
          <button
            key={u.name}
            onClick={() => onSelect(u)}
            className="flex items-center gap-4 px-4 py-3 transition-all active:scale-[0.985]"
            style={{
              background: 'rgba(245, 241, 235, 0.03)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(245, 241, 235, 0.06)'
              e.currentTarget.style.borderColor = `${u.color}55`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(245, 241, 235, 0.03)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
            data-testid={`persona-${u.name.toLowerCase()}`}
          >
            <span style={{ fontSize: 26 }}>{u.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className="serif-display"
                style={{ fontSize: 17, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.1 }}
              >
                {u.name}
              </p>
              <p
                className="font-ui"
                style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}
              >
                {u.vibe}
              </p>
            </div>
            <span
              aria-hidden="true"
              style={{ width: 6, height: 6, borderRadius: '50%', background: u.color, opacity: 0.85 }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
