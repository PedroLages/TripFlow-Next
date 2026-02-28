# Itinerary Overview Tab Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the space-heavy bento grid photo layout with a compact, action-oriented overview that reduces vertical space by ~50% while making planning status visible at every level.

**Architecture:** Compress the hero from 350px to 200px. Replace the 12-column bento grid (120+ lines of CSS) with a horizontal-scroll photo strip (~15 lines). Replace the stats strip with a progress bar showing booking ratios. Enhance day cards with activity previews and status dots. All changes are within CityOverview.tsx/css with one small prop fix in Itinerary.tsx.

**Tech Stack:** Next.js, React, Framer Motion, CSS (no new dependencies)

**Save to:** `tripflow-next/docs/plans/2026-02-26-itinerary-overview-redesign.md` on first implementation step.

---

## Research Context (for implementer)

Research across 10 major travel products (Wanderlog, Airbnb, TripAdvisor, Google Travel, TripIt, Sygic, Notion, Lonely Planet, Rome2Rio, Kayak) revealed:

- **Bento grids belong on detail pages** (e.g., Airbnb listing), not on itinerary overview/planning pages
- **Planning tools use 20-40% image density** with data-carrying cards (Wanderlog, TripAdvisor, Google Travel)
- **TripAdvisor doubled save rate** by switching from day-by-day image timelines to category-organized cards
- **Behavioral psychology**: Current stats show absolute numbers with no denominators (no goal gradient), status badges are invisible in overview, 8-photo grid creates decision paralysis
- **Mobile**: Current page requires ~2.2 full scrolls (1,470px) to see all content; target is <1 scroll (684px)

### Current section order and heights (desktop):
```
1. Hero (350px) -> COMPRESS to 200px
2. Stats strip (72px) -> REPLACE with Progress Bar (64px)
3. Photo bento grid (540-720px) -> REPLACE with Photo Strip (160px)
4. Day cards (200px) -> ENHANCE with status dots + preview text
5. Quick Info (200px) -> KEEP (140px)
6. Highlight pills (40px) -> KEEP
TOTAL: ~1,600px -> ~900px (44% reduction)
```

---

## Task 1: Hero Compression (CSS-only)

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:11-19` (hero height)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:41-49` (hero content padding)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:444-451` (tablet hero)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:459-465` (mobile hero)

**Step 1: Compress desktop hero height**

In `CityOverview.css`, change `.co-hero` height from `350px` to `200px` and reduce hero content padding from `32px` to `20px 24px`:

```css
.co-hero {
  position: relative;
  height: 200px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
}
```

```css
.co-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 24px;
  color: white;
  z-index: 2;
}
```

**Step 2: Compress tablet and mobile hero heights**

In the `@media (max-width: 1023px)` block, change `.co-hero` from `280px` to `180px` and padding from `24px` to `16px 20px`.

In the `@media (max-width: 640px)` block, change `.co-hero` from `220px` to `160px` and padding from `16px` to `14px 16px`.

```css
/* Tablet */
@media (max-width: 1023px) {
  .co-hero {
    height: 180px;
  }
  .co-hero-content {
    padding: 16px 20px;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .co-hero {
    height: 160px;
  }
  .co-hero-content {
    padding: 14px 16px;
  }
}
```

**Step 3: Verify in browser**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npm run dev`

Open `http://localhost:3000/trips/asia-2026/itinerary` and verify:
- Hero is visibly shorter but still shows city name, tagline, date pills
- Parallax still works on desktop
- Content doesn't overflow the hero
- Check all 6 cities (switch via city pills)

**Step 4: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): compress hero from 350px to 200px

