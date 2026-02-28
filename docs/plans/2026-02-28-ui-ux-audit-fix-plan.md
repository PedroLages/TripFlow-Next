# UI/UX Audit Fix Plan

**Date:** 2026-02-28
**Source:** `2026-02-28-comprehensive-ui-ux-audit.md`
**Branch:** `feat/itinerary-redesign`

---

## Workstreams (Parallelized)

### WS1: P0 — Itinerary View Toggle & State Bugs
**Files:** `Itinerary.tsx`

1. **Fix "By City" toggle not resetting state** — Clicking the "By City" button (line 438) only calls `setViewMode('city')` but doesn't reset `activeDay`/`activeCity`. After being in "Full Trip" mode, the city view content area renders empty because `activeDay` may reference an invalid index for the current city.
   - **Fix:** When switching back to 'city' mode, reset `activeDay` to `-1` (overview) to ensure clean re-render.

2. **Sync `viewMode` to URL** — Currently only `city` and `day` params are written to URL (line 243-250). Add `view` param so "Full Trip" mode survives refresh.

### WS2: P1 — AI Suggestions Panel Close Bug
**Files:** `AISuggestionsPanel.tsx`, `AISuggestionsPanel.css`

1. **Add Escape key handler** — No keyboard handler exists. Add `useEffect` with `keydown` listener for Escape.
2. **Verify backdrop CSS** — The `.panel-backdrop` class is referenced in JSX but may be missing from CSS. Add proper backdrop styles.
3. Close button is already wired (`onClick={onClose}`) — verify it's not being blocked by event propagation.

### WS3: Accessibility — Sidebar Semantic HTML
**Files:** `Sidebar.tsx`

1. **Replace `<div onClick>` at line 44** (Notifications) with `<button>` element
2. **Replace `<div>` at line 66** (+ New Trip) with `<button>` element
3. **Replace `<div onClick>` at line 70** (Settings) with `<button>` element
4. Apply same fixes to mobile drawer variants (lines 99, 122, 126)

### WS4: Accessibility & Performance — Dashboard
**Files:** `Dashboard.tsx`

1. **Add `role="tab"` and `aria-selected`** to tab buttons at lines 235-236
2. **Add `role="tablist"`** to the tab container at line 234
3. **Add `width` and `height`** to avatar `<img>` at line 245
4. **Replace `filter: blur(4px)`** in `itemVariants` with `opacity` + `transform` only (performance)

### WS5: Meta & Dark Mode — Root Layout
**Files:** `layout.tsx`

1. **Add `color-scheme: dark`** style to `<html>` element
2. **Add `<meta name="theme-color">`** tag

### WS6: Performance — Animation Blur Removal
**Files:** `Itinerary.tsx`

1. **Remove `filter: blur(4px)`** from `itemVariants` (line 59) and `contentTransition` (lines 156-158)
2. Replace with `opacity` + `transform` only (GPU-composited)

---

## Execution Strategy

All 6 workstreams are independent and will be executed in parallel via specialized agents.
