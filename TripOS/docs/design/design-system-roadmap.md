# Design System Implementation Roadmap

**Created**: February 10, 2026
**Status**: Future Reference (Not Yet Implemented)
**Purpose**: Consolidated roadmap of design system improvements to implement before Phase 1 development begins

---

## Overview

This document consolidates design system improvements identified from:
1. **Airbnb Design System Comparison** ([airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md))
2. **Icon Strategy** (custom requirement to avoid generic AI-style icons)

**Total Estimated Effort**: 18 hours (Airbnb improvements) + 10-15 hours (icon system) = **28-33 hours (4-5 days)**

**Implementation Timeline**: Before Phase 1 development begins (after database schema design is complete)

---

## Phase 1: Quick Wins (2 hours)

**Priority**: High Impact, Low Effort
**Status**: Not Started

### 1.1 Add Motion Design Tokens

**What**: Define CSS variables for animation duration and easing curves.

**Why**: Makes `prefers-reduced-motion` easier to implement globally and ensures consistent animation timing across the app.

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

**Files to Update**:
- `docs/design/style-guide.md` § Motion & Animation

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.2

---

### 1.2 Add Focus State Specifications

**What**: Define explicit focus ring tokens for keyboard navigation.

**Why**: Ensures consistent, visible focus indicators across browsers. Currently documented but not tokenized.

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

**Files to Update**:
- `docs/design/style-guide.md` § Accessibility

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.4

---

### 1.3 Rename Border Radius Tokens

**What**: Rename `--radius` → `--radius-medium` for clarity.

**Why**: Ambiguous token name without size suffix. "radius" alone doesn't indicate it's the medium/default size.

**Implementation**:
- Find-replace `--radius:` → `--radius-medium:` in style-guide.md
- CSS variables handle the update automatically (no component code changes needed)

**Files to Update**:
- `docs/design/style-guide.md` § Border Radius

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §3.3

---

## Phase 2: Medium Priority (6 hours)

**Priority**: Important Improvements, Moderate Effort
**Status**: Not Started

### 2.1 Update Typography Scale

**What**: Increase Display and H1 sizes for better hierarchy.

**Current**:
- Display: 36px / 40px
- H1: 30px / 36px
- H2: 24px / 32px

**New**:
- Display: **48px / 56px** (for landing pages, hero sections)
- H1: **32px / 40px** (for page titles)
- H2: 24px / 32px (unchanged)

**Why**: Current Display (36px) and H1 (30px) are too similar. Larger sizes create clearer visual hierarchy on desktop and align with industry standards (Stripe, Linear, Notion all use 32px+ for H1).

**Implementation**:
- Update Tailwind config: `text-4xl` → 48px, `text-3xl` → 32px
- Update style-guide.md type scale table
- Regenerate wireframes with new scale (or document that wireframes will be updated in Phase 1 development)

**Files to Update**:
- `docs/design/style-guide.md` § Typography
- Tailwind config (when project setup begins)

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §3.1

---

### 2.2 Add Component Size Tokens

**What**: Define unified sizing tokens for buttons, inputs, selects, and touch targets.

**Why**: Current button sizes (`sm: 32px, default: 40px, lg: 48px`) are inconsistent with input heights. A unified token system ensures visual alignment.

**Implementation**:
```css
:root {
  --size-sm: 32px;   /* Small buttons, compact UI */
  --size-md: 40px;   /* Desktop default for buttons/inputs */
  --size-lg: 48px;   /* Mobile-primary touch targets */
  --size-xl: 56px;   /* FABs, high-emphasis mobile CTAs */
}
```

**Usage Rules**:
- Desktop: Use `--size-md` (40px) for all interactive elements
- Mobile: Use `--size-lg` (48px) as the primary size for touch targets
- Reserve `--size-xl` (56px) for FABs and high-emphasis mobile CTAs

**Files to Update**:
- `docs/design/style-guide.md` § Component Patterns

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.5

---

### 2.3 Document 8pt Grid System

**What**: Adopt an 8pt grid system where all measurements (spacing, component dimensions, layout offsets) snap to 8px increments.

**Why**: Creates mathematical harmony, simplifies responsive scaling (8pt → 4pt on mobile), and reduces ambiguity in spacing decisions. Aligns with iOS (8pt) and Material Design (8dp).

