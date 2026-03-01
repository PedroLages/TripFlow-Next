# Epic Prioritization Analysis: MVP vs Growth

**Document Version:** 1.0
**Date:** 2026-03-01
**Author:** Claude Code Analysis

---

## Executive Summary

### Scope Analysis

- **PRD MVP Scope:** 72 functional requirements (FRs)
- **Epic Total Scope:** 159 FRs across 15 epics
- **Scope Growth:** +87 FRs (121% increase)
- **Total Stories:** 147 user stories

### Key Findings

**Critical Insight:** The epic breakdown has expanded scope significantly beyond the original PRD MVP intent. **87 additional FRs** were introduced, representing features that were either:
1. Marked as "Growth" in the PRD (e.g., offline sync, booking management, advanced notifications)
2. New requirements discovered during BMAD analysis (e.g., edit history, granular permissions, receipt OCR)

**Recommendation:** To ship a viable MVP within reasonable time, we must **aggressively scope down** to the PRD's original 72 FRs and defer the remaining 87 FRs to Growth phases.

### Proposed Phasing

| Phase | Epic Count | Story Count | FR Count | Timeline |
|-------|-----------|-------------|----------|----------|
| **MVP Critical Path** | 5 epics | 71 stories | 75 FRs | 14-18 sprints (7-9 months) |
| **MVP Nice-to-Have** | 2 epics | 11 stories | 12 FRs | Defer to Growth Phase 1 |
| **Growth Phase 1** | 4 epics | 35 stories | 36 FRs | Post-MVP (3-4 months) |
| **Growth Phase 2** | 3 epics | 24 stories | 29 FRs | Year 2 |
| **Future/Deferred** | 1 epic | 6 stories | 7 FRs | TBD |

---

## Epic-by-Epic Analysis

### Story 0: Project Foundation & Setup

**Status:** Prerequisite (MUST complete before Epic 1)

**FRs Covered:** FR73, FR74, FR75, FR76, FR77 (5 FRs)
**Story Count:** 1 story (Story 0)
**PRD Alignment:** Infrastructure setup (implied prerequisite)

**Categorization:** **MVP Critical Path** (Sprint 0)

**Business Value:** High (enables all other work)
**Risk Level:** Medium (external API dependencies, Supabase setup)
**Dependencies:** None (foundation for all epics)

**Scope:**
- Next.js 16 + TypeScript + Tailwind v4 setup
- Supabase local dev environment with migrations
- Google Maps JavaScript API integration
- Photo APIs (Unsplash, Pexels, Google Places) with fallback chain
- Environment variable configuration
- CI/CD pipeline (Vercel + Percy)

**Implementation Notes:**
- Complete in Sprint 0 before any feature development
- Document setup process for new developers
- Verify all integrations work in local environment

---

### Epic 1: User Authentication & Access Control

**FRs Covered:** FR64, FR65, FR66, FR67, FR68, FR69, FR70, FR71, FR72 (9 FRs)
**Story Count:** 9 stories
**PRD Alignment:** MVP Core Feature #7 ("Authentication & Security")

**Categorization:** **MVP Critical Path** (Sprints 1-2)

**Business Value:** High (foundation for all user-facing features)
**Risk Level:** Low (mature Supabase Auth, well-understood patterns)
**Dependencies:** Story 0 (project setup)

**Stories:**
1. User Registration with Email/Password
2. User Login with Session Management
3. OAuth Login (Google, GitHub, Apple)
4. Password Reset via Email
5. User Profile Editing
6. Account Deletion and Data Export (GDPR)
7. Notification Preferences Management
8. Row-Level Security (RLS) Policies
9. Unauthorized Access Prevention

**Implementation Order:** Complete all 9 stories in sequence (auth is foundational)

**Justification for MVP:**
- Enables all trip access and collaboration features
- Security (RLS) must be in place from Day 1
- GDPR compliance (data export/deletion) avoids legal risk

---

### Epic 2: Trip Creation & Member Management

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10 (10 FRs)
**Story Count:** 10 stories
**PRD Alignment:** MVP Core Feature #2 ("Shared Itinerary") - trip creation foundation

**Categorization:** **MVP Critical Path** (Sprints 2-3)

**Business Value:** High (core platform capability)
**Risk Level:** Low (CRUD operations, standard patterns)
**Dependencies:** Epic 1 (authentication, RLS)

**Stories:**
1. Create New Trip with Basic Details
2. Upload Trip Cover Photo
3. View All Trips Dashboard
4. Invite Travelers via Email
5. Accept/Decline Trip Invitations
6. View Trip Members List
7. Remove Travelers from Trip
8. Leave Trip as Member
9. Transfer Trip Ownership
10. Archive Completed Trips

**Implementation Order:** Stories 1-3 (core trip CRUD) → Stories 4-6 (invitations) → Stories 7-10 (management)

**Justification for MVP:**
- Trips are the container for all other features (budgets, itineraries, votes)
- Multi-user collaboration requires invitation flow
- Trip ownership/permissions enable democratic decision-making

---

### Epic 3: Blind Budgeting - Core Differentiator

**FRs Covered:** FR11-FR20, FR117-FR120, FR157-FR159 (17 FRs)
**Story Count:** 16 stories
**PRD Alignment:** MVP Core Feature #1 ("Blind Budgeting (Core Differentiator)")

**Categorization:** **MVP Critical Path** (Sprints 4-6)

**Business Value:** **CRITICAL** (unique value proposition, product differentiator)
**Risk Level:** High (novel privacy-preserving aggregation, encryption complexity)
**Dependencies:** Epic 1 (auth, RLS), Epic 2 (trips, members)

**Stories:**
1. Database Schema for Encrypted Budgets
2. Set Private Budget with Encryption
3. Update Personal Budget
4. View Own Budget (Decrypted)
5. Server-Side Budget Aggregation (Edge Function)
6. Collective Possibilities View
7. Real-Time Budget Updates (Realtime Subscription)
8. Category-Based Budgets (Accommodation, Activities, Food, Transport)
9. Budget Completion Status Indicator
10. Minimum Group Size Enforcement (3+ travelers)
11. Privacy Warning for Small Groups (<4 travelers)
12. Interactive Blind Budgeting Tutorial
13. Live Tutorial Demo with Fake Users
14. Privacy Dashboard (What Each Member Can See)
15. Budget Audit Log (Access Tracking)
16. Privacy Indicators (Teal Lock Icons)

