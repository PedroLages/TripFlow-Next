# Itinerary Tab Enhancement — Map, Lightbox & Enriched Cards

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Mapbox GL split-screen map, photo lightbox/carousel, and enriched place metadata to the TripFlow itinerary tab — bringing it to parity with Wanderlog/Airbnb-class travel apps.

**Architecture:** Replace the DaySummary right sidebar with a MapPanel showing city-colored pins + route lines. Add PhotoCarousel on activity cards and a global Lightbox overlay. Extend the Activity type with coordinates, multi-photo arrays, and place metadata. All new fields optional for backward compat.

**Tech Stack:** Next.js 16 / React 19 / Tailwind CSS v4 / Framer Motion 12 / Mapbox GL JS (react-map-gl) / Lucide React / Radix UI / shadcn/ui

---

## Task 1: Install map dependencies

**Files:**
- Modify: `tripflow-next/package.json`

### Step 1: Install packages

Run:
```bash
cd tripflow-next && npm install react-map-gl mapbox-gl
```

### Step 2: Create env placeholder

Run:
```bash
echo 'NEXT_PUBLIC_MAPBOX_TOKEN=' >> tripflow-next/.env.local
echo 'NEXT_PUBLIC_MAPBOX_TOKEN=' >> tripflow-next/.env.example
```

### Step 3: Add your Mapbox token

Get a free token from https://account.mapbox.com/access-tokens/ and add it to `.env.local`:
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijo...your_token_here
```

### Step 4: Verify build

Run: `cd tripflow-next && npm run build`
Expected: BUILD succeeds with no errors.

### Step 5: Commit

```bash
cd tripflow-next && git add package.json package-lock.json .env.example
git commit -m "chore: add react-map-gl and mapbox-gl dependencies"
```

---

## Task 2: Extend Activity type with coordinates, photos, and place metadata

**Files:**
- Modify: `tripflow-next/src/lib/itinerary-data.ts`

### Step 1: Add new interfaces after existing types (line 26)

After the closing `}` of the `Activity` interface, add:

```typescript
export interface PlaceMetadata {
  rating?: number;          // 1.0 - 5.0
  reviewCount?: number;
  openingHours?: string;    // "9:00 AM - 6:00 PM"
  address?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  placeCategory?: string;   // "Temple", "Market", etc.
}

export interface Coordinates {
  lat: number;
  lng: number;
}
```

### Step 2: Extend the Activity interface

Add these optional fields to the existing `Activity` interface (after `transitToNext`):

```typescript
  photos?: string[];          // multiple image URLs for carousel
  coordinates?: Coordinates;  // GPS for map pins
  place?: PlaceMetadata;      // enrichment data
```

Keep the existing `imageUrl` field for backward compat.

### Step 3: Add coordinates + photos + place data to Shanghai Day 0 activities

Update `shanghaiDay0()` — add `coordinates` to every activity, `photos` array to those with images, and `place` metadata to food/activity/shopping types:

```typescript
function shanghaiDay0(): Activity[] {
  return [
    {
      id: 'sh-d0-1',
      time: '10:30 AM',
      title: 'Arrive at Shanghai Pudong',
      type: 'flight',
      duration: 60,
      votes: { up: 5, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'metro', duration: 45 },
      coordinates: { lat: 31.1443, lng: 121.8083 },
    },
    {
      id: 'sh-d0-2',
      time: '01:00 PM',
      title: 'Check in at The Bund area hotel',
      type: 'hotel',
      duration: 60,
      votes: { up: 3, down: 0 },
      comments: [],
      status: 'Booked',
      transitToNext: { method: 'walk', duration: 15 },
      coordinates: { lat: 31.2400, lng: 121.4900 },
    },
    {
      id: 'sh-d0-3',
      time: '02:30 PM',
      title: 'Walk The Bund waterfront',
      type: 'activity',
      duration: 120,
      votes: { up: 12, down: 1 },
      comments: [],
      imageUrl: IMG.bund,
      photos: [IMG.bund, itineraryImage('shanghai-skyline'), itineraryImage('nanjing-road')],
      status: 'Must Do',
      transitToNext: { method: 'walk', duration: 10 },
      coordinates: { lat: 31.2400, lng: 121.4900 },
      place: {
        rating: 4.7,
        reviewCount: 12400,
        openingHours: 'Open 24 hours',
        address: 'Zhongshan East 1st Rd, Huangpu',
        placeCategory: 'Waterfront Promenade',
      },
    },
    {
      id: 'sh-d0-4',
      time: '05:00 PM',
      title: 'Nanjing Road East shopping district',
      type: 'shopping',
      duration: 90,
      votes: { up: 6, down: 2 },
      comments: [],
      imageUrl: IMG.nanjingRoad,
      photos: [IMG.nanjingRoad],
      status: 'Optional',
      coordinates: { lat: 31.2350, lng: 121.4740 },
      place: {
        rating: 4.3,
        reviewCount: 8200,
        openingHours: '10:00 AM - 10:00 PM',
        address: 'Nanjing East Rd, Huangpu',
        priceLevel: 2,
        placeCategory: 'Shopping Street',
      },
    },
  ];
}
```

### Step 4: Add coordinates to all remaining days

Apply the same pattern to all day functions. Key coordinates:

**Shanghai:**
- Yu Garden: `{ lat: 31.2272, lng: 121.4920 }`
- Jia Jia Tang Bao: `{ lat: 31.2355, lng: 121.4688 }`
- French Concession: `{ lat: 31.2100, lng: 121.4400 }`
- Lost Heaven: `{ lat: 31.2150, lng: 121.4450 }`
- Suzhou train: `{ lat: 31.2565, lng: 121.4581 }`
- Humble Admin Garden: `{ lat: 31.3238, lng: 120.6220 }`
- Pingjiang Street: `{ lat: 31.3180, lng: 120.6320 }`
- Shanghai Tower: `{ lat: 31.2335, lng: 121.5016 }`

**Hong Kong:**
- HK Airport: `{ lat: 22.3080, lng: 113.9185 }`
- Tsim Sha Tsui hotel: `{ lat: 22.2988, lng: 114.1722 }`
- Star Ferry Central: `{ lat: 22.2867, lng: 114.1610 }`
- Victoria Peak: `{ lat: 22.2759, lng: 114.1455 }`
- Tim Ho Wan: `{ lat: 22.3210, lng: 114.1690 }`
- Big Buddha: `{ lat: 22.2540, lng: 113.9050 }`
- Temple Street: `{ lat: 22.3050, lng: 114.1700 }`
- Tai O: `{ lat: 22.2517, lng: 113.8622 }`
- HK Museum of Art: `{ lat: 22.2933, lng: 114.1717 }`
- Ozone Bar: `{ lat: 22.3035, lng: 114.1603 }`

**Osaka:**
- KIX Airport: `{ lat: 34.4347, lng: 135.2440 }`
- Dotonbori: `{ lat: 34.6687, lng: 135.5019 }`
- Osaka Castle: `{ lat: 34.6873, lng: 135.5262 }`
- Shinsekai: `{ lat: 34.6524, lng: 135.5063 }`
- Kuromon Market: `{ lat: 34.6627, lng: 135.5070 }`
- Namba: `{ lat: 34.6625, lng: 135.5010 }`

**Kyoto:**
- Kyoto Station: `{ lat: 34.9856, lng: 135.7588 }`
- Fushimi Inari: `{ lat: 34.9671, lng: 135.7727 }`
- Arashiyama Bamboo: `{ lat: 35.0170, lng: 135.6713 }`
- Kinkaku-ji: `{ lat: 35.0394, lng: 135.7292 }`
- Nishiki Market: `{ lat: 35.0050, lng: 135.7648 }`
- Tea ceremony: `{ lat: 35.0032, lng: 135.7780 }`

**Tokyo:**
- Tokyo Station: `{ lat: 35.6812, lng: 139.7671 }`
- Shibuya Crossing: `{ lat: 35.6595, lng: 139.7004 }`
- TeamLab: `{ lat: 35.6601, lng: 139.7301 }`
- Tsukiji: `{ lat: 35.6654, lng: 139.7707 }`

**Beijing:**
- Beijing Airport: `{ lat: 40.0799, lng: 116.6031 }`
- Great Wall Mutianyu: `{ lat: 40.4319, lng: 116.5604 }`
- Forbidden City: `{ lat: 39.9163, lng: 116.3972 }`

Add `place` metadata (rating, reviewCount, openingHours, address, placeCategory) to activities of type `food`, `activity`, and `shopping`. Skip `flight`, `hotel`, `transport`.

Add `photos` arrays to activities that already have `imageUrl` — use the existing image plus 1-2 variants from the `IMG` object or `itineraryImage()`. Activities without images get no `photos` array.

### Step 5: Verify build

Run: `cd tripflow-next && npm run build`
Expected: BUILD succeeds. No visual changes (existing code only reads `imageUrl`, not the new fields yet).

### Step 6: Commit

```bash
cd tripflow-next && git add src/lib/itinerary-data.ts
git commit -m "feat(itinerary): extend Activity type with coordinates, photos, and place metadata"
```

---

## Task 3: PhotoCarousel component

**Files:**
- Create: `tripflow-next/src/components/Itinerary/PhotoCarousel.tsx`
- Create: `tripflow-next/src/components/Itinerary/PhotoCarousel.css`

### Step 1: Create PhotoCarousel.tsx

```typescript
"use client"

import React, { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PhotoCarousel.css';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  onPhotoClick: (index: number) => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, alt, onPhotoClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(index);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(Math.min(newIndex, photos.length - 1));
  }, [photos.length]);

  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div
        className="photo-carousel-single"
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url(${photos[0]})` }}
        onClick={(e) => { e.stopPropagation(); onPhotoClick(0); }}
      />
    );
  }

  return (
    <div className="photo-carousel" onClick={(e) => e.stopPropagation()}>
      <div
        className="photo-carousel-track"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            className="photo-carousel-slide"
            role="img"
            aria-label={`${alt} — photo ${i + 1} of ${photos.length}`}
            style={{ backgroundImage: `url(${photo})` }}
            onClick={() => onPhotoClick(i)}
          />
        ))}
      </div>

      {/* Chevron buttons */}
      {activeIndex > 0 && (
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={() => scrollTo(activeIndex - 1)}
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {activeIndex < photos.length - 1 && (
        <button
          className="carousel-btn carousel-btn-next"
          onClick={() => scrollTo(activeIndex + 1)}
          aria-label="Next photo"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Dot indicators */}
      <div className="carousel-dots">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
```

### Step 2: Create PhotoCarousel.css

```css
/* PhotoCarousel – inline image carousel for ActivityCard */

.photo-carousel {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.photo-carousel-single {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.photo-carousel-single:hover {
  transform: scale(1.03);
}

.photo-carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  height: 100%;
}

.photo-carousel-track::-webkit-scrollbar {
  display: none;
}

.photo-carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  scroll-snap-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.photo-carousel-slide:hover {
  transform: scale(1.03);
}

/* Chevron buttons */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.photo-carousel:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn-prev { left: 8px; }
.carousel-btn-next { right: 8px; }

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* Dot indicators */
.carousel-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.carousel-dot.active {
  background: white;
  transform: scale(1.3);
}
```

### Step 3: Verify build

Run: `cd tripflow-next && npm run build`
Expected: BUILD succeeds.

### Step 4: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/PhotoCarousel.tsx src/components/Itinerary/PhotoCarousel.css
git commit -m "feat(itinerary): add PhotoCarousel component with scroll-snap and dot indicators"
```

---

## Task 4: Lightbox component

**Files:**
- Create: `tripflow-next/src/components/Itinerary/Lightbox.tsx`
- Create: `tripflow-next/src/components/Itinerary/Lightbox.css`

### Step 1: Create Lightbox.tsx

```typescript
"use client"

import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Lightbox.css';

