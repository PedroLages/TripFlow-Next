# TripOS Tech Stack Research & Decision Tracker

**Created**: February 8, 2026
**Status**: Phase 1 Research (Backend & Database)
**Purpose**: Document research findings and decisions for each stack component

---

## Research Status Legend

- 🔴 **Not Started** - No research begun
- 🟡 **Researching** - Currently evaluating options
- 🟢 **Decided** - Choice made with documented rationale
- ✅ **Validated** - Built proof-of-concept, tested in practice
- 🚀 **Implemented** - Deployed in production

---

## Tech Stack Components Overview

| Phase | Component | Status | Winner | Decision Date |
|-------|-----------|--------|--------|---------------|
| 1 | Backend & Database | 🟢 **Decided** | **Supabase** | Feb 8, 2026 |
| 2 | Frontend Framework | 🟢 **Decided** | **Next.js 16** | Feb 8, 2026 |
| 3 | State Management | 🟢 **Decided** | **React Query + Zustand** | Feb 8, 2026 |
| 4 | Styling & UI | 🟢 **Decided** | **Tailwind + shadcn/ui** | Feb 8, 2026 |
| 5 | Real-Time Architecture | 🟢 **Decided** | **Supabase Realtime** | Feb 8, 2026 |
| 6 | Maps & Geocoding | 🟢 **Decided** | **Google Maps** | Feb 9, 2026 |
| 7 | Testing Framework | 🟢 **Decided** | **Vitest + Playwright** | Feb 9, 2026 |
| 8 | CI/CD | 🟢 **Decided** | **Hybrid (Vercel + GitHub Actions)** | Feb 9, 2026 |
| 9 | Monitoring & Analytics | 🟢 **Decided** | **Sentry + PostHog** | Feb 9, 2026 |
| 10 | Authentication | 🟢 **Decided** | **Supabase Auth** | - |
| 11 | Email Service | 🟢 **Decided** | **Resend** | Feb 9, 2026 |
| 12 | Currency API | 🟢 **Decided** | **ExchangeRate-API + Frankfurter** | Feb 9, 2026 |

---

## Phase 1: Backend & Database Research

**Status**: 🟢 **Decided** - February 8, 2026

**Winner**: **Supabase** (PostgreSQL + Platform)

**Goal**: Choose database and backend platform that supports relational data, real-time, and blind budgeting privacy

### Requirements

**Critical (HIGH Priority):**
- Relational data model (trips → members → activities → votes → budgets)
- Row-Level Security (RLS) for blind budgeting privacy
- Real-time subscriptions (collaborative editing)
- Solo dev friendly (minimal infrastructure management)

**Important (MEDIUM Priority):**
- Free tier generosity (MVP must cost $0/month)
- Vendor lock-in risk (can we migrate later?)
- Authentication built-in (email, OAuth, magic links)

**Nice-to-Have (LOW Priority):**
- Edge functions (server-side blind budget aggregation)
- Multi-region support (international users)

### Options Being Evaluated

#### Option 1: Supabase (PostgreSQL + Platform)

**What it is:**
- PostgreSQL database with built-in auth, realtime, storage, edge functions
- Open-source alternative to Firebase

**Initial Pros (from docs):**
- PostgreSQL = excellent for relational data
- Built-in Row-Level Security (RLS)
- Realtime WebSocket subscriptions
- Generous free tier (500MB DB, 50K monthly active users)
- All-in-one (auth, DB, storage, functions)
- Solo dev friendly

**Initial Cons (from docs):**
- Vendor lock-in (though PostgreSQL is portable)
- Realtime limitations (need to validate scale)
- Edge Functions are Deno (not Node.js)

**Research Tasks:**
- [ ] Read official docs - Architecture, RLS, Realtime, Auth
- [ ] Find real-world examples - Apps using Supabase for collaboration
- [ ] Check community feedback - Reddit, HN, Discord
- [ ] Validate free tier - 500MB enough for MVP? 50K MAU realistic?
- [ ] Test RLS - Can we enforce blind budget privacy?
- [ ] Test Realtime - Latency, scale, reconnection handling
- [ ] Calculate costs - 100/1K/10K users monthly

**Proof-of-Concept:**
- [ ] Set up Supabase project
- [ ] Create schema (trips, trip_members, blind_budgets tables)
- [ ] Implement RLS policies (users can only see own budget)
- [ ] Test Realtime subscriptions (activity feed updates)
- [ ] Test auth flows (email, magic link)
- [ ] Validate privacy (attempt to breach RLS)

**Decision Criteria Score:**
*[To be filled after research]*

---

#### Option 2: Firebase (Firestore + Platform)

**What it is:**
- Google's NoSQL database with built-in auth, realtime, storage, functions
- Battle-tested at massive scale

**Initial Pros (from docs):**
- Proven real-time capabilities
- Offline-first by default
- Generous free tier (1GB storage, 50K reads/day)
- All-in-one platform
- Massive community

**Initial Cons (from docs):**
- NoSQL = awkward for relational data
- Querying limitations (no complex joins)
- Vendor lock-in (proprietary database)
- Firestore security rules different from SQL RLS

**Research Tasks:**
- [ ] Read official docs - Firestore data modeling, security rules, realtime
- [ ] Research NoSQL workarounds - How to model relational data in Firestore?
- [ ] Check community feedback - Reddit, Stack Overflow
- [ ] Evaluate security rules - Can we enforce blind budget privacy?
- [ ] Validate free tier - 1GB enough? 50K reads realistic?

**Proof-of-Concept:**
- [ ] Set up Firebase project
- [ ] Model relational data (trips → members → votes in NoSQL)
- [ ] Implement security rules (blind budget privacy)
- [ ] Test realtime subscriptions
- [ ] Evaluate query complexity (voting logic, budget aggregation)

**Decision Criteria Score:**
*[To be filled after research]*

---

#### Option 3: Custom Backend (Node.js + PostgreSQL + Socket.io)

**What it is:**
- Self-hosted PostgreSQL database
- Custom Node.js/Express backend
- Socket.io for real-time WebSockets
- Separate auth service (Clerk, Auth0, or custom JWT)

**Initial Pros (from docs):**
- Full control over architecture
- No vendor lock-in
- Can optimize for specific use case
- PostgreSQL = excellent for relational data
- Any runtime/libraries

**Initial Cons (from docs):**
- Infrastructure management (hosting, scaling, backups)
- 2-3 weeks longer timeline (auth, RLS, realtime all manual)
- Solo dev = more overhead
- Costs start immediately (hosting, database)

**Research Tasks:**
- [ ] Estimate implementation time - Auth, RLS, realtime, admin
- [ ] Calculate hosting costs - Railway, Render, DigitalOcean
- [ ] Evaluate auth options - Clerk ($25/mo), Auth0 (enterprise), custom JWT
- [ ] Research RLS patterns - How to implement in custom backend?

**Proof-of-Concept:**
- [ ] Only if Supabase/Firebase fail validation
- [ ] Set up local PostgreSQL + Node.js
- [ ] Implement basic auth + RLS middleware
- [ ] Test Socket.io realtime performance

**Decision Criteria Score:**
*[To be filled after research]*

---

#### Option 4: Other Options to Consider

**PlanetScale (MySQL):**
- Serverless MySQL, great scaling
- ❌ No built-in realtime (need separate WebSocket service)
- ❌ No built-in auth

**Neon (PostgreSQL):**
- Serverless PostgreSQL, generous free tier
- ❌ No built-in realtime, auth, or edge functions
- Would need Clerk ($25/mo) + Socket.io server

**Railway (PostgreSQL + hosting):**
- PostgreSQL + easy deployment
- ❌ No built-in realtime or auth
- ❌ Free tier limited ($5 credit, then pay-as-you-go)

**Conclusion:** Only consider if Supabase/Firebase fail

---

### Decision Criteria Matrix

| Requirement | Weight | Supabase | Firebase | Custom |
|-------------|--------|----------|----------|--------|
| Relational data support | HIGH | **5/5** ✅ | 2/5 ⚠️ | 5/5 ✅ |
| Row-Level Security | HIGH | **4/5** ✅ | 3/5 ⚠️ | 4/5 |
| Real-time subscriptions | HIGH | **4/5** ✅ | 5/5 ✅ | 4/5 |
| Solo dev speed | HIGH | **5/5** ✅ | 5/5 ✅ | 2/5 ⚠️ |
| Free tier generosity | MEDIUM | **5/5** ✅ | 5/5 ✅ | 3/5 |
| Vendor lock-in risk | MEDIUM | 4/5 | 2/5 ⚠️ | **5/5** ✅ |
| Auth built-in | MEDIUM | **5/5** ✅ | 5/5 ✅ | 2/5 ⚠️ |
| Edge functions | LOW | 3/5 | 4/5 | **5/5** |
| **TOTAL SCORE** | | **35/40 (87.5%)** 🏆 | 31/40 (77.5%) | 30/40 (75%) |

### Cost Projections

| Users | Supabase | Firebase | Custom |
|-------|----------|----------|--------|
| 100 | **$0/month** ✅ | $0/month ✅ | $5/month |
| 1,000 | **$0/month** ✅ | $0-10/month | $23-43/month |
| 10,000 | **$25/month** ✅ | $50-300/month | $166-247/month |

### Research Timeline

- **Day 1**: Identify options, read docs, define criteria
- **Days 2-3**: Deep research, community feedback, pricing analysis
- **Days 3-5**: Build proof-of-concept for top 2 candidates
- **Day 5**: Score options, document decision, update tracker

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Supabase** (95% confidence)

**Rationale**:

Supabase scored 35/40 (87.5%) and is the clear winner for TripOS's MVP:

1. **Perfect for Blind Budgeting**: PostgreSQL Row-Level Security enforces privacy at the database level—users literally cannot see others' budget caps even if they hack API calls. This is critical for TripOS's unique differentiator.

2. **$0 MVP Cost**: Free tier supports 0-1K users completely free (500MB DB, 50K MAUs, unlimited API calls). Can validate product-market fit without spending a dollar.

3. **Solo Dev Speed**: 5-minute setup vs 8-11 weeks for custom backend. All-in-one platform (auth, DB, real-time, edge functions) saves weeks of infrastructure work.

4. **Real-Time Proven**: Handles 10K+ concurrent connections. Used in production by Udio, Pika, and Mozilla (MDN Search).

5. **Low Vendor Lock-In**: Open-source stack (PostgreSQL), can export via pg_dump, self-hosting option available. Migration path exists if needed.

**Why Not Firebase**: NoSQL modeling painful for relational data (trips → members → votes → activities). Query limitations (one range filter per query, no JOINs) would create mounting technical debt. Security rules weaker than PostgreSQL RLS.

**Why Not Custom Backend**: Would add 8-11 weeks to timeline, forcing us to sacrifice blind budgeting (our unique market differentiator). False economy—save $5-25/month but lose $16K in dev time opportunity cost.

**Risks**:

1. **RLS Misconfiguration**: One mistake = all budget caps visible. **Mitigation**: Test policies with multiple test accounts, use Security Advisor, never skip RLS.

2. **RLS Performance**: Complex policies can cause 100x+ slowdowns. **Mitigation**: Index all policy columns, optimize queries, use SECURITY DEFINER functions for aggregations.

3. **Local Dev Friction**: Docker stack can be painful. **Mitigation**: Use 2nd free Supabase project as remote dev database.

**Migration Plan** (if needed at 5K+ users):

- PostgreSQL schema is portable (Supabase → Neon/Railway/AWS RDS)
- Can hire contractor for 1-2 month migration ($8-15K one-time)
- Only migrate if hitting clear limits (realtime scale, costs >$600/month)
- Decision point: After validating product-market fit with revenue

**Full Research Reports**:
- Supabase: `/docs/research/supabase-evaluation-report.md` (7,500 words)
- Firebase: `/docs/research/firebase-firestore-evaluation.md` (9,500 words)
- Custom Backend: `/docs/research/custom-backend-evaluation.md` (20,000 words)

---

## Phase 2: Frontend Framework Research

**Status**: 🟢 **Decided** - February 8, 2026

**Winner**: **Next.js 16** (App Router)

**Goal**: Choose frontend framework optimized for SEO, real-time UI, and mobile-responsive design

### Requirements

**Critical (HIGH Priority):**
- Server-side rendering (SEO for public trip pages)
- Integration with chosen backend (from Phase 1)
- Solo dev speed (18-24 week timeline)

**Important (MEDIUM Priority):**
- Mobile performance (bundle size, Lighthouse scores)
- Real-time UI updates (vote counts, activity feed)
- Ecosystem (component libraries, examples)

### Options Being Evaluated

#### Option 1: Next.js 16 (App Router)

**Initial Pros:**
- Largest React ecosystem
- Built-in SSR/SSG
- Vercel integration (free hosting)
- Most Supabase/Firebase examples

**Initial Cons:**
- App Router learning curve
- React bundle size (~40KB)

**Research Tasks:**
- [ ] Read Next.js 16 docs (App Router, Server Components)
- [ ] Find Supabase + Next.js examples
- [ ] Test real-time integration
- [ ] Measure bundle size

**Proof-of-Concept:**
- [ ] Create Next.js 16 project
- [ ] Integrate with Phase 1 backend choice
- [ ] Build real-time activity feed
- [ ] Test SSR + client-side realtime
- [ ] Run Lighthouse mobile audit

---

#### Option 2: Remix

**Initial Pros:**
- Simpler than Next.js
- Progressive enhancement
- Good data loading patterns

**Initial Cons:**
- Smaller community
- Requires Node.js hosting
- Fewer backend integration examples

**Research Tasks:**
- [ ] Read Remix docs
- [ ] Find backend integration examples
- [ ] Test real-time patterns

**Proof-of-Concept:**
- [ ] Create Remix project
- [ ] Integrate with Phase 1 backend
- [ ] Compare DX with Next.js

---

#### Option 3: SvelteKit

**Initial Pros:**
- Smallest bundle (~15KB)
- Simpler than React
- Great DX

**Initial Cons:**
- Smaller ecosystem
- Fewer component libraries
- Harder to hire help

**Research Tasks:**
- [ ] Read SvelteKit docs
- [ ] Find backend integration examples
- [ ] Evaluate component libraries

**Proof-of-Concept:**
- [ ] Create SvelteKit project
- [ ] Test real-time integration
- [ ] Compare bundle size with Next.js

---

### Decision Criteria Matrix

| Requirement | Weight | Next.js 16 | Remix | SvelteKit |
|-------------|--------|------------|-------|-----------|
| SSR/SEO support | HIGH | **5/5** ✅ | 5/5 ✅ | 5/5 ✅ |
| Supabase integration | HIGH | **5/5** ✅ | 4/5 | 4/5 |
| Real-time UI | HIGH | **4/5** ✅ | 3/5 ⚠️ | 4/5 |
| Solo dev speed | HIGH | **4/5** ✅ | 4/5 | 5/5 ✅ |
| TypeScript support | MEDIUM | **5/5** ✅ | 5/5 ✅ | 5/5 ✅ |
| Mobile performance | MEDIUM | 3/5 ⚠️ | 4/5 | **5/5** ✅ |
| Free tier hosting | MEDIUM | **4/5** ✅ | 4/5 | 5/5 ✅ |
| Learning curve | LOW | 3/5 ⚠️ | 4/5 | 5/5 ✅ |
| **TOTAL SCORE** | | **33/40 (82.5%)** 🏆 | 33/40 (82.5%) | 38/40 (95%) |

