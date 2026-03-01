# Phase 1: Database & Auth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect TripFlow to real Supabase database with complete schema and authentication

**Architecture:**
- Expand from 4 tables (profiles, trips, trip_members, blind_budgets) to 18 tables matching TripOS design
- Replace mock profile system with Supabase Auth (email/password + OAuth)
- Implement Row-Level Security (RLS) policies for all tables
- Generate TypeScript types from schema and replace mock data with real queries

**Tech Stack:**
- Supabase (PostgreSQL + Auth + RLS)
- Next.js 16 Server Actions
- TypeScript with strict types
- Zod 4 for validation

**References:**
- Style Guide: `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`
- TripOS Architecture: `tripflow-next/docs/tripos-migration/architecture/architecture.md`
- Existing migrations: `tripflow-next/supabase/migrations/001_foundation.sql`

---

## Week 1: Database Schema & Migrations

### Task 1: Create Activities Table Migration

**Goal:** Store itinerary activities with location, timing, and cost data

**Files:**
- Create: `tripflow-next/supabase/migrations/003_activities.sql`
- Reference: `tripflow-next/docs/tripos-migration/epics/epics.md` (Epic 4: Collaborative Itinerary Planning)

**Step 1: Write migration for activities table**

```sql
-- Activities for itinerary planning
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Activity details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'transport', 'accommodation', 'food', 'attraction',
    'shopping', 'entertainment', 'other'
  )),

  -- Timing
  scheduled_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,

  -- Location (for map integration)
  location_name TEXT,
  location_address TEXT,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),

  -- Cost
  estimated_cost_cents INTEGER CHECK (estimated_cost_cents >= 0),
  actual_cost_cents INTEGER CHECK (actual_cost_cents >= 0),
  currency_code CHAR(3) DEFAULT 'USD',

  -- Booking
  booking_status TEXT NOT NULL DEFAULT 'not_started' CHECK (booking_status IN (
    'not_started', 'in_progress', 'booked', 'cancelled'
  )),
  booking_reference TEXT,
  booking_url TEXT,

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_activities_trip_id ON activities(trip_id);
CREATE INDEX idx_activities_scheduled_date ON activities(trip_id, scheduled_date);
CREATE INDEX idx_activities_category ON activities(trip_id, category);
CREATE INDEX idx_activities_location ON activities(trip_id) WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL;

-- Auto-update updated_at
CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view activities for trips they're members of
CREATE POLICY "Trip members can view activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Policy: Trip members (not guests) can create activities
CREATE POLICY "Trip members can create activities"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer', 'member')
    )
  );

-- Policy: Activity creators, owners, and organizers can update
CREATE POLICY "Authorized users can update activities"
  ON activities FOR UPDATE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer')
    )
  );

-- Policy: Activity creators, owners, and organizers can delete
CREATE POLICY "Authorized users can delete activities"
  ON activities FOR DELETE
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer')
    )
  );
```

**Step 2: Apply migration to local Supabase**

Run: `cd tripflow-next && npx supabase db reset`
Expected: Migration runs successfully, activities table created

**Step 3: Verify table and indexes**

Run: `npx supabase db inspect`
Expected: Shows activities table with 4 indexes and 4 RLS policies

**Step 4: Commit migration**

