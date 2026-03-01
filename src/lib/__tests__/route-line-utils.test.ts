import { describe, it, expect } from 'vitest';
import { buildRouteSegments, routeSegmentsToGeoJSON } from '../route-line-utils';
import type { Activity } from '../itinerary-data';

const mockActivities: Activity[] = [
  {
    id: '1', title: 'Temple', type: 'activity', time: '09:00',
    duration: 60, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.0, lng: 135.7 },
    transitToNext: { method: 'walk', duration: 15 },
  },
  {
    id: '2', title: 'Market', type: 'shopping', time: '10:00',
    duration: 90, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.01, lng: 135.71 },
    transitToNext: { method: 'train', duration: 30 },
  },
  {
    id: '3', title: 'Restaurant', type: 'food', time: '12:00',
    duration: 60, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.02, lng: 135.72 },
  },
];

describe('buildRouteSegments', () => {
  it('creates one segment per transit link', () => {
    const segments = buildRouteSegments(mockActivities);
    expect(segments).toHaveLength(2);
  });

  it('uses the correct transport mode from transitToNext', () => {
    const segments = buildRouteSegments(mockActivities);
    expect(segments[0].mode).toBe('walk');
    expect(segments[1].mode).toBe('train');
  });

  it('returns empty array when no activities have coords', () => {
    const segments = buildRouteSegments([]);
    expect(segments).toEqual([]);
  });
});

describe('routeSegmentsToGeoJSON', () => {
  it('creates a FeatureCollection with one feature per segment', () => {
    const segments = buildRouteSegments(mockActivities);
    const geojson = routeSegmentsToGeoJSON(segments);
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features).toHaveLength(2);
  });

  it('each feature has transport mode in properties', () => {
    const segments = buildRouteSegments(mockActivities);
    const geojson = routeSegmentsToGeoJSON(segments);
    expect(geojson.features[0].properties?.mode).toBe('walk');
    expect(geojson.features[1].properties?.mode).toBe('train');
  });
});
