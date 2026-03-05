---
story_id: E02-S03
story_name: Dashboard Search & Filtering
status: done
started: 2026-02-15
completed: 2026-02-15
---

# E02-S03: Dashboard Search & Filtering

## Overview
Add search input to the trip dashboard that filters trips by name or destination. Migrate filter state (tabs + search) to URL params via nuqs for bookmarkability. Composes with existing tab filtering (All | Upcoming | Planning | Past).

## Implementation Notes
- Client-side filtering over React Query cache (no server round-trips)
- nuqs for URL state management (`?tab=upcoming&q=lisbon`)
- No debounce needed — synchronous useMemo over small arrays
- Search placement: same row as tabs on desktop, stacked on mobile
- NuqsAdapter added to `(app)/layout.tsx` (Server Component wrapper)
- Two "Clear search" paths: icon button in input + link button in empty state

## Challenges & Struggles
- E2E test had ambiguous "Clear search" selector matching both the input icon button and the empty-state link button. Fixed with `filter({ hasText })`.
- Card count assertion in E2E was fragile due to parallel test data creation. Relaxed to `toBeGreaterThanOrEqual`.

## Lessons Learned
- nuqs `NuqsTestingAdapter` from `nuqs/adapters/testing` simplifies component testing with URL state.
- When multiple buttons share the same accessible name, use Playwright `filter()` to disambiguate by visible text content.

## Manual Steps

## Testing Notes
- 22 unit tests for `searchTrips` (9 new) + `filterTrips` (existing)
- 11 component tests for `TripDashboard` (all new)
- 5 E2E scenarios for search filtering (all new)

## Code Review Feedback
Approved. 0 critical, 2 improvements (search+tab UX on clear, missing composition test), 3 nits. See `docs/reviews/code/code-review-2026-02-15-e02-s03.md`.

## Design Review Feedback
Approved. 0 blockers. 1 high-priority (pre-existing Radix hydration console error). 3 medium-priority polish suggestions (search width, icon padding, empathetic copy). WCAG 2.1 AA pass. See `docs/reviews/design/design-review-2026-02-15-e02-s03.md`.
