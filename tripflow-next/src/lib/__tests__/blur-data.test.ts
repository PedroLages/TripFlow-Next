import { describe, it, expect } from 'vitest';
import { getBlurDataURL } from '../blur-data';

describe('getBlurDataURL', () => {
  it('returns blur data for a valid itinerary image path', () => {
    const result = getBlurDataURL('/images/itinerary/bund-800.webp');
    expect(result).toBeDefined();
    expect(result).toMatch(/^data:image\/webp;base64,/);
  });

  it('returns blur data regardless of size suffix', () => {
    const r400 = getBlurDataURL('/images/itinerary/bund-400.webp');
    const r1600 = getBlurDataURL('/images/itinerary/bund-1600.webp');
    expect(r400).toBe(r1600);
  });

  it('returns undefined for non-itinerary paths', () => {
    expect(getBlurDataURL('https://images.unsplash.com/photo-123')).toBeUndefined();
    expect(getBlurDataURL('/images/other/photo.jpg')).toBeUndefined();
  });

  it('returns undefined for unknown image names', () => {
    expect(getBlurDataURL('/images/itinerary/nonexistent-800.webp')).toBeUndefined();
  });
});
