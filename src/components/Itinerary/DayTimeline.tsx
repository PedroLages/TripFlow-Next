"use client"

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Sparkles, Compass, Plane, Train, ArrowRight, AlertTriangle, TreePalm, Navigation } from 'lucide-react';
import { Button } from '../ui/ButtonLegacy';
import { getCityStyle } from '@/lib/city-colors';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity, LightboxSlide } from '@/lib/itinerary-data';
import { ActivityCard } from './ActivityCard';
import { TransitConnector } from './TransitConnector';
import './DayTimeline.css';

// ---------------------------------------------------------------------------
// Task 5: City Transition Banner helpers
// ---------------------------------------------------------------------------

/** Map city display names to their CitySlug for color lookups. */
const CITY_NAME_TO_SLUG: Record<string, CitySlug> = {
  'Shanghai': 'shanghai',
  'Hong Kong': 'hongkong',
  'Osaka': 'osaka',
  'Kyoto': 'kyoto',
  'Tokyo': 'tokyo',
  'Beijing': 'beijing',
};

/** Known city names for regex matching (ordered longest-first to avoid partial matches). */
const CITY_NAMES = ['Hong Kong', 'Shanghai', 'Beijing', 'Osaka', 'Kyoto', 'Tokyo'];

/** Color palette for each city (used in transition gradients). */
const CITY_GRADIENT_COLORS: Record<CitySlug, string> = {
  shanghai: '#6366f1',
  hongkong: '#f43f5e',
  osaka: '#f97316',
  kyoto: '#22c55e',
  tokyo: '#8b5cf6',
  beijing: '#ef4444',
};

interface TransitionInfo {
  departCity: string;
  arriveCity: string;
  departSlug: CitySlug;
  arriveSlug: CitySlug;
  mode: 'flight' | 'train' | 'shinkansen' | 'transport';
  durationMinutes: number;
}

/**
 * Detect if an activity represents inter-city transport.
 * Parses titles like "Flight Shanghai -> Hong Kong" or "Shinkansen Kyoto -> Tokyo".
 */
