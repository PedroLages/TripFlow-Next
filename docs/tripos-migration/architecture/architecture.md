---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-TripOS-2026-02-09.md
  - docs/architecture/tech-stack-tracker.md
  - docs/design/ux-spec.md
  - docs/strategy/blind-budgeting-deep-dive.md
  - docs/strategy/voting-system-deep-dive.md
  - docs/strategy/role-based-permissions-deep-dive.md
  - docs/strategy/mobile-first-ux-deep-dive.md
  - docs/architecture/maps-hybrid-optimization-plan.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-11'
project_name: 'TripOS'
user_name: 'Pedro'
date: '2026-02-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

72 functional requirements spanning 6 domains:

- **Collaboration Foundation** (FR1-FR15): Trip CRUD, member management, 4-tier role hierarchy (Owner/Organizer/Member/Guest), invite system with link expiration, member leave cascades
- **Itinerary & Activities** (FR16-FR30): Activity CRUD with proposals workflow, day-by-day timeline, Google Maps integration (pins, routes, Places autocomplete), drag-and-drop reordering, booking status tracking, auto-save drafts, version history
- **Structured Voting** (FR31-FR42): 5 vote types (yes/no, single choice, ranked choice, approval, veto), server-side deadline enforcement, quorum/consensus thresholds, anonymous voting, poll scheduling/duplication/templates, tiebreaker logic
- **Budget & Expenses** (FR43-FR56): Multi-currency expense logging with ExchangeRate-API + Frankfurter fallback, 4 split methods (even/percentage/custom/family), settlement optimization (minimize transactions), receipt uploads, category breakdown charts
- **Blind Budgeting** (FR57-FR65): Privacy-preserving budget coordination via RLS-enforced isolation, server-side-only aggregation, timing attack mitigation (random 5-15s delay), hash-only audit logging, 90-day data lifecycle, small group privacy protections
- **Task Management** (FR66-FR72): Task CRUD with assignment, checklist templates (pre/during/post-trip), recurring tasks, booking deadline tracking

**Non-Functional Requirements:**

- **Performance**: Page load <3s, real-time updates <500ms, smooth rendering with 100+ activities, search <500ms
- **Security** (16 NFRs): RLS enforcement on all tables, CSRF on all mutations, XSS prevention on user content, rate limiting (auth/invites/polls/budget), session management (30-day refresh), invite link expiration, URL manipulation protection
- **Scalability**: 200 activities/trip, 50 active polls/trip, 500 expenses/trip, 20 members/trip (soft cap), 100 tasks/trip
- **Reliability**: Graceful degradation on external API failures (maps → text, currency → fallback API → manual entry)
- **Accessibility**: WCAG 2.1 AA compliance, 44px touch targets, keyboard navigation, screen reader support, 4.5:1 contrast ratio

**UX Architecture:**

26 screens across 5 phases. App shell with left sidebar (desktop), bottom nav (mobile). Trip workspace with 7 tabs (Overview, Itinerary, Votes, Budget, Members, Tasks, Settings). 4 route groups: /(marketing), /(auth), /(app), /(public). Critical flows: trip creation, voting, blind budget submission, expense logging.

### Scale & Complexity

- **Primary domain**: Full-stack web application (Next.js 16 App Router + Supabase)
- **Complexity level**: High
- **Estimated architectural components**: ~25 (4 route groups, 7 trip tabs, 6+ Edge Functions, 18 database tables, 8+ RLS policies, 6+ Realtime channels)

**Complexity drivers:**
1. Privacy-preserving computation (blind budgeting threat model)
2. Multi-algorithm voting (instant-runoff ranked choice, approval, veto)
3. Real-time collaboration across all features (6+ concurrent channels per trip)
4. Database-level role enforcement (4-tier RBAC via RLS, not application code)
5. Multi-currency with API failover chain
6. Multi-rendering strategy (SSR marketing, client-heavy app, SSR public pages)
7. PWA with offline read-only capability

### Technical Constraints & Dependencies

- **Supabase as sole backend**: No custom server — all business logic via Edge Functions (Deno/TypeScript) or database functions. RLS is the primary security boundary.
- **Next.js 16 App Router**: React Server Components for performance, route groups for layout isolation. Constrained by RSC serialization rules.
- **Google Maps vendor lock-in (MVP)**: Post-MVP hybrid optimization plan exists (Mapbox/Apple Maps for US/Europe) with MapProvider abstraction interface.
- **External API rate limits**: ExchangeRate-API (1,500 calls/mo free), Google Maps ($200 free credit/mo). Caching and fallback strategies required.
- **Supabase Realtime limits**: Connection pooling and channel management needed for trips with many concurrent users.

### Cross-Cutting Concerns Identified

1. **Real-time synchronization**: Affects itinerary, voting, members, activity feed, presence — requires consistent subscription management pattern and optimistic UI reconciliation
2. **Role-based access control**: Every write operation must check role at database level (RLS) — not just UI hiding
3. **Optimistic UI with rollback**: All mutations should show immediately and revert on failure — requires consistent React Query mutation pattern
4. **Form state preservation**: All forms must survive page refresh — requires auto-save or sessionStorage strategy
5. **Timezone handling**: Polls, tasks, activities display in user's local time — server stores UTC, client converts
6. **Rate limiting**: Auth, invites, polls, budget changes each have different limits — requires consistent middleware/Edge Function pattern
7. **Skeleton loading states**: Every list and detail view needs shaped skeleton loaders — requires consistent component pattern
8. **Error boundary strategy**: Network failures, API errors, external service degradation — each needs defined fallback behavior
9. **Audit and logging**: Activity feed entries for all entity changes, hash-only budget audit log — requires consistent trigger/hook pattern
10. **Member leave cascades**: Affects budgets (recalculate), expenses (flag splits), tasks (unassign), activities (gray out) — requires transactional Edge Function

## Starter Template Evaluation

### Technical Preferences (Pre-Established)

All technology decisions were finalized during research phase (see tech-stack-tracker.md):

- **Language**: TypeScript (strict mode)
- **Frontend**: Next.js 16 App Router with React Server Components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions, Storage)
- **Styling**: Tailwind CSS + shadcn/ui + CSS Variables + CSS Modules
- **State**: React Query (TanStack Query v5) for server state, Zustand for UI state
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **CI/CD**: Vercel (hosting) + GitHub Actions (CI pipeline)
- **Package Manager**: pnpm

### Primary Technology Domain

Full-stack web application (Next.js 16 + Supabase). Multi-rendering strategy: SSR for marketing/public pages, client-heavy for authenticated app, RSC for performance.

### Starter Options Evaluated

| Starter | Stack Coverage | Supabase Quality | Maintenance | Verdict |
|---|---|---|---|---|
| **Official `with-supabase`** | 5/8 (Next.js, TS, Tailwind, shadcn, Supabase) | Canonical (Vercel+Supabase teams) | High | **Selected** |
| `supa-next-starter` | 7/8 (adds React Query, Vitest) | Community patterns | Medium (17 commits) | Good but less reliable |
| Nextbase Lite | 6/8 (adds React Query, Playwright) | Good (+ type gen) | Medium (uses Jest not Vitest) | Swap cost for Jest→Vitest |
| `create-t3-app` | 3/8 (no Supabase, uses tRPC) | None | High | Wrong stack |
| `npx shadcn create` | 3/8 (visual styles only) | None | High | Frontend-only |
| Manual `create-next-app` | 3/8 (base only) | None | High | Maximum setup cost |

### Selected Starter: Official Vercel/Supabase `with-supabase` Example

**Rationale:**

1. **Canonical Supabase integration**: Auth middleware, cookie-based sessions via `@supabase/ssr`, server/client component utilities — all maintained by Vercel + Supabase core teams. TripOS depends heavily on Supabase (RLS, Auth, Realtime, Edge Functions, Storage), so the official patterns reduce risk.
2. **shadcn/ui included**: Design system foundation already wired up with `components.json`.
3. **Always current**: Lives in the Next.js canary branch, automatically updated with every Next.js release.
4. **Clean foundation**: Zero cruft — no opinionated choices about state management, testing, or CI that we'd need to rip out.

