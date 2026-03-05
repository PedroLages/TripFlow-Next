# Database Schema Overview

This document provides a high-level overview of the TripOS database schema, including table relationships and key columns.

## Entity Relationship Summary

```
┌─────────────┐
│   Profile   │─┐
└─────────────┘ │
                │
                ├──► Trips ◄──┐
                │             │
                │             │
                ▼             ▼
         Trip Members ──► Blind Budgets
                │             │
                │             ▼
                │        Expenses ──► Expense Splits
                │
                ├──► Activities ──┬──► Activity Attendees
                │                 ├──► Activity Versions
                │                 └──► Activity Drafts
                │
                ├──► Polls ──► Poll Options ──► Votes
                │
                ├──► Tasks ◄── Checklist Templates
                │
                ├──► Invite Links
                │
                ├──► Activity Feed
                │
                └──► Notifications
```

---

## Core Tables

### 1. Authentication & Users

#### **profiles**
Extended user profile data (one-to-one with Supabase Auth users).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | FK to auth.users |
| `full_name` | text | User's full name |
| `avatar_url` | text | Profile picture URL |
| `created_at` | timestamp | Account creation time |
| `updated_at` | timestamp | Last profile update |

**Relationships:**
- One profile per auth user
- One profile has many trip memberships
- One profile has many blind budgets

---

#### **auth_events**
Security audit log for authentication events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to profiles |
| `event_type` | text | Event type (login, logout, password_change, etc.) |
| `ip_address` | inet | IP address of the event |
| `user_agent` | text | Browser/device info |
| `created_at` | timestamp | Event timestamp |

---

### 2. Trip Management

#### **trips**
Core trip metadata and settings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Trip name |
| `description` | text | Trip overview |
| `destination` | text | Primary destination |
| `start_date` | date | Trip start date |
| `end_date` | date | Trip end date |
| `cover_image_url` | text | Trip cover image |
| `currency` | text | Base currency (ISO 4217 code) |
| `is_public` | boolean | Public visibility |
| `archived_at` | timestamp | NULL if active, timestamp if archived |
| `deleted_at` | timestamp | Soft delete timestamp |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

**Relationships:**
- One trip has many members (trip_members)
- One trip has many activities
- One trip has many expenses
- One trip has many tasks
- One trip has many polls

---

#### **trip_members**
Trip membership and role assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `user_id` | uuid | FK to profiles |
| `role` | enum | Owner, Organizer, Member, Guest |
| `status` | enum | Invited, Joined, Left |
| `joined_at` | timestamp | When user joined |
| `left_at` | timestamp | When user left (NULL if active) |
| `created_at` | timestamp | Invite creation time |

**Role Hierarchy:**
1. **Owner** - Full control (create, edit, delete, transfer ownership)
2. **Organizer** - Manage trip (edit activities, manage members, NOT delete trip)
3. **Member** - Participate (add activities, vote, log expenses, complete tasks)
4. **Guest** - View-only (read-only access with limited visibility)

---

#### **invite_links**
Shareable invite links for trips.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `code` | text | Unique invite code (URL-safe) |
| `role` | enum | Role granted on join (Member, Guest) |
| `max_uses` | integer | Max uses (NULL = unlimited) |
| `uses_count` | integer | Current use count |
| `expires_at` | timestamp | Expiration time (NULL = never) |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |

---

### 3. Activities

#### **activities**
Trip events and destinations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `name` | text | Activity name |
| `description` | text | Activity details |
| `location` | text | Address/place name |
| `lat` | numeric | Latitude |
| `lng` | numeric | Longitude |
| `start_time` | timestamp | Scheduled start |
| `end_time` | timestamp | Scheduled end |
| `cost_estimate` | numeric | Estimated cost per person |
| `status` | enum | Draft, Proposed, Scheduled, Completed, Cancelled |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

---

#### **activity_attendees**
Tracks who's attending each activity.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `activity_id` | uuid | FK to activities |
| `user_id` | uuid | FK to profiles |
| `attendance_status` | enum | Going, Maybe, Not Going |
| `created_at` | timestamp | RSVP time |

---

#### **activity_versions**
Version history for activity edits (audit trail).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `activity_id` | uuid | FK to activities |
| `version_number` | integer | Sequential version |
| `data` | jsonb | Snapshot of activity data |
| `changed_by` | uuid | FK to profiles |
| `changed_at` | timestamp | Edit time |

---

#### **activity_drafts**
Draft versions of activities before publishing.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `activity_id` | uuid | FK to activities (NULL if new) |
| `trip_id` | uuid | FK to trips |
| `data` | jsonb | Draft activity data |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Draft creation time |
| `updated_at` | timestamp | Last draft update |

---

### 4. Voting & Decision Making

#### **polls**
Poll metadata and settings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `title` | text | Poll question |
| `description` | text | Additional context |
| `poll_type` | enum | Single Choice, Multiple Choice, Ranked Choice |
| `closes_at` | timestamp | Voting deadline (NULL = open) |
| `is_anonymous` | boolean | Hide voter identity |
| `max_selections` | integer | Max choices (for multiple choice) |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |
| `closed_at` | timestamp | When poll was closed |

