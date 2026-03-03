"use client"

import { mockNotifications } from '@/lib/mock-notifications'

interface NotificationListParams {
  tripId?: string
}

export function useNotifications(params: NotificationListParams = {}) {
  // Use mock data for now - simplified version
  const notifications = params.tripId
    ? mockNotifications.filter(n => n.tripId === params.tripId)
    : mockNotifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    // Data
    notifications,
    notificationsError: null,
    notificationsLoading: false,

    // Stats
    unreadCount,
    totalCount: notifications.length,
    statsLoading: false,

    // Mutations (no-ops for mock)
    markAsRead: () => {},
    markAsReadPending: false,

    markAllAsRead: () => {},
    markAllAsReadPending: false,

    archiveNotification: () => {},
    archivePending: false,

    // Refetch (no-op for mock)
    refetch: () => Promise.resolve(),
  }
}