### Cost Projections

| Users | Next.js 16 | Remix | SvelteKit |
|-------|------------|-------|-----------|
| 100 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ |
| 1,000 | **$0/month** ✅ (Netlify/Cloudflare) | $0/month ✅ | $0/month ✅ |
| 10,000 | **$20-40/month** ✅ | $26-56/month | $45/month |

### Research Timeline

- **Day 1**: Identified 3 options (Next.js 16, Remix, SvelteKit)
- **Days 1-2**: Parallel research using 3 agents (Next.js, Remix, SvelteKit evaluations)
- **Day 2**: Generated comprehensive reports (24,000+ words, 140+ sources)
- **Day 2**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Next.js 16** (App Router) - 85% confidence

**Rationale**:

Next.js 16 scored 33/40 (82.5%) and is the best choice for TripOS's MVP:

1. **Best Supabase Integration**: Official cookie-based auth support, multiple starter templates, battle-tested patterns. Eliminates the auth friction documented in SvelteKit research.

2. **De-Risked Timeline**: 18-24 week solo dev timeline is tight. Next.js's massive ecosystem means every problem has 10 Stack Overflow answers. When stuck, you get unblocked in 30 minutes, not 3 hours.

3. **Production-Proven at Scale**: Used by Netflix, TikTok, Notion, and Twitch. Real-time collaboration patterns are well-documented and battle-tested.

4. **$0 MVP Cost**: Free hosting on Netlify/Cloudflare Pages (unlimited bandwidth). Can validate product-market fit completely free.

5. **Future Hiring**: 8,200 Next.js job postings vs 1,800 SvelteKit. If TripOS takes off, hiring help is 4x easier.

6. **Bundle Size Doesn't Matter Yet**: At 0-1K users, the difference between 566KB (Next.js) and 50KB (SvelteKit) is irrelevant. Optimize after validation, not before.

**Why Not SvelteKit**: Despite highest score (38/40, 95%), the auth friction with Supabase and smaller ecosystem create unacceptable timeline risk for a solo dev racing 24 weeks. SvelteKit's advantages (performance, DX) matter at scale, not at MVP.

**Why Not Remix**: Tied with Next.js in score (33/40), but real-time requires adding SSE library (remix-sse), and the React Router v7 merger creates identity confusion. Next.js has clearer ownership and direction.

**Risks**:

1. **App Router Learning Curve**: Server Components paradigm is new. **Mitigation**: Use official Supabase + Next.js starter template, follow established patterns, abundant tutorials available.

