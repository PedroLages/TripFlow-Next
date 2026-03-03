-- Foundation tables for tripflow

-- Profiles (mock auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trip Members
CREATE TABLE trip_members (
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'organizer', 'member', 'guest')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

-- Blind Budgets
CREATE TABLE blind_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0 AND amount_cents <= 10000000),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blind_budgets_updated_at
  BEFORE UPDATE ON blind_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for group limit queries
CREATE INDEX idx_blind_budgets_trip_id ON blind_budgets(trip_id);

-- Seed mock users
INSERT INTO profiles (id, display_name, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Pedro', 'https://i.pravatar.cc/150?u=pedro'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah J.', 'https://i.pravatar.cc/150?u=sarah'),
  ('00000000-0000-0000-0000-000000000003', 'Alex C.', 'https://i.pravatar.cc/150?u=alex'),
  ('00000000-0000-0000-0000-000000000004', 'Jessica L.', 'https://i.pravatar.cc/150?u=jessica');

-- Seed a mock trip
INSERT INTO trips (id, name, destination, start_date, end_date, currency_code) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Japan Circuit', 'Tokyo, Kyoto, Osaka', '2026-10-12', '2026-10-26', 'USD');

-- Add all users as trip members
INSERT INTO trip_members (trip_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member');
