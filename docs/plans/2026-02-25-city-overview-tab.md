# City Overview Tab — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an immersive "Overview" tab for each city in the itinerary page — a parallax hero, animated stats, photo highlights grid, day preview cards, and quick info bar — so users feel the city before diving into day-by-day planning.

**Architecture:** The Overview tab is a special first tab in the existing `DayNavigator`. When selected (`activeDay === -1`), `Itinerary.tsx` renders a new `<CityOverview />` component instead of `<DayTimeline />`. City data is enriched with taglines, hero images, and quick-info fields. All animations reuse existing Framer Motion patterns from Dashboard/TripDetail.

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, Lucide React, CSS custom properties (city color system), existing UI primitives (Card, Button).

**Design doc:** See brainstorming notes in `/Users/pedro/.claude/plans/imperative-wondering-chipmunk.md` for the full design rationale and alternative approaches (A: Inline Hero, C: Dedicated Route).

---

## Critical Context

- **Git:** All work is in a submodule. Use `git -C "/Volumes/SSD/Dev/Asia Trip/tripflow-next"` for all git commands. `cd` is broken (zoxide).
- **npm:** Must load nvm first: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && npm run build`
- **Branch:** `feat/dashboard-redesign` (continue on this branch)
- **TypeScript check:** `npx tsc --noEmit` from the `tripflow-next` directory
- **Build check:** `npm run build` from the `tripflow-next` directory
- **Exports:** CityNavigator and DayNavigator use **default exports**. ActivityCard, TransitConnector, DayTimeline use **named exports**. Match the pattern for new components.
- **Activity.id** is `string` type, not `number`.
- **Skills:** Use `/frontend-design` skill for visual design quality. Use `/ui-ux-pro-max` skill for design system decisions.

---

## Task 1: Enrich City Data Model

**Files:**
- Modify: `src/lib/city-colors.ts:5-23`

**Step 1: Extend the `CityConfig` interface**

Add these fields to the existing `CityConfig` interface at line 5:

```typescript
export interface CityConfig {
  slug: CitySlug;
  name: string;
  nights: number;
  dateRange: string;
  icon: LucideIcon;
  cssVar: string;
  glowVar: string;
  mutedVar: string;
  // New fields for CityOverview
  tagline: string;
  heroImage: string;
  climate: string;
  transitTip: string;
  budgetRange: string;
  languageTip: string;
  highlights: string[];
}
```

**Step 2: Add data to each city in `CITY_CONFIGS`**

Enrich all 6 cities. Use high-quality Unsplash hero URLs (landscape, 1600w). Here are the values:

| City | Tagline | Climate | Transit | Budget | Language |
|------|---------|---------|---------|--------|----------|
| Shanghai | "Where futurism meets French Concession charm" | "Hot & humid, 28-33°C" | "Metro + walking" | "~$80/day" | "Mandarin · 你好 nǐ hǎo" |
| Hong Kong | "Skyscrapers, street food & harbour lights" | "Tropical, 28-31°C" | "MTR + Star Ferry" | "~$120/day" | "Cantonese · 你好 néih hóu" |
| Osaka | "Japan's kitchen — bold flavours, neon glow" | "Warm & sunny, 26-30°C" | "Metro + walking" | "~$100/day" | "Japanese · こんにちは konnichiwa" |
| Kyoto | "Ancient temples wrapped in bamboo & moss" | "Pleasant, 24-28°C" | "Bus + bicycle" | "~$90/day" | "Japanese · こんにちは konnichiwa" |
| Tokyo | "Neon-lit nights & ancient shrines" | "Clear skies, 24-27°C" | "JR + Metro" | "~$110/day" | "Japanese · こんにちは konnichiwa" |
| Beijing | "Imperial grandeur & hutong hidden gems" | "Dry & clear, 22-26°C" | "Metro + taxi" | "~$70/day" | "Mandarin · 你好 nǐ hǎo" |

Hero images (use these Unsplash URLs at `w=1600`):
- Shanghai: `https://images.unsplash.com/photo-1537531383496-47a782e39c1e?w=1600&auto=format&fit=crop` (The Bund skyline)
- Hong Kong: `https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1600&auto=format&fit=crop` (Victoria Harbour)
- Osaka: `https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1600&auto=format&fit=crop` (Dotonbori)
- Kyoto: `https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1600&auto=format&fit=crop` (Fushimi Inari)
- Tokyo: `https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1600&auto=format&fit=crop` (Shibuya crossing)
- Beijing: `https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&auto=format&fit=crop` (Great Wall)

