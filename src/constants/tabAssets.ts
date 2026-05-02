export type TabId = 'trip' | 'scan' | 'split' | 'fx' | 'ai'

export interface TabAsset {
  image: string
  eyebrow: string
  tagline: string
  accent: string
}

export const TAB_ASSETS: Record<TabId, TabAsset> = {
  trip: {
    image: 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas/partha.png',
    eyebrow: 'Itinerary',
    tagline: 'No plan, no stress — just Bali.',
    accent: '#FF8B4D',
  },
  split: {
    image: 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas/astitva.png',
    eyebrow: 'Settle Up',
    tagline: 'All in. Nobody walks home broke.',
    accent: '#FFB347',
  },
  scan: {
    image: 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas/suryansh.png',
    eyebrow: 'Document Scan',
    tagline: 'Drop a ticket — we read it for you.',
    accent: '#FF6F91',
  },
  fx: {
    image: 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas/bittu.png',
    eyebrow: 'Currency',
    tagline: 'Rupiah ↔ Rupee, like a local.',
    accent: '#FFA86B',
  },
  ai: {
    image: 'https://tplbxaqjqbeokdxdkhbo.supabase.co/storage/v1/object/public/personas/vaibhav.png',
    eyebrow: 'Concierge',
    tagline: 'Ask anything. The smooth one knows.',
    accent: '#FFB04E',
  },
}