```bash
git add tripflow-next/supabase/migrations/003_activities.sql
git commit -m "feat(db): add activities table with RLS policies

- Support itinerary planning with location, timing, cost
- Category-based filtering (transport, food, attractions, etc.)
- Booking status tracking
- RLS ensures only trip members can access activities
- Owners/organizers/creators can modify, members can create

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Create Polls Table Migration

**Goal:** Enable democratic decision-making with multiple voting methods

**Files:**
- Create: `tripflow-next/supabase/migrations/004_polls.sql`
- Reference: `tripflow-next/docs/tripos-migration/epics/epics.md` (Epic 5: Democratic Decision Making)

**Step 1: Write migration for polls and votes tables**

```sql
-- Polls for democratic decision-making
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Poll details
  question TEXT NOT NULL,
  description TEXT,

  -- Voting method
  voting_method TEXT NOT NULL CHECK (voting_method IN (
    'yes_no',           -- Simple majority
    'single_choice',    -- Pick one option
    'ranked_choice',    -- Instant-runoff voting
    'approval',         -- Select multiple options
    'veto'              -- Veto-based elimination
  )),

  -- Settings
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  deadline TIMESTAMPTZ,
  quorum INTEGER CHECK (quorum > 0), -- Minimum votes to close

  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  result_data JSONB, -- Stores winner and vote counts

  -- Optional: Link to activity
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Poll options (for non-yes/no polls)
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Votes (supports ranked choice and approval voting)
CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Vote data (structure depends on voting_method)
  -- yes_no: {"vote": "yes"}
  -- single_choice: {"option_id": "uuid"}
  -- ranked_choice: {"rankings": ["uuid1", "uuid2", "uuid3"]}
  -- approval: {"approved_option_ids": ["uuid1", "uuid2"]}
  -- veto: {"vetoed_option_ids": ["uuid1"]}
  vote_data JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(poll_id, user_id) -- One vote per user per poll
);

-- Indexes
CREATE INDEX idx_polls_trip_id ON polls(trip_id);
CREATE INDEX idx_polls_status ON polls(trip_id, status);
CREATE INDEX idx_polls_deadline ON polls(deadline) WHERE deadline IS NOT NULL AND status = 'open';
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);

-- Auto-update updated_at
CREATE TRIGGER polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER poll_votes_updated_at
  BEFORE UPDATE ON poll_votes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Polls: Trip members can view
CREATE POLICY "Trip members can view polls"
  ON polls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Polls: Owners and organizers can create
CREATE POLICY "Owners and organizers can create polls"
  ON polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer')
    )
  );

-- Poll options: Trip members can view
CREATE POLICY "Trip members can view poll options"
  ON poll_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls
      JOIN trip_members ON trip_members.trip_id = polls.trip_id
      WHERE polls.id = poll_options.poll_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Poll options: Poll creator can insert
CREATE POLICY "Poll creator can insert options"
  ON poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_options.poll_id
      AND polls.created_by = auth.uid()
    )
  );

-- Votes: Users can view their own votes
CREATE POLICY "Users can view own votes"
  ON poll_votes FOR SELECT
  USING (user_id = auth.uid());

-- Votes: Users can view all votes for non-anonymous polls
CREATE POLICY "Users can view non-anonymous poll votes"
  ON poll_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls
      JOIN trip_members ON trip_members.trip_id = polls.trip_id
      WHERE polls.id = poll_votes.poll_id
      AND polls.is_anonymous = false
      AND trip_members.user_id = auth.uid()
    )
  );

-- Votes: Trip members can insert votes
CREATE POLICY "Trip members can vote"
  ON poll_votes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      JOIN trip_members ON trip_members.trip_id = polls.trip_id
      WHERE polls.id = poll_votes.poll_id
      AND trip_members.user_id = auth.uid()
      AND polls.status = 'open'
    )
    AND user_id = auth.uid()
  );

-- Votes: Users can update their own votes
CREATE POLICY "Users can update own votes"
  ON poll_votes FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_votes.poll_id
      AND polls.status = 'open'
    )
  );
```

**Step 2: Apply migration**

Run: `npx supabase db reset`
Expected: Migration creates polls, poll_options, poll_votes tables with RLS

**Step 3: Verify schema**

Run: `npx supabase db inspect`
Expected: 3 new tables with indexes and policies

**Step 4: Commit migration**

```bash
git add tripflow-next/supabase/migrations/004_polls.sql
git commit -m "feat(db): add polls tables for democratic voting

- Support 5 voting methods (yes/no, single, ranked, approval, veto)
- Anonymous voting option
- Deadline and quorum support
- RLS ensures only trip members can participate
- Owners/organizers can create polls

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Expenses Table Migration

**Goal:** Track shared expenses with multi-currency support

**Files:**
- Create: `tripflow-next/supabase/migrations/005_expenses.sql`
- Reference: `tripflow-next/docs/tripos-migration/epics/epics.md` (Epic 7: Shared Expenses & Fair Settlement)

**Step 1: Write migration for expenses and splits**

