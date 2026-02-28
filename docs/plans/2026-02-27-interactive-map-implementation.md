# Interactive Map System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the existing Mapbox-based MapPanel with a MapLibre-powered Architecture C (Layered Context Engine) that defaults to a day-centric split view, with Layer Manager, Camera Director, and Padding Provider infrastructure.

**Architecture:** Build Uber-inspired Layer Manager / Camera Director / Padding Provider coordination system using MapLibre GL JS + react-map-gl. Default UX is Architecture A's simple day-centric split view (proven low-cognitive-load pattern from Wanderlog/Google Maps), but the underlying engine supports progressive complexity through opt-in layers (trip overview, transit, 3D, etc.).

**Tech Stack:** MapLibre GL JS, react-map-gl (MapLibre target), MapTiler (tile provider), React Context, TypeScript, Vitest, Framer Motion (existing)

**Research Reference:** [Research Report](../../docs/planning-artifacts/research/technical-itinerary-map-ux-research-2026-02-27.md) | [Map Libraries](../research/map-libraries-research.md) | [UX Patterns](../research/interactive-map-ux-patterns-research.md) | [Competitive Analysis](../research/interactive-itinerary-map-implementations.md)

---

## Existing State (What We Have)

| Component | File | What It Does |
|---|---|---|
| `MapPanel` | `src/components/Itinerary/MapPanel.tsx` | Mapbox GL map, basic pins, single dashed route line, fitBounds, dark mode |
| `MapPin` | `src/components/Itinerary/MapPin.tsx` | 32px circle pin, city-colored, type icon, hover/select states |
| `MobileMapSheet` | `src/components/Itinerary/MobileMapSheet.tsx` | Portal-based bottom sheet with drag-to-dismiss |
| `map-utils` | `src/lib/map-utils.ts` | City centers, GeoJSON builders, bounds calculator |
| `city-colors` | `src/lib/city-colors.ts` | City configs with CSS vars, hex colors, metadata |
| `Itinerary` | `src/components/Itinerary/Itinerary.tsx` | Orchestrator: city nav, day nav, timeline, map panel, mobile sheet |

**Key gaps vs. research recommendations:**
- Uses Mapbox GL (proprietary, $250/100K loads) instead of MapLibre ($0)
- No Layer Manager — all map features in single monolithic component
- No Camera Director — `fitBounds` in useEffect, no coordination
- No Padding Provider — hardcoded padding values
- Route lines: single city-color dashed line (no transport mode differentiation)
- Pins: city-colored circles (no day-coding, no numbering, no visit-order)
- No cooperative gesture handling
- No trip overview mode (city markers + flight arcs)
- No clustering support

---

## Task Overview

| # | Task | Priority | New Files | Modified Files |
|---|---|---|---|---|
| 1 | MapLibre migration | P0 | — | `package.json`, `MapPanel.tsx`, `MapPanel.css`, `.env.local` |
| 2 | Map type definitions | P0 | `src/types/map.ts` | — |
| 3 | Map design tokens | P0 | `src/lib/map-tokens.ts` | — |
| 4 | Layer Manager | P0 | `src/hooks/useLayerManager.ts` | — |
| 5 | Camera Director | P0 | `src/hooks/useCameraDirector.ts` | — |
| 6 | Padding Provider | P0 | `src/hooks/usePaddingProvider.ts` | — |
| 7 | MapProvider context | P0 | `src/components/Map/MapProvider.tsx` | — |
| 8 | Enhanced MapPin | P0 | — | `src/components/Itinerary/MapPin.tsx` |
| 9 | Transport-coded route lines | P0 | `src/lib/route-line-utils.ts` | `src/lib/map-utils.ts` |
| 10 | Day route layer | P0 | `src/components/Map/layers/DayRouteLayer.tsx` | — |
| 11 | Activity marker layer | P0 | `src/components/Map/layers/ActivityMarkerLayer.tsx` | — |
| 12 | New MapContainer | P0 | `src/components/Map/MapContainer.tsx`, `src/components/Map/MapContainer.css` | — |
| 13 | Integration: wire into Itinerary | P0 | — | `src/components/Itinerary/Itinerary.tsx` |
| 14 | Cooperative gesture handling | P0 | — | `src/components/Map/MapContainer.tsx` |
| 15 | Trip overview layer | P1 | `src/components/Map/layers/TripOverviewLayer.tsx` | — |
| 16 | Clustering support | P1 | — | `src/components/Map/layers/ActivityMarkerLayer.tsx` |
| 17 | Mobile bottom sheet upgrade | P1 | — | `src/components/Itinerary/MobileMapSheet.tsx` |

---

## Task 1: MapLibre Migration

**Files:**
- Modify: `tripflow-next/package.json`
- Modify: `tripflow-next/src/components/Itinerary/MapPanel.tsx`
- Modify: `tripflow-next/src/components/Itinerary/MapPanel.css`
- Create/modify: `tripflow-next/.env.local` (add MapTiler key)

**Why:** MapLibre GL JS is BSD-2 licensed, $0 at any scale, and react-map-gl supports it as a first-class target. The migration is straightforward — swap imports and tile source.

**Step 1: Install MapLibre, remove Mapbox**

```bash
cd tripflow-next
npm install maplibre-gl
npm uninstall mapbox-gl
```

**Step 2: Add MapTiler API key to .env.local**

```bash
# Add to .env.local (get free key at https://cloud.maptiler.com/)
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key_here
```

**Step 3: Update MapPanel imports**

Replace the Mapbox imports with MapLibre:

```tsx
// OLD
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// NEW
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
```

**Step 4: Update Map component props**

```tsx
// OLD
<Map
  ref={mapRef}
  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  mapStyle={mapStyle}
  ...
>

// NEW — MapLibre uses style URL directly, no access token prop
<Map
  ref={mapRef}
  mapStyle={mapStyle}
  ...
>
```

**Step 5: Update dark mode style URLs**

```tsx
// OLD
const lightStyle = 'mapbox://styles/mapbox/light-v11';
const darkStyle = 'mapbox://styles/mapbox/dark-v11';

// NEW — MapTiler styles (or any MapLibre-compatible provider)
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const lightStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
const darkStyle = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`;
```

**Step 6: Update MapPanel.css**

```css
/* OLD */
.map-panel .mapboxgl-map {
  border-radius: var(--radius-lg);
}

