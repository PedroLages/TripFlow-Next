import { describe, it, expect } from 'vitest'
import {
  calculateGroupLimit,
  centsToDollars,
  dollarsToCents,
  formatBudgetAmount,
  isUserSettingGroupMin,
} from '../blind-budget'

describe('centsToDollars', () => {
  it('converts cents to dollars', () => {
    expect(centsToDollars(500000)).toBe(5000)
  })

  it('handles zero', () => {
    expect(centsToDollars(0)).toBe(0)
  })
})

describe('dollarsToCents', () => {
  it('converts dollars to cents', () => {
    expect(dollarsToCents(5000)).toBe(500000)
  })

  it('rounds to avoid floating point issues', () => {
    expect(dollarsToCents(49.99)).toBe(4999)
  })
})

describe('formatBudgetAmount', () => {
  it('formats USD amounts', () => {
    expect(formatBudgetAmount(500000, 'USD')).toBe('$5,000')
  })

  it('formats JPY amounts (no decimals)', () => {
    expect(formatBudgetAmount(50000, 'JPY')).toBe('¥50,000')
  })

  it('formats EUR amounts', () => {
    expect(formatBudgetAmount(300000, 'EUR')).toBe('€3,000')
  })
})

describe('calculateGroupLimit', () => {
  it('returns MIN of all budgets', () => {
    const budgets = [
      { amount_cents: 500000 },
      { amount_cents: 300000 },
      { amount_cents: 800000 },
    ]
    expect(calculateGroupLimit(budgets)).toBe(300000)
  })

  it('returns null when no budgets', () => {
    expect(calculateGroupLimit([])).toBeNull()
  })

  it('returns the single budget when only one', () => {
    expect(calculateGroupLimit([{ amount_cents: 500000 }])).toBe(500000)
  })

  it('handles zero budget (valid — free trip)', () => {
    const budgets = [{ amount_cents: 500000 }, { amount_cents: 0 }]
    expect(calculateGroupLimit(budgets)).toBe(0)
  })
})

describe('isUserSettingGroupMin', () => {
  it('returns true when user has the lowest budget', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 500000 },
      { user_id: 'c', amount_cents: 800000 },
    ]
    expect(isUserSettingGroupMin('a', allBudgets)).toBe(true)
  })

  it('returns false when user is not the lowest', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 500000 },
    ]
    expect(isUserSettingGroupMin('b', allBudgets)).toBe(false)
  })

  it('returns false when tied (multiple at minimum)', () => {
    const allBudgets = [
      { user_id: 'a', amount_cents: 300000 },
      { user_id: 'b', amount_cents: 300000 },
    ]
    expect(isUserSettingGroupMin('a', allBudgets)).toBe(false)
  })

  it('returns false when no budgets', () => {
    expect(isUserSettingGroupMin('a', [])).toBe(false)
  })
})