Highlights (3-4 per city):
- Shanghai: ["The Bund", "Yu Garden", "French Concession", "Nanjing Road"]
- Hong Kong: ["Victoria Peak", "Star Ferry", "Temple Street", "Dim Sum Trail"]
- Osaka: ["Dotonbori", "Osaka Castle", "Shinsekai", "Street Food"]
- Kyoto: ["Fushimi Inari", "Arashiyama", "Kinkaku-ji", "Gion District"]
- Tokyo: ["Shibuya Crossing", "TeamLab", "Tsukiji Outer Market", "Akihabara"]
- Beijing: ["Great Wall", "Forbidden City", "Hutongs", "Temple of Heaven"]

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS (no errors)

**Step 4: Commit**

```bash
git add src/lib/city-colors.ts
git commit -m "feat(itinerary): enrich city configs with tagline, hero, climate, and highlights"
```

---

## Task 2: Add Overview Tab to DayNavigator

**Files:**
- Modify: `src/components/Itinerary/DayNavigator.tsx:1-87`
- Modify: `src/components/Itinerary/DayNavigator.css:1-112`

**Step 1: Update DayNavigator props and add Overview tab**

The DayNavigator currently receives `activeDay: number` and `onDayChange: (dayIndex: number) => void`. We use `-1` as the sentinel for "overview selected."

Update the component to render an Overview tab **before** the day tabs. The Overview tab should:
- Show the city's Lucide icon + the word "Overview"
- Be active when `activeDay === -1`
- Use the same `--tab-color` styling as day tabs
- Call `onDayChange(-1)` on click

In `DayNavigator.tsx`, add the Overview tab button **before** the `{days.map(...)}` block (around line 57). The Overview tab is a `<button>` with `role="tab"`, matching the existing day tab pattern:

```tsx
<button
  role="tab"
  aria-selected={activeDay === -1}
  tabIndex={activeDay === -1 ? 0 : -1}
  className={cn('day-tab overview-tab', activeDay === -1 && 'day-tab-active')}
  style={{
    '--tab-color': `var(${config.cssVar})`,
    '--tab-glow': `var(${config.glowVar})`,
  } as React.CSSProperties}
  onClick={() => onDayChange(-1)}
>
  <CityIcon size={16} />
  <span className="day-tab-number">Overview</span>
  {activeDay === -1 && <span className="day-tab-bar" />}
</button>
```

Where `CityIcon` is `config.icon` (already available as `CITY_CONFIGS[citySlug].icon`). Store it: `const CityIcon = config.icon;`

Also update the keyboard handler to handle arrow navigation including the Overview tab. When on Overview and pressing ArrowRight, go to first day. When on first day and pressing ArrowLeft, go to Overview.

**Step 2: Add CSS for the Overview tab**

In `DayNavigator.css`, add a `.overview-tab` class that gives it a slightly distinct look — maybe a subtle background or different font-weight to set it apart from numbered day tabs:

```css
.overview-tab {
  gap: 4px;
  flex-direction: row;
  font-weight: 600;
  padding: 8px 20px 12px;
}

.overview-tab svg {
  opacity: 0.7;
}

.overview-tab.day-tab-active svg {
  opacity: 1;
  color: var(--tab-color);
}
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Itinerary/DayNavigator.tsx src/components/Itinerary/DayNavigator.css
git commit -m "feat(itinerary): add Overview tab to DayNavigator"
```

---

## Task 3: Wire Up Itinerary.tsx for Overview Mode

**Files:**
- Modify: `src/components/Itinerary/Itinerary.tsx:79,123-128,257-278`

**Step 1: Change initial state and city change handler**

In `Itinerary.tsx`:

1. Change initial `activeDay` state to `-1` (line 80):
   ```typescript
   const [activeDay, setActiveDay] = useState(-1);
   ```

2. Update `handleCityChange` (line 123-130) to set `activeDay = -1` instead of `getFirstDayOfCity(city)`:
   ```typescript
   const handleCityChange = useCallback(
     (city: CitySlug) => {
       setActiveCity(city);
       setActiveDay(-1); // Show overview on city switch
       setExpandedActivity(null);
     },
     []
   );
   ```

**Step 2: Add conditional rendering for Overview vs Timeline**

In the content area (around line 257-278), replace the current unconditional `<DayTimeline>` render with a conditional:

