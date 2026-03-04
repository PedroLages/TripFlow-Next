"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { calculateGroupLimit, isUserSettingGroupMin } from '@/lib/blind-budget'
import type { BlindBudget } from '@/types/database'

/**
 * Set or update a user's blind budget for a trip.
 * Server Action — service_role key never leaves the server.
 */
export async function setBudgetAction(
  tripId: string,
  userId: string,
  amountCents: number
): Promise<BlindBudget> {
  if (amountCents < 0 || amountCents > 10000000) {
    throw new Error('Budget must be between $0 and $100,000')
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('blind_budgets')
    .upsert(
      { trip_id: tripId, user_id: userId, amount_cents: amountCents },
      { onConflict: 'trip_id,user_id' }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get the current user's own budget for a trip.
 * Only the user's own amount is returned — no other budgets.
 */
export async function getMyBudgetAction(
  tripId: string,
  userId: string
): Promise<BlindBudget | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('blind_budgets')
    .select('*')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get the group's affordable limit (MIN of all budgets).
 * PRIVACY: Returns only the aggregate and count — never individual amounts.
 */
export async function getGroupLimitAction(
  tripId: string
): Promise<{ limitCents: number | null; budgetCount: number }> {
  const supabase = createAdminClient()
  const { data: budgets, error } = await supabase
    .from('blind_budgets')
    .select('amount_cents')
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  if (!budgets || budgets.length === 0) return { limitCents: null, budgetCount: 0 }

  const limitCents = calculateGroupLimit(budgets)
  return { limitCents, budgetCount: budgets.length }
}

/**
 * Get the count of trip members.
 */
export async function getMemberCountAction(
  tripId: string
): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .from('trip_members')
    .select('*', { count: 'exact', head: true })
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  return count ?? 0
}

/**
 * Check if the current user's budget is the sole group minimum.
 * PRIVACY: Returns only a boolean — no amounts.
 */
export async function checkIsSettingGroupMinAction(
  tripId: string,
  userId: string
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data: budgets, error } = await supabase
    .from('blind_budgets')
    .select('user_id, amount_cents')
    .eq('trip_id', tripId)

  if (error) throw new Error(error.message)
  if (!budgets || budgets.length === 0) return false

  return isUserSettingGroupMin(userId, budgets)
}

/**
 * Delete a user's budget for a trip.
 */
export async function deleteBudgetAction(
  tripId: string,
  userId: string
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('blind_budgets')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
