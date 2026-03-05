---
story_id: E01-S07
story_name: Account Deletion with GDPR Cascade
status: done
started: 2026-02-14
completed: 2026-02-14
---

# E01-S07: Account Deletion with GDPR Cascade

## Overview
As a user who wants to leave the platform, I want to permanently delete my account with all associated data, so that my privacy is protected in compliance with GDPR.

## Implementation Notes
- Block deletion if user owns trips (require ownership transfer first)
- 2-step confirmation: password re-entry + type "DELETE"
- Edge Function with service_role key for auth.admin.deleteUser()
- Migration adds ON DELETE SET NULL to 13 FK columns referencing profiles
- PostgreSQL cascade handles cleanup automatically when auth.users row is deleted

## Challenges & Struggles
- E2E tests failed due to Playwright strict mode violations: `getByLabel('Password')` matched password fields from both the profile password-change form and the delete account dialog. Fixed by scoping locators to `[data-slot="alert-dialog-content"]`.
- Code review caught a missing `trip_members.invited_by` FK cascade that would have caused deletion failures for users who invited others.

## Lessons Learned
- When building FK cascade migrations, grep ALL migration files for `REFERENCES profiles(id)` to build a complete inventory rather than relying on manual enumeration.
- Radix UI AlertDialog portals render content outside the parent DOM tree; scope E2E locators to `data-slot` attributes rather than ARIA roles for reliable dialog element targeting.
- Always check generated type files for non-TypeScript artifacts (e.g., connection log messages) on line 1.

## Manual Steps

- **Deploy Edge Function** [cli]
  `supabase functions deploy delete-account`
  Deploys the delete-account Edge Function to the linked Supabase project.

- **Run database migration** [cli]
  `supabase db push`
  Applies the FK cascade migration to add ON DELETE SET NULL constraints.

## Testing Notes
[Any testing discoveries]

## Code Review Feedback
2 critical issues found and fixed before PR:
1. Missing `trip_members.invited_by` FK cascade — would cause deletion failure for users who invited others. Added 14th entry to migration.
2. Generated types file had debug artifact (`Connecting to db 5432`) on line 1. Removed.

5 improvements noted (non-blocking): use anon key for userClient in Edge Function, log avatar deletion failures, fragile error parsing (safely wrapped), no happy-path E2E test, imprecise useEffect deps.

Full report: docs/reviews/code/code-review-2026-02-14-e01-s07.md

## Design Review Feedback
No blocking issues (the flagged Radix UI import is the correct v2 pattern — build passes).

Medium-priority polish for follow-up: dialog button touch targets on mobile (40px vs 44px minimum), dialog copy voice alignment with TripOS guidelines, prevent dialog close during pending deletion, progressive disclosure for "what gets deleted."

Full report: docs/reviews/design/design-review-2026-02-14-e01-s07.md
