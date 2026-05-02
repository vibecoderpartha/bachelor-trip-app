const STORAGE = 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas'

export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
  image: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'Bali mein entry, dost log entry free',         image: `${STORAGE}/partha.png`   },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'Beach pe hain, bill pe nahi sochte',           image: `${STORAGE}/astitva.png`  },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'Sunset dekha, cocktail piya, yaar ne photo li', image: `${STORAGE}/vaibhav.png`  },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'Plan kya hai? Plan hi nahi — yahi toh plan hai', image: `${STORAGE}/suryansh.png` },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'Bali ek baar, yaadein baar baar',              image: `${STORAGE}/bittu.png`    },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
