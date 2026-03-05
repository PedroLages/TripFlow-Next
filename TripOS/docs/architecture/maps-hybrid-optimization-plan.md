# Maps Hybrid Optimization Plan

**Created**: February 9, 2026
**Status**: Future Enhancement (Post-MVP)
**Purpose**: Document hybrid map provider strategy for 50-75% cost savings at scale

---

## Executive Summary

**Current State (MVP):** Google Maps Platform for all users globally
**Future State:** Hybrid strategy - Google Maps for Asia, Mapbox/Apple Maps for US/Europe
**When to Implement:** After 500-1,000 users or when monthly maps cost exceeds $300
**Expected Savings:** 50-75% reduction in map costs vs Google-only
**Implementation Time:** 1-2 weeks for fallback pattern, 2-3 weeks for full regional routing

---

## Why Hybrid Strategy?

### Problem Statement

Google Maps costs scale linearly with usage:

| Users | Monthly Map Cost (Google-only) |
|-------|-------------------------------|
| 500 | $255/month |
| 1,000 | $510/month |
| 2,000 | $1,020/month |
| 5,000 | $2,550/month |
| 10,000 | $5,100/month |

**At 5,000 users:** $2,550/month maps cost = **$30,600/year** 💸

### Solution: Regional Provider Optimization

Use cheaper providers (Mapbox/Apple Maps) where they excel (US/Europe), keep Google Maps where it dominates (Asia).

**Expected Cost Reduction:**

| Users | Google-only | Hybrid (50% Asia) | Savings |
|-------|-------------|-------------------|---------|
| 1,000 | $510/month | $255/month | 50% ($255 saved) |
| 2,000 | $1,020/month | $510/month | 50% ($510 saved) |
| 5,000 | $2,550/month | $1,275/month | 50% ($1,275 saved) |
| 10,000 | $5,100/month | $2,550/month | 50% ($2,550 saved) |

**Assumptions:** 50% of trips are to Asia, 50% to US/Europe. If US/Europe ratio is higher (70%), savings increase to 60-70%.

---

## Provider Comparison Matrix

### Google Maps Platform

**Strengths:**
- ✅ Best global POI coverage (200M+ places)
- ✅ Excellent Asia coverage (Japan, India, Southeast Asia, China)
- ✅ Superior geocoding accuracy

**Weaknesses:**
- ❌ Expensive at scale ($7 per 1,000 map loads after free tier)
- ❌ Limited customization (basic styling only)

**Use For:** Asia trips (Japan, China, India, Southeast Asia, Korea)

---

### Mapbox (GL JS + Geocoding API)

**Strengths:**
- ✅ Generous free tier (50,000 loads/month)
- ✅ Excellent US/Europe coverage (50M+ POIs)
- ✅ Superior mobile UX (hardware-accelerated WebGL)
- ✅ Powerful customization (Mapbox Studio)

**Weaknesses:**
- ⚠️ Weak Asia POI coverage (missing restaurants, small businesses)
- ⚠️ Bundle size: ~300KB

**Use For:** US/Canada/Europe trips where POI coverage is strong

**Cost:**
- 0-50K loads/month: **$0**
- 50K-100K loads: $5 per 1K loads
- 100K+: $4 per 1K loads

---

### Apple Maps (MapKit JS)

**Strengths:**
- ✅ Incredibly generous free tier (250,000 loads/day = 7.5M/month!)
- ✅ Excellent US/Canada coverage (on par with Google in 2026)
- ✅ Good Europe coverage
- ✅ Privacy-focused

**Weaknesses:**
- ⚠️ Weak Asia coverage (missing 40% of roads in Japan, poor India coverage)
- ⚠️ Requires Apple Developer Program ($99/year)
- ⚠️ Must be public-facing (no login wall)

**Use For:** US/Canada/Europe trips (especially if aiming for near-zero cost)

**Cost:**
- $99/year = **$8.25/month** for essentially unlimited usage

---

## Hybrid Architecture Strategies

### Strategy A: Region-Based Routing (Most Savings)

**How It Works:**

