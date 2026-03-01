# TripFlow MVP Sprint Roadmap

**Timeline:** 18 sprints (9 months)
**Sprint Duration:** 2 weeks
**Team Size:** 2-3 full-stack developers
**Story Velocity:** 5-8 stories per sprint

---

## Sprint Schedule

| Sprint | Dates (Example) | Epic | Stories | Focus Area | Key Deliverables |
|--------|-----------------|------|---------|------------|------------------|
| **0** | Week 1-2 | Foundation | 1 | Setup | Dev environment, Supabase, APIs, CI/CD |
| **1** | Week 3-4 | Epic 1 | 5 | Auth | Email/password registration, login, OAuth setup |
| **2** | Week 5-6 | Epic 1, 2 | 6 | Auth + Trips | Password reset, profile mgmt, RLS, trip creation |
| **3** | Week 7-8 | Epic 2 | 7 | Trips | Trip CRUD, invitations, member management, archive |
| **4** | Week 9-10 | Epic 3 | 7 | Budgeting Phase 1 | Budget schema, encryption, CRUD, Edge Function |
| **5** | Week 11-12 | Epic 3 | 5 | Budgeting Phase 2 | Aggregation, collective view, real-time updates |
| **6** | Week 13-14 | Epic 3, 4 | 6 | Budgeting + Itinerary | Privacy safeguards, tutorial, activity CRUD |
| **7** | Week 15-16 | Epic 4 | 7 | Itinerary Phase 1 | Drag-drop, day assignment, edit activity |
| **8** | Week 17-18 | Epic 4 | 5 | Itinerary Phase 2 | Timeline view, notes, status, real-time sync |
| **9** | Week 19-20 | Epic 4, 5 | 6 | Real-time + Voting | Presence, editing indicators, vote schema, create vote |
| **10** | Week 21-22 | Epic 5 | 5 | Voting Phase 1 | Submit ballot, reveal results, vote history |
| **11** | Week 23-24 | Epic 5 | 5 | Voting Phase 2 | Vote status, manual close, Yes/No + Single-Choice types |
| **12** | Week 25-26 | Epic 8 | 6 | Expenses Phase 1 | Expense schema, CRUD, splitting, settlement |
| **13** | Week 27-28 | Epic 8 | 6 | Expenses Phase 2 | Who owes whom, history, filtering, export |
| **14** | Week 29-30 | Epic 8 | 5 | Multi-Currency | Set budget/expense in any currency, conversion, breakdown |
| **15** | Week 31-32 | Polish | - | Testing | E2E test coverage, accessibility audit |
| **16** | Week 33-34 | Polish | - | Performance | Core Web Vitals optimization, bug fixes |
| **17** | Week 35-36 | Launch Prep | - | Docs | User guides, marketing site, beta onboarding |
| **18** | Week 37-38 | Launch Prep | - | Deploy | Production deployment, monitoring, beta launch |

---

## Epic Completion Timeline

```
Sprint 0  [■] Foundation
Sprint 1-2  [■■] Epic 1: Authentication (100%)
Sprint 2-3  [■■] Epic 2: Trips (100%)
Sprint 4-6  [■■■] Epic 3: Blind Budgeting (100%)
Sprint 6-9  [■■■■] Epic 4: Itinerary (100%)
Sprint 9-11 [■■■] Epic 5: Voting (100%)
Sprint 12-14 [■■■] Epic 8: Expenses (100%)
Sprint 15-16 [■■] Polish & Testing
Sprint 17-18 [■■] Launch Preparation
```

---

## Milestone Tracker

### Milestone 1: Foundation Complete (End of Sprint 0)
**Date:** Week 2
**Deliverables:**
- [ ] Next.js 16 + TypeScript + Tailwind v4 project initialized
- [ ] Supabase local development environment running
- [ ] Google Maps JavaScript API integrated with test map
- [ ] Photo APIs (Unsplash, Pexels, Google Places) configured with fallback chain
- [ ] CI/CD pipeline passing (TypeScript, ESLint, unit tests)
- [ ] Percy visual regression tests configured

---