function parseTransition(activity: Activity): TransitionInfo | null {
  if (activity.type !== 'flight' && activity.type !== 'transport') return null;

  // Check for arrow separator in title
  if (!activity.title.includes('\u2192') && !activity.title.includes('->')) return null;

  // Find two city names in the title
  const foundCities: { name: string; index: number }[] = [];
  for (const city of CITY_NAMES) {
    const idx = activity.title.indexOf(city);
    if (idx !== -1) {
      foundCities.push({ name: city, index: idx });
    }
  }

  if (foundCities.length < 2) return null;

  // Sort by position in title to get depart then arrive
  foundCities.sort((a, b) => a.index - b.index);

  const departCity = foundCities[0].name;
  const arriveCity = foundCities[1].name;
  const departSlug = CITY_NAME_TO_SLUG[departCity];
  const arriveSlug = CITY_NAME_TO_SLUG[arriveCity];

  if (!departSlug || !arriveSlug) return null;

  // Determine transport mode from title
  const titleLower = activity.title.toLowerCase();
  let mode: TransitionInfo['mode'] = 'transport';
  if (titleLower.includes('flight') || titleLower.includes('fly')) mode = 'flight';
  else if (titleLower.includes('shinkansen')) mode = 'shinkansen';
  else if (titleLower.includes('train')) mode = 'train';

  return {
    departCity,
    arriveCity,
    departSlug,
    arriveSlug,
    mode,
    durationMinutes: activity.duration,
  };
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function TransportModeIcon({ mode }: { mode: TransitionInfo['mode'] }) {
  switch (mode) {
    case 'flight':
      return <Plane size={16} />;
    case 'train':
    case 'shinkansen':
      return <Train size={16} />;
    default:
      return <Train size={16} />;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DayTimelineProps {
  activities: Activity[];
  citySlug: CitySlug;
  dayLabel: string;
  onReorder: (newOrder: Activity[]) => void;
  onAutoFill: () => void;
  onOpenSuggestions: () => void;
  onAddActivity: () => void;
  onOpenLightbox?: (slides: LightboxSlide[], startIndex: number) => void;
  isGenerating: boolean;
  expandedActivity: string | null;
  onToggleExpand: (id: string | null) => void;
  hoveredActivityId?: string | null;
  selectedPinId?: string | null;
  onActivityHover?: (activityId: string | null) => void;
  activityRefs?: React.MutableRefObject<Map<string, HTMLElement>>;
  /** Task 7: Day intention state for rendering specialized empty states. */
  intention?: 'planned' | 'free' | 'travel' | 'unplanned';
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  activities,
  citySlug,
  dayLabel,
  onReorder,
  onAutoFill,
  onOpenSuggestions,
  onAddActivity,
  onOpenLightbox,
  isGenerating,
  expandedActivity,
  onToggleExpand,
  hoveredActivityId,
  selectedPinId,
  onActivityHover,
  activityRefs,
  intention,
}) => {
  const cityStyle = getCityStyle(citySlug);

  // Task 6: Density warning dismiss state
  const [densityDismissed, setDensityDismissed] = useState(false);

  // Task 6: Calculate total scheduled minutes
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  const totalHours = Math.round(totalMinutes / 60);
  const densityLevel: 'red' | 'amber' | null =
    totalMinutes > 840 ? 'red' : totalMinutes > 600 ? 'amber' : null;

  return (
    <div className="timeline-container" style={cityStyle}>
      <div className="timeline-line"></div>

      {/* Task 6: Day Density Warning */}
      {densityLevel && !densityDismissed && activities.length > 0 && (
        <div
          className={`density-warning ${
            densityLevel === 'red' ? 'density-warning-red' : 'density-warning-amber'
          }`}
        >
          <AlertTriangle size={18} className="density-warning-icon" />
          <span className="density-warning-text">
            {densityLevel === 'red'
              ? `This day has ${totalHours}h of activities \u2014 that\u2019s a marathon! Consider moving some items.`
              : `This day has ${totalHours}h of activities \u2014 consider spacing things out.`}
          </span>
          <button
            className="density-warning-dismiss"
            onClick={() => setDensityDismissed(true)}
          >
            Got it
          </button>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={activities}
        onReorder={onReorder}
        className="reorder-timeline"
      >
        {activities.map((activity, index) => {
          const isExpanded = expandedActivity === activity.id;
          const isLiveNow = index === 1 && activities.length > 1;

          // Task 5: Check for city transition
          const transition = parseTransition(activity);

          return (
            <Reorder.Item
              key={activity.id}
              value={activity}
              className="timeline-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              {/* Task 5: City Transition Banner (rendered before the ActivityCard) */}
              {transition && (
                <div
                  className="city-transition-banner"
                  style={{
                    '--depart-color': CITY_GRADIENT_COLORS[transition.departSlug],
                    '--arrive-color': CITY_GRADIENT_COLORS[transition.arriveSlug],
                  } as React.CSSProperties}
                >
                  <div className="city-transition-icon">
                    <TransportModeIcon mode={transition.mode} />
                  </div>
                  <div className="city-transition-cities">
                    <span>{transition.departCity}</span>
                    <ArrowRight size={14} className="city-transition-arrow" />
                    <span>{transition.arriveCity}</span>
                  </div>
                  <span className="city-transition-duration">
                    {formatDuration(transition.durationMinutes)}
                  </span>
                </div>
              )}

              <ActivityCard
                activity={activity}
                citySlug={citySlug}
                isExpanded={isExpanded}
                isLiveNow={isLiveNow}
                isHighlighted={selectedPinId === activity.id || hoveredActivityId === activity.id}
                onToggleExpand={() => onToggleExpand(isExpanded ? null : activity.id)}
                onOpenSuggestions={onOpenSuggestions}
                onOpenLightbox={onOpenLightbox}
                onHover={onActivityHover}
                ref={(el) => {
                  if (el && activityRefs?.current) activityRefs.current.set(activity.id, el);
                }}
                index={index}
              />

              {activity.transitToNext && (
                <TransitConnector
                  method={activity.transitToNext.method}
                  duration={activity.transitToNext.duration}
                  onAddActivity={onAddActivity}
                />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {isGenerating ? (
        <div className="generating-day-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="magic-wand-spinner"
          >
            <Sparkles size={48} color="var(--accent-primary)" aria-hidden="true" />
          </motion.div>
          <h3 className="gradient-text">AI is crafting your perfect sequence&#8230;</h3>
          <p className="text-secondary">Analyzing local transit times and crowd patterns.</p>

          <div className="skeleton-timeline">
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card half"></div></div>
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
          </div>
        </div>
      ) : activities.length === 0 ? (
        // Task 7: Intention-aware empty states
        intention === 'free' ? (
          <div className="free-day-state">
            <div className="free-day-icon">
              <TreePalm size={48} aria-hidden="true" />
            </div>
            <h3>Free day! Explore at your own pace</h3>
            <p>No fixed plans &mdash; wander, relax, or stumble upon something unexpected.</p>
          </div>
        ) : intention === 'travel' ? (
          <div className="travel-day-fallback">
            <div className="travel-day-icon">
              <Navigation size={48} aria-hidden="true" />
            </div>
            <h3>Travel day</h3>
            <p>Check your transport details and boarding passes.</p>
          </div>
        ) : (
          /* 'unplanned' or undefined — original empty state */
          <div className="empty-day-state">
            <div className="empty-icon"><Compass size={48} aria-hidden="true" /></div>
            <h3>Nothing planned yet</h3>
            <p>Use AI to quickly build a smart itinerary for this day, or add locations manually.</p>
            <Button
              className="mt-4 magic-wand-btn"
              size="md"
              icon={<Sparkles size={16} />}
              onClick={onAutoFill}
            >
              Auto-fill {dayLabel}
            </Button>
          </div>
        )
      ) : null}
    </div>
  );
};
