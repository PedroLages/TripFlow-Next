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
