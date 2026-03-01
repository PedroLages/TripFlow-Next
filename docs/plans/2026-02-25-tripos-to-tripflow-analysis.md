# TripOS → TripFlow Feature Porting Analysis

**Date:** 2026-02-25
**Purpose:** Permanent reference for porting TripOS differentiator features into TripFlow

---

## What is TripOS?

TripOS is a **production-grade collaborative trip planning platform** built as a Turborepo monorepo.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19 Server Components) |
| Database | Supabase (PostgreSQL 15 + Auth + RLS + Realtime + Edge Functions + Storage) |
| Monorepo | Turborepo + pnpm 9.15.0 |
| Styling | Tailwind CSS v4 + shadcn/ui (New York style) + CSS Variables |
| Server State | React Query v5 (TanStack Query) |
| Client State | Zustand |
| Forms | React Hook Form + Zod 3.x |
| Icons | Lucide |
| E2E Tests | Playwright |
| Unit Tests | Vitest |
| CI/CD | GitHub Actions (Node 22) |
| Edge Functions | Deno (TypeScript) |

### Architecture
- **Feature module pattern**: `features/{name}/actions|components|hooks|lib`
- **Server Components by default**, `'use client'` only when needed
- **4-tier RBAC**: Owner > Organizer > Member > Guest (enforced at DB via RLS)
- **Semantic color exclusivity**: teal=privacy/budget, purple=voting, indigo=primary, amber=CTAs
- **29 SQL migrations**, 18 database tables
- **13 epics** (98 stories) across full feature scope

### Key Features (Implemented/Planned)
1. Identity & Access (email/password, OAuth, magic links, GDPR deletion)
2. Trip Management (create, edit, archive, delete, sharing)
3. Team Building (4-tier RBAC, invite links)
4. Collaborative Itinerary (day-by-day timeline, Google Maps)
5. Democratic Voting (4 methods: yes/no, single choice, ranked, approval + veto)
6. Blind Budgeting (private caps, server-side aggregation, RLS-enforced)
7. Shared Expenses & Settlement (multi-currency, 4 split methods)
8. Live Collaboration (real-time sync, activity feed, presence)
9. Notifications & Tasks (in-app, email via Resend)
10. Personalization (dark mode, themes, preferences)
11. Export & Offline (PDF, calendar, CSV, PWA)

### Database Tables (29 migrations)
`profiles`, `trips`, `trip_members`, `activities`, `activity_attendees`, `activity_versions`, `activity_drafts`, `polls`, `poll_options`, `votes`, `blind_budgets`, `expenses`, `expense_splits`, `tasks`, `checklist_templates`, `activity_feed`, `notifications`, `invite_links`, `auth_events`, `avatars_storage`

---

## What is TripFlow?

TripFlow is a **React/Vite SPA prototype** with polished UI and mock data, serving as a frontend showcase for the travel planning concept.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 19.2 + Vite 7.3 (SPA, no SSR) |
| Database Client | @supabase/supabase-js 2.97 (installed, not configured) |
| Styling | Custom CSS (glass morphism) + Tailwind CSS v4 (just added) |
| Animations | Framer Motion 12.34 |
| Icons | Lucide React 0.575 |
| Fonts | Fontsource (Inter + Playfair Display) |
| Globe | cobe 0.6 |
| Linting | ESLint 9 + TypeScript-ESLint |
| Build | TypeScript 5.9 strict mode |

### Current Components (12+ modules, all mock data)
- Dashboard, AIGenerator, Itinerary, Budget, Voting, Bookings
- ExpenseSplitter, Collaboration, Notifications, Settings
- Shared: Button, Card, Sidebar, TopBar, Globe

### What TripFlow Has vs Doesn't Have

| Has | Doesn't Have |
|-----|-------------|
| Polished UI prototypes | Backend/database connection |
| Glass morphism design system | Authentication |
| Framer Motion animations | Real data persistence |
| 12+ feature module UIs | Business logic |
| Tailwind v4 (just added) | shadcn/ui components |
| Supabase JS client (installed) | Database schema/migrations |
| Custom CSS variables | Testing framework |
| Component-per-feature structure | React Query / state management |

---

## Feature Comparison: What to Port

### Priority 1: Differentiator Features (Unique Value Props)

| Feature | TripOS Status | TripFlow Status | Porting Strategy |
|---------|--------------|-----------------|-----------------|
| **Blind Budgeting** | Full spec + DB + Edge Functions + RLS | Budget.tsx has mock blind mode toggle | Simplify for mock auth: client-side MIN, no RLS, no Edge Functions yet |
| **Democratic Voting** | Full spec + 4 methods + ranked choice algo | Voting.tsx has multi-method UI | Connect UI to Supabase, add tabulation algorithms |
| **Expense Splitting** | Full spec + 4 split methods + settlement | ExpenseSplitter.tsx has basic UI | Connect UI, add settlement optimizer, currency API |

### Priority 2: Foundation (Required for above)

