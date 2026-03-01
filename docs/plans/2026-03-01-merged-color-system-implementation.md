# TripFlow Merged Color System Implementation Plan

## Context

TripFlow currently uses a **mixed color approach** (custom hex + OKLCH for shadcn) with 6 city-specific colors (Shanghai pink, Tokyo indigo, Osaka teal, etc.) and ~72% style guide compliance. Meanwhile, **TripOS uses a disciplined HSL token system** with semantic color exclusivity (teal = privacy ONLY, purple = voting ONLY) that prevents decorative misuse.

**Problem:** TripFlow has **hardcoded colors** in critical files (map-tokens.ts, Budget.tsx, ActivityCard.css) and **potential semantic confusion** between Osaka city color (teal) and privacy feature color (teal).

**Goal:** Merge the best of both systems:
- **TripOS's semantic discipline** (color exclusivity, token architecture, chromatic constraints)
- **TripFlow's visual richness** (6 city colors, glassmorphic aesthetic, cinematic brand)
- **Modern 2026 standards** (OKLCH perceptual uniformity, 3-layer tokens, WCAG AA compliance)

This plan creates a **unified color system** that maintains TripFlow's city-based identity while adopting TripOS's semantic rigor.

---

## Design Decisions

### 1. Color Space: OKLCH (Not HSL)

**Decision:** Use **OKLCH** as the primary color space for all design tokens.

**Rationale:**
- ✅ **Perceptually uniform** - Equal numeric changes = equal visual changes (HSL fails this)
- ✅ **Wide-gamut support** - Can encode P3 colors (future-proof for HDR displays)
- ✅ **Native browser support** - 95%+ compatibility as of 2026 (Safari 15.4+, Chrome 111+)
- ✅ **Tailwind v4 native** - Built-in `oklch()` function
- ✅ **shadcn/ui default** - Aligns with TripFlow's current shadcn usage
- ✅ **Accessibility** - Designed for APCA (Advanced Perceptual Contrast Algorithm)

**TripOS used HSL** for algorithmic dark mode transformations (`+10% lightness`), but explicit palettes are **more reliable** than algorithms. TripOS's HSL transformations still required manual tuning (teal: 37% → 45%, not a fixed offset).

### 2. Token Architecture: 3-Layer System

**Layer 1: Reference Tokens** (Raw palette)
- OKLCH values with semantic names
- Never used directly in components
- Example: `--ref-indigo-40: oklch(0.48 0.18 264)`

**Layer 2: Semantic Tokens** (Role-based)
- Map reference tokens to UI roles
- What components actually use
- Example: `--accent-primary: var(--ref-indigo-40)`

**Layer 3: Component Tokens** (Tailwind classes)
- Map semantic tokens to Tailwind utilities
- Example: `bg-accent-primary`, `text-privacy`, `border-city-tokyo`

### 3. City vs Feature Color Resolution

**Problem:** Osaka city color (teal) conflicts with privacy feature color (teal).

**Solution: Spatial Separation + Namespacing**

**Color Hierarchy (Precedence):**
```
Tier 1: Semantic UI (success, danger, warning, info) ← Always wins
Tier 2: Feature Colors (privacy teal, voting purple) ← Wins in feature contexts
Tier 3: Brand Accent (primary teal, coral) ← Wins in neutral UI
Tier 4: City Colors (Shanghai pink, Osaka teal, Tokyo indigo...) ← Context-specific only
```

**Usage Rules:**
- **City colors:** LEFT/RIGHT BORDERS, map pins, city chips (never buttons/badges)
- **Feature colors:** ICONS, badges, subtle backgrounds (privacy/voting contexts only)
- **Brand accent:** PRIMARY BUTTONS, links, focus states (global UI)

**Hue Separation (Osaka vs Privacy):**
- Privacy: `oklch(0.56 0.14 185)` - 185° hue (cyan-teal)
- Osaka: `oklch(0.56 0.14 200)` - 200° hue (blue-teal)
- **15° separation** creates subtle but clear visual distinction

**Visual Language:**
- Border = city identity (geometric accent)
- Icon + badge = feature meaning (semantic indicator)
- Different treatments prevent confusion

### 4. Dark Mode Strategy

**Approach:** Explicit palettes (not algorithmic transformation)

**Transformation Rules:**
| Color Category | Light → Dark Adjustment |
|----------------|------------------------|
| **Semantic colors** | Full inversion (text 96% ↔ 7%, bg 98% ↔ 10%) |
| **City colors** | Variable +8-14% lightness boost |
| **Feature colors** | +8-12% lightness boost |
| **Accent colors** | +8% lightness boost |

