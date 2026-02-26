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