```sql
-- Expenses for trip cost tracking
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,

  -- Expense details
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',

  -- Who paid
  paid_by UUID NOT NULL REFERENCES auth.users(id),

  -- Category
  category TEXT NOT NULL CHECK (category IN (
    'transport', 'accommodation', 'food', 'attraction',
    'shopping', 'entertainment', 'other'
  )),

  -- Receipt
  receipt_url TEXT, -- Supabase Storage URL

  -- Timestamps
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense splits (who owes what)
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Split amount
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),

  -- Settlement
  is_settled BOOLEAN NOT NULL DEFAULT false,
  settled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(expense_id, user_id)
);

-- Indexes
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_activity_id ON expenses(activity_id);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX idx_expenses_date ON expenses(trip_id, expense_date);
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);

-- Auto-update updated_at
CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER expense_splits_updated_at
  BEFORE UPDATE ON expense_splits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Expenses: Trip members can view
CREATE POLICY "Trip members can view expenses"
  ON expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Expenses: Trip members (not guests) can create
CREATE POLICY "Trip members can log expenses"
  ON expenses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer', 'member')
    )
  );

-- Expenses: Creator can update/delete
CREATE POLICY "Expense creator can update"
  ON expenses FOR UPDATE
  USING (paid_by = auth.uid());

CREATE POLICY "Expense creator can delete"
  ON expenses FOR DELETE
  USING (paid_by = auth.uid());

-- Splits: Users involved can view
CREATE POLICY "Users can view expense splits"
  ON expense_splits FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_splits.expense_id
      AND expenses.paid_by = auth.uid()
    )
  );
```

**Step 2: Apply migration**

Run: `npx supabase db reset`
Expected: Expenses and expense_splits tables created

**Step 3: Verify schema**

Run: `npx supabase db inspect`
Expected: 2 new tables with indexes and RLS policies

**Step 4: Commit migration**

```bash
git add tripflow-next/supabase/migrations/005_expenses.sql
git commit -m "feat(db): add expenses tables for cost tracking

- Multi-currency expense tracking
- Link expenses to activities
- Expense splitting with settlement tracking
- Receipt photo storage (Supabase Storage URLs)
- RLS ensures only trip members can access

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create Photos Table Migration

**Goal:** Store trip photos with location metadata (backend actions already exist!)

**Files:**
- Create: `tripflow-next/supabase/migrations/006_photos.sql`
- Reference: `tripflow-next/src/app/actions/photos.ts` (existing photo actions)

**Step 1: Write migration for photos**

```sql
-- Photos for trip memories
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),

  -- Photo storage
  storage_url TEXT NOT NULL, -- Supabase Storage URL
  thumbnail_url TEXT, -- Optimized thumbnail

  -- Metadata
  caption TEXT,
  taken_at TIMESTAMPTZ,

  -- Location (for map integration)
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),

  -- EXIF data (optional)
  exif_data JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_photos_trip_id ON photos(trip_id);
CREATE INDEX idx_photos_activity_id ON photos(activity_id);
CREATE INDEX idx_photos_taken_at ON photos(trip_id, taken_at);
CREATE INDEX idx_photos_location ON photos(trip_id) WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL;

-- Auto-update updated_at
CREATE TRIGGER photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Photos: Trip members can view
CREATE POLICY "Trip members can view photos"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = photos.trip_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Photos: Trip members can upload
CREATE POLICY "Trip members can upload photos"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = photos.trip_id
      AND trip_members.user_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

-- Photos: Uploader can update/delete
CREATE POLICY "Photo uploader can update"
  ON photos FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Photo uploader can delete"
  ON photos FOR DELETE
  USING (uploaded_by = auth.uid());
```

**Step 2: Apply migration**

Run: `npx supabase db reset`
Expected: Photos table created with RLS

**Step 3: Verify schema**

Run: `npx supabase db inspect`
Expected: Photos table with 4 indexes and 4 RLS policies

**Step 4: Commit migration**

```bash
git add tripflow-next/supabase/migrations/006_photos.sql
git commit -m "feat(db): add photos table for trip memories

