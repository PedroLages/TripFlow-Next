# TripOS Wireframe Evaluation Plan (Revised)

**Created**: 2026-02-10
**Status**: Ready for Execution
**Purpose**: Comprehensive design evaluation of 51 wireframe screens before implementation

---

## Executive Summary

**Objective**: Evaluate all 51 TripOS wireframe screens (HTML + PNG) to identify systemic design issues, per-screen violations, and missing coverage before Phase 1 implementation begins.

**Approach**: Full coverage (Option A) - Review all 51 screens across three evaluation layers.

**Estimated effort**: 90-120 hours over 4 days

**Output**: [docs/design/wireframe-evaluation-report.md](wireframe-evaluation-report.md) with prioritized P0/P1/P2/P3 recommendations

**Success criteria**:
- **Implementation ready**: ≥90% PASS, 0 RED systemic findings, <10 RED per-screen findings
- **Needs targeted fixes**: 70-89% PASS, ≤2 RED systemic findings, 10-25 RED per-screen findings
- **Redesign required**: <70% PASS or ≥3 RED systemic findings

**Stop condition**: If >50 P0 findings after Batch 6 (20 screens), stop and escalate to stakeholder for redesign discussion.

---

## Context

TripOS has 51 wireframe sets (HTML + PNG each) in `assets/wireframes/`, originally generated from 19 desktop prompts (D1-D19) using Google Stitch. Future wireframes will be generated with Figma Make (see prompt files for updated usage notes). These wireframes cover the full product: auth, dashboard, itinerary, voting, blind budgeting, expenses, notifications, settings, marketing/landing pages, and pricing.

Before implementation begins, we need a rigorous design-level critique to identify what must be fixed, what can be improved, and what is already strong.

**Critical reference files**:
- [docs/design/style-guide.md](style-guide.md) - Canonical token source of truth
- [docs/design/desktop-wireframe-prompts.md](desktop-wireframe-prompts.md) - D1-D19 prompt specs
- [docs/design/design-principles.md](design-principles.md) - 7 core principles + anti-patterns
- [docs/design/ux-spec.md](ux-spec.md) - State design, user flows, screen inventory
- [docs/design/dev-checklist.md](dev-checklist.md) - Accessibility and anti-pattern audit checklist

---

## Three-Layer Evaluation Framework

### Layer 1: Systemic Cross-Screen Audit
Properties that must be consistent across ALL 51 screens. A single finding here can affect 20+ screens.

**9 audit dimensions**:
1. **Token Compliance** - Do hex values match style-guide.md? Are CSS custom properties used?
2. **Navigation Shell** - Does every in-trip screen follow D1 shell (64px top nav + 280px sidebar)?
3. **Branding** - Same logo, icon, rendering everywhere?
4. **Component Library** - Same button styles, card patterns, input styles?
5. **Typography System** - Same font, size scale, weight usage?
6. **Icon Library** - Lucide (per spec) or Material Icons?
7. **Semantic Color Discipline** - Teal exclusively for privacy? Purple exclusively for voting?
8. **Layout Grid** - Same max-width, spacing rhythm?
9. **Accessibility Baseline** - Consistent aria patterns, semantic HTML, focus styles?

Each dimension gets: **Verdict (RED/AMBER/GREEN) → Finding → Evidence → Impact → Recommendation**

### Layer 2: Per-Screen Evaluation
12 batches grouped by feature area in user flow order. Each screen scored against 9 criteria using traffic lights:

- **PASS (green)** - Matches spec or acceptable creative interpretation
- **DEVIATION (amber)** - Differs from spec but functional; fix during implementation
- **FAIL (red)** - Missing required element, broken interaction, or spec violation needing redesign

**12 review batches**:

| # | Feature Area | Screens | Count |
|---|--------------|---------|-------|
| 1 | Marketing: Landing | hero_&problems, features, trust&cta, features_collaboration, features_voting&_budget, features_comparison | 6 |
| 2 | Marketing: Pricing | pricing_plans, pricing_faq_&_cta | 2 |
| 3 | Auth & Onboarding | sign_in, sign_up, forgot_password, accept_invite, invite_members_modal | 5 |
| 4 | Desktop Shell | desktop_shell_1, desktop_shell_2 | 2 |
| 5 | Dashboard | dashboard_empty_state, dashboard_my_trips | 2 |
| 6 | Trip Workspace | trip_overview_workspace, trip_activity_feed, plan_comparison | 3 |
| **CHECKPOINT 1** | **Review findings count** | **If >50 P0 findings, STOP and escalate** | |
| 7 | Itinerary & Map | trip_itinerary_timeline, empty_itinerary_day, add_activity_modal, map_view_planning_1, map_view_planning_2 | 5 |
| 8 | Voting | polls_list, create_new_poll, cast_vote (×3), poll_results (×3), tie_results, vote_submitted | 10 |
| 9 | Budget & Expenses | budget_overview, private_budget_input, budgeting_explainer, budget_waiting_state, expenses_dashboard, add_new_expense | 6 |
| 10 | Members | members_management, invite_members_modal (revisit) | 2 |
| 11 | Notifications & Settings | notification_center, notification_preferences, profile_settings, account_management | 4 |
| 12 | UI States | empty_&loading_states, error_states, in-app_toasts, confirmations&_offline | 4 |

### Layer 3: Synthesis & Recommendations
- Aggregate all RED/AMBER/GREEN ratings
- Feature area scorecards (readiness ranking)
- Prioritized action list using P0/P1/P2/P3 framework
- Missing screens or states identification
- Implementation readiness per feature area

---

## Prioritization Framework (Impact × Severity Matrix)

**Changed from coarse "MUST FIX / SHOULD IMPROVE / ALREADY STRONG" to dimensional scoring.**

### Impact Dimension
- **SYSTEMIC**: Affects 20+ screens
- **WIDESPREAD**: Affects 6-19 screens
- **ISOLATED**: Affects 1-5 screens

### Severity Dimension
- **BLOCKING**: Breaks functionality (e.g., broken navigation, missing required fields)
- **MAJOR**: Spec violation (e.g., wrong color tokens, missing accessibility)
- **MINOR**: Cosmetic deviation (e.g., inconsistent spacing, suboptimal hierarchy)

### Priority Matrix

| Impact / Severity | BLOCKING | MAJOR | MINOR |
|-------------------|----------|-------|-------|
| **SYSTEMIC (20+)** | **P0** | **P1** | **P2** |
| **WIDESPREAD (6-19)** | **P1** | **P2** | **P3** |
| **ISOLATED (1-5)** | **P2** | **P3** | **P3** |

**Final report must group recommendations by P0 → P1 → P2 → P3, not by vague categories.**

---

## Review Method

**Full coverage approach**: All 51 screens × 2 files = 102 files reviewed.

| What to Check | Source | Why |
|---------------|--------|-----|
| Layout, spacing, visual hierarchy, branding | PNG screenshots | Visual evaluation needs rendered output |
| Color token compliance, navigation structure | HTML code (Tailwind config block) | Machine-readable extraction from config |
| Semantic HTML, accessibility, aria patterns | HTML code (markup) | Must read the actual markup |
| Typography, component patterns | Both | Visual for hierarchy; code for exact values |

**Approach per batch**:
1. View PNG screenshots of all screens in batch (visual comparison)
2. Read HTML code of all screens in batch (technical checks)
3. Compare against corresponding D-prompt requirements
4. Score each screen against 9 criteria
5. Note intra-batch inconsistencies
6. Log findings in [wireframe-evaluation-findings-log.md](wireframe-evaluation-findings-log.md)
7. Update progress in [wireframe-evaluation-progress.md](wireframe-evaluation-progress.md)

---

## Execution Plan (4 Days)

### Phase A: Layer 1 Systemic Audit (Day 1, ~24-30 hours)

**Objectives**:
1. Validate 5 pre-existing findings (from exploration phase)
2. Audit 4 net-new dimensions (Typography System, Layout Grid, Accessibility Baseline, Component Library)
3. Extract and compare patterns across all 51 HTML files

**Pre-existing findings to validate** (do not re-audit from scratch, confirm scope/accuracy):
1. **Primary color fracture** (~30 screens claimed)
2. **Navigation shell fragmentation** (5+ paradigms claimed)
3. **Branding inconsistency** (4 logo variants claimed)
4. **Icon library mismatch** (Material vs Lucide)
5. **Token system bypass** (hex vs CSS custom properties)

**Validation method**:
- Count actual occurrences in HTML files
- If claimed "all 51 screens" but actually <40, reclassify from SYSTEMIC to WIDESPREAD
- Document actual screen count and update impact/priority ratings

**New dimensions to audit**:
6. **Typography System** - Font family, size scale, weight consistency
7. **Layout Grid** - Max-width, spacing rhythm, container patterns
8. **Accessibility Baseline** - Semantic HTML, ARIA patterns, focus styles
9. **Component Library** - Button variants, card patterns, input styles, modal patterns

**Deliverables**:
- 9 dimension verdicts (RED/AMBER/GREEN) in findings log
- Evidence: screen lists, code excerpts, pattern analysis
- Spec references for each finding
- Fix directions (current → expected → method)

**Validation checkpoint (end of Day 1)**:
- Randomly select 10 screens from different feature areas
- Verify each systemic finding actually applies to those screens
- Calculate false positive rate (target: <20%)
- If finding applies to <80% of spot-checked screens, downgrade impact rating and recalculate priority

**Output**: Layer 1 section complete in findings log

---

### Phase B: Layer 2 Per-Screen Reviews (Days 2-3, ~48-72 hours)

**Day 2**: Batches 1-6 (20 screens)

**Batch-by-batch process**:
1. Open all PNG files for the batch simultaneously (visual comparison)
2. Read HTML source for all screens in batch
3. Score each screen against 9 criteria (Token/Nav/Brand/Component/Typography/Icons/Semantic/Layout/A11y)
4. Assign traffic light verdict: PASS / DEVIATION / FAIL
5. For each DEVIATION or FAIL, create finding entry with:
   - Type (ISOLATED/WIDESPREAD/SYSTEMIC based on pattern recognition)
   - Severity (BLOCKING/MAJOR/MINOR)
   - Priority (from matrix)
   - Evidence (screen name, code excerpt)
   - Fix direction (current → expected → method)
6. Note cross-screen inconsistencies within batch
7. Update progress tracker with batch verdict and counts

**CHECKPOINT 1 (End of Day 2 - After Batch 6, 20 screens reviewed)**:
- Count P0 findings
- **STOP CONDITION**: If P0 count >50, stop Phase B immediately
- Escalate to stakeholder: "Systemic redesign required, incremental fixes insufficient"
- Do not continue evaluating if work is fundamentally broken
- If P0 ≤50, proceed to Batches 7-12

**Day 3**: Batches 7-12 (31 screens)

Continue batch-by-batch process for remaining feature areas.

**Validation checkpoint (End of Day 3 - After all 51 screens reviewed)**:
- Randomly select 5 screens from different batches
- Cross-check verdict consistency: same issue type should get same color across batches
- Example: "missing aria-label" should be FAIL everywhere or DEVIATION everywhere, not mixed
- If ≥3 inconsistencies found, recalibrate and spot-fix affected batches
- Document calibration adjustments in findings log conflict resolution section

**Output**: Layer 2 complete in findings log, progress tracker fully populated

---

### Phase C: Layer 3 Synthesis (Day 4, ~18-24 hours)

**Step 1: Missing Screen Analysis (2-3 hours)**

Extract screen inventory:
1. Read `docs/design/ux-spec.md` - extract expected screen list
2. Read `docs/design/desktop-wireframe-prompts.md` - extract D1-D19 expected outputs
3. Compare against actual files in `assets/wireframes/` (51 files)
4. Produce three lists:
   - **Expected but missing**: In spec/prompts but not generated
   - **Generated but unspecified**: In assets/ but not in spec/prompts
   - **Duplicates**: Same screen generated multiple times with variations

**Step 2: Aggregate Findings (3-4 hours)**

1. Consolidate all findings from log
2. Resolve any contradictions between Layer 1 and Layer 2 (use conflict resolution rules)
3. Recalculate impact ratings based on actual Layer 2 screen counts
4. Generate evaluation matrix (compact: 51 screens × 9 criteria, traffic lights only)
5. Calculate success metrics:
   - Overall PASS/DEVIATION/FAIL percentages
   - Compare against thresholds (implementation ready / needs fixes / redesign required)
   - Feature area scorecards (which areas are greenest?)

**Step 3: Recommendations (4-6 hours)**

Group all findings by priority:
- **P0 findings**: List with fix direction, impact, severity
- **P1 findings**: List with fix direction, impact, severity
- **P2 findings**: List with fix direction, impact, severity
- **P3 findings**: List with fix direction, impact, severity

Each finding entry must include:
- **Current state**: Code excerpt or screenshot reference
- **Expected state**: Reference to spec section or design token
- **Fix method**: One-line direction (e.g., "Replace hex #1d4fd7 with var(--color-primary-600)")

**Do not write full implementations. Point to fix location and method.**

**Step 4: Feature Area Readiness Ranking (2-3 hours)**

Rank 12 feature areas by implementation readiness:
- Greenest: Highest PASS %, fewest P0/P1 findings
- Reddest: Lowest PASS %, most P0/P1 findings
- Recommendation: Suggest implementation order based on readiness

**Step 5: Stakeholder Review Checkpoint (2-3 hours)**

**CRITICAL**: Do not skip this step.

1. Share preliminary findings with product owner or design lead
2. Review questions:
   - Are these the right problems to fix?
   - Are severity ratings correct given business priorities?
   - Any findings that don't matter for MVP launch?
   - Any missing concerns not captured?
3. Adjust P0/P1/P2/P3 priorities based on business context
4. Document stakeholder feedback and priority adjustments

**Technical correctness ≠ business priority. Get buy-in before finalizing.**

**Step 6: Write Final Report (6-8 hours)**

Structure (see Output Document Structure below).

**Output**: `docs/design/wireframe-evaluation-report.md` complete and stakeholder-approved

---

## Output Document Structure

File: `docs/design/wireframe-evaluation-report.md`

```markdown
# TripOS Wireframe Evaluation Report

## Executive Summary
- Overall verdict (Implementation Ready / Needs Fixes / Redesign Required)
- Success metrics against thresholds
- Key findings count (P0/P1/P2/P3)
- Recommended action

## Section 1: Systemic Cross-Screen Audit (9 dimensions)
- Pre-existing findings validation results
- New systemic findings from 4 net-new dimensions
- Each dimension: Verdict → Finding → Evidence → Impact → Recommendation

## Section 2: Feature Area Evaluations (12 batches)
- Per-screen evaluation cards grouped by batch
- Batch verdicts and scorecards
- Notable patterns within each feature area

## Section 3: Evaluation Matrix
- Compact table: 51 screens × 9 criteria, traffic light only
- Visual summary of PASS/DEVIATION/FAIL distribution

## Section 4: Recommendations (P0 → P1 → P2 → P3)
- P0 findings with fix directions
- P1 findings with fix directions
- P2 findings with fix directions
- P3 findings with fix directions
- Each finding: Current → Expected → Method

## Section 5: Implementation Readiness
- Feature area ranking (greenest to reddest)
- Recommended implementation order
- Coverage gaps (missing screens analysis)

## Appendix A: Prompt-to-Screen Mapping
- D1-D19 → generated screens cross-reference

## Appendix B: Validation Checkpoints
- Layer 1 spot-check results
- Layer 2 consistency check results
- False positive rate and calibration notes

## Appendix C: Stakeholder Review
- Feedback received
- Priority adjustments made
- Business context considerations
```

---

## Validation & Quality Gates

### After Layer 1 (Day 1 EOD)
- [ ] 9 dimensions audited
- [ ] 5 pre-existing findings validated (actual screen counts confirmed)
- [ ] 10 random screens spot-checked
- [ ] False positive rate calculated (<20% target)
- [ ] All findings have fix directions, not just verdicts

### After Batch 6 (Day 2 EOD)
- [ ] 20 screens reviewed
- [ ] P0 count checked against stop condition (≤50)
- [ ] If >50 P0, escalation initiated

### After Layer 2 Complete (Day 3 EOD)
- [ ] All 51 screens reviewed
- [ ] 5 random screens cross-checked for consistency
- [ ] Inconsistencies ≤3 (or recalibration performed)
- [ ] All FAIL verdicts have fix directions

### Before Finalizing Report (Day 4)
- [ ] Missing screens analysis complete
- [ ] Findings grouped by P0/P1/P2/P3 (not must/should/strong)
- [ ] Success metrics calculated and compared to thresholds
- [ ] Stakeholder review checkpoint completed
- [ ] Priority adjustments based on business context applied
- [ ] Final report includes fix directions for all RED findings

---

## Conflict Resolution Rules

**When Layer 1 and Layer 2 findings contradict:**

1. Count actual occurrences from Layer 2 per-screen data
2. If Layer 1 claimed SYSTEMIC (20+ screens) but Layer 2 shows <20 screens affected:
   - Reclassify as WIDESPREAD (6-19) or ISOLATED (1-5)
   - Recalculate priority using matrix
3. Document discrepancy in findings log conflict resolution section:
   - Layer 1 claim: "All 51 screens use Material Icons"
   - Layer 2 actual: "38 screens use Material, 13 use Lucide"
   - Resolution: Reclassify L1-004 from SYSTEMIC to WIDESPREAD
   - Priority adjustment: P1 remains P1 (widespread + major)
4. Update Layer 1 finding with corrected scope in final report

**Do not suppress contradictions. Transparency builds credibility.**

---

## Spec Ambiguity Handling

**What if a screen deviates because the spec is unclear or wrong?**

