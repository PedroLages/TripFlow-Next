# Itinerary Timeline UX Redesign — Research & Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the TripFlow itinerary timeline to solve 14 critical UX issues identified through competitive research (TripIt, Google Travel, Airbnb, Wanderlog, Sygic, Rome2Rio) and adversarial critique, producing a timeline that supports a 22-night, 6-city trip without cognitive overload.

**Architecture:** Evolve existing 15+ component architecture — no full rewrite. Add 4 new components (TripOverview, TripContextBar, ActivitySearch, TravelDayView), modify 6 existing components, and expand the data model with timezone and status improvements.

**Tech Stack:** Next.js / React / TypeScript / Tailwind CSS 4 + CSS Modules / Framer Motion / Mapbox GL / Radix UI

**Priority:** Navigation first (Phase 1) — this fixes the 3 biggest usability gaps: no trip overview, no search, lost orientation. Subsequent phases follow in order.

**Saved to:** This plan is also saved as `tripflow-next/docs/plans/2026-02-27-itinerary-timeline-redesign.md`

---

## Context

The current itinerary timeline is **visually polished but functionally brittle** (adversarial critique). It optimizes for the demo rather than for real travel use. A swarm of 6 research agents analyzed:

- **TripIt** — Best-in-class email parsing but outdated UI, no drag-and-drop, no planning layer
- **Google Travel** — Gmail auto-detection, smart Day Plans with crowd-sourced durations, but fragmented since 2023 (no unified trip view)
- **Airbnb** — "Living itinerary" with contextual info surfaced at the right moment, photo-first, generous whitespace, shared element transitions
- **Wanderlog, Sygic, Rome2Rio, Roadtrippers** — 2025 consensus is hybrid map+timeline with bidirectional sync, drag-and-drop as table stakes, AI itinerary generation as breakout trend

The adversarial critique found **34 issues (14 critical, 12 significant, 8 minor)**. The highest-leverage fixes are:
1. Full trip overview (no way to see all 23 days at once)
2. Travel day / city transition handling (travel days look broken)
3. Global search (13 taps to find a specific activity)
4. Information hierarchy cleanup (votes/comments useless for solo travel, metadata clutter)
5. Mobile-first map layout (map buried behind FAB)
6. Status model expansion (only 3 states, need 6+)

---

## Research Synthesis: Proven Patterns to Adopt

| Pattern | Source | Evidence |
|---------|--------|----------|
| Photo-first cards with 3:2 ratio | Airbnb | Creates emotional connection, trust |
| Progressive disclosure (3 tiers) | Industry consensus | Summary → card expansion → detail page |
| City color restricted to accents only | Adversarial critique | 6 color schemes shifting all UI = chaos |
| Travel day specialized view | Gap in all competitors | No app handles "travel days" well |
| Day density warnings | Google Day Plans | Crowd-sourced visit durations prevent over-scheduling |
| Map-first mobile with bottom drawer | Google Maps, Airbnb | 68% of travel app traffic is mobile |
| Drag-and-drop with long-press on mobile | Wanderlog | Prevents scroll/drag conflict |
| Contextual info surfacing | Airbnb "living itinerary" | Show check-in details on arrival day |
| Planning vs travel mode toggle | Unserved gap | Different needs at different phases |
| Generous whitespace between cards | Airbnb "calm UI" | Reduces cognitive load on long itineraries |

---

## Phase 1: Navigation & Trip-Level Views (Critical Fixes)

### Task 1: TripOverview Component (NEW)

**Problem:** No way to see all 23 days at once. Users must click through 6 city overviews sequentially.

**Solution:** Add a "Full Trip" view accessible from a toggle above the city navigator.

**Files:**
- Create: `tripflow-next/src/components/Itinerary/TripOverview.tsx`
- Create: `tripflow-next/src/components/Itinerary/TripOverview.css`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (add view toggle state)

**Design:**
- All 23 days in a single scrollable list, grouped by city
- Each day shows: day number, date, activity count, density indicator (green/amber/red), key activity titles
- City section headers with hero thumbnail, city name, date range
- Click any day → navigates to that city + day in the existing timeline
- Filter tabs: All / Booked / Must Do / Unplanned
- Compact density: ~60px per day row, entire trip visible in ~1400px scroll

**Pattern source:** Project management Gantt-style overview (no competitor does this well — competitive advantage)

### Task 2: TripContextBar Component (NEW)

**Problem:** Users lose orientation in a 23-day trip. No persistent "where am I?" indicator.

**Solution:** Persistent context bar below the city navigator.

**Files:**
- Create: `tripflow-next/src/components/Itinerary/TripContextBar.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (add to layout)

**Design:**
- Single line: "Day 14 of 23 — Tokyo Day 3/6 — Wed, Sep 11 — 9 days remaining"
- Subtle progress fill bar behind text
- Updates on every city/day navigation
- Collapses to "Day 14 / 23" on mobile

### Task 3: Global Activity Search (Cmd+K)

**Problem:** 13 taps to find "Which Tokyo day has TeamLab?"

**Solution:** Cmd+K search dialog that searches across all days/cities.

**Files:**
- Create: `tripflow-next/src/components/Itinerary/ActivitySearch.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (keyboard listener + state)

**Design:**
- Radix Dialog with search input
- Fuzzy search across activity titles, city names, dates
- Results grouped by city, show day + time
- Click result → navigates to city + day + scrolls to activity + highlights
- Reuse existing `src/components/ui/dialog.tsx`

---

## Phase 2: Timeline Layout Improvements

### Task 4: TravelDayView Component (NEW)

**Problem:** Travel days (e.g., HK → Osaka flight) have only 1-2 activities but render in the standard timeline, creating a broken-looking gap.

**Solution:** Detect travel days and render a specialized view.

**Files:**
- Create: `tripflow-next/src/components/Itinerary/TravelDayView.tsx`
- Create: `tripflow-next/src/components/Itinerary/TravelDayView.css`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (conditional render)

**Detection logic:** `activities.length <= 2 && activities.some(a => a.type === 'flight' || a.type === 'transport')`

**Design:**
- Large transport card (departure city → arrival city with flight/train icon)
- Departure/arrival times with timezone display
- City transition gradient (departing city color → arriving city color)
- "Pack your bags" reminder if first activity is transport
- Arrival activities below with "After arrival" section header

### Task 5: City Transition Banners

**Problem:** Osaka → Kyoto move day looks identical to any other day.

**Solution:** Detect city-to-city transport activities and render a visual transition banner.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.css`

**Design:**
- Gradient divider between departing city color and arriving city color
- "Osaka → Kyoto" with transport mode + duration
- Checkout/check-in reminders

### Task 6: Day Density Warnings

**Problem:** Day 1 has 8 activities on a jet-lag arrival day with no visual warning.

**Solution:** Calculate total duration per day, show warning when > 10 hours.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.css`

**Design:**
- Amber banner at top of timeline: "This day has 12h of activities planned — consider moving some to nearby days"
- Red if > 14h: "Warning: Over-scheduled day"
- Collapsible with "I know what I'm doing" dismiss

### Task 7: Day Intention States

**Problem:** Empty days show "Nothing planned yet" — no way to mark "Intentionally free."

**Solution:** Add day intention state to data model.

**Files:**
- Modify: `tripflow-next/src/lib/itinerary-data.ts` (add `intention` field to ItineraryDay)
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx` (conditional empty state)

**States:**
- `'planned'` — default, show activities
- `'free'` — show relaxed "Free day! Enjoy exploring at your own pace" with optional local suggestions
- `'travel'` — triggers TravelDayView
- `'unplanned'` — show current "Nothing planned yet" + Auto-fill CTA

---

## Phase 3: Activity Card Redesign

### Task 8: Information Hierarchy Cleanup

**Problem:** Collapsed cards show too much: photos, metadata (rating, reviews, hours, address), votes, comments. Scanning a 6-activity day is slow.

**Solution:** Three-tier progressive disclosure following Airbnb's pattern.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.css`