```tsx
<AnimatePresence mode="wait">
  {activeDay === -1 ? (
    <motion.div
      key={`overview-${activeCity}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <CityOverview
        citySlug={activeCity}
        cityDays={cityDays}
        onDaySelect={(dayIndex: number) => setActiveDay(dayIndex)}
      />
    </motion.div>
  ) : (
    <motion.div
      key={activeDay}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <DayTimeline
        activities={dayActivities}
        citySlug={activeCity}
        dayLabel={dayLabel}
        onReorder={handleReorder}
        onAutoFill={handleAutoFillDay}
        onOpenSuggestions={() => setIsSuggestionsOpen(true)}
        onAddActivity={() => setIsAddActivityOpen(true)}
        isGenerating={isGeneratingDay}
        expandedActivity={expandedActivity}
        onToggleExpand={setExpandedActivity}
      />
    </motion.div>
  )}
</AnimatePresence>
```

**Step 3: Add CityOverview import**

At the top of `Itinerary.tsx`, add:
```typescript
import { CityOverview } from './CityOverview';
```

**Step 4: Handle DaySummary when in overview mode**

The right panel `DaySummary` currently depends on `currentDay` which uses `allDays[activeDay]`. When `activeDay === -1`, this will be undefined. Guard it:

```tsx
{activeDay >= 0 && currentDay && (
  <DaySummary ... />
)}
```

Or alternatively, show a city-level summary when in overview mode. For now, just hide DaySummary when in overview mode — the CityOverview component itself provides the city context.

**Step 5: Run TypeScript check**

This will fail because `CityOverview` doesn't exist yet. That's expected — create a minimal stub:

Create `src/components/Itinerary/CityOverview.tsx`:
```tsx
"use client"

import React from 'react';
import type { CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
}

export const CityOverview: React.FC<CityOverviewProps> = ({
  citySlug,
  cityDays,
  onDaySelect,
}) => {
  return (
    <div className="city-overview">
      <p>City Overview for {citySlug} — coming soon</p>
    </div>
  );
};
```

Run: `npx tsc --noEmit`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Itinerary/Itinerary.tsx src/components/Itinerary/CityOverview.tsx
git commit -m "feat(itinerary): wire overview mode into Itinerary with CityOverview stub"
```

---

## Task 4: Build CityOverview — Parallax Hero

**Files:**
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Create: `src/components/Itinerary/CityOverview.css`

This is the core visual task. Use the `/frontend-design` skill for bold, distinctive visual design — not generic AI slop.

**Step 1: Build the parallax hero section**

Replace the stub `CityOverview.tsx` with a full component. The hero section follows the TripDetail parallax pattern (`useScroll` + `useTransform` from Framer Motion).

Structure:
```tsx
"use client"

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Moon } from 'lucide-react';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import './CityOverview.css';

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
}

export const CityOverview: React.FC<CityOverviewProps> = ({
  citySlug,
  cityDays,
  onDaySelect,
}) => {
  const config = CITY_CONFIGS[citySlug];
  const CityIcon = config.icon;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacityOverlay = useTransform(scrollYProgress, [0, 1], [0.3, 0.7]);

  return (
    <div className="city-overview" style={getCityStyle(citySlug)}>
      {/* Section 1: Parallax Hero */}
      <div className="co-hero" ref={containerRef}>
        <motion.div
          className="co-hero-image"
          style={{
            backgroundImage: `url(${config.heroImage})`,
            y: yImage,
          }}
        />
        <motion.div className="co-hero-overlay" style={{ opacity: opacityOverlay }} />
        <div className="co-hero-content">
          <div className="co-hero-icon">
            <CityIcon size={32} />
          </div>
          <h2 className="co-hero-title">{config.name}</h2>
          <p className="co-hero-tagline">{config.tagline}</p>
          <div className="co-hero-meta">
            <span className="co-meta-pill">
              <Calendar size={14} /> {config.dateRange}
            </span>
            <span className="co-meta-pill">
              <Moon size={14} /> {config.nights} nights
            </span>
          </div>
        </div>
      </div>

      {/* Sections 2-5 will be added in subsequent tasks */}
    </div>
  );
};
```

**Step 2: Create CityOverview.css with hero styles**

Use the `/frontend-design` skill here. The hero should be:
- Full-width, 350px tall (280px on tablet, 220px on mobile)
- Rounded corners (var(--radius-xl))
- Gradient overlay using city color at bottom
- City name in Playfair Display, 2.5-3rem
- Tagline in Inter, slightly translucent white
- Meta pills with glass effect (backdrop-filter blur)