Reduces hero height across breakpoints (200/180/160px) to reclaim
150px of vertical space for actionable content."
```

---

## Task 2: Replace Bento Grid with Photo Strip

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:58-75` (photo highlights logic)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:149-208` (photo grid JSX)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:146-283` (delete bento, add strip)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:429-482` (delete responsive bento overrides)

**Step 1: Update photo highlights derivation to prioritize Must-Do activities and cap at 6**

In `CityOverview.tsx`, replace the `photoHighlights` useMemo (lines 59-75) with:

```tsx
  // Derive photo highlights — prioritize Must Do, cap at 6
  const photoHighlights = useMemo(() => {
    const photos: { imageUrl: string; title: string; dayIndex: number; dayLabel: string; status?: string }[] = [];
    for (const day of cityDays) {
      for (const a of day.activities) {
        if (a.imageUrl) {
          const localDay = cityDays.indexOf(day) + 1;
          photos.push({
            imageUrl: a.imageUrl,
            title: a.title,
            dayIndex: day.dayIndex,
            dayLabel: `Day ${localDay}`,
            status: a.status,
          });
        }
      }
    }
    // Must-Do first, then Booked, then the rest
    const priority = (s?: string) => s === 'Must Do' ? 0 : s === 'Booked' ? 1 : 2;
    photos.sort((a, b) => priority(a.status) - priority(b.status));
    return photos.slice(0, 6);
  }, [cityDays]);
```

**Step 2: Replace bento grid JSX with horizontal scroll strip**

In `CityOverview.tsx`, replace the entire Section 3: Photo Highlights block (lines 149-208) with:

```tsx
      {/* Section 3: Photo Strip */}
      {photoHighlights.length > 0 && (
        <div className="co-section">
          <div className="co-section-header">
            <h3 className="co-section-title">Highlights</h3>
            {photoHighlights.length >= 4 && (
              <button
                className="co-photo-view-all"
                onClick={() => onOpenLightbox?.(
                  photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })),
                  0,
                )}
              >
                View all
              </button>
            )}
          </div>
          <div className="co-photo-strip">
            {photoHighlights.map((photo, i) => (
              <div
                key={photo.imageUrl}
                className="co-photo-strip-item"
                onClick={() => onOpenLightbox?.(
                  photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })),
                  i,
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox?.(photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })), i);
                  }
                }}
                aria-label={`${photo.title} — click to view photo`}
              >
                <Image
                  src={resizeItineraryImage(photo.imageUrl, 800)}
                  alt={photo.title}
                  fill
                  sizes="280px"
                  loading="lazy"
                  className="co-photo-strip-img"
                  style={{ objectFit: 'cover' }}
                  {...(getBlurDataURL(photo.imageUrl) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(photo.imageUrl) } : {})}
                />
                <div className="co-photo-strip-overlay">
                  <span className="co-photo-title">{photo.title}</span>
                  <button
                    className="co-photo-day-btn"
                    onClick={(e) => { e.stopPropagation(); onDaySelect(photo.dayIndex); }}
                  >
                    {photo.dayLabel} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
```

Note: We removed the Framer Motion `whileInView` stagger animations from individual photos. The strip doesn't need per-item animations — it's a compact, always-visible row. This also improves performance (8 fewer IntersectionObservers).

**Step 3: Delete bento grid CSS and add photo strip CSS**

In `CityOverview.css`, delete everything from the `/* Photo Grid — Bento Layout */` comment (line 146) through the `co-photo-view-all:hover` rule (line 283). Replace with:

```css
/* ============================================================
   Photo Strip — horizontal scroll row
   ============================================================ */

.co-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.co-section-header .co-section-title {
  margin: 0;
}

.co-photo-view-all {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: color 0.2s ease;
}

.co-photo-view-all:hover {
  color: var(--city-color);
}

.co-photo-strip {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 0;
}

.co-photo-strip::-webkit-scrollbar {
  display: none;
}

.co-photo-strip-item {
  position: relative;
  flex: 0 0 280px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
}

.co-photo-strip-img {
  transition: transform 0.6s ease;
  object-fit: cover;
}

.co-photo-strip-item:hover .co-photo-strip-img {
  transform: scale(1.06);
}

.co-photo-strip-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.co-photo-strip-item:hover .co-photo-strip-overlay,
.co-photo-strip-item:focus-visible .co-photo-strip-overlay {
  opacity: 1;
}

