import { type CSSProperties } from 'react'
import { USERS, type User } from '../../constants/users'

interface Props {
  activeUser: User | null
  onSelect: (user: User) => void
  compact?: boolean
}

export function UserChips({ activeUser, onSelect, compact = false }: Props) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {USERS.map(u => {
        const isActive = activeUser?.name === u.name
        const chipStyle: CSSProperties = {
          borderColor: isActive ? u.color : `${u.color}44`,
          color: isActive ? u.color : `${u.color}99`,
          boxShadow: isActive ? `0 0 12px ${u.color}66, 0 0 24px ${u.color}33` : 'none',
          background: isActive ? `${u.color}15` : 'transparent',
          transition: 'all 0.25s ease',
        }
        return (
          <button
            key={u.name}
            onClick={() => onSelect(u)}
            className={`border rounded-sm flex items-center gap-1.5 font-ui tracking-wider uppercase transition-all ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}
            style={chipStyle}
          >
            <span>{u.emoji}</span>
            {!compact && <span>{u.name.toUpperCase()}</span>}
          </button>
        )
      })}
    </div>
  )
}
