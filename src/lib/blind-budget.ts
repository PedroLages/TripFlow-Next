/**
 * Blind Budget business logic.
 * Pure functions — no Supabase dependency, no React dependency.
 * Amounts are always in cents to avoid floating point issues.
 */

export function centsToDollars(cents: number): number {
  return cents / 100
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

const ZERO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'VND']

export function formatBudgetAmount(amountCents: number, currencyCode: string): string {
  const amount = ZERO_DECIMAL_CURRENCIES.includes(currencyCode)
    ? amountCents
    : centsToDollars(amountCents)

  const currencyMap: Record<string, { locale: string; currency: string }> = {
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'en-US', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    JPY: { locale: 'en-US', currency: 'JPY' },
  }

  const config = currencyMap[currencyCode] ?? { locale: 'en-US', currency: currencyCode }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateGroupLimit(
  budgets: Array<{ amount_cents: number }>
): number | null {
  if (budgets.length === 0) return null
  return Math.min(...budgets.map(b => b.amount_cents))
}

export function isUserSettingGroupMin(
  userId: string,
  allBudgets: Array<{ user_id: string; amount_cents: number }>
): boolean {
  if (allBudgets.length === 0) return false

  const min = Math.min(...allBudgets.map(b => b.amount_cents))
  const usersAtMin = allBudgets.filter(b => b.amount_cents === min)

  // Only flag if this user is the SOLE minimum (not tied)
  return usersAtMin.length === 1 && usersAtMin[0].user_id === userId
}
