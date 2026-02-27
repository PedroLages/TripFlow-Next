import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapProvider, useMapContext } from '../MapProvider';

function TestConsumer() {
  const ctx = useMapContext();
  return (
    <div>
      <span data-testid="layer-count">{ctx.layers.length}</span>
      <span data-testid="padding-left">{ctx.padding.left}</span>
      <span data-testid="selected">{ctx.selectedActivityId ?? 'none'}</span>
    </div>
  );
}

describe('MapProvider', () => {
  it('provides default context values', () => {
    render(
      <MapProvider>
        <TestConsumer />
      </MapProvider>
    );
    expect(screen.getByTestId('layer-count').textContent).toBe('0');
    expect(screen.getByTestId('padding-left').textContent).toBe('0');
    expect(screen.getByTestId('selected').textContent).toBe('none');
  });

  it('throws when useMapContext is used outside MapProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow();
    spy.mockRestore();
  });
});