.co-photo-strip-item:focus-visible {
  outline: 2px solid var(--city-color);
  outline-offset: 2px;
}
```

**Step 4: Delete bento responsive overrides**

In the `@media (max-width: 1023px)` block, delete the `.co-photo-grid` rules (lines 430-442).

In the `@media (max-width: 640px)` block, delete the `.co-photo-grid` rules (lines 475-482).

Add a mobile size reduction for the strip:

```css
@media (max-width: 640px) {
  .co-photo-strip-item {
    flex: 0 0 220px;
    height: 120px;
  }
}
```

**Step 5: Remove unused Framer Motion import for photo items**

In `CityOverview.tsx`, the `motion` import is still needed for the hero and other sections, so no import changes needed. But verify that no `motion.div` references remain in the photo section.

**Step 6: Verify in browser**

Check at 375px, 768px, 1024px, 1440px widths:
- Photo strip scrolls horizontally
- Photos show title + day overlay on hover
- Clicking opens lightbox
- "View all" button appears when 4+ photos
- Cities with few photos (2-3) show all without needing scroll
- Strip height is consistently 140px (120px mobile)

**Step 7: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.tsx tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): replace bento grid with horizontal photo strip

Replaces 12-column bento grid (120+ lines of data-count CSS templates)
with a horizontal scroll strip (~40 lines). Reduces photo section from
540-720px to 160px. Prioritizes Must-Do activities. Uses lazy loading
and 800w images instead of 1200w."
```

---

## Task 3: Replace Stats Strip with Progress Bar

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:20-28` (delete StatCounter)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:141-147` (replace stats JSX)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:96-131` (replace stats CSS)

**Step 1: Replace StatCounter with ProgressBar component**

In `CityOverview.tsx`, delete the `StatCounter` function (lines 20-28) and replace the stats strip JSX (lines 141-147). Also remove the `useCountUp` import (line 8).

Replace the import line:
```tsx
// Remove: import { useCountUp } from '@/hooks/useCountUp';
// Add:
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
```

Replace the stats strip JSX with:

```tsx
      {/* Section 2: Progress Bar */}
      <div className="co-progress-bar">
        <div className="co-progress-stats">
          <div className="co-progress-ring-wrap">
            <svg className="co-progress-ring" viewBox="0 0 36 36" aria-hidden="true">
              <circle className="co-progress-ring-bg" cx="18" cy="18" r="15.5" />
              <circle
                className="co-progress-ring-fill"
                cx="18" cy="18" r="15.5"
                strokeDasharray={`${totalActivities > 0 ? (bookedCount / totalActivities) * 97.4 : 0} 97.4`}
              />
            </svg>
            <span className="co-progress-ring-label">{totalActivities > 0 ? Math.round((bookedCount / totalActivities) * 100) : 0}%</span>
          </div>
          <div className="co-progress-counts">
            <span className="co-progress-count">
              <CheckCircle2 size={14} />
              <strong>{bookedCount}</strong>/{totalActivities} booked
            </span>
            {mustDoCount > bookedCount && (
              <span className="co-progress-count co-progress-alert">
                <AlertCircle size={14} />
                {mustDoCount - bookedCount} must-dos unbooked
              </span>
            )}
          </div>
          <span className="co-progress-hours">
            <Clock size={14} /> {totalHours}h planned
          </span>
        </div>
        <div className="co-progress-segments" aria-label="Day-by-day booking progress">
          {cityDays.map((day, i) => {
            const dayBooked = day.activities.filter(a => a.status === 'Booked').length;
            const dayTotal = day.activities.length;
            const pct = dayTotal > 0 ? dayBooked / dayTotal : 0;
            return (
              <div
                key={day.dayIndex}
                className="co-progress-segment"
                style={{
                  flex: 1,
                  backgroundColor: dayTotal === 0
                    ? 'var(--border-subtle)'
                    : pct === 1
                      ? 'var(--city-color)'
                      : pct > 0
                        ? 'color-mix(in srgb, var(--city-color) 40%, var(--border-subtle))'
                        : 'var(--border-subtle)',
                }}
                title={`Day ${i + 1}: ${dayBooked}/${dayTotal} booked`}
              />
            );
          })}
        </div>
      </div>
```

**Step 2: Replace stats CSS with progress bar CSS**

In `CityOverview.css`, delete the Stats Strip section (lines 96-131) and replace with:

```css
/* ============================================================
   Progress Bar
   ============================================================ */

.co-progress-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--glass-shadow);
}

.co-progress-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.co-progress-ring-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.co-progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.co-progress-ring-bg {
  fill: none;
  stroke: var(--border-subtle);
  stroke-width: 3;
}

.co-progress-ring-fill {
  fill: none;
  stroke: var(--city-color);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.co-progress-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: 700;
  color: var(--city-color);
  font-variant-numeric: tabular-nums;
}

