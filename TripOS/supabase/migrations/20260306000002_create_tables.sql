-- Create all tables without RLS policies
-- Migration: 20260306000002_create_tables.sql

-- ============================================================================
-- AUTH & USERS
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_profiles_full_name ON profiles(full_name);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE auth_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at DESC);
CREATE INDEX idx_auth_events_event_type ON auth_events(event_type);

-- ============================================================================
-- TRIPS
-- ============================================================================

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_image_url TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_public BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT trips_dates_valid CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date),
  CONSTRAINT trips_currency_code CHECK (currency ~ '^[A-Z]{3}$')
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trips_archived ON trips(archived_at) WHERE archived_at IS NULL;
CREATE INDEX idx_trips_deleted ON trips(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role trip_role NOT NULL DEFAULT 'Member',
  status member_status NOT NULL DEFAULT 'Invited',
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (trip_id, user_id),
  CONSTRAINT trip_members_dates_valid CHECK (joined_at IS NULL OR left_at IS NULL OR joined_at <= left_at)
);

ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX idx_trip_members_rls ON trip_members(trip_id, user_id, status, role) WHERE status = 'Joined';
CREATE INDEX idx_trip_members_status ON trip_members(status);

CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  role trip_role NOT NULL DEFAULT 'Member',
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT invite_links_role_valid CHECK (role IN ('Member', 'Guest')),
  CONSTRAINT invite_links_max_uses_valid CHECK (max_uses IS NULL OR max_uses > 0),
  CONSTRAINT invite_links_uses_valid CHECK (uses_count >= 0 AND (max_uses IS NULL OR uses_count <= max_uses))
);

ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_invite_links_trip_id ON invite_links(trip_id);
CREATE INDEX idx_invite_links_code ON invite_links(code);
CREATE INDEX idx_invite_links_expires ON invite_links(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- ACTIVITIES
-- ============================================================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  cost_estimate NUMERIC(10, 2),
  status activity_status NOT NULL DEFAULT 'Draft',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT activities_times_valid CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time),
  CONSTRAINT activities_lat_valid CHECK (lat IS NULL OR (lat >= -90 AND lat <= 90)),
  CONSTRAINT activities_lng_valid CHECK (lng IS NULL OR (lng >= -180 AND lng <= 180)),
  CONSTRAINT activities_cost_valid CHECK (cost_estimate IS NULL OR cost_estimate >= 0)
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activities_trip_id ON activities(trip_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_created_by ON activities(created_by);

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE activity_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attendance_status attendance_status NOT NULL DEFAULT 'Maybe',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, user_id)
);

ALTER TABLE activity_attendees ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activity_attendees_activity_id ON activity_attendees(activity_id);
CREATE INDEX idx_activity_attendees_user_id ON activity_attendees(user_id);

CREATE TABLE activity_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, version_number)
);

ALTER TABLE activity_versions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activity_versions_activity_id ON activity_versions(activity_id);
CREATE INDEX idx_activity_versions_changed_at ON activity_versions(changed_at DESC);

CREATE TABLE activity_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE activity_drafts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activity_drafts_activity_id ON activity_drafts(activity_id);
CREATE INDEX idx_activity_drafts_trip_id ON activity_drafts(trip_id);
CREATE INDEX idx_activity_drafts_created_by ON activity_drafts(created_by);

CREATE TRIGGER update_activity_drafts_updated_at
  BEFORE UPDATE ON activity_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VOTING
-- ============================================================================

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  poll_type poll_type NOT NULL DEFAULT 'Single Choice',
  closes_at TIMESTAMP WITH TIME ZONE,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  max_selections INTEGER,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT polls_max_selections_valid CHECK (max_selections IS NULL OR (max_selections > 0 AND poll_type = 'Multiple Choice'))
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_polls_trip_id ON polls(trip_id);
CREATE INDEX idx_polls_closes_at ON polls(closes_at) WHERE closes_at IS NOT NULL;
CREATE INDEX idx_polls_created_by ON polls(created_by);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_options_sort_order ON poll_options(poll_id, sort_order);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, user_id, option_id),
  CONSTRAINT votes_rank_valid CHECK (rank IS NULL OR rank > 0)
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_rank ON votes(poll_id, rank) WHERE rank IS NOT NULL;

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BUDGET & EXPENSES
-- ============================================================================

