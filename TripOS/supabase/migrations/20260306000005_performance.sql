-- Performance indexes
-- Migration: 20260306000005_performance.sql

-- Additional composite indexes for RLS performance
CREATE INDEX idx_activities_trip_status ON activities(trip_id, status) WHERE status != 'Draft';
CREATE INDEX idx_polls_trip_open ON polls(trip_id, closed_at) WHERE closed_at IS NULL;
CREATE INDEX idx_expenses_trip_created ON expenses(trip_id, created_by);
CREATE INDEX idx_votes_poll_user ON votes(poll_id, user_id);
CREATE INDEX idx_tasks_trip_assigned ON tasks(trip_id, assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_activity_feed_trip_time ON activity_feed(trip_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Partial indexes for soft deletes
CREATE INDEX idx_trips_active ON trips(id, created_at DESC) WHERE deleted_at IS NULL AND archived_at IS NULL;
CREATE INDEX idx_activities_active ON activities(trip_id, start_time) WHERE status != 'Cancelled';

-- Covering indexes
CREATE INDEX idx_trip_members_covering ON trip_members(trip_id, user_id) INCLUDE (role, status, joined_at);
CREATE INDEX idx_expense_splits_covering ON expense_splits(expense_id) INCLUDE (user_id, split_amount, is_settled);

-- Foreign key indexes for join performance
CREATE INDEX idx_activity_attendees_user ON activity_attendees(user_id);
CREATE INDEX idx_activity_versions_changed_by ON activity_versions(changed_by);
CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);
CREATE INDEX idx_expense_splits_user ON expense_splits(user_id);

-- Update statistics
ANALYZE profiles;
ANALYZE trips;
ANALYZE trip_members;
ANALYZE activities;
ANALYZE polls;
ANALYZE votes;
ANALYZE blind_budgets;
ANALYZE expenses;
ANALYZE expense_splits;
ANALYZE tasks;
ANALYZE activity_feed;
ANALYZE notifications;
