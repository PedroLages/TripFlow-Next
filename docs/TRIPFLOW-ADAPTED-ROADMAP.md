# TripFlow Adapted Roadmap

**Status:** Building on existing TripFlow codebase (partial implementation exists)

**Key Decision:** Continue with TripFlow's implementation, reference TripOS docs for unimplemented features

---

## ✅ What's Already Done

### Infrastructure (Week 0 - COMPLETE)
- ✅ Next.js 16 + React 19 + TypeScript
- ✅ Supabase local development setup
- ✅ React Query for server state
- ✅ React Hook Form + Zod validation
- ✅ shadcn/ui component library
- ✅ Tailwind CSS 4 with design tokens
- ✅ Testing setup (Vitest + Playwright)
- ✅ Dark mode (next-themes)

### Routing (Week 1 - PARTIAL)
- ✅ Trip detail pages (`/trips/[tripId]`)
- ✅ Tab navigation (overview, itinerary, voting, budget)
- ⚠️ Using mock data (needs database connection)

### Blind Budgeting (Week 10 - COMPLETE! 🎉)
- ✅ Server Actions for budget management
- ✅ Privacy-preserving calculations
- ✅ Group limit aggregation (MIN of all budgets)
- ✅ User minimum detection
- ✅ Supabase admin client integration
- ⚠️ Missing: Frontend UI components

### Photo Management (Bonus Feature)
- ✅ Photo actions
- ✅ PlacePhoto component
- ⚠️ Needs gallery UI

---

## 🎯 Remaining Work - Phased Roadmap

### Phase 1: Database & Auth (Week 1-2)

**Goal:** Connect existing routes to real Supabase data

#### Week 1: Database Schema & Migrations
**Epic 1: User Identity & Access** (from TripOS)

**Tasks:**
1. Review existing Supabase migrations
2. Create/update schema for:
   - `users` table (auth)
   - `trips` table
   - `trip_members` table (with roles)
   - `blind_budgets` table (already has actions!)
   - `activities` table (itinerary)
   - `polls` table (voting)
   - `expenses` table
   - `photos` table (already has actions!)
3. Set up Row-Level Security (RLS) policies
4. Generate TypeScript types (`pnpm db:types`)

**Acceptance Criteria:**
- Database schema matches TripOS design (18 tables)
- RLS policies prevent unauthorized access
- Types auto-generated and imported

#### Week 2: Authentication
**Epic 1: User Identity & Access** (continued)

**Tasks:**
1. Implement Supabase Auth (email/password)
2. Add OAuth providers (Google, GitHub)
3. Magic link (passwordless) authentication
4. Profile management page
5. Password reset flow
6. Auth middleware (protect routes)
7. Replace mock data with real database queries

**Acceptance Criteria:**
- Users can sign up, sign in, sign out
- Protected routes redirect to login
- Profile page shows user data from Supabase
- Trip pages load real data (not mocks)

---

### Phase 2: Trip Management & Dashboard (Week 3)

**Goal:** Full CRUD for trips with dashboard

**Epic 2: Trip Creation & Personal Dashboard**

**Tasks:**
1. Dashboard page with trip grid
2. Create trip flow (modal or page)
3. Trip card component (status, progress, collaborators)
4. Edit trip details
5. Archive/delete trip (with confirmation)
6. Trip filtering (status, dates)
7. Search trips by destination
8. Empty states for no trips

**Acceptance Criteria:**
- Users can create, edit, delete trips
- Dashboard shows all user's trips
- Filtering and search work
- Progress indicators accurate

---

### Phase 3: Itinerary Planning (Week 4-6)

**Goal:** Core trip planning with map integration

#### Week 4: Activity Management
**Epic 4: Collaborative Itinerary Planning** (Part 1)

**Tasks:**
1. Enhance existing itinerary page
2. Activity CRUD (create, edit, delete)
3. Day-by-day timeline view
4. Activity card component (time, location, cost, booking status)
5. Cost totals per day
6. Activity categories (transport, food, accommodation, etc.)
7. Filtering by category and date

**Acceptance Criteria:**
- Activities display in chronological order
- Users can add/edit/delete activities
- Timeline shows activities grouped by day
- Cost calculations accurate

#### Week 5-6: Map Integration (**MapLibre GL** - Already installed!)
**Epic 4: Collaborative Itinerary Planning** (Part 2)

**Tasks:**
1. Integrate MapLibre GL (already installed!)
2. Display activities on map with pins
3. Location search/autocomplete (use Mapbox Geocoding API or Nominatim)
4. Route lines between sequential activities
5. Map clustering for dense areas
6. Mobile-optimized map controls
7. Sync map with timeline (click pin → scroll to activity)

**Technical Notes:**
- **TripFlow uses MapLibre GL** (open-source), not Google Maps
- Consider Mapbox Geocoding API (generous free tier) or Nominatim (OSM, free)
- Reference TripOS map research (docs/tripos-migration/research/mapbox-evaluation-report.md)

