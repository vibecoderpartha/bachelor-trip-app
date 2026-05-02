import { useMemo, useState } from 'react'
import { type User } from '../constants/users'
import { useExpenses } from '../hooks/useExpenses'
import { useSettlements } from '../hooks/useSettlements'
import { computeBalances, type Expense } from '../lib/splitting'
import { TabHero } from '../components/TabHero'
import { BalanceHero } from '../components/BalanceHero'
import { ExpenseCard } from '../components/ExpenseCard'
import { AddExpenseModal } from '../components/AddExpenseModal'
import { EditExpenseModal } from '../components/EditExpenseModal'
import { SettleUpModal } from '../components/SettleUpModal'
import { GroupTotals } from '../components/GroupTotals'
import { NeonBtn } from '../components/ui/NeonBtn'
import { formatIDR, formatINR, toINR } from '../lib/currency'

interface Props { user: User }

export function SplitTab({ user }: Props) {
  const { expenses, loading } = useExpenses()
  const { settlements } = useSettlements()
  const [showAdd, setShowAdd] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const balances = useMemo(() => computeBalances(expenses, settlements), [expenses, settlements])
  const totalPool = useMemo(() => expenses.reduce((s, e) => s + (Number(e.amount_idr) || 0), 0), [expenses])

  return (
    <div data-testid="split-tab">
      <TabHero tab="split" user={user} />

      <div className="px-5 pt-5 pb-8 space-y-5">
        <BalanceHero balances={balances} currentUser={user} />

        {expenses.length > 0 && <GroupTotals expenses={expenses} />}

        <div className="flex gap-2">
          <NeonBtn onClick={() => setShowAdd(true)} className="flex-1" data-testid="add-expense-btn">
            Add expense
          </NeonBtn>
          <NeonBtn variant="outline" onClick={() => setShowSettle(true)} className="flex-1" data-testid="settle-up-btn">
            Settle up
          </NeonBtn>
        </div>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <p className="serif-eyebrow" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              expense log
            </p>
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.18em' }}>
              POOL · {formatINR(toINR(totalPool))}
            </span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="animate-pulse-soft" style={{ height: 78, background: 'var(--bg-card)', borderRadius: 12 }} />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <p className="font-ui text-center py-10" style={{ fontSize: 13, color: 'var(--text-tertiary)' }} data-testid="expenses-empty">
              No expenses yet. Tap “Add expense”.
            </p>
          ) : (
            <div className="space-y-2" data-testid="expense-list">
              {expenses.map(e => <ExpenseCard key={e.id} expense={e} currentUserName={user.name} onEdit={() => setEditingExpense(e)} />)}
            </div>
          )}
        </section>

        {settlements.length > 0 && (
          <section>
            <p className="serif-eyebrow mb-3" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              settlements · {settlements.length}
            </p>
            <div className="space-y-1.5" data-testid="settlement-list">
              {settlements.slice(0, 10).map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-md px-3 py-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <p className="font-ui" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {s.from_user} → {s.to_user}
                  </p>
                  <div className="text-right">
                    <p className="serif-display" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                      {formatINR(toINR(Number(s.amount)))}
                    </p>
                    <p className="font-mono" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                      {formatIDR(Number(s.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {editingExpense && <EditExpenseModal expense={editingExpense} currentUser={user} onClose={() => setEditingExpense(null)} />}
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
