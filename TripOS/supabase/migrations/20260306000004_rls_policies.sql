-- Row-Level Security Policies
-- Migration: 20260306000004_rls_policies.sql
-- All RLS policies applied after tables are created

-- ============================================================================
-- PROFILES
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view trip members' profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm1
      JOIN trip_members tm2 ON tm1.trip_id = tm2.trip_id
      WHERE tm1.user_id = auth.uid()
        AND tm2.user_id = profiles.id
        AND tm1.status = 'Joined'
        AND tm2.status = 'Joined'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- AUTH EVENTS
-- ============================================================================

CREATE POLICY "Users can view own auth events"
  ON auth_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert auth events"
  ON auth_events FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- TRIPS
-- ============================================================================

CREATE POLICY "Members can view trips"
  ON trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Authenticated users can create trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and Organizers can update trips"
  ON trips FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer')
        AND trip_members.status = 'Joined'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners can delete trips"
  ON trips FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role = 'Owner'
        AND trip_members.status = 'Joined'
    )
  );

-- ============================================================================
-- TRIP MEMBERS
-- ============================================================================

CREATE POLICY "Trip members can view members"
  ON trip_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can add members"
  ON trip_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('Owner', 'Organizer')
        AND tm.status = 'Joined'
    )
    OR (trip_members.user_id = auth.uid())
  );

CREATE POLICY "Owners and Organizers can update members"
  ON trip_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'Owner'
        AND tm.status = 'Joined'
    )
    OR (
      EXISTS (
        SELECT 1 FROM trip_members tm
        WHERE tm.trip_id = trip_members.trip_id
          AND tm.user_id = auth.uid()
          AND tm.role = 'Organizer'
          AND tm.status = 'Joined'
      )
      AND trip_members.role IN ('Member', 'Guest')
    )
    OR (trip_members.user_id = auth.uid())
  );

CREATE POLICY "Owners can delete members"
  ON trip_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'Owner'
        AND tm.status = 'Joined'
    )
  );

-- ============================================================================
-- INVITE LINKS
-- ============================================================================

CREATE POLICY "Trip members can view invite links"
  ON invite_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = invite_links.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can create invite links"
  ON invite_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = invite_links.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can update invite links"
  ON invite_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = invite_links.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can delete invite links"
  ON invite_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = invite_links.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer')
        AND trip_members.status = 'Joined'
    )
  );

-- ============================================================================
-- ACTIVITIES
-- ============================================================================

CREATE POLICY "Trip members can view activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer', 'Member')
          OR (trip_members.role = 'Guest' AND activities.status != 'Draft')
        )
    )
  );

CREATE POLICY "Members can create activities"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer', 'Member')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can update activities"
  ON activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR (trip_members.role = 'Member' AND activities.created_by = auth.uid())
        )
    )
  );

CREATE POLICY "Owners and Organizers can delete activities"
  ON activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activities.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR (trip_members.role = 'Member' AND activities.created_by = auth.uid())
        )
    )
  );

-- ============================================================================
-- ACTIVITY ATTENDEES
-- ============================================================================

CREATE POLICY "Trip members can view attendees"
  ON activity_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN trip_members tm ON tm.trip_id = a.trip_id
      WHERE a.id = activity_attendees.activity_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Members can RSVP to activities"
  ON activity_attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN trip_members tm ON tm.trip_id = a.trip_id
      WHERE a.id = activity_attendees.activity_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('Owner', 'Organizer', 'Member')
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Users can update own RSVP"
  ON activity_attendees FOR UPDATE
  USING (auth.uid() = activity_attendees.user_id);

CREATE POLICY "Users can delete own RSVP"
  ON activity_attendees FOR DELETE
  USING (auth.uid() = activity_attendees.user_id);

-- ============================================================================
-- ACTIVITY VERSIONS
-- ============================================================================

CREATE POLICY "Trip members can view activity versions"
  ON activity_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN trip_members tm ON tm.trip_id = a.trip_id
      WHERE a.id = activity_versions.activity_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "System can insert activity versions"
  ON activity_versions FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- ACTIVITY DRAFTS
-- ============================================================================

CREATE POLICY "Trip members can view drafts"
  ON activity_drafts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activity_drafts.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Members can create drafts"
  ON activity_drafts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activity_drafts.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer', 'Member')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Users can update own drafts"
  ON activity_drafts FOR UPDATE
  USING (auth.uid() = activity_drafts.created_by);

CREATE POLICY "Users can delete own drafts"
  ON activity_drafts FOR DELETE
  USING (auth.uid() = activity_drafts.created_by);

-- ============================================================================
-- POLLS
-- ============================================================================

CREATE POLICY "Trip members can view polls"
  ON polls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Members can create polls"
  ON polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer', 'Member')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can update polls"
  ON polls FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR (polls.created_by = auth.uid() AND polls.closed_at IS NULL)
        )
    )
  );

CREATE POLICY "Owners and Organizers can delete polls"
  ON polls FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = polls.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR (
            polls.created_by = auth.uid()
            AND NOT EXISTS (SELECT 1 FROM votes WHERE votes.poll_id = polls.id)
          )
        )
    )
  );

-- ============================================================================
-- POLL OPTIONS
-- ============================================================================