- Photo storage with Supabase Storage URLs
- Link photos to activities and locations
- EXIF metadata support
- RLS ensures only trip members can access
- Photo actions already exist in src/app/actions/photos.ts

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Update Trips & Members for Auth

**Goal:** Migrate from mock profiles to Supabase Auth users

**Files:**
- Create: `tripflow-next/supabase/migrations/007_auth_migration.sql`
- Modify: `tripflow-next/supabase/migrations/001_foundation.sql` (reference only, don't edit)

**Step 1: Write migration to align with Supabase Auth**

```sql
-- Migrate from mock profiles to Supabase Auth
-- This migration updates existing tables to reference auth.users

-- Drop mock profiles table (replaced by auth.users)
DROP TABLE IF EXISTS profiles CASCADE;

-- Update trips table to use auth.users
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update trip_members to use auth.users directly
ALTER TABLE trip_members
  DROP CONSTRAINT IF EXISTS trip_members_user_id_fkey,
  ADD CONSTRAINT trip_members_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update blind_budgets to use auth.users
ALTER TABLE blind_budgets
  DROP CONSTRAINT IF EXISTS blind_budgets_user_id_fkey,
  ADD CONSTRAINT blind_budgets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add RLS to existing tables
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blind_budgets ENABLE ROW LEVEL SECURITY;

-- Trips RLS: Users can view trips they're members of
CREATE POLICY "Users can view their trips"
  ON trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Trips RLS: Any authenticated user can create trips
CREATE POLICY "Authenticated users can create trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trips RLS: Owners and organizers can update
CREATE POLICY "Owners and organizers can update trips"
  ON trips FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer')
    )
  );

-- Trips RLS: Only owners can delete
CREATE POLICY "Only owners can delete trips"
  ON trips FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role = 'owner'
    )
  );

-- Trip Members RLS: Members can view other members
CREATE POLICY "Trip members can view members"
  ON trip_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
      AND tm.user_id = auth.uid()
    )
  );

-- Trip Members RLS: Owners and organizers can add members
CREATE POLICY "Owners and organizers can add members"
  ON trip_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trip_members.trip_id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'organizer')
    )
  );

-- Trip Members RLS: Owners and organizers can update roles
CREATE POLICY "Owners and organizers can update roles"
  ON trip_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'organizer')
    )
  );

-- Trip Members RLS: Owners can remove members
CREATE POLICY "Owners can remove members"
  ON trip_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
      AND tm.user_id = auth.uid()
      AND tm.role = 'owner'
    )
  );

-- Blind Budgets RLS: Users can view group limit (MIN of all budgets)
CREATE POLICY "Trip members can view group limit"
  ON blind_budgets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = blind_budgets.trip_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Blind Budgets RLS: Users can only insert/update their own budget
CREATE POLICY "Users can manage own budget"
  ON blind_budgets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budget"
  ON blind_budgets FOR UPDATE
  USING (user_id = auth.uid());

-- Remove mock seed data (will be replaced by real auth users)
TRUNCATE TABLE trips CASCADE;
```

**Step 2: Apply migration**

Run: `npx supabase db reset`
Expected: Mock profiles removed, tables now reference auth.users

**Step 3: Verify RLS policies**

Run: `npx supabase db inspect`
Expected: All tables have RLS enabled with policies

**Step 4: Commit migration**

```bash
git add tripflow-next/supabase/migrations/007_auth_migration.sql
git commit -m "feat(db): migrate to Supabase Auth from mock profiles

- Remove mock profiles table
- Update foreign keys to auth.users
- Add RLS policies to all tables
- Remove mock seed data
- Ready for real authentication

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Generate TypeScript Types

**Goal:** Auto-generate TypeScript types from database schema

**Files:**
- Generate: `tripflow-next/src/types/database.ts` (will be overwritten)
- Create: `tripflow-next/package.json` (add script if missing)

**Step 1: Check if db:types script exists**

Run: `cd tripflow-next && grep -q "db:types" package.json && echo "Script exists" || echo "Script missing"`
Expected: Either "Script exists" or "Script missing"

**Step 2: Add script if missing**

If script is missing, run:
```bash
cd tripflow-next
npm pkg set scripts.db:types="supabase gen types typescript --local > src/types/database.ts"
```

**Step 3: Generate types from schema**

Run: `cd tripflow-next && npm run db:types`
Expected: `src/types/database.ts` file generated with all table types

**Step 4: Verify generated types**

Run: `head -50 tripflow-next/src/types/database.ts`
Expected: See Database interface with Tables, Views, Functions, Enums

**Step 5: Commit generated types**

```bash
git add tripflow-next/package.json tripflow-next/src/types/database.ts
git commit -m "chore(db): generate TypeScript types from schema

- Add db:types script to package.json
- Generate types for all 10+ tables
- Types now match database schema exactly

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Create Supabase Client Utilities

**Goal:** Set up Supabase clients for server and client components

**Files:**
- Create: `tripflow-next/src/lib/supabase/server.ts`
- Create: `tripflow-next/src/lib/supabase/client.ts`
- Create: `tripflow-next/src/lib/supabase/middleware.ts`
- Reference: https://supabase.com/docs/guides/auth/server-side/nextjs

**Step 1: Write failing test for server client**

```typescript
// tripflow-next/src/lib/supabase/__tests__/server.test.ts
import { describe, it, expect } from 'vitest'
import { createClient } from '../server'

describe('Supabase Server Client', () => {
  it('should create a server client instance', async () => {
    const supabase = await createClient()
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })

  it('should have admin client with service role key', async () => {
    const { createAdminClient } = await import('../server')
    const supabase = createAdminClient()
    expect(supabase).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd tripflow-next && npm test -- server.test.ts`
Expected: FAIL - "Cannot find module '../server'"

**Step 3: Implement server client**

```typescript
// tripflow-next/src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Create Supabase client for Server Components
 * Uses cookies for auth state
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component - cookies are read-only
          }
        },
      },
    }
  )
}

/**
 * Create admin client with service role key
 * DANGEROUS: Bypasses RLS - use only in server actions/API routes
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- server.test.ts`
Expected: PASS - 2 tests passing

**Step 5: Write client component client**

```typescript
// tripflow-next/src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Create Supabase client for Client Components
 * Singleton pattern - reuses same client instance
 */
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (client) return client

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
```

**Step 6: Create middleware for auth refresh**

```typescript
// tripflow-next/src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Middleware to refresh auth tokens
 * Must be called from middleware.ts
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return supabaseResponse
}
```

**Step 7: Update root middleware to use Supabase middleware**

```typescript
// tripflow-next/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Step 8: Commit Supabase client utilities**

```bash
git add tripflow-next/src/lib/supabase/ tripflow-next/middleware.ts
git commit -m "feat(auth): add Supabase client utilities

- Server client for Server Components
- Browser client for Client Components (singleton)
- Admin client for bypassing RLS
- Middleware for auth token refresh
- Typed with Database schema

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Week 2: Authentication & Data Integration

### Task 8: Set Up Supabase Auth

**Goal:** Enable email/password authentication

**Files:**
- Create: `tripflow-next/src/app/(auth)/login/page.tsx`
- Create: `tripflow-next/src/app/(auth)/signup/page.tsx`
- Create: `tripflow-next/src/app/(auth)/layout.tsx`
- Create: `tripflow-next/src/app/actions/auth.ts`
- Reference: `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md` (Section 19: TypeScript, Section 20: React)

**Step 1: Write failing E2E test for authentication**

```typescript
// tripflow-next/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')

    await page.click('button[type="submit"]')

    // Should redirect to dashboard after signup
    await expect(page).toHaveURL('/dashboard')
  })

  test('should allow user to log in', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('should protect /trips route', async ({ page }) => {
    await page.goto('/trips/123')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
```

**Step 2: Run E2E test to verify it fails**

Run: `npm run test:e2e -- auth.spec.ts`
Expected: FAIL - Auth pages don't exist

**Step 3: Create auth server actions**

```typescript
// tripflow-next/src/app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = signUpSchema.safeParse(data)
  if (!result.success) {
    return {
      error: result.error.errors[0].message,
    }
  }

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = signInSchema.safeParse(data)
  if (!result.success) {
    return {
      error: result.error.errors[0].message,
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
```

**Step 4: Create login page**

```tsx
// tripflow-next/src/app/(auth)/login/page.tsx
'use client'

import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useActionState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your TripFlow account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 5: Create signup page**

```tsx
// tripflow-next/src/app/(auth)/signup/page.tsx
'use client'

import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useActionState } from 'react'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)
  const [passwordMatch, setPasswordMatch] = useState(true)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      e.preventDefault()
      setPasswordMatch(false)
      return
    }

    setPasswordMatch(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Start planning your next trip with TripFlow</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isPending}
              />
            </div>

            {!passwordMatch && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Sign up'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 6: Create auth layout**

```tsx
// tripflow-next/src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-surface">
      {children}
    </div>
  )
}
```

**Step 7: Run E2E tests**

Run: `npm run test:e2e -- auth.spec.ts`
Expected: Tests should pass (may need Supabase running locally)

**Step 8: Commit authentication**

```bash
git add tripflow-next/src/app/\(auth\)/ tripflow-next/src/app/actions/auth.ts tripflow-next/e2e/auth.spec.ts
git commit -m "feat(auth): implement email/password authentication

- Sign up with email validation
- Sign in with password
- Sign out action
- Server actions with Zod validation
- E2E tests for auth flow
- Follows TripFlow style guide (Section 19, 20)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Add OAuth Providers

**Goal:** Enable Google and GitHub OAuth

**Files:**
- Modify: `tripflow-next/src/app/(auth)/login/page.tsx`
- Modify: `tripflow-next/src/app/(auth)/signup/page.tsx`
- Create: `tripflow-next/src/app/auth/callback/route.ts`
- Create: `tripflow-next/src/components/auth/OAuthButtons.tsx`

**Step 1: Create OAuth callback handler**

```typescript
// tripflow-next/src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard after OAuth
  return NextResponse.redirect(`${origin}/dashboard`)
}
```

**Step 2: Create OAuth buttons component**

```tsx
// tripflow-next/src/components/auth/OAuthButtons.tsx
'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function OAuthButtons() {
  const supabase = createClient()

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error signing in with Google:', error)
  }

  async function handleGitHubSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error signing in with GitHub:', error)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          type="button"
        >
          Google
        </Button>
        <Button
          variant="outline"
          onClick={handleGitHubSignIn}
          type="button"
        >
          GitHub
        </Button>
      </div>
    </div>
  )
}
```

**Step 3: Add OAuth buttons to login page**

Add after the sign-in button in `login/page.tsx`:

```tsx
import { OAuthButtons } from '@/components/auth/OAuthButtons'

