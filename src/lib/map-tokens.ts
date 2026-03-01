import type { TransportMode, TransportStyle } from '@/types/map';

// ---------------------------------------------------------------------------
// Transport Mode Visual Encoding
// (Research: color AND line style differentiation)
// ---------------------------------------------------------------------------

export const TRANSPORT_STYLES: Record<TransportMode, TransportStyle> = {
  flight:  { color: 'var(--transport-flight)', dashArray: [8, 6],  width: 3, curved: true },
  train:   { color: 'var(--transport-train)', dashArray: [6, 4],  width: 3 },
  bus:     { color: 'var(--transport-bus)', dashArray: [4, 4],  width: 2.5 },
  car:     { color: 'var(--transport-car)', dashArray: [],       width: 3 },
  metro:   { color: 'var(--transport-metro)', dashArray: [4, 3],  width: 2.5 },
  ferry:   { color: 'var(--transport-ferry)', dashArray: [8, 4],  width: 3 },
  walk:    { color: 'var(--transport-walk)', dashArray: [2, 3],  width: 2 },
};

export function getTransportStyle(mode: TransportMode): TransportStyle {
  return TRANSPORT_STYLES[mode];
}

// ---------------------------------------------------------------------------
// Day Color Palette
// (Research: 7 distinct colors for day-coding pins and routes)
// ---------------------------------------------------------------------------

export const DAY_COLORS = [
  'var(--color-info)',     // blue
  'var(--color-success)',  // emerald
  'var(--color-warning)',  // amber
  'var(--color-danger)',   // red
  'var(--color-vote)',     // violet
  'var(--city-shanghai)',  // pink
  'var(--accent-primary)', // teal
];

export function getDayColor(dayIndex: number): string {
  return DAY_COLORS[dayIndex % DAY_COLORS.length];
}

// ---------------------------------------------------------------------------
// Pin Sizes (CSS pixels)
// ---------------------------------------------------------------------------

export const PIN_SIZES = {
  default: 32,
  hovered: 36,
  selected: 42,
  cityMarker: 48,
} as const;

// ---------------------------------------------------------------------------
// Map Style URLs
// ---------------------------------------------------------------------------

export function getMapStyleUrl(theme: 'light' | 'dark'): string {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? '';
  return theme === 'dark'
    ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${key}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
}
