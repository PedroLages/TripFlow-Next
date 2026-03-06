# Row-Level Security (RLS) Policies

This document provides an overview of Row-Level Security policies in the TripOS database. RLS enforces access control at the database level, ensuring users can only access data they're authorized to see.

## RLS Philosophy

**All tables have RLS enabled.** Access control is enforced at the PostgreSQL level, not the application layer.

### Key Principles

1. **Database-level enforcement** - Security cannot be bypassed by malicious clients
2. **Role-based access** - Owner > Organizer > Member > Guest hierarchy
3. **Trip isolation** - Users only access data from trips they're members of
4. **Privacy-first** - Blind budgets are isolated per user
5. **Fail-secure** - Default deny unless explicitly allowed

---

## Role Hierarchy

### Trip Roles (Defined in `trip_members.role`)

| Role | Permissions | Can Do |
|------|-------------|--------|
| **Owner** | Full control | Everything (including transfer ownership, delete trip) |
| **Organizer** | Trip management | Edit trip, manage members, add/edit/delete activities, NOT delete trip |
| **Member** | Participant | Add activities, vote, log expenses, complete tasks, read all trip data |
| **Guest** | View-only | Read-only access to trip overview, activities, public polls |

---

## Core Table Policies

### 1. **profiles**

**Policy:** Users can only view their own profile or profiles of trip members.

- **SELECT**
  - ✅ Own profile: Always allowed
  - ✅ Other profiles: Only if they're in a shared trip
  - ❌ Random user profiles: Denied

- **INSERT**
  - ✅ Own profile: Allowed (on signup)
  - ❌ Other profiles: Denied

- **UPDATE**
  - ✅ Own profile: Allowed
  - ❌ Other profiles: Denied

- **DELETE**
  - ✅ Own profile: Allowed (via Edge Function only)
  - ❌ Other profiles: Denied

---

### 2. **trips**

**Policy:** Users can only access trips they're members of.

- **SELECT**
  - ✅ Member: If `trip_members.user_id = current_user` AND `status = 'Joined'`
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Any authenticated user: Can create new trips (automatically becomes Owner)

- **UPDATE**
  - ✅ Owner: Full edit access
  - ✅ Organizer: Can edit trip details (NOT delete or archive)
  - ❌ Member/Guest: Denied

- **DELETE**
  - ✅ Owner: Can soft-delete trip (`deleted_at` timestamp)
  - ❌ Organizer/Member/Guest: Denied

---

### 3. **trip_members**

**Policy:** Users can view trip members, but only Owners/Organizers can modify.

- **SELECT**
  - ✅ Trip members: Can view all members of their trips
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Owner/Organizer: Can add new members
  - ✅ Any user: Can insert own membership (via invite link)

- **UPDATE**
  - ✅ Owner: Can change any member's role or remove members
  - ✅ Organizer: Can change Member/Guest roles (NOT Owner/Organizer)
  - ✅ Member/Guest: Can update own `left_at` (leave trip)

- **DELETE**
  - ✅ Owner: Can delete any membership
  - ❌ Others: Denied (use UPDATE to set `left_at` instead)

---

### 4. **activities**

**Policy:** Trip members can view activities; Organizers+ can manage.

- **SELECT**
  - ✅ Owner/Organizer/Member: Full visibility
  - ✅ Guest: Can view published activities only (NOT drafts)
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Owner/Organizer/Member: Can create activities
  - ❌ Guest: Denied

- **UPDATE**
  - ✅ Owner/Organizer: Can edit any activity
  - ✅ Member: Can edit own activities
  - ❌ Guest: Denied

- **DELETE**
  - ✅ Owner/Organizer: Can delete any activity
  - ✅ Member: Can delete own activities
  - ❌ Guest: Denied

---

### 5. **polls**

**Policy:** Trip members can view and vote; creators/organizers can manage.

- **SELECT**
  - ✅ Owner/Organizer/Member: All polls
  - ✅ Guest: Only public polls (if implemented)
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Owner/Organizer/Member: Can create polls
  - ❌ Guest: Denied

- **UPDATE**
  - ✅ Owner/Organizer: Can edit any poll
  - ✅ Creator: Can edit own polls (before closing)
  - ❌ Others: Denied

- **DELETE**
  - ✅ Owner/Organizer: Can delete any poll
  - ✅ Creator: Can delete own polls (if no votes yet)
  - ❌ Others: Denied

---

### 6. **votes**

**Policy:** Users can vote once per poll option; anonymity respected.

- **SELECT**
  - ✅ Own votes: Always visible
  - ✅ Other votes: Visible IF `polls.is_anonymous = false`
  - ❌ Anonymous votes: `user_id` hidden (returns NULL)

- **INSERT**
  - ✅ Owner/Organizer/Member: Can vote on open polls
  - ❌ Guest: Denied

- **UPDATE**
  - ✅ Own votes: Can change vote (if poll still open)
  - ❌ Other votes: Denied

- **DELETE**
  - ✅ Own votes: Can withdraw vote
  - ❌ Other votes: Denied

**Anonymous Voting Implementation:**
- RLS policy filters `user_id` column when `is_anonymous = true`
- Vote counts still visible, but voter identity hidden
- Poll creator can never see individual voters (enforced by RLS)

---

### 7. **blind_budgets** ⚠️ **CRITICAL**

**Policy:** Blind budgets are **strictly isolated** per user.

- **SELECT**
  - ✅ Own budget: Users can view ONLY their own `budget_amount`
  - ❌ Other budgets: **COMPLETELY HIDDEN** (returns 0 rows)
  - ❌ Group ceiling: NOT exposed via SELECT (calculated server-side only)

