import { useCallback, useState } from 'react';
import type { MapLayer, LayerConfig, LayerPriority } from '@/types/map';

const PRIORITY_ORDER: Record<LayerPriority, number> = {
  base: 0,
  route: 1,
  area: 2,
  marker: 3,
  overlay: 4,
};

export function useLayerManager() {
  const [layers, setLayers] = useState<MapLayer[]>([]);

  const registerLayer = useCallback((config: LayerConfig) => {
    setLayers(prev => {
      if (prev.some(l => l.id === config.id)) return prev;
      const newLayer: MapLayer = {
        ...config,
        visible: config.defaultVisible ?? false,
      };
      return [...prev, newLayer].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    });
  }, []);

  const unregisterLayer = useCallback((id: string) => {
    setLayers(prev => {
      const layer = prev.find(l => l.id === id);
      layer?.cleanup?.();
      return prev.filter(l => l.id !== id);
    });
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  return { layers, registerLayer, unregisterLayer, toggleLayer };
}