// Inside the form, after the sign-in button:
<OAuthButtons />
```

**Step 4: Add OAuth buttons to signup page**

Add after the sign-up button in `signup/page.tsx`:

```tsx
import { OAuthButtons } from '@/components/auth/OAuthButtons'

// Inside the form, after the sign-up button:
<OAuthButtons />
```

**Step 5: Configure OAuth in Supabase Dashboard**

**Manual step** (cannot be automated):
1. Go to https://supabase.com/dashboard (or local: http://localhost:54323)
2. Navigate to Authentication → Providers
3. Enable Google OAuth:
   - Get Client ID and Secret from Google Cloud Console
   - Set redirect URL to: `http://localhost:54321/auth/v1/callback`
4. Enable GitHub OAuth:
   - Get Client ID and Secret from GitHub Settings
   - Set redirect URL to: `http://localhost:54321/auth/v1/callback`

**Step 6: Test OAuth flow manually**

Run: `npm run dev`
Navigate to: http://localhost:3100/login
Click: "Google" or "GitHub" button
Expected: OAuth consent screen → redirect to dashboard

**Step 7: Commit OAuth integration**

```bash
git add tripflow-next/src/app/auth/callback/ tripflow-next/src/components/auth/ tripflow-next/src/app/\(auth\)/
git commit -m "feat(auth): add OAuth providers (Google, GitHub)

- OAuth callback handler
- OAuthButtons component
- Integrated into login/signup pages
- Configured for local development

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Protect Routes with Middleware

**Goal:** Redirect unauthenticated users to login

**Files:**
- Modify: `tripflow-next/middleware.ts`

**Step 1: Update middleware to check auth**

```typescript
// tripflow-next/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/trips']
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  // Refresh auth session
  const response = await updateSession(request)

  // Check if route requires auth
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Get current user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth route while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Step 2: Test route protection**

