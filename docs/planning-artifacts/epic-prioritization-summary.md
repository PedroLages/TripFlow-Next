# Epic Prioritization Summary - Quick Reference

**Document Version:** 1.0
**Date:** 2026-03-01
**Full Analysis:** [epic-prioritization-analysis.md](./epic-prioritization-analysis.md)

---

## TL;DR

**Problem:** Epic breakdown expanded from 72 FRs (PRD MVP) to 159 FRs (+121% growth)

**Solution:** Aggressively scope down to 75 FRs across 71 stories for MVP

**Timeline:** 7-9 months (14-18 sprints, 2-week sprints, 2-3 developers)

**MVP Focus:** Blind budgeting (core differentiator) + collaborative planning + democratic voting + expense splitting

**Defer to Growth:** Offline sync, maps, receipt OCR, advanced notifications, payment integration, calendar sync

---

## Epic Categorization Table

| Epic # | Epic Name | Stories | FRs | Category | Timeline | Priority |
|--------|-----------|---------|-----|----------|----------|----------|
| **0** | Project Foundation & Setup | 1 | 5 | **MVP Critical** | Sprint 0 | Foundation |
| **1** | Authentication & Access Control | 9 | 9 | **MVP Critical** | Sprints 1-2 | High |
| **2** | Trip Creation & Member Mgmt | 10 | 10 | **MVP Critical** | Sprints 2-3 | High |
| **3** | Blind Budgeting (Core) | 16 | 17 | **MVP Critical** | Sprints 4-6 | **CRITICAL** |
| **4** | Collaborative Itinerary | 15 (of 17) | 21 (of 23) | **MVP Critical** | Sprints 6-9 | High |
| **5** | Democratic Voting | 10 (of 17) | 10 (of 17) | **MVP Critical** | Sprints 9-11 | High |
| **6** | Maps & Location Services | 8 | 8 | **Growth Phase 1** | Post-MVP | High |
| **7** | Photo Mgmt & Receipt OCR | 7 | 7 | **Growth Phase 1** | Post-MVP | Medium-High |
| **8** | Expense Tracking & Multi-Currency | 17 (of 19) | 17 (of 19) | **MVP Critical** | Sprints 11-14 | High |
| **9** | Payment Integration | 3 | 3 | **Growth Phase 2** | Year 2 | Medium |
| **10** | Search, Filter & Discovery | 4 | 4 | **Growth Phase 1** | Post-MVP | Medium |
| **11** | Offline Functionality & PWA | 12 | 12 | **Growth Phase 1** | Post-MVP | High |
| **12** | Advanced Collab & Permissions | 6 | 6 | **Growth Phase 1** | Post-MVP | Medium |
| **13** | Calendar Integration & Export | 7 | 7 | **Growth Phase 1** | Post-MVP | High |
| **14** | Notifications & Engagement | 6 | 6 | **Growth Phase 2** | Year 2 | Medium |
| **15** | Post-Trip Closure & Retention | 6 | 6 | **Future/Deferred** | TBD | Low |

---

## MVP Sprint Plan (14-18 sprints)

### Sprint 0: Foundation (1 sprint)
- Project setup, Supabase, Google Maps, photo APIs, CI/CD

### Sprints 1-3: Core Platform (3 sprints)
- **Epic 1:** Authentication & Access Control (9 stories)
- **Epic 2:** Trip Creation & Member Management (10 stories)

### Sprints 4-6: Blind Budgeting (3 sprints)
- **Epic 3:** Blind Budgeting - Core Differentiator (16 stories)
  - Phase 1: Budget CRUD with encryption
  - Phase 2: Server-side aggregation, collective view
  - Phase 3: Category budgets, privacy safeguards, tutorial

### Sprints 7-9: Collaborative Planning (3 sprints)
- **Epic 4:** Collaborative Itinerary Planning (15 stories)
  - Phase 1: Activity CRUD, drag-drop, day assignment
  - Phase 2: Timeline view, notes, status
  - Phase 3: Real-time sync, presence indicators

### Sprints 10-11: Democratic Voting (2 sprints)
- **Epic 5:** Democratic Decision-Making (10 stories)
  - Phase 1: Voting CRUD, anonymous ballots, reveal
  - Phase 2: Vote history, Yes/No + Single-Choice types

### Sprints 12-14: Expense Tracking (3 sprints)
- **Epic 8:** Expense Tracking & Multi-Currency (17 stories)
  - Phase 1: Expense CRUD, splitting, settlement
  - Phase 2: History, filtering, export
  - Phase 3: Multi-currency support

### Sprints 15-16: Polish & Testing (2 sprints)
- E2E test coverage
- Accessibility audit (WCAG 2.1 AA)
- Performance optimization (Core Web Vitals)
- Bug fixes

### Sprint 17-18: Launch Prep (2 sprints)
- Documentation
- Marketing site
- Beta user onboarding
- Production deployment

---

## Growth Phase 1 (3-4 months post-MVP)

**Priority Order:**
1. **Epic 11:** Offline Functionality & PWA (12 stories) - **CRITICAL for travel**
2. **Epic 6:** Interactive Maps & Location Services (8 stories)
3. **Epic 13:** Calendar Integration & Export (7 stories)
4. **Epic 7:** Photo Management & Receipt OCR (7 stories)
5. **Epic 12:** Advanced Collaboration & Permissions (6 stories)
6. **Epic 10:** Search, Filter & Discovery (4 stories)
7. **Epic 4 (deferred):** Threaded Comments + Edit History (2 stories)
8. **Epic 5 (deferred):** Advanced Vote Types + Deadlines (7 stories)

**Total:** 53 stories, 57 FRs

