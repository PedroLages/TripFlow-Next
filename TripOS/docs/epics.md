---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prd.md
  - architecture.md
  - ux-spec.md (docs/design/)
  - feature-inventory.md
---

# TripOS - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for TripOS, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories. TripOS is a collaborative group trip planning platform with structured voting, blind budgeting for financial privacy, real-time collaboration, and role-based permissions.

## Requirements Inventory

### Functional Requirements

- FR1: Users can create an account using email/password or social login providers
- FR2: Users can sign in using passwordless authentication (magic links)
- FR3: Users can reset their password
- FR4: Users can view and edit their profile information
- FR5: Users can manage their notification preferences
- FR6: Users can delete their account and associated data
- FR7: Users can create a new trip with name, dates, and destination
- FR8: Users can edit trip details after creation
- FR9: Users can view a dashboard of all their trips
- FR10: Users can archive or delete trips they own
- FR11: Users can view trip summary information including member count and active decisions
- FR12: Trip owners can invite members via email
- FR13: Trip owners can generate shareable invite links
- FR14: Invited users can join a trip through an invite link or email invitation
- FR15: Members can view all current trip members and their roles
- FR16: Members can leave a trip voluntarily
- FR17: Trip owners can remove members from a trip
- FR18: Trip creators are automatically assigned the Owner role
- FR19: Owners can assign roles (Organizer, Member, Guest) to trip members
- FR20: Owners and Organizers can create polls, manage activities, and manage trip members
- FR21: Members can vote on polls, suggest activities, and view all trip content
- FR22: Guests can view trip details and vote on polls
- FR23: Owners can transfer trip ownership to another member
- FR24: Authorized users can add activities with name, time, location, notes, and estimated cost
- FR25: Authorized users can edit and delete activities
- FR26: Users can view the itinerary organized by day
- FR27: Users can reorder activities within a day and move activities between days
- FR28: Users can search for locations when adding or editing activities
- FR29: Users can view estimated cost totals per day and per trip
- FR30: Users can view trip activity locations on an interactive map
- FR31: Users can view suggested routes between sequential activities
- FR32: Users can search for points of interest on the map
- FR33: Organizers can create polls with multiple options and descriptions
- FR34: Organizers can select the voting method (yes/no, ranked choice, approval voting)
- FR35: Organizers can set voting deadlines for polls
- FR36: Organizers can set quorum requirements (minimum votes needed to close)
- FR37: Members can cast votes on active polls
- FR38: Members can change their vote before the deadline
- FR39: Votes are automatically tallied and results declared when the deadline or quorum is reached
- FR40: Users can view poll results with vote distribution and winning option
- FR41: Users can view a history of all completed group decisions
- FR42: Organizers can link polls to specific trip activities or decisions
- FR43: Members can set a private budget cap that is invisible to all other members including the trip owner
- FR44: Members can update their private budget cap at any time
- FR45: The system calculates the group maximum budget without revealing any individual cap values
- FR46: All members can view the group budget range
- FR47: Activity suggestions and searches are automatically filtered by the group maximum budget
- FR48: Users can see budget indicators on activities (within range, near limit, above budget)
- FR49: Members can privately view whether their cap is setting the group maximum
- FR50: Users can access educational content explaining how blind budgeting preserves privacy
- FR51: The group maximum recalculates and propagates automatically when any member changes their cap
- FR52: Users can record expenses with amount, category, and description
- FR53: Users can assign expenses to specific trip activities
- FR54: Users can view expense totals by category and trip total
- FR55: Users can split expenses among selected trip members
- FR56: Users can record expenses in multiple currencies with automatic conversion
- FR57: Users can view a settlement summary showing who owes whom
- FR58: All trip changes propagate to connected members in real time
- FR59: Users can view an activity feed showing all trip actions with timestamps and actors
- FR60: Users can see which trip members are currently active on the trip
- FR61: Users receive notifications for new polls and approaching vote deadlines
- FR62: Users receive notifications when members join or leave the trip
- FR63: Users receive notifications when itinerary or trip details change
- FR64: Users receive notifications when the group budget maximum is recalculated
- FR65: A complete audit trail records all decisions and changes
- FR66: Pending changes sync automatically when connection is restored
- FR67: Visitors can view the product homepage with value proposition and signup call-to-action
- FR68: Visitors can view feature descriptions and pricing information
- FR69: Visitors can read blog content about travel planning
- FR70: Visitors can create an account from any public page
- FR71: New users joining via invite receive guided onboarding for their first trip
- FR72: Marketing pages are discoverable through search engines

### Non-Functional Requirements

#### Performance
- NFR-P1: Real-time updates propagate to all connected clients within 500ms
- NFR-P2: Blind budget recalculation completes within 200ms of any member updating their cap
- NFR-P3: Map renders with all trip pins within 2 seconds on 4G connections
- NFR-P4: Activity feed loads the most recent 50 entries within 1 second
- NFR-P5: The application supports 50 concurrent users per trip without performance degradation
- NFR-P6: Offline-queued changes sync within 3 seconds of connection restoration
- NFR-P7: Vote tallying completes within 500ms regardless of poll complexity

#### Security & Privacy
- NFR-S1: All data encrypted in transit (TLS 1.2+) and at rest (AES-256)
- NFR-S2: Individual blind budget cap values encrypted at database level and never in any API response, log, or error message
- NFR-S3: Group maximum budget computed server-side; no individual cap values transmitted to any client
- NFR-S4: Row-Level Security (RLS) policies enforce users can only access trips they belong to
- NFR-S5: Authentication tokens expire after 24 hours of inactivity
- NFR-S6: Password hashing uses bcrypt with minimum cost factor of 10
- NFR-S7: All API endpoints enforce rate limiting (100 requests/minute per authenticated user)
- NFR-S8: Invite links expire after 7 days and become single-use after acceptance
- NFR-S9: Account deletion permanently removes all personal data within 7 days (GDPR)
- NFR-S10: System logs all authentication events and permission changes for audit
- NFR-S11: SQL injection, XSS, and CSRF protections enforced on all endpoints
- NFR-S12: Third-party API keys stored in environment variables, never in source code or client bundles
- NFR-S13: Real-time subscriptions enforce same RLS policies as REST endpoints
- NFR-S14: Budget-related database queries isolated so even DBAs cannot correlate individual caps to users without explicit key access
- NFR-S15: System prevents timing attacks on blind budget endpoints by normalizing response times
- NFR-S16: Session cookies are HttpOnly, Secure, and SameSite=Strict

#### Scalability
- NFR-SC1: System supports 500 concurrent users at MVP launch
- NFR-SC2: System supports up to 10,000 concurrent users with horizontal scaling within 12 months
- NFR-SC3: Database queries maintain <100ms response time with up to 100,000 trips
- NFR-SC4: Real-time subscription channels scale to support 50 members per trip
- NFR-SC5: Static assets served via CDN with edge caching
- NFR-SC6: Architecture supports adding read replicas without application code changes

#### Reliability
- NFR-R1: System targets 99% uptime at MVP, 99.5% within 12 months
- NFR-R2: Zero data loss for committed transactions (point-in-time recovery, <1 hour RPO)
- NFR-R3: System recovers from provider outages within 15 minutes of restoration
- NFR-R4: Failed API requests automatically retried with exponential backoff (max 3 retries)
- NFR-R5: Vote submissions are idempotent — duplicates do not alter results
- NFR-R6: Blind budget recalculations are atomic — partial updates never produce incorrect group maximums
- NFR-R7: System gracefully degrades when third-party services unavailable

#### Accessibility
- NFR-A1: All interactive elements have keyboard-accessible alternatives
- NFR-A2: Color is never the sole indicator of status — icons and text labels alongside color
- NFR-A3: Screen readers can navigate full itinerary and voting flows with proper ARIA landmarks
- NFR-A4: Real-time notifications announced to assistive technology without disrupting focus
- NFR-A5: Form validation errors programmatically associated with input fields
- NFR-A6: Touch targets minimum 44x44px on all interactive elements

#### Integration Resilience
- NFR-I1: Google Maps API failures fall back to text-based location entry
- NFR-I2: Currency conversion API failures fall back to cached exchange rates (<24 hours old)
- NFR-I3: Email delivery failures retried 3 times with exponential backoff; failed invitations flagged
- NFR-I4: Auth token refresh failures redirect to re-authentication without data loss
- NFR-I5: All third-party API calls have 5-second timeout

### Additional Requirements

#### From Architecture Document

**Starter Template & Infrastructure:**
- Initialize from `npx create-next-app@latest --example with-supabase tripOS`
- 11 pinned library versions: Next.js 16.1.6, @supabase/supabase-js 2.95.3, @supabase/ssr 0.8.0, @tanstack/react-query 5.90.20, zustand 5.0.11, zod 3.23.8 (NOT 4.x), react-hook-form 7.71.1, date-fns 4.1.0, next-themes 0.4.6, nuqs 2.8.8, next-intl 4.8.2
- 21 database migration files (00001 through 00021)
- Supabase type generation: `supabase gen types typescript` → `src/types/supabase.ts`
- CI/CD: GitHub Actions pipeline (lint → type-check → unit tests → E2E tests → deploy)

**13 Edge Functions:**
1. calculate-group-budget — Blind budget aggregation with timing delay (5-15s random)
2. close-poll — Ranked choice tabulation, tiebreaker logic, quorum validation
3. settle-expenses — Optimized debt settlement (minimize transactions)
4. convert-currency — ExchangeRate-API with Frankfurter fallback + caching
5. send-notification — In-app + email (Resend) with preference/quiet hours enforcement
6. batch-notifications — Batch notification processing
7. generate-pdf — PDF export generation
8. generate-ics — iCalendar export generation
9. generate-csv — CSV expense export generation
10. transfer-ownership — Atomic trip ownership transfer
11. handle-member-leave — Cascading member removal (recalculate budgets, flag splits, unassign tasks)
12. purge-expired-budgets — 90-day data lifecycle enforcement
13. schedule-poll-close — Server-side poll deadline scheduling/auto-close

**10 Enforcement Rules (all stories must follow):**
1. Run `pnpm lint` and `pnpm typecheck` before any task is complete
2. Co-locate tests with source files
3. Use React Query mutation pattern for ALL data mutations
4. Use Zod schemas for ALL form validation
5. Use `snake_case` for all database interactions
6. Use destructured `{ data, error }` pattern for all Supabase calls
7. Use `isPending` (never `isLoading`) for React Query loading states
8. Use `useWatch()` (never `watch()`) for React Hook Form field observation
9. Add skeleton loaders for every new list/detail view
10. Add toast notifications for every mutation

**10 Anti-Patterns (never do):**
- No `useState` for server data → use `useQuery`
- No `useEffect` to fetch data → use `useQuery`
- No `fetch('/api/...')` for data → use `supabase.from().select()`
- No manual loading boolean → use `isPending`/`isFetching`
- No `try/catch` around Supabase → destructure `{ data, error }`
- No global CSS classes → use Tailwind utilities
- No `any` type → use generated Supabase types
- No `console.log` for errors → use Sentry or toast
- No direct DOM manipulation → use React refs/state
- No `localStorage` for auth → cookie-based via `@supabase/ssr`