**Trade-off accepted**: Manual setup for React Query, Zustand, Vitest, and Playwright. These are straightforward additions with well-documented integration patterns, and starting from canonical Supabase patterns is worth the 30 minutes of additional setup.

**Initialization Command:**

```bash
npx create-next-app@latest --example with-supabase tripOS
cd tripOS

# Add state management
pnpm add @tanstack/react-query zustand

# Add testing
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
pnpm add -D @playwright/test
npx playwright install

# shadcn/ui already included — add components as needed:
# npx shadcn@latest add button card dialog dropdown-menu etc.
```

**Architectural Decisions Provided by Starter:**

- **Auth pattern**: Cookie-based sessions via `@supabase/ssr` middleware (not localStorage — required for RSC)
- **Client utilities**: Separate Supabase client creation for server components, client components, and middleware
- **Route protection**: Middleware-based auth token refresh on every request
- **TypeScript**: Strict mode, path aliases (`@/*`)
- **Styling**: Tailwind CSS with shadcn/ui theming via CSS variables
- **Bundler**: Turbopack (Next.js 16 default)
- **Linting**: ESLint with Next.js config

**Decisions We Add on Top:**

- React Query provider wrapping authenticated routes (server state cache)
- Zustand stores for UI state (sidebar, modals, filters)
- Vitest config with React Testing Library for component/hook tests
- Playwright config for E2E tests across all 295 features
- GitHub Actions CI pipeline (lint → type-check → unit tests → E2E tests)
- Environment variable management (.env.local for dev, Vercel env for prod)

**Note:** Project initialization using this starter should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. Data validation library and form management approach
2. Real-time channel architecture and subscription patterns
3. File/folder organization convention
4. Error handling and optimistic UI patterns
5. Database migration and type generation workflow

**Important Decisions (Shape Architecture):**

6. Date/timezone handling library
7. URL state management for search/filter
8. Dark mode implementation
9. i18n infrastructure
10. Bundle optimization strategy

**Deferred Decisions (Post-MVP):**

- Horizontal scaling (Supabase + Vercel handle this automatically for MVP scale)
- Advanced CDN caching / ISR for marketing pages
- API documentation tooling (Supabase auto-generates REST docs)
- Map provider abstraction (post-MVP hybrid plan already documented)

### Data Architecture

**Database:** PostgreSQL via Supabase (decided in tech-stack-tracker, 87.5% score)
- 18 tables defined in app_spec.txt with full schema
- Key indexes on high-frequency joins (trip_members, activities by date, polls by status)
- Soft delete pattern for trips (status enum, deleted_at timestamp)

**Data Validation:** Zod 3.23.8 + React Hook Form 7.71.1
- **Decision:** Use Zod 3.x (NOT Zod 4.x) — Zod 4 has a known runtime error ("int is not defined") with Next.js 16's Turbopack bundler
- Zod schemas shared between client-side form validation and Edge Function input validation
- React Hook Form with `@hookform/resolvers/zod` for all forms
- **React 19 caveat:** Use `useWatch()` instead of `watch()` — watch() doesn't trigger re-renders in React 19
- Rationale: Type-safe validation from form to database, single source of truth for validation rules

**Type Generation:** Supabase CLI (`supabase gen types typescript`)
- Auto-generate TypeScript types from database schema
- Types committed to git, regenerated on schema changes
- Provides type safety for all Supabase client queries

**Migration Strategy:** Supabase CLI migrations
- `supabase migration new` for schema changes
- Migration files tracked in git (`supabase/migrations/`)
- `supabase db diff` to detect drift between local and remote
- `seed.sql` for development data seeding
- Local development via `supabase start` (Docker-based local Supabase)

**Caching Strategy:**
- React Query: `staleTime: 30s` for most queries, `staleTime: 0` for real-time entities (activities, polls, members)
- React Query `gcTime: 5min` (garbage collection for inactive queries)
- Supabase Realtime subscriptions trigger React Query cache invalidation (not polling)
- No additional caching layer for MVP — Supabase + React Query handles the read pattern

### Authentication & Security

**Auth Provider:** Supabase Auth (decided in tech-stack-tracker)
- Methods: Email/password, Google OAuth, Apple OAuth, magic link
- Session: Cookie-based via `@supabase/ssr` 0.8.0 (from starter template)
- Refresh: 30-day refresh token, silent renewal for active sessions
- Password: Min 8 chars, uppercase, lowercase, number required

**Authorization:** Row-Level Security (RLS) as primary security boundary
- All data access controlled at database level — not application code
- 4-tier role hierarchy: Owner > Organizer > Member > Guest
- RLS policies use `auth.uid()` and helper functions (`get_user_role()`)
- Blind budget RLS: Users can only SELECT/UPDATE/DELETE their own rows
- Group budget calculation: Server-side only via Edge Function (never exposed to client)

**Security Middleware:**
- Next.js middleware: Auth token refresh, route protection, redirect unauthenticated users
- Supabase RLS: Data-level access control (defense in depth)
- Edge Functions: Business logic validation (budget calculations, poll closing, settlement)

**Rate Limiting Implementation:**
- Auth endpoints: Supabase built-in rate limiting
- Invite links: Edge Function rate limiting (configurable per-user limit)
- Poll creation: Edge Function rate limiting
- Budget changes: Database constraint (max 1 per minute, enforced via `updated_at` check)
- General API: Vercel edge middleware for IP-based rate limiting

**CSRF/XSS Protection:**
- CSRF: Cookie-based auth with SameSite=Lax (Supabase default) + Next.js Server Actions (built-in CSRF tokens)
- XSS: React's built-in JSX escaping + DOMPurify for any dangerouslySetInnerHTML (activity notes, poll descriptions)
- Content Security Policy headers via Next.js middleware

### API & Communication Patterns

**Primary API:** Supabase auto-generated REST API with RLS enforcement
- Standard CRUD via `@supabase/supabase-js` 2.95.3 client SDK
- PostgREST query builder for complex queries (joins, filters, pagination)
- No custom REST API layer needed — Supabase handles this

**Edge Functions** (Supabase, Deno/TypeScript) for complex business logic:
- `calculate-group-budget`: Blind budget aggregation with timing delay
- `close-poll`: Ranked choice tabulation, tiebreaker, quorum validation
- `settle-expenses`: Optimized debt settlement (minimize transactions)
- `convert-currency`: ExchangeRate-API with Frankfurter fallback + caching
- `send-notification`: In-app + email (Resend) with preference/quiet hours enforcement
- `generate-pdf`, `generate-ics`, `generate-csv`: Export generation
- `transfer-ownership`: Atomic trip ownership transfer
- `handle-member-leave`: Cascading member removal

**Next.js API Routes** (minimal, specific use cases):
- `POST /api/webhooks/auth`: Supabase auth event handling (new user profile creation)
- `POST /api/webhooks/scheduled`: Cron jobs (poll auto-close, budget purge, deadline reminders)
- `GET /api/og`: Open Graph image generation for public trip pages

**Real-Time Channel Architecture:**
- One Supabase Realtime channel per trip: `trip:{tripId}`
- Channel multiplexes events for: activities, polls, votes, members, feed, expenses
- Presence channel per trip for active user indicators: `presence:trip:{tripId}`
- Client subscribes on trip page mount, unsubscribes on unmount
- React Query cache invalidation on Realtime events (not refetch — parse the payload and update cache directly)

**Error Handling Standard:**
- Edge Functions return structured errors: `{ error: { code: string, message: string, details?: object } }`
- HTTP status codes: 400 (validation), 401 (auth), 403 (permission), 404 (not found), 429 (rate limit), 500 (server)
- Client-side: React Error Boundaries per route segment (not global)
- User feedback: Toast notifications (success green, error red, warning amber, info blue) via shadcn/ui Toast
- Network errors: Banner component at top when offline/disconnected
- Retry: Automatic React Query retry (3 attempts with exponential backoff) for transient failures

