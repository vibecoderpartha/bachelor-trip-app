import { useState, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import { USERS, USER_MAP, USER_NAMES, type User } from '../constants/users'
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
  const [currency, setCurrency] = useState<'IDR' | 'INR'>('IDR')
  const [paidBy, setPaidBy] = useState<string>(currentUser.name)
  const [splitAmong, setSplitAmong] = useState<string[]>(USER_NAMES)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleSplit(name: string) {
    setSplitAmong(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    )
  }

  async function save() {
    setError(null)
    const n = parseFloat(amount)
    if (!description.trim()) return setError('Description required')
    if (!n || n <= 0) return setError('Amount must be > 0')
    if (splitAmong.length === 0) return setError('Pick at least one person')

    setSaving(true)
    try {
      const amount_idr = toIDR(n, currency)
      const { error: insErr } = await supabase.from('expenses').insert({
        description: description.trim(),
        amount: n,
        currency,
        amount_idr,
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
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(5,3,8,0.92)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  }

  const sheet: CSSProperties = {
    width: '100%',
    maxWidth: 480,
    background: '#0a0510',
    borderTop: `2px solid ${currentUser.color}`,
    borderRadius: '16px 16px 0 0',
    padding: 20,
    maxHeight: '92vh',
    overflowY: 'auto',
    boxShadow: `0 -20px 40px ${currentUser.color}22`,
  }

  return (
    <div style={overlay} onClick={onClose} data-testid="add-expense-modal">
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <p
            className="font-display tracking-widest"
            style={{ fontSize: 16, color: currentUser.color, textShadow: `0 0 10px ${currentUser.color}` }}
          >
            + ADD EXPENSE
          </p>
          <button
            onClick={onClose}
            className="font-mono"
            style={{ fontSize: 18, color: '#666' }}
            data-testid="add-expense-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <label className="font-mono block mb-3" style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>
          DESCRIPTION
          <NeonInput
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Warung lunch, Scooter rental"
            color={currentUser.color}
            className="mt-1.5"
            data-testid="add-expense-description"
          />
        </label>

        {/* Amount + currency */}
        <label className="font-mono block mb-3" style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>
          AMOUNT
          <div className="flex gap-2 mt-1.5">
            <NeonInput
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              color={currentUser.color}
              className="flex-1"
              data-testid="add-expense-amount"
            />
            <div className="flex rounded-sm overflow-hidden" style={{ border: `1px solid ${currentUser.color}44` }}>
              {(['IDR', 'INR'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className="px-3 font-mono transition-all"
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    background: currency === c ? `${currentUser.color}33` : 'transparent',
                    color: currency === c ? currentUser.color : '#666',
                  }}
                  data-testid={`add-expense-currency-${c.toLowerCase()}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </label>

        {/* Paid by */}
        <div className="mb-3">
          <p className="font-mono mb-1.5" style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>PAID BY</p>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = paidBy === u.name
              return (
                <button
                  key={u.name}
                  onClick={() => setPaidBy(u.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm font-ui transition-all"
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    background: active ? `${u.color}22` : 'transparent',
                    border: `1px solid ${active ? u.color : `${u.color}33`}`,
                    color: active ? u.color : `${u.color}88`,
                    boxShadow: active ? `0 0 10px ${u.color}44` : 'none',
                  }}
                  data-testid={`paidby-${u.name.toLowerCase()}`}
                >
                  <span>{u.emoji}</span>
                  <span className="uppercase">{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Split among */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-mono" style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>SPLIT EQUALLY AMONG</p>
            <button
              onClick={() => setSplitAmong(splitAmong.length === USERS.length ? [currentUser.name] : USER_NAMES)}
              className="font-mono"
              style={{ fontSize: 9, color: currentUser.color, letterSpacing: 2 }}
              data-testid="toggle-all-split"
            >
              {splitAmong.length === USERS.length ? 'CLEAR' : 'ALL'}
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {USERS.map(u => {
              const active = splitAmong.includes(u.name)
              return (
                <button
                  key={u.name}
                  onClick={() => toggleSplit(u.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm font-ui transition-all"
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    background: active ? `${u.color}22` : 'transparent',
                    border: `1px solid ${active ? u.color : 'rgba(255,255,255,0.08)'}`,
                    color: active ? u.color : '#444',
                  }}
                  data-testid={`split-${u.name.toLowerCase()}`}
                >
                  <span>{u.emoji}</span>
                  <span className="uppercase">{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="font-mono mb-3" style={{ fontSize: 11, color: 'var(--neon-pink)', letterSpacing: 1 }}>
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <NeonBtn
            color={currentUser.color}
            onClick={save}
            disabled={saving}
            className="flex-1"
            data-testid="add-expense-save"
          >
            {saving ? 'SAVING…' : 'SAVE'}
          </NeonBtn>
          <NeonBtn
            color="rgba(255,255,255,0.25)"
            variant="outline"
            onClick={onClose}
            data-testid="add-expense-cancel"
          >
            CANCEL
          </NeonBtn>
        </div>

        {/* prevent USER_MAP unused warning */}
        <span hidden>{USER_MAP[currentUser.name]?.emoji}</span>
      </div>
    </div>
  )
}
