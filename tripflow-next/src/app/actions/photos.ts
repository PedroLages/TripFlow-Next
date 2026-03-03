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
