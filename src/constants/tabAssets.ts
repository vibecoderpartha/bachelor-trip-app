export type TabId = 'trip' | 'scan' | 'split' | 'fx' | 'ai'

export interface TabAsset {
  image: string
  eyebrow: string
  tagline: string
  accent: string
}

export const TAB_ASSETS: Record<TabId, TabAsset> = {
  trip: {
    image: 'https://customer-assets.emergentagent.com/job_awesome-meitner-7/artifacts/0w9wahgt_partha.png',
    eyebrow: 'Itinerary',
    tagline: 'No plan, no stress — just Bali.',
    accent: '#FF8B4D',
  },
  split: {
    image: 'https://customer-assets.emergentagent.com/job_awesome-meitner-7/artifacts/wf850m26_astitva.png',
    eyebrow: 'Settle Up',
    tagline: 'All in. Nobody walks home broke.',
    accent: '#FFB347',
  },
  scan: {
    image: 'https://customer-assets.emergentagent.com/job_awesome-meitner-7/artifacts/xs54g04a_suryansh.png',
    eyebrow: 'Document Scan',
    tagline: 'Drop a ticket — we read it for you.',
    accent: '#FF6F91',
  },
  fx: {
    image: 'https://customer-assets.emergentagent.com/job_awesome-meitner-7/artifacts/snqdgi9p_bittu.png',
    eyebrow: 'Currency',
    tagline: 'Rupiah ↔ Rupee, like a local.',
    accent: '#FFA86B',
  },
  ai: {
    image: 'https://customer-assets.emergentagent.com/job_awesome-meitner-7/artifacts/x1c6ori4_vaibhav.png',
    eyebrow: 'Concierge',
    tagline: 'Ask anything. The smooth one knows.',
    accent: '#FFB04E',
  },
}
