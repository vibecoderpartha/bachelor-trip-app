import { type CSSProperties } from 'react'
import { USERS, type User } from '../constants/users'
import { NeonText } from './ui/NeonText'

interface Props {
  onSelect: (user: User) => void
}

export function PersonaPicker({ onSelect }: Props) {
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'rgba(5, 3, 8, 0.97)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    gap: '32px',
  }

  return (
    <div style={overlayStyle}>
      <div className="text-center">
        <p className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: 6, color: '#444' }}>
          ◈ THE BOYS ARE IN ◈
        </p>
        <NeonText color="var(--neon-gold)" className="font-display text-2xl block animate-flicker">
          B A L I  ✦  BACHELOR
        </NeonText>
        <p className="font-mono mt-3" style={{ fontSize: 10, letterSpacing: 4, color: '#555' }}>
          WHO ARE YOU?
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        {USERS.map(u => {
          const btnStyle: CSSProperties = {
            borderColor: `${u.color}44`,
            background: `${u.color}0a`,
            transition: 'all 0.2s ease',
          }
          return (
            <button
              key={u.name}
              onClick={() => onSelect(u)}
              className="flex items-center gap-4 border rounded-lg px-5 py-3 w-full text-left active:scale-95"
              style={btnStyle}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = u.color
                e.currentTarget.style.boxShadow = `0 0 16px ${u.color}44`
                e.currentTarget.style.background = `${u.color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${u.color}44`
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = `${u.color}0a`
              }}
            >
              <span className="text-3xl">{u.emoji}</span>
              <div>
                <div className="font-display text-base tracking-wider" style={{ color: u.color }}>
                  {u.name.toUpperCase()}
                </div>
                <div className="font-mono" style={{ fontSize: 10, color: `${u.color}88`, letterSpacing: 2 }}>
                  {u.vibe}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
