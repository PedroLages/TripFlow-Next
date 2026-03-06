# Modern Tech Stack - Technical Deep Dive

**Created**: February 8, 2026
**Status**: Complete - Technical Specification (v1.1 — revised after adversarial review)
**Purpose**: Technology decision rationale, project setup, CI/CD pipeline, testing strategy, performance targets, developer workflow, and competitive advantage analysis
**Related**: [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md) | [Web first mobile ready strategy](../Web%20first%20mobile%20ready%20strategy%C2%B7.md)

---

## Executive Summary

TripOS's tech stack is a **deliberate competitive weapon**, not just tooling. Competitors built on 2015-2018 stacks carry years of technical debt: Sygic's sync bugs, Lambus's desktop/mobile inconsistencies, Wanderlog's performance degradation at scale. Our stack gives us three structural advantages:

1. **Real-time reliability** (Supabase proven infrastructure vs custom sync = dramatically fewer sync bugs)
2. **Speed to market** (Vite + Supabase + Vercel = days of setup, not weeks)
3. **Privacy architecture** (PostgreSQL RLS = database-level privacy enforcement without additional application code)

**Stack at a Glance**:

| Layer | Choice | Version |
|-------|--------|---------|
| **UI Framework** | React | 19 |
| **Build Tool** | Vite | 7.x |
| **Language** | TypeScript | 5.9 |
| **Styling** | Tailwind CSS | v4 |
| **State Management** | Zustand | 5.x |
| **Data Fetching** | TanStack Query | v5 |
| **Backend** | Supabase | Latest |
| **Database** | PostgreSQL | 15+ (via Supabase) |
| **Deployment** | Vercel | - |
| **Testing** | Vitest + Playwright | Latest |
| **Monitoring** | Sentry + PostHog | Latest |

---

## Table of Contents

