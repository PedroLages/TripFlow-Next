---
story_id: E01-S02
story_name: Email/Password Registration
status: done
started: 2026-02-13
completed: 2026-02-13
---

# E01-S02: Email/Password Registration

## Overview

As a new user, I want to register with my email and password, so that I can create an account and start planning trips.

## Implementation Notes

- Server Component page + Client Component form (textbook App Router boundary)
- Dual-layer Zod validation via `@repo/schemas` (client + server)
- Server action with `safeParse`, structured `fieldErrors`, and Supabase `signUp`
- Real-time password strength indicators with check/X icons
- Password visibility toggle with dynamic `aria-label`
- OAuth stub buttons (disabled, preparing for Story 1.4)
- Responsive: 48px touch targets on mobile, card layout on desktop

## Challenges & Struggles

- React Compiler warning with `form.watch('password')` — known React Hook Form incompatibility, non-blocking
- `@hookform/resolvers` v5 did not exist; downgraded to v3.10.0 (stable release matching react-hook-form v7)

## Lessons Learned

- shadcn/ui Form component provides `aria-describedby` and `aria-invalid` automatically — no manual wiring needed
- Password rules need duplication between Zod schema and UI indicator array (different data structures)
- `tabIndex={-1}` on toggle buttons removes keyboard access — avoid for interactive elements

## Manual Steps

None identified.

## Testing Notes

- 38 unit tests (5 suites): schema validation, component rendering, password strength, toggle, page elements
- 80 E2E tests (67 passed, 13 viewport-specific skips): 5 browsers × dual viewport
- Keyboard tab order E2E test validates accessibility

## Code Review Feedback

**Verdict: APPROVE with improvements** (0 critical, 4 improvements, 3 nits)

Key improvements recommended:

1. Add TODO for email confirmation flow handling (Story 1.8)
2. Add `.max(128)` to password schema to prevent DoS via long passwords
3. Add "keep in sync" comment for duplicated password rules
4. Confirm `@hookform/resolvers` v3 downgrade was intentional

Full report: `docs/reviews/code/code-review-2026-02-13-E01-S02.md`

## Design Review Feedback

**Grade: B+** (0 critical, 3 high-priority, 3 medium, 2 nits)

High-priority improvements recommended:

1. Remove `tabIndex={-1}` from password toggle button (keyboard accessibility)
2. Improve primary button focus ring visibility on desktop
3. Standardize input/button heights to `h-12` (mobile) / `h-10` (desktop)

Strengths: clean card layout, design token compliance, password validation UX, responsive touch targets, semantic HTML, WCAG AA color contrast.

Full report: `docs/reviews/design/design-review-2026-02-13-E01-S02.md`
