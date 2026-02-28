# TripFlow AI — Comprehensive UI/UX Audit Report

**Date:** 2026-02-28
**Reviewer:** Claude Code (Browser Automation + Source Code Analysis)
**Scope:** Full app exploration via Chrome DevTools + 3 design skill reviews
**App Version:** `feat/itinerary-redesign` branch, commit `dd09183`

---

## Executive Summary

TripFlow AI is a visually ambitious collaborative trip planning app with strong foundational design: the city-as-color-identity system, editorial hero images, and the proportional progress bar are genuinely distinctive. However, the app has **2 critical bugs** that break core functionality, several accessibility gaps, and design opportunities that would elevate it from "good dashboard" to "memorable travel product."

### Scores

| Category | Score | Notes |
|---|---|---|
| Visual Design | 7.5/10 | Strong dark theme, editorial hero images, city color system |
| Functionality | 5/10 | Full Trip view broken, state corruption after toggle, AI panel won't close |
| Accessibility | 6/10 | Good ARIA on CityNavigator, but many divs-as-buttons, missing focus states |
| Performance | 7/10 | `prefers-reduced-motion` respected, but `filter: blur` in animations |
| Typography | 6.5/10 | Playfair Display is strong for headings; Inter is generic for body |
| Motion Design | 8/10 | Cinematic city transitions, stagger animations, spring physics on pills |
| Information Architecture | 8/10 | Clear tab structure, smart URL deep-linking, city-based navigation |

---

## Pages Explored

| Page | URL | Status |
|---|---|---|
| Homepage/Dashboard | `/` | Working |
| Trip Overview | `/trips/1` | Working |
| Itinerary (By City) | `/trips/1/itinerary` | Working (default) |
| Itinerary (Full Trip) | `/trips/1/itinerary` (toggle) | **BROKEN** |
| Budget | `/trips/1/budget` | Working |
| Voting | `/trips/1/voting` | Working |
| Amalfi Coast Trip | `/trips/2` | Working |
| All 6 City Views | Shanghai through Beijing | Working (Hong Kong intermittent) |

---

## Critical Bugs (P0-P1)

### P0: Full Trip View Renders Empty

**Location:** `Itinerary.tsx:454-461`
**Reproduction:** Click "Full Trip" toggle on itinerary page
**Expected:** Full trip overview with all days across all cities
**Actual:** Only the header renders; body is completely blank
**Root Cause:** The `TripOverview` component either renders nothing or has a rendering issue. The `viewMode === 'trip'` branch at line 454 fires but produces no visible content.

### P0: View Toggle State Corruption

**Location:** `Itinerary.tsx:431-451`
**Reproduction:** Click "Full Trip" then click "By City" then click any city
**Expected:** City content (overview, day tabs, hero image) appears
**Actual:** City tabs appear but no content renders below them
**Root Cause:** After toggling between view modes, the `activeCity` and `activeDay` state combination doesn't trigger a re-render of the content area. The `AnimatePresence` at line 495 may be holding stale exit state.

### P1: MapLibre Crash on City Switch (Intermittent)

**Location:** `MapContainer.tsx` (dynamic import)
**Reproduction:** Switch from Shanghai to Hong Kong (seen on port 3000, not reproduced on port 3100)
**Error:** `Cannot read properties of undefined (reading '_loaded')`
**Root Cause:** Likely a race condition where the map instance is being accessed after disposal during city transition. The `MapProvider` at line 465 wraps only the `viewMode === 'city'` branch, so toggling view modes destroys and recreates the provider.

### P2: AI Suggestions Panel Won't Close

**Location:** `AISuggestionsPanel.tsx`
**Reproduction:** Click "AI Suggestions" then try to close it (X button, clicking away, Escape)
**Expected:** Panel dismisses
**Actual:** Panel stays open. Only navigation away closes it.

### P2: `viewMode` Not Synced to URL

**Location:** `Itinerary.tsx:238-251`
**Issue:** URL sync writes `city` and `day` params but not `viewMode`. Refreshing after "Full Trip" toggle resets to "By City."

---

## Web Interface Guidelines Findings

### Accessibility

