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
