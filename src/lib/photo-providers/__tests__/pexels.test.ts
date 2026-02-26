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