Run: `npm run dev`
Test cases:
1. Go to http://localhost:3100/trips/123 (not logged in)
   Expected: Redirect to /login
2. Log in, then go to http://localhost:3100/login
   Expected: Redirect to /dashboard

**Step 3: Commit middleware protection**

```bash
git add tripflow-next/middleware.ts
git commit -m "feat(auth): protect routes with middleware

- Redirect unauthenticated users to login
- Redirect authenticated users away from auth pages
- Protected routes: /dashboard, /trips
- Auth routes: /login, /signup

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Replace Mock Data with Real Queries

**Goal:** Update trip pages to load from Supabase instead of mocks

**Files:**
- Modify: `tripflow-next/src/app/trips/[tripId]/page.tsx`
- Create: `tripflow-next/src/lib/queries/trips.ts`

**Step 1: Write trip queries**

```typescript
// tripflow-next/src/lib/queries/trips.ts
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import type { Database } from '@/types/database'

type Trip = Database['public']['Tables']['trips']['Row']
type TripMember = Database['public']['Tables']['trip_members']['Row']

/**
 * Get trip by ID (cached per request)
 * Only returns trip if user is a member
 */
export const getTrip = cache(async (tripId: string): Promise<Trip | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (error) {
    console.error('Error fetching trip:', error)
    return null
  }

  return data
})

