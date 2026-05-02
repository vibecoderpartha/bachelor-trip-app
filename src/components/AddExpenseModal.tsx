import { useState, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import { USERS, USER_NAMES, type User } from '../constants/users'
import { toIDR } from '../lib/currency'
import { NeonBtn } from './ui/NeonBtn'
import { NeonInput } from './ui/NeonInput'

interface Props {
  currentUser: User
  onClose: () => void
}

export function AddExpenseModal({ currentUser, onClose }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'IDR' | 'INR'>('INR')
  const [paidBy, setPaidBy] = useState<string>(currentUser.name)
  const [splitAmong, setSplitAmong] = useState<string[]>(USER_NAMES)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(n: string) {
    setSplitAmong(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  async function save() {
    setError(null)
    const n = parseFloat(amount)
    if (!description.trim()) return setError('Description required')
    if (!n || n <= 0) return setError('Amount must be > 0')
    if (splitAmong.length === 0) return setError('Pick at least one person')

    setSaving(true)
    try {
      const { error: insErr } = await supabase.from('expenses').insert({
        description: description.trim(),
        amount: n,
        currency,
        amount_idr: toIDR(n, currency),
        paid_by: paidBy,
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
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }
  const sheet: CSSProperties = {
    width: '100%', maxWidth: 480,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    borderRadius: '20px 20px 0 0',
    padding: 22,
    maxHeight: '92vh',
    overflowY: 'auto',
  }

  return (
    <div style={overlay} onClick={onClose} data-testid="add-expense-modal">
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400 }}>
            New expense
          </p>
          <button
            onClick={onClose}
            style={{ fontSize: 18, color: 'var(--text-tertiary)' }}
            data-testid="add-expense-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Description
          </p>
          <NeonInput
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Warung lunch, scooter rental…"
            data-testid="add-expense-description"
          />
        </label>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Amount
          </p>
          <div className="flex gap-2">
            <NeonInput
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1"
              data-testid="add-expense-amount"
            />
            <div
              className="flex rounded-md overflow-hidden"
              style={{ border: '1px solid var(--border)' }}
            >
              {(['IDR', 'INR'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className="px-3.5 font-ui transition-all"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    background: currency === c ? 'var(--accent)' : 'transparent',
                    color: currency === c ? '#1A0A03' : 'var(--text-secondary)',
                  }}
                  data-testid={`add-expense-currency-${c.toLowerCase()}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </label>

        <div className="mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Paid by
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = paidBy === u.name
              return (
                <button
                  key={u.name}
                  onClick={() => setPaidBy(u.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize: 12,
                    background: active ? 'rgba(245,241,235,0.06)' : 'transparent',
                    border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`,
                    color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                  data-testid={`paidby-${u.name.toLowerCase()}`}
                >
                  <span style={{ fontSize: 13 }}>{u.emoji}</span>
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Split equally among
            </p>
            <button
              onClick={() => setSplitAmong(splitAmong.length === USERS.length ? [currentUser.name] : USER_NAMES)}
              className="font-ui"
              style={{ fontSize: 11, color: 'var(--accent)' }}
              data-testid="toggle-all-split"
            >
              {splitAmong.length === USERS.length ? 'Clear' : 'All'}
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = splitAmong.includes(u.name)
              return (
                <button
                  key={u.name}
                  onClick={() => toggle(u.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize: 12,
                    background: active ? 'rgba(245,241,235,0.06)' : 'transparent',
                    border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`,
                    color: active ? 'var(--text-primary)' : 'var(--text-quaternary)',
                  }}
                  data-testid={`split-${u.name.toLowerCase()}`}
                >
                  <span style={{ fontSize: 13 }}>{u.emoji}</span>
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <NeonBtn onClick={save} disabled={saving} className="flex-1" data-testid="add-expense-save">
            {saving ? 'Saving…' : 'Save expense'}
          </NeonBtn>
          <NeonBtn variant="ghost" onClick={onClose} data-testid="add-expense-cancel">
            Cancel
          </NeonBtn>
        </div>
      </div>
    </div>
  )
}
