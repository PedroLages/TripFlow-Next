---
story_id: E01-S01a
story_name: Project Scaffolding & Database Schema
status: done
started: 2026-02-12
completed: 2026-02-12
---

# E01-S01a: Project Scaffolding & Database Schema

## Overview
As a developer, I want the project initialized with the correct starter template, pinned dependencies, database migrations, and type generation, so that all team members can develop on a consistent, fully-typed foundation.

## Implementation Notes
[Add notes during implementation]

## Challenges & Struggles
[Document issues as they arise]

## Lessons Learned
[Fill in at story completion]

## Manual Steps

### Local development

- **Start local Supabase** [cli]
  `supabase start`
  Starts PostgreSQL, Auth, Storage, and other services in Docker.

- **Apply migrations locally** [cli]
  `supabase db reset`
  Drops and recreates the local database with all migration files applied.

### Hosted deployment (production/staging)

- **Link Supabase project** [cli]
  `supabase link --project-ref <project-ref>`
  Links to a hosted Supabase project. Get the ref from Dashboard → Project Settings → Reference ID.

- **Push migrations to hosted** [cli]
  `supabase db push`
  Applies pending migration files to the linked hosted project.

- **Generate TypeScript types from hosted** [cli]
  `supabase gen types typescript --linked > packages/types/src/supabase.ts`
  Regenerates types from the live hosted schema.

## Testing Notes
[Any testing discoveries]

## Code Review Feedback
**Verdict: APPROVE** (2026-02-12) — 0 critical, 2 improvements, 2 nits.
- Full review: `docs/reviews/code/code-review-2026-02-12-e01-s01a.md`
- Migration parity verified: all 21 split files match monolithic original
- RLS on all 19 tables, blind budget policies confirmed
- Improvements noted: 7 tables with RLS but no policies yet (correct deny-all for scaffolding), runtime tests could be stronger