/**
 * Get all trips for current user
 */
export const getUserTrips = cache(async (): Promise<Trip[]> => {
  const supabase = await createClient()

  // Get user's trip memberships
  const { data: memberships, error: memberError } = await supabase
    .from('trip_members')
    .select('trip_id')

  if (memberError || !memberships) {
    console.error('Error fetching memberships:', memberError)
    return []
  }

  // Get all trips user is a member of
  const tripIds = memberships.map(m => m.trip_id)
  const { data: trips, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .in('id', tripIds)
    .order('created_at', { ascending: false })

  if (tripError) {
    console.error('Error fetching trips:', tripError)
    return []
  }

  return trips
})

/**
 * Get trip members with user details
 */
export const getTripMembers = cache(async (tripId: string): Promise<TripMember[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trip_members')
    .select('*')
    .eq('trip_id', tripId)

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }

  return data
})

/**
 * Check if user is member of trip
 */
export async function isTripMember(tripId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('trip_members')
    .select('trip_id')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  return !!data
}

/**
 * Get user's role in trip
 */
export async function getUserRole(tripId: string): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('trip_members')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  return data?.role || null
}
```

**Step 2: Update trip detail page to use real data**

```tsx
// tripflow-next/src/app/trips/[tripId]/page.tsx
import { getTrip, getTripMembers, isTripMember } from '@/lib/queries/trips'
import { notFound } from 'next/navigation'

interface TripOverviewPageProps {
  params: Promise<{
    tripId: string
  }>
}