**Implementation Order:**
- **Phase 1 (Sprint 4):** Stories 1-4 (core budget CRUD with encryption)
- **Phase 2 (Sprint 5):** Stories 5-7 (aggregation, collective view, real-time)
- **Phase 3 (Sprint 6):** Stories 8-16 (category budgets, privacy safeguards, tutorial, audit)

**Critical Success Factors:**
- Individual budgets NEVER leak to client (verify via E2E tests)
- Edge Function performance <200ms for aggregation
- Privacy tutorial completes before user sets first budget
- Minimum 3-traveler enforcement prevents inference attacks

**Risk Mitigation:**
- Prototype Edge Function aggregation early (Sprint 4)
- Security review before deploying to production
- User testing of privacy tutorial (does it build trust?)

---

### Epic 4: Collaborative Itinerary Planning

**FRs Covered:** FR21-FR30, FR57-FR63, FR121-FR123, FR127-FR129 (23 FRs)
**Story Count:** 17 stories
**PRD Alignment:** MVP Core Feature #2 ("Shared Itinerary (Planning Tool)")

**Categorization:** **MVP Critical Path** (Sprints 6-9)

**Business Value:** High (core planning workflow)
**Risk Level:** Medium (real-time sync complexity, edit history)
**Dependencies:** Epic 1 (auth), Epic 2 (trips)