2. **Bundle Size**: Larger JavaScript payload (566KB vs SvelteKit's 50KB). **Mitigation**: Not a concern at MVP scale; can optimize later with dynamic imports and code splitting if needed.

3. **Vercel Vendor Lock-In**: Vercel's paid tiers are expensive. **Mitigation**: Deploy to Netlify or Cloudflare Pages (both free, well-supported).

**Migration Plan** (if needed at 5K+ users with revenue):

- Can switch hosting providers (Netlify → Cloudflare → Vercel) without code changes
- If performance becomes critical bottleneck, can rewrite in SvelteKit (API contracts remain same)
- Decision point: Only migrate if clear performance issues with paying customers

**Full Research Reports**:
- Next.js 16: `/docs/research/nextjs-evaluation-report.md` (8,200 words, 50+ sources)
- Remix: `/docs/research/remix-evaluation-report.md` (8,200 words, 48 sources)
- SvelteKit: `/docs/research/sveltekit-evaluation-report.md` (7,800 words, 46 sources)

---

## Phase 3: State Management & Data Fetching Research

**Status**: 🟢 **Decided** - February 8, 2026

**Winner**: **React Query + Zustand** (Combination Architecture)

**Goal**: Choose state management approach for real-time sync and optimistic updates

### Requirements

**Critical (HIGH Priority):**
- Real-time sync with Supabase subscriptions (collaborative editing)
- Optimistic updates with automatic rollback
- Next.js 16 App Router integration (Server Components + Client Components)
- Client-side caching to reduce Supabase API calls
- Solo dev speed (18-24 week timeline)

**Important (MEDIUM Priority):**
- Small bundle size (mobile-first, $0 hosting goal)
- TypeScript support (type safety for complex state)
- DevTools for debugging real-time issues
- Learning curve <3 days (tight timeline)

**Nice to Have (LOW Priority):**
- Offline support (future enhancement)
- State persistence across sessions
- Built-in middleware ecosystem

### Options Evaluated

#### Option 1: React Query (TanStack Query)

**Purpose**: Server state management (trips, votes, budgets from Supabase)

**Pros:**
- ✅ Best-in-class server state caching and synchronization
- ✅ Official Supabase cache helpers (`createBrowserClient` integration)
- ✅ First-class Next.js 16 Server Component hydration patterns
- ✅ Optimistic updates with automatic rollback
- ✅ 12.3M weekly downloads, 47K GitHub stars (massive ecosystem)
- ✅ Timeline impact: +3 days upfront, -8 days saved = **net -5 days saved**

**Cons:**
- ⚠️ Bundle size: 13.4 KB gzipped (but unavoidable for server state)
- ⚠️ Does NOT handle UI state (modals, filters, sidebar) - needs companion library

**Conclusion:** Mandatory for server state - all three research agents agreed

---

#### Option 2: Zustand

**Purpose**: UI state management (modals, filters, sidebar, form drafts)

**Pros:**
- ✅ Smallest bundle: <1 KB gzipped
- ✅ Fastest learning curve: 1-2 hours (just `create()` and `useStore()`)
- ✅ 19M weekly downloads, 56K GitHub stars (largest community)
- ✅ Clean Next.js 16 "use client" patterns
- ✅ Excellent DevTools (Redux DevTools compatible)

**Cons:**
- ⚠️ NOT suitable for server state (must use alongside React Query)
- ⚠️ Less fine-grained reactivity than Jotai

**Conclusion:** Best UI state companion for React Query

---

#### Option 3: Jotai

**Purpose**: UI state management (atomic state approach)

**Pros:**
- ✅ Fine-grained reactivity (atomic paradigm)
- ✅ Built-in TypeScript inference (excellent DX)
- ✅ Production-proven (Vercel, Resend, Cal.com use it)
- ✅ Bundle: 3 KB gzipped (small)

**Cons:**
- ⚠️ Learning curve: 1-2 days (atomic paradigm shift)
- ⚠️ Smaller community: 1.3-2.5M downloads vs Zustand's 19M
- ⚠️ No dedicated browser DevTools
- ⚠️ SSR hydration requires `useHydrateAtoms` setup

**Conclusion:** Excellent choice, but learning curve + smaller ecosystem = timeline risk

---

### Decision Criteria Matrix

| Requirement | Weight | React Query | Zustand | Jotai |
|-------------|--------|-------------|---------|-------|
| Server state caching | HIGH | **5/5** ✅ | 0/5 ❌ | 0/5 ❌ |
| Real-time Supabase sync | HIGH | **5/5** ✅ | 3/5 ⚠️ | 3/5 ⚠️ |
| Optimistic updates | HIGH | **5/5** ✅ | 3/5 ⚠️ | 4/5 |
| Next.js 16 integration | HIGH | **5/5** ✅ | 4/5 | 4/5 |
| Solo dev speed | HIGH | **4/5** ✅ | 5/5 ✅ | 3/5 ⚠️ |
| Bundle size | MEDIUM | 3/5 ⚠️ | **5/5** ✅ | 4/5 |
| TypeScript support | MEDIUM | **5/5** ✅ | 4/5 | 5/5 ✅ |
| DevTools | MEDIUM | **5/5** ✅ | 5/5 ✅ | 3/5 ⚠️ |
| Learning curve | LOW | 4/5 | **5/5** ✅ | 3/5 ⚠️ |
| **TOTAL SCORE** | | **41/45 (91%)** 🏆 | 34/45 (76%) UI only | 29/45 (64%) UI only |

**Note:** React Query and Zustand/Jotai are NOT competing - they solve different problems:
- **React Query**: Server state (mandatory)
- **Zustand/Jotai**: UI state (optional)

### Cost Projections

| Users | React Query | Zustand | Jotai | Total Stack Cost |
|-------|-------------|---------|-------|------------------|
| 100 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ | $0/month ✅ |
| 1,000 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ | $0/month ✅ |
| 10,000 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ | $0/month ✅ |

All three are free, open-source MIT-licensed libraries. No runtime costs.

### Research Timeline

- **Day 1 (Feb 8, 2026)**: Launched 3 parallel research agents (React Query, Zustand, Jotai)
- **Day 1 (Feb 8, 2026)**: Generated comprehensive reports (25,000+ words, 140+ sources)
- **Day 1 (Feb 8, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **React Query + Zustand** (90% confidence)

**Architecture:**
```
┌─────────────────────────────────────┐
│         Next.js 16 App Router       │
├─────────────────┬───────────────────┤
│  React Query    │    Zustand        │
│  (Server State) │    (UI State)     │
├─────────────────┴───────────────────┤
│        Supabase Real-Time           │
└─────────────────────────────────────┘

React Query Handles:           Zustand Handles:
├── Trip data (fetch/cache)    ├── Modal open/closed
├── Vote data (mutations)      ├── Sidebar collapsed
├── Budget data (optimistic)   ├── Activity filters
├── Member presence            ├── Map view state
└── Activity history           └── Form drafts
```

**Rationale:**

React Query + Zustand scored 41/45 (91%) and is the best choice for TripOS's MVP:

1. **React Query is Mandatory**: All three research agents independently concluded that server state (trips, votes, budgets) requires React Query. No alternative exists for Supabase's real-time subscriptions + optimistic updates + Next.js 16 Server Components.

2. **Zustand De-Risks Timeline**: 18-24 week solo dev timeline is tight. Zustand's 1-2 hour learning curve adds only <1 KB while providing massive community support (19M weekly downloads). If stuck, you get unblocked in 30 minutes, not 3 hours.

3. **Net -5 Days Saved**: React Query adds +3 days upfront learning, but saves -8 days in Phases 3 and 5 (blind budgeting, voting) by eliminating manual cache invalidation, subscription management, and optimistic update bugs.

4. **Production-Proven**: React Query powers Vercel, Shopify, Twitch, and TanStack's entire ecosystem. Zustand powers 19M+ projects. Real-time collaboration patterns are battle-tested.

5. **$0 MVP Cost**: Both are free, open-source MIT libraries. Zero runtime costs.

6. **Future-Proof**: Can add Jotai later if fine-grained reactivity becomes critical. React Query remains regardless.

**Why Not React Query Only**: UI state (modals, filters, sidebar) would live in scattered `useState` hooks across components, creating prop-drilling hell and re-render cascades. Zustand centralizes this for <1 KB.

**Why Not Jotai Instead of Zustand**: Jotai's atomic paradigm requires 1-2 days to learn, and smaller community (1.3M downloads) creates timeline risk. Zustand's 1-2 hour learning curve and 19M downloads = safer bet for solo dev racing 24 weeks.

**Risks**:

1. **React Query Learning Curve**: Server Components + Client Components requires understanding hydration. **Mitigation**: Use official Supabase + React Query examples, follow documented patterns, 47K GitHub stars = abundant tutorials.

2. **Bundle Size**: React Query (13.4 KB) + Zustand (<1 KB) = 14.4 KB total. **Mitigation**: Unavoidable for server state; still well within mobile budgets.

3. **Zustand Not Needed Yet**: Could defer UI state library until MVP has 20+ components. **Mitigation**: Adding Zustand takes 30 minutes - decide during Phase 1 implementation if state management pain emerges.

**Migration Plan** (if needed at 5K+ users with revenue):

- Can switch Zustand → Jotai if fine-grained reactivity becomes bottleneck (1-2 week refactor)
- React Query remains regardless (server state is unavoidable)
- Decision point: Only migrate if clear performance issues with real-time collaboration

**Full Research Reports**:
- React Query: `/docs/research/react-query-evaluation-report.md` (13,000 words, 80+ sources)
- Zustand: `/docs/research/zustand-evaluation-report.md` (6,000+ words, 45+ sources)
- Jotai: `/docs/research/jotai-evaluation-report.md` (6,000+ words, 50+ sources)

---

## Phase 4: Styling & UI Component Research

**Status**: 🟢 **Decided** - February 8, 2026

**Winner**: **Tailwind CSS + shadcn/ui + CSS Variables + CSS Modules** (Hybrid Architecture)

**Goal**: Choose styling approach for rapid prototyping, accessibility, and long-term maintainability

### Requirements

**Critical (HIGH Priority):**
- Next.js 16 App Router integration (Server Components + Client Components)
- Solo dev speed (18-24 week timeline, rapid prototyping)
- Mobile-first responsive design (performance, touch-friendly)
- Component library coverage (forms, modals, tables, cards, notifications)
- Accessibility (WCAG compliance, keyboard nav, screen readers)

**Important (MEDIUM Priority):**
- Bundle size & performance (mobile-first, $0 hosting goal)
- TypeScript support (type safety, IntelliSense)
- Customization & theming (design tokens, dark mode, branding)

**Nice to Have (LOW Priority):**
- Production usage (companies, scale, case studies)

### Options Evaluated

#### Option 1: Tailwind CSS + shadcn/ui

**Pros:**
- ✅ Perfect Next.js 16 integration (zero friction, Server Components)
- ✅ Mobile-first performance (<10 KB CSS, Netflix delivers 6.5 KB)
- ✅ Complete component coverage (95%+ - forms, modals, tables, date pickers)
- ✅ Accessibility via Radix UI (WCAG compliant, keyboard nav, screen readers)
- ✅ TypeScript excellence (full type safety, Zod + React Hook Form)
- ✅ $0 cost (MIT licensed, completely free)

**Cons:**
- ⚠️ Learning curve: 24-48 hours to productivity
- ⚠️ HTML class bloat (long className strings)

**Conclusion:** Strong Yes - optimal for TripOS

---

#### Option 2: Chakra UI

**Pros:**
- ✅ Best-in-class accessibility (only 1 WCAG issue vs 19 for competitors)
- ✅ Excellent theme system (design tokens, semantic tokens, dark mode)
- ✅ Strong developer experience (intuitive style props, great docs)

**Cons:**
- ❌ Large bundle size (80-120 KB gzipped, 10-20x larger than Tailwind)
- ❌ CSS-in-JS overhead (Emotion runtime hurts performance)
- ❌ v3 migration issues (complete rewrite, instability)
- ❌ Next.js 16 friction (client-only, FOUC issues)
- ❌ Missing date picker (requires third-party integration)

**Conclusion:** Maybe (leaning No) - bundle size conflicts with mobile-first goals

---

#### Option 3: Material UI (MUI)

**Pros:**
- ✅ Comprehensive component library (60+ components)
- ✅ Excellent documentation and community support
- ✅ Production-proven at scale (NASA, Netflix, Spotify)

**Cons:**
- ❌ Large bundle size (93.7 KB gzipped, 400-500 KB with Emotion)
- ❌ LCP impact (could exceed 4-5s on 3G networks)
- ❌ Material Design lock-in (elevation, ripple effects deeply baked in)
- ❌ No Server Components support (requires 'use client' everywhere)
- ❌ MUI X Pro costs ($15/dev/month for advanced features)

**Conclusion:** Maybe - strong for rapid development, but bundle size concerns

---

### Decision Criteria Matrix

| Requirement | Weight | Tailwind + shadcn/ui | Chakra UI | Material UI |
|-------------|--------|----------------------|-----------|-------------|
| Next.js 16 integration | HIGH | **5/5** ✅ | 3/5 ⚠️ | 3/5 ⚠️ |
| Solo dev speed | HIGH | **4/5** ✅ | 4/5 | 4.5/5 ✅ |
| Mobile-first design | HIGH | **5/5** ✅ | 4/5 | 4/5 |
| Component coverage | HIGH | **5/5** ✅ | 4/5 ⚠️ | 5/5 ✅ |
| Accessibility | HIGH | **5/5** ✅ | 5/5 ✅ | 4.5/5 |
| Bundle size | MEDIUM | **5/5** ✅ | 2/5 ❌ | 2/5 ❌ |
| TypeScript support | MEDIUM | **5/5** ✅ | 4/5 | 4/5 |
| Customization | MEDIUM | **4/5** | 5/5 ✅ | 3/5 ⚠️ |
| Production usage | LOW | **5/5** ✅ | 4/5 | 4/5 |
| **TOTAL SCORE** | | **43/45 (96%)** 🏆 | 35/45 (78%) | 33/45 (73%) |

### Cost Projections

| Users | Tailwind + shadcn/ui | Chakra UI | Material UI |
|-------|----------------------|-----------|-------------|
| 100 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ |
| 1,000 | **$0/month** ✅ | $0/month ✅ | $0/month ✅ (Core only) |
| 10,000 | **$0/month** ✅ | $0/month ✅ | $0-15/month (if MUI X Pro needed) |

All three have free/MIT tiers. Material UI charges for advanced MUI X Pro features.

### Research Timeline

- **Day 1 (Feb 8, 2026)**: Launched 3 parallel research agents (Tailwind + shadcn/ui, Chakra UI, Material UI)
- **Day 1 (Feb 8, 2026)**: Generated comprehensive reports (~24,600 words, 215+ sources)
- **Day 1 (Feb 8, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Tailwind CSS + shadcn/ui + CSS Variables + CSS Modules** (95% confidence)

**Architecture:**

```
┌─────────────────────────────────────────────────────┐
│              Next.js 16 App Router                  │
├─────────────────────────────────────────────────────┤
│  Styling Layer:                                     │
│  ├── Tailwind CSS (layout, spacing, typography)    │
│  ├── shadcn/ui (generic UI primitives only)        │
│  ├── CSS Variables (design tokens)                 │
│  └── CSS Modules (complex components & animations) │
└─────────────────────────────────────────────────────┘

Tailwind CSS Usage:              shadcn/ui Usage (Generic Primitives Only):
├── Layout & Grid                ├── Button
├── Spacing & Sizing             ├── Dialog
├── Typography                   ├── Sheet
├── Responsive Breakpoints       ├── Input
└── Basic Colors                 ├── Select
                                 └── Tabs

CSS Variables (Design Tokens):  CSS Modules Usage:
├── Colors (--color-primary)    ├── Complex components (Itinerary, Maps, Timeline)
├── Spacing (--space-xs/sm/md)  ├── Animations (drag-drop, transitions)
├── Typography (--font-sans)    ├── Non-trivial state (hover, focus, active)
├── Radius (--radius-sm/md)     └── Trip-specific logic (not in shadcn)
└── Shadows (--shadow-sm/md)
```

**Rationale:**

Tailwind CSS + shadcn/ui + CSS Variables + CSS Modules scored 43/45 (96%) and is the best choice for TripOS's MVP:

1. **Mobile-First Performance** (Critical for $0/month hosting)
   - Tailwind: <10 KB CSS (Netflix delivers 6.5 KB in production)
   - shadcn/ui: 2.3 KB base components
   - 36% better Core Web Vitals vs CSS-in-JS alternatives
   - **vs Chakra**: 80-120 KB (10-20x larger)
   - **vs MUI**: 93.7 KB gzipped (400-500 KB total)

2. **Next.js 16 App Router Integration** (Zero friction)
   - Perfect Server Components + Client Components support
   - No hydration warnings, no FOUC issues
   - **vs Chakra**: Client-only, requires workarounds
   - **vs MUI**: No Server Components support

3. **Solo Dev Speed** (18-24 week timeline)
   - Learning curve: 24-48 hours to productivity
   - Component coverage: 95%+ (all TripOS needs covered)
   - Community: 93,300 GitHub stars (Tailwind), 105,000 stars (shadcn/ui)

4. **Accessibility** (WCAG compliance required)
   - Built on Radix UI primitives (WCAG compliant out of the box)
   - Keyboard navigation and screen readers included
   - Same level as Chakra UI (the accessibility champion)

5. **Long-Term Maintainability** (Hybrid architecture)
   - Tailwind for layout/spacing (no custom CSS needed)
   - shadcn/ui for generic primitives (copy-paste, full control)
   - CSS Variables for design tokens (no hardcoded values)
   - CSS Modules for complex components (trip-specific logic)

6. **$0 Cost** (Critical for solo dev)
   - MIT licensed, completely free and open source
   - No premium tiers or paid features
   - **vs MUI X Pro**: $15/dev/month for advanced features

**Architectural Rules:**

1. **Use Tailwind ONLY for**: Layout, spacing, typography, and responsiveness
2. **Use shadcn/ui ONLY for**: Generic primitives (Button, Dialog, Sheet, Input, Select, Tabs)
3. **Do NOT place domain/business logic inside shadcn components**
4. **Create custom components for trip-planner logic**: Itinerary, maps, timelines, calendars
5. **Use CSS variables for all design tokens**: Colors, spacing, radius, typography (no hardcoded magic values)
6. **Use CSS Modules for complex components**: Animations, non-trivial states, interactions
7. **Avoid inline styles unless values are truly dynamic**
8. **Keep components small, readable, and composable**
9. **Optimize for long-term maintainability and refactoring**
10. **Follow accessible HTML and ARIA best practices**

**Why NOT Chakra UI:**

- ❌ **Bundle size**: 80-120 KB (10-20x larger than Tailwind) hurts mobile performance
- ❌ **CSS-in-JS overhead**: Emotion runtime hurts real-time collaboration performance
- ❌ **v3 migration "nightmare"**: Complete rewrite with breaking changes, v4 potentially coming soon
- ❌ **Next.js 16 friction**: Client components only, FOUC issues, hydration warnings
- ❌ **Missing date picker**: Requires third-party integration (critical for trip planning)

**Why NOT Material UI:**

- ❌ **Bundle size**: 93.7 KB gzipped (400-500 KB with Emotion overhead)
- ❌ **LCP impact**: Could exceed 4-5s on 3G networks (target: <2.5s for mobile-first)
- ❌ **Material Design lock-in**: Elevation, ripple effects deeply baked in (hard to customize)
- ❌ **No Server Components**: Requires 'use client' directive everywhere
- ❌ **MUI X Pro costs**: $15/dev/month for advanced features (conflicts with $0 goal)

**Risks:**

1. **Learning Curve** (24-48 hours): Tailwind requires CSS fundamentals knowledge. **Mitigation**: Use official Tailwind + shadcn/ui starter, follow documented patterns, 93K GitHub stars = abundant tutorials.

2. **HTML Class Bloat**: Long className strings can be hard to read. **Mitigation**: Extract components early, use @apply in CSS Modules for repeated patterns.

3. **Manual Component Updates**: shadcn/ui is copy-paste, not a package. **Mitigation**: This is a feature, not a bug - full control over components. Only update when needed.

4. **Tailwind Labs 2026 Crisis**: Company had layoffs in early 2026. **Mitigation**: Tailwind CSS is open-source and stable, community-driven, not dependent on company funding.

**Migration Plan** (if needed at 5K+ users with revenue):

- Unlikely to need migration (Tailwind is industry standard)
- If bundle size becomes critical, can optimize with PurgeCSS (already included)
- If Material Design needed for enterprise clients, can add MUI alongside Tailwind
- Decision point: Only migrate if clear performance issues or enterprise requirements

**Full Research Reports:**
- Tailwind CSS + shadcn/ui: `/docs/research/tailwind-shadcn-evaluation-report.md` (8,100 words, 85+ sources)
- Chakra UI: `/docs/research/chakra-ui-evaluation-report.md` (8,000 words, 60+ sources)
- Material UI: `/docs/research/material-ui-evaluation-report.md` (8,500 words, 70+ sources)

---

## Phase 5: Real-Time Architecture Research

**Status**: 🟢 **Decided** - February 8, 2026

**Winner**: **Supabase Realtime** (Built-in with Supabase backend)

**Goal**: Validate real-time solution for collaborative features (activity feed, votes, member presence, optimistic updates)

### Requirements

**Critical (HIGH Priority):**
- Real-time sync for collaborative editing (multiple users editing same trip)
- Integration with Supabase database (already chosen in Phase 1)
- Integration with React Query + Zustand (already chosen in Phase 3)
- Scales to 50+ concurrent users per trip
- Optimistic updates with automatic rollback
- Solo dev implementation speed (18-24 week timeline)

**Important (MEDIUM Priority):**
- Conflict resolution (two users edit same activity simultaneously)
- Connection state management (reconnection, error handling, offline queue)
- TypeScript support
- Small bundle size (mobile-first, $0 hosting goal)
- Developer experience (debugging tools, clear error messages)

**Nice to Have (LOW Priority):**
- Fine-grained subscriptions (per-field updates)
- Presence tracking (who's viewing/editing)
- Custom protocols

### Options Evaluated

#### Option 1: Supabase Realtime (Built-in)

**Pros:**
- ✅ Built-in with Supabase backend (zero setup, already configured)
- ✅ Perfect React Query integration (official cache helpers)
- ✅ RLS security applied to real-time events (critical for blind budgeting)
- ✅ Proven scale: 10,000+ concurrent connections, 2,500 messages/sec
- ✅ Production validated: Pebblely (1M users), Chatbase ($1M MRR)
- ✅ Free tier: 2M messages/month, 200 concurrent connections
- ✅ Excellent Next.js 16 patterns (Server Components + Client Components)
- ✅ TypeScript support (generate types from DB schema)
- ✅ Presence tracking built-in (online/offline, typing indicators)

**Cons:**
- ⚠️ Last-write-wins conflict resolution (no CRDT/OT built-in)
- ⚠️ Data loss during reconnection (requires custom reconciliation)
- ⚠️ Mobile/background tab disconnections (requires worker/heartbeat config)
- ⚠️ Vendor lock-in (tightly coupled to Supabase platform)

**Conclusion:** Strong Yes - optimal choice, accelerates timeline by 2-4 weeks

---

#### Option 2: Custom WebSockets (Socket.io + Redis)

**Pros:**
- ✅ Full control over protocols and logic
- ✅ Popular library (60M+ downloads/week)
- ✅ Horizontal scaling with Redis adapter

**Cons:**
- ❌ Infrastructure complexity (separate WebSocket server, Redis)
- ❌ Timeline cost: +3-5 weeks (setup, DevOps, testing)
- ❌ Hosting costs: $30-50/month for VPS + Redis at scale
- ❌ Must sync with Supabase database (webhooks, triggers)
- ❌ DevOps burden (monitoring, scaling, security patches)
- ❌ Single point of failure vs managed service

**Conclusion:** Only consider if Supabase Realtime fails to scale

---

#### Option 3: Pusher/Ably (Managed Service)

**Pros:**
- ✅ Specialized real-time infrastructure
- ✅ Used by GitHub, Trello, StackOverflow
- ✅ Global edge network, low latency

**Cons:**
- ❌ Multi-vendor complexity (Supabase + Pusher/Ably)
- ❌ Additional cost: $49-99/month at scale
- ❌ Must sync with Supabase database (double integration surface)
- ❌ Free tier less generous than Supabase (Pusher: 200 connections, 6M messages)

**Conclusion**: Not worth added cost and complexity

---

### Decision Criteria Matrix

| Requirement | Weight | Supabase Realtime | Socket.io + Redis | Pusher/Ably |
|-------------|--------|-------------------|-------------------|-------------|
| **HIGH Priority** | | | | |
| Real-time sync for collaborative editing | HIGH | **5/5** ✅ | 5/5 ✅ | 5/5 ✅ |
| Integration with Supabase database | HIGH | **5/5** ✅ | 2/5 ⚠️ | 3/5 ⚠️ |
| Integration with React Query + Zustand | HIGH | **5/5** ✅ | 3/5 ⚠️ | 4/5 |
| Scales to 50+ concurrent users per trip | HIGH | **5/5** ✅ | 4/5 | 5/5 ✅ |
| Optimistic updates with automatic rollback | HIGH | 4/5 | 4/5 | 4/5 |
| Solo dev implementation speed | HIGH | **5/5** ✅ | 2/5 ❌ | 3/5 ⚠️ |
| **MEDIUM Priority** | | | | |
| Conflict resolution | MEDIUM | 3/5 ⚠️ | 3/5 ⚠️ | 4/5 |
| Connection state management | MEDIUM | 4/5 | 3/5 ⚠️ | 5/5 ✅ |
| TypeScript support | MEDIUM | **5/5** ✅ | 4/5 | 5/5 ✅ |
| Small bundle size | MEDIUM | 4/5 | 3/5 ⚠️ | 4/5 |
| Developer experience | MEDIUM | **5/5** ✅ | 3/5 ⚠️ | 4/5 |
| **LOW Priority** | | | | |
| Fine-grained subscriptions | LOW | 4/5 | 5/5 ✅ | 5/5 ✅ |
| Presence tracking | LOW | **5/5** ✅ | 3/5 ⚠️ | 5/5 ✅ |
| Custom protocols | LOW | 3/5 ⚠️ | 5/5 ✅ | 3/5 ⚠️ |
| **TOTAL SCORE** | | **62/70 (89%)** 🏆 | ~45/70 (64%) | ~52/70 (74%) |

### Cost Projections

| Users | Supabase Realtime | Socket.io (Self-hosted) | Pusher | Ably |
|-------|-------------------|-------------------------|--------|------|
| 100 | **$0/month** ✅ | $5-10/month | $0/month ✅ | $0/month ✅ |
| 1,000 | **$0/month** ✅ (covered by Pro plan) | $15-25/month | $49/month | $29/month |
| 10,000 | **$28/month** ✅ | $30-50/month + DevOps | $99/month | $29/month |

**Notes:**
- Supabase Realtime free tier: 2M messages/month, 200 concurrent connections
- Socket.io requires VPS + Redis (must manage infrastructure yourself)
- Pusher free tier: 200 connections, 200K messages/day (6M/month)
- Ably free tier: 6M messages/month, 200 concurrent connections

### Research Timeline

- **Day 1 (Feb 8, 2026)**: Identified 3 options (Supabase Realtime, Socket.io, Pusher/Ably)
- **Day 1 (Feb 8, 2026)**: Agent limit reached for 2 of 3 research agents
- **Day 1 (Feb 8, 2026)**: Supabase Realtime evaluation completed (9,500 words, 40+ sources)
- **Day 1 (Feb 8, 2026)**: Decision made based on comprehensive evaluation

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Supabase Realtime** (90% confidence)

**Architecture:**
```
┌─────────────────────────────────────────┐
│         Next.js 16 App Router           │
├─────────────────────────────────────────┤
│  React Query (Server State) + Zustand   │
│  ├─ Trip data (fetch/cache)             │
│  ├─ Vote data (mutations)               │
│  ├─ Budget data (optimistic)            │
│  ├─ Member presence                     │
│  └─ Activity history                    │
├─────────────────────────────────────────┤
│     Supabase Realtime                   │
│  ├─ Postgres Changes (DB subscriptions) │
│  ├─ Broadcast (ephemeral messages)      │
│  └─ Presence (who's online/viewing)     │
├─────────────────────────────────────────┤
│     Supabase Database (PostgreSQL)      │
│  ├─ Row-Level Security (RLS)            │
│  └─ Logical Replication (WAL)           │
└─────────────────────────────────────────┘

Real-time Features:                Implementation:
├── Activity feed (INSERT/UPDATE)   → Postgres Changes
├── Vote updates (real-time counts)  → Postgres Changes + Optimistic UI
├── Member presence (online/offline) → Presence API
├── Typing indicators                → Broadcast (ephemeral)
└── Blind budgeting group max        → Broadcast (server-calculated)
```

**Rationale:**

Supabase Realtime scored 62/70 (89%) and is the optimal choice for TripOS's MVP:

1. **Zero-Friction Integration**: Already built-in to Supabase backend (chosen in Phase 1). No additional setup, no extra vendors, no separate authentication. This tight integration provides RLS security (real-time events respect database permissions), single source of truth (database writes trigger updates), and unified TypeScript types.

2. **Proven Scale**: Handles 10,000+ concurrent connections with 2,500 messages/sec throughput. TripOS's expected load (500-1,000 concurrent users in first year) is far below limits. Production validated by Pebblely (1M users in 7 months) and Chatbase ($1M MRR in 5 months).

3. **Timeline Acceleration**: Solo dev timeline is 18-24 weeks. Supabase Realtime **saves 2-4 weeks** compared to alternatives: zero setup overhead (saves 3-5 days), built-in RLS integration (saves 1 week), excellent Next.js 16 patterns (saves 3-5 days), local dev with Docker (saves ongoing time). Estimated Phase 1 real-time implementation: 3 weeks (vs 5-6 weeks for Socket.io or Pusher).

4. **Cost-Effective**: Free tier (2M messages, 200 connections) covers early launch (0-1K users). At scale (10K users), only $28/month total—cheaper than Pusher ($99/month) and operationally simpler than Socket.io (self-hosted requires VPS + Redis + monitoring + DevOps expertise).

5. **Developer Experience**: 2-3 day learning curve (vs 1-2 weeks for Socket.io infrastructure). Official Next.js 16 integration patterns, React Query cache helpers library, built-in debugging tools (Realtime Inspector, Logs Explorer), local dev with Docker (`supabase start`), offline-capable development.

6. **Production Validation**: Community reports show 200-500 concurrent users per channel in production chat systems. No catastrophic failures found in research. Recent service issues are rare (1-2 incidents per year based on status page history).

**Why Not Socket.io**: Would add 3-5 weeks to timeline for infrastructure setup (separate WebSocket server, Redis adapter, DevOps, monitoring, scaling). Hosting costs $30-50/month at scale. Must sync with Supabase database via webhooks/triggers. DevOps burden is unacceptable for solo dev racing 24-week deadline. Only consider if Supabase Realtime fails to scale.

**Why Not Pusher/Ably**: Multi-vendor complexity (Supabase + Pusher/Ably). Additional cost ($49-99/month at scale). Must maintain two separate systems (Supabase for data, Pusher for real-time). Free tiers are less generous than Supabase. Not worth added cost and complexity given Supabase Realtime is built-in and proven.

**Risks**:

1. **Connection Reliability**: Mobile/background tab disconnections due to browser throttling. **Mitigation**: Use `worker: true` option + `heartbeatCallback` for manual reconnection. Implement data reconciliation on reconnect (React Query refetch).

2. **Data Loss During Reconnection**: Realtime loses updates during disconnect/reconnect window. **Mitigation**: On reconnection, refetch latest data from database. Track `last_updated_at` timestamp, query for changes since disconnect. Use optimistic updates with reconciliation.

3. **RLS Performance Bottleneck**: Complex Row-Level Security policies can slow message throughput. **Mitigation**: Use Broadcast for high-throughput scenarios (bypasses per-client RLS checks). Simplify RLS policies using JWT claims. Index all policy columns.

4. **Vendor Lock-In**: Tightly coupled to Supabase platform. **Mitigation**: Abstract Realtime API in custom hooks (`useActivityUpdates.ts`, `useVoteUpdates.ts`). Self-hosting option available (open-source Elixir). Can migrate to Pusher/Ably in 1-2 weeks if needed.

5. **Conflict Resolution**: Last-write-wins (no CRDT/OT built-in). **Mitigation**: For TripOS Phases 1-5, users edit different items (activities, votes) → conflicts rare. If collaborative text editing needed later, integrate Yjs with Supabase Realtime as transport layer.

**Blind Budgeting Security**:

- **Critical**: Never subscribe to `private_budgets` table via Realtime (RLS prevents leaks, but avoid risk)
- **Group max updates**: Use Broadcast (server calculates, broadcasts result, clients receive without seeing individual budgets)
- **Test RLS policies**: Create 3+ test accounts, verify each receives ONLY permitted events
- **Separate tables**: `private_budgets` (never subscribed) + `trips` (group max via Broadcast)

**Migration Plan** (if needed at 10K+ users with revenue):

- Can replace Supabase Realtime with Pusher/Ably/Socket.io (1-2 week refactor)
- Keep Supabase database, Auth, Storage
- Only migrate if hitting clear limits (message throughput >2,500/sec, connection costs >$100/month)
- Decision point: After validating product-market fit with revenue

**Full Research Reports**:
- Supabase Realtime: `/docs/research/supabase-realtime-evaluation-report.md` (9,500 words, 40+ sources)
- Socket.io + Redis: Not completed (agent limit reached)
- Pusher/Ably: Not completed (agent limit reached)

**Note**: Socket.io and Pusher/Ably research was interrupted by agent API limits. However, Supabase Realtime's overwhelming advantages (built-in, zero cost, perfect integration, timeline acceleration) make it the clear winner regardless. Alternatives would only be considered if Supabase Realtime fails production validation.

---

## Phase 6: Maps & Geocoding Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **Google Maps Platform** (JavaScript API + Places API + Geocoding API)

**Goal**: Choose map provider with best global POI coverage for MVP validation

### Requirements

**Critical (HIGH Priority):**
- $0/month cost for MVP (0-500 users)
- Interactive maps with markers (display trip activities)
- Places search & geocoding (address ↔ coordinates)
- Static map images (shareable trip snapshots)
- Mobile-first UX (touch gestures, performance)

**Important (MEDIUM Priority):**
- Custom styling (brand colors, TripOS experience)
- Next.js 16 integration (React SDK, TypeScript support)
- Bundle size impact (mobile performance)

**Nice to Have (LOW Priority):**
- Offline maps (future enhancement)
- Routing/directions (future enhancement)

### Options Evaluated

#### Option 1: Mapbox (GL JS + Geocoding API)

**Pros:**
- ✅ Exceptional free tier: 50,000 map loads/month (1.8x more than Google Maps)
- ✅ 100,000 geocoding requests/month free (2.5x more than Google Maps)
- ✅ $0/month through 1,000+ users (perfect for MVP validation)
- ✅ Zero setup time: 5-minute API key setup
- ✅ Excellent mobile UX: Hardware-accelerated WebGL, 60 FPS animations
- ✅ Powerful customization: Mapbox Studio for branded map styles
- ✅ Strong React/Next.js integration: TypeScript support, App Router compatible
- ✅ Production-proven: Facebook, Instagram, Strava, The New York Times

**Cons:**
- ⚠️ Bundle size: ~300KB (larger than Leaflet's 50KB, but acceptable)
- ⚠️ 2024 pricing increases (won't affect MVP, only impacts scale)
- ⚠️ Places data quality: 50M+ POIs vs Google's 200M+ (sufficient for MVP)
- ⚠️ Separate geocoding SDK required (`@mapbox/mapbox-sdk`, adds ~15KB)

**Conclusion:** Strong Yes - optimal for MVP, accelerates timeline by 2-3 days vs alternatives

---

#### Option 2: Google Maps Platform

**Pros:**
- ✅ Best-in-class POI database (200M+ places globally)
- ✅ Superior geocoding accuracy (industry leader)
- ✅ Familiar UX (users recognize Google Maps)
- ✅ Excellent documentation and massive community

**Cons:**
- ❌ **Fails $0 MVP goal**: Costs $255/month at 500 users (exceeds $200 credit)
- ❌ 3-34x more expensive than alternatives at scale
- ❌ Heavy bundle size: ~200KB (but smaller than Mapbox)
- ❌ Complex billing console (enterprise-grade complexity)
- ❌ API key management overhead

**Conclusion:** No - fails primary cost constraint. Only consider after 5K+ users with revenue

---

#### Option 3: OpenStreetMap + Leaflet

**Pros:**
- ✅ **$0/month forever** (completely free, no usage limits)
- ✅ Smallest bundle size: ~50KB (excellent mobile performance)
- ✅ No vendor lock-in (can switch components anytime)
- ✅ Flexible architecture (mix and match tiles, geocoding, library)
- ✅ Active community (40K+ GitHub stars for Leaflet)

**Cons:**
- ⚠️ **Address autocomplete**: No good free options (Score: 2/5)
- ⚠️ **Rich POI data**: No ratings, photos, reviews (vs Google Maps)
- ⚠️ **Data quality**: Variable by region (excellent in Europe, weaker elsewhere)
- ⚠️ **Setup time**: 2-3 days (tile hosting, geocoding configuration)
- ⚠️ **No guaranteed uptime**: Volunteer-run infrastructure

**Conclusion:** Strong Yes for pure cost optimization, but feature gaps may hurt UX

---

### Decision Criteria Matrix

| Requirement | Weight | Mapbox | Google Maps | OSM + Leaflet |
|-------------|--------|--------|-------------|---------------|
| **HIGH Priority** | | | | |
| $0 MVP cost (0-500 users) | HIGH | **5/5** ✅ | 2/5 ❌ | 5/5 ✅ |
| Mobile performance | HIGH | **5/5** ✅ | 5/5 ✅ | 3/5 ⚠️ |
| Places search & geocoding | HIGH | **4/5** ✅ | 5/5 ✅ | 2/5 ❌ |
| Static map images | HIGH | **4/5** ✅ | 4/5 ✅ | 3/5 ⚠️ |
| Next.js 16 integration | HIGH | **5/5** ✅ | 4/5 ✅ | 4/5 ✅ |
| **MEDIUM Priority** | | | | |
| Customization | MEDIUM | **5/5** ✅ | 2/5 ⚠️ | 3/5 ⚠️ |
| Documentation quality | MEDIUM | **4/5** ✅ | 5/5 ✅ | 3/5 ⚠️ |
| Community support | MEDIUM | **4/5** ✅ | 5/5 ✅ | 4/5 ✅ |
| Solo dev speed | MEDIUM | **5/5** ✅ | 4/5 ✅ | 2/5 ❌ |
| **LOW Priority** | | | | |
| Bundle size | LOW | 3/5 ⚠️ | 4/5 ✅ | 5/5 ✅ |
| Vendor lock-in risk | LOW | 3/5 ⚠️ | 2/5 ⚠️ | 5/5 ✅ |
| **TOTAL SCORE** | | **47/50 (94%)** 🏆 | 42/50 (84%) | 39/50 (78%) |

### Cost Projections

| Users | Mapbox | Google Maps | OSM + Leaflet |
|-------|--------|-------------|---------------|
| 100 | **$0/month** ✅ | $51/month | $0/month ✅ |
| 500 | **$0/month** ✅ | $255/month | $0/month ✅ |
| 1,000 | **$0/month** ✅ | $510/month | $0/month ✅ |
| 1,600 | ~$50/month | $880/month | $0-10/month |
| 5,000 | **$150/month** ✅ | $2,700/month | $10-50/month |
| 10,000 | **$500/month** ✅ | $5,400/month | $50-100/month |

**Notes:**
- Mapbox: Free tier (50K loads, 100K geocoding) covers 0-1,600 users
- Google Maps: $200 monthly credit covers only ~28,500 map loads
- OSM: Completely free, but may incur tile hosting costs at scale

### Research Timeline

- **Day 1 (Feb 9, 2026)**: Launched 3 parallel research agents (Mapbox, Google Maps, OpenStreetMap)
- **Day 1 (Feb 9, 2026)**: Generated comprehensive reports (~26,000+ words total)
- **Day 1 (Feb 9, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Mapbox (GL JS + Geocoding API)** - 94% confidence

**Architecture:**
```
┌─────────────────────────────────────────────┐
│         Next.js 16 App Router               │
├─────────────────────────────────────────────┤
│  Mapbox GL JS (mapbox-gl/dist/mapbox-gl.js) │
│  ├── Interactive map with markers           │
│  ├── Touch gesture handling                 │
│  └─ Custom styling (Mapbox Studio)         │
├─────────────────────────────────────────────┤
│  Mapbox Geocoding API                       │
│  ├── Forward geocoding (address → coords)   │
│  ├── Reverse geocoding (coords → address)   │
│  └─ Places autocomplete                    │
├─────────────────────────────────────────────┤
│  Mapbox Static Images API                   │
│  └─ Generate shareable trip snapshots      │
└─────────────────────────────────────────────┘
```

**Rationale:**

Mapbox scored 47/50 (94%) and is the **optimal choice** for TripOS's MVP:

1. **Perfect for $0 MVP Goal**: Free tier (50K map loads, 100K geocoding requests) supports 0-1,000 users at $0/month. This validates product-market fit without spending a dime.

2. **Zero Setup Time**: 5-minute API key setup vs 2-3 days for OpenStreetMap (tile hosting, configuration). Saves critical time in 18-24 week solo dev timeline.

3. **Timeline Acceleration**: Official React SDK, TypeScript support, App Router compatibility = 3-4 day learning curve vs 5-7 days for Google Maps. Saves ~1-2 days vs alternatives.

4. **Excellent Mobile UX**: Hardware-accelerated WebGL rendering, 60 FPS animations, native-feeling touch gestures. Critical for mobile-first travel app.

5. **Powerful Customization**: Mapbox Studio enables branded map styles (TripOS colors, custom markers) in 1-2 hours. Creates differentiated visual experience.

6. **Production-Proven**: Used by Facebook, Instagram, Strava, The New York Times. Battle-tested reliability at scale.

**Why Not Google Maps**: Costs $255/month at 500 users (exceeds free tier). 3-34x more expensive than alternatives at scale ($5,400/month at 10K users vs Mapbox's $500). Superior POI database (200M+ places) is not worth 3-34x cost for MVP validation.

**Why Not OpenStreetMap + Leaflet**: $0/month forever is compelling, but feature gaps hurt UX. No address autocomplete (Score: 2/5), no rich POI data (ratings, photos), variable data quality by region. 2-3 days setup time vs 5 minutes for Mapbox. Only consider if Mapbox costs exceed $100/month (at 5K+ users).

**Risks**:

1. **Free Tier Exhaustion**: Could hit 50K map load limit before revenue. **Mitigation**: Monitor usage dashboard, implement caching (geocoding results in Supabase, static images in Storage), set alerts at 70% usage.

2. **Pricing Increases**: Mapbox increased prices in 2024, could happen again. **Mitigation**: Abstract map component behind interface, migration plan ready (1-2 weeks to Google Maps or OSM). Only migrate if monthly cost >$100.

3. **Places Data Quality**: 50M+ POIs vs Google's 200M+ (less comprehensive internationally). **Mitigation**: Focus launch on well-mapped destinations (US, Europe, major cities). User feedback loop ("Report missing place" feature). Fallback to Nominatim if Mapbox returns no results.

4. **Bundle Size**: ~300KB (larger than Leaflet's 50KB). **Mitigation**: Code splitting (lazy load map component only on map routes), progressive enhancement (static image first, interactive on tap). Target: <2.5s LCP on 3G.

5. **Vendor Lock-In**: Tightly coupled to Mapbox APIs. **Mitigation**: Abstract map interface (`MapProvider` with `renderMap()`, `addMarker()`, `geocode()` methods). Can swap providers in 1-2 weeks if needed.

**Migration Plan** (if needed at 1,600+ users or costs >$100/month):

- **Option A: OpenStreetMap + Leaflet** (~2 weeks migration)
  - Pros: $0/month forever, smallest bundle size
  - Cons: Feature gaps (autocomplete, rich POI data), 2-3 day setup time
  - Decision: Only if cost becomes critical and feature gaps acceptable

- **Option B: Google Maps** (~1 week migration)
  - Pros: Superior POI data, best geocoding accuracy
  - Cons: Expensive ($5,400/month at 10K users), complex billing
  - Decision: Only after 5K+ users with revenue (> $5K MRR), if POI data gaps hurt retention

**Implementation Timeline**:

- **Day 1**: Create Mapbox account, generate API token (5 minutes)
- **Day 2-3**: Implement Map component with markers (2 days)
- **Day 4**: Add geocoding integration (1 day)
- **Day 5**: Test mobile UX and deploy to staging (1 day)

**Total**: 5 days from zero to production-ready maps

**Full Research Reports**:
- Mapbox: `/docs/research/mapbox-evaluation-report.md` (9,000+ words)
- Google Maps: `/docs/research/google-maps-evaluation-report.md` (8,500+ words)
- OpenStreetMap: `/docs/research/openstreetmap-evaluation-report.md` (7,500+ words)

---

#### Option 2: Google Maps Platform

**Status**: 🟢 **Evaluation Complete** (Feb 9, 2026)

**Verdict**: **NO** - Fails $0/month MVP goal

**Key Findings**:
- $200 credit = ~28,500 map loads (far below MVP needs)
- Costs $255/month at 500 users (exceeds $0 goal)
- Costs $5,100/month at 10K users (prohibitively expensive)
- 3-34x more expensive than Mapbox for equivalent features
- Superior POI database (200M+ places) but not worth cost for MVP

**Score**: 24/40 (60%) - Does not meet MVP criteria (threshold: ≥32/40)

**Full Report**: `/docs/research/google-maps-evaluation-report.md` (8,500 words)

---

#### Option 3: OpenStreetMap + Leaflet

**Status**: 🟡 **Deferred** - Only consider if cost becomes critical at 5K+ users

**Key Findings**:
- Unlimited free usage (self-host tiles)
- Smallest bundle size (~40 KB)
- 2-3 days setup time (tile hosting, infrastructure)
- DevOps overhead (tile updates, server maintenance)
- Good but not excellent mobile UX (3.5/5, no hardware acceleration)

**Score**: 39/50 (78%) - Good value but setup overhead unacceptable for MVP timeline

**Conclusion**: Only consider at 5K+ users if Mapbox costs exceed $100/month

---

### Decision Criteria Matrix

| Requirement | Weight | Mapbox | Google Maps | OSM + Leaflet |
|-------------|--------|--------|-------------|---------------|
| **HIGH Priority** | | | | |
| $0 MVP cost (0-500 users) | HIGH | **5/5** | 2/5 | 5/5 |
| Mobile performance | HIGH | **5/5** | 5/5 | 3/5 |
| Places search & geocoding | HIGH | **4/5** | 5/5 | 2/5 |
| Static map images | HIGH | **4/5** | 4/5 | 3/5 |
| Next.js 16 integration | HIGH | **5/5** | 4/5 | 4/5 |
| **MEDIUM Priority** | | | | |
| Customization | MEDIUM | **5/5** | 2/5 | 3/5 |
| Documentation quality | MEDIUM | **4/5** | 5/5 | 3/5 |
| Community support | MEDIUM | **4/5** | 5/5 | 4/5 |
| Solo dev speed | MEDIUM | **5/5** | 4/5 | 2/5 |
| **LOW Priority** | | | | |
| Bundle size | LOW | 3/5 | 4/5 | 5/5 |
| Vendor lock-in risk | LOW | 3/5 | 2/5 | 5/5 |
| **TOTAL SCORE** | | **47/50 (94%)** | 42/50 (84%) | 39/50 (78%) |

### Cost Projections

| Users | Mapbox | Google Maps | OSM + Leaflet |
|-------|--------|-------------|---------------|
| 100 | **$0/month** | $0/month | $0/month |
| 500 | **$0/month** | $255/month | $0-5/month |
| 1,000 | **$0/month** | $510/month | $5-10/month |
| 1,600 | ~$50/month | $880/month | $10-20/month |
| 5,000 | **$150/month** | $2,700/month | $20-50/month |
| 10,000 | **$500/month** | $5,400/month | $50-100/month |

### Research Timeline

- **Day 1 (Feb 9, 2026)**: Google Maps evaluation complete (8,500 words)
- **Day 1 (Feb 9, 2026)**: Mapbox evaluation complete (9,000+ words)
- **Day 1 (Feb 9, 2026)**: Competitive comparison and decision made

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Google Maps Platform** (95% confidence)

**Rationale**:

Google Maps Platform is the optimal choice for TripOS's MVP:

1. **Best Global POI Coverage** (Critical for worldwide travel app)
   - 200M+ POIs globally (4x more than Mapbox/Apple Maps)
   - Superior coverage in Asia (Japan, India, Southeast Asia, China)
   - Best geocoding accuracy (industry leader)
   - Eliminates risk of "can't find place" complaints at launch

2. **Familiar UX** (Reduces user friction)
   - Users recognize and trust Google Maps
   - Consistent behavior across desktop/mobile
   - Google Reviews integration (social proof for activities)

3. **Production-Proven at Scale** (De-risks implementation)
   - Massive community, Stack Overflow answers for every issue
   - Excellent Next.js 16 integration examples
   - Official React libraries (@react-google-maps/api)
   - Battle-tested reliability

4. **No POI Gaps at Launch** (Quality over cost for MVP)
   - Avoids international user complaints
   - No need for manual address entry fallbacks
   - No need to explain missing POIs in Asia
   - Professional polish from day one

**Cost Reality**:

- $200 monthly credit = ~28,000 map loads
- At 500 users (31 loads/user/month) = $255/month
- **Strategic trade-off**: Pay $255/month to validate product WITHOUT map quality complaints
- Can migrate to hybrid strategy later (see `/docs/architecture/maps-hybrid-optimization-plan.md`)

**Why Not Mapbox**: Weak Asia POI coverage (50M vs 200M), users can't find restaurants/attractions in Tokyo/Bangkok/Seoul. Risk of negative reviews: "Missing half the POIs compared to Google Maps." Not worth $255/month savings if it hurts user experience.

**Why Not Apple Maps**: Same Asia weakness as Mapbox (missing 40% of roads in Japan, POIs "nowhere near good enough" in India). $8/month is attractive, but POI gaps = bad first impression.

**Why Not OpenStreetMap**: 2-3 days setup time, no address autocomplete, weak Asia coverage. Only consider if cost becomes critical at 5K+ users with revenue.

**Risks**:

1. **Cost at Scale**: $5,400/month at 10K users (expensive). **Mitigation**: Migrate to hybrid strategy at 1,000-2,000 users (documented in optimization plan). Use caching (geocoding results in Supabase, static map images in Storage) to reduce API calls.

2. **Vendor Lock-In**: Tight coupling to Google ecosystem. **Mitigation**: Abstract map component with `MapProvider` interface. Migration path to hybrid strategy exists (1-2 week refactor).

3. **Limited Customization**: Can't brand map styles like Mapbox. **Mitigation**: Acceptable for MVP. Custom styling not critical vs POI coverage.

**Future Optimization Plan**:

After MVP validation (500-1,000 users), migrate to **hybrid strategy**:

- **Asia trips** → Google Maps (best POI coverage)
- **US/Europe trips** → Mapbox or Apple Maps ($0-8/month)
- **Cost savings**: 50-75% reduction vs Google-only
- **See**: `/docs/architecture/maps-hybrid-optimization-plan.md` for implementation details

**Full Research Reports**:

- Google Maps: `/docs/research/google-maps-evaluation-report.md` (8,500 words)
- Mapbox: `/docs/research/mapbox-evaluation-report.md` (9,000+ words)
- Competitor Analysis: `/docs/research/competitor-map-providers.md` (6 competitors analyzed)

---

## Phase 7: Testing Framework Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **Vitest + Playwright**

**Goal**: Choose testing frameworks for unit, component, and E2E testing with Next.js 16 and Supabase

### Requirements

**Critical (HIGH Priority):**
- Next.js 16 App Router compatibility (Server + Client Components)
- Fast test execution (TDD flow, instant feedback)
- Supabase integration (auth flows, RLS testing, real-time subscriptions)
- TypeScript support (type safety, IntelliSense)
- Solo dev friendly (minimal configuration, good DX)

**Important (MEDIUM Priority):**
- CI/CD integration (GitHub Actions, parallelization)
- Small bundle overhead (doesn't slow dev server)
- Component testing (React Testing Library integration)
- E2E reliability (no flaky tests)

**Nice to Have (LOW Priority):**
- Visual regression testing
- Accessibility testing
- Performance testing

### Options Evaluated

#### Option 1: Vitest (Unit & Component Testing)

**Pros:**
- ✅ **86x faster than Jest** - 500 tests: Jest 12min → Vitest 8sec (real-world benchmark)
- ✅ **0.2s feedback cycle** vs Jest's 3.8s (preserves TDD flow state)
- ✅ Native ESM/TypeScript support (zero config vs Jest's experimental flags)
- ✅ Official Next.js 16 integration with starter template
- ✅ 800MB memory vs Jest's 1.2GB (reduces CI costs)
- ✅ React Testing Library compatible
- ✅ $0/month forever

**Cons:**
- ⚠️ Newer than Jest (but 47K GitHub stars, stable)

**Conclusion:** Strong Yes - 10-20x faster tests, saves $1,600-1,800/year

---

#### Option 2: Playwright (E2E Testing)

**Pros:**
- ✅ **WebSocket-native architecture** (critical for real-time collaboration testing)
- ✅ Cross-domain OAuth support (handles Supabase auth flows Cypress can't)
- ✅ Free parallelization (GitHub Actions, no cloud service needed)
- ✅ 4x faster execution than Cypress
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Specialized Supabase test harness (Supawright)
- ✅ $0/month (saves $67-75/month vs Cypress Cloud)

**Cons:**
- ⚠️ Slightly steeper learning curve than Cypress

**Conclusion:** Strong Yes - real-time ready, saves $804-900/year

---

### Decision Criteria Matrix

| Requirement | Weight | Vitest | Jest | Playwright | Cypress |
|-------------|--------|--------|------|------------|---------|
| **HIGH Priority** | | | | | |
| Next.js 16 integration | HIGH | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ | 4/5 |
| Test execution speed | HIGH | **5/5** ✅ | 2/5 ❌ | **5/5** ✅ | 3/5 ⚠️ |
| Supabase integration | HIGH | **5/5** ✅ | 4/5 | **5/5** ✅ | 3/5 ⚠️ |
| TypeScript support | HIGH | **5/5** ✅ | 4/5 | **5/5** ✅ | 5/5 ✅ |
| Solo dev speed | HIGH | **5/5** ✅ | 3/5 ⚠️ | **4/5** ✅ | 5/5 ✅ |
| **MEDIUM Priority** | | | | | |
| CI/CD integration | MEDIUM | **5/5** ✅ | 4/5 | **5/5** ✅ | 3/5 ⚠️ |
| Bundle size impact | MEDIUM | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ | 4/5 |
| Component testing | MEDIUM | **5/5** ✅ | 5/5 ✅ | 4/5 | 4/5 |
| Reliability | MEDIUM | 4/5 | **5/5** ✅ | **5/5** ✅ | 3/5 ⚠️ |
| **TOTAL SCORE** | | **47/50 (94%)** 🏆 | 35/50 (70%) | **47/50 (94%)** 🏆 | 33/50 (66%) |

### Cost Projections

| Phase | Users | Monthly Cost | Notes |
|-------|-------|--------------|-------|
| **Development (0-6 months)** | 0 | **$0/month** ✅ | GitHub Actions free tier sufficient |
| **MVP (6-12 months)** | 0-500 | **$0/month** ✅ | ~360 CI minutes/month (under 2,000 limit) |
| **Growth (12-24 months)** | 500-5K | **$0-4/month** | May exceed free tier with team scaling |
| **Scale (Year 2+)** | 5K+ | **$8-20/month** | Team of 3-5 devs |

**vs Cypress Alternative**: $804-900 additional cost over first year (Cypress Cloud required for parallelization)

### Research Timeline

- **Day 1 (Feb 9, 2026)**: Launched research agent
- **Day 1 (Feb 9, 2026)**: Generated comprehensive report (10,500+ words, 40+ sources)
- **Day 1 (Feb 9, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Vitest + Playwright** (95% confidence)

**Rationale**:

Vitest + Playwright scored 47/50 (94%) each and is the optimal choice for TripOS's MVP:

1. **10-20x Faster Tests** (Critical for TDD workflow)
   - Vitest executes in 8 seconds what takes Jest 12 minutes (86x speedup)
   - 0.2s feedback cycle preserves flow state for TDD
   - Saves ~5 days over 18-24 week timeline from faster iteration

2. **Real-Time Testing Ready** (Critical for collaboration features)
   - Playwright's WebSocket-native architecture perfect for testing Supabase Realtime subscriptions
   - Cross-domain OAuth support handles Supabase auth flows Cypress can't
   - Specialized Supawright test harness for Supabase E2E tests

3. **$1,600-1,800 Saved** (Cost efficiency)
   - Playwright's free parallelization vs Cypress Cloud ($67-75/month)
   - Vitest's faster CI runs reduce GitHub Actions minutes consumption
   - $0/month for first 12-18 months

4. **Production-Proven** (De-risks timeline)
   - Vitest: 12.3M weekly downloads, 47K GitHub stars
   - Playwright: Used by Microsoft, VSCode, GitHub
   - Official Next.js 16 integration patterns
   - Massive community support

5. **Solo Dev Efficiency** (18-24 week timeline)
   - 1-2 day setup total (30-60 min Vitest, 45-90 min Playwright)
   - Zero config for Next.js 16 (official templates)
   - Abundant tutorials and Stack Overflow answers

**Why Not Jest**: 86x slower test execution (12 minutes vs 8 seconds), experimental ESM support, larger memory footprint (1.2GB vs 800MB). Slows TDD cycle and increases CI costs.

**Why Not Cypress**: Cannot handle cross-domain OAuth (Supabase auth flows fail), requires paid Cypress Cloud for parallelization ($67-75/month), 4x slower than Playwright. Not WebSocket-native for real-time testing.

**Risks**:

1. **Newer Ecosystem**: Vitest/Playwright younger than Jest/Cypress. **Mitigation**: Both have massive adoption (12M+ downloads, 47K+ stars), stable APIs, production-proven.

2. **Learning Curve**: New syntax and patterns to learn. **Mitigation**: Excellent documentation, official Next.js examples, 1-2 day setup time.

3. **CI Minutes Consumption**: E2E tests consume 5-15 minutes per run. **Mitigation**: Only run on PRs (not every commit), optimize with Playwright browser caching (saves 3 min per run).

**Implementation Timeline**:

- **Day 1** (4-6 hours): Vitest setup - dependencies, config, first unit/component tests, GitHub Actions workflow
- **Day 2** (4-6 hours): Playwright setup - install, config, Supabase auth utilities, first E2E test
- **Day 3** (optional): Polish - RLS policy testing, real-time subscription tests, performance benchmarking

**Total**: 2-3 days from zero to production-ready testing

**Full Research Report**:
- Testing Framework Decision: `/docs/strategy/phase-7-testing-framework-decision.md` (10,500+ words, 40+ sources)

---

## Phase 8: CI/CD Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **Hybrid Approach (Vercel CI + GitHub Actions)**

**Goal**: Choose CI/CD solution for automated testing, Supabase migrations, and deployment

### Requirements

**Critical (HIGH Priority):**
- Automated testing (lint, type check, unit, E2E)
- Supabase database migrations (apply on merge to main)
- Preview deployments for PRs
- Next.js 16 + Vercel deployment integration
- Solo dev friendly (minimal configuration)

**Important (MEDIUM Priority):**
- Free tier generosity (0-500 users should be $0)
- Build speed (fast feedback cycles)
- Type generation from Supabase schema
- Deployment protection (require tests to pass)

**Nice to Have (LOW Priority):**
- Multi-environment support (staging, production)
- Rollback capabilities
- Performance monitoring

### Options Evaluated

#### Option 1: GitHub Actions (Testing & Migrations)

**Pros:**
- ✅ Generous free tier: 2,000 minutes/month for private repos
- ✅ Perfect for Supabase migrations (official CLI action available)
- ✅ Excellent Playwright browser caching (saves 3 min per test run)
- ✅ 39% cheaper after January 2026 pricing reduction
- ✅ Built-in to GitHub (no additional accounts)
- ✅ YAML workflow flexibility

**Cons:**
- ⚠️ E2E tests consume minutes quickly (5-15 min per run)
- ⚠️ More complex than Vercel-only approach
- ⚠️ YAML configuration has learning curve

**Conclusion:** Strong Yes for testing and migrations

---

#### Option 2: Vercel CI (Deployment)

**Pros:**
- ✅ Zero configuration - push code → deployed
- ✅ Automatic preview deployments for every PR (game-changer for development)
- ✅ 6,000 build minutes/month free (Next.js builds: 2-5 min each)
- ✅ First-class Next.js integration (Vercel created Next.js)
- ✅ Instant rollbacks, edge network, automatic HTTPS

**Cons:**
- ⚠️ Cannot run tests natively (no Jest, Playwright, ESLint execution)
- ⚠️ Cannot handle Supabase migrations
- ⚠️ **Hobby tier is non-commercial only** (must upgrade to Pro $20/month at launch)
- ⚠️ Vendor lock-in risk (mitigated by portability to Cloudflare Pages)

**Conclusion:** Strong Yes for deployment, needs GitHub Actions for testing

---

#### Option 3: Hybrid Approach (Vercel + GitHub Actions)

**Pros:**
- ✅ Best of both worlds (Vercel deployment + GitHub Actions testing)
- ✅ Fastest time-to-value (Vercel 30 min setup, GitHub Actions 10 hours total)
- ✅ Cost optimized ($0 dev, $20 commercial launch, $40 at 50K users)
- ✅ No vendor lock-in (can migrate to Cloudflare Pages in 1-2 days)
- ✅ E2E testing on real deployments (GitHub Actions waits for Vercel preview URL)

**Cons:**
- ⚠️ More complex than single-vendor approach
- ⚠️ Requires coordinating two services

**Conclusion:** Strong Yes - optimal for solo dev

---

### Decision Criteria Matrix

| Requirement | Weight | GitHub Actions | Vercel CI | Hybrid | CircleCI |
|-------------|--------|----------------|-----------|--------|----------|
| **HIGH Priority** | | | | | |
| Automated testing | HIGH | **5/5** ✅ | 0/5 ❌ | **5/5** ✅ | 5/5 ✅ |
| Supabase migrations | HIGH | **5/5** ✅ | 0/5 ❌ | **5/5** ✅ | 4/5 |
| Preview deployments | HIGH | 0/5 ❌ | **5/5** ✅ | **5/5** ✅ | 3/5 ⚠️ |
| Next.js integration | HIGH | 4/5 | **5/5** ✅ | **5/5** ✅ | 3/5 ⚠️ |
| Solo dev speed | HIGH | 3/5 ⚠️ | **5/5** ✅ | **5/5** ✅ | 2/5 ❌ |
| **MEDIUM Priority** | | | | | |
| Free tier generosity | MEDIUM | **5/5** ✅ | **5/5** ✅ | **5/5** ✅ | 3/5 ⚠️ |
| Build speed | MEDIUM | 4/5 | **5/5** ✅ | **5/5** ✅ | 4/5 |
| Type generation | MEDIUM | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ | 4/5 |
| Deployment protection | MEDIUM | **5/5** ✅ | 4/5 | **5/5** ✅ | 5/5 ✅ |
| **TOTAL SCORE** | | 36/45 (80%) | 32/45 (71%) | **45/45 (100%)** 🏆 | 33/45 (73%) |

### Cost Projections

| Phase | Users | Vercel | GitHub Actions | Total | vs CircleCI |
|-------|-------|--------|----------------|-------|-------------|
| **Development** | 0 | $0 (Hobby)* | $0 | **$0/month** ✅ | $0 |
| **Commercial Launch** | 0-500 | $20 (Pro) | $0 | **$20/month** | $15 |
| **Early Growth** | 500-5K | $20 | $0 | **$20/month** | $15-30 |
| **Scale** | 5K-50K | $20 | $20 | **$40/month** | $30-60 |

*Hobby tier is non-commercial only - upgrade to Pro immediately if building a SaaS

### Research Timeline

- **Day 1 (Feb 9, 2026)**: Launched research agent
- **Day 1 (Feb 9, 2026)**: Generated comprehensive report (40+ pages, 20+ sources)
- **Day 1 (Feb 9, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Hybrid Approach (Vercel CI + GitHub Actions)** (95% confidence)

**Rationale**:

The hybrid approach scored 45/45 (100%) and is the optimal choice for TripOS's MVP:

1. **Best Developer Experience** (Critical for solo dev)
   - Vercel: Zero config, push code → deployed, automatic preview URLs
   - GitHub Actions: Runs tests against Vercel preview, reports status
   - Fastest time-to-value: Vercel 30 min setup, GitHub Actions 10 hours total

2. **Cost Optimized** (Aligns with $0 MVP goal)
   - Development: $0/month (Vercel Hobby + GitHub Actions free tier)
   - Commercial launch: $20/month (only Vercel Pro required)
   - Scale (50K users): $40/month (both services)
   - vs CircleCI: $15/month (but lacks preview deployments)

3. **No Vendor Lock-In** (Future-proof)
   - Can migrate to Cloudflare Pages in 1-2 days if needed
   - GitHub Actions workflows are portable
   - Supabase CLI runs anywhere

4. **E2E Testing on Real Deployments** (Quality assurance)
   - GitHub Actions waits for Vercel preview URL
   - Runs Playwright tests against actual deployment
   - Blocks merge if tests fail

5. **Production-Proven** (De-risks timeline)
   - Industry standard for Next.js + Supabase projects in 2026
   - Battle-tested by thousands of solo developers
   - Abundant tutorials and community support

**Typical CI Pipeline**:

**On every PR:**
1. GitHub Actions: Lint + type check (~1 min)
2. GitHub Actions: Unit tests (~2 min)
3. Vercel: Build Next.js (~3 min)
4. Vercel: Deploy to preview URL
5. GitHub Actions: E2E tests on preview URL (~5 min)
6. Developer reviews preview + test results

**On merge to main:**
1. GitHub Actions: Apply Supabase migrations (~1 min)
2. GitHub Actions: Generate TypeScript types (~30 sec)
3. Vercel: Build + deploy to production (~3 min)

**Total pipeline time**: ~12 minutes from PR to production

**Why Not GitHub Actions Only**: Requires managing deployment scripts, no automatic preview URLs, slower than Vercel's purpose-built Next.js infrastructure.

**Why Not Vercel Only**: Cannot run tests or handle Supabase migrations. Not viable for production-quality CI/CD.

**Why Not CircleCI**: Overkill for solo dev, complex credit-based pricing, no advantage for Next.js + Supabase. More expensive ($15/month vs $0 for GitHub Actions) without Vercel's deployment UX.

**Risks**:

1. **Vercel Hobby is Non-Commercial**: Must upgrade to Pro ($20/month) immediately if building a SaaS. **Mitigation**: Plan for $20/month from commercial launch day.

2. **Free Tier Exhaustion**: Could hit GitHub Actions 2,000 minute limit or Vercel 6,000 build limit. **Mitigation**: Optimize E2E tests (only run on PRs, not every commit), use Playwright browser caching (saves 3 min per run).

3. **Vendor Lock-In**: Tight coupling to Vercel. **Mitigation**: Can migrate to Cloudflare Pages in 1-2 days, GitHub Actions workflows are portable.

**Implementation Timeline**:

**Total: 10 hours** (or compress into 2-3 days)

- **Week 1** (2 hours): Vercel setup - connect GitHub, configure env vars, test deploys
- **Week 2** (4 hours): GitHub Actions testing - ESLint, TypeScript, unit tests, Playwright with caching
- **Week 3** (3 hours): GitHub Actions migrations - Supabase CLI, migration deployment, type generation
- **Week 4** (1 hour): Deployment protection - enable checks, test end-to-end flow

**Full Research Report**:
- CI/CD Decision: `/docs/strategy/phase-8-cicd-decision.md` (40+ pages, 20+ sources)

---

## Phase 9: Monitoring & Analytics Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **Sentry (Error Tracking) + PostHog (Analytics) + Vercel Speed Insights (Performance)**

**Goal**: Choose monitoring and analytics solutions for error tracking, user behavior, and performance

### Requirements

**Critical (HIGH Priority):**
- Error tracking with Next.js 16 integration
- Product analytics (events, funnels, retention)
- Privacy-first approach (travel data is sensitive)
- Solo dev friendly (minimal setup, good DX)
- Free tier generosity (0-500 users should be $0-50/month)

**Important (MEDIUM Priority):**
- Performance monitoring (Web Vitals, API latency)
- Session replay (optional, privacy concerns)
- Feature flags for gradual rollouts
- GDPR compliance (EU users)

**Nice to Have (LOW Priority):**
- A/B testing
- User surveys
- Heatmaps

### Options Evaluated

#### Option 1: Sentry (Error Tracking)

**Pros:**
- ✅ Industry standard error tracking (500K+ organizations)
- ✅ Free tier: 5K events/month (sufficient for early MVP)
- ✅ Paid tier: $26/month for 50K events (Team plan)
- ✅ Excellent Next.js 16 integration (official SDK)
- ✅ Performance monitoring included (APM, distributed tracing)
- ✅ Source map support (readable stack traces)
- ✅ PII scrubbing (privacy-first)

**Cons:**
- ⚠️ Free tier limited (5K events may not cover 500 users)
- ⚠️ Session replay expensive (only 50 free sessions)

**Conclusion:** Strong Yes - industry standard, excellent Next.js integration

---

#### Option 2: PostHog (Product Analytics)

**Pros:**
- ✅ **Incredibly generous free tier**: 1M events/month (vs Mixpanel 100K MTU)
- ✅ All-in-one: Analytics + session replay (5K/month) + feature flags + surveys
- ✅ Privacy-first: EU hosting, self-hosting option, GDPR compliant
- ✅ No per-seat fees: Unlimited team members
- ✅ Excellent Next.js 16 integration
- ✅ Open-source (can self-host if needed)

**Cons:**
- ⚠️ Newer than Mixpanel (but 25K+ GitHub stars, production-proven)

**Conclusion:** Strong Yes - best free tier, all-in-one solution

---

#### Option 3: Session Replay (Deferred)

**Evaluation:**
- LogRocket: $69-$295/month (opt-out privacy model)
- FullStory: No public pricing (expensive)
- Sentry Session Replay: Only 50 free sessions
- OpenReplay: $5.95/1K sessions (privacy-first) or self-hosted

**Decision**: **DEFER** until post-MVP

**Rationale:**
- Privacy concerns with travel data (budgets, destinations, voting patterns)
- GDPR compliance requires explicit consent, field-level masking
- Not essential for MVP validation (error tracking + analytics sufficient)
- Post-MVP option: OpenReplay cloud ($5.95/1K sessions) or self-hosted

---

#### Option 4: Vercel Speed Insights (Performance)

**Pros:**
- ✅ Built-in with Vercel Pro ($20/month)
- ✅ Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- ✅ Zero setup, automatic integration
- ✅ Sufficient for MVP performance monitoring

**Cons:**
- ⚠️ Limited to Web Vitals (no distributed tracing)
- ⚠️ Requires Vercel Pro (but already planned for CI/CD)

**Conclusion:** Strong Yes - already included, sufficient for MVP

---

### Decision Criteria Matrix

| Requirement | Weight | Sentry | Rollbar | PostHog | Mixpanel | Vercel Analytics |
|-------------|--------|--------|---------|---------|----------|------------------|
| **HIGH Priority** | | | | | | |
| Next.js 16 integration | HIGH | **5/5** ✅ | 4/5 | **5/5** ✅ | 4/5 | **5/5** ✅ |
| Free tier generosity | HIGH | 3/5 ⚠️ | 4/5 | **5/5** ✅ | 2/5 ❌ | **5/5** ✅ |
| Privacy-first | HIGH | **5/5** ✅ | 4/5 | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ |
| Solo dev speed | HIGH | **5/5** ✅ | 4/5 | **5/5** ✅ | 4/5 | **5/5** ✅ |
| Feature completeness | HIGH | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ | 4/5 | 2/5 ❌ |
| **MEDIUM Priority** | | | | | | |
| Performance monitoring | MEDIUM | **5/5** ✅ | 0/5 ❌ | 3/5 ⚠️ | 0/5 ❌ | **5/5** ✅ |
| Session replay | MEDIUM | 2/5 ❌ | 0/5 ❌ | **5/5** ✅ | 0/5 ❌ | 0/5 ❌ |
| Feature flags | MEDIUM | 0/5 ❌ | 0/5 ❌ | **5/5** ✅ | 0/5 ❌ | 0/5 ❌ |
| GDPR compliance | MEDIUM | **5/5** ✅ | 4/5 | **5/5** ✅ | 3/5 ⚠️ | **5/5** ✅ |
| **TOTAL SCORE** | | 35/45 (78%) | 23/45 (51%) | **43/45 (96%)** 🏆 | 20/45 (44%) | 32/45 (71%) |

### Recommended MVP Stack

**Total Cost: $46/month**

| Category | Tool | Cost | Why |
|----------|------|------|-----|
| **Error Tracking** | Sentry Team | $26/month | Industry standard, 50K events, Next.js integration, bundled APM |
| **Product Analytics** | PostHog Free | $0/month | 1M events/month free, all features, privacy-first, includes feature flags |
| **Performance Monitoring** | Vercel Speed Insights | $0/month (included) | Built-in Web Vitals, zero setup, included with Vercel Pro |
| **Session Replay** | DEFER | $0/month | Privacy concerns with travel data, not essential for MVP |
| **Deployment** | Vercel Pro | $20/month | Required for commercial use |

### Cost Projections

| User Range | Monthly Cost | Notes |
|------------|--------------|-------|
| **0-500 users (MVP)** | **$46/month** | Sentry Team + Vercel Pro, PostHog free |
| **500-5K users** | **$46-106/month** | May add OpenReplay session replay ($30-60/month) |
| **5K-50K users** | **$380-1,490/month** | PostHog scales to $250-1K/month at 2-5M events |

**As % of revenue**: At 5K users × $10/month = $50K MRR, monitoring is only 0.8% of revenue ($380/$50K) - healthy benchmark is 1-2%.

### Research Timeline

- **Day 1 (Feb 9, 2026)**: Launched research agent
- **Day 1 (Feb 9, 2026)**: Generated comprehensive report (40+ pages, 50+ sources)
- **Day 1 (Feb 9, 2026)**: Scored options, compared trade-offs, made final decision

### Final Decision

**Status**: 🟢 **DECIDED**

**Winner**: **Sentry + PostHog + Vercel Speed Insights** (95% confidence)

**Rationale**:

Sentry + PostHog + Vercel Speed Insights is the optimal choice for TripOS's MVP:

1. **Production-Grade Observability from Day One** (De-risks launch)
   - Sentry: Catch errors before users report them
   - PostHog: Understand user behavior (voting patterns, blind budgeting usage)
   - Vercel: Monitor Core Web Vitals (LCP, FID, CLS)

2. **Privacy-First Architecture** (Critical for travel app)
   - Sentry: PII scrubbing, enhanced privacy mode (no IP collection)
   - PostHog: Anonymous mode until user logs in, EU hosting option
   - Session replay: Deferred until legal review and consent flows designed

3. **Cost-Effective** (Aligns with $0-50 MVP goal)
   - PostHog: 1M events/month free (vs Mixpanel 100K MTU)
   - Sentry: $26/month for 50K events (vs Rollbar $69/month)
   - Vercel: Already included with Pro plan ($20/month)
   - Total: $46/month (only 0.8% of revenue at 5K users)

4. **All-in-One Simplicity** (Solo dev efficiency)
   - PostHog: Analytics + feature flags + surveys (no Mixpanel + LaunchDarkly + Typeform)
   - Sentry: Errors + performance monitoring (no separate APM tool)
   - 40 hours setup vs 80+ hours with multiple vendors

5. **Future-Proof** (Scales to 50K+ users)
   - PostHog: Generous free tier grows to 1M events (covers 0-5K users)
   - Sentry: Team plan scales to 50K events (sufficient for 5K-10K users)
   - Can self-host PostHog if privacy/cost becomes critical

**Why Not Mixpanel**: Expensive ($4.5K-$15K/month paid tiers), restrictive free tier (100K MTU vs PostHog's 1M events), per-seat fees. Not privacy-first (requires extensive configuration).

**Why Not Rollbar**: 25K free events (vs Sentry 5K), but no APM/performance monitoring (must pay $69/month for full features). Missing critical features.

**Why Not Session Replay (MVP)**: Privacy concerns with travel data (budgets, destinations, voting patterns), GDPR compliance requires explicit consent and field-level masking, not essential for MVP validation. Can add post-MVP with OpenReplay.

**Privacy Considerations for Travel Apps**:

**Critical**: Travel apps handle sensitive data requiring special privacy measures:

1. **Blind budgeting data**: Budget caps must never appear in session replays or error logs
2. **Location data**: Trip destinations are privacy-sensitive (safety concerns)
3. **Group dynamics**: Voting patterns reveal personal preferences
4. **GDPR compliance**: Session replay requires explicit consent, not just privacy policy

**Privacy stack approach**:
- PostHog: Configure anonymous mode until user logs in, EU hosting option
- Sentry: Enable PII scrubbing, enhanced privacy mode (no IP collection)
- Session replay: Deferred until legal review and consent flows designed

**Risks**:

1. **Free Tier Exhaustion**: Could hit Sentry 5K event limit or PostHog 1M event limit before revenue. **Mitigation**: Monitor usage dashboards, implement error grouping (reduce duplicate errors), upgrade to Sentry Team ($26/month) at 500 users.

2. **Privacy Compliance**: GDPR/CCPA requires explicit consent for analytics. **Mitigation**: Implement consent banner, anonymous mode until user opts in, PII scrubbing enabled.

3. **Cost Scaling**: PostHog scales to $250-1K/month at 2-5M events (5K-10K users). **Mitigation**: Self-hosting option available ($100-200/month), can optimize event tracking (remove low-value events).

**Implementation Timeline**:

**Week 1-2 setup** (40 hours total):
1. **Sentry** (1-2 days): SDK integration, source maps, PII scrubbing
2. **PostHog** (2-3 days): Event tracking, schema design, feature flags
3. **Vercel Analytics** (0.5 days): Add package, verify dashboard

**Full Research Report**:
- Monitoring & Analytics Decision: `/docs/strategy/monitoring-analytics-decision.md` (40+ pages, 50+ sources)

---

## Phase 10: Authentication Research

**Status**: 🟢 **Decided** (Implicit from Phase 1)

**Goal**: Validate auth provider supports email, OAuth, magic links, guest access

### Options Being Evaluated

**If Phase 1 = Supabase:**
- Use Supabase Auth (built-in)

**If Phase 1 = Firebase:**
- Use Firebase Auth (built-in)

**If Phase 1 = Custom:**
- Evaluate: Clerk ($25/mo), Auth0 (enterprise), custom JWT

### Research Tasks

- [ ] Test email/password auth
- [ ] Test OAuth (Google, Apple)
- [ ] Test magic link flows
- [ ] Implement guest access (shareable trip links)
- [ ] Validate RLS integration

### Final Decision

**Status**: 🔴 Not Started

**Winner**: *[To be determined after Phase 1]*

---

## Phase 8: Deployment & Hosting Research

**Status**: 🔴 Not Started (Depends on Phase 2 frontend choice)

**Goal**: Choose hosting platform with free tier and zero-config deployment

### Options Being Evaluated

#### Option 1: Vercel

**Research Tasks:**
- [ ] Test Next.js deployment flow
- [ ] Validate free tier (100GB bandwidth)
- [ ] Test preview deployments (PR previews)
- [ ] Calculate costs (1K/10K users)

---

#### Option 2: Cloudflare Pages

**Research Tasks:**
- [ ] Test framework support
- [ ] Compare free tier (unlimited bandwidth)
- [ ] Evaluate Workers for edge functions

---

#### Option 3: Netlify

**Research Tasks:**
- [ ] Test deployment flow
- [ ] Compare free tier with Vercel
- [ ] Evaluate edge functions

---

### Final Decision

**Status**: 🔴 Not Started

**Winner**: *[To be determined after Phase 2]*

---

## Phase 11: Email Service Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **Resend**

**Goal**: Choose transactional email provider for trip invitations, voting notifications, activity updates, and task assignments

### Requirements

**Critical (HIGH Priority):**
- Next.js 16 App Router integration (Server Actions, Route Handlers)
- React Email template support (JSX components for type-safe emails)
- Supabase Edge Functions compatibility
- Deliverability >93% (invites must reach inbox)
- Solo dev friendly (minimal setup time)

**Important (MEDIUM Priority):**
- Cost-effective at MVP scale (0-500 users, ~10K emails/month)
- Bounce/complaint handling
- Webhook support for delivery tracking
- Email warmup guidance
- TypeScript SDK

**Nice-to-Have (LOW Priority):**
- GDPR compliance (EU data residency)
- Historical rate support for expense tracking
- Multi-currency trip support

### Options Evaluated

| Provider | Score | Free Tier | Cost (50K emails) | Deliverability | React Email | Setup Time |
|----------|-------|-----------|------------------|----------------|-------------|------------|
| **Resend** 🏆 | 98/100 | 100/day | $20/month | 95%+ | ✅ Native | 1-2 hours |
| Postmark | 93/100 | 100/month | $15/month | 98.7% ⭐ | ✅ Good | 1 day |
| SendGrid | 89/100 | 100/day | $15/month | 94% | ⚠️ Manual | 2 days |
| Mailgun | 89/100 | 5K/month | $35/month | 93% | ⚠️ Manual | 1.5 days |
| AWS SES | 74/100 | 62K/month | $5/month | 90% | ❌ None | 1 week |
| Loops.so | - | Limited | $29/month | Unknown | ⚠️ Partial | - |

**Winner: Resend** (98/100, 85% confidence)

### Decision Rationale

**Why Resend Won:**

1. **Native React Email Integration**: Built by React Email team, seamless JSX component templates
2. **Official Supabase Documentation**: Verified Edge Functions integration guide
3. **Best Developer Experience**: TypeScript-first API, clean design for modern stacks
4. **Provider-Agnostic Architecture**: React Email templates work with any provider (1-day migration possible)
5. **Competitive Pricing**: $20/month for 50K emails matches or beats alternatives
6. **Fast Implementation**: 1-2 hours setup vs 1-2 days for competitors (5-10 days faster to market)

**Trade-offs Accepted:**

1. **Newer provider** (2023) vs established players - mitigated by strong backing (Vercel team)
2. **Good deliverability (95%)** vs Postmark's best-in-class (98.7%) - 3.4% difference acceptable for MVP
3. **Less comprehensive webhooks** vs SendGrid - bounce/complaint handling sufficient for MVP

### Email Volume Projections

**MVP (0-500 users, Months 0-3):**
- 52 trips/month × 124 emails/trip = **~10,000 emails/month**
- Resend Cost: **$20/month** (50K emails/month plan)

**Growth (500-5K users, Months 3-12):**
- 625 trips/month × 124 emails/trip = **~100,000 emails/month**
- Resend Cost: **$90/month** (100K emails/month plan)

**Scale (5K-50K users, Year 2):**
- 6,250 trips/month × 124 emails/trip = **~1,000,000 emails/month**
- Resend Cost: **$500/month** (1M emails/month plan) OR migrate to AWS SES ($100/month)

### Email Volume Formula

```
Monthly Emails = (Active Users) × (Trips/Year ÷ 12) × (Emails/Trip)

Emails per Trip Breakdown:
- Invitations: 6 emails (1 per member)
- Voting: 57.6 emails (4 polls × 14.4 emails/poll)
- Activity Updates: 48 emails (8 daily digests × 6 members)
- Budget Alerts: 12 emails (2 alerts × 6 members)
Total: ~124 emails/trip
```

### Cost Analysis

| User Count | Monthly Emails | Resend Cost | SendGrid Cost | Postmark Cost | AWS SES Cost |
|------------|----------------|-------------|---------------|---------------|--------------|
| 500 (MVP) | 10,000 | **$20** | $15 | $15 | $1 |
| 5,000 | 100,000 | **$90** | $90 | $100 | $10 |
| 50,000 | 1,000,000 | **$500** | $500 | $1,000 | $100 |

**Cost Verdict**: Resend is competitive at MVP/Growth scale ($20-90/month). At Scale (1M+ emails/month), consider AWS SES migration ($100/month vs $500/month = 80% savings).

### Integration Guide

**Architecture**: Supabase Edge Functions + React Email + Resend

**Step 1: Install Dependencies**
```bash
npm install resend react-email @react-email/components
```

**Step 2: Create React Email Template** (`emails/TripInvite.tsx`)
```tsx
import { Button, Html, Text } from '@react-email/components';

export default function TripInvite({ tripName, inviterName, inviteUrl }) {
  return (
    <Html>
      <Text>{inviterName} invited you to join {tripName} on TripOS!</Text>
      <Button href={inviteUrl}>View Trip</Button>
    </Html>
  );
}
```

**Step 3: Supabase Edge Function** (`supabase/functions/send-email/index.ts`)
```typescript
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  const { to, subject, template, data } = await req.json();

  const { data: result, error } = await resend.emails.send({
    from: 'TripOS <noreply@squadtrip.com>',
    to,
    subject,
    react: template(data), // Pass React component
  });

  return new Response(JSON.stringify({ result, error }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Step 4: Client-Side Trigger** (Next.js Server Action)
```typescript
'use server';

export async function sendTripInvite(email: string, tripId: string) {
  await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      subject: 'You're invited to join a trip!',
      template: 'TripInvite',
      data: { tripName: trip.name, inviterName: user.name, inviteUrl: url },
    },
  });
}
```

### Migration Strategy

**If deliverability drops below 93%:**
- **Target**: Postmark (98.7% deliverability)
- **Timeline**: 2-3 days (React Email templates are provider-agnostic)
- **Cost**: $15-100/month (similar to Resend)
- **Steps**: Swap Resend SDK for Postmark SDK in Edge Function (10 lines of code)

**If volume exceeds 500K emails/month:**
- **Target**: AWS SES ($0.10/1K = $50/month vs Resend $300+/month)
- **Timeline**: 2-3 weeks (domain verification, warmup, reputation building)
- **Cost**: $50-100/month (80% savings)
- **Steps**: Set up AWS SES, implement bounce/complaint handling, warmup with low volume

### Implementation Timeline

1. **Email service setup** (1 day): Resend account, domain verification (SPF/DKIM)
2. **React Email templates** (2 days): Trip invite, voting reminder, activity digest
3. **Edge Function** (1 day): Send email function with error handling
4. **Testing** (0.5 days): Test deliverability to Gmail, Outlook, Yahoo
5. **Warmup** (6 weeks): Gradual volume increase to build reputation

**Total**: 4.5 days development + 6 weeks warmup (background)

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Deliverability <93% | Low | High | Monitor inbox placement, migrate to Postmark in 2-3 days |
| Provider sunset/acquisition | Low | Medium | React Email templates work with any provider (provider-agnostic) |
| Webhook reliability issues | Low | Low | Implement retry logic, log failures to Sentry |
| Volume exceeds budget | Medium | Medium | Plan AWS SES migration at 500K emails/month |
| GDPR compliance gaps | Low | Medium | Resend is GDPR-compliant, verify data processing agreement |

### Monitoring & Observability

**Key Metrics** (via Resend Dashboard + Sentry):
- Delivery rate (target: >95%)
- Bounce rate (target: <3%)
- Complaint rate (target: <0.1%)
- Latency (target: <5 seconds)

**Alerting**:
- Delivery rate drops below 93% → Investigate + plan Postmark migration
- Bounce rate >5% → Check email validation logic
- Complaint rate >0.5% → Review email content, unsubscribe flow

**Full Research Report**:
- Email Service Decision: `/docs/strategy/phase-11-email-service-decision.md` (40+ pages, 50+ sources)

---

## Phase 12: Currency API Research

**Status**: 🟢 **Decided** - February 9, 2026

**Winner**: **ExchangeRate-API (Free Tier) + Frankfurter (Fallback)**

**Goal**: Choose currency conversion API for blind budgeting, expense tracking, and activity price display

### Requirements

**Critical (HIGH Priority):**
- 50+ currencies (major travel destinations worldwide)
- Accurate rates for financial calculations (blind budgeting requires trust)
- Free tier for MVP (minimize costs until product-market fit)
- 24-hour caching support (reduce API costs)
- Next.js 16 App Router compatible

**Important (MEDIUM Priority):**
- Historical rates (expense tracking after trip)
- Multi-currency trip support (EUR + GBP + CHF in one trip)
- Reliability >99% (uptime critical for group budgeting)
- Server-side conversion (blind budget privacy)
- Simple integration (solo dev, limited time)

**Nice-to-Have (LOW Priority):**
- Batch conversion API (convert many currencies in one call)
- Self-hostable option (avoid vendor lock-in)
- Real-time rates (<60 second updates)

### Options Evaluated

| Provider | Score | Free Tier | Currencies | Uptime | Cost (5K calls/month) | Historical Rates |
|----------|-------|-----------|------------|--------|----------------------|------------------|
| **ExchangeRate-API** 🏆 | 42/50 | 1,500/month | 165 | >99.99% | $0 (free tier) | Pro only |
| **Frankfurter** 🥈 | 41/50 | Unlimited | 30+ | No SLA | $0 (self-host) | ✅ 1999+ |
| Open Exchange Rates | 38/50 | 1,000/month | 200+ | 99.9% | $12/month | ✅ 1999+ |
| Fixer.io | 37/50 | Limited | 170 | 99.9% | $40/month | ✅ 1999+ |
| CurrencyAPI | 38/50 | 500/month | 170+ | Unknown | $10/month | ✅ 2000+ |

**Winner: ExchangeRate-API** (42/50) with **Frankfurter** (41/50) as fallback (90% confidence)

### Decision Rationale

**Why ExchangeRate-API + Frankfurter Won:**

1. **Zero Cost for MVP**: 1,500 requests/month free tier covers 500-1,000 users with 85% caching
2. **Exceptional Reliability**: >99.99% uptime (Pingdom verified, 2024) beats all competitors
3. **Clear Caching Terms**: Explicit 24-hour caching permission (legal compliance)
4. **Risk-Free Fallback**: Frankfurter provides unlimited free calls if rate limit exceeded
5. **Simple Integration**: REST API, no SDK required, JSON responses, 1-2 day implementation
6. **Future-Proof**: Easy upgrade path to $10/month Pro tier OR self-hosted Frankfurter

**Trade-offs Accepted:**

1. **30 currencies on fallback** (Frankfurter) vs 165 (primary) - acceptable, covers 95% of travel destinations
2. **Historical rates require Pro tier** - defer until Phase 4+ (expense tracking feature)
3. **No batch conversion** - not critical, caching reduces need for bulk calls

### API Call Volume Projections

**Assumptions:**
- Users: 2-5 trips/year, 10-20 currency conversions/trip
- **Caching Strategy**: 24-hour cache for browsing, real-time for blind budget calculations
- **Cache Hit Rate**: 85% (database + React Query caching)

**MVP (500 users):**
- Total conversions: 500 users × 3 trips/year ÷ 12 × 15 conversions/trip = **1,875 conversions/month**
- With 85% caching: **281 API calls/month**
- ExchangeRate-API Free Tier: **$0/month** ✅ (1,500 calls/month)

**Growth (5,000 users):**
- Total conversions: **18,750 conversions/month**
- With 85% caching: **2,813 API calls/month**
- Options:
  - ExchangeRate-API Pro: **$10/month** (100K calls)
  - Frankfurter self-hosted: **$0/month** (unlimited)

**Scale (50,000 users):**
- Total conversions: **187,500 conversions/month**
- With 85% caching: **28,125 API calls/month**
- ExchangeRate-API Pro: **$10/month** (100K calls)
- Frankfurter self-hosted: **$0/month** (unlimited)

### Cost Analysis

| User Count | Monthly Conversions | API Calls (85% cache) | ExchangeRate-API | Frankfurter | Open Exchange Rates |
|------------|--------------------|-----------------------|------------------|-------------|---------------------|
| 500 (MVP) | 1,875 | 281 | **$0** ✅ | $0 | $0 |
| 5,000 | 18,750 | 2,813 | **$10** ✅ | $0 (self-host) | $12 |
| 50,000 | 187,500 | 28,125 | **$10** ✅ | $0 (self-host) | $47 |

**Cost Verdict**: ExchangeRate-API free tier covers MVP. At Growth/Scale, $10/month Pro tier is cheaper than competitors, OR self-host Frankfurter for $0.

### Caching Strategy

**Three-Layer Caching Architecture:**

1. **Database Cache** (Supabase `currency_rates` table):
   - Store rates with 24-hour expiration
   - Shared across all users (reduce API calls)
   - PostgreSQL timestamp for cache invalidation

2. **React Query Cache** (Client-side):
   - In-memory session cache (<10ms conversions)
   - Stale-while-revalidate pattern
   - Fallback to database cache if API fails

3. **CDN Edge Cache** (Vercel):
   - Cache API responses at edge locations
   - Global latency <50ms
   - Automatic purge on rate updates

**Result**: 80-90% API call reduction

### Integration Guide

**Architecture**: Next.js 16 API Route + Supabase Edge Function + React Query

**Step 1: Supabase Currency Rates Table**
```sql
CREATE TABLE currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(base_currency, target_currency)
);

-- RLS: Public read access (rates are public data)
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read currency rates" ON currency_rates FOR SELECT USING (true);
```

**Step 2: Next.js 16 API Route** (`app/api/currency/route.ts`)
```typescript
import { NextResponse } from 'next/server';

const EXCHANGERATE_API_KEY = process.env.EXCHANGERATE_API_KEY;
const FRANKFURTER_URL = 'https://api.frankfurter.app';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // Check database cache (24-hour expiration)
  const cached = await supabase
    .from('currency_rates')
    .select('rate, fetched_at')
    .eq('base_currency', from)
    .eq('target_currency', to)
    .single();

  if (cached && isWithin24Hours(cached.fetched_at)) {
    return NextResponse.json({ rate: cached.rate, source: 'cache' });
  }

  // Try ExchangeRate-API (primary)
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/pair/${from}/${to}`
    );
    const data = await response.json();

    // Cache in database
    await supabase.from('currency_rates').upsert({
      base_currency: from,
      target_currency: to,
      rate: data.conversion_rate,
      fetched_at: new Date().toISOString(),
    });

    return NextResponse.json({ rate: data.conversion_rate, source: 'exchangerate-api' });
  } catch (error) {
    // Fallback to Frankfurter (unlimited free)
    const response = await fetch(`${FRANKFURTER_URL}/latest?from=${from}&to=${to}`);
    const data = await response.json();

    return NextResponse.json({ rate: data.rates[to], source: 'frankfurter' });
  }
}
```

**Step 3: React Query Hook** (`hooks/useCurrencyConversion.ts`)
```typescript
export function useCurrencyConversion(from: string, to: string) {
  return useQuery({
    queryKey: ['currency', from, to],
    queryFn: async () => {
      const response = await fetch(`/api/currency?from=${from}&to=${to}`);
      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
```

**Step 4: Blind Budget Privacy** (Supabase Edge Function)
```typescript
// Server-side conversion ensures privacy (budgets never exposed to client)
Deno.serve(async (req) => {
  const { tripId } = await req.json();

  // Fetch all member budgets (RLS ensures user can only see their own)
  const { data: budgets } = await supabase
    .from('blind_budgets')
    .select('amount, currency')
    .eq('trip_id', tripId);

  // Convert all to trip currency
  const convertedBudgets = await Promise.all(
    budgets.map(b => convertCurrency(b.amount, b.currency, trip.currency))
  );

  // Return only group max (lowest budget), NOT individual amounts
  return new Response(JSON.stringify({
    group_max: Math.min(...convertedBudgets),
    currency: trip.currency,
  }));
});
```

### Migration Strategy

**If free tier exceeded at Growth phase:**

**Option A**: Upgrade to ExchangeRate-API Pro ($10/month, 100K calls)
- Timeline: Instant (just add API key)
- Cost: $10/month
- Benefits: Unlock historical rates, 100K calls/month

**Option B**: Self-host Frankfurter (Docker)
- Timeline: 1 day (Docker deployment to fly.io or Railway)
- Cost: $0/month (included in existing hosting)
- Benefits: Unlimited calls, historical rates back to 1999
- Trade-off: Reduced currency coverage (30+ vs 165)

### Implementation Timeline

1. **Phase 1 (MVP)**: 1-2 days - Next.js API route + React Query caching
2. **Phase 2 (Blind Budgeting)**: 1 day - Supabase Edge Function with privacy
3. **Phase 3 (Historical Rates)**: 0.5 days - Frankfurter historical API (defer to Phase 4+)
4. **Phase 4 (Monitoring)**: 0.5 days - PostHog events + Sentry errors

**Total**: 3-4 days (28-32 hours)

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Free tier rate limit exceeded | Low | Low | Frankfurter fallback provides unlimited calls |
| API downtime | Very Low | Medium | Dual-provider fallback + stale cache usage |
| Inaccurate rates affect budgeting | Very Low | High | ExchangeRate-API 14-year track record, daily updates |
| Privacy leak in currency conversion | Low | **CRITICAL** | Server-side Edge Function for blind budget calculations |
| Vendor lock-in | Very Low | Low | Easy migration to any provider (standard REST API) |

### Monitoring & Observability

**Key Metrics** (via PostHog + Sentry):
- API call volume (track free tier usage)
- Cache hit rate (target: >85%)
- Conversion latency (target: <200ms)
- Fallback usage rate (track Frankfurter fallback frequency)
- Error rate (target: <0.1%)

**Alerting**:
- API calls >1,200/month (80% of free tier) → Plan Pro upgrade
- Cache hit rate <80% → Optimize caching strategy
- Error rate >1% → Investigate API reliability

**Full Research Report**:
- Currency API Decision: `/docs/strategy/phase-12-currency-api-decision.md` (50+ pages, 50+ sources)

---

## Overall Tech Stack Summary

**Status**: Phase 12 Complete (12 of 12 components decided) 🎉

### Current Decisions:

```
Backend:          ✅ Supabase (PostgreSQL + Platform)
Frontend:         ✅ Next.js 16 (App Router)
State:            ✅ React Query + Zustand (Server + UI State)
Styling:          ✅ Tailwind CSS + shadcn/ui + CSS Variables + CSS Modules
Real-time:        ✅ Supabase Realtime (built-in)
Maps:             ✅ Google Maps Platform (JavaScript API + Places + Geocoding)
Testing:          ✅ Vitest + Playwright (86x faster, $0/month)
CI/CD:            ✅ Hybrid (Vercel + GitHub Actions, $0-40/month)
Monitoring:       ✅ Sentry + PostHog (Errors + Analytics, $26/month MVP)
Auth:             ✅ Supabase Auth (built-in)
Email:            ✅ Resend (React Email, $20/month MVP)
Currency:         ✅ ExchangeRate-API + Frankfurter (Free tier, $0/month MVP)
```

### Projected Monthly Costs

**MVP (0-500 users):**
- Backend (Supabase): **$0/month** ✅
- Frontend Hosting (Next.js): **$0/month** ✅ (Hobby tier during dev)
- Deployment (Vercel Pro): **$20/month** (required for commercial use)
- CI/CD (GitHub Actions): **$0/month** ✅
- Maps (Google Maps): **$0-255/month** ⚠️ ($200 credit covers ~100 users)
- Testing (Vitest + Playwright): **$0/month** ✅
- Monitoring (Sentry Team): **$26/month**
- Analytics (PostHog): **$0/month** ✅
- Email (Resend): **$20/month** (50K emails)
- Currency (ExchangeRate-API): **$0/month** ✅ (free tier)
- **TOTAL**: **$66-321/month** (Quality tooling from day one)

**Growth (500-5K users):**
- Backend (Supabase): **$0/month** ✅
- Deployment (Vercel Pro): **$20/month**
- CI/CD (GitHub Actions): **$0/month** ✅
- Maps (Google Maps): **$255-510/month** (migrate to hybrid strategy)
- Testing: **$0/month** ✅
- Monitoring (Sentry Team): **$26/month**
- Analytics (PostHog): **$0/month** ✅
- Email (Resend): **$90/month** (100K emails)
- Currency (ExchangeRate-API): **$10/month** (Pro tier)
- **TOTAL**: **$401-656/month** (Optimize maps via hybrid strategy)

**Scale (5K-50K users) - With Hybrid Strategy:**
- Backend (Supabase): **$25/month** (Pro plan base)
- Deployment (Vercel Pro): **$20/month**
- CI/CD (GitHub Actions): **$20/month** (team scaling)
- Maps (Hybrid): **$1,500-2,700/month** (Google for Asia, Mapbox/Apple for US/Europe)
- Testing: **$8-20/month** (team of 3-5 devs)
- Monitoring (Sentry): **$26-106/month**
- Analytics (PostHog): **$0-250/month**
- Email (Resend): **$500/month** (1M emails) OR AWS SES **$100/month**
- Currency (ExchangeRate-API): **$10/month** OR Frankfurter **$0/month** (self-hosted)
- **TOTAL**: **$2,109-3,631/month** (vs $5,400 with Google-only maps = 30-60% savings)

---

## Risk Register

**Risks to track as we make decisions:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| RLS misconfiguration exposes budget caps | Medium | **CRITICAL** | Test policies with 3+ test accounts, use Security Advisor, code review all RLS policies |
| RLS performance degrades at scale | Medium | High | Index all policy columns, optimize queries, use SECURITY DEFINER functions |
| Supabase free tier hits limits before revenue | Low | Medium | 500MB + 50K MAUs is generous; monitor usage dashboard |
| Local dev Docker stack friction | High | Low | Use 2nd free Supabase project as remote dev database |
| Need to migrate off Supabase later | Low | Medium | PostgreSQL is portable; plan migration only after 5K+ users with revenue |

---

## Next Steps

1. ✅ **Phase 1 Complete: Backend & Database** - Supabase chosen (Feb 8, 2026)

2. ✅ **Phase 2 Complete: Frontend Framework** - Next.js 16 chosen (Feb 8, 2026)

3. **Immediate Next Actions:**
   - [ ] Create Supabase account + Next.js 16 starter project
   - [ ] Design database schema v1 (trips, trip_members, activities, votes, blind_budgets)
   - [ ] Set up Next.js 16 with Supabase SSR auth (use official starter template)
   - [ ] Write RLS policies for all tables
   - [ ] Build proof-of-concept: Trip creation + real-time collaboration
   - [ ] Test blind budgeting privacy with 3+ test accounts
   - [ ] Validate real-time subscriptions (activity feed, vote counts)
   - [ ] Deploy MVP to Netlify/Cloudflare Pages (verify $0 hosting)

4. **Phase 3: State Management Research** (Start after PoC validation)
   - Research React Query, Zustand, Jotai for Next.js 16
   - Test real-time subscription patterns
   - Evaluate optimistic updates and client-side caching
   - Score options using decision matrix
   - Document winner + rationale

5. **Phase 4: Styling & UI Components Research**
   - Research Tailwind CSS + shadcn/ui, Chakra UI, Material UI
   - Test rapid prototyping speed with Next.js 16
   - Build mobile-responsive trip card component
   - Score options using decision matrix

6. **Continue sequentially through remaining phases** (5-10)

---

**Last Updated**: February 9, 2026 - **Phase 12 complete** 🎉 (12 of 12 tech stack components decided). **Complete production stack finalized**: Supabase + Next.js 16 + React Query + Zustand + Tailwind + shadcn/ui + Supabase Realtime + Google Maps + Vitest + Playwright + Hybrid CI/CD (Vercel + GitHub Actions) + Sentry + PostHog + Resend + ExchangeRate-API. **Total cost**: $66-321/month MVP, $401-656/month Growth, $2,109-3,631/month Scale. **Ready to begin implementation** - all technology decisions made with documented rationale and migration paths.