| File:Line | Issue | Severity |
|---|---|---|
| `Sidebar.tsx:44` | `<div onClick>` for Notifications — use `<button>` | HIGH |
| `Sidebar.tsx:66` | `<div>` for "+ New Trip" — needs semantic interactive element | HIGH |
| `Sidebar.tsx:70` | `<div onClick>` for Settings — use `<button>` | HIGH |
| `Dashboard.tsx:235-236` | Tab buttons lack `role="tab"` and `aria-selected` | MEDIUM |
| `Dashboard.tsx:290` | Magic Draft cards use `backgroundImage` — no text alternative for images | MEDIUM |
| `layout.tsx:19` | Missing `color-scheme: dark` on `<html>` | MEDIUM |
| `layout.tsx` | Missing `<meta name="theme-color">` | LOW |
| `ActivityCard.tsx:214` | Placeholder uses `...` instead of `...` (Unicode ellipsis) | LOW |

### What's Done Well

- `CityNavigator.tsx` — Proper `role="tablist"`, `role="tab"`, `aria-selected`, `tabIndex` roving, arrow key navigation
- `ActivityCard.tsx` — `role="button"`, `tabIndex={0}`, `onKeyDown` handler for Enter/Space
- `Itinerary.tsx:577-581` — Map FAB has `aria-label="Show map"`
- Both `Itinerary.tsx` and `Dashboard.tsx` — `prefers-reduced-motion` respected

### Performance

| File:Line | Issue |
|---|---|
| `Itinerary.tsx:59` / `Dashboard.tsx:41` | `filter: blur(4px)` in stagger animations — not GPU-composited, prefer `opacity` + `transform` only |
| `Dashboard.tsx:100` | Hero image via CSS `backgroundImage` bypasses Next.js Image optimization |
| `Dashboard.tsx:245` | Avatar `<img>` missing `width`/`height` attributes |
| `ActivityCard.tsx:163` | Expanded thumb `<img>` missing `width`/`height` attributes |

### Dark Mode

| File:Line | Issue |
|---|---|
| `layout.tsx:19` | No `color-scheme: dark` declaration on `<html>` |
| `layout.tsx` | No `<meta name="theme-color">` tag |

### URL / Navigation

| File:Line | Issue |
|---|---|
| `Itinerary.tsx:167` | `viewMode` not synced to URL — "Full Trip" vs "By City" lost on refresh |
| `Itinerary.tsx:219-251` | City + day URL sync is well-implemented |

---

## Frontend Design Assessment

### Typography

**Current:** Playfair Display (display/headings) + Inter (body)

| Aspect | Rating | Notes |
|---|---|---|
| Heading font | 8/10 | Playfair Display gives editorial/travel-magazine quality |
| Body font | 4/10 | Inter is the definition of generic; every AI-generated UI uses it |
| Hierarchy | 6/10 | Only two levels (heading vs body); missing intermediate sizes |
| Numeric display | 9/10 | `tabular-nums` correctly used for times and percentages |

**Recommended alternatives for body font:**
- **Satoshi** — Geometric warmth, pairs well with Playfair
- **General Sans** — Clean but characterful
- **Cabinet Grotesk** — Travel-friendly personality
- **Karla** — Suggested by UI Pro Max for hospitality/travel contexts
- **Noto Sans JP** — Would add CJK support for the Asia trip context

### Color System

| Aspect | Rating | Notes |
|---|---|---|
| City accent colors | 9/10 | Shanghai indigo, HK rose, Osaka orange, Kyoto green, Tokyo purple, Beijing red — distinctive and memorable |
| Base dark palette | 5/10 | Generic dark dashboard — `#1a1a2e` tones indistinguishable from every dark template |
| Accent deployment | 6/10 | Colors confined to pills and badges — should bleed into glass panels, timeline lines, backgrounds |
| Status colors | 7/10 | Booked=green, Must Do=amber, Optional=gray — clear and functional |

**UI Pro Max recommended palette:**
- Primary: `#0F172A` (Slate 900)
- Secondary: `#1E293B` (Slate 800)
- CTA: `#22C55E` (Green 500)
- Background: `#020617` (Slate 950)
- Text: `#F8FAFC` (Slate 50)

### Motion & Animation

| Aspect | Rating | Notes |
|---|---|---|
| Page transitions | 8/10 | Cinematic blur + scale on city switch |
| Stagger reveals | 8/10 | Dashboard cards use 80ms stagger — feels crafted |
| City pill indicator | 9/10 | `layoutId` spring animation is smooth and delightful |
| Drag reorder | 5/10 | Framer Motion `Reorder` used but no spring physics — items snap |
| Below-fold reveals | 3/10 | No scroll-triggered animations for Magic Drafts, activity feed |
| Map pins | 4/10 | No pulse or highlight animation on active/hovered pins |

