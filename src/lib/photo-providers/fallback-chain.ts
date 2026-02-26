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
