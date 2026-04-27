export const RATES: Record<string, number> = {
  IDR: 1,
  INR: 188.68,
  USD: 15800,
  AUD: 10200,
}

export function toIDR(amount: number, currency: string): number {
  return amount * (RATES[currency] ?? 1)
}

export function toINR(amountIDR: number): number {
  return amountIDR / RATES.INR
}

export function formatIDR(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}k`
  }
  return `Rp ${amount.toFixed(0)}`
}

export function formatIDRFull(amount: number): string {
  return `Rp ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}
