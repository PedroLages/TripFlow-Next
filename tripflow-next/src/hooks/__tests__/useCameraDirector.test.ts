import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCameraDirector } from '../useCameraDirector';

describe('useCameraDirector', () => {
  it('starts with no pending request', () => {
    const { result } = renderHook(() => useCameraDirector());
    expect(result.current.currentRequest).toBeNull();
  });

  it('accepts a camera request', () => {
    const { result } = renderHook(() => useCameraDirector());
    act(() => {
      result.current.requestCamera({
        id: 'day-select',
        priority: 'day-select',
        bounds: [[121.4, 31.1], [121.5, 31.3]],
        duration: 600,
      });
    });
    expect(result.current.currentRequest).not.toBeNull();
    expect(result.current.currentRequest!.id).toBe('day-select');
  });

  it('higher priority overrides lower', () => {
    const { result } = renderHook(() => useCameraDirector());
    act(() => {
      result.current.requestCamera({
        id: 'day',
        priority: 'day-select',
        bounds: [[0, 0], [1, 1]],
      });
    });
    act(() => {
      result.current.requestCamera({
        id: 'item',
        priority: 'item-select',
        center: { lng: 121.4, lat: 31.2 },
        zoom: 15,
      });
    });
    expect(result.current.currentRequest!.id).toBe('item');
  });

  it('lower priority does not override higher', () => {
    const { result } = renderHook(() => useCameraDirector());
    act(() => {
      result.current.requestCamera({
        id: 'item',
        priority: 'item-select',
        center: { lng: 121.4, lat: 31.2 },
      });
    });
    act(() => {
      result.current.requestCamera({
        id: 'idle',
        priority: 'idle',
        center: { lng: 0, lat: 0 },
      });
    });
    expect(result.current.currentRequest!.id).toBe('item');
  });

  it('clearRequest resets to null', () => {
    const { result } = renderHook(() => useCameraDirector());
    act(() => {
      result.current.requestCamera({
        id: 'test',
        priority: 'day-select',
        bounds: [[0, 0], [1, 1]],
      });
    });
    act(() => {
      result.current.clearRequest();
    });
    expect(result.current.currentRequest).toBeNull();
  });
});