### Layout & Composition

| Aspect | Rating | Notes |
|---|---|---|
| Itinerary split layout | 8/10 | Timeline + map side-by-side is functional and smart |
| Dashboard bento grid | 6/10 | Standard grid — no overlap, asymmetry, or visual tension |
| Overview tab | 4/10 | Content doesn't fill viewport; feels sparse |
| Mobile responsive | 7/10 | Bottom tab bar, map FAB, sidebar drawer all present |
| Progress bar | 9/10 | Proportional city segments are innovative and informative |

---

## UI/UX Pro Max Checklist

### Visual Quality

- [x] No emojis used as icons (Lucide SVG throughout)
- [x] All icons from consistent set (Lucide React)
- [ ] Brand logos verified — N/A (no external brand logos)
- [x] Hover states don't cause layout shift
- [ ] Hover states on all interactive cards — some cards lack cursor change

### Interaction

- [ ] All clickable elements have `cursor-pointer` — Sidebar divs and some cards missing
- [x] Hover states provide clear visual feedback on activity cards
- [x] Transitions smooth (150-300ms range)
- [ ] Focus states visible for keyboard nav — missing on sidebar items, dashboard tabs

### Dark Mode

- [x] Dark mode is the primary theme and looks cohesive
- [ ] `color-scheme: dark` declared — **MISSING**
- [ ] `<meta name="theme-color">` present — **MISSING**
- [ ] Light mode tested — Theme toggle exists but light mode quality not verified

### Layout

- [x] No content hidden behind fixed elements
- [ ] Responsive tested at 375px — Mobile layout via CSS media queries, not fully tested
- [x] No horizontal scroll observed
- [x] Sidebar collapse works correctly

### Accessibility

- [x] Activity card images have alt text
- [x] Form inputs have labels (notes textarea)
- [ ] Color is not the only indicator — Status badges use color + text, good
- [x] `prefers-reduced-motion` respected

### Performance

- [ ] Images use Next.js `<Image>` — Hero uses CSS `backgroundImage`, avatar uses plain `<img>`
- [x] Map is dynamically imported with `next/dynamic`
- [ ] Font loading with `font-display: swap` — not verified
- [x] Skeleton loading states for AI generation

---

## Priority Recommendations

### Immediate (P0 — Fix Before Ship)

1. **Fix Full Trip view** — `TripOverview` component renders nothing; implement or hide the toggle
2. **Fix view toggle state corruption** — `AnimatePresence` cleanup or state reset on mode switch
3. **Fix AI Suggestions panel close** — Add Escape handler + backdrop click + working X button

### Short-Term (P1 — Next Sprint)

4. **Replace Inter** with a characterful sans-serif (Satoshi, General Sans, Cabinet Grotesk)
5. **Add `color-scheme: dark`** to `<html>` and `<meta name="theme-color">`
6. **Replace `<div onClick>`** in Sidebar with proper `<button>` elements (3 instances)
7. **Add `role="tablist"`** to Dashboard activity/actions tabs
8. **Sync `viewMode` to URL** for deep-linking support
9. **Use Next.js `<Image>`** for hero banner and avatar images

### Medium-Term (P2 — Design Polish)

10. **Let city colors influence environment** — tinted glass panels, colored timeline lines, gradient washes
11. **Add scroll-triggered animations** for below-fold dashboard content
12. **Implement the Overview tab** more fully — route map, photo mosaic, or trip highlights
13. **Add parallax hover** on Magic Drafts cards
14. **Add pulse animation** on map pins for active/hovered activities
15. **Remove `filter: blur` from animations** — replace with `opacity` + `transform` only

---

## Summary of Tools Used

| Tool | What It Found |
|---|---|
| **Chrome DevTools Browser** | 2 P0 bugs (Full Trip empty, state corruption), 1 P1 (MapLibre crash), 1 P2 (panel won't close) |
| **Web Interface Guidelines** | 8 accessibility issues, 4 performance issues, 2 dark mode gaps, 1 URL state gap |
| **Frontend Design Skill** | Typography weakness (Inter), color underutilization, missing scroll animations, layout opportunities |
| **UI/UX Pro Max** | Design system recommendations, Next.js stack guidelines, typography alternatives, checklist failures |

---

*Report generated by exploring http://localhost:3100 via Chrome DevTools Protocol, reading 15+ source files, and applying 3 design review frameworks.*
