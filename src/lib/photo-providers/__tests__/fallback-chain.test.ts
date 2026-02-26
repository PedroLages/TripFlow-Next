import { describe, it, expect, vi } from 'vitest'
import { searchPhotosWithFallback } from '../fallback-chain'
import * as unsplash from '../unsplash'
import * as pexels from '../pexels'
import type { PhotoSearchResult, PhotoResult } from '@/types/photo'

vi.mock('../unsplash')
vi.mock('../pexels')

const mockParams = { query: 'kyoto temples' }
const mockResult: PhotoResult<PhotoSearchResult> = {
  ok: true,
  data: { photos: [{ id: 'test', url: 'https://example.com', thumbnailUrl: '', width: 800, height: 600, alt: '', attribution: { photographerName: 'Test', photographerUrl: '', sourceName: 'Unsplash', sourceUrl: '', license: '' }, provider: 'unsplash' }], totalResults: 1, page: 1, perPage: 10, provider: 'unsplash' },
}
const emptyResult: PhotoResult<PhotoSearchResult> = {
  ok: true,
  data: { photos: [], totalResults: 0, page: 1, perPage: 10, provider: 'unsplash' },
}

describe('searchPhotosWithFallback', () => {
  it('returns Unsplash results when available', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue(mockResult)
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.provider).toBe('unsplash')
  })

  it('falls back to Pexels when Unsplash fails', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue({ ok: false, error: { code: 'RATE_LIMITED', message: 'limit', provider: 'unsplash' } })
    vi.mocked(pexels.searchPexels).mockResolvedValue({ ...mockResult, data: { ...mockResult.ok ? mockResult.data : { photos: [], totalResults: 0, page: 1, perPage: 10, provider: 'pexels' }, provider: 'pexels' } })
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
  })

  it('falls back to Pexels when Unsplash returns empty', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue(emptyResult)
    vi.mocked(pexels.searchPexels).mockResolvedValue(mockResult)
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(true)
  })

  it('returns ALL_PROVIDERS_FAILED when both fail', async () => {
    vi.mocked(unsplash.searchUnsplash).mockResolvedValue({ ok: false, error: { code: 'API_ERROR', message: 'fail1', provider: 'unsplash' } })
    vi.mocked(pexels.searchPexels).mockResolvedValue({ ok: false, error: { code: 'API_ERROR', message: 'fail2', provider: 'pexels' } })
    const result = await searchPhotosWithFallback(mockParams)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('ALL_PROVIDERS_FAILED')
  })
})
