---
story_id: E01-S02
story_name: User Login with Session Management
status: in_progress
started: 2026-03-03
reviewed: false
review_started:
review_gates_passed: []
---

# Story E01-S02: User Login with Session Management

## Description

As a **registered user**,
I want **to log in to my TripFlow account with email and password**,
So that **I can access my trips and data securely**.

## Acceptance Criteria

**Given** I am on the login page
**When** I enter my registered email and correct password
**Then** Supabase Auth validates my credentials and creates a session
**And** session tokens are stored in secure HTTP-only cookies (not localStorage)
**And** I am redirected to the dashboard
**And** my session persists across page refreshes
**And** session expires after 7 days of inactivity
**And** if credentials are incorrect, I see: "Invalid email or password"
**And** login form is accessible with keyboard and screen readers
**And** "Remember me" checkbox extends session to 30 days

## Dependencies

- E01-S01: User Registration with Email and Password (must be completed first - users table and Supabase Auth setup)

## Technical Notes

- Use Supabase Auth `signInWithPassword()` method
- Session tokens managed via `@supabase/ssr` with HTTP-only cookies
- Session configuration:
  - Default: 7 days expiry
  - With "Remember me": 30 days expiry
- Redirect to `/dashboard` after successful login
- Error handling: Display user-friendly error messages
- Form validation: Use Valibot schema (replace Zod due to Turbopack incompatibility)
- Accessibility: WCAG 2.1 AA compliance (keyboard nav, screen reader support, ARIA labels)
- Follow TripFlow Style Guide component standards (Section 37: Component Checklist)

## Tasks

- [ ] Create login page UI component
- [ ] Implement Valibot validation schema for login form
- [ ] Add Supabase Auth integration with session management
- [ ] Configure HTTP-only cookies for session tokens
- [ ] Implement "Remember me" functionality
- [ ] Add error handling and user feedback
- [ ] Ensure accessibility compliance (keyboard nav, screen reader)
- [ ] Write unit tests for validation logic
- [ ] Write E2E tests for login flow
- [ ] Test session persistence and expiry

## Implementation Plan

See [plan](plans/e01-s02-user-login-implementation-plan.md) for implementation approach.
