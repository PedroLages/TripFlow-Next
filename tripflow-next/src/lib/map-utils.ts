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

/** City color hex values (CSS vars can't be used in Mapbox paint properties) */
export const CITY_COLOR_HEX: Record<CitySlug, string> = {
  shanghai: '#C2185B',
  hongkong: '#E65100',
  osaka:    '#00838F',
  kyoto:    '#558B2F',
  tokyo:    '#283593',
  beijing:  '#BF360C',
};

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
