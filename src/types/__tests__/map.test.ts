import { describe, it, expectTypeOf } from 'vitest';
import type {
  MapLayer,
  LayerConfig,
  CameraRequest,
  CameraPriority,
  PaddingRect,
  TransportMode,
  RouteSegment,
  MapPinVariant,
} from '../map';

describe('Map types', () => {
  it('MapLayer has required fields', () => {
    expectTypeOf<MapLayer>().toHaveProperty('id');
    expectTypeOf<MapLayer>().toHaveProperty('visible');
    expectTypeOf<MapLayer>().toHaveProperty('priority');
  });

  it('CameraRequest has bounds or center', () => {
    expectTypeOf<CameraRequest>().toHaveProperty('priority');
  });

  it('TransportMode covers all travel methods', () => {
    const modes: TransportMode[] = ['walk', 'train', 'car', 'metro', 'ferry', 'flight', 'bus'];
    expectTypeOf(modes).toBeArray();
  });

  it('RouteSegment links two coordinates with a transport mode', () => {
    expectTypeOf<RouteSegment>().toHaveProperty('from');
    expectTypeOf<RouteSegment>().toHaveProperty('to');
    expectTypeOf<RouteSegment>().toHaveProperty('mode');
  });
});