```css
.city-overview {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Hero */
.co-hero {
  position: relative;
  height: 350px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.co-hero-image {
  position: absolute;
  top: -20%;
  left: 0;
  width: 100%;
  height: 140%;
  background-size: cover;
  background-position: center;
}

.co-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--city-color) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
}

.co-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  color: white;
  z-index: 2;
}

.co-hero-icon {
  margin-bottom: 8px;
  opacity: 0.8;
}

.co-hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  margin: 0 0 4px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.co-hero-tagline {
  font-size: 1.05rem;
  opacity: 0.85;
  margin: 0 0 16px;
  font-weight: 400;
}

.co-hero-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.co-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .co-hero { height: 280px; }
  .co-hero-content { padding: 24px; }
}

@media (max-width: 768px) {
  .co-hero { height: 220px; }
  .co-hero-content { padding: 16px; }
  .co-hero-tagline { font-size: 0.9rem; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .co-hero-image {
    transform: none !important;
  }
}
```

**Step 3: Run TypeScript check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Itinerary/CityOverview.tsx src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): build CityOverview parallax hero section"
```

---

## Task 5: Build Stats Counter Strip

**Files:**
- Create: `src/hooks/useCountUp.ts`
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Modify: `src/components/Itinerary/CityOverview.css`

**Step 1: Create the `useCountUp` hook**

A reusable hook that animates a number from 0 to `target` when the element enters the viewport.

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountUp(target: number, duration: number = 1200): [React.RefObject<HTMLElement | null>, number] {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, target]);

  return [ref, value];
}
```

**Step 2: Add stats section to CityOverview**

Derive stats from `cityDays`:
- Total activities across all days for this city
- Must-Do count (status === 'Must Do')
- Booked count (status === 'Booked')
- Total planned hours (sum of durations / 60)

Add below the hero in `CityOverview.tsx`:

```tsx
// Derive city-level stats
const allActivities = useMemo(
  () => cityDays.flatMap(d => d.activities),
  [cityDays]
);
const totalActivities = allActivities.length;
const mustDoCount = allActivities.filter(a => a.status === 'Must Do').length;
const bookedCount = allActivities.filter(a => a.status === 'Booked').length;
const totalHours = Math.round(allActivities.reduce((sum, a) => sum + a.duration, 0) / 60);
```

Then render:

```tsx
{/* Section 2: Stats Counter Strip */}
<div className="co-stats-strip">
  <StatCounter label="Activities" value={totalActivities} />
  <StatCounter label="Must-Dos" value={mustDoCount} />
  <StatCounter label="Booked" value={bookedCount} />
  <StatCounter label="Hours Planned" value={totalHours} suffix="h" />
</div>
```

Create a small `StatCounter` sub-component inline (no separate file needed):

```tsx
function StatCounter({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  const [ref, animatedValue] = useCountUp(value);
  return (
    <div className="co-stat" ref={ref as React.RefObject<HTMLDivElement>}>
      <span className="co-stat-value">{animatedValue}{suffix}</span>
      <span className="co-stat-label">{label}</span>
    </div>
  );
}
```

**Step 3: Add stats CSS to CityOverview.css**

```css
/* Stats Strip */
.co-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.co-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--glass-shadow);
}

.co-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--city-color);
}

.co-stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .co-stats-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useCountUp.ts src/components/Itinerary/CityOverview.tsx src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): add animated stats counter strip to CityOverview"
```

---

## Task 6: Build Photo Highlights Grid

**Files:**
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Modify: `src/components/Itinerary/CityOverview.css`

**Step 1: Collect photos from activities**

In `CityOverview.tsx`, derive the photo list from city activities that have `imageUrl`:

```tsx
const photoHighlights = useMemo(() => {
  const photos: { imageUrl: string; title: string; dayIndex: number; dayLabel: string }[] = [];
  for (const day of cityDays) {
    for (const a of day.activities) {
      if (a.imageUrl) {
        const localDay = cityDays.indexOf(day) + 1;
        photos.push({
          imageUrl: a.imageUrl,
          title: a.title,
          dayIndex: day.dayIndex,
          dayLabel: `Day ${localDay}`,
        });
      }
    }
  }
  return photos.slice(0, 8); // Max 8 photos
}, [cityDays]);
```

**Step 2: Render the photo grid with stagger animations**

Use Framer Motion `motion.div` with stagger for entrance animation:

