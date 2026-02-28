-- Notifications system for TripFlow
-- Tracks user notifications for comments, tasks, uploads, mentions, etc.

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Notification type and payload
  type TEXT NOT NULL CHECK (type IN ('comment', 'task', 'upload', 'mention', 'trip_update', 'invitation')),
  action TEXT NOT NULL,  -- e.g., "commented on", "assigned a task to you:", "uploaded"
  target_type TEXT NOT NULL CHECK (target_type IN ('itinerary', 'expense', 'booking', 'document', 'trip', 'task')),
  target_id UUID,  -- ID of the referenced entity (NULL for trip-level notifications)
  target_title TEXT NOT NULL,  -- Display title, e.g., "Day 2 Itinerary"

  -- Metadata (JSONB for extensibility - can store additional context)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Status
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for query performance
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notifications_trip ON notifications(trip_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_target ON notifications(target_type, target_id);

-- Notification preferences table
-- Allows users to configure their notification settings globally and per-trip
CREATE TABLE notification_preferences (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id UUID,  -- NULL means global preference

  -- Notification channels
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,

  -- Notification types
  comment_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  task_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  upload_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  mention_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  trip_update_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  invitation_notifications BOOLEAN NOT NULL DEFAULT TRUE,

  -- Digest settings
  digest_frequency TEXT CHECK (digest_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'off')) DEFAULT 'realtime',

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique constraint: one row per user+trip combo, and one global row per user
CREATE UNIQUE INDEX idx_notification_preferences_trip ON notification_preferences(user_id, trip_id) WHERE trip_id IS NOT NULL;
CREATE UNIQUE INDEX idx_notification_preferences_global ON notification_preferences(user_id) WHERE trip_id IS NULL;

-- Add foreign key constraint for trip_id (when not NULL)
ALTER TABLE notification_preferences ADD CONSTRAINT notification_preferences_trip_id_fkey
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;

-- Auto-update updated_at timestamp
CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies

-- Users can only see their own notifications
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- Users can update their own notifications (mark as read/archived)
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- No INSERT policy for notifications
-- System creates notifications via service_role (admin client) only

-- Notification Preferences RLS Policies

-- Users can view their own preferences
CREATE POLICY preferences_select_own ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY preferences_insert_own ON notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY preferences_update_own ON notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- Seed test notifications for development
-- These demonstrate the different notification types
INSERT INTO notifications (trip_id, recipient_id, actor_id, type, action, target_type, target_id, target_title, is_read, created_at) VALUES
  -- Pedro receives a comment notification from Sarah (unread)
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'comment',
    'commented on',
    'itinerary',
    NULL,
    'Day 2 Itinerary',
    FALSE,
    NOW() - INTERVAL '10 minutes'
  ),
  -- Pedro receives a task assignment from Alex (unread)
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'task',
    'assigned a task to you:',
    'task',
    NULL,
    'Book Kyoto Train Tickets',
    FALSE,
    NOW() - INTERVAL '2 hours'
  ),
  -- Pedro receives an upload notification from Jessica (read)
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'upload',
    'uploaded',
    'document',
    NULL,
    'Hotel Reservation PDF',
    TRUE,
    NOW() - INTERVAL '1 day'
  ),
  -- Sarah receives a mention notification from Pedro (unread)
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'mention',
    'mentioned you in',
    'itinerary',
    NULL,
    'Day 5 Activities',
    FALSE,
    NOW() - INTERVAL '30 minutes'
  );

-- Seed default notification preferences for all users
-- These are the default settings; users can customize them later
INSERT INTO notification_preferences (user_id, trip_id) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL),  -- Pedro's global preferences
  ('00000000-0000-0000-0000-000000000002', NULL),  -- Sarah's global preferences
  ('00000000-0000-0000-0000-000000000003', NULL),  -- Alex's global preferences
  ('00000000-0000-0000-0000-000000000004', NULL);  -- Jessica's global preferences
