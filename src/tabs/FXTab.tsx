import { useEffect, useState, type CSSProperties } from 'react'
import { NeonInput } from '../components/ui/NeonInput'
import { VIPBadge } from '../components/ui/VIPBadge'
import { RATES, formatIDR, formatINR } from '../lib/currency'

type Direction = 'INR_TO_IDR' | 'IDR_TO_INR'

const QUICK_INR = [500, 1000, 5000, 10000, 20000]
const QUICK_IDR = [100_000, 500_000, 1_000_000, 2_500_000, 5_000_000]

interface PriceRow {
  icon: string
  label: string
  idr: number
  note?: string
}

const PRICE_GUIDE: PriceRow[] = [
  { icon: '☕', label: 'Kopi / Iced latte',       idr: 35_000,    note: 'street café' },
  { icon: '🍺', label: 'Bintang beer (large)',    idr: 55_000,    note: 'warung' },
  { icon: '🍜', label: 'Nasi goreng / Mie',       idr: 45_000,    note: 'warung' },
  { icon: '🍽️', label: 'Beach-club dinner',       idr: 400_000,   note: 'per head' },
  { icon: '🛵', label: 'Scooter / day',            idr: 80_000 },
  { icon: '🚕', label: 'Grab · airport → seminyak', idr: 220_000 },
  { icon: '🏄', label: 'Surf lesson · 2h',         idr: 500_000 },
  { icon: '⛴️', label: 'Fast boat · Sanur → Penida (RT)', idr: 400_000 },
  { icon: '🏨', label: 'Pool villa / night',       idr: 3_700_000, note: 'split 5x ≈ 740k ea' },
  { icon: '💆', label: 'Balinese massage · 60min', idr: 250_000 },
]