```tsx
{/* Section 3: Photo Highlights */}
{photoHighlights.length > 0 && (
  <div className="co-section">
    <h3 className="co-section-title">Highlights</h3>
    <div className="co-photo-grid">
      {photoHighlights.map((photo, i) => (
        <motion.div
          key={photo.imageUrl}
          className="co-photo-item"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          onClick={() => onDaySelect(photo.dayIndex)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDaySelect(photo.dayIndex);
            }
          }}
          aria-label={`${photo.title} — click to view ${photo.dayLabel}`}
        >
          <div
            className="co-photo-img"
            style={{ backgroundImage: `url(${photo.imageUrl})` }}
          />
          <div className="co-photo-overlay">
            <span className="co-photo-title">{photo.title}</span>
            <span className="co-photo-day">{photo.dayLabel}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}
```

**Step 3: Add photo grid CSS**

The grid uses `column-count` for a masonry effect, or a CSS grid with `grid-row: span 2` for taller items. Simpler approach — 2-column grid with alternating tall/short:

```css
/* Section Titles */
.co-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0 0 12px;
}

/* Photo Grid */
.co-photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.co-photo-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4 / 3;
}

.co-photo-item:nth-child(3n + 1) {
  aspect-ratio: 4 / 5; /* Taller every 3rd item */
}

.co-photo-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
}

.co-photo-item:hover .co-photo-img {
  transform: scale(1.06);
}

.co-photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.co-photo-item:hover .co-photo-overlay,
.co-photo-item:focus-visible .co-photo-overlay {
  opacity: 1;
}

.co-photo-title {
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.co-photo-day {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
}

.co-photo-item:focus-visible {
  outline: 2px solid var(--city-color);
  outline-offset: 2px;
}

@media (min-width: 1024px) {
  .co-photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .co-photo-grid {
    grid-template-columns: 1fr;
  }
  .co-photo-item,
  .co-photo-item:nth-child(3n + 1) {
    aspect-ratio: 16 / 9;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .co-photo-img {
    transition: none;
  }
}
```

**Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Itinerary/CityOverview.tsx src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): add photo highlights grid with stagger animations"
```

---

## Task 7: Build Day Preview Cards

**Files:**
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Modify: `src/components/Itinerary/CityOverview.css`

**Step 1: Render horizontal scroll strip of day cards**

Each card shows: day number, date, activity count, and the first activity's image as a thumbnail.

```tsx
{/* Section 4: Day Preview Cards */}
<div className="co-section">
  <h3 className="co-section-title">Your Days</h3>
  <div className="co-day-cards-scroll">
    {cityDays.map((day, localIndex) => {
      const thumb = day.activities.find(a => a.imageUrl)?.imageUrl;
      return (
        <button
          key={day.dayIndex}
          className="co-day-card"
          onClick={() => onDaySelect(day.dayIndex)}
          aria-label={`Day ${localIndex + 1} — ${day.fullDate}, ${day.activities.length} activities`}
        >
          {thumb && (
            <div
              className="co-day-card-thumb"
              style={{ backgroundImage: `url(${thumb})` }}
            />
          )}
          <div className="co-day-card-info">
            <span className="co-day-card-number">Day {localIndex + 1}</span>
            <span className="co-day-card-date">{day.date}</span>
            <span className="co-day-card-count">
              {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
            </span>
          </div>
        </button>
      );
    })}
  </div>
</div>
```

**Step 2: Add CSS for day cards**

```css
/* Day Preview Cards */
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
  width: 160px;
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
  height: 80px;
  background-size: cover;
  background-position: center;
}

.co-day-card-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.co-day-card-count {
  font-size: 0.7rem;
  color: var(--city-color);
  font-weight: 600;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .co-day-card {
    width: 140px;
  }
  .co-day-card-thumb {
    height: 60px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .co-day-card {
    transition: none;
  }
}
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Itinerary/CityOverview.tsx src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): add day preview cards with horizontal scroll"
```

---

## Task 8: Build Quick Info Bar

**Files:**
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Modify: `src/components/Itinerary/CityOverview.css`

**Step 1: Add the quick info section**

Uses the enriched city data from Task 1.

```tsx
{/* Section 5: Quick Info Bar */}
<div className="co-quick-info">
  <div className="co-info-item">
    <Sun size={16} />
    <div>
      <span className="co-info-label">Climate</span>
      <span className="co-info-value">{config.climate}</span>
    </div>
  </div>
  <div className="co-info-item">
    <Train size={16} />
    <div>
      <span className="co-info-label">Getting Around</span>
      <span className="co-info-value">{config.transitTip}</span>
    </div>
  </div>
  <div className="co-info-item">
    <Wallet size={16} />
    <div>
      <span className="co-info-label">Budget</span>
      <span className="co-info-value">{config.budgetRange}</span>
    </div>
  </div>
  <div className="co-info-item">
    <Languages size={16} />
    <div>
      <span className="co-info-label">Language</span>
      <span className="co-info-value">{config.languageTip}</span>
    </div>
  </div>