export default async function TripOverviewPage({ params }: TripOverviewPageProps) {
  const { tripId } = await params

  // Check if user is a member (RLS will also enforce this)
  const isMember = await isTripMember(tripId)
  if (!isMember) {
    notFound()
  }

  // Fetch trip data
  const trip = await getTrip(tripId)
  if (!trip) {
    notFound()
  }

  // Fetch members
  const members = await getTripMembers(tripId)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">{trip.name}</h1>
      <p className="text-muted-foreground">{trip.destination}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Trip Details</h2>
        <dl className="mt-4 space-y-2">
          <div>
            <dt className="font-medium">Dates</dt>
            <dd className="text-muted-foreground">
              {trip.start_date} to {trip.end_date}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Currency</dt>
            <dd className="text-muted-foreground">{trip.currency_code}</dd>
          </div>
          <div>
            <dt className="font-medium">Members</dt>
            <dd className="text-muted-foreground">{members.length} travelers</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
```

**Step 3: Test with real data**

Run: `npm run dev`
Create a trip via Supabase SQL:
```sql
-- Insert test trip
INSERT INTO trips (id, name, destination, start_date, end_date)
VALUES ('test-trip-id', 'Test Trip', 'Paris', '2026-06-01', '2026-06-07');

-- Add current user as owner (replace with your user ID)
INSERT INTO trip_members (trip_id, user_id, role)
VALUES ('test-trip-id', 'YOUR-USER-ID', 'owner');
```

Navigate to: http://localhost:3100/trips/test-trip-id
Expected: Trip details display from database

**Step 4: Commit query utilities and updated pages**

```bash
git add tripflow-next/src/lib/queries/ tripflow-next/src/app/trips/
git commit -m "feat(trips): replace mock data with Supabase queries

- Trip query utilities with caching
- Load real trip data from database
- RLS enforces member-only access
- 404 for non-existent or unauthorized trips

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Create Dashboard Page

**Goal:** Display all user's trips

**Files:**
- Create: `tripflow-next/src/app/dashboard/page.tsx`
- Create: `tripflow-next/src/components/trips/TripCard.tsx`

**Step 1: Write TripCard component**

```tsx
// tripflow-next/src/components/trips/TripCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Database } from '@/types/database'

type Trip = Database['public']['Tables']['trips']['Row']

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{trip.name}</CardTitle>
        <CardDescription>{trip.destination}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">Dates</dt>
            <dd className="text-muted-foreground">
              {trip.start_date} to {trip.end_date}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Budget Currency</dt>
            <dd className="text-muted-foreground">{trip.currency_code}</dd>
          </div>
        </dl>

        <Button asChild className="mt-4 w-full">
          <Link href={`/trips/${trip.id}`}>View Trip</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Create dashboard page**

```tsx
// tripflow-next/src/app/dashboard/page.tsx
import { getUserTrips } from '@/lib/queries/trips'
import { TripCard } from '@/components/trips/TripCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const trips = await getUserTrips()

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button asChild>
          <Link href="/trips/new">Create Trip</Link>
        </Button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No trips yet</h2>
          <p className="text-muted-foreground mb-6">
            Start planning your next adventure
          </p>
          <Button asChild>
            <Link href="/trips/new">Create Your First Trip</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Test dashboard**

Run: `npm run dev`
Navigate to: http://localhost:3100/dashboard
Expected: Shows list of user's trips or empty state

**Step 4: Commit dashboard**

```bash
git add tripflow-next/src/app/dashboard/ tripflow-next/src/components/trips/
git commit -m "feat(dashboard): create trip dashboard page

- Display all user's trips in grid
- TripCard component with trip details
- Empty state for new users
- Create trip button

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Summary & Next Steps

**✅ Phase 1 Complete!**

**What we built:**
- **Week 1:** Database schema (10 tables + RLS policies)
- **Week 2:** Authentication (email, OAuth) + real data queries

**Database tables:**
1. trips
2. trip_members
3. blind_budgets
4. activities
5. polls
6. poll_options
7. poll_votes
8. expenses
9. expense_splits
10. photos

**Auth features:**
- Email/password signup
- Google OAuth
- GitHub OAuth
- Protected routes
- Row-Level Security

**Data integration:**
- TypeScript types from schema
- Server/client Supabase utilities
- Trip queries with caching
- Dashboard with real data

---

## Next Phase

**Phase 2: Trip Management & Dashboard (Week 3)**
- Create trip flow
- Edit trip details
- Archive/delete trip
- Trip filtering and search

**Ready to continue?** Run this plan with:
- `@superpowers:executing-plans` (in new session)
- Or use `@superpowers:subagent-driven-development` (this session)

---

**Testing Checklist:**

Before moving to Phase 2, verify:
- [ ] All 10 tables created with RLS
- [ ] TypeScript types generated
- [ ] Sign up works (email + password)
- [ ] Sign in works (email + password)
- [ ] OAuth works (Google + GitHub)
- [ ] Dashboard shows trips
- [ ] Trip detail page loads
- [ ] Middleware protects /trips route
- [ ] Non-members get 404 on trip pages

**Run full test suite:**
```bash
cd tripflow-next
npm run lint
npm run type-check
npm test
npm run test:e2e
```

All green? **Phase 1 is done!** 🎉