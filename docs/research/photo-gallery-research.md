# Photo Gallery Research for TripFlow (Next.js 14+ / App Router)

**Date:** 2026-02-26
**Status:** Research complete
**Scope:** Image optimization, gallery patterns, libraries, performance, UX, image sourcing, modern trends

---

## Table of Contents

1. [Next.js Image Optimization](#1-nextjs-image-optimization)
2. [Gallery Layout Patterns](#2-gallery-layout-patterns)
3. [Library Recommendations](#3-library-recommendations)
4. [Performance Strategies](#4-performance-strategies)
5. [UX Patterns for Travel Itinerary Apps](#5-ux-patterns-for-travel-itinerary-apps)
6. [Image Sourcing APIs](#6-image-sourcing-apis)
7. [Modern Trends](#7-modern-trends)
8. [Recommended Stack for TripFlow](#8-recommended-stack-for-tripflow)

---

## 1. Next.js Image Optimization

### The `next/image` Component (Core)

The Next.js `<Image>` component is the foundation. It provides automatic optimization out of the box:

- **Automatic format negotiation**: Serves WebP or AVIF based on the browser's `Accept` header
- **Responsive `srcset` generation**: Automatically creates multiple sizes for different viewports
- **Lazy loading**: Native browser lazy loading by default (`loading="lazy"`)
- **Layout shift prevention**: Requires `width`/`height` or `fill` to reserve space, preventing CLS
- **On-demand optimization**: Images are optimized at request time (not build time), keeping build times fast

### Best Practices

```tsx
// Static import - blur placeholder generated automatically
import heroImage from '@/assets/tokyo-skyline.jpg';

<Image
  src={heroImage}
  alt="Tokyo skyline at sunset"
  placeholder="blur"          // Auto-generated blurDataURL for static imports
  priority                     // For above-the-fold / LCP images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

```tsx
// Remote image - must provide blurDataURL manually
<Image
  src="https://images.unsplash.com/photo-xxx"
  alt="Shanghai Bund"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."  // Tiny base64 placeholder
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"               // Default; omit priority for below-fold images
/>
```

### Key Configuration (next.config.js)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Prefer AVIF, fall back to WebP
    formats: ['image/avif', 'image/webp'],

    // Remote image sources (required for external images)
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],

    // Custom device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Priority vs Lazy Loading

| Scenario | Setting | Why |
|---|---|---|
| Hero/banner image at top of page | `priority` | Triggers eager load + fetchPriority="high" for LCP |
| Gallery thumbnails below the fold | Default (lazy) | Browser loads on scroll approach |
| First 1-2 images in a visible gallery | `priority` | Ensures fast first paint of gallery |
| Lightbox/modal images | Lazy (load on open) | Don't load until user clicks |

---

## 2. Gallery Layout Patterns

### Masonry Layout

**How it works:** Photos arranged in columns of equal width; each photo placed in the shortest column. Creates a Pinterest-style layout with varying row heights.

**Pros for travel apps:**
- Handles mixed aspect ratios naturally (landscape shots, portrait shots, square food photos)
- Visually engaging, feels curated and editorial
- Excellent use of screen real estate

**Cons:**
- Read order is not strictly left-to-right (potential accessibility concern)
- Can look unbalanced with very few images
- More complex to implement responsive breakpoints

**Best for:** Destination overview pages, "highlights" sections, photo collections from a full trip.

### Grid Layout (Uniform)

**How it works:** Equal-sized cells, images cropped to fit via `object-fit: cover`.

**Pros for travel apps:**
- Clean, predictable, easy to scan
- Works well for cards with text overlays (attraction names, dates)
- Simple responsive behavior

**Cons:**
- Crops images, potentially losing important composition
- Less visually dynamic than masonry
- Wastes space with very different aspect ratios

**Best for:** Activity/attraction cards in an itinerary, hotel comparison grids, "places to visit" lists.

### Rows Layout (Justified)

**How it works:** Images arranged in rows of equal height, widths adjusted to fill the row. Like Flickr/Google Photos.

**Pros for travel apps:**
- No cropping - every photo shown in full
- Optimal use of horizontal space
- Feels like a professional photo gallery

**Cons:**
- Last row can look awkward if not enough images to fill it
- Requires knowing image dimensions upfront
- Less predictable per-image sizing

**Best for:** Full trip photo galleries, day-by-day photo journals, photographer-style showcases.

### Carousel/Slider

**How it works:** Horizontal scrolling through images, one or several visible at a time.

**Pros for travel apps:**
- Compact - shows many images in minimal vertical space
- Familiar mobile interaction pattern (swipe)
- Great for previewing content inline

**Cons:**
- Low discoverability (users may not swipe)
- Only shows a few images at once
- Can feel dated if poorly implemented

**Best for:** Inline within itinerary day cards, hotel room previews, "top picks" sections, hero sections.

### Bento Grid

**How it works:** Mixed-size tiles in a grid, some spanning multiple rows/columns. Google Photos style.

**Pros for travel apps:**
- Hero image treatment within a collection
- Creates visual hierarchy (feature photo + supporting shots)
- Trendy, modern feel

**Cons:**
- Complex responsive behavior
- Needs careful curation (which image gets the big tile?)
- Harder to automate layout decisions

**Best for:** City/destination landing pages, trip overview/summary views.

---

## 3. Library Recommendations

### Tier 1: Recommended Stack

#### react-photo-album (Gallery Layouts)

- **Version:** v3+ (ESM-only, React 18+)
- **Layouts:** Rows (justified), columns, masonry
- **Key features:**
  - SSR-friendly (works with Next.js App Router)
  - Responsive images with automatic resolution switching
  - TypeScript-first with full type definitions
  - Rows layout uses Dijkstra's algorithm for optimal row heights
  - Custom render function for `next/image` integration
  - Built for performance with large albums
- **Size:** ~7KB gzipped
- **npm:** 130K+ weekly downloads

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

// Custom renderer to use Next.js Image
function renderNextImage({ photo, imageProps, wrapperStyle }) {
  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

<RowsPhotoAlbum
  photos={photos}
  render={{ image: renderNextImage }}
  defaultContainerWidth={1200}
  targetRowHeight={250}
/>
```

#### yet-another-react-lightbox (Full-Screen Viewer)

- **Version:** v3+
- **Key features:**
  - Plugin architecture (zoom, thumbnails, slideshow, captions, fullscreen, video)
  - First-class Next.js support with `next/image` custom render
  - Dynamic import support (JS loads only on click)
  - Keyboard navigation, touch gestures, pinch-to-zoom
  - Excellent accessibility (ARIA labels, focus management)
  - Animation customization
- **Size:** ~9KB gzipped (core), plugins add ~2-4KB each
- **npm:** 180K+ weekly downloads

```tsx
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Dynamic import for performance (only loads when lightbox opens)
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

<Lightbox
  open={lightboxOpen}
  close={() => setLightboxOpen(false)}
  slides={slides}
  plugins={[Zoom, Thumbnails]}
  render={{
    slide: ({ slide }) => (
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        sizes="100vw"
        priority
      />
    ),
  }}
/>
```

#### Embla Carousel (Inline Carousels)

- **Version:** v8+
- **Key features:**
  - Extremely lightweight (6.3KB min+gzipped, zero dependencies)
  - Fluid drag/swipe with momentum scrolling
  - Library-agnostic core with React wrapper
  - Plugin system (autoplay, auto-scroll, auto-height, fade, class names)
  - Full SSR compatibility
  - Accessibility: proper ARIA attributes, keyboard navigation
  - Loop, align, drag-free, and many customization options
- **npm:** 1.5M+ weekly downloads (the most popular)
- **Note:** Powers shadcn/ui's Carousel component

```tsx
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

function AttractionCarousel({ images }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {images.map((img) => (
          <div className="flex-[0_0_80%] md:flex-[0_0_45%]" key={img.id}>
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Tier 2: Solid Alternatives

#### PhotoSwipe (via react-photoswipe-gallery)

- Battle-tested lightbox (10+ years)
- Excellent gesture handling (pinch, zoom, swipe)
- Dynamic import: JS loads only when user clicks a thumbnail
- Heavier than yet-another-react-lightbox (~20KB)
- React wrapper less actively maintained than YARL
- **Use case:** If gesture fidelity on mobile is the top priority

#### Swiper

- Full-featured slider/carousel with many effects (coverflow, cube, flip)
- Very large bundle (~40KB+ with modules)
- More than needed for most travel gallery use cases
- **Use case:** If you need advanced transition effects (e.g., parallax scrolling hero)

#### lightGallery

- Combined gallery + lightbox in one package
- Video support (YouTube, Vimeo)
- ~25KB gzipped
- Commercial license required for some use cases
- **Use case:** If you need integrated video playback within galleries

### Tier 3: Build Your Own (with Primitives)

For simpler needs, combine:
- CSS Grid / `grid-template-rows: masonry` (Firefox-only as of 2026, behind flag)
- Tailwind CSS grid utilities
- Radix UI Dialog for lightbox modal
- Framer Motion for animations
- Custom Intersection Observer for lazy loading

### Library Comparison Matrix

| Library | Size (gzip) | SSR | Next.js Image | TypeScript | Weekly DL | Maintained |
|---|---|---|---|---|---|---|
| react-photo-album | ~7KB | Yes | Yes (render prop) | Yes | 130K+ | Active |
| yet-another-react-lightbox | ~9KB | Yes | Yes (render prop) | Yes | 180K+ | Active |
| Embla Carousel | ~6KB | Yes | Compatible | Yes | 1.5M+ | Active |
| react-photoswipe-gallery | ~20KB | Partial | Manual | Yes | 50K+ | Moderate |
| Swiper | ~40KB+ | Yes | Compatible | Yes | 2M+ | Active |
| lightGallery | ~25KB | Yes | Compatible | Yes | 50K+ | Active |

---

## 4. Performance Strategies

### Image Loading Strategy

```
Page Load Timeline:
1. HTML arrives -> skeleton placeholders visible
2. CSS loads -> blur-up placeholders render (tiny base64)
3. Above-fold images load (priority) -> replace blur
4. User scrolls -> Intersection Observer triggers lazy images
5. User clicks thumbnail -> dynamic import lightbox JS + load full-res
```

### Responsive Image Sizing

Always provide the `sizes` attribute to avoid downloading oversized images:

```tsx
// Gallery grid: 1 col mobile, 2 col tablet, 3 col desktop
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Full-width hero/banner
sizes="100vw"

// Inline carousel within a card
sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
```

### Virtual Scrolling for Large Galleries (500+ images)

For trip galleries with hundreds of photos, traditional rendering will cause lag:

**Strategy 1: Batch Loading with Intersection Observer**
```tsx
// Load images in batches of 20-30 as user scrolls
// Use a sentinel element near the bottom to trigger next batch
// Works well up to ~500 images
```

**Strategy 2: CSS GPU Acceleration**
```css
.gallery-item {
  transform: translate3d(0, 0, 0); /* Forces GPU rendering */
  will-change: transform;           /* Hint for browser optimization */
}
```

**Strategy 3: Virtualization (1000+ images)**
- Use `@tanstack/react-virtual` or `react-virtuoso` for true virtual scrolling
- Only renders visible items in the DOM
- Essential for full trip photo dumps
- Trade-off: More complex implementation, potential scroll jank if not tuned

**Strategy 4: Pagination / "Load More"**
- Simplest approach for very large sets
- Show 20-40 images, "Load More" button or infinite scroll
- Best for UX clarity in travel apps (users rarely need all 500 at once)

### Image Preloading

```tsx
// Preload the next image in a carousel/lightbox for instant feel
<link rel="preload" as="image" href={nextSlide.src} />

// Or programmatically:
const img = new window.Image();
img.src = nextSlideUrl;
```

### Bundle Size Management

- Dynamic import lightbox components (they're only needed on interaction)
- Tree-shake unused plugins (e.g., don't import Zoom if you don't need it)
- Use `next/dynamic` with `ssr: false` for client-only gallery components

```tsx
const Lightbox = dynamic(
  () => import("yet-another-react-lightbox"),
  { ssr: false }
);

const GalleryWithLightbox = dynamic(
  () => import("@/components/GalleryWithLightbox"),
  {
    ssr: false,
    loading: () => <GallerySkeleton />,
  }
);
```

---

## 5. UX Patterns for Travel Itinerary Apps

### Pattern A: Inline Day Card Carousel

Best for: Day-by-day itinerary view

```
+------------------------------------------+
| Day 3: Shanghai - The Bund & Yu Garden    |
| Sep 29, 2026                              |
|                                           |
| [img1] [img2] [img3] [img4] ->           |
|  ^^^ horizontal scroll/swipe ^^^          |
|                                           |
| 9:00 AM  Morning walk along The Bund     |
| 11:00 AM Yu Garden & Old Town            |
| 1:00 PM  Lunch at Nanxiang Steamed Bun   |
+------------------------------------------+
```

- 3-5 images in an Embla carousel at the top of each day card
- Tap any image to open lightbox with all day photos
- Keeps the itinerary compact while providing visual context
- Mobile: full-width swipeable; Desktop: peek at next image

### Pattern B: Destination Hero + Bento Grid

Best for: City/destination overview pages

```
+------------------------------------------+
|        [  HERO IMAGE - full width  ]      |
|          Shanghai, China                  |
+------------------------------------------+
| [large]     | [small]   |                |
|             | [small]   |                |
| [medium]    | [medium]  |                |
+------------------------------------------+
```

- Large hero image with gradient text overlay
- Bento grid below showing 4-6 highlight photos
- Each photo links to a specific day or attraction
- Click to expand into full gallery/lightbox

### Pattern C: Expandable Gallery Accordion

Best for: Activity detail views

```
+------------------------------------------+
| Yu Garden                                 |
| [thumb1] [thumb2] [thumb3] [+12 more]    |
|                                           |
| v Expand Gallery                          |
+------------------------------------------+
     |  (expanded state)
     v
+------------------------------------------+
| Yu Garden                                 |
| [Masonry grid of all 15 photos]          |
|                                           |
| ^ Collapse Gallery                        |
+------------------------------------------+
```

- Shows 3-4 thumbnail previews inline
- "+N more" badge indicates additional photos
- Expand reveals full masonry gallery
- Maintains page context (user doesn't navigate away)

### Pattern D: Map-Integrated Photo Pins

Best for: Route/map views

- Photos pinned to map locations
- Hovering a pin shows a photo thumbnail popup
- Clicking opens lightbox with all photos from that location
- Great for showing the geographic context of photos

### Pattern E: Timeline Photo Strip

Best for: Trip overview / summary

```
Day 1    Day 2    Day 3    Day 4    ...
  |        |        |        |
[img]    [img]    [img]    [img]
Shanghai  SH      SH      Hong Kong
```

- One representative photo per day
- Horizontal scrollable timeline
- Creates visual narrative of the entire trip
- Tap to jump to that day's full itinerary

### Recommended Combination for TripFlow

1. **Itinerary page (day view):** Pattern A (inline carousel per day)
2. **City landing page:** Pattern B (hero + bento grid)
3. **Activity/attraction detail:** Pattern C (expandable gallery)
4. **Trip overview dashboard:** Pattern E (timeline strip)
5. **All patterns:** Tap any image to open Pattern F (full-screen lightbox via YARL)

---

## 6. Image Sourcing APIs

### Unsplash API

- **Content:** 3M+ high-resolution photos from 300K+ photographers
- **Travel coverage:** Excellent. Strong city, landmark, food, nature, and culture coverage
- **Pricing:** Free for most use cases (50 requests/hour demo, 5,000/hour production)
- **Quality:** Curated, professional-quality images
- **License:** Free to use, no attribution required (but appreciated)
- **Integration:**

```tsx
// Server-side in Next.js App Router
const response = await fetch(
  `https://api.unsplash.com/search/photos?query=tokyo+temple&per_page=10`,
  { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
);
const data = await response.json();
// data.results[].urls.regular, .small, .thumb, .raw
// data.results[].blur_hash  <-- great for placeholders!
```

- **Notable:** Returns `blur_hash` with each photo, which can generate blur-up placeholders client-side using the `blurhash` npm package.

### Pexels API

- **Content:** 1M+ photos and videos
- **Travel coverage:** Good, but less curated than Unsplash
- **Pricing:** Free (200 requests/hour, 20,000/month)
- **Quality:** Mixed (some stock-photo feel, some excellent)
- **License:** Free, no attribution required
- **Integration:**

```tsx
const response = await fetch(
  `https://api.pexels.com/v1/search?query=kyoto+bamboo+forest&per_page=10`,
  { headers: { Authorization: process.env.PEXELS_API_KEY } }
);
// response.photos[].src.original, .large2x, .large, .medium, .small, .tiny
```

### Google Places Photos API (New)

- **Content:** User-contributed photos attached to specific places/businesses
- **Travel coverage:** The most relevant for specific attractions, restaurants, hotels
- **Pricing:** Restructured March 2025. Essentials tier: 10,000 free events/month. Place Photos SKU priced separately from Place Details
- **Quality:** Variable (user photos range from excellent to poor)
- **License:** Google ToS; photos can only be displayed alongside Google Maps content
- **Integration:**

```tsx
// Step 1: Get place details (includes photo references)
const details = await fetch(
  `https://places.googleapis.com/v1/places/${placeId}?fields=photos`,
  { headers: { 'X-Goog-Api-Key': process.env.GOOGLE_PLACES_KEY } }
);

// Step 2: Fetch photo by reference
const photoUrl = `https://places.googleapis.com/v1/${photoRef}/media?maxWidthPx=800&key=${KEY}`;
```

- **Notable:** Best for showing exactly what a specific restaurant, temple, or hotel looks like. Pair with Unsplash for more polished hero/overview images.

### Recommended Sourcing Strategy for TripFlow

| Use Case | Primary Source | Fallback |
|---|---|---|
| City hero/overview images | Unsplash | Pexels |
| Specific attractions/temples | Google Places | Unsplash search |
| Restaurant/food photos | Google Places | Unsplash "food + city" |
| Hotel/accommodation | Google Places | Booking.com images (if available) |
| Generic mood/atmosphere | Unsplash | Pexels |
| User's own photos | Upload/device | N/A |

### Image Caching Strategy

```tsx
// Cache API responses server-side in Next.js
const photos = await fetch(unsplashUrl, {
  next: { revalidate: 86400 }, // Cache for 24 hours
});

// Store photo metadata in your database
// Only fetch from APIs when building/refreshing content
// Serve actual images through next/image (which caches on CDN)
```

---

## 7. Modern Trends

### AVIF/WebP Format Priority

Next.js can serve AVIF first (20% smaller than WebP, 50% smaller than JPEG) with WebP fallback:

```js
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
}
```

- **AVIF:** Best compression, slower to encode (handled server-side by Next.js)
- **WebP:** Universal browser support, good compression
- **JPEG:** Fallback for very old browsers
- **Trade-off:** AVIF encoding takes ~50% longer than WebP, but the size savings are worth it for travel apps with many images

### Blur-Up Loading (Progressive Enhancement)

Three approaches, from simplest to best:

1. **Static imports** (automatic): `placeholder="blur"` on static imports generates blur automatically at build time
2. **BlurHash** (Unsplash provides these): Decode a compact hash string into a blur placeholder client-side (~0.5KB per image)
3. **Tiny base64 LQIP** (Low Quality Image Placeholder): Generate a ~20x20px blurred version, encode as base64, inline as `blurDataURL`

```tsx
// Generating LQIP at build time or in a script
import sharp from 'sharp';

async function generateBlurPlaceholder(imagePath: string) {
  const buffer = await sharp(imagePath)
    .resize(20, 20, { fit: 'inside' })
    .blur()
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}
```

### Skeleton Loading

For galleries where blur placeholders aren't available:

```tsx
function ImageSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full aspect-[4/3]" />
  );
}

// In gallery component
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 9 }).map((_, i) => <ImageSkeleton key={i} />)}
  </div>
) : (
  <PhotoAlbum photos={photos} />
)}
```

### Image CDN Strategies

| Provider | Strengths | Pricing | Best For |
|---|---|---|---|
| **Vercel (built-in)** | Zero config, edge caching, automatic optimization | Included on Pro ($20/mo), pay-per-optimization on scale | Small-medium apps, simplicity |
| **Cloudinary** | AI cropping, real-time transforms, video support, huge feature set | Free tier (25 credits/mo), Plus from $89/mo | Apps needing transformations (crop faces, add overlays) |
| **Imgix** | Pure CDN focus, fast, URL-based transforms | From $100/mo | High-traffic, performance-critical apps |
| **Cloudflare Images** | Lowest cost at scale, global CDN | $5/100K images stored, $1/100K unique transforms | Budget-conscious, high volume |

**Recommendation for TripFlow:** Start with Vercel's built-in optimization. It handles AVIF/WebP negotiation, responsive sizing, and edge caching with zero configuration. Move to Cloudinary only if you need advanced transforms (smart cropping, face detection for group photos, text overlays on images).

### Emerging: CSS Masonry (Native)

- `grid-template-rows: masonry` is in CSS spec (CSS Grid Level 3)
- Currently only available in Firefox behind a flag
- Chrome/Safari implementation TBD (likely 2026-2027)
- Not production-ready yet -- use react-photo-album for now
- When it ships, it will eliminate the need for JS-based masonry calculations

### Emerging: View Transitions API

- Smooth animated transitions between gallery thumbnail and lightbox view
- Supported in Chrome/Edge, coming to Safari
- Can create a "zoom into photo" effect when opening lightbox
- Next.js experimental support via `next/navigation` viewTransition

```tsx
// Experimental - may change
import { useViewTransition } from 'next/navigation';

function GalleryImage({ photo, onClick }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      style={{ viewTransitionName: `photo-${photo.id}` }}
      onClick={() => {
        document.startViewTransition(() => onClick(photo));
      }}
    />
  );
}
```

---

## 8. Recommended Stack for TripFlow

### Core Libraries

| Purpose | Library | Why |
|---|---|---|
| Gallery layouts | `react-photo-album` | Best SSR support, multiple layouts, Next.js Image integration, lightweight |
| Full-screen lightbox | `yet-another-react-lightbox` | Plugin system, dynamic import, same author as react-photo-album (seamless integration) |
| Inline carousels | `embla-carousel-react` | Lightest option, best swipe feel, powers shadcn/ui Carousel |
| Image optimization | `next/image` (built-in) | No added dependency, AVIF/WebP, responsive, blur placeholders |
| Blur placeholders | `sharp` (build script) + `blurhash` (runtime) | Generate LQIP at build; decode Unsplash blur hashes client-side |

### Install Command

```bash
npm install react-photo-album yet-another-react-lightbox embla-carousel-react embla-carousel-autoplay blurhash
```

### Architecture Overview

```
                    Image Sources
                    /     |      \
              Unsplash  Google   User
              API       Places   Upload
                    \     |      /
                     \    |     /
                  Next.js API Routes
                  (cache + normalize)
                         |
                   Image Metadata DB
                   (url, dimensions, blurHash, caption, location)
                         |
            +------------+------------+
            |            |            |
     next/image    react-photo    Embla
     (optimize)    -album (grid)  (carousel)
            |            |            |
            +----+-------+-----+------+
                 |             |
          blur-up loading    lightbox
          (placeholder)      (yet-another-react-lightbox)
                             - dynamic import
                             - zoom, thumbnails, captions
