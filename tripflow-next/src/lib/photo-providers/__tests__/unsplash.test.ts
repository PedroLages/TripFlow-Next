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