**Data Migration:**
- Import activities from `docs/01-DAY-BY-DAY-PLANNER.md`
- Geocode locations for Asia Trip 2026

---

### Phase 4: Budget & Expenses (Week 7-8)

**Goal:** Multi-currency expense tracking + blind budget UI

#### Week 7: Expense Tracking
**Epic 7: Shared Expenses & Fair Settlement**

**Tasks:**
1. Record expense (amount, category, description, payer)
2. Multi-currency support (CNY, HKD, JPY, EUR, USD)
3. Currency conversion API integration
4. Assign expense to activity
5. Expense summary by category
6. Receipt photo upload (Supabase Storage)
7. Expense list/table view

**Acceptance Criteria:**
- Users can log expenses with currency
- Automatic conversion to base currency
- Expenses linked to activities
- Category summaries accurate

#### Week 8: Blind Budget UI + Settlement
**Backend already done! Need UI.**

**Tasks:**
1. **Blind Budget UI** (connect to existing actions):
   - Budget input modal (private, encrypted-looking)
   - Group limit display (everyone sees same number)
   - Privacy indicator ("Your budget is setting the group limit")
   - Educational explainer (how it works)
   - Budget indicators on activities (within/near/over budget)
2. **Expense Settlement:**
   - Split expense among members (even, percentage, custom)
   - Settlement summary (who owes whom)
   - Debt optimization (minimize transactions)
   - Mark as settled

**Acceptance Criteria:**
- Blind budget actions work from UI
- Group limit updates when any member changes budget
- Settlement calculations accurate
- Privacy guarantees hold (no individual amounts leaked)

---

### Phase 5: Collaboration Features (Week 9-10)

**Goal:** Team building, permissions, voting

#### Week 9: Team Building
**Epic 3: Team Building — Members & Roles**

**Tasks:**
1. Invite members via email
2. Generate shareable invite link
3. Join trip via invite
4. Member list with avatars and roles
5. 4-tier role system (Owner > Organizer > Member > Guest)
6. Assign/change roles (Owner/Organizer only)
7. Remove member (with confirmation)
8. Leave trip (with cascade effects)
9. Permission checks (`useTripPermissions` hook)

**Permissions Matrix:** (from TripOS)
| Action | Owner | Organizer | Member | Guest |
|---|---|---|---|---|
| Edit trip | ✅ | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ | ❌ |
| Create polls | ✅ | ✅ | ❌ | ❌ |
| Vote | ✅ | ✅ | ✅ | ✅ |
| Add activities | ✅ | ✅ | ✅ | ❌ |
| Log expenses | ✅ | ✅ | ✅ | ❌ |

**Acceptance Criteria:**
- Invite flow works (email + link)
- Roles enforced at database level (RLS)
- Member leave cascades (recalculate budget, flag expenses)

#### Week 10: Democratic Voting
**Epic 5: Democratic Decision Making**

**Tasks:**
1. Enhance existing voting page
2. Create poll modal (question, options)
3. Poll voting methods:
   - Yes/No (simple majority)
   - Single choice (pick one)
   - Ranked choice (instant-runoff)
   - Approval voting (select multiple)
   - Veto voting (exclude options)
4. Set deadline (countdown timer)
5. Set quorum (minimum votes to close)
6. Anonymous voting option
7. Cast vote / change vote
8. Auto-close on deadline/quorum
9. Results visualization (bar charts)
10. Link poll to activity
11. Decision history

**Voting Algorithms:** (from TripOS)
- Ranked choice: Instant-runoff elimination
- Approval: Count all approvals
- Veto: Exclude vetoed, vote on remainder

**Acceptance Criteria:**
- All 5 voting methods work correctly
- Deadline enforcement accurate
- Results displayed clearly
- Anonymous voting preserves privacy

---

### Phase 6: Real-Time & Notifications (Week 11)

**Goal:** Live collaboration and notification system

**Epic 8: Live Collaboration & Activity Feed**
**Epic 9: Stay Informed — Notifications & Tasks**

**Tasks:**
1. Supabase Realtime channel per trip
2. Activity feed (timeline of actions)
3. Real-time activity updates (add/edit/delete)
4. Real-time poll updates (new votes)
5. Real-time budget recalculation
6. Presence indicators (online/away/offline)
7. Optimistic UI reconciliation
8. In-app notification center
9. Email notifications (Resend)
10. Notification preferences

**Acceptance Criteria:**
- Changes appear instantly for all users
- Activity feed shows all trip events
- Email notifications sent for key events (poll created, deadline, member joined)
- Presence accurate

---

### Phase 7: Polish & Export (Week 12)

**Goal:** Production-ready UX, export features

**Epic 10: Personalization**
**Epic 11: Export & Offline**
**Epic 13: Production Quality**

**Tasks:**
1. **Export:**
   - PDF itinerary (with map screenshots)
   - iCal calendar export
   - CSV expense export
   - Public trip page (read-only shareable link)