CREATE POLICY "Trip members can view poll options"
  ON poll_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls p
      JOIN trip_members tm ON tm.trip_id = p.trip_id
      WHERE p.id = poll_options.poll_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Poll creators can add options"
  ON poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = poll_options.poll_id
        AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Poll creators can update options"
  ON poll_options FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = poll_options.poll_id
        AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Poll creators can delete options"
  ON poll_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = poll_options.poll_id
        AND p.created_by = auth.uid()
    )
  );

-- ============================================================================
-- VOTES
-- ============================================================================

CREATE POLICY "Users can view own votes"
  ON votes FOR SELECT
  USING (auth.uid() = votes.user_id);

CREATE POLICY "Users can view non-anonymous votes"
  ON votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = votes.poll_id
        AND p.is_anonymous = false
    )
    AND EXISTS (
      SELECT 1 FROM polls p
      JOIN trip_members tm ON tm.trip_id = p.trip_id
      WHERE p.id = votes.poll_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Members can vote"
  ON votes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls p
      JOIN trip_members tm ON tm.trip_id = p.trip_id
      WHERE p.id = votes.poll_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('Owner', 'Organizer', 'Member')
        AND tm.status = 'Joined'
        AND (p.closes_at IS NULL OR p.closes_at > NOW())
    )
  );

CREATE POLICY "Users can update own votes"
  ON votes FOR UPDATE
  USING (
    auth.uid() = votes.user_id
    AND EXISTS (
      SELECT 1 FROM polls p
      WHERE p.id = votes.poll_id
        AND (p.closes_at IS NULL OR p.closes_at > NOW())
    )
  );

CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  USING (auth.uid() = votes.user_id);

-- ============================================================================
-- BLIND BUDGETS ⚠️ CRITICAL
-- ============================================================================

CREATE POLICY "Users can view ONLY own budget"
  ON blind_budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget"
  ON blind_budgets FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = blind_budgets.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Users can update own budget"
  ON blind_budgets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget"
  ON blind_budgets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- EXPENSES
-- ============================================================================

CREATE POLICY "Trip members can view expenses"
  ON expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Members can create expenses"
  ON expenses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer', 'Member')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can update expenses"
  ON expenses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR expenses.created_by = auth.uid()
        )
    )
  );

CREATE POLICY "Owners and Organizers can delete expenses"
  ON expenses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = expenses.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR expenses.created_by = auth.uid()
        )
    )
  );

-- ============================================================================
-- EXPENSE SPLITS
-- ============================================================================

CREATE POLICY "Trip members can view expense splits"
  ON expense_splits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      JOIN trip_members tm ON tm.trip_id = e.trip_id
      WHERE e.id = expense_splits.expense_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Expense creators can add splits"
  ON expense_splits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_splits.expense_id
        AND e.created_by = auth.uid()
    )
  );

CREATE POLICY "Expense creators can update splits"
  ON expense_splits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_splits.expense_id
        AND e.created_by = auth.uid()
    )
    OR expense_splits.user_id = auth.uid()
  );

CREATE POLICY "Expense creators can delete splits"
  ON expense_splits FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_splits.expense_id
        AND e.created_by = auth.uid()
    )
  );

-- ============================================================================
-- TASKS
-- ============================================================================

CREATE POLICY "Trip members can view tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = tasks.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = tasks.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Organizer', 'Member')
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "Owners and Organizers can update tasks"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = tasks.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR tasks.assigned_to = auth.uid()
          OR tasks.created_by = auth.uid()
        )
    )
  );

CREATE POLICY "Owners and Organizers can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = tasks.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
        AND (
          trip_members.role IN ('Owner', 'Organizer')
          OR tasks.created_by = auth.uid()
        )
    )
  );

-- ============================================================================
-- CHECKLIST TEMPLATES
-- ============================================================================

CREATE POLICY "Users can view public templates"
  ON checklist_templates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own templates"
  ON checklist_templates FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can create templates"
  ON checklist_templates FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own templates"
  ON checklist_templates FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON checklist_templates FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- ACTIVITY FEED
-- ============================================================================

CREATE POLICY "Trip members can view activity feed"
  ON activity_feed FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = activity_feed.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.status = 'Joined'
    )
  );

CREATE POLICY "System can insert activity feed"
  ON activity_feed FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- STORAGE: avatars
-- ============================================================================

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE: receipts
-- ============================================================================

CREATE POLICY "Trip members can view receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND EXISTS (
      SELECT 1 FROM expenses e
      JOIN trip_members tm ON tm.trip_id = e.trip_id
      WHERE e.id::text = (storage.foldername(name))[1]
        AND tm.user_id = auth.uid()
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Members can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND EXISTS (
      SELECT 1 FROM expenses e
      JOIN trip_members tm ON tm.trip_id = e.trip_id
      WHERE e.id::text = (storage.foldername(name))[1]
        AND tm.user_id = auth.uid()
        AND tm.role IN ('Owner', 'Organizer', 'Member')
        AND tm.status = 'Joined'
    )
  );

CREATE POLICY "Expense creators can update receipts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'receipts'
    AND EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id::text = (storage.foldername(name))[1]
        AND e.created_by = auth.uid()
    )
  );

CREATE POLICY "Expense creators can delete receipts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id::text = (storage.foldername(name))[1]
        AND e.created_by = auth.uid()
    )
  );