interface LightboxProps {
  isOpen: boolean;
  photos: string[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  photos,
  initialIndex,
  onClose,
  onIndexChange,
}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    if (initialIndex > 0) onIndexChange(initialIndex - 1);
  }, [initialIndex, onIndexChange]);

  const goNext = useCallback(() => {
    if (initialIndex < photos.length - 1) onIndexChange(initialIndex + 1);
  }, [initialIndex, photos.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowLeft': goPrev(); break;
        case 'ArrowRight': goNext(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, goPrev, goNext]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      containerRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;
    const preload = (idx: number) => {
      if (idx >= 0 && idx < photos.length) {
        const img = new Image();
        img.src = photos[idx];
      }
    };
    preload(initialIndex - 1);
    preload(initialIndex + 1);
  }, [isOpen, initialIndex, photos]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          ref={containerRef}
          tabIndex={-1}
        >
          <motion.img
            key={initialIndex}
            className="lightbox-image"
            src={photos[initialIndex]}
            alt={`Photo ${initialIndex + 1} of ${photos.length}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Close button */}
          <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
            <X size={24} />
          </button>

          {/* Navigation */}
          {initialIndex > 0 && (
            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          {initialIndex < photos.length - 1 && (
            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Counter */}
          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {initialIndex + 1} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
```

### Step 2: Create Lightbox.css

```css
/* Lightbox – fullscreen photo viewer */

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  outline: none;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  user-select: none;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-nav-prev { left: 20px; }
.lightbox-nav-next { right: 20px; }

.lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 16px;
  border-radius: 100px;
}
```

### Step 3: Verify build

Run: `cd tripflow-next && npm run build`
Expected: BUILD succeeds.

### Step 4: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/Lightbox.tsx src/components/Itinerary/Lightbox.css
git commit -m "feat(itinerary): add Lightbox component with keyboard nav and focus trap"
```

---

## Task 5: Integrate PhotoCarousel + Lightbox into ActivityCard

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx`

### Step 1: Add lightbox callback to ActivityCard props

In `ActivityCard.tsx`, add to `ActivityCardProps`:

```typescript
onOpenLightbox?: (photos: string[], startIndex: number) => void;
```

### Step 2: Replace the image div with PhotoCarousel

In `ActivityCard.tsx`, replace the image block (lines 88-95):

```typescript
// OLD:
{activity.imageUrl && (
  <div
    className="activity-card-image"
    role="img"
    aria-label={activity.title}
    style={{ backgroundImage: `url(${activity.imageUrl})` }}
  />
)}

// NEW:
{(activity.photos?.length || activity.imageUrl) && (
  <PhotoCarousel
    photos={activity.photos ?? (activity.imageUrl ? [activity.imageUrl] : [])}
    alt={activity.title}
    onPhotoClick={(index) => {
      const allPhotos = activity.photos ?? (activity.imageUrl ? [activity.imageUrl] : []);
      onOpenLightbox?.(allPhotos, index);
    }}
  />
)}
```

Add the import at the top:
```typescript
import { PhotoCarousel } from './PhotoCarousel';
```

### Step 3: Thread lightbox callback through DayTimeline

In `DayTimeline.tsx`, add to `DayTimelineProps`:

```typescript
onOpenLightbox?: (photos: string[], startIndex: number) => void;
```

Pass it down to `ActivityCard`:

```typescript
<ActivityCard
  activity={activity}
  citySlug={citySlug}
  isExpanded={isExpanded}
  isLiveNow={isLiveNow}
  onToggleExpand={() => onToggleExpand(isExpanded ? null : activity.id)}
  onOpenSuggestions={onOpenSuggestions}
  onOpenLightbox={onOpenLightbox}
  index={index}
/>
```

### Step 4: Add lightbox state to Itinerary.tsx

In `Itinerary.tsx`, add state after `expandedActivity`:

```typescript
const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
const [lightboxIndex, setLightboxIndex] = useState(0);

const openLightbox = useCallback((photos: string[], startIndex: number) => {
  setLightboxPhotos(photos);
  setLightboxIndex(startIndex);
  setLightboxOpen(true);
}, []);
```

Add import:
```typescript
import { Lightbox } from './Lightbox';
```

Pass to DayTimeline:
```typescript
<DayTimeline
  ...existing props...
  onOpenLightbox={openLightbox}
/>
```

Render Lightbox at the end (before closing `</motion.div>`):
```typescript
<Lightbox
  isOpen={lightboxOpen}
  photos={lightboxPhotos}
  initialIndex={lightboxIndex}
  onClose={() => setLightboxOpen(false)}
  onIndexChange={setLightboxIndex}
/>
```

### Step 5: Verify visually

Run: `cd tripflow-next && npm run dev`

1. Navigate to itinerary → Shanghai → Day 1
2. Activity "Walk The Bund" should show photo carousel (if photos array was added)
3. Click a photo → lightbox opens fullscreen
4. Arrow keys navigate, Escape closes
5. Drag-reorder still works (carousel doesn't hijack drag)

### Step 6: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/ActivityCard.tsx src/components/Itinerary/DayTimeline.tsx src/components/Itinerary/Itinerary.tsx
git commit -m "feat(itinerary): integrate PhotoCarousel and Lightbox into activity cards"
```

---

## Task 6: Enrich ActivityCard with place metadata

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.css`

### Step 1: Add metadata display to ActivityCard

In `ActivityCard.tsx`, add after the `activity-duration` div (inside `.activity-info`):

```typescript
import { Star, Clock, MapPin as MapPinIcon } from 'lucide-react';
```

```typescript
{activity.place && (
  <div className="activity-metadata">
    {activity.place.rating && (
      <span className="meta-rating">
        <Star size={12} fill="currentColor" /> {activity.place.rating}
        {activity.place.reviewCount && (
          <span className="meta-muted">({activity.place.reviewCount.toLocaleString()})</span>
        )}
      </span>
    )}
    {activity.place.priceLevel && (
      <span className="meta-price">
        {'$'.repeat(activity.place.priceLevel)}
        <span className="meta-muted">{'$'.repeat(4 - activity.place.priceLevel)}</span>
      </span>
    )}
    {activity.place.openingHours && (
      <span className="meta-hours">
        <Clock size={11} /> {activity.place.openingHours}
      </span>
    )}
    {activity.place.address && (
      <span className="meta-address">
        <MapPinIcon size={11} /> {activity.place.address}
      </span>
    )}
  </div>
)}
```

### Step 2: Add metadata CSS to ActivityCard.css

```css
/* Place Metadata */
.activity-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.activity-metadata span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.meta-rating {
  color: #f59e0b;
  font-weight: 600;
}

.meta-muted {
  opacity: 0.4;
  font-weight: 400;
}

.meta-price {
  font-weight: 600;
  color: var(--text-primary);
}

.meta-hours,
.meta-address {
  color: var(--text-tertiary);
}

.meta-address {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Step 3: Verify visually

Run: `cd tripflow-next && npm run dev`

Activities with `place` data should show rating stars, price level, hours, and address below the duration line. Flight/transport cards should remain clean.

### Step 4: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/ActivityCard.tsx src/components/Itinerary/ActivityCard.css
git commit -m "feat(itinerary): add place metadata display to activity cards"
```

---

## Task 7: Lightbox in CityOverview photo grid

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/CityOverview.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx`

### Step 1: Add onOpenLightbox prop to CityOverview

In `CityOverview.tsx`, extend `CityOverviewProps`:

```typescript
interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
  onOpenLightbox?: (photos: string[], startIndex: number) => void;
}
```

### Step 2: Update photo grid click handler

Change the photo grid item's `onClick` (line 152) from navigating to the day to opening the lightbox, and add a small "View Day" overlay button:

```typescript
{photoHighlights.map((photo, i) => (
  <motion.div
    key={photo.imageUrl}
    className="co-photo-item"
    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.08, duration: 0.5 }}
    onClick={() => onOpenLightbox?.(
      photoHighlights.map(p => p.imageUrl),
      i,
    )}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenLightbox?.(photoHighlights.map(p => p.imageUrl), i);
      }
    }}
    aria-label={`${photo.title} — click to view photo`}
  >
    <div className="co-photo-img" style={{ backgroundImage: `url(${photo.imageUrl})` }} />
    <div className="co-photo-overlay">
      <span className="co-photo-title">{photo.title}</span>
      <button
        className="co-photo-day-btn"
        onClick={(e) => { e.stopPropagation(); onDaySelect(photo.dayIndex); }}
      >
        {photo.dayLabel} →
      </button>
    </div>
  </motion.div>
))}
```

### Step 3: Pass onOpenLightbox from Itinerary.tsx

In the `CityOverview` render (line 312-316):

```typescript
<CityOverview
  citySlug={activeCity}
  cityDays={cityDays}
  onDaySelect={(dayIndex: number) => setActiveDay(dayIndex)}
  onOpenLightbox={openLightbox}
/>
```

### Step 4: Verify visually

Click a photo in the city overview → lightbox opens with all city photos. The "Day N →" button still navigates to that day.

### Step 5: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/CityOverview.tsx src/components/Itinerary/Itinerary.tsx
git commit -m "feat(itinerary): add lightbox to CityOverview photo grid"
```

---

## Task 8: CompactDaySummary component

**Files:**
- Create: `tripflow-next/src/components/Itinerary/CompactDaySummary.tsx`
- Create: `tripflow-next/src/components/Itinerary/CompactDaySummary.css`

### Step 1: Create CompactDaySummary.tsx

