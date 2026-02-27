import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaddingProvider } from '../usePaddingProvider';

describe('usePaddingProvider', () => {
  it('starts with zero padding', () => {
    const { result } = renderHook(() => usePaddingProvider());
    expect(result.current.padding).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it('merges padding from a single panel', () => {
    const { result } = renderHook(() => usePaddingProvider());
    act(() => {
      result.current.registerPadding({ id: 'day-panel', rect: { top: 0, right: 0, bottom: 0, left: 360 } });
    });
    expect(result.current.padding.left).toBe(360);
  });

  it('takes the max of overlapping panels', () => {
    const { result } = renderHook(() => usePaddingProvider());
    act(() => {
      result.current.registerPadding({ id: 'panel-a', rect: { top: 60, right: 0, bottom: 0, left: 300 } });
      result.current.registerPadding({ id: 'panel-b', rect: { top: 0, right: 0, bottom: 80, left: 360 } });
    });
    expect(result.current.padding).toEqual({ top: 60, right: 0, bottom: 80, left: 360 });
  });

  it('recalculates when a panel is removed', () => {
    const { result } = renderHook(() => usePaddingProvider());
    act(() => {
      result.current.registerPadding({ id: 'a', rect: { top: 0, right: 0, bottom: 0, left: 360 } });
      result.current.registerPadding({ id: 'b', rect: { top: 0, right: 0, bottom: 0, left: 200 } });
    });
    act(() => {
      result.current.unregisterPadding('a');
    });
    expect(result.current.padding.left).toBe(200);
  });
});
