# Photo System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a multi-provider photo system (Unsplash + Pexels + Google Places) with Supabase caching, responsive WebP generation, and a reusable `PlacePhoto` UI component that replaces all hardcoded image URLs.

**Architecture:** Server Actions fetch photos from APIs with a fallback chain (Unsplash -> Pexels -> empty). Results are cached in Supabase (PostgreSQL metadata + Storage bucket for WebP variants). A `PlacePhoto` React component renders photos with loading skeletons, city-gradient fallbacks, and attribution overlays. React Query hooks manage client-side state with long stale times.

**Tech Stack:** Next.js 16 Server Actions, Supabase (PostgreSQL + Storage), Sharp for WebP processing, React Query, next/image, Zod v4 for API response validation, Vitest for testing.

---

## Phase 1: Types & Foundations

### Task 1: Photo types

**Files:**
- Create: `src/types/photo.ts`

**Step 1: Write the type file**

```typescript
export type PhotoProvider = 'unsplash' | 'pexels' | 'google-places'

export interface PhotoAttribution {
  photographerName: string
  photographerUrl: string
  sourceName: string        // "Unsplash" | "Pexels" | "Google"
  sourceUrl: string
  license: string
}

export interface Photo {
  id: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  alt: string
  attribution: PhotoAttribution
  provider: PhotoProvider
}

export interface PhotoSearchParams {
  query: string
  perPage?: number          // 1-30, default 10
  page?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
}

export interface PlacePhotoParams {
  placeId: string
  maxWidthPx?: number       // default 800
  maxHeightPx?: number
}

export interface PhotoSearchResult {
  photos: Photo[]
  totalResults: number
  page: number
  perPage: number
  provider: PhotoProvider
}

export interface PhotoError {
  code: 'RATE_LIMITED' | 'API_ERROR' | 'NO_RESULTS' | 'ALL_PROVIDERS_FAILED' | 'INVALID_PARAMS'
  message: string
  provider?: PhotoProvider
}

export type PhotoResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: PhotoError }
```

**Step 2: Verify types compile**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx tsc --noEmit src/types/photo.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/photo.ts
git commit -m "feat(photos): add photo system type definitions"
```

---

### Task 2: Zod schemas for API responses

**Files:**
- Create: `src/lib/photo-providers/schemas.ts`

**Step 1: Write the failing test**

Create: `src/lib/photo-providers/__tests__/schemas.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import {
  UnsplashSearchResponseSchema,
  PexelsSearchResponseSchema,
  GooglePlacePhotoMetaSchema,
} from '../schemas'

describe('UnsplashSearchResponseSchema', () => {
  it('parses a valid response', () => {
    const valid = {
      total: 1,
      total_pages: 1,
      results: [{
        id: 'abc123',
        width: 4000,
        height: 3000,
        alt_description: 'A temple',
        description: 'Fushimi Inari',
        urls: {
          raw: 'https://images.unsplash.com/photo-abc?raw',
          full: 'https://images.unsplash.com/photo-abc?full',
          regular: 'https://images.unsplash.com/photo-abc?w=1080',
          small: 'https://images.unsplash.com/photo-abc?w=400',
          thumb: 'https://images.unsplash.com/photo-abc?w=200',
        },
        user: { name: 'Jane Doe', links: { html: 'https://unsplash.com/@jane' } },
        links: { html: 'https://unsplash.com/photos/abc123' },
      }],
    }
    expect(() => UnsplashSearchResponseSchema.parse(valid)).not.toThrow()
  })

  it('rejects missing fields', () => {
    expect(() => UnsplashSearchResponseSchema.parse({ total: 1 })).toThrow()
  })
})

describe('PexelsSearchResponseSchema', () => {
  it('parses a valid response', () => {
    const valid = {
      total_results: 50,
      page: 1,
      per_page: 10,
      photos: [{
        id: 12345,
        width: 4000,
        height: 3000,
        alt: 'A shrine',
        photographer: 'John',
        photographer_url: 'https://www.pexels.com/@john',
        url: 'https://www.pexels.com/photo/12345',
        src: {
          original: 'https://images.pexels.com/photos/12345/original.jpeg',
          large2x: 'https://images.pexels.com/photos/12345/large2x.jpeg',
          large: 'https://images.pexels.com/photos/12345/large.jpeg',
          medium: 'https://images.pexels.com/photos/12345/medium.jpeg',
          small: 'https://images.pexels.com/photos/12345/small.jpeg',
          portrait: 'https://images.pexels.com/photos/12345/portrait.jpeg',
          landscape: 'https://images.pexels.com/photos/12345/landscape.jpeg',
          tiny: 'https://images.pexels.com/photos/12345/tiny.jpeg',
        },
      }],
    }
    expect(() => PexelsSearchResponseSchema.parse(valid)).not.toThrow()
  })
})

describe('GooglePlacePhotoMetaSchema', () => {
  it('parses a valid response', () => {
    const valid = {
      name: 'places/ChIJ/photos/abc',
      widthPx: 4032,
      heightPx: 3024,
      authorAttributions: [{
        displayName: 'Google User',
        uri: 'https://maps.google.com/maps/contrib/123',
        photoUri: 'https://lh3.googleusercontent.com/a/photo',
      }],
    }
    expect(() => GooglePlacePhotoMetaSchema.parse(valid)).not.toThrow()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/schemas.test.ts`
Expected: FAIL — cannot resolve `../schemas`

**Step 3: Write the schemas**

```typescript
import { z } from 'zod'

// --- Unsplash ---

export const UnsplashPhotoSchema = z.object({
  id: z.string(),
  width: z.number(),
  height: z.number(),
  alt_description: z.string().nullable(),
  description: z.string().nullable(),
  urls: z.object({
    raw: z.string().url(),
    full: z.string().url(),
    regular: z.string().url(),
    small: z.string().url(),
    thumb: z.string().url(),
  }),
  user: z.object({
    name: z.string(),
    links: z.object({ html: z.string().url() }),
  }),
  links: z.object({ html: z.string().url() }),
})

export const UnsplashSearchResponseSchema = z.object({
  total: z.number(),
  total_pages: z.number(),
  results: z.array(UnsplashPhotoSchema),
})

export type UnsplashPhoto = z.infer<typeof UnsplashPhotoSchema>

// --- Pexels ---

export const PexelsPhotoSchema = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  photographer: z.string(),
  photographer_url: z.string().url(),
  url: z.string().url(),
  src: z.object({
    original: z.string().url(),
    large2x: z.string().url(),
    large: z.string().url(),
    medium: z.string().url(),
    small: z.string().url(),
    portrait: z.string().url(),
    landscape: z.string().url(),
    tiny: z.string().url(),
  }),
})

export const PexelsSearchResponseSchema = z.object({
  total_results: z.number(),
  page: z.number(),
  per_page: z.number(),
  photos: z.array(PexelsPhotoSchema),
})

export type PexelsPhoto = z.infer<typeof PexelsPhotoSchema>

// --- Google Places ---

export const GooglePlacePhotoMetaSchema = z.object({
  name: z.string(),
  widthPx: z.number(),
  heightPx: z.number(),
  authorAttributions: z.array(z.object({
    displayName: z.string(),
    uri: z.string(),
    photoUri: z.string(),
  })),
})

export type GooglePlacePhotoMeta = z.infer<typeof GooglePlacePhotoMetaSchema>
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/schemas.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/schemas.ts src/lib/photo-providers/__tests__/schemas.test.ts
git commit -m "feat(photos): add Zod schemas for Unsplash, Pexels, Google Places API responses"
```

---

## Phase 2: Rate Limiter & API Clients

### Task 3: Token bucket rate limiter

**Files:**
- Create: `src/lib/photo-providers/rate-limiter.ts`
- Test: `src/lib/photo-providers/__tests__/rate-limiter.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TokenBucketRateLimiter } from '../rate-limiter'

describe('TokenBucketRateLimiter', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('allows requests when tokens available', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 5, refillRate: 1, windowMs: 1000 })
    expect(limiter.tryConsume()).toBe(true)
    expect(limiter.availableTokens()).toBe(4)
  })

  it('blocks when bucket empty', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 2, refillRate: 1, windowMs: 1000 })
    limiter.tryConsume()
    limiter.tryConsume()
    expect(limiter.tryConsume()).toBe(false)
  })

  it('refills tokens over time', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 10, refillRate: 10, windowMs: 1000 })
    // Drain all tokens
    for (let i = 0; i < 10; i++) limiter.tryConsume()
    expect(limiter.tryConsume()).toBe(false)

    // Advance 500ms — should refill 5 tokens (10/sec * 0.5s)
    vi.advanceTimersByTime(500)
    expect(limiter.availableTokens()).toBeGreaterThanOrEqual(4)
    expect(limiter.tryConsume()).toBe(true)
  })

  it('never exceeds maxTokens', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 5, refillRate: 100, windowMs: 1000 })
    vi.advanceTimersByTime(10000)
    expect(limiter.availableTokens()).toBe(5)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/rate-limiter.test.ts`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
export interface RateLimiterConfig {
  maxTokens: number
  refillRate: number     // tokens per second
  windowMs: number
}

export class TokenBucketRateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRateMs: number  // tokens per millisecond

  constructor(config: RateLimiterConfig) {
    this.maxTokens = config.maxTokens
    this.tokens = config.maxTokens
    this.refillRateMs = config.refillRate / 1000
    this.lastRefill = Date.now()
  }

  tryConsume(): boolean {
    this.refill()
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    return false
  }

  availableTokens(): number {
    this.refill()
    return Math.floor(this.tokens)
  }

  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRateMs)
    this.lastRefill = now
  }
}

// Pre-configured limiters
export const unsplashLimiter = new TokenBucketRateLimiter({
  maxTokens: 45, refillRate: 45 / 3600, windowMs: 3_600_000,
})

export const pexelsLimiter = new TokenBucketRateLimiter({
  maxTokens: 180, refillRate: 180 / 3600, windowMs: 3_600_000,
})

export const googlePlacesLimiter = new TokenBucketRateLimiter({
  maxTokens: 16, refillRate: 16 / 60, windowMs: 60_000,
})
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/rate-limiter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/rate-limiter.ts src/lib/photo-providers/__tests__/rate-limiter.test.ts
git commit -m "feat(photos): add token bucket rate limiter for API providers"
```

---

### Task 4: Unsplash client

**Files:**
- Create: `src/lib/photo-providers/unsplash.ts`
- Test: `src/lib/photo-providers/__tests__/unsplash.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UnsplashPhoto } from '../schemas'
import { normalizeUnsplashPhoto } from '../unsplash'

const mockPhoto: UnsplashPhoto = {
  id: 'abc123',
  width: 4000,
  height: 3000,
  alt_description: 'A temple in Kyoto',
  description: 'Fushimi Inari',
  urls: {
    raw: 'https://images.unsplash.com/photo-abc?raw',
    full: 'https://images.unsplash.com/photo-abc?full',
    regular: 'https://images.unsplash.com/photo-abc?w=1080',
    small: 'https://images.unsplash.com/photo-abc?w=400',
    thumb: 'https://images.unsplash.com/photo-abc?w=200',
  },
  user: { name: 'Jane Doe', links: { html: 'https://unsplash.com/@jane' } },
  links: { html: 'https://unsplash.com/photos/abc123' },
}

describe('normalizeUnsplashPhoto', () => {
  it('transforms to Photo shape', () => {
    const photo = normalizeUnsplashPhoto(mockPhoto)
    expect(photo.id).toBe('unsplash-abc123')
    expect(photo.url).toBe(mockPhoto.urls.regular)
    expect(photo.thumbnailUrl).toBe(mockPhoto.urls.small)
    expect(photo.provider).toBe('unsplash')
  })

  it('includes UTM params in attribution URLs', () => {
    const photo = normalizeUnsplashPhoto(mockPhoto)
    expect(photo.attribution.photographerUrl).toContain('utm_source=tripflow')
    expect(photo.attribution.sourceUrl).toContain('utm_source=tripflow')
  })

  it('handles null alt_description with fallback to description', () => {
    const photo = normalizeUnsplashPhoto({ ...mockPhoto, alt_description: null })
    expect(photo.alt).toBe('Fushimi Inari')
  })

  it('handles both null alt and description', () => {
    const photo = normalizeUnsplashPhoto({ ...mockPhoto, alt_description: null, description: null })
    expect(photo.alt).toBe('')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/unsplash.test.ts`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
import { UnsplashSearchResponseSchema, type UnsplashPhoto } from './schemas'
import { unsplashLimiter } from './rate-limiter'
import type { Photo, PhotoSearchParams, PhotoSearchResult, PhotoResult } from '@/types/photo'

const UNSPLASH_BASE = 'https://api.unsplash.com'

function getAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set')
  return key
}

export function normalizeUnsplashPhoto(raw: UnsplashPhoto): Photo {
  return {
    id: `unsplash-${raw.id}`,
    url: raw.urls.regular,
    thumbnailUrl: raw.urls.small,
    width: raw.width,
    height: raw.height,
    alt: raw.alt_description ?? raw.description ?? '',
    attribution: {
      photographerName: raw.user.name,
      photographerUrl: `${raw.user.links.html}?utm_source=tripflow&utm_medium=referral`,
      sourceName: 'Unsplash',
      sourceUrl: `${raw.links.html}?utm_source=tripflow&utm_medium=referral`,
      license: 'Unsplash License',
    },
    provider: 'unsplash',
  }
}

export async function searchUnsplash(
  params: PhotoSearchParams
): Promise<PhotoResult<PhotoSearchResult>> {
  if (!unsplashLimiter.tryConsume()) {
    return { ok: false, error: { code: 'RATE_LIMITED', message: 'Unsplash rate limit reached', provider: 'unsplash' } }
  }

  const url = new URL(`${UNSPLASH_BASE}/search/photos`)
  url.searchParams.set('query', params.query)
  url.searchParams.set('per_page', String(Math.min(params.perPage ?? 10, 30)))
  url.searchParams.set('page', String(params.page ?? 1))
  if (params.orientation) url.searchParams.set('orientation', params.orientation)

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${getAccessKey()}` },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { ok: false, error: { code: 'API_ERROR', message: `Unsplash ${res.status}: ${res.statusText}`, provider: 'unsplash' } }
    }

    const parsed = UnsplashSearchResponseSchema.parse(await res.json())
    return {
      ok: true,
      data: {
        photos: parsed.results.map(normalizeUnsplashPhoto),
        totalResults: parsed.total,
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
        provider: 'unsplash',
      },
    }
  } catch (err) {
    return { ok: false, error: { code: 'API_ERROR', message: err instanceof Error ? err.message : 'Unknown error', provider: 'unsplash' } }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/unsplash.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/unsplash.ts src/lib/photo-providers/__tests__/unsplash.test.ts
git commit -m "feat(photos): add Unsplash API client with normalizer"
```

---

### Task 5: Pexels client

**Files:**
- Create: `src/lib/photo-providers/pexels.ts`
- Test: `src/lib/photo-providers/__tests__/pexels.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import type { PexelsPhoto } from '../schemas'
import { normalizePexelsPhoto } from '../pexels'

const mockPhoto: PexelsPhoto = {
  id: 12345,
  width: 4000,
  height: 3000,
  alt: 'A shrine in Osaka',
  photographer: 'John Smith',
  photographer_url: 'https://www.pexels.com/@john',
  url: 'https://www.pexels.com/photo/12345',
  src: {
    original: 'https://images.pexels.com/photos/12345/original.jpeg',
    large2x: 'https://images.pexels.com/photos/12345/large2x.jpeg',
    large: 'https://images.pexels.com/photos/12345/large.jpeg',
    medium: 'https://images.pexels.com/photos/12345/medium.jpeg',
    small: 'https://images.pexels.com/photos/12345/small.jpeg',
    portrait: 'https://images.pexels.com/photos/12345/portrait.jpeg',
    landscape: 'https://images.pexels.com/photos/12345/landscape.jpeg',
    tiny: 'https://images.pexels.com/photos/12345/tiny.jpeg',
  },
}

describe('normalizePexelsPhoto', () => {
  it('transforms to Photo shape', () => {
    const photo = normalizePexelsPhoto(mockPhoto)
    expect(photo.id).toBe('pexels-12345')
    expect(photo.url).toBe(mockPhoto.src.large)
    expect(photo.thumbnailUrl).toBe(mockPhoto.src.medium)
    expect(photo.provider).toBe('pexels')
    expect(photo.attribution.sourceName).toBe('Pexels')
  })

  it('uses alt text from source', () => {
    const photo = normalizePexelsPhoto(mockPhoto)
    expect(photo.alt).toBe('A shrine in Osaka')
  })

  it('handles empty alt', () => {
    const photo = normalizePexelsPhoto({ ...mockPhoto, alt: '' })
    expect(photo.alt).toBe('')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/pexels.test.ts`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
import { PexelsSearchResponseSchema, type PexelsPhoto } from './schemas'
import { pexelsLimiter } from './rate-limiter'
import type { Photo, PhotoSearchParams, PhotoSearchResult, PhotoResult } from '@/types/photo'

const PEXELS_BASE = 'https://api.pexels.com/v1'

function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY
  if (!key) throw new Error('PEXELS_API_KEY is not set')
  return key
}