```typescript
"use client"

import React from 'react';
import { Sparkles, Plus, Sun, Cloud } from 'lucide-react';
import { CITY_CONFIGS, type CitySlug, getCityStyle } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { Button } from '../ui/ButtonLegacy';
import './CompactDaySummary.css';

interface CompactDaySummaryProps {
  day: ItineraryDay;
  citySlug: CitySlug;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

const weatherData: Record<CitySlug, { temp: string; icon: React.ReactNode }> = {
  shanghai: { temp: '32°C', icon: <Sun size={14} /> },
  hongkong: { temp: '31°C', icon: <Cloud size={14} /> },
  osaka: { temp: '29°C', icon: <Sun size={14} /> },
  kyoto: { temp: '28°C', icon: <Sun size={14} /> },
  tokyo: { temp: '27°C', icon: <Sun size={14} /> },
  beijing: { temp: '26°C', icon: <Sun size={14} /> },
};

export const CompactDaySummary: React.FC<CompactDaySummaryProps> = ({
  day,
  citySlug,
  onAutoFill,
  onAddActivity,
  isGenerating,
}) => {
  const activities = day.activities ?? [];
  const totalActivities = activities.length;
  const totalHours = Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / 60);
  const transitMinutes = activities.reduce((sum, a) => sum + (a.transitToNext?.duration || 0), 0);
  const bookedCount = activities.filter(a => a.status === 'Booked').length;
  const weather = weatherData[citySlug];

  return (
    <div className="compact-day-summary" style={getCityStyle(citySlug)}>
      <div className="compact-stats-row">
        <span className="compact-stat"><strong>{totalActivities}</strong> activities</span>
        <span className="compact-stat"><strong>{totalHours}h</strong> planned</span>
        <span className="compact-stat"><strong>{transitMinutes}m</strong> transit</span>
        <span className="compact-stat"><strong>{bookedCount}</strong> booked</span>
        <span className="compact-stat compact-weather">{weather.icon} {weather.temp}</span>
      </div>

      {/* Floating action cluster - positioned by CSS */}
      <div className="compact-actions">
        <button
          className="compact-action-btn"
          onClick={onAutoFill}
          disabled={isGenerating}
          aria-label="AI Auto-fill day"
        >
          <Sparkles size={16} />
        </button>
        <button
          className="compact-action-btn"
          onClick={onAddActivity}
          aria-label="Add activity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
```

### Step 2: Create CompactDaySummary.css

```css
/* CompactDaySummary – glass stats strip overlaid on map panel */

.compact-day-summary {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: color-mix(in srgb, var(--bg-base) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.compact-stats-row {
  display: flex;
  gap: 16px;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.compact-stat strong {
  color: var(--text-primary);
  font-weight: 600;
}

.compact-weather {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.compact-actions {
  position: absolute;
  bottom: auto;
  right: 16px;
  display: flex;
  gap: 8px;
}

.compact-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--bg-base) 90%, transparent);
  backdrop-filter: blur(8px);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.compact-action-btn:hover {
  background: var(--city-color, var(--accent-primary));
  color: white;
  border-color: transparent;
}

.compact-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive — in mobile bottom sheet, make stats wrap */
@media (max-width: 500px) {
  .compact-stats-row {
    flex-wrap: wrap;
    gap: 8px 12px;
  }
}
```

### Step 3: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/CompactDaySummary.tsx src/components/Itinerary/CompactDaySummary.css
git commit -m "feat(itinerary): add CompactDaySummary stats overlay for map panel"
```

---

## Task 9: MapPanel, MapPin, and map-utils

**Files:**
- Create: `tripflow-next/src/lib/map-utils.ts`
- Create: `tripflow-next/src/components/Itinerary/MapPin.tsx`
- Create: `tripflow-next/src/components/Itinerary/MapPanel.tsx`
- Create: `tripflow-next/src/components/Itinerary/MapPanel.css`

### Step 1: Create map-utils.ts

```typescript
import type { Activity } from './itinerary-data';
import type { CitySlug } from './city-colors';

export const CITY_CENTERS: Record<CitySlug, { lat: number; lng: number; zoom: number }> = {
  shanghai: { lat: 31.2304, lng: 121.4737, zoom: 12 },
  hongkong: { lat: 22.3193, lng: 114.1694, zoom: 12 },
  osaka:    { lat: 34.6937, lng: 135.5023, zoom: 12 },
  kyoto:    { lat: 35.0116, lng: 135.7681, zoom: 12.5 },
  tokyo:    { lat: 35.6762, lng: 139.6503, zoom: 11.5 },
  beijing:  { lat: 39.9042, lng: 116.4074, zoom: 11 },
};

/** City color hex values (CSS vars can't be used in Mapbox paint properties) */
export const CITY_COLOR_HEX: Record<CitySlug, string> = {
  shanghai: '#C2185B',
  hongkong: '#E65100',
  osaka:    '#00838F',
  kyoto:    '#558B2F',
  tokyo:    '#283593',
  beijing:  '#BF360C',
};

/** Filter activities that have coordinates */
export function activitiesWithCoords(activities: Activity[]): Activity[] {
  return activities.filter(a => a.coordinates);
}

/** Build a GeoJSON LineString for route lines connecting activities */
export function routeLineGeoJSON(activities: Activity[]): GeoJSON.Feature<GeoJSON.LineString> | null {
  const withCoords = activitiesWithCoords(activities);
  if (withCoords.length < 2) return null;

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: withCoords.map(a => [a.coordinates!.lng, a.coordinates!.lat]),
    },
  };
}