**Optimistic Update Pattern:**
- All mutations use React Query `useMutation` with `onMutate` → `onError` → `onSettled`
- `onMutate`: Cancel outgoing queries, snapshot previous data, optimistically update cache
- `onError`: Rollback to snapshot, show error toast
- `onSettled`: Invalidate queries to resync with server
- Double-click prevention: Disable submit button while `mutation.isPending`

### Frontend Architecture

**Component Library:** shadcn/ui (from starter) with project-specific extensions
- Copy-paste components from shadcn/ui registry, customized as needed
- CSS Variables for theming (light/dark mode via `next-themes` 0.4.6)
- Design tokens: teal primary (#0D9488), amber accent (#F59E0B), purple voting (#7C3AED)

**File Organization:** Feature-based structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, route groups)
│   ├── (marketing)/        # Public pages (landing, features, pricing)
│   ├── (auth)/             # Auth flows (login, signup, reset)
│   ├── (app)/              # Authenticated app
│   │   ├── dashboard/
│   │   ├── trip/[tripId]/
│   │   │   ├── overview/
│   │   │   ├── itinerary/
│   │   │   ├── votes/
│   │   │   ├── budget/
│   │   │   ├── members/
│   │   │   ├── tasks/
│   │   │   └── settings/
│   │   └── settings/       # User settings
│   └── (public)/           # Public trip pages
├── components/
│   ├── ui/                 # shadcn/ui base components
│   └── shared/             # App-wide shared components (header, sidebar, nav)
├── features/               # Feature-specific components, hooks, utils
│   ├── trips/
│   ├── activities/
│   ├── voting/
│   ├── budget/
│   ├── expenses/
│   ├── tasks/
│   ├── members/
│   ├── notifications/
│   └── feed/
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities, Supabase clients, providers
│   ├── supabase/           # Server, client, middleware Supabase clients
│   ├── providers/          # React Query provider, theme provider
│   └── utils/              # Shared utilities (formatting, validation)
├── stores/                 # Zustand stores (UI state)
├── types/                  # Supabase generated types + app types
└── styles/                 # Global styles, CSS modules
```

**State Management Split:**
- **React Query** (server state): All data from Supabase — trips, activities, polls, expenses, members, notifications
- **Zustand** (UI state): Sidebar open/closed, active filters, modal state, search queries, selected tab
- **URL state** via `nuqs` 2.8.8: Search params, filter selections, pagination — shareable/bookmarkable
- **Form state**: React Hook Form (ephemeral, per-form instance)

**Date Handling:** `date-fns` 4.1.0
- All dates stored in UTC (PostgreSQL `timestamptz`)
- Display in user's local timezone via `date-fns-tz`
- Trip dates displayed in destination timezone
- Poll deadlines show countdown with timezone-aware accuracy
- Rationale: Tree-shakeable, no prototype pollution, comprehensive timezone support

**Dark Mode:** `next-themes` 0.4.6
- System preference detection on first visit
- Manual toggle persisted in localStorage
- CSS Variables switch between light/dark token sets
- Teal and amber maintain vibrancy in both modes

**i18n:** `next-intl` 4.8.2
- Infrastructure set up from Phase 1 (structured for future translations)
- English-only for MVP, translation keys in place
- Message files in `messages/` directory
- Server component support via `getTranslations()`

**Bundle Optimization:**
- Automatic route-based code splitting (Next.js App Router default)
- Dynamic imports for heavy components: Google Maps (`@react-google-maps/api`), chart libraries (Recharts)
- `next/image` for all images (automatic optimization, WebP, lazy loading)
- Turbopack for fast development builds
- Vercel Edge Network for production CDN

### Infrastructure & Deployment

**Hosting:** Vercel (decided in tech-stack-tracker)
- Edge Network CDN for static assets and SSR pages
- Serverless functions for API routes
- Automatic preview deployments on PR branches
- Production deployment on `main` branch merge

**CI/CD Pipeline:** GitHub Actions
- Trigger: Push to any branch, PR to `main`
- Steps: Install (pnpm) → Lint (ESLint) → Type Check (tsc) → Unit Tests (Vitest) → E2E Tests (Playwright) → Deploy (Vercel)
- Playwright runs against Vercel preview deployment URL
- Branch protection: All checks must pass before merge to `main`

**Local Development:**
- `supabase start` for local PostgreSQL, Auth, Realtime, Storage, Edge Functions (Docker)
- `pnpm dev` for Next.js development server (Turbopack)
- `.env.local` with local Supabase credentials
- `supabase db reset` to reset local database with migrations + seed data

**Environment Configuration:**
- Development: `.env.local` (gitignored) with local Supabase URL + anon key
- Preview: Vercel environment variables (per-branch)
- Production: Vercel environment variables (encrypted)
- Sensitive keys (service_role, API keys): Vercel encrypted env vars only, never in client code
- Supabase anon key: Safe for client (RLS enforces security)

**Monitoring & Observability:**
- **Sentry**: Error tracking, performance monitoring, session replay (free tier: 50K events)
- **PostHog**: Product analytics, feature flags, session recording (free tier: 1M events)
- **Supabase Dashboard**: Database metrics, API usage, auth events, real-time connections
- **Vercel Analytics**: Web Vitals, function execution times, deployment metrics
- Edge Function logging: Structured JSON logs via Supabase dashboard

### Decision Impact Analysis

**Implementation Sequence:**

1. Project initialization (starter + manual additions)
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

**Cross-Component Dependencies:**

- React Query provider must wrap all authenticated routes (set up in step 1)
- Supabase Realtime subscription manager must be initialized per trip (affects steps 4-9)
- Zod schemas shared between forms and Edge Functions (consistent validation)
- RLS policies must be in place before any data access (step 2)
- Role checking helpers used across all feature modules
- Toast notification system used by all mutations (set up in step 1)
- Error boundary layout wraps each route segment (set up in step 1)

### Verified Library Versions

| Library | Version | Compatibility Notes |
| --- | --- | --- |
| Next.js | 16.1.6 | LTS, Turbopack default |
| @supabase/supabase-js | 2.95.3 | Fully compatible |
| @supabase/ssr | 0.8.0 | Cookie-based auth for RSC |
| @tanstack/react-query | 5.90.20 | Use `isPending` not `isLoading` |
| zustand | 5.0.11 | Follow hook naming conventions |
| zod | 3.23.8 | **Use 3.x** — Zod 4 breaks with Turbopack |
| react-hook-form | 7.71.1 | Use `useWatch()` not `watch()` for React 19 |
| date-fns | 4.1.0 | Stable, tree-shakeable |
| next-themes | 0.4.6 | Stable |
| nuqs | 2.8.8 | URL state for App Router |
| next-intl | 4.8.2 | Server component support |

## Implementation Patterns & Consistency Rules

### Critical Conflict Points

25+ areas identified where AI agents could make inconsistent choices. The following rules eliminate ambiguity.

### Naming Patterns

**Database Naming (PostgreSQL/Supabase):**

- Tables: `snake_case`, plural — `trips`, `trip_members`, `blind_budgets`, `activity_feed`
- Columns: `snake_case` — `user_id`, `created_at`, `is_public`, `booking_status`
- Foreign keys: `{referenced_table_singular}_id` — `trip_id`, `user_id`, `poll_id`
- Indexes: `ix_{table}_{columns}` — `ix_activities_trip_id_date`, `ix_polls_trip_id_status`
- RLS policies: `{table}_{action}_{description}` — `blind_budgets_select_own_only`, `trips_select_member_or_public`
- Enums: `snake_case` values — `yes_no`, `ranked_choice`, `not_started`, `to_book`
- Functions: `snake_case` — `get_user_role()`, `create_trip_with_owner()`, `log_role_change()`

**API/Edge Function Naming:**

- Edge Functions: `kebab-case` — `calculate-group-budget`, `close-poll`, `settle-expenses`
- Next.js API routes: `kebab-case` — `/api/webhooks/auth`, `/api/og`
- Query parameters: `snake_case` (matches database) — `?trip_id=...&start_date=...`
- Supabase REST: Auto-generated from table names (already snake_case)

**Code Naming (TypeScript/React):**

- Components: `PascalCase` — `TripCard`, `PollVotingInterface`, `BlindBudgetForm`
- Component files: `kebab-case.tsx` — `trip-card.tsx`, `poll-voting-interface.tsx`
- Hooks: `camelCase` with `use` prefix — `useTripMembers`, `useBlindBudget`, `useRealtimeSubscription`
- Hook files: `kebab-case.ts` — `use-trip-members.ts`, `use-blind-budget.ts`
- Utilities: `camelCase` — `formatCurrency()`, `calculateSettlement()`, `parseDeadline()`
- Utility files: `kebab-case.ts` — `format-currency.ts`, `calculate-settlement.ts`
- Constants: `UPPER_SNAKE_CASE` — `MAX_MEMBERS_PER_TRIP`, `BUDGET_RATE_LIMIT_MS`
- Types/Interfaces: `PascalCase` — `Trip`, `TripMember`, `PollWithOptions`, `BlindBudgetSubmission`
- Type files: `kebab-case.ts` — `trip.types.ts` or co-located in feature module
- Zod schemas: `camelCase` with `Schema` suffix — `tripFormSchema`, `expenseFormSchema`, `budgetInputSchema`
- Zustand stores: `camelCase` with `use` prefix and `Store` suffix — `useSidebarStore`, `useFilterStore`
- React Query keys: Array format, feature-prefixed — `['trips', tripId]`, `['polls', tripId, 'active']`, `['budget', tripId, 'group-limit']`

**Route Naming (Next.js App Router):**

- Route segments: `kebab-case` — `/trip/[tripId]/itinerary`, `/trip/[tripId]/budget`
- Dynamic segments: `camelCase` in brackets — `[tripId]`, `[pollId]`, `[slug]`
- Route groups: `(groupName)` — `(marketing)`, `(auth)`, `(app)`, `(public)`

### Structure Patterns

**Test Placement:** Co-located with source files

```text
src/features/voting/
├── components/
│   ├── poll-card.tsx
│   └── poll-card.test.tsx        # Unit test next to component
├── hooks/
│   ├── use-poll-votes.ts
│   └── use-poll-votes.test.ts    # Hook test next to hook
└── utils/
    ├── ranked-choice.ts
    └── ranked-choice.test.ts     # Utility test next to util