1. Flag as "SPEC ISSUE" in findings log
2. Document:
   - Screen name
   - What the screen does
   - Why it's unclear which approach is correct
   - Proposed resolution or alternatives
3. Include in stakeholder review checkpoint for clarification
4. Do not mark as FAIL if spec is genuinely ambiguous
5. Mark as DEVIATION with note: "Spec clarification needed"

---

## Success Criteria & Thresholds

### Implementation Ready
- ≥90% PASS rate across all screens
- 0 RED systemic findings
- <10 RED per-screen findings
- **Action**: Proceed to Phase 1 implementation with fix list

### Needs Targeted Fixes
- 70-89% PASS rate
- ≤2 RED systemic findings
- 10-25 RED per-screen findings
- **Action**: Fix P0/P1 findings before implementation, defer P2/P3

### Redesign Required
- <70% PASS rate
- ≥3 RED systemic findings
- **Action**: Stop implementation. Systemic redesign needed. Re-prompt or manual design revision.

---

## Effort Estimate & Partial Delivery

**Total estimated effort**: 90-120 hours

| Phase | Effort | Deliverable |
|-------|--------|-------------|
| Phase A: Layer 1 | 24-30 hours | Systemic audit complete, findings validated |
| Phase B: Batches 1-6 | 24-36 hours | 20 screens reviewed, checkpoint 1 passed |
| Phase B: Batches 7-12 | 24-36 hours | All 51 screens reviewed |
| Phase C: Synthesis | 18-24 hours | Final report with stakeholder approval |

**Partial deliveries**:
- Day 1 EOD: Layer 1 findings shared for early awareness
- Day 2 EOD: Batch 1-6 findings shared (first 20 screens)
- Day 3 EOD: All per-screen findings complete
- Day 4 EOD: Final report with priorities and recommendations

**Stop condition**: If >50 P0 findings after Batch 6, stop and escalate immediately. Do not continue evaluating fundamentally broken work.

---

## Pre-Existing Findings (From Exploration Phase)

The Plan agent already surfaced these 5 systemic issues during exploration:

1. **Primary Color Fracture** - 3 different primary colors: indigo (~30 screens), purple (~7 voting), teal (~7 budget). Spec: primary is always indigo.
2. **Navigation Shell Fragmentation** - 5+ paradigms (sidebar variations, top-only, floating bar, no shell). Spec: D1 defines ONE shell.
3. **Branding Inconsistency** - 4 logo variants including sub-brands ("TripOS BlindBudget") not in spec.
4. **Icon Library Mismatch** - 4 Material Icon imports. Spec: Lucide only.
5. **Token System Bypass** - Hex values everywhere. Spec: CSS custom properties (var(--color-*)).

**Phase A must validate scope/accuracy of these 5 claims, not re-audit from scratch.**

---

## Tracking Documents

- **Progress tracker**: [wireframe-evaluation-progress.md](wireframe-evaluation-progress.md)
- **Findings log**: [wireframe-evaluation-findings-log.md](wireframe-evaluation-findings-log.md)
- **Final report**: [wireframe-evaluation-report.md](wireframe-evaluation-report.md) (to be created)

Update progress tracker after each batch. Log findings in real-time during evaluation.

---

## Critical Review Feedback Incorporated

This revised plan addresses all 10 required changes from the critical review:

1. ✅ **Sampling strategy explicit**: Full coverage (Option A), all 51 screens × 2 files
2. ✅ **Success criteria defined**: Three thresholds with specific metrics
3. ✅ **Prioritization uses impact × severity matrix**: P0/P1/P2/P3 replaces must/should/strong
4. ✅ **Validation checkpoints added**: After Layer 1 (10 screens) and Layer 2 (5 screens)
5. ✅ **Fix direction required for RED findings**: Current → Expected → Method format
6. ✅ **Pre-existing findings deduplicated**: Validate 5 known issues, focus on 4 net-new dimensions
7. ✅ **Effort estimate and stopping condition**: 90-120 hours, stop if >50 P0 after Batch 6
8. ✅ **Conflict resolution rules defined**: Layer 1 vs Layer 2 contradiction handling
9. ✅ **Missing screen identification method**: Extract from ux-spec and prompts, compare to generated
10. ✅ **Stakeholder review checkpoint**: End of Day 4 before finalizing recommendations

---

**Status**: Ready for execution
**Next action**: Begin Phase A - Layer 1 Systemic Audit
**Progress tracking**: Update [wireframe-evaluation-progress.md](wireframe-evaluation-progress.md) after each milestone

---

**Last updated**: 2026-02-10 (revised after critical review)
