const STORAGE = 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas'

export interface User {
  name: string
  emoji: string
  color: string
  vibe: string
  image: string
}

export const USERS: User[] = [
  { name: 'Partha',   emoji: '🦁', color: '#FF2D78', vibe: 'Planned the entire Bali trip. The boys said "haan haan" for 6 months and showed up with 0 ideas. Still the alpha.',  image: `${STORAGE}/partha.png`   },
  { name: 'Astitva',  emoji: '🐯', color: '#00FFD1', vibe: 'Screamed "LET\'S GOOO" at every beach, every temple, every menu. Bali didn\'t know what hit it.',                    image: `${STORAGE}/astitva.png`  },
  { name: 'Vaibhav',  emoji: '🦊', color: '#FFD600', vibe: 'Asked the bartender for "something smooth." Got a Bintang. Said "perfect." No notes.',                               image: `${STORAGE}/vaibhav.png`  },
  { name: 'Suryansh', emoji: '🐺', color: '#BF5FFF', vibe: 'Rented a scooter with no license, no helmet, no idea where he\'s going. Bali\'s problem now.',                       image: `${STORAGE}/suryansh.png` },
  { name: 'Bittu',    emoji: '🦅', color: '#FF6B00', vibe: 'Showed up to a beach club in jeans. Paid the most. Complained the least. Actual legend.',                            image: `${STORAGE}/bittu.png`    },
]

export const USER_MAP: Record<string, User> = Object.fromEntries(
  USERS.map(u => [u.name, u])
)

export const USER_NAMES = USERS.map(u => u.name)
