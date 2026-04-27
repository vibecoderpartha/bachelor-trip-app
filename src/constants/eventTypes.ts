export interface EventType {
  type: string
  icon: string
  color: string
  label: string
}

export const EVENT_TYPES: EventType[] = [
  { type: 'flight',    icon: '✈️',  color: '#BF5FFF', label: 'Flight' },
  { type: 'hotel',     icon: '🏨',  color: '#FF2D78', label: 'Hotel / Airbnb' },
  { type: 'ferry',     icon: '⛴️',  color: '#FFD600', label: 'Ferry' },
  { type: 'activity',  icon: '🎯',  color: '#00FFD1', label: 'Activity' },
  { type: 'food',      icon: '🍽️', color: '#FF6B00', label: 'Dining' },
  { type: 'transport', icon: '🚗',  color: '#00FFD1', label: 'Transport' },
  { type: 'other',     icon: '📌',  color: '#888888', label: 'Other' },
]

export const EVENT_TYPE_MAP: Record<string, EventType> = Object.fromEntries(
  EVENT_TYPES.map(t => [t.type, t])
)
