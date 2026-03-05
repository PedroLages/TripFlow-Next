---
story_id: E02-S04
story_name: Edit Trip Details
status: done
started: 2026-02-15
completed: 2026-02-15
---

# E02-S04: Edit Trip Details

## Overview
Trip owners and organizers can edit trip details (name, destination, dates, description) via a dialog on the trip detail page. Mirrors the create-trip flow with pre-populated form fields, server-side Zod validation, and role-based visibility.

## Implementation Notes
- `updateTripSchema` extends create schema with UUID `id` field
- Server action uses direct Supabase `.update()` (no RPC needed — unlike create, no chicken-and-egg RLS problem)
- RLS UPDATE policy already enforces owner/organizer access via `get_my_managed_trip_ids()`
- Edit dialog uses `{open && <EditTripForm />}` to force re-mount with fresh defaultValues
- `revalidatePath` for server component pages + `queryClient.invalidateQueries` for dashboard cache
- No database migration needed

## Challenges & Struggles
<!-- filled after implementation -->
None significant. Implementation followed established create-trip patterns.

## Lessons Learned
The `{open && <EditTripForm />}` pattern cleanly handles re-mounting with fresh props, avoiding stale form state issues. Using RLS for authorization (rather than application-level checks) keeps the server action simple and secure.

## Code Review Feedback
**Status**: APPROVED with improvements
- No critical issues
- 2 improvements: RLS check on trip fetch, better error handling
- 3 nitpicks: destructuring clarity, import paths, test ID generation
Full review: docs/reviews/code/code-review-2026-02-15-E02-S04.md

## Design Review Feedback
**Status**: APPROVED with minor revisions
- 1 High-Priority: Mobile touch target (36px → 44px)
- 3 Medium-Priority: Cancel button, dialog max-width, dirty state
Full review: docs/reviews/design/design-review-2026-02-15-E02-S04.md

## Manual Steps
None — no database migrations or environment changes required.