- **INSERT**
  - ✅ Own budget: Can set initial budget
  - ❌ Other budgets: Denied

- **UPDATE**
  - ✅ Own budget: Can change `budget_amount`
  - ❌ Other budgets: Denied

- **DELETE**
  - ✅ Own budget: Can remove budget constraint
  - ❌ Other budgets: Denied

**Privacy Architecture:**
- Individual budgets never sent to client bundles
- Group ceiling calculated by Edge Function only
- Timing delay (5-15s random) prevents timing attacks
- Audit logs use hash-only (no plaintext budget values)

See [blind-budgeting-deep-dive.md](../strategy/blind-budgeting-deep-dive.md) for complete privacy architecture.

---

### 8. **expenses**

**Policy:** Trip members can log expenses; all members can view.

- **SELECT**
  - ✅ Owner/Organizer/Member: All trip expenses
  - ✅ Guest: Read-only view
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Owner/Organizer/Member: Can log expenses
  - ❌ Guest: Denied

- **UPDATE**
  - ✅ Owner/Organizer: Can edit any expense
  - ✅ Creator: Can edit own expenses
  - ❌ Guest: Denied

- **DELETE**
  - ✅ Owner/Organizer: Can delete any expense
  - ✅ Creator: Can delete own expenses
  - ❌ Guest: Denied

---

### 9. **tasks**

**Policy:** Trip members can create and complete tasks.

- **SELECT**
  - ✅ Owner/Organizer/Member: All trip tasks
  - ✅ Guest: View-only
  - ❌ Non-members: Denied

- **INSERT**
  - ✅ Owner/Organizer/Member: Can create tasks
  - ❌ Guest: Denied

- **UPDATE**
  - ✅ Owner/Organizer: Can edit any task
  - ✅ Assigned user: Can update status, mark complete
  - ✅ Creator: Can edit own tasks
  - ❌ Guest: Denied

- **DELETE**
  - ✅ Owner/Organizer: Can delete any task
  - ✅ Creator: Can delete own tasks
  - ❌ Others: Denied

---

### 10. **notifications**

**Policy:** Users can only access their own notifications.

- **SELECT**
  - ✅ Own notifications: `user_id = current_user`
  - ❌ Other notifications: Denied

- **INSERT**
  - ✅ System: Created by triggers and Edge Functions
  - ❌ Direct inserts: Denied (use trigger instead)

- **UPDATE**
  - ✅ Own notifications: Can mark as read
  - ❌ Other notifications: Denied

- **DELETE**
  - ✅ Own notifications: Can delete/dismiss
  - ❌ Other notifications: Denied

---

## Storage Policies

### **avatars** Bucket

**Policy:** Users can upload/update their own avatar; anyone can view public avatars.

- **SELECT (Read)**
  - ✅ Any authenticated user: Can view any avatar

- **INSERT (Upload)**
  - ✅ Own avatar: `storage.foldername(name) = current_user.id`
  - ❌ Other avatars: Denied

- **UPDATE**
  - ✅ Own avatar: Can replace avatar image
  - ❌ Other avatars: Denied

- **DELETE**
  - ✅ Own avatar: Can delete avatar
  - ❌ Other avatars: Denied

---

## RLS Bypass (Service Role)

**Edge Functions** run with **service role** privileges, bypassing RLS. This is necessary for:

1. **Blind budget calculation** - Edge Function `calculate-group-budget` reads all individual budgets (hidden from users)
2. **Account deletion** - Edge Function `delete-account` removes user data across all tables
3. **Ownership transfer** - Edge Function `transfer-ownership` updates trip ownership atomically

**Security:** Edge Functions must validate user permissions before bypassing RLS.

---

## Testing RLS Policies

### Local Testing

```sql
-- Switch to user context
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid-here"}';

-- Test SELECT policy
SELECT * FROM trips; -- Should only show trips where you're a member

-- Reset
RESET ROLE;
```

### Common RLS Checks

```sql
-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false; -- Should return 0 rows

-- View policies for a table
SELECT * FROM pg_policies
WHERE tablename = 'blind_budgets';
```

---

## RLS Performance Considerations

**Issue:** RLS policies can cause performance overhead on large queries.

**Optimizations:**
1. **Indexes:** Add indexes on foreign keys used in RLS policies (e.g., `trip_id`, `user_id`)
2. **Materialized views:** Pre-compute trip membership for frequently accessed data
3. **Function optimization:** RLS policies that call functions should be marked `STABLE` or `IMMUTABLE`

**Critical indexes:**
- `trip_members(user_id, trip_id, status)` - Composite index for membership lookup
- `blind_budgets(user_id, trip_id)` - Composite index for budget isolation
- `activities(trip_id)` - Index for trip-scoped queries

---

## Security Checklist

Before deploying any new table:

- [ ] RLS is enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`)
- [ ] Policies cover all operations (SELECT, INSERT, UPDATE, DELETE)
- [ ] Policies default to deny (explicit allow only)
- [ ] Foreign key indexes exist for RLS predicates
- [ ] Service role bypass is justified and documented
- [ ] Policies tested with multiple user roles
- [ ] Anonymous user access denied (if not public)

---

## Next Steps

- [Migrations Overview](./migrations-overview.md) - Complete migration history
- [Schema Overview](./schema-overview.md) - Table structure and relationships
- [Edge Functions](./edge-functions.md) - Serverless function documentation

---

**Last Updated:** February 2026
**RLS-Enabled Tables:** 18 (all tables)
