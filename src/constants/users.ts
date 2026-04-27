export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'The Alpha'      },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'The Hype Man'   },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'The Smooth One' },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'The Wild Card'  },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'The Legend'     },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