| Feature | TripOS Status | TripFlow Status | Porting Strategy |
|---------|--------------|-----------------|-----------------|
| **Auth** | Full Supabase Auth (email, OAuth, magic links) | None | Mock auth context first (4 hardcoded users with switcher) |
| **Database Schema** | 29 migrations, 18 tables | None | Adapt core tables (profiles, trips, trip_members + feature tables) |
| **RBAC** | 4-tier via RLS policies | None | Defer to real auth phase |

### Priority 3: Enhancement Features (Later)

| Feature | TripOS Status | TripFlow Status |
|---------|--------------|-----------------|
| Real-time collaboration | Supabase Realtime | Not started |
| Activity/itinerary management | Full CRUD + versions | Itinerary.tsx mock UI |
| Notifications | In-app + email (Resend) | Notifications.tsx mock UI |
| Dark mode | next-themes | CSS custom properties ready |
| Export (PDF/CSV) | Planned | Not started |

---

## Porting Strategy

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project stays React/Vite | No Next.js migration | Keep polished UI, avoid SSR complexity |
| Backend = Supabase | Same as TripOS | Reuse schema designs, future RLS portability |
| Mock auth first | 4 hardcoded users + switcher | Fastest path to demo features |
| Hybrid styling | Tailwind v4 + shadcn/ui alongside existing CSS | Zero migration cost for existing components |
| Client-side calculations | During mock auth phase | No Edge Functions needed yet; swap when real auth added |
| Feature priority | Blind Budgeting → Voting → Expenses | Lead with unique value, ascending difficulty |

### Architecture Pattern (Per Feature)
```
1. Adapt TripOS database schema (simplify for mock auth)
2. Create TypeScript types
3. Write business logic as pure functions (TDD)
4. Build React Query hooks for Supabase data
5. Build/adapt UI components (Tailwind + shadcn for new, keep existing CSS)
6. Integrate into existing page component
```

### What Gets Simplified vs Deferred

| TripOS Has | TripFlow Simplification |
|-----------|------------------------|
| RLS policies on all tables | Disabled (mock auth can't enforce) |
| Edge Functions for server-side calc | Client-side calculation |
| Audit log with hash-only amounts | Omitted |
| Rate limiting (1 change/60s) | Omitted |
| Timing attack mitigation (random delays) | Omitted |
| Small group inference protection | Omitted |
| Real Supabase Auth | Mock auth context |
| 4-tier RBAC enforcement | All users treated as "member" |

---

## Implementation Roadmap

### Phase 1: Infrastructure ✅ (Partial)
- [x] Task 1: Install Tailwind CSS v4
- [x] Task 2: Map CSS variables to Tailwind theme tokens
- [ ] Task 3: Add `@/` path aliases
- [ ] Task 4: Install & initialize shadcn/ui
- [ ] Task 5: Install Vitest + React Testing Library
- [ ] Task 6: Set up Supabase client

### Phase 2: Foundation
- [ ] Task 7: Create database schema (profiles, trips, trip_members, blind_budgets)
- [ ] Task 8: TypeScript database types
- [ ] Task 9: Mock auth context (4 users + switcher)

### Phase 3: Blind Budgeting
- [ ] Task 10: Business logic — TDD (calculateGroupLimit, formatBudgetAmount, etc.)
- [ ] Task 11: useBlindBudget hook (React Query + Supabase)
- [ ] Task 12: PrivacyIndicator component
- [ ] Task 13: BudgetExplainerCarousel (3-step onboarding)
- [ ] Task 14: BlindBudgetForm (private budget input)
- [ ] Task 15: GroupLimitDisplay (group limit + progress bar)
- [ ] Task 16: MockUserSwitcher (dev toolbar)
- [ ] Task 17: Integrate into Budget.tsx
- [ ] Task 18: End-to-end verification

### Future: Democratic Voting
- Adapt TripOS Epic 5 + voting-system-deep-dive.md
- Connect existing Voting.tsx to Supabase
- Implement ranked choice tabulation algorithm

### Future: Expense Splitting
- Adapt TripOS Epic 7
- Connect ExpenseSplitter.tsx to Supabase
- Add settlement optimization + multi-currency via ExchangeRate-API

---

## Reference Documents

| Document | Location |
|----------|----------|
| TripFlow overview | `tripflow-web/docs/TRIPFLOW-OVERVIEW.md` |
| Integration design | `tripflow-web/docs/plans/2026-02-24-tripos-feature-integration-design.md` |
| Blind budgeting plan | `tripflow-web/docs/plans/2026-02-24-blind-budgeting-implementation.md` |
| TripOS blind budgeting spec | `/Volumes/SSD/Dev/Apps/TripOS/docs/strategy/blind-budgeting-deep-dive.md` |
| TripOS voting spec | `/Volumes/SSD/Dev/Apps/TripOS/docs/strategy/voting-system-deep-dive.md` |
| TripOS UX spec | `/Volumes/SSD/Dev/Apps/TripOS/docs/design/ux-spec.md` |
| TripOS epics | `/Volumes/SSD/Dev/Apps/TripOS/docs/epics.md` |
| TripOS description | `/Volumes/SSD/Dev/Apps/TripOS/TRIPOS_DESCRIPTION.md` |

---

*Last updated: 2026-02-25*
