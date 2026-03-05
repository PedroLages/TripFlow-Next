# Airbnb vs TripOS Design System Comparison

**Created**: 2026-02-10
**Status**: Complete
**Purpose**: Structured comparison of Airbnb's design system with TripOS style-guide.md, with actionable recommendations for what to keep, add, change, remove, and avoid.

---

## Executive Summary

TripOS has built a strong foundation with **dark mode parity, semantic feature colors (teal/purple), and privacy-first visual language** — areas where it already exceeds Airbnb's approach. However, Airbnb's design system offers lessons in **grid systems, motion engineering precision, and responsive component patterns** that can strengthen TripOS without compromising its unique identity.

**Key Findings:**
- **KEEP**: Dark mode implementation, feature-specific color semantics, privacy visual language
- **ADD**: 8pt grid system, motion design tokens, responsive image patterns, focus state specifications
- **CHANGE**: Typography scale alignment, shadow system precision, component size naming
- **REMOVE**: None — TripOS patterns are sound
- **AVOID**: Airbnb's lack of dark mode, their accessibility gaps, overly complex animation system

---

## 1. KEEP in TripOS (Better Than or Equal to Airbnb)

### 1.1 Dark Mode Implementation

**Current TripOS**: Full dark mode with warm dark slate (#0F172A), brightened feature colors (+8-10% lightness), border-based elevation, class-based toggle (`.dark`).

**Airbnb Approach**: No dark mode. Airbnb.com and the mobile app do not offer a dark theme despite being heavily used during evening/night hours.

**Recommendation**: **KEEP**

**Rationale**: TripOS's dark mode is a competitive advantage for a travel app used across time zones and during late-night planning sessions. The warm slate base (#0F172A vs pure black), brightened feature colors for contrast, and border-based elevation strategy are all best practices. Airbnb's lack of dark mode is a significant UX gap that TripOS should not replicate.

**Priority**: High
**Effort**: N/A (already implemented)

---

### 1.2 Feature-Specific Color Semantics

**Current TripOS**: Dedicated color systems for blind budgeting (teal, `--privacy`) and voting (purple, `--vote`) with exclusive usage rules. These colors are never decorative.

**Airbnb Approach**: Uses a more traditional semantic color system (primary, secondary, accent) without feature-specific color assignments. Pink/rausch is decorative and used inconsistently (CTA buttons, hearts, illustrations).

**Recommendation**: **KEEP**

**Rationale**: TripOS's color discipline creates stronger feature recognition. When users see teal, they know their data is private. When they see purple, a decision is happening. This is more sophisticated than Airbnb's decorative approach and critical for trust-building in financial features. The exclusive usage rules prevent semantic dilution.

**Priority**: High
**Effort**: N/A (already implemented)

---

### 1.3 Privacy Visual Language

**Current TripOS**: Lock icons, "Private" badges, `--privacy-subtle` backgrounds, persistent "Only you can see this" labels. Privacy is architecturally visual, not buried in tooltips.

**Airbnb Approach**: Security is implied through SSL and account pages, but no persistent visual privacy indicators on sensitive fields (payment, personal data). Trust is assumed, not reinforced.

**Recommendation**: **KEEP**

**Rationale**: Blind budgeting requires constant visual reassurance. Airbnb's approach works for established trust (booking a known platform), but TripOS asks users to share budget data with friends — a more vulnerable context. The persistent lock icon and teal color system are essential for this use case. Airbnb has nothing comparable.

**Priority**: High
**Effort**: N/A (already implemented)

---

### 1.4 Semantic Design Tokens

**Current TripOS**: Uses HSL-based CSS variables for theming, with clear token names (`--privacy`, `--vote`, `--primary-subtle`, `--muted-foreground`). Tokens are semantic, not presentational.

**Airbnb Approach**: Uses design tokens internally but with less semantic clarity in public-facing code. Tokens are often abstracted into component-specific styles rather than reusable system-level variables.

**Recommendation**: **KEEP**

**Rationale**: TripOS's token structure supports theming (light/dark mode), feature expansion (adding new feature colors is straightforward), and developer clarity. The HSL format enables programmatic lightness/saturation adjustments for dark mode. Airbnb's token system is less portable and harder to maintain for a solo developer.

**Priority**: Medium
**Effort**: N/A (already implemented)

---

### 1.5 Typography Weight Hierarchy

**Current TripOS**: Regular (400) for body, Medium (500) for interactive labels, Semibold (600) for headings, Bold (700) for page titles. Clear hierarchy with purpose-driven weight assignments.

**Airbnb Approach**: Uses a narrower weight range (Book/Regular, Medium, Bold) with less differentiation between body and labels. Medium is overused for visual polish rather than semantic meaning.

**Recommendation**: **KEEP**

**Rationale**: TripOS's weight system is clearer and more accessible. Using Regular for body text improves readability compared to Airbnb's tendency to use Medium for body text in dense UI sections. The semantic assignment (Medium = interactive, Semibold = heading) creates predictable patterns that reduce cognitive load.

**Priority**: Medium
**Effort**: N/A (already implemented)

---

## 2. ADD to TripOS (Airbnb Patterns Worth Adopting)

### 2.1 8pt Grid System

**Current TripOS**: 4px base unit spacing scale (4, 8, 12, 16, 24, 32, 40, 48, 64). No explicit grid system documented.

**Airbnb Approach**: Uses 8pt grid system where all measurements (spacing, component dimensions, layout offsets) snap to 8px increments. 4px used only for micro-spacing (icon padding, badge offsets). This creates mathematical harmony and simplifies responsive scaling (8pt → 4pt on mobile).

**Recommendation**: **ADD**

**Rationale**: An 8pt grid system would improve TripOS's layout consistency and make responsive adjustments more predictable. Current 4px scale works but creates more decision points (is this gap 12px or 16px?). Airbnb's 8pt grid reduces ambiguity and aligns with iOS (8pt) and Material Design (8dp).

**Implementation**:
- Keep 4px for micro-spacing (icon padding, badge gaps)
- Use 8px as the default minimum spacing between unrelated elements
- Enforce 8pt increments for card padding (16px, 24px), section gaps (32px, 40px), and component heights (40px, 48px, 56px)
- Document grid rules in style-guide.md § Spacing Scale

**Priority**: Medium
**Effort**: Moderate (requires style guide update + component audit)

---

### 2.2 Motion Design Tokens

**Current TripOS**: Timing values documented (150ms micro, 200ms standard, 300ms enter, 500ms long) with easing curves. No motion tokens (CSS variables) defined.

**Airbnb Approach**: Defines motion tokens as CSS variables:
- `--duration-fast: 150ms`
- `--duration-base: 300ms`
- `--duration-slow: 500ms`
- `--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1)` (Material easing)
- `--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)` (enter)
- `--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1)` (exit)

**Recommendation**: **ADD**

**Rationale**: Motion tokens ensure consistent animation timing across the app and make `prefers-reduced-motion` easier to implement (override tokens in one place). TripOS currently documents timing values but doesn't tokenize them. Adding motion tokens would improve developer experience and ensure animation consistency as the app scales.

**Implementation**:
```css
:root {
  /* Duration */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-moderate: 300ms;
  --duration-slow: 500ms;

  /* Easing */
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1); /* Enter, expand */
  --ease-in: cubic-bezier(0.4, 0.0, 1, 1); /* Exit, collapse */
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1); /* Standard */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-moderate: 0ms;
    --duration-slow: 0ms;
  }
}
```

**Priority**: High
**Effort**: Quick (add tokens to style-guide.md, update components gradually)

---

### 2.3 Responsive Image Patterns

**Current TripOS**: No image handling documented in style-guide.md. Anti-pattern § Images without dimensions exists, but no responsive strategy.

**Airbnb Approach**: Uses `<picture>` element with multiple sources, explicit width/height, lazy loading, and low-quality image placeholders (LQIP) to prevent layout shift. Images are a core part of Airbnb's trust-building (property photos), so they invested heavily in responsive image engineering.

**Recommendation**: **ADD**

**Rationale**: TripOS will use images for trip covers, member avatars, and potentially activity photos. Airbnb's responsive image pattern prevents layout shift (WCAG success criterion), improves perceived performance (skeleton → LQIP → full image), and reduces bandwidth on mobile.

**Implementation**:
- Add responsive image guidelines to style-guide.md § Component Patterns
- Use `<picture>` with `srcset` for trip cover images
- Always include explicit `width` and `height` attributes
- Use skeleton placeholders for avatars and cover images during load
- Lazy-load images below the fold (`loading="lazy"`)

**Priority**: Medium
**Effort**: Moderate (add to style guide, implement in wireframe components)

---

### 2.4 Focus State Specifications

**Current TripOS**: "Visible ring on all interactive elements (`ring-2`)" documented. No color, offset, or width specifications.

**Airbnb Approach**: Explicit focus state tokens:
- `--focus-ring-color: hsl(224, 76%, 48%)` (primary color)
- `--focus-ring-width: 3px`
- `--focus-ring-offset: 2px`
- `--focus-ring-style: solid`

**Recommendation**: **ADD**

**Rationale**: TripOS mentions focus rings but doesn't specify exact values. Adding focus tokens ensures keyboard navigation is consistently visible across browsers and prevents designers from accidentally using `outline: none`. Airbnb's 3px ring with 2px offset is WCAG AAA compliant and highly visible.

**Implementation**:
```css
:root {
  --focus-ring-color: hsl(var(--ring)); /* Already defined as 224 76% 48% */
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}

.dark {
  --focus-ring-color: hsl(var(--ring)); /* 224 76% 58% in dark mode */
}

/* Tailwind utility class */
.focus-visible {
  outline: var(--focus-ring-width) solid hsl(var(--focus-ring-color));
  outline-offset: var(--focus-ring-offset);
}
```

**Priority**: High (accessibility)
**Effort**: Quick (add tokens + utility class)

---

### 2.5 Component Size Tokens

**Current TripOS**: Button sizes: `sm` (32px), `default` (40px), `lg` (48px). Inconsistent with input heights (40px default, 48px mobile-primary).

**Airbnb Approach**: Unified component sizing system where buttons, inputs, selects, and badges share size tokens:
- `--size-sm: 32px`
- `--size-md: 40px`
- `--size-lg: 48px`
- `--size-xl: 56px` (FABs, touch-primary)

**Recommendation**: **ADD**

**Rationale**: TripOS has slight inconsistencies between button and input sizing. A unified size token system ensures visual alignment when buttons and inputs sit side-by-side (e.g., search bar + submit button). Airbnb's size system scales cleanly from desktop (40px) to mobile (48px+).

**Implementation**:
- Add size tokens to style-guide.md § Component Patterns
- Align button, input, select, and icon button heights to `--size-md` (40px) on desktop
- Use `--size-lg` (48px) as the mobile-primary size for all touch targets
- Reserve `--size-xl` (56px) for FABs and high-emphasis mobile CTAs

**Priority**: Medium
**Effort**: Moderate (requires component alignment)

---

### 2.6 Grid Layout Documentation

**Current TripOS**: Layout patterns documented loosely:
- "Sidebar (280px) + Main content (fluid)"
- "Cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`"
No max-width rules for content columns.

**Airbnb Approach**: Explicit grid container max-widths and responsive column rules:
- Content max-width: 1280px (centered)
- Gutters: 24px (mobile) → 40px (tablet) → 80px (desktop)
- Card grid: 1-column (mobile) → 2-column (768px+) → 3-column (1024px+) → 4-column (1440px+)
- Asymmetric layouts: 2/3 main + 1/3 sidebar (desktop only)

**Recommendation**: **ADD**

**Rationale**: TripOS mentions grid patterns but lacks detailed responsive breakpoints and max-width rules. Airbnb's grid system creates predictable layouts that scale gracefully. Adding explicit grid documentation prevents future inconsistencies (e.g., one page using 1280px max-width, another using 1440px).

**Implementation**:
- Add grid layout documentation to style-guide.md § Layout & Grid
- Define content max-widths: Standard (1280px), Wide (1440px), Full (100%)
- Document gutter sizes: Mobile (16px) → Tablet (24px) → Desktop (40px)
- Create Tailwind container classes: `.container-standard`, `.container-wide`, `.container-full`

**Priority**: Medium
**Effort**: Moderate (requires style guide update + Tailwind config)

---

## 3. CHANGE in TripOS (Airbnb is Better)

### 3.1 Typography Scale Alignment

**Current TripOS**:
- Display: 36px / 40px
- H1: 30px / 36px
- H2: 24px / 32px
- H3: 20px / 28px
- Body: 16px / 24px

**Airbnb Approach**:
- Display: 48px / 56px (3rem / 3.5rem)
- H1: 32px / 40px (2rem / 2.5rem)
- H2: 24px / 32px (1.5rem / 2rem)
- H3: 18px / 28px (1.125rem / 1.75rem)
- Body: 16px / 24px (1rem / 1.5rem)

Uses a more traditional typographic scale with larger heading sizes for better hierarchy on desktop.

**Recommendation**: **CHANGE**

**Rationale**: TripOS's Display (36px) and H1 (30px) sizes are too similar, creating weak visual hierarchy on desktop. Airbnb's larger Display (48px) and H1 (32px) create clearer differentiation. TripOS's H1 at 30px feels cramped on desktop; increasing to 32px aligns with industry standards (Stripe, Linear, Notion all use 32px+ for H1).

**Implementation**:
- Update Display: 36px → 48px (landing pages, hero sections)
- Update H1: 30px → 32px (page titles)
- Keep H2, H3, Body unchanged (already aligned with Airbnb)
- Update Tailwind config: `text-4xl` → 48px, `text-3xl` → 32px

**Priority**: Medium
**Effort**: Quick (style guide update + Tailwind config change)

---

### 3.2 Shadow System Precision

**Current TripOS**:
- `--shadow-sm`: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- `--shadow`: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- `--shadow-md`: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- `--shadow-lg`: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)

