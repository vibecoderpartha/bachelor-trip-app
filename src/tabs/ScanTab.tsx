import { TabHero } from '../components/TabHero'

export function ScanTab() {
  return (
    <div data-testid="scan-tab">
      <TabHero tab="scan" />

      <div className="px-5 pt-8 pb-8 text-center">
        <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.25 }}>
          Drop a ticket. We’ll read it.
        </p>
        <p className="font-ui mt-3" style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 320, margin: '12px auto 0' }}>
          Boarding passes, hotel vouchers, ferry receipts — Claude pulls out times, codes, and confirmations and slots them into your itinerary.
        </p>
        <span
          className="pill mt-6 inline-block"
          style={{ marginTop: 24 }}
        >
          Coming soon
        </span>
      </div>
    </div>
  )
}
