# Test Users

This document maintains the list of test users in our **local Supabase Docker instance** for E2E testing.

## ⚠️ Important: Local Supabase Setup

TripFlow uses **local Supabase running in Docker** (see [README.md](../README.md#3-start-local-supabase)). All test users are created in the local instance, not the cloud.

**Prerequisites:**
- Docker Desktop running
- Supabase CLI installed (`brew install supabase/tap/supabase`)
- Local Supabase started (`supabase start`)
- Supabase Studio accessible at http://127.0.0.1:54423

## Test User Accounts

### Primary Test User

Used for most authentication and authorization E2E tests.

- **Email**: `test@example.com`
- **Password**: `validpassword123`
- **Purpose**: General authentication testing (login, session management, protected routes)
- **Stories using this user**: E01-S02 (User Login with Session Management)
- **Created**: 2026-03-04
- **Status**: ✅ Active

**Supabase Setup:**
- Location: Local Docker instance (http://127.0.0.1:54423)
- Email confirmed: Yes (auto-confirmed during creation)
- Email verification: Disabled for testing
- MFA: Disabled

## Creating New Test Users

When creating additional test users for future stories:

### Method 1: Supabase Studio (Easiest)

1. **Ensure Supabase is running:**
   ```bash
   supabase status  # Should show "supabase local development setup is running"
   ```

2. **Open Supabase Studio:**
   - Go to http://127.0.0.1:54423
   - Navigate to **Authentication** → **Users**

3. **Create user:**
   - Click **Add user** → **Create new user**
   - Enter email, password
   - ✅ Enable **"Auto Confirm User"** (skip email verification)
   - Click **Create user**

### Method 2: Supabase CLI (Automated)

```bash
# Ensure local Supabase is running
supabase status

# Create user with auto-confirmed email
supabase auth users create \
  --email test-new@example.com \
  --password testpassword123 \
  --email-confirmed

# Verify user was created
supabase auth users list
```

### Method 3: SQL (Direct Database)

```sql
-- Connect to local Supabase Studio → SQL Editor
-- Or use: psql -h localhost -p 54322 -d postgres -U postgres

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test-sql@example.com',
  crypt('testpassword123', gen_salt('bf')),
  now(),
  now(),
  now(),
  ''
);
```

## Test User Best Practices

1. **Password Security**: Use strong passwords even for test users to match validation rules (min 8 characters)
2. **Email Format**: Use `test-*@example.com` pattern for easy identification
3. **Cleanup**: Don't delete test users between test runs - E2E tests expect them to exist
4. **Documentation**: Always document new test users in this file with their purpose
5. **Isolation**: Create separate test users for different test scenarios (e.g., admin vs regular user)
6. **Auto-confirm**: Always enable "Auto Confirm User" or use `--email-confirmed` flag to skip verification

## Future Test Users

As new stories require different user roles or scenarios, document them below:

### Example: Admin Test User (Future)
- **Email**: `test-admin@example.com`
- **Password**: `adminpassword123`
- **Purpose**: Admin role testing
- **Stories**: (TBD)

### Example: Secondary User for Collaboration Tests (Future)
- **Email**: `test-user2@example.com`
- **Password**: `userpassword123`
- **Purpose**: Multi-user collaboration features (trip invitations, shared budgets)
- **Stories**: (TBD)

## Troubleshooting

### Supabase Not Running
If CLI commands fail or Studio is inaccessible:
```bash
# Check status
supabase status

# If stopped, start it
supabase start

# If containers are unhealthy
supabase stop
docker system prune -f  # Clean up
supabase start

# Verify Docker Desktop is running
docker ps | grep supabase
```

### User Already Exists
If you get "user already exists" error when creating the test user:
- ✅ This is expected! The user should only be created once
- Verify the user exists: http://127.0.0.1:54423 → Authentication → Users
- Use the existing credentials for testing
- If needed, delete the user in Studio and recreate

### Authentication Failures in Tests
If E2E tests fail with authentication errors:

1. **Check Supabase is running:**
   ```bash
   supabase status  # All services should be "running"
   curl http://127.0.0.1:54421/rest/v1/  # Should return 404 (service is up)
   ```

2. **Verify test user exists:**
   - Open http://127.0.0.1:54423 → Authentication → Users
   - Look for `test@example.com`
   - Check "Email Confirmed" is ✅ (not pending)

3. **Check .env.local configuration:**
   ```bash
   # These should match `supabase status` output
   grep SUPABASE .env.local
   # NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=[from supabase status]
   ```

4. **Reset database if needed:**
   ```bash
   supabase db reset  # Warning: Deletes all data
   # Then recreate test user
   ```

### E2E Tests Can't Connect
If tests fail with network errors:
- Ensure dev server is running: `pnpm dev` (port 3100)
- Ensure Supabase is running: `supabase status`
- Check playwright config uses correct baseURL: `http://localhost:3100`
- Verify no firewall blocking localhost connections

### Port Conflicts
If Supabase fails to start due to port conflicts:
```bash
# Check what's using Supabase ports
lsof -i :54321 -i :54322 -i :54323

# Kill conflicting processes or change ports in supabase/config.toml
```
