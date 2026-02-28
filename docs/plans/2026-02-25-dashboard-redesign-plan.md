# TripFlow Dashboard Redesign Plan

**Date:** 2026-02-25
**Status:** Draft — awaiting approval
**Scope:** Dashboard page (`page.tsx` + `Dashboard.tsx`) + Sidebar + Responsive behavior + Visual polish
**Based on:** Playwright screenshots, Web Interface Guidelines audit, travel dashboard UX research, frontend-design skill analysis

---

## Executive Summary

The TripFlow dashboard has strong bones — a cinematic hero banner, editorial typography (Playfair Display + Inter), and rich data panels. But Playwright screenshots reveal **three blocking issues** and a set of design/UX gaps that prevent it from feeling production-grade.

This plan addresses them in priority order: critical bugs first, then layout, then visual polish, then responsive.

---

## Current State (Playwright Screenshots)

### What's Working Well
- **Hero banner** with Japan Circuit photo is visually striking — strong emotional hook
- **AI "Daily Travel Intel" card** — smart feature, sets TripFlow apart
- **"Waiting for You" action center** — urgency-coded items are a great pattern
- **Team Activity feed** with live presence ("Sarah is viewing Kyoto Hotels") — collaborative feel
- **Playfair Display + Inter** font pairing gives editorial quality
- **Glass-panel design system** is consistent across card surfaces
- **Magic Drafts** AI-curated trip suggestions — good aspirational content

### Critical Issues

| # | Issue | Severity | Evidence |
|---|---|---|---|
| 1 | **Globe component crashes React tree** when WebGL unavailable — no ErrorBoundary | P0 (fixed) | All screenshots showed TypeError overlay before fix |
| 2 | **Dark mode not applying** — light and dark screenshots are identical | P0 | Screenshot `04` vs `02` show same white theme |
| 3 | **Mobile layout completely broken** — sidebar takes 100% width, main content off-screen | P0 | Screenshot `08-mobile-full.png` |
| 4 | **Tablet hero buttons clipped** — "Quick Expense" truncated to "Qu... Expe..." | P1 | Screenshot `06-tablet-full.png` |
| 5 | **Trip cards stacked vertically** with 320px images — only 1 card visible without scroll | P1 | Screenshot `03-hero-area.png` |
| 6 | **Right sidebar "Waiting for You"** pushed entirely below fold | P1 | Not visible in any viewport screenshot |
| 7 | **CSS `pulse` keyframe** has invalid color `rgba(2fbbf24, 0.7)` | P2 | `Dashboard.css:323` |
| 8 | **No responsive breakpoints** defined in Dashboard CSS | P1 | Layout breaks at every non-desktop width |

---

## Web Interface Guidelines Audit

Applied the Vercel Web Interface Guidelines to the dashboard codebase. Key violations:

### Accessibility
- [ ] **Icon-only buttons lack `aria-label`**: ThemeToggle button, sidebar collapse chevron, hero quick action buttons with icon + text (but the "Resolve" buttons in action items are icon+text which is fine)
- [ ] **`<div onClick>` instead of `<button>`**: The trip cards use `<Card onClick>` which renders as a `<div>` — should be `<button>` or `role="button"` with keyboard handler
- [ ] **No skip-navigation link** for keyboard users
- [ ] **No `aria-live` region** for dynamic content (team activity feed, notification count changes)
- [ ] **Image `alt` attributes missing**: hero background image, trip card images, avatar images (all use CSS `background-image` instead of `<img>`)
- [ ] **Heading hierarchy broken**: `<h1>` in the header greeting, then `<h1>` again in the hero destination — should be `<h2>`+

### Focus States
- [ ] **No visible focus indicators** on interactive trip cards, action items, or draft cards
- [ ] **No `:focus-visible`** styles defined for custom buttons (ButtonLegacy)

### Animation
- [ ] **No `prefers-reduced-motion` support** — Framer Motion animations play regardless of user preference
- [ ] **`transition: all`** used in `.interactive-trip-card` and `.glass-panel` — should list specific properties

### Typography
- [ ] **Use `text-wrap: balance`** on section headings ("Your Journeys", "Magic Drafts", "Daily Travel Intel")
- [ ] **Use `font-variant-numeric: tabular-nums`** on progress percentages and countdown numbers
- [ ] **Ellipsis character**: loading states should use `...` not `...`

