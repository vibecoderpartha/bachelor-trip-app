import { USER_NAMES } from '../constants/users'

export type SplitMode = 'equal' | 'custom' | 'percent' | 'shares'

export interface Expense {
  id: string
  event_id: string | null
  description: string
  amount: number
  currency: string
  amount_idr: number
  paid_by: string
  split_among: string[]
  split_mode: SplitMode
  custom_splits: Record<string, number> | null
  category: string | null
  date: string | null
  notes: string | null
  settled: boolean
  created_by: string | null
  created_at: string
}

export interface Settlement {
  id: string
  from_user: string
  to_user: string
  amount: number
  currency: string
  notes: string | null
  recorded_by: string | null
  created_at: string
}

export interface SettleTxn {
  from: string
  to: string
  amount: number
}

/** Compute per-user IDR each participant owes for one expense. */
export function computeShares(e: Expense): Record<string, number> {
  const users = e.split_among
  if (!users || users.length === 0) return {}
  const total = Number(e.amount_idr) || 0

  if (e.split_mode === 'equal' || !e.custom_splits) {
    const share = total / users.length
    return Object.fromEntries(users.map(u => [u, share]))
  }

  if (e.split_mode === 'percent') {
    return Object.fromEntries(
      users.map(u => [u, (total * (e.custom_splits?.[u] ?? 0)) / 100]),
    )
  }

  if (e.split_mode === 'shares') {
    const totalShares =
      Object.values(e.custom_splits).reduce((a, b) => a + Number(b), 0) || 1
    return Object.fromEntries(
      users.map(u => [u, (total * (e.custom_splits?.[u] ?? 0)) / totalShares]),
    )
  }

  // custom: absolute IDR per user
  return Object.fromEntries(users.map(u => [u, e.custom_splits?.[u] ?? 0]))
}

/**
 * Compute net IDR balance per user.
 * Positive → owed to them. Negative → they owe.
 */
export function computeBalances(
  expenses: Expense[],
  settlements: Settlement[],
  userNames: string[] = USER_NAMES,
): Record<string, number> {
  const bal: Record<string, number> = Object.fromEntries(
    userNames.map(u => [u, 0]),
  )

  for (const e of expenses) {
    const paid = Number(e.amount_idr) || 0
    bal[e.paid_by] = (bal[e.paid_by] ?? 0) + paid

    const shares = computeShares(e)
    for (const [u, v] of Object.entries(shares)) {
      bal[u] = (bal[u] ?? 0) - Number(v)
    }
  }

  // Settlements: from_user paid to_user -> reduce debtor's debt, reduce creditor's surplus
  for (const s of settlements) {
    const amt = Number(s.amount) || 0
    bal[s.from_user] = (bal[s.from_user] ?? 0) + amt
    bal[s.to_user] = (bal[s.to_user] ?? 0) - amt
  }

  return bal
}

/** Greedy minimum-transactions settle-up. Returns pairs to pay. */
export function settleUp(balances: Record<string, number>): SettleTxn[] {
  const EPS = 1 // ignore sub-rupiah rounding noise
  const creditors: { name: string; amount: number }[] = []
  const debtors: { name: string; amount: number }[] = []

  for (const [name, raw] of Object.entries(balances)) {
    const b = Number(raw)
    if (b > EPS) creditors.push({ name, amount: b })
    else if (b < -EPS) debtors.push({ name, amount: -b })
  }

  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  const txns: SettleTxn[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].amount, creditors[j].amount)
    txns.push({ from: debtors[i].name, to: creditors[j].name, amount: amt })
    debtors[i].amount -= amt
    creditors[j].amount -= amt
    if (debtors[i].amount < EPS) i++
    if (creditors[j].amount < EPS) j++
  }
  return txns
}
