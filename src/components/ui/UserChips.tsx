import { type CSSProperties } from 'react'
import { USERS, type User } from '../../constants/users'

interface Props {
  activeUser: User | null
  onSelect: (user: User) => void
  compact?: boolean
}

export function UserChips({ activeUser, onSelect, compact = false }: Props) {
  return (
    <div className={`flex ${compact ? 'gap-1.5' : 'gap-2'} justify-start overflow-x-auto`} style={{ scrollbarWidth: 'none' }}>
      {USERS.map(u => {
        const active = activeUser?.name === u.name
        const style: CSSProperties = {
          flex: '0 0 auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? 5 : 6,
          padding: compact ? '4px 9px' : '6px 12px',
          borderRadius: 999,
          fontSize: compact ? 11 : 12,
          fontFamily: 'var(--font-ui)',
          letterSpacing: 0.3,
          background: active ? 'rgba(245,241,235,0.08)' : 'rgba(245,241,235,0.02)',
          border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`,
          color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
          transition: 'all 0.2s ease',
        }
        return (
          <button
            key={u.name}
            onClick={() => onSelect(u)}
            style={style}
            data-testid={`chip-${u.name.toLowerCase()}`}
          >
            <span style={{ fontSize: compact ? 12 : 14 }}>{u.emoji}</span>
            <span>{u.name}</span>
          </button>
        )
      })}
    </div>
  )
}
