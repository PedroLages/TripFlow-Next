# Interactive Map UX/UI Patterns for Itinerary & Travel Planning

> **Research document -- not implementation guidance.**
> Compiled: 2026-02-27 | Confidence tags: [High], [Medium], [Low]

---

## Table of Contents

1. [Map Interaction Models](#1-map-interaction-models)
2. [Map Plugins & Extensions](#2-map-plugins--extensions)
3. [Visual Style & Hierarchy](#3-visual-style--hierarchy)
4. [Map + Timeline Interaction Patterns](#4-map--timeline-interaction-patterns)
5. [Content & Info Density](#5-content--info-density)
6. [Accessibility & Performance](#6-accessibility--performance)

---

## 1. Map Interaction Models

### 1.1 Gesture Models: Mobile vs Desktop

**Desktop interactions** [High Confidence]

| Gesture | Action |
|---------|--------|
| Click + drag | Pan the map |
| Scroll wheel | Zoom in/out |
| Double-click | Zoom in one level |
| Ctrl/Cmd + scroll | Cooperative zoom (when embedded in scrollable page) |
| Right-click + drag | Rotate / tilt (3D maps) |
| Keyboard arrows | Pan; +/- for zoom |

**Mobile interactions** [High Confidence]

| Gesture | Action |
|---------|--------|
| One-finger drag | Pan |
| Two-finger pinch/spread | Zoom in/out |
| Two-finger rotate | Rotate map bearing |
| Two-finger vertical swipe | Tilt / adjust pitch |
| Double-tap | Zoom in one level |
| Two-finger double-tap | Zoom out one level |
| Double-tap + drag down | Continuous zoom in |
| Double-tap + drag up | Continuous zoom out |

Sources: [Google Maps SDK Controls & Gestures](https://developers.google.com/maps/documentation/android-sdk/controls), [Mapbox Gestures Guide](https://docs.mapbox.com/android/maps/guides/user-interaction/gestures/), [Google Maps iOS Controls](https://developers.google.com/maps/documentation/ios-sdk/controls)

**Key design challenge -- swipe ambiguity** [High Confidence]:
On mobile, a map embedded in a scrollable page can "hijack" the scroll gesture, trapping users on the map. The standard solution is **cooperative gesture handling**: single-finger gestures scroll the page while two-finger gestures interact with the map. On desktop, scroll-wheel zoom requires Ctrl/Cmd to be held. Google, Mapbox, and Leaflet all support a `gestureHandling: "cooperative"` option.

Sources: [Google Cooperative Gesture Handling](https://developers.google.com/maps/documentation/javascript/examples/interaction-cooperative), [Leaflet.GestureHandling plugin](https://github.com/elmarquis/Leaflet.GestureHandling), [Google Smart Scrolling blog](https://mapsplatform.google.com/resources/blog/smart-scrolling-comes-to-mobile-web-maps/), [Mapbox Cooperative Gestures](https://docs.mapbox.com/mapbox-gl-js/example/cooperative-gestures/)

**gestureHandling modes** [High Confidence]:

| Mode | Behavior |
|------|----------|
| `cooperative` | Scroll/single-finger moves page; two-finger/Ctrl+scroll moves map |
| `greedy` | All gestures interact with map |
| `auto` | Cooperative if page is scrollable, greedy if not |
| `none` | Map ignores all user gestures |

**Recommendation for embedded itinerary maps**: Use `cooperative` or `auto` to prevent scroll hijacking when the map sits alongside a scrollable itinerary list.

Source: [Google JS API Interaction](https://developers.google.com/maps/documentation/javascript/interaction)

---

### 1.2 Day Segments vs Continuous Route Display

Modern travel planning apps overwhelmingly use **day-segmented route display** rather than showing the entire multi-day trip as one continuous route. [High Confidence]

**How leading apps handle this**:

- **Wanderlog**: When places are added to a day in the itinerary, the map automatically draws route lines between those places for that day only. Pins are color-coded by day/section. A compact view condenses each day to a list of places. Source: [Wanderlog FAQ](https://wanderlog.com/blog/faq/), [Wanderlog Help Center](https://help.wanderlog.com/hc/en-us/articles/13356092870427-Itinerary-compact-view)

- **Mappr**: Supports five distinct travel modes rendered with different visual treatments: flights (curved blue dashed lines), trains (purple dashed), driving (solid amber), cycling (green dashed), walking (red dotted). Source: [Mappr Travel Map Planner](https://www.mappr.co/travel-map-planner-visualize-multi-stop-trip-itineraries/)

- **MAPOG**: Clusters nearby destinations into logical daily groups, optimizing route flow and spatial relationships. Source: [MAPOG Multi-Day Routes](https://www.mapog.com/plan-multi-day-travel-routes-using-interactive-maps/)

**Design pattern**: Each day is a selectable segment. Selecting a day shows only that day's pins and routes, with other days dimmed or hidden. This reduces cognitive load by keeping the visible information set manageable.

---

### 1.3 Smooth Transitions Between Itinerary Items

**Fly-to animations** [High Confidence]:
When a user selects an itinerary item, the map camera should smoothly animate to that location. Both Mapbox and Google Maps provide fly-to / ease-to APIs:

- `map.flyTo({ center, zoom, bearing, pitch })` -- Mapbox
- `map.moveCamera()` with easing -- Google Maps 3D
- Individual camera properties (zoom, bearing, center) can be animated independently

Source: [Mapbox Fly-to iOS](https://docs.mapbox.com/ios/maps/examples/fly-to/), [Mapbox Fly-to Android](https://docs.mapbox.com/android/maps/examples/animate-map-camera/), [Mapbox Fly-to Options](https://docs.mapbox.com/mapbox-gl-js/example/flyto-options/)

**Google Maps prototyping insight** [High Confidence]:
A UX Engineer at Google experimented with HTML5 canvas tile compositing to synchronize animations with zoom. By scaling and overlaying tiles from multiple zoom levels, they achieved smooth transitions between integral zoom levels. The cross-fade technique (similar to Google Photos' low-res to high-res approach) blends tiles from different zoom levels. While prototyping-focused, this approach powered "dozens of prototypes" before vector rendering superseded it.

Source: [Prototyping a Smoother Map -- Google Design](https://medium.com/google-design/google-maps-cb0326d165f5)

**Best practices for itinerary transitions**:
- Zoom level should be chosen to frame the destination with context (not too close, not too far)
- Animation duration should be proportional to distance traveled (avoid jarring instant jumps)
- Transition between zoom levels should use smooth cinematographic motion
- During tile loading, show a blurred version of the previous view rather than blank tiles

Source: [Map UI Patterns -- Zoom Control](https://mapuipatterns.com/zoom-control/)

---

### 1.4 Focus/Defocus Behavior

When an itinerary item is selected: [Medium Confidence]

1. **Zoom to fit**: Adjust map bounds to contain the selected item and its immediate surroundings
2. **Fly-to**: Animate camera to center on the item at an appropriate zoom level
3. **Bounds adjustment**: For multi-stop items (e.g., a walking route), fit the map to show the entire segment
4. **Defocus**: When deselecting, return to the previous view level or to a day-overview zoom

**Common pattern**: Selected marker becomes visually prominent (larger, highlighted color, elevated z-index) while non-selected markers become desaturated or semi-transparent.

---

### 1.5 Offline / Low-Connectivity Fallbacks

**Strategies** [High Confidence]:

| Strategy | Description |
|----------|-------------|
| **Pre-caching** | Download map tiles for planned areas while on WiFi |
| **Progressive download** | Fetch tiles based on user behavior and location patterns, not all at once |
| **Current-area priority** | Always cache the user's current location area first |
| **Graceful degradation** | Show cached data with a timestamp; offer retry when connectivity returns |
| **Offline mode indicator** | Display clear banner/icon when in offline mode |
| **Smart switching** | Seamlessly transition between online and cached tile data |

**Storage efficiency**: Mapbox's modern offline tile packs take up to 40% less storage space than older formats without sacrificing coverage or detail.

Sources: [Mapbox Offline Maps Blog](https://www.mapbox.com/blog/more-efficient-offline-map-tiles-save-up-to-40-storage-space), [Mapbox Offline Guide](https://docs.mapbox.com/android/maps/guides/offline/), [Glance -- Offline Maps Best Practices](https://thisisglance.com/learning-centre/whats-the-best-way-to-handle-offline-maps-in-mobile-apps/)

**Itinerary-specific consideration**: For a travel app, pre-cache tiles for all cities in the itinerary at relevant zoom levels (city overview + neighborhood detail) before the trip begins. This is especially critical for China (where Google Maps tiles may be unavailable) and Japan (where connectivity may be inconsistent in rural areas).

---

## 2. Map Plugins & Extensions

### 2.1 Route Optimization

**Mapbox Optimization API** [High Confidence]:
Returns a duration-optimized route visiting a set of input coordinates. Solves the Traveling Salesman Problem variant. Useful for: reordering stops within a day to minimize travel time.

- Accepts up to 12 coordinates per request
- Returns optimized waypoint order and route geometry
- Available via REST API and Java SDK

Sources: [Mapbox Optimization API Docs](https://docs.mapbox.com/api/navigation/optimization/), [Mapbox Optimization Tutorial](https://docs.mapbox.com/help/tutorials/optimization-api/), [Mapbox Java SDK Optimization](https://docs.mapbox.com/android/java/guides/services/optimization/)

**Itinerary context**: Extremely useful for day-planning -- drag-and-drop reordering of stops combined with automatic route optimization. Cognitive load implication: reduces decision fatigue by automating "what order should I visit things?"

---

### 2.2 Traffic & Real-Time Transit Overlays

**Google Maps Layers** [High Confidence]:

| Layer | What It Shows |
|-------|---------------|
| `TrafficLayer` | Real-time traffic conditions (color-coded road segments) |
| `TransitLayer` | Public transit network (major lines as colored routes) |
| `BicyclingLayer` | Bike paths and recommended cycling routes |

All three are togglable layers, available in select regions. Transit data comes from the Google Transit Partner Program.

Source: [Google Maps Traffic/Transit/Bicycling Layers](https://developers.google.com/maps/documentation/javascript/trafficlayer)

**Mapbox Navigation SDK** [High Confidence]:
Provides route line rendering with real-time traffic conditions visualized on the route line itself (green/yellow/red segments).

Source: [Mapbox Route Line](https://docs.mapbox.com/android/navigation/guides/ui-components/route-line/)

**Itinerary context**: Transit overlay is useful during the planning phase to show which transit lines connect stops. Traffic layer is more relevant for day-of execution. Cognitive load: these layers add visual complexity -- they should be opt-in toggles, not shown by default.

---

### 2.3 Location Clustering

**Problem solved**: When many markers overlap at a given zoom level, they become unreadable. Clustering groups nearby markers into a single aggregate marker. [High Confidence]

**Implementations**:

| Platform | Approach |
|----------|----------|
| **Mapbox GL JS** | Built-in cluster functions via `source.cluster: true`. Supports Supercluster for millions of points. |
| **Google Maps** | MarkerClusterer utility library. Grid-based algorithm (default 60x60px grid). |
| **Leaflet** | Leaflet.markercluster plugin. Smooth animations, spider layout for co-located markers. |
| **Mapbox Tiling Service** | Server-side clustering for high-point-count datasets. |

**UX best practices** [High Confidence]:
- Display a **count label** inside each cluster circle
- Use **click-to-zoom** so users can drill into dense areas
- At maximum zoom, use **spider/spiral layout** (Overlapping Marker Spiderfier) to fan out co-located markers
- Cluster icon size should scale proportionally to marker count
- Use distinct colors for cluster size tiers (e.g., green < 10, yellow 10-50, red > 50)

Sources: [Google Cluster Blog](https://mapsplatform.google.com/resources/blog/how-cluster-map-markers/), [Map UI Patterns -- Cluster Marker](https://mapuipatterns.com/cluster-marker/), [Mapbox Supercluster](https://blog.mapbox.com/clustering-millions-of-points-on-a-map-with-supercluster-272046ec5c97), [Mapbox Clustering Example](https://docs.mapbox.com/mapbox-gl-js/example/cluster/)

**Itinerary context**: Clustering is essential when showing an entire multi-city trip overview. At city level, individual markers should be visible. At trip level, cities themselves may cluster. Cognitive load: well-designed clustering dramatically reduces visual overwhelm.

---

### 2.4 Heatmaps

**What they show**: Density of points in a given area using color gradients. [High Confidence]

- **Mapbox GL JS**: Dynamic heatmap layer renders at 60fps during pan/zoom. Combined with clustering for performance. Supports 19 colorblind-friendly palettes.
- **Leaflet**: `Leaflet.heat` plugin -- tiny, simple, fast. Uses simpleheat with grid-based clustering.

Sources: [Mapbox Heatmaps Blog](https://blog.mapbox.com/introducing-heatmaps-in-mapbox-gl-js-71355ada9e6c), [Mapbox Studio Heatmap Styling](https://www.mapbox.com/blog/quickly-create-custom-marker-and-heatmap-styles-in-mapbox-studio), [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)

**Itinerary context**: Useful for showing "activity density" in a city -- where most of a traveler's planned stops cluster. Helps identify if a day's itinerary is geographically concentrated or spread out. Cognitive load: moderate -- heatmaps are intuitive but add a visual layer. Best used as an optional overlay.

---

### 2.5 3D Buildings & Landmarks

**Google Photorealistic 3D Tiles** [High Confidence]:
Seamless 3D mesh model of the real world, textured with high-resolution imagery. Available across 2500+ cities in 49 countries. Supports:
- Custom glTF 3D models rendered directly in maps
- Immersive views of buildings, routes, and landmarks
- Virtual tours and destination previews

Source: [Google 3D Maps Blog](https://mapsplatform.google.com/resources/blog/create-immersive-3d-map-experiences-photorealistic-3d-tiles/), [Google 3D Maps API](https://mapsplatform.google.com/maps-products/3d-maps/)

**Leaflet**: OSM Buildings plugin adds 2.5D building extrusions.

Source: [Leaflet Plugins](https://leafletjs.com/plugins.html)

**Mapbox**: Built-in 3D terrain and building extrusion support. Sky background based on time of day.

Source: [Mapbox Map Design](https://docs.mapbox.com/help/dive-deeper/map-design/)

**Itinerary context**: 3D buildings are valuable for orientation at destinations -- recognizing a temple, skyscraper, or station visually before arriving. Especially useful for Tokyo, Shanghai, and Hong Kong where vertical navigation matters. Cognitive load: moderate-high. 3D adds visual richness but can overwhelm. Best as an opt-in view mode.

---

### 2.6 Street-Level Imagery

- **Google Street View**: 360-degree imagery integration, widely available in all 6 trip cities
- **Apple Look Around**: Available in select cities (Tokyo, Osaka have coverage; China coverage limited)

**Itinerary context**: Extremely useful for "pre-walking" a route -- seeing what a restaurant entrance looks like, previewing a temple approach, or checking the neighborhood around a hotel. Cognitive load: low when used on-demand; the immersive view is naturally engaging.

Source: [Google 3D Maps Mobile Blog](https://mapsplatform.google.com/resources/blog/introducing-3d-maps-on-mobile-build-immersive-experiences-for-android-and-ios/)

---

### 2.7 AR Mode

**Current state** [Medium Confidence]:
- **Google Maps Live View**: Overlays walking directions on camera feed. Available since 2019, supports 300+ cities.
- Market projected to grow from $1.17B (2024) to $6.33B (2029), CAGR 40.3%.
- Mercedes 2020 GLE was among the first cars with an AR navigation screen.

Sources: [Agilie AR Navigation Guide](https://agilie.com/blog/augmented-reality-navigation-killer-feature-for-your-mapping-app), [PostIndustria AR Maps](https://postindustria.com/augmented-reality-map-apps-a-new-approach-to-navigation/), [BrandXR Google Maps AR Guide](https://www.brandxr.io/mastering-google-maps-ar-navigation-and-live-view-a-complete-guide)

**Itinerary context**: AR navigation is most useful during trip execution (not planning). For walking directions in unfamiliar cities (especially those with complex layouts like Tokyo or Shanghai), AR overlays can dramatically reduce wayfinding cognitive load. However, AR is battery-intensive and requires camera permissions.

---

### 2.8 Summary: Plugin Cognitive Load Matrix

| Plugin/Feature | Problem Solved | Planning Phase | Execution Phase | Cognitive Load |
|---|---|---|---|---|
| Route optimization | Minimize travel time between stops | High value | Medium | Low (automated) |
| Traffic overlay | Show current road conditions | Low | High | Medium |
| Transit overlay | Show public transit options | High | High | Medium |
| Clustering | Reduce marker visual clutter | High | Low | Low (reduces load) |
| Heatmaps | Show activity density | Medium | Low | Medium |
| 3D buildings | Spatial orientation | Medium | High | Medium-High |
| Street View | Preview locations | Medium | High | Low |
| AR mode | Walking navigation | None | High | Low (in-context) |

---

## 3. Visual Style & Hierarchy

### 3.1 Map Color Schemes

**Light vs Dark mode** [High Confidence]:

| Mode | Use Case | Design Principle |
|------|----------|-----------------|
| **Light** | Daytime, outdoor, planning mode | High contrast, clear labels, standard cartography |
| **Dark** | Nighttime, low-light, execution mode | Minimize distraction, dim everything, just-readable contrast |
| **FOLLOW_SYSTEM** | Automatic switching | Respects OS-level dark mode preference |

**Implementation**:
- Google Maps: `ColorScheme.LIGHT`, `ColorScheme.DARK`, `ColorScheme.FOLLOW_SYSTEM`
- Mapbox: Full style customization via Mapbox Studio
- MapTiler: Pre-built dark basemap optimized for navigation

Sources: [Google Maps Color Scheme](https://developers.google.com/maps/documentation/javascript/mapcolorscheme), [MapTiler Dark Maps](https://www.maptiler.com/maps/dark/), [MapTiler Dark Mode Blog](https://www.maptiler.com/news/2020/05/maps-for-dark-mode/)

**Travel app palette conventions** [Medium Confidence]:
Industry colors for travel apps tend to be green, orange, red, and blue. However, consistency within the app's brand identity matters more than following conventions.

Source: [Purrweb Travel App Practices](https://www.purrweb.com/blog/11-ui-ux-practices-for-a-travel-app-design/)

**Dark mode design considerations** [High Confidence]:
- Same color logic should apply to both modes for consistency
- Lower luminance in dark mode requires lower opacity for semi-transparent elements
- Light-hued + light-toned color combinations are unstable in dark mode -- test contrast carefully
- Contrast must remain 3:1 minimum for non-text elements per WCAG 1.4.11

Source: [Medium: Dark Mode Color Palette](https://medium.com/100-days-in-kyoto-to-create-a-web-app-with-google/day-9-picking-the-dark-mode-color-palette-for-web-app-buttons-logically-7d4ef0c3bced)

---

### 3.2 Pin/Marker Iconography

**Marker types and when to use them** [High Confidence]:

| Type | Best For | Visual Behavior |
|------|----------|----------------|
| **Circle marker** | Most use cases; visually clean | Better icon visibility inside; no exact position indicator |
| **Pin marker** | Pinpointing exact locations | Bottom tip indicates precise location |
| **Custom shape** | Highlighting location properties | Category-specific shapes (e.g., fork for restaurant) |
| **Text marker** | Price labels, ratings | Direct communication of key data |

**Icon design rules** [High Confidence]:
- Use **filled icons or thick outlines** -- thin-line icons are hard to distinguish at small sizes
- Icon should use most of the marker's real estate without touching the border
- Assign category-specific icons (wine glass for bars, bed for hotels, camera for viewpoints)
- Assign different colors per day/section for itinerary apps

Sources: [Mobbin -- Map Pin UI Design](https://mobbin.com/glossary/map-pin), [Mapme -- Creating Great Markers](https://mapme.com/blog/how-to-create-great-map-markers/), [UXPin -- Map UI](https://www.uxpin.com/studio/blog/map-ui/)

**Itinerary-specific marker design**:
- Color-code pins by day (Day 1 = blue, Day 2 = green, etc.)
- Use category icons inside pins (temple, restaurant, hotel, transport)
- Selected pin should be larger/highlighted; unselected pins dimmer
- Number pins in visit order within each day

---

### 3.3 Route Line Styles

**Transport mode differentiation** [High Confidence]:

| Mode | Color | Line Style | Notes |
|------|-------|------------|-------|
| Flight | Blue | Curved dashed arc | Simulates great-circle path |
| Train | Purple | Dashed line | |
| Car/Driving | Amber | Solid line | |
| Walking | Red | Dotted line | |
| Cycling | Green | Dashed line | |
| Bus | Low-contrast color | Thin solid line | |

**Design principles**:
- Use **both color AND line style** to differentiate modes (not just one dimension)
- Solid lines for primary/frequent routes; dashed for express/occasional
- Thicker lines for major transport (train); thinner for secondary (bus)
- Custom dash patterns (dot-dash) for specialized services (airport shuttles)

Sources: [Mappr Travel Map Planner](https://www.mappr.co/travel-map-planner-visualize-multi-stop-trip-itineraries/), [Map Library -- Visualize Transportation Networks](https://www.maplibrary.org/1473/creative-ways-to-visualize-transportation-networks/), [ResearchGate -- Colour codes for routes](https://www.researchgate.net/figure/Colour-codes-for-representing-the-different-routes-on-transport-maps_fig1_237005166)

---

### 3.4 Text Label Hierarchy

**Cartographic typography rules** [High Confidence]:

| Element | Size | Font | Style | Effect |
|---------|------|------|-------|--------|
| Country/region names | 14pt+ | Serif | Uppercase, letterspaced | Promotes in hierarchy |
| City names | 12-14pt | Sans-serif | Bold | High visibility |
| Neighborhood/district | 10-12pt | Sans-serif | Regular | Medium visibility |
| Street names | 8-10pt | Sans-serif | Regular or light | Background context |
| POI labels | 8-10pt | Sans-serif | Regular | On-demand visibility |

**Placement priority** (for point feature labels):
1. Above and to the right (preferred)
2. Below and to the right
3. Above and to the left
4. Below and to the left

**Contrast requirements**:
- Light text (85%+ white) on dark backgrounds
- Dark text (85%+ black) on light backgrounds
- Minimum 4.5:1 contrast ratio for WCAG compliance

Sources: [Axis Maps -- Labeling Guide](https://www.axismaps.com/guide/labeling), [Map Library -- Typography Rules](https://www.maplibrary.org/1617/understanding-the-role-of-typography-in-mapping/), [Colorado Pressbooks -- Typography in Cartography](https://colorado.pressbooks.pub/makingmaps/chapter/typography/)

---

### 3.5 Custom Styling Tools

**Mapbox Studio** [High Confidence]:
- Style Components: groups of associated layers representing common cartographic features
- Curated controls for color, typography, and feature density
- 19 colorblind-friendly palettes for data visualization
- Configuration options for toggling labels, adjusting lighting, changing fonts
- 3D styling with sky features based on time of day
- Prebuilt styles available as starting points

Sources: [Mapbox Studio](https://www.mapbox.com/mapbox-studio), [Mapbox Map Design Guide](https://docs.mapbox.com/help/dive-deeper/map-design/), [Mapbox Style Components](https://docs.mapbox.com/studio-manual/guides/map-styling/)

**Google Maps Cloud-Based Styling** [High Confidence]:
- Customize ~100 individual map features across 4 categories
- No-code editor at mapstyle.withgoogle.com
- Changes reflect across JS, iOS, and Android without code updates
- Map ID system: update styles server-side, no app updates needed
- Map inspector: click anywhere to see styleable features at that location

Sources: [Google Cloud-Based Styling](https://developers.google.com/maps/documentation/javascript/cloud-customization), [Google Styling Wizard](https://mapstyle.withgoogle.com/)

**Design tokens approach** [Medium Confidence]:
Both Mapbox and Google support a component/token-based approach to theming, where high-level controls (e.g., "land color", "water color", "road weight") cascade to multiple underlying layers. This aligns well with design system thinking.

---

## 4. Map + Timeline Interaction Patterns

### 4.1 Split-View Patterns

**The dominant layout for travel/itinerary apps** [High Confidence]:

```
+-------------------------+------------------+
|                         |                  |
|   Itinerary List        |   Map View       |
|   (scrollable)          |   (interactive)  |
|                         |                  |
|   Day 1                 |   [pins & routes]|
|     - Stop A            |                  |
|     - Stop B            |                  |
|   Day 2                 |                  |
|     - Stop C            |                  |
|                         |                  |
+-------------------------+------------------+
```

**Research finding**: 70% of OTA and large-brand hotel sites display search results in a "List View" without a map by default. However, research shows that exact location is essential to users evaluating results. Split view simplifies evaluation by combining spatial and textual information. [High Confidence]

Source: [Baymard Institute -- Optimal Hotel Search Layout](https://baymard.com/blog/accommodations-split-view)

**Layout variants** [High Confidence]:

| Layout | Desktop | Mobile | Use Case |
|--------|---------|--------|----------|
| **Side-by-side** (list left, map right) | Primary pattern | Not practical | Planning/browsing |
| **Stacked** (list above, map below) | Secondary | Primary on mobile | Compact view |
| **Full map with overlay panel** | Advanced | Sliding bottom sheet | Exploration mode |
| **Toggle between list and map** | Secondary | Common | Space-constrained |

Source: [Map UI Patterns -- Mobile Map](https://mapuipatterns.com/mobile-map/), [Eleken -- Map UI Design](https://www.eleken.co/blog-posts/map-ui-design), [UXPin -- Map UI](https://www.uxpin.com/studio/blog/map-ui/)

**Mobile-specific recommendation** [High Confidence]:
Toggle between List (no map) and Full Map. Avoid partial/embedded maps on mobile -- they look overcrowded and cause gesture conflicts. Use a collapsible panel or bottom sheet that overlays the map.

Source: [Map UI Patterns -- Mobile Map](https://mapuipatterns.com/mobile-map/)

---

### 4.2 Linked Selection (Bidirectional)

**Pattern**: Selecting an item in the timeline/list highlights the corresponding marker on the map, and vice versa. [High Confidence]

**Implementation approaches**:

1. **List-to-map**: Clicking a timeline item triggers `map.flyTo()` to the marker's coordinates and highlights the marker (color change, size increase, z-index boost)

2. **Map-to-list**: Clicking a marker scrolls the timeline/list to the corresponding item and highlights it (background color change, border emphasis)

3. **Linked brushing**: Selecting a time range on a timeline slider updates which markers are visible on the map. Used in Palantir Foundry and Observable for temporal-spatial exploration.

Sources: [Palantir -- Map Timeline](https://www.palantir.com/docs/foundry/map/timeline), [Observable -- Linked Brushing](https://observablehq.com/blog/linked-brushing), [Map UI Patterns -- Timeline Slider](https://mapuipatterns.com/timeline-slider/)

**Itinerary-specific pattern**:
- Day selector in the timeline filters map markers to show only that day
- Selecting a stop in the itinerary flies the map to that location
- Tapping a marker on the map scrolls the itinerary to that stop
- Active stop marker is visually distinct (larger, brighter, animated pulse)

---

### 4.3 Mini-Map vs Full-Screen Toggle

**Mini-map** [Medium Confidence]:
A miniature overview map placed in a corner, showing the user's current viewport within the broader context. Common in gaming UIs, less common in travel apps. Provides orientation without leaving the detail view.

Source: [Map UI Patterns -- Mini-map](https://ux-patterns.webgeodatavore.com/minimap/index.html)

**Full-screen toggle** [High Confidence]:
The Fullscreen control offers the option to open the map in fullscreen mode. Enabled by default on desktop and Android. Note: **iOS does not support the fullscreen feature** via the standard API.

Source: [Google Maps Controls](https://developers.google.com/maps/documentation/javascript/controls)

**Recommended mobile pattern**: Start with a compact map reference (peek view), allow expansion to full-screen, with a persistent floating button to toggle back. Avoid permanent split-screen on mobile.

---

### 4.4 Map Tooltips, Callouts & Information Overlays

**Tooltips (hover-triggered)** [High Confidence]:
- Appear on hover near the feature
- Show short, informative content (name, category, rating)
- Disappear when interaction ends
- **Not available on touch devices** -- use tap alternatives

**Callouts (click/tap-triggered)** [High Confidence]:
- Speech-bubble style popups connected to markers via callout lines
- Can accommodate labels, descriptions, images, logos
- Remain visible until explicitly dismissed
- On mobile: bottom-sheet pattern is preferred over floating callouts (avoids obscuring the map)

Sources: [Map UI Patterns -- Callout](https://mapuipatterns.com/call-out/), [Smashing Magazine -- Tooltips for Mobile](https://www.smashingmagazine.com/2021/02/designing-tooltips-mobile-user-interfaces/)

**Design pattern hierarchy for information retrieval** [High Confidence]:

```
Hover/Tap      -->  Tooltip (brief: name, type, rating)
                         |
Click/Tap      -->  Callout popup (moderate: photo, description, hours)
                         |
"More" action  -->  Detail panel (full: reviews, directions, booking)
```

Source: [Axis Maps -- Map Interaction](https://www.axismaps.com/guide/map-interaction)

---

### 4.5 Spatial Browsing & Discovery

**Extent-driven content** [Medium Confidence]:
Content in the UI synchronizes with the visible map extent. As the user pans/zooms, the list updates to show only items visible in the current viewport. Used by Airbnb, Zillow, and hotel search sites.

Source: [Map UI Patterns -- Building Single-Purpose Apps](https://mapuipatterns.com/category/building-single-purpose-apps/)

**URL state management** [High Confidence]:
Update the URL hash with map center, zoom, and active filters so users can share specific map views via copy-paste.

Source: [Axis Maps -- Map Interaction](https://www.axismaps.com/guide/map-interaction)

---

## 5. Content & Info Density

### 5.1 Information on Markers vs Detail Panels

**Three-tier information architecture** [High Confidence]:

| Tier | Trigger | Content | Container |
|------|---------|---------|-----------|
| **Glance** | Visible on marker | Category icon, day color, visit order number | The marker itself |
| **Preview** | Hover (desktop) / Tap (mobile) | Name, type, rating, thumbnail photo | Floating tooltip or MapTip |
| **Detail** | Click / Second tap | Full description, photos, hours, reviews, directions, booking actions | Fixed side panel or bottom sheet |

**Hybrid approach** [High Confidence]:
Show a few details on hover in a tooltip, then click for more in a fixed panel. Touch devices skip hover and go directly to a brief bottom-sheet preview on first tap, then full detail on second tap.

Sources: [Axis Maps -- Map Interaction](https://www.axismaps.com/guide/map-interaction), [Eleken -- Map UI Design](https://www.eleken.co/blog-posts/map-ui-design), [Mobbin -- Map Pin](https://mobbin.com/glossary/map-pin)

---

### 5.2 Hover States vs Tap/Click States

**Desktop** [High Confidence]:

| State | Visual Treatment | Content Shown |
|-------|-----------------|---------------|
| Default | Standard marker | Icon + color only |
| Hover | Slight scale-up, subtle glow/shadow | Tooltip with name and type |
| Selected/Active | Prominent scale-up, accent color, elevated z-index | Detailed panel opens |
| Focused (keyboard) | Focus ring | Same as hover |

**Mobile** [High Confidence]:
- No hover state exists
- Tap replaces hover: first tap shows preview, second tap opens detail
- Touch-and-hold is sometimes used for secondary actions but should be used sparingly (discoverability is poor)

Source: [Axis Maps -- Map Interaction](https://www.axismaps.com/guide/map-interaction)

---

### 5.3 Progressive Disclosure on Maps

**Semantic zoom** [High Confidence]:
Unlike geometric zoom (which merely scales), semantic zoom changes the **type and amount** of information displayed at different zoom levels. Objects can change shape, detail level, or even appear/disappear based on zoom context.

**Example in itinerary context**:

| Zoom Level | What's Visible |
|------------|----------------|
| Trip overview (world/continent) | City markers only, connected by flight arcs |
| City level | District/neighborhood labels, hotel marker, major landmarks |
| Neighborhood level | Individual stops with icons, walking routes, restaurant pins |
| Street level | Detailed labels, building outlines, street-level imagery links |

**Research finding**: Multi-level map organization with semantic zooming can render overview maps unnecessary, improves navigation speed, and enhances recall of map objects. [High Confidence]

Sources: [InfoVis Wiki -- Semantic Zoom](https://infovis-wiki.net/wiki/Semantic_Zoom), [Isaac Audet -- Semantic Zoom in Web Design](https://isaacaudet.com/2023/05/01/semantic-zoom-in-web-design/), [ACM -- Navigation Patterns and Usability of Zoomable UIs](https://dl.acm.org/doi/abs/10.1145/586081.586086)

---

### 5.4 Visual Clutter Reduction

**Strategies ranked by effectiveness** [High Confidence]:

1. **Clustering**: Group nearby markers into aggregate markers with count labels. Most impactful single technique.
2. **Filtering**: Let users toggle categories on/off (restaurants, temples, hotels). Show only relevant markers.
3. **Semantic zoom**: Show different detail levels at different zoom scales.
4. **Prioritization**: Show important markers first; hide less important ones until zoomed in.
5. **Aggregation**: Replace individual markers with area-level summaries (e.g., "12 restaurants" label on a neighborhood).
6. **Displacement**: Slightly offset overlapping markers to make both visible.

Sources: [BatchGeo -- Map Clustering](https://www.batchgeo.com/features/map-clustering/), [ResearchGate -- Visual Clutter Reduction](https://www.researchgate.net/publication/326308446_Visual_clutter_reduction_in_zoomable_proportional_point_symbol_maps), [Google Maps -- Marker Clustering](https://developers.google.com/maps/documentation/javascript/marker-clustering)

**Cognitive load research** [High Confidence]:
Human brains have limited processing power. When map information exceeds processing capacity, users take longer to understand, miss important details, or abandon the task entirely. "Many businesses unknowingly overwhelm visitors by presenting too many choices at once, leading to cognitive overload -- a state where the brain struggles to process excessive information, resulting in frustration, decision fatigue, and user abandonment."

Sources: [NN/g -- Minimize Cognitive Load](https://www.nngroup.com/articles/minimize-cognitive-load/), [Smashing Magazine -- Reducing Cognitive Overload](https://www.smashingmagazine.com/2016/09/reducing-cognitive-overload-for-a-better-user-experience/)

---

### 5.5 Maps as "Information Lasagna"

Maps are described as "information lasagna" with layers upon layers. Without clear visual hierarchy, users cannot tell what is important. [High Confidence]

**Layer hierarchy for itinerary maps**:

1. **Base map** -- geography, roads, water (lowest layer, most muted)
2. **Route lines** -- connecting stops within a day (mid layer, colored by transport mode)
3. **Area highlights** -- neighborhoods, districts of interest (subtle fills)
4. **Markers/pins** -- individual stops (highest layer, most prominent)
5. **Interactive overlays** -- tooltips, callouts, selection highlights (topmost)

Source: [Eleken -- Map UI Design](https://www.eleken.co/blog-posts/map-ui-design)

---

## 6. Accessibility & Performance

### 6.1 Keyboard Navigation (WCAG Compliance)

**Current state of map accessibility is poor** [High Confidence]:
A 2025 study evaluating 14 digital map tools against 15 WCAG 2.1 criteria found that only **one tool (Audiom) achieved full compliance**. Google Maps embed scored lowest at **7% compliance**. Bing Maps Embed was second at 53%.

Source: [PMC -- Systematically Evaluating Digital Map Tools Based on WCAG](https://pmc.ncbi.nlm.nih.gov/articles/PMC12094671/)

**15 WCAG criteria applicable to maps** [High Confidence]:

| Criterion | Requirement | Map-Specific Notes |
|-----------|-------------|-------------------|
| 1.1.1 Non-text Content | Text alternatives for all non-text content | Most tools provide only "Map region clickable" to screen readers |
| 1.3.1 Info & Relationships | Structure conveyed programmatically | Marker groupings, route relationships |
| 1.4.3 Contrast (Minimum) | 4.5:1 for text | Map labels must meet this |
| 1.4.11 Non-text Contrast | 3:1 for graphical objects | Map features, markers, route lines |
| 2.1.1 Keyboard | All functionality via keyboard | Pan (arrows), zoom (+/-), marker selection (Tab/Enter) |
| 2.1.2 No Keyboard Trap | User can navigate away | Map must not trap focus |
| 2.1.4 Character Key Shortcuts | Can be remapped/disabled | Map keyboard shortcuts |
| 2.4.3 Focus Order | Logical and meaningful | Tab through markers in logical order |
| 2.4.7 Focus Visible | Focus indicator visible | Focus ring on active marker/control |
| 2.5.5 Target Size | Minimum target size | Markers/controls must be large enough |
| 3.2.2 On Input | No context change on input | Zoom should not change focus unexpectedly |
| 4.1.2 Name, Role, Value | Programmatic name for all UI components | Markers need ARIA labels |

Source: [PMC -- Systematically Evaluating Digital Map Tools Based on WCAG](https://pmc.ncbi.nlm.nih.gov/articles/PMC12094671/)

**Keyboard navigation requirements** [High Confidence]:
- Enter key activates an action
- Tab key moves between interactive elements with visible focus
- Arrow keys pan the map
- +/- keys zoom
- Escape closes popups/overlays
- Spacebar opens menus/dropdowns

Sources: [WebAIM -- Keyboard Accessibility](https://webaim.org/techniques/keyboard/), [WCAG -- Keyboard Accessible](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)

---

### 6.2 Screen Reader Support

**Key challenges** [High Confidence]:
- Most map tools present as "Map region clickable" to screen readers, with all geographic information blank
- Markers need ARIA labels describing the location (e.g., `aria-label="Fushimi Inari Shrine, Kyoto - Day 7, Stop 3"`)
- Route information must have text alternatives describing connections
- Server-side image maps are inoperable by screen readers -- use client-side maps with semantic markup

**Fallback strategies** [High Confidence]:
- Provide an accessible list view as an alternative to the map
- Write alt text for static map images that explains the depicted information
- Announce map changes to screen readers via ARIA live regions
- Ensure all callouts/tooltips are in the DOM and reachable by assistive technology

Sources: [Minnesota IT -- Making Maps Accessible](https://mn.gov/mnit/about-mnit/accessibility/news/?id=38-645700), [WebAIM -- Alternative Text](https://webaim.org/techniques/alttext/), [UVA Library -- Accessible Web Maps](https://guides.lib.virginia.edu/c.php?g=1248895)

---

### 6.3 Color Contrast Requirements

**WCAG 1.4.11 Non-text Contrast** [High Confidence]:

| Element Type | Minimum Contrast Ratio | Against |
|-------------|----------------------|---------|
| Text (normal) | 4.5:1 | Background |
| Text (large, 18pt+) | 3:1 | Background |
| UI components (markers, buttons) | 3:1 | Adjacent colors |
| Graphical objects (route lines, areas) | 3:1 | Adjacent colors |
| Map area boundaries | 3:1 | Each adjacent area color |

**If adjacent map areas have < 3:1 contrast**, add a boundary line with at least 3:1 contrast against each area color.

**Exceptions**: Logos, flags, photography, medical diagrams, color gradients representing measurements (heatmaps).

Sources: [W3C -- Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html), [WebAIM -- Contrast](https://webaim.org/articles/contrast/), [Deque -- Non-text Contrast](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast)

---

### 6.4 Performance Under Load

**Marker rendering performance** [High Confidence]:

| Technique | Impact | Notes |
|-----------|--------|-------|
| **Canvas rendering** (Leaflet) | Major | Avoids DOM node creation for each marker |
| **Sprite sheets** (Mapbox) | Major | Pre-load icon sprite files; 118KB for FullHD, 270KB for 4K per 400 icons |
| **Clustering** | Major | Reduces number of rendered elements |
| **Viewport-only loading** | Major | Only load markers in visible area |
| **Avoid Draw() during interaction** | Moderate | Don't render overlays while user is panning/zooming |
| **feature-state** for hover/selection | Moderate | Avoids full layer re-render for state changes |

Sources: [Dev.to -- Optimizing Marker Performance](https://dev.to/mprojs/thousands-of-unique-icons-optimizing-marker-performance-in-google-maps-and-mapbox-gl-js-439e), [Google Maps Optimization Guide](https://developers.google.com/maps/optimization-guide), [Mapbox Rendering Performance](https://www.mapbox.com/blog/new-advanced-tools-for-map-rendering-performance-evaluation)

**Mapbox GL JS performance model** [High Confidence]:

```
Render time = constant + (sources x per-source) + (layers x per-layer) + (vertices x per-vertex)
```

**Optimization priorities**:
1. **Reduce layer count**: Merge similar layers using data-driven styling
2. **Consolidate sources**: Composite vector tile sources to reduce source overhead
3. **Use vector tilesets over GeoJSON**: Enables viewport-only loading with simplified geometries
4. **Set `minzoom`/`maxzoom`**: Prevent unnecessary filter evaluation at irrelevant zoom levels
5. **Use `feature-state`**: For hover/selection effects instead of data updates (avoids layer re-render)
6. **Remove unused features**: Append `?optimize=true` to style URLs for style-optimized tiles
7. **Group layers**: Layers with identical type, source, source-layer, zoom, filter, and layout are automatically batched

Source: [Mapbox GL JS Performance Guide](https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/)

---

### 6.5 Tile Loading & Caching

**Caching architecture** [High Confidence]:

| Layer | Behavior |
|-------|----------|
| **HTTP cache (ETags)** | Server responds "Not Modified" when data unchanged; saves bandwidth |
| **Disk cache** | Tiles persisted to storage by default |
| **Memory cache** | Tiles cached in RAM for instant re-display |
| **Volatile mode** | Tiles cached in memory only (not disk); set `"volatile": true` |

**Optimization techniques**:
- **Tile prefetching**: Preload tiles likely needed based on user behavior and current viewport direction
- **Background thread loading**: Fetch tiles without blocking main UI thread
- **Priority algorithms**: Load most relevant tiles first based on current view and interaction patterns
- **Style-optimized tiles**: Remove layers/features not used in the current style, reducing offline cache size

Sources: [Mapbox Cache Management](https://docs.mapbox.com/android/maps/guides/cache-management/), [Mapbox API Caching](https://docs.mapbox.com/help/troubleshooting/api-caching/), [Medium -- Optimizing Mobile Map Performance](https://medium.com/@animagun/optimizing-mobile-map-performance-strategies-for-blazing-fast-map-loading-ca6e0db210ec)

---

### 6.6 Mobile vs Desktop Performance

**Key differences** [Medium Confidence]:

| Factor | Desktop | Mobile |
|--------|---------|--------|
| GPU | Dedicated, powerful | Integrated, limited |
| Memory | 8-32GB typical | 4-8GB typical, shared |
| Network | Stable broadband | Variable cellular |
| Screen | Large viewport | Small viewport |
| Battery | Not a concern | Major concern |
| Touch rendering | N/A | Must maintain 60fps during gestures |

**Mobile-specific optimizations**:
- Reduce number of map layers visible at any time
- Use lower-resolution tiles on slower connections
- Implement aggressive viewport-only rendering
- Defer non-essential layer loading until map is idle
- Monitor frame rate and degrade gracefully (reduce detail) if dropping below 30fps

---

## Appendix A: Platform Comparison for Travel Apps

| Feature | Mapbox GL JS | Google Maps JS API | Leaflet + Plugins |
|---------|-------------|-------------------|-------------------|
| **Cost** | Freemium (50K free loads/mo) | Pay per load ($7/1000 loads) | Free (open source) |
| **Custom styling** | Full control (Mapbox Studio) | Cloud-Based Styling (~100 features) | Via tile providers |
| **Offline support** | Excellent (mobile SDKs) | Limited (mobile only) | Via plugins |
| **3D buildings** | Built-in extrusion | Photorealistic 3D Tiles | OSM Buildings plugin |
| **Clustering** | Built-in (Supercluster) | MarkerClusterer library | Leaflet.markercluster |
| **Route optimization** | Optimization API | Directions API (no optimization) | External services |
| **Heatmaps** | Built-in (60fps) | HeatmapLayer | Leaflet.heat plugin |
| **Street View** | N/A | Built-in | N/A |
| **Transit overlay** | Limited | TransitLayer | Limited |
| **Performance** | WebGL, very fast | Good | DOM-based, slower with many markers |
| **Bundle size** | ~230KB | ~180KB | ~40KB (core) |
| **React integration** | react-map-gl | @react-google-maps/api | react-leaflet |

Sources: [StackShare Comparison](https://stackshare.io/stackups/google-maps-vs-leaflet-vs-mapbox), [SoftKraft -- Mapbox vs Google Maps](https://www.softkraft.co/mapbox-vs-google-maps/), [LogRocket -- JS Mapping APIs Compared](https://blog.logrocket.com/javascript-mapping-apis-compared/), [GIS People -- Mapbox vs MapTiler vs MapLibre vs Leaflet](https://www.gispeople.com.au/mapbox-vs-maptiler-vs-maplibre-vs-leaflet-which-to-choose/)

---

## Appendix B: Key Reference Sites

| Resource | URL | What It Covers |
|----------|-----|---------------|
| Map UI Patterns | [mapuipatterns.com](https://mapuipatterns.com/) | Catalog of ~30+ map design patterns |
| Axis Maps Cartography Guide | [axismaps.com/guide](https://www.axismaps.com/guide/map-interaction) | Interaction, labeling, and typography |
| Mapbox Design Guide | [docs.mapbox.com](https://docs.mapbox.com/help/dive-deeper/map-design/) | Map design principles |
| Eleken Map UI Design | [eleken.co](https://www.eleken.co/blog-posts/map-ui-design) | Best practices with real-world examples |
| Baymard Institute | [baymard.com](https://baymard.com/blog/accommodations-split-view) | Split-view research for accommodations |
| NN/g Interactive Maps | [nngroup.com](https://www.nngroup.com/articles/interactive-ux-maps/) | Research-backed map UX guidelines |
| Design for Context | [designforcontext.com](https://www.designforcontext.com/insights/interactive-maps) | Enterprise map UX decisions |

---

## Appendix C: Conflicting Views & Open Questions

### Split View vs Toggle View on Mobile
- **View 1**: Map UI Patterns recommends toggling between list (no map) and full map on mobile, explicitly discouraging partial/embedded maps.
- **View 2**: Many production apps (Wanderlog, Airbnb) use a bottom-sheet pattern where a partial map is always visible with a draggable list overlay.
- **Resolution**: Both patterns work. The bottom-sheet approach requires careful gesture handling to avoid conflicts between sheet-dragging and map-panning.

### Clustering vs Filtering for Clutter Reduction
- **View 1**: Clustering is the primary solution -- automatically handles density.
- **View 2**: Filtering is more user-controllable and preserves individual marker identity.
- **Resolution**: Use both. Clustering handles automatic density management; filtering gives users explicit control over what categories are visible.

### Mapbox vs Google Maps for Travel Apps
- **View 1**: Mapbox offers superior customization, offline support, and route optimization.
- **View 2**: Google Maps has better data coverage (especially in Asia), Street View, and real-time transit.
- **Resolution**: For an Asia-focused travel app, Google Maps has the advantage in data coverage (especially China, where Mapbox tiles may have restrictions). However, Mapbox's styling flexibility and offline capabilities are compelling. A hybrid approach (Google for data/directions, Mapbox for visualization) is possible but adds complexity.

### 3D Buildings: Value vs Performance Cost
- **View 1**: 3D buildings significantly aid orientation and wayfinding.
- **View 2**: 3D rendering is GPU-intensive and adds visual complexity.
- **Resolution**: Offer 3D as an opt-in view mode. Default to 2D for performance and simplicity.

---

*End of research document.*