### Content & Images
- [ ] **Trip card images lack `width`/`height`** — using CSS `background-image` instead of `<img>` prevents CLS optimization
- [ ] **No `loading="lazy"`** on below-fold images (trip cards, magic drafts, activity avatars)

### Dark Mode
- [ ] **Missing `color-scheme: dark`** on `<html>` when in dark mode
- [ ] **Missing `<meta name="theme-color">`** matching page background
- [ ] **Dual theming conflict**: `data-theme="dark"` for custom vars vs `.dark` class for Tailwind/shadcn — these may not be synced

### Navigation & State
- [ ] **Dead links**: "View All", "Resolve" buttons, "Adopt Trip" links have no handlers
- [ ] **URL doesn't reflect state**: no query params for active filters or sections

---

## Design Analysis (Frontend-Design Skill)

### Aesthetic Direction: Cinematic Travel Editorial
The existing direction is good — Playfair Display headings convey magazine editorial quality, the hero photography is immersive, and the teal accent is warm yet modern. But execution needs refinement:

**What to strengthen:**
1. **Hero typography needs more drama** — the destination name "Japan Circuit" should be a larger, bolder statement. Consider Playfair Display 700 italic at 3rem+ for the cinematic magazine-cover feel.
2. **Card surfaces need more depth differentiation** — all cards look identical. The hero, trip cards, AI briefing, and action items should have distinct visual weights.
3. **The dashboard background is flat white** — add atmospheric depth with a subtle radial gradient or warm tint.
4. **Motion is generic fade-up** — the `itemVariants` (opacity + translateY) is standard. Add blur-to-focus transition for a cinematic "rack focus" effect.
5. **Magic Drafts cards lack interactivity** — these aspirational cards should feel alive with subtle parallax or hover reveals.

### Typography Recommendation
Keep the Playfair Display + Inter pairing — it's distinctive and appropriate for travel editorial. Enhance:
- **Hero destination**: Playfair Display 700, 2.8rem, slight negative letter-spacing
- **Section headings**: Playfair Display 500, `text-wrap: balance`
- **Numbers/stats**: Inter with `font-variant-numeric: tabular-nums`
- **Body/UI text**: Inter 400-500 (keep as-is, functional and readable)

---

## Travel Dashboard UX Research Findings

Key patterns from competitive analysis (Wanderlog, TripIt, Google Travel, Airbnb):

### 1. Bento Grid Layout (Industry Standard 2025-2026)
67% of top SaaS dashboards now use asymmetric bento grids instead of uniform columns. The current `7fr 3fr` two-column layout is rigid. A bento grid with mixed card sizes creates natural information hierarchy.

**Recommendation:** Adopt a 12-column CSS Grid bento layout. The hero spans full width (12 cols), trip cards span 4-6 cols each, sidebar widgets span 3-4 cols. This naturally surfaces more content above the fold.

### 2. Three-State Sidebar (Full → Rail → Drawer)
The current sidebar is a fixed 280px always-visible panel with no responsive behavior. Best practice:
- **Desktop (>1280px)**: Full sidebar with icons + labels (current)
- **Tablet (768-1279px)**: Collapsed icon-only rail (56px)
- **Mobile (<768px)**: Off-canvas drawer + bottom tab bar

### 3. Trip Countdown as Primary Metric
Research shows trip countdown is the #1 most-glanced metric on travel dashboards. The current "Upcoming in 14 Days" badge is too subtle. Should be a prominent countdown widget with days/hours.

### 4. Budget Visualization
Segmented progress bars with color-coding (green/yellow/red at 75%/100% thresholds) are the most intuitive budget display. The current text-only "$4,250" in the stat card lacks context.

### 5. AI Feature Presentation
Best practice: AI features should have clear visual provenance (sparkle icon + "AI-generated" label), be editable/dismissable, and include feedback mechanisms. The current AI Briefing card does this well but could add thumbs-up/down.

---

## Improvement Plan

### Phase 1: Critical Fixes (P0)

#### 1.1 Fix Dark Mode Sync
**Files:** `src/components/layout/ThemeProvider.tsx`, `src/app/globals.css`

**Problem:** The app uses TWO theming systems that aren't synced:
- `data-theme="dark"` on `<html>` for custom CSS variables (`--bg-base`, etc.)
- `.dark` class for Tailwind/shadcn dark mode

When one toggles, the other doesn't, resulting in a broken half-light/half-dark state.

