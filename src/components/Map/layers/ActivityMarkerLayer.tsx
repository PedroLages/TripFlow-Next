"use client"

import React, { useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { Activity } from '@/lib/itinerary-data';
import { MapPin } from '@/components/Itinerary/MapPin';
import { activitiesWithCoords } from '@/lib/map-utils';
import { useMapContext } from '../MapProvider';

interface ActivityMarkerLayerProps {
  activities: Activity[];
  color: string;
}

const LAYER_ID = 'activity-markers';

export function ActivityMarkerLayer({ activities, color }: ActivityMarkerLayerProps) {
  const {
    registerLayer,
    unregisterLayer,
    layers,
    selectedActivityId,
    hoveredActivityId,
    setSelectedActivityId,
    setHoveredActivityId,
  } = useMapContext();

  useEffect(() => {
    registerLayer({ id: LAYER_ID, priority: 'marker', defaultVisible: true });
    return () => unregisterLayer(LAYER_ID);
  }, [registerLayer, unregisterLayer]);

  const isVisible = layers.find(l => l.id === LAYER_ID)?.visible ?? false;

  const visibleActivities = useMemo(
    () => activitiesWithCoords(activities),
    [activities]
  );

  if (!isVisible) return null;

  return (
    <>
      {visibleActivities.map((activity, index) => (
        <Marker
          key={activity.id}
          longitude={activity.coordinates!.lng}
          latitude={activity.coordinates!.lat}
          anchor="center"
        >
          <MapPin
            activity={activity}
            color={color}
            orderIndex={index + 1}
            isSelected={selectedActivityId === activity.id}
            isHovered={hoveredActivityId === activity.id}
            onClick={() => setSelectedActivityId(activity.id)}
            onMouseEnter={() => setHoveredActivityId(activity.id)}
            onMouseLeave={() => setHoveredActivityId(null)}
          />
        </Marker>
      ))}
    </>
  );
}
