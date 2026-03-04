"use client"

import { mockNotifications } from '@/lib/mock-notifications'

interface NotificationListParams {
  tripId?: string
}

export function useNotifications(_params: NotificationListParams = {}) {
  // Use mock data for now - simplified version
  // Note: tripId filtering not supported by mock data yet
  const notifications = mockNotifications

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