```typescript
// Detect trip destination
function getMapProvider(tripCountry: string): MapProvider {
  const asianCountries = [
    'JP', 'CN', 'IN', 'TH', 'SG', 'KR', 'MY', 'ID', 'PH',
    'VN', 'HK', 'TW', 'BD', 'PK', 'MM', 'KH', 'LA'
  ];

  const europeanCountries = [
    'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT',
    'SE', 'NO', 'DK', 'FI', 'PT', 'GR', 'IE', 'PL', 'CZ'
  ];

  const northAmericanCountries = ['US', 'CA', 'MX'];

  if (asianCountries.includes(tripCountry)) {
    return GoogleMapsProvider;  // Best POI coverage
  }

  if (europeanCountries.includes(tripCountry) ||
      northAmericanCountries.includes(tripCountry)) {
    return MapboxProvider;  // Or AppleMapsProvider for $8/month
  }

  // Default fallback for other regions
  return GoogleMapsProvider;
}
```

**Pros:**
- ✅ Maximum cost savings (50-75% reduction)
- ✅ Best quality per region
- ✅ Clean separation of concerns

**Cons:**
- ⚠️ Inconsistent UX (maps look different by region)
- ⚠️ Higher complexity (two SDKs, two APIs)
- ⚠️ Edge cases (multi-country trips)
- ⚠️ Larger bundle size if both loaded

**When to Use:** After 1,000 users when cost savings justify complexity

---

### Strategy B: Fallback Pattern (Simpler)

**How It Works:**

```typescript
// Primary: Mapbox for all regions
// Fallback: Google Maps if POI not found

async function searchPlace(query: string, location: LatLng) {
  // Try Mapbox first
  const mapboxResults = await mapbox.geocode(query, location);

  // If insufficient results, fallback to Google
  if (mapboxResults.length < 3) {
    const googleResults = await googleMaps.geocode(query, location);
    return {
      provider: 'google-maps',
      results: googleResults,
      note: 'Additional results from Google Maps'
    };
  }

  return {
    provider: 'mapbox',
    results: mapboxResults
  };
}
```

**Pros:**
- ✅ Simpler implementation (one primary provider)
- ✅ Graceful degradation (fallback when needed)
- ✅ Consistent UX (mostly Mapbox)
- ✅ Still saves cost (only use Google when necessary)

**Cons:**
- ⚠️ Less cost savings (30-50% vs 50-75%)
- ⚠️ User sees mixed results sometimes
- ⚠️ Still need both providers integrated

**When to Use:** After 500 users for quick wins with lower complexity

---

### Strategy C: User Preference (Maximum Flexibility)

**How It Works:**

```typescript
// Let users choose their map provider in settings

interface UserSettings {
  preferredMapProvider: 'google' | 'mapbox' | 'apple-maps';
  autoDetectProvider: boolean;  // Use region-based if true
}

function getMapProvider(trip: Trip, user: User): MapProvider {
  if (user.settings.autoDetectProvider) {
    return detectProviderByRegion(trip.primaryDestination);
  }

  return user.settings.preferredMapProvider;
}
```

**Pros:**
- ✅ User control and transparency
- ✅ Power users can optimize for their use case
- ✅ A/B testing opportunities

**Cons:**
- ⚠️ Adds UI complexity (settings management)
- ⚠️ Most users won't care/understand
- ⚠️ Still need all providers integrated

**When to Use:** After 2,000 users if user feedback demands choice

---

## Implementation Plan

### Phase 1: Preparation (Week 0)

**Goal:** Abstract map interface to enable provider swapping

**Tasks:**

1. **Create MapProvider Interface**

```typescript
// src/lib/maps/MapProvider.ts
export interface MapProvider {
  // Map rendering
  renderMap(container: HTMLElement, options: MapOptions): Map;
  addMarker(map: Map, location: LatLng, options?: MarkerOptions): Marker;

  // Geocoding
  geocode(address: string): Promise<GeocodingResult[]>;
  reverseGeocode(location: LatLng): Promise<GeocodingResult>;

  // Places search
  searchPlaces(query: string, location: LatLng): Promise<Place[]>;
  getPlaceDetails(placeId: string): Promise<PlaceDetails>;

  // Static images
  getStaticMapUrl(center: LatLng, markers: LatLng[], options: StaticMapOptions): string;
}
```

2. **Implement GoogleMapsProvider**

