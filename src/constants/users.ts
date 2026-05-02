const STORAGE = 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas'

export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
  image: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'Trip organise kiya, budget banaya, group banaya — baaki sab ne sirf react kiya. Still alive.',  image: `${STORAGE}/partha.png`   },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'Bali mein hoon, vibe on hai, paise nahi hain — par confidence? Bhai, phenomenal.',             image: `${STORAGE}/astitva.png`  },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'Smooth operator, Bali mein bhi. Girls? Nahi. Cocktail? Haan. Still counts, bhai.',             image: `${STORAGE}/vaibhav.png`  },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'Plan? Nahi. Paise? Thoda. Vibe? Unfiltered. Yahi toh brilliant blunder hai.',                  image: `${STORAGE}/suryansh.png` },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'Sabse bade the, sabse zyada soye. Legend aise hi bante hain. Kya karein.',                     image: `${STORAGE}/bittu.png`    },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