/** Calculate bounding box for fitBounds */
export function getBoundsForActivities(activities: Activity[]): [[number, number], [number, number]] | null {
  const withCoords = activitiesWithCoords(activities);
  if (withCoords.length === 0) return null;

  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const a of withCoords) {
    const { lng, lat } = a.coordinates!;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return [[minLng, minLat], [maxLng, maxLat]];
}
```

### Step 2: Create MapPin.tsx

```typescript
"use client"

import React from 'react';
import { Plane, Hotel, Utensils, Camera, ShoppingBag, Train } from 'lucide-react';
import type { Activity } from '@/lib/itinerary-data';

interface MapPinProps {
  activity: Activity;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function getSmallIcon(type: Activity['type']) {
  const size = 14;
  switch (type) {
    case 'flight': return <Plane size={size} />;
    case 'hotel': return <Hotel size={size} />;
    case 'food': return <Utensils size={size} />;
    case 'activity': return <Camera size={size} />;
    case 'shopping': return <ShoppingBag size={size} />;
    case 'transport': return <Train size={size} />;
    default: return <Camera size={size} />;
  }
}

export const MapPin: React.FC<MapPinProps> = ({
  activity,
  color,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
  const shadow = isSelected || isHovered
    ? `0 0 12px ${color}66`
    : '0 2px 6px rgba(0,0,0,0.3)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: color,
        border: '2.5px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        transform: `scale(${scale}) translateY(${isSelected ? '-4px' : '0'})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: shadow,
      }}
      role="button"
      aria-label={`${activity.title} — ${activity.type}`}
    >
      {getSmallIcon(activity.type)}
    </div>
  );
};
```

### Step 3: Create MapPanel.tsx

```typescript
"use client"

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity, ItineraryDay } from '@/lib/itinerary-data';
import { CITY_CENTERS, CITY_COLOR_HEX, activitiesWithCoords, routeLineGeoJSON, getBoundsForActivities } from '@/lib/map-utils';
import { CompactDaySummary } from './CompactDaySummary';
import { MapPin } from './MapPin';
import './MapPanel.css';

