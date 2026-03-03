import { describe, it, expect } from 'vitest';
import {
  TRANSPORT_STYLES,
  DAY_COLORS,
  getTransportStyle,
  getDayColor,
  PIN_SIZES,
} from '../map-tokens';
import type { TransportMode } from '@/types/map';

describe('map-tokens', () => {
  it('every transport mode has a style', () => {
    const modes: TransportMode[] = ['walk', 'train', 'car', 'metro', 'ferry', 'flight', 'bus'];
    for (const mode of modes) {
      const style = getTransportStyle(mode);
      expect(style.color).toBeTruthy();
      expect(style.dashArray).toBeInstanceOf(Array);
      expect(style.width).toBeGreaterThan(0);
    }
  });

  it('flight style is curved', () => {
    expect(getTransportStyle('flight').curved).toBe(true);
  });

  it('provides at least 7 day colors', () => {
    expect(DAY_COLORS.length).toBeGreaterThanOrEqual(7);
  });

  it('getDayColor wraps around for large day indices', () => {
    expect(getDayColor(0)).toBe(DAY_COLORS[0]);
    expect(getDayColor(DAY_COLORS.length)).toBe(DAY_COLORS[0]);
  });

  it('pin sizes are defined', () => {
    expect(PIN_SIZES.default).toBeGreaterThan(0);
    expect(PIN_SIZES.selected).toBeGreaterThan(PIN_SIZES.default);
    expect(PIN_SIZES.hovered).toBeGreaterThan(PIN_SIZES.default);
  });
});
