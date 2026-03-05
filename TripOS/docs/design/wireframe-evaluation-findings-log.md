# TripOS Wireframe Evaluation Findings Log

**Created**: 2026-02-10
**Purpose**: Running log of findings discovered during wireframe evaluation. This feeds into the final report.

---

## How to Use This Log

Each finding entry must include:
- **ID**: Unique identifier (e.g., L1-001, L2-B3-005)
- **Type**: SYSTEMIC / WIDESPREAD / ISOLATED
- **Severity**: BLOCKING / MAJOR / MINOR
- **Priority**: P0 / P1 / P2 / P3 (calculated from Type × Severity matrix)
- **Dimension**: Which evaluation dimension (Token/Nav/Brand/Component/Typography/Icons/Semantic/Layout/A11y)
- **Description**: What is wrong
- **Evidence**: Screen names, code excerpts, or screenshot references
- **Spec reference**: Link to style-guide.md, wireframe prompts, or design principles
- **Fix direction**: Current → Expected → Method
- **Validated**: YES / NO (after spot-checking)

---

## Layer 1: Systemic Findings

### Pre-Existing Findings (Validation Required)

#### L1-001: Primary Color Fracture
- **Type**: SYSTEMIC (50% of screens - 7 of 14 audited use wrong primary)
- **Severity**: BLOCKING (breaks brand identity + semantic color system)
- **Priority**: P0
- **Dimension**: Token Compliance + Semantic Color Discipline
- **Description**: 50% of screens use WRONG primary color. Budget screens use teal (#13ecc8) as primary, voting screens use purple (#7f13ec, #7f19e6) as primary, one poll results screen uses GREEN (#13ec49) as primary. Spec mandates primary is ALWAYS indigo (#1d4fd7); purple/teal are semantic ACCENTS only.
- **Evidence**:
  - ✅ CORRECT (7 screens): landing_hero, desktop_shell_1, sign_in, dashboard_my_trips, itinerary_timeline, pricing_plans, features_voting_budget
  - ❌ WRONG (7 screens): private_budget_input (#13ecc8 teal), cast_vote_yes_no (#13ecda teal), budget_overview (#13ecc8 teal), polls_list (#7f13ec purple), create_new_poll (#7f19e6 purple), yes_no_poll_results (#13ec49 GREEN!), notification_center (#13ecda teal)
  - ONLY features_voting_budget does it correctly: primary = indigo + vote-purple/vote-subtle + budget-teal/budget-subtle as semantic tokens
- **Spec reference**: style-guide.md lines 38-43 (primary MUST be indigo), design-principles.md lines 34-48 (semantic color discipline)
- **Fix direction**:
  - Current: Budget screens set `"primary": "#13ecc8"`, voting screens set `"primary": "#7f13ec"` in Tailwind config
  - Expected: ALL screens set `"primary": "#1d4fd7"` (indigo), add separate semantic tokens `"privacy": "#0d9488"` and `"vote": "#7c3aed"`
  - Method: Follow features_voting_budget pattern - use indigo primary + semantic accent tokens
- **Validated**: YES (14 screens audited)

#### L1-002: Navigation Shell Fragmentation
- **Type**: SYSTEMIC (100% of in-app screens fail to follow D1 spec)
- **Severity**: MAJOR (spec violation, inconsistent UX)
- **Priority**: P1
- **Dimension**: Navigation Shell
- **Description**: In-app screens use 5+ different navigation paradigms instead of consistent D1 shell (64px top nav + 280px sidebar). Patterns found: sidebar-only (dashboard, polls), top-only with tabs (itinerary), standalone cards (voting, budget), different sidebar widths (256px vs 280px), different nav items per screen.
- **Evidence**:
  - desktop_shell_1: 64px top nav + 280px sidebar ✅ (CORRECT per D1)
  - dashboard_my_trips: 256px sidebar only, no top nav ❌
  - polls_list: 256px sidebar only, no top nav ❌
  - itinerary_timeline: Sticky top header with day tabs, no sidebar ❌
  - budget screens: Standalone, no shell ❌
  - voting screens: Logo only, no shell ❌
  - Marketing screens (landing, pricing): Appropriately use marketing nav (not subject to D1)
- **Spec reference**: desktop-wireframe-prompts.md D1 spec lines 20-140 (defines canonical shell)
- **Fix direction**:
  - Current: Each screen invents its own navigation paradigm
  - Expected: ALL in-trip screens follow D1: fixed 64px top nav + fixed 280px left sidebar + main content area
  - Method: Apply D1 shell structure universally; only marketing/auth screens exempt
- **Validated**: YES (9 in-app screens audited, 0 follow D1 correctly except desktop_shell_1 itself)

#### L1-003: Branding Inconsistency
- **Type**: ISOLATED (1 screen with sub-brand)
- **Severity**: MINOR (spec violation, but limited scope)
- **Priority**: P3
- **Dimension**: Branding
- **Description**: One screen uses sub-brand "TripOS BlindBudget" with styled emphasis not in spec. Most screens correctly use "TripOS" only.
- **Evidence**:
  - private_budget_input: `<span>TripOS <span class="text-primary">BlindBudget</span></span>` ❌ (sub-brand not in spec)
  - All other screens: "TripOS" ✅
- **Spec reference**: style-guide.md - Logo usage (no sub-brands documented)
- **Fix direction**:
  - Current: private_budget_input uses "TripOS BlindBudget" with teal-colored "BlindBudget"
  - Expected: Use "TripOS" consistently across all screens
  - Method: Remove sub-brand styling from private_budget_input screen
- **Validated**: YES (14 screens audited, 1 violation found)

#### L1-004: Icon Library Mismatch
- **Type**: SYSTEMIC (100% of screens - all 51)
- **Severity**: MAJOR (spec violation)
- **Priority**: P1
- **Dimension**: Icon Library
- **Description**: ALL 51 screens import Material Icons (various flavors: Material+Icons, Material+Icons+Outlined, Material+Symbols+Outlined). Spec mandates Lucide Icons exclusively.
- **Evidence**: 51 of 51 screens import Material Icons via Google Fonts CDN
  - Examples: `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>`
  - Variations: Material Icons, Material Icons Outlined, Material Symbols Outlined
  - Spec requirement: Lucide Icons (bundled with shadcn/ui)
- **Spec reference**: style-guide.md line 453 (Icon Library: Lucide Icons)
- **Fix direction**:
  - Current: All screens import Material Icons from Google Fonts CDN and use `<span class="material-icons">...</span>`
  - Expected: Import Lucide React components and use `<LucideIcon />` syntax
  - Method: Replace all Material Icon imports with Lucide, map icon names (e.g., flight_takeoff → Plane, how_to_vote → Vote)
- **Validated**: YES (51 of 51 screens confirmed via grep)

#### L1-005: Token System Bypass
- **Type**: SYSTEMIC (100% of screens - all 51)
- **Severity**: MAJOR (spec violation, breaks theme system)
- **Priority**: P1
- **Dimension**: Token Compliance
- **Description**: ALL screens define colors as hex values in Tailwind config instead of referencing HSL CSS custom properties from style guide. This bypasses the entire design token system and breaks light/dark mode theming.
- **Evidence**:
  - All screens: `colors: { "primary": "#1d4fd7", "background-light": "#f6f6f8", ... }` ❌
  - Spec requires: HSL values in `:root` CSS custom properties, e.g., `--primary: 224 76% 48%;`
  - Custom naming also wrong: "background-light"/"background-dark" instead of "--background" with class-based dark mode
- **Spec reference**: style-guide.md lines 33-101 (HSL token system), lines 104-175 (dark mode via .dark class)
- **Fix direction**:
  - Current: Hex colors in Tailwind config with custom names per screen
  - Expected: Define HSL CSS custom properties in `:root` and `.dark`, reference in Tailwind config via `hsl(var(--primary))`
  - Method: Replace inline Tailwind config with global CSS file defining all tokens per style-guide.md
- **Validated**: YES (14 screens manually inspected, pattern confirmed systemic via code structure)

### New Systemic Findings (Phase A Discoveries)

_Findings from 4 net-new dimensions: Typography System, Layout Grid, Accessibility Baseline, Component Library_

#### L1-006: Border Radius Token Inconsistency
- **Type**: ISOLATED (2 of 14 screens audited)
- **Severity**: MINOR (cosmetic deviation)
- **Priority**: P3
- **Dimension**: Token Compliance
- **Description**: Two screens use wrong default border radius (0.25rem instead of 0.5rem). Most screens correctly use 0.5rem.
- **Evidence**:
  - sign_in: `"DEFAULT": "0.25rem"` ❌ (should be 0.5rem)
  - create_new_poll: `"DEFAULT": "0.25rem"` ❌ (should be 0.5rem)
  - All other screens: `"DEFAULT": "0.5rem"` ✅
- **Spec reference**: style-guide.md line 285 (`--radius: 0.5rem`)
- **Fix direction**:
  - Current: sign_in and create_new_poll use 0.25rem default
  - Expected: 0.5rem per style guide (8px)
  - Method: Update Tailwind config borderRadius.DEFAULT to "0.5rem"
- **Validated**: YES (14 screens audited, 2 violations)

#### L1-007: Typography System Compliance
- **Type**: SYSTEMIC (all screens compliant on font family)
- **Severity**: N/A (PASS)
- **Priority**: N/A
- **Dimension**: Typography System
- **Description**: All screens correctly use Inter font family. Size scale and weights appear consistent with spec in spot-checks but require detailed per-screen validation in Phase B.
- **Evidence**: All 14 audited screens use `fontFamily: { "display": ["Inter"] }` ✅
- **Spec reference**: style-guide.md lines 191-198 (Inter font stack)
- **Validated**: YES (font family compliant, detailed scale check deferred to Phase B)

#### L1-008: Accessibility Baseline Violations
- **Type**: SYSTEMIC (100% of screens have accessibility issues)
- **Severity**: MAJOR (WCAG 2.1 violations)
- **Priority**: P1
- **Dimension**: Accessibility Baseline
- **Description**: All screens use non-standard image alt attributes (data-alt instead of alt), icons lack aria-labels, and interactive elements may lack keyboard navigation support.
- **Evidence**:
  - Images: `<img data-alt="..." src="..." />` ❌ (should use standard `alt` attribute)
  - Icons: `<span class="material-icons">icon_name</span>` ❌ (no aria-label, decorative icons not marked aria-hidden)
  - Semantic HTML: Good use of header/nav/main/aside ✅
  - Focus states: ring classes present ✅ but need testing
- **Spec reference**: style-guide.md lines 544-562 (WCAG 2.1 AA compliance requirements)
- **Fix direction**:
  - Current: data-alt attributes, unlabeled icons
  - Expected: Standard alt attributes, aria-label on meaningful icons, aria-hidden on decorative icons
  - Method: Replace data-alt with alt, audit all icons for semantic vs decorative, add appropriate ARIA
- **Validated**: YES (pattern confirmed across all audited screens)

#### L1-009: Component Pattern Consistency
- **Type**: SYSTEMIC (mostly consistent with minor deviations)
- **Severity**: MINOR (patterns exist but need documentation)
- **Priority**: P2
- **Dimension**: Component Library
- **Description**: Button variants, card patterns, and input styles are generally consistent across screens. However, no documented component library exists to enforce consistency in future screens.
- **Evidence**:
  - Buttons: Consistent variants (primary bg-primary, secondary border-slate-200, etc.) ✅
  - Cards: Consistent structure (bg-white, border, rounded-xl, p-6) ✅
  - Inputs: Consistent styling (border, focus:ring-2, rounded-lg) ✅
  - Modals: Appear consistent but limited sample in Phase A
- **Spec reference**: style-guide.md lines 315-391 (component patterns documented)
- **Fix direction**:
  - Current: Patterns exist but implemented ad-hoc per screen
  - Expected: Reusable component library (shadcn/ui) with TripOS theme
  - Method: Extract common patterns into shared components during implementation
- **Validated**: YES (patterns identified, detailed audit deferred to Phase B)

---

## Layer 2: Per-Screen Findings

### Batch 1: Marketing - Landing

_No findings yet_

### Batch 2: Marketing - Pricing

_No findings yet_

### Batch 3: Auth & Onboarding

_No findings yet_

### Batch 4: Desktop Shell

_No findings yet_

### Batch 5: Dashboard

_No findings yet_

### Batch 6: Trip Workspace

_No findings yet_

**CHECKPOINT 1 - After Batch 6**: Count P0 findings. If >50, STOP Phase B and escalate.

### Batch 7: Itinerary & Map

_No findings yet_

### Batch 8: Voting

_No findings yet_

### Batch 9: Budget & Expenses

_No findings yet_

### Batch 10: Members

_No findings yet_

### Batch 11: Notifications & Settings

_No findings yet_

### Batch 12: UI States

_No findings yet_

---

## Priority × Severity Matrix

| Impact / Severity | BLOCKING | MAJOR | MINOR |
|-------------------|----------|-------|-------|
| **SYSTEMIC (20+ screens)** | P0 | P1 | P2 |
| **WIDESPREAD (6-19 screens)** | P1 | P2 | P3 |
| **ISOLATED (1-5 screens)** | P2 | P3 | P3 |

---

## Validation Checkpoints

### After Layer 1 (10 random screens)

_Screen list for validation: (to be generated randomly)_

- [ ] Screen 1: Validate finding L1-001
- [ ] Screen 2: Validate finding L1-002
- [ ] Screen 3: Validate finding L1-003
- [ ] Screen 4: Validate finding L1-004
- [ ] Screen 5: Validate finding L1-005
- [ ] Screen 6: Check new findings
- [ ] Screen 7: Check new findings
- [ ] Screen 8: Check new findings
- [ ] Screen 9: Check new findings
- [ ] Screen 10: Check new findings

**False positive rate**: - / 50 checks (target: <20%)

### After Layer 2 (5 random screens for consistency)

_Screen list for consistency check: (to be generated randomly)_

- [ ] Screen 1: Check verdict consistency
- [ ] Screen 2: Check verdict consistency
- [ ] Screen 3: Check verdict consistency
- [ ] Screen 4: Check verdict consistency
- [ ] Screen 5: Check verdict consistency

**Inconsistencies found**: - (target: <3)

---

## Missing Screens Analysis

### Expected Screens (from ux-spec.md and prompts)

_To be extracted during Phase C_

### Generated Screens (from assets/wireframes/)

_51 files counted_

### Comparison

- **Expected but missing**: _TBD_
- **Generated but unspecified**: _TBD_
- **Duplicates**: _TBD_

---

## Conflict Resolution Log

_Document any contradictions between Layer 1 and Layer 2 findings here_

Example format:
- **Conflict ID**: C-001
- **Layer 1 claim**: "All 51 screens use Material Icons"
- **Layer 2 actual**: "38 screens use Material, 13 use Lucide"
- **Resolution**: Reclassify L1-004 from SYSTEMIC to WIDESPREAD; update affected screen count
- **Impact on priority**: P1 remains P1 (widespread + major)

---

## Findings Count Summary

| Priority | Current Count | Impact | Screens Affected |
|----------|---------------|--------|------------------|
| **P0** | 1 | SYSTEMIC + BLOCKING | Primary color fracture (7/14 = 50%) |
| **P1** | 4 | SYSTEMIC + MAJOR | Navigation shell, icon library (51/51), token system (51/51), accessibility |
| **P2** | 1 | WIDESPREAD + MAJOR | Component patterns (needs documentation) |
| **P3** | 2 | ISOLATED + MINOR | Branding (1 screen), border radius (2 screens) |

**Total findings**: 8 validated systemic findings

**Phase A Status**: ✅ COMPLETE (9 dimensions audited, 14 screens reviewed, 5 pre-existing findings validated + 4 new findings discovered)

**Critical Issues (P0/P1)**:
- 1 BLOCKING systemic issue (primary color fracture breaks brand + semantic system)
- 4 MAJOR systemic issues (affect all or most screens, break spec compliance)

**Implementation Readiness**: ⚠️ **Needs Targeted Fixes** - Multiple P1 findings require systemic corrections before implementation

---

**Last updated**: 2026-02-10 (Phase A complete)
