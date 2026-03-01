# TripFlow Feature Roadmap

**Project Vision:** Collaborative group trip planning platform with privacy-first blind budgeting, democratic voting, and real-time sync.

**Origin:** Merging TripOS codebase with TripFlow, using Asia Trip 2026 as the first real-world test case.

**Timeline:** 12-week implementation (3 months)

---

## Project Merge Plan

### Week 0: Codebase Migration ✅ (This Week)

**Goal:** Consolidate TripOS and TripFlow into one project

**Tasks:**
1. ✅ Copy TripOS documentation to TripFlow
2. ⏭️ Move TripOS codebase to Asia Trip folder
3. ⏭️ Rename TripOS → TripFlow throughout codebase
4. ⏭️ Merge TripFlow's existing work (if any) into TripOS structure
5. ⏭️ Update package names (`@tripos/*` → `@tripflow/*`)
6. ⏭️ Verify build works locally
7. ⏭️ Set up Supabase local development
8. ⏭️ Commit to git, create clean starting point

**Deliverables:**
- Single unified codebase at `/Volumes/SSD/Dev/Asia Trip/tripflow/`
- Working local dev environment
- Documentation aligned with new structure

---

## Development Phases

### Phase 1: Foundation & Setup (Weeks 1-2)

**Goal:** Production-ready development environment and core infrastructure

#### Week 1: Environment & Infrastructure
**Epic 1: User Identity & Access** (partial - just auth)

**Stories:**
- S1.1: Project scaffolding from `with-supabase` starter
- S1.2: Database schema setup (18 tables)
- S1.3: Row-Level Security (RLS) policies
- S1.4: Email/password authentication
- S1.5: Magic link (passwordless) authentication
- S1.6: OAuth providers (Google, GitHub)
- S1.7: Profile management
- S1.8: Password reset flow

**Infrastructure:**
- Supabase local (`pnpm db:start`)
- Environment variables (`.env.local`)
- Type generation (`pnpm db:types`)
- CI/CD pipeline (GitHub Actions)
- Vercel deployment

**Testing:**
- Vitest setup for unit/integration tests
- Playwright setup for E2E tests
- Test coverage baseline

#### Week 2: Core App Shell & Dashboard
**Epic 2: Trip Creation & Personal Dashboard**

**Stories:**
- S2.1: App shell with responsive navigation
- S2.2: Dashboard layout (trip grid)
- S2.3: Create new trip flow
- S2.4: Trip card component with summary
- S2.5: Edit trip details
- S2.6: Archive/delete trip
- S2.7: Trip filtering and search
- S2.8: Empty states and loading skeletons

**Design System:**
- Semantic color tokens (teal=privacy, purple=voting, indigo=primary, amber=CTA)
- CSS variable theming from `globals.css`
- shadcn/ui component library foundation
- Responsive breakpoints (390px mobile, 1440px desktop)

**State Management:**
- React Query provider setup
- Zustand stores for UI state (sidebar, modals)
- Optimistic UI patterns

---

### Phase 2: Itinerary Planning (Weeks 3-5) 🗺️

**Goal:** Core trip planning features - activities, timeline, maps

#### Week 3: Activity Management
**Epic 4: Collaborative Itinerary Planning** (Part 1)

**Stories:**
- S4.1: Day-by-day timeline view
- S4.2: Create activity modal (name, time, location, notes, cost)
- S4.3: Edit/delete activities
- S4.4: Activity card component with booking status
- S4.5: Drag-and-drop reordering within day
- S4.6: Move activities between days
- S4.7: Activity categories and filtering
- S4.8: Cost totals per day and per trip

**Acceptance Criteria:**
- Activities display in chronological order
- Drag-and-drop works on mobile (touch) and desktop
- Real-time updates when other members edit
- Optimistic UI with rollback on error

#### Week 4: Map Integration
**Epic 4: Collaborative Itinerary Planning** (Part 2)

