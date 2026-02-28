# Itinerary Page Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the TripFlow itinerary page from a monolithic, mock-only component into a modular, city-centric, visually striking travel timeline with color-coded cities, trip progress, and responsive layout.

**Architecture:** Decompose the 464-line `Itinerary.tsx` into 8+ focused components. Introduce a city color system (6 cities, 6 colors) with CSS variables + Tailwind v4 tokens. Replace the broken Google Maps panel with a useful day summary sidebar. Add city-level navigation above day tabs. Preserve all existing features (drag-and-drop, comments, AI auto-fill, status badges).

**Tech Stack:** Next.js 16 / React 19 / Tailwind CSS v4 / Framer Motion 12 / Lucide React / Radix Dialog / shadcn/ui

---

## Context

The current itinerary page (`src/components/Itinerary/Itinerary.tsx`) is a 464-line monolith with 689 lines of CSS. It has several problems:
- Hardcoded to "Japan Circuit" with only 3 days of mock data
- Google Maps panel occupies 50% of the screen but doesn't work reliably
- No city-level navigation for the 6-city trip
- No trip progress visualization
- Not responsive on mobile
- Component is too large to maintain

The redesign transforms it into a modular, city-aware itinerary that matches the polish level of the Dashboard page, with color-coded cities, a horizontal day navigator, and a useful day summary panel replacing the broken map.

---

## Branch

Create feature branch: `feat/itinerary-redesign` from `feat/dashboard-redesign`

---

## Task 1: City Color System Foundation

**Files:**
- Create: `tripflow-next/src/lib/city-colors.ts`
- Modify: `tripflow-next/src/app/globals.css`

### Step 1: Add city CSS variables to globals.css

Add to `:root` block (after `--border-gradient`):

```css
/* City Color System */
--city-shanghai: #C2185B;
--city-shanghai-glow: rgba(194, 24, 91, 0.15);
--city-shanghai-muted: rgba(194, 24, 91, 0.08);

--city-hongkong: #E65100;
--city-hongkong-glow: rgba(230, 81, 0, 0.15);
--city-hongkong-muted: rgba(230, 81, 0, 0.08);

--city-osaka: #00838F;
--city-osaka-glow: rgba(0, 131, 143, 0.15);
--city-osaka-muted: rgba(0, 131, 143, 0.08);

--city-kyoto: #558B2F;
--city-kyoto-glow: rgba(85, 139, 47, 0.15);
--city-kyoto-muted: rgba(85, 139, 47, 0.08);

--city-tokyo: #283593;
--city-tokyo-glow: rgba(40, 53, 147, 0.15);
--city-tokyo-muted: rgba(40, 53, 147, 0.08);

--city-beijing: #BF360C;
--city-beijing-glow: rgba(191, 54, 12, 0.15);
--city-beijing-muted: rgba(191, 54, 12, 0.08);
```

Add dark mode variants to `:root[data-theme="dark"]` block:

```css
--city-shanghai: #E91E63;
--city-shanghai-glow: rgba(233, 30, 99, 0.20);
--city-hongkong: #FF6D00;
--city-hongkong-glow: rgba(255, 109, 0, 0.20);
--city-osaka: #00ACC1;
--city-osaka-glow: rgba(0, 172, 193, 0.20);
--city-kyoto: #7CB342;
--city-kyoto-glow: rgba(124, 179, 66, 0.20);
--city-tokyo: #3F51B5;
--city-tokyo-glow: rgba(63, 81, 181, 0.20);
--city-beijing: #E64A19;
--city-beijing-glow: rgba(230, 74, 25, 0.20);
```

Add to `@theme` block for Tailwind utility classes:

```css
--color-city-shanghai: var(--city-shanghai);
--color-city-hongkong: var(--city-hongkong);
--color-city-osaka: var(--city-osaka);
--color-city-kyoto: var(--city-kyoto);
--color-city-tokyo: var(--city-tokyo);
--color-city-beijing: var(--city-beijing);
```

### Step 2: Create city-colors.ts