```typescript
// src/lib/maps/providers/GoogleMapsProvider.ts
export class GoogleMapsProvider implements MapProvider {
  constructor(private apiKey: string) {}

  renderMap(container: HTMLElement, options: MapOptions): Map {
    return new google.maps.Map(container, {
      center: options.center,
      zoom: options.zoom,
      // ... Google Maps specific options
    });
  }

  // ... implement other methods
}
```

3. **Create Map Component Wrapper**

```typescript
// src/components/Map/Map.tsx
'use client';

import { useMapProvider } from '@/hooks/useMapProvider';

export function Map({ tripId, destination }: MapProps) {
  const provider = useMapProvider(destination);

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      {/* Provider renders here */}
    </div>
  );
}
```

**Deliverables:**
- ✅ MapProvider interface defined
- ✅ GoogleMapsProvider implemented
- ✅ Map component abstracted
- ✅ All existing Google Maps code migrated to use interface

**Time:** 2-3 days

---

### Phase 2: Add Second Provider (Week 1)

**Goal:** Integrate Mapbox or Apple Maps as secondary provider

**Tasks:**

1. **Choose Secondary Provider**

| Decision Criteria | Mapbox | Apple Maps |
|------------------|--------|------------|
| Free tier generosity | 50K loads/month | 7.5M loads/month ✅ |
| US/Europe POI quality | Very Good (50M) | Excellent ✅ |
| Mobile UX | Excellent (WebGL) ✅ | Good |
| Customization | Excellent ✅ | Limited |
| Bundle size | ~300KB | ~200KB |
| Setup complexity | Low | Medium (token gen) |
| **Recommendation** | **Good balance** | **Best cost** |

**Recommended:** Start with **Apple Maps** ($8/month for unlimited) if public-facing site. Fall back to **Mapbox** if login-required features.

2. **Implement MapboxProvider (or AppleMapsProvider)**

```typescript
// src/lib/maps/providers/MapboxProvider.ts
export class MapboxProvider implements MapProvider {
  constructor(private accessToken: string) {}

  renderMap(container: HTMLElement, options: MapOptions): Map {
    return new mapboxgl.Map({
      container,
      center: options.center,
      zoom: options.zoom,
      accessToken: this.accessToken,
      // ... Mapbox specific options
    });
  }

  // ... implement other methods
}
```

3. **Add Provider Selection Logic**

```typescript
// src/hooks/useMapProvider.ts
export function useMapProvider(destination?: string) {
  const [provider, setProvider] = useState<MapProvider>();

  useEffect(() => {
    if (!destination) {
      // Default to Google for unknown destinations
      setProvider(new GoogleMapsProvider(env.GOOGLE_MAPS_API_KEY));
      return;
    }

    // Detect region
    const region = detectRegion(destination);

    if (region === 'asia') {
      setProvider(new GoogleMapsProvider(env.GOOGLE_MAPS_API_KEY));
    } else {
      setProvider(new MapboxProvider(env.MAPBOX_TOKEN));
    }
  }, [destination]);

  return provider;
}
```

**Deliverables:**
- ✅ MapboxProvider (or AppleMapsProvider) implemented
- ✅ Provider selection logic added
- ✅ Region detection function created
- ✅ Environment variables configured

**Time:** 3-4 days

---

### Phase 3: Testing & Optimization (Week 2)

**Goal:** Validate hybrid strategy works across all features

**Tasks:**

1. **Test All Map Features**
   - [ ] Interactive map rendering (both providers)
   - [ ] Marker placement and clustering
   - [ ] Geocoding (address → coordinates)
   - [ ] Reverse geocoding (coordinates → address)
   - [ ] Places search and autocomplete
   - [ ] Static map image generation
   - [ ] Multi-country trip handling (edge case)

2. **Bundle Size Optimization**
   - [ ] Implement code splitting (dynamic imports)
   - [ ] Load providers only when needed
   - [ ] Measure bundle impact (before/after)
   - [ ] Target: <2.5s LCP on 3G mobile

```typescript
// src/components/Map/Map.tsx
const GoogleMap = dynamic(() => import('./providers/GoogleMap'));
const MapboxMap = dynamic(() => import('./providers/MapboxMap'));

export function Map({ provider, ...props }: MapProps) {
  if (provider === 'google') {
    return <GoogleMap {...props} />;
  }

  return <MapboxMap {...props} />;
}
```

