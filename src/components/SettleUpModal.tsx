import { useMemo, useState, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import type { Expense, Settlement } from '../lib/splitting'
import { computeBalances, settleUp } from '../lib/splitting'
import { USER_MAP, type User } from '../constants/users'
import { formatIDR, formatINR, toINR } from '../lib/currency'
import { NeonBtn } from './ui/NeonBtn'

interface Props {
  currentUser: User
  expenses: Expense[]
  settlements: Settlement[]
  onClose: () => void
}

export function SettleUpModal({ currentUser, expenses, settlements, onClose }: Props) {
  const [recording, setRecording] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const balances = useMemo(
    () => computeBalances(expenses, settlements),
    [expenses, settlements],
  )
  const txns = useMemo(() => settleUp(balances), [balances])

  async function recordSettlement(from: string, to: string, amount: number) {
    setError(null)
    setRecording(`${from}->${to}`)
    try {
      const { error: insErr } = await supabase.from('settlements').insert({
        from_user: from,
        to_user: to,
        amount,
        currency: 'IDR',
        recorded_by: currentUser.name,
      })
      if (insErr) throw insErr
    } catch (e) {
      setError((e as Error).message || 'Failed')
    } finally {
      setRecording(null)
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
    borderTop: `2px solid var(--neon-gold)`,
    borderRadius: '16px 16px 0 0',
    padding: 20,
    maxHeight: '92vh',
    overflowY: 'auto',
  }

  return (
    <div style={overlay} onClick={onClose} data-testid="settle-up-modal">
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <p
            className="font-display tracking-widest"
            style={{ fontSize: 16, color: 'var(--neon-gold)', textShadow: '0 0 10px var(--neon-gold)' }}
          >
            ⚡ SETTLE UP
          </p>
          <button
            onClick={onClose}
            className="font-mono"
            style={{ fontSize: 18, color: '#666' }}
            data-testid="settle-up-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {txns.length === 0 ? (
          <div className="text-center py-8">
            <p
              className="font-display tracking-widest"
              style={{ fontSize: 20, color: 'var(--neon-cyan)', textShadow: '0 0 12px var(--neon-cyan)' }}
              data-testid="all-settled-msg"
            >
              ALL SETTLED UP ✓
            </p>
            <p className="font-mono mt-2" style={{ fontSize: 11, color: '#555', letterSpacing: 2 }}>
              No one owes anyone. Party on.
            </p>
          </div>
        ) : (
          <>
            <p
              className="font-mono mb-3"
              style={{ fontSize: 10, color: '#666', letterSpacing: 3 }}
            >
              ◆ SUGGESTED · {txns.length} TRANSACTION{txns.length > 1 ? 'S' : ''}
            </p>
            <div className="space-y-2 mb-4" data-testid="settle-up-txns">
              {txns.map((t, i) => {
                const from = USER_MAP[t.from]
                const to = USER_MAP[t.to]
                const mine = t.from === currentUser.name || t.to === currentUser.name
                const key = `${t.from}->${t.to}`
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-sm"
                    style={{
                      background: mine ? `${currentUser.color}10` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${mine ? `${currentUser.color}44` : 'rgba(255,255,255,0.05)'}`,
                    }}
                    data-testid={`settle-txn-${i}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span style={{ fontSize: 20, color: from?.color }}>{from?.emoji}</span>
                      <div>
                        <p className="font-display uppercase" style={{ fontSize: 11, color: from?.color }}>
                          {from?.name}
                        </p>
                        <p className="font-mono" style={{ fontSize: 8, color: '#555', letterSpacing: 2 }}>
                          OWES
                        </p>
                      </div>
                      <span style={{ color: '#444', fontSize: 14 }}>→</span>
                      <span style={{ fontSize: 20, color: to?.color }}>{to?.emoji}</span>
                      <p className="font-display uppercase" style={{ fontSize: 11, color: to?.color }}>
                        {to?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display" style={{ fontSize: 14, color: 'var(--neon-gold)' }}>
                        {formatIDR(t.amount)}
                      </p>
                      <p className="font-mono" style={{ fontSize: 8, color: '#555' }}>
                        ≈ {formatINR(toINR(t.amount))}
                      </p>
                    </div>
                    {mine && t.from === currentUser.name && (
                      <NeonBtn
                        color="var(--neon-cyan)"
                        onClick={() => recordSettlement(t.from, t.to, t.amount)}
                        disabled={recording === key}
                        className="ml-1"
                        style={{ fontSize: 10, padding: '4px 8px' }}
                        data-testid={`settle-record-${i}`}
                      >
                        {recording === key ? '…' : 'PAID'}
                      </NeonBtn>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {error && (
          <p className="font-mono mb-3" style={{ fontSize: 11, color: 'var(--neon-pink)' }}>
            {error}
          </p>
        )}

        <NeonBtn
          color="rgba(255,255,255,0.25)"
          variant="outline"
          onClick={onClose}
          className="w-full"
          data-testid="settle-up-done"
        >
          DONE
        </NeonBtn>
      </div>
    </div>
  )
}
