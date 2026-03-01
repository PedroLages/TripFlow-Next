# Epic Dependency Graph

This document visualizes the dependencies between TripFlow's 15 epics to inform implementation order.

---

## Dependency Flow (MVP Critical Path)

```
┌─────────────────────────────────────────────────────────────┐
│                   Sprint 0: Foundation                       │
│              (Project Setup, Supabase, APIs)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Epic 1: Authentication & RLS                    │
│          (Foundation for all user-facing features)           │
└──────────┬───────────────────────────────┬──────────────────┘
           │                               │
           ↓                               ↓
┌──────────────────────────┐    ┌─────────────────────────────┐
│  Epic 2: Trip & Members  │    │   (All other epics depend   │
│   (Container for all     │    │    on authentication)       │
│    other features)       │    │                             │
└──────────┬───────────────┘    └─────────────────────────────┘
           │
           ├─────────────────────┬──────────────────┬──────────┐
           ↓                     ↓                  ↓          ↓
┌──────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  Epic 3: Blind   │  │  Epic 4: Collab│  │  Epic 5: Voting│  │
│   Budgeting      │  │   Itinerary    │  │                │  │
│ (Core Diff.)     │  │                │  │                │  │
└──────────┬───────┘  └────────┬───────┘  └───────┬────────┘  │
           │                   │                   │           │
           │                   │                   ↓           │
           │                   │          ┌─────────────────┐  │
           │                   │          │ Epic 5 depends  │  │
           │                   │          │ on Epic 4       │  │
           │                   │          │ (vote on        │  │
           │                   │          │  activities)    │  │
           │                   │          └─────────────────┘  │
           │                   │                               │
           └───────────────────┴───────────────────────────────┘
                               │
                               ↓
                    ┌─────────────────────────┐
                    │  Epic 8: Expense        │
                    │   Tracking & Multi-     │
                    │   Currency              │
                    │ (Uses budgets from      │
                    │  Epic 3 for currency)   │
                    └─────────────────────────┘
```

---

## Dependency Matrix

| Epic | Depends On | Blocks | Can Start After |
|------|------------|--------|-----------------|
| **Story 0** | None | All epics | Week 0 |
| **Epic 1** | Story 0 | All epics | Week 1 (Sprint 0 complete) |
| **Epic 2** | Epic 1 | Epic 3, 4, 5, 8 | Week 3 (Epic 1 complete) |
| **Epic 3** | Epic 1, 2 | Epic 8 (currency) | Week 7 (Epic 2 complete) |
| **Epic 4** | Epic 1, 2 | Epic 5, 6, 7 | Week 7 (Epic 2 complete) |
| **Epic 5** | Epic 2, 4 | - | Week 15 (Epic 4 complete) |
| **Epic 8** | Epic 2, 3 | Epic 9 | Week 21 (Epic 5 complete) |
| **Epic 6** | Epic 4 | - | Post-MVP (Growth Phase 1) |
| **Epic 7** | Epic 4, 8 | - | Post-MVP (Growth Phase 1) |
| **Epic 9** | Epic 8 | - | Post-MVP (Growth Phase 2) |
| **Epic 10** | Epic 2, 4, 8 | - | Post-MVP (Growth Phase 1) |
| **Epic 11** | Epic 4 | - | Post-MVP (Growth Phase 1) |
| **Epic 12** | Epic 2 | - | Post-MVP (Growth Phase 1) |
| **Epic 13** | Epic 4 | - | Post-MVP (Growth Phase 1) |
| **Epic 14** | Epic 1, 5 | - | Post-MVP (Growth Phase 2) |
| **Epic 15** | All epics | - | Future (post-Growth) |

---

## Critical Path Analysis

### The Critical Path (Longest Dependency Chain)

```
Story 0 → Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 8
  ↓         ↓         ↓         ↓         ↓         ↓         ↓
Sprint 0  Sprint 1  Sprint 2  Sprint 4  Sprint 6  Sprint 9  Sprint 12
```

**Total Duration:** 14 sprints (28 weeks = 7 months)

**Bottlenecks:**
1. **Epic 1 (Authentication):** Blocks ALL other epics
2. **Epic 2 (Trips):** Blocks 4 downstream epics (3, 4, 5, 8)
3. **Epic 4 (Itinerary):** Blocks Epic 5 (voting) and Epic 6, 7, 11, 13 (Growth)

---

## Parallel Development Opportunities

### Sprints 1-2: Limited Parallelism
- **Only Epic 1** can be developed (blocks everything)
- Team must work serially on authentication stories

### Sprints 3-6: Some Parallelism
- **Epic 2 (Trips)** in Sprint 3
- **Epic 3 (Budgeting)** starts Sprint 4 (depends on Epic 2)
- **Epic 4 (Itinerary)** starts Sprint 6 (depends on Epic 2)
- **Opportunity:** Different developers can work on Epic 3 and Epic 4 simultaneously once Epic 2 is complete

### Sprints 7-11: High Parallelism
- **Epic 4 (Itinerary)** continues (Sprints 7-9)
- **Epic 5 (Voting)** starts Sprint 9 (depends on Epic 4 for activities to vote on)
- **Opportunity:** One developer finishes Epic 4 while another starts Epic 5

### Sprints 12-14: Serial Again
- **Epic 8 (Expenses)** must complete before Growth Phase 1
- Team focuses on multi-currency implementation

---

## Growth Phase 1 Parallelism

Once MVP is complete, **multiple Growth epics can be developed in parallel:**