**Stories:**
- S4.9: Google Maps API integration
- S4.10: Location search with autocomplete
- S4.11: Interactive map view with activity pins
- S4.12: Route lines between sequential activities
- S4.13: Points of interest search
- S4.14: Map clustering for dense areas
- S4.15: Mobile-optimized map controls

**Technical:**
- Google Maps JavaScript API
- Places Autocomplete API
- Directions API (routes)
- Geocoding API
- Map styling (custom theme matching app design)

**Data Migration:**
- Import activities from `docs/01-DAY-BY-DAY-PLANNER.md`
- Geocode locations (Shanghai, Hong Kong, Osaka, etc.)
- Populate initial Asia Trip 2026 data

#### Week 5: Itinerary Polish & UX
**Epic 4: Collaborative Itinerary Planning** (Part 3)

**Stories:**
- S4.16: Itinerary view modes (timeline, map, list)
- S4.17: Activity proposals workflow (suggest → review → approve)
- S4.18: Auto-save drafts for new activities
- S4.19: Activity version history
- S4.20: Booking status tracking (not booked, pending, confirmed)
- S4.21: Attendee selection per activity
- S4.22: Activity search and filtering
- S4.23: Day summary cards (count, duration, cost)

**UX Enhancements:**
- Smooth transitions between views
- Keyboard shortcuts (n=new activity, /=search)
- Loading states for map rendering
- Offline-friendly (cache activities locally)

---

### Phase 3: Budget & Expenses (Weeks 6-7) 💰

**Goal:** Multi-currency expense tracking and budget management

#### Week 6: Expense Tracking
**Epic 7: Shared Expenses & Fair Settlement**

**Stories:**
- S7.1: Record expense (amount, category, description, payer)
- S7.2: Multi-currency support (CNY, HKD, JPY, EUR, USD)
- S7.3: Currency conversion API (ExchangeRate-API + Frankfurter fallback)
- S7.4: Expense categories (transport, food, accommodation, activities, shopping, other)
- S7.5: Assign expense to trip activity
- S7.6: Expense summary by category
- S7.7: Trip total expenses
- S7.8: Receipt photo upload (Supabase Storage)

**Data Migration:**
- Import expenses from `docs/02-BUDGET-TRACKER.md`
- Import tracking data from `docs/tracking/expense-tracker.csv`
- Populate actual bookings (Amsterdam-Shanghai-Beijing flights)

#### Week 7: Budget Management & Settlement
**Epic 7: Shared Expenses** (continued)

**Stories:**
- S7.9: Split expense among members (even/percentage/custom/family)
- S7.10: Settlement summary (who owes whom)
- S7.11: Settlement optimization (minimize transactions)
- S7.12: Mark expense as settled
- S7.13: Export expense report (CSV, PDF)
- S7.14: Budget indicators on activities (within budget, near limit, over budget)
- S7.15: Per-member expense breakdown

**Algorithms:**
- Debt simplification (graph theory - minimize edges)
- Multi-currency settlement (convert to base currency)
- Split calculations (handle rounding)

---

### Phase 4: Collaboration Features (Weeks 8-10) 👥

**Goal:** Team building, voting, blind budgeting, real-time sync

#### Week 8: Team Building & Permissions
**Epic 3: Team Building — Members & Roles**

**Stories:**
- S3.1: Invite members via email
- S3.2: Generate shareable invite link
- S3.3: Join trip via invite link/email
- S3.4: Member list with roles
- S3.5: 4-tier role system (Owner > Organizer > Member > Guest)
- S3.6: Assign/change member roles
- S3.7: Permission checks (`useTripPermissions` hook)
- S3.8: Remove member from trip
- S3.9: Leave trip voluntarily
- S3.10: Transfer trip ownership
- S3.11: Member leave cascades (recalculate budget, flag expenses, unassign tasks)