**Current**: 4px base unit spacing scale (4, 8, 12, 16, 24, 32, 40, 48, 64).

**New Approach**:
- **Keep 4px for micro-spacing** (icon padding, badge gaps, tight internal spacing)
- **Use 8px as the default minimum** spacing between unrelated elements
- **Enforce 8pt increments** for card padding (16px, 24px), section gaps (32px, 40px), and component heights (40px, 48px, 56px)

**Grid Rules to Document**:
1. All component heights must be multiples of 8px (40px, 48px, 56px, 64px)
2. Card padding uses 16px (mobile) or 24px (desktop)
3. Section gaps use 32px or 40px
4. Page-level spacing uses 48px or 64px
5. Micro-spacing (icon padding, badge offsets) can use 4px

**Files to Update**:
- `docs/design/style-guide.md` § Spacing Scale

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.1

---

## Phase 3: Lower Priority (10 hours)

**Priority**: Nice-to-Have, Higher Effort
**Status**: Not Started

### 3.1 Add Responsive Image Patterns

**What**: Document responsive image guidelines using `<picture>` elements, explicit width/height, lazy loading, and low-quality image placeholders (LQIP).

**Why**: Prevents layout shift (WCAG success criterion), improves perceived performance, and reduces bandwidth on mobile. Critical for trip cover images, member avatars, and activity photos.

**Implementation Guidelines**:

```html
<!-- Trip Cover Image Example -->
<picture>
  <source
    srcset="/images/trips/trip-123-cover-640w.webp 640w,
            /images/trips/trip-123-cover-1280w.webp 1280w,
            /images/trips/trip-123-cover-1920w.webp 1920w"
    type="image/webp"
  />
  <img
    src="/images/trips/trip-123-cover-1280w.jpg"
    alt="Trip to Tokyo: Skyline at sunset"
    width="1280"
    height="720"
    loading="lazy"
    style="background: url('/images/trips/trip-123-cover-lqip.jpg') no-repeat center/cover;"
  />
</picture>
```

**Pattern Rules**:
1. Always include explicit `width` and `height` attributes
2. Use `<picture>` with `srcset` for trip cover images (multiple sizes)
3. Use skeleton placeholders for avatars and cover images during load
4. Lazy-load images below the fold (`loading="lazy"`)
5. Provide LQIP (low-quality image placeholder) as inline background or base64 data URI

**Files to Update**:
- `docs/design/style-guide.md` § Component Patterns (new subsection: Images)

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.3

---

### 3.2 Add Grid Layout Documentation

**What**: Define explicit grid container max-widths, gutter sizes, and responsive column rules.

**Why**: Currently documented loosely without max-width rules or gutter specifications. Airbnb's grid system creates predictable layouts that scale gracefully.

**Current (Loose)**:
- "Sidebar (280px) + Main content (fluid)"
- "Cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`"

**New (Explicit)**:

**Content Max-Widths**:
- **Standard**: 1280px (centered) — for most pages (dashboard, trip detail, voting)
- **Wide**: 1440px (centered) — for data-heavy pages (analytics, expense reports)
- **Full**: 100% — for map views, full-bleed hero sections

**Gutter Sizes**:
- Mobile: 16px
- Tablet: 24px
- Desktop: 40px

**Responsive Card Grid**:
- Mobile (< 640px): 1 column
- Tablet (640px - 1023px): 2 columns
- Desktop (1024px - 1439px): 3 columns
- Large Desktop (1440px+): 4 columns (data-heavy views only)

**Asymmetric Layouts**:
- Desktop: 2/3 main content + 1/3 sidebar (e.g., trip detail + activity feed)
- Mobile: Single column, sidebar collapses to bottom or hidden drawer

**Tailwind Container Classes**:
```css
.container-standard { max-width: 1280px; margin: 0 auto; }
.container-wide { max-width: 1440px; margin: 0 auto; }
.container-full { max-width: 100%; }
```

**Files to Update**:
- `docs/design/style-guide.md` (new section: § Layout & Grid)
- Tailwind config (when project setup begins)

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §2.6

---

### 3.3 Update Shadow System

