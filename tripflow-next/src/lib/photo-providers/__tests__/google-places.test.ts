import { describe, it, expect, vi } from 'vitest'
import type { GooglePlacePhotoMeta } from '../schemas'
import { normalizeGooglePlacePhoto, buildPlacePhotoUrl } from '../google-places'

const mockMeta: GooglePlacePhotoMeta = {
  name: 'places/ChIJ123/photos/abc',
  widthPx: 4032,
  heightPx: 3024,
  authorAttributions: [{
    displayName: 'Google User',
    uri: 'https://maps.google.com/maps/contrib/123',
    photoUri: 'https://lh3.googleusercontent.com/a/photo',
  }],
}

describe('normalizeGooglePlacePhoto', () => {
  it('transforms to Photo shape', () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'test-key')
    const photo = normalizeGooglePlacePhoto(mockMeta, 800)
    expect(photo.id).toBe('google-places/ChIJ123/photos/abc')
    expect(photo.provider).toBe('google-places')
    expect(photo.attribution.photographerName).toBe('Google User')
    vi.unstubAllEnvs()
  })

  it('handles empty authorAttributions', () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'test-key')
    const meta = { ...mockMeta, authorAttributions: [] }
    const photo = normalizeGooglePlacePhoto(meta, 800)
    expect(photo.attribution.photographerName).toBe('Google User')
    expect(photo.alt).toBe('')
    vi.unstubAllEnvs()
  })
})

describe('buildPlacePhotoUrl', () => {
  it('constructs correct URL with maxWidthPx', () => {
    // We need to set env var for this test
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'test-key')
    const url = buildPlacePhotoUrl('places/x/photos/y', 800)
    expect(url).toContain('places/x/photos/y/media')
    expect(url).toContain('maxWidthPx=800')
    expect(url).toContain('skipHttpRedirect=true')
    vi.unstubAllEnvs()
  })
})