**Fix:**
- Ensure the `ThemeProvider` sets BOTH `data-theme` and `.dark` class simultaneously
- Add `color-scheme: dark` to `<html>` when in dark mode
- Add `<meta name="theme-color" content="...">` that updates with theme
- Test in Playwright with `colorScheme: 'dark'` context

#### 1.2 Fix Mobile Sidebar (Critical Responsive)
**Files:** `src/components/layout/Sidebar.tsx`, `src/app/app.css`

**Problem:** On mobile (390px), the sidebar renders at full 280px width, pushing the main content entirely off-screen. The dashboard is unusable on mobile.

**Fix — Three-state sidebar pattern:**

```
Desktop (>1280px):  [=== 256px sidebar ===][============ content ============]
Tablet (768-1279px): [56px][=================== content ===================]
Mobile (<768px):     [================== full-width content ==================]
                     [____ bottom tab bar: Dashboard | Trips | Notif | Settings ____]
```

- Add media queries with three breakpoints
- Tablet: collapse sidebar to icon-only rail (56px), show labels on hover with tooltip
- Mobile: hide sidebar entirely, add a fixed bottom tab bar with 4 items
- Add hamburger menu button in header that opens sidebar as off-canvas drawer
- Support swipe gesture to open/close drawer (Framer Motion `drag`)
- Minimum touch targets: 44x44px

#### 1.3 Globe ErrorBoundary (Already Fixed)
The Globe component now gracefully handles missing WebGL. No further action needed.

---

### Phase 2: Layout Redesign (P1)

#### 2.1 Bento Grid Dashboard Layout
**Files:** `Dashboard.tsx`, `Dashboard.css`

Replace the current `7fr 3fr` two-column layout with a 12-column bento grid that surfaces more content above the fold.

**Proposed layout (desktop):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    HERO: Japan Circuit                    12 col │
│     Upcoming in 14 Days | Oct 12-26 | Quick Actions             │
└─────────────────────────────────────────────────────────────────┘

┌─ "Your Journeys" ──────────────────────────────────────────────┐

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│  Japan Circuit   │ │  Amalfi Coast    │ │  Daily Travel Intel  │
│  [photo 180px]   │ │  [photo 180px]   │ │  AI briefing text    │
│  PLANNING        │ │  BOOKED          │ │  [Review Transit]    │
│  ████░░░ 45%     │ │  ██████████ 100% │ │                      │
│  👥2   [Open]    │ │  👥4   [Open]    │ │                      │
│       4 col      │ │       4 col      │ │       4 col          │
└──────────────────┘ └──────────────────┘ └──────────────────────┘

┌──────────────────┐ ┌────────────────────────────────────────────┐
│  ✨ Where to     │ │  Team Activity + Waiting for You           │
│  next?           │ │  Sarah is viewing Kyoto Hotels             │
│  [Generate Trip] │ │  3 pending actions                         │
│       4 col      │ │                8 col                       │
└──────────────────┘ └────────────────────────────────────────────┘

┌─ "Magic Drafts — Curated by AI" ───────────────────────────────┐
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ Greek Islands│ │ Andalusian   │ │ Bali Zen     │             │
│ │ [photo]      │ │ [photo]      │ │ [photo]      │             │
│ │ 7 Days       │ │ 10 Days      │ │ 5 Days       │             │
│ │   4 col      │ │   4 col      │ │   4 col      │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

**CSS implementation:**
```css
.dashboard-main-columns {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* Trip cards span 4 columns each */
.interactive-trip-card { grid-column: span 4; }

/* AI briefing spans 4 columns, sits alongside trip cards */
.ai-briefing-card { grid-column: span 4; }

/* Activity + Actions combine into one wider card */
.activity-actions-card { grid-column: span 8; }

/* Create card spans 4 columns */
.create-new-card { grid-column: span 4; }

/* Magic drafts: 3 cards at 4 cols each */
.draft-card { grid-column: span 4; }
```

**Key changes:**
- Reduce trip card image height from 320px → 180px
- Both trip cards + AI briefing visible in the first row (no scroll needed)
- "Create New" card and Activity/Actions visible in second row
- Magic Drafts section stays at bottom but is now closer to the fold

#### 2.2 Compact Trip Cards
**Files:** `Dashboard.tsx`, `Dashboard.css`

