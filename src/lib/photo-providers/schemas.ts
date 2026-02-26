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
