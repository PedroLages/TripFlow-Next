export interface NotificationUser {
  name: string
  avatar: string
  color: string
}

export interface Notification {
  id: string
  user: NotificationUser
  action: string
  target: string
  time: string
  type: 'comment' | 'task' | 'upload' | 'default'
  isRead: boolean
}

// ==================== Server-Side Notification Types ====================
// These types are used by server actions and Supabase queries

/**
 * Database notification table row type
 */
export interface NotificationRow {
  id: string
  recipient_id: string
  actor_id: string | null
  trip_id: string | null
  type: 'comment' | 'task' | 'upload' | 'invite' | 'mention' | 'default'
  title: string
  message: string | null
  action_url: string | null
  is_read: boolean
  is_archived: boolean
  read_at: string | null
  created_at: string
}

/**
 * Type for inserting a new notification (omits auto-generated fields)
 */
export type NotificationInsert = Omit<NotificationRow, 'id' | 'created_at' | 'is_read' | 'is_archived' | 'read_at'> & {
  is_read?: boolean
  is_archived?: boolean
  read_at?: string | null
}

/**
 * Actor profile joined to notification
 */
export interface NotificationActor {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

/**
 * Enriched notification with actor profile
 */
export interface EnrichedNotification extends NotificationRow {
  actor: NotificationActor
}

/**
 * Query parameters for listing notifications
 */
export interface NotificationListParams {
  tripId?: string
  limit?: number
  offset?: number
  unreadOnly?: boolean
  includeArchived?: boolean
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  unreadCount: number
  totalCount: number
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  id?: string
  user_id: string
  trip_id: string | null
  email_enabled: boolean
  push_enabled: boolean
  comment_notifications: boolean
  task_notifications: boolean
  invite_notifications: boolean
  mention_notifications: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Generic result type for notification actions
 */
export type NotificationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }
