---
story_id: E01-S05
story_name: Password Reset Flow
status: done
started: 2026-02-14
completed: 2026-02-14
---

# E01-S05: Password Reset Flow

## Overview

As a user who has forgotten my password, I want to reset it via email, so that I can regain access to my account.

**Acceptance Criteria:**

**Given** a user is on /auth/login
**When** they click "Forgot Password"
**Then** they are navigated to the password reset form

**Given** a user enters their registered email on the reset form
**When** they click "Send Reset Link"
**Then** a reset email is sent via Supabase Auth
**And** a confirmation message is displayed

**Given** a user receives the reset email
**When** they click the reset link and enter a new password meeting the requirements (8+ chars, uppercase, lowercase, number)
**Then** the password is changed successfully
**And** a success message confirms the change

**Given** the password has been reset
**When** the user logs in with the new password
**Then** authentication succeeds and the user reaches the dashboard

**Given** the user tries to log in with the old password after reset
**When** they submit the old credentials
**Then** authentication fails with an appropriate error

**Features:** F15

## Implementation Notes

**Architecture:**
- Single route `/reset-password` with conditional rendering based on URL params
- Request mode (default): Email input form
- Update mode (`?code=xxx&type=recovery`): Password input form with strength validation
- Follows existing auth patterns from magic-link and signup forms

**Files created:**

- `packages/schemas/src/auth.ts` - Added `resetPasswordRequestSchema` and `resetPasswordUpdateSchema`
- `packages/schemas/src/auth.test.ts` - 29 unit tests for all auth schemas
- `packages/schemas/vitest.config.ts` - Vitest configuration for schemas package
- `apps/web/src/app/(auth)/reset-password/page.tsx` - Main page with conditional rendering
- `apps/web/src/app/(auth)/reset-password/actions.ts` - Server actions for request and update
- `apps/web/src/app/(auth)/reset-password/request-form.tsx` - Email input form with success state
- `apps/web/src/app/(auth)/reset-password/update-form.tsx` - Password form with strength indicators
- `apps/web/e2e/auth/reset-password.spec.ts` - 17 E2E tests

**Files modified:**

- `packages/schemas/package.json` - Added vitest scripts and dependency
- `apps/web/src/app/(auth)/login/login-form.tsx` - "Forgot password?" link already present
- `apps/web/src/app/(auth)/login/page.tsx` - Added success message handling for post-reset redirect

**Security features:**

- Email enumeration prevention via generic success messages
- 5xx-only error display (never 4xx client errors)
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Password confirmation field to prevent typos
- Generic error messages on token validation failure

**Accessibility:**

- 48px touch targets on mobile (WCAG 2.1 AA)
- Independent visibility toggles for password fields
- Real-time password strength feedback with Check/X icons
- Keyboard navigation support
- Screen reader support (aria-label, role="alert")

**Testing:**

- ✅ 29 schema unit tests (all passing)
- ✅ 17 E2E tests (all passing on mobile-chrome)
- ✅ TypeScript build successful (no type errors)

## Challenges & Struggles

- Zod `.refine()` cross-field validation not reliably caught by `zodResolver` — required client-side guard in `onSubmit`
- Playwright `getByLabel()` substring matching caused strict mode violations — required `{ exact: true }`
- Floating point precision in bounding box measurements — required `Math.round()` for touch target assertions

## Lessons Learned

- Always use `{ exact: true }` with Playwright `getByLabel()` when labels share substrings
- Zod `.refine()` validators need client-side backup when using react-hook-form
- Use `Math.round()` for pixel-based assertions in E2E tests to avoid floating point flakiness
- Use `.locator('.md\\:hidden')` to target mobile-only elements instead of `.first()`

## Manual Steps

No manual steps required for this story.

## Testing Notes

- 29 schema unit tests pass
- 17 E2E tests pass on mobile-chrome
- Safari tests pass individually but may show flakiness under parallel execution

## Code Review Feedback

Two critical issues found and fixed:

1. Wrong env var `NEXT_PUBLIC_APP_URL` → `NEXT_PUBLIC_SITE_URL` in actions.ts
2. Login page missing `success` param handling for post-reset redirect

Report: `docs/reviews/code/code-review-2026-02-14-e01-s05.md`

## Design Review Feedback

Conditionally approved. One blocker flagged (mobile logo visibility) was a false positive — `md:hidden` correctly shows logo on mobile. Medium-priority suggestions for spacing improvements noted for future polish.

Report: `docs/reviews/design/design-review-2026-02-14-e01-s05.md`
