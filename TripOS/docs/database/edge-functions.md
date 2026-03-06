# Supabase Edge Functions

This document provides an overview of Supabase Edge Functions in the TripOS project. Edge Functions are serverless Deno/TypeScript functions that run on Supabase's global edge network for complex business logic that shouldn't run in the browser.

## Why Edge Functions?

Edge Functions are used for operations that:
- Require **service role** privileges (bypassing RLS)
- Involve **sensitive data** (e.g., blind budgets)
- Need **atomic transactions** across multiple tables
- Implement **complex business logic** (e.g., ownership transfer)
- Send **notifications** or interact with external APIs

---

## Deployed Edge Functions

### 1. **delete-account**

**Purpose:** Handles complete account deletion with proper cascade and cleanup.

**Endpoint:** `https://<project-ref>.supabase.co/functions/v1/delete-account`

**Method:** `POST`

**Authentication:** Required (Bearer token)

#### **Request Body:**
```typescript
{
  confirmEmail: string; // User's email for confirmation
}
```

#### **Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### **Functionality:**

1. **Verification:**
   - Confirms user's email matches `confirmEmail`
   - Validates user is authenticated

2. **Cascade Deletion:**
   - Deletes all user data from `profiles`
   - Removes all `trip_members` records
   - Removes all `blind_budgets` records
   - Removes all `notifications` for the user
   - Transfers ownership of owned trips to next organizer (or archives trip if no other organizers)
   - Deletes user's avatar from Storage

3. **Auth Cleanup:**
   - Deletes user from `auth.users` (final step)

4. **Atomicity:**
   - All operations wrapped in a single transaction
   - Rollback on any error

#### **Error Codes:**

| Code | Message | Reason |
|------|---------|--------|
| 400 | "Email confirmation required" | Missing `confirmEmail` field |
| 401 | "Unauthorized" | No auth token or invalid token |
| 403 | "Email does not match" | `confirmEmail` doesn't match user's email |
| 500 | "Internal server error" | Database error or cascade failure |

#### **Usage Example:**

```typescript
const { data, error } = await supabase.functions.invoke('delete-account', {
  body: {
    confirmEmail: 'user@example.com'
  }
});

if (error) {
  console.error('Account deletion failed:', error);
} else {
  console.log('Account deleted:', data.message);
}
```

---

### 2. **transfer-ownership**

**Purpose:** Transfers trip ownership from current owner to another trip member atomically.

**Endpoint:** `https://<project-ref>.supabase.co/functions/v1/transfer-ownership`

**Method:** `POST`

**Authentication:** Required (Bearer token)

#### **Request Body:**
```typescript
{
  tripId: string;        // UUID of the trip
  newOwnerId: string;    // UUID of the new owner (must be existing member)
}
```

#### **Response:**
```typescript
{
  success: boolean;
  message: string;
  tripId: string;
  newOwnerId: string;
  previousOwnerId: string;
}
```

#### **Functionality:**

1. **Authorization:**
   - Verifies current user is the trip Owner
   - Verifies `newOwnerId` is a current trip member with status 'Joined'

2. **Ownership Transfer:**
   - Updates `trip_members` WHERE `user_id = current_owner` SET `role = 'Organizer'`
   - Updates `trip_members` WHERE `user_id = newOwnerId` SET `role = 'Owner'`

3. **Notification:**
   - Creates notification for new owner
   - Creates notification for previous owner

4. **Activity Feed:**
   - Logs ownership transfer event in `activity_feed`

5. **Atomicity:**
   - All operations wrapped in a single transaction
   - Rollback on any error

#### **Error Codes:**

| Code | Message | Reason |
|------|---------|--------|
| 400 | "Missing tripId or newOwnerId" | Invalid request body |
| 401 | "Unauthorized" | No auth token or invalid token |
| 403 | "Only the owner can transfer ownership" | Current user is not Owner role |
| 404 | "Trip not found" | `tripId` doesn't exist |
| 404 | "New owner is not a member" | `newOwnerId` is not in `trip_members` |
| 409 | "New owner must have 'Joined' status" | New owner has left or is still invited |
| 500 | "Internal server error" | Database error or transaction failure |

#### **Usage Example:**

```typescript
const { data, error } = await supabase.functions.invoke('transfer-ownership', {
  body: {
    tripId: 'trip-uuid-here',
    newOwnerId: 'new-owner-uuid-here'
  }
});

if (error) {
  console.error('Ownership transfer failed:', error);
} else {
  console.log('Ownership transferred:', data.message);
}
```

---

## Future Edge Functions (Not Yet Implemented)

### 3. **calculate-group-budget** (Planned)

**Purpose:** Calculates the group blind budget ceiling without exposing individual budgets.

**Functionality:**
- Reads all `blind_budgets` for a trip (service role bypass)
- Calculates group ceiling (e.g., average of individual budgets)
- Introduces timing delay (5-15s random) to prevent timing attacks
- Returns group ceiling to client
- Logs event with hash-only audit trail

See [blind-budgeting-deep-dive.md](../strategy/blind-budgeting-deep-dive.md) for complete specification.

---

### 4. **close-poll** (Planned)

**Purpose:** Closes a poll and calculates final results based on voting algorithm.

**Functionality:**
- Verifies poll creator or trip organizer/owner
- Sets `polls.closed_at` timestamp
- Calculates results based on `poll_type`:
  - **Single Choice:** Simple majority
  - **Multiple Choice:** Top N options by vote count
  - **Ranked Choice:** Instant-runoff voting (IRV) algorithm
- Stores results in `poll_results` table (to be created)
- Notifies all trip members of results