.co-progress-counts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.co-progress-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.co-progress-count strong {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.co-progress-count svg {
  color: var(--city-color);
  flex-shrink: 0;
}

.co-progress-alert svg {
  color: var(--color-warning, #d97706);
}

.co-progress-hours {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  white-space: nowrap;
}

.co-progress-hours svg {
  color: var(--city-color);
}

.co-progress-segments {
  display: flex;
  gap: 3px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.co-progress-segment {
  border-radius: 2px;
  transition: background-color 0.3s ease;
}
```

**Step 3: Add mobile responsive override**

In the `@media (max-width: 640px)` block, add:

```css
  .co-progress-stats {
    gap: 12px;
  }

  .co-progress-hours {
    display: none;
  }
```

**Step 4: Delete mobile stats override**

In `@media (max-width: 640px)`, delete the `.co-stats-strip` rule:
```css
/* DELETE THIS: */
  .co-stats-strip {
    grid-template-columns: repeat(2, 1fr);
  }
```

**Step 5: Verify in browser**

- Progress ring shows correct percentage (booked/total)
- Segmented bar shows colored segments per day
- "X must-dos unbooked" alert shows only when relevant
- Ring animates on mount (stroke-dasharray transition)
- Responsive at all breakpoints

**Step 6: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.tsx tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): replace stats strip with progress bar

Shows booking progress as ratio (3/12 booked) with SVG ring, alerts
for unbooked must-dos, and per-day segmented bar. Applies goal gradient
effect from behavioral psychology research."
```

---

## Task 4: Enhance Day Cards with Status Dots and Activity Preview

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:211-248` (day cards JSX)
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css:285-357` (day card styles)

**Step 1: Enhance day card JSX with status dots and activity preview**

Replace the Section 4: Day Preview Cards block (lines 211-248) with:

```tsx
      {/* Section 4: Day Preview Cards — enhanced with status + preview */}
      <div className="co-section">
        <h3 className="co-section-title">Your Days</h3>
        <div className="co-day-cards-scroll">
          {cityDays.map((day, localIndex) => {
            const rawThumb = day.activities.find(a => a.imageUrl)?.imageUrl;
            const thumb = rawThumb ? resizeItineraryImage(rawThumb, 400) : undefined;
            const previewTitles = day.activities.slice(0, 2).map(a => a.title).join(', ');
            const statusCounts = {
              booked: day.activities.filter(a => a.status === 'Booked').length,
              mustDo: day.activities.filter(a => a.status === 'Must Do').length,
              optional: day.activities.filter(a => a.status === 'Optional' || !a.status).length,
            };
            return (
              <button
                key={day.dayIndex}
                className="co-day-card"
                onClick={() => onDaySelect(day.dayIndex)}
                aria-label={`Day ${localIndex + 1} — ${day.fullDate}, ${day.activities.length} activities, ${statusCounts.booked} booked`}
              >
                {thumb && (
                  <div className="co-day-card-thumb">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="220px"
                      style={{ objectFit: 'cover' }}
                      {...(getBlurDataURL(thumb) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(thumb) } : {})}
                    />
                  </div>
                )}
                <div className="co-day-card-info">
                  <div className="co-day-card-header">
                    <span className="co-day-card-number">Day {localIndex + 1}</span>
                    <span className="co-day-card-date">{day.date}</span>
                  </div>
                  {previewTitles && (
                    <span className="co-day-card-preview">{previewTitles}</span>
                  )}
                  <div className="co-day-card-footer">
                    <div className="co-day-card-dots" aria-label={`${statusCounts.booked} booked, ${statusCounts.mustDo} must-do, ${statusCounts.optional} optional`}>
                      {day.activities.map(a => (
                        <span
                          key={a.id}
                          className={`co-status-dot ${a.status === 'Booked' ? 'booked' : a.status === 'Must Do' ? 'must-do' : 'optional'}`}
                        />
                      ))}
                    </div>
                    <span className="co-day-card-count">
                      {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
```

**Step 2: Update day card CSS**

Replace the Day Preview Cards section in CSS (lines 285-357) with:

```css
/* ============================================================
   Day Preview Cards — enhanced
   ============================================================ */

.co-day-cards-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 0;
}

.co-day-cards-scroll::-webkit-scrollbar {
  display: none;
}

.co-day-card {
  flex: 0 0 auto;
  width: 220px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-left: 3px solid var(--city-color);
  box-shadow: var(--glass-shadow);
  cursor: pointer;
  scroll-snap-align: start;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.co-day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.co-day-card:focus-visible {
  outline: 2px solid var(--city-color);
  outline-offset: 2px;
}

.co-day-card-thumb {
  position: relative;
  height: 90px;
  overflow: hidden;
}

.co-day-card-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.co-day-card-header {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.co-day-card-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.co-day-card-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.co-day-card-preview {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.co-day-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.co-day-card-dots {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.co-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.co-status-dot.booked {
  background-color: #16a34a;
}

.co-status-dot.must-do {
  background-color: #7c3aed;
}

.co-status-dot.optional {
  background-color: var(--border-subtle);
}

.co-day-card-count {
  font-size: 0.7rem;
  color: var(--city-color);
  font-weight: 600;
  white-space: nowrap;
}
```

**Step 3: Update mobile day card override**

In `@media (max-width: 640px)`, replace the day card rules with:

```css
  .co-day-card {
    width: 180px;
  }

  .co-day-card-thumb {
    height: 70px;
  }
```

**Step 4: Verify in browser**

- Day cards are wider (220px) with more info
- Status dots show correct colors (green=Booked, purple=Must Do, gray=Optional)
- Activity preview text shows first 2 activity titles, truncated with ellipsis
- Footer shows dots + activity count
- Horizontal scroll still works

**Step 5: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.tsx tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): enhance day cards with status dots and activity preview

Day cards now show colored status dots (green=booked, purple=must-do,
gray=optional), first 2 activity titles as preview, and wider layout
(220px) for better information density."
```

---

## Task 5: Reorder Sections (Days before Photos)

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx` (move Section 4 above Section 3)

**Step 1: Move the day cards section above the photo strip section**

In `CityOverview.tsx`, the JSX return order inside `.city-overview` should be:

1. Hero (Section 1) — unchanged
2. Progress Bar (Section 2) — already done
3. **Day Preview Cards** (was Section 4, now Section 3) — move up
4. **Photo Strip** (was Section 3, now Section 4) — move down
5. Quick Info (Section 5) — unchanged
6. Highlight Pills (Section 6) — unchanged

Cut the entire `{/* Section 4: Day Preview Cards */}` block and paste it immediately before the `{/* Section 3: Photo Strip */}` block. Update the comment numbers.

**Step 2: Verify in browser**

- Day cards appear immediately below progress bar
- Photo strip appears below day cards
- Day cards are the first interactive content after progress bar
- Scroll depth feels noticeably shorter

**Step 3: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.tsx
git commit -m "feat(itinerary): reorder sections — days before photos

Moves day cards above photo strip so actionable planning content
appears before decorative imagery. Aligns with research finding
that planning tools should prioritize action over inspiration."
```

---

## Task 6: Map Panel Overview Fix

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx:386-401` (MapPanel props)

**Step 1: Verify current MapPanel behavior in overview mode**

In `Itinerary.tsx` line 388, the MapPanel receives `activities={dayActivities}`. When `activeDay === -1`, `dayActivities` is an empty array (line 196-197). The `allCityActivities` prop (line 389) is already passed.

Check if `MapPanel` already falls back to `allCityActivities` when `activities` is empty. Read `MapPanel.tsx` to confirm.

**Step 2: If MapPanel doesn't show all city activities in overview, pass them as primary**

If the MapPanel only uses the `activities` prop for pin rendering, change line 388 to:

```tsx
            activities={activeDay === -1 ? allCityActivities : dayActivities}
```

Do the same for the MobileMapSheet MapPanel (line 423):

```tsx
            activities={activeDay === -1 ? allCityActivities : dayActivities}
```

**Step 3: Verify in browser**

- Switch to Overview tab for any city
- Map should show all activity pins for that city
- Switch to a specific day — map should show only that day's pins
- Route lines should connect all pins in overview mode

**Step 4: Commit**

```bash
git add tripflow-next/src/components/Itinerary/Itinerary.tsx
git commit -m "fix(itinerary): show all city activity pins on map in overview mode

When activeDay is -1 (overview), passes allCityActivities to MapPanel
instead of empty dayActivities array."
```

---

## Task 7: Mobile Parallax Removal + Reduced Motion

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx:86-98` (hero image motion)

**Step 1: Disable parallax on mobile**

In `CityOverview.tsx`, the hero image uses `style={{ y: yImage }}` for parallax. Wrap the parallax in a mobile-aware check. The simplest approach is to make the motion.div conditionally use the transform:

```tsx
        <motion.div
          className="co-hero-image"
          style={shouldReduceMotion ? undefined : { y: yImage }}
        >
```

Then add a CSS media query to neutralize the transform on mobile. In `CityOverview.css`, add inside the `@media (max-width: 640px)` block:

```css
  .co-hero-image {
    top: 0;
    height: 100%;
  }
```

**Step 2: Verify**

- Desktop: parallax still works
- Mobile (resize to 375px): no parallax, image fills hero
- Reduced motion: no parallax

**Step 3: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.tsx tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "perf(itinerary): disable parallax on mobile and reduced-motion

Parallax has minimal visual benefit at 160px hero height and costs
GPU resources on mobile devices."
```

---

## Task 8: Final Polish and Cleanup

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.css` (gap adjustments)

**Step 1: Tighten section gaps**

Change the root `.city-overview` gap from `32px` to `24px` (we have more sections now, tighter gaps keep total height in budget):

```css
.city-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

**Step 2: Ensure reduced motion covers new elements**

In the `@media (prefers-reduced-motion: reduce)` block, add:

```css
  .co-photo-strip-img {
    transition: none !important;
  }

  .co-progress-ring-fill {
    transition: none !important;
  }
```

**Step 3: Full verification across breakpoints**

Test the complete page at these widths:
- **375px** (iPhone SE/mini): Hero 160px, progress bar compact, day cards 180px scroll, photo strip 220px cards, quick info single column
- **768px** (iPad): Hero 180px, all sections visible
- **1024px** (iPad Pro / small desktop): Hero 200px, full layout with map panel
- **1440px** (desktop): Same as 1024px with more breathing room

For each, check:
- [ ] Total scroll depth < 950px desktop, < 700px mobile
- [ ] Lightbox opens from photo strip
- [ ] Day card clicks navigate to correct day
- [ ] Progress bar shows correct ratios
- [ ] Status dots match activity statuses
- [ ] Keyboard navigation works (Tab through strip items, Enter to open)
- [ ] All 6 cities render correctly
- [ ] Cities with 2-3 photos show strip without empty space
- [ ] Cities with 0 photos hide the strip section

**Step 4: Commit**

```bash
git add tripflow-next/src/components/Itinerary/CityOverview.css
git commit -m "chore(itinerary): polish gaps and reduced-motion for redesign

Tightens section gaps from 32px to 24px and adds reduced-motion
coverage for new photo strip and progress ring animations."
```

---

## Verification Checklist

After all tasks are complete, run through this end-to-end:

1. `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npm run build` — no build errors
2. `npm run dev` — dev server starts
3. Open `http://localhost:3000/trips/asia-2026/itinerary`
4. For each of the 6 cities, verify on the Overview tab:
   - Hero is compact (~200px)
   - Progress bar shows X/Y booked with ring
   - Day cards show status dots + activity preview
   - Photo strip scrolls horizontally
   - Map shows all city pins
5. Switch to Day tabs — verify existing functionality is unchanged
6. Resize browser from 375px to 1440px — no layout breaks
7. Lighthouse performance audit: expect LCP improvement, no new CLS

---

## Critical Files Reference

| File | Role |
|------|------|
| `tripflow-next/src/components/Itinerary/CityOverview.tsx` | Main component — Tasks 1-5, 7 |
| `tripflow-next/src/components/Itinerary/CityOverview.css` | All styles — Tasks 1-5, 7-8 |
| `tripflow-next/src/components/Itinerary/Itinerary.tsx` | Parent orchestrator — Task 6 |
| `tripflow-next/src/lib/itinerary-data.ts` | Data types reference (read-only) |
| `tripflow-next/src/lib/city-colors.ts` | City configs reference (read-only) |
| `tripflow-next/src/components/Itinerary/MapPanel.tsx` | Map component — Task 6 (read to understand props) |
