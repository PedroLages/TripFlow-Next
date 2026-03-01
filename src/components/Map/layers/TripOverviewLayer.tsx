"use client"

import React, { useEffect, useMemo } from 'react';
import { Marker, Source, Layer } from 'react-map-gl/maplibre';
import { CITY_CONFIGS, CITY_ORDER, type CitySlug } from '@/lib/city-colors';
import { CITY_CENTERS, CITY_COLOR_HEX } from '@/lib/map-utils';
import { useMapContext } from '../MapProvider';

const LAYER_ID = 'trip-overview';

/** Generate a curved arc between two points (for flight lines) */
function generateArc(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number },
  segments = 50
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lng = from.lng + (to.lng - from.lng) * t;
    const lat = from.lat + (to.lat - from.lat) * t;
    // Add curvature: sine wave perpendicular to the line
    const midOffset = Math.sin(t * Math.PI) * 2;
    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    points.push([lng + nx * midOffset, lat + ny * midOffset]);
  }
  return points;
}

interface TripOverviewLayerProps {
  activeCity: CitySlug;
}

export function TripOverviewLayer({ activeCity }: TripOverviewLayerProps) {
  const { registerLayer, unregisterLayer, layers } = useMapContext();

  useEffect(() => {
    registerLayer({ id: LAYER_ID, priority: 'route', defaultVisible: true });
    return () => unregisterLayer(LAYER_ID);
  }, [registerLayer, unregisterLayer]);

  const isVisible = layers.find(l => l.id === LAYER_ID)?.visible ?? false;

  // Build flight arc GeoJSON between consecutive cities
  const flightArcs = useMemo(() => {
    const features = [];
    for (let i = 0; i < CITY_ORDER.length - 1; i++) {
      const from = CITY_CENTERS[CITY_ORDER[i]];
      const to = CITY_CENTERS[CITY_ORDER[i + 1]];
      features.push({
        type: 'Feature' as const,
        properties: { from: CITY_ORDER[i], to: CITY_ORDER[i + 1] },
        geometry: {
          type: 'LineString' as const,
          coordinates: generateArc(from, to),
        },
      });
    }
    return { type: 'FeatureCollection' as const, features };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Flight arcs */}
      <Source type="geojson" data={flightArcs}>
        <Layer
          id="trip-flight-arcs"
          type="line"
          paint={{
            // eslint-disable-next-line tripflow/no-hardcoded-colors -- Mapbox paint properties require literal values
            'line-color': '#5B87E8', // Approx. oklch(0.62 0.20 240) = var(--transport-flight)
            'line-width': 2,
            'line-dasharray': [8, 6],
            'line-opacity': 0.5,
          }}
          layout={{ 'line-cap': 'round' }}
        />
      </Source>

      {/* City markers */}
      {CITY_ORDER.map(slug => {
        const center = CITY_CENTERS[slug];
        const config = CITY_CONFIGS[slug];
        const isActive = slug === activeCity;

        return (
          <Marker
            key={slug}
            longitude={center.lng}
            latitude={center.lat}
            anchor="center"
          >
            <div
              style={{
                width: isActive ? 48 : 40,
                height: isActive ? 48 : 40,
                borderRadius: '50%',
                background: CITY_COLOR_HEX[slug],
                border: `3px solid ${isActive ? 'oklch(1 0 0)' : 'oklch(1 0 0 / 0.7)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: isActive ? 12 : 10,
                fontWeight: 600,
                boxShadow: isActive
                  ? `0 0 0 3px ${CITY_COLOR_HEX[slug]}44, 0 4px 12px oklch(0 0 0 / 0.3)`
                  : '0 2px 8px oklch(0 0 0 / 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              aria-label={`${config.name} — ${config.nights} nights`}
            >
              {config.name.slice(0, 2).toUpperCase()}
            </div>
          </Marker>
        );
      })}
    </>
  );
}