**Permissions Matrix:**
| Action | Owner | Organizer | Member | Guest |
|---|---|---|---|---|
| Edit trip details | ✅ | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ | ❌ |
| Create polls | ✅ | ✅ | ❌ | ❌ |
| Vote on polls | ✅ | ✅ | ✅ | ✅ |
| Add activities | ✅ | ✅ | ✅ | ❌ |
| Edit any activity | ✅ | ✅ | ❌ | ❌ |
| Log expenses | ✅ | ✅ | ✅ | ❌ |
| Set blind budget | ✅ | ✅ | ✅ | ❌ |

#### Week 9: Democratic Voting
**Epic 5: Democratic Decision Making**

**Stories:**
- S5.1: Create poll (question, description, options)
- S5.2: Poll voting methods (yes/no, single choice, ranked choice, approval, veto)
- S5.3: Set poll deadline (countdown timer)
- S5.4: Set quorum requirement (minimum votes to close)
- S5.5: Anonymous voting option
- S5.6: Cast vote
- S5.7: Change vote before deadline
- S5.8: Automatic poll close (deadline or quorum reached)
- S5.9: Poll results visualization (bar charts, vote distribution)
- S5.10: Tiebreaker handling
- S5.11: Link poll to activity/decision
- S5.12: Decision history and audit trail
- S5.13: Poll templates (restaurant, activity, accommodation)
- S5.14: Duplicate poll for similar decisions

**Voting Algorithms:**
- Ranked choice (instant-runoff)
- Approval voting (count all approvals)
- Veto voting (exclude vetoed options, vote on remainder)
- Consensus threshold (e.g., 80% agreement)

#### Week 10: Blind Budgeting (Privacy-First)
**Epic 6: Financial Privacy — Blind Budgeting** ⭐ **Most Complex**

**Stories:**
- S6.1: Set private budget cap (encrypted, RLS-enforced)
- S6.2: Server-side budget aggregation (Edge Function, service_role)
- S6.3: Group maximum budget calculation (MIN of all caps)
- S6.4: Display group budget range (all members see same number)
- S6.5: Budget privacy indicators (show user if their cap is the minimum)
- S6.6: Activity filtering by group budget
- S6.7: Budget indicators on activities (within range, near limit, above)
- S6.8: Educational explainer (how blind budgeting preserves privacy)
- S6.9: Real-time budget recalculation (when any member updates cap)
- S6.10: Timing attack mitigation (random 5-15s delay)
- S6.11: Audit logging (hash-only, never log amounts)
- S6.12: Small group privacy protections (3+ members required)

**Security Requirements:**
- Budget values NEVER in client bundles, API responses, or logs
- RLS policy: users can ONLY read their own budget cap
- Aggregation via Edge Function with `service_role` (bypasses RLS)
- Activity feed logs `budget.submitted` event only (no amounts)
- 90-day data lifecycle (auto-delete old budget caps)

**Implementation:**
```typescript
// Edge Function: calculate-group-budget
const { data: budgets } = await supabase
  .from('trip_member_budgets')
  .select('budget_cap')
  .eq('trip_id', tripId)
  .not('budget_cap', 'is', null)

const groupMax = Math.min(...budgets.map(b => b.budget_cap))

// Add random delay (timing attack mitigation)
await sleep(randomInt(5000, 15000))

return { group_budget_max: groupMax }
```

---

### Phase 5: Real-Time & Notifications (Week 11) 🔔

**Goal:** Live collaboration and notification system

#### Week 11: Real-Time Sync & Notifications
**Epic 8: Live Collaboration & Activity Feed**
**Epic 9: Stay Informed — Notifications & Tasks**

**Real-Time Stories:**
- S8.1: Supabase Realtime channel per trip
- S8.2: Activity feed (timeline of all trip actions)
- S8.3: Real-time activity updates
- S8.4: Real-time poll updates
- S8.5: Real-time expense updates
- S8.6: Presence indicators (online/away/offline)
- S8.7: "Currently viewing" avatars
- S8.8: Optimistic UI reconciliation
- S8.9: Offline queue (sync when reconnected)
- S8.10: Conflict resolution (last-write-wins)

