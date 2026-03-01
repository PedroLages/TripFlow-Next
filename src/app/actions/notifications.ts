"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import type {
  NotificationInsert,
  NotificationPreferences,
  EnrichedNotification,
  NotificationResult,
  NotificationListParams,
  NotificationStats
} from '@/types/notification'
import type { Notification } from '@/types/database'

/**
 * Get paginated notifications for the current user
 * Returns enriched notifications with actor profiles
 */
export async function getNotificationsAction(
  userId: string,
  params: NotificationListParams = {}
): Promise<NotificationResult<EnrichedNotification[]>> {
  const {
    tripId,
    limit = 20,
    offset = 0,
    unreadOnly = false,
    includeArchived = false
  } = params

  const supabase = createAdminClient()

  let query = supabase
    .from('notifications')
    .select(`
      *,
      actor:actor_id (id, display_name, avatar_url, created_at)
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (tripId) {
    query = query.eq('trip_id', tripId)
  }

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  if (!includeArchived) {
    query = query.eq('is_archived', false)
  }

  const { data, error } = await query

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  // Filter out any notifications where actor failed to load
  const enrichedData = (data || [])
    .filter(notif => notif.actor && typeof notif.actor === 'object' && 'id' in notif.actor)
    .map(notif => ({
      ...notif,
      actor: notif.actor as EnrichedNotification['actor'] // Type assertion needed due to Supabase inference limitations
    })) as EnrichedNotification[]

  return { ok: true, data: enrichedData }
}

/**
 * Get notification statistics
 */
export async function getNotificationStatsAction(
  userId: string,
  tripId?: string
): Promise<NotificationResult<NotificationStats>> {
  const supabase = createAdminClient()

  let unreadQuery = supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false)
    .eq('is_archived', false)

  let totalQuery = supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_archived', false)

  if (tripId) {
    unreadQuery = unreadQuery.eq('trip_id', tripId)
    totalQuery = totalQuery.eq('trip_id', tripId)
  }

  const [unreadResult, totalResult] = await Promise.all([
    unreadQuery,
    totalQuery
  ])

  if (unreadResult.error || totalResult.error) {
    return {
      ok: false,
      error: {
        code: 'DATABASE_ERROR',
        message: unreadResult.error?.message || totalResult.error?.message || 'Unknown error'
      }
    }
  }

  return {
    ok: true,
    data: {
      unreadCount: unreadResult.count ?? 0,
      totalCount: totalResult.count ?? 0
    }
  }
}

/**
 * Mark notification(s) as read
 */
export async function markAsReadAction(
  userId: string,
  notificationIds: string[]
): Promise<NotificationResult<void>> {
  if (notificationIds.length === 0) {
    return { ok: true, data: undefined }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .in('id', notificationIds)
    .eq('recipient_id', userId)  // Security: only update own notifications

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data: undefined }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsReadAction(
  userId: string,
  tripId?: string
): Promise<NotificationResult<void>> {
  const supabase = createAdminClient()

  let query = supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('recipient_id', userId)
    .eq('is_read', false)

  if (tripId) {
    query = query.eq('trip_id', tripId)
  }

  const { error } = await query

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data: undefined }
}

/**
 * Archive notification(s)
 */
export async function archiveNotificationAction(
  userId: string,
  notificationIds: string[]
): Promise<NotificationResult<void>> {
  if (notificationIds.length === 0) {
    return { ok: true, data: undefined }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_archived: true })
    .in('id', notificationIds)
    .eq('recipient_id', userId)

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data: undefined }
}

/**
 * Create a notification (internal - called by other actions)
 * This is NOT exposed to clients, only used by server actions
 */
export async function createNotificationAction(
  notification: NotificationInsert
): Promise<NotificationResult<Notification>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single()

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferencesAction(
  userId: string,
  tripId?: string
): Promise<NotificationResult<NotificationPreferences | null>> {
  const supabase = createAdminClient()
  let query = supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)

  if (tripId) {
    query = query.eq('trip_id', tripId)
  } else {
    query = query.is('trip_id', null)
  }

  const { data, error} = await query.maybeSingle()

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferencesAction(
  userId: string,
  preferences: Partial<NotificationPreferences>,
  tripId?: string
): Promise<NotificationResult<NotificationPreferences>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: userId,
      trip_id: tripId ?? null,
      ...preferences
    })
    .select()
    .single()

  if (error) {
    return {
      ok: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    }
  }

  return { ok: true, data }
}
