# Wireframe Evaluation Quick Reference

**Purpose**: Quick lookup for consistency during 51-screen evaluation

---

## Priority Matrix (Impact × Severity)

| Impact / Severity | BLOCKING | MAJOR | MINOR |
|-------------------|----------|-------|-------|
| **SYSTEMIC (20+)** | **P0** | **P1** | **P2** |
| **WIDESPREAD (6-19)** | **P1** | **P2** | **P3** |
| **ISOLATED (1-5)** | **P2** | **P3** | **P3** |

---

## Traffic Light Definitions

| Verdict | Meaning | Action |
|---------|---------|--------|
| **PASS** (green) | Matches spec or acceptable creative interpretation | Ship as-is |
| **DEVIATION** (amber) | Differs from spec but functional | Fix during implementation |
| **FAIL** (red) | Missing required element, broken interaction, spec violation | Redesign needed |

---

## 9 Evaluation Criteria (Per Screen)

1. **Token** - CSS custom properties vs hex values
2. **Nav** - Consistent shell structure per D1 spec
3. **Brand** - Logo treatment consistency
4. **Component** - Button/card/input/modal pattern consistency
5. **Typography** - Font/size/weight consistency
6. **Icons** - Lucide (not Material)
7. **Semantic** - Purple = voting only, Teal = privacy only
8. **Layout** - Max-width, spacing rhythm
9. **A11y** - Semantic HTML, ARIA, focus styles

---

## Finding Entry Template

Every finding needs:
- **ID**: L1-### or L2-B#-###
- **Type**: SYSTEMIC / WIDESPREAD / ISOLATED
- **Severity**: BLOCKING / MAJOR / MINOR
- **Priority**: P0 / P1 / P2 / P3 (from matrix)
- **Dimension**: Token/Nav/Brand/Component/Typography/Icons/Semantic/Layout/A11y
- **Description**: What is wrong
- **Evidence**: Screen names, code excerpts
- **Spec reference**: Link to style-guide.md line or prompt section
- **Fix direction**: Current → Expected → Method
- **Validated**: YES / NO

**Example fix direction**:
```
Current: Tailwind config uses primary: '#1d4fd7'
Expected: style-guide.md line 47, var(--color-primary-600)
Method: Replace hex with CSS custom property reference
```

---

## Success Thresholds

| Metric | Implementation Ready | Needs Fixes | Redesign |
|--------|---------------------|-------------|----------|
| PASS % | ≥90% | 70-89% | <70% |
| RED systemic | 0 | ≤2 | ≥3 |
| RED per-screen | <10 | 10-25 | >25 |

---

## Stop Condition

**After Batch 6 (20 screens)**: If P0 count >50, STOP Phase B immediately. Escalate to stakeholder: "Systemic redesign required."

Do not continue evaluating fundamentally broken work.

---

## Checkpoints

### After Layer 1 (Day 1)
- [ ] 9 dimensions complete
- [ ] 5 pre-existing findings validated
- [ ] 10 random screens spot-checked
- [ ] False positive rate <20%

### After Batch 6 (Day 2)
- [ ] 20 screens reviewed
- [ ] P0 count ≤50 (or escalated)

### After Layer 2 (Day 3)
- [ ] All 51 screens reviewed
- [ ] 5 screens consistency-checked
- [ ] Inconsistencies ≤3

### Before Final Report (Day 4)
- [ ] Missing screens analyzed
- [ ] Stakeholder review complete
- [ ] Priorities adjusted per business context

---

## Conflict Resolution

**When Layer 1 says "all 51" but Layer 2 shows fewer:**

1. Count actual affected screens from Layer 2
2. Reclassify impact: <20 screens = not systemic
3. Recalculate priority from matrix
4. Document in conflict log
5. Update Layer 1 finding with correct scope

---

## Consistency Rules

**Same issue type = same verdict across batches**

Good:
- "Missing aria-label" = FAIL everywhere
- "Non-standard spacing" = DEVIATION everywhere

Bad:
- "Missing aria-label" = FAIL in Batch 1, DEVIATION in Batch 8

**If ≥3 inconsistencies found, recalibrate and spot-fix.**

---

## Spec References

| Check | Source |
|-------|--------|
| Color tokens | style-guide.md |
| Nav structure | desktop-wireframe-prompts.md (D1 spec) |
| Logo/branding | style-guide.md (branding section) |
| Component patterns | design-principles.md + style-guide.md |
| Typography | style-guide.md (typography system) |
| Icons | style-guide.md (must be Lucide) |
| Semantic colors | design-principles.md (purple = voting, teal = privacy) |
| Layout grid | style-guide.md (spacing/layout) |
| Accessibility | dev-checklist.md (a11y section) |

---

## Common Pitfalls to Avoid

❌ **Don't write full implementations** - Point to fix, don't build it
❌ **Don't skip fix directions** - Every RED needs Current → Expected → Method
❌ **Don't batch completions** - Update progress tracker after each batch
❌ **Don't ignore contradictions** - Use conflict resolution rules
❌ **Don't skip stakeholder review** - Technical correctness ≠ business priority
❌ **Don't continue past stop condition** - If >50 P0 after Batch 6, stop
❌ **Don't use vague language** - "Inconsistent nav" → List exact differences
❌ **Don't assume spec is always right** - Flag SPEC ISSUE when ambiguous

---

## File Locations

- **Progress tracker**: `docs/design/wireframe-evaluation-progress.md`
- **Findings log**: `docs/design/wireframe-evaluation-findings-log.md`
- **Final report**: `docs/design/wireframe-evaluation-report.md` (create at end)
- **Wireframes**: `assets/wireframes/*.html` and `*.png`

---

## Daily Deliverables

- **Day 1 EOD**: Layer 1 systemic findings (validated)
- **Day 2 EOD**: Batches 1-6 complete, checkpoint 1 passed
- **Day 3 EOD**: All 51 screens reviewed
- **Day 4 EOD**: Final report with stakeholder approval

---

**Print this page or keep it open during evaluation for quick reference.**