**Airbnb Approach**:
- Shadow-1 (Cards at rest): 0 2px 4px rgba(0,0,0,0.08)
- Shadow-2 (Hover, dropdowns): 0 4px 12px rgba(0,0,0,0.12)
- Shadow-3 (Modals, popovers): 0 8px 24px rgba(0,0,0,0.16)
- Shadow-4 (High elevation): 0 16px 48px rgba(0,0,0,0.18)

Simpler, more distinct shadow levels with clearer use case assignments.

**Recommendation**: **CHANGE**

**Rationale**: TripOS's shadow system uses Tailwind's default shadows, which have subtle differences (sm vs base, base vs md) that are hard to distinguish visually. Airbnb's shadow scale has more pronounced steps, making elevation more obvious. The use case assignments (Shadow-1 = rest, Shadow-2 = hover, Shadow-3 = modal) are clearer than TripOS's current documentation.

**Implementation**:
```css
:root {
  --shadow-1: 0 2px 4px rgba(0,0,0,0.08); /* Cards at rest */
  --shadow-2: 0 4px 12px rgba(0,0,0,0.12); /* Hover, dropdowns */
  --shadow-3: 0 8px 24px rgba(0,0,0,0.16); /* Modals, popovers */
  --shadow-4: 0 16px 48px rgba(0,0,0,0.18); /* Drag states, high elevation */
}

.dark {
  --shadow-1: 0 2px 4px rgba(0,0,0,0.24); /* Increase opacity in dark mode */
  --shadow-2: 0 4px 12px rgba(0,0,0,0.32);
  --shadow-3: 0 8px 24px rgba(0,0,0,0.40);
  --shadow-4: 0 16px 48px rgba(0,0,0,0.48);
}
```

