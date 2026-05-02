import { useState, useMemo, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import { USERS, USER_NAMES, type User } from '../constants/users'
import { toIDR, toINR, formatINR } from '../lib/currency'
import { NeonBtn } from './ui/NeonBtn'
import { NeonInput } from './ui/NeonInput'
import { Avatar } from './ui/Avatar'

interface Props {
  currentUser: User
  onClose: () => void
}

export function AddExpenseModal({ currentUser, onClose }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'IDR' | 'INR'>('INR')
  const [splitPayment, setSplitPayment] = useState(false)
  const [paidBy, setPaidBy] = useState<string>(currentUser.name)
  const [paidBySplits, setPaidBySplits] = useState<Record<string, string>>(
    Object.fromEntries(USERS.map(u => [u.name, '']))
  )
  const [splitAmong, setSplitAmong] = useState<string[]>(USER_NAMES)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalIDR = useMemo(() => toIDR(parseFloat(amount) || 0, currency), [amount, currency])

  const splitTotal = useMemo(() =>
    USERS.reduce((s, u) => s + (parseFloat(paidBySplits[u.name]) || 0), 0),
    [paidBySplits]
  )
  const splitTotalIDR = useMemo(() => toIDR(splitTotal, currency), [splitTotal, currency])
  const splitDiff = useMemo(() => Math.abs(splitTotalIDR - totalIDR), [splitTotalIDR, totalIDR])
  const splitOk = splitDiff < 2  // allow 1 IDR rounding

  function toggle(n: string) {
    setSplitAmong(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  function updateSplit(name: string, val: string) {
    setPaidBySplits(prev => ({ ...prev, [name]: val }))
  }

  async function save() {
    setError(null)
    const n = parseFloat(amount)
    if (!description.trim()) return setError('Description required')
    if (!n || n <= 0) return setError('Amount must be > 0')
    if (splitAmong.length === 0) return setError('Pick at least one person to split')

    if (splitPayment && !splitOk) {
      return setError(`Amounts must add up to ${currency === 'INR' ? formatINR(n) : amount + ' IDR'} (off by ${currency === 'INR' ? formatINR(toINR(splitDiff)) : splitDiff.toFixed(0) + ' IDR'})`)
    }

    setSaving(true)
    try {
      let paid_by_splits: Record<string, number> | null = null
      let paid_by = paidBy

      if (splitPayment) {
        paid_by_splits = {}
        for (const u of USERS) {
          const v = parseFloat(paidBySplits[u.name]) || 0
          if (v > 0) {
            paid_by_splits[u.name] = toIDR(v, currency)
          }
        }
        // paid_by = largest contributor (required by DB NOT NULL)
        const topEntry = Object.entries(paid_by_splits).sort((a, b) => b[1] - a[1])[0]
        paid_by = topEntry?.[0] ?? currentUser.name
      }

      const { error: insErr } = await supabase.from('expenses').insert({
        description: description.trim(),
        amount: n,
        currency,
        amount_idr: totalIDR,
        paid_by,
        paid_by_splits,
        split_among: splitAmong,
        split_mode: 'equal',
        created_by: currentUser.name,
        date: new Date().toISOString().slice(0, 10),
      })
      if (insErr) throw insErr
      onClose()
    } catch (e) {
      setError((e as Error).message || 'Insert failed')
    } finally {
      setSaving(false)
    }
  }

  const overlay: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(15, 11, 8, 0.78)',
    backdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  }
  const sheet: CSSProperties = {
    width: '100%', maxWidth: 480,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: 22,
    maxHeight: '88vh',
    overflowY: 'auto',
  }

  return (
    <div style={overlay} onClick={onClose} data-testid="add-expense-modal">
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400 }}>
            New expense
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)' }} data-testid="add-expense-close" aria-label="Close">✕</button>
        </div>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Description</p>
          <NeonInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Warung lunch, scooter rental…" data-testid="add-expense-description" />
        </label>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Amount</p>
          <div className="flex gap-2">
            <NeonInput
              type="number" inputMode="decimal"
              value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0" className="flex-1"
              data-testid="add-expense-amount"
            />
            <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {(['IDR', 'INR'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className="px-3.5 font-ui transition-all"
                  style={{ fontSize: 12, fontWeight: 500, background: currency === c ? 'var(--accent)' : 'transparent', color: currency === c ? '#1A0A03' : 'var(--text-secondary)' }}
                  data-testid={`add-expense-currency-${c.toLowerCase()}`}
                >{c}</button>
              ))}
            </div>
          </div>
        </label>

        {/* Paid by — toggle between single and split */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Paid by</p>
            <button
              onClick={() => setSplitPayment(v => !v)}
              className="font-ui px-2.5 py-1 rounded-full transition-all"
              style={{
                fontSize: 10,
                border: `1px solid ${splitPayment ? 'var(--accent)' : 'var(--border)'}`,
                background: splitPayment ? 'rgba(255,139,77,0.12)' : 'transparent',
                color: splitPayment ? 'var(--accent)' : 'var(--text-tertiary)',
                letterSpacing: '0.08em',
              }}
            >
              {splitPayment ? '✓ Split payment' : 'Split payment'}
            </button>
          </div>

          {!splitPayment ? (
            <div className="flex gap-1.5 flex-wrap">
              {USERS.map(u => {
                const active = paidBy === u.name
                return (
                  <button key={u.name} onClick={() => setPaidBy(u.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                    style={{ fontSize: 12, background: active ? 'rgba(245,241,235,0.06)' : 'transparent', border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`, color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                    data-testid={`paidby-${u.name.toLowerCase()}`}
                  >
                    <Avatar name={u.name} color={u.color} size={16} />
                    <span>{u.name}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {USERS.map(u => {
                const val = paidBySplits[u.name]
                const hasVal = parseFloat(val) > 0
                return (
                  <div key={u.name} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 w-28 shrink-0">
                      <Avatar name={u.name} color={u.color} size={18} />
                      <p className="font-ui" style={{ fontSize: 12, color: hasVal ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{u.name}</p>
                    </div>
                    <NeonInput
                      type="number" inputMode="decimal"
                      value={val}
                      onChange={e => updateSplit(u.name, e.target.value)}
                      placeholder="0"
                      className="flex-1"
                      style={{ borderColor: hasVal ? `${u.color}66` : undefined }}
                    />
                    <span className="font-ui shrink-0" style={{ fontSize: 11, color: 'var(--text-tertiary)', width: 28 }}>{currency}</span>
                  </div>
                )
              })}
              {/* Total indicator */}
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 mt-1"
                style={{
                  background: splitOk ? 'rgba(0,255,209,0.06)' : 'rgba(255,139,77,0.08)',
                  border: `1px solid ${splitOk ? 'rgba(0,255,209,0.3)' : 'rgba(255,139,77,0.4)'}`,
                }}
              >
                <p className="font-ui" style={{ fontSize: 11, color: splitOk ? '#00FFD1' : 'var(--accent)' }}>
                  {splitOk ? '✓ Amounts match' : `Total: ${splitTotal.toFixed(2)} ${currency} — need ${parseFloat(amount) || 0} ${currency}`}
                </p>
                <p className="font-mono" style={{ fontSize: 11, color: splitOk ? '#00FFD1' : 'var(--accent)' }}>
                  {currency === 'INR' ? formatINR(splitTotal) : `${splitTotal.toFixed(0)}`}
                  {' / '}
                  {currency === 'INR' ? formatINR(parseFloat(amount) || 0) : `${parseFloat(amount) || 0}`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Split equally among</p>
            <button onClick={() => setSplitAmong(splitAmong.length === USERS.length ? [currentUser.name] : USER_NAMES)}
              className="font-ui" style={{ fontSize: 11, color: 'var(--accent)' }}
              data-testid="toggle-all-split"
            >
              {splitAmong.length === USERS.length ? 'Clear' : 'All'}
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = splitAmong.includes(u.name)
              return (
                <button key={u.name} onClick={() => toggle(u.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{ fontSize: 12, background: active ? 'rgba(245,241,235,0.06)' : 'transparent', border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`, color: active ? 'var(--text-primary)' : 'var(--text-quaternary)' }}
                  data-testid={`split-${u.name.toLowerCase()}`}
                >
                  <Avatar name={u.name} color={u.color} size={16} />
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>}

        <div className="flex gap-2">
          <NeonBtn onClick={save} disabled={saving} className="flex-1" data-testid="add-expense-save">
            {saving ? 'Saving…' : 'Save expense'}
          </NeonBtn>
          <NeonBtn variant="ghost" onClick={onClose} data-testid="add-expense-cancel">Cancel</NeonBtn>
        </div>
      </div>
    </div>
  )
}
