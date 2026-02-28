"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Sparkles, Plus, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '../ui/ButtonLegacy';
import { AISuggestionsPanel } from '../AIGenerator/AISuggestionsPanel';
import CityNavigator from './CityNavigator';
import DayNavigator from './DayNavigator';
import { DayTimeline } from './DayTimeline';
import { CityOverview } from './CityOverview';
import { TripOverview } from './TripOverview';
import TripContextBar from './TripContextBar';
import { ActivitySearch } from './ActivitySearch';
import { TravelDayView } from './TravelDayView';
import { Lightbox } from './Lightbox';
import { MobileMapSheet } from './MobileMapSheet';
import { AddActivityModal } from './AddActivityModal';
import { MapProvider, useMapContext } from '@/components/Map/MapProvider';
import { cn } from '@/lib/utils';
import {
  type CitySlug,
  CITY_CONFIGS,
  getDaysForCity,
  getFirstDayOfCity,
  getCityStyle,
} from '@/lib/city-colors';
import {
  generateItineraryDays,
  TRIP_TITLE,
  TRIP_SUBTITLE,
  TRIP_DATES,
  type Activity,
  type ItineraryDay,
  type LightboxSlide,
} from '@/lib/itinerary-data';
import './Itinerary.css';

const MapContainer = dynamic(
  () => import('@/components/Map/MapContainer').then(mod => ({ default: mod.MapContainer })),
  { ssr: false, loading: () => <div className="map-container-skeleton">Loading map...</div> }
);

// ---------------------------------------------------------------------------
// Animation variants (matching Dashboard patterns)
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

