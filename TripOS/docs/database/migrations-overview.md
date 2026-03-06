# Database Migrations Overview

This document provides an overview of all database migrations in the TripOS project. Migrations are executed sequentially to build and evolve the database schema.

## Migration Count

**Total Migrations:** 29 files

## Migration Files (Chronological Order)

### Foundation Layer (Extensions, Types, Core Functions)

| Migration | File | Purpose |
|-----------|------|---------|
| 001 | `20260212000001_create_extensions.sql` | Install required PostgreSQL extensions (uuid-ossp, pgcrypto, etc.) |
| 002 | `20260212000002_create_enums.sql` | Define enum types for roles, statuses, permissions |
| 003 | `20260212000003_create_functions.sql` | Create utility functions and triggers |

### User Management

| Migration | File | Purpose |
|-----------|------|---------|
| 004 | `20260212000004_create_profiles.sql` | User profile table with extended user data |

### Trip Core Tables

| Migration | File | Purpose |
|-----------|------|---------|
| 005 | `20260212000005_create_trips.sql` | Core trips table (trip metadata, settings) |
| 006 | `20260212000006_create_trip_members.sql` | Trip membership and role assignments |

### Activity Management

| Migration | File | Purpose |
|-----------|------|---------|
| 007 | `20260212000007_create_activities.sql` | Core activities table (events, destinations) |
| 008 | `20260212000008_create_activity_attendees.sql` | Track who's attending each activity |
| 009 | `20260212000009_create_activity_versions.sql` | Version history for activity edits |
| 010 | `20260212000010_create_activity_drafts.sql` | Draft versions of activities before publishing |

### Voting System

| Migration | File | Purpose |
|-----------|------|---------|
| 011 | `20260212000011_create_polls.sql` | Poll metadata and settings |
| 012 | `20260212000012_create_poll_options.sql` | Poll choices/options |
| 013 | `20260212000013_create_votes.sql` | Individual vote records |

### Budget & Expense Tracking

| Migration | File | Purpose |
|-----------|------|---------|
| 014 | `20260212000014_create_blind_budgets.sql` | **Privacy-critical:** Individual budget caps (RLS isolated) |
| 015 | `20260212000015_create_expenses.sql` | Expense tracking table |
| 016 | `20260212000016_create_expense_splits.sql` | Split expenses between trip members |

### Task Management

| Migration | File | Purpose |
|-----------|------|---------|
| 017 | `20260212000017_create_tasks.sql` | Trip tasks and checklist items |
| 018 | `20260212000018_create_checklist_templates.sql` | Reusable task templates (packing lists, pre-trip checklists) |

### Collaboration Features

| Migration | File | Purpose |
|-----------|------|---------|
| 019 | `20260212000019_create_activity_feed.sql` | Real-time activity feed for trip updates |
| 020 | `20260212000020_create_notifications.sql` | User notification system |
| 021 | `20260212000021_create_invite_links.sql` | Shareable invite links for trips |

### Utility Functions

| Migration | File | Purpose |
|-----------|------|---------|
| 022 | `20260212000022_create_ping_function.sql` | Health check function for monitoring |

### Bug Fixes & Improvements

| Migration | File | Purpose |
|-----------|------|---------|
| 023 | `20260213205038_fix_handle_new_user_schema.sql` | Fix user registration trigger schema issues |
| 024 | `20260214165500_create_avatars_storage.sql` | Add Supabase Storage bucket for user avatars |
| 025 | `20260214200000_fix_rls_infinite_recursion.sql` | Fix Row-Level Security policy recursion bugs |
| 026 | `20260214210000_account_deletion_cascade.sql` | Ensure proper cascade on account deletion |
| 027 | `20260214220000_create_auth_events.sql` | Track authentication events for security |

### Advanced Features

| Migration | File | Purpose |
|-----------|------|---------|
| 028 | `20260215000001_create_trip_with_owner_rpc.sql` | Stored procedure to atomically create trip + owner membership |
| 029 | `20260215000002_trip_lifecycle_rls.sql` | Row-Level Security for complete trip lifecycle |

---

## Database Schema Architecture

### Core Domains

1. **Authentication & Users**
   - Supabase Auth (built-in)
   - Profiles table (extended user data)
   - Auth events tracking

2. **Trip Management**
   - Trips (metadata)
   - Trip Members (membership + roles)
   - Invite Links (shareable invitations)

3. **Activities**
   - Activities (events, destinations)
   - Activity Attendees
   - Activity Versions (edit history)
   - Activity Drafts (unpublished edits)

4. **Voting & Decision Making**
   - Polls (question + settings)
   - Poll Options (choices)
   - Votes (individual votes with privacy)

5. **Budget & Expenses**
   - Blind Budgets (**privacy-critical** - RLS isolated)
   - Expenses (shared expense tracking)
   - Expense Splits (how expenses are divided)

6. **Tasks & Checklists**
   - Tasks (todo items)
   - Checklist Templates (reusable task lists)

7. **Collaboration**
   - Activity Feed (real-time updates)
   - Notifications (user alerts)

8. **Storage**
   - Avatars bucket (user profile images)

---

## Row-Level Security (RLS)

**All tables have Row-Level Security enabled.** Access is controlled at the database level, not the application layer.

**Key RLS Features:**
- **Role-based access**: Owner > Organizer > Member > Guest hierarchy
- **Trip isolation**: Users can only access data from trips they're members of
- **Blind budget privacy**: Individual budget caps are only visible to the user who set them
- **Guest restrictions**: Guests have read-only access with limited visibility

See [rls-policies.md](./rls-policies.md) for detailed policy documentation.

---

## Edge Functions

TripOS uses Supabase Edge Functions (Deno/TypeScript) for complex business logic that shouldn't run in the browser.

**Deployed Edge Functions:**
- `delete-account` - Handles account deletion with proper cascade
- `transfer-ownership` - Transfers trip ownership to another member

See [edge-functions.md](./edge-functions.md) for detailed function documentation.

---

## Migration Management

### Running Migrations Locally

```bash
# Start local Supabase
pnpm db:start

# Apply all migrations
supabase db reset

# Apply new migrations only
supabase db push
```

### Creating New Migrations

```bash
# Generate a new migration file
supabase migration new <migration_name>

# Example
supabase migration new add_comments_table
```

### Migration Naming Convention

Format: `YYYYMMDDHHMMSS_description.sql`

Examples:
- `20260212000001_create_extensions.sql`
- `20260214165500_create_avatars_storage.sql`

---

## Database Type Generation

TripOS auto-generates TypeScript types from the database schema:

```bash
# Generate types
pnpm db:types

# Output location
packages/types/src/database.ts
```

These types are imported throughout the application:
```typescript
import type { Database } from '@repo/types';

type Trip = Database['public']['Tables']['trips']['Row'];
```

---

## Critical Notes

### Blind Budgeting Privacy

**CRITICAL:** Individual budget caps in the `blind_budgets` table are **RLS-isolated** per user. The application:
- ❌ Never sends individual budgets to the client
- ❌ Never includes them in API responses
- ❌ Never logs them in application logs
- ✅ Only calculates group ceiling server-side via Edge Function
- ✅ Uses timing delays (5-15s random) to prevent timing attacks

See `docs/strategy/blind-budgeting-deep-dive.md` for complete privacy architecture.

---

## Next Steps

- [Schema Overview](./schema-overview.md) - Detailed table structure and relationships
- [RLS Policies](./rls-policies.md) - Row-Level Security policy documentation
- [Edge Functions](./edge-functions.md) - Serverless function documentation

---

**Last Updated:** February 2026
**Migration Count:** 29
**Edge Functions:** 2
