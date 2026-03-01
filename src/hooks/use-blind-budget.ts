"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMockAuth } from '@/lib/mock-auth'
import {
  setBudgetAction,
  getMyBudgetAction,
  getGroupLimitAction,
  getMemberCountAction,
  checkIsSettingGroupMinAction,
} from '@/app/actions/blind-budget'

const TRIP_ID = '10000000-0000-0000-0000-000000000001' // Mock trip

export function useBlindBudget(tripId: string = TRIP_ID) {
  const { user } = useMockAuth()
  const queryClient = useQueryClient()

  // Fetch current user's budget
  const myBudgetQuery = useQuery({
    queryKey: ['blind-budget', 'my', tripId, user.id],
    queryFn: () => getMyBudgetAction(tripId, user.id),
  })

  // Fetch group limit (server calculates MIN, returns only aggregate)
  const groupLimitQuery = useQuery({
    queryKey: ['blind-budget', 'group', tripId],
    queryFn: () => getGroupLimitAction(tripId),
  })

  // Fetch trip member count
  const memberCountQuery = useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: () => getMemberCountAction(tripId),
  })

  // Check if user is setting group minimum
  const isMinQuery = useQuery({
    queryKey: ['blind-budget', 'is-min', tripId, user.id],
    queryFn: () => checkIsSettingGroupMinAction(tripId, user.id),
    enabled: !!myBudgetQuery.data,
  })

  // Set or update budget
  const setBudgetMutation = useMutation({
    mutationFn: (amountCents: number) => setBudgetAction(tripId, user.id, amountCents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blind-budget'] })
    },
  })

  const groupLimit = groupLimitQuery.data
  const memberCount = memberCountQuery.data ?? 0

  return {
    // User's own budget
    myBudget: myBudgetQuery.data ?? null,
    myBudgetLoading: myBudgetQuery.isPending,

    // Group aggregate (no individual amounts ever reach client)
    groupLimitCents: groupLimit?.limitCents ?? null,
    budgetCount: groupLimit?.budgetCount ?? 0,
    memberCount,
    allBudgetsReady: (groupLimit?.budgetCount ?? 0) === memberCount && memberCount > 0,

    // Status flags
    isSettingGroupMin: isMinQuery.data ?? false,

    // Mutations
    setBudget: setBudgetMutation.mutate,
    setBudgetPending: setBudgetMutation.isPending,
  }
}