### Milestone 2: Core Platform Ready (End of Sprint 3)
**Date:** Week 8
**Deliverables:**
- [ ] Users can register, log in (email + OAuth), and manage profiles
- [ ] Row-Level Security (RLS) enforced for trip access
- [ ] Users can create trips, invite members, and manage membership
- [ ] Trip dashboard displays all trips user is a member of
- [ ] GDPR compliance (data export, account deletion)

**Demo:**
> "As a user, I can create an account, create a trip, invite friends via email, and see all my trips in the dashboard."

---

### Milestone 3: Blind Budgeting Complete (End of Sprint 6)
**Date:** Week 14
**Deliverables:**
- [ ] Users can set private budgets (encrypted at database level)
- [ ] Edge Function aggregates budgets server-side (no individual budget leaks)
- [ ] Collective possibilities view displays (e.g., "4 people can afford €150/night hotels")
- [ ] Privacy tutorial completes on first budget setup
- [ ] Privacy dashboard shows what each member can see
- [ ] Minimum 3-traveler enforcement prevents inference attacks

**Demo:**
> "As a trip member, I can set my private budget, see collective possibilities without seeing anyone's individual budget, and complete the privacy tutorial that explains how blind budgeting works."

**Launch Blocker Check:**
- [ ] E2E tests verify zero individual budget leaks (DevTools, Network tab, logs)
- [ ] Security code review completed
- [ ] Edge Function performance <200ms

---

### Milestone 4: Collaborative Planning Complete (End of Sprint 9)
**Date:** Week 20
**Deliverables:**
- [ ] Users can add activities and accommodations to shared itinerary
- [ ] Users can assign activities to days, reorder via drag-drop, move between days
- [ ] Day-by-day timeline view displays itinerary
- [ ] Real-time sync propagates updates to all members within 500ms
- [ ] Presence indicators show who's online
- [ ] Editing indicators show who's editing what activity

**Demo:**
> "As a trip member, I can add activities to the itinerary, drag them to different days, and see real-time updates from other members who are editing simultaneously."

**Launch Blocker Check:**
- [ ] Real-time sync latency <500ms (P95)
- [ ] No data loss on concurrent edits (tested with 2+ users)

---

### Milestone 5: Democratic Voting Complete (End of Sprint 11)
**Date:** Week 24
**Deliverables:**
- [ ] Users can create votes for activities/accommodations
- [ ] Users can submit anonymous ballots (votes hidden until all members submit)
- [ ] Voting results reveal after all members vote
- [ ] Vote history shows past decisions
- [ ] Yes/No and Single-Choice vote types supported

**Demo:**
> "As a trip member, I can create a vote for two restaurant options, all members submit their votes anonymously, and results reveal after everyone has voted."

**Launch Blocker Check:**
- [ ] E2E tests verify vote anonymity (individual votes hidden until reveal)
- [ ] Quorum logic works (all members must vote before reveal)

---

### Milestone 6: Expense Tracking Complete (End of Sprint 14)
**Date:** Week 30
**Deliverables:**
- [ ] Users can add shared expenses with categories
- [ ] Users can specify who paid and who splits the expense
- [ ] Fair split calculations (equal or custom percentages)
- [ ] Settlement summary shows who owes whom
- [ ] Users can mark expenses as settled
- [ ] Multi-currency support (USD, EUR, CNY, JPY)
- [ ] Real-time currency conversion via Frankfurter API

**Demo:**
> "As a trip member, I can log a restaurant expense in EUR, split it among 4 people, see who owes whom, and view the settlement summary in my preferred currency (USD)."

**Launch Blocker Check:**
- [ ] Currency conversion accuracy <$0.01 error
- [ ] Exchange rates update daily
- [ ] JPY rounding works correctly (integer, no decimals)

---

### Milestone 7: MVP Feature Complete (End of Sprint 14)
**Date:** Week 30
**Status:** All MVP epics shipped (Epics 1-5, 8)

**Success Criteria:**
- [ ] All 71 MVP stories completed
- [ ] All 75 MVP FRs implemented
- [ ] No critical bugs in backlog
- [ ] Manual smoke tests pass for all user flows

