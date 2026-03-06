---
story_id: E01-S06
story_name: Profile Management
status: done
started: 2026-02-14
completed: 2026-02-14
---

# E01-S06: Profile Management

## Overview

As an authenticated user,
I want to view and edit my profile information including name, avatar, and password,
So that other trip members see my correct identity and I can secure my account.

**Acceptance Criteria:**
- Change display name → success toast → name updates in sidebar immediately → persists on refresh
- Upload avatar (image file) → upload progress shown → avatar displays → persists on refresh
- Change password (current + new + confirm) → success message → logout/login with new password works
- Form validation using Zod + React Hook Form with useWatch() for React 19 compatibility
- Error messages for: empty name, oversized avatar, mismatched passwords, weak passwords

**Features:** F19, F20, F21

## Implementation Notes

**New Capability:** This story introduces Supabase Storage for file uploads (avatars bucket).

**Reused Patterns:**
- Auth form pattern: Server Component page + Client Component form + useActionState + React Hook Form + Zod
- Validation schemas in `@repo/schemas` package
- Server actions with field-level error handling
- Toast notifications for success/error feedback (Sonner)

**Key Components:**
1. `/settings/profile` page (Server Component) - fetches user data, renders forms
2. Profile form (Client Component) - name + avatar upload with dirty state tracking
3. Password form (Client Component) - current + new + confirm with strength indicators
4. Avatar upload component (Client Component) - file picker + progress + preview + remove
5. Server actions: `updateProfile`, `changePassword`

**Files Created:**
- `packages/schemas/src/profile.ts` - Validation schemas
- `packages/schemas/src/profile.test.ts` - Unit tests (21 tests)
- `apps/web/src/app/(app)/settings/page.tsx` - Redirect to profile
- `apps/web/src/app/(app)/settings/profile/page.tsx` - Main settings page
- `apps/web/src/features/profile/components/avatar-upload.tsx` - Avatar component
- `apps/web/src/features/profile/components/profile-form.tsx` - Profile form
- `apps/web/src/features/profile/components/password-form.tsx` - Password form
- `apps/web/src/features/profile/actions/update-profile.ts` - Update profile action
- `apps/web/src/features/profile/actions/change-password.ts` - Change password action
- `apps/web/e2e/settings/profile.spec.ts` - E2E tests (13 tests)

## Challenges & Struggles

**Import Name Mismatch:**
- Initially used `createBrowserClient` import but actual export is `createClient`
- Build failed with clear error message pointing to the issue
- Fixed by updating import in avatar-upload.tsx

**Sonner vs Toast:**
- shadcn/ui toast component not available in registry at expected URL
- Used Sonner (shadcn's recommended toast library) instead
- Works seamlessly with same API

## Lessons Learned

- Playwright `getByLabel()` uses case-insensitive substring matching — "New password" matches "Confirm new password". Use `{ exact: true }` for disambiguation.
- `CardTitle` in shadcn/ui renders as `<div>`, not a heading. Don't use `getByRole('heading')` in tests for card titles.
- `FormControl` is required around inputs to create label↔input `id`/`htmlFor` association. Without it, `FormLabel` generates a dangling `htmlFor`.
- Server actions must never trust client-submitted identity data. The password change action was initially using `formData.get('email')` — fixed to use `supabase.auth.getUser()` server-side.

## Manual Steps

- **Apply storage migration** [cli]
  `supabase db push`
  Creates the avatars bucket with RLS policies from migration `20260214165500_create_avatars_storage.sql`.
  This is a one-time setup that persists in version control.

## Testing Notes

- 94 unit tests pass (50 schema + 44 web)
- 13 E2E tests pass across 5 browser projects (65 total runs)
- 6 pre-existing flaky auth test failures (oauth, reset-password, magic-link) unrelated to this story

## Code Review Feedback

See `docs/reviews/code/code-review-2026-02-14-E01-S06.md`.

**Critical issues (fixed):**

1. Password verification used client-supplied email — fixed to use `supabase.auth.getUser()` server-side
2. Stale E2E test in `packages/schemas/apps/` — deleted

**Improvements applied:**

1. Avatar file path extraction made robust (store path, fallback to URL parsing)
2. Dead upload progress code removed
3. Added comment explaining `signInWithPassword` session rotation side-effect

## Design Review Feedback

See `docs/reviews/design/design-review-2026-02-14-E01-S06.md`.

**Verdict: Approved.** 0 blockers. High-priority progress bar issue resolved by removing dead code. Medium-priority suggestions (email copy warmth, password strength colors, toggle hover states) deferred to future polish.
