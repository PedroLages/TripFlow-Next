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
