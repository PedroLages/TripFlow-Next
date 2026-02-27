import type { TransportMode, TransportStyle } from '@/types/map';

// ---------------------------------------------------------------------------
// Transport Mode Visual Encoding
// (Research: color AND line style differentiation)
// ---------------------------------------------------------------------------

export const TRANSPORT_STYLES: Record<TransportMode, TransportStyle> = {
  flight:  { color: '#3B82F6', dashArray: [8, 6],  width: 3, curved: true },
  train:   { color: '#8B5CF6', dashArray: [6, 4],  width: 3 },
  bus:     { color: '#8B5CF6', dashArray: [4, 4],  width: 2.5 },
  car:     { color: '#F59E0B', dashArray: [],       width: 3 },
  metro:   { color: '#06B6D4', dashArray: [4, 3],  width: 2.5 },
  ferry:   { color: '#0EA5E9', dashArray: [8, 4],  width: 3 },
  walk:    { color: '#EF4444', dashArray: [2, 3],  width: 2 },
};

export function getTransportStyle(mode: TransportMode): TransportStyle {
  return TRANSPORT_STYLES[mode];
}

// ---------------------------------------------------------------------------
// Day Color Palette
// (Research: 7 distinct colors for day-coding pins and routes)
// ---------------------------------------------------------------------------

export const DAY_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
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