**What**: Replace Tailwind's default shadows with a more pronounced 4-level shadow scale with clearer use case assignments.

**Why**: Current shadow differences (sm vs base, base vs md) are too subtle. Airbnb's shadow scale has more distinct steps, making elevation more obvious.

**Current (Tailwind Defaults)**:
- `--shadow-sm`: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- `--shadow`: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- `--shadow-md`: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- `--shadow-lg`: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)

**New (Airbnb-Inspired)**:
```css
:root {
  --shadow-1: 0 2px 4px rgba(0,0,0,0.08);   /* Cards at rest */
  --shadow-2: 0 4px 12px rgba(0,0,0,0.12);  /* Hover, dropdowns */
  --shadow-3: 0 8px 24px rgba(0,0,0,0.16);  /* Modals, popovers */
  --shadow-4: 0 16px 48px rgba(0,0,0,0.18); /* Drag states, high elevation */
}

.dark {
  --shadow-1: 0 2px 4px rgba(0,0,0,0.24);   /* Increase opacity in dark mode */
  --shadow-2: 0 4px 12px rgba(0,0,0,0.32);
  --shadow-3: 0 8px 24px rgba(0,0,0,0.40);
  --shadow-4: 0 16px 48px rgba(0,0,0,0.48);
}
```

**Use Case Assignments**:
- **Shadow-1**: Cards at rest (trip cards, activity cards, member cards)
- **Shadow-2**: Hover states, dropdown menus, tooltips
- **Shadow-3**: Modals, popovers, bottom sheets
- **Shadow-4**: Drag-and-drop active state, high-elevation overlays

**Files to Update**:
- `docs/design/style-guide.md` § Shadows & Elevation
- Component migration (gradual, as components are built)

**Reference**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §3.2

---

## Phase 4: Icon Strategy (10-15 hours)

**Priority**: High (Brand Differentiation)
**Status**: Not Started

### 4.1 Avoid Generic AI-Style Icons

**Problem**: Every LLM (ChatGPT, Claude, Gemini) generates similar "AI style" icons — minimalist, rounded, gradient-heavy, soft shadows, overly smooth. These icons lack character and make TripOS look generic.

**Goal**: Source or design icons that are:
1. **Distinctive** — immediately recognizable as TripOS, not "another AI app"
2. **Purposeful** — functional first, decorative second
3. **Consistent** — unified visual language across all icons
4. **Scalable** — work at 16px (UI) and 48px (feature illustrations)

---

### 4.2 Icon System Requirements

**Icon Categories**:

1. **UI Icons** (16px - 24px)
   - Navigation: Home, Trips, Votes, Budget, Profile
   - Actions: Edit, Delete, Share, Invite, Add, Search, Filter
   - Status: Check, X, Warning, Info, Lock, Unlock
   - Social: Avatar placeholders, presence indicators

2. **Feature Icons** (24px - 32px)
   - Blind Budgeting: Lock (teal), Budget Range, Private Badge
   - Voting: Poll types (Yes/No, Ranked Choice, Approval), Vote Status
   - Itinerary: Activities, Map Pin, Timeline, Day Markers

3. **Illustration Icons** (48px - 64px)
   - Empty states: No trips yet, No votes, No activities
   - Onboarding: Welcome, Feature highlights
   - Error states: 404, 500, No connection

---

### 4.3 Icon Style Guidelines

**Visual Characteristics**:
- **Line weight**: 1.5px - 2px (medium weight, not hairline thin)
- **Corner radius**: 1px - 2px on line terminals (subtle, not overly rounded)
- **Style**: Outlined (not filled) for UI icons, selectively filled for feature icons
- **Grid**: 24px icon on 24px grid with 2px padding (20px live area)
- **Alignment**: Optically centered, not mathematically centered

