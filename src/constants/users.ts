const STORAGE = 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas'

export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
  image: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'Carries sunscreen for everyone. Uses none.',              image: `${STORAGE}/partha.png`   },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'Ordered the most expensive thing. Venmo requested.',       image: `${STORAGE}/astitva.png`  },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'Checked in online. Still arrived last.',                   image: `${STORAGE}/vaibhav.png`  },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'Said "I\'m not even that drunk" and fell asleep standing.', image: `${STORAGE}/suryansh.png` },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'Knows a guy in Bali. The guy does not know him.',          image: `${STORAGE}/bittu.png`    },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
