"use client"

import React, { useEffect, useRef, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity, ItineraryDay } from '@/lib/itinerary-data';
import { CITY_CENTERS, CITY_COLOR_HEX } from '@/lib/map-utils';
import { getMapStyleUrl } from '@/lib/map-tokens';
import { useMapContext } from './MapProvider';
import { DayRouteLayer } from './layers/DayRouteLayer';
import { ActivityMarkerLayer } from './layers/ActivityMarkerLayer';
import { TripOverviewLayer } from './layers/TripOverviewLayer';
import { CompactDaySummary } from '@/components/Itinerary/CompactDaySummary';
import './MapContainer.css';

interface MapContainerProps {
  activities: Activity[];
  allCityActivities: Activity[];
  citySlug: CitySlug;
  activeDay: number;
  day?: ItineraryDay;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

export function MapContainer({
  activities,
  allCityActivities,
  citySlug,
  activeDay,
  day,
  onAutoFill,
  onAddActivity,
  isGenerating,
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const { padding, selectedActivityId } = useMapContext();
  const center = CITY_CENTERS[citySlug];
  const cityColor = CITY_COLOR_HEX[citySlug];

  // Dark mode style detection
  const [mapStyle, setMapStyle] = React.useState(() => getMapStyleUrl('light'));

  useEffect(() => {
    const updateStyle = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setMapStyle(getMapStyleUrl(theme === 'dark' ? 'dark' : 'light'));
    };
    updateStyle();
    const observer = new MutationObserver(updateStyle);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Camera: fit bounds to visible activities when day/city changes
  const executeCameraMove = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = activeDay === -1 ? allCityActivities : activities;
    const withCoords = source.filter(a => a.coordinates);

    if (withCoords.length >= 2) {
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const a of withCoords) {
        const { lng, lat } = a.coordinates!;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: {
          top: padding.top + 60,
          bottom: padding.bottom + 40,
          left: padding.left + 40,
          right: padding.right + 40,
        },
        maxZoom: 15,
        duration: 600,
      });
    } else if (withCoords.length === 1) {
      map.flyTo({
        center: [withCoords[0].coordinates!.lng, withCoords[0].coordinates!.lat],
        zoom: 15,
        duration: 600,
      });
    } else {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: center.zoom,
        duration: 600,
      });
    }
  }, [activities, allCityActivities, activeDay, center, padding]);

  useEffect(() => {
    executeCameraMove();
  }, [executeCameraMove]);

  // Suppress "styleimagemissing" warnings from map style
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleImageMissing = (e: { id: string }) => {
      // Suppress empty/whitespace image warnings from map style
      if (!e.id || e.id.trim() === '') {
        return; // Silently ignore
      }
    };

    const mapInstance = map.getMap();
    mapInstance.on('styleimagemissing', handleImageMissing);

    return () => {
      mapInstance.off('styleimagemissing', handleImageMissing);
    };
  }, []);

  // Fly to selected activity
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedActivityId) return;

    const allActs = activeDay === -1 ? allCityActivities : activities;
    const selected = allActs.find(a => a.id === selectedActivityId && a.coordinates);
    if (selected) {
      map.flyTo({
        center: [selected.coordinates!.lng, selected.coordinates!.lat],
        zoom: Math.max(map.getZoom(), 14),
        duration: 400,
      });
    }
  }, [selectedActivityId, activities, allCityActivities, activeDay]);

  const displayActivities = activeDay === -1 ? allCityActivities : activities;

  return (
    <div className="map-container">
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
        cooperativeGestures
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {activeDay === -1 && (
          <TripOverviewLayer activeCity={citySlug} />
        )}

        {activeDay !== -1 && (
          <DayRouteLayer activities={activities} />
        )}

        <ActivityMarkerLayer
          activities={displayActivities}
          color={cityColor}
        />
      </Map>
    </div>
  );
}
