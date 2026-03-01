"use client"

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useLayerManager } from '@/hooks/useLayerManager';
import { useCameraDirector } from '@/hooks/useCameraDirector';
import { usePaddingProvider } from '@/hooks/usePaddingProvider';
import type { MapContextValue } from '@/types/map';

const MapContext = createContext<MapContextValue | null>(null);

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within a MapProvider');
  return ctx;
}

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const layerManager = useLayerManager();
  const cameraDirector = useCameraDirector();
  const paddingProvider = usePaddingProvider();

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);

  const value: MapContextValue = {
    // Layer Manager
    registerLayer: layerManager.registerLayer,
    unregisterLayer: layerManager.unregisterLayer,
    toggleLayer: layerManager.toggleLayer,
    layers: layerManager.layers,

    // Camera Director
    requestCamera: cameraDirector.requestCamera,

    // Padding Provider
    registerPadding: paddingProvider.registerPadding,
    unregisterPadding: paddingProvider.unregisterPadding,
    padding: paddingProvider.padding,

    // Selection state
    selectedActivityId,
    hoveredActivityId,
    setSelectedActivityId,
    setHoveredActivityId,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