```typescript
// src/lib/city-colors.ts
import { Building2, Ship, Castle, Trees, Zap, Landmark, type LucideIcon } from 'lucide-react';

export type CitySlug = 'shanghai' | 'hongkong' | 'osaka' | 'kyoto' | 'tokyo' | 'beijing';

export interface CityConfig {
  slug: CitySlug;
  name: string;
  nights: number;
  dateRange: string;
  icon: LucideIcon;
  cssVar: string;
  glowVar: string;
}

export const CITY_CONFIGS: Record<CitySlug, CityConfig> = {
  shanghai: { slug: 'shanghai', name: 'Shanghai', nights: 3, dateRange: 'Aug 27-30', icon: Building2, cssVar: '--city-shanghai', glowVar: '--city-shanghai-glow' },
  hongkong: { slug: 'hongkong', name: 'Hong Kong', nights: 3, dateRange: 'Aug 30 - Sep 2', icon: Ship, cssVar: '--city-hongkong', glowVar: '--city-hongkong-glow' },
  osaka: { slug: 'osaka', name: 'Osaka', nights: 3, dateRange: 'Sep 2-5', icon: Castle, cssVar: '--city-osaka', glowVar: '--city-osaka-glow' },
  kyoto: { slug: 'kyoto', name: 'Kyoto', nights: 4, dateRange: 'Sep 5-9', icon: Trees, cssVar: '--city-kyoto', glowVar: '--city-kyoto-glow' },
  tokyo: { slug: 'tokyo', name: 'Tokyo', nights: 6, dateRange: 'Sep 9-15', icon: Zap, cssVar: '--city-tokyo', glowVar: '--city-tokyo-glow' },
  beijing: { slug: 'beijing', name: 'Beijing', nights: 3, dateRange: 'Sep 15-18', icon: Landmark, cssVar: '--city-beijing', glowVar: '--city-beijing-glow' },
};

export const CITY_ORDER: CitySlug[] = ['shanghai', 'hongkong', 'osaka', 'kyoto', 'tokyo', 'beijing'];

export function getCityForDay(dayIndex: number): CitySlug {
  if (dayIndex < 3) return 'shanghai';
  if (dayIndex < 6) return 'hongkong';
  if (dayIndex < 9) return 'osaka';
  if (dayIndex < 13) return 'kyoto';
  if (dayIndex < 19) return 'tokyo';
  return 'beijing';
}

export function getCityStyle(city: CitySlug): React.CSSProperties {
  const config = CITY_CONFIGS[city];
  return {
    '--city-color': `var(${config.cssVar})`,
    '--city-glow': `var(${config.glowVar})`,
  } as React.CSSProperties;
}
```

### Step 3: Commit

```bash
git add src/lib/city-colors.ts src/app/globals.css
git commit -m "feat(itinerary): add city color system with 6 Asia cities"
```

---

## Task 2: Expand Mock Data to Full 23-Day Trip

**Files:**
- Create: `tripflow-next/src/lib/itinerary-data.ts`

Create a mock data file with the full trip structure. Each day maps to a city. Include 2-4 activities per day for the first few cities, and empty days for the rest (to show empty states). This replaces the inline `initialActivities` and `days` arrays from Itinerary.tsx.

Key data structures:
```typescript
export interface ItineraryDay {
  dayIndex: number;       // 0-22
  date: string;           // "Aug 27"
  city: CitySlug;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  type: 'flight' | 'hotel' | 'food' | 'activity' | 'shopping' | 'transport';
  duration: number;
  votes: { up: number; down: number };
  comments: ActivityComment[];
  imageUrl?: string;
  status?: 'Booked' | 'Must Do' | 'Optional';
  transitToNext?: { method: 'walk' | 'train' | 'car' | 'metro' | 'ferry'; duration: number };
}
```

Include realistic activities for Shanghai Days 1-3 and Hong Kong Days 4-6, using data from the trip research docs (`docs/research/`). Leave remaining cities with 1-2 placeholder activities each.

### Commit

```bash
git add src/lib/itinerary-data.ts
git commit -m "feat(itinerary): add full 23-day mock data for Asia trip"
```

---

## Task 3: Component Decomposition - Extract Sub-Components

**Files:**
- Create: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`
- Create: `tripflow-next/src/components/Itinerary/ActivityCard.css`
- Create: `tripflow-next/src/components/Itinerary/TransitConnector.tsx`
- Create: `tripflow-next/src/components/Itinerary/TransitConnector.css`
- Create: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`
- Create: `tripflow-next/src/components/Itinerary/DayTimeline.css`

### Step 1: Extract ActivityCard

Move the Reorder.Item content from Itinerary.tsx into a standalone component. Include:
- Cover image with zoom-on-hover
- Status badge (Booked/Must Do/Optional)
- Activity info (title, duration, type icon)
- Interaction stats (AI Insight, votes, comments count)
- Expansion panel with voting, photo add, comments list, comment input
- Accept `citySlug` prop for color-coding the timeline node