```

### Component Hierarchy

```
<TripGalleryProvider>          // Context: manages photos, lightbox state
  <DestinationHero />          // Full-width hero with next/image + priority
  <DayItineraryCard>
    <InlineCarousel />         // Embla carousel, 3-5 images per day
  </DayItineraryCard>
  <AttractionDetail>
    <ExpandableGallery />      // react-photo-album masonry, expandable
  </AttractionDetail>
  <TripOverview>
    <TimelinePhotoStrip />     // Embla carousel, 1 photo per day
  </TripOverview>
  <GalleryLightbox />          // yet-another-react-lightbox, dynamic import
</TripGalleryProvider>         // Single lightbox instance, opened from anywhere
```

### Performance Budget

| Metric | Target | How |
|---|---|---|
| Gallery JS bundle | < 25KB gzipped | Dynamic imports, tree-shaking |
| LCP (hero image) | < 2.5s | priority prop, AVIF, proper sizes |
| CLS | 0 | Always specify width/height or fill |
| Initial gallery render | < 100ms | SSR grid, lazy images |
| Lightbox open | < 200ms | Preload adjacent slides |
| Image quality | 75-80 | Next.js default (configurable) |

---

## Sources

- [Next.js Image Component Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Image Optimization Guide](https://nextjs.org/docs/app/getting-started/images)
- [React Photo Album](https://react-photo-album.com/)
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)
- [Yet Another React Lightbox - Next.js Example](https://yet-another-react-lightbox.com/examples/nextjs)
- [Embla Carousel](https://www.embla-carousel.com/)
- [Handling 500+ Images in a Gallery with Lazy Loading in Next.js 15](https://www.buildwithmatija.com/blog/handling-500-images-in-a-gallery-with-lazy-loading-in-next-js-15)
- [Building a Fast Animated Image Gallery with Next.js (Vercel)](https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js)
- [Next.js Image Optimization: CDN vs Vercel vs Cloudinary (2025)](https://www.hashbuilds.com/articles/next-js-image-optimization-cdn-vs-vercel-vs-cloudinary-2025)
- [Image Optimization in Next.js (2025): Complete Guide to AVIF-Ready Sites](https://www.launchidea.in/blog/nextjs/image-optimization-nextjs-everything-you-should-know)
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Google Places Photos API (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos)
- [Pexels API](https://www.pexels.com/api/)
- [PhotoSwipe React Gallery](https://photoswipe.com/react-image-gallery/)
- [10 Best Image Gallery Components for React (2026)](https://reactscript.com/best-image-gallery/)
- [Next.js Image Optimization (DebugBear)](https://www.debugbear.com/blog/nextjs-image-optimization)
- [7 Image APIs to Use on Your Product in 2026](https://templated.io/blog/image-apis-to-use-on-your-product/)