---

### Milestone 8: Quality Assurance Complete (End of Sprint 16)
**Date:** Week 34
**Deliverables:**
- [ ] E2E test coverage for all MVP epics (Playwright)
- [ ] Accessibility audit passes (WCAG 2.1 AA compliance)
- [ ] Core Web Vitals meet targets:
  - [ ] LCP <2.5s
  - [ ] FID <100ms
  - [ ] CLS <0.1
- [ ] Cross-browser testing passes (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified (iOS Safari, Chrome Android)
- [ ] All launch blockers resolved

**Launch Blocker Check:**
- [ ] **Zero blind budget leaks** (E2E tests pass, security audit complete)
- [ ] **Real-time sync stability** (no data loss on concurrent edits)
- [ ] **Multi-currency accuracy** (correct conversions, <$0.01 rounding error)
- [ ] **WCAG 2.1 AA compliance** (accessibility audit pass)
- [ ] **Core Web Vitals meet targets** (LCP, FID, CLS)

---

### Milestone 9: Production Launch (End of Sprint 18)
**Date:** Week 38
**Deliverables:**
- [ ] User documentation (getting started guide, FAQs)
- [ ] Marketing site live with demo video
- [ ] Beta user onboarding materials ready
- [ ] Production deployment to Vercel + Supabase Cloud
- [ ] Monitoring and alerting configured (Vercel Analytics, Sentry)
- [ ] Beta users invited (target: 100 users)

**Success Criteria:**
- [ ] Beta users can complete end-to-end trip planning workflow
- [ ] No critical bugs in production
- [ ] Uptime >99.5% (first 30 days)

---

## Weekly Cadence

### Monday (Sprint Planning)
- Review previous sprint velocity
- Select 5-8 stories for current sprint
- Break down stories into tasks
- Assign tasks to developers

### Wednesday (Mid-Sprint Sync)
- Review progress (story status, blockers)
- Demo completed work
- Adjust priorities if needed

### Friday (Sprint Review & Retro)
- Demo completed stories to stakeholders
- Retrospective (what went well, what to improve)
- Update velocity for next sprint

---

## Risk Mitigation Schedule

### Sprint 4: Blind Budgeting Security Review
**Activity:** Prototype Edge Function aggregation
**Owner:** Engineering Lead
**Success Criteria:**
- [ ] Edge Function returns ONLY aggregate values (no individual budgets)
- [ ] Performance <200ms for 10-person group
- [ ] Security code review identifies no vulnerabilities

---

### Sprint 5: Blind Budgeting E2E Testing
**Activity:** Verify zero individual budget leaks
**Owner:** QA Engineer (or senior developer)
**Success Criteria:**
- [ ] E2E tests check DevTools Network tab (no individual budgets)
- [ ] E2E tests check browser console logs (no individual budgets)
- [ ] E2E tests check React Query cache (no individual budgets)

---

### Sprint 8: Real-Time Sync Stability Testing
**Activity:** Test concurrent editing scenarios
**Owner:** Engineering Lead
**Success Criteria:**
- [ ] 2 users editing same activity simultaneously (no data loss)
- [ ] Real-time sync latency <500ms (measured via Playwright)
- [ ] Presence indicators update correctly

---

### Sprint 14: Multi-Currency Accuracy Testing
**Activity:** Validate currency conversion
**Owner:** QA Engineer
**Success Criteria:**
- [ ] Test USD ↔ EUR ↔ CNY ↔ JPY conversions
- [ ] Verify JPY rounding (integer, no decimals)
- [ ] Check edge cases (very large amounts, very small amounts)

---

### Sprint 16: Security Audit
**Activity:** Third-party security audit
**Owner:** Product Owner (contract external auditor)
**Success Criteria:**
- [ ] No critical or high-severity vulnerabilities found
- [ ] All blind budgeting privacy checks pass
- [ ] Audit report published before launch

---

## Velocity Assumptions

**Baseline Velocity:** 5-8 stories per sprint

**Factors Affecting Velocity:**
- **Sprint 0:** Setup sprint (only 1 story, but complex)
- **Sprints 1-3:** Ramping up (5 stories/sprint)
- **Sprints 4-6:** Complex epic (blind budgeting) (6 stories/sprint)
- **Sprints 7-14:** Steady state (7 stories/sprint)
- **Sprints 15-16:** Polish (no new stories, focus on testing)
- **Sprints 17-18:** Launch prep (no new stories, focus on docs/deploy)

**Velocity Tracking:**
- Record actual stories completed per sprint
- Adjust future sprint planning based on actual velocity
- If velocity drops below 5 stories/sprint, review blockers and adjust scope

---

## Dependencies & Blockers

### External Dependencies
- **Google Maps API:** Required for Epic 6 (Growth Phase 1)
- **Frankfurter API:** Required for Epic 8 multi-currency (Sprint 14)
- **Supabase Edge Functions:** Required for Epic 3 blind budgeting (Sprint 4)
- **OAuth Providers:** Required for Epic 1 OAuth login (Sprint 1)

**Mitigation:**
- Set up API keys in Sprint 0
- Test integrations early (don't wait until feature sprint)
- Have fallback plans (e.g., if Frankfurter API fails, use cached rates)

---

### Team Dependencies
- **Design:** UI mockups needed before Sprint 1
- **Product:** PRD finalized before Sprint 0
- **DevOps:** Vercel + Supabase accounts set up before Sprint 0

**Mitigation:**
- Design works 1 sprint ahead (mockups ready before development sprint)
- Product reviews stories during sprint planning
- DevOps set up in Sprint 0

---

## Post-MVP Roadmap Preview

### Growth Phase 1 (Sprints 19-30, 3 months)
**Priority Order:**
1. Epic 11: Offline Functionality & PWA (12 stories, 3 sprints)
2. Epic 6: Interactive Maps & Location Services (8 stories, 2 sprints)
3. Epic 13: Calendar Integration & Export (7 stories, 2 sprints)
4. Epic 7: Photo Management & Receipt OCR (7 stories, 2 sprints)
5. Epic 12: Advanced Collaboration & Permissions (6 stories, 1.5 sprints)
6. Epic 10: Search, Filter & Discovery (4 stories, 1 sprint)

**Timeline:** 12 sprints (6 months) post-MVP

---

### Growth Phase 2 (Sprints 31-36, 2 months)
1. Epic 9: Payment Integration & Settlement (3 stories, 1 sprint)
2. Epic 14: Notifications & Engagement (6 stories, 1.5 sprints)

**Timeline:** 4 sprints (2 months) post-Growth Phase 1

---

## Success Metrics (Track Weekly)

### Development Metrics
- **Velocity:** Stories completed per sprint (target: 5-8)
- **Code Quality:** ESLint warnings (target: <10), TypeScript errors (target: 0)
- **Test Coverage:** Unit test coverage (target: >80%), E2E scenarios (target: 100% of critical flows)
- **Build Time:** CI/CD pipeline duration (target: <5 minutes)

### Product Metrics (Post-Launch)
- **User Activation:** % of users who create first trip (target: >80%)
- **Budget Adoption:** % of trips with 3+ budgets set (target: >70%)
- **Vote Usage:** % of trips with 1+ vote (target: >60%)
- **Expense Tracking:** % of trips with 1+ expense (target: >50%)

---

## Contingency Plans

### If Velocity Drops Below 5 Stories/Sprint
**Action:**
- Review blockers (technical debt, unclear requirements, team availability)
- Reduce scope (defer Epic 5 advanced voting to Growth)
- Extend timeline (add 2-4 sprints to MVP)

---

### If Critical Bug Blocks Progress
**Action:**
- Pause new feature development
- All hands on bug fix
- Adjust sprint plan to account for lost time

---

### If External API Fails (e.g., Frankfurter API)
**Action:**
- Implement fallback (cached exchange rates, manual entry)
- Continue development with fallback
- Re-integrate API when available

---

**For detailed prioritization analysis, see:** [epic-prioritization-analysis.md](./epic-prioritization-analysis.md)
**For quick reference summary, see:** [epic-prioritization-summary.md](./epic-prioritization-summary.md)