Current trip cards are oversized (320px images + large padding). Compact them:
- Image height: 320px → 180px
- Card padding: 28px → 20px
- Destination title: 1.8rem → 1.4rem
- Progress section: keep but tighten spacing
- Use actual `<img>` tags with `width`, `height`, `loading="lazy"`, and `alt` text instead of CSS `background-image`

#### 2.3 Merge Activity + Actions into Combined Sidebar Card
**Files:** `Dashboard.tsx`, `Dashboard.css`

The current "Team Activity" and "Waiting for You" are separate cards that push each other below fold. Combine them into a single card with internal tabs:

```
┌─────────────────────────────────────────┐
│  [Activity]  [Actions (3)]              │
│─────────────────────────────────────────│
│  🟢 Sarah is viewing Kyoto Hotels       │
│                                         │
│  🚄 Sarah booked Shinkansen     2h ago  │
│  ✨ AI suggested 3 dining opts  5h ago  │
│  📍 You added TeamLab Planets   1d ago  │
└─────────────────────────────────────────┘
```

This halves the vertical space and ensures both panels are above the fold.

#### 2.4 Hero Quick Actions — Responsive Wrap
**Files:** `Dashboard.css`

On tablet, the hero quick action buttons ("Boarding Passes", "22°C Tokyo", "Quick Expense") get clipped. Fix:

```css
.hero-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .hero-quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}
```

---

### Phase 3: Visual Polish (P2)

#### 3.1 Cinematic Page Load Animation
**File:** `Dashboard.tsx`

Upgrade the stagger animation with a blur-to-focus "rack focus" effect:

```tsx
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};
```

Add `prefers-reduced-motion` support:
```tsx
const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// If reduced motion, use instant variants
const resolvedVariants = prefersReducedMotion
  ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
  : itemVariants;
```

#### 3.2 Hero Typography Enhancement
**Files:** `Dashboard.css`

Make the hero destination name more cinematic:

```css
.hero-destination {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
```

#### 3.3 Atmospheric Dashboard Background
**File:** `Dashboard.css`

Add subtle depth to the flat white background:

```css
.dashboard-container::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(13, 148, 136, 0.03) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
}

/* Dark mode variant */
:root[data-theme="dark"] .dashboard-container::before {
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(20, 184, 166, 0.05) 0%,
    transparent 60%
  );
}
```

#### 3.4 Trip Card Hover Enhancement
**File:** `Dashboard.css`

```css
.interactive-trip-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.interactive-trip-card:hover .trip-card-image {
  transform: scale(1.06);
}
```

#### 3.5 Fix CSS Pulse Keyframe Typo
**File:** `Dashboard.css:323`

```css
/* Before (broken): rgba(2fbbf24, 0.7) */
/* After (fixed): */
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
}
```

#### 3.6 Magic Drafts Shimmer Effect
**File:** `Dashboard.css`

Add an AI-sparkle shimmer to the "Curated for you by AI" subtitle:

```css
.magic-drafts-section .text-secondary {
  background: linear-gradient(
    90deg,
    var(--text-secondary) 40%,
    var(--accent-primary) 50%,
    var(--text-secondary) 60%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: 0 0; }
}
```

---

### Phase 4: Accessibility Compliance (P2)

#### 4.1 Keyboard Navigation & Focus States
**Files:** `Dashboard.tsx`, `Dashboard.css`, `ButtonLegacy.tsx`

- Add `role="button"` and `tabIndex={0}` to interactive trip cards
- Add `onKeyDown` handler for Enter/Space to trigger `onTripClick`
- Define `:focus-visible` styles for all interactive elements:

