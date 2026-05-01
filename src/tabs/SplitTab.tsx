import { useMemo, useState } from 'react'
import { type User } from '../constants/users'
import { useExpenses } from '../hooks/useExpenses'
import { useSettlements } from '../hooks/useSettlements'
import { computeBalances } from '../lib/splitting'
import { BalanceHero } from '../components/BalanceHero'
import { ExpenseCard } from '../components/ExpenseCard'
import { AddExpenseModal } from '../components/AddExpenseModal'
import { SettleUpModal } from '../components/SettleUpModal'
import { NeonBtn } from '../components/ui/NeonBtn'
import { VIPBadge } from '../components/ui/VIPBadge'
import { formatIDR } from '../lib/currency'

interface Props { user: User }

export function SplitTab({ user }: Props) {
  const { expenses, loading } = useExpenses()
  const { settlements } = useSettlements()
  const [showAdd, setShowAdd] = useState(false)
  const [showSettle, setShowSettle] = useState(false)

  const balances = useMemo(
    () => computeBalances(expenses, settlements),
    [expenses, settlements],
  )

  const totalPool = useMemo(
    () => expenses.reduce((s, e) => s + (Number(e.amount_idr) || 0), 0),
    [expenses],
  )

  return (
    <div className="px-4 pt-4 pb-8" data-testid="split-tab">
      <BalanceHero balances={balances} currentUser={user} />

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <NeonBtn
          color={user.color}
          onClick={() => setShowAdd(true)}
          className="flex-1"
          data-testid="add-expense-btn"
        >
          + ADD EXPENSE
        </NeonBtn>
        <NeonBtn
          color="var(--neon-gold)"
          variant="outline"
          onClick={() => setShowSettle(true)}
          className="flex-1"
          data-testid="settle-up-btn"
        >
          ⚡ SETTLE UP
        </NeonBtn>
      </div>

      {/* Pool stats */}
      <div className="flex items-center justify-between mt-5 mb-2 px-1">
        <p
          className="font-mono"
          style={{ fontSize: 10, color: '#666', letterSpacing: 3 }}
        >
          ◆ EXPENSE LOG · {expenses.length} ITEMS
        </p>
        <VIPBadge color="var(--neon-gold)">POOL {formatIDR(totalPool)}</VIPBadge>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: 78, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}
            />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div
          className="text-center py-12 font-mono"
          style={{ fontSize: 11, color: '#555', letterSpacing: 3 }}
          data-testid="expenses-empty"
        >
          NO EXPENSES YET · TAP + TO ADD
        </div>
      ) : (
        <div className="space-y-2" data-testid="expense-list">
          {expenses.map(e => (
            <ExpenseCard key={e.id} expense={e} currentUserName={user.name} />
          ))}
        </div>
      )}

      {/* Settlement history */}
      {settlements.length > 0 && (
        <>
          <p
            className="font-mono mt-6 mb-2 px-1"
            style={{ fontSize: 10, color: '#666', letterSpacing: 3 }}
          >
            ◆ SETTLEMENTS · {settlements.length}
          </p>
          <div className="space-y-1.5" data-testid="settlement-list">
            {settlements.slice(0, 10).map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-sm px-3 py-2"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <p className="font-mono" style={{ fontSize: 11, color: '#888', letterSpacing: 1 }}>
                  {s.from_user} → {s.to_user}
                </p>
                <p className="font-display" style={{ fontSize: 11, color: 'var(--neon-cyan)' }}>
                  {formatIDR(Number(s.amount))}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {showAdd && <AddExpenseModal currentUser={user} onClose={() => setShowAdd(false)} />}
      {showSettle && (
        <SettleUpModal
          currentUser={user}
          expenses={expenses}
          settlements={settlements}
          onClose={() => setShowSettle(false)}
        />
      )}
    </div>
  )
}
