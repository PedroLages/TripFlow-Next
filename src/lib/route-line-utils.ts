import type { Activity } from './itinerary-data';
import type { TransportMode, RouteSegment } from '@/types/map';

/** Map Activity.transitToNext.method to our TransportMode type */
function toTransportMode(method: string): TransportMode {
  const mapping: Record<string, TransportMode> = {
    walk: 'walk',
    train: 'train',
    car: 'car',
    metro: 'metro',
    ferry: 'ferry',
    flight: 'flight',
    bus: 'bus',
  };
  return mapping[method] ?? 'walk';
}

/** Build route segments from ordered activities */
export function buildRouteSegments(activities: Activity[]): RouteSegment[] {
  const withCoords = activities.filter(a => a.coordinates);
  const segments: RouteSegment[] = [];

  for (let i = 0; i < withCoords.length - 1; i++) {
    const from = withCoords[i];
    const to = withCoords[i + 1];
    const mode = from.transitToNext
      ? toTransportMode(from.transitToNext.method)
      : 'walk';

    segments.push({
      from: { lng: from.coordinates!.lng, lat: from.coordinates!.lat },
      to: { lng: to.coordinates!.lng, lat: to.coordinates!.lat },
      mode,
    });
  }

  return segments;
}

/** Convert route segments to GeoJSON FeatureCollection (one LineString per segment) */
export function routeSegmentsToGeoJSON(
  segments: RouteSegment[]
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: 'FeatureCollection',
    features: segments.map((seg, i) => ({
      type: 'Feature' as const,
      properties: { mode: seg.mode, index: i },
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [seg.from.lng, seg.from.lat],
          [seg.to.lng, seg.to.lat],
        ],
      },
    })),
  };
}
