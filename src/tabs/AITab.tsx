import { TabHero } from '../components/TabHero'

export function AITab() {
  return (
    <div data-testid="ai-tab">
      <TabHero tab="ai" />

      <div className="px-5 pt-8 pb-8 text-center">
        <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.25 }}>
          Ask. Anything.
        </p>
        <p className="font-ui mt-3" style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 320, margin: '12px auto 0' }}>
          A Claude-powered concierge briefed on the crew, the itinerary, and Bali specifics. Best beach club for Tuesday? Cheapest scooter rental near Seminyak? Just ask.
        </p>
        <span className="pill mt-6 inline-block" style={{ marginTop: 24 }}>
          Coming soon
        </span>
      </div>
    </div>
  )
}