</div>
```

Import the icons at the top: `Sun, Train, Wallet, Languages` from `lucide-react`.

**Note:** If `Wallet` is not available in Lucide, use `Banknote` or `DollarSign` instead. If `Languages` is not available, use `MessageCircle` or `Globe`. Check what's available and adjust.

**Step 2: Add CSS**

```css
/* Quick Info Bar */
.co-quick-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.co-info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

.co-info-item svg {
  color: var(--city-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.co-info-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

.co-info-value {
  display: block;
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .co-quick-info {
    grid-template-columns: 1fr;
  }
}
```

**Step 3: Also render the city highlights as pill tags below the quick info**

```tsx
{/* Highlights */}
<div className="co-highlights">
  {config.highlights.map(h => (
    <span key={h} className="co-highlight-pill">
      <MapPin size={12} /> {h}
    </span>
  ))}
</div>
```

```css
/* Highlights Pills */
.co-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.co-highlight-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 100px;
  background: var(--city-muted, var(--bg-surface-hover));
  color: var(--city-color);
  font-size: 0.8rem;
  font-weight: 500;
}
```

**Step 4: Run TypeScript check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Itinerary/CityOverview.tsx src/components/Itinerary/CityOverview.css
git commit -m "feat(itinerary): add quick info bar and highlight pills to CityOverview"
```

---

## Task 9: Polish, Responsive, Accessibility

**Files:**
- Modify: `src/components/Itinerary/CityOverview.tsx`
- Modify: `src/components/Itinerary/CityOverview.css`
- Modify: `src/components/Itinerary/DayNavigator.tsx` (if keyboard fixes needed)

**Step 1: Responsive testing**

Verify at all breakpoints:
- **1440px+**: 3-column photo grid, full hero, 2-col quick info
- **1024px**: 2-column photo grid, shorter hero
- **768px**: 1-column everything, compact hero, stacked quick info

**Step 2: Accessibility audit**

- Hero image: add `role="img"` and `aria-label` on the hero container
- Photo grid items: already have `role="button"`, `tabIndex`, keyboard handlers
- Day cards: already have `aria-label`
- Stats: add `aria-live="polite"` on the stats strip so screen readers announce count-up
- Focus-visible: verify all interactive elements show outlines

**Step 3: Reduced motion**

Verify all Framer Motion animations have `prefers-reduced-motion` handling. The hero parallax, photo stagger, and stat counters should all degrade gracefully.

**Step 4: DaySummary sidebar behavior**

When in overview mode (`activeDay === -1`), the DaySummary should either:
- Hide (simplest — already handled in Task 3)
- Or show a city-level summary

For now, keeping it hidden is fine. The CityOverview provides the city context.

**Step 5: Run full build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 6: Commit**

```bash
git add -A
git commit -m "feat(itinerary): polish CityOverview responsive layout and accessibility"
```

---

## Verification

After all 9 tasks are complete:

1. **TypeScript:** `npx tsc --noEmit` — no errors
2. **Build:** `npm run build` — clean production build
3. **Visual inspection:** Run `npm run dev` and check:
   - Navigate to itinerary page
   - Verify Overview tab appears first with city icon
   - Click through all 6 cities — each should show unique hero, stats, photos
   - Click a photo → should navigate to that day's timeline
   - Click a day card → should navigate to that day's tab
   - Switch cities → should always land on Overview tab
   - Resize browser through all breakpoints
4. **Keyboard:** Tab through Overview → Day tabs → photo items → day cards
5. **Reduced motion:** Enable in OS settings, verify no animations
6. **Dark mode:** Toggle theme, verify hero overlays and cards look correct

---

## Alternative Approaches (Reference)

If this design doesn't feel right, the brainstorming doc documents two alternatives:

- **Approach A (Inline Hero):** Strip CityOverview to just the hero section, render it inline above the DayNavigator (no tab changes needed). Quickest.
- **Approach C (Dedicated Route):** Extract CityOverview to its own route `/trips/[tripId]/cities/[citySlug]`. Add navigation from CityNavigator pills. Most immersive.

See: `/Users/pedro/.claude/plans/imperative-wondering-chipmunk.md`