// ---------------------------------------------------------------------------
// Bridge: bidirectional sync between Itinerary local state ↔ MapProvider
// ---------------------------------------------------------------------------

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
  const {
    setSelectedActivityId,
    setHoveredActivityId,
    selectedActivityId,
    hoveredActivityId: mapHoveredId,
  } = useMapContext();

  // Sync from Itinerary → Map
  useEffect(() => { setHoveredActivityId(hoveredActivityId); }, [hoveredActivityId, setHoveredActivityId]);
  useEffect(() => { setSelectedActivityId(selectedPinId); }, [selectedPinId, setSelectedActivityId]);

  // Sync from Map → Itinerary
  useEffect(() => {
    if (mapHoveredId !== hoveredActivityId) onHover(mapHoveredId);
  }, [mapHoveredId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedActivityId && selectedActivityId !== selectedPinId) onSelect(selectedActivityId);
  }, [selectedActivityId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Itinerary: React.FC = () => {
  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const motionVariants = prefersReducedMotion ? reducedMotionVariants : itemVariants;

  // Content transition for city/day switching (cinematic blur + scale)
  const contentTransition = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.1 } }
    : {
        initial: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -16, scale: 0.98, filter: 'blur(4px)' },
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
      };

  // Trip data
  const allDays = useMemo(() => generateItineraryDays(), []);

  // State
  type ViewMode = 'city' | 'trip';
  const [viewMode, setViewMode] = useState<ViewMode>('city');
  const [activeCity, setActiveCity] = useState<CitySlug>('shanghai');
  const [activeDay, setActiveDay] = useState(-1);
  const [activities, setActivities] = useState<Activity[]>(() =>
    allDays.flatMap((d) => d.activities)
  );
  const [isGeneratingDay, setIsGeneratingDay] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<LightboxSlide[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((photos: LightboxSlide[], startIndex: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }, []);

  // Map state
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isMapSheetOpen, setIsMapSheetOpen] = useState(false);
  const activityRefs = useRef<Map<string, HTMLElement>>(new Map());

  const handlePinClick = useCallback((activityId: string) => {
    setSelectedPinId(activityId);
    setExpandedActivity(activityId);
    const el = activityRefs.current.get(activityId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleActivityHover = useCallback((activityId: string | null) => {
    setHoveredActivityId(activityId);
  }, []);

  // Cmd+K search shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // URL state sync — deep-linking support
  const didMountRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get('city');
    if (urlCity && urlCity in CITY_CONFIGS) {
      setActiveCity(urlCity as CitySlug);
      const urlDay = params.get('day');
      if (urlDay) {
        const dayNum = parseInt(urlDay, 10);
        const days = getDaysForCity(urlCity as CitySlug);
        if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= days.length) {
          setActiveDay(days[dayNum - 1]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const params = new URLSearchParams();
    params.set('city', activeCity);
    if (activeDay >= 0) {
      const days = getDaysForCity(activeCity);
      const localDay = days.indexOf(activeDay) + 1;
      if (localDay > 0) params.set('day', String(localDay));
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [activeCity, activeDay]);

  // Derived state
  const cityDayIndices = useMemo(() => getDaysForCity(activeCity), [activeCity]);
  const cityDays: ItineraryDay[] = useMemo(
    () =>
      cityDayIndices.map((idx) => {
        const base = allDays[idx];
        return {
          ...base,
          activities: activities.filter(
            (a) => {
              const dayActivities = allDays[idx].activities;
              return dayActivities.some((da) => da.id === a.id);
            }
          ),
        };
      }),
    [cityDayIndices, allDays, activities]
  );

  const currentDay = useMemo(
    () => allDays[activeDay],
    [allDays, activeDay]
  );

  const dayActivities = useMemo(
    () => {
      if (activeDay < 0) return [];
      const dayData = allDays[activeDay];
      if (!dayData) return [];
      return activities.filter((a) =>
        dayData.activities.some((da) => da.id === a.id)
      );
    },
    [activities, allDays, activeDay]
  );

  const allCityActivities = useMemo(
    () => cityDays.flatMap(d => d.activities),
    [cityDays]
  );

  // Handlers
  const handleCityChange = useCallback(
    (city: CitySlug) => {
      setViewMode('city');
      setActiveCity(city);
      setActiveDay(-1); // Show overview on city switch
      setExpandedActivity(null);
    },
    []
  );

  const handleTripOverviewNavigate = useCallback(
    (city: CitySlug, dayIndex: number) => {
      setViewMode('city');
      setActiveCity(city);
      setActiveDay(dayIndex);
      setExpandedActivity(null);
    },
    []
  );

  const handleSearchNavigate = useCallback(
    (city: CitySlug, dayIndex: number, activityId: string) => {
      setViewMode('city');
      setActiveCity(city);
      setActiveDay(dayIndex);
      setExpandedActivity(activityId);
      // Scroll to the activity after a tick to let the view render
      setTimeout(() => {
        const el = activityRefs.current.get(activityId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    },
    []
  );

  const handleDayChange = useCallback(
    (dayIndex: number) => {
      setActiveDay(dayIndex);
      setExpandedActivity(null);
    },
    []
  );

  const handleReorder = useCallback(
    (newOrder: Activity[]) => {
      setActivities((prev) => {
        const currentDayIds = new Set(allDays[activeDay].activities.map((a) => a.id));
        const otherActivities = prev.filter((a) => !currentDayIds.has(a.id));
        return [...otherActivities, ...newOrder];
      });
    },
    [activeDay, allDays]
  );

  const handleAutoFillDay = useCallback(() => {
    setIsGeneratingDay(true);
    const cityConfig = CITY_CONFIGS[activeCity];
    setTimeout(() => {
      const newActivities: Activity[] = [
        {
          id: `gen-${Date.now()}-1`,
          time: '09:00 AM',
          title: `Morning Walk in ${cityConfig.name}`,
          type: 'activity',
          duration: 90,
          votes: { up: 5, down: 0 },
          comments: [],
        },
        {
          id: `gen-${Date.now()}-2`,
          time: '11:00 AM',
          title: `Local Market Visit`,
          type: 'shopping',
          duration: 120,
          votes: { up: 3, down: 1 },
          comments: [],
          transitToNext: { method: 'walk', duration: 15 },
        },
        {
          id: `gen-${Date.now()}-3`,
          time: '01:00 PM',
          title: `${cityConfig.name} Street Food`,
          type: 'food',
          duration: 60,
          votes: { up: 8, down: 0 },
          comments: [],
        },
      ];
      const dayData = allDays[activeDay];
      dayData.activities.push(...newActivities);
      setActivities((prev) => [...prev, ...newActivities]);
      setIsGeneratingDay(false);
    }, 2500);
  }, [activeCity, activeDay, allDays]);

  // Build the day label for the current day
  const dayLabel = currentDay
    ? `Day ${activeDay + 1} — ${currentDay.fullDate}`
    : `Day ${activeDay + 1}`;

  return (
    <motion.div
      className="itinerary-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <motion.div className="itinerary-header" variants={motionVariants}>
        <div>
          <h2>{TRIP_TITLE}</h2>
          <p className="itinerary-subtitle">
            {TRIP_SUBTITLE}
            <span className="itinerary-dates">{TRIP_DATES}</span>
          </p>
        </div>
        <div className="itinerary-header-actions">
          <Button
            variant="secondary"
            icon={<Sparkles size={16} />}
            onClick={() => setIsSuggestionsOpen(true)}
          >
            AI Suggestions
          </Button>
          <Button
            icon={<Plus size={16} />}
            onClick={() => setIsAddActivityOpen(true)}
          >
            Add Activity
          </Button>
        </div>
      </motion.div>

      {/* View Toggle + City Navigator */}
      <motion.div variants={motionVariants}>
        <div className="view-mode-toggle">
          <button
            className={cn('view-mode-btn', viewMode === 'trip' && 'view-mode-active')}
            onClick={() => setViewMode('trip')}
          >
            Full Trip
          </button>
          <button
            className={cn('view-mode-btn', viewMode === 'city' && 'view-mode-active')}
            onClick={() => setViewMode('city')}
          >
            By City
          </button>
        </div>
        {viewMode === 'city' && (
          <CityNavigator
            activeCity={activeCity}
            onCityChange={handleCityChange}
          />
        )}
      </motion.div>

      {/* Trip Overview (Full Trip mode) */}
      {viewMode === 'trip' && (
        <motion.div variants={motionVariants}>
          <TripOverview
            allDays={allDays}
            onNavigateToDay={handleTripOverviewNavigate}
          />
        </motion.div>
      )}

      {/* Content Split — wrapped in MapProvider for shared map state */}
      {viewMode === 'city' && (
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
          {/* Left Panel: Day Navigator + Timeline */}
          <div className="itinerary-left-panel">
            <div className="sticky-nav-area">
              <DayNavigator
                days={cityDays}
                activeDay={activeDay}
                onDayChange={handleDayChange}
                citySlug={activeCity}
              />
              <TripContextBar
                viewMode={viewMode}
                activeCity={activeCity}
                activeDay={activeDay}
                allDays={allDays}
              />
            </div>

            <AnimatePresence mode="wait">
              {activeDay === -1 ? (
                <motion.div
                  key={`overview-${activeCity}`}
                  {...contentTransition}
                >
                  <CityOverview
                    citySlug={activeCity}
                    cityDays={cityDays}
                    onDaySelect={(dayIndex: number) => setActiveDay(dayIndex)}
                    onOpenLightbox={openLightbox}
                  />
                </motion.div>
              ) : currentDay?.intention === 'travel' ? (
                <motion.div
                  key={`travel-${activeDay}`}
                  {...contentTransition}
                >
                  <TravelDayView
                    activities={dayActivities}
                    citySlug={activeCity}
                    dayLabel={dayLabel}
                    onOpenLightbox={openLightbox}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeDay}
                  {...contentTransition}
                >
                  <DayTimeline
                    activities={dayActivities}
                    citySlug={activeCity}
                    dayLabel={dayLabel}
                    onReorder={handleReorder}
                    onAutoFill={handleAutoFillDay}
                    onOpenSuggestions={() => setIsSuggestionsOpen(true)}
                    onAddActivity={() => setIsAddActivityOpen(true)}
                    onOpenLightbox={openLightbox}
                    isGenerating={isGeneratingDay}
                    expandedActivity={expandedActivity}
                    onToggleExpand={setExpandedActivity}
                    hoveredActivityId={hoveredActivityId}
                    selectedPinId={selectedPinId}
                    onActivityHover={handleActivityHover}
                    activityRefs={activityRefs}
                    intention={currentDay?.intention}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Map */}
          <div className="itinerary-right-panel">
            <MapContainer
              activities={dayActivities}
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
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        slides={lightboxPhotos}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />

      {/* Mobile Map FAB + Bottom Sheet (city view only) */}
      {viewMode === 'city' && (
        <>
        <button
          className="map-fab"
          onClick={() => setIsMapSheetOpen(true)}
          aria-label="Show map"
        >
          <MapIcon size={22} />
        </button>
        <MobileMapSheet isOpen={isMapSheetOpen} onClose={() => setIsMapSheetOpen(false)}>
        <MapProvider>
          <MapContainer
            activities={dayActivities}
            allCityActivities={allCityActivities}
            citySlug={activeCity}
            activeDay={activeDay}
            day={currentDay ? { ...currentDay, activities: dayActivities } : undefined}
            onAutoFill={handleAutoFillDay}
            onAddActivity={() => setIsAddActivityOpen(true)}
            isGenerating={isGeneratingDay}
          />
        </MapProvider>
      </MobileMapSheet>
        </>
      )}

      {/* AI Suggestions Panel (existing) */}
      <AISuggestionsPanel
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        day={dayLabel}
      />

      {/* Add Activity Modal (Radix Dialog) */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        dayLabel={dayLabel}
        citySlug={activeCity}
      />

      {/* Global Activity Search (Cmd+K) */}
      <ActivitySearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allDays={allDays}
        onNavigate={handleSearchNavigate}
      />
    </motion.div>
  );
};
