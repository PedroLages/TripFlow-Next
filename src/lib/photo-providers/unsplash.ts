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
