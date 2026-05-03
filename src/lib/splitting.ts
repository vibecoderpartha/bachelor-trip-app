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
  paid_by_splits: Record<string, number> | null  // multi-payer: name → IDR amount paid
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

    if (e.paid_by_splits && Object.keys(e.paid_by_splits).length > 0) {
      for (const [u, v] of Object.entries(e.paid_by_splits)) {
        bal[u] = (bal[u] ?? 0) + Number(v)
      }
    } else {
      bal[e.paid_by] = (bal[e.paid_by] ?? 0) + paid
    }

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
  const EPS = 1
  const creditors: { name: string; amount: number }[] = []
  const debtors: { name: string; amount: number }[] = []

  for (const [name, raw] of Object.entries(balances)) {
    const b = Number(raw)
    if (b > EPS) creditors.push({ name, amount: b })
    else if (b < -EPS) debtors.push({ name, amount: -b })
  }

  const byAmountDesc = (a: { amount: number }, b: { amount: number }) => b.amount - a.amount
  creditors.sort(byAmountDesc)
  debtors.sort(byAmountDesc)

  const txns: SettleTxn[] = []

  while (debtors.length > 0 && creditors.length > 0) {
    let di = 0
    let ci = 0

    // Least-preferred pair: Astitva → Partha.
    // When the natural greedy would produce that match, route around it if any
    // alternative exists. Falls back to Astitva→Partha only when unavoidable.
    if (debtors[di].name === 'Astitva' && creditors[ci].name === 'Partha') {
      const altCi = creditors.findIndex(c => c.name !== 'Partha')
      const altDi = debtors.findIndex(d => d.name !== 'Astitva')
      if (altCi !== -1) ci = altCi        // Astitva pays someone else
      else if (altDi !== -1) di = altDi   // someone else pays Partha
      // else: only these two remain — must do Astitva→Partha
    }

    const debtor = debtors[di]
    const creditor = creditors[ci]
    const amt = Math.min(debtor.amount, creditor.amount)

    txns.push({ from: debtor.name, to: creditor.name, amount: amt })
    debtor.amount -= amt
    creditor.amount -= amt

    if (debtor.amount < EPS) debtors.splice(di, 1)
    if (creditor.amount < EPS) creditors.splice(ci, 1)

    creditors.sort(byAmountDesc)
    debtors.sort(byAmountDesc)
  }

  return txns
}
