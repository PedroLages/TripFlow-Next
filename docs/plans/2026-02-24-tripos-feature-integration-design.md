# TripOS Feature Integration Design

**Date:** 2026-02-24
**Status:** Approved
**Scope:** Incorporating TripOS differentiator features into tripflow-web

---

## Context

tripflow-web is a React/Vite frontend prototype with 12+ feature modules (Dashboard, AI Generator, Itinerary, Budget, Voting, Bookings, Expenses, Collaboration, Notifications, Settings), all using mock data, Framer Motion animations, and custom CSS with glass morphism styling.

TripOS is a production-grade Next.js 16 + Supabase monorepo with 13 epics (98 stories), deep architectural docs, UX specs, and thorough planning for collaborative trip features.

This design captures how tripflow-web adopts TripOS's feature specs while remaining its own project.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project relationship | tripflow-web stays its own React/Vite app | Keep existing polished UI, avoid Next.js migration |
| Backend | Supabase (same stack as TripOS) | Reuse TripOS's schema designs, RLS policies, Edge Functions |
| Feature priority | Differentiators first: Budgeting, Voting, Expenses | Lead with unique value props, ascending difficulty |
| Auth approach | Mock auth first, real auth later | Fastest path to prototyping features |
| Methodology | Adapt TripOS docs directly | TripOS's planning (epics, stories, deep dives) is thorough enough to port |
| Styling | Hybrid: Tailwind v4 + shadcn/ui alongside existing CSS | Zero migration cost, immediate access to shadcn/ui for new components |
| Mobile future | Keep data layer framework-agnostic | Not committed to React Native / Flutter / PWA yet |

---

## Architecture

### Project Structure Additions

```
tripflow-web/
  src/
    components/          # Existing UI (untouched, custom CSS)
    components/ui/       # Gains shadcn/ui components
    lib/
      supabase.ts        # Enhanced with generated types
      mock-auth.ts       # Fake user session with user switcher
    hooks/               # React Query hooks for Supabase data
    types/               # TypeScript types from Supabase schema
  supabase/
    migrations/          # SQL migrations adapted from TripOS
    config.toml          # Local Supabase config
```

### Mock Auth System

A React context provider with hardcoded users and a switcher to simulate multiple perspectives. Interface matches Supabase Auth shape for easy swap later.

```typescript
// Shape of the mock auth (not final implementation)
useMockAuth() -> {
  user: { id: string, name: string, avatar: string }
  switchUser: (userId: string) => void
  availableUsers: User[]
}
```

3-4 mock users to test multi-user features (blind budgeting from different perspectives, voting as different people).

### Supabase Setup

Local Supabase via Docker. Migrations adapted from TripOS's schema. Uses `service_role` key initially since mock auth cannot enforce RLS.

### Styling Integration

- Install `tailwindcss` + `@tailwindcss/vite` plugin + `shadcn-ui`
- Map existing CSS variables into Tailwind's `@theme` directive
- Both systems share the same design tokens (colors, spacing, radii)
- Existing components stay with custom CSS
- New components built with Tailwind + shadcn/ui
- Framer Motion continues for animations (compatible with Tailwind)

### Data Layer Design

Business logic in pure functions, Supabase calls in clean hooks. This keeps the data layer liftable for a future mobile app regardless of framework choice.

---

## Feature 1: Blind Budgeting

**Source:** TripOS Epic 6 + `docs/strategy/blind-budgeting-deep-dive.md`

### Core Concept

Each trip member sets a private budget cap. Nobody sees anyone else's number. The system calculates `MIN(all caps)` as the "Group Affordable Limit" for shared planning.

### Database Schema (Simplified for Mock Auth)

```sql
-- Foundation tables
profiles (id UUID PK, display_name TEXT, avatar_url TEXT)
trips (id UUID PK, name TEXT, destination TEXT, start_date DATE, end_date DATE, currency_code CHAR(3))
trip_members (trip_id UUID, user_id UUID, role TEXT, UNIQUE(trip_id, user_id))

-- Blind budgeting
blind_budgets (
  id UUID PK DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
)
```

### Deferred to Real Auth Phase

- RLS policies (all `auth.uid() = user_id` checks)
- Audit log table with hash-only amounts
- Rate limiting (1 change per 60 seconds)
- Edge Functions (group limit calculated client-side for now)
- Timing attack mitigation (random 5-15s delay)
- Small group inference protection

### Business Rules

- `MIN(all budgets)` = Group Affordable Limit
- $0 is valid (free trip), max $100,000
- Amounts stored in cents (no floating point)
- Single currency per trip
- Users can update their own budget anytime
- "Budget Too Low" indicator shown privately to user whose budget sets the group min

### UI Flow

| State | Visual | User Action |
|-------|--------|-------------|
| Not Set | Empty input + lock icon + "Set your private budget" | Enter amount |
| First Time | 3-step explainer carousel | Read, dismiss, enter budget |
| Set | Locked input with amount + "Private" badge + checkmark | Edit amount, view group max |
| Group Calculating | Spinner on group max card | Wait or nudge members |
| Group Ready | Side-by-side: "Your Budget" (private, teal) + "Group Max" (shared) | Browse filtered suggestions |
| Budget Too Low | Amber indicator (private): "Your budget sets the group limit" | Adjust or accept |
| Error | Red border, "Couldn't save. Try again." | Retry |

### New Components

- `BlindBudgetForm` - Private budget input with lock icon, teal privacy indicators
- `GroupLimitDisplay` - Group affordable limit card with member progress
- `BudgetExplainerCarousel` - 3-step onboarding: privacy, group limit, planning
- `PrivacyIndicator` - Reusable teal lock badge

### Changes to Existing Budget.tsx

- Blind mode toggle and setup modal become the real entry point
- Replace hardcoded `$5,000` with Supabase-backed data
- Add mock user switcher to demo multiple perspectives
- Integrate new components into the existing layout

---

## Feature 2: Democratic Voting (High-Level)

**Source:** TripOS Epic 5 + `docs/strategy/voting-system-deep-dive.md`

- 5 voting methods: yes/no, single choice, ranked choice, approval, veto
- Schema: `polls` + `votes` tables adapted from TripOS
- Ranked choice tabulation algorithm from TripOS spec
- Existing Voting.tsx already has multi-method UI
- Deadline enforcement, quorum logic

---

## Feature 3: Expense Splitting (High-Level)

**Source:** TripOS Epic 7

- Track shared costs with 4 split methods (equal, exact, percentage, shares)
- Settlement optimization to minimize transactions
- Multi-currency via ExchangeRate-API (Frankfurter fallback)
- Schema: `expenses` + `expense_splits` tables
- Existing ExpenseSplitter.tsx has UI foundation

---

## Implementation Order

1. **Infrastructure setup** - Tailwind + shadcn/ui integration, local Supabase, mock auth, foundation tables
2. **Blind Budgeting** - Full feature with mock auth and user switching
3. **Democratic Voting** - Connect existing UI to Supabase, add tallying algorithms
4. **Expense Splitting** - Connect UI, add settlement logic, currency API

Each feature follows the same pattern: adapt TripOS spec, simplify for mock auth, build with Supabase + new components in Tailwind/shadcn.