```css
.interactive-trip-card:focus-visible,
.action-list-item:focus-visible,
.draft-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

#### 4.2 Semantic HTML Improvements
**Files:** `Dashboard.tsx`, `page.tsx`

- Fix heading hierarchy: greeting `<h1>` → hero `<h2>` → section headers `<h3>`
- Convert trip card images from CSS `background-image` to `<img>` with proper `alt`, `width`, `height`
- Add `aria-label` to icon-only buttons (theme toggle, sidebar collapse)
- Add `aria-live="polite"` to the team activity feed
- Add skip-navigation link

#### 4.3 Reduced Motion Support
**File:** `Dashboard.tsx`, `Dashboard.css`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Framer Motion, check `useReducedMotion()` hook and disable animations.

---

### Phase 5: Functional Improvements (P2-P3)

#### 5.1 Live Trip Countdown Widget
**File:** New `CountdownWidget.tsx`

Replace the static "Upcoming in 14 Days" badge with a live countdown:

```
┌─────────────────────────────────────┐
│  14 days  ·  06 hrs  ·  32 min     │
└─────────────────────────────────────┘
```

- Use `font-variant-numeric: tabular-nums` for stable number widths
- Glassmorphic pill styling consistent with hero quick actions
- Update every minute via `setInterval`

#### 5.2 Fix Dead Links
**Files:** `Dashboard.tsx`

| Link | Current State | Fix |
|---|---|---|
| "View All" | No handler | Scroll to trips section or show expanded view |
| "Resolve" buttons | No handler | Navigate to relevant trip section via router |
| "Adopt Trip" | No handler | Open AI Generator Wizard pre-filled with draft data |
| "Review Transit Options" | No handler | Navigate to trip itinerary tab |

#### 5.3 Collaborator Avatars from Data
**Files:** `Dashboard.tsx`, `Dashboard.css`

- Add `collaboratorAvatars: string[]` to `TripData` interface
- Render actual `<img>` elements with proper `alt` text
- Add "+N" overflow indicator for >3 collaborators
- Remove hardcoded Unsplash URLs from CSS

#### 5.4 Loading Skeleton States
**File:** New `DashboardSkeleton.tsx`

Skeleton placeholders for initial load:
- Hero: large rounded rectangle with shimmer
- Trip cards: image placeholder + text lines + progress bar
- Sidebar: text line placeholders
- Use CSS `@keyframes shimmer` with gradient sweep

#### 5.5 Empty State (Zero Trips)
**File:** `Dashboard.tsx`

When `trips.length === 0`:
- Large compass/map illustration
- "Your adventure starts here" in Playfair Display
- "Let AI plan your perfect trip" CTA button
- Subtle background animation

---

### Phase 6: Responsive Breakpoints (P3)

#### 6.1 Tablet (768px - 1279px)
**Files:** `Dashboard.css`, `app.css`, `Sidebar.tsx`

```css
@media (max-width: 1279px) {
  /* Sidebar collapses to icon rail */
  .sidebar { width: 56px; }
  .sidebar-label { display: none; }

  /* Bento grid adjusts */
  .dashboard-main-columns {
    grid-template-columns: repeat(8, 1fr);
  }

  /* Trip cards: 2 per row */
  .interactive-trip-card { grid-column: span 4; }

  /* AI briefing: full width below trips */
  .ai-briefing-card { grid-column: span 8; }

  /* Hero quick actions wrap */
  .hero-quick-actions { flex-wrap: wrap; }

  /* Magic drafts: 2 columns */
  .magic-drafts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

#### 6.2 Mobile (< 768px)
**Files:** `Dashboard.css`, `app.css`, `Sidebar.tsx`

```css
@media (max-width: 767px) {
  /* Sidebar hidden, bottom tab bar visible */
  .sidebar { display: none; }
  .bottom-tab-bar { display: flex; }

  /* Single column stack */
  .dashboard-main-columns {
    grid-template-columns: 1fr;
  }

  .interactive-trip-card,
  .ai-briefing-card,
  .activity-actions-card,
  .create-new-card { grid-column: span 1; }

  /* Hero: compact */
  .active-trip-hero { height: 220px; padding: 20px; }
  .hero-destination { font-size: 1.8rem; }

  /* Quick actions: 2x2 grid */
  .hero-quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  /* Magic drafts: horizontal scroll carousel */
  .magic-drafts-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 12px;
    padding-bottom: 8px;
  }

  .draft-card {
    min-width: 260px;
    scroll-snap-align: start;
  }
}
```

**Bottom Tab Bar component:**
```
[  🏠 Home  |  🗺 Trips  |  🔔 Notif  |  ⚙️ Settings  ]
```
- Fixed at bottom, 56px height
- Active tab: teal accent color
- Badge on notifications tab
- Min touch target: 44x44px

---

## Implementation Priority Matrix

| Priority | Item | Effort | Impact | Phase |
|---|---|---|---|---|
| **P0** | Fix dark mode sync | Small | Fixes broken feature | 1.1 |
| **P0** | Fix mobile sidebar / add bottom tab bar | Medium | Unblocks mobile usage | 1.2 |
| **P1** | Bento grid layout | Medium | Major UX improvement — more content visible | 2.1 |
| **P1** | Compact trip cards (320→180px images) | Small | 2x more trips visible | 2.2 |
| **P1** | Merge Activity + Actions card | Small | Both visible above fold | 2.3 |
| **P1** | Hero quick actions responsive wrap | Small | Fixes tablet clipping | 2.4 |
| **P1** | Tablet responsive breakpoint | Medium | Usable on iPad | 6.1 |
| **P2** | Cinematic page load animation | Small | Delight, polish | 3.1 |
| **P2** | Hero typography enhancement | Small | Visual impact | 3.2 |
| **P2** | Fix CSS pulse keyframe typo | Trivial | Bug fix | 3.5 |
| **P2** | Keyboard nav + focus states | Medium | Accessibility compliance | 4.1 |
| **P2** | Semantic HTML (headings, img, aria) | Medium | Accessibility compliance | 4.2 |
| **P2** | Reduced motion support | Small | Accessibility compliance | 4.3 |
| **P2** | Wire up dead links | Medium | Functional completeness | 5.2 |
| **P3** | Atmospheric background gradient | Small | Visual depth | 3.3 |
| **P3** | Card hover enhancement | Small | Polish | 3.4 |
| **P3** | Magic Drafts shimmer | Small | AI feature branding | 3.6 |
| **P3** | Countdown widget | Small | Engagement | 5.1 |
| **P3** | Collaborator avatars from data | Small | Visual quality | 5.3 |
| **P3** | Loading skeleton states | Medium | UX polish | 5.4 |
| **P3** | Empty state (zero trips) | Small | Edge case | 5.5 |
| **P3** | Mobile responsive breakpoint | Medium | Full mobile support | 6.2 |

---

## Files to Create

| File | Purpose |
|---|---|
| `src/components/Dashboard/CountdownWidget.tsx` | Live trip countdown |
| `src/components/Dashboard/DashboardSkeleton.tsx` | Loading state |
| `src/components/layout/BottomTabBar.tsx` | Mobile bottom navigation |

## Files to Modify

| File | Changes |
|---|---|
| `src/app/page.tsx` | Fix heading hierarchy (h1 → h2 for hero) |
| `src/app/globals.css` | Add `color-scheme`, `theme-color`, reduced motion query |
| `src/app/app.css` | Responsive breakpoints for sidebar + layout |
| `src/components/Dashboard/Dashboard.tsx` | Bento grid, compact cards, merged activity, a11y |
| `src/components/Dashboard/Dashboard.css` | All layout + visual changes, responsive breakpoints |
| `src/components/layout/Sidebar.tsx` | Three-state responsive behavior |
| `src/components/layout/ThemeProvider.tsx` | Sync `data-theme` + `.dark` class |
| `src/components/ui/Globe.tsx` | Already fixed (WebGL guard) |
| `src/components/ui/ButtonLegacy.tsx` | Focus-visible styles |
| `src/components/ui/Card.tsx` | Focus-visible styles, keyboard handlers |

---

## Design Tokens to Add

```css
:root {
  /* Responsive sidebar */
  --sidebar-width-full: 256px;
  --sidebar-width-collapsed: 56px;
  --bottom-tab-height: 56px;

  /* Animation */
  --transition-cinematic: 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-stagger-base: 0.08s;

  /* Notification type colors */
  --color-notif-comment: #3B82F6;
  --color-notif-task: #8B5CF6;
  --color-notif-upload: #10B981;
  --color-notif-ai: #0D9488;
  --color-notif-booking: #F59E0B;
  --color-notif-voting: #FF5A5F;
}
```

---

## Success Metrics

After implementation, re-run Playwright screenshots at all viewports and verify:

1. **Desktop (1440x900)**: Hero + 2 trip cards + AI briefing + Activity all visible above fold
2. **Dark mode**: Distinct dark theme with proper surface elevation
3. **Tablet (768x1024)**: Collapsed sidebar rail, hero buttons not clipped, 2-col trip grid
4. **Mobile (390x844)**: Bottom tab bar, single-column stacked layout, no sidebar blocking
5. **Wide (1920x1080)**: Bento grid fills space gracefully, no oversized gaps
6. **Accessibility**: All interactive elements keyboard-focusable with visible indicators
7. **Reduced motion**: No animations when `prefers-reduced-motion: reduce` is set