Move corresponding CSS classes from Itinerary.css:
- `.timeline-content-card`, `.activity-card-image`, `.status-badge`, `.badge-*`
- `.activity-title`, `.activity-duration`, `.interaction-stats`
- `.activity-discussion-panel`, `.vote-btn`, `.comments-*`, `.comment-*`
- `.timeline-node`, `.node-icon`, `.timeline-time`, `.duration-bar`

### Step 2: Extract TransitConnector

Move transit connector JSX into its own component. Props: `method`, `duration`, `onAddActivity`.

Move CSS: `.transit-connector`, `.transit-pill`, `.transit-line`, `.inline-add-btn`

### Step 3: Extract DayTimeline

Create a component that wraps the Reorder.Group + ActivityCard list + TransitConnectors + empty/generating states. Props: `activities`, `citySlug`, `dayLabel`, `onReorder`, `onAutoFill`, `isGenerating`.

Move CSS: `.timeline-container`, `.timeline-line`, `.reorder-timeline`, `.timeline-item`, `.live-time-indicator`, `.empty-day-state`, `.generating-day-state`, `.skeleton-*`, `.magic-wand-*`

### Step 4: Verify all existing functionality works

Run: `cd tripflow-next && npm run dev`

### Step 5: Commit

```bash
git add src/components/Itinerary/
git commit -m "refactor(itinerary): decompose into ActivityCard, TransitConnector, DayTimeline"
```

---

## Task 4: City Navigator Component

**Files:**
- Create: `tripflow-next/src/components/Itinerary/CityNavigator.tsx`
- Create: `tripflow-next/src/components/Itinerary/CityNavigator.css`

A horizontal scrollable bar showing all 6 cities as pills. Each pill shows:
- City icon (from `CITY_CONFIGS`)
- City name
- Night count badge (e.g., "3N")
- Color-coded using city CSS variables
- Active state with glow background + solid border

When a city is selected, it filters to show only that city's days in the DayNavigator below.

Features:
- Horizontal scroll with overflow-x: auto, snap scrolling
- Segmented trip progress bar below the pills (proportional segments per city)
- Active city has a subtle animated underline
- Respects `prefers-reduced-motion`
- Touch-friendly 44px minimum height

### Commit

```bash
git add src/components/Itinerary/CityNavigator.*
git commit -m "feat(itinerary): add CityNavigator with color-coded city pills and progress bar"
```

---

## Task 5: Day Navigator Component

**Files:**
- Create: `tripflow-next/src/components/Itinerary/DayNavigator.tsx`
- Create: `tripflow-next/src/components/Itinerary/DayNavigator.css`

A horizontal scrollable row of day tabs, filtered by the currently selected city. Each tab shows:
- Day number relative to city (e.g., "Day 1" of Kyoto)
- Date (e.g., "Sep 5")
- City-colored dot indicator
- Activity count badge
- Active state with city-colored bottom border

Replaces the existing `.days-navigation` from Itinerary.css.

Features:
- Sticky positioning below the city navigator
- Scroll into view when active day changes
- Keyboard navigation (arrow keys)
- Touch-friendly with scroll snap

### Commit

```bash
git add src/components/Itinerary/DayNavigator.*
git commit -m "feat(itinerary): add DayNavigator with city-filtered day tabs"
```

---

## Task 6: Day Summary Sidebar (Replaces Broken Map)

**Files:**
- Create: `tripflow-next/src/components/Itinerary/DaySummary.tsx`
- Create: `tripflow-next/src/components/Itinerary/DaySummary.css`

