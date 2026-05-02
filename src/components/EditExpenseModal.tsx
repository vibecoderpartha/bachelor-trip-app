import { useState, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import { USERS, USER_NAMES, type User } from '../constants/users'
import { toIDR } from '../lib/currency'
import { NeonBtn } from './ui/NeonBtn'
import { NeonInput } from './ui/NeonInput'
import type { Expense } from '../lib/splitting'

interface Props {
  expense: Expense
  currentUser: User
  onClose: () => void
}

export function EditExpenseModal({ expense, currentUser, onClose }: Props) {
  const [description, setDescription] = useState(expense.description)
  const [amount, setAmount] = useState(String(expense.amount))
  const [currency, setCurrency] = useState<'IDR' | 'INR'>(expense.currency as 'IDR' | 'INR')
  const [paidBy, setPaidBy] = useState(expense.paid_by)
  const [splitAmong, setSplitAmong] = useState<string[]>(expense.split_among)
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
      const { error: updErr } = await supabase.from('expenses').update({
        description: description.trim(),
        amount: n,
        currency,
        amount_idr: toIDR(n, currency),
        paid_by: paidBy,
        split_among: splitAmong,
        split_mode: 'equal',
      }).eq('id', expense.id)
      if (updErr) throw updErr
      onClose()
    } catch (e) {
      setError((e as Error).message || 'Update failed')
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
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400 }}>
            Edit expense
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Description</p>
          <NeonInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Warung lunch…" />
        </label>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Amount</p>
          <div className="flex gap-2">
            <NeonInput
              type="number" inputMode="decimal"
              value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0" className="flex-1"
            />
            <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {(['INR', 'IDR'] as const).map(c => (
                <button
                  key={c} onClick={() => setCurrency(c)}
                  className="px-3.5 font-ui transition-all"
                  style={{ fontSize: 12, fontWeight: 500, background: currency === c ? 'var(--accent)' : 'transparent', color: currency === c ? '#1A0A03' : 'var(--text-secondary)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </label>

        <div className="mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Paid by</p>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = paidBy === u.name
              return (
                <button key={u.name} onClick={() => setPaidBy(u.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{ fontSize: 12, background: active ? 'rgba(245,241,235,0.06)' : 'transparent', border: `1px solid ${active ? `${u.color}88` : 'var(--border)'}`, color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
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
            <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Split equally among</p>
            <button onClick={() => setSplitAmong(splitAmong.length === USERS.length ? [currentUser.name] : USER_NAMES)}
              className="font-ui" style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                >
                  <span style={{ fontSize: 13 }}>{u.emoji}</span>
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>}

        <div className="flex gap-2">
          <NeonBtn onClick={save} disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Save changes'}</NeonBtn>
          <NeonBtn variant="ghost" onClick={onClose}>Cancel</NeonBtn>
        </div>
      </div>
    </div>
  )
}