**Tier 1 — Collapsed (scanning mode):**
- Time | Type icon | Title | Status badge | Duration
- NO photos, NO metadata, NO votes/comments
- Compact: ~56px height per activity

**Tier 2 — Expanded (planning mode):**
- Everything from Tier 1 +
- Thumbnail photo (if available, 3:2 ratio, max 200px wide)
- Place metadata (rating, price level, hours)
- Personal notes field (replaces votes/comments for solo trips)
- Tags (user-defined)
- Edit/delete actions

**Tier 3 — Detail modal (deep dive):**
- Full photo gallery
- Complete place info (address, reviews, map)
- AI suggestions for alternatives
- Move to another day action

### Task 9: Replace Votes/Comments with Personal Notes

**Problem:** Votes and comments are useless for 1-2 travelers. They create false social proof.

**Solution:** Replace with personal notes and tags.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx` (remove vote/comment UI from collapsed state)
- Modify: `tripflow-next/src/lib/itinerary-data.ts` (add `notes?: string`, `tags?: string[]` to Activity)

**Design:**
- Collapsed: Show note icon (if note exists) with truncated preview
- Expanded: Full notes textarea + tag chips
- Keep votes/comments infrastructure for future group trip feature (just hide UI)

### Task 10: Status Model Expansion

**Problem:** Only 3 statuses: Booked, Must Do, Optional. Missing: Considering, Pending, Cancelled, Paid.

**Solution:** Expand status type and badge system.

**Files:**
- Modify: `tripflow-next/src/lib/itinerary-data.ts` (expand Activity.status type)
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx` (new badge variants)
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.css` (new badge styles)

**New statuses:**
| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Booked | Green | CheckCircle2 | Confirmed reservation |
| Paid | Emerald | CreditCard | Booked + payment confirmed |
| Pending | Amber | Clock | Awaiting confirmation |
| Must Do | Purple | Sparkles | Must visit, no booking needed |
| Considering | Blue | HelpCircle | Researching |
| Optional | Gray | AlertCircle | Nice to have |
| Cancelled | Red/strikethrough | XCircle | Was booked, now cancelled |

---

## Phase 4: Mobile-Specific Architecture

### Task 11: Mobile Map-First Layout

**Problem:** Map buried behind FAB + bottom sheet. For a travel app, map should be primary on mobile.

**Solution:** Swap to map-first layout with timeline as bottom drawer.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx` (responsive layout logic)
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.css` (mobile breakpoint)
- Modify: `tripflow-next/src/components/Itinerary/MobileMapSheet.tsx` (reverse: make timeline the sheet)

**Design (mobile < 768px):**
- Map takes full viewport height
- Timeline is a bottom drawer (3 snap points: peek / half / full)
- Peek state shows: current day label + next activity + pull handle
- City/day navigation moves into the drawer header
- Remove the floating map FAB entirely

### Task 12: Mobile Drag-to-Reorder Fix

**Problem:** Framer Motion `Reorder.Group` with `axis="y"` conflicts with scroll on mobile.

**Solution:** Long-press to enter drag mode, or use a contextual action menu.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`

**Design:**
- Desktop: Keep current drag behavior
- Mobile: Disable auto-drag. Add grip handle icon to cards. Long-press (500ms) to enter reorder mode with haptic feedback. Or use a "..." menu with Move Up / Move Down / Move to Day X options.

### Task 13: Touch Target Enforcement

**Problem:** Transit connector pills below 44x44px minimum.

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/TransitConnector.tsx`
- Modify: `tripflow-next/src/components/Itinerary/TransitConnector.css`

**Fix:** Add `min-height: 44px; min-width: 44px; padding: 10px 16px;` on mobile breakpoints.

---

## Phase 5: Visual Design Refinement

### Task 14: Color System Restraint

**Problem:** 6 city colors shifting all UI elements creates visual chaos.

**Solution:** Option A — Keep city colors but restrict to accent roles only.

**Files:**
- Modify: `tripflow-next/src/app/globals.css`
- Modify: `tripflow-next/src/components/Itinerary/CityNavigator.tsx`
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.css`