e2e/                               # Playwright E2E tests separate
├── voting.spec.ts
├── blind-budgeting.spec.ts
└── fixtures/
```

**Feature Module Structure:** Each feature follows this pattern:

```text
src/features/{feature-name}/
├── components/          # Feature-specific React components
├── hooks/               # Feature-specific custom hooks (React Query + business logic)
├── utils/               # Feature-specific utilities
├── schemas/             # Zod validation schemas for this feature
├── types.ts             # Feature-specific types (beyond Supabase generated)
└── index.ts             # Public API barrel export
```

**Shared Component Categories:**

- `src/components/ui/` — shadcn/ui base components (Button, Card, Dialog, etc.)
- `src/components/shared/` — App-wide composed components (AppSidebar, TripHeader, NotificationBell)
- `src/features/{name}/components/` — Feature-specific components (PollCard, BudgetSubmitForm)

**Import Order Convention (enforced by ESLint):**

1. React/Next.js imports
2. External library imports
3. `@/lib/` imports (utilities, clients)
4. `@/components/ui/` imports (shadcn base)
5. `@/components/shared/` imports
6. `@/features/` imports
7. `@/hooks/` imports
8. `@/stores/` imports
9. `@/types/` imports
10. Relative imports (`./ ../`)
11. Style imports

### Format Patterns

**Supabase API Responses (auto-generated, follow these conventions):**

- Success: `{ data: T, error: null }` (Supabase client SDK pattern)
- Error: `{ data: null, error: { message: string, code: string, details: string } }`
- Always destructure: `const { data, error } = await supabase.from('trips').select()`
- Never use `.then()/.catch()` — always use `await` with destructured error

**Edge Function Response Format:**

```typescript
// Success
return new Response(JSON.stringify({ data: result }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
})