export function normalizePexelsPhoto(raw: PexelsPhoto): Photo {
  return {
    id: `pexels-${raw.id}`,
    url: raw.src.large,
    thumbnailUrl: raw.src.medium,
    width: raw.width,
    height: raw.height,
    alt: raw.alt || '',
    attribution: {
      photographerName: raw.photographer,
      photographerUrl: raw.photographer_url,
      sourceName: 'Pexels',
      sourceUrl: raw.url,
      license: 'Pexels License',
    },
    provider: 'pexels',
  }
}

export async function searchPexels(
  params: PhotoSearchParams
): Promise<PhotoResult<PhotoSearchResult>> {
  if (!pexelsLimiter.tryConsume()) {
    return { ok: false, error: { code: 'RATE_LIMITED', message: 'Pexels rate limit reached', provider: 'pexels' } }
  }

  const url = new URL(`${PEXELS_BASE}/search`)
  url.searchParams.set('query', params.query)
  url.searchParams.set('per_page', String(Math.min(params.perPage ?? 10, 30)))
  url.searchParams.set('page', String(params.page ?? 1))
  if (params.orientation) url.searchParams.set('orientation', params.orientation)

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: getApiKey() },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { ok: false, error: { code: 'API_ERROR', message: `Pexels ${res.status}: ${res.statusText}`, provider: 'pexels' } }
    }

    const parsed = PexelsSearchResponseSchema.parse(await res.json())
    return {
      ok: true,
      data: {
        photos: parsed.photos.map(normalizePexelsPhoto),
        totalResults: parsed.total_results,
        page: parsed.page,
        perPage: parsed.per_page,
        provider: 'pexels',
      },
    }
  } catch (err) {
    return { ok: false, error: { code: 'API_ERROR', message: err instanceof Error ? err.message : 'Unknown error', provider: 'pexels' } }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/pexels.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/pexels.ts src/lib/photo-providers/__tests__/pexels.test.ts
git commit -m "feat(photos): add Pexels API client with normalizer"
```

---

### Task 6: Google Places client

**Files:**
- Create: `src/lib/photo-providers/google-places.ts`
- Test: `src/lib/photo-providers/__tests__/google-places.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import type { GooglePlacePhotoMeta } from '../schemas'
import { normalizeGooglePlacePhoto, buildPlacePhotoUrl } from '../google-places'

const mockMeta: GooglePlacePhotoMeta = {
  name: 'places/ChIJ123/photos/abc',
  widthPx: 4032,
  heightPx: 3024,
  authorAttributions: [{
    displayName: 'Google User',
    uri: 'https://maps.google.com/maps/contrib/123',
    photoUri: 'https://lh3.googleusercontent.com/a/photo',
  }],
}

describe('normalizeGooglePlacePhoto', () => {
  it('transforms to Photo shape', () => {
    const photo = normalizeGooglePlacePhoto(mockMeta, 800)
    expect(photo.id).toBe('google-places/ChIJ123/photos/abc')
    expect(photo.provider).toBe('google-places')
    expect(photo.attribution.photographerName).toBe('Google User')
  })

  it('handles empty authorAttributions', () => {
    const meta = { ...mockMeta, authorAttributions: [] }
    const photo = normalizeGooglePlacePhoto(meta, 800)
    expect(photo.attribution.photographerName).toBe('Google User')
    expect(photo.alt).toBe('')
  })
})

describe('buildPlacePhotoUrl', () => {
  it('constructs correct URL with maxWidthPx', () => {
    // We need to set env var for this test
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'test-key')
    const url = buildPlacePhotoUrl('places/x/photos/y', 800)
    expect(url).toContain('places/x/photos/y/media')
    expect(url).toContain('maxWidthPx=800')
    expect(url).toContain('skipHttpRedirect=true')
    vi.unstubAllEnvs()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/google-places.test.ts`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
import { GooglePlacePhotoMetaSchema, type GooglePlacePhotoMeta } from './schemas'
import { googlePlacesLimiter } from './rate-limiter'
import type { Photo, PhotoResult } from '@/types/photo'

const PLACES_BASE = 'https://places.googleapis.com/v1'

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) throw new Error('GOOGLE_PLACES_API_KEY is not set')
  return key
}

export function buildPlacePhotoUrl(photoName: string, maxWidthPx: number = 800, maxHeightPx?: number): string {
  const params = new URLSearchParams({ key: getApiKey(), maxWidthPx: String(maxWidthPx) })
  if (maxHeightPx) params.set('maxHeightPx', String(maxHeightPx))
  return `${PLACES_BASE}/${photoName}/media?${params.toString()}&skipHttpRedirect=true`
}

export function normalizeGooglePlacePhoto(meta: GooglePlacePhotoMeta, maxWidthPx: number = 800): Photo {
  const firstAuthor = meta.authorAttributions[0]
  return {
    id: `google-${meta.name}`,
    url: buildPlacePhotoUrl(meta.name, maxWidthPx),
    thumbnailUrl: buildPlacePhotoUrl(meta.name, 400),
    width: meta.widthPx,
    height: meta.heightPx,
    alt: firstAuthor?.displayName ? `Photo by ${firstAuthor.displayName}` : '',
    attribution: {
      photographerName: firstAuthor?.displayName ?? 'Google User',
      photographerUrl: firstAuthor?.uri ?? '',
      sourceName: 'Google',
      sourceUrl: firstAuthor?.uri ?? '',
      license: 'Google Places',
    },
    provider: 'google-places',
  }
}

export async function fetchPlacePhotos(
  placeId: string,
  maxPhotos: number = 3
): Promise<PhotoResult<GooglePlacePhotoMeta[]>> {
  if (!googlePlacesLimiter.tryConsume()) {
    return { ok: false, error: { code: 'RATE_LIMITED', message: 'Google Places rate limit reached', provider: 'google-places' } }
  }

  try {
    const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': getApiKey(),
        'X-Goog-FieldMask': 'photos',
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      return { ok: false, error: { code: 'API_ERROR', message: `Google Places ${res.status}: ${res.statusText}`, provider: 'google-places' } }
    }

    const json = await res.json()
    const photos = (json.photos ?? []).slice(0, maxPhotos)
    const parsed = photos.map((p: unknown) => GooglePlacePhotoMetaSchema.parse(p))
    return { ok: true, data: parsed }
  } catch (err) {
    return { ok: false, error: { code: 'API_ERROR', message: err instanceof Error ? err.message : 'Unknown error', provider: 'google-places' } }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/google-places.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/google-places.ts src/lib/photo-providers/__tests__/google-places.test.ts
git commit -m "feat(photos): add Google Places API client with normalizer"
```

---

## Phase 3: Fallback Chain & Server Actions

### Task 7: Fallback chain orchestrator

**Files:**
- Create: `src/lib/photo-providers/fallback-chain.ts`
- Test: `src/lib/photo-providers/__tests__/fallback-chain.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { searchPhotosWithFallback } from '../fallback-chain'
import * as unsplash from '../unsplash'
import * as pexels from '../pexels'
import type { PhotoSearchResult, PhotoResult } from '@/types/photo'

vi.mock('../unsplash')
vi.mock('../pexels')

const mockParams = { query: 'kyoto temples' }
const mockResult: PhotoResult<PhotoSearchResult> = {
  ok: true,
  data: { photos: [{ id: 'test', url: 'https://example.com', thumbnailUrl: '', width: 800, height: 600, alt: '', attribution: { photographerName: 'Test', photographerUrl: '', sourceName: 'Unsplash', sourceUrl: '', license: '' }, provider: 'unsplash' }], totalResults: 1, page: 1, perPage: 10, provider: 'unsplash' },
}
const emptyResult: PhotoResult<PhotoSearchResult> = {
  ok: true,
  data: { photos: [], totalResults: 0, page: 1, perPage: 10, provider: 'unsplash' },
}

describe('searchPhotosWithFallback', () => {
  it('returns Unsplash results when available', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue(mockResult)
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.provider).toBe('unsplash')
  })

  it('falls back to Pexels when Unsplash fails', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue({ ok: false, error: { code: 'RATE_LIMITED', message: 'limit', provider: 'unsplash' } })
    vi.mocked(pexels.searchPexels).mockResolvedValue({ ...mockResult, data: { ...mockResult.ok ? mockResult.data : { photos: [], totalResults: 0, page: 1, perPage: 10, provider: 'pexels' }, provider: 'pexels' } })
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
  })

  it('falls back to Pexels when Unsplash returns empty', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue(emptyResult)
    vi.mocked(pexels.searchPexels).mockResolvedValue(mockResult)
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
  })

  it('returns ALL_PROVIDERS_FAILED when both fail', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue({ ok: false, error: { code: 'API_ERROR', message: 'fail1', provider: 'unsplash' } })
    vi.mocked(pexels.searchPexels).mockResolvedValue({ ok: false, error: { code: 'API_ERROR', message: 'fail2', provider: 'pexels' } })
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('ALL_PROVIDERS_FAILED')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/fallback-chain.test.ts`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
import { searchUnsplash } from './unsplash'
import { searchPexels } from './pexels'
import type { PhotoSearchParams, PhotoSearchResult, PhotoResult, PhotoError } from '@/types/photo'

export async function searchPhotosWithFallback(
  params: PhotoSearchParams
): Promise<PhotoResult<PhotoSearchResult>> {
  const errors: PhotoError[] = []

  // 1. Try Unsplash
  const unsplashResult = await searchUnsplash(params)
  if (unsplashResult.ok && unsplashResult.data.photos.length > 0) {
    return unsplashResult
  }
  if (!unsplashResult.ok) errors.push(unsplashResult.error)

  // 2. Fallback to Pexels
  const pexelsResult = await searchPexels(params)
  if (pexelsResult.ok && pexelsResult.data.photos.length > 0) {
    return pexelsResult
  }
  if (!pexelsResult.ok) errors.push(pexelsResult.error)

  // 3. All failed
  if (errors.length > 0) {
    return {
      ok: false,
      error: {
        code: 'ALL_PROVIDERS_FAILED',
        message: `All providers failed: ${errors.map(e => e.message).join('; ')}`,
      },
    }
  }

  // Both succeeded but empty results
  return {
    ok: true,
    data: { photos: [], totalResults: 0, page: params.page ?? 1, perPage: params.perPage ?? 10, provider: 'unsplash' },
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/lib/photo-providers/__tests__/fallback-chain.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/photo-providers/fallback-chain.ts src/lib/photo-providers/__tests__/fallback-chain.test.ts
git commit -m "feat(photos): add fallback chain (Unsplash -> Pexels -> empty)"
```

---

### Task 8: Server actions + environment variables

**Files:**
- Create: `src/app/actions/photos.ts`
- Modify: `.env.example` — add new env vars
- Modify: `.env.local` — add placeholder keys

**Step 1: Add environment variables to .env.example**

Append:
```
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
GOOGLE_PLACES_API_KEY=
```

**Step 2: Add placeholder values to .env.local**

Append:
```
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
GOOGLE_PLACES_API_KEY=
```

**Step 3: Write server actions**

```typescript
'use server'

import { searchPhotosWithFallback } from '@/lib/photo-providers/fallback-chain'
import { fetchPlacePhotos, normalizeGooglePlacePhoto } from '@/lib/photo-providers/google-places'
import type { PhotoSearchParams, PhotoSearchResult, PlacePhotoParams, Photo, PhotoResult } from '@/types/photo'

export async function searchPhotosAction(
  params: PhotoSearchParams
): Promise<PhotoResult<PhotoSearchResult>> {
  if (!params.query?.trim()) {
    return { ok: false, error: { code: 'INVALID_PARAMS', message: 'Query must not be empty' } }
  }
  if (params.perPage !== undefined && (params.perPage < 1 || params.perPage > 30)) {
    return { ok: false, error: { code: 'INVALID_PARAMS', message: 'perPage must be 1-30' } }
  }
  return searchPhotosWithFallback({ ...params, query: params.query.trim() })
}

export async function getPlacePhotosAction(
  params: PlacePhotoParams
): Promise<PhotoResult<Photo[]>> {
  if (!params.placeId?.trim()) {
    return { ok: false, error: { code: 'INVALID_PARAMS', message: 'placeId must not be empty' } }
  }
  const result = await fetchPlacePhotos(params.placeId)
  if (!result.ok) return result
  const photos = result.data.map(meta => normalizeGooglePlacePhoto(meta, params.maxWidthPx ?? 800))
  return { ok: true, data: photos }
}

export async function getCityPhotoAction(
  cityName: string
): Promise<PhotoResult<Photo | null>> {
  const result = await searchPhotosWithFallback({
    query: `${cityName} city skyline travel`,
    perPage: 1,
    orientation: 'landscape',
  })
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, data: result.data.photos[0] ?? null }
}
```

**Step 4: Commit**

```bash
git add src/app/actions/photos.ts .env.example
git commit -m "feat(photos): add server actions for photo search, place photos, city photos"
```

---

### Task 9: React Query hooks

**Files:**
- Create: `src/hooks/use-photo-search.ts`

**Step 1: Write the hook**

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { searchPhotosAction, getPlacePhotosAction, getCityPhotoAction } from '@/app/actions/photos'
import type { PhotoSearchParams, PlacePhotoParams } from '@/types/photo'

export function usePhotoSearch(params: PhotoSearchParams | null) {
  const query = useQuery({
    queryKey: ['photos', 'search', params?.query, params?.page, params?.perPage, params?.orientation],
    queryFn: () => searchPhotosAction(params!),
    enabled: !!params?.query,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photos: result?.ok ? result.data.photos : [],
    totalResults: result?.ok ? result.data.totalResults : 0,
    provider: result?.ok ? result.data.provider : null,
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}

export function usePlacePhotos(params: PlacePhotoParams | null) {
  const query = useQuery({
    queryKey: ['photos', 'place', params?.placeId],
    queryFn: () => getPlacePhotosAction(params!),
    enabled: !!params?.placeId,
    staleTime: 60 * 60_000,
    gcTime: 2 * 60 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photos: result?.ok ? result.data : [],
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}

export function useCityPhoto(cityName: string | null) {
  const query = useQuery({
    queryKey: ['photos', 'city', cityName],
    queryFn: () => getCityPhotoAction(cityName!),
    enabled: !!cityName,
    staleTime: 24 * 60 * 60_000,
    gcTime: 7 * 24 * 60 * 60_000,
    retry: false,
  })
  const result = query.data
  return {
    photo: result?.ok ? result.data : null,
    error: result && !result.ok ? result.error : null,
    isLoading: query.isPending,
  }
}
```

**Step 2: Verify build**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/hooks/use-photo-search.ts
git commit -m "feat(photos): add React Query hooks for photo search, place photos, city photos"
```

---

## Phase 4: Next.js Config & PlacePhoto Component

### Task 10: Update next.config.ts for remote images

**Files:**
- Modify: `next.config.ts`

**Step 1: Read the current file first, then add images config**

Add `images` block with `remotePatterns` for Unsplash, Pexels, Google, and Supabase Storage. Also add `imageSizes` matching our responsive widths.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'http', hostname: '127.0.0.1', port: '54421' },
    ],
    imageSizes: [400, 800, 1200, 1600],
    formats: ['image/webp'],
  },
};

export default nextConfig;
```

**Step 2: Verify dev server starts**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx next build --no-lint 2>&1 | head -20`
Expected: Build succeeds (or starts without config errors)

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(photos): configure next/image remotePatterns for photo APIs"
```

---

### Task 11: PlacePhoto component

**Files:**
- Create: `src/components/ui/PlacePhoto.tsx`
- Create: `src/components/ui/PlacePhoto.css`
- Test: `src/components/ui/__tests__/PlacePhoto.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlacePhoto } from '../PlacePhoto'

describe('PlacePhoto', () => {
  it('renders image with direct src', () => {
    render(<PlacePhoto src="/images/itinerary/bund-800.webp" alt="The Bund" />)
    const img = screen.getByRole('img', { name: 'The Bund' })
    expect(img).toBeInTheDocument()
  })

  it('renders fallback when no src', () => {
    render(<PlacePhoto alt="Unknown Place" citySlug="tokyo" />)
    expect(screen.getByLabelText('Unknown Place')).toBeInTheDocument()
  })

  it('shows attribution when provided', () => {
    render(
      <PlacePhoto
        src="/test.webp"
        alt="Test"
        attribution={{ photographer: 'Jane', source: 'unsplash', sourceUrl: 'https://unsplash.com' }}
      />
    )
    expect(screen.getByText(/Jane/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/components/ui/__tests__/PlacePhoto.test.tsx`
Expected: FAIL

**Step 3: Write the CSS file**

Create `src/components/ui/PlacePhoto.css`:

```css
.place-photo {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius, 12px);
}

.place-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.place-photo:hover .place-photo-img {
  transform: scale(1.03);
}

/* Loading shimmer */
.place-photo--loading {
  background: var(--bg-surface, #1a1a2e);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.place-photo-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.04) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: photo-shimmer 1.8s ease-in-out infinite;
}

@keyframes photo-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.place-photo-loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-secondary, #888);
  opacity: 0.15;
}

/* Fallback gradient */
.place-photo--fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--city-color, #14b8a6) 12%, var(--bg-surface, #1a1a2e)) 0%,
    color-mix(in srgb, var(--city-color, #14b8a6) 4%, var(--bg-surface, #1a1a2e)) 100%
  );
}

.place-photo-fallback-icon {
  color: var(--city-color, #14b8a6);
  opacity: 0.4;
}

.place-photo-fallback-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #888);
  opacity: 0.6;
  text-align: center;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Attribution overlay */
.place-photo-attribution {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.place-photo:hover .place-photo-attribution {
  opacity: 1;
  pointer-events: auto;
}

.place-photo-attribution a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (hover: none) {
  .place-photo-attribution {
    opacity: 0.5;
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .place-photo-shimmer { animation: none; }
  .place-photo:hover .place-photo-img { transform: none; }
}
```

**Step 4: Write the component**

Create `src/components/ui/PlacePhoto.tsx`:

```tsx
'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { Camera, Plane, Utensils, ShoppingBag, MapPin, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitySlug } from '@/lib/city-colors'
import './PlacePhoto.css'

export interface PlacePhotoAttribution {
  photographer: string
  photographerUrl?: string
  source: 'unsplash' | 'pexels' | 'google' | 'local' | 'user'
  sourceUrl?: string
}

type PlacePhotoSize = 'thumb' | 'card' | 'hero' | 'carousel'

const SIZE_CONFIG: Record<PlacePhotoSize, { width: number; height: number; aspectRatio: string; sizes: string }> = {
  thumb:    { width: 400,  height: 300,  aspectRatio: '4/3',  sizes: '170px' },
  card:     { width: 800,  height: 450,  aspectRatio: '16/9', sizes: '(max-width: 768px) 100vw, 600px' },
  hero:     { width: 1600, height: 900,  aspectRatio: '16/9', sizes: '100vw' },
  carousel: { width: 1200, height: 900,  aspectRatio: '4/3',  sizes: '(max-width: 768px) 100vw, 50vw' },
}

function getIconForType(type?: string) {
  const size = 28
  switch (type) {
    case 'flight': return <Plane size={size} />
    case 'hotel': return <Building size={size} />
    case 'food': return <Utensils size={size} />
    case 'shopping': return <ShoppingBag size={size} />
    default: return <MapPin size={size} />
  }
}

const SOURCE_LABELS: Record<string, string> = {
  unsplash: 'Unsplash',
  pexels: 'Pexels',
  google: 'Google',
}

interface PlacePhotoProps {
  src?: string
  alt: string
  citySlug?: CitySlug
  attribution?: PlacePhotoAttribution
  size?: PlacePhotoSize
  aspectRatio?: string
  showAttribution?: boolean
  onClick?: () => void
  priority?: boolean
  className?: string
  activityType?: string
  isLoading?: boolean
}

export function PlacePhoto({
  src,
  alt,
  citySlug,
  attribution,
  size = 'card',
  aspectRatio: customAspectRatio,
  showAttribution = true,
  onClick,
  priority = false,
  className,
  activityType,
  isLoading = false,
}: PlacePhotoProps) {
  const config = SIZE_CONFIG[size]
  const ratio = customAspectRatio || config.aspectRatio

  const [imgError, setImgError] = useState(false)
  const handleError = useCallback(() => setImgError(true), [])

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('place-photo', 'place-photo--loading', `place-photo--${size}`, className)}
        style={{ aspectRatio: ratio }}
        aria-label={`Loading photo of ${alt}`}
      >
        <div className="place-photo-shimmer" />
        <div className="place-photo-loading-icon">
          <Camera size={size === 'hero' ? 32 : size === 'thumb' ? 16 : 24} />
        </div>
      </div>
    )
  }

  // Fallback state
  if (!src || imgError) {
    return (
      <div
        className={cn('place-photo', 'place-photo--fallback', `place-photo--${size}`, className)}
        style={{ aspectRatio: ratio, '--city-color': citySlug ? `var(--city-${citySlug})` : undefined } as React.CSSProperties}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
        aria-label={alt}
      >
        <div className="place-photo-fallback-icon">
          {getIconForType(activityType)}
        </div>
        <span className="place-photo-fallback-label">{alt}</span>
      </div>
    )
  }

  // Photo state
  return (
    <div
      className={cn('place-photo', `place-photo--${size}`, className)}
      style={{ aspectRatio: ratio }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={config.width}
        height={config.height}
        sizes={config.sizes}
        priority={priority}
        className="place-photo-img"
        onError={handleError}
      />
      {showAttribution && attribution && (
        <div className="place-photo-attribution">
          <span>
            Photo by{' '}
            {attribution.photographerUrl ? (
              <a href={attribution.photographerUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                {attribution.photographer}
              </a>
            ) : attribution.photographer}
            {attribution.source !== 'local' && attribution.source !== 'user' && attribution.sourceUrl && (
              <>
                {' on '}
                <a href={attribution.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  {SOURCE_LABELS[attribution.source] ?? attribution.source}
                </a>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
```

**Step 5: Run test to verify it passes**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run src/components/ui/__tests__/PlacePhoto.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/ui/PlacePhoto.tsx src/components/ui/PlacePhoto.css src/components/ui/__tests__/PlacePhoto.test.tsx
git commit -m "feat(photos): add PlacePhoto component with loading, fallback, and attribution"
```

---

## Phase 5: Run all tests & verify

### Task 12: Full test suite

**Step 1: Run all tests**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx vitest run`
Expected: All tests pass

**Step 2: Verify build compiles**

Run: `cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next && npx next build`
Expected: Build succeeds

---

## Summary of all files

### New files created:
| File | Purpose |
|------|---------|
| `src/types/photo.ts` | Shared photo type definitions |
| `src/lib/photo-providers/schemas.ts` | Zod schemas for API validation |
| `src/lib/photo-providers/rate-limiter.ts` | Token bucket rate limiter |
| `src/lib/photo-providers/unsplash.ts` | Unsplash API client |
| `src/lib/photo-providers/pexels.ts` | Pexels API client |
| `src/lib/photo-providers/google-places.ts` | Google Places API client |
| `src/lib/photo-providers/fallback-chain.ts` | Unsplash -> Pexels fallback |
| `src/app/actions/photos.ts` | Server actions (public API) |
| `src/hooks/use-photo-search.ts` | React Query hooks |
| `src/components/ui/PlacePhoto.tsx` | Reusable photo component |
| `src/components/ui/PlacePhoto.css` | Photo component styles |

### Files modified:
| File | Change |
|------|--------|
| `next.config.ts` | Add `images.remotePatterns` |
| `.env.example` | Add API key placeholders |

### Test files:
| File | Tests |
|------|-------|
| `src/lib/photo-providers/__tests__/schemas.test.ts` | Zod schema validation |
| `src/lib/photo-providers/__tests__/rate-limiter.test.ts` | Token bucket behavior |
| `src/lib/photo-providers/__tests__/unsplash.test.ts` | Normalizer + edge cases |
| `src/lib/photo-providers/__tests__/pexels.test.ts` | Normalizer + edge cases |
| `src/lib/photo-providers/__tests__/google-places.test.ts` | Normalizer + URL builder |
| `src/lib/photo-providers/__tests__/fallback-chain.test.ts` | Fallback behavior |
| `src/components/ui/__tests__/PlacePhoto.test.tsx` | Component rendering |

---

## Future phases (not in this plan)

These are intentionally deferred — build the core first, integrate later:

1. **Supabase cache layer** — `photo_cache` + `photo_cache_variants` tables, Sharp processing, storage bucket. Add when API rate limits become a concern.
2. **Dashboard integration** — Replace `backgroundImage` in trip cards/hero with `PlacePhoto`.
3. **CityOverview integration** — Replace hero + photo grid with `PlacePhoto`.
4. **ActivityCard integration** — Replace activity card images with `PlacePhoto`.
5. **PhotoCarousel** — Multi-image carousel using `PlacePhoto` per slide.