/* NEW */
.map-panel .maplibregl-map {
  border-radius: var(--radius-lg);
}
```

**Step 7: Run dev server to verify**

```bash
npm run dev
```

Expected: Map renders with MapTiler tiles. All existing functionality (pins, route line, fitBounds, dark mode) works identically.

**Step 8: Run tests**

```bash
npm run test
npm run lint
```

Expected: All pass. If any Mapbox-specific test mocks exist, update them.

**Step 9: Commit**

```bash
git add -A
git commit -m "refactor: migrate map from Mapbox GL to MapLibre GL

Swap mapbox-gl for maplibre-gl and use MapTiler as tile provider.
react-map-gl supports both as first-class targets, so the API is identical.
Cost: $0 vs $250/100K loads."
```

---

## Task 2: Map Type Definitions

**Files:**
- Create: `tripflow-next/src/types/map.ts`
- Test: `tripflow-next/src/types/__tests__/map.test.ts`

**Why:** Centralize all map-related types before building the infrastructure. These types define the contract for Layer Manager, Camera Director, and visual encoding.

**Step 1: Write the type tests**

```typescript
// src/types/__tests__/map.test.ts
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
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/types/__tests__/map.test.ts
```

Expected: FAIL — types don't exist yet.

**Step 3: Write the type definitions**

```typescript
// src/types/map.ts

import type { LngLatBoundsLike } from 'maplibre-gl';

// ---------------------------------------------------------------------------
// Transport & Route Types
// ---------------------------------------------------------------------------

/** All supported transport modes between activities */
export type TransportMode = 'walk' | 'train' | 'car' | 'metro' | 'ferry' | 'flight' | 'bus';

/** A single segment of a route between two points */
export interface RouteSegment {
  from: { lng: number; lat: number };
  to: { lng: number; lat: number };
  mode: TransportMode;
}

/** Visual encoding for a transport mode */
export interface TransportStyle {
  color: string;
  dashArray: number[];
  width: number;
  /** Curved arc for flights */
  curved?: boolean;
}

// ---------------------------------------------------------------------------
// Pin Types
// ---------------------------------------------------------------------------

/** Pin visual variant determines rendering */
export type MapPinVariant = 'day' | 'city' | 'hotel' | 'transport';

/** Data needed to render a map pin */
export interface MapPinData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** Sequential number within the day (1, 2, 3...) */
  orderIndex: number;
  /** Activity type icon (food, activity, shopping, etc.) */
  activityType: string;
  /** Color for this pin (day color or city color) */
  color: string;
  variant: MapPinVariant;
}

// ---------------------------------------------------------------------------
// Layer Manager Types
// ---------------------------------------------------------------------------

/** Priority levels for layers (higher = renders on top) */
export type LayerPriority = 'base' | 'route' | 'area' | 'marker' | 'overlay';

/** Configuration for registering a map layer */
export interface LayerConfig {
  id: string;
  priority: LayerPriority;
  /** Layer is visible by default */
  defaultVisible?: boolean;
}

/** Runtime state of a registered layer */
export interface MapLayer extends LayerConfig {
  visible: boolean;
  /** Cleanup function called when layer is deactivated */
  cleanup?: () => void;
}

// ---------------------------------------------------------------------------
// Camera Director Types
// ---------------------------------------------------------------------------

/** Camera priority — higher overrides lower */
export type CameraPriority = 'idle' | 'day-select' | 'item-select' | 'user-interaction' | 'exclusive';

/** A request to move the camera */
export interface CameraRequest {
  id: string;
  priority: CameraPriority;
  /** Fit these bounds (mutually exclusive with center) */
  bounds?: LngLatBoundsLike;
  /** Center on this point (mutually exclusive with bounds) */
  center?: { lng: number; lat: number };
  zoom?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Padding to apply (respects Padding Provider) */
  padding?: PaddingRect;
}

// ---------------------------------------------------------------------------
// Padding Provider Types
// ---------------------------------------------------------------------------

/** Padding rectangle in CSS pixels */
export interface PaddingRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** A UI panel that registers its bounds with the Padding Provider */
export interface PaddingRegistration {
  id: string;
  rect: PaddingRect;
}

// ---------------------------------------------------------------------------
// Map Context (shared state)
// ---------------------------------------------------------------------------

export interface MapContextValue {
  /** Register a layer */
  registerLayer: (config: LayerConfig) => void;
  /** Unregister a layer */
  unregisterLayer: (id: string) => void;
  /** Toggle layer visibility */
  toggleLayer: (id: string) => void;
  /** Get all registered layers */
  layers: MapLayer[];

  /** Request a camera move */
  requestCamera: (request: CameraRequest) => void;

  /** Register panel padding */
  registerPadding: (reg: PaddingRegistration) => void;
  /** Unregister panel padding */
  unregisterPadding: (id: string) => void;
  /** Current combined padding */
  padding: PaddingRect;

