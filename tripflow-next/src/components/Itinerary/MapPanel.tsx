"use client"

import React, { useMemo, useEffect, useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity, ItineraryDay } from '@/lib/itinerary-data';
import { CITY_CENTERS, CITY_COLOR_HEX, activitiesWithCoords, routeLineGeoJSON, getBoundsForActivities } from '@/lib/map-utils';
import { CompactDaySummary } from './CompactDaySummary';
import { MapPin } from './MapPin';
import './MapPanel.css';

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

interface MapPanelProps {
  activities: Activity[];
  allCityActivities: Activity[];
  citySlug: CitySlug;
  activeDay: number;         // -1 for overview
  day?: ItineraryDay;
  hoveredActivityId: string | null;
  selectedPinId: string | null;
  onPinClick: (activityId: string) => void;
  onPinHover: (activityId: string | null) => void;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  activities,
  allCityActivities,
  citySlug,
  activeDay,
  day,
  hoveredActivityId,
  selectedPinId,
  onPinClick,
  onPinHover,
  onAutoFill,
  onAddActivity,
  isGenerating,
}) => {
  const mapRef = useRef<MapRef>(null);
  const center = CITY_CENTERS[citySlug];
  const cityColor = CITY_COLOR_HEX[citySlug];

  // Determine which activities to show
  const visibleActivities = useMemo(() => {
    const source = activeDay === -1 ? allCityActivities : activities;
    return activitiesWithCoords(source);
  }, [activities, allCityActivities, activeDay]);

  // Route line GeoJSON (only for day view)
  const routeLine = useMemo(() => {
    if (activeDay === -1) return null;
    return routeLineGeoJSON(activities);
  }, [activities, activeDay]);

  // Fit bounds when activities change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = getBoundsForActivities(
      activeDay === -1 ? allCityActivities : activities
    );

    if (bounds) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 40, left: 40, right: 40 },
        maxZoom: 15,
        duration: 600,
      });
    } else {
      map.flyTo({ center: [center.lng, center.lat], zoom: center.zoom, duration: 600 });
    }
  }, [visibleActivities, activeDay, citySlug, allCityActivities, activities, center]);

  // Dark mode detection
  const [mapStyle, setMapStyle] = React.useState(
    `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
  );

  useEffect(() => {
    const updateStyle = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setMapStyle(
        theme === 'dark'
          ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`
          : `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
      );
    };
    updateStyle();
    const observer = new MutationObserver(updateStyle);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="map-panel">
      {/* Stats overlay */}
      {day && (
        <CompactDaySummary
          day={{ ...day, activities }}
          citySlug={citySlug}
          onAutoFill={onAutoFill}
          onAddActivity={onAddActivity}
          isGenerating={isGenerating}
        />
      )}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: center.zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Route line */}
        {routeLine && (
          <Source type="geojson" data={routeLine}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': cityColor,
                'line-width': 3,
                'line-dasharray': [2, 2],
                'line-opacity': 0.6,
              }}
            />
          </Source>
        )}

        {/* Activity pins */}
        {visibleActivities.map((activity) => (
          <Marker
            key={activity.id}
            longitude={activity.coordinates!.lng}
            latitude={activity.coordinates!.lat}
            anchor="center"
          >
            <MapPin
              activity={activity}
              color={cityColor}
              isSelected={selectedPinId === activity.id}
              isHovered={hoveredActivityId === activity.id}
              onClick={() => onPinClick(activity.id)}
              onMouseEnter={() => onPinHover(activity.id)}
              onMouseLeave={() => onPinHover(null)}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};
