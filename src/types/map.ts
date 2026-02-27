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
