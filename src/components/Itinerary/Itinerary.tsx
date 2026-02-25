"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '../ui/ButtonLegacy';
import { AISuggestionsPanel } from '../AIGenerator/AISuggestionsPanel';
import CityNavigator from './CityNavigator';
import DayNavigator from './DayNavigator';
import { DayTimeline } from './DayTimeline';
import DaySummary from './DaySummary';
import { AddActivityModal } from './AddActivityModal';
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
} from '@/lib/itinerary-data';
import './Itinerary.css';

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

  // Trip data
  const allDays = useMemo(() => generateItineraryDays(), []);

  // State
  const [activeCity, setActiveCity] = useState<CitySlug>('shanghai');
  const [activeDay, setActiveDay] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(() =>
    allDays.flatMap((d) => d.activities)
  );
  const [isGeneratingDay, setIsGeneratingDay] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

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
              // Match activities to day by checking if they're in the original day
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
    () => activities.filter((a) => {
      const dayData = allDays[activeDay];
      return dayData.activities.some((da) => da.id === a.id);
    }),
    [activities, allDays, activeDay]
  );

  // Handlers
  const handleCityChange = useCallback(
    (city: CitySlug) => {
      setActiveCity(city);
      setActiveDay(getFirstDayOfCity(city));
      setExpandedActivity(null);
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
      // Inject into the current day's data
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

      {/* City Navigator */}
      <motion.div variants={motionVariants}>
        <CityNavigator
          activeCity={activeCity}
          onCityChange={handleCityChange}
        />
      </motion.div>

      {/* Content Split */}
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
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <DayTimeline
                activities={dayActivities}
                citySlug={activeCity}
                dayLabel={dayLabel}
                onReorder={handleReorder}
                onAutoFill={handleAutoFillDay}
                onOpenSuggestions={() => setIsSuggestionsOpen(true)}
                onAddActivity={() => setIsAddActivityOpen(true)}
                isGenerating={isGeneratingDay}
                expandedActivity={expandedActivity}
                onToggleExpand={setExpandedActivity}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel: Day Summary */}
        <div className="itinerary-right-panel">
          {currentDay && (
            <DaySummary
              day={{
                ...currentDay,
                activities: dayActivities,
              }}
              citySlug={activeCity}
              onAutoFill={handleAutoFillDay}
              onAddActivity={() => setIsAddActivityOpen(true)}
              isGenerating={isGeneratingDay}
            />
          )}
        </div>
      </motion.div>

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
    </motion.div>
  );
};