---

### 5. **settle-expenses** (Planned)

**Purpose:** Calculates expense settlements (who owes whom) using debt minimization algorithm.

**Functionality:**
- Fetches all unsettled expenses for a trip
- Calculates net balance for each member
- Minimizes number of transactions (greedy algorithm)
- Returns settlement plan: `[{ from: userId, to: userId, amount: number }]`
- Does NOT modify database (read-only operation)

---

### 6. **convert-currency** (Planned)

**Purpose:** Converts expense amounts between currencies using live exchange rates.

**Functionality:**
- Fetches live exchange rates from external API (e.g., OpenExchangeRates, Fixer.io)
- Caches rates for 1 hour
- Converts expense amount to trip's base currency
- Returns converted amount and exchange rate used

---

### 7. **send-notification** (Planned)

**Purpose:** Sends push notifications and/or emails to users.

**Functionality:**
- Accepts notification data (title, message, recipient IDs)
- Inserts into `notifications` table
- Optionally sends push notification via Firebase Cloud Messaging (FCM)
- Optionally sends email via Resend API
- Returns success status

---

## Edge Function Architecture

### File Structure

```
supabase/functions/
├── _shared/
│   ├── supabase.ts          # Supabase client factory
│   ├── auth.ts              # Auth helper functions
│   └── types.ts             # Shared TypeScript types
│
├── delete-account/
│   └── index.ts             # Main function entry point
│
└── transfer-ownership/
    └── index.ts             # Main function entry point
```

### Shared Utilities (`_shared/`)

**`supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

export const createServiceClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Bypasses RLS
  );
};

export const createAuthClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new Error('Unauthorized');

  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: authHeader }
      }
    }
  );
};
```

**`auth.ts`**
```typescript
export const getCurrentUser = async (client: SupabaseClient) => {
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
};
```

---

## Local Development

### Running Edge Functions Locally

```bash
# Start Supabase (includes Edge Functions runtime)
pnpm db:start

# Serve functions locally (auto-reload on changes)
supabase functions serve

# Edge Functions available at:
# http://localhost:54321/functions/v1/<function-name>
```

### Testing Locally

```bash
# Using curl
curl -X POST 'http://localhost:54321/functions/v1/delete-account' \
  -H 'Authorization: Bearer <supabase-auth-token>' \
  -H 'Content-Type: application/json' \
  -d '{"confirmEmail": "user@example.com"}'

# Using the client
const { data, error } = await supabase.functions.invoke('delete-account', {
  body: { confirmEmail: 'user@example.com' }
});
```

---

## Deployment

### Deploy All Functions

```bash
# Deploy all Edge Functions to production
supabase functions deploy

# Deploy specific function
supabase functions deploy delete-account
```

### Environment Variables

Edge Functions have access to:
- `SUPABASE_URL` - Project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (RLS bypass)

**Custom environment variables** can be set via:
```bash
supabase secrets set MY_API_KEY=value
```

---

## Security Considerations

### Service Role Usage

**CRITICAL:** Edge Functions run with `service_role` key, which **bypasses RLS**. Always:

1. **Validate user permissions** before bypassing RLS
2. **Verify user identity** via auth token
3. **Log sensitive operations** for audit trail
4. **Use transactions** to ensure atomicity
5. **Handle errors gracefully** (rollback on failure)

### Example: Checking Permissions

```typescript
// ❌ WRONG: Blindly bypass RLS
const { data } = await serviceClient
  .from('blind_budgets')
  .select('*'); // Exposes all budgets!

// ✅ CORRECT: Validate permissions first
const currentUser = await getCurrentUser(authClient);
if (currentUser.id !== requestedUserId) {
  throw new Error('Forbidden');
}
const { data } = await serviceClient
  .from('blind_budgets')
  .select('*')
  .eq('user_id', requestedUserId);
```

---

## Testing Edge Functions

### Unit Tests (Deno Test)

```typescript
// delete-account.test.ts
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Deno.test('delete-account: should fail without email confirmation', async () => {
  const req = new Request('http://localhost/functions/v1/delete-account', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer fake-token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  const response = await handler(req);
  assertEquals(response.status, 400);
});
```

### Integration Tests

Use Playwright E2E tests to test Edge Functions in a real environment:

```typescript
test('delete account flow', async ({ page }) => {
  await page.goto('/settings/account');
  await page.click('button:has-text("Delete Account")');
  await page.fill('input[type="email"]', 'user@example.com');
  await page.click('button:has-text("Confirm Delete")');

  // Edge Function called via supabase.functions.invoke()
  await expect(page).toHaveURL('/account-deleted');
});
```

---

## Monitoring & Logging

### View Logs

```bash
# Stream Edge Function logs in real-time
supabase functions logs delete-account --follow

# View recent logs
supabase functions logs transfer-ownership --limit 50
```

### Log Format

```typescript
console.log(JSON.stringify({
  level: 'info',
  message: 'Ownership transferred',
  tripId: 'trip-uuid',
  newOwnerId: 'user-uuid',
  timestamp: new Date().toISOString()
}));
```

**Best Practices:**
- Use structured logging (JSON)
- Include request ID for tracing
- Log errors with full context
- Never log sensitive data (passwords, tokens, individual budgets)

---

## Next Steps

- [Migrations Overview](./migrations-overview.md) - Complete migration history
- [Schema Overview](./schema-overview.md) - Table structure and relationships
- [RLS Policies](./rls-policies.md) - Row-Level Security documentation

---

**Last Updated:** February 2026
**Deployed Functions:** 2
**Planned Functions:** 5