---

## Growth Phase 2 (1-2 months after Phase 1)

1. **Epic 9:** Payment Integration & Settlement (3 stories)
2. **Epic 14:** Notifications & Engagement (6 stories)

**Total:** 9 stories, 9 FRs

---

## Scope Comparison

| Scope | FRs | Stories | Deviation from PRD MVP |
|-------|-----|---------|------------------------|
| **PRD MVP** | 72 | ~60 (estimated) | Baseline |
| **Epic Total** | 159 | 147 | +121% (scope creep) |
| **Recommended MVP** | 75 | 71 | +4% (only critical additions) |
| **Deferred to Growth** | 84 | 76 | - |

---

## Launch Blockers (DO NOT LAUNCH UNTIL VERIFIED)

1. **Zero blind budget leaks** (E2E tests pass, security audit complete)
2. **Real-time sync stability** (no data loss on concurrent edits)
3. **Multi-currency accuracy** (correct conversions, <$0.01 rounding error)
4. **WCAG 2.1 AA compliance** (accessibility audit pass)
5. **Core Web Vitals meet targets** (LCP <2.5s, FID <100ms, CLS <0.1)

---

## Key Scope Decisions

### Deferred from Original Epic Scope

| Epic | Deferred Stories | Justification |
|------|------------------|---------------|
| **Epic 4** | Threaded comments (FR121-FR123), Edit history/undo (FR127-FR129) | NOT in PRD MVP; Growth Phase 1 |
| **Epic 5** | Ranked-choice/approval/veto votes (FR106-FR109), Deadlines/reminders (FR154-FR156) | NOT in PRD MVP; Yes/No + Single-Choice sufficient |
| **Epic 6** | All 8 stories (maps, routes, timezone) | NOT in PRD MVP; text addresses work for MVP |
| **Epic 7** | All 7 stories (photos, receipt OCR) | NOT in PRD MVP; Growth Phase 1 |
| **Epic 8** | Receipt photo upload (FR110-FR112) | NOT in PRD MVP; manual entry works |
| **Epic 9** | All 3 stories (payment integration) | PRD: "External integrations deferred to Growth" |
| **Epic 10** | All 4 stories (search/filter) | NOT in PRD MVP; small trips manageable without |
| **Epic 11** | All 12 stories (offline sync, PWA) | PRD: "Offline-first sync (Growth feature)" |
| **Epic 12** | All 6 stories (roles, public sharing) | PRD: "Basic Collaboration" only in MVP |
| **Epic 13** | All 7 stories (calendar sync, export) | PRD: "Export & Sharing" in Growth section |
| **Epic 14** | All 6 stories (notifications) | PRD: "Advanced notifications (Growth feature)" |
| **Epic 15** | All 6 stories (post-trip, templates) | NOT in PRD; retention feature for later |

---

## High-Risk Areas & Mitigation

### 1. Blind Budgeting Privacy (CRITICAL)
**Risk:** Individual budgets leak to client

**Mitigation:**
- Prototype Edge Function early (Sprint 4)
- Security code review
- E2E tests verify zero leaks (DevTools, Network, logs)
- Penetration testing
- Third-party security audit before launch

### 2. Real-Time Sync Stability
**Risk:** Concurrent edits cause data loss

**Mitigation:**
- Prototype Supabase Realtime early (Sprint 8)
- Test conflict scenarios (2 users editing simultaneously)
- Last-write-wins with timestamp comparison
- E2E tests for concurrent editing

### 3. Multi-Currency Conversion Accuracy
**Risk:** Exchange rate errors cause miscalculations

**Mitigation:**
- Integrate Frankfurter API with daily rate caching
- Test edge cases (JPY rounding, high-precision decimals)
- Display original + converted amounts (transparency)
- E2E tests verify accuracy (<$0.01 error)

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Sprint 0:** Foundation | 2 weeks | Dev environment ready |
| **Sprints 1-14:** MVP Development | 7 months | Core features complete |
| **Sprints 15-18:** Polish & Launch | 2 months | Production-ready MVP |
| **TOTAL MVP** | **7-9 months** | **Launched product** |
| **Growth Phase 1** | 3-4 months | Power-user features |
| **Growth Phase 2** | 1-2 months | Payment + notifications |

---

## Success Metrics (MVP Launch)

### User Metrics
- [ ] 100 beta users complete end-to-end trip planning workflow
- [ ] Average trip has 3-6 travelers
- [ ] 80% of users set private budgets
- [ ] 70% of users create at least one vote
- [ ] 60% of users log expenses during trip

### Technical Metrics
- [ ] Zero individual budget leaks (verified via security audit)
- [ ] Real-time sync latency <500ms (P95)
- [ ] Core Web Vitals meet targets (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] WCAG 2.1 AA compliance (100% of critical flows)
- [ ] Uptime >99.5% (Vercel + Supabase)

### Business Metrics
- [ ] User retention >40% (30-day retention)
- [ ] NPS score >30 (demonstrates product-market fit)
- [ ] Time-to-first-trip <10 minutes (onboarding efficiency)
- [ ] Referral rate >20% (users invite friends)

---

## Next Steps

1. **Review with stakeholders** (Product, Engineering, Design)
2. **Finalize MVP scope** (approve 71 stories, 75 FRs)
3. **Create Sprint 0 plan** (project setup checklist)
4. **Begin Epic 1** (Authentication) in Sprint 1
5. **Weekly sprint planning** (select 5-8 stories per sprint)
6. **Monthly retrospectives** (adjust timeline based on velocity)

---

**For detailed analysis, see:** [epic-prioritization-analysis.md](./epic-prioritization-analysis.md)
