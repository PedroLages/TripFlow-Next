import type { Activity } from './itinerary-data';
import type { CitySlug } from './city-colors';

export const CITY_CENTERS: Record<CitySlug, { lat: number; lng: number; zoom: number }> = {
  shanghai: { lat: 31.2304, lng: 121.4737, zoom: 12 },
  hongkong: { lat: 22.3193, lng: 114.1694, zoom: 12 },
  osaka:    { lat: 34.6937, lng: 135.5023, zoom: 12 },
  kyoto:    { lat: 35.0116, lng: 135.7681, zoom: 12.5 },
  tokyo:    { lat: 35.6762, lng: 139.6503, zoom: 11.5 },
  beijing:  { lat: 39.9042, lng: 116.4074, zoom: 11 },
};

/**
 * City color hex values (Mapbox GL JS requires literal colors, not CSS vars)
 *
 * **⚠️ These are hex approximations of OKLCH tokens from globals.css:**
 * - Shanghai: oklch(0.55 0.20 350) → #D63384 (pink)
 * - Hong Kong: oklch(0.62 0.22 30) → #E07B39 (orange)
 * - Osaka: oklch(0.56 0.14 200) → #52A3A8 (blue-teal)
 * - Kyoto: oklch(0.58 0.16 140) → #62A855 (green)
 * - Tokyo: oklch(0.48 0.18 264) → #5651A6 (indigo)
 * - Beijing: oklch(0.52 0.24 25) → #C65628 (burnt orange)
 *
 * Note: Hex conversions are approximate. For CSS use city color tokens instead.
 */
/* eslint-disable tripflow/no-hardcoded-colors -- Mapbox GL JS requires literal hex values */
export const CITY_COLOR_HEX: Record<CitySlug, string> = {
  shanghai: '#D63384',
  hongkong: '#E07B39',
  osaka:    '#52A3A8',
  kyoto:    '#62A855',
  tokyo:    '#5651A6',
  beijing:  '#C65628',
};
/* eslint-enable tripflow/no-hardcoded-colors */

/** Filter activities that have coordinates */
export function activitiesWithCoords(activities: Activity[]): Activity[] {
  return activities.filter(a => a.coordinates);
}

/** Build a GeoJSON LineString for route lines connecting activities */
export function routeLineGeoJSON(activities: Activity[]): GeoJSON.Feature<GeoJSON.LineString> | null {
  const withCoords = activitiesWithCoords(activities);
  if (withCoords.length < 2) return null;

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: withCoords.map(a => [a.coordinates!.lng, a.coordinates!.lat]),
    },
  };
}

/** Calculate bounding box for fitBounds */
export function getBoundsForActivities(activities: Activity[]): [[number, number], [number, number]] | null {
  const withCoords = activitiesWithCoords(activities);
  if (withCoords.length === 0) return null;

  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const a of withCoords) {
    const { lng, lat } = a.coordinates!;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return [[minLng, minLat], [maxLng, maxLat]];
}