CREATE TABLE blind_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (trip_id, user_id),
  CONSTRAINT blind_budgets_amount_valid CHECK (budget_amount > 0),
  CONSTRAINT blind_budgets_currency_code CHECK (currency ~ '^[A-Z]{3}$')
);

ALTER TABLE blind_budgets ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_blind_budgets_user_trip ON blind_budgets(user_id, trip_id);
CREATE INDEX idx_blind_budgets_trip_id ON blind_budgets(trip_id);

CREATE TRIGGER update_blind_budgets_updated_at
  BEFORE UPDATE ON blind_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  category expense_category NOT NULL DEFAULT 'Other',
  paid_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  receipt_url TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT expenses_amount_valid CHECK (amount >= 0),
  CONSTRAINT expenses_currency_code CHECK (currency ~ '^[A-Z]{3}$')
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX idx_expenses_paid_at ON expenses(paid_at DESC);
CREATE INDEX idx_expenses_category ON expenses(category);

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  split_amount NUMERIC(10, 2) NOT NULL,
  is_settled BOOLEAN NOT NULL DEFAULT false,
  settled_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (expense_id, user_id),
  CONSTRAINT expense_splits_amount_valid CHECK (split_amount >= 0),
  CONSTRAINT expense_splits_settled_valid CHECK ((is_settled = false AND settled_at IS NULL) OR (is_settled = true AND settled_at IS NOT NULL))
);

ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);
CREATE INDEX idx_expense_splits_settled ON expense_splits(is_settled, settled_at);

-- ============================================================================
-- TASKS
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status task_status NOT NULL DEFAULT 'Todo',
  priority task_priority NOT NULL DEFAULT 'Medium',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT tasks_completion_valid CHECK ((status = 'Done' AND completed_at IS NOT NULL) OR (status != 'Done' AND completed_at IS NULL))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_tasks_trip_id ON tasks(trip_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category template_category NOT NULL DEFAULT 'Pre-Trip',
  tasks JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT checklist_templates_tasks_valid CHECK (jsonb_typeof(tasks) = 'array')
);

ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_checklist_templates_category ON checklist_templates(category);
CREATE INDEX idx_checklist_templates_public ON checklist_templates(is_public) WHERE is_public = true;
CREATE INDEX idx_checklist_templates_created_by ON checklist_templates(created_by);

-- ============================================================================
-- COLLABORATION
-- ============================================================================

CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type action_type NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activity_feed_trip_id ON activity_feed(trip_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_entity ON activity_feed(entity_type, entity_id);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT notifications_read_valid CHECK ((is_read = false AND read_at IS NULL) OR (is_read = true AND read_at IS NOT NULL))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_trip_id ON notifications(trip_id) WHERE trip_id IS NOT NULL;
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

CREATE OR REPLACE FUNCTION create_trip_with_owner(
  p_trip_name TEXT,
  p_destination TEXT,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS UUID AS $$
DECLARE
  v_trip_id UUID;
BEGIN
  INSERT INTO trips (name, destination, start_date, end_date)
  VALUES (p_trip_name, p_destination, p_start_date, p_end_date)
  RETURNING id INTO v_trip_id;

  INSERT INTO trip_members (trip_id, user_id, role, status, joined_at)
  VALUES (v_trip_id, auth.uid(), 'Owner', 'Joined', NOW());

  RETURN v_trip_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION ping()
RETURNS TEXT AS $$
BEGIN
  RETURN 'pong';
END;
$$ LANGUAGE plpgsql;
