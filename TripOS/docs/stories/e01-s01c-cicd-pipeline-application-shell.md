---
story_id: E01-S01c
story_name: CI/CD Pipeline & Application Shell
status: done
started: 2026-02-13
completed: 2026-02-13
---

# E01-S01c: CI/CD Pipeline & Application Shell

## Overview
As a developer, I want a CI/CD pipeline and the authenticated application shell, so that code quality is enforced automatically and users have a consistent navigation experience.

## Implementation Notes

- GitHub Actions CI: two-job pipeline (quality → e2e) with concurrency groups
- Application shell: sidebar + header + theme toggle using shadcn/ui
- Design token system: 28+ HSL tokens in globals.css, mapped via Tailwind v4 `@theme inline`
- Middleware handles auth gracefully when Supabase is unavailable (try-catch + error check)
- E2E tests are viewport-aware: sidebar/theme tests skip on mobile viewports

## Challenges & Struggles

- Supabase middleware redirected to non-existent `/login` when auth service was unavailable, causing 25/35 E2E failures. Fixed by adding graceful fallback in middleware.
- Initial color token system used teal as primary (wrong). Rewrote globals.css to match style guide: indigo primary, teal for privacy only, purple for voting only.
- Design review agent tested against stale dev server cache, reporting false positives. Resolved by clean rebuild and direct compiled CSS inspection.

## Lessons Learned

- Tailwind v4 `@theme inline` with `hsl(var(...))` works correctly for HSL token mapping.
- E2E tests need viewport awareness — shadcn sidebar is hidden on mobile (Sheet drawer instead).
- Always clear `.next` cache after significant CSS changes before running design review.

## Manual Steps

None required.

## Testing Notes

- 17 unit tests (sidebar rendering, semantic colors, theme toggle)
- 27 E2E tests pass, 8 skipped (mobile viewport tests for desktop-only features)
- 5 browser/viewport configs: mobile-chrome, mobile-safari, desktop-chrome, desktop-firefox, desktop-safari

## Code Review Feedback

Verdict: APPROVE with minor improvements. 0 critical, 4 improvements, 3 nits.

- Hardcoded hex in viewport themeColor (constrained exception — meta tags can't use CSS vars)
- Sidebar width mismatch between CSS token (280px) and shadcn component (256px)
- Missing "Create Trip" placeholder button (deferred to Epic 2)
- E2E tests rely on auth-unavailable fallback (document for future auth stories)

Full report: docs/reviews/code/code-review-2026-02-13-e01-s01c.md

## Design Review Feedback

Verdict: PASS. 0 critical, 2 improvements, 2 nits.

- Focus indicators may need enhancement (tracked for E13-S12)
- Mobile bottom tab navigation not yet implemented (tracked for E13-S11)
- All 5 original critical color token issues resolved and verified via compiled CSS inspection

Full report: docs/reviews/design/design-review-2026-02-13-e01-s01c.md