---

#### **poll_options**
Poll choices/options.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `poll_id` | uuid | FK to polls |
| `option_text` | text | Choice text |
| `description` | text | Additional info |
| `sort_order` | integer | Display order |
| `created_at` | timestamp | Creation time |

---

#### **votes**
Individual vote records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `poll_id` | uuid | FK to polls |
| `user_id` | uuid | FK to profiles |
| `option_id` | uuid | FK to poll_options |
| `rank` | integer | Ranking (for ranked choice voting) |
| `created_at` | timestamp | Vote time |
| `updated_at` | timestamp | Last change time |

**Privacy:** If `polls.is_anonymous = true`, voter identity is hidden from other users (enforced by RLS).

---

### 5. Budget & Expenses

#### **blind_budgets**
⚠️ **PRIVACY CRITICAL** - Individual budget caps (RLS isolated per user).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `user_id` | uuid | FK to profiles (RLS isolated) |
| `budget_amount` | numeric | Individual budget cap |
| `currency` | text | Currency code |
| `created_at` | timestamp | Budget set time |
| `updated_at` | timestamp | Last update time |

**CRITICAL SECURITY:**
- ❌ Never exposed to client bundles
- ❌ Never returned in API responses
- ❌ Never logged in application logs
- ✅ Only accessed server-side by Edge Functions
- ✅ Group ceiling calculated with timing delays (5-15s random)

---

#### **expenses**
Shared expense tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `name` | text | Expense description |
| `amount` | numeric | Total amount |
| `currency` | text | Currency code |
| `category` | enum | Accommodation, Food, Transport, Activity, Other |
| `paid_by` | uuid | FK to profiles (who paid) |
| `paid_at` | timestamp | Payment date |
| `receipt_url` | text | Receipt image URL |
| `notes` | text | Additional notes |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |

---

#### **expense_splits**
How expenses are divided between trip members.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `expense_id` | uuid | FK to expenses |
| `user_id` | uuid | FK to profiles |
| `split_amount` | numeric | Amount owed by this user |
| `is_settled` | boolean | Payment status |
| `settled_at` | timestamp | Settlement time |

---

### 6. Tasks & Checklists

#### **tasks**
Trip tasks and checklist items.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `title` | text | Task title |
| `description` | text | Task details |
| `assigned_to` | uuid | FK to profiles (NULL = unassigned) |
| `due_date` | timestamp | Deadline |
| `status` | enum | Todo, In Progress, Done |
| `priority` | enum | Low, Medium, High |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |
| `completed_at` | timestamp | Completion time |

---

#### **checklist_templates**
Reusable task templates (e.g., "Pre-Trip Checklist", "Packing List").

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Template name |
| `description` | text | Template description |
| `category` | enum | Pre-Trip, Packing, During Trip, Post-Trip |
| `tasks` | jsonb | Array of task objects |
| `is_public` | boolean | Available to all users |
| `created_by` | uuid | FK to profiles |
| `created_at` | timestamp | Creation time |

---

### 7. Collaboration

#### **activity_feed**
Real-time activity feed for trip updates.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `trip_id` | uuid | FK to trips |
| `user_id` | uuid | FK to profiles (actor) |
| `action_type` | enum | Added Activity, Voted, Logged Expense, etc. |
| `entity_type` | text | Activity, Poll, Expense, Task |
| `entity_id` | uuid | ID of referenced entity |
| `data` | jsonb | Event metadata |
| `created_at` | timestamp | Event time |

**Real-time:** Subscribed via Supabase Realtime channels per trip.

---

#### **notifications**
User notification system.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to profiles (recipient) |
| `trip_id` | uuid | FK to trips (NULL if account-level) |
| `notification_type` | enum | Invite, Vote Closed, Expense Added, etc. |
| `title` | text | Notification title |
| `message` | text | Notification body |
| `link` | text | Deep link to relevant entity |
| `is_read` | boolean | Read status |
| `read_at` | timestamp | Read time |
| `created_at` | timestamp | Notification time |

---

## Storage Buckets

### **avatars**
User profile images (Supabase Storage).

- **Bucket name:** `avatars`
- **Public access:** Yes (read-only)
- **Upload permissions:** Authenticated users (own avatar only)
- **Max file size:** 5 MB
- **Allowed types:** `.jpg`, `.jpeg`, `.png`, `.webp`

**File path format:** `{user_id}/avatar.{ext}`

---

## Database Functions

### **create_trip_with_owner()**
Atomically creates a trip and adds the creator as Owner.

**Parameters:**
- `p_trip_name` (text)
- `p_destination` (text)
- `p_start_date` (date)
- `p_end_date` (date)

**Returns:** `uuid` (trip ID)

---

### **ping()**
Health check function for monitoring.

**Returns:** `text` ("pong")

---

## Next Steps

- [Migrations Overview](./migrations-overview.md) - Complete migration history
- [RLS Policies](./rls-policies.md) - Row-Level Security documentation
- [Edge Functions](./edge-functions.md) - Serverless function documentation

---

**Last Updated:** February 2026
**Total Tables:** 18
**Total Storage Buckets:** 1