**Rules:**
- City color applies to: city pills, city hero images, progress ring, timeline node icons
- Does NOT apply to: card borders, status badges, action buttons, text, backgrounds
- Status colors are universal: green (booked), amber (pending), red (cancelled), purple (must do), gray (optional)
- Timeline line becomes neutral gray, not city-colored gradient

### Task 15: Motion Budget — Cut to 3 Signature Effects

**Problem:** Glassmorphism + parallax + shimmer + blur transitions + stagger = "design buffet."

**Keep:**
1. **Blur transitions** between city/day switches (functional — aids navigation context)
2. **Stagger reveals** on page entry (establishes hierarchy)
3. **Card expansion/collapse** with AnimatePresence (progressive disclosure)

**Remove:**
- Status badge shimmer animation
- Parallax hero scrolling (replace with static hero)
- Timeline gradient line (replace with neutral, or color by time-of-day)
- Duration bar variable heights (replace with compact fixed indicator)

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx` (remove parallax)
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.css` (remove shimmer)
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.css` (neutral timeline line)

### Task 16: Spacing & Density Optimization

**Following Airbnb's "calm UI" principle:**

**Card spacing:**
- Gap between activity cards: 16px (up from current ~12px)
- Gap between sections: 24px
- Card internal padding: 16px
- Transit connector height: 48px minimum (up from ~32px)

**Typography scale (existing Inter + Playfair Display kept):**
- Trip title: Playfair Display, 2rem/600
- City name (hero): Playfair Display, clamp(2rem, 4vw, 3rem)/600 — keep current
- Day label: Inter, 0.9rem/600
- Activity time: Inter, 0.8rem/500, tabular-nums
- Activity title: Inter, 0.95rem/600
- Metadata: Inter, 0.75rem/400
- Status badge: Inter, 0.7rem/600, uppercase

---

## Phase 6: Data Model Changes

### Task 17: Day Intention Field

**File:** `tripflow-next/src/lib/itinerary-data.ts`

```typescript
interface ItineraryDay {
  dayIndex: number;
  date: string;
  fullDate: string;
  city: CitySlug;
  activities: Activity[];
  intention?: 'planned' | 'free' | 'travel' | 'unplanned'; // NEW
}
```

### Task 18: Activity Model Expansion

**File:** `tripflow-next/src/lib/itinerary-data.ts`

```typescript
interface Activity {
  // ... existing fields ...
  status?: 'Booked' | 'Paid' | 'Pending' | 'Must Do' | 'Considering' | 'Optional' | 'Cancelled'; // EXPANDED
  notes?: string;     // NEW: personal notes
  tags?: string[];    // NEW: user-defined tags
  timezone?: string;  // NEW: e.g., 'Asia/Tokyo'
}
```

### Task 19: Timezone Display (Future Enhancement — Design Only)

Store timezone strings with activities. Display timezone transitions on travel days:
- "Arrive 3:00 PM JST (+1h from HKT)"
- Not implementing full timezone logic now, just adding the field and display formatting

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `Itinerary/TripOverview.tsx + .css` | Full 23-day trip overview |
| Create | `Itinerary/TripContextBar.tsx` | Persistent "where am I?" bar |
| Create | `Itinerary/ActivitySearch.tsx` | Cmd+K global activity search |
| Create | `Itinerary/TravelDayView.tsx + .css` | Specialized travel day layout |
| Modify | `Itinerary/Itinerary.tsx` | View toggle, search state, layout |
| Modify | `Itinerary/DayTimeline.tsx + .css` | Density warnings, city transitions, mobile drag |
| Modify | `Itinerary/ActivityCard.tsx + .css` | 3-tier progressive disclosure, notes, statuses |
| Modify | `Itinerary/TransitConnector.tsx + .css` | Touch target enforcement |
| Modify | `Itinerary/CityOverview.tsx` | Remove parallax, simplify |
| Modify | `Itinerary/MobileMapSheet.tsx` | Reverse to timeline-as-drawer |
| Modify | `lib/itinerary-data.ts` | Day intentions, status expansion, notes, tags, timezone |
| Modify | `globals.css` | Color system restraint rules |

## Reuse Existing Code

- `src/components/ui/dialog.tsx` — Radix Dialog for ActivitySearch
- `src/lib/city-colors.ts` — `getCityStyle()`, `CITY_CONFIGS`, `getDaysForCity()`
- `src/lib/utils.ts` — `cn()` utility
- `src/components/Itinerary/Itinerary.tsx` lines 43-65 — Animation variants (containerVariants, itemVariants, reducedMotionVariants)
- `src/components/Itinerary/MapPanel.tsx` — Keep as-is, just change when it's visible on mobile

---

## Verification

1. `cd tripflow-next && npm run dev` — App starts without errors
2. Navigate to `/trips/1/itinerary` — Page renders
3. Toggle to "Full Trip" view — All 23 days visible, grouped by city
4. Click a day in trip overview — Navigates to correct city + day
5. Press Cmd+K — Search dialog opens, search finds activities across cities
6. Navigate to Sep 2 (HK → Osaka travel day) — TravelDayView renders with transport card
7. Navigate to Sep 5 (Osaka → Kyoto) — City transition banner visible
8. Check a day with 8+ activities — Density warning appears
9. Expand an activity card — Shows photo, metadata, notes field (no votes/comments)
10. Check status badges — All 7 statuses render with correct colors
11. On mobile viewport (375px) — Map is primary, timeline is bottom drawer
12. Try drag-to-reorder on mobile — Long-press activates, no scroll conflict
13. Toggle dark mode — All components adjust correctly
14. `npm run build` — No build errors

---

## Competitive Research Appendix

### TripIt Key Findings
- Vertical chronological timeline, email-to-timeline pipeline is best-in-class
- NO drag-and-drop (biggest complaint), outdated UI, no color coding
- No planning/discovery layer — purely organizes bookings
- Can't handle multi-city trips natively
- Pro paywall locks real-time alerts, flight monitoring

### Google Travel Key Findings
- Gmail-to-timeline pipeline is unmatched
- Day Plans used crowd-sourced visit durations — smart scheduling
- Removed unified trip view in 2023 — major gap
- Screenshot-to-itinerary via Gemini AI (2025)
- Navigation confusion with ambiguous category labels

### Airbnb Key Findings
- "Living itinerary" — contextual info at the right moment
- Photo-first, 3:2 ratio, Cereal typeface, generous whitespace
- Shared element transitions (card image → detail header)
- Two-tier map pin system (prominent vs quiet markers)
- Strict information tiering: 4-5 data points max on summary cards
- Cancelled items stay in timeline with badge (not removed)

### Broader Industry Key Findings
- 2025 consensus: hybrid map + timeline with bidirectional sync
- Glassmorphism dominant but must be restrained
- Drag-and-drop is table stakes (Wanderlog leads)
- AI itinerary generation is breakout 2025 trend
- Key gap: planning vs travel mode toggle
- Mobile-first: bottom sheets > modals, 44px min touch targets
- Stippl: changing hotel auto-adjusts daily routes (innovative)
- Sygic radical redesign caused negative backlash (lesson: evolve, don't revolution)

### Adversarial Critique Summary (34 Issues)
- 14 Critical, 12 Significant, 8 Minor
- Top critical: no trip overview, no search, travel days broken, no offline, timezone absent
- "Visually polished but functionally brittle — optimizes for demo, not use case"
- "Users will abandon it during actual travel because the interface demands more cognitive effort than a screenshot in Notes.app"
