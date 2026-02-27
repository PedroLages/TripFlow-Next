import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayerManager } from '../useLayerManager';

describe('useLayerManager', () => {
  it('starts with no layers', () => {
    const { result } = renderHook(() => useLayerManager());
    expect(result.current.layers).toEqual([]);
  });

  it('registers a layer with default visibility', () => {
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'day-route', priority: 'route', defaultVisible: true });
    });
    expect(result.current.layers).toHaveLength(1);
    expect(result.current.layers[0].visible).toBe(true);
  });

  it('unregisters a layer', () => {
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'transit', priority: 'overlay' });
    });
    act(() => {
      result.current.unregisterLayer('transit');
    });
    expect(result.current.layers).toHaveLength(0);
  });

  it('toggles layer visibility', () => {
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'route', priority: 'route', defaultVisible: true });
    });
    act(() => {
      result.current.toggleLayer('route');
    });
    expect(result.current.layers[0].visible).toBe(false);
    act(() => {
      result.current.toggleLayer('route');
    });
    expect(result.current.layers[0].visible).toBe(true);
  });

  it('does not register duplicate layer IDs', () => {
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'route', priority: 'route' });
      result.current.registerLayer({ id: 'route', priority: 'route' });
    });
    expect(result.current.layers).toHaveLength(1);
  });

  it('layers are sorted by priority', () => {
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'markers', priority: 'marker' });
      result.current.registerLayer({ id: 'routes', priority: 'route' });
      result.current.registerLayer({ id: 'overlay', priority: 'overlay' });
    });
    const ids = result.current.layers.map(l => l.id);
    expect(ids).toEqual(['routes', 'markers', 'overlay']);
  });
});