**Implementation Sequence (architecture-recommended):**
1. Project initialization (starter + dependencies)
2. Database schema + migrations + type generation + seed data
3. Auth flows (leveraging starter's Supabase Auth setup)
4. Core data features (trips, activities) with React Query patterns
5. Real-time subscriptions layer
6. Voting system (Edge Functions for ranked choice)
7. Budget/expenses (Edge Functions for currency conversion, settlement)
8. Blind budgeting (Edge Functions + RLS for privacy)
9. Tasks, notifications, activity feed
10. Export, PWA, i18n infrastructure
11. Marketing pages, onboarding

#### From UX Specification

**26 Screens across 5 phases:**
- Phase 1: Marketing landing, Auth (sign up/in, invite accept), Dashboard, Trip overview, Members, Activity feed, Notifications, Profile/Settings, Features page, Pricing page
- Phase 2: Itinerary (day timeline, add/edit activity, map view)
- Phase 3: Voting (poll list, create poll, cast vote ×3 types, poll results)
- Phase 4: Expenses (entry/list, settlement summary)
- Phase 5: Budget (private input, group range, blind budgeting explainer)

**Responsive Design:**
- Top bar navigation on desktop, bottom tabs on mobile
- No horizontal scrolling at any breakpoint
- Tab bar with icons + labels for trip workspace

**Progressive Disclosure (3 levels):**
1. Default simple view
2. Expandable details
3. Dedicated settings page

**Smart Defaults:**
- Poll type: Yes/No, deadline: 48h, anonymous: ON, quorum: 60%
- Invite method: Shareable link (primary), email (secondary)
- Expense quick-add: amount + description only, category optional

**10 UX Constraints:**
1. Lock icon always visible on budget inputs and anonymous polls
2. Poll status scannable at glance via badge system
3. Touch targets ≥ 44px on all interactive elements
4. No horizontal scrolling at any breakpoint
5. Empty states are educational — always suggest next action
6. Destructive actions require 2 steps (click → confirm dialog)
7. Real-time updates must animate in — never suddenly appear
8. Progressive disclosure at 3 levels
9. Privacy indicators use teal (#0D9488)
10. Voting indicators use purple (#7C3AED)

**Component State Tables:**
- Polls: 8 states (Draft, Active, Voted, Quorum Met, Closing Soon, Closed-Winner, Closed-Tie, Closed-No Quorum)
- Blind Budget: 7 states (Not Set, First Time, Set, Group Calculating, Group Ready, Budget Too Low, Error)
- Activity Cards: 5 states (Confirmed, Proposed, Voted On, Over Budget, Dragging)
- Members: 4 states (Online, Away, Offline, Invited-Pending)

**Critical User Flows:**
1. New user joins trip (Priya's journey): invite → signup → trip overview → budget → vote
2. Create and complete poll (Riley's journey): create → vote → quorum → results
3. Set blind budget (Sam's journey): navigate → explainer → enter → lock animation → group max
4. Plan itinerary collaboratively: open → add activity → location search → save → drag reorder → map

**7 Empty States (all educational):**
- Trip dashboard: illustration + "Create your first trip"
- Itinerary: suggest adding activity
- Budget not set: lock icon + "Set your private budget"
- Group calculating: spinner + "Waiting for more members"
- (All follow pattern: plain language explanation + clear CTA)

#### From Feature Inventory (295 Features across 19 Domains)

**Domain Summary with Feature Counts:**

| Domain | Count | Feature IDs |
|--------|-------|-------------|
| Infrastructure | 5 | F1–F5 |
| Authentication & Accounts | 18 | F6, F9–F22, F50, F245–F246 |
| Trip Creation & Management | 8 | F23, F25–F30, F49 |
| Member Management & Roles | 20 | F51–F70 |
| Dashboard | 7 | F42–F48 |
| Settings & Preferences | 11 | F31–F41 |
| Itinerary & Activities | 28 | F71–F98 |
| Voting & Polls | 28 | F99–F126 |
| Expenses & Bill Splitting | 22 | F127–F148 |
| Blind Budgeting | 21 | F149–F169 |
| Task Assignment | 18 | F170–F187 |
| Activity Feed | 13 | F188–F200 |
| Real-Time Collaboration | 4 | F201–F204 |
| Export & Import | 6 | F205–F210 |
| Notifications | 9 | F211–F219 |
| PWA & Offline | 3 | F220–F222 |
| Internationalization | 2 | F223–F224 |
| Marketing & Onboarding | 6 | F7–F8, F225–F228 |
| Cross-Cutting Quality | 66 | F24, F229–F244, F247–F295 |
| **TOTAL** | **295** | **F1–F295** |

**Dependency Tiers (implementation order):**
- Tier 0: Infrastructure (F1–F5) — zero dependencies
- Tier 1: Auth + App Shell (F6–F22)
- Tier 2: Trip CRUD + Dashboard (F23–F30, F42–F48)
- Tier 3: Member Management (F51–F70)
- Tier 4a–e: Feature domains in parallel (Activities, Voting, Expenses, Budgeting, Tasks)
- Tier 5: Feed, Real-Time, Notifications
- Tier 6: Export, Settings, PWA, i18n
- Tier 7: Cross-Cutting Quality (F229–F295)

**Key Dependency Chains:**
- Core: F1-F5 → F6 → F9 → F11 → F23 (everything depends on this)
- Deepest: Voting pipeline (7 links: poll creation → tiebreaker resolution)
- Widest: Member leave cascade (1 action → 6 parallel effects)

**15 Business Rules for Acceptance Criteria (from PRD):**
1. Blind budget privacy guarantee: individual caps NEVER in any API response, log, or error
2. Group maximum = minimum of all individual caps, computed server-side only
3. Budget auto-filtering: all suggestions filtered by group maximum
4. Invite link expiration: 7 days, single-use after acceptance
5. Quorum enforcement: polls cannot close until quorum met
6. Vote immutability after deadline
7. Vote change permitted before deadline
8. Role hierarchy: Owner > Organizer > Member > Guest
9. Account deletion GDPR: all data removed within 7 days
10. Idempotent vote submissions
11. Atomic budget recalculations
12. Real-time RLS parity
13. Offline sync on connection restoration
14. Graceful degradation for third-party services
15. Rate limiting: 100 req/min per authenticated user

### FR Coverage Map

- FR1: Epic 1 — User account creation (email/password, social login)
- FR2: Epic 1 — Passwordless authentication (magic links)
- FR3: Epic 1 — Password reset
- FR4: Epic 1 — Profile view and edit
- FR5: Epic 1 — Notification preferences management
- FR6: Epic 1 — Account deletion with data removal
- FR7: Epic 2 — Trip creation with name, dates, destination
- FR8: Epic 2 — Edit trip details
- FR9: Epic 2 — Dashboard of all trips
- FR10: Epic 2 — Archive or delete trips
- FR11: Epic 2 — Trip summary with member count and active decisions
- FR12: Epic 3 — Invite members via email
- FR13: Epic 3 — Generate shareable invite links
- FR14: Epic 3 — Join trip through invite link or email
- FR15: Epic 3 — View trip members and roles
- FR16: Epic 3 — Leave trip voluntarily
- FR17: Epic 3 — Remove members from trip
- FR18: Epic 3 — Auto-assign Owner role to creator
- FR19: Epic 3 — Assign roles (Organizer, Member, Guest)
- FR20: Epic 3 — Organizer capabilities (polls, activities, members)
- FR21: Epic 3 — Member capabilities (vote, suggest, view)
- FR22: Epic 3 — Guest capabilities (view, vote)
- FR23: Epic 3 — Transfer trip ownership
- FR24: Epic 4 — Add activities with details and estimated cost
- FR25: Epic 4 — Edit and delete activities
- FR26: Epic 4 — View itinerary organized by day
- FR27: Epic 4 — Reorder activities and move between days
- FR28: Epic 4 — Search locations for activities
- FR29: Epic 4 — View cost totals per day and trip
- FR30: Epic 4 — View activity locations on interactive map
- FR31: Epic 4 — View suggested routes between activities
- FR32: Epic 4 — Search for points of interest on map
- FR33: Epic 5 — Create polls with options and descriptions
- FR34: Epic 5 — Select voting method (yes/no, ranked, approval)
- FR35: Epic 5 — Set voting deadlines
- FR36: Epic 5 — Set quorum requirements
- FR37: Epic 5 — Cast votes on active polls
- FR38: Epic 5 — Change vote before deadline
- FR39: Epic 5 — Auto-tally and declare results at deadline/quorum
- FR40: Epic 5 — View poll results with vote distribution
- FR41: Epic 5 — View history of completed group decisions
- FR42: Epic 5 — Link polls to specific activities or decisions
- FR43: Epic 6 — Set private budget cap invisible to all others
- FR44: Epic 6 — Update private budget cap anytime
- FR45: Epic 6 — System calculates group maximum without revealing individual caps
- FR46: Epic 6 — View group budget range
- FR47: Epic 6 — Activities filtered by group maximum budget
- FR48: Epic 6 — Budget indicators on activities
- FR49: Epic 6 — Privately view if own cap sets group maximum
- FR50: Epic 6 — Educational content on blind budgeting
- FR51: Epic 6 — Auto-recalculate group maximum on cap change
- FR52: Epic 7 — Record expenses with amount, category, description
- FR53: Epic 7 — Assign expenses to trip activities
- FR54: Epic 7 — View expense totals by category and trip
- FR55: Epic 7 — Split expenses among selected members
- FR56: Epic 7 — Multi-currency expenses with auto conversion
- FR57: Epic 7 — Settlement summary showing who owes whom
- FR58: Epic 8 — Real-time propagation of all trip changes
- FR59: Epic 8 — Activity feed with timestamps and actors
- FR60: Epic 8 — See which members are currently active
- FR61: Epic 9 — Notifications for new polls and approaching deadlines
- FR62: Epic 9 — Notifications for member join/leave
- FR63: Epic 9 — Notifications for itinerary/trip detail changes
- FR64: Epic 9 — Notifications for budget recalculation
- FR65: Epic 8 — Complete audit trail of decisions and changes
- FR66: Epic 8 — Offline sync on connection restoration
- FR67: Epic 12 — Product homepage with value proposition
- FR68: Epic 12 — Feature descriptions and pricing information
- FR69: Epic 12 — Blog content about travel planning
- FR70: Epic 12 — Account creation from any public page
- FR71: Epic 12 — Guided onboarding for invite-joined users
- FR72: Epic 12 — SEO-discoverable marketing pages

## Epic List

### Epic 1: User Identity & Access
Users can create accounts (email/password, Google, Apple, magic link), sign in, manage their profiles, configure notification preferences, and delete their accounts with full GDPR compliance. Includes project infrastructure setup (database, migrations, type generation, CI/CD).
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6
**Features:** F1–F22, F245–F246 (23 features)
**NFRs addressed:** NFR-S1, NFR-S5, NFR-S6, NFR-S9, NFR-S10, NFR-S11, NFR-S16

### Epic 2: Trip Creation & Personal Dashboard
Users can create new trips with name, dates, and destination; view a dashboard of all their trips sorted by recent activity; edit trip details; archive or delete trips; and see trip summaries with member counts and active decisions.
**FRs covered:** FR7, FR8, FR9, FR10, FR11
**Features:** F23, F25–F30, F42–F49 (15 features)
**NFRs addressed:** NFR-SC3

### Epic 3: Team Building — Members & Roles
Trip owners can invite members via email or shareable links, manage a 4-tier role hierarchy (Owner > Organizer > Member > Guest) with distinct permission sets, transfer ownership atomically, and handle member departure with full cascade effects (activities grayed, votes preserved, budget recalculated, expenses flagged, tasks unassigned).
**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23
**Features:** F51–F70 (20 features)
**NFRs addressed:** NFR-S4, NFR-S8, NFR-S13

### Epic 4: Collaborative Itinerary Planning
Authorized users can add activities with full details (name, time, location, notes, estimated cost), view the itinerary organized by day, reorder via drag-and-drop, search locations via Google Maps Places, view cost totals, and see all activities on an interactive map with suggested routes.
**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32
**Features:** F71–F98 (28 features)
**NFRs addressed:** NFR-P3, NFR-I1, NFR-A1

### Epic 5: Democratic Decision Making
Organizers can create polls with 5 voting methods (yes/no, single choice, ranked choice, approval, veto), set deadlines and quorum requirements, enable anonymous voting. Members can cast and change votes. System auto-tallies at deadline/quorum with tiebreaker logic and decision history.
**FRs covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR41, FR42
**Features:** F99–F126 (28 features)
**NFRs addressed:** NFR-P7, NFR-R5

### Epic 6: Financial Privacy — Blind Budgeting
Members can set private budget caps invisible to all others including the trip owner. The system calculates the group-affordable ceiling server-side via Edge Function with timing-attack mitigation. Activities are auto-filtered by group maximum. Includes 3-step educational carousel, privacy indicators (teal), and 90-day data lifecycle.
**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51
**Features:** F149–F169 (21 features)
**NFRs addressed:** NFR-P2, NFR-S2, NFR-S3, NFR-S14, NFR-S15, NFR-R6

### Epic 7: Shared Expenses & Fair Settlement
Users can track expenses with amount, category, and description; split costs using 4 methods (even, percentage, custom, per-family); handle multi-currency with auto-conversion (ExchangeRate-API → Frankfurter fallback); and view an optimized settlement summary that minimizes transactions.
**FRs covered:** FR52, FR53, FR54, FR55, FR56, FR57
**Features:** F127–F148 (22 features)
**NFRs addressed:** NFR-I2

### Epic 8: Live Collaboration & Activity Feed
All trip changes propagate to connected members in real time via Supabase Realtime channels. Users see an activity feed logging all actions with timestamps and actors, presence indicators showing who's active, a complete audit trail, and offline sync on connection restoration.
**FRs covered:** FR58, FR59, FR60, FR65, FR66
**Features:** F188–F204 (17 features)
**NFRs addressed:** NFR-P1, NFR-P4, NFR-P5, NFR-P6, NFR-SC4

### Epic 9: Stay Informed — Notifications & Tasks
Users receive targeted notifications for polls, deadlines, member changes, itinerary updates, and budget recalculations. Includes in-app notification center, email delivery via Resend, quiet hours, and batch grouping. Users can create/assign trip tasks with status tracking, deadlines, checklists, and priority filtering.
**FRs covered:** FR61, FR62, FR63, FR64
**Features:** F170–F187, F211–F219 (27 features)
**NFRs addressed:** NFR-I3, NFR-A4

### Epic 10: Personalize Your Experience
Users can toggle dark/light mode with system preference detection, set language preference, configure 6 granular notification toggles, set default currency, and mute notifications for individual trips. Includes i18n infrastructure with structured translation files.
**Features:** F31–F41, F223–F224 (13 features)

### Epic 11: Take It With You — Export & Offline
Users can export itineraries as formatted PDF, calendar events as .ics, and expenses as CSV. PWA enables offline read-only access to cached itinerary with service worker. Unsaved changes trigger warnings on navigation.
**Features:** F205–F210, F220–F222 (9 features)

### Epic 12: Discover & Get Started — Marketing & Onboarding
Visitors can explore the marketing landing page, features page, and pricing page. Users can create accounts from any public page. New users joining via invite receive guided onboarding. All marketing pages are SEO-optimized with Open Graph images.
**FRs covered:** FR67, FR68, FR69, FR70, FR71, FR72
**Features:** F7–F8, F225–F228 (6 features)
**NFRs addressed:** NFR-SC5

### Epic 13: Production Quality & Accessibility
Cross-cutting quality assurance: security hardening (protected routes, RLS enforcement, XSS/CSRF prevention, API auth), navigation (deep linking, 404 pages, breadcrumbs), form validation (all input types), error handling (skeleton loaders, toasts, graceful degradation), responsive layouts (desktop 1920px+, tablet 768px, mobile 375px), 44px touch targets, full keyboard navigation, ARIA labels, 4.5:1 color contrast, screen reader support, focus management, and performance optimization (100+ activities, 50+ map pins, <500ms search).
**Features:** F24, F229–F295 (66 features)
**NFRs addressed:** NFR-A1–A6, NFR-S4, NFR-S7, NFR-S11, NFR-R4, NFR-R7, NFR-I1–I5

## Epic 1: User Identity & Access

Users can create accounts (email/password, Google, Apple, magic link), sign in, manage their profiles, configure notification preferences, and delete their accounts with full GDPR compliance. Includes project infrastructure setup (database, migrations, type generation, CI/CD).

### Story 1.1a: Project Scaffolding & Database Schema

As a developer,
I want the project initialized with the correct starter template, pinned dependencies, database migrations, and type generation,
So that all team members can develop on a consistent, fully-typed foundation.

**Acceptance Criteria:**

**Given** a fresh development environment
**When** the project is initialized from `npx create-next-app@latest --example with-supabase tripOS`
**Then** the project scaffolds with Next.js 16.1.6 and the Supabase starter auth setup
**And** all 11 pinned library versions are installed (Next.js, @supabase/supabase-js, @supabase/ssr, @tanstack/react-query, zustand, zod 3.23.8, react-hook-form, date-fns, next-themes, nuqs, next-intl)

**Given** the project is initialized
**When** all 21 database migration files (00001-00021) are applied
**Then** the Supabase PostgreSQL database contains all required tables (profiles, trips, trip_members, activities, activity_attendees, activity_versions, activity_drafts, polls, poll_options, votes, blind_budgets, expenses, expense_splits, tasks, checklist_templates, activity_feed, notifications, invite_links, invite_link_uses)
**And** running `supabase gen types typescript` produces `src/types/supabase.ts` without errors

**Given** the schema is applied
**When** the profiles table is inspected
**Then** it contains columns: id, name, email, avatar_url, preferred_currency, language, notification_preferences, quiet_hours_start, quiet_hours_end, created_at, updated_at
**And** key indexes exist on trip_members(trip_id, user_id), activities(trip_id, date), polls(trip_id, status)

**Features:** F1, F2, F3, F4

---

### Story 1.1b: Infrastructure Verification

As a developer,
I want to verify the database is real, persistent, and not mocked,
So that I can trust the foundation before building features on top of it.

**Acceptance Criteria:**

**Given** the database is connected
**When** GET /api/health is called
**Then** the response returns 200 OK with database status: connected within 500ms
**And** a simple SELECT 1 query succeeds via the API

**Given** data is created via the API (e.g., a trip named RESTART_TEST_12345)
**When** the server is fully stopped and restarted
**Then** the previously created data still exists in the database
**And** no data is lost across restarts, proving no in-memory storage

**Given** the codebase is scanned
**When** searching for prohibited mock data patterns (globalThis stores, mockData, fakeData, TODO...real database, in-memory Map/Set stores)
**Then** zero matches are found
**And** no mock/stub libraries (json-server, miragejs, msw) appear in package.json

**Given** API calls are made with verbose logging enabled
**When** GET /api/trips is called
**Then** server logs show actual Supabase query activity (SELECT, INSERT, etc.)
**And** the implementation queries a real database, not mock responses

**Features:** F5, F6, F7

---

### Story 1.1c: CI/CD Pipeline & Application Shell

As a developer,
I want a CI/CD pipeline and the authenticated application shell,
So that code quality is enforced automatically and users have a consistent navigation experience.

**Acceptance Criteria:**

**Given** the CI/CD pipeline configuration exists
**When** a commit is pushed
**Then** the GitHub Actions pipeline runs lint, type-check, unit tests, E2E tests, and deploy stages in sequence

**Given** the project is set up
**When** the main navigation sidebar renders for authenticated users
**Then** it displays the trip list, create trip button, user settings link, and theme toggle

**Features:** F7

### Story 1.2: Email/Password Registration

As a new user,
I want to register with my email and password,
So that I can create an account and start planning trips.

**Acceptance Criteria:**

**Given** an unauthenticated user navigates to /auth/signup
**When** they fill in name, email, and a valid password (8+ characters, uppercase, lowercase, number) and click Sign Up
**Then** an account is created via Supabase Auth
**And** a profile record is created in the profiles table
**And** the user is redirected to the dashboard with a welcome empty state

**Given** a user is on the registration form
**When** they enter a password shorter than 8 characters and submit
**Then** a specific, user-friendly validation error is displayed
**And** the form does not submit

**Given** a user is on the registration form
**When** they enter a password without an uppercase letter (e.g., "alllowercase1")
**Then** a validation error indicates an uppercase letter is required

**Given** a user is on the registration form
**When** they enter a password without a lowercase letter (e.g., "ALLUPPERCASE1")
**Then** a validation error indicates a lowercase letter is required

**Given** a user is on the registration form
**When** they enter a password without a number (e.g., "NoNumbers")
**Then** a validation error indicates a number is required

**Given** a newly registered user logs out
**When** they log back in with the same credentials
**Then** their account and profile data persist correctly

**Features:** F9, F10

### Story 1.3: Email/Password Login & Session Management

As a returning user,
I want to log in with my email and password and have my session persist,
So that I can securely access my trips without re-authenticating on every visit.

**Acceptance Criteria:**

**Given** a registered user navigates to /auth/login
**When** they enter valid credentials and click Log In
**Then** a loading/`isPending` state is shown during authentication
**And** they are redirected to the dashboard on success
**And** their name appears in the navigation sidebar
**And** the login button is disabled during submission to prevent double-submit

**Given** a user enters an incorrect password on the login form
**When** they click Log In
**Then** a clear error message is displayed (e.g., "Invalid email or password")
**And** the user remains on the login page

**Given** a user enters a non-existent email on the login form
**When** they click Log In
**Then** a generic error message is displayed (not revealing whether the email exists)

**Given** a user is logged in
**When** they refresh the browser page
**Then** they remain authenticated with dashboard content loading without re-login
**And** their name still appears in the navigation

**Given** an active user session approaches token expiry
**When** the user makes an API request
**Then** the token is refreshed silently via @supabase/ssr cookie-based auth
**And** no re-login prompt is shown

**Given** a user has been inactive for 7 days
**When** they attempt to access a protected route
**Then** they are redirected to the login page
**And** the expired session cookie/token is cleared

**Given** session cookies are set
**When** inspecting the cookie attributes
**Then** they are HttpOnly, Secure, and SameSite=Strict

**Features:** F11, F16, F17, F18

### Story 1.4: OAuth & Magic Link Authentication

As a user who prefers social login or passwordless access,
I want to sign in with Google, Apple, or a magic link,
So that I can access my account without managing another password.

**Acceptance Criteria:**

**Given** an unauthenticated user is on /auth/login
**When** they click "Sign in with Google"
**Then** they are redirected to the Google OAuth consent screen
**And** after granting consent, the callback redirects them to the app
**And** a profile record is created with their Google avatar

**Given** an unauthenticated user is on /auth/login
**When** they click "Sign in with Apple"
**Then** they are redirected to Apple authentication
**And** after authenticating, the callback redirects them to the app
**And** a profile record is created

**Given** an unauthenticated user navigates to /auth/magic-link
**When** they enter a valid email and click "Send Magic Link"
**Then** a success message confirms the email was sent
**And** clicking the magic link URL from the email authenticates the user
**And** the user is redirected to the dashboard

**Given** a user already has an account via email/password
**When** they use the same email to sign in via Google OAuth
**Then** the accounts are linked (or handled per Supabase Auth linking policy)
**And** the user can access the same profile and trips

**Features:** F12, F13, F14

### Story 1.5: Password Reset Flow

As a user who has forgotten my password,
I want to reset it via email,
So that I can regain access to my account.

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

### Story 1.6: Profile Management

As an authenticated user,
I want to view and edit my profile information including name, avatar, and password,
So that other trip members see my correct identity and I can secure my account.

**Acceptance Criteria:**

**Given** an authenticated user navigates to profile settings
**When** they change their display name to "New Display Name" and click Save
**Then** a success toast notification is shown
**And** the name updates in the navigation/sidebar immediately
**And** refreshing the page confirms the name persists in the database

**Given** an authenticated user is on profile settings
**When** they click the avatar upload area and select a valid image file
**Then** upload progress is shown
**And** the avatar displays after upload via Supabase Storage
**And** refreshing the page confirms the avatar persists

**Given** an authenticated user navigates to account settings
**When** they enter their current password, a new valid password, and confirm it, then click "Change Password"
**Then** a success message confirms the password was changed
**And** logging out and back in with the new password succeeds

**Given** a user updates their profile
**When** using Zod validation on the form
**Then** invalid inputs (empty name, oversized avatar, mismatched password confirmation) show specific error messages
**And** the form uses React Hook Form with `useWatch()` for field observation

**Features:** F19, F20, F21

### Story 1.7: Account Deletion with GDPR Cascade

As a user who wants to leave the platform,
I want to permanently delete my account with all associated data,
So that my privacy is protected in compliance with GDPR.

**Acceptance Criteria:**

**Given** an authenticated user navigates to account settings
**When** they click "Delete Account"
**Then** a confirmation dialog appears explaining all data that will be permanently lost (trips, memberships, votes, expenses, tasks)

**Given** the confirmation dialog is shown
**When** the user enters their password for re-confirmation and types the required confirmation text
**Then** the delete button becomes enabled

**Given** the user confirms deletion
**When** the cascade executes
**Then** the user's profile is removed from the profiles table
**And** all trip memberships are removed
**And** all votes, expenses, and tasks are cleaned up
**And** all notifications are removed
**And** no orphaned data remains across any table
**And** the user is redirected to the landing page

**Given** an account has been deleted
**When** attempting to log in with the old credentials
**Then** authentication fails

**Given** an account has been deleted
**When** attempting to use a previously valid session token
**Then** the request is rejected

**Given** the deletion is triggered
**When** the cascade runs
**Then** it completes as an atomic transaction -- partial state is never visible
**And** all personal data is permanently removed within 7 days per GDPR (NFR-S9)

**Features:** F22, F245

### Story 1.8: Auth Security Hardening

As the platform,
I want authentication endpoints protected by rate limiting, secure password hashing, and audit logging,
So that user accounts are protected against brute force attacks and security incidents are traceable.

**Acceptance Criteria:**

**Given** an attacker makes rapid login attempts with incorrect passwords
**When** the rate limit threshold is exceeded
**Then** further attempts are blocked with an appropriate error message ("Too many attempts, please try again later")
**And** the rate limit applies to login, registration, and magic link endpoints

**Given** rate limiting is active on registration
**When** rapid registration attempts are made
**Then** they are throttled at the same threshold as login

**Given** rate limiting is active on magic link requests
**When** rapid magic link requests are made for the same email
**Then** they are throttled to prevent email spam

**Given** a user registers or changes their password
**When** the password is stored
**Then** bcrypt hashing with a minimum cost factor of 10 is used (NFR-S6)

**Given** any authentication event occurs (login, logout, password change, account deletion, failed attempt)
**When** the event completes
**Then** it is recorded in the audit log with timestamp, user ID, event type, and IP address (NFR-S10)

**Given** all auth endpoints are implemented
**When** tested for SQL injection, XSS, and CSRF
**Then** all protections are enforced (NFR-S11)

**Given** data is transmitted between client and server
**When** inspecting the connection
**Then** TLS 1.2+ encryption is used for all data in transit (NFR-S1)

**Given** trip ownership transfer is invoked
**When** the transfer executes via the transfer-ownership Edge Function
**Then** it completes atomically -- the new owner gains full control and the original owner becomes an organizer
**And** all permissions update correctly with no partial state

**Features:** F50, F246

---

## Epic 2: Trip Creation & Personal Dashboard

Users can create new trips with name, dates, and destination; view a dashboard of all their trips sorted by recent activity; edit trip details; archive or delete trips; and see trip summaries with member counts and active decisions.

### Story 2.1: Create a New Trip

As an authenticated user,
I want to create a new trip with a name, destination, dates, and optional description,
So that I can start planning a group trip.

**Acceptance Criteria:**

**Given** an authenticated user is on the dashboard
**When** they click the "Create Trip" button
**Then** they are navigated to the trip creation form at /trip/new (or a modal opens)

**Given** the user is on the trip creation form
**When** they fill in trip name ("Summer Vacation 2025"), destination ("Barcelona, Spain"), start date (future date), end date (after start date), and optional description, then click Create
**Then** the trip is created in the database with status "active"
**And** the current user is automatically assigned the Owner role
**And** a success toast notification is shown
**And** the user is redirected to the new trip's overview page

**Given** the user submits the form with invalid data
**When** Zod validation runs (empty name, end date before start date, missing required fields)
**Then** specific error messages are shown inline via React Hook Form
**And** the form does not submit

**Given** the trip is created
**When** the user navigates back to the dashboard
**Then** the new trip appears as a card in the trip list

**Given** the creation form is submitting
**When** the React Query mutation is in progress
**Then** an `isPending` loading state is shown on the submit button
**And** the button is disabled to prevent duplicate submissions

**Features:** F23, F48

### Story 2.2: Trip Dashboard with Cards & Empty State

As an authenticated user,
I want to see all my trips displayed as cards on my dashboard,
So that I can quickly find and navigate to any trip I'm part of.

**Acceptance Criteria:**

**Given** a user with multiple trips logs in
**When** the dashboard loads
**Then** trips are displayed as card components
**And** each card shows the trip name, destination, date range, and member count
**And** skeleton loaders are shown while trip data is fetching via React Query

**Given** a newly registered user with no trips
**When** they navigate to the dashboard
**Then** an educational empty state is displayed with an illustration/message
**And** the text prompts the user to create their first trip
**And** a prominent "Create Trip" CTA is visible without scrolling
**And** clicking the CTA navigates to trip creation

**Given** a user has trips with active polls
**When** the dashboard renders
**Then** trip cards show pending action indicators (e.g., unvoted polls badge)
**And** after voting on all polls, the indicator updates or disappears

**Given** the dashboard has loaded
**When** the user views the stats summary section
**Then** it displays accurate counts for trips planned, destinations visited, and votes participated

**Given** the dashboard is rendering
**When** skeleton loaders are displayed during data fetch
**Then** they match the card layout shape for a smooth loading experience

**Features:** F42, F43, F44, F47

### Story 2.3: Dashboard Search & Filtering

As a user with many trips,
I want to search and filter my trips by name, destination, and status,
So that I can quickly find the trip I need.

**Acceptance Criteria:**

**Given** a user has multiple trips on the dashboard
**When** they type a trip name in the search box
**Then** only trips with matching names are displayed
**And** clearing the search restores all trips

**Given** a user types a destination name in the search box
**When** the search executes
**Then** trips with matching destinations are displayed

**Given** the user has both active and archived trips
**When** they select the "Upcoming" filter
**Then** only active future trips are shown

**Given** the "Past" filter is selected
**When** the dashboard updates
**Then** only archived/past trips are displayed
**And** the current filter state is clearly indicated in the UI

**Given** the search returns no results
**When** the empty result state renders
**Then** a helpful message is shown (e.g., "No trips match your search")

**Features:** F45, F46

### Story 2.4: Edit Trip Details

As a trip owner,
I want to edit my trip's name, destination, dates, and description after creation,
So that I can update plans as they evolve.

**Acceptance Criteria:**

**Given** a trip owner navigates to trip settings
**When** they change the trip name, destination, and dates, then click Save
**Then** a success toast notification confirms the changes
**And** refreshing the page verifies the changes persisted in the database

**Given** an owner edits trip details
**When** the React Query mutation is in flight
**Then** an `isPending` state is shown on the save button

**Given** invalid data is entered (e.g., end date before start date)
**When** Zod validation runs
**Then** specific inline errors are shown and the form does not submit

**Given** a non-owner member navigates to the trip
**When** they view trip settings
**Then** edit controls are not visible or are disabled based on their role

**Features:** F25

### Story 2.5: Archive, Delete & Trip Lifecycle

As a trip owner,
I want to archive completed trips and delete trips I no longer need,
So that my dashboard stays organized and outdated trips are properly handled.

**Acceptance Criteria:**

**Given** a trip owner is in trip settings
**When** they click "Archive Trip"
**Then** the trip moves to the "Past Trips" section on the dashboard
**And** the trip data remains accessible in read-only mode

**Given** a trip owner clicks "Delete Trip" in the danger zone
**When** the confirmation dialog appears
**Then** it requires typing the exact trip name to enable the delete button
**And** typing the wrong name keeps the delete button disabled

**Given** the user types the correct trip name and confirms deletion
**When** the delete executes
**Then** the trip is soft-deleted (deleted_at timestamp set, not hard-deleted)
**And** the user is redirected to the dashboard
**And** the trip no longer appears in the trip list

**Given** a trip has been soft-deleted
**When** any user navigates to /trip/[deleted-id]
**Then** a 404 or access denied response is returned
**And** the deleted trip does not appear in any API responses or search results

**Given** a new trip is created
**When** it transitions through lifecycle states
**Then** it starts as "active," can be "archived," and can be "deleted"
**And** each state is visually reflected in the UI

**Features:** F26, F27, F28, F29

### Story 2.6: Trip Overview & Public Sharing

As a trip member,
I want to view a trip overview with summary information,
So that I can quickly understand the trip's status, members, and upcoming decisions.

**Acceptance Criteria:**

**Given** a user navigates to a trip they belong to
**When** the trip overview page loads
**Then** it displays the trip name, destination, date range, description, member count, and active decision count
**And** skeleton loaders are shown while data is fetching

**Given** a trip owner is on trip settings
**When** they click the "Publish Publicly" toggle
**Then** a confirmation dialog explains what information becomes visible to the public
**And** after confirming, a public_slug is generated

**Given** a trip has been published publicly
**When** an unauthenticated visitor navigates to /trip/[slug]
**Then** the page renders trip details via server-side rendering
**And** meta tags are present for SEO
**And** no edit controls are visible to the unauthenticated viewer

**Given** the public trip page is rendered
**When** viewing the page source
**Then** SSR content is present (not client-side only rendering)

**Features:** F30, F49

---

## Epic 3: Team Building — Members & Roles

Trip owners can invite members via email or shareable links, manage a 4-tier role hierarchy (Owner > Organizer > Member > Guest) with distinct permission sets, transfer ownership atomically, and handle member departure with full cascade effects (activities grayed, votes preserved, budget recalculated, expenses flagged, tasks unassigned).

### Story 3.1: Email & Link Invitations

As a trip owner or organizer,
I want to invite people to my trip via email or a shareable link,
So that I can build my travel group through whichever method is most convenient.

**Acceptance Criteria:**

**Given** a trip owner/organizer navigates to the trip Members tab
**When** they click "Invite Members" and enter a valid email address, then click "Send Invite"
**Then** an invitation is sent and a success toast notification confirms delivery
**And** an invite record is created in the database

**Given** a trip owner/organizer is on the Members tab
**When** they click "Generate Invite Link"
**Then** a unique link with a token is generated and displayed
**And** clicking "Copy to Clipboard" copies the link
**And** the link has an expires_at set to 7 days from creation

**Given** invite links are generated rapidly
**When** the rate limit threshold is exceeded
**Then** an appropriate error message is shown
**And** the rate limit resets after the cooldown period

**Given** an invite link has expired (past 30-day window)
**When** someone attempts to use it
**Then** an appropriate error message informs them the link has expired

**Features:** F51, F52, F53, F54

### Story 3.2: Invitation Acceptance & Trip Joining

As an invited user,
I want to accept an invitation and join a trip seamlessly,
So that I can start collaborating with the group immediately.

**Acceptance Criteria:**

**Given** a user receives an invite link
**When** they open it in a browser (logged out)
**Then** they are prompted to sign up or log in

**Given** the invited user signs up or logs in after clicking an invite link
**When** authentication completes
**Then** they are automatically added to the trip as a Member (default role)
**And** the trip appears in their dashboard
**And** they are redirected to the trip page
**And** the invitation record is marked as used

**Given** a new member joins a trip
**When** existing members are viewing the trip Members tab
**Then** the new member appears in the member list in real-time without page refresh
**And** the member count updates in real-time

**Given** a member has already accepted an invitation
**When** they click the same invite link again
**Then** they are redirected to the trip (not re-added as a duplicate)

**Features:** F55, F56

### Story 3.3: Member List with Roles & Status

As a trip member,
I want to view all current trip members with their roles and online status,
So that I know who is in my group and what permissions they have.

**Acceptance Criteria:**

**Given** a trip member navigates to the Members tab
**When** the member list loads
**Then** all members are displayed with their name, avatar, role badge (Owner, Organizer, Member, Guest), and online status indicator (Online, Away, Offline, Invited-Pending)
**And** skeleton loaders are shown while data is fetching

**Given** the member list is rendered
**When** the trip owner views it
**Then** the owner badge is clearly distinguishable
**And** all member management controls (promote, remove) are visible to the owner

**Given** a regular member views the member list
**When** they look at management controls
**Then** promote and remove controls are not visible
**And** a "Leave Trip" option is available for themselves

**Given** a member's online status changes
**When** they go from active to away or offline
**Then** the status indicator updates in real-time for other members viewing the list

**Features:** F57, F60, F61

### Story 3.4: Role Management -- Promote & Assign Roles

As a trip owner,
I want to promote members to Organizer or assign Guest roles,
So that I can delegate trip management and control access levels.

**Acceptance Criteria:**

**Given** a trip owner views the member list
**When** they click the role management action on a regular member and select "Promote to Organizer"
**Then** the member's role badge updates immediately
**And** a toast notification confirms the promotion
**And** the promoted member gains organizer permissions (create/edit/delete activities, create polls, invite members)

**Given** a user is promoted to Organizer
**When** they log in and navigate to the trip
**Then** they can create, edit, and delete activities
**And** they can create polls and set deadlines
**And** they can invite new members
**And** they cannot delete the trip or remove the owner

**Given** a member has the default Member role
**When** they interact with the trip
**Then** they can add activity proposals, vote on polls, submit blind budgets, log expenses, and manage tasks
**And** they cannot delete the trip, remove members, or change others' roles

**Given** a user has the Guest role
**When** they view the trip
**Then** they can view itinerary, activities, poll results, activity feed, and member list
**And** they can vote on polls (FR22: Guests CAN vote per PRD)
**And** they cannot add activities, submit budgets, log expenses, or manage tasks
**And** all write controls are hidden or disabled

**Features:** F58, F59, F62

### Story 3.5: Remove Member & Voluntary Leave

As a trip owner I want to remove members, and as a member I want to leave voluntarily,
So that the group composition can be managed and members have the freedom to depart.

**Acceptance Criteria:**

**Given** a trip owner/organizer clicks "Remove" on a member
**When** the confirmation dialog appears and they confirm
**Then** the member is removed from the trip member list
**And** the removed member loses access to the trip immediately
**And** a toast notification confirms the removal

**Given** a trip member clicks "Leave Trip"
**When** the confirmation dialog appears and they confirm
**Then** they are removed from the trip and redirected away
**And** the trip no longer appears in their dashboard
**And** they cannot access the trip via URL or API

**Given** a member has been removed or has left
**When** they immediately try to access the trip via direct URL
**Then** they receive an access denied response
**And** API calls to trip data return forbidden or no data

**Given** a member leaves or is removed
**When** other members view the Members tab
**Then** the departed member no longer appears in the list
**And** the member count decreases in real-time

**Features:** F62, F63, F69

### Story 3.6: Member Departure Cascade Effects

As the system,
I want all related data properly handled when a member leaves or is removed,
So that trip integrity is maintained and no orphaned or incorrect data remains.

**Acceptance Criteria:**

**Given** a member who created activities leaves the trip
**When** other members view the itinerary
**Then** the departed member's activities remain visible but are attributed to "former member"
**And** the activities appear visually distinct (grayed out or marked)

**Given** a member who voted on polls leaves the trip
**When** other members view past poll results
**Then** the departed member's votes remain in closed poll results
**And** vote counts remain accurate

**Given** a member who submitted a blind budget leaves the trip
**When** the departure cascade runs via the handle-member-leave Edge Function
**Then** their budget entry is removed
**And** the group maximum is recalculated without their input

**Given** a member with unsettled expense splits leaves the trip
**When** the cascade processes
**Then** their pending expense splits are flagged for organizer review
**And** the organizer is notified about the flagged splits

**Given** a member with assigned tasks leaves the trip
**When** the cascade processes
**Then** their tasks are unassigned and flagged for reassignment
**And** the organizer can reassign the tasks to other members

**Features:** F64, F65, F66, F67, F68

### Story 3.7: Trip Ownership Transfer & Member Limits

As a trip owner,
I want to transfer ownership to another member and manage member capacity,
So that trip leadership can change hands and group size stays manageable.

**Acceptance Criteria:**

**Given** a trip owner navigates to trip settings
**When** they select "Transfer Ownership" and choose a target member
**Then** a confirmation dialog explains the consequences (original owner becomes Organizer)

**Given** the owner confirms the transfer
**When** the transfer-ownership Edge Function executes
**Then** the new owner has full control (all owner permissions)
**And** the original owner's role changes to Organizer
**And** the transfer is atomic -- no partial state is possible
**And** all permissions are updated correctly and immediately

**Given** a trip has 19 members
**When** the 20th member joins
**Then** a friendly soft-cap message is displayed
**And** no further invitations can be sent while at capacity

**Given** a trip is at the 20-member soft cap
**When** the owner or organizer tries to generate a new invite or send an email invitation
**Then** the action is blocked with a clear, non-alarming message explaining the limit

**Features:** F70, F246

Note: F246 (Trip ownership transfer works atomically) is shared between Epic 1 Story 1.8 (auth security context) and this story (member/role management context). The acceptance criteria here cover the user-facing ownership transfer flow, while Story 1.8 covers the security properties of the atomic transaction.

## Epic 4: Collaborative Itinerary Planning

Authorized users can add, edit, and manage trip activities with full details, view the itinerary organized by day, reorder via drag-and-drop, search locations via Google Maps Places, track costs, and visualize activities on an interactive map with suggested routes.

### Story 4.1: Activity CRUD — Create, Read, and Validate

As a trip organizer or owner,
I want to create new activities with all required fields and see validation feedback,
So that I can build the trip itinerary with accurate, complete activity information.

**Acceptance Criteria:**

**Given** I am on the trip itinerary tab and no activities exist
**When** I view the itinerary page
**Then** an educational empty state is displayed with a clear "Add Activity" call-to-action
**And** clicking the CTA opens the activity creation form

**Given** I have opened the Add Activity form
**When** I fill in name, date/time, location, notes, estimated cost, and category
**Then** the form validates all required fields using Zod schema validation
**And** submitting with an empty name shows a specific error message associated with the field
**And** submitting with a negative cost shows a validation error
**And** the submit button shows `isPending` loading state during submission

**Given** I have submitted a valid activity form
**When** the mutation completes successfully
**Then** a toast notification confirms creation
**And** the activity appears in the itinerary timeline with all fields displayed correctly
**And** refreshing the page shows the activity persists (server data, not local state)
**And** logging out and back in still shows the activity with all data intact

**Given** the activity form is partially filled
**When** 30 seconds elapse without saving
**Then** the draft is auto-saved to `activity_drafts` table
**And** returning to the form later restores the draft data
**And** only one draft per user per trip is maintained

**Given** the trip already has 199 activities
**When** I add the 200th activity
**Then** a friendly message warns that the activity limit is approaching
**And** attempting to add a 201st activity is blocked with a clear explanation

**Features:** F71, F85, F92, F95, F97, F98

---

### Story 4.2: Activity Edit, Delete, and Version History

As a trip organizer or owner,
I want to edit activity details and delete activities with confirmation,
So that the itinerary stays accurate as plans change and I can track what was modified.

**Acceptance Criteria:**

**Given** I click on an existing activity in the timeline
**When** I edit the activity name, date, time, or location and save
**Then** the changes are persisted via React Query mutation with optimistic UI (onMutate/onError/onSettled)
**And** a toast notification confirms the update
**And** refreshing the page shows the updated values

**Given** I have edited an activity multiple times
**When** I open the activity version history
**Then** each edit is logged with timestamp and author
**And** old and new values are shown for each changed field

**Given** I click Delete on an existing activity
**When** the confirmation dialog appears (destructive action requires 2 steps)
**Then** confirming deletion removes the activity from the timeline and the map view
**And** a toast notification confirms deletion
**And** refreshing the page confirms the activity is permanently removed

**Features:** F72, F73, F91

---

### Story 4.3: Day Timeline View and Day Filtering

As a trip member,
I want to view the itinerary organized by day with activities in chronological order,
So that I can see what is planned for each day of the trip at a glance.

**Acceptance Criteria:**

**Given** activities exist across multiple trip days
**When** I navigate to the itinerary tab
**Then** days are listed in chronological order
**And** activities are grouped under their correct date headings
**And** activities within each day are ordered by time
**And** a skeleton loader is shown while activity data loads via `useQuery`

**Given** I am viewing the full itinerary timeline
**When** I select a specific day filter
**Then** only that day's activities are displayed
**And** clearing the filter shows all activities again

**Given** the itinerary has activities
**When** I view cost totals
**Then** estimated cost totals are displayed per day and per trip
**And** costs update reactively when activities are added, edited, or deleted

**Features:** F74, F78, F29 (covered as part of day view cost display)

---

### Story 4.4: Activity Categories, Filtering, and Search

As a trip member,
I want to categorize activities, filter by category or cost range, and search by name or notes,
So that I can quickly find specific activities in a large itinerary.

**Acceptance Criteria:**

**Given** I am creating or editing an activity
**When** I open the category dropdown
**Then** predefined categories (restaurant, museum, beach, transport, etc.) are listed with proper labels
**And** I can select a category which is saved with the activity and displayed in the timeline

**Given** I want a category not in the predefined list
**When** I select the "Add custom category" option
**Then** I can create a new custom category name
**And** the custom category appears in the dropdown for future activities

**Given** activities with different categories exist
**When** I select a category filter
**Then** only activities matching that category are shown
**And** clearing the filter restores all activities

**Given** activities with various estimated costs exist
**When** I set a cost range filter (min/max)
**Then** only activities within that cost range are displayed
**And** adjusting the range dynamically updates the filtered list

**Given** I type a search term in the activity search field
**When** the term matches activity names or notes
**Then** matching activities are shown in results
**And** searching a non-existent term shows an empty result state
**And** searching with empty string, whitespace-only, special characters, or very long strings is handled gracefully without errors

**Features:** F79, F80, F81, F82, F93, F96

---

### Story 4.5: Google Maps Location Search and Autocomplete

As a trip organizer,
I want to search for locations using Google Places autocomplete when adding activities,
So that I can quickly find accurate locations with latitude/longitude coordinates.

**Acceptance Criteria:**

**Given** I am on the activity creation or edit form
**When** I start typing a location name in the location field
**Then** Google Places autocomplete suggestions appear below the input
**And** selecting a suggestion populates the location name and stores latitude/longitude

**Given** the Google Maps API is unavailable or returns an error
**When** I attempt to search for a location
**Then** the UI falls back to a plain text entry field (NFR-I1)
**And** a subtle message indicates that map search is temporarily unavailable
**And** the activity can still be saved with a text-only location

**Given** blind budgeting is enabled with a group ceiling
**When** I create an activity whose estimated cost exceeds the group affordable ceiling
**Then** the activity is visually flagged with a budget warning indicator
**And** activities within budget show no flag

**Features:** F83, F84

---

### Story 4.6: Interactive Map View with Activity Markers

As a trip member,
I want to view all trip activities on an interactive Google Map with markers and popups,
So that I can visualize the geographic layout of the trip itinerary.

**Acceptance Criteria:**

**Given** activities with location coordinates exist in the trip
**When** I switch to the map view
**Then** Google Maps renders within 2 seconds on 4G connections (NFR-P3)
**And** activity markers appear at their correct geographic locations
**And** clicking a marker shows an activity details popup (name, time, category)

**Given** multiple activities with locations exist on the same day
**When** I view the map
**Then** route lines are drawn connecting sequential activities in chronological order
**And** the route follows the logical day order

**Given** I want to discover nearby points of interest
**When** I use the map's search functionality
**Then** I can search for POIs on the map
**And** results appear as distinct markers from trip activities

**Features:** F75, F76, F32 (map POI search)

---

### Story 4.7: Drag-and-Drop Reordering of Activities

As a trip organizer,
I want to reorder activities within a day by dragging them and have the order persist,
So that I can adjust the day's schedule to optimize timing and logistics.

**Acceptance Criteria:**

**Given** multiple activities exist on the same day
**When** I drag an activity from the first position to the third position using the GripVertical handle
**Then** the order updates visually with a smooth animation
**And** the `order_position` is updated in the database via React Query mutation
**And** refreshing the page shows the persisted order

**Given** another member is viewing the same trip itinerary
**When** I reorder activities via drag-and-drop
**Then** the other member sees the updated order in real-time without refreshing

**Given** I am using a keyboard or assistive technology
**When** I focus on an activity's reorder control
**Then** up/down buttons are available as accessible alternatives to drag-and-drop (NFR-A1)
**And** all reorder controls have minimum 44px touch targets

**Given** activities exist across different day sections
**When** I drag an activity from one day to another
**Then** the activity moves to the target day and the order updates in both days

**Features:** F86, F27 (move between days)

---

### Story 4.8: Booking Status, Proposals, and Attendees

As a trip organizer or member,
I want to track booking status for activities, propose activities for approval, and specify attendees,
So that the team can coordinate who is doing what and track reservation progress.

**Acceptance Criteria:**

**Given** I create a new activity
**When** the activity is saved
**Then** the default booking status is `not_started`
**And** I can update the status to `to_book` or `booked`
**And** the status badge updates in the timeline view
**And** the status persists after page refresh

**Given** I am logged in as a regular Member (not Organizer or Owner)
**When** I propose a new activity
**Then** the activity is created with status `proposed`
**And** it appears in a pending proposals section visible to Organizers

**Given** I am logged in as an Organizer
**When** I view pending activity proposals
**Then** I can approve a proposal (activity moves to main itinerary)
**And** I can reject a proposal (activity is marked as rejected)

**Given** I am editing an activity
**When** I select specific trip members as attendees
**Then** the attendee list is saved and shown on the activity detail
**And** non-attending members are visually distinguished from attendees

**Given** an activity has `to_book` status with a future date
**When** the booking deadline approaches
**Then** the system triggers a booking deadline reminder notification
**And** booking the activity stops future reminders

**Features:** F87, F88, F89, F94

---

### Story 4.9: Activity Images and Real-Time Sync

As a trip member,
I want to attach images to activities and see all activity changes in real-time,
So that the itinerary is visually rich and always up-to-date across all connected members.

**Acceptance Criteria:**

**Given** I am editing an activity
**When** I click the image upload area and select an image file
**Then** upload progress is displayed
**And** the image is stored in Supabase Storage
**And** the image displays on the activity detail view
**And** refreshing the page shows the image persists

**Given** two users are viewing the same trip itinerary simultaneously
**When** User A adds a new activity
**Then** User B sees the activity appear in real-time without refreshing (animation in, never sudden)
**And** when User A edits the activity, User B sees the edit in real-time

**Given** any activity change occurs (create, edit, delete, reorder)
**When** the change is committed to the database
**Then** all connected trip members receive the update via Supabase Realtime channels

**Features:** F77, F90

---

## Epic 5: Democratic Decision Making

Organizers can create polls with 5 voting methods, set deadlines and quorum requirements, and enable anonymous voting. Members can cast and change votes before the deadline. The system auto-tallies results at deadline or quorum, applies tiebreaker logic, and maintains a complete decision history.

### Story 5.1: Basic Poll Creation — Yes/No and Single Choice

As a trip organizer,
I want to create Yes/No and Single Choice polls with smart defaults,
So that I can quickly gather group opinions on trip decisions.

**Acceptance Criteria:**

**Given** I am on the trip votes tab and no polls exist
**When** I view the poll list
**Then** an educational empty state is displayed suggesting I create the first poll

**Given** I click Create Poll
**When** the poll creation form opens
**Then** the default poll type is Yes/No (smart default)
**And** the default deadline is 48 hours from now
**And** anonymous voting is ON by default
**And** quorum defaults to 60% of trip members

**Given** I am creating a Yes/No poll
**When** I enter a title and description and click Create
**Then** the poll is saved via React Query mutation with `isPending` loading state
**And** a toast notification confirms creation
**And** the poll appears in the active polls list with correct Yes/No options
**And** the deadline and creator attribution are displayed
**And** refreshing the page shows the poll persists

**Given** I am creating a Single Choice poll
**When** I add 3 or more custom options
**Then** each option is validated (non-empty) via Zod schema
**And** the saved poll displays radio button selection UI for voters

**Given** I want to reuse a previous poll's settings
**When** I select a poll template (restaurant choice, timing, activity)
**Then** the template pre-fills the poll configuration
**And** I can customize the pre-filled values before creating

**Given** the trip already has 49 active polls
**When** I attempt to create the 50th poll
**Then** a warning is shown that the limit is approaching
**And** attempting to create a 51st active poll is blocked with a friendly message

**Features:** F99, F100, F117, F126

---

### Story 5.2a: Ranked Choice Poll Creation & Advanced Settings

As a trip organizer,
I want to create Ranked Choice polls with advanced settings,
So that I can facilitate complex group decisions with preference ranking.

**Acceptance Criteria:**

**Given** I am creating a Ranked Choice poll
**When** I add 4 or more options
**Then** the poll is created with a drag-to-rank interface
**And** ranking numbers (numbered badges) are displayed next to each option
**And** up/down buttons are available as accessible alternatives to drag ranking

**Given** I am on the poll creation form
**When** I expand the advanced settings (progressive disclosure)
**Then** I can set a custom deadline with specific date and time
**And** I can set a quorum requirement as a number or percentage
**And** I can set a consensus threshold (majority, 50%, 75%, unanimous)
**And** I can toggle anonymous voting on or off

**Given** I want to create a poll now but open it for voting later
**When** I set a future `opens_at` time
**Then** the poll is saved with Draft status
**And** the poll is not visible to voters until the scheduled open time
**And** the poll automatically becomes active at the scheduled time

**Features:** F101, F104, F105, F106, F107, F119

---

### Story 5.2b: Approval Voting Poll Creation

As a trip organizer,
I want to create Approval Voting polls,
So that voters can approve all acceptable options rather than picking just one.

**Acceptance Criteria:**

**Given** I am creating an Approval Voting poll
**When** I add multiple options
**Then** the poll is created with checkbox selection UI (multi-select)
**And** instructions explain that voters can approve all acceptable options

**Features:** F102

---

### Story 5.2c: Veto Voting Poll Creation

As a trip organizer,
I want to create Veto Voting polls with rate limiting,
So that members can formally block proposals with required justification.

**Acceptance Criteria:**

**Given** I am creating a Veto Voting poll
**When** I add options and create the poll
**Then** the poll includes a veto button requiring a reason field
**And** the reason is required (Zod validation) before the veto can be submitted

**Given** poll creation is attempted rapidly
**When** rate limiting is triggered
**Then** an appropriate error message is shown
**And** waiting allows poll creation to resume

**Features:** F103, F125

---

### Story 5.3: Vote Casting — Yes/No, Single Choice, and Approval

As a trip member,
I want to cast my vote on active Yes/No, Single Choice, and Approval polls,
So that my preferences are counted in the group decision.

**Acceptance Criteria:**

**Given** I am viewing an active Yes/No or Single Choice poll
**When** I select an option and click the Vote button
**Then** the vote is submitted via React Query mutation with `isPending` state
**And** a toast notification confirms my vote
**And** my selection is visually marked with purple (#7C3AED) voting indicator
**And** the vote count updates immediately (optimistic UI)
**And** refreshing the page shows my vote persists
**And** the Vote button is disabled after submission with visual feedback

**Given** I am viewing an active Approval poll
**When** I select multiple options via checkboxes and submit
**Then** all selected options are recorded as approved
**And** the approval counts update for each selected option

**Given** I have already voted on a poll
**When** I click the Change Vote button before the deadline
**Then** I can select a different option
**And** confirming the change removes my old vote from the count
**And** my new vote is added to the count
**And** the change is idempotent (NFR-R5) — duplicate submissions do not alter results

**Given** the vote submission is idempotent
**When** the same vote is accidentally submitted twice (network retry)
**Then** only one vote is recorded in the database

**Features:** F108, F109

---

### Story 5.4: Ranked Choice Voting — Drag to Rank

As a trip member,
I want to rank options by dragging them into my preferred order on Ranked Choice polls,
So that my full preference ordering is captured for fair tallying.

**Acceptance Criteria:**

**Given** I am viewing an active Ranked Choice poll
**When** I see the list of options
**Then** each option has a numbered badge showing its current rank position
**And** a drag handle is available for reordering

**Given** I drag an option from position 4 to position 1
**When** I release the drag
**Then** the list reorders with updated numbered badges
**And** the visual transition is smooth and animated

**Given** I am using a keyboard or assistive technology
**When** I focus on a ranked option
**Then** up/down buttons are available as accessible alternatives
**And** pressing the buttons moves the option in the rank order
**And** all controls have minimum 44px touch targets

**Given** I have arranged my preferred ranking
**When** I click Submit Ranking
**Then** the ranked order is saved as my vote via React Query mutation
**And** a toast notification confirms my ranked vote
**And** my submission is visually confirmed with purple (#7C3AED) indicator

**Given** I want to change my ranking before the deadline
**When** I click Change Vote
**Then** the drag-to-rank interface reopens with my previous ranking
**And** I can reorder and resubmit

**Features:** F101 (voting UI), F108 (cast ranked vote), F109 (change ranked vote) — ranked choice voting interaction aspects

---

### Story 5.5: Real-Time Vote Updates and Countdown Timer

As a trip member,
I want to see vote counts update in real-time and a countdown timer showing time remaining,
So that I can track poll engagement and know when voting closes.

**Acceptance Criteria:**

**Given** two users are viewing the same active poll
**When** User A casts a vote
**Then** User B sees the vote count update in real-time without refreshing
**And** the update animates in smoothly (never suddenly appears)

**Given** User B then casts a vote
**When** the vote is recorded
**Then** User A sees the updated count in real-time

**Given** a poll has a deadline set
**When** I view the poll
**Then** a countdown timer displays the time remaining
**And** the timer updates in real-time
**And** the poll status badge shows "Closing Soon" when the deadline is approaching

**Given** the poll's anonymous voting is enabled
**When** votes are cast
**Then** vote counts are visible to all viewers
**And** individual voter identities are NOT shown to anyone including the poll creator

**Given** a new poll is created in the trip
**When** the poll becomes active
**Then** all trip members receive an in-app notification
**And** the notification links directly to the poll
**And** the notification respects user preference settings

**Given** the deadline is approaching and I have not voted
**When** the reminder threshold is reached
**Then** I receive a reminder notification
**And** only non-voters receive the reminder

**Features:** F110, F107, F121, F122

---

### Story 5.6: Poll Deadline Enforcement and Auto-Close

As a system,
I want to enforce poll deadlines server-side and automatically close polls when the deadline or quorum is reached,
So that voting results are fair, timely, and tamper-proof.

**Acceptance Criteria:**

**Given** a poll has a deadline set
**When** the deadline time is reached
**Then** the `schedule-poll-close` Edge Function fires and closes the poll
**And** the poll status changes to Closed
**And** a closed timestamp is recorded in the database
**And** the `close-poll` Edge Function computes final results

**Given** a poll has reached its deadline
**When** a user attempts to vote after the deadline
**Then** the server-side enforcement rejects the vote (not just client-side)
**And** an appropriate error message is shown to the user
**And** the database confirms no late vote was recorded

**Given** a poll has closed
**When** I view the poll
**Then** the voting interface is visually disabled (vote buttons grayed out)
**And** a clear visual indication shows that voting is closed
**And** results are shown instead of the voting interface

**Given** vote tallying runs on a closed poll
**When** the tally completes
**Then** it finishes within 500ms regardless of poll complexity (NFR-P7)
**And** all trip members receive a notification that results are finalized
**And** the notification includes a summary of the result and links to the results page

**Features:** F111, F112, F123, F124

---

### Story 5.7: Poll Results, Visualization, and Tiebreaker

As a trip member,
I want to see poll results with visual charts, winner declaration, and clear tiebreaker resolution,
So that I can understand the group's decision and how it was determined.

**Acceptance Criteria:**

**Given** a poll has closed with votes cast
**When** I navigate to the poll results
**Then** a bar chart or visual display shows vote distribution
**And** the winning option is highlighted
**And** vote percentages are shown for each option
**And** the total vote count is displayed

**Given** a poll closes with two or more options tied
**When** the `close-poll` Edge Function processes the results
**Then** tiebreaker logic is applied
**And** the tiebreaker result is clearly shown with visual indication
**And** the visualization distinguishes the tied options and the resolution method

**Given** a poll was created with a quorum requirement
**When** the poll closes with fewer votes than the quorum threshold
**Then** the poll displays a "No Quorum" status (Closed-No Quorum state)
**And** the organizer is presented with options: extend deadline, cancel poll, or lower quorum
**And** selecting "extend deadline" reopens the poll with a new deadline

**Given** an organizer or owner views a closed poll result they disagree with
**When** they click the Veto Result button
**Then** a reason field is required before the veto is confirmed
**And** the veto is recorded with the reason displayed to all members
**And** members are notified of the veto

**Features:** F113, F114, F115, F118

---

### Story 5.8: Decision History, Audit Trail, and Duplicate Polls

As a trip member,
I want to view the complete history of all group decisions and easily create new polls from existing ones,
So that I can reference past outcomes and efficiently set up recurring decision types.

**Acceptance Criteria:**

**Given** multiple polls have been closed over the trip's duration
**When** I navigate to the decision history view
**Then** all past polls are listed in reverse chronological order
**And** each entry shows the poll title, type, result, and close date

**Given** I click on a past poll in the decision history
**When** the detail view opens
**Then** full vote counts and results are preserved and displayed
**And** the winning option and vote distribution are visible

**Given** I am viewing an existing poll (open or closed)
**When** I click the Duplicate button
**Then** a new poll is created pre-filled with the same settings and options
**And** I can modify the duplicated poll before saving
**And** saving creates a new, separate poll

**Given** an organizer wants to link a poll to a specific trip activity
**When** they select an activity during poll creation or editing
**Then** the poll displays a link to the associated activity
**And** the activity shows a reference to its linked poll

**Given** polls have been created and closed over time
**When** the complete audit trail is reviewed
**Then** all poll actions (creation, votes, changes, closures, vetoes) are recorded with timestamps and actors

**Features:** F116, F120, F42 (link polls to activities)

---

### Story 5.9: Poll State Management and Edge Cases

As a system,
I want to correctly manage all 8 poll states and handle edge cases robustly,
So that polls behave predictably under all conditions.

**Acceptance Criteria:**

**Given** a poll exists in the system
**When** its lifecycle progresses
**Then** it transitions through the correct states: Draft, Active, Voted (user has voted), Quorum Met, Closing Soon, Closed-Winner, Closed-Tie, or Closed-No Quorum
**And** each state is visually represented by a distinct badge with purple (#7C3AED) voting indicators

**Given** a poll is in Active state and quorum is met before the deadline
**When** the quorum threshold is reached
**Then** the poll status updates to Quorum Met
**And** the quorum progress indicator shows 100%
**And** the poll remains open until the deadline (quorum met does not auto-close)

**Given** a poll is in Closing Soon state (near deadline)
**When** the countdown timer reaches zero
**Then** the state transitions to the appropriate closed state based on results
**And** the transition is handled server-side via the `schedule-poll-close` Edge Function

**Given** multiple voters submit votes simultaneously
**When** the votes are processed
**Then** all votes are recorded correctly without race conditions
**And** idempotent submission ensures no duplicate votes (NFR-R5)

**Given** the poll creation form has advanced settings hidden by default
**When** a user creates a simple poll
**Then** only the essential fields are shown (progressive disclosure level 1)
**And** expanding advanced settings reveals quorum, anonymous, consensus, and scheduling options (level 2)

**Features:** F99 (poll states/badges), F105 (quorum monitoring progress), F108 (concurrent voting edge case), F125 (rate limiting enforcement)

## Epic 6: Financial Privacy — Blind Budgeting

Enable members to privately set individual budget caps that remain invisible to all other participants, with the system computing a group-affordable ceiling server-side. Privacy is enforced through RLS, timing-attack mitigation, hash-only logging, and a 90-day data lifecycle.

### Story 6.1: Enable Blind Budgeting on a Trip

As a trip organizer,
I want to enable blind budgeting for my trip,
So that members can privately submit budget caps without financial pressure or judgment.

**Acceptance Criteria:**

**Given** I am a trip owner or organizer viewing trip settings
**When** I toggle the blind budgeting switch to enabled
**Then** the `blind_budgeting_enabled` flag is set to `true` on the trip record
**And** a budget tab becomes visible to all trip members
**And** a toast notification confirms "Blind budgeting enabled"

**Given** blind budgeting is not enabled on the trip
**When** a member navigates to the trip workspace
**Then** no budget submission UI is available
**And** no blind budgeting related routes are accessible

**Given** blind budgeting is enabled on the trip
**When** the organizer disables it in trip settings
**Then** the budget tab is removed from the member view
**And** existing budget data is retained in the database but not displayed
**And** the organizer can re-enable it at any time

**Given** blind budgeting is enabled
**When** a member has not yet submitted their budget
**Then** the budget tab shows a "Not Set" empty state with a lock icon and CTA "Set your private budget"

**Given** a first-time user accesses the blind budgeting feature
**When** the budget tab loads
**Then** a 3-step onboarding carousel appears explaining how blind budgeting preserves privacy
**And** each step is navigable via swipe or next/back buttons
**And** the carousel can be dismissed and does not reappear on subsequent visits

**Features:** F149, F156, F163

---

### Story 6.2: Private Budget Submission with RLS Protection

As a trip member,
I want to submit my private maximum budget amount,
So that it contributes to the group calculation without anyone else seeing my individual cap.

**Acceptance Criteria:**

**Given** blind budgeting is enabled and I am a trip member
**When** I enter a budget amount and click "Submit Budget"
**Then** my budget is saved to the `blind_budgets` table with my `user_id` and `trip_id`
**And** a lock animation plays confirming privacy
**And** reassurance text "You can change this anytime" is displayed
**And** teal (#0D9488) privacy indicators are shown on all budget-related UI elements

**Given** I have previously submitted a budget
**When** I view the budget tab
**Then** I can see my own submitted amount
**And** I cannot see any other member's amount
**And** the UI clearly distinguishes "Your Budget" (private) from "Group Max" (shared)

**Given** I am logged in as any user (including trip owner)
**When** I query the `blind_budgets` table via API
**Then** RLS policies return only my own rows
**And** zero rows are returned for other members' budgets
**And** even the trip owner cannot see individual cap values

**Given** I try to submit a negative number, zero, or an amount exceeding $100,000
**When** validation runs via Zod schema
**Then** a specific, user-friendly error message is shown
**And** the submission is rejected

**Given** the trip destination has a known currency
**When** I open the budget submission form
**Then** the currency input defaults to the trip destination currency
**And** I can change it to a different currency if desired

**Features:** F150, F152, F158, F167, F166, F168

---

### Story 6.3: Group Ceiling Calculation via Edge Function

As a system,
I want to compute the group-affordable ceiling as the minimum of all individual caps server-side,
So that no individual budget value is ever transmitted to any client.

**Acceptance Criteria:**

**Given** three members have submitted budgets of $500, $800, and $1200
**When** the `calculate-group-budget` Edge Function runs
**Then** the group ceiling is computed as $500 (the minimum)
**And** the response contains only the group ceiling value, not any individual amounts
**And** the calculation completes within 200ms (NFR-P2)

**Given** a member submits or updates their budget
**When** the Edge Function is invoked
**Then** a random delay of 5-15 seconds is applied before the group ceiling update propagates
**And** the delay varies on each invocation to prevent timing-based inference attacks

**Given** a member who set the lowest budget leaves the trip
**When** the `handle-member-leave` cascade triggers
**Then** their budget entry is removed
**And** the group ceiling is recalculated to the next lowest value
**And** remaining members see the updated ceiling after the random delay

**Given** a new member joins and submits a lower budget than the current ceiling
**When** the ceiling recalculates
**Then** all members see the new lower ceiling (after timing delay)
**And** no indication is given about which member caused the change

**Given** budget operations occur
**When** the system writes audit logs
**Then** only hashed values appear in the audit trail
**And** raw budget amounts are never present in any log, error message, or API response

**Features:** F153, F155, F160, F161

---

### Story 6.4: Group Budget Display and Privacy Indicators

As a trip member,
I want to see the group budget ceiling and understand how it relates to my own cap,
So that I can plan activities within the affordable range.

**Acceptance Criteria:**

**Given** all members have submitted budgets and the ceiling is calculated
**When** I view the budget tab
**Then** I see side-by-side cards: "Your Budget" (my private cap) and "Group Max" (the ceiling)
**And** teal (#0D9488) lock icons are visible on all privacy-sensitive elements
**And** no individual amounts from other members are displayed anywhere

**Given** I am the member whose budget sets the group ceiling
**When** I view the budget tab
**Then** I can privately see a subtle indicator that my cap is currently setting the group maximum
**And** this indicator is not visible to any other member

**Given** the group has fewer than 5 members with blind budgeting enabled
**When** the budget tab shows submission status
**Then** it displays "Most set" instead of an exact count like "2 of 3" to protect small-group privacy

**Given** there is no "What-If" preview or simulation feature
**When** a member tries different budget amounts
**Then** they must commit each change (no preview of how it affects the ceiling)
**And** this prevents probing attacks on budget boundaries

**Given** the budget state is "Group Calculating"
**When** the Edge Function is processing with its random delay
**Then** a spinner is shown with text "Calculating group budget..."
**And** the UI transitions smoothly to "Group Ready" when the result arrives

**Features:** F154, F164, F165

---

### Story 6.5: Budget Update Rate Limiting and Lifecycle

As a system administrator,
I want to enforce rate limits on budget updates and purge expired data,
So that the system is protected from abuse and complies with data retention policies.

**Acceptance Criteria:**

**Given** a member has just submitted or updated their budget
**When** they attempt another update within 60 seconds
**Then** a rate limit error message is shown: "You can update your budget once per minute"
**And** the update is rejected server-side (1-per-minute rate limit)

**Given** 60 seconds have elapsed since the last update
**When** the member submits a new budget amount
**Then** the update is accepted and the group ceiling recalculates

**Given** a trip ended more than 90 days ago
**When** the `purge-expired-budgets` Edge Function runs on its scheduled interval
**Then** all `blind_budgets` records for that trip are permanently deleted
**And** active trip budgets are not affected

**Given** blind budgeting is enabled and some members have not submitted
**When** a configurable reminder period elapses
**Then** non-submitters receive a reminder notification
**And** members who have already submitted do not receive the reminder

**Given** a member submits a budget
**When** category-specific caps are available
**Then** the member can set separate budgets for accommodation, food, activities, transport, and other
**And** each category ceiling is computed independently

**Features:** F151, F162, F157, F159

---

### Story 6.6: Budget Tracking and Activity Filtering

As a trip member,
I want to see how trip expenses compare to the group budget ceiling,
So that we stay within our collectively affordable range.

**Acceptance Criteria:**

**Given** a group ceiling has been established and expenses have been logged
**When** I view the budget tab
**Then** I see a running total of expenses compared to the group ceiling
**And** a visual progress bar or indicator shows the percentage consumed
**And** the display uses skeleton loaders while data is fetching

**Given** activities are displayed in the itinerary
**When** blind budgeting is enabled and a group ceiling exists
**Then** each activity shows a budget indicator: within range (green), near limit (amber), or above budget (red)
**And** activity suggestions and searches are automatically filtered by the group maximum

**Given** no expenses have been logged yet
**When** I view the budget tracking section
**Then** an empty state is shown: "No expenses yet — start tracking to see how you're doing"
**And** a CTA links to the expense logging screen

**Features:** F169, F148 (budget-related subset)

---

## Epic 7: Shared Expenses & Fair Settlement

Users can track trip expenses with full details, split costs using four methods, handle multi-currency conversions with 3-tier API failover, and view an optimized settlement summary that minimizes the number of transactions.

### Story 7.1: Basic Expense Logging

As a trip member,
I want to record expenses with amount, currency, category, description, payer, and date,
So that all trip costs are tracked accurately in one place.

**Acceptance Criteria:**

**Given** I am on the trip expenses tab
**When** I click "Add Expense"
**Then** a form appears with fields for amount, currency, category, description, paid_by, and date
**And** the date picker defaults to the current date
**And** currency defaults to the trip's base currency

**Given** I fill in all required fields and click Save
**When** the expense is submitted
**Then** the expense appears immediately in the list (optimistic UI via React Query mutation)
**And** a `isPending` indicator shows until server confirmation
**And** a toast notification confirms "Expense added"
**And** all fields are persisted correctly to the database

**Given** I submit the expense form with missing required fields
**When** Zod validation runs
**Then** specific error messages appear for each missing field (amount, currency, category, paid_by)
**And** zero and negative amounts are rejected with clear messages

**Given** I have created an expense
**When** I refresh the page or log out and back in
**Then** the expense is still present with all data intact

**Features:** F127, F146, F147, F148, F142

---

### Story 7.2: Edit, Delete, and Manage Expenses

As a trip member,
I want to edit or delete expenses I have logged,
So that I can correct mistakes and keep the expense record accurate.

**Acceptance Criteria:**

**Given** I click on an existing expense in the list
**When** the expense detail view opens
**Then** I can edit the amount, description, category, and other fields
**And** changes are saved and reflected in the list with a toast confirmation
**And** changes persist after page refresh

**Given** I click the Delete button on an expense
**When** a confirmation dialog appears and I confirm
**Then** the expense is removed from the list
**And** all totals and settlement calculations are recalculated
**And** a toast confirms "Expense deleted"

**Given** a network failure occurs during expense creation
**When** the optimistic UI detects the server error
**Then** the expense rolls back from the list
**And** an error state with a retry button is displayed
**And** clicking retry resubmits the expense successfully

**Given** the trip has reached 500 expenses
**When** a member tries to add another expense
**Then** a friendly message explains the limit has been reached
**And** the Add Expense button is disabled

**Features:** F128, F129, F141, F143

---

### Story 7.3: Expense Split Methods

As a trip member,
I want to split expenses using even, percentage, custom amount, or per-family methods,
So that costs are divided fairly according to how the group decides.

**Acceptance Criteria:**

**Given** I am creating or editing an expense of $100
**When** I select "Even Split" and choose 4 members
**Then** each member's share is calculated as $25.00
**And** I can exclude specific members from the split (skip member option)
**And** excluded members do not appear in the split calculation

**Given** I select "Percentage Split"
**When** I enter custom percentages for each member
**Then** the system validates that percentages sum to 100%
**And** each member's dollar amount is calculated and displayed
**And** an error appears if percentages do not sum correctly

**Given** I select "Custom Amount Split"
**When** I enter specific amounts for each member
**Then** the system validates that amounts sum to the total expense
**And** each member's share is recorded as specified

**Given** I select "Per-Family Split"
**When** I define family groups among trip members
**Then** the expense is divided by family group count, not individual count
**And** each family's share is calculated and displayed correctly

**Features:** F130, F131, F132, F133, F134

---

### Story 7.4: Multi-Currency Support with Conversion

As a trip member,
I want to log expenses in any currency and have them auto-converted to the trip's base currency,
So that I can track costs accurately across countries.

**Acceptance Criteria:**

**Given** the trip base currency is USD
**When** I log an expense in EUR
**Then** the system calls the `convert-currency` Edge Function
**And** the original amount and currency are stored alongside the converted USD amount
**And** the exchange rate used is stored for reference
**And** both original and converted amounts are displayed in the expense list

**Given** the primary ExchangeRate-API is unavailable
**When** a currency conversion is requested
**Then** the system falls back to the Frankfurter API
**And** if Frankfurter is also unavailable, a manual entry option is presented
**And** the user is not impacted by the API switch (3-tier failover)

**Given** I log expenses in JPY, EUR, and GBP
**When** I view the expense list
**Then** each expense shows its original currency and amount
**And** the trip total is shown in the base currency (USD)

**Features:** F135, F136, F137

---

### Story 7.5: Expense Summary and Category Breakdown

As a trip member,
I want to see expense totals by category and a running total compared to my budget,
So that I can understand where money is being spent and stay on track.

**Acceptance Criteria:**

**Given** multiple expenses have been logged across different categories
**When** I navigate to the expense summary view
**Then** a pie or bar chart displays the breakdown by category (food, transport, accommodation, activities, other)
**And** chart values match the sum of expenses in each category
**And** the chart is visually clear with labels and colors

**Given** expenses exist and a planned budget is set
**When** I view the expense summary
**Then** a running total of amount spent is displayed
**And** a comparison with the planned budget is shown (e.g., "$450 of $800 spent")
**And** a visual progress indicator reflects the percentage used

**Given** category budgets have been set
**When** expenses in a category reach 90% of its budget
**Then** an alert appears (e.g., "Food budget 90% used")
**And** the alert is visible but non-blocking

**Given** an expense is linked to a specific activity
**When** I view the activity detail
**Then** the associated expense is shown
**And** I can navigate between the expense and its linked activity

**Features:** F138, F139, F145, F144

---

### Story 7.6: Settlement Summary

As a trip member,
I want to see an optimized settlement summary showing who owes whom with minimal transactions,
So that we can settle debts fairly and efficiently at the end of the trip.

**Acceptance Criteria:**

**Given** multiple expenses have been logged and split among different members
**When** I navigate to the settlement summary
**Then** the `settle-expenses` Edge Function computes optimized debts
**And** the number of transactions is minimized (not N*N pairs)
**And** each person's net balance (owes or is owed) is displayed

**Given** a trip with 5+ members and complex splits
**When** the settlement is calculated
**Then** the algorithm produces the mathematical minimum number of transactions
**And** each settlement entry shows payer, payee, and amount
**And** settlement amounts are mathematically verified (all debts net to zero)

**Given** the settlement summary is displayed
**When** I view a specific settlement entry
**Then** I can mark it as completed
**And** completed settlements are visually distinguished from pending ones

**Given** I view the settlement summary with multi-currency expenses
**When** all amounts are displayed
**Then** settlements are shown in the trip's base currency
**And** original currencies are referenced where relevant

**Features:** F140

---

## Epic 8: Live Collaboration & Activity Feed

All trip changes propagate to connected members in real time via Supabase Realtime channels. Users see a chronological activity feed, presence indicators, and a complete audit trail, with offline changes syncing automatically on reconnection.

### Story 8.1: Activity Feed with Event Timeline

As a trip member,
I want to see a chronological feed of all trip actions with timestamps and actor names,
So that I can stay informed about what is happening on the trip.

**Acceptance Criteria:**

**Given** a member adds an activity to the trip
**When** I view the activity feed
**Then** an "added activity" event is visible with the actor's name, activity name, and timestamp

**Given** a member edits an existing activity
**When** I view the activity feed
**Then** an "edited activity" event is visible with the changes summarized

**Given** a member deletes an activity
**When** I view the activity feed
**Then** a "deleted activity" event is visible

**Given** a member logs an expense
**When** I view the activity feed
**Then** an "added expense" event is visible with the actor and expense description

**Given** a member creates a poll
**When** I view the activity feed
**Then** a "created poll" event is visible with the poll title

**Given** a member votes on a poll
**When** I view the activity feed
**Then** a "voted" event is visible (anonymous polls show "A member voted" without identifying the voter)

**Given** a poll is closed
**When** I view the activity feed
**Then** a "poll closed" event is visible with the result summary

**Given** a member submits a blind budget
**When** I view the activity feed
**Then** a `budget.submitted` event is visible
**And** the amount is NEVER shown in the feed entry -- only that a submission occurred

**Features:** F188, F189, F190, F191, F192, F193, F194, F199

---

### Story 8.2: Member Events and Feed Pagination

As a trip member,
I want to see when members join or leave and browse the full event history,
So that I have a complete record of trip participation and changes.

**Acceptance Criteria:**

**Given** a new member joins the trip via invite link
**When** I view the activity feed
**Then** a "member joined" event is visible with the new member's name

**Given** a member leaves the trip
**When** I view the activity feed
**Then** a "member left" event is visible

**Given** a task is assigned to a member
**When** I view the activity feed
**Then** a "task assigned" event is visible with the task title and assignee

**Given** a task is marked as completed
**When** I view the activity feed
**Then** a "task completed" event is visible with the task title and completer

**Given** the feed has more than 50 events
**When** I scroll to the bottom of the feed
**Then** cursor-based pagination loads the next 50 items
**And** events are displayed in reverse chronological order
**And** skeleton loaders appear while the next page fetches
**And** older events are accessible by continuing to paginate

**Features:** F195, F196, F197, F198

---

### Story 8.3: Real-Time Data Synchronization

As a trip member,
I want all trip changes to appear instantly on my screen without refreshing,
So that I always see the latest information.

**Acceptance Criteria:**

**Given** two users are viewing the same trip itinerary
**When** User A adds an activity
**Then** User B sees the activity appear with a smooth animation (never suddenly appear) within 500ms (NFR-P1)
**And** the React Query cache is updated directly from the Realtime event (NEVER refetch)

**Given** User A edits an activity
**When** the Realtime event `activity.updated` fires
**Then** User B's view updates instantly with the new details
**And** no loading spinner or flash occurs

**Given** two users are viewing the same poll
**When** User A casts a vote
**Then** User B sees the vote count update in real-time
**And** the Realtime event follows the `{entity}.{action}` format (e.g., `vote.cast`)

**Given** a new member joins via invite link
**When** the `member.joined` event fires on the `trip:{tripId}` channel
**Then** all connected clients see the member list update in real-time
**And** role badge changes also propagate instantly

**Given** new feed events arrive via Realtime
**When** the activity feed is open
**Then** new entries animate in at the top of the feed
**And** the existing scroll position is preserved

**Features:** F200, F202, F203, F204

---

### Story 8.4: Presence Indicators and Online Status

As a trip member,
I want to see which other members are currently viewing the trip,
So that I know who is actively collaborating.

**Acceptance Criteria:**

**Given** multiple users have the same trip open
**When** I view the trip workspace
**Then** presence avatars show for each active viewer
**And** a green dot indicates "online" (actively viewing)
**And** a yellow dot indicates "away" (idle > 5 minutes)

**Given** a member closes the trip page or goes offline
**When** the presence channel (`presence:trip:{tripId}`) detects the disconnect
**Then** their avatar is removed from the presence indicator
**And** the update happens in real-time for remaining viewers

**Given** the Supabase Realtime channel supports up to 50 members per trip (NFR-SC4)
**When** 50 members are concurrently viewing
**Then** all presence indicators display correctly without performance degradation

**Features:** F201

---

### Story 8.5: Offline Queue and Sync on Reconnection

As a trip member,
I want my changes to be queued when I go offline and synced automatically when I reconnect,
So that I never lose work due to network interruptions.

**Acceptance Criteria:**

**Given** I am editing trip data and lose network connectivity
**When** I perform actions (add expense, update activity, etc.)
**Then** changes are queued locally in an offline queue
**And** a visual indicator shows "Offline -- changes will sync when connected"

**Given** network connectivity is restored
**When** the app detects the connection
**Then** all queued changes are synced within 3 seconds (NFR-P6)
**And** a toast notification confirms "Changes synced"
**And** any conflicts are resolved with last-write-wins or presented to the user

**Given** changes were made by other members while I was offline
**When** I reconnect
**Then** the latest state is reflected in my view
**And** the activity feed shows events that occurred during my offline period

**Given** all trip changes are logged
**When** I review the audit trail
**Then** a complete record of decisions and changes is available with timestamps and actors
**And** the audit trail is append-only and cannot be modified

**Features:** F188-related audit aspects (FR65), F200-related offline (FR66) -- These map to the cross-cutting aspects of F200

---

## Epic 9: Stay Informed — Notifications & Tasks

Users receive targeted notifications for polls, deadlines, member changes, itinerary updates, and budget recalculations. Includes in-app notification center, email delivery via Resend, quiet hours, batch grouping, and a full task management system with checklists.

### Story 9.1: In-App Notification Center

As a trip member,
I want to access a notification center via a bell icon in the top navigation,
So that I can see all my notifications in one place.

**Acceptance Criteria:**

**Given** I am logged in to the application
**When** I look at the top navigation bar
**Then** a bell icon is visible in the top-right area

**Given** I have unread notifications
**When** I look at the bell icon
**Then** a red badge displays the unread count
**And** the count updates in real-time as new notifications arrive (announced to assistive technology without disrupting focus per NFR-A4)

**Given** I click the bell icon
**When** the notification panel opens
**Then** notifications are listed in reverse chronological order
**And** unread notifications are visually distinguished (unread dot indicator)
**And** on mobile, swipe-to-dismiss is supported with touch targets >= 44px

**Given** I have no notifications
**When** I open the notification panel
**Then** an educational empty state is shown: "No notifications yet -- you'll be notified about polls, deadlines, and trip changes"

**Given** I click "Mark All as Read"
**When** the action completes
**Then** the badge count resets to zero
**And** all notifications lose their unread indicator
**And** a toast confirms the action

**Given** I view notification history
**When** scrolling through past notifications
**Then** older notifications are accessible
**And** a clear/delete option is available for individual or all notifications

**Features:** F211, F212, F217

---

### Story 9.2: Email Notifications via Resend

As a trip member,
I want to receive email notifications for important trip events,
So that I stay informed even when I am not actively using the app.

**Acceptance Criteria:**

**Given** a notification event occurs (new poll, member joined, itinerary change)
**When** the `send-notification` Edge Function fires
**Then** an email is sent to the user via Resend integration
**And** the email contains relevant content (event description, trip name, actor)
**And** the email includes a deep link back to the relevant trip section

**Given** email delivery fails
**When** the Resend API returns an error
**Then** the system retries up to 3 times with exponential backoff (NFR-I3)
**And** if all retries fail, the notification is flagged for manual review
**And** the in-app notification is still delivered regardless

**Given** a user has an @mention directed at them in activity notes or poll descriptions
**When** the mention is saved
**Then** the mentioned user receives both an in-app and email notification
**And** the notification links directly to the context where they were mentioned

**Features:** F213, F214

---

### Story 9.3: Notification Preferences and Quiet Hours

As a trip member,
I want to control which notifications I receive and set quiet hours,
So that I am not disturbed during rest hours or by notifications I do not care about.

**Acceptance Criteria:**

**Given** I navigate to notification preferences in my settings
**When** I toggle off a specific notification type (e.g., new polls)
**Then** I no longer receive that type of notification (in-app or email)
**And** other notification types continue to be delivered normally

**Given** I re-enable a previously disabled notification type
**When** the next event of that type occurs
**Then** I receive the notification as expected

**Given** I set quiet hours to 11pm-8am in my profile settings
**When** a notification is triggered during quiet hours
**Then** the notification is held (not delivered via push or email)
**And** after quiet hours end, held notifications are delivered

**Given** I mute notifications for a specific trip
**When** events occur in that muted trip
**Then** I receive zero notifications for that trip
**And** notifications for other trips continue normally

**Features:** F215, F218, F219

---

### Story 9.4: Notification Types and Event Coverage

As a trip member,
I want to receive notifications for polls, deadlines, member changes, itinerary updates, and budget recalculations,
So that I am informed of all significant trip activity.

**Acceptance Criteria:**

**Given** a new poll is created in my trip
**When** the poll.created event fires
**Then** I receive a notification with the poll title and a link to vote

**Given** a poll deadline is approaching (within 24 hours)
**When** the deadline check runs
**Then** I receive a reminder notification if I have not yet voted

**Given** a new member joins or an existing member leaves my trip
**When** the membership event fires
**Then** I receive a notification identifying the member and the action

**Given** the itinerary or trip details are changed
**When** the change event fires
**Then** I receive a notification describing what changed (e.g., "Activity 'Museum Visit' time changed to 2pm")

**Given** the group budget ceiling is recalculated
**When** the new ceiling is available
**Then** I receive a notification that the group budget has been updated
**And** the notification does NOT reveal the new ceiling amount or any individual caps

**Features:** F211 (notification delivery for all types), cross-references FR61-FR64

---

### Story 9.5: Batch Notifications and Management

As a trip member,
I want multiple rapid-fire events to be grouped into a single notification,
So that I am not overwhelmed by a flood of individual notifications.

**Acceptance Criteria:**

**Given** many events occur in a short time period (e.g., 10 members vote within 5 minutes)
**When** the `batch-notifications` Edge Function processes them
**Then** a single batched notification is delivered summarizing the events (e.g., "10 members voted on 'Restaurant Choice'")
**And** the batch notification can be expanded to see individual events

**Given** I receive a batched notification
**When** I click on it
**Then** I am taken to the relevant context (e.g., the poll or activity feed)
**And** the batch notification is marked as read

**Features:** F216

---

### Story 9.6: Task Creation and Assignment

As a trip organizer,
I want to create tasks with title, description, assignee, due date, and priority,
So that trip responsibilities are clearly defined and tracked.

**Acceptance Criteria:**

**Given** I am on the trip tasks tab
**When** I click "Create Task"
**Then** a form appears with fields for title, description, assignee (dropdown of trip members), due date, priority (low/medium/high), and status
**And** the default status is "todo"

**Given** I fill in all fields and click Create
**When** the task is submitted via React Query mutation
**Then** the task appears in the task list with all fields displayed
**And** a toast confirms "Task created"
**And** the assigned member receives a notification with the task title and a link to the task

**Given** I click on an existing task
**When** I edit the title, description, or priority and save
**Then** changes are reflected in the task list
**And** changes persist after refresh

**Given** I am an organizer or owner
**When** I change the assignee on a task to a different member
**Then** the new assignee receives a notification
**And** the previous assignee is no longer listed as responsible

**Given** I click Delete on a task
**When** a confirmation dialog appears and I confirm
**Then** the task is removed from the list
**And** the deletion persists after refresh

**Given** the trip has reached 100 tasks
**When** I try to create another task
**Then** a friendly message explains the limit has been reached
**And** the Create Task button is disabled

**Features:** F170, F171, F172, F174, F175, F177, F180

---

### Story 9.7: Task Status Tracking and Dashboard

As a trip member,
I want to track task progress through statuses and see an overview dashboard,
So that the group can see what is done, in progress, and still to do.

**Acceptance Criteria:**

**Given** a task exists with status "todo"
**When** I change the status to "in-progress"
**Then** the status badge updates visually
**And** the task appears in the "In Progress" section of the dashboard

**Given** I change a task status to "done"
**When** a confirmation prompt appears and I confirm
**Then** the task is marked as completed
**And** `completed_by` and `completed_at` are recorded
**And** the task shows completion details in the list

**Given** multiple tasks exist with different statuses and priorities
**When** I view the task dashboard
**Then** a progress bar or chart shows completion percentage
**And** task counts by status are displayed (todo, in-progress, done)
**And** a "who-is-doing-what" overview shows tasks grouped by assignee

**Given** I apply a priority filter (e.g., "High only")
**When** the filter is active
**Then** only high-priority tasks are displayed
**And** sorting by priority shows tasks in order: high, medium, low

**Given** a task has a due date approaching
**When** the due date is within the reminder window
**Then** the assignee receives a notification about the approaching deadline

**Given** a task is past its due date and not completed
**When** the overdue check runs
**Then** both the assignee and the organizer receive an overdue notification

**Features:** F173, F176, F186, F187, F178, F179

---

### Story 9.8: Checklist Templates and Recurring Tasks

As a trip organizer,
I want to use pre-built checklist templates and create recurring tasks,
So that common trip preparation steps are not forgotten and repeating responsibilities are automated.

**Acceptance Criteria:**

**Given** I navigate to the task creation area
**When** I open the checklist templates section
**Then** I see pre-trip templates (visa, insurance, apps, payment, health docs)
**And** during-trip templates (appropriate for active trip context)
**And** post-trip templates (expense settlement, review)

**Given** I select a pre-trip checklist template
**When** the template is applied
**Then** the template items are populated as individual tasks
**And** I can customize each task (edit title, change assignee, adjust due date)
**And** I can remove individual items I do not need

**Given** I want a custom checklist
**When** I click "Create Custom Template"
**Then** I can add custom items, name the template, and save it
**And** the custom template is available for reuse on future trips

**Given** I create a task and enable the recurring option
**When** I set recurrence to "weekly"
**Then** completing the task auto-creates a new instance for the next week
**And** the recurring pattern continues until disabled or the trip ends

**Features:** F181, F182, F183, F184, F185

## Epic 10: Personalize Your Experience

Users can toggle dark/light mode with system preference detection, set language preference, configure 6 granular notification toggles, set default currency, and mute notifications for individual trips. Includes i18n infrastructure with structured translation files.

### Story 10.1: Dark Mode and Theme Switching

As a user,
I want to toggle between dark and light mode with my system preference automatically detected,
So that I can use the app comfortably in any lighting condition.

**Acceptance Criteria:**

**Given** I am logged in and visit the app for the first time with my OS set to dark mode
**When** the app loads
**Then** the dark theme is applied automatically via next-themes system preference detection
**And** all colors update to the dark mode palette with light text on dark backgrounds

**Given** I am on any page of the app
**When** I click the theme toggle in the sidebar
**Then** all colors switch to the opposite theme (dark to light or light to dark)
**And** the toggle reflects the current state

**Given** I have toggled the theme to dark mode
**When** I refresh the page
**Then** my dark mode preference persists across sessions
**And** system preference detection is overridden by my explicit choice

**Given** I am on a page with the light theme active
**When** I toggle to dark mode
**Then** backgrounds, text, cards, borders, and inputs all update to dark palette
**And** there is no flash of unstyled content during the switch

**Given** I have cleared all stored preferences
**When** I set my OS to light mode and visit the app fresh
**Then** the light theme is applied automatically

**Features:** F31, F32

---

### Story 10.2: Granular Notification Preference Controls

As a user,
I want to individually toggle notifications for different event types,
So that I only receive alerts for the trip activities I care about.

**Acceptance Criteria:**

**Given** I am on the notification settings page
**When** I view the notification toggles
**Then** I see 6 separate toggles: new polls, poll deadlines/results, new activities, trip invitations, budget reminders, and task assignments/due dates

**Given** I toggle off "new polls" notifications and save
**When** I refresh the page
**Then** the toggle remains off
**And** my preference is persisted in my profile's notification_preferences

**Given** I toggle off "poll deadlines and results" and save
**When** a poll deadline approaches or results are declared in my trip
**Then** I do not receive notifications for those events

**Given** I toggle off "new activities" and save
**When** a new activity is added to a trip I belong to
**Then** I do not receive a notification

**Given** I toggle off "trip invitations" and save
**When** I receive a new trip invitation
**Then** I do not receive a notification for it

**Given** I toggle off "budget reminders" and save
**When** a budget reminder event fires
**Then** I do not receive the reminder notification

**Given** I toggle off "task assignments and due dates" and save
**When** a task is assigned to me or a due date approaches
**Then** I do not receive a notification

**Features:** F33, F34, F35, F36, F37, F38

---

### Story 10.3: Currency and Language Preferences

As a user,
I want to set my default currency and preferred language,
So that the app displays monetary values and text in formats familiar to me.

**Acceptance Criteria:**

**Given** I am on the user settings page
**When** I open the currency preference dropdown
**Then** I see a list of supported currencies (USD, EUR, GBP, etc.)

**Given** I select EUR as my preferred currency and save
**When** I refresh the page
**Then** EUR is still selected as my preferred currency
**And** new trips I create default to EUR as the base currency

**Given** I am on the user settings page
**When** I open the language preference selector
**Then** I see available languages

**Given** I change my language preference and save
**When** the page reloads
**Then** my language preference is stored in my user profile
**And** the setting persists across sessions

**Features:** F40, F41

---

### Story 10.4: Internationalization Infrastructure

As a user,
I want the app to support multiple languages through a proper i18n system,
So that I can use the app in my preferred language with correct locale formatting.

**Acceptance Criteria:**

**Given** the codebase uses next-intl for internationalization
**When** I inspect the project structure
**Then** structured translation files exist organized by locale (e.g., en.json)
**And** all user-facing UI strings reference i18n keys rather than hardcoded text

**Given** I visit the app with no language preference set
**When** the app loads
**Then** the default language is English
**And** the browser's locale is detected for initial language selection

**Given** I have set my language preference to a supported language
**When** I navigate between pages
**Then** all UI text renders in my selected language
**And** the language persists across page refreshes via my user settings

**Features:** F223, F224

---

### Story 10.5: Per-Trip Notification Mute

As a user,
I want to mute all notifications for a specific trip,
So that I can silence a noisy trip without affecting notifications from my other trips.

**Acceptance Criteria:**

**Given** I am viewing a trip's settings or my notification settings
**When** I find the per-trip mute toggle for that trip
**Then** I can enable mute for that specific trip

**Given** I have muted notifications for Trip A
**When** events occur in Trip A (new polls, activities, member changes)
**Then** I receive zero notifications for Trip A events

**Given** I have muted Trip A but not Trip B
**When** events occur in Trip B
**Then** I still receive notifications for Trip B according to my global notification preferences

**Given** I have muted a trip
**When** I unmute the trip
**Then** notifications resume for that trip's events going forward

**Features:** F39

---

## Epic 11: Take It With You — Export & Offline

Users can export itineraries as formatted PDF, calendar events as .ics, and expenses as CSV. PWA enables offline read-only access to cached itinerary with service worker. Unsaved changes trigger warnings on navigation.

### Story 11.1: PDF Itinerary Export

As a user,
I want to export my trip itinerary as a formatted PDF,
So that I can print it or share it with people who do not use the app.

**Acceptance Criteria:**

**Given** I am viewing a trip with multiple activities
**When** I click "Export as PDF"
**Then** PDF generation starts via the generate-pdf Edge Function
**And** a progress indicator is shown during generation

**Given** the PDF generation completes
**When** I open the downloaded file
**Then** the PDF contains a day-by-day itinerary layout
**And** each activity shows name, time, location, notes, and estimated cost
**And** the trip name, destination, and date range appear in the header
**And** the formatting is clean and readable

**Given** I have a trip with 100+ activities
**When** I export as PDF
**Then** the generation completes within 30 seconds without timeouts or errors

**Features:** F205, F208

---

### Story 11.2: Calendar and CSV Export

As a user,
I want to export activities to my calendar app and expenses to a spreadsheet,
So that I can integrate trip data with my existing tools.

**Acceptance Criteria:**

**Given** I am viewing a trip itinerary
**When** I click "Export to Calendar (.ics)"
**Then** a .ics file downloads via the generate-ics Edge Function

**Given** I open the downloaded .ics file
**When** I inspect its contents
**Then** each activity is a separate calendar event with correct date, time, and location
**And** the .ics format is valid and importable into standard calendar apps

**Given** I am viewing a trip with logged expenses
**When** I click "Export Expenses as CSV"
**Then** a CSV file downloads via the generate-csv Edge Function
**And** headers include all expense fields (amount, category, description, date, currency)
**And** data matches the logged expenses including currency conversions

**Features:** F206, F207

---

### Story 11.3: Export Filtering and Import Validation

As a user,
I want to export only selected portions of my trip data and have imported files validated,
So that I get exactly the data I need and bad files do not corrupt my trip.

**Acceptance Criteria:**

**Given** I have applied filters to my activities (specific days or categories)
**When** I export the filtered view
**Then** the export only includes the filtered data
**And** unfiltered data is excluded from the export file

**Given** I attempt to import a file with an invalid format
**When** I upload the file
**Then** a clear, specific error message is shown explaining the format issue
**And** no data is imported

**Given** I attempt to import a CSV with incorrect or missing columns
**When** the system validates the file
**Then** a specific validation error identifies which columns are wrong or missing
**And** no data is imported

**Features:** F209, F210

---

### Story 11.4: PWA Installation and Offline Access

As a user,
I want to install the app on my device and access my itinerary offline,
So that I can view trip details while traveling without internet.

**Acceptance Criteria:**

**Given** I open the app in a mobile browser
**When** the service worker is registered
**Then** an "Add to Home Screen" prompt is available
**And** installing the PWA opens the app in standalone mode

**Given** I have viewed a trip itinerary while online
**When** I lose network connectivity
**Then** I can still navigate to the cached itinerary
**And** activities are visible in read-only mode
**And** editing controls are disabled with a clear offline indicator

**Given** I am offline and viewing cached data
**When** I regain network connectivity
**Then** the app syncs and displays the latest data

**Given** I am filling out a form (activity, expense, etc.)
**When** I attempt to navigate away without saving
**Then** a warning dialog appears alerting me to unsaved changes
**And** canceling navigation preserves my form data
**And** confirming navigation proceeds normally

**Features:** F220, F221, F222

---

## Epic 12: Discover & Get Started — Marketing & Onboarding

Visitors can explore the marketing landing page, features page, and pricing page. Users can create accounts from any public page. New users joining via invite receive guided onboarding. All marketing pages are SEO-optimized with Open Graph images.

> **FR69 (Blog Content) — Deferred to post-MVP.** The PRD references blog content about travel planning (FR69), but no story implements this feature. Blog functionality is explicitly deferred; no story is required for initial implementation.

### Story 12.1: Marketing Landing Page

As a visitor,
I want to see a compelling landing page that explains what TripOS does,
So that I can understand the value and decide to sign up.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I navigate to the root URL (/)
**Then** I see a hero section with a clear value proposition
**And** feature highlight cards are displayed below the hero
**And** a prominent "Sign Up" call-to-action button is visible

**Given** I am viewing the landing page
**When** I view the page source
**Then** the content is server-side rendered (SSR/ISR) for SEO
**And** the page is responsive and renders correctly on mobile

**Given** I am viewing the landing page
**When** I click the "Sign Up" CTA
**Then** I am navigated to the registration page

**Given** the landing page renders in the (marketing) route group
**When** I am authenticated and visit the root URL
**Then** I am redirected to my dashboard instead of the marketing page

**Features:** F8, F225

---

### Story 12.2: Features and Pricing Pages

As a visitor,
I want to explore the features and pricing of TripOS,
So that I can understand what the app offers before committing.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I navigate to /features
**Then** I see detailed feature sections with descriptions and interactive previews or screenshots
**And** the page is visually compelling and server-rendered

**Given** I am not authenticated
**When** I navigate to /pricing
**Then** I see a clear comparison of free vs. pro tiers
**And** each tier card lists included features
**And** pricing is clearly displayed
**And** CTA buttons for each tier are present

**Given** I am on any marketing page (landing, features, or pricing)
**When** I look for a sign-up option
**Then** I can create an account from any of these public pages

**Features:** F226, F227

---

### Story 12.3: Guided Onboarding for New Users

As a new user joining via invite,
I want a guided onboarding experience,
So that I can quickly understand the app and start participating in my first trip.

**Acceptance Criteria:**

**Given** I have just registered as a new user
**When** I arrive at the dashboard for the first time
**Then** a guided onboarding flow begins with step-by-step instructions
**And** the flow walks me through key actions: setting a budget, casting a vote, and exploring the trip

**Given** I am in the onboarding flow
**When** I follow the guided trip creation steps
**Then** I successfully create my first trip
**And** the onboarding is marked as complete in my profile

**Given** the main navigation sidebar is rendered
**When** I am authenticated
**Then** the sidebar displays my trip list, a Create Trip button, user settings link, and theme toggle
**And** the sidebar is visible on desktop

**Features:** F7, F228

---

### Story 12.4: SEO and Open Graph Optimization

As a marketing stakeholder,
I want all public pages discoverable by search engines with rich social previews,
So that TripOS gains organic traffic and looks professional when shared.

**Acceptance Criteria:**

**Given** a search engine crawler visits the landing page, features page, or pricing page
**When** it reads the page
**Then** the content is server-rendered with proper HTML semantic structure
**And** meta title, description, and canonical URL tags are present
**And** static assets are served via CDN with edge caching (NFR-SC5)

**Given** someone shares a TripOS marketing page URL on social media
**When** the platform fetches the Open Graph metadata
**Then** an auto-generated Open Graph image is served from /api/og
**And** og:title, og:description, og:image, and og:url are all populated correctly

**Given** a public trip page exists with a SEO slug
**When** it is shared or indexed
**Then** it renders with SSR and includes meta tags for the trip name, destination, and dates

**Features:** F49 is covered in Epic 2; this story covers the marketing-page SEO aspects as cross-cutting with FR72. No additional feature IDs are assigned here since F7, F8, F225-F228 cover the marketing domain completely.

**Features:** (SEO aspects are embedded in F8, F225, F226, F227 above; no additional uncovered feature IDs)

---

## Epic 13: Production Quality & Accessibility

Cross-cutting quality assurance covering security hardening, navigation, form validation, error handling, state persistence, responsive layouts, and full accessibility compliance. Every story delivers direct user value through a more reliable, secure, and usable experience.

### Story 13.1: Security Hardening -- Protected Routes and RLS

As a user,
I want the app to prevent unauthorized access to my trip data,
So that my information is secure and only visible to authorized members.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I try to navigate to /dashboard or /trip/[id]
**Then** I am redirected to the login page
**And** after logging in I am redirected back to the originally requested page

**Given** I am authenticated but not a member of Trip X
**When** I query Trip X's data via the API (activities, polls, expenses, members)
**Then** I receive zero rows for every table due to RLS enforcement

**Given** I am a member with the "guest" role
**When** I attempt write operations (add activity, vote, submit budget)
**Then** the server rejects the request based on role-based permission checks
**And** the UI hides or disables write controls for guests

**Given** two members have submitted blind budgets
**When** Member A queries the budgets API
**Then** only Member A's own budget is returned due to RLS
**And** even the trip owner cannot see individual amounts

**Given** I manually change the trip ID in the URL from /trip/abc to /trip/xyz
**When** I am not a member of trip xyz
**Then** I see a 404 or access denied page with no data leakage

**Given** a trip has been soft-deleted
**When** any user tries to access it via direct URL or API
**Then** a 404 is returned and the trip does not appear in search results

**Features:** F234, F235, F236, F237, F238, F244

---

### Story 13.2: Security Hardening -- XSS, CSRF, Invites, Sessions, and Rate Limiting

As a user,
I want the app to be protected against common web attacks and enforce secure session handling,
So that my data cannot be compromised through injection attacks or brute force.

**Acceptance Criteria:**

**Given** I enter `<script>alert('xss')</script>` as an activity name or poll description
**When** the content is rendered
**Then** the script is escaped and displayed as plain text, never executed

**Given** a mutation request is submitted without a valid CSRF token
**When** the server processes it
**Then** the request is rejected
**And** Supabase RLS provides an additional layer of protection

**Given** an invite link has been generated
**When** the link is used after its expiration date
**Then** access is denied with a clear message explaining the link has expired

**Given** I am authenticated
**When** I inspect my session cookies
**Then** they have httpOnly, Secure, and SameSite flags set appropriately
**And** token refresh works correctly without requiring re-login

**Given** a user or bot makes rapid requests to auth or API endpoints
**When** the rate of 100 requests/minute per user is exceeded
**Then** subsequent requests are rate-limited with an appropriate error message (NFR-S7)

**Features:** F239, F240, F241, F242, F243

---

### Story 13.3: Navigation and Routing

As a user,
I want consistent and predictable navigation throughout the app,
So that I can find content quickly and never get lost.

**Acceptance Criteria:**

**Given** I navigate to a URL that does not exist (e.g., /nonexistent-page)
**When** the page loads
**Then** a custom 404 page is displayed with a helpful message and a link back to the dashboard

**Given** I have a direct URL to a specific activity, poll, or expense
**When** I open the URL in a new tab
**Then** I am navigated directly to that specific item's detail view

**Given** I have navigated through multiple pages in the app
**When** I click the browser back button
**Then** I return to the previous page with its state intact
**And** the forward button returns me to the next page

**Given** I am viewing a nested page within a trip (e.g., an activity detail)
**When** I look at the breadcrumb navigation
**Then** I see the hierarchy: Dashboard > Trip Name > Current Tab
**And** each breadcrumb segment is clickable and navigates correctly

**Given** I am on a trip page
**When** I view the tab bar
**Then** I see tabs for Overview, Itinerary, Votes, Budget, Members, and Tasks
**And** clicking each tab loads the correct content
**And** the active tab is visually highlighted
**And** the URL updates to reflect the selected tab (using nuqs for URL state)

**Features:** F229, F230, F231, F232, F233

---

### Story 13.4a: Core Form Validation

As a user,
I want trip, expense, poll, and budget forms to validate my input clearly,
So that I receive helpful feedback and never submit invalid data.

**Acceptance Criteria:**

**Given** I submit the trip creation form with missing required fields
**When** validation runs via Zod schemas
**Then** specific error messages appear next to each invalid field
**And** setting end date before start date shows a date range error

**Given** I enter 0, -50, or "abc" as an expense amount
**When** I submit the form
**Then** the form rejects the input with a clear error message

**Given** I create a poll with no title, only 1 option, or a deadline in the past
**When** I submit
**Then** specific validation errors are shown for each invalid field

**Given** I enter a budget amount of 0, -100, or more than $100,000
**When** I submit the blind budget form
**Then** the form rejects with a specific error about the valid range

**Features:** F24, F247, F248, F249, F250

---

### Story 13.4b: Input Edge Case Validation

As a user,
I want email, password, and search inputs to handle edge cases gracefully,
So that invalid or unusual input never causes errors or confusion.

**Acceptance Criteria:**

**Given** I enter an invalid email format in the profile or invite form
**When** validation runs
**Then** a clear email format error is shown

**Given** I enter a new password and a mismatched confirmation password
**When** I submit the password change form
**Then** a mismatch error is displayed

**Given** I search with empty strings, whitespace only, special characters, or extremely long strings (500+ chars)
**When** the search executes
**Then** it handles all edge cases gracefully without errors

**Features:** F251, F252, F253, F254

---

### Story 13.5a: Loading States & Success Feedback

As a user,
I want to see skeleton loaders while content loads and success toasts after actions,
So that I always know the app is working and my actions succeeded.

**Acceptance Criteria:**

**Given** data is loading on the dashboard, trip page, activities tab, or polls tab
**When** the content has not yet arrived
**Then** skeleton loading screens matching the content shape are displayed (not spinners)

**Given** I successfully create a trip, add an activity, log an expense, or create a poll
**When** the server confirms the write
**Then** a green success toast notification appears and auto-dismisses after a few seconds

**Features:** F255, F256

---

### Story 13.5b: Error Handling & Network Resilience

As a user,
I want clear error messages, network status awareness, and retry options,
So that I can recover from failures without losing my work.

**Acceptance Criteria:**

**Given** an API call fails
**When** the error is returned
**Then** a red error toast appears with a user-friendly message (not technical details)
**And** the toast includes a retry suggestion if applicable

**Given** I lose network connectivity
**When** the connection drops
**Then** a persistent network error banner appears at the top of the page
**And** the banner disappears when connectivity is restored

**Given** an operation fails
**When** I see the error state
**Then** a retry button is available using React Query retry (3x exponential backoff per NFR-R4)
**And** clicking retry re-attempts the operation

**Given** a server error occurs
**When** the 500 error page is shown
**Then** a friendly message is displayed with a retry or "go home" button

**Features:** F257, F258, F259, F260

---

### Story 13.5c: Third-Party Service Fallbacks

As a user,
I want the app to keep working when Google Maps or currency APIs fail,
So that external service outages never block my trip planning.

**Acceptance Criteria:**

**Given** Google Maps API fails
**When** I view an activity with a location
**Then** the location is shown as text instead of a map and the app remains functional (NFR-I1)

**Given** both ExchangeRate-API and Frankfurter currency APIs fail
**When** I log an expense in a foreign currency
**Then** the app falls back to cached exchange rates or manual entry with no crash or data loss (NFR-I2)

**Features:** F261, F262

---

### Story 13.6: State Persistence and Recovery

As a user,
I want my work to be preserved even when unexpected things happen,
So that I never lose data due to accidental refreshes, disconnections, or conflicts.

**Acceptance Criteria:**

**Given** I have partially filled out an activity creation form
**When** I accidentally refresh the browser page
**Then** my form data (name, description, etc.) is preserved and I can continue filling it out

**Given** I am editing an activity with unsaved changes
**When** I click the browser back button
**Then** a warning dialog appears about unsaved changes
**And** canceling preserves my data, confirming navigates away

**Given** I am performing actions and my network briefly disconnects
**When** I reconnect
**Then** my session remains valid, pending changes sync, and no data is lost or duplicated

**Given** an optimistic UI update is shown immediately after my action
**When** the server rejects the operation
**Then** the UI rolls back to the previous state with an error message and data consistency is maintained

**Given** I add an activity in one browser tab
**When** I switch to another tab viewing the same trip
**Then** the new activity appears via React Query cache invalidation
**And** no stale data is shown

**Given** I have the same trip open in two browser tabs
**When** I make changes in tab 1
**Then** tab 2 reflects the changes via real-time subscriptions and cache invalidation with no conflicts

**Features:** F263, F264, F265, F266, F267, F268

---

### Story 13.7: Timezone and Temporal Handling

As a user planning trips with international members,
I want all dates, deadlines, and countdowns to be timezone-aware,
So that everyone sees accurate times regardless of where they are.

**Acceptance Criteria:**

**Given** a poll has a UTC deadline
**When** I view it from a different timezone
**Then** the deadline displays in my local timezone
**And** the countdown timer shows accurate remaining time

**Given** an activity is scheduled at a specific time
**When** members in different timezones view it
**Then** each member sees the time adjusted to their timezone
**And** all timestamps throughout the app are timezone-aware

**Given** activities with dates near midnight exist
**When** viewed from a timezone that would shift the date
**Then** activities remain correctly sorted chronologically with no date-shift errors

**Given** a poll has a countdown timer
**When** viewed by members in different timezones simultaneously
**Then** all viewers see the same remaining time and the countdown reaches zero at the correct moment

**Given** a trip is set to a destination in a different timezone
**When** I view the trip dates
**Then** the dates display in the destination's timezone with a timezone indicator visible

**Given** a task has a due date
**When** viewed from a timezone where the due date has already passed
**Then** the task is correctly marked as overdue
**And** from a timezone where the due date has not yet passed, it is not marked overdue

**Given** I open a date picker for deadlines, trip dates, or task due dates
**When** I interact with it
**Then** past dates are disabled for future-only fields, end dates are constrained to be after start dates, and the date format follows locale conventions

**Features:** F269, F270, F271, F272, F273, F274, F275

---

### Story 13.8: Idempotency and Race Condition Protection

As a user,
I want the app to handle rapid clicks, concurrent edits, and network timing issues correctly,
So that I never accidentally create duplicates or lose data to race conditions.

**Acceptance Criteria:**

**Given** I have filled out an expense, activity, or poll creation form
**When** I rapidly click the Submit button 5 times
**Then** only ONE record is created
**And** the button is disabled and shows a loading state during processing
**And** the button re-enables after completion

**Given** I click delete on an item and rapidly click confirm multiple times
**When** the deletion processes
**Then** only one deletion is executed with no errors about already-deleted resources

**Given** User A and User B both open the same activity for editing
**When** both save different changes (User A first, then User B)
**Then** last-write-wins is applied, a notification about the concurrent edit is shown, and data consistency is maintained

**Given** a slow API request is in flight
**When** a newer request for the same data completes first
**Then** the newer data is displayed and the late response does not overwrite it

**Given** a poll deadline is imminent
**When** I submit a vote exactly as the deadline passes
**Then** the server enforces the deadline strictly and rejects late votes with a clear message

**Given** I have successfully submitted a form
**When** I click the browser back button
**Then** the form does not auto-resubmit and I see a warning or redirect preventing duplicate creation

**Features:** F276, F277, F278, F279, F280, F281

---

### Story 13.9: Performance Optimization

As a user with large trips,
I want the app to remain fast and smooth even with lots of data,
So that the experience does not degrade as my trips grow.

**Acceptance Criteria:**

**Given** a trip has 100+ activities
**When** I navigate to the itinerary tab
**Then** the page loads within 3 seconds
**And** scrolling is smooth with no dropped frames or jank

**Given** a trip has 50+ geolocated activities
**When** I open the map view
**Then** all pins render correctly
**And** map interaction (zoom, pan) is smooth with pin clustering if applicable

**Given** a trip has 50+ items across activities, polls, and expenses
**When** I use the search feature
**Then** results appear within 500ms with no visible loading spinner beyond that threshold

**Given** I navigate through multiple pages, open and close modals, and switch between trip tabs
**When** I check the browser console
**Then** there are zero JavaScript errors
**And** memory usage shows no leaks from mounted/unmounted components

**Features:** F282, F283, F284, F285

---

### Story 13.10: Desktop and Tablet Responsive Layouts

As a user on a desktop or tablet,
I want the layout to adapt properly to my screen size,
So that I can use the full app without horizontal scrolling or cramped interfaces.

**Acceptance Criteria:**

**Given** my viewport is 1920px or wider
**When** the app renders
**Then** the left sidebar is fully visible with complete content
**And** the main content area is properly sized
**And** all trip tabs are accessible
**And** there is no horizontal scrolling

**Given** my viewport is 768px (tablet)
**When** the app renders
**Then** the sidebar is collapsible or hidden by default
**And** a hamburger menu or toggle is available to access it
**And** the main content takes full width when the sidebar is hidden
**And** all features remain accessible
**And** there is no horizontal scrolling

**Features:** F286, F287

---

### Story 13.11: Mobile Responsive Layout and Touch Targets

As a user on a mobile device,
I want the app to be fully usable on a small screen with appropriately sized touch targets,
So that I can plan trips on the go without frustration.

**Acceptance Criteria:**

**Given** my viewport is 375px (mobile)
**When** the app renders
**Then** a bottom navigation bar is visible instead of the sidebar
**And** cards stack vertically
**And** all features remain accessible
**And** there is no horizontal scrolling
**And** text is readable without zooming

**Given** I am using the app on a touchscreen device
**When** I interact with buttons, links, checkboxes, toggles, and dropdown triggers
**Then** every interactive element has a minimum touch target of 44x44px (NFR-A6)
**And** I can tap accurately without accidentally hitting adjacent elements

**Features:** F288, F289

---

### Story 13.12: Keyboard Navigation and ARIA

As a user who relies on keyboard navigation,
I want to use the entire app without a mouse,
So that I can access all features using only my keyboard.

**Acceptance Criteria:**

**Given** I am at the top of any page
**When** I press Tab repeatedly
**Then** focus moves through all interactive elements in a logical reading order
**And** a visible focus indicator is shown on each focused element

**Given** I am focused on a button
**When** I press Enter or Space
**Then** the button activates
**And** pressing Escape closes any open modals or dropdowns

**Given** I am navigating trip tabs via keyboard
**When** I Tab to a tab and press Enter
**Then** the tab content loads correctly
**And** I can fill and submit forms entirely via keyboard

**Given** I am tabbing through the page
**When** I encounter any area of the app
**Then** there are no keyboard traps where I cannot Tab away

**Given** I inspect the app with developer tools
**When** I check icon-only buttons, navigation links, form inputs, and dynamic content
**Then** all have appropriate ARIA labels, accessible names, associated labels, and aria-live regions
**And** landmark roles are set on main page sections

**Features:** F290, F291

---

### Story 13.13: Screen Reader and Focus Management

As a user who relies on a screen reader,
I want the app to announce content, errors, and navigation correctly,
So that I can use all features through assistive technology.

**Acceptance Criteria:**

**Given** I am using VoiceOver, NVDA, or another screen reader
**When** I navigate the app
**Then** the page structure is announced correctly with proper headings and landmarks
**And** all interactive elements are announced with their purpose and state
**And** form labels are read correctly
**And** validation error messages are announced when they appear

**Given** I trigger an action that opens a modal or confirmation dialog
**When** the modal opens
**Then** focus moves into the modal automatically
**And** focus is trapped within the modal (Tab does not leave it)
**And** pressing Escape closes the modal and returns focus to the triggering element

**Given** real-time notifications arrive
**When** they are announced to assistive technology
**Then** they do not disrupt my current focus position (NFR-A4)

**Features:** F293, F294

---

### Story 13.14: Color Contrast and Form Defaults

As a user,
I want text to be readable in both themes and forms to have sensible defaults,
So that the app is usable by people with visual impairments and forms are efficient to fill out.

**Acceptance Criteria:**

**Given** the app is in light mode or dark mode
**When** I inspect all text elements (primary text, links, buttons, placeholders)
**Then** primary text meets WCAG 4.5:1 contrast ratio against its background
**And** placeholder text meets 3:1 minimum contrast
**And** contrast is verified in both light and dark modes

**Given** I open the trip creation form
**When** I inspect the date fields
**Then** sensible default dates are pre-populated

**Given** I open the expense form
**When** I inspect the date field
**Then** today's date is the default

**Given** I open the poll creation form
**When** I inspect the default values
**Then** the poll type defaults to Yes/No, deadline defaults to 48 hours, and anonymous defaults to ON (matching smart defaults from UX spec)

**Given** I fill out a form and click Reset
**When** the form resets
**Then** all fields return to their sensible defaults (not blank)
**And** filter and sort controls reset when the context changes

**Features:** F292, F295