1. [Technology Decisions (Why Each Choice)](#1-technology-decisions)
2. [Project Setup & Configuration](#2-project-setup--configuration)
3. [CI/CD Pipeline](#3-cicd-pipeline)
4. [Testing Strategy](#4-testing-strategy)
5. [Performance Strategy](#5-performance-strategy)
6. [Developer Workflow](#6-developer-workflow)
7. [Security Architecture](#7-security-architecture)
8. [Accessibility (a11y)](#8-accessibility-a11y)
9. [Monitoring & Observability](#9-monitoring--observability)
10. [Cost Analysis & Scaling](#10-cost-analysis--scaling)
11. [Competitive Tech Advantage](#11-competitive-tech-advantage)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. Technology Decisions

Every choice below answers: **Why this? Why not the alternative? How does it serve group travel specifically?**

### 1.1 React 19 (UI Framework)

**Decision**: React 19 over Next.js, Remix, Svelte, or Vue.

| Factor | React 19 | Next.js 16 | Remix | Svelte 5 |
|--------|----------|-------------|-------|-----------|
| **SSR needed?** | No (SPA is fine for app) | Overkill (SSR for SEO pages only) | Overkill | No |
| **React Native path** | Direct | Extra layer | No path | No path |
| **Real-time** | Supabase SDK works natively | Works but SSR complicates subscriptions | Works | Different ecosystem |
| **Ecosystem** | Largest (components, libraries) | Subset of React | Smaller | Smallest |
| **Hiring pool** | Largest | Large | Small | Small |
| **Bundle size** | ~45KB | ~85KB+ (framework overhead) | ~50KB | ~15KB (smaller but ecosystem tradeoff) |

**Why NOT Next.js**: TripOS is an **app**, not a **website**. We don't need SSR for itinerary pages—they're behind auth. Next.js adds complexity (server components, app router, middleware) without benefit. The only SSR need is the landing page, which can be a static page on Vercel.

**Why NOT Svelte**: Smaller ecosystem, no React Native migration path. Svelte 5's runes are promising but the component library ecosystem is years behind React.

**React 19 Specific Benefits**:
- **React Compiler** (auto-memoization): No more manual `useMemo`/`useCallback` — performance by default
- **Server Actions**: Not needed now, but available if we add SSR pages later
- **use() hook**: Cleaner async data loading patterns
- **Concurrent features**: Smoother UI during real-time updates (transitions)

**TripOS-specific reasoning**: When 8 people edit a trip simultaneously, React 19's concurrent rendering prevents UI jank. The compiler's auto-memoization means we don't manually optimize re-renders from Supabase real-time events.

---

### 1.2 Vite 7 (Build Tool)

**Decision**: Vite over Webpack, Turbopack, or Parcel.

| Factor | Vite 7 | Webpack 5 | Turbopack | Parcel |
|--------|--------|-----------|-----------|--------|
| **Dev server startup** | <500ms | 10-30s | Fast but Next.js only | 2-5s |
| **HMR speed** | <50ms | 500ms-2s | Fast | 200ms |
| **Config complexity** | Minimal | Complex | Next.js managed | Zero-config but less control |
| **Code splitting** | Native ES modules | Requires config | Automatic | Automatic |
| **Plugin ecosystem** | Growing fast | Largest | Locked to Next.js | Small |

**Why Vite**: Solo developer = iteration speed is critical. Vite's instant HMR means testing a real-time voting UI change takes <1 second to see, not 10. Over 18-24 weeks of development, this compounds into days saved.

**Vite-specific configuration needs**:
- PWA plugin (`vite-plugin-pwa`) for offline support
- Environment variable handling (Supabase keys)
- Code splitting by route (dynamic imports)
- Bundle analysis (`rollup-plugin-visualizer`) for size monitoring

---

### 1.3 TypeScript 5.9 (Language)

**Decision**: TypeScript over JavaScript. Non-negotiable for this project.

**Why TypeScript is critical for TripOS specifically**:

| Scenario | Without TypeScript | With TypeScript |
|----------|-------------------|-----------------|
| **Blind budgeting privacy** | Accidentally expose `max_budget` field in API response | Type system prevents returning `PrivateBudget` where `PublicBudgetSummary` is expected |
| **Role permissions** | Pass wrong role string, bypass RLS | `Role = 'owner' \| 'organizer' \| 'member' \| 'guest'` enforced at compile time |
| **Vote types** | Wrong vote type crashes poll | `VoteType = 'yes_no' \| 'ranked_choice' \| 'approval'` catches errors |
| **Supabase SDK** | No autocomplete for table columns | Generated types from database schema = full autocomplete |

**Supabase type generation** (critical workflow):

```bash
# Generate TypeScript types from database schema
npx supabase gen types typescript --local > src/lib/database.types.ts
```

This gives us compile-time safety for every database query. If someone adds a column to `trips`, the types update and the compiler catches all affected code.

---

### 1.4 Tailwind CSS v4 (Styling)

**Decision**: Tailwind v4 over CSS Modules, styled-components, or Emotion.

| Factor | Tailwind v4 | CSS Modules | styled-components | Emotion |
|--------|-------------|-------------|-------------------|---------|
| **Bundle size** | ~10KB (purged) | Variable | ~15KB runtime | ~11KB runtime |
| **Runtime cost** | Zero (compile-time) | Zero | Runtime CSS-in-JS | Runtime CSS-in-JS |
| **Mobile-first** | Built-in (`md:`, `lg:` prefixes) | Manual media queries | Manual | Manual |
| **React Native** | NativeWind exists | N/A | Limited | Limited |
| **Design consistency** | Built-in design tokens | Manual | Manual | Manual |

**Why Tailwind v4 specifically** (not v3):
- **CSS-first configuration**: No more `tailwind.config.js` — configure in CSS with `@theme`
- **Lightning CSS engine**: 100x faster builds than v3
- **Container queries**: Native support for responsive components (not just viewport)
- **Better dark mode**: Automatic based on `prefers-color-scheme`

**TripOS-specific reasoning**: Mobile-first responsive design is a core requirement. Tailwind's `sm:`, `md:`, `lg:` prefixes make responsive layouts trivial. Building a voting card that works on 375px mobile and 1440px desktop is one class string, not two CSS files.

---

### 1.5 Zustand 5 (State Management)

**Decision**: Zustand over Redux Toolkit, Jotai, or React Context.

| Factor | Zustand 5 | Redux Toolkit | Jotai | React Context |
|--------|-----------|---------------|-------|---------------|
| **Bundle size** | ~1KB | ~11KB | ~2KB | 0 (built-in) |
| **Boilerplate** | Minimal | Moderate (slices, actions) | Minimal | Verbose (providers, reducers) |
| **React Native** | Works identically | Works | Works | Works |
| **DevTools** | Redux DevTools compatible | Native | Limited | React DevTools |
| **Persistence** | Built-in middleware | Extra setup | Extra setup | Manual |
| **Real-time integration** | Simple (set state from subscription) | Actions/thunks | Simple | Re-render cascade risk |

**Why NOT Redux**: Redux Toolkit is excellent for large teams needing strict patterns. Solo developer doesn't need that overhead. Zustand's `set()` function is all we need.

**Why NOT React Context**: With 8 people editing a trip, real-time updates flow constantly. Context causes re-render cascades down the component tree. Zustand's selector pattern (`useTripStore(s => s.activities)`) prevents unnecessary re-renders.

**Data boundary rule — Zustand vs TanStack Query**:

> **Server state** (trips, activities, votes, budgets, expenses) lives in **TanStack Query cache**. It is fetched from Supabase, cached by query key, and invalidated by real-time events.
>
> **Client-only state** (UI modals, connection status, offline queue, auth session, navigation state) lives in **Zustand stores**. It never touches the network.
>
> **Never duplicate server data into Zustand.** If a component needs trip data, it calls `useQuery(['trip', id])`, not `useTripStore()`.

This rule prevents the #1 state management bug in real-time apps: stale Zustand data that doesn't update when TanStack Query refetches.

**TripOS-specific stores** (client state only):

```
stores/
├── authStore.ts        # Current user session, auth state
├── realtimeStore.ts    # Connection status, presence indicators
├── uiStore.ts          # Modals, toasts, navigation state
└── offlineStore.ts     # Queued mutations for PWA sync
```

---

### 1.6 TanStack Query v5 (Data Fetching)

**Decision**: TanStack Query over SWR, Apollo, or raw fetch.

**Why TanStack Query is essential for TripOS**:

| Need | TanStack Query Solution |
|------|------------------------|
| **Cache trip data across pages** | Automatic query caching by key |
| **Real-time invalidation** | `queryClient.invalidateQueries(['trip', id])` when Supabase sends update |
| **Optimistic UI** | `onMutate` callback for instant vote feedback before server confirms |
| **Offline support** | Built-in query persistence to localStorage (PWA) |
| **Retry on reconnect** | Automatic retry when network returns (travel scenario) |
| **Pagination** | Infinite scroll for activity feeds, expense lists |

**Critical pattern — Real-time + TanStack Query**:

The combination of Supabase real-time subscriptions + TanStack Query cache invalidation gives us:
1. Supabase sends real-time event ("Sarah added an activity")
2. TanStack Query invalidates the cache for that trip
3. Fresh data fetched automatically
4. UI updates without full page reload
5. Other queries (budget totals, activity count) stay cached

This pattern **dramatically reduces** sync bugs compared to custom solutions (Sygic, Lambus), but is not bulletproof. Known edge cases:
- Two rapid real-time events can cause out-of-order refetches (mitigated by `staleTime` and debounced invalidation)
- Optimistic updates can briefly show stale data if the mutation fails server-side (mitigated by `onError` rollback in `useMutation`)
- Reconnection after a network drop may miss events during the window (mitigated by full refetch on reconnect via `refetchOnReconnect: true`)

These are manageable edge cases with known solutions, not the systemic sync failures competitors suffer from.

---

### 1.7 Supabase (Backend)

**Decision**: Supabase over Firebase, AWS Amplify, Appwrite, or custom backend.

| Factor | Supabase | Firebase | AWS Amplify | Custom (Express + PostgreSQL) |
|--------|----------|----------|-------------|-------------------------------|
| **Database** | PostgreSQL (relational) | Firestore (NoSQL) | DynamoDB (NoSQL) | PostgreSQL |
| **Real-time** | PostgreSQL LISTEN/NOTIFY | Native | AppSync (GraphQL) | Socket.io (custom) |
| **Auth** | Built-in (OAuth, magic link) | Built-in | Cognito | Passport.js (manual) |
| **RLS** | Native PostgreSQL RLS | Security Rules (different) | IAM (complex) | Manual middleware |
| **Edge Functions** | Deno runtime | Cloud Functions | Lambda | Express routes |
| **Storage** | Built-in + CDN | Built-in | S3 | S3 (manual) |
| **Cost (free tier)** | 500MB DB, 1GB storage | 1GB Firestore, 5GB storage | 5GB storage | $0 (self-host) |
| **Vendor lock-in** | LOW (it's PostgreSQL) | HIGH (Firestore proprietary) | HIGH | NONE |

**Why NOT Firebase**: Firestore is NoSQL. Blind budgeting requires relational queries with row-level security. Computing "group budget max = MIN(all member budgets)" across a trip is a simple SQL aggregate. In Firestore, it requires Cloud Functions to scan all documents — slower, more error-prone, harder to secure.

**Why NOT custom backend**: Solo developer. Building auth, real-time sync, file storage, and database management from scratch adds 4-8 weeks to timeline. Supabase gives all of this out of the box.

**Supabase-specific advantages for TripOS**:

1. **Row-Level Security (RLS)**: Blind budgets are private AT THE DATABASE LEVEL. Not "hidden in the UI" — the database itself refuses unauthorized queries. RLS provides database-level enforcement without additional application code, reducing the surface area for privacy bugs. Other approaches exist (Firebase Security Rules, server-side middleware), but RLS is the most convenient for a solo developer because it requires zero application-layer access control code.

2. **Real-time subscriptions**: PostgreSQL LISTEN/NOTIFY is battle-tested infrastructure. Competitors built custom sync — we use proven infrastructure. This reduces (but does not eliminate) sync issues. See Section 5.5 for honest edge case analysis.

3. **Edge Functions (Deno)**: Business logic runs close to users. Vote consensus calculation, budget aggregation, notification triggers — all server-side, all fast.

4. **Self-hostable**: If Supabase the company fails, we can self-host. The entire stack is open-source. Zero vendor lock-in on the database layer.

---

### 1.8 Vercel (Deployment)

**Decision**: Vercel over Netlify, Cloudflare Pages, or AWS S3 + CloudFront.

| Factor | Vercel | Netlify | Cloudflare Pages | AWS S3 + CF |
|--------|--------|---------|------------------|-------------|
| **Preview deployments** | Automatic per PR | Automatic | Automatic | Manual |
| **Custom domains** | Free | Free | Free | Route 53 ($) |
| **Edge network** | Global | Global | Global (fastest) | CloudFront |
| **Build speed** | Fast | Fast | Fast | Manual |
| **GitHub integration** | Native | Native | Native | Manual |
| **Analytics** | Built-in | Separate | Separate | CloudWatch |
| **Cost (free tier)** | 100GB bandwidth | 100GB bandwidth | Unlimited bandwidth | Pay-per-use |

**Why Vercel**: Best developer experience for React SPAs. Push to `main` → deployed in 60 seconds. Preview URLs per PR for testing. Built-in analytics for Core Web Vitals.

**Why NOT Cloudflare Pages**: Slightly better performance, but Vercel's React integration and analytics are more valuable for a solo developer who needs to monitor performance without extra tooling.

---

## 2. Project Setup & Configuration

### 2.1 Initial Project Scaffold

```bash
# Create project
npm create vite@latest squadtrip -- --template react-ts

# Core dependencies
npm install @supabase/supabase-js @tanstack/react-query zustand react-router-dom

# Development dependencies
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react
npm install -D playwright @playwright/test
npm install -D eslint @typescript-eslint/eslint-plugin prettier
```

### 2.2 Key Configuration Files

**TypeScript** (`tsconfig.json`):

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,  // Catches undefined array access
    "exactOptionalPropertyTypes": true, // Stricter optional types
    "paths": {
      "@/*": ["./src/*"]               // Clean imports: @/lib/supabase
    }
  }
}
```

**Why `noUncheckedIndexedAccess`**: When accessing `votes[0]`, TypeScript forces us to handle `undefined`. Critical for vote counting where empty arrays are expected.

**Why `exactOptionalPropertyTypes`**: Prevents `budget?: number` from accidentally accepting `undefined` where `number` is expected. Matters for blind budgeting calculations.

**Vite** (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),          // React Compiler integration (React 19)
    tailwindcss(),    // Tailwind v4 Vite plugin
    VitePWA({         // PWA for offline support
      registerType: 'autoUpdate',
      manifest: {
        name: 'TripOS',
        short_name: 'TripOS',
        theme_color: '#...',
        icons: [/* ... */]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/rest/,
            handler: 'NetworkFirst',  // Try network, fall back to cache
            options: { cacheName: 'api-cache' }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': '/src' }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          'router': ['react-router-dom']
        }
      }
    }
  }
})
```

**ESLint** (`eslint.config.js` — flat config, ESLint 9+):

```javascript
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Prevent accidental data exposure (blind budgeting safety)
      'no-console': 'warn',
      // Enforce exhaustive switch for vote types, roles
      '@typescript-eslint/switch-exhaustiveness-check': 'error'
    }
  }
)
```

### 2.3 Folder Structure

```
src/
├── components/           # Shared UI components
│   ├── ui/               # Primitives (Button, Modal, Card, Toast)
│   ├── layout/           # Shell, Navigation, Sidebar
│   └── forms/            # Form components (Input, Select, DatePicker)
├── features/             # Feature modules (self-contained)
│   ├── auth/             # Login, signup, session management
│   ├── trips/            # Trip CRUD, trip list, trip detail
│   ├── itinerary/        # Day-by-day planning, activities
│   ├── collaboration/    # Invites, roles, presence, activity feed
│   ├── voting/           # Polls, vote cards, results
│   ├── budget/           # Expenses, categories, blind budgeting
│   └── tasks/            # Task assignment, checklists (Phase 6+)
├── hooks/                # Custom React hooks
│   ├── useSupabase.ts    # Supabase client hook
│   ├── useRealtime.ts    # Real-time subscription hook
│   ├── useAuth.ts        # Auth state hook
│   └── useOffline.ts     # PWA offline detection
├── lib/                  # Utilities and configuration
│   ├── supabase.ts       # Supabase client initialization
│   ├── database.types.ts # Auto-generated from Supabase schema
│   ├── constants.ts      # App-wide constants
│   └── utils.ts          # Shared utilities
├── stores/               # Zustand stores (client state only)
│   ├── authStore.ts        # Current user session, auth state
│   ├── realtimeStore.ts    # Connection status, presence indicators
│   ├── uiStore.ts          # Modals, toasts, navigation state
│   └── offlineStore.ts     # Queued mutations for PWA sync
├── pages/                # Route-level components
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── TripDetail.tsx
│   └── Settings.tsx
├── App.tsx               # Root component + router
└── main.tsx              # Entry point

supabase/
├── functions/            # Edge Functions
│   ├── check-vote-consensus/
│   ├── calculate-group-budget/
│   ├── send-notification/
│   └── settle-expenses/
├── migrations/           # Database migrations (versioned)
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_realtime_triggers.sql
└── seed.sql              # Development seed data

tests/
├── unit/                 # Vitest unit tests
├── integration/          # Supabase integration tests
└── e2e/                  # Playwright end-to-end tests
```

**Key principle**: Feature modules are self-contained. Each feature folder has its own components, hooks, and types. Cross-feature communication happens through Zustand stores or route parameters, not prop drilling.

---

## 3. CI/CD Pipeline

### 3.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4  # Coverage reporting

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [lint-and-type-check]  # Only run if lint passes
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - uses: supabase/setup-cli@v1
      - run: npx supabase start  # Local Supabase for E2E
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npx bundlesize  # Fail if bundle exceeds limits
```

### 3.2 Bundle Size Budgets

```jsonc
// package.json
{
  "bundlesize": [
    { "path": "dist/assets/index-*.js", "maxSize": "150 KB" },
    { "path": "dist/assets/supabase-*.js", "maxSize": "50 KB" },
    { "path": "dist/assets/query-*.js", "maxSize": "30 KB" }
  ]
}
```

**Why bundle budgets**: Wanderlog's web app slows with complex itineraries. We prevent this by catching bundle bloat in CI before it reaches users.

### 3.3 Deployment Flow

```
Feature branch → PR → CI checks → Preview deployment (Vercel) → Code review → Merge to main → Production deployment (Vercel)
```

**Preview deployments**: Every PR gets a unique URL. Test real-time sync with 2 browser tabs. Test mobile layout on phone. Test blind budgeting privacy by logging in as 2 different users.

### 3.4 Database Migration Flow

```bash
# Create migration
npx supabase migration new add_voting_deadline_column

# Edit migration file in supabase/migrations/

# Test locally
npx supabase db reset  # Wipes local DB and re-runs all migrations

# Push to staging (Supabase linked project)
npx supabase db push --linked

# Production: migrations run via GitHub Action on merge to main
```

**Rule**: Never modify production database directly. All changes through migrations. This ensures reproducibility and rollback capability.

---

## 4. Testing Strategy

### 4.1 Testing Pyramid

```
         ╱ E2E (Playwright) ╲          ~10 tests
        ╱  Critical user flows  ╲       Slow, expensive
       ╱─────────────────────────╲
      ╱ Integration (Vitest + Supabase) ╲  ~50 tests
     ╱  API calls, RLS policies, queries  ╲  Medium speed
    ╱─────────────────────────────────────╲
   ╱        Unit (Vitest + Testing Library)        ╲  ~200+ tests
  ╱  Components, hooks, stores, utilities, vote logic ╲  Fast
 ╱─────────────────────────────────────────────────────╲
```

### 4.2 Unit Tests (Vitest)

**What to unit test**:

| Module | What to Test | Example |
|--------|-------------|---------|
| **Vote logic** | Consensus calculation, quorum checks, ranked choice tallying | "6 of 8 voted yes → consensus reached at 70% threshold" |
| **Budget logic** | Group max calculation, currency conversion, split algorithms | "Min of [500, 800, 1200] = 500 per person" |
| **Role permissions** | Permission checks for each role × each action | "Member cannot delete trip, organizer can" |
| **Components** | Render states, user interactions, error states | "Vote card shows deadline countdown" |
| **Stores** | State transitions, computed values | "Adding activity updates trip total cost" |

**Vitest configuration** (`vitest.config.ts`):

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
})
```

### 4.3 Integration Tests (Supabase Local)

**What to integration test**:

| Scenario | Test |
|----------|------|
| **RLS: Blind budgeting** | User A sets budget → User B queries member_budgets → Gets zero rows (not User A's budget) |
| **RLS: Role enforcement** | Guest user tries to INSERT activity → Blocked by RLS policy |
| **Real-time** | User A adds activity → User B's subscription receives event within 2s |
| **Edge Functions** | Call `calculate-group-budget` → Returns min budget without revealing individual amounts |
| **Concurrent edits** | Two users edit same activity simultaneously → Optimistic locking detects conflict, second user notified |

**Test pattern for RLS**:

```typescript
// tests/integration/blind-budgeting.test.ts
test('user cannot see other members budget', async () => {
  // Setup: Create trip, add 2 members
  const userA = await createTestUser('alice@test.com')
  const userB = await createTestUser('bob@test.com')
  const trip = await createTrip(userA)
  await addMember(trip.id, userB.id)

  // User A sets budget
  await supabaseAs(userA).from('member_budgets').insert({
    trip_id: trip.id, user_id: userA.id, max_budget: 500
  })

  // User B tries to read all budgets
  const { data } = await supabaseAs(userB)
    .from('member_budgets')
    .select('*')
    .eq('trip_id', trip.id)

  // User B should only see their own budget (if set), not User A's
  expect(data?.find(b => b.user_id === userA.id)).toBeUndefined()
})
```

### 4.4 E2E Tests (Playwright)

**Critical user flows to test**:

| Flow | Steps | Assertion |
|------|-------|-----------|
| **Trip creation** | Landing → Sign up → Create trip → Add activity | Activity visible on trip page |
| **Invite + join** | Organizer sends invite → Member clicks link → Sees trip | Member listed in trip members |
| **Vote flow** | Create poll → 3 members vote → Consensus reached | Poll status changes to "decided" |
| **Blind budgeting** | 3 members set budgets → Organizer views group max | Individual budgets NOT visible |
| **Real-time sync** | User A adds activity → User B sees it appear | Activity appears within 3 seconds |
| **Offline → Online** | Go offline → Add activity → Go online → Activity syncs | Activity persists after reconnect |

**Playwright configuration** (`playwright.config.ts`):

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } }
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173
  }
})
```

**Why test mobile + desktop**: Our competitive advantage is mobile-first UX. If voting cards break on iPhone, we lose our edge.

### 4.5 npm Scripts

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src/",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test": "vitest run && playwright test",
    "db:reset": "npx supabase db reset",
    "db:types": "npx supabase gen types typescript --local > src/lib/database.types.ts",
    "db:migrate": "npx supabase migration new"
  }
}
```

---

## 5. Performance Strategy

### 5.1 Core Web Vitals Targets

| Metric | Target | Why |
|--------|--------|-----|
| **LCP** (Largest Contentful Paint) | <2.5s | Trip detail page must load fast |
| **INP** (Interaction to Next Paint) | <200ms | Vote button must respond instantly (replaced FID, March 2024) |
| **CLS** (Cumulative Layout Shift) | <0.1 | Real-time updates must not shift layout |
| **TTFB** (Time to First Byte) | <200ms | Vercel Edge Network |
| **Bundle size** (initial JS) | <150KB gzipped | Mobile users on 4G |

### 5.2 Code Splitting Strategy

```typescript
// Route-based splitting (automatic with React Router)
const TripDetail = lazy(() => import('@/pages/TripDetail'))
const VotingView = lazy(() => import('@/features/voting/VotingView'))
const BudgetView = lazy(() => import('@/features/budget/BudgetView'))
const Settings = lazy(() => import('@/pages/Settings'))

// Only load voting code when user navigates to voting tab
// Only load budget code when user navigates to budget tab
```

**Impact**: User visiting trip overview doesn't download voting or budget code until needed. Initial bundle stays small.

### 5.3 Real-Time Performance

| Concern | Solution |
|---------|----------|
| **Too many subscriptions** | Subscribe per-trip, not per-table. One channel for all trip changes. |
| **Re-render storms** | Zustand selectors + React.memo. Only components showing changed data re-render. |
| **Stale data** | TanStack Query staleTime of 30s for trip data. Real-time events trigger immediate refetch. |
| **Connection drops** | Supabase reconnects automatically. Show "Reconnecting..." banner. Queue offline changes. |

### 5.4 Conflict Resolution Strategy

A collaboration-first app where 8 people edit a trip simultaneously **cannot use last-write-wins**. Silent data loss is exactly the Sygic/Lambus problem we claim to solve.

**Approach: Optimistic Locking with Version Counters**

Every mutable row (activities, votes, expenses) has an `updated_at` timestamp used as a version counter.

```sql
-- Add to activities, voting_options, expenses tables
ALTER TABLE activities ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
```

**Update pattern** (Edge Function):

```typescript
// Client sends: { id, changes, expectedVersion }
// Server checks version before writing
const { data, error } = await supabase
  .from('activities')
  .update({ ...changes, version: expectedVersion + 1 })
  .eq('id', activityId)
  .eq('version', expectedVersion)  // Only succeeds if no one else edited

if (data?.length === 0) {
  // Version mismatch — someone else edited first
  return { conflict: true, serverVersion: await fetchCurrent(activityId) }
}
```

**Client-side conflict UI**:

| Scenario | Behavior |
|----------|----------|
| **Non-overlapping edits** | Auto-merge (User A edits time, User B edits location → both apply) |
| **Overlapping edits** | Show conflict toast: "Sarah also edited this activity. Keep yours or see theirs?" |
| **Delete vs edit** | Delete wins. Toast: "This activity was deleted by Sarah." |

**Why not CRDTs**: Overkill for structured data (activities, votes). CRDTs solve text collaboration (Google Docs). Our edits are field-level, not character-level. Optimistic locking with field-level merge handles 99% of cases.

### 5.5 Real-Time Edge Cases (Honest Assessment)

Supabase real-time reduces sync complexity but does not eliminate it. Known edge cases and mitigations:

| Edge Case | What Happens | Mitigation |
|-----------|-------------|------------|
| **Subscription disconnect** | Client misses events during reconnection window (typically 1-5s) | Full query refetch on reconnect (`refetchOnReconnect: true` in TanStack Query) |
| **Event ordering** | Two rapid events arrive out of order | Use `updated_at` timestamp for ordering, not arrival order. TanStack Query refetch gets canonical state. |
| **Optimistic update rollback** | User sees their change instantly, but server rejects it (permission, validation) | `onError` callback in `useMutation` rolls back optimistic update and shows error toast |
| **Edge Function cold starts** | First invocation after idle period takes 500ms-2s (Deno cold start) | Accept for infrequent operations (vote consensus check). Keep hot with periodic health checks if needed for critical paths. |
| **Stale-while-revalidate gap** | Brief window where cached data and fresh data differ | Acceptable for non-critical reads. For votes and budgets, use `staleTime: 0` to always refetch. |

**React Error Boundaries**: Wrap each feature module in an Error Boundary to prevent a malformed real-time event from crashing the entire app. A broken voting component should not take down the itinerary view.

```typescript
// src/components/ErrorBoundary.tsx
// Each feature route wrapped: <ErrorBoundary fallback={<FeatureError />}>
//   <VotingView />
// </ErrorBoundary>
```

### 5.6 Offline Mutation Conflict Resolution

"Queue offline changes" requires a concrete strategy for when queued mutations conflict with server state.

**Approach: Server Wins + User Notification**

```
1. User goes offline
2. User edits activity (queued in offlineStore via Zustand persist middleware)
3. Meanwhile, another user edits the same activity on the server
4. User comes back online
5. Offline queue replays mutations against server
6. Server applies optimistic locking (version check)
7. If version mismatch → mutation rejected → user notified
```

**Offline queue structure**:

```typescript
// stores/offlineStore.ts
interface OfflineMutation {
  id: string
  table: string
  operation: 'insert' | 'update' | 'delete'
  payload: Record<string, unknown>
  expectedVersion: number  // For conflict detection
  createdAt: number        // Timestamp for ordering
}
```

**Conflict notification UI**: Toast message: "Your edit to [activity name] couldn't be saved — it was changed while you were offline. Tap to see the current version."

**What we do NOT attempt**: Automatic merge of offline edits. The risk of silently corrupting trip data (wrong times, wrong locations) outweighs the convenience. Explicit user resolution is safer for travel planning where correctness matters.

### 5.7 Image Optimization

```typescript
// Use Supabase Storage image transformations
const getActivityImage = (path: string, viewport: 'mobile' | 'desktop') => {
  const width = viewport === 'mobile' ? 375 : 800
  return supabase.storage
    .from('activity-images')
    .getPublicUrl(path, {
      transform: { width, quality: 80, format: 'webp' }
    })
}
```

**Why**: Travel apps are image-heavy. Serving 4K images to mobile users on 4G kills performance. Supabase transforms on the edge.

---

## 6. Developer Workflow

### 6.1 Local Development Setup

```bash
# 1. Clone and install
git clone <repo> && cd squadtrip
npm install

# 2. Start local Supabase (Docker required)
npx supabase start
# → Outputs local URL + anon key

# 3. Create .env.local
# VITE_SUPABASE_URL=http://127.0.0.1:54321
# VITE_SUPABASE_ANON_KEY=<from supabase start output>

# 4. Run migrations + seed
npx supabase db reset

# 5. Generate types
npm run db:types

# 6. Start dev server
npm run dev
# → http://localhost:5173
```

**Full local stack**: Supabase runs entirely in Docker. No external dependencies. No API key needed for development. Tests run against local Supabase.

### 6.2 Branch Strategy

```
main (production)
 ├── feat/voting-system       # Feature branches
 ├── feat/blind-budgeting
 ├── fix/sync-race-condition  # Bug fixes
 └── chore/update-deps        # Maintenance
```

**Rules**:
- All work on feature branches
- PR required for merge to `main`
- CI must pass before merge
- Squash merge to keep history clean
- Delete branch after merge

### 6.3 Database Change Workflow

```
1. Create migration:    npx supabase migration new <name>
2. Write SQL:           Edit supabase/migrations/<timestamp>_<name>.sql
3. Test locally:        npx supabase db reset
4. Regenerate types:    npm run db:types
5. Update code:         Fix any TypeScript errors from new types
6. Commit together:     Migration + type file + code changes in same PR
```

**Critical rule**: Migration + generated types + code changes must be in the same PR. Never merge a migration without updating types — it breaks type safety.

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────┐
│       Vercel (Hosting)       │ ← HTTPS enforcement, DDoS protection
├─────────────────────────────┤
│      Supabase Auth           │ ← JWT tokens, session management
├─────────────────────────────┤
│      Edge Functions          │ ← Input validation, rate limiting, business logic
├─────────────────────────────┤
│      Row-Level Security      │ ← Database-level access control (THE critical layer)
├─────────────────────────────┤
│      PostgreSQL              │ ← Encrypted at rest, connection pooling
└─────────────────────────────┘
```

### 7.2 RLS as Core Security Model

RLS is not a "nice to have" — it's the **foundation of blind budgeting privacy** and **role-based permissions**. See [role-based-permissions-deep-dive.md](./role-based-permissions-deep-dive.md) for complete RLS policies.

**Key principle**: Even if the frontend has a bug that exposes a query, RLS blocks unauthorized data access at the database level. Defense in depth.

### 7.3 Security Checklist

| Category | Measure | Implementation |
|----------|---------|----------------|
| **Auth** | Magic link (no passwords to breach) | Supabase Auth |
| **Auth** | OAuth (Google, Apple) | Supabase Auth providers |
| **Auth** | JWT expiry (1 hour, auto-refresh) | Supabase default |
| **Data** | RLS on ALL tables | PostgreSQL policies |
| **Data** | Budget amounts never in API responses | Edge Function filters |
| **Data** | Encryption at rest | Supabase default (AES-256) |
| **Transport** | HTTPS only | Vercel enforces |
| **Input** | Validate all user input server-side | Edge Functions + Zod |
| **Input** | Sanitize HTML in text fields | DOMPurify on render |
| **Dependencies** | `npm audit` in CI | GitHub Actions |
| **Dependencies** | Dependabot alerts | GitHub auto-enabled |
| **Headers** | CSP, X-Frame-Options, X-Content-Type | Vercel headers config |
| **Rate limiting** | Supabase built-in + Edge Function guards | Per-user rate limits |

### 7.4 Environment Variable Management

```
.env.local          # Local development (git-ignored)
.env.staging        # Staging Supabase project (git-ignored)
.env.production     # Never committed — set in Vercel dashboard
```

**Variables**:

```env
# Required
VITE_SUPABASE_URL=           # Public (embedded in client bundle)
VITE_SUPABASE_ANON_KEY=      # Public (safe — RLS protects data)

# Phase 1+
VITE_GOOGLE_MAPS_API_KEY=    # Public (restricted by domain in Google Console)

# Phase 4+
VITE_CURRENCY_API_KEY=       # Public (restricted by domain)

# Server-side only (Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=   # NEVER in client code — admin access
SENTRY_DSN=                  # Error tracking
POSTHOG_API_KEY=             # Analytics
```

**Critical**: `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Only used in Edge Functions for admin operations (e.g., calculating group budget across all members). Never exposed to client.

---

## 8. Accessibility (a11y)

Target: **WCAG 2.1 AA compliance** from Phase 1.

**Non-negotiable baseline**:

- Semantic HTML (`<button>`, `<nav>`, `<main>`, `<dialog>`) — not `<div onClick>`
- ARIA labels on all interactive elements (vote buttons, budget inputs, poll options)
- Keyboard navigation for voting flows, expense entry, and itinerary editing
- Focus management when modals open/close and when real-time updates arrive (don't steal focus)
- Color contrast ratios meeting AA (4.5:1 for text, 3:1 for UI components)
- Screen reader announcements for real-time changes (ARIA live regions for "Sarah added an activity")

**TripOS-specific a11y concerns**: Voting cards, real-time update toasts, and interactive maps all have specific requirements. Maps need text alternatives for route information. Vote results need non-color indicators (not just red/green).

**Testing**: Axe-core plugin in Playwright E2E tests catches regressions automatically.

---

## 9. Monitoring & Observability

### 8.1 Error Tracking (Sentry)

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,  // 10% of transactions for performance
  replaysSessionSampleRate: 0.0,  // No session replays (privacy)
  replaysOnErrorSampleRate: 1.0,  // Replay on error (debug)
  beforeSend(event) {
    // Strip any budget amounts from error context
    if (event.contexts?.budget) delete event.contexts.budget
    return event
  }
})
```

**Privacy-aware monitoring**: Sentry's `beforeSend` hook strips budget data from error reports. We never want individual budget amounts in our error tracking system.

### 8.2 Analytics (PostHog)

**What to track** (not WHO — privacy first):

| Event | Why | Data |
|-------|-----|------|
| `trip_created` | Activation metric | Trip type (template used) |
| `member_invited` | Viral metric | Count (not email) |
| `poll_created` | Feature adoption | Poll type |
| `vote_cast` | Engagement | (anonymous, no vote value) |
| `blind_budget_enabled` | Key feature adoption | Boolean only |
| `expense_logged` | Feature usage | Category only |
| `trip_completed` | North star metric | Group size |

**What NOT to track**: Budget amounts, vote values, expense amounts, personal information.

### 8.3 Performance Monitoring

**Vercel Analytics** (built-in):
- Core Web Vitals per page
- Real User Monitoring (RUM)
- Geographic performance distribution

**Custom metrics** (PostHog):
- Real-time sync latency (time from DB change to UI update)
- Offline queue size (how many actions pending sync)
- Time to first vote (onboarding success metric)

### 8.4 Uptime Monitoring

**Supabase Dashboard**: Database health, connection count, query performance.

**External**: Simple uptime check on landing page (UptimeRobot free tier or similar). Alert if site is down.

**Target**: 99.9% uptime (8.7 hours downtime/year max).

---

## 10. Cost Analysis & Scaling

### 9.1 Phase 1 Costs (0-500 Users)

| Service | Tier | Monthly Cost | Limit |
|---------|------|-------------|-------|
| **Supabase** | Free | $0 | 500MB DB, 1GB storage, 50K MAU, **2 concurrent real-time connections** |
| **Vercel** | Free | $0 | 100GB bandwidth |
| **Google Maps** | Free tier | $0 | $200 credit = ~28K loads |
| **Sentry** | Developer | $0 | 5K events/month |
| **PostHog** | Free | $0 | 1M events/month |
| **GitHub** | Free | $0 | Unlimited repos |
| **Domain** | Annual | ~$1/month | .com domain |
| **Total** | | **~$1/month** | |

### 9.2 Growth Costs (500-5,000 Users)

| Service | Tier | Monthly Cost | What Changed |
|---------|------|-------------|--------------|
| **Supabase** | Pro | $25 | 8GB DB, 100GB storage, 100K MAU |
| **Vercel** | Pro | $20 | 1TB bandwidth, team features |
| **Google Maps** | Pay-as-go | ~$50-200 | 5K users × ~30 loads/month |
| **Sentry** | Team | $26 | 50K events/month |
| **PostHog** | Free | $0 | Still under 1M events |
| **Total** | | **~$120-270/month** | |

### 9.3 Revenue vs Cost Breakeven

At $39/year Pro subscription:
- 500 users × 5% conversion = 25 Pro subscribers = **$975/year = ~$81/month**
- 1,000 users × 8% conversion = 80 Pro subscribers = **$3,120/year = ~$260/month**

**Breakeven**: ~1,000 users with 8% Pro conversion covers all infrastructure costs.

### 9.4 Supabase Free Tier Real-Time Limitation

The free tier limits to **2 concurrent real-time connections**. This is a hard wall for a collaborative app — a single trip with 3 members viewing simultaneously would exceed it.

**Implication**: Supabase Pro ($25/month) is required from first real user testing with groups, not just at scale. Budget this from day one of collaborative feature development. The free tier is sufficient only for solo development and automated testing.

### 9.5 Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| **DB size** | >400MB | Upgrade to Supabase Pro ($25/mo) |
| **Real-time connections** | >200 concurrent | Review subscription architecture, add connection pooling |
| **Google Maps loads** | >$150/month | Implement aggressive caching, consider Mapbox for free tier users |
| **Build time** | >5 minutes | Optimize CI, add caching |
| **Bundle size** | >200KB gzipped | Audit imports, tree-shake, split chunks |

---

## 11. Competitive Tech Advantage

### 10.1 How Our Stack Beats Competitors

| Competitor | Their Stack Problem | Our Advantage |
|------------|-------------------|---------------|
| **Sygic** (est. 2004) | Legacy stack, custom sync. #1 complaint: "Desktop and mobile don't sync." | Supabase real-time = proven infrastructure, dramatically fewer sync issues |
| **Lambus** (est. 2017) | Custom backend, sync failures. "Changes lost or delayed." | PostgreSQL LISTEN/NOTIFY + optimistic locking = reliable sync with conflict detection |
| **Wanderlog** (est. 2019) | "Web version slows with long itineraries." Performance degrades at scale. | Vite code splitting + React 19 compiler = load only what's needed |
| **TripIt** (est. 2006) | Removed map from web version (user backlash). Legacy UI. | Modern PWA with Google Maps API from day one |
| **Polarsteps** (est. 2015) | "App crashes frequently." "Data loss." | TypeScript strict mode + Sentry + comprehensive testing = stability |

### 10.2 Architectural Moats

**1. RLS enables blind budgeting with zero application-layer access control code**:
- Firebase Security Rules and MongoDB `$redact` can achieve similar access control, but require writing and maintaining separate security logic
- RLS policies live next to the schema, are enforced regardless of which client (web, mobile, Edge Function) queries the data, and are testable with standard SQL
- The competitive advantage is convenience and reduced surface area for bugs, not impossibility for others

**2. Supabase real-time + optimistic locking enables trust**:
- Users see changes quickly → trust the app works
- Conflict detection prevents silent data loss (unlike competitors)
- Proven infrastructure reduces (but doesn't eliminate) sync edge cases vs custom solutions

**3. PWA enables web-first launch**:
- No app store review delays (Apple takes 1-7 days)
- Instant updates (deploy to Vercel → all users updated)
- Works on any device (no "download our app" friction)
- Add to home screen = feels native

**4. TypeScript + generated types prevent privacy leaks**:
- `PrivateBudget` vs `PublicBudgetSummary` types enforced at compile time
- Role permissions checked by the type system before runtime
- Database schema changes automatically surface all affected code

### 10.3 What Competitors Would Need to Match Us

| Feature | Competitor Effort to Match |
|---------|---------------------------|
| **Real-time sync reliability** | Full backend rewrite (6-12 months for Sygic/Lambus) |
| **Blind budgeting** | New database architecture + privacy layer (3-6 months) |
| **Role-based permissions** | Database-level RLS implementation (2-4 months) |
| **PWA offline support** | Service worker implementation (1-2 months) |
| **Modern performance** | Rewrite frontend to modern framework (4-8 months) |

**Combined effort**: 12-24 months for a competitor to match our stack advantages. By then, we have users, data, and brand.

---

## 12. Implementation Checklist

### Phase 0: Project Setup (Week 0, Days 1-3)

- [ ] Create GitHub repository with branch protection
- [ ] Scaffold Vite + React 19 + TypeScript project
- [ ] Configure Tailwind CSS v4
- [ ] Set up ESLint + Prettier
- [ ] Create Supabase project (production + local)
- [ ] Run first migration (initial schema)
- [ ] Generate TypeScript types from database
- [ ] Deploy to Vercel (empty app, verify pipeline)
- [ ] Set up Sentry error tracking
- [ ] Configure GitHub Actions CI workflow
- [ ] Add `vite-plugin-pwa` for PWA manifest
- [ ] Create `.env.local` template in README

### Phase 0.5: Developer Experience (Week 0, Days 3-5)

- [ ] Set up Vitest with jsdom environment
- [ ] Set up Playwright with mobile + desktop configs
- [ ] Create first test (smoke test: app renders)
- [ ] Configure bundle size budgets
- [ ] Set up Supabase local development workflow
- [ ] Create seed data script (test users, sample trip)
- [ ] Verify real-time subscriptions work locally
- [ ] Document local setup in README

### Ongoing: Quality Gates

- [ ] Every PR must pass: type-check + lint + unit tests
- [ ] Every feature must have: unit tests + at least 1 E2E test
- [ ] Every database change must: include migration + regenerated types
- [ ] Bundle size must not exceed budget without justification
- [ ] Core Web Vitals checked monthly via Vercel Analytics

---

## Cross-References

- **Database Schema**: [Web first mobile ready strategy](../Web%20first%20mobile%20ready%20strategy%C2%B7.md) (14-table schema + RLS policies)
- **Role Permissions**: [role-based-permissions-deep-dive.md](./role-based-permissions-deep-dive.md) (complete RLS policy set)
- **Blind Budgeting Privacy**: [blind-budgeting-deep-dive.md](./blind-budgeting-deep-dive.md) (privacy architecture)
- **Voting System**: [voting-system-deep-dive.md](./voting-system-deep-dive.md) (vote logic specifications)
- **Competitive Analysis**: [gap-analysis-competitive-positioning.md](./gap-analysis-competitive-positioning.md) (Section 2.1: Modern Tech Stack)

---

**Document Status**: Complete (v1.1 — revised after adversarial review)
**Last Updated**: February 8, 2026
**Lines**: ~1,230
**Ready for**: Phase 0 project setup when development begins