export function FXTab() {
  const [dir, setDir] = useState<Direction>('INR_TO_IDR')
  const [inr, setInr] = useState<string>('1000')
  const [idr, setIdr] = useState<string>('')
  const [rate, setRate] = useState<number>(RATES.INR) // IDR per 1 INR
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  // Fetch live rate
  async function fetchRate(manual = false) {
    setStatus('loading')
    try {
      // open.er-api.com — free, keyless, CORS-open
      const res = await fetch('https://open.er-api.com/v6/latest/INR')
      const data = await res.json()
      const idrRate = data?.rates?.IDR
      if (typeof idrRate === 'number' && idrRate > 0) {
        setRate(idrRate)
        setFetchedAt(new Date())
        setStatus('idle')
        if (manual) recompute('INR_TO_IDR', inr, idrRate)
      } else {
        throw new Error('bad payload')
      }
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchRate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function recompute(d: Direction, source: string, r = rate) {
    const n = parseFloat(source)
    if (isNaN(n) || n < 0) {
      setInr(d === 'INR_TO_IDR' ? source : '')
      setIdr(d === 'IDR_TO_INR' ? source : '')
      return
    }
    if (d === 'INR_TO_IDR') {
      setInr(source)
      setIdr((n * r).toFixed(0))
    } else {
      setIdr(source)
      setInr((n / r).toFixed(2))
    }
  }

  function setFromInr(v: string) {
    setDir('INR_TO_IDR')
    recompute('INR_TO_IDR', v)
  }

  function setFromIdr(v: string) {
    setDir('IDR_TO_INR')
    recompute('IDR_TO_INR', v)
  }

  function swap() {
    const newDir: Direction = dir === 'INR_TO_IDR' ? 'IDR_TO_INR' : 'INR_TO_IDR'
    setDir(newDir)
  }

  const heroStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255, 214, 0, 0.25)',
    borderRadius: 10,
    padding: 16,
  }

  const rowStyle: CSSProperties = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 6,
    padding: '10px 12px',
  }

  return (
    <div className="px-4 pt-4 pb-8" data-testid="fx-tab">
      {/* Converter hero */}
      <div
        className="corner-bracket"
        style={{ ...heroStyle, color: 'var(--neon-gold)' }}
        data-testid="fx-hero"
      >
        <div className="flex items-center justify-between mb-3">
          <p
            className="font-mono"
            style={{ fontSize: 9, letterSpacing: 4, color: '#666' }}
          >
            ◆ FX · IDR ↔ INR
          </p>
          <VIPBadge color="var(--neon-gold)">
            1 INR = {rate.toFixed(2)} IDR
          </VIPBadge>
        </div>

        {/* INR input */}
        <label className="block mb-2">
          <p
            className="font-mono mb-1"
            style={{ fontSize: 9, letterSpacing: 3, color: '#555' }}
          >
            ₹ INR
          </p>
          <NeonInput
            type="number"
            inputMode="decimal"
            value={inr}
            onChange={e => setFromInr(e.target.value)}
            color="var(--neon-gold)"
            style={{ fontSize: 18 }}
            data-testid="fx-inr-input"
          />
        </label>

        {/* Swap */}
        <div className="flex justify-center my-1">
          <button
            onClick={swap}
            className="font-display"
            style={{
              fontSize: 16,
              color: '#777',
              transform: dir === 'IDR_TO_INR' ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
            }}
            data-testid="fx-swap"
            aria-label="Swap direction"
          >
            ↓
          </button>
        </div>

        {/* IDR input */}
        <label className="block">
          <p
            className="font-mono mb-1"
            style={{ fontSize: 9, letterSpacing: 3, color: '#555' }}
          >
            Rp IDR
          </p>
          <NeonInput
            type="number"
            inputMode="decimal"
            value={idr}
            onChange={e => setFromIdr(e.target.value)}
            color="var(--neon-cyan)"
            style={{ fontSize: 18 }}
            data-testid="fx-idr-input"
          />
        </label>

        {/* Rate meta */}
        <div className="flex items-center justify-between mt-3">
          <p
            className="font-mono"
            style={{ fontSize: 9, color: '#555', letterSpacing: 1 }}
          >
            {fetchedAt
              ? `UPDATED ${fetchedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
              : 'FALLBACK RATE'}
            {status === 'error' && ' · OFFLINE'}
          </p>
          <button
            onClick={() => fetchRate(true)}
            className="font-mono"
            style={{
              fontSize: 10,
              color: status === 'loading' ? '#444' : 'var(--neon-gold)',
              letterSpacing: 2,
            }}
            disabled={status === 'loading'}
            data-testid="fx-refresh"
          >
            {status === 'loading' ? '…' : '↻ REFRESH'}
          </button>
        </div>
      </div>

      {/* Quick chips */}
      <div className="mt-4">
        <p
          className="font-mono mb-2 px-1"
          style={{ fontSize: 9, letterSpacing: 3, color: '#555' }}
        >
          ◆ QUICK CONVERT · INR
        </p>
        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
          data-testid="fx-quick-inr"
        >
          {QUICK_INR.map(n => (
            <button
              key={n}
              onClick={() => setFromInr(n.toString())}
              className="flex-shrink-0 font-mono px-3 py-1.5 rounded-sm"
              style={{
                fontSize: 11,
                background: 'rgba(255,214,0,0.05)',
                border: '1px solid rgba(255,214,0,0.25)',
                color: 'var(--neon-gold)',
                letterSpacing: 1,
              }}
              data-testid={`fx-quick-inr-${n}`}
            >
              ₹{n.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        <p
          className="font-mono mt-3 mb-2 px-1"
          style={{ fontSize: 9, letterSpacing: 3, color: '#555' }}
        >
          ◆ QUICK CONVERT · IDR
        </p>
        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
          data-testid="fx-quick-idr"
        >
          {QUICK_IDR.map(n => (
            <button
              key={n}
              onClick={() => setFromIdr(n.toString())}
              className="flex-shrink-0 font-mono px-3 py-1.5 rounded-sm"
              style={{
                fontSize: 11,
                background: 'rgba(0,255,209,0.05)',
                border: '1px solid rgba(0,255,209,0.25)',
                color: 'var(--neon-cyan)',
                letterSpacing: 1,
              }}
              data-testid={`fx-quick-idr-${n}`}
            >
              {formatIDR(n)}
            </button>
          ))}
        </div>
      </div>

      {/* Bali price guide */}
      <div className="mt-6">
        <p
          className="font-mono mb-2 px-1"
          style={{ fontSize: 10, letterSpacing: 3, color: '#666' }}
        >
          ◆ BALI PRICE GUIDE · BALLPARK
        </p>
        <div className="space-y-1.5" data-testid="fx-price-guide">
          {PRICE_GUIDE.map((p, i) => (
            <div key={i} style={rowStyle} className="flex items-center gap-3">
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{p.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-ui truncate" style={{ fontSize: 12, color: '#fff', letterSpacing: 0.5 }}>
                  {p.label}
                </p>
                {p.note && (
                  <p className="font-mono" style={{ fontSize: 9, color: '#555', letterSpacing: 1 }}>
                    {p.note}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p
                  className="font-display"
                  style={{ fontSize: 12, color: 'var(--neon-gold)' }}
                >
                  {formatIDR(p.idr)}
                </p>
                <p className="font-mono" style={{ fontSize: 9, color: '#555' }}>
                  ≈ {formatINR(p.idr / rate)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p
          className="font-mono text-center mt-3"
          style={{ fontSize: 9, color: '#333', letterSpacing: 3 }}
        >
          * INDICATIVE MID-MARKET · TIP 10%
        </p>
      </div>
    </div>
  )
}