3. **Cache Strategy**
   - [ ] Cache geocoding results in Supabase (avoid repeat API calls)
   - [ ] Cache static map images in Supabase Storage
   - [ ] Implement rate limiting per user session

```sql
-- Geocoding cache table
CREATE TABLE geocoding_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  provider TEXT NOT NULL,  -- 'google' | 'mapbox' | 'apple'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(address, provider)
);

CREATE INDEX idx_geocoding_address ON geocoding_cache(address);
```

4. **Monitor Cost Impact**
   - [ ] Add analytics to track provider usage
   - [ ] Dashboard: Google vs Mapbox/Apple split
   - [ ] Alert if Google Maps usage exceeds threshold

**Deliverables:**
- ✅ All map features tested with both providers
- ✅ Bundle size optimized
- ✅ Caching implemented
- ✅ Cost monitoring dashboard

**Time:** 3-4 days

---

### Phase 4: Deployment & Monitoring (Week 2-3)

**Goal:** Roll out hybrid strategy safely with monitoring

**Tasks:**

1. **Feature Flag Implementation**

```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  HYBRID_MAPS_ENABLED: process.env.NEXT_PUBLIC_HYBRID_MAPS === 'true',
  HYBRID_MAPS_ROLLOUT_PERCENTAGE: parseInt(process.env.NEXT_PUBLIC_HYBRID_MAPS_ROLLOUT || '0')
};

// Gradual rollout
export function useHybridMaps(userId: string) {
  if (!FEATURE_FLAGS.HYBRID_MAPS_ENABLED) return false;

  const userHash = hashUserId(userId);
  return userHash % 100 < FEATURE_FLAGS.HYBRID_MAPS_ROLLOUT_PERCENTAGE;
}
```

2. **Gradual Rollout Schedule**
   - Week 1: 10% of users (test for issues)
   - Week 2: 25% of users (validate cost savings)
   - Week 3: 50% of users (monitor UX impact)
   - Week 4: 100% rollout

3. **Monitoring & Alerts**
   - [ ] Track map provider selection (Google vs Mapbox/Apple)
   - [ ] Monitor error rates by provider
   - [ ] Track user support tickets (map-related)
   - [ ] Compare map load times by provider

**Deliverables:**
- ✅ Feature flag system implemented
- ✅ Gradual rollout executed
- ✅ Monitoring dashboards created
- ✅ Rollback plan documented

**Time:** 2-3 days

---

## Decision Criteria: When to Implement

### Go/No-Go Checklist

**Implement Hybrid Strategy IF:**

- ✅ Monthly Google Maps cost > $300
- ✅ User base > 500 active users
- ✅ Development capacity available (1-2 weeks)
- ✅ Feature development not critical (no urgent deadlines)
- ✅ <10% of support tickets are map-related (stable baseline)

**DEFER Hybrid Strategy IF:**