interface MapPanelProps {
  activities: Activity[];
  allCityActivities: Activity[];
  citySlug: CitySlug;
  activeDay: number;         // -1 for overview
  day?: ItineraryDay;
  hoveredActivityId: string | null;
  selectedPinId: string | null;
  onPinClick: (activityId: string) => void;
  onPinHover: (activityId: string | null) => void;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  activities,
  allCityActivities,
  citySlug,
  activeDay,
  day,
  hoveredActivityId,
  selectedPinId,
  onPinClick,
  onPinHover,
  onAutoFill,
  onAddActivity,
  isGenerating,
}) => {
  const mapRef = useRef<MapRef>(null);
  const center = CITY_CENTERS[citySlug];
  const cityColor = CITY_COLOR_HEX[citySlug];

  // Determine which activities to show
  const visibleActivities = useMemo(() => {
    const source = activeDay === -1 ? allCityActivities : activities;
    return activitiesWithCoords(source);
  }, [activities, allCityActivities, activeDay]);

  // Route line GeoJSON (only for day view)
  const routeLine = useMemo(() => {
    if (activeDay === -1) return null;
    return routeLineGeoJSON(activities);
  }, [activities, activeDay]);

  // Fit bounds when activities change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = getBoundsForActivities(
      activeDay === -1 ? allCityActivities : activities
    );

    if (bounds) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 40, left: 40, right: 40 },
        maxZoom: 15,
        duration: 600,
      });
    } else {
      map.flyTo({ center: [center.lng, center.lat], zoom: center.zoom, duration: 600 });
    }
  }, [visibleActivities, activeDay, citySlug, allCityActivities, activities, center]);

  // Dark mode detection
  const [mapStyle, setMapStyle] = React.useState('mapbox://styles/mapbox/light-v11');

  useEffect(() => {
    const updateStyle = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setMapStyle(
        theme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11'
      );
    };
    updateStyle();
    const observer = new MutationObserver(updateStyle);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="map-panel">
      {/* Stats overlay */}
      {day && (
        <CompactDaySummary
          day={{ ...day, activities }}
          citySlug={citySlug}
          onAutoFill={onAutoFill}
          onAddActivity={onAddActivity}
          isGenerating={isGenerating}
        />
      )}

      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: center.zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Route line */}
        {routeLine && (
          <Source type="geojson" data={routeLine}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': cityColor,
                'line-width': 3,
                'line-dasharray': [2, 2],
                'line-opacity': 0.6,
              }}
            />
          </Source>
        )}

        {/* Activity pins */}
        {visibleActivities.map((activity) => (
          <Marker
            key={activity.id}
            longitude={activity.coordinates!.lng}
            latitude={activity.coordinates!.lat}
            anchor="center"
          >
            <MapPin
              activity={activity}
              color={cityColor}
              isSelected={selectedPinId === activity.id}
              isHovered={hoveredActivityId === activity.id}
              onClick={() => onPinClick(activity.id)}
              onMouseEnter={() => onPinHover(activity.id)}
              onMouseLeave={() => onPinHover(null)}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};
```

### Step 4: Create MapPanel.css

```css
/* MapPanel – Mapbox map container */

.map-panel {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.map-panel .mapboxgl-map {
  border-radius: var(--radius-lg);
}

/* Loading skeleton */
.map-panel-skeleton {
  width: 100%;
  height: 100%;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}
```

### Step 5: Verify build

Run: `cd tripflow-next && npm run build`
Expected: BUILD succeeds.

### Step 6: Commit

```bash
cd tripflow-next && git add src/lib/map-utils.ts src/components/Itinerary/MapPin.tsx src/components/Itinerary/MapPanel.tsx src/components/Itinerary/MapPanel.css
git commit -m "feat(itinerary): add MapPanel with Mapbox GL, custom pins, and route lines"
```

---

## Task 10: Wire MapPanel into Itinerary layout (replace DaySummary)

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.css`
- Modify: `tripflow-next/src/components/Itinerary/ActivityCard.tsx`
- Modify: `tripflow-next/src/components/Itinerary/DayTimeline.tsx`

### Step 1: Add map state and refs to Itinerary.tsx

Add new state after the lightbox state:

```typescript
const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
const activityRefs = useRef<Map<string, HTMLElement>>(new Map());
```

Add pin-card sync callbacks:

```typescript
const handlePinClick = useCallback((activityId: string) => {
  setSelectedPinId(activityId);
  setExpandedActivity(activityId);
  const el = activityRefs.current.get(activityId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, []);

const handleActivityHover = useCallback((activityId: string | null) => {
  setHoveredActivityId(activityId);
}, []);
```

Compute allCityActivities for overview mode:

```typescript
const allCityActivities = useMemo(
  () => cityDays.flatMap(d => d.activities),
  [cityDays]
);
```

### Step 2: Replace DaySummary import with MapPanel

Replace:
```typescript
import DaySummary from './DaySummary';
```

With:
```typescript
import dynamic from 'next/dynamic';
const MapPanel = dynamic(
  () => import('./MapPanel').then(mod => ({ default: mod.MapPanel })),
  { ssr: false, loading: () => <div className="map-panel-skeleton">Loading map...</div> }
);
```

### Step 3: Replace the right panel content

Replace the right panel (lines 340-354):

```typescript
{/* Right Panel: Map */}
<div className="itinerary-right-panel">
  <MapPanel
    activities={dayActivities}
    allCityActivities={allCityActivities}
    citySlug={activeCity}
    activeDay={activeDay}
    day={currentDay ? { ...currentDay, activities: dayActivities } : undefined}
    hoveredActivityId={hoveredActivityId}
    selectedPinId={selectedPinId}
    onPinClick={handlePinClick}
    onPinHover={setHoveredActivityId}
    onAutoFill={handleAutoFillDay}
    onAddActivity={() => setIsAddActivityOpen(true)}
    isGenerating={isGeneratingDay}
  />
</div>
```

### Step 4: Add highlight and hover props to DayTimeline and ActivityCard

In `DayTimeline.tsx`, add props:

```typescript
interface DayTimelineProps {
  // ...existing props...
  hoveredActivityId?: string | null;
  selectedPinId?: string | null;
  onActivityHover?: (activityId: string | null) => void;
  activityRefs?: React.MutableRefObject<Map<string, HTMLElement>>;
}
```

Pass to ActivityCard:

```typescript
<ActivityCard
  activity={activity}
  citySlug={citySlug}
  isExpanded={isExpanded}
  isLiveNow={isLiveNow}
  isHighlighted={selectedPinId === activity.id || hoveredActivityId === activity.id}
  onToggleExpand={() => onToggleExpand(isExpanded ? null : activity.id)}
  onOpenSuggestions={onOpenSuggestions}
  onOpenLightbox={onOpenLightbox}
  onHover={onActivityHover}
  ref={(el) => {
    if (el && activityRefs?.current) activityRefs.current.set(activity.id, el);
  }}
  index={index}
/>
```

In `ActivityCard.tsx`, add props and convert to `forwardRef`:

```typescript
interface ActivityCardProps {
  // ...existing props...
  isHighlighted?: boolean;
  onHover?: (activityId: string | null) => void;
}

export const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(({
  activity, citySlug, isExpanded, isLiveNow, isHighlighted,
  onToggleExpand, onOpenSuggestions, onOpenLightbox, onHover, index,
}, ref) => {
  // component body...
  return (
    <div
      ref={ref}
      className={cn('activity-card-wrapper', isHighlighted && 'activity-card-highlighted')}
      style={cityStyle}
      onMouseEnter={() => onHover?.(activity.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* ...rest unchanged */}
    </div>
  );
});
ActivityCard.displayName = 'ActivityCard';
```

### Step 5: Update Itinerary.css grid layout

Replace the `.itinerary-content-split` rule:

```css
.itinerary-content-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
```

Replace the `.itinerary-right-panel` rule:

```css
.itinerary-right-panel {
  position: sticky;
  top: 80px;
  height: calc(100vh - 120px);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
```

### Step 6: Add highlighted card CSS to ActivityCard.css

```css
.activity-card-highlighted .timeline-content-card {
  border-color: var(--city-color);
  box-shadow: 0 0 0 2px var(--city-glow), var(--shadow-md);
}
```

### Step 7: Pass new props from Itinerary.tsx to DayTimeline

```typescript
<DayTimeline
  activities={dayActivities}
  citySlug={activeCity}
  dayLabel={dayLabel}
  onReorder={handleReorder}
  onAutoFill={handleAutoFillDay}
  onOpenSuggestions={() => setIsSuggestionsOpen(true)}
  onAddActivity={() => setIsAddActivityOpen(true)}
  onOpenLightbox={openLightbox}
  isGenerating={isGeneratingDay}
  expandedActivity={expandedActivity}
  onToggleExpand={setExpandedActivity}
  hoveredActivityId={hoveredActivityId}
  selectedPinId={selectedPinId}
  onActivityHover={handleActivityHover}
  activityRefs={activityRefs}
/>
```

### Step 8: Verify visually

Run: `cd tripflow-next && npm run dev`

1. Map appears in right panel with correct Mapbox style
2. Pins at correct GPS locations for the active day
3. Route lines connect pins
4. Click pin → card scrolls into view + border glows
5. Hover card → pin enlarges
6. CityOverview → map shows all city pins
7. Dark mode → map style toggles

### Step 9: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/Itinerary.tsx src/components/Itinerary/Itinerary.css src/components/Itinerary/ActivityCard.tsx src/components/Itinerary/ActivityCard.css src/components/Itinerary/DayTimeline.tsx
git commit -m "feat(itinerary): wire MapPanel into layout replacing DaySummary sidebar"
```

---

## Task 11: Mobile map bottom sheet + FAB

**Files:**
- Create: `tripflow-next/src/components/Itinerary/MobileMapSheet.tsx`
- Create: `tripflow-next/src/components/Itinerary/MobileMapSheet.css`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx`
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.css`

### Step 1: Create MobileMapSheet.tsx

```typescript
"use client"

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './MobileMapSheet.css';

interface MobileMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileMapSheet: React.FC<MobileMapSheetProps> = ({ isOpen, onClose, children }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="map-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="map-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
          >
            <div className="map-sheet-handle" />
            <button className="map-sheet-close" onClick={onClose} aria-label="Close map">
              <X size={20} />
            </button>
            <div className="map-sheet-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
```

### Step 2: Create MobileMapSheet.css

```css
.map-sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
}

.map-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70vh;
  background: var(--bg-base);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  touch-action: none;
}

.map-sheet-handle {
  width: 36px;
  height: 4px;
  background: var(--border-subtle);
  border-radius: 2px;
  margin: 10px auto 6px;
}

.map-sheet-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: color-mix(in srgb, var(--bg-base) 90%, transparent);
  backdrop-filter: blur(8px);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.map-sheet-content {
  height: calc(100% - 28px);
}
```

### Step 3: Add FAB and bottom sheet to Itinerary.tsx

Add state:
```typescript
const [isMapSheetOpen, setIsMapSheetOpen] = useState(false);
```

Add import:
```typescript
import { MobileMapSheet } from './MobileMapSheet';
import { Map as MapIcon } from 'lucide-react';
```

Add before the closing `</motion.div>` of the itinerary container:

```typescript
{/* Mobile Map FAB + Bottom Sheet */}
<button
  className="map-fab"
  onClick={() => setIsMapSheetOpen(true)}
  aria-label="Show map"
  style={{ background: `var(--city-${activeCity})` }}
>
  <MapIcon size={22} />
</button>
<MobileMapSheet isOpen={isMapSheetOpen} onClose={() => setIsMapSheetOpen(false)}>
  <MapPanel
    activities={dayActivities}
    allCityActivities={allCityActivities}
    citySlug={activeCity}
    activeDay={activeDay}
    day={currentDay ? { ...currentDay, activities: dayActivities } : undefined}
    hoveredActivityId={hoveredActivityId}
    selectedPinId={selectedPinId}
    onPinClick={handlePinClick}
    onPinHover={setHoveredActivityId}
    onAutoFill={handleAutoFillDay}
    onAddActivity={() => setIsAddActivityOpen(true)}
    isGenerating={isGeneratingDay}
  />
</MobileMapSheet>
```

### Step 4: Add FAB CSS to Itinerary.css

```css
/* Map FAB — only visible below 1024px */
.map-fab {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 50;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.map-fab:hover {
  transform: scale(1.08);
}

@media (max-width: 1024px) {
  .map-fab {
    display: flex;
  }
}
```

### Step 5: Verify responsive behavior

1. Resize to < 1024px → right panel hides, FAB appears
2. Click FAB → bottom sheet with map opens
3. Drag down → sheet dismisses
4. Click backdrop → sheet closes

### Step 6: Commit

```bash
cd tripflow-next && git add src/components/Itinerary/MobileMapSheet.tsx src/components/Itinerary/MobileMapSheet.css src/components/Itinerary/Itinerary.tsx src/components/Itinerary/Itinerary.css
git commit -m "feat(itinerary): add mobile map FAB and bottom sheet"
```

---

## Verification

Run through this checklist after all tasks are complete:

1. `cd tripflow-next && npm run build` — no errors
2. `npm run dev` → navigate to itinerary tab
3. **Map renders** in right panel with correct Mapbox style (light/dark)
4. **Pins appear** at correct GPS locations for the active day
5. **Route lines** connect pins in chronological order
6. **Click a pin** → left panel scrolls to that activity card, card border glows
7. **Hover an activity card** → map pin enlarges with glow
8. **Select CityOverview** → map zooms out to show all city pins
9. **Click activity photo** → lightbox opens fullscreen
10. **Navigate lightbox** with arrow keys, swipe, buttons. Close with Escape
11. **Multi-photo carousel** on cards — swipe/click through photos
12. **Place metadata** shows on food/activity/shopping cards (rating, hours, address)
13. **Drag-reorder** still works (carousel doesn't hijack drag)
14. **Resize to < 1024px** → right panel hides, FAB appears
15. **Click FAB** → bottom sheet with map, drag-to-dismiss
16. **Dark mode toggle** → map style switches, all components adapt
17. **Keyboard nav** → Tab through elements, lightbox focus trapped
