---
story_id: E01-S01b
story_name: Infrastructure Verification
status: done
started: 2026-02-12
completed: 2026-02-13
---

# E01-S01b: Infrastructure Verification

## Overview
As a developer, I want to verify the database is real, persistent, and not mocked, so that I can trust the foundation before building features on top of it.

## Acceptance Criteria

- GET /api/health returns 200 OK with database status: connected within 500ms
- A simple SELECT 1 query succeeds via the API
- Data created via the API persists across server restarts
- No prohibited mock data patterns in the codebase (globalThis stores, mockData, fakeData, in-memory Map/Set stores)
- No mock/stub libraries (json-server, miragejs, msw) in package.json
- Server logs show actual Supabase query activity when API calls are made

## Implementation Notes
- Added `ping()` SQL function (migration 22) — returns `SELECT 1` via RPC
- Enhanced `/api/health` with `rpc('ping')`, response time measurement
- Vitest: static analysis scans `src/` for prohibited mock patterns and `package.json` for mock deps
- Playwright: E2E tests verify 200 response, ping=true, <500ms timing, valid timestamp

## Challenges & Struggles
[Document issues as they arise]

## Lessons Learned
[Fill in at story completion]

## Manual Steps

### AC2: Data persists across Supabase restarts

1. Start Supabase: `pnpm supabase start`
2. Insert test data: `pnpm supabase db execute -f - <<< "INSERT INTO profiles (id, name, email) VALUES (gen_random_uuid(), 'Test User', 'test@example.com');"`
3. Stop Supabase: `pnpm supabase stop`
4. Restart: `pnpm supabase start`
5. Verify data: `pnpm supabase db execute -f - <<< "SELECT count(*) FROM profiles WHERE email = 'test@example.com';"`
6. Expected: count = 1 (data persisted)

### AC4: Query logging shows real SQL activity

1. Start Supabase: `pnpm supabase start`
2. In one terminal, tail logs: `pnpm supabase logs --follow`
3. In another terminal: `curl http://localhost:54321/rest/v1/rpc/ping -H "apikey: <anon-key>"`
4. Verify logs show actual SQL query execution (not stub/mock responses)

## Testing Notes
- Vitest tests are static analysis (fs-based) — no Supabase connection needed
- Playwright tests require running Supabase + dev server
- Run Playwright with `--project=desktop-chrome` (single project sufficient for API tests)

## Code Review Feedback

**Reviewer**: Code Review Agent (Claude Opus 4.6) — 2026-02-13

**Verdict**: CHANGES REQUIRED (resolved)

**Critical (C1)**: `packages/types/src/database.ts` was gutted from 1214 lines to 185 lines during merge conflict resolution. Restored the full Supabase-generated file and added only the `ping` function type.

**Improvements applied**:
- I1: Added `export const dynamic = 'force-dynamic'` to health route to prevent caching
- I2: Added `supabase/.branches/` and `supabase/.temp/` to `.gitignore`
- I3: Used `Record<string, never>` for ping Args type (matches Supabase convention)
- I4: E2E timing assertion now checks server-reported `responseTimeMs` (<500ms) with generous client-side threshold (2000ms) for CI reliability
- I5: Test path resolution uses `import.meta.url` instead of fragile `process.cwd()`

All findings resolved. Build, lint, unit tests (3/3), and E2E tests (10/10) pass.
