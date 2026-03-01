"use client"

import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, Sparkles, AlertCircle, Plane, TrainFront } from 'lucide-react';
import Image from 'next/image';
import {
  CITY_CONFIGS,
  CITY_ORDER,
  getCityStyle,
  getDaysForCity,
  type CitySlug,
} from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import './TripOverview.css';

type FilterTab = 'all' | 'booked' | 'must-do' | 'unplanned';

interface TripOverviewProps {
  allDays: ItineraryDay[];
  onNavigateToDay: (city: CitySlug, dayIndex: number) => void;
}

/** Density level based on total planned hours for a day. */
function getDensityLevel(totalMinutes: number): 'light' | 'moderate' | 'heavy' | 'over' {
  const hours = totalMinutes / 60;
  if (hours <= 4) return 'light';
  if (hours <= 8) return 'moderate';
  if (hours <= 12) return 'heavy';
  return 'over';
}

function getDensityColor(level: ReturnType<typeof getDensityLevel>): string {
  switch (level) {
    case 'light': return 'var(--color-success)';
    case 'moderate': return 'var(--color-success)';
    case 'heavy': return 'var(--color-warning)';
    case 'over': return 'var(--color-danger)';
  }
}

/** Check if a day has transport activity (flight/train) indicating travel. */
function isTravelDay(day: ItineraryDay): boolean {
  return day.activities.length <= 2 &&
    day.activities.some(a => a.type === 'flight' || a.type === 'transport');
}

export const TripOverview: React.FC<TripOverviewProps> = ({
  allDays,
  onNavigateToDay,
}) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const shouldReduceMotion = useReducedMotion();

  // Group days by city
  const citySections = useMemo(() => {
    return CITY_ORDER.map(citySlug => {
      const config = CITY_CONFIGS[citySlug];
      const dayIndices = getDaysForCity(citySlug);
      const days = dayIndices.map(i => allDays[i]);
      return { citySlug, config, days };
    });
  }, [allDays]);

  // Filter logic
  const filterDay = (day: ItineraryDay): boolean => {
    switch (filter) {
      case 'booked':
        return day.activities.some(a => a.status === 'Booked');
      case 'must-do':
        return day.activities.some(a => a.status === 'Must Do');
      case 'unplanned':
        return day.activities.length === 0;
      default:
        return true;
    }
  };

  // Trip-level stats
  const tripStats = useMemo(() => {
    const allActivities = allDays.flatMap(d => d.activities);
    return {
      totalDays: allDays.length,
      totalActivities: allActivities.length,
      booked: allActivities.filter(a => a.status === 'Booked').length,
      mustDo: allActivities.filter(a => a.status === 'Must Do').length,
      unplanned: allDays.filter(d => d.activities.length === 0).length,
    };
  }, [allDays]);

  const filters: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: tripStats.totalDays },
    { key: 'booked', label: 'Booked', count: tripStats.booked },
    { key: 'must-do', label: 'Must Do', count: tripStats.mustDo },
    { key: 'unplanned', label: 'Unplanned', count: tripStats.unplanned },
  ];

  return (
    <div className="trip-overview">
      {/* Trip-level summary */}
      <div className="to-summary">
        <div className="to-summary-stat">
          <Calendar size={14} />
          <span>{tripStats.totalDays} days</span>
        </div>
        <div className="to-summary-stat">
          <MapPin size={14} />
          <span>{tripStats.totalActivities} activities</span>
        </div>
        <div className="to-summary-stat">
          <CheckCircle2 size={14} />
          <span>{tripStats.booked} booked</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="to-filters" role="tablist" aria-label="Filter trip days">
        {filters.map(f => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className={cn('to-filter-tab', filter === f.key && 'to-filter-active')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="to-filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* City sections */}
      <div className="to-city-sections">
        {citySections.map(({ citySlug, config, days }) => {
          const filteredDays = days.filter(filterDay);
          if (filteredDays.length === 0 && filter !== 'all') return null;

          const CityIcon = config.icon;

          return (
            <motion.div
              key={citySlug}
              className="to-city-section"
              style={getCityStyle(citySlug)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* City header */}
              <div className="to-city-header">
                <div className="to-city-hero-thumb">
                  <Image
                    src={config.heroImage}
                    alt={config.name}
                    fill
                    sizes="48px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="to-city-info">
                  <div className="to-city-name">
                    <CityIcon size={14} />
                    {config.name}
                  </div>
                  <div className="to-city-dates">{config.dateRange} &middot; {config.nights}N</div>
                </div>
              </div>

              {/* Day rows */}
              <div className="to-day-rows">
                {(filter === 'all' ? days : filteredDays).map(day => {
                  const totalMinutes = day.activities.reduce((sum, a) => sum + a.duration, 0);
                  const density = getDensityLevel(totalMinutes);
                  const isTravel = isTravelDay(day);
                  const keyTitles = day.activities
                    .slice(0, 3)
                    .map(a => a.title);
                  const localDayIndex = getDaysForCity(citySlug).indexOf(day.dayIndex);
                  const dimmed = filter !== 'all' && !filterDay(day);

                  return (
                    <button
                      key={day.dayIndex}
                      className={cn(
                        'to-day-row',
                        dimmed && 'to-day-dimmed',
                        isTravel && 'to-day-travel',
                      )}
                      onClick={() => onNavigateToDay(citySlug, day.dayIndex)}
                      aria-label={`Day ${day.dayIndex + 1}, ${day.fullDate}, ${day.activities.length} activities`}
                    >
                      <span className="to-day-number">
                        {day.dayIndex + 1}
                      </span>

                      <span className="to-day-date">{day.date}</span>

                      <span
                        className="to-day-density"
                        style={{ backgroundColor: day.activities.length > 0 ? getDensityColor(density) : 'var(--border-subtle)' }}
                        title={`${Math.round(totalMinutes / 60)}h planned`}
                      />

                      <span className="to-day-count">
                        {isTravel ? (
                          day.activities[0]?.type === 'flight'
                            ? <Plane size={12} />
                            : <TrainFront size={12} />
                        ) : (
                          day.activities.length > 0 ? day.activities.length : '—'
                        )}
                      </span>

                      <span className="to-day-titles">
                        {isTravel && day.activities[0] ? (
                          <span className="to-travel-label">{day.activities[0].title}</span>
                        ) : keyTitles.length > 0 ? (
                          keyTitles.join(' · ')
                        ) : (
                          <span className="to-empty-label">Nothing planned</span>
                        )}
                      </span>

                      <span className="to-day-badges">
                        {day.activities.filter(a => a.status === 'Booked').length > 0 && (
                          <span className="to-badge to-badge-booked">
                            <CheckCircle2 size={10} />
                          </span>
                        )}
                        {day.activities.filter(a => a.status === 'Must Do').length > 0 && (
                          <span className="to-badge to-badge-mustdo">
                            <Sparkles size={10} />
                          </span>
                        )}
                        {day.activities.some(a => a.status === 'Optional') && (
                          <span className="to-badge to-badge-optional">
                            <AlertCircle size={10} />
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