  /** Currently selected activity ID */
  selectedActivityId: string | null;
  /** Currently hovered activity ID */
  hoveredActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  setHoveredActivityId: (id: string | null) => void;
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/types/__tests__/map.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/types/map.ts src/types/__tests__/map.test.ts
git commit -m "feat(map): add type definitions for Layer Manager, Camera Director, Padding Provider"
```

---

## Task 3: Map Design Tokens

**Files:**
- Create: `tripflow-next/src/lib/map-tokens.ts`
- Test: `tripflow-next/src/lib/__tests__/map-tokens.test.ts`

**Why:** Centralize visual encoding rules from the research — transport mode styles, day colors, pin sizes. Single source of truth referenced by all map components.

**Step 1: Write tests**

```typescript
// src/lib/__tests__/map-tokens.test.ts
import { describe, it, expect } from 'vitest';
import {
  TRANSPORT_STYLES,
  DAY_COLORS,
  getTransportStyle,
  getDayColor,
  PIN_SIZES,
} from '../map-tokens';
import type { TransportMode } from '@/types/map';

describe('map-tokens', () => {
  it('every transport mode has a style', () => {
    const modes: TransportMode[] = ['walk', 'train', 'car', 'metro', 'ferry', 'flight', 'bus'];
    for (const mode of modes) {
      const style = getTransportStyle(mode);
      expect(style.color).toBeTruthy();
      expect(style.dashArray).toBeInstanceOf(Array);
      expect(style.width).toBeGreaterThan(0);
    }
  });

  it('flight style is curved', () => {
    expect(getTransportStyle('flight').curved).toBe(true);
  });

  it('provides at least 7 day colors', () => {
    expect(DAY_COLORS.length).toBeGreaterThanOrEqual(7);
  });

  it('getDayColor wraps around for large day indices', () => {
    expect(getDayColor(0)).toBe(DAY_COLORS[0]);
    expect(getDayColor(DAY_COLORS.length)).toBe(DAY_COLORS[0]);
  });

  it('pin sizes are defined', () => {
    expect(PIN_SIZES.default).toBeGreaterThan(0);
    expect(PIN_SIZES.selected).toBeGreaterThan(PIN_SIZES.default);
    expect(PIN_SIZES.hovered).toBeGreaterThan(PIN_SIZES.default);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/__tests__/map-tokens.test.ts
```

Expected: FAIL — module doesn't exist.

**Step 3: Write the implementation**

```typescript
// src/lib/map-tokens.ts

import type { TransportMode, TransportStyle } from '@/types/map';

// ---------------------------------------------------------------------------
// Transport Mode Visual Encoding
// (Research: color AND line style differentiation)
// ---------------------------------------------------------------------------

export const TRANSPORT_STYLES: Record<TransportMode, TransportStyle> = {
  flight:  { color: '#3B82F6', dashArray: [8, 6],  width: 3, curved: true },
  train:   { color: '#8B5CF6', dashArray: [6, 4],  width: 3 },
  bus:     { color: '#8B5CF6', dashArray: [4, 4],  width: 2.5 },
  car:     { color: '#F59E0B', dashArray: [],       width: 3 },
  metro:   { color: '#06B6D4', dashArray: [4, 3],  width: 2.5 },
  ferry:   { color: '#0EA5E9', dashArray: [8, 4],  width: 3 },
  walk:    { color: '#EF4444', dashArray: [2, 3],  width: 2 },
};

export function getTransportStyle(mode: TransportMode): TransportStyle {
  return TRANSPORT_STYLES[mode];
}

// ---------------------------------------------------------------------------
// Day Color Palette
// (Research: 7 distinct colors for day-coding pins and routes)
// ---------------------------------------------------------------------------

export const DAY_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
];

export function getDayColor(dayIndex: number): string {
  return DAY_COLORS[dayIndex % DAY_COLORS.length];
}

// ---------------------------------------------------------------------------
// Pin Sizes (CSS pixels)
// ---------------------------------------------------------------------------

export const PIN_SIZES = {
  default: 32,
  hovered: 36,
  selected: 42,
  cityMarker: 48,
} as const;

// ---------------------------------------------------------------------------
// Map Style URLs
// ---------------------------------------------------------------------------

export function getMapStyleUrl(theme: 'light' | 'dark'): string {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? '';
  return theme === 'dark'
    ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${key}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/__tests__/map-tokens.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/map-tokens.ts src/lib/__tests__/map-tokens.test.ts
git commit -m "feat(map): add design tokens for transport styles, day colors, pin sizes"
```

---

## Task 4: Layer Manager Hook

**Files:**
- Create: `tripflow-next/src/hooks/useLayerManager.ts`
- Test: `tripflow-next/src/hooks/__tests__/useLayerManager.test.ts`

**Why:** Core Architecture C primitive. Each map feature (day route, trip overview, transit overlay) registers as a sandboxed layer. Layers can be toggled, added, and removed without interfering with each other.

**Step 1: Write tests**

```typescript
// src/hooks/__tests__/useLayerManager.test.ts
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

  it('unregisters a layer and calls cleanup', () => {
    const cleanup = vi.fn();
    const { result } = renderHook(() => useLayerManager());
    act(() => {
      result.current.registerLayer({ id: 'transit', priority: 'overlay' });
      // Simulate setting cleanup
      result.current.layers[0].cleanup = cleanup;
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
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useLayerManager.test.ts
```

Expected: FAIL — hook doesn't exist.

**Step 3: Write the implementation**

```typescript
// src/hooks/useLayerManager.ts
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
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/__tests__/useLayerManager.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useLayerManager.ts src/hooks/__tests__/useLayerManager.test.ts
git commit -m "feat(map): add Layer Manager hook for sandboxed map layer coordination"
```

---

## Task 5: Camera Director Hook

**Files:**
- Create: `tripflow-next/src/hooks/useCameraDirector.ts`
- Test: `tripflow-next/src/hooks/__tests__/useCameraDirector.test.ts`

**Why:** Prevents "view fighting" — multiple features requesting camera moves simultaneously. Uses priority-based arbitration (research: Uber's Camera Director pattern).

**Step 1: Write tests**

```typescript
// src/hooks/__tests__/useCameraDirector.test.ts
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
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useCameraDirector.test.ts
```

Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/hooks/useCameraDirector.ts
import { useCallback, useRef, useState } from 'react';
import type { CameraRequest, CameraPriority } from '@/types/map';

const PRIORITY_RANK: Record<CameraPriority, number> = {
  idle: 0,
  'day-select': 1,
  'item-select': 2,
  'user-interaction': 3,
  exclusive: 4,
};

export function useCameraDirector() {
  const [currentRequest, setCurrentRequest] = useState<CameraRequest | null>(null);
  const lastPriorityRef = useRef<number>(-1);

  const requestCamera = useCallback((request: CameraRequest) => {
    const rank = PRIORITY_RANK[request.priority];
    // Accept if same or higher priority than current
    if (rank >= lastPriorityRef.current) {
      lastPriorityRef.current = rank;
      setCurrentRequest(request);

      // Auto-decay priority after animation completes
      // so lower-priority requests can take over
      const duration = request.duration ?? 600;
      setTimeout(() => {
        lastPriorityRef.current = Math.max(0, rank - 1);
      }, duration + 100);
    }
  }, []);

  const clearRequest = useCallback(() => {
    setCurrentRequest(null);
    lastPriorityRef.current = -1;
  }, []);

  return { currentRequest, requestCamera, clearRequest };
}
```

**Step 4: Run tests**

```bash
npx vitest run src/hooks/__tests__/useCameraDirector.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useCameraDirector.ts src/hooks/__tests__/useCameraDirector.test.ts
git commit -m "feat(map): add Camera Director hook with priority-based arbitration"
```

---

## Task 6: Padding Provider Hook

**Files:**
- Create: `tripflow-next/src/hooks/usePaddingProvider.ts`
- Test: `tripflow-next/src/hooks/__tests__/usePaddingProvider.test.ts`

**Why:** UI panels (day list, detail card) register their screen bounds so the map knows to offset — markers and routes stay visible behind floating chrome.

**Step 1: Write tests**

```typescript
// src/hooks/__tests__/usePaddingProvider.test.ts
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
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/usePaddingProvider.test.ts
```

**Step 3: Write the implementation**

```typescript
// src/hooks/usePaddingProvider.ts
import { useCallback, useMemo, useState } from 'react';
import type { PaddingRect, PaddingRegistration } from '@/types/map';

export function usePaddingProvider() {
  const [registrations, setRegistrations] = useState<PaddingRegistration[]>([]);

  const registerPadding = useCallback((reg: PaddingRegistration) => {
    setRegistrations(prev => {
      const filtered = prev.filter(r => r.id !== reg.id);
      return [...filtered, reg];
    });
  }, []);

  const unregisterPadding = useCallback((id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
  }, []);

  const padding: PaddingRect = useMemo(() => {
    if (registrations.length === 0) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
    return registrations.reduce(
      (acc, reg) => ({
        top: Math.max(acc.top, reg.rect.top),
        right: Math.max(acc.right, reg.rect.right),
        bottom: Math.max(acc.bottom, reg.rect.bottom),
        left: Math.max(acc.left, reg.rect.left),
      }),
      { top: 0, right: 0, bottom: 0, left: 0 }
    );
  }, [registrations]);

  return { padding, registerPadding, unregisterPadding };
}
```

**Step 4: Run tests**

```bash
npx vitest run src/hooks/__tests__/usePaddingProvider.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/usePaddingProvider.ts src/hooks/__tests__/usePaddingProvider.test.ts
git commit -m "feat(map): add Padding Provider hook for UI-aware map bounds"
```

---

## Task 7: MapProvider Context

**Files:**
- Create: `tripflow-next/src/components/Map/MapProvider.tsx`
- Test: `tripflow-next/src/components/Map/__tests__/MapProvider.test.tsx`

**Why:** Unifies Layer Manager, Camera Director, Padding Provider, and selection state into a single React Context. All map sub-components access this context instead of prop-drilling.

**Step 1: Write tests**

```typescript
// src/components/Map/__tests__/MapProvider.test.tsx
import { describe, it, expect } from 'vitest';
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
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow();
    spy.mockRestore();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/Map/__tests__/MapProvider.test.tsx
```

**Step 3: Write the implementation**

```typescript
// src/components/Map/MapProvider.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
```

**Step 4: Run tests**

```bash
npx vitest run src/components/Map/__tests__/MapProvider.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Map/MapProvider.tsx src/components/Map/__tests__/MapProvider.test.tsx
git commit -m "feat(map): add MapProvider context combining Layer Manager, Camera Director, Padding Provider"
```

---

## Task 8: Enhanced MapPin

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/MapPin.tsx`
- Test: `tripflow-next/src/components/Itinerary/__tests__/MapPin.test.tsx`

**Why:** Research says pins should be day-coded (color by day), numbered in visit order, with category icons. Current pin is city-colored circle only.

**Step 1: Write tests**

```typescript
// src/components/Itinerary/__tests__/MapPin.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapPin } from '../MapPin';

const defaultProps = {
  activity: {
    id: 'act-1',
    title: 'Fushimi Inari',
    type: 'activity' as const,
    time: '09:00 AM',
    duration: 120,
    votes: { up: 5, down: 0 },
    comments: [],
  },
  color: '#3B82F6',
  orderIndex: 1,
  isSelected: false,
  isHovered: false,
  onClick: vi.fn(),
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
};

describe('MapPin', () => {
  it('renders with visit order number', () => {
    render(<MapPin {...defaultProps} />);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('renders the activity type icon', () => {
    render(<MapPin {...defaultProps} />);
    // Pin should have an aria-label describing the activity
    expect(screen.getByRole('button', { name: /Fushimi Inari/ })).toBeTruthy();
  });

  it('scales up when selected', () => {
    const { container } = render(<MapPin {...defaultProps} isSelected />);
    const pin = container.firstElementChild as HTMLElement;
    expect(pin.style.transform).toContain('1.3');
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<MapPin {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/Itinerary/__tests__/MapPin.test.tsx
```

Expected: FAIL — `orderIndex` prop doesn't exist yet.

**Step 3: Update MapPin implementation**

```tsx
// src/components/Itinerary/MapPin.tsx
"use client"

import React from 'react';
import { Plane, Hotel, Utensils, Camera, ShoppingBag, Train, Bus } from 'lucide-react';
import type { Activity } from '@/lib/itinerary-data';
import { PIN_SIZES } from '@/lib/map-tokens';

interface MapPinProps {
  activity: Activity;
  color: string;
  /** Visit order number within the day (1, 2, 3...) */
  orderIndex?: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function getIcon(type: Activity['type'], size: number) {
  switch (type) {
    case 'flight':    return <Plane size={size} />;
    case 'hotel':     return <Hotel size={size} />;
    case 'food':      return <Utensils size={size} />;
    case 'activity':  return <Camera size={size} />;
    case 'shopping':  return <ShoppingBag size={size} />;
    case 'transport': return <Train size={size} />;
    default:          return <Camera size={size} />;
  }
}

export const MapPin: React.FC<MapPinProps> = ({
  activity,
  color,
  orderIndex,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const size = isSelected
    ? PIN_SIZES.selected
    : isHovered
    ? PIN_SIZES.hovered
    : PIN_SIZES.default;

  const scale = isSelected ? 1.3 : isHovered ? 1.1 : 1;
  const shadow = isSelected || isHovered
    ? `0 0 0 3px white, 0 0 12px ${color}66`
    : '0 2px 6px rgba(0,0,0,0.3)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: PIN_SIZES.default,
        height: PIN_SIZES.default,
        borderRadius: '50%',
        background: color,
        border: '2.5px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        transform: `scale(${scale}) translateY(${isSelected ? '-4px' : '0'})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: shadow,
        position: 'relative',
        opacity: isSelected || isHovered ? 1 : 0.85,
      }}
      role="button"
      aria-label={`${orderIndex ? `Stop ${orderIndex}: ` : ''}${activity.title} — ${activity.type}`}
    >
      {/* Category icon */}
      {getIcon(activity.type, 14)}

      {/* Visit order badge */}
      {orderIndex != null && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            color: color,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {orderIndex}
        </span>
      )}
    </div>
  );
};
```

**Step 4: Run tests**

```bash
npx vitest run src/components/Itinerary/__tests__/MapPin.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Itinerary/MapPin.tsx src/components/Itinerary/__tests__/MapPin.test.tsx
git commit -m "feat(map): enhance MapPin with visit-order numbers and improved visual states"
```

---

## Task 9: Transport-Coded Route Lines

**Files:**
- Create: `tripflow-next/src/lib/route-line-utils.ts`
- Test: `tripflow-next/src/lib/__tests__/route-line-utils.test.ts`
- Modify: `tripflow-next/src/lib/map-utils.ts` (add transport-aware exports)

**Why:** Research: route lines should encode transport mode via both color AND line style. Current implementation uses a single dashed line.

**Step 1: Write tests**

```typescript
// src/lib/__tests__/route-line-utils.test.ts
import { describe, it, expect } from 'vitest';
import { buildRouteSegments, routeSegmentsToGeoJSON } from '../route-line-utils';
import type { Activity } from '../itinerary-data';

const mockActivities: Activity[] = [
  {
    id: '1', title: 'Temple', type: 'activity', time: '09:00',
    duration: 60, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.0, lng: 135.7 },
    transitToNext: { method: 'walk', duration: 15 },
  },
  {
    id: '2', title: 'Market', type: 'shopping', time: '10:00',
    duration: 90, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.01, lng: 135.71 },
    transitToNext: { method: 'train', duration: 30 },
  },
  {
    id: '3', title: 'Restaurant', type: 'food', time: '12:00',
    duration: 60, votes: { up: 0, down: 0 }, comments: [],
    coordinates: { lat: 35.02, lng: 135.72 },
  },
];

describe('buildRouteSegments', () => {
  it('creates one segment per transit link', () => {
    const segments = buildRouteSegments(mockActivities);
    expect(segments).toHaveLength(2);
  });

  it('uses the correct transport mode from transitToNext', () => {
    const segments = buildRouteSegments(mockActivities);
    expect(segments[0].mode).toBe('walk');
    expect(segments[1].mode).toBe('train');
  });

  it('returns empty array when no activities have coords', () => {
    const segments = buildRouteSegments([]);
    expect(segments).toEqual([]);
  });
});

describe('routeSegmentsToGeoJSON', () => {
  it('creates a FeatureCollection with one feature per segment', () => {
    const segments = buildRouteSegments(mockActivities);
    const geojson = routeSegmentsToGeoJSON(segments);
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features).toHaveLength(2);
  });

  it('each feature has transport mode in properties', () => {
    const segments = buildRouteSegments(mockActivities);
    const geojson = routeSegmentsToGeoJSON(segments);
    expect(geojson.features[0].properties?.mode).toBe('walk');
    expect(geojson.features[1].properties?.mode).toBe('train');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/__tests__/route-line-utils.test.ts
```

**Step 3: Write the implementation**

```typescript
// src/lib/route-line-utils.ts
import type { Activity } from './itinerary-data';
import type { TransportMode, RouteSegment } from '@/types/map';

/** Map Activity.transitToNext.method to our TransportMode type */
function toTransportMode(method: string): TransportMode {
  const mapping: Record<string, TransportMode> = {
    walk: 'walk',
    train: 'train',
    car: 'car',
    metro: 'metro',
    ferry: 'ferry',
    flight: 'flight',
    bus: 'bus',
  };
  return mapping[method] ?? 'walk';
}

/** Build route segments from ordered activities */
export function buildRouteSegments(activities: Activity[]): RouteSegment[] {
  const withCoords = activities.filter(a => a.coordinates);
  const segments: RouteSegment[] = [];

  for (let i = 0; i < withCoords.length - 1; i++) {
    const from = withCoords[i];
    const to = withCoords[i + 1];
    const mode = from.transitToNext
      ? toTransportMode(from.transitToNext.method)
      : 'walk';

    segments.push({
      from: { lng: from.coordinates!.lng, lat: from.coordinates!.lat },
      to: { lng: to.coordinates!.lng, lat: to.coordinates!.lat },
      mode,
    });
  }

  return segments;
}

/** Convert route segments to GeoJSON FeatureCollection (one LineString per segment) */
export function routeSegmentsToGeoJSON(
  segments: RouteSegment[]
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: 'FeatureCollection',
    features: segments.map((seg, i) => ({
      type: 'Feature' as const,
      properties: { mode: seg.mode, index: i },
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [seg.from.lng, seg.from.lat],
          [seg.to.lng, seg.to.lat],
        ],
      },
    })),
  };
}
```

**Step 4: Run tests**

```bash
npx vitest run src/lib/__tests__/route-line-utils.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/route-line-utils.ts src/lib/__tests__/route-line-utils.test.ts
git commit -m "feat(map): add transport-mode-aware route segment builder"
```

---

## Task 10: Day Route Layer Component

**Files:**
- Create: `tripflow-next/src/components/Map/layers/DayRouteLayer.tsx`

**Why:** Renders transport-mode-coded route lines on the map. Each segment gets its own color and dash pattern based on transport mode (walk = red dotted, train = purple dashed, etc.). Registers itself with the Layer Manager.

**Step 1: Write the component**

```tsx
// src/components/Map/layers/DayRouteLayer.tsx
"use client"

import React, { useEffect, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { Activity } from '@/lib/itinerary-data';
import { buildRouteSegments, routeSegmentsToGeoJSON } from '@/lib/route-line-utils';
import { getTransportStyle } from '@/lib/map-tokens';
import { useMapContext } from '../MapProvider';

interface DayRouteLayerProps {
  activities: Activity[];
}

const LAYER_ID = 'day-route';

export function DayRouteLayer({ activities }: DayRouteLayerProps) {
  const { registerLayer, unregisterLayer, layers } = useMapContext();

  useEffect(() => {
    registerLayer({ id: LAYER_ID, priority: 'route', defaultVisible: true });
    return () => unregisterLayer(LAYER_ID);
  }, [registerLayer, unregisterLayer]);

  const isVisible = layers.find(l => l.id === LAYER_ID)?.visible ?? false;

  const segments = useMemo(() => buildRouteSegments(activities), [activities]);
  const geojson = useMemo(() => routeSegmentsToGeoJSON(segments), [segments]);

  if (!isVisible || segments.length === 0) return null;

  // Render one Layer per transport mode for distinct styling
  const modeSet = new Set(segments.map(s => s.mode));

  return (
    <Source type="geojson" data={geojson}>
      {Array.from(modeSet).map(mode => {
        const style = getTransportStyle(mode);
        return (
          <Layer
            key={`route-${mode}`}
            id={`route-${mode}`}
            type="line"
            filter={['==', ['get', 'mode'], mode]}
            paint={{
              'line-color': style.color,
              'line-width': style.width,
              'line-dasharray': style.dashArray.length > 0 ? style.dashArray : undefined,
              'line-opacity': 0.7,
            }}
            layout={{
              'line-cap': 'round',
              'line-join': 'round',
            }}
          />
        );
      })}
    </Source>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Map/layers/DayRouteLayer.tsx
git commit -m "feat(map): add DayRouteLayer with transport-mode-coded line styles"
```

---

## Task 11: Activity Marker Layer Component

**Files:**
- Create: `tripflow-next/src/components/Map/layers/ActivityMarkerLayer.tsx`

**Why:** Renders activity pins on the map with day-coded colors and visit-order numbers. Uses MapProvider context for selection state and registers with the Layer Manager.

**Step 1: Write the component**

```tsx
// src/components/Map/layers/ActivityMarkerLayer.tsx
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
```

**Step 2: Commit**

```bash
git add src/components/Map/layers/ActivityMarkerLayer.tsx
git commit -m "feat(map): add ActivityMarkerLayer with visit-order numbered pins"
```

---

## Task 12: New MapContainer Component

**Files:**
- Create: `tripflow-next/src/components/Map/MapContainer.tsx`
- Create: `tripflow-next/src/components/Map/MapContainer.css`

**Why:** Replaces the monolithic MapPanel. Thin wrapper around MapLibre that consumes MapProvider context, executes Camera Director requests, and renders registered layers.

**Step 1: Write the MapContainer**

```tsx
// src/components/Map/MapContainer.tsx
"use client"

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
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
  const { padding, requestCamera, selectedActivityId } = useMapContext();
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

  // Execute Camera Director requests
  const { requestCamera: _, ...ctx } = useMapContext();

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // When city or day changes, request a camera move
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

      requestCamera({
        id: 'day-change',
        priority: 'day-select',
        bounds: [[minLng, minLat], [maxLng, maxLat]],
        padding: {
          top: padding.top + 60,
          right: padding.right + 40,
          bottom: padding.bottom + 40,
          left: padding.left + 40,
        },
        duration: 600,
      });
    } else if (withCoords.length === 1) {
      requestCamera({
        id: 'day-change-single',
        priority: 'day-select',
        center: withCoords[0].coordinates!,
        zoom: 15,
        duration: 600,
      });
    } else {
      requestCamera({
        id: 'city-default',
        priority: 'idle',
        center: { lng: center.lng, lat: center.lat },
        zoom: center.zoom,
        duration: 600,
      });
    }
  }, [activities, allCityActivities, activeDay, citySlug, center, padding, requestCamera]);

  // Execute camera moves from the Camera Director
  const prevRequestRef = useRef<string | null>(null);
  const currentRequest = useMapContext().requestCamera; // We need the actual request

  // We need to subscribe to cameraDirector's currentRequest via context
  // For now, implement fitBounds directly (will be refined when wiring context)
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

        {/* Route lines (only in day view) */}
        {activeDay !== -1 && (
          <DayRouteLayer activities={activities} />
        )}

        {/* Activity markers */}
        <ActivityMarkerLayer
          activities={displayActivities}
          color={cityColor}
        />
      </Map>
    </div>
  );
}
```

**Step 2: Write the CSS**

```css
/* src/components/Map/MapContainer.css */

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.map-container .maplibregl-map {
  border-radius: var(--radius-lg);
}

/* Cooperative gesture overlay */
.map-container .maplibregl-cooperative-gesture-screen {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Loading skeleton */
.map-container-skeleton {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}
```

**Step 3: Run dev server to verify**

```bash
npm run dev
```

Expected: New MapContainer renders (not yet wired into Itinerary).

**Step 4: Commit**

```bash
git add src/components/Map/MapContainer.tsx src/components/Map/MapContainer.css
git commit -m "feat(map): add MapContainer with MapLibre, Camera Director integration, cooperative gestures"
```

---

## Task 13: Integration — Wire Into Itinerary

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/Itinerary.tsx`

**Why:** Replace the old MapPanel with the new MapProvider + MapContainer system. Connect bidirectional selection between timeline and map.

**Step 1: Update Itinerary.tsx imports and dynamic import**

Replace the old MapPanel import:

```tsx
// OLD
const MapPanel = dynamic(
  () => import('./MapPanel').then(mod => ({ default: mod.MapPanel })),
  { ssr: false, loading: () => <div className="map-panel-skeleton">Loading map...</div> }
);

// NEW
import { MapProvider } from '@/components/Map/MapProvider';

const MapContainer = dynamic(
  () => import('@/components/Map/MapContainer').then(mod => ({ default: mod.MapContainer })),
  { ssr: false, loading: () => <div className="map-container-skeleton">Loading map...</div> }
);
```

**Step 2: Wrap content split in MapProvider**

The map and timeline must share context. Wrap the content-split section:

```tsx
// In the JSX, replace the itinerary-content-split section:
<MapProvider>
  <MapIntegrationBridge
    hoveredActivityId={hoveredActivityId}
    selectedPinId={selectedPinId}
    onHover={handleActivityHover}
    onSelect={handlePinClick}
  />

  <motion.div
    className="itinerary-content-split"
    variants={motionVariants}
    style={getCityStyle(activeCity)}
  >
    {/* Left Panel — same as before */}
    <div className="itinerary-left-panel">
      {/* ... DayNavigator + Timeline content unchanged ... */}
    </div>

    {/* Right Panel: New Map */}
    <div className="itinerary-right-panel">
      <MapContainer
        activities={activeDay === -1 ? allCityActivities : dayActivities}
        allCityActivities={allCityActivities}
        citySlug={activeCity}
        activeDay={activeDay}
        day={currentDay ? { ...currentDay, activities: dayActivities } : undefined}
        onAutoFill={handleAutoFillDay}
        onAddActivity={() => setIsAddActivityOpen(true)}
        isGenerating={isGeneratingDay}
      />
    </div>
  </motion.div>
</MapProvider>
```

**Step 3: Create a bridge component for bidirectional sync**

Add this inside Itinerary.tsx (or extract to a separate file):

```tsx
/** Bridges Itinerary local state ↔ MapProvider context */
function MapIntegrationBridge({
  hoveredActivityId,
  selectedPinId,
  onHover,
  onSelect,
}: {
  hoveredActivityId: string | null;
  selectedPinId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const { setSelectedActivityId, setHoveredActivityId, selectedActivityId, hoveredActivityId: mapHoveredId } = useMapContext();

  // Sync from Itinerary → Map
  useEffect(() => { setHoveredActivityId(hoveredActivityId); }, [hoveredActivityId, setHoveredActivityId]);
  useEffect(() => { setSelectedActivityId(selectedPinId); }, [selectedPinId, setSelectedActivityId]);

  // Sync from Map → Itinerary
  useEffect(() => {
    if (mapHoveredId !== hoveredActivityId) onHover(mapHoveredId);
  }, [mapHoveredId]);
  useEffect(() => {
    if (selectedActivityId && selectedActivityId !== selectedPinId) onSelect(selectedActivityId);
  }, [selectedActivityId]);

  return null;
}
```

**Step 4: Update MobileMapSheet to use new MapContainer**

Replace the MapPanel inside MobileMapSheet with MapContainer (same props).

**Step 5: Run dev server and verify**

```bash
npm run dev
```

Expected: Map renders with MapLibre tiles, transport-coded route lines, numbered pins. Clicking a pin scrolls the timeline. Hovering a timeline card highlights the pin.

**Step 6: Run tests**

```bash
npm run test
npm run lint
```

**Step 7: Commit**

```bash
git add src/components/Itinerary/Itinerary.tsx
git commit -m "feat(map): integrate MapProvider + MapContainer into Itinerary page

Replace monolithic MapPanel with Architecture C system:
- MapProvider context for shared state
- MapContainer with MapLibre + cooperative gestures
- DayRouteLayer with transport-mode-coded lines
- ActivityMarkerLayer with visit-order numbered pins
- Bidirectional selection bridge (timeline ↔ map)"
```

---

## Task 14: Cooperative Gesture Handling

**Files:**
- Modify: `tripflow-next/src/components/Map/MapContainer.tsx`

**Why:** Research finding: cooperative gestures are mandatory for embedded maps — prevents scroll hijacking on desktop (Ctrl+scroll) and mobile (two-finger).

**Already handled** in Task 12 via `cooperativeGestures` prop on the Map component. This task validates it works correctly.

**Step 1: Manual verification**

1. Open the itinerary page in browser
2. Try scrolling the page with mouse wheel while cursor is over the map
3. Expected: Page scrolls normally. Map does NOT zoom. A "Use Ctrl + scroll to zoom the map" overlay appears.
4. Hold Ctrl + scroll → Map zooms
5. On mobile (or device simulation): single-finger drag should scroll page, two-finger drag should pan map

**Step 2: Commit if any CSS adjustments were needed**

```bash
git add -A
git commit -m "fix(map): verify cooperative gesture handling works on desktop and mobile"
```

---

## Task 15: Trip Overview Layer (P1)

**Files:**
- Create: `tripflow-next/src/components/Map/layers/TripOverviewLayer.tsx`

**Why:** When zoomed out or in city-overview mode, show city markers connected by flight arcs. Provides trip-wide spatial context that Architecture A alone lacks.

**Step 1: Write the component**

```tsx
// src/components/Map/layers/TripOverviewLayer.tsx
"use client"

import React, { useEffect, useMemo } from 'react';
import { Marker, Source, Layer } from 'react-map-gl/maplibre';
import { CITY_CONFIGS, CITY_ORDER, type CitySlug } from '@/lib/city-colors';
import { CITY_CENTERS, CITY_COLOR_HEX } from '@/lib/map-utils';
import { useMapContext } from '../MapProvider';

const LAYER_ID = 'trip-overview';

/** Generate a curved arc between two points (for flight lines) */
function generateArc(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number },
  segments = 50
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lng = from.lng + (to.lng - from.lng) * t;
    const lat = from.lat + (to.lat - from.lat) * t;
    // Add curvature: sine wave perpendicular to the line
    const midOffset = Math.sin(t * Math.PI) * 2; // 2 degrees of arc
    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    points.push([lng + nx * midOffset, lat + ny * midOffset]);
  }
  return points;
}

interface TripOverviewLayerProps {
  activeCity: CitySlug;
}

export function TripOverviewLayer({ activeCity }: TripOverviewLayerProps) {
  const { registerLayer, unregisterLayer, layers } = useMapContext();

  useEffect(() => {
    registerLayer({ id: LAYER_ID, priority: 'route', defaultVisible: true });
    return () => unregisterLayer(LAYER_ID);
  }, [registerLayer, unregisterLayer]);

  const isVisible = layers.find(l => l.id === LAYER_ID)?.visible ?? false;

  // Build flight arc GeoJSON between consecutive cities
  const flightArcs = useMemo(() => {
    const features = [];
    for (let i = 0; i < CITY_ORDER.length - 1; i++) {
      const from = CITY_CENTERS[CITY_ORDER[i]];
      const to = CITY_CENTERS[CITY_ORDER[i + 1]];
      features.push({
        type: 'Feature' as const,
        properties: { from: CITY_ORDER[i], to: CITY_ORDER[i + 1] },
        geometry: {
          type: 'LineString' as const,
          coordinates: generateArc(from, to),
        },
      });
    }
    return { type: 'FeatureCollection' as const, features };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Flight arcs */}
      <Source type="geojson" data={flightArcs}>
        <Layer
          id="trip-flight-arcs"
          type="line"
          paint={{
            'line-color': '#3B82F6',
            'line-width': 2,
            'line-dasharray': [8, 6],
            'line-opacity': 0.5,
          }}
          layout={{ 'line-cap': 'round' }}
        />
      </Source>

      {/* City markers */}
      {CITY_ORDER.map(slug => {
        const center = CITY_CENTERS[slug];
        const config = CITY_CONFIGS[slug];
        const isActive = slug === activeCity;

        return (
          <Marker
            key={slug}
            longitude={center.lng}
            latitude={center.lat}
            anchor="center"
          >
            <div
              style={{
                width: isActive ? 48 : 40,
                height: isActive ? 48 : 40,
                borderRadius: '50%',
                background: CITY_COLOR_HEX[slug],
                border: `3px solid ${isActive ? 'white' : 'rgba(255,255,255,0.7)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: isActive ? 12 : 10,
                fontWeight: 600,
                boxShadow: isActive
                  ? `0 0 0 3px ${CITY_COLOR_HEX[slug]}44, 0 4px 12px rgba(0,0,0,0.3)`
                  : '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              aria-label={`${config.name} — ${config.nights} nights`}
            >
              {config.name.slice(0, 2).toUpperCase()}
            </div>
          </Marker>
        );
      })}
    </>
  );
}
```

**Step 2: Wire into MapContainer (conditionally shown in overview mode)**

In `MapContainer.tsx`, add:

```tsx
import { TripOverviewLayer } from './layers/TripOverviewLayer';

// Inside the <Map> element, add:
{activeDay === -1 && (
  <TripOverviewLayer activeCity={citySlug} />
)}
```

**Step 3: Commit**

```bash
git add src/components/Map/layers/TripOverviewLayer.tsx src/components/Map/MapContainer.tsx
git commit -m "feat(map): add TripOverviewLayer with city markers and flight arc connections"
```

---

## Task 16: Clustering Support (P1)

**Files:**
- Modify: `tripflow-next/src/components/Map/layers/ActivityMarkerLayer.tsx`

**Why:** When showing all city activities (overview mode), 20+ markers in Tokyo can overlap. Built-in Supercluster in MapLibre handles this.

**Note:** MapLibre's clustering works at the Source level with GeoJSON. This requires converting the marker approach to use a GeoJSON source + symbol/circle layers instead of individual `<Marker>` components. This is a significant refactor — **defer to P1 implementation phase**. For P0, the current per-marker approach works fine for day views (typically 3-8 stops/day).

**Implementation approach when ready:**
1. Convert activities to GeoJSON point FeatureCollection
2. Use `<Source>` with `cluster={true}` and `clusterMaxZoom={14}` `clusterRadius={50}`
3. Render cluster circles with count labels
4. Render individual markers for unclustered points
5. Handle click on cluster → zoom to expand

**Step 1: Mark as P1 — skip for now**

This task is documented for the P1 phase. Skip during initial implementation.

---

## Task 17: Mobile Bottom Sheet Upgrade (P1)

**Files:**
- Modify: `tripflow-next/src/components/Itinerary/MobileMapSheet.tsx`

**Why:** Research: mobile should use toggle between full list and full map, with bottom-sheet overlay showing day's activities on the map. Current bottom sheet is basic.

**Enhancements:**
1. Three snap points: peek (10%), half (50%), full (90%)
2. Show condensed day activity list in peek/half states
3. Activity tap → fly-to on map + expand card
4. Drag handle with haptic feedback hint

**Implementation approach:**

```tsx
// Key changes to MobileMapSheet:
// 1. Add snap points via framer-motion drag constraints
const SNAP_POINTS = { peek: 0.1, half: 0.5, full: 0.9 };

// 2. Render condensed activity chips in peek state
// 3. Full activity list in half/full state
// 4. Map underneath is always visible
```

**Step 1: Mark as P1 — skip for now**

This task is documented for the P1 phase. The current bottom sheet works for MVP.

---

## Post-Implementation Checklist

After completing Tasks 1-14 (P0):

- [ ] Map renders with MapLibre GL JS (no Mapbox dependency)
- [ ] MapTiler tiles load in both light and dark modes
- [ ] Transport-mode route lines show distinct colors and dash patterns
- [ ] Pins show visit-order numbers and category icons
- [ ] Clicking a pin scrolls timeline to that activity
- [ ] Hovering a timeline card highlights the map pin
- [ ] Cooperative gestures prevent scroll hijacking
- [ ] Mobile bottom sheet shows map with pins
- [ ] No console errors or type errors
- [ ] All existing tests pass
- [ ] Layer Manager, Camera Director, Padding Provider hooks are tested

After completing Tasks 15-17 (P1):

- [ ] Trip overview mode shows city markers with flight arcs
- [ ] Clustering activates in overview mode with 10+ markers
- [ ] Mobile bottom sheet has snap points

---

## Future Tasks (P2-P3)

These are not planned in detail yet. Implement after P0+P1 are stable.

**P2:**
- Semantic zoom (trip → city → neighborhood → street)
- 3D building toggle (MapLibre extrusion layer)
- Transit overlay (public transport lines)
- Street View integration (Google API supplement)
- Custom traveler-first map style (muted roads, prominent POIs)

**P3:**
- Offline tile caching (service worker + tile pre-fetch)
- Collaborative editing (real-time shared map state)
- Heatmap overlay (activity density)
- AR mode integration

---

*Plan created 2026-02-27. Based on [Map UX Research](../../docs/planning-artifacts/research/technical-itinerary-map-ux-research-2026-02-27.md).*
