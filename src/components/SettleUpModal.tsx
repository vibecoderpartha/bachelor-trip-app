import { useMemo, useState, type CSSProperties } from 'react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { supabase } from '../lib/supabase'
import type { Expense, Settlement } from '../lib/splitting'
import { computeBalances, settleUp } from '../lib/splitting'
import { USER_MAP, type User } from '../constants/users'
import { formatIDR, formatINR, toINR } from '../lib/currency'
import { NeonBtn } from './ui/NeonBtn'
import { Avatar } from './ui/Avatar'

interface Props {
  currentUser: User
  expenses: Expense[]
  settlements: Settlement[]
  onClose: () => void
}

export function SettleUpModal({ currentUser, expenses, settlements, onClose }: Props) {
  useBodyScrollLock()
  const [recording, setRecording] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const balances = useMemo(() => computeBalances(expenses, settlements), [expenses, settlements])
  const txns = useMemo(() => settleUp(balances), [balances])

  async function record(from: string, to: string, amount: number) {
    setError(null)
    setRecording(`${from}->${to}`)
    try {
      const { error: insErr } = await supabase.from('settlements').insert({
        from_user: from, to_user: to, amount, currency: 'IDR', recorded_by: currentUser.name,
      })
      if (insErr) throw insErr
    } catch (e) { setError((e as Error).message || 'Failed') }
    finally { setRecording(null) }
  }

  const overlay: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(15, 11, 8, 0.78)',
    backdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto', overscrollBehavior: 'contain',
  }
  const sheet: CSSProperties = {
    width: '100%', maxWidth: 480,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: 22,
    margin: '16px auto',
  }

  return (
    <div style={overlay} onClick={onClose} data-testid="settle-up-modal">
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400 }}>
            Settle up
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)' }} data-testid="settle-up-close" aria-label="Close">
            ✕
          </button>
        </div>

        {txns.length === 0 ? (
          <div className="text-center py-8">
            <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)' }} data-testid="all-settled-msg">
              All settled up.
            </p>
            <p className="font-ui mt-2" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Nobody owes anyone. Pour another Bintang.
            </p>
          </div>
        ) : (
          <>
            <p className="serif-eyebrow mb-3" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {txns.length} suggested transfer{txns.length > 1 ? 's' : ''}
            </p>
            <div className="space-y-2 mb-4" data-testid="settle-up-txns">
              {txns.map((t, i) => {
                const from = USER_MAP[t.from], to = USER_MAP[t.to]
                const mine = t.from === currentUser.name
                const key = `${t.from}->${t.to}`
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: mine ? 'rgba(255,139,77,0.07)' : 'var(--bg-card)',
                      border: `1px solid ${mine ? 'rgba(255,139,77,0.3)' : 'var(--border)'}`,
                    }}
                    data-testid={`settle-txn-${i}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {from && <Avatar name={from.name} color={from.color} size={24} />}
                      <span className="serif-display" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{from?.name}</span>
                      <span style={{ color: 'var(--text-quaternary)' }}>→</span>
                      {to && <Avatar name={to.name} color={to.color} size={24} />}
                      <span className="serif-display" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{to?.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="serif-display" style={{ fontSize: 15, color: 'var(--text-primary)' }}>{formatINR(toINR(t.amount))}</p>
                      <p className="font-mono" style={{ fontSize: 9.5, color: 'var(--text-tertiary)' }}>{formatIDR(t.amount)}</p>
                    </div>
                    {mine && (
                      <NeonBtn
                        onClick={() => record(t.from, t.to, t.amount)}
                        disabled={recording === key}
                        style={{ padding: '6px 12px', fontSize: 11 }}
                        data-testid={`settle-record-${i}`}
                      >
                        {recording === key ? '…' : 'Paid'}
                      </NeonBtn>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {error && <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>}

        <NeonBtn variant="ghost" onClick={onClose} className="w-full" data-testid="settle-up-done">
          Done
        </NeonBtn>
      </div>
    </div>
  )
}