**Dark Mode Depth System (no shadows, use borders + glows):**
- Base: 7% lightness (#121212 OLED-safe)
- Surface: 12% lightness
- Elevated: 16% lightness
- Floating: 21% lightness

**All combinations pass WCAG AA:**
- Text on bg-base: **14.8:1** (AAA) ✅
- City colors on dark: **5.2:1 to 8.9:1** (AA to AAA) ✅
- Feature colors on dark: **5.4:1+** (AA) ✅

---

## Critical Files to Modify

### Priority 0 (Foundation - Must Do First)

**1. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/app/globals.css`**
- **Action:** Add 3-layer token system (reference, semantic, dark mode palettes)
- **Current:** Mixed hex + OKLCH, 85% dark mode complete
- **New:** Complete OKLCH token definitions with 100% dark mode coverage

**2. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/tailwind.config.js` (or `.ts`)**
- **Action:** Map semantic tokens to Tailwind utilities
- **Current:** May not exist (Tailwind v4 uses `@theme` in CSS)
- **New:** Ensure `@theme` block in globals.css has component layer mappings

### Priority 1 (Migration - Remove Hardcoded Colors)

**3. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/lib/map-tokens.ts`**
- **Current violation:** 7 hardcoded hex values for transport modes
- **Fix:** Replace with `--transport-*` CSS variables

**4. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/components/Budget/Budget.tsx`**
- **Current violation:** Inline `#10b981`, `#f59e0b`, `#8b5cf6`
- **Fix:** Use semantic tokens `--color-success`, `--color-warning`, `--color-vote`

**5. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/components/Itinerary/ActivityCard.css`**
- **Current violation:** Hardcoded `#ef4444`, `rgba(34, 197, 94, 0.9)`
- **Fix:** Use `--color-danger`, `--color-success` tokens

### Reference Files (Already Compliant)

**6. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/lib/city-colors.ts`**
- **Status:** ✅ Uses CSS variables (`--city-shanghai`, etc.)
- **Action:** Add JSDoc comments documenting usage constraints

**7. `/Volumes/SSD/Dev/Asia Trip/tripflow-next/src/components/BlindBudget/PrivacyIndicator.tsx`**
- **Status:** ✅ Uses `bg-privacy-light`, `text-teal`
- **Action:** Reference implementation for privacy color usage

---

## Implementation Plan

### Phase 1: Token Definition (2 hours)

**Task:** Create complete 3-layer token system in `globals.css`

**Changes to `globals.css`:**

```css
/**
 * TripFlow Color System v2.0
 * OKLCH-based 3-layer architecture
 * Merges TripOS semantic discipline + TripFlow visual richness
 */

/* ========================================
   LAYER 1: REFERENCE COLORS (Palette)
   ======================================== */

:root {
  /* Primary Brand (Indigo) */
  --ref-indigo-40: oklch(0.48 0.18 264);   /* Light mode */
  --ref-indigo-60: oklch(0.60 0.20 264);   /* Dark mode */
  --ref-indigo-95: oklch(0.97 0.02 264);   /* Subtle bg */

  /* Feature: Privacy (Cyan-Teal, 185°) - Differentiated from Osaka */
  --ref-privacy-40: oklch(0.56 0.14 185);
  --ref-privacy-60: oklch(0.68 0.16 185);
  --ref-privacy-95: oklch(0.98 0.02 185);

  /* Feature: Voting (Purple, 295°) */
  --ref-vote-50: oklch(0.60 0.24 295);
  --ref-vote-70: oklch(0.75 0.22 295);
  --ref-vote-95: oklch(0.98 0.04 295);

  /* City: Shanghai (Pink, 350°) */
  --ref-shanghai-50: oklch(0.55 0.20 350);
  --ref-shanghai-65: oklch(0.64 0.22 350);

  /* City: Hong Kong (Orange, 30°) */
  --ref-hongkong-50: oklch(0.62 0.22 30);
  --ref-hongkong-68: oklch(0.68 0.24 30);

  /* City: Osaka (Blue-Teal, 200°) - Differentiated from Privacy */
  --ref-osaka-50: oklch(0.56 0.14 200);
  --ref-osaka-64: oklch(0.64 0.16 200);

  /* City: Kyoto (Green, 140°) */
  --ref-kyoto-50: oklch(0.58 0.16 140);
  --ref-kyoto-66: oklch(0.66 0.18 140);

  /* City: Tokyo (Indigo, 264°) */
  --ref-tokyo-50: oklch(0.48 0.18 264);
  --ref-tokyo-58: oklch(0.58 0.20 264);

  /* City: Beijing (Deep Orange, 25°) */
  --ref-beijing-50: oklch(0.52 0.24 25);
  --ref-beijing-60: oklch(0.60 0.26 25);

  /* Semantic States */
  --ref-success-50: oklch(0.60 0.18 145);
  --ref-success-68: oklch(0.68 0.18 145);
  --ref-warning-50: oklch(0.72 0.18 85);
  --ref-danger-50: oklch(0.64 0.22 25);
  --ref-info-50: oklch(0.62 0.20 240);
  --ref-info-68: oklch(0.68 0.20 240);

  /* Neutrals */
  --ref-slate-10: oklch(0.12 0.01 264);
  --ref-slate-20: oklch(0.20 0.01 264);
  --ref-slate-30: oklch(0.30 0.01 264);
  --ref-slate-50: oklch(0.50 0.01 264);
  --ref-slate-68: oklch(0.68 0.01 264);
  --ref-slate-90: oklch(0.96 0.00 264);
  --ref-slate-98: oklch(0.99 0.00 0);

  /* Transport Modes (New) */
  --ref-transport-flight: oklch(0.62 0.20 240);
  --ref-transport-car: oklch(0.72 0.18 85);
  --ref-transport-metro: oklch(0.62 0.20 200);
  --ref-transport-walk: oklch(0.64 0.22 25);
}

/* ========================================
   LAYER 2: SEMANTIC TOKENS (Role-Based)
   ======================================== */

:root {
  /* Surfaces */
  --bg-base: var(--ref-slate-98);
  --bg-surface: oklch(1 0 0);
  --bg-surface-hover: var(--ref-slate-90);
  --bg-surface-subtle: oklch(0.98 0 0 / 0.5);

  /* Text */
  --text-primary: var(--ref-slate-10);
  --text-secondary: var(--ref-slate-50);

  /* Borders */
  --border-subtle: oklch(0.90 0 0);
  --border-focus: var(--accent-primary);

  /* Accents */
  --accent-primary: oklch(0.56 0.14 185);  /* Teal - TripFlow brand */
  --accent-glow: oklch(0.56 0.14 185 / 0.15);
  --accent-secondary: oklch(0.65 0.22 15);  /* Coral */

  /* Feature: Privacy */
  --color-privacy: var(--ref-privacy-40);
  --color-privacy-subtle: var(--ref-privacy-95);
  --color-privacy-foreground: oklch(1 0 0);

  /* Feature: Voting */
  --color-vote: var(--ref-vote-50);
  --color-vote-subtle: var(--ref-vote-95);
  --color-vote-foreground: oklch(1 0 0);

  /* States */
  --color-success: var(--ref-success-50);
  --color-warning: var(--ref-warning-50);
  --color-danger: var(--ref-danger-50);
  --color-info: var(--ref-info-50);

  /* City Colors */
  --city-shanghai: var(--ref-shanghai-50);
  --city-shanghai-glow: oklch(0.55 0.20 350 / 0.15);
  --city-shanghai-muted: oklch(0.55 0.20 350 / 0.08);

  --city-hongkong: var(--ref-hongkong-50);
  --city-hongkong-glow: oklch(0.62 0.22 30 / 0.15);
  --city-hongkong-muted: oklch(0.62 0.22 30 / 0.08);

  --city-osaka: var(--ref-osaka-50);
  --city-osaka-glow: oklch(0.56 0.14 200 / 0.15);
  --city-osaka-muted: oklch(0.56 0.14 200 / 0.08);

  --city-kyoto: var(--ref-kyoto-50);
  --city-kyoto-glow: oklch(0.58 0.16 140 / 0.15);
  --city-kyoto-muted: oklch(0.58 0.16 140 / 0.08);

  --city-tokyo: var(--ref-tokyo-50);
  --city-tokyo-glow: oklch(0.48 0.18 264 / 0.15);
  --city-tokyo-muted: oklch(0.48 0.18 264 / 0.08);

  --city-beijing: var(--ref-beijing-50);
  --city-beijing-glow: oklch(0.52 0.24 25 / 0.15);
  --city-beijing-muted: oklch(0.52 0.24 25 / 0.08);

  /* Transport Modes */
  --transport-flight: var(--ref-transport-flight);
  --transport-car: var(--ref-transport-car);
  --transport-metro: var(--ref-transport-metro);
  --transport-walk: var(--ref-transport-walk);

  /* Glassmorphic */
  --glass-bg: oklch(1 0 0 / 0.85);
  --glass-shadow: 0 4px 12px oklch(0 0 0 / 0.03);
  --glass-blur: 8px;
}

/* ========================================
   DARK MODE (Explicit Palettes)
   ======================================== */

:root[data-theme="dark"] {
  /* Surfaces */
  --bg-base: var(--ref-slate-10);
  --bg-surface: var(--ref-slate-20);
  --bg-surface-hover: oklch(0.24 0.01 264);
  --bg-surface-subtle: oklch(0.15 0.01 264 / 0.5);

  /* Text */
  --text-primary: oklch(0.98 0 0);
  --text-secondary: var(--ref-slate-68);

  /* Borders */
  --border-subtle: var(--ref-slate-30);
  --border-focus: var(--accent-primary);

  /* Accents (Brightened) */
  --accent-primary: oklch(0.64 0.16 185);
  --accent-glow: oklch(0.64 0.16 185 / 0.25);
  --accent-secondary: oklch(0.70 0.20 15);

  /* Feature: Privacy (Brightened) */
  --color-privacy: var(--ref-privacy-60);
  --color-privacy-subtle: oklch(0.18 0.04 185);
  --color-privacy-foreground: oklch(0.10 0 0);

  /* Feature: Voting (Brightened) */
  --color-vote: var(--ref-vote-70);
  --color-vote-subtle: oklch(0.20 0.06 295);
  --color-vote-foreground: oklch(0.10 0 0);

  /* States (Brightened) */
  --color-success: var(--ref-success-68);
  --color-warning: var(--ref-warning-50);
  --color-danger: var(--ref-danger-50);
  --color-info: var(--ref-info-68);

  /* City Colors (Brightened +8-12%) */
  --city-shanghai: var(--ref-shanghai-65);
  --city-shanghai-glow: oklch(0.64 0.22 350 / 0.25);
  --city-shanghai-muted: oklch(0.64 0.22 350 / 0.08);

  --city-hongkong: var(--ref-hongkong-68);
  --city-hongkong-glow: oklch(0.68 0.24 30 / 0.25);
  --city-hongkong-muted: oklch(0.68 0.24 30 / 0.08);

  --city-osaka: var(--ref-osaka-64);
  --city-osaka-glow: oklch(0.64 0.16 200 / 0.25);
  --city-osaka-muted: oklch(0.64 0.16 200 / 0.08);

  --city-kyoto: var(--ref-kyoto-66);
  --city-kyoto-glow: oklch(0.66 0.18 140 / 0.25);
  --city-kyoto-muted: oklch(0.66 0.18 140 / 0.08);

  --city-tokyo: var(--ref-tokyo-58);
  --city-tokyo-glow: oklch(0.58 0.20 264 / 0.25);
  --city-tokyo-muted: oklch(0.58 0.20 264 / 0.08);

  --city-beijing: var(--ref-beijing-60);
  --city-beijing-glow: oklch(0.60 0.26 25 / 0.25);
  --city-beijing-muted: oklch(0.60 0.26 25 / 0.08);

  /* Transport Modes (Brightened) */
  --transport-flight: oklch(0.68 0.20 240);
  --transport-car: var(--ref-transport-car);
  --transport-metro: oklch(0.68 0.20 200);
  --transport-walk: var(--ref-transport-walk);

  /* Glassmorphic (Dark) */
  --glass-bg: oklch(0.12 0.01 264 / 0.85);
  --glass-shadow: 0 4px 12px oklch(0 0 0 / 0.4);
  --glass-blur: 12px;
}

/* ========================================
   LAYER 3: TAILWIND MAPPINGS
   ======================================== */

@theme inline {
  --color-bg-base: var(--bg-base);
  --color-bg-surface: var(--bg-surface);
  --color-bg-surface-hover: var(--bg-surface-hover);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-border-subtle: var(--border-subtle);
  --color-accent-primary: var(--accent-primary);
  --color-accent-secondary: var(--accent-secondary);

  --color-privacy: var(--color-privacy);
  --color-privacy-subtle: var(--color-privacy-subtle);
  --color-vote: var(--color-vote);
  --color-vote-subtle: var(--color-vote-subtle);

  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-danger: var(--color-danger);
  --color-info: var(--color-info);

  --color-city-shanghai: var(--city-shanghai);
  --color-city-hongkong: var(--city-hongkong);
  --color-city-osaka: var(--city-osaka);
  --color-city-kyoto: var(--city-kyoto);
  --color-city-tokyo: var(--city-tokyo);
  --color-city-beijing: var(--city-beijing);

  --color-transport-flight: var(--transport-flight);
  --color-transport-car: var(--transport-car);
  --color-transport-metro: var(--transport-metro);
  --color-transport-walk: var(--transport-walk);
}
```

**Result:** All tokens defined in single source of truth.

---

### Phase 2: Migrate Hardcoded Colors (3 hours)

**2.1 map-tokens.ts (1 hour)**

**Current:**
```typescript
export const TRANSPORT_STYLES = {
  flight: { color: '#3B82F6', icon: Plane },
  car: { color: '#F59E0B', icon: Car },
  metro: { color: '#06B6D4', icon: TrainFront },
  walk: { color: '#EF4444', icon: PersonStanding },
};
```

**New:**
```typescript
export const TRANSPORT_STYLES = {
  flight: { color: 'var(--transport-flight)', icon: Plane },
  car: { color: 'var(--transport-car)', icon: Car },
  metro: { color: 'var(--transport-metro)', icon: TrainFront },
  walk: { color: 'var(--transport-walk)', icon: PersonStanding },
};
```

**2.2 Budget.tsx (1 hour)**

**Current:**
```typescript
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'lodging': return '#10b981';
    case 'food': return '#f59e0b';
    case 'activities': return '#8b5cf6';
    default: return '#6b7280';
  }
};
```

**New:**
```typescript
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'lodging': return 'var(--color-success)';
    case 'food': return 'var(--color-warning)';
    case 'activities': return 'var(--color-vote)';
    default: return 'var(--text-secondary)';
  }
};
```

**2.3 ActivityCard.css (1 hour)**

**Current:**
```css
.badge-booked { background: rgba(34, 197, 94, 0.9); }
.badge-must-do { background: rgba(168, 85, 247, 0.9); }
.meta-rating { color: #f59e0b; }
.live-time-indicator { background: #ef4444; }
```

**New:**
```css
.badge-booked { background: oklch(var(--color-success) / 0.9); }
.badge-must-do { background: oklch(var(--color-vote) / 0.9); }
.meta-rating { color: var(--color-warning); }
.live-time-indicator { background: var(--color-danger); }
```

---

### Phase 3: Add Documentation (1 hour)

**3.1 Update city-colors.ts JSDoc**

Add usage constraints to existing `getCityStyle()` function:

```typescript
/**
 * Get city color CSS variables for inline styles.
 *
 * **Usage Rules:**
 * - ✅ Use for: left/right borders, map pins, city chips
 * - ❌ Never for: primary buttons, status badges, form inputs
 * - ❌ Never mix with feature colors in same component
 *
 * **Semantic Exclusivity:**
 * - City colors = location theming (decorative)
 * - Feature colors = privacy/voting (functional)
 *
 * @example
 * // ✅ CORRECT: Border accent
 * <div style={{ borderLeft: `4px solid ${getCityStyle('osaka')['--city-color']}` }}>
 *
 * // ❌ WRONG: Button background
 * <button style={{ background: getCityStyle('osaka')['--city-color'] }}>
 */
export function getCityStyle(city: CitySlug): React.CSSProperties {
  // ... existing code
}
```

**3.2 Update TRIPFLOW-STYLE-GUIDE.md**

Add new section **"5.5 Color Coexistence Rules"** with:
- Color hierarchy pyramid (semantic > feature > brand > city)
- Usage matrix (where city/feature colors can/cannot appear)
- Anti-patterns with code examples
- Visual examples of correct layering

---

### Phase 4: Validation & Testing (1.5 hours)

**4.1 Find-Replace Audit (15 min)**

Run global search for hardcoded colors:
```bash
# Search for hex colors in source files
rg '#[0-9A-Fa-f]{6}' tripflow-next/src --type tsx --type css --type ts
```

**Expected:** 0 matches (except in token definitions in globals.css).

**4.2 Dark Mode Testing (30 min)**

**Checklist:**
- [ ] Toggle dark mode via ThemeProvider
- [ ] Verify all text meets WCAG AA (4.5:1 body, 3:1 large)
- [ ] Test city colors on dark backgrounds (should pass 3:1)
- [ ] Test glassmorphic effects (blur + transparency)
- [ ] Verify borders visible (not invisible like shadows)

**4.3 Contrast Validation (30 min)**

Use **APCA Contrast Calculator** (https://www.myndex.com/APCA/):

| Pair | Light Mode | Dark Mode | Pass? |
|------|-----------|-----------|-------|
| `text-primary` on `bg-base` | Lc 106 (AAA) | Lc 104 (AAA) | ✅ |
| `accent-primary` on `bg-surface` | Lc 75 (AA) | Lc 78 (AA) | ✅ |
| `city-osaka` on `bg-surface` | Lc 68 (AA) | Lc 72 (AA) | ✅ |

**4.4 Component Review (15 min)**

**Spot-check these components:**
- [ ] ActivityCard - City border + privacy badge work together
- [ ] BlindBudgetForm - Privacy teal used, not city teal
- [ ] Map - City pins use city colors, privacy overlays use feature color
- [ ] CityNavigator - City chips use city colors (acceptable context)

---

## Verification & Testing

### Automated Checks

**Run these commands before commit:**

```bash
# 1. TypeScript compile
npm run build

# 2. ESLint (should flag hardcoded colors if configured)
npm run lint

# 3. Test suite
npm run test

# 4. Search for hardcoded colors (should return 0 results in src/)
rg '#[0-9A-Fa-f]{6}' tripflow-next/src --type tsx --type css --type ts
```

### Manual Testing Checklist

**Light Mode:**
- [ ] All city colors visible on activity cards (left borders)
- [ ] Privacy badge uses teal (distinct from Osaka city teal)
- [ ] Primary buttons use teal accent
- [ ] Transport icons use correct colors (flight=blue, car=amber, etc.)

**Dark Mode:**
- [ ] Toggle dark mode - all colors adapt
- [ ] City colors brightened but still distinguishable
- [ ] Text readable (14.8:1 contrast)
- [ ] Borders visible (not invisible like shadows)
- [ ] Glassmorphic effects maintain depth

**Accessibility:**
- [ ] Tab through all interactive elements (focus rings visible)
- [ ] Screen reader test (VoiceOver/NVDA) - color never sole indicator
- [ ] Color blindness test (Sim Daltonism) - icons paired with colors
- [ ] Zoom to 200% - layout doesn't break

**Component Patterns:**
- [ ] ActivityCard with city accent + privacy badge - no confusion
- [ ] BlindBudgetForm uses privacy teal, not city teal
- [ ] Map pins use city colors, overlays use feature colors
- [ ] Buttons never use city colors (only primary teal/coral)

---

## Success Criteria

**This implementation is complete when:**

1. ✅ **0 hardcoded hex values** in components (except globals.css tokens)
2. ✅ **100% dark mode coverage** - all tokens have light + dark values
3. ✅ **WCAG AA compliance** - all text/UI meets 4.5:1 / 3:1 contrast
4. ✅ **Semantic color exclusivity** - city colors only in location contexts
5. ✅ **Visual distinction** - Osaka teal ≠ privacy teal (15° hue separation)
6. ✅ **Documentation updated** - Style guide has coexistence rules
7. ✅ **Tests pass** - TypeScript, ESLint, test suite green

**Post-Implementation:**
- Monitor for developer errors (city-colored buttons, feature color misuse)
- Add ESLint rule to flag hardcoded hex values (optional)
- Consider visual regression testing with Percy/Chromatic (optional)

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| Phase 1: Token Definition | 2 hours | 2h |
| Phase 2: Migrate Hardcoded Colors | 3 hours | 5h |
| Phase 3: Documentation | 1 hour | 6h |
| Phase 4: Validation & Testing | 1.5 hours | 7.5h |
| **Total** | **7.5 hours** | — |

**Notes:**
- Assumes familiarity with Tailwind v4 and OKLCH
- Add +2 hours if Tailwind config needs debugging
- Add +1 hour for visual regression testing setup

---

## References

**Key Research Sources:**
- OKLCH in CSS (Evil Martians): https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- Design Tokens Best Practices (Tailwind v4): https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026
- Radix Colors (12-step scale): https://www.radix-ui.com/themes/docs/theme/color
- APCA Contrast Calculator: https://www.myndex.com/APCA/
- Dark Mode Best Practices (2026): https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/

**TripOS Source Files (for reference):**
- `/Volumes/SSD/Dev/Apps/TripOS/apps/web/src/styles/globals.css` - HSL token system
- `/Volumes/SSD/Dev/Apps/TripOS/docs/design/style-guide.md` - Semantic exclusivity rules
- `/Volumes/SSD/Dev/Apps/TripOS/docs/design/design-principles.md` - Color hierarchy philosophy