// Error
return new Response(JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Budget changes limited to 1 per minute' } }), {
  status: 429,
  headers: { 'Content-Type': 'application/json' },
})
```

**Date/Time Formats:**

- Database storage: `timestamptz` (PostgreSQL handles UTC)
- JSON transport: ISO 8601 strings — `"2026-02-11T14:30:00.000Z"`
- Display: Formatted via `date-fns` in user's local timezone
- Never store formatted dates — always store UTC, format on display

**JSON Field Naming:**

- Database → JSON: Supabase preserves `snake_case` from database columns
- Client code: Use `snake_case` when working with Supabase data (no transformation layer)
- Rationale: Avoids camelCase ↔ snake_case mapping bugs. TypeScript types generated from database are already snake_case.

**Boolean Patterns:**

- Database: PostgreSQL `BOOLEAN` (true/false)
- JSON: `true`/`false` (never 1/0, never "true"/"false")
- Column naming: `is_` prefix for state flags — `is_public`, `is_anonymous`, `is_settled`, `is_recurring`
- Avoid double negatives — use `is_enabled` not `is_not_disabled`

### Communication Patterns

**Supabase Realtime Event Handling:**

```typescript
// Channel subscription pattern (consistent across all features)
const channel = supabase
  .channel(`trip:${tripId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'activities',
    filter: `trip_id=eq.${tripId}`,
  }, (payload) => {
    // Direct cache update — never refetch on realtime event
    queryClient.setQueryData(['activities', tripId], (old) => {
      if (payload.eventType === 'INSERT') return [...old, payload.new]
      if (payload.eventType === 'UPDATE') return old.map(item => item.id === payload.new.id ? payload.new : item)
      if (payload.eventType === 'DELETE') return old.filter(item => item.id !== payload.old.id)
      return old
    })
  })
  .subscribe()
```

**Activity Feed Event Naming:** `{entity}.{action}` format

- `activity.created`, `activity.updated`, `activity.deleted`
- `poll.created`, `poll.closed`, `poll.vetoed`
- `vote.cast`, `vote.changed`
- `member.joined`, `member.left`, `member.promoted`
- `budget.submitted` (never `budget.amount_changed` — no amounts in feed)
- `expense.created`, `expense.settled`
- `task.assigned`, `task.completed`

**Zustand Store Pattern:**

```typescript
// Every Zustand store follows this shape
interface SidebarStore {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
```

- State and actions in the same store (no separate action creators)
- Use `immer` middleware only if state shape is deeply nested (avoid by default)
- Selectors via individual property access: `useSidebarStore((s) => s.isOpen)` — never select entire store

**React Query Mutation Pattern (all mutations follow this):**

```typescript
export function useCreateActivity(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ActivityFormInput) => {
      const { data, error } = await supabase.from('activities').insert(input).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (newActivity) => {
      await queryClient.cancelQueries({ queryKey: ['activities', tripId] })
      const previous = queryClient.getQueryData(['activities', tripId])
      queryClient.setQueryData(['activities', tripId], (old: Activity[]) => [...old, { ...newActivity, id: crypto.randomUUID() }])
      return { previous }
    },
    onError: (_err, _new, context) => {
      queryClient.setQueryData(['activities', tripId], context?.previous)
      toast.error('Failed to create activity')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', tripId] })
    },
    onSuccess: () => {
      toast.success('Activity created')
    },
  })
}
```

### Process Patterns

**Error Handling Hierarchy:**

1. **Edge Function errors** → Return structured `{ error: { code, message } }` with appropriate HTTP status
2. **Supabase client errors** → Check `error` from destructured response, throw to mutation error handler
3. **React Query mutations** → `onError` callback rolls back optimistic update, shows error toast
4. **React Query queries** → `error` state renders inline error UI with retry button
5. **React Error Boundaries** → Per route segment, catches unhandled rendering errors, shows fallback UI
6. **Global error handler** → Sentry captures all unhandled exceptions

**Loading State Pattern:**

- **Initial load**: Skeleton loaders matching content shape (never spinners for primary content)
- **Mutations**: Button disabled with loading indicator while `isPending`
- **Navigation**: `next/navigation` loading.tsx per route segment
- **Real-time reconnect**: Subtle banner "Reconnecting..." (not blocking)
- Use React Query's `isPending` (initial load) and `isFetching` (background refresh) — never custom loading state

**Form Submission Pattern:**

```typescript
// Every form follows this structure
const form = useForm<TripFormValues>({
  resolver: zodResolver(tripFormSchema),
  defaultValues: { name: '', destination: '', start_date: '', end_date: '' },
})

const mutation = useCreateTrip()

const onSubmit = form.handleSubmit((values) => {
  mutation.mutate(values)
})

// In JSX:
// <Button type="submit" disabled={mutation.isPending}>
//   {mutation.isPending ? 'Creating...' : 'Create Trip'}
// </Button>
```

- Always use `zodResolver` — no manual validation
- Always disable submit button during mutation
- Always show pending state on button text
- Never use `onClick` for form submission — always `type="submit"` with `form.handleSubmit`

**Authentication Guard Pattern:**

```typescript
// Middleware handles auth redirect — components don't need auth checks
// But for role-based UI, use the permission hook:
const { role, can } = useTripPermissions(tripId)

// Conditionally render UI based on permissions
{can('manage_activities') && <Button>Edit Activity</Button>}
{can('delete_trip') && <DangerZone />}

// Never check role strings directly — always use can() helper
// ❌ if (role === 'owner' || role === 'organizer')
// ✅ if (can('manage_activities'))
```

**Pagination Pattern:**

- Cursor-based for infinite scroll (activity feed): `useInfiniteQuery` with Supabase `.range()`
- Offset-based for pages (expense list): Standard `useQuery` with page param
- Default page size: 20 items for lists, 50 for feed entries
- Always show total count where relevant

### Enforcement Guidelines

**All AI Agents MUST:**

1. Run `pnpm lint` and `pnpm typecheck` before considering any task complete
2. Co-locate tests with source files (not in a separate `__tests__` directory)
3. Use the React Query mutation pattern above for ALL data mutations (no bare `supabase.from().insert()` calls in components)
4. Use Zod schemas for ALL form validation (no manual `if/else` validation)
5. Use `snake_case` for all database interactions (no camelCase transformation layer)
6. Use the destructured `{ data, error }` pattern for all Supabase calls (never `.then()/.catch()`)
7. Use `isPending` (never `isLoading`) for React Query loading states
8. Use `useWatch()` (never `watch()`) for React Hook Form field observation
9. Add skeleton loaders for every new list/detail view
10. Add toast notifications for every mutation (success and error)

**Anti-Patterns (NEVER do these):**

| Anti-Pattern | Correct Pattern |
| --- | --- |
| `useState` for server data | `useQuery` from React Query |
| `useEffect` to fetch data | `useQuery` with Supabase client |
| `fetch('/api/...')` for data | `supabase.from('table').select()` |
| Manual loading boolean | `isPending` / `isFetching` from React Query |
| `try/catch` around Supabase calls | Destructure `{ data, error }` |
| Global CSS classes | Tailwind utilities or CSS Modules |
| `any` type | Supabase generated types or explicit interface |
| `console.log` for errors | `Sentry.captureException()` or toast |
| Direct DOM manipulation | React refs or state |
| `localStorage` for auth tokens | Cookie-based via `@supabase/ssr` |

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
tripOS/
├── .github/
│   └── workflows/
│       └── ci.yml                          # GitHub Actions: lint → typecheck → test → e2e → deploy
├── .env.local.example                      # Template for local environment variables
├── .eslintrc.cjs                           # ESLint config (Next.js + TypeScript rules)
├── .gitignore
├── components.json                         # shadcn/ui configuration
├── next.config.ts                          # Next.js 16 configuration
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts                    # Playwright E2E test configuration
├── postcss.config.mjs                      # PostCSS for Tailwind
├── tailwind.config.ts                      # Tailwind CSS configuration + design tokens
├── tsconfig.json                           # TypeScript strict mode configuration
├── vitest.config.ts                        # Vitest unit test configuration
│
├── public/
│   ├── favicon.ico
│   ├── manifest.json                       # PWA manifest
│   └── sw.js                               # Service worker for PWA/offline
│
├── supabase/
│   ├── config.toml                         # Supabase local dev configuration
│   ├── seed.sql                            # Development seed data
│   ├── migrations/
│   │   ├── 00001_create_profiles.sql
│   │   ├── 00002_create_trips.sql
│   │   ├── 00003_create_trip_members.sql
│   │   ├── 00004_create_activities.sql
│   │   ├── 00005_create_activity_attendees.sql
│   │   ├── 00006_create_activity_versions.sql
│   │   ├── 00007_create_activity_drafts.sql
│   │   ├── 00008_create_polls.sql
│   │   ├── 00009_create_poll_options.sql
│   │   ├── 00010_create_votes.sql
│   │   ├── 00011_create_blind_budgets.sql
│   │   ├── 00012_create_expenses.sql
│   │   ├── 00013_create_expense_splits.sql
│   │   ├── 00014_create_tasks.sql
│   │   ├── 00015_create_checklist_templates.sql
│   │   ├── 00016_create_activity_feed.sql
│   │   ├── 00017_create_notifications.sql
│   │   ├── 00018_create_invite_links.sql
│   │   ├── 00019_create_indexes.sql
│   │   ├── 00020_create_rls_policies.sql
│   │   └── 00021_create_helper_functions.sql
│   └── functions/                          # Supabase Edge Functions (Deno/TypeScript)
│       ├── calculate-group-budget/
│       │   └── index.ts
│       ├── close-poll/
│       │   └── index.ts
│       ├── settle-expenses/
│       │   └── index.ts
│       ├── convert-currency/
│       │   └── index.ts
│       ├── send-notification/
│       │   └── index.ts
│       ├── batch-notifications/
│       │   └── index.ts
│       ├── generate-pdf/
│       │   └── index.ts
│       ├── generate-ics/
│       │   └── index.ts
│       ├── generate-csv/
│       │   └── index.ts
│       ├── transfer-ownership/
│       │   └── index.ts
│       ├── handle-member-leave/
│       │   └── index.ts
│       ├── purge-expired-budgets/
│       │   └── index.ts
│       ├── schedule-poll-close/
│       │   └── index.ts
│       └── _shared/                        # Shared utilities across Edge Functions
│           ├── cors.ts
│           ├── auth.ts                     # Verify JWT, extract user
│           └── response.ts                 # Standardized response helpers
│
├── messages/                               # i18n translation files (next-intl)
│   └── en.json
│
├── e2e/                                    # Playwright E2E tests (separate from unit tests)
│   ├── fixtures/
│   │   ├── auth.fixture.ts                 # Authenticated browser context
│   │   └── test-data.ts                    # Shared test data generators
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   ├── trip-creation.spec.ts
│   ├── itinerary.spec.ts
│   ├── voting.spec.ts
│   ├── blind-budgeting.spec.ts
│   ├── expenses.spec.ts
│   ├── tasks.spec.ts
│   ├── members.spec.ts
│   ├── notifications.spec.ts
│   └── export.spec.ts
│
└── src/
    ├── app/
    │   ├── globals.css                     # Tailwind directives + CSS variable tokens
    │   ├── layout.tsx                      # Root layout (ThemeProvider, metadata)
    │   │
    │   ├── (marketing)/                    # Public marketing pages (SSR, no sidebar)
    │   │   ├── layout.tsx                  # Marketing layout (top nav, full-width)
    │   │   ├── page.tsx                    # Landing page (/)
    │   │   ├── features/
    │   │   │   └── page.tsx                # Features page (/features)
    │   │   └── pricing/
    │   │       └── page.tsx                # Pricing page (/pricing)
    │   │
    │   ├── (auth)/                         # Authentication flows (centered card layout)
    │   │   ├── layout.tsx                  # Auth layout (centered, minimal chrome)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── signup/
    │   │   │   └── page.tsx
    │   │   ├── reset-password/
    │   │   │   └── page.tsx
    │   │   ├── magic-link/
    │   │   │   └── page.tsx
    │   │   ├── verify-email/
    │   │   │   └── page.tsx
    │   │   └── auth/
    │   │       └── callback/
    │   │           └── route.ts            # OAuth callback handler
    │   │
    │   ├── (app)/                          # Authenticated application
    │   │   ├── layout.tsx                  # App layout (sidebar, notification bell, breadcrumbs)
    │   │   ├── loading.tsx                 # App-level loading skeleton
    │   │   ├── error.tsx                   # App-level error boundary
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                # Trip list dashboard
    │   │   ├── settings/
    │   │   │   └── page.tsx                # User settings (profile, preferences, notifications)
    │   │   └── trip/
    │   │       └── [tripId]/
    │   │           ├── layout.tsx          # Trip layout (tab navigation, real-time subscriptions)
    │   │           ├── loading.tsx         # Trip-level loading skeleton
    │   │           ├── error.tsx           # Trip-level error boundary
    │   │           ├── overview/
    │   │           │   └── page.tsx
    │   │           ├── itinerary/
    │   │           │   └── page.tsx
    │   │           ├── votes/
    │   │           │   └── page.tsx
    │   │           ├── budget/
    │   │           │   └── page.tsx
    │   │           ├── members/
    │   │           │   └── page.tsx
    │   │           ├── tasks/
    │   │           │   └── page.tsx
    │   │           └── settings/
    │   │               └── page.tsx        # Trip settings (owner/organizer only)
    │   │
    │   ├── (public)/                       # Public trip pages (SSR, no sidebar)
    │   │   ├── layout.tsx                  # Public layout (read-only, CTA to sign up)
    │   │   └── t/
    │   │       └── [slug]/
    │   │           └── page.tsx            # Public trip page (SSR for SEO)
    │   │
    │   ├── api/
    │   │   ├── webhooks/
    │   │   │   ├── auth/
    │   │   │   │   └── route.ts            # Supabase auth events (profile creation)
    │   │   │   └── scheduled/
    │   │   │       └── route.ts            # Cron: poll close, budget purge, reminders
    │   │   └── og/
    │   │       └── route.ts                # Open Graph image generation
    │   │
    │   └── not-found.tsx                   # 404 page
    │
    ├── components/
    │   ├── ui/                             # shadcn/ui base components
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   └── ...                         # Additional shadcn components as needed
    │   └── shared/                         # App-wide composed components
    │       ├── app-sidebar.tsx
    │       ├── app-header.tsx
    │       ├── notification-bell.tsx
    │       ├── theme-toggle.tsx
    │       ├── breadcrumbs.tsx
    │       ├── network-status-banner.tsx
    │       ├── confirm-dialog.tsx          # Reusable confirmation dialog
    │       ├── empty-state.tsx             # Reusable empty state with guidance
    │       └── error-fallback.tsx          # Error boundary fallback component
    │
    ├── features/
    │   ├── trips/
    │   │   ├── components/
    │   │   │   ├── trip-card.tsx
    │   │   │   ├── trip-form.tsx
    │   │   │   ├── trip-delete-dialog.tsx
    │   │   │   └── trip-stats.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-trips.ts            # useQuery for trip list
    │   │   │   ├── use-trip.ts             # useQuery for single trip
    │   │   │   ├── use-create-trip.ts      # useMutation
    │   │   │   ├── use-update-trip.ts
    │   │   │   └── use-delete-trip.ts
    │   │   ├── schemas/
    │   │   │   └── trip-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── activities/
    │   │   ├── components/
    │   │   │   ├── activity-card.tsx
    │   │   │   ├── activity-form.tsx
    │   │   │   ├── activity-timeline.tsx
    │   │   │   ├── activity-map.tsx         # Google Maps integration
    │   │   │   ├── activity-filters.tsx
    │   │   │   ├── activity-proposal-badge.tsx
    │   │   │   ├── booking-status-badge.tsx
    │   │   │   └── location-autocomplete.tsx # Google Places
    │   │   ├── hooks/
    │   │   │   ├── use-activities.ts
    │   │   │   ├── use-create-activity.ts
    │   │   │   ├── use-update-activity.ts
    │   │   │   ├── use-delete-activity.ts
    │   │   │   ├── use-reorder-activities.ts
    │   │   │   └── use-activity-draft.ts
    │   │   ├── schemas/
    │   │   │   └── activity-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── voting/
    │   │   ├── components/
    │   │   │   ├── poll-card.tsx
    │   │   │   ├── poll-create-form.tsx
    │   │   │   ├── poll-results.tsx
    │   │   │   ├── vote-yes-no.tsx
    │   │   │   ├── vote-single-choice.tsx
    │   │   │   ├── vote-ranked-choice.tsx   # Drag-to-rank interface
    │   │   │   ├── vote-approval.tsx
    │   │   │   ├── vote-veto.tsx
    │   │   │   ├── poll-deadline-countdown.tsx
    │   │   │   ├── quorum-indicator.tsx
    │   │   │   └── poll-history.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-polls.ts
    │   │   │   ├── use-create-poll.ts
    │   │   │   ├── use-cast-vote.ts
    │   │   │   └── use-poll-results.ts
    │   │   ├── schemas/
    │   │   │   └── poll-form.schema.ts
    │   │   ├── utils/
    │   │   │   └── ranked-choice.ts         # Client-side result preview logic
    │   │   └── index.ts
    │   │
    │   ├── budget/
    │   │   ├── components/
    │   │   │   ├── blind-budget-form.tsx
    │   │   │   ├── budget-status-card.tsx
    │   │   │   ├── group-limit-display.tsx
    │   │   │   ├── budget-onboarding-carousel.tsx
    │   │   │   ├── privacy-indicator.tsx     # Teal lock icon
    │   │   │   └── budget-vs-spent.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-blind-budget.ts
    │   │   │   ├── use-group-limit.ts
    │   │   │   └── use-submit-budget.ts
    │   │   ├── schemas/
    │   │   │   └── budget-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── expenses/
    │   │   ├── components/
    │   │   │   ├── expense-form.tsx
    │   │   │   ├── expense-list.tsx
    │   │   │   ├── expense-split-config.tsx
    │   │   │   ├── settlement-summary.tsx
    │   │   │   ├── category-breakdown-chart.tsx
    │   │   │   ├── receipt-upload.tsx
    │   │   │   └── currency-selector.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-expenses.ts
    │   │   │   ├── use-create-expense.ts
    │   │   │   ├── use-settlement.ts
    │   │   │   └── use-currency-conversion.ts
    │   │   ├── schemas/
    │   │   │   └── expense-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── tasks/
    │   │   ├── components/
    │   │   │   ├── task-card.tsx
    │   │   │   ├── task-form.tsx
    │   │   │   ├── task-board.tsx            # Kanban or list view
    │   │   │   ├── task-progress-bar.tsx
    │   │   │   └── checklist-template-picker.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-tasks.ts
    │   │   │   ├── use-create-task.ts
    │   │   │   ├── use-update-task.ts
    │   │   │   └── use-checklist-templates.ts
    │   │   ├── schemas/
    │   │   │   └── task-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── members/
    │   │   ├── components/
    │   │   │   ├── member-list.tsx
    │   │   │   ├── member-card.tsx
    │   │   │   ├── invite-form.tsx
    │   │   │   ├── invite-link-generator.tsx
    │   │   │   ├── role-badge.tsx
    │   │   │   └── presence-indicators.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-trip-members.ts
    │   │   │   ├── use-invite-member.ts
    │   │   │   ├── use-trip-permissions.ts   # Role-based permission helper
    │   │   │   └── use-presence.ts
    │   │   ├── schemas/
    │   │   │   └── invite-form.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── notifications/
    │   │   ├── components/
    │   │   │   ├── notification-center.tsx
    │   │   │   ├── notification-item.tsx
    │   │   │   └── notification-preferences.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-notifications.ts
    │   │   │   └── use-mark-read.ts
    │   │   └── index.ts
    │   │
    │   └── feed/
    │       ├── components/
    │       │   ├── activity-feed.tsx
    │       │   └── feed-item.tsx
    │       ├── hooks/
    │       │   └── use-activity-feed.ts      # useInfiniteQuery
    │       └── index.ts
    │
    ├── hooks/                               # Shared custom hooks
    │   ├── use-realtime-subscription.ts     # Generic Supabase Realtime hook
    │   ├── use-debounce.ts
    │   ├── use-media-query.ts               # Responsive breakpoint detection
    │   └── use-keyboard-shortcut.ts         # Cmd+K and other shortcuts
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts                    # Browser Supabase client
    │   │   ├── server.ts                    # Server component Supabase client
    │   │   └── middleware.ts                # Middleware Supabase client (token refresh)
    │   ├── providers/
    │   │   ├── query-provider.tsx           # React Query provider with devtools
    │   │   ├── theme-provider.tsx           # next-themes ThemeProvider wrapper
    │   │   └── intl-provider.tsx            # next-intl provider
    │   └── utils/
    │       ├── format-currency.ts
    │       ├── format-date.ts               # date-fns wrappers with timezone
    │       ├── cn.ts                        # clsx + tailwind-merge utility
    │       └── constants.ts                 # MAX_MEMBERS_PER_TRIP, etc.
    │
    ├── stores/                              # Zustand stores (UI state only)
    │   ├── sidebar-store.ts
    │   ├── filter-store.ts
    │   └── modal-store.ts
    │
    ├── types/
    │   ├── supabase.ts                      # Auto-generated: supabase gen types typescript
    │   └── app.ts                           # App-specific derived types
    │
    ├── styles/
    │   └── tokens.css                       # CSS variable design tokens (light + dark)
    │
    └── middleware.ts                         # Next.js middleware (auth refresh, route protection)
```

### Architectural Boundaries

**API Boundaries:**

- **Client → Supabase REST**: All standard CRUD via `@supabase/supabase-js` with RLS enforcement. Client never talks to PostgreSQL directly.
- **Client → Edge Functions**: Complex business logic (budget calculation, poll closing, settlement, exports). Invoked via `supabase.functions.invoke()`.
- **Client → Next.js API Routes**: Only for webhooks (Supabase auth events) and OG image generation. Not for data fetching.
- **Edge Functions → Database**: Edge Functions use `supabase.auth.getUser()` for auth, then query with `service_role` key for operations that bypass RLS (e.g., reading all blind budgets for aggregation).

**Component Boundaries:**

- `src/components/ui/` → Zero business logic. Pure presentation. Receives props, renders UI.
- `src/components/shared/` → App-wide layout components. May use Zustand stores for UI state.
- `src/features/{name}/components/` → Feature-specific. Uses feature's own hooks. May import from `shared/` and `ui/` but NEVER from another feature's components.
- `src/features/{name}/hooks/` → Encapsulates all Supabase queries and mutations for the feature. Components consume hooks, never call Supabase directly.

**Cross-Feature Communication:**

- Features communicate via React Query cache (shared query keys) and Supabase Realtime events — never by importing each other's internals.
- Exception: `use-trip-permissions` from `features/members/` is used by all features for role-based UI rendering.

**Data Boundaries:**

- **Read path**: Component → Feature hook (useQuery) → Supabase client → RLS → PostgreSQL
- **Write path**: Component → Feature hook (useMutation) → Supabase client → RLS → PostgreSQL → Realtime event → Other clients' React Query cache update
- **Sensitive write path** (blind budgets): Component → Feature hook → Edge Function → Service role client (bypasses RLS for aggregation only) → PostgreSQL

### Requirements to Structure Mapping

| Feature Domain | Route | Feature Module | Edge Functions | Key Tables |
| --- | --- | --- | --- | --- |
| Dashboard | `(app)/dashboard` | `features/trips` | — | trips, trip_members |
| Trip Management | `(app)/trip/[tripId]/overview` | `features/trips` | transfer-ownership | trips |
| Itinerary | `(app)/trip/[tripId]/itinerary` | `features/activities` | — | activities, activity_attendees, activity_versions, activity_drafts |
| Voting | `(app)/trip/[tripId]/votes` | `features/voting` | close-poll, schedule-poll-close | polls, poll_options, votes |
| Budget | `(app)/trip/[tripId]/budget` | `features/budget`, `features/expenses` | calculate-group-budget, settle-expenses, convert-currency, purge-expired-budgets | blind_budgets, expenses, expense_splits |
| Members | `(app)/trip/[tripId]/members` | `features/members` | handle-member-leave | trip_members, invite_links |
| Tasks | `(app)/trip/[tripId]/tasks` | `features/tasks` | — | tasks, checklist_templates |
| Notifications | Shared (bell icon) | `features/notifications` | send-notification, batch-notifications | notifications |
| Activity Feed | `(app)/trip/[tripId]/overview` | `features/feed` | — | activity_feed |
| Auth | `(auth)/*` | (starter-provided) | — | profiles (via Supabase Auth) |
| Marketing | `(marketing)/*` | (standalone pages) | — | — |
| Public Trips | `(public)/t/[slug]` | `features/trips` | — | trips (is_public=true) |
| Exports | Actions within budget/itinerary | — | generate-pdf, generate-ics, generate-csv | — |

### Integration Points

**External Service Integration:**

| Service | Integration Point | Fallback |
| --- | --- | --- |
| Google Maps | `features/activities/components/activity-map.tsx`, `location-autocomplete.tsx` | Text-only location display |
| ExchangeRate-API | `supabase/functions/convert-currency/` | Frankfurter API → manual entry |
| Resend | `supabase/functions/send-notification/` | In-app notification only (email silently fails) |
| Sentry | `src/lib/providers/` (initialized in root layout) | Console logging |
| PostHog | `src/lib/providers/` (initialized in root layout) | No analytics (graceful skip) |

**Data Flow Through Architecture:**

1. **User action** → React component calls mutation hook
2. **Optimistic update** → React Query cache updated immediately
3. **Supabase call** → Client SDK sends request with auth cookie
4. **RLS check** → PostgreSQL enforces row-level security
5. **Database write** → Data persisted, triggers Realtime event
6. **Realtime broadcast** → All subscribed clients receive event
7. **Cache update** → Other clients' React Query caches updated via subscription handler
8. **UI render** → React re-renders with new data (no refetch needed)

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility: PASS**

All technology choices verified compatible:

- Next.js 16.1.6 + React 19 + Turbopack ✅
- Supabase JS 2.95.3 + SSR 0.8.0 + Next.js 16 cookie-based auth ✅
- React Query 5.90.20 + React 19 (`isPending` pattern) ✅
- Zustand 5.0.11 + React 19 (hook naming conventions) ✅
- Zod 3.23.8 + Turbopack ✅ (Zod 4 incompatible — correctly avoided)
- React Hook Form 7.71.1 + React 19 (`useWatch()` pattern) ✅
- Tailwind CSS + shadcn/ui + CSS Variables ✅
- date-fns 4.1.0 + next-intl 4.8.2 + nuqs 2.8.8 ✅

**One version caveat documented:** Zod must stay on 3.x until Zod 4 Turbopack issue is resolved.

**Pattern Consistency: PASS**

- Naming: `snake_case` database → `snake_case` JSON → TypeScript (no transformation layer). Consistent.
- Components: `PascalCase` components in `kebab-case.tsx` files. Consistent with React/Next.js conventions.
- Hooks: `camelCase` with `use` prefix. Consistent with React conventions.
- Mutations: Every mutation follows the same React Query `onMutate/onError/onSettled` pattern. Consistent.
- Forms: Every form uses Zod + React Hook Form + `zodResolver`. Consistent.

**Structure Alignment: PASS**

- Feature-based organization maps cleanly to the 9 feature domains
- Route groups align with the 4 layout types (marketing, auth, app, public)
- Co-located tests support the test framework choices (Vitest unit, Playwright E2E)
- Supabase directory structure supports migrations + Edge Functions + seed data

### Requirements Coverage Validation

**Functional Requirements Coverage: 72/72 FRs COVERED**

| FR Range | Domain | Architectural Support |
| --- | --- | --- |
| FR1-FR15 | Collaboration | `features/trips` + `features/members` + RLS + Realtime |
| FR16-FR30 | Itinerary | `features/activities` + Google Maps + drag-and-drop + auto-save |
| FR31-FR42 | Voting | `features/voting` + Edge Functions (close-poll, schedule-poll-close) |
| FR43-FR56 | Expenses | `features/expenses` + Edge Functions (settle-expenses, convert-currency) |
| FR57-FR65 | Blind Budgeting | `features/budget` + RLS isolation + Edge Function (calculate-group-budget) + timing delay |
| FR66-FR72 | Tasks | `features/tasks` + checklist templates |

**Non-Functional Requirements Coverage: ALL ADDRESSED**

| NFR Category | Architectural Support |
| --- | --- |
| Performance | React Query caching, Turbopack, route-based code splitting, skeleton loaders, dynamic imports for Maps/Charts |
| Security (16 NFRs) | RLS policies, cookie-based auth, CSRF (Next.js Server Actions), XSS (React JSX escaping + DOMPurify), rate limiting (Edge Functions + Vercel middleware) |
| Scalability | Supabase managed PostgreSQL scaling, Vercel edge CDN, connection pooling via Supabase |
| Reliability | Error boundaries per route, React Query retry (3x exponential), API fallbacks (currency, maps), optimistic UI with rollback |
| Accessibility | shadcn/ui (Radix primitives = ARIA compliant), 44px touch targets, keyboard navigation, focus management |
| Real-time | Supabase Realtime channels per trip, presence indicators, direct cache updates (no refetch) |

### Implementation Readiness Validation

**Decision Completeness: PASS**

- 11 core libraries with pinned versions ✅
- Code examples for every major pattern (mutations, forms, subscriptions, stores, permissions) ✅
- Anti-patterns table documenting what NOT to do ✅
- Import order convention specified ✅

**Structure Completeness: PASS**

- 150+ files/directories explicitly mapped ✅
- Every feature domain has components, hooks, schemas, index ✅
- All 13 Edge Functions have directories ✅
- All 21 migration files named ✅
- E2E test files per feature domain ✅

**Pattern Completeness: PASS**

- Naming patterns cover database, API, code, routes ✅
- Communication patterns cover Realtime events, Zustand stores, React Query mutations ✅
- Process patterns cover error handling, loading states, form submission, auth guards, pagination ✅

### Gap Analysis Results

**No Critical Gaps Found.**

**Important Gaps (addressable during implementation):**

1. **Accessibility testing tooling**: Architecture mentions WCAG 2.1 AA but doesn't specify automated testing. Recommendation: Add `@axe-core/playwright` to E2E tests for automated accessibility checks.
2. **PWA service worker details**: PWA mentioned as a feature but service worker caching strategy not deeply specified. Recommendation: Use `next-pwa` or Workbox with cache-first for static assets, network-first for API calls.
3. **Database function testing**: Edge Functions have test patterns but database functions (`get_user_role`, `create_trip_with_owner`, etc.) don't have a specified testing approach. Recommendation: Use `pgTAP` or Supabase test helpers.

**Nice-to-Have Gaps (post-MVP):**

4. Storybook for component documentation (not needed for AI agent consistency)
5. OpenAPI documentation for Edge Functions (Supabase auto-generates REST docs)
6. Performance budgets (Lighthouse CI in GitHub Actions)

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed (72 FRs, 16 security NFRs, 4 user journeys)
- [x] Scale and complexity assessed (High — privacy computation, 5 voting algorithms, real-time)
- [x] Technical constraints identified (Supabase-only backend, Turbopack bundler, Zod 3.x)
- [x] Cross-cutting concerns mapped (10 concerns: real-time, RBAC, optimistic UI, forms, timezones, rate limiting, skeletons, errors, audit, cascades)

**Architectural Decisions**

- [x] Critical decisions documented with verified versions (11 libraries pinned)
- [x] Technology stack fully specified (frontend, backend, state, styling, testing, CI/CD)
- [x] Integration patterns defined (Supabase REST, Edge Functions, Realtime, webhooks)
- [x] Performance considerations addressed (caching strategy, code splitting, skeleton loaders)

**Implementation Patterns**

- [x] Naming conventions established (database, API, code, routes — all specified with examples)
- [x] Structure patterns defined (feature-based modules, co-located tests, barrel exports)
- [x] Communication patterns specified (Realtime subscriptions, React Query cache, Zustand stores)
- [x] Process patterns documented (error hierarchy, loading states, forms, auth guards, pagination)

**Project Structure**

- [x] Complete directory structure defined (150+ files/directories)
- [x] Component boundaries established (ui → shared → features, no cross-feature imports)
- [x] Integration points mapped (5 external services with fallbacks)
- [x] Requirements to structure mapping complete (13 feature domains → routes + modules + functions + tables)

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence Level: High**

All 72 functional requirements are architecturally supported. All technology versions are verified compatible. Implementation patterns are comprehensive with code examples. Project structure is specific (not generic). Anti-patterns are documented.

**Key Strengths:**

1. **Privacy-by-design**: Blind budgeting security is architecturally enforced at database level (RLS), not application code. Timing attacks mitigated server-side.
2. **Real-time-first**: Supabase Realtime with direct cache updates (not refetch) provides instant collaboration without polling overhead.
3. **Consistency enforcement**: Anti-patterns table + mandatory patterns + co-located tests ensure AI agents produce compatible code.
4. **Graceful degradation**: Every external service has a documented fallback (maps → text, currency → fallback API → manual, email → in-app only).
5. **Type safety end-to-end**: Supabase generated types → Zod schemas → React Hook Form → UI. Single source of truth.

**Areas for Future Enhancement:**

1. Map provider abstraction (post-MVP hybrid plan exists in maps-hybrid-optimization-plan.md)
2. Advanced CDN caching with ISR for marketing pages
3. Horizontal scaling optimizations (connection pooling tuning, read replicas)
4. Component library documentation (Storybook)
5. Performance monitoring dashboards (Sentry + Vercel Analytics)

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented in this file
- Use implementation patterns consistently across all components
- Respect project structure and boundaries (no cross-feature component imports)
- Refer to this document for all architectural questions
- Use pinned library versions from the Verified Library Versions table
- Follow the anti-patterns table — violations indicate incorrect implementation

**First Implementation Priority:**

```bash
# 1. Initialize project from official starter
npx create-next-app@latest --example with-supabase tripOS
cd tripOS

# 2. Add remaining dependencies
pnpm add @tanstack/react-query zustand zod react-hook-form @hookform/resolvers date-fns next-themes nuqs next-intl

# 3. Add dev dependencies
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @playwright/test

# 4. Initialize Playwright
npx playwright install

# 5. Set up Supabase local dev
supabase init
supabase start

# 6. Create database schema (run migrations)
supabase db reset
```

**Implementation sequence follows the Decision Impact Analysis from Step 4 — starting with infrastructure, then auth, then core features, building outward.**