```
Epic 11 (Offline/PWA)     ──────────────── (3 sprints)
Epic 6 (Maps)             ────────── (2 sprints)
Epic 13 (Calendar Sync)   ────────── (2 sprints)
Epic 7 (Photos/OCR)       ────────── (2 sprints)
Epic 12 (Permissions)     ────── (1.5 sprints)
Epic 10 (Search/Filter)   ──── (1 sprint)
```

**Team Size Recommendation:**
- **MVP (Sprints 0-14):** 2-3 developers (limited parallelism)
- **Growth Phase 1 (Sprints 19-30):** 3-4 developers (high parallelism)

---

## Risk-Based Sequencing

### High-Risk Epics (Prototype Early)

1. **Epic 3 (Blind Budgeting):** Sprint 4
   - **Risk:** Privacy leaks destroy product value
   - **Mitigation:** Prototype Edge Function in Week 1 of Sprint 4
   - **Prototype Goal:** Verify ZERO individual budget exposure

2. **Epic 4 (Real-Time Itinerary):** Sprint 8
   - **Risk:** Concurrent edits cause data loss
   - **Mitigation:** Prototype Supabase Realtime in Week 1 of Sprint 8
   - **Prototype Goal:** Verify <500ms sync latency, no data loss

3. **Epic 8 (Multi-Currency):** Sprint 14
   - **Risk:** Currency conversion errors
   - **Mitigation:** Test Frankfurter API integration in Week 1 of Sprint 14
   - **Prototype Goal:** Verify <$0.01 rounding error

---

## Alternative Sequencing Options

### Option A: Itinerary Before Budgeting (NOT RECOMMENDED)

```
Epic 1 → Epic 2 → Epic 4 (Itinerary) → Epic 3 (Budgeting) → Epic 5 → Epic 8
```

**Pros:**
- Itinerary is easier to build (lower risk)
- Developers gain confidence with simpler features first

**Cons:**
- **Delays core differentiator (blind budgeting) to Sprint 9+**
- Risk of losing focus on unique value proposition
- Harder to validate product-market fit early

**Recommendation:** **DO NOT USE** (blind budgeting is the product's core value)

---

### Option B: Budgeting + Itinerary in Parallel (RECOMMENDED)

```
Epic 1 → Epic 2 → (Epic 3 + Epic 4 in parallel) → Epic 5 → Epic 8
```

**Pros:**
- **Faster time-to-market** (save 3 sprints)
- Both core features (budgeting + itinerary) ready simultaneously
- Enables end-to-end MVP demo earlier

**Cons:**
- Requires 3+ developers (2 on Epic 4, 1 on Epic 3)
- Higher coordination overhead
- Epic 4 depends on Epic 2, but Epic 3 also depends on Epic 2 (potential merge conflicts)

**Recommendation:** **USE IF TEAM SIZE ≥ 3** (reduces timeline to 11 sprints = 5.5 months)

---

### Option C: Deferred Voting (NOT RECOMMENDED)

```
Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 8 → Epic 5 (deferred to Growth)
```

**Pros:**
- Faster MVP (save 3 sprints = 1.5 months)
- Focus on budgeting + itinerary + expenses only

**Cons:**
- **Loses key differentiator (democratic decision-making)**
- PRD explicitly lists voting as MVP Core Feature #3
- Reduces product appeal (no group decision-making mechanism)

**Recommendation:** **DO NOT USE** (voting is MVP-critical per PRD)

---

## Recommended Sequence (Default)

**Epic Order:**
1. Story 0 (Foundation)
2. Epic 1 (Authentication)
3. Epic 2 (Trips)
4. Epic 3 (Blind Budgeting)
5. Epic 4 (Itinerary)
6. Epic 5 (Voting)
7. Epic 8 (Expenses)

**Rationale:**
- Follows natural dependency chain
- Prioritizes core differentiator (blind budgeting) early
- Balances risk (prototype high-risk epics early)
- Aligns with PRD MVP scope

**Timeline:** 14-18 sprints (7-9 months)

---

## Growth Phase 1 Recommended Sequence

**Epic Order:**
1. Epic 11 (Offline/PWA) - **CRITICAL for travel use case**
2. Epic 6 (Maps) - High value, depends on Epic 4
3. Epic 13 (Calendar Sync) - Expected feature, high value
4. Epic 7 (Photos/OCR) - Enhances expense tracking
5. Epic 12 (Permissions) - Enables larger groups
6. Epic 10 (Search/Filter) - Quality-of-life improvement

**Timeline:** 12 sprints (6 months)

---

## Key Takeaways

1. **Epic 1 (Authentication) is the gateway** - blocks all other work
2. **Epic 2 (Trips) is the foundation** - enables 4 downstream epics
3. **Epic 3 (Budgeting) is high-risk** - prototype early, validate privacy
4. **Epic 4 (Itinerary) is the longest** - 4 sprints, test real-time sync early
5. **Epic 5 (Voting) depends on Epic 4** - can't vote without activities
6. **Epic 8 (Expenses) depends on Epic 3** - uses currency from budgets

**Critical Path:** Story 0 → Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 8 (14 sprints)

**Parallelism Opportunities:**
- Sprints 7-11: Epic 4 (Itinerary) + Epic 5 (Voting) overlap possible
- Growth Phase 1: 6 epics can be developed in parallel (team size permitting)

---

**For detailed sprint plan, see:** [mvp-sprint-roadmap.md](./mvp-sprint-roadmap.md)
**For prioritization analysis, see:** [epic-prioritization-analysis.md](./epic-prioritization-analysis.md)