- ❌ Monthly cost < $300 (savings don't justify effort)
- ❌ Critical features in development (maps can wait)
- ❌ >20% of support tickets are map-related (fix baseline issues first)
- ❌ Limited development capacity (focus on core product)

---

## Cost-Benefit Analysis

### Implementation Cost

| Phase | Time | Opportunity Cost (@ $150/hour) |
|-------|------|-------------------------------|
| Phase 1: Abstraction | 3 days | $3,600 |
| Phase 2: Second provider | 4 days | $4,800 |
| Phase 3: Testing | 4 days | $4,800 |
| Phase 4: Deployment | 2 days | $2,400 |
| **Total** | **13 days** | **$15,600** |

### Annual Savings (5,000 users, 50% Asia split)

| Scenario | Google-only | Hybrid | Savings/Year |
|----------|-------------|--------|--------------|
| 5,000 users | $2,550/month | $1,275/month | **$15,300/year** |
| 10,000 users | $5,100/month | $2,550/month | **$30,600/year** |

**Break-Even:** ~12 months at 5,000 users
**ROI:** After 12 months, net savings = $15,300/year ongoing

---

## Risk Mitigation

### Risk 1: Inconsistent UX

**Problem:** Maps look different between Google and Mapbox/Apple
**Impact:** User confusion, perceived lack of polish
**Likelihood:** High

**Mitigation:**
- Style Mapbox to match Google Maps colors/fonts
- Add subtle indicator: "Powered by Mapbox" or "Powered by Google Maps"
- User education: "We use different map providers for the best experience"
- Allow user preference override in settings

---

### Risk 2: Edge Cases (Multi-Country Trips)

**Problem:** Trip spans Japan → France → USA
**Impact:** Which provider to use? Switching mid-trip?
**Likelihood:** Medium (10-20% of trips)

**Mitigation:**
- Use **primary destination** (first or longest stay)
- Default to Google if ambiguous
- Allow manual provider switch: "Try Google Maps instead"

---

### Risk 3: POI Quality Complaints

**Problem:** Users can't find places in Mapbox/Apple (vs Google)
**Impact:** Negative reviews, support tickets
**Likelihood:** Medium

**Mitigation:**
- Monitor support tickets closely during rollout
- Implement fallback search: "Try Google Maps search"
- Allow manual address entry
- Rollback to Google-only if >5% of tickets are POI-related

---

### Risk 4: Bundle Size Increase

**Problem:** Loading both providers increases JavaScript payload
**Impact:** Slower page load, worse mobile performance
**Likelihood:** High if not optimized

**Mitigation:**
- Code splitting (dynamic imports)
- Load provider only when map component renders
- Measure Core Web Vitals (target: LCP <2.5s)
- Only load one provider per trip (not both)

---

## Rollback Plan

### Triggers for Rollback

Roll back to Google-only IF:

- >10% increase in map-related support tickets
- >5% decrease in trip creation completion rate
- >20% increase in map load errors
- User complaints exceed 5 per week
- Core Web Vitals degrade (LCP >3s)

### Rollback Procedure

1. **Immediate (< 1 hour):**
   - Set feature flag: `HYBRID_MAPS_ENABLED=false`
   - Deploy to production
   - All users revert to Google Maps

2. **Post-Mortem (< 24 hours):**
   - Analyze what went wrong
   - Review error logs and user feedback
   - Identify root cause

3. **Fix & Re-Deploy (< 1 week):**
   - Fix identified issues
   - Test thoroughly in staging
   - Gradual rollout again (10% → 25% → 50% → 100%)

---

## Success Metrics

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Cost Savings** | 50-75% reduction | Monthly maps bill |
| **Error Rate** | <1% increase | Map load failures, geocoding errors |
| **Support Tickets** | <5% increase | Map-related tickets per week |
| **User Satisfaction** | No degradation | NPS surveys, app reviews |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Bundle Size** | <50KB increase | Lighthouse CI |
| **Page Load Time** | LCP <2.5s | Core Web Vitals |
| **Provider Split** | 50% Google, 50% Mapbox/Apple | Analytics dashboard |

---

## Related Documentation

- **Tech Stack Tracker:** `/docs/architecture/tech-stack-tracker.md` (Phase 6 decision)
- **Competitor Analysis:** `/docs/research/competitor-map-providers.md` (What competitors use)
- **Google Maps Evaluation:** `/docs/research/google-maps-evaluation-report.md`
- **Mapbox Evaluation:** `/docs/research/mapbox-evaluation-report.md`

---

## Frequently Asked Questions

### Q: Why not start with hybrid from day one?

**A:** Premature optimization. MVP needs to validate product-market fit, not optimize costs. Starting with Google Maps eliminates POI coverage risk. Add hybrid later when cost justifies complexity.

### Q: Can we use OpenStreetMap instead of Mapbox/Apple?

**A:** Yes, but adds 2-3 days setup time (tile hosting, geocoding config). Mapbox/Apple are managed services. Consider OSM only if aiming for $0 forever.

### Q: What if a user travels to both Asia and Europe?

**A:** Use **primary destination** (first or longest stay). If Tokyo (5 days) → Paris (2 days), use Google Maps. If ambiguous, default to Google.

### Q: How do we handle trips with no destination yet?

**A:** Default to Google Maps until destination is set. Most users add destination during trip creation.

### Q: Can users override the provider choice?

**A:** Yes, add setting: "Preferred map provider: Auto-detect, Google Maps, Mapbox, Apple Maps". Power users appreciate control.

---

**Last Updated:** February 9, 2026
**Next Review:** After reaching 500 users or $300/month maps cost
