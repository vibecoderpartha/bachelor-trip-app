const STORAGE = 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas'

export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
  image: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'Made a 47-slide trip deck. Nobody opened it.',            image: `${STORAGE}/partha.png`   },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'Bali, sure. Whatever. Pass the drink.',                    image: `${STORAGE}/astitva.png`  },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'Has an opening line ready. Has had it for 3 years.',       image: `${STORAGE}/vaibhav.png`  },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'Said "I\'m not even that drunk" and fell asleep standing.', image: `${STORAGE}/suryansh.png` },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'Unbothered. Undefeated.',                                  image: `${STORAGE}/bittu.png`    },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