**Notification Stories:**
- S9.1: In-app notification center
- S9.2: Email notifications via Resend
- S9.3: Notification preferences (email, in-app, push)
- S9.4: Quiet hours setting
- S9.5: Per-trip notification mute
- S9.6: Notify: new poll created
- S9.7: Notify: poll deadline approaching
- S9.8: Notify: member joined/left trip
- S9.9: Notify: itinerary changed
- S9.10: Notify: group budget recalculated

**Channel Architecture:**
```typescript
// Subscribe to trip channel
const channel = supabase
  .channel(`trip:${tripId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'activities',
    filter: `trip_id=eq.${tripId}`
  }, (payload) => {
    queryClient.setQueryData(['activities', tripId], ...)
  })
  .subscribe()
```

---

### Phase 6: Polish & Export (Week 12) ✨

**Goal:** Production-ready UX, export features, accessibility

#### Week 12: Export, Offline, & Polish
**Epic 10: Personalize Your Experience**
**Epic 11: Take It With You — Export & Offline**
**Epic 13: Production Quality & Accessibility**

**Export Stories:**
- S11.1: PDF itinerary export (with map screenshots)
- S11.2: iCal calendar export (activities as events)
- S11.3: CSV expense export
- S11.4: Public trip page (shareable read-only link)
- S11.5: Embed itinerary widget

**Personalization Stories:**
- S10.1: Dark mode toggle (class-based `.dark`)
- S10.2: Theme persistence (localStorage + system preference)
- S10.3: Currency preference
- S10.4: Language preference (English MVP, i18n keys in place)
- S10.5: Date/time format preference
- S10.6: Notification preferences

**Offline/PWA Stories:**
- S11.6: Service worker registration
- S11.7: Offline read-only access to itinerary
- S11.8: Cache trip data in IndexedDB
- S11.9: Sync queue for offline changes
- S11.10: PWA manifest (installable)
- S11.11: App icons and splash screens

**Accessibility Stories:**
- S13.1: WCAG 2.1 AA compliance audit
- S13.2: Keyboard navigation (tab order, focus management)
- S13.3: Screen reader support (ARIA labels, landmarks)
- S13.4: Color contrast checks (4.5:1 for text, 3:1 for UI)
- S13.5: Touch target sizes (44px minimum, 48px preferred)
- S13.6: Focus indicators on all interactive elements
- S13.7: Reduced motion support (prefers-reduced-motion)
- S13.8: Skip links and landmarks

**Performance Stories:**
- S13.9: Core Web Vitals optimization (LCP <2.5s, FID <100ms, CLS <0.1)
- S13.10: Image optimization (next/image, lazy loading)
- S13.11: Code splitting (route-based)
- S13.12: Bundle size optimization (<200KB initial JS)
- S13.13: Database query optimization (indexes, N+1 prevention)
- S13.14: Real-time connection pooling

---

## Feature Summary by Epic

| Epic | Stories | Complexity | Priority | Weeks |
|---|---|---|---|---|
| **Epic 1:** User Identity & Access | 17 | Medium | High | 1 |
| **Epic 2:** Trip Creation & Dashboard | 12 | Low | High | 1 |
| **Epic 3:** Team Building & Roles | 11 | Medium | High | 1 |
| **Epic 4:** Itinerary Planning | 23 | High | Critical | 3 |
| **Epic 5:** Democratic Voting | 14 | High | Medium | 1 |
| **Epic 6:** Blind Budgeting | 12 | **Very High** | High | 1 |
| **Epic 7:** Expenses & Settlement | 15 | Medium | High | 2 |
| **Epic 8:** Real-Time Collaboration | 10 | Medium | Medium | 0.5 |
| **Epic 9:** Notifications & Tasks | 10 | Low | Low | 0.5 |
| **Epic 10:** Personalization | 6 | Low | Low | 0.5 |
| **Epic 11:** Export & Offline | 11 | Medium | Medium | 0.5 |
| **Epic 12:** Marketing & Onboarding | 8 | Low | **Deferred** | - |
| **Epic 13:** Production Quality | 14 | Medium | High | 1 |
| **Total** | **163 stories** | - | - | **12 weeks** |

---

## Tech Stack (From TripOS Research)

### Frontend
- **Framework:** Next.js 16 (App Router, React Server Components)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 + shadcn/ui + CSS variables
- **State:** React Query v5 (server state) + Zustand (UI state)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Maps:** Google Maps JavaScript API (MVP)

### Backend
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (email/password, OAuth, magic links)
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage (receipts, trip images)
- **Edge Functions:** Deno/TypeScript (budget calc, poll close, settlement, exports)

### Infrastructure
- **Hosting:** Vercel (frontend)
- **Database:** Supabase (managed PostgreSQL)
- **CI/CD:** GitHub Actions
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Monorepo:** Turbo + pnpm workspaces

### External APIs
- **Maps:** Google Maps (Places, Geocoding, Directions)
- **Currency:** ExchangeRate-API + Frankfurter (fallback)
- **Email:** Resend

---

## Success Metrics

### MVP Launch Criteria (Week 12)
- ✅ All 13 epics implemented (except Epic 12 - Marketing)
- ✅ Asia Trip 2026 fully loaded (23 days, 6 cities, all activities)
- ✅ 3+ real users invited to test (friends/family)
- ✅ All E2E tests passing (green CI/CD)
- ✅ WCAG 2.1 AA compliance
- ✅ Core Web Vitals passing (LCP <2.5s, FID <100ms, CLS <0.1)
- ✅ Deployed to production (tripflow.app or similar)

### Post-MVP
- User onboarding flow (Epic 12)
- Marketing landing page
- Blog/changelog
- Mobile app (React Native + Expo)
- Advanced map features (Mapbox hybrid, offline maps)
- AI trip suggestions (OpenAI integration)

---

## Risk Mitigation

### High-Risk Areas

**1. Blind Budgeting Security** 🔴
- **Risk:** Privacy breach if budget values leak
- **Mitigation:**
  - Never log amounts (hash-only audit trail)
  - RLS policies tested with SQL injection attempts
  - Edge Function security review
  - Timing attack mitigation (random delays)
  - Code review checklist for all budget-related changes

**2. Real-Time Performance** 🟡
- **Risk:** Slow updates with many concurrent users
- **Mitigation:**
  - Connection pooling (max 50 users per trip)
  - Optimistic UI (immediate feedback)
  - Debounce rapid updates (100ms)
  - Load testing with 50 simulated users

**3. Google Maps API Costs** 🟡
- **Risk:** $200 free credit exceeded
- **Mitigation:**
  - Cache geocoded locations (database)
  - Limit Places Autocomplete requests (debounce 300ms)
  - Use static maps for previews (cheaper)
  - Monitor usage dashboard

**4. Scope Creep** 🟡
- **Risk:** 12-week timeline slips
- **Mitigation:**
  - Weekly sprint reviews
  - Ruthless prioritization (MVP vs. nice-to-have)
  - Defer Epic 12 (Marketing) to post-MVP
  - Skip tasks/notifications if time-constrained

---

## Next Steps

### This Week (Week 0)
1. ✅ Complete documentation migration
2. ⏭️ Move TripOS codebase to Asia Trip folder
3. ⏭️ Rename `@tripos/*` → `@tripflow/*`
4. ⏭️ Set up Supabase local development
5. ⏭️ Verify existing features work
6. ⏭️ Create GitHub project board with all 163 stories
7. ⏭️ Schedule kickoff meeting (if team exists)

### Week 1 Kickoff
- Set up development environment for all team members
- Review architecture document (docs/tripos-migration/architecture/architecture.md)
- Review project context (docs/tripos-migration/bmad-output/project-context.md)
- Create first sprint (Epic 1 + Epic 2)
- Start building! 🚀

---

**Last Updated:** 2026-03-01