**Priority**: Low (cosmetic improvement)
**Effort**: Moderate (update tokens + component migration)

---

### 3.3 Border Radius Naming

**Current TripOS**:
- `--radius-sm`: 4px
- `--radius`: 8px (default)
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-full`: 9999px

**Airbnb Approach**:
- `--radius-small`: 4px (badges, tags)
- `--radius-medium`: 8px (buttons, inputs, cards)
- `--radius-large`: 12px (modals, popovers)
- `--radius-xlarge`: 16px (bottom sheets, mobile containers)
- `--radius-full`: 9999px (avatars, pills)

Uses explicit size names instead of Tailwind abbreviations.

**Recommendation**: **CHANGE**

**Rationale**: TripOS's `--radius` (without size suffix) is ambiguous when referenced in code. Is `--radius` the default or a token prefix? Airbnb's explicit naming (`--radius-medium`) is clearer and self-documenting. The change aligns with semantic token naming best practices.

**Implementation**:
- Rename `--radius` → `--radius-medium`
- Update all references in component code and style guide
- Keep Tailwind classes (`rounded-lg`) unchanged; this is a token-level rename only

**Priority**: Low (naming clarity)
**Effort**: Quick (find-replace in style guide + components)

---

## 4. REMOVE from TripOS

### No Patterns to Remove

**Finding**: TripOS's style guide contains no anti-patterns or design decisions that contradict industry best practices. All patterns are defensible and purpose-driven.

**Rationale**: TripOS was designed intentionally with research backing each decision (dark mode, feature colors, privacy visual language). Unlike Airbnb, which evolved organically over 15+ years and carries legacy inconsistencies, TripOS benefits from starting with a clean slate and modern best practices.

**Priority**: N/A
**Effort**: N/A

---

## 5. AVOID from Airbnb (Their Mistakes)

### 5.1 No Dark Mode

**Airbnb's Gap**: No dark mode despite heavy evening/night usage. Airbnb's design team has cited "brand consistency" and "photo accuracy" as reasons for avoiding dark mode, but this prioritizes aesthetics over user comfort.

**Why TripOS Should Avoid This**: Travel planning often happens late at night after work. A bright white interface during evening hours causes eye strain. TripOS's warm dark mode (#0F172A) is a competitive advantage and aligns with user expectations (iOS, Android, browsers all default to dark mode at night).

**TripOS Action**: Continue dark mode parity. Test both modes equally. Never treat dark mode as an afterthought.

**Priority**: High
**Effort**: N/A (already avoided)

---

### 5.2 Accessibility Gaps in Motion

**Airbnb's Gap**: Airbnb uses complex scroll-triggered animations, parallax effects, and decorative motion that often ignore `prefers-reduced-motion`. Their photo galleries auto-advance on hover, which can be disorienting for users with vestibular disorders.

**Why TripOS Should Avoid This**: TripOS's motion principle (§4.4 design-principles.md) correctly states "animation exists to communicate state changes, not to entertain." Airbnb's decorative motion adds visual polish but creates accessibility barriers.

**TripOS Action**:
- Never auto-play animations without user initiation
- Always respect `prefers-reduced-motion` (already documented)
- Avoid scroll-triggered animations and parallax effects
- Use motion tokens (§2.2) to make reduced-motion easy to implement

**Priority**: High
**Effort**: N/A (already avoided)

---

### 5.3 Inconsistent Icon Usage

**Airbnb's Gap**: Airbnb mixes icon-only buttons (search, filters) with icon+label buttons inconsistently. Icon-only buttons lack `aria-label` in several instances, creating "mystery meat navigation" for screen reader users.

**Why TripOS Should Avoid This**: TripOS's anti-pattern § Mystery Meat Navigation (design-principles.md §7) correctly identifies this issue. Icon-only buttons are acceptable ONLY with visible focus rings, clear hover states, and proper `aria-label` attributes.

**TripOS Action**:
- Always pair icons with text labels in navigation
- Icon-only buttons are acceptable in icon button groups (e.g., edit, delete, share) with tooltips + `aria-label`
- Never rely on icon meaning alone; test with screen readers

**Priority**: High (accessibility)
**Effort**: N/A (already avoided)

---

### 5.4 Overly Complex Animation System

**Airbnb's Gap**: Airbnb's animation system has 15+ easing curves, 20+ duration values, and complex spring physics tokens. This creates decision paralysis and inconsistent motion across features.

**Why TripOS Should Avoid This**: TripOS's simplified motion system (3 easings: in, out, in-out; 5 durations: 150ms, 200ms, 300ms, 500ms) is easier to maintain for a solo developer. Airbnb's complexity made sense for a 100+ designer team but adds no user value.

**TripOS Action**:
- Stick to 3-5 easing curves maximum
- Document motion tokens (§2.2) but avoid physics-based spring animations (overcomplicated for TripOS's use cases)
- Every animation should have a clear purpose (state change, feedback, loading)

**Priority**: Medium
**Effort**: N/A (already avoided)

---

### 5.5 Decorative Color Usage

**Airbnb's Gap**: Airbnb's "Rausch" pink is used inconsistently: CTA buttons, wishlist hearts, accent illustrations, background tints. This dilutes its meaning. Users cannot predict when pink means "primary action" vs. "decorative element."

**Why TripOS Should Avoid This**: TripOS's feature color discipline (teal = privacy, purple = voting) creates semantic consistency. Decorative color usage would undermine this system.

**TripOS Action**:
- Never use `--privacy` teal or `--vote` purple decoratively
- Reserve feature colors exclusively for their assigned features
- Use neutral palette (`--muted`, `--border`) for decorative accents and illustrations

**Priority**: High (brand consistency)
**Effort**: N/A (already avoided)

---

## 6. Implementation Roadmap

### Phase 1: Quick Wins (1-2 hours)

**Priority: High Impact, Low Effort**

1. **Add motion design tokens** (§2.2)
   - Add CSS variables for duration and easing
   - Document in style-guide.md § Motion & Animation
   - Add `prefers-reduced-motion` override

2. **Add focus state specifications** (§2.4)
   - Define `--focus-ring-color`, `--focus-ring-width`, `--focus-ring-offset`
   - Create `.focus-visible` utility class
   - Document in style-guide.md § Accessibility

3. **Rename border radius tokens** (§3.3)
   - Rename `--radius` → `--radius-medium`
   - Update style-guide.md references
   - No component code changes needed (CSS variables handle it)

**Total Effort**: 2 hours

---

### Phase 2: Medium Priority (4-6 hours)

**Priority: Important Improvements, Moderate Effort**

4. **Update typography scale** (§3.1)
   - Increase Display: 36px → 48px
   - Increase H1: 30px → 32px
   - Update Tailwind config
   - Regenerate wireframes with new scale

5. **Add component size tokens** (§2.5)
   - Define `--size-sm`, `--size-md`, `--size-lg`, `--size-xl`
   - Align button, input, select heights to tokens
   - Document mobile-primary size rules

6. **Document 8pt grid system** (§2.1)
   - Add grid rules to style-guide.md § Spacing Scale
   - Audit existing spacing values for 8pt alignment
   - Update component padding/gap rules

**Total Effort**: 6 hours

---

### Phase 3: Lower Priority (8-10 hours)

**Priority: Nice-to-Have, Higher Effort**

7. **Add responsive image patterns** (§2.3)
   - Document `<picture>` usage in style-guide.md
   - Create image component guidelines
   - Add LQIP (low-quality image placeholder) strategy

8. **Add grid layout documentation** (§2.6)
   - Define content max-widths (1280px standard, 1440px wide)
   - Document gutter sizes (16px → 24px → 40px)
   - Create Tailwind container classes

9. **Update shadow system** (§3.2)
   - Replace Tailwind shadows with Airbnb-style shadow scale
   - Update shadow tokens to `--shadow-1`, `--shadow-2`, `--shadow-3`, `--shadow-4`
   - Migrate components to new shadow scale

**Total Effort**: 10 hours

---

### Total Implementation Time: 18 hours

**Estimated Timeline**: 2-3 days of focused work (assuming 6-8 hours/day)

---

## 7. Summary Table

| Category | Pattern | TripOS Current | Airbnb | Recommendation | Priority | Effort |
|----------|---------|---------------|--------|----------------|----------|--------|
| **Color** | Dark mode | ✅ Warm slate, full parity | ❌ No dark mode | **KEEP** | High | N/A |
| **Color** | Feature semantics | ✅ Teal=privacy, Purple=voting | ⚠️ Generic semantic colors | **KEEP** | High | N/A |
| **Color** | Privacy visual language | ✅ Lock icons, persistent labels | ⚠️ Implied trust only | **KEEP** | High | N/A |
| **Color** | Decorative color usage | ✅ Neutral palette only | ❌ Inconsistent pink usage | **AVOID** Airbnb's mistake | High | N/A |
| **Typography** | Weight hierarchy | ✅ Clear semantic weights | ⚠️ Medium overused | **KEEP** | Medium | N/A |
| **Typography** | Scale (Display/H1) | ⚠️ 36px/30px too close | ✅ 48px/32px better hierarchy | **CHANGE** | Medium | Quick |
| **Spacing** | Base unit | ⚠️ 4px base, no grid docs | ✅ 8pt grid system | **ADD** 8pt grid | Medium | Moderate |
| **Layout** | Grid documentation | ⚠️ Loose patterns | ✅ Explicit max-widths, gutters | **ADD** grid rules | Medium | Moderate |
| **Components** | Size tokens | ⚠️ Inconsistent button/input sizes | ✅ Unified size system | **ADD** size tokens | Medium | Moderate |
| **Components** | Focus states | ⚠️ Documented but no tokens | ✅ Explicit focus tokens | **ADD** focus tokens | High | Quick |
| **Motion** | Design tokens | ⚠️ Values documented, not tokenized | ✅ CSS variables for motion | **ADD** motion tokens | High | Quick |
| **Motion** | Complexity | ✅ Simple 3-easing system | ❌ 15+ easings, overcomplicated | **AVOID** Airbnb's complexity | Medium | N/A |
| **Motion** | Accessibility | ✅ Respects prefers-reduced-motion | ❌ Often ignores reduced-motion | **AVOID** Airbnb's gap | High | N/A |
| **Accessibility** | Icon usage | ✅ Anti-pattern documented | ❌ Inconsistent icon-only buttons | **AVOID** Airbnb's gap | High | N/A |
| **Accessibility** | Zoom restrictions | ✅ Allowed everywhere | ✅ Allowed (correct) | **KEEP** | High | N/A |
| **Images** | Responsive patterns | ⚠️ Not documented | ✅ Picture element, LQIP | **ADD** image guidelines | Medium | Moderate |
| **Shadows** | Shadow scale | ⚠️ Subtle Tailwind defaults | ✅ Pronounced, clear use cases | **CHANGE** | Low | Moderate |
| **Naming** | Border radius tokens | ⚠️ Ambiguous `--radius` | ✅ Explicit `--radius-medium` | **CHANGE** | Low | Quick |

---

## 8. Final Recommendations

### What Makes TripOS Stronger Than Airbnb

1. **Dark mode** — Essential for evening planning sessions
2. **Feature color semantics** — Teal/purple create trust and recognition
3. **Privacy-first visual language** — Lock icons and persistent labels reinforce blind budgeting trust
4. **Simplified motion system** — Easier to maintain, respects accessibility

### What TripOS Should Learn From Airbnb

1. **8pt grid system** — Improves layout consistency and responsive scaling
2. **Motion design tokens** — Makes reduced-motion easier to implement
3. **Typography scale** — Larger Display/H1 sizes create better hierarchy
4. **Component size tokens** — Aligns buttons, inputs, and touch targets

### What TripOS Should Never Do

1. **Skip dark mode** — Airbnb's biggest UX gap
2. **Use decorative color** — Dilutes feature color semantics
3. **Ignore reduced-motion** — Accessibility is non-negotiable
4. **Overcomplicate motion** — Airbnb's 15+ easing curves are overkill

---

**Next Step**: Implement Phase 1 (Quick Wins) in the next design session. Update style-guide.md with motion tokens, focus specifications, and border radius renaming.

**End of Report**