**Stories:**
1. Database Schema for Activities/Days/Destinations
2. Add Activity to Itinerary
3. Add Accommodation to Itinerary
4. Assign Activities to Specific Days
5. Edit Activity Details
6. Delete Activity from Itinerary
7. Reorder Activities (Drag-and-Drop)
8. Move Activities Between Days
9. Day-by-Day Timeline View
10. Activity Notes/Comments
11. Activity Status (Booked/Estimated/Flexible)
12. Real-Time Itinerary Sync (Supabase Realtime)
13. User Presence Indicators (Who's Online)
14. Recent Activity Indicators (Who Edited What)
15. Typing/Editing Indicators
16. Threaded Comments on Activities (@mentions)
17. Edit History & Undo (24-hour window)

**Scope Recommendation:**
- **MVP:** Stories 1-15 (core itinerary + basic real-time)
- **Defer to Growth Phase 1:** Stories 16-17 (threaded comments, edit history/undo)

**Justification for Deferral:**
- Threaded comments (FR121-FR123) are "CRITICAL" in epics but NOT in PRD MVP
- Edit history/undo (FR127-FR129) are "CRITICAL" in epics but NOT in PRD MVP
- Real-time sync (FR57-FR63) IS in PRD MVP ("basic real-time sync")
- Deferring Stories 16-17 saves ~4 stories and reduces complexity

**Revised Story Count for MVP:** 15 stories (defer 2 to Growth)

**Implementation Order:**
- **Phase 1 (Sprint 6-7):** Stories 1-8 (CRUD, drag-drop, day assignment)
- **Phase 2 (Sprint 8):** Stories 9-11 (timeline view, notes, status)
- **Phase 3 (Sprint 9):** Stories 12-15 (real-time sync, presence, editing indicators)

**Risk Mitigation:**
- Prototype Supabase Realtime early (Sprint 8)
- Test concurrent editing scenarios (2+ users editing same activity)
- Optimize for mobile drag-and-drop (touch events)

---

### Epic 5: Democratic Decision-Making

**FRs Covered:** FR31-FR40, FR106-FR109, FR154-FR156 (17 FRs)
**Story Count:** 17 stories
**PRD Alignment:** MVP Core Feature #3 ("Democratic Voting (Decision-Making)")

**Categorization:** **MVP Critical Path** (Sprints 9-11)

**Business Value:** High (key differentiator, resolves group indecision)
**Risk Level:** Medium (5 vote types, deadline management, tie-breaking)
**Dependencies:** Epic 2 (trips), Epic 4 (activities to vote on)

**Stories:**
1. Database Schema for Votes/Options/Ballots
2. Create Vote for Activity/Accommodation
3. Add Options to Vote
4. Submit Vote (Anonymous Ballot)
5. Vote Visibility Control (Hidden Until All Submit)
6. Reveal Voting Results
7. Vote History View
8. Voting Status Indicator (Who Voted/Who Hasn't)
9. Close Vote Manually
10. Yes/No Vote Type
11. Single-Choice Vote Type
12. Ranked-Choice Vote (Drag-Drop Ranking)
13. Approval Vote Type (Multi-Select)
14. Veto Vote Type
15. Vote Deadlines & Automatic Closure
16. Vote Reminders (24 Hours Before Deadline)
17. Tie-Breaking Rules & Display

**Scope Recommendation:**
- **MVP:** Stories 1-10 (core voting + Yes/No + Single-Choice)
- **Defer to Growth Phase 1:** Stories 11-14 (ranked-choice, approval, veto)
- **Defer to Growth Phase 1:** Stories 15-17 (deadlines, reminders, tie-breaking)

**Justification for Deferral:**
- PRD MVP says "One vote per traveler, results visible after all votes submitted"
- PRD does NOT specify multiple vote types (Yes/No + Single-Choice is sufficient for MVP)
- Deadlines/reminders (FR106-FR109, FR154-FR156) are NOT in PRD MVP
- Deferring saves ~7 stories and reduces complexity significantly

**Revised Story Count for MVP:** 10 stories (defer 7 to Growth)

**Implementation Order:**
- **Phase 1 (Sprint 9-10):** Stories 1-6 (core voting, anonymous ballots, reveal)
- **Phase 2 (Sprint 11):** Stories 7-10 (history, status, manual close, vote types)

**Risk Mitigation:**
- Ensure vote anonymity (verify via E2E tests)
- Test quorum logic (all members must vote before reveal)
- Purple branding consistent with design system

---

### Epic 6: Interactive Maps & Location Services

**FRs Covered:** FR101-FR105, FR133-FR135 (8 FRs)
**Story Count:** 8 stories
**PRD Alignment:** NOT in MVP scope (implicit in "add activities", but maps are Growth)

**Categorization:** **MVP Nice-to-Have** → **Defer to Growth Phase 1**

**Business Value:** Medium (enhances planning, not core to blind budgeting)
**Risk Level:** Medium (Google Maps API costs, route planning complexity)
**Dependencies:** Epic 4 (activities with locations)

**Stories:**
1. Add Activity Location via Map Pin Drop
2. Google Places Autocomplete for Location Search
3. View All Activities on Interactive Map
4. Route Planning Between Activities
5. Activity Marker Clustering
6. Store Timezone Information with Activities
7. Display Activity Times in User's Timezone
8. DST Transition Warnings

**Justification for Deferral:**
- PRD MVP does NOT mention maps or location services
- Activities can be created with text addresses (no map required)
- Timezone intelligence (FR133-FR135) is HIGH PRIORITY but NOT MVP
- Deferring saves 8 stories (~2 sprints)

**Growth Phase 1 Priority:** High (adds significant planning value)

---

### Epic 7: Photo Management & Visual Content

**FRs Covered:** FR82-FR85, FR151-FR153 (7 FRs)
**Story Count:** 7 stories
**PRD Alignment:** NOT in MVP scope (receipt OCR is Growth)

**Categorization:** **Growth Phase 1**

**Business Value:** Medium (nice-to-have for trip memories, receipt OCR useful for expenses)
**Risk Level:** Low (Supabase Storage, OCR via external API)
**Dependencies:** Epic 4 (activities), Epic 8 (expenses for receipts)

**Stories:**
1. Upload Photos to Activities
2. Delete Photos from Activities
3. Photo Compression & Optimization
4. Photo Storage in Supabase with CDN
5. Scan Receipt Photos with Camera
6. OCR Extraction (Amount, Date, Merchant)
7. Auto-Populate Expense Form from Receipt Data

**Justification for Deferral:**
- PRD explicitly lists "Booking management (external integrations deferred to Growth)"
- User-uploaded photos (FR82-FR85) are NOT in PRD MVP
- Receipt OCR (FR151-FR153) is HIGH PRIORITY but NOT MVP
- Deferring saves 7 stories (~2 sprints)

**Growth Phase 1 Priority:** Medium-High (receipt OCR is valuable for expense tracking)

---

### Epic 8: Expense Tracking & Splitting

**FRs Covered:** FR41-FR56, FR110-FR112 (19 FRs)
**Story Count:** 19 stories
**PRD Alignment:** MVP Core Feature #4 ("Expense Splitting") + #5 ("Multi-Currency Support")

**Categorization:** **MVP Critical Path** (Sprints 11-14)

**Business Value:** High (validates blind budgeting value, essential for post-trip)
**Risk Level:** Medium (multi-currency complexity, fair split calculations)
**Dependencies:** Epic 2 (trips, members), Epic 3 (budgets for currency)

**Stories:**
1. Database Schema for Expenses/Settlements
2. Add Shared Expense
3. Assign Expense Category
4. Specify Who Paid
5. Specify Who Splits Expense
6. Calculate Fair Expense Splits (Equal)
7. Calculate Custom Split Percentages
8. View Who Owes Whom (Settlement Summary)
9. Mark Expense as Settled
10. View Expense History
11. Filter Expenses by Category
12. Export Expense Data
13. Set Budget in Any Currency
14. Add Expense in Any Currency
15. Real-Time Currency Conversion
16. Set Preferred Display Currency
17. Multi-Currency Breakdown View
18. Upload Receipt Photos to Expenses
19. View Receipt Photos in Expense Details

**Scope Recommendation:**
- **MVP:** Stories 1-17 (core expense tracking + multi-currency)
- **Defer to Growth Phase 1:** Stories 18-19 (receipt photo upload)

**Justification for Deferral:**
- Receipt photos (FR110-FR112) are separate from receipt OCR
- PRD MVP mentions "Expense Splitting" but not photo uploads
- Deferring saves 2 stories

**Revised Story Count for MVP:** 17 stories

**Implementation Order:**
- **Phase 1 (Sprint 11-12):** Stories 1-9 (core expense CRUD, splitting, settlement)
- **Phase 2 (Sprint 13):** Stories 10-12 (history, filtering, export)
- **Phase 3 (Sprint 14):** Stories 13-17 (multi-currency support)

**Risk Mitigation:**
- Test currency conversion with Frankfurter API
- Validate fair split calculations (edge cases: unequal splits, rounding)
- Ensure multi-currency totals display correctly

---

### Epic 9: Payment Integration & Settlement

**FRs Covered:** FR142-FR144 (3 FRs)
**Story Count:** 3 stories
**PRD Alignment:** NOT in MVP scope (Growth feature)

**Categorization:** **Growth Phase 2**

**Business Value:** Medium (convenience, but manual settlement works for MVP)
**Risk Level:** High (payment provider integration, compliance, transaction fees)
**Dependencies:** Epic 8 (expense tracking, settlements)

**Stories:**
1. Generate Payment Links (Stripe, PayPal, Venmo)
2. Settle Expenses via Integrated Providers
3. Auto-Update Settlement Status

**Justification for Deferral:**
- PRD explicitly lists "Booking management (external integrations deferred to Growth)"
- Payment integration (FR142-FR144) is HIGH PRIORITY but NOT MVP
- Users can settle manually (Venmo direct, cash, bank transfer)
- Deferring saves 3 stories (~1 sprint)

**Growth Phase 2 Priority:** High (valuable for user convenience, but requires payment compliance)

---

### Epic 10: Search, Filter & Discovery

**FRs Covered:** FR78-FR81 (4 FRs)
**Story Count:** 4 stories
**PRD Alignment:** Implicit in itinerary/expense management, but NOT explicit MVP requirement

**Categorization:** **MVP Nice-to-Have** → **Defer to Growth Phase 1**

**Business Value:** Medium (nice-to-have for large trips, not critical for MVP)
**Risk Level:** Low (standard search/filter patterns)
**Dependencies:** Epic 2 (trips), Epic 4 (activities), Epic 8 (expenses)

**Stories:**
1. Search Activities by Name/Location/Type
2. Filter Itinerary by Day/Cost/Category
3. Search Trips by Destination/Date
4. Filter Expenses by Category/Traveler

**Justification for Deferral:**
- PRD MVP does NOT mention search/filter capabilities
- Small trips (3-10 people, 5-10 days) can manage without search
- Deferring saves 4 stories (~1 sprint)

**Growth Phase 1 Priority:** Medium (adds polish, especially for longer trips)

---

### Epic 11: Offline Functionality & Sync

**FRs Covered:** FR86-FR90, FR113-FR116, FR136-FR138 (12 FRs)
**Story Count:** 12 stories
**PRD Alignment:** NOT in MVP scope ("Offline-first sync (Growth feature—MVP has basic real-time sync only)")

**Categorization:** **Growth Phase 1**

**Business Value:** High (valuable during travel when internet is unreliable)
**Risk Level:** High (conflict resolution complexity, PWA setup)
**Dependencies:** Epic 4 (itinerary for offline viewing)

**Stories:**
1. Service Worker Setup for PWA
2. Cache Itinerary Data for Offline Viewing
3. Cache Budget Data for Offline Viewing
4. Queue Offline Edits for Sync
5. Sync Status Display ("Syncing 3 changes...")
6. Conflict Resolution UI (Keep Mine/Keep Theirs)
7. Install to Home Screen (Add to Home Screen)
8. Offline-Capable Core Features
9. Web Push Notifications
10. PWA Splash Screen
11. Detect Simultaneous Edits
12. Prevent Activity Deletion During Active Vote

**Justification for Deferral:**
- PRD explicitly says "Offline-first sync with conflict resolution (Growth feature—MVP has basic real-time sync only)"
- MVP has real-time sync (Epic 4) but NOT offline support
- PWA (FR113-FR116) is NOT in PRD MVP
- Conflict detection (FR136-FR138) is HIGH PRIORITY but NOT MVP
- Deferring saves 12 stories (~3 sprints)

**Growth Phase 1 Priority:** High (critical for travel use case, but complex)

---

### Epic 12: Advanced Collaboration & Permissions

**FRs Covered:** FR124-FR126, FR130-FR132 (6 FRs)
**Story Count:** 6 stories
**PRD Alignment:** NOT in MVP scope ("Basic Collaboration" only)

**Categorization:** **Growth Phase 1**

**Business Value:** Medium (useful for larger groups, not critical for MVP)
**Risk Level:** Low (standard RBAC patterns)
**Dependencies:** Epic 2 (trips, members)

**Stories:**
1. Assign Roles (Owner, Editor, Viewer)
2. Viewer Permissions (Read-Only Itinerary)
3. Editor Permissions (Edit Activities, No Member Management)
4. Generate Public Share Links (Read-Only)
5. Public Link Password Protection
6. Public Link Expiry Dates

**Justification for Deferral:**
- PRD MVP says "Basic Collaboration" (all members can edit)
- Granular roles (FR124-FR126) are CRITICAL in epics but NOT in PRD MVP
- Public sharing (FR130-FR132) is HIGH PRIORITY but NOT MVP
- Deferring saves 6 stories (~2 sprints)

**Growth Phase 1 Priority:** Medium (valuable for mixed groups, e.g., parents + kids)

---

### Epic 13: Calendar Integration & Export

**FRs Covered:** FR97-FR100, FR139-FR141 (7 FRs)
**Story Count:** 7 stories
**PRD Alignment:** Growth feature ("Export & Sharing" in Growth section)

**Categorization:** **Growth Phase 1**

**Business Value:** Medium (nice-to-have for calendar users, not core)
**Risk Level:** Medium (bidirectional sync complexity)
**Dependencies:** Epic 4 (itinerary to export)

**Stories:**
1. Import Trips from CSV
2. Export Itinerary to iCal
3. Export Itinerary to PDF
4. Import Activities from Google Sheets
5. Sync to Google Calendar (Bidirectional)
6. Sync to Apple Calendar (Bidirectional)
7. Calendar Sync Auto-Update

**Justification for Deferral:**
- PRD explicitly lists "Export & Sharing" in Growth Features
- Calendar sync (FR139-FR141) is HIGH PRIORITY but NOT MVP
- Data import/export (FR97-FR100) is HIGH PRIORITY but NOT MVP
- Deferring saves 7 stories (~2 sprints)

**Growth Phase 1 Priority:** High (valuable for power users, calendar integration is expected)

---

### Epic 14: Notifications & Engagement

**FRs Covered:** FR91-FR96 (6 FRs)
**Story Count:** 6 stories
**PRD Alignment:** NOT in MVP scope ("Advanced notifications (Growth feature)")

**Categorization:** **Growth Phase 2**

**Business Value:** Medium (engagement, but in-app notifications work for MVP)
**Risk Level:** Low (standard notification patterns)
**Dependencies:** Epic 1 (notification preferences), Epic 5 (vote reminders)

**Stories:**
1. Email Notifications for Trip Invites
2. In-App Notifications for Vote Creation/Results
3. Vote Reminder Notifications
4. Notification History View
5. Mark Notifications as Read/Unread
6. Notification Batching (Real-Time vs. Daily Digest)

**Justification for Deferral:**
- PRD explicitly says "Advanced notifications (Growth feature)"
- MVP needs basic in-app notifications (covered in Epic 4, Epic 5)
- Email/push/batching are nice-to-have
- Deferring saves 6 stories (~1-2 sprints)

**Growth Phase 2 Priority:** Medium (improves engagement, but not critical)

---

### Epic 15: Post-Trip Closure & Retention

**FRs Covered:** FR145-FR150 (6 FRs)
**Story Count:** 6 stories
**PRD Alignment:** NOT in MVP scope (retention feature)

**Categorization:** **Future/Deferred**

**Business Value:** Low (retention, but not needed until MVP proves value)
**Risk Level:** Low (standard features)
**Dependencies:** All epics (post-trip summary aggregates everything)

**Stories:**
1. Mark Trip as Complete
2. Generate Post-Trip Summary
3. Prompt to Create Next Trip
4. Clone Trip to Create New Trip
5. Save Trip as Reusable Template
6. Community Template Sharing

**Justification for Deferral:**
- PRD does NOT mention post-trip features
- Trip templates (FR148-FR150) are HIGH PRIORITY but NOT MVP
- Focus MVP on planning workflow, not retention
- Deferring saves 6 stories (~2 sprints)

**Future Priority:** Medium (valuable for retention, but can wait until product-market fit)

---

## Prioritization Matrix

### MVP Critical Path (Must-Have for Launch)

| Epic | Stories (MVP) | FRs | Business Value | Risk | Dependencies | Sprints |
|------|---------------|-----|----------------|------|--------------|---------|
| **Story 0:** Project Foundation | 1 | 5 | High | Medium | None | 1 |
| **Epic 1:** Authentication & Access Control | 9 | 9 | High | Low | Story 0 | 2 |
| **Epic 2:** Trip Creation & Member Management | 10 | 10 | High | Low | Epic 1 | 2 |
| **Epic 3:** Blind Budgeting (Core Differentiator) | 16 | 17 | **CRITICAL** | High | Epic 1, 2 | 3 |
| **Epic 4:** Collaborative Itinerary Planning | 15 | 21 | High | Medium | Epic 1, 2 | 4 |
| **Epic 5:** Democratic Decision-Making | 10 | 10 | High | Medium | Epic 2, 4 | 3 |
| **Epic 8:** Expense Tracking & Multi-Currency | 17 | 17 | High | Medium | Epic 2, 3 | 4 |
| **TOTAL MVP** | **71 stories** | **75 FRs** | - | - | - | **14-18 sprints** |

**Timeline Estimate:** 7-9 months (assuming 2-week sprints, 5-8 stories per sprint, 2-3 developers)

---

### MVP Nice-to-Have (Defer to Growth Phase 1)

| Epic | Stories | FRs | Justification for Deferral |
|------|---------|-----|---------------------------|
| **Epic 6:** Interactive Maps & Location Services | 8 | 8 | Not in PRD MVP; activities can use text addresses |
| **Epic 10:** Search, Filter & Discovery | 4 | 4 | Not in PRD MVP; small trips manageable without search |
| **TOTAL** | **12 stories** | **12 FRs** | - |

---

### Growth Phase 1 (Post-MVP, High Value)

| Epic | Stories | FRs | Business Value | Priority | Dependencies |
|------|---------|-----|----------------|----------|--------------|
| **Epic 4 (deferred):** Threaded Comments + Edit History | 2 | 6 | Medium | Medium | Epic 4 MVP |
| **Epic 5 (deferred):** Advanced Vote Types + Deadlines | 7 | 7 | Medium | Medium | Epic 5 MVP |
| **Epic 6:** Interactive Maps & Location Services | 8 | 8 | High | High | Epic 4 |
| **Epic 7:** Photo Management & Receipt OCR | 7 | 7 | Medium-High | High | Epic 4, 8 |
| **Epic 10:** Search, Filter & Discovery | 4 | 4 | Medium | Medium | Epic 2, 4, 8 |
| **Epic 11:** Offline Functionality & PWA | 12 | 12 | High | **CRITICAL** | Epic 4 |
| **Epic 12:** Advanced Collaboration & Permissions | 6 | 6 | Medium | Medium | Epic 2 |
| **Epic 13:** Calendar Integration & Export | 7 | 7 | High | High | Epic 4 |
| **TOTAL** | **53 stories** | **57 FRs** | - | - | - |

**Timeline Estimate:** 3-4 months post-MVP

---

### Growth Phase 2 (Post-MVP, Medium Value)

| Epic | Stories | FRs | Business Value | Priority |
|------|---------|-----|----------------|----------|
| **Epic 9:** Payment Integration & Settlement | 3 | 3 | Medium | High |
| **Epic 14:** Notifications & Engagement | 6 | 6 | Medium | Medium |
| **TOTAL** | **9 stories** | **9 FRs** | - | - |

**Timeline Estimate:** 1-2 months after Growth Phase 1

---

### Future/Deferred (Low Priority)

| Epic | Stories | FRs | Justification |
|------|---------|-----|---------------|
| **Epic 15:** Post-Trip Closure & Retention | 6 | 6 | Retention feature; defer until product-market fit proven |
| **TOTAL** | **6 stories** | **6 FRs** | - |

---

## Recommended Implementation Order

### Sprint 0: Project Foundation (1 sprint)
- **Story 0:** Project setup, Supabase, Google Maps, photo APIs, CI/CD

### Sprints 1-2: Authentication & Trips (2 sprints)
- **Epic 1:** All 9 stories (authentication, RLS, profile management)
- **Epic 2:** Stories 1-6 (trip CRUD, invitations, member list)

### Sprints 3-4: Trip Management + Blind Budgeting Phase 1 (2 sprints)
- **Epic 2:** Stories 7-10 (member management, archive)
- **Epic 3:** Stories 1-7 (budget schema, encryption, aggregation, collective view, real-time)

### Sprints 5-6: Blind Budgeting Phase 2 + Itinerary Phase 1 (2 sprints)
- **Epic 3:** Stories 8-16 (category budgets, privacy safeguards, tutorial, audit)
- **Epic 4:** Stories 1-8 (itinerary CRUD, drag-drop, day assignment)

### Sprints 7-9: Itinerary Phase 2 + Voting Phase 1 (3 sprints)
- **Epic 4:** Stories 9-15 (timeline view, notes, real-time sync, presence)
- **Epic 5:** Stories 1-6 (voting schema, create vote, submit ballot, reveal)

### Sprints 10-11: Voting Phase 2 (2 sprints)
- **Epic 5:** Stories 7-10 (vote history, status, manual close, Yes/No + Single-Choice)

### Sprints 12-14: Expense Tracking Phase 1 (3 sprints)
- **Epic 8:** Stories 1-12 (expense CRUD, splitting, settlement, history, filtering)

### Sprints 15-16: Expense Tracking Phase 2 (2 sprints)
- **Epic 8:** Stories 13-17 (multi-currency support, conversion, breakdown)

### Sprint 17: MVP Polish & Testing (1 sprint)
- E2E test coverage for all MVP epics
- Accessibility audit (WCAG 2.1 AA)
- Performance optimization (Core Web Vitals)
- Bug fixes from internal testing

### Sprint 18: MVP Launch Preparation (1 sprint)
- Documentation (user guides, developer docs)
- Marketing site landing page
- Beta user onboarding materials
- Production deployment & monitoring

---

## Delivery Roadmap

### Phase 0: Foundation (Sprint 0)
**Duration:** 2 weeks
**Deliverable:** Development environment ready, all integrations working

**Success Criteria:**
- [ ] Local Supabase instance running with migrations
- [ ] Google Maps API displaying test map
- [ ] Photo APIs returning fallback images
- [ ] CI/CD pipeline passing (TypeScript, ESLint, unit tests)
- [ ] Percy visual regression tests configured

---

### Phase 1: MVP Critical Path (Sprints 1-16)
**Duration:** 7-8 months
**Deliverable:** Fully functional MVP with core differentiators

**Epics Included:**
1. Authentication & Access Control (9 stories)
2. Trip Creation & Member Management (10 stories)
3. Blind Budgeting - Core Differentiator (16 stories)
4. Collaborative Itinerary Planning (15 stories)
5. Democratic Decision-Making (10 stories)
6. Expense Tracking & Multi-Currency (17 stories)

**Total:** 71 stories, 75 FRs

**Success Criteria:**
- [ ] Users can create trips, invite members, and manage permissions
- [ ] Users can set private budgets and view collective possibilities (NO individual budget leaks)
- [ ] Users can collaboratively build itineraries with real-time sync
- [ ] Users can create votes and make democratic decisions
- [ ] Users can track expenses with multi-currency support and fair splitting
- [ ] All MVP E2E tests pass (Playwright)
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Core Web Vitals meet targets (LCP <2.5s, FID <100ms, CLS <0.1)

**Launch Blockers:**
- Blind budgeting privacy verification (zero individual budget leaks)
- Real-time sync stability (no data loss on concurrent edits)
- Multi-currency accuracy (correct conversions, no rounding errors)

---

### Phase 2: MVP Polish & Launch (Sprints 17-18)
**Duration:** 1 month
**Deliverable:** Production-ready MVP with documentation

**Activities:**
- Comprehensive E2E testing
- Accessibility audit and fixes
- Performance optimization
- User documentation
- Marketing site
- Beta user recruitment
- Production deployment

**Success Criteria:**
- [ ] Beta users can complete end-to-end trip planning workflow
- [ ] No critical bugs in production
- [ ] Marketing site live with demo video
- [ ] User onboarding flow tested with real users

---

### Phase 3: Growth Phase 1 (Post-MVP, 3-4 months)
**Duration:** 3-4 months
**Deliverable:** Enhanced MVP with power-user features

**Epics Included:**
1. Epic 4 (deferred): Threaded Comments + Edit History (2 stories)
2. Epic 5 (deferred): Advanced Vote Types + Deadlines (7 stories)
3. Epic 6: Interactive Maps & Location Services (8 stories)
4. Epic 7: Photo Management & Receipt OCR (7 stories)
5. Epic 10: Search, Filter & Discovery (4 stories)
6. Epic 11: Offline Functionality & PWA (12 stories)
7. Epic 12: Advanced Collaboration & Permissions (6 stories)
8. Epic 13: Calendar Integration & Export (7 stories)

**Total:** 53 stories, 57 FRs

**Priority Order:**
1. **Epic 11 (Offline & PWA):** CRITICAL for travel use case
2. **Epic 6 (Maps):** High value for route planning
3. **Epic 13 (Calendar Integration):** Expected feature for power users
4. **Epic 7 (Receipt OCR):** Streamlines expense tracking
5. **Epic 12 (Permissions):** Enables larger groups
6. **Epic 10 (Search):** Quality-of-life for long trips
7. **Epic 4/5 (Deferred):** Polish for collaboration/voting

**Success Criteria:**
- [ ] PWA installable on mobile devices
- [ ] Offline mode works during travel (no internet required)
- [ ] Calendar sync bidirectional (Google Calendar, Apple Calendar)
- [ ] Receipt OCR accuracy >80% for amount/date extraction
- [ ] Interactive maps display all activities with routes

---

### Phase 4: Growth Phase 2 (Post-Phase 1, 1-2 months)
**Duration:** 1-2 months
**Deliverable:** Payment integration and engagement features

**Epics Included:**
1. Epic 9: Payment Integration & Settlement (3 stories)
2. Epic 14: Notifications & Engagement (6 stories)

**Total:** 9 stories, 9 FRs

**Success Criteria:**
- [ ] Users can settle expenses via Stripe/PayPal/Venmo
- [ ] Email/push notifications reduce time-to-vote
- [ ] Notification batching reduces email fatigue

---

### Phase 5: Future (TBD)
**Duration:** TBD
**Deliverable:** Retention and community features

**Epics Included:**
1. Epic 15: Post-Trip Closure & Retention (6 stories)

**Total:** 6 stories, 6 FRs

**Success Criteria:**
- [ ] Post-trip summary generates insights (budget vs. actual)
- [ ] Trip cloning enables repeat travelers
- [ ] Community templates drive new user acquisition

---

## Risk Assessment & Mitigation

### High-Risk Areas

#### 1. Blind Budgeting Privacy (CRITICAL)
**Risk:** Individual budgets leak to client via API, browser DevTools, or logs

**Impact:** Catastrophic (destroys core value proposition, legal/privacy liability)

**Mitigation Strategies:**
- **Week 1 (Sprint 4):** Prototype Edge Function aggregation before building UI
- **Week 2 (Sprint 4):** Security code review by external expert
- **Week 3 (Sprint 5):** E2E tests verify zero individual budget exposure (DevTools, Network tab, React Query cache, Zustand store, logs)
- **Week 4 (Sprint 5):** Penetration testing (attempt to extract budgets via forged requests)
- **Pre-Launch:** Third-party security audit (bug bounty program)

**Acceptance Criteria:**
- [ ] Individual budgets NEVER appear in browser DevTools (Network, Console, Application tabs)
- [ ] Individual budgets NEVER appear in Vercel logs or Supabase logs
- [ ] Edge Function returns ONLY aggregate values (group_limit_usd, etc.)
- [ ] Client-side code has NO decryption logic (encryption key server-side only)

---

#### 2. Real-Time Sync Stability
**Risk:** Concurrent edits cause data loss or sync conflicts

**Impact:** High (data loss destroys trust, negative reviews)

**Mitigation Strategies:**
- **Week 1 (Sprint 8):** Prototype Supabase Realtime with 2 concurrent users
- **Week 2 (Sprint 8):** Test conflict scenarios (same activity edited by 2 users within 500ms)
- **Week 3 (Sprint 9):** Implement last-write-wins with timestamp comparison
- **Week 4 (Sprint 9):** E2E tests for concurrent editing (Playwright multi-tab tests)
- **Post-MVP:** Add conflict detection UI (defer to Growth Phase 1)

**Acceptance Criteria:**
- [ ] Updates propagate to all users within 500ms (NFR2)
- [ ] No data loss on concurrent edits (last-write-wins preserves all data in audit log)
- [ ] Presence indicators show who's editing in real-time

---

#### 3. Multi-Currency Conversion Accuracy
**Risk:** Exchange rate errors cause budget/expense miscalculations

**Impact:** Medium (financial inaccuracy erodes trust)

**Mitigation Strategies:**
- **Week 1 (Sprint 14):** Integrate Frankfurter API with daily rate caching
- **Week 2 (Sprint 14):** Test edge cases (JPY integer rounding, high-precision decimals)
- **Week 3 (Sprint 14):** Display original currency alongside converted amount (transparency)
- **Week 4 (Sprint 14):** E2E tests verify conversion accuracy (USD ↔ EUR ↔ CNY ↔ JPY)

**Acceptance Criteria:**
- [ ] Exchange rates update daily via Frankfurter API
- [ ] JPY stored as INTEGER (no decimal places)
- [ ] USD/EUR/CNY stored as DECIMAL(10,2)
- [ ] Rounding errors <$0.01 for typical trip budgets ($500-$5000)

---

#### 4. Offline Sync Complexity (Growth Phase 1)
**Risk:** Conflict resolution fails, causing data corruption

**Impact:** High (data loss, but deferred to Growth)

**Mitigation Strategies:**
- **Pre-Development:** Prototype Service Worker with simple conflict resolution
- **Week 1:** Implement optimistic UI with rollback on conflict
- **Week 2:** Test offline scenarios (airplane mode, flaky connection)
- **Week 3:** E2E tests for offline editing and reconnection
- **Week 4:** User testing with real travelers (beta users)

**Acceptance Criteria:**
- [ ] Offline edits queue for sync when reconnected
- [ ] Conflict resolution UI shows clear "Keep Mine" vs. "Keep Theirs" options
- [ ] No data loss on reconnection (all edits preserved in one version or the other)

---

### Medium-Risk Areas

#### 5. Vote Anonymity
**Risk:** Vote ballots leak individual votes before all members submit

**Impact:** Medium (undermines democratic decision-making)

**Mitigation:**
- Store votes in `vote_ballots` table with RLS (user can only see own vote)
- Reveal results only when `vote.status = 'completed'` (all members voted)
- E2E tests verify vote anonymity

---

#### 6. Google Maps API Costs
**Risk:** Map usage exceeds free tier, causing unexpected costs

**Impact:** Low (Growth Phase 1, can defer if budget constrained)

**Mitigation:**
- Monitor API usage via Google Cloud Console
- Set budget alerts at $50, $100, $200/month
- Implement map caching (React Query with 24hr stale time)
- Defer map features if costs exceed budget

---

## Scope Reduction Opportunities

### If MVP Timeline is Too Long (>6 months)

**Option 1: Defer Multi-Currency to Growth Phase 1**
- **Savings:** 5 stories (Epic 8, Stories 13-17)
- **Impact:** MVP supports USD only; Growth adds EUR/CNY/JPY
- **Tradeoff:** Reduces international appeal (Asia Trip use case requires multi-currency)

**Recommendation:** **Do NOT defer** (multi-currency is essential for international travelers)

---

**Option 2: Defer Advanced Voting Features**
- **Savings:** 7 stories (Epic 5, Stories 11-17)
- **Impact:** MVP has Yes/No + Single-Choice only; Growth adds Ranked-Choice, Approval, Veto, Deadlines
- **Tradeoff:** Simplified voting UX (less flexibility, but sufficient for MVP)

**Recommendation:** **ALREADY DEFERRED** in prioritization matrix above

---

**Option 3: Defer Expense Export**
- **Savings:** 1 story (Epic 8, Story 12)
- **Impact:** No CSV export; users manually copy data
- **Tradeoff:** Reduces post-trip value (but archiving still works)

**Recommendation:** **Consider deferring** if timeline is tight (low effort, but nice-to-have)

---

**Option 4: Defer Trip Archiving**
- **Savings:** 1 story (Epic 2, Story 10)
- **Impact:** Completed trips remain in dashboard (clutter)
- **Tradeoff:** UX polish sacrifice (minimal impact on core workflow)

**Recommendation:** **Keep in MVP** (trivial to implement, improves UX)

---

## Key Takeaways

### 1. MVP Scope Discipline
**Original PRD:** 72 FRs → **Recommended MVP:** 75 FRs (only +3 FRs)

The epic breakdown expanded scope to 159 FRs (+87 FRs = 121% growth). **We must resist scope creep** and defer non-essential features to Growth phases.

**MVP Focus:**
- Blind budgeting (core differentiator)
- Shared itinerary (planning tool)
- Democratic voting (decision-making)
- Expense splitting (validates blind budgeting value)
- Multi-currency (essential for international travelers)
- Basic collaboration (invites, real-time sync)

**Defer to Growth:**
- Offline sync (complex, not MVP-critical)
- Maps (nice-to-have, not core)
- Receipt OCR (valuable, but manual entry works for MVP)
- Advanced notifications (in-app notifications sufficient for MVP)
- Payment integration (manual settlement works for MVP)
- Calendar sync (export works, bidirectional sync is Growth)

---

### 2. Blind Budgeting is Non-Negotiable
**Epic 3 (16 stories, 17 FRs) is CRITICAL.** All stories must ship in MVP:
- Privacy tutorial (builds trust)
- Privacy dashboard (transparency)
- Audit log (accountability)
- Minimum 3-traveler enforcement (prevents inference attacks)

**Do NOT defer ANY blind budgeting stories.** This is the product's unique value.

---

### 3. Real-Time Sync is MVP, Offline Sync is Growth
**PRD is clear:** "MVP has basic real-time sync only."

**MVP includes:**
- Supabase Realtime for itinerary updates (Epic 4, Stories 12-15)
- Presence indicators (who's online)
- Editing indicators (who's editing what)

**Growth Phase 1 adds:**
- Service Worker for offline caching
- Conflict resolution UI
- PWA installation

---

### 4. Timeline Reality Check
**Recommended MVP:** 71 stories over 14-18 sprints = **7-9 months**

**Assumptions:**
- 2-week sprints
- 5-8 stories per sprint
- 2-3 developers (1 full-stack lead + 1-2 mid-level)
- 20% time allocated to bugs, tech debt, code reviews

**Faster timeline requires:**
- More developers (3-4 full-stack)
- Aggressive scope cuts (defer Epic 5 voting to Growth)
- Reduced quality (skip E2E tests, accessibility audit)

**Recommendation:** **Stick to 7-9 month timeline** to ship high-quality MVP.

---

### 5. Launch Blockers
**Do NOT launch MVP until these are verified:**
1. **Zero blind budget leaks** (E2E tests pass, security audit complete)
2. **Real-time sync stability** (no data loss on concurrent edits)
3. **Multi-currency accuracy** (correct conversions, <$0.01 rounding error)
4. **WCAG 2.1 AA compliance** (accessibility audit pass)
5. **Core Web Vitals meet targets** (LCP <2.5s, FID <100ms, CLS <0.1)

**If any blocker fails, delay launch until resolved.** Shipping broken blind budgeting destroys product credibility.

---

## Appendix: FR Count Breakdown

### PRD MVP Scope (72 FRs)
- FR1-FR10: Trip Management (10 FRs)
- FR11-FR20: Blind Budgeting (10 FRs)
- FR21-FR30: Itinerary Planning (10 FRs)
- FR31-FR40: Democratic Voting (10 FRs)
- FR41-FR49: Expense Management (9 FRs)
- FR50-FR56: Multi-Currency (7 FRs)
- FR57-FR63: Real-Time Collaboration (7 FRs)
- FR64-FR72: User & Access Management (9 FRs)

**Total PRD MVP:** 72 FRs

---

### Epic Scope (159 FRs)
- **Story 0:** FR73-FR77 (5 FRs)
- **Epic 1:** FR64-FR72 (9 FRs)
- **Epic 2:** FR1-FR10 (10 FRs)
- **Epic 3:** FR11-FR20, FR117-FR120, FR157-FR159 (17 FRs)
- **Epic 4:** FR21-FR30, FR57-FR63, FR121-FR123, FR127-FR129 (23 FRs)
- **Epic 5:** FR31-FR40, FR106-FR109, FR154-FR156 (17 FRs)
- **Epic 6:** FR101-FR105, FR133-FR135 (8 FRs)
- **Epic 7:** FR82-FR85, FR151-FR153 (7 FRs)
- **Epic 8:** FR41-FR56, FR110-FR112 (19 FRs)
- **Epic 9:** FR142-FR144 (3 FRs)
- **Epic 10:** FR78-FR81 (4 FRs)
- **Epic 11:** FR86-FR90, FR113-FR116, FR136-FR138 (12 FRs)
- **Epic 12:** FR124-FR126, FR130-FR132 (6 FRs)
- **Epic 13:** FR97-FR100, FR139-FR141 (7 FRs)
- **Epic 14:** FR91-FR96 (6 FRs)
- **Epic 15:** FR145-FR150 (6 FRs)

**Total Epic Scope:** 159 FRs

---

### Recommended MVP Scope (75 FRs)
- **Story 0:** 5 FRs
- **Epic 1:** 9 FRs
- **Epic 2:** 10 FRs
- **Epic 3:** 17 FRs (all blind budgeting FRs)
- **Epic 4:** 21 FRs (defer FR121-FR123, FR127-FR129 to Growth)
- **Epic 5:** 10 FRs (defer FR106-FR109, FR154-FR156 to Growth)
- **Epic 8:** 17 FRs (defer FR110-FR112 to Growth)

**Total Recommended MVP:** 75 FRs (PRD + 3 critical FRs from Epic 3)

**Deferred to Growth:** 84 FRs

---

## Document Control

**Version History:**
- v1.0 (2026-03-01): Initial prioritization analysis

**Approvers:**
- Product Owner (approve MVP scope)
- Engineering Lead (approve timeline estimates)
- Design Lead (approve UX deferral decisions)

**Next Steps:**
1. Review with stakeholders (Product, Engineering, Design)
2. Finalize MVP scope and timeline
3. Create Sprint 0 plan (project setup)
4. Begin Epic 1 (Authentication) in Sprint 1
