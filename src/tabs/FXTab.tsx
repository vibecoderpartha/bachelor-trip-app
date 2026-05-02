import { useEffect, useState, type CSSProperties } from 'react'
import { TabHero } from '../components/TabHero'
import { NeonInput } from '../components/ui/NeonInput'
import { RATES, formatIDR, formatINR } from '../lib/currency'
import { useCurrentUser } from '../hooks/useCurrentUser'

type Direction = 'INR_TO_IDR' | 'IDR_TO_INR'

const QUICK_INR = [500, 1000, 5000, 10000, 20000]
const QUICK_IDR = [100_000, 500_000, 1_000_000, 2_500_000, 5_000_000]

interface PriceRow { icon: string; label: string; idr: number; note?: string }

const PRICE_GUIDE: PriceRow[] = [
  { icon: '☕', label: 'Kopi · iced latte',           idr: 35_000,    note: 'café' },
  { icon: '🍺', label: 'Bintang large',                idr: 55_000,    note: 'warung' },
  { icon: '🍜', label: 'Nasi goreng · mie',            idr: 45_000,    note: 'warung' },
  { icon: '🍽️', label: 'Beach club dinner',            idr: 400_000,   note: 'per head' },
  { icon: '🛵', label: 'Scooter · per day',            idr: 80_000 },
  { icon: '🚕', label: 'Grab · airport → seminyak',    idr: 220_000 },
  { icon: '🏄', label: 'Surf lesson · 2h',             idr: 500_000 },
  { icon: '⛴️', label: 'Fast boat · Sanur–Penida',     idr: 400_000,   note: 'return' },
  { icon: '🏨', label: 'Pool villa · per night',       idr: 3_700_000, note: 'split 5 ≈ 740k ea' },
  { icon: '💆', label: 'Balinese massage · 60min',     idr: 250_000 },
]

export function FXTab() {
  const { user } = useCurrentUser()
  const [dir, setDir] = useState<Direction>('INR_TO_IDR')
  const [inr, setInr] = useState('1000')
  const [idr, setIdr] = useState('')
  const [rate, setRate] = useState(RATES.INR)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function fetchRate(manual = false) {
    setStatus('loading')
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/INR')
      const data = await res.json()
      const r = data?.rates?.IDR
      if (typeof r === 'number' && r > 0) {
        setRate(r)
        setFetchedAt(new Date())
        setStatus('idle')
        if (manual) recompute('INR_TO_IDR', inr, r)
      } else { throw new Error('bad') }
    } catch { setStatus('error') }
  }

  useEffect(() => { fetchRate() /* eslint-disable-next-line */ }, [])

  function recompute(d: Direction, source: string, r = rate) {
    const n = parseFloat(source)
    if (isNaN(n) || n < 0) {
      if (d === 'INR_TO_IDR') setInr(source); else setIdr(source)
      return
    }
    if (d === 'INR_TO_IDR') { setInr(source); setIdr((n * r).toFixed(0)) }
    else { setIdr(source); setInr((n / r).toFixed(2)) }
  }

  function setFromInr(v: string) { setDir('INR_TO_IDR'); recompute('INR_TO_IDR', v) }
  function setFromIdr(v: string) { setDir('IDR_TO_INR'); recompute('IDR_TO_INR', v) }
  function swap() { setDir(d => d === 'INR_TO_IDR' ? 'IDR_TO_INR' : 'INR_TO_IDR') }

  const card: CSSProperties = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: 18,
  }
  const row: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '11px 14px',
  }

  return (
    <div data-testid="fx-tab">
      <TabHero tab="fx" user={user ?? undefined} />

      <div className="px-5 pt-5 pb-8 space-y-6">
        {/* Converter */}
        <div style={card} data-testid="fx-hero">
          <div className="flex items-center justify-between mb-4">
            <p className="serif-eyebrow" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              live rate
            </p>
            <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              1 INR = <span style={{ color: 'var(--text-primary)' }}>{rate.toFixed(2)}</span> IDR
            </p>
          </div>

          <label className="block mb-2.5">
            <p className="font-ui mb-1" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              ₹ INR
            </p>
            <NeonInput
              type="number"
              inputMode="decimal"
              value={inr}
              onChange={e => setFromInr(e.target.value)}
              style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}
              data-testid="fx-inr-input"
            />
          </label>

          <div className="flex justify-center my-1">
            <button
              onClick={swap}
              style={{
                fontSize: 14,
                color: 'var(--text-tertiary)',
                transform: dir === 'IDR_TO_INR' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease',
              }}
              data-testid="fx-swap"
              aria-label="Swap"
            >
              ↓
            </button>
          </div>

          <label className="block">
            <p className="font-ui mb-1" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Rp IDR
            </p>
            <NeonInput
              type="number"
              inputMode="decimal"
              value={idr}
              onChange={e => setFromIdr(e.target.value)}
              style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}
              data-testid="fx-idr-input"
            />
          </label>

          <div className="flex items-center justify-between mt-3">
            <p className="font-mono" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
              {fetchedAt
                ? `Updated ${fetchedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                : 'Fallback rate'}
              {status === 'error' && ' · offline'}
            </p>
            <button
              onClick={() => fetchRate(true)}
              disabled={status === 'loading'}
              className="font-ui"
              style={{ fontSize: 11, color: status === 'loading' ? 'var(--text-quaternary)' : 'var(--accent)' }}
              data-testid="fx-refresh"
            >
              {status === 'loading' ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Quick chips */}
        <section>
          <p className="serif-eyebrow mb-2.5" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>quick · INR</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} data-testid="fx-quick-inr">
            {QUICK_INR.map(n => (
              <button
                key={n}
                onClick={() => setFromInr(n.toString())}
                className="flex-shrink-0 font-ui px-3.5 py-1.5 rounded-full"
                style={{
                  fontSize: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
                data-testid={`fx-quick-inr-${n}`}
              >
                ₹{n.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <p className="serif-eyebrow mt-4 mb-2.5" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>quick · IDR</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} data-testid="fx-quick-idr">
            {QUICK_IDR.map(n => (
              <button
                key={n}
                onClick={() => setFromIdr(n.toString())}
                className="flex-shrink-0 font-ui px-3.5 py-1.5 rounded-full"
                style={{
                  fontSize: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
                data-testid={`fx-quick-idr-${n}`}
              >
                {formatIDR(n)}
              </button>
            ))}
          </div>
        </section>

        {/* Price guide */}
        <section>
          <p className="serif-eyebrow mb-3" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            bali price guide
          </p>
          <div className="space-y-1.5" data-testid="fx-price-guide">
            {PRICE_GUIDE.map((p, i) => (
              <div key={i} style={row}>
                <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-ui truncate" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p.label}</p>
                  {p.note && (
                    <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.note}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="serif-display" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{formatIDR(p.idr)}</p>
                  <p className="font-mono" style={{ fontSize: 9.5, color: 'var(--text-tertiary)' }}>≈ {formatINR(p.idr / rate)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-center mt-4" style={{ fontSize: 9.5, color: 'var(--text-quaternary)', letterSpacing: '0.18em' }}>
            * INDICATIVE MID-MARKET · TIP 10%
          </p>
        </section>
      </div>
    </div>
  )
}