**What to AVOID**:
- ❌ Gradient fills (looks like every AI app)
- ❌ Soft drop shadows (generic, dated)
- ❌ Overly rounded corners (childish, not professional)
- ❌ 3D skeuomorphism (Airbnb's Lava style is interesting but not TripOS)
- ❌ Pictograms that are too literal (a suitcase for "trip" is boring)

**What to EMBRACE**:
- ✅ Clean, crisp outlines with consistent stroke weight
- ✅ Geometric precision with slight optical adjustments
- ✅ Meaningful negative space (icons breathe)
- ✅ Subtle personality (a lock that "clicks shut" animation, not just a static padlock)

---

### 4.4 Icon Sourcing Options

**Option 1: Premium Icon Library (Recommended for MVP)**
- **Heroicons** (https://heroicons.com) — Made by Tailwind Labs, clean outlines, free, MIT license
  - Pros: Consistent with Tailwind, professional, well-tested
  - Cons: Widely used (less unique), limited feature-specific icons
- **Phosphor Icons** (https://phosphoricons.com) — 6 weights, 1,200+ icons, free, MIT license
  - Pros: More personality than Heroicons, good weight variety
  - Cons: Still relatively common
- **Lucide** (https://lucide.dev) — Fork of Feather Icons, 1,000+ icons, free, ISC license
  - Pros: Community-driven, actively maintained, clean style
  - Cons: Similar aesthetic to Heroicons

**Recommendation**: Start with **Phosphor Icons** (Regular weight, 1.5px stroke) for MVP. They have better personality than Heroicons while remaining professional. Supplement with custom icons for feature-specific needs (blind budgeting lock, voting poll types).

**Option 2: Custom Icon Design (Phase 2+)**
- Hire an icon designer on Dribbble or Behance ($500 - $2,000 for 50-100 custom icons)
- Create a unique TripOS icon language that reinforces brand identity
- Time investment: 10-15 hours to brief designer, review iterations, integrate into codebase

---

### 4.5 Feature-Specific Icon Needs

**Blind Budgeting**:
- **Lock icon (teal)**: The canonical privacy indicator
  - Needs to be distinctive, not a generic padlock
  - Should support "clicks shut" animation (see design-principles.md §6.1)
  - Style: Outlined lock with visible keyhole, 2px stroke, teal color (`--privacy`)
- **Budget Range icon**: Represent "group max" without showing individuals
  - Style: Horizontal bar chart with 3-5 anonymous bars (no faces, no labels)
  - Color: Neutral gray, not teal (teal reserved for "private" context)
- **Private badge**: Small tag/label icon
  - Style: Simple rectangle with rounded corners, 12px × 20px
  - Color: `--privacy-subtle` background, `--privacy` foreground

**Voting**:
- **Poll Type icons**: Visual indicators for Yes/No, Ranked Choice, Approval voting
  - Yes/No: Thumbs up/down or checkmark/X (avoid literal thumb icons, too emoji-like)
  - Ranked Choice: Numbered list (1, 2, 3) with drag handle
  - Approval: Multiple checkmarks or multi-select grid
  - Color: Purple (`--vote`) for active/selected state
- **Vote Status icons**: Not Voted, Voted, Poll Closed
  - Not Voted: Empty circle or checkbox outline
  - Voted: Filled checkmark (purple)
  - Poll Closed: Lock or "X" over poll icon
- **Quorum indicator**: Progress toward required vote count
  - Style: Circular progress or horizontal bar (avoid literal "group of people" icon)

**Itinerary**:
- **Activity type icons**: Dining, Sightseeing, Transportation, Lodging, Free Time
  - Dining: Fork and knife (simple, not literal plate)
  - Sightseeing: Compass rose or map pin with star
  - Transportation: Airplane, car, train (outlined, 1.5px stroke)
  - Lodging: Bed or key
  - Free Time: Calendar with blank space (not a literal clock)
- **Map markers**: Custom pin design that reflects TripOS identity
  - Style: Teardrop pin with rounded top, 2px outline
  - Color: Indigo (`--primary`) by default, contextual color for selected

---

### 4.6 Icon Implementation Checklist

**Before Phase 1 Development**:
- [ ] Choose icon library (Phosphor recommended)
- [ ] Download icon set and add to project
- [ ] Create icon component wrapper (React component for consistent sizing/coloring)
- [ ] Document icon usage guidelines in style-guide.md
- [ ] Design custom icons for blind budgeting lock, poll types, vote status
- [ ] Test icons at 16px, 24px, 32px to ensure clarity
- [ ] Verify all icons have `aria-label` when used as standalone buttons
- [ ] Confirm icon colors follow feature semantics (teal for privacy, purple for voting)

**Files to Update**:
- `docs/design/style-guide.md` (new section: § Icons)
- Icon component library (when project setup begins)
- Wireframes (update with final icon choices)

---

## What to KEEP from Current Design System

**From Airbnb Comparison** ([airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §1):

1. ✅ **Dark Mode Implementation** — TripOS has warm dark mode, Airbnb doesn't. Competitive advantage.
2. ✅ **Feature-Specific Color Semantics** — Teal=privacy, Purple=voting. More sophisticated than Airbnb's decorative pink.
3. ✅ **Privacy Visual Language** — Lock icons, persistent labels. Airbnb has nothing comparable.
4. ✅ **Semantic Design Tokens** — HSL-based CSS variables, clear naming. Better than Airbnb's approach.
5. ✅ **Typography Weight Hierarchy** — Clear semantic weights. More accessible than Airbnb's Medium-overuse.

---

## What to AVOID (Airbnb's Mistakes)

**From Airbnb Comparison** ([airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md) §5):

1. ❌ **No Dark Mode** — Airbnb's biggest UX gap. Never skip dark mode.
2. ❌ **Accessibility Gaps in Motion** — Airbnb ignores `prefers-reduced-motion`. Always respect this.
3. ❌ **Inconsistent Icon Usage** — Airbnb mixes icon-only and icon+label inconsistently. Avoid mystery meat navigation.
4. ❌ **Overly Complex Animation System** — Airbnb has 15+ easing curves, 20+ duration values. Stick to 3-5 curves.
5. ❌ **Decorative Color Usage** — Airbnb's pink is decorative and inconsistent. Never use `--privacy` teal or `--vote` purple decoratively.

---

## Implementation Checklist

### Before Phase 1 Development Begins

**Design System Updates**:
- [ ] Phase 1: Quick Wins (2 hours) — Motion tokens, focus specs, radius renaming
- [ ] Phase 2: Medium Priority (6 hours) — Typography scale, component sizes, 8pt grid
- [ ] Phase 3: Lower Priority (10 hours) — Images, grid layout, shadow system
- [ ] Phase 4: Icon Strategy (10-15 hours) — Choose library, design custom icons, document guidelines

**Documentation Updates**:
- [ ] Update `docs/design/style-guide.md` with all new tokens and guidelines
- [ ] Update `docs/design/desktop-wireframe-prompts.md` with new typography scale
- [ ] Update `docs/design/mobile-wireframe-prompts.md` with new typography scale
- [ ] Add icon usage guidelines to style-guide.md
- [ ] Document what we intentionally kept vs. changed from Airbnb comparison

**Verification**:
- [ ] Run through dev-checklist.md to ensure no conflicts with new changes
- [ ] Verify all changes align with design-principles.md philosophy
- [ ] Test dark mode with new shadow/color tokens
- [ ] Confirm all icon sizes work at 16px, 24px, 32px

---

## Timeline Recommendation

**When to Implement**:
- ✅ **Before database schema design** — No dependency
- ✅ **Before first wireframe generation** — Typography scale affects all wireframes
- ✅ **After CLAUDE.md "Next immediate steps" 1-3 complete** — Supabase setup, schema design, RLS policies

**Suggested Order**:
1. Complete Supabase setup (CLAUDE.md step 1)
2. Design database schema v1 (CLAUDE.md step 2)
3. **Implement this design system roadmap** (4-5 days)
4. Write RLS policies (CLAUDE.md step 3)
5. Build proof-of-concept (CLAUDE.md step 4)
6. Design collaboration UX (CLAUDE.md step 5)

---

## Related Documentation

- **Airbnb Comparison Report**: [airbnb-tripos-design-comparison.md](airbnb-tripos-design-comparison.md)
- **Design Principles**: [design-principles.md](design-principles.md)
- **Current Style Guide**: [style-guide.md](style-guide.md)
- **Developer Checklist**: [dev-checklist.md](dev-checklist.md)
- **Project Roadmap**: [CLAUDE.md](../../CLAUDE.md)

---

**Last Updated**: February 10, 2026
**Next Review**: Before Phase 1 development begins (after database schema v1 complete)
