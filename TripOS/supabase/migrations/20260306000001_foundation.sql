-- Foundation: Extensions, Enums, and Utility Functions
-- Migration: 20260306000001_foundation.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE trip_role AS ENUM ('Owner', 'Organizer', 'Member', 'Guest');
CREATE TYPE member_status AS ENUM ('Invited', 'Joined', 'Left');
CREATE TYPE activity_status AS ENUM ('Draft', 'Proposed', 'Scheduled', 'Completed', 'Cancelled');
CREATE TYPE attendance_status AS ENUM ('Going', 'Maybe', 'Not Going');
CREATE TYPE poll_type AS ENUM ('Single Choice', 'Multiple Choice', 'Ranked Choice');
CREATE TYPE expense_category AS ENUM ('Accommodation', 'Food', 'Transport', 'Activity', 'Other');
CREATE TYPE task_status AS ENUM ('Todo', 'In Progress', 'Done');
CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE template_category AS ENUM ('Pre-Trip', 'Packing', 'During Trip', 'Post-Trip');
CREATE TYPE action_type AS ENUM ('Added Activity', 'Edited Activity', 'Deleted Activity', 'Voted', 'Logged Expense', 'Completed Task', 'Joined Trip', 'Left Trip', 'Budget Submitted');
CREATE TYPE notification_type AS ENUM ('Invite', 'Vote Closed', 'Expense Added', 'Task Assigned', 'Trip Updated', 'Member Joined', 'Activity Added');

-- Utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
