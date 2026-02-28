"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMockAuth } from '@/lib/mock-auth'
import {
  getNotificationsAction,
  getNotificationStatsAction,
  markAsReadAction,
  markAllAsReadAction,
  archiveNotificationAction,
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction
} from '@/app/actions/notifications'
import type { NotificationListParams, NotificationPreferences } from '@/types/notification'

export function useNotifications(params: NotificationListParams = {}) {
  const { user } = useMockAuth()
  const queryClient = useQueryClient()

  // Fetch notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'list', user.id, params],
    queryFn: () => getNotificationsAction(user.id, params),
    staleTime: 30_000,  // 30 seconds
  })

  // Fetch stats (unread count, etc.)
  const statsQuery = useQuery({
    queryKey: ['notifications', 'stats', user.id, params.tripId],
    queryFn: () => getNotificationStatsAction(user.id, params.tripId),
    staleTime: 10_000,  // 10 seconds
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationIds: string[]) => markAsReadAction(user.id, notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: (tripId?: string) => markAllAsReadAction(user.id, tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (notificationIds: string[]) => archiveNotificationAction(user.id, notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const result = notificationsQuery.data
  const statsResult = statsQuery.data

  return {
    // Data
    notifications: result?.ok ? result.data : [],
    notificationsError: result && !result.ok ? result.error : null,
    notificationsLoading: notificationsQuery.isPending,

    // Stats
    unreadCount: statsResult?.ok ? statsResult.data?.unreadCount ?? 0 : 0,
    totalCount: statsResult?.ok ? statsResult.data?.totalCount ?? 0 : 0,
    statsLoading: statsQuery.isPending,

    // Mutations
    markAsRead: markAsReadMutation.mutate,
    markAsReadPending: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadPending: markAllAsReadMutation.isPending,

    archiveNotification: archiveMutation.mutate,
    archivePending: archiveMutation.isPending,

    // Refetch
    refetch: notificationsQuery.refetch,
  }
}

export function useNotificationPreferences(tripId?: string) {
  const { user } = useMockAuth()
  const queryClient = useQueryClient()

  // Fetch preferences
  const preferencesQuery = useQuery({
    queryKey: ['notifications', 'preferences', user.id, tripId],
    queryFn: () => getNotificationPreferencesAction(user.id, tripId),
    staleTime: 60_000,  // 1 minute
  })

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      updateNotificationPreferencesAction(user.id, preferences, tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'preferences', user.id, tripId]
      })
    }
  })

  const result = preferencesQuery.data

  return {
    preferences: result?.ok ? result.data : null,
    preferencesLoading: preferencesQuery.isPending,
    preferencesError: result && !result.ok ? result.error : null,

    updatePreferences: updatePreferencesMutation.mutate,
    updatePending: updatePreferencesMutation.isPending,
  }
}