2. **Personalization:**
   - Dark mode toggle (already installed, needs UI)
   - Currency preference
   - Language preference (i18n keys)
   - Notification preferences

3. **Photo Gallery:**
   - Gallery UI for photos (already has backend)
   - Upload photos
   - Lightbox view (already has `yet-another-react-lightbox`)
   - Link photos to activities/locations

4. **Accessibility:**
   - WCAG 2.1 AA audit
   - Keyboard navigation
   - Screen reader support
   - Color contrast checks
   - Touch target sizes (44px min)

5. **Performance:**
   - Core Web Vitals optimization
   - Image optimization (next/image)
   - Code splitting
   - Bundle size (<200KB initial JS)

**Acceptance Criteria:**
- All export formats work
- Dark mode functional
- Photo gallery complete
- Accessibility audit passes
- Performance metrics meet targets

---

## 📊 Adapted Timeline Summary

| Phase | Weeks | Focus | Status |
|---|---|---|---|
| **Phase 0** | Week 0 | Infrastructure | ✅ **DONE** |
| **Phase 1** | Week 1-2 | Database + Auth | ⏭️ Next |
| **Phase 2** | Week 3 | Trip CRUD + Dashboard | 🔲 Pending |
| **Phase 3** | Week 4-6 | Itinerary + Maps | 🔲 Pending |
| **Phase 4** | Week 7-8 | Budget + Expenses | 🟡 Backend done, UI needed |
| **Phase 5** | Week 9-10 | Collaboration + Voting | 🔲 Pending |
| **Phase 6** | Week 11 | Real-Time + Notifications | 🔲 Pending |
| **Phase 7** | Week 12 | Polish + Export | 🔲 Pending |

**Total:** 12 weeks (but Phase 0 and part of Phase 4 already done!)

---

## 🔑 Key Differences from TripOS Roadmap

### What TripFlow Does Differently:

1. **MapLibre GL instead of Google Maps**
   - ✅ Free and open-source
   - ✅ No API costs
   - ⚠️ Need geocoding provider (Mapbox or Nominatim)
   - Reference: `docs/tripos-migration/research/mapbox-evaluation-report.md`

2. **Single App Structure (not monorepo)**
   - ✅ Simpler development
   - ✅ Faster initial setup
   - ⚠️ Harder to extract shared packages later

3. **Zod 4 (not 3.23.8)**
   - ✅ Latest features
   - ⚠️ TripOS avoided Zod 4 due to Turbopack issues
   - Monitor for build errors

4. **Photo Management**
   - ✅ Already has photo actions and component
   - ✅ Gallery with lightbox
   - Not in TripOS plan

5. **Blind Budgeting Backend Complete**
   - ✅ All server actions done
   - ✅ Privacy logic implemented
   - ⚠️ Just needs UI components

---

## 🎯 Immediate Next Steps

### This Week (Week 1)

**Option A: Continue with TripFlow codebase** ⭐ **(Recommended)**
1. Review existing Supabase schema
2. Connect trip pages to database (remove mocks)
3. Implement authentication
4. Build blind budget UI (connect to existing actions)
5. Import Asia Trip data

**Option B: Merge TripOS into TripFlow**
1. Copy TripOS monorepo structure
2. Migrate TripFlow components to `apps/web`
3. Resolve conflicts (MapLibre vs Google Maps, Zod versions)
4. Keep TripFlow's blind budget actions
5. Test everything still works

**My Recommendation:** **Option A** - Continue with TripFlow
- Blind budgeting backend is done (huge win!)
- MapLibre is better (free, open-source)
- Simpler structure
- Less migration work
- Reference TripOS docs for unimplemented features

---

## 📚 How to Use TripOS Documentation

Even though we're continuing with TripFlow, the TripOS docs are invaluable:

**Architecture Reference:**
- Read: `docs/tripos-migration/architecture/architecture.md`
- Use for: Tech stack rationale, patterns, best practices

**Implementation Patterns:**
- Read: `docs/tripos-migration/bmad-output/project-context.md`
- Use for: Code style, anti-patterns, critical rules

**Feature Specs:**
- Read: `docs/tripos-migration/epics/epics.md`
- Use for: User stories, acceptance criteria, feature details

**Research:**
- Read: `docs/tripos-migration/research/` (60+ reports)
- Use for: Technology decisions, competitive analysis

**Design:**
- Read: `docs/tripos-migration/style-guide.md`
- Use for: Color palettes, typography, semantic tokens

---

## 🚀 Let's Get Started!

**Ready to begin Phase 1 (Database + Auth)?**

I can help with:
1. Reviewing/creating Supabase migrations
2. Setting up authentication
3. Replacing mock data with real queries
4. Building blind budget UI components
5. Importing Asia Trip data from Markdown files

What would you like to tackle first?

---

**Last Updated:** 2026-03-01