Replace the right-panel Google Map (which doesn't work) with a useful day summary card. Displays:

1. **City hero header** - Gradient background using city color, city icon, city name, date
2. **Day stats** - Activity count, total planned hours, transit time, booked vs unbooked
3. **Activity type breakdown** - Small visual showing counts by type (food, activity, transport, etc.) with colored dots
4. **Quick actions** - "AI Auto-fill" button, "Add Activity" button
5. **Weather hint** (mock) - Temperature and condition for the day

Design:
- Sticky sidebar on desktop (position: sticky, top: 80px)
- Hidden on mobile (activities only)
- Glass-panel styling with city-colored top border
- Framer Motion entrance animations
- Updates when active day changes (AnimatePresence)

### Commit

```bash
git add src/components/Itinerary/DaySummary.*
git commit -m "feat(itinerary): add DaySummary sidebar replacing broken map panel"
```

---

## Task 7: Add Activity Modal - Use Radix Dialog

**Files:**
- Create: `tripflow-next/src/components/Itinerary/AddActivityModal.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (remove inline modal)

Replace the hand-rolled modal overlay with a proper component using the existing Radix Dialog from `src/components/ui/dialog.tsx`.

Use: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`

Keep the same form fields: Title, Time, Type dropdown, Cover Image upload area. Add a city badge showing which city/day the activity is being added to.

### Commit

```bash
git add src/components/Itinerary/AddActivityModal.tsx src/components/Itinerary/Itinerary.tsx
git commit -m "refactor(itinerary): migrate AddActivityModal to Radix Dialog"
```

---

## Task 8: Assemble Redesigned Itinerary Page

**Files:**
- Rewrite: `tripflow-next/src/components/Itinerary/Itinerary.tsx`
- Rewrite: `tripflow-next/src/components/Itinerary/Itinerary.css`

Compose all new components into the redesigned page:

```
ItineraryPage
├── Header (title from trip data, not hardcoded)
│   ├── "Asia Circuit Itinerary" (dynamic)
│   └── Action buttons (AI Suggestions, Add Activity)
├── CityNavigator (horizontal city pills + progress bar)
├── Content Split (grid: 60/40 on desktop, single col mobile)
│   ├── Left Panel
│   │   ├── DayNavigator (filtered by active city)
│   │   └── DayTimeline (activities for active day)
│   └── Right Panel
│       └── DaySummary (city hero + stats + quick actions)
├── AISuggestionsPanel (existing, unchanged)
└── AddActivityModal (new Radix-based)
```

State management:
- `activeCity: CitySlug` - controls CityNavigator + filters days
- `activeDay: number` - controls DayNavigator + DayTimeline
- `activities: Activity[]` - from itinerary-data.ts
- When city changes, auto-select first day of that city
- URL reflects state via `searchParams` (?city=osaka&day=3) - use `useSearchParams`

Animation approach (matching Dashboard patterns from `src/components/Dashboard/Dashboard.tsx`):
- Container variants with stagger (0.08s between children)
- Item variants with blur + slide (y: 24 -> 0, blur: 4px -> 0)
- `reducedMotionVariants` for prefers-reduced-motion
- AnimatePresence for city/day transitions

Responsive layout:
- Desktop (>1024px): 60/40 grid split
- Tablet (768-1024px): Full-width timeline, DaySummary as collapsible top card
- Mobile (<768px): Single column, CityNavigator scrollable, DaySummary hidden (data shown inline)

### Commit

```bash
git add src/components/Itinerary/
git commit -m "feat(itinerary): assemble redesigned page with city navigation and day summary"
```

---

## Task 9: Polish - Animations, Hover States, Accessibility

**Files:**
- Modify: All new Itinerary components

Checklist per web-design-guidelines and ui-ux-pro-max:

**Accessibility:**
- [ ] `aria-label` on all icon-only buttons
- [ ] `<button>` for actions, `<Link>` for navigation
- [ ] Visible `:focus-visible` rings on interactive elements
- [ ] `role="tablist"` + `role="tab"` on CityNavigator and DayNavigator
- [ ] `aria-selected` on active tabs
- [ ] Keyboard arrow-key navigation between tabs
- [ ] `alt` text on activity images (use title)

**Animation:**
- [ ] `prefers-reduced-motion` fully respected
- [ ] Animate only `transform` and `opacity`
- [ ] Transitions 150-300ms for micro-interactions
- [ ] Activity cards: `translateY(-4px)` on hover, shadow escalation
- [ ] City transition: fade + slide with AnimatePresence
- [ ] Skeleton loading states for day content

**Touch & Interaction:**
- [ ] 44x44px minimum touch targets on mobile
- [ ] `cursor-pointer` on all clickable elements
- [ ] `touch-action: manipulation` on scrollable areas
- [ ] Hover states that don't cause layout shift

**Typography & Content:**
- [ ] `font-variant-numeric: tabular-nums` on time displays
- [ ] Text truncation with `line-clamp` on long activity titles
- [ ] Empty states with clear CTAs

### Commit

```bash
git add src/components/Itinerary/
git commit -m "feat(itinerary): polish animations, hover states, and accessibility"
```

---

## Task 10: Responsive CSS + Final Cleanup

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.css`

Add responsive breakpoints:

```css
/* Tablet */
@media (max-width: 1024px) {
  .itinerary-content-split { grid-template-columns: 1fr; }
  .itinerary-right-panel { position: relative; top: auto; height: auto; }
}

/* Mobile */
@media (max-width: 768px) {
  .city-navigator { /* compact pills */ }
  .day-navigator { /* full-width scroll */ }
  .itinerary-right-panel { display: none; }
}
```

Final cleanup:
- Remove dead CSS from the original 689-line file
- Ensure no duplicate class definitions
- Verify dark mode works for all new components
- Test at 375px, 768px, 1024px, 1440px

### Commit

```bash
git add src/components/Itinerary/
git commit -m "feat(itinerary): responsive layout and CSS cleanup"
```

---

## Summary of Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/lib/city-colors.ts` | City config, types, color utilities |
| Create | `src/lib/itinerary-data.ts` | Full 23-day mock trip data |
| Create | `src/components/Itinerary/ActivityCard.tsx + .css` | Individual activity card |
| Create | `src/components/Itinerary/TransitConnector.tsx + .css` | Between-activity connector |
| Create | `src/components/Itinerary/DayTimeline.tsx + .css` | Day's activity list with reorder |
| Create | `src/components/Itinerary/CityNavigator.tsx + .css` | City-level navigation bar |
| Create | `src/components/Itinerary/DayNavigator.tsx + .css` | Day-level tab navigation |
| Create | `src/components/Itinerary/DaySummary.tsx + .css` | Day summary sidebar (replaces map) |
| Create | `src/components/Itinerary/AddActivityModal.tsx` | Radix Dialog-based modal |
| Rewrite | `src/components/Itinerary/Itinerary.tsx` | Orchestrator component |
| Rewrite | `src/components/Itinerary/Itinerary.css` | Minimal orchestrator styles |
| Modify | `src/app/globals.css` | City color CSS variables + Tailwind tokens |

## Reused Existing Code

- `src/components/ui/dialog.tsx` - Radix Dialog for AddActivityModal
- `src/components/ui/Card.tsx` - Glass-panel cards
- `src/components/ui/ButtonLegacy.tsx` - Button variants
- `src/components/ui/badge.tsx` - Status badges
- `src/components/AIGenerator/AISuggestionsPanel.tsx` - AI panel (unchanged)
- `src/lib/utils.ts` - `cn()` utility
- Dashboard's `containerVariants` / `itemVariants` / `reducedMotionVariants` pattern

## City Color Reference

| City | Light | Dark | Icon |
|------|-------|------|------|
| Shanghai | `#C2185B` (Rose) | `#E91E63` | Building2 |
| Hong Kong | `#E65100` (Deep Orange) | `#FF6D00` | Ship |
| Osaka | `#00838F` (Cyan) | `#00ACC1` | Castle |
| Kyoto | `#558B2F` (Forest Green) | `#7CB342` | Trees |
| Tokyo | `#283593` (Indigo) | `#3F51B5` | Zap |
| Beijing | `#BF360C` (Terracotta) | `#E64A19` | Landmark |

## Design Guidelines Applied

- **frontend-design skill**: Bold aesthetic direction, distinctive typography (Playfair Display headings + Inter body), city color-coding as the "one unforgettable thing", glass-panel cards with depth
- **ui-ux-pro-max**: Storytelling-driven style, no emojis as icons, cursor-pointer everywhere, 150-300ms transitions, skeleton screens, prefers-reduced-motion
- **web-design-guidelines (Vercel)**: Semantic HTML, aria-labels, focus-visible states, keyboard navigation, URL reflects state, virtualize if >50 items, touch-action: manipulation

## Verification

1. `cd tripflow-next && npm run dev` - App starts without errors
2. Navigate to `/trips/1/itinerary` - Page renders with city navigator
3. Click each city pill - Days filter, city color changes throughout
4. Click a day tab - Timeline shows activities for that day
5. Expand an activity card - Comments/voting panel works
6. Drag an activity - Reorder works within a day
7. Click "AI Auto-fill" on empty day - Skeleton + generation works
8. Click "Add Activity" - Radix Dialog opens correctly
9. Toggle dark mode - All city colors adjust
10. Resize to mobile width - Single column, city nav scrollable
11. Test keyboard: Tab through elements, arrow keys on tabs
12. `npm run build` - No build errors
