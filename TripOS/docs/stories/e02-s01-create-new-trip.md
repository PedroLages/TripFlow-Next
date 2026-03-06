---
story_id: E02-S01
story_name: Create a New Trip
status: done
started: 2026-02-15
completed: 2026-02-15
---

# E02-S01: Create a New Trip

## Overview
Users can create trips via a modal form with name, destination, dates, and optional description. The trip creator becomes the owner. Solves the RLS chicken-and-egg problem with a SECURITY DEFINER RPC function.

## Implementation Notes
- SECURITY DEFINER RPC `create_trip_with_owner` for atomic trip + owner member creation
- Dialog component (not Sheet) for modal — simpler, works on all sizes
- Native date inputs instead of Calendar component
- Minimal dashboard — full cards/tabs deferred to E02-S02

## Challenges & Struggles
- FormControl wrapper div broke label-to-input association for the destination field (MapPin icon wrapper). Fixed by moving the wrapper div outside FormControl.
- E2E test data pollution: multiple test runs created trips with identical destinations, causing strict mode violations. Fixed with scoped assertions.
- Auth setup test broke when dashboard changed from "Welcome to TripOS" to "My Trips" heading.

## Lessons Learned
- shadcn/ui FormControl passes id/aria props to its direct child. Wrapper divs inside FormControl break label association.
- E2E tests should use unique identifiers and scope assertions to specific elements to avoid test data pollution.
- SECURITY DEFINER functions need explicit GRANT EXECUTE statements.

## Manual Steps

- **Run Supabase migration** [cli]
  `supabase db push`
  Applies pending migrations to the linked Supabase project.

## Testing Notes
- 139 unit tests passing (74 schemas, 65 web)
- 7 E2E create-trip tests passing across desktop-chrome, mobile-chrome
- Fixed 3 test issues during finish-story: FormControl a11y, button selector ambiguity, dashboard heading assertion

## Code Review Feedback
Approve with required change (fixed). Full report: `docs/reviews/code/code-review-2026-02-15-E02-S01.md`
- [Critical] Missing GRANT EXECUTE on RPC — fixed
- [Improvement] Dashboard query may return public trips via RLS
- [Improvement] No error handling for dashboard query failure
- [Improvement] Trip page UUID validation
- [Improvement] Duplicate formatDate helper
- [Improvement] Description normalization in Zod transform

## Design Review Feedback
Reviewed. Full report: `docs/reviews/design/design-review-2026-02-15-E02-S01.md`
- [High] Focus ring visibility, touch target sizing, date input a11y, MapPin aria-hidden, hardcoded locale
- [Medium] Focus trap testing, trip card hover elevation, textarea sizing
- Most items deferred to E02-S02 or E13 (accessibility hardening)
