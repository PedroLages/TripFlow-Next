"use client"

import React, { useEffect, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { Activity } from '@/lib/itinerary-data';
import { buildRouteSegments, routeSegmentsToGeoJSON } from '@/lib/route-line-utils';
import { getTransportStyle } from '@/lib/map-tokens';
import { useMapContext } from '../MapProvider';

interface DayRouteLayerProps {
  activities: Activity[];
}

const LAYER_ID = 'day-route';

export function DayRouteLayer({ activities }: DayRouteLayerProps) {
  const { registerLayer, unregisterLayer, layers } = useMapContext();

  useEffect(() => {
    registerLayer({ id: LAYER_ID, priority: 'route', defaultVisible: true });
    return () => unregisterLayer(LAYER_ID);
  }, [registerLayer, unregisterLayer]);

  const isVisible = layers.find(l => l.id === LAYER_ID)?.visible ?? false;

  const segments = useMemo(() => buildRouteSegments(activities), [activities]);
  const geojson = useMemo(() => routeSegmentsToGeoJSON(segments), [segments]);

  if (!isVisible || segments.length === 0) return null;

  // Render one Layer per transport mode for distinct styling
  const modeSet = new Set(segments.map(s => s.mode));

  return (
    <Source type="geojson" data={geojson}>
      {Array.from(modeSet).map(mode => {
        const style = getTransportStyle(mode);
        return (
          <Layer
            key={`route-${mode}`}
            id={`route-${mode}`}
            type="line"
            filter={['==', ['get', 'mode'], mode]}
            paint={{
              'line-color': style.color,
              'line-width': style.width,
              'line-dasharray': style.dashArray.length > 0 ? style.dashArray : undefined,
              'line-opacity': 0.7,
            }}
            layout={{
              'line-cap': 'round',
              'line-join': 'round',
            }}
          />
        );
      })}
    </Source>
  );
}
