"use client";

import React, { useMemo } from 'react';
import { CITY_CONFIGS, getDaysForCity, CITY_ORDER, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import './TripContextBar.css';

const TOTAL_DAYS = 23;
const TOTAL_CITIES = CITY_ORDER.length;

interface TripContextBarProps {
  viewMode: 'city' | 'trip';
  activeCity: CitySlug;
  activeDay: number; // -1 = city overview, 0-22 = specific day
  allDays: ItineraryDay[];
}

export default function TripContextBar({
  viewMode,
  activeCity,
  activeDay,
  allDays,
}: TripContextBarProps) {
  const cityConfig = CITY_CONFIGS[activeCity];
  const cityDays = useMemo(() => getDaysForCity(activeCity), [activeCity]);

  const segments = useMemo(() => {
    if (viewMode === 'trip' || activeDay < 0) return null;

    const globalDay = activeDay + 1;
    const localIndex = cityDays.indexOf(activeDay);
    const localDay = localIndex + 1;
    const totalCityDays = cityDays.length;
    const remaining = TOTAL_DAYS - globalDay;
    const dayData = allDays[activeDay];
    const dateLabel = dayData?.fullDate ?? `Day ${globalDay}`;

    return { globalDay, localDay, totalCityDays, remaining, dateLabel, cityName: cityConfig.name };
  }, [viewMode, activeDay, cityDays, allDays, cityConfig.name]);

  const progressFraction = useMemo(() => {
    if (viewMode === 'trip') return 1;
    if (activeDay < 0) return cityDays[0] / TOTAL_DAYS;
    return (activeDay + 1) / TOTAL_DAYS;
  }, [viewMode, activeDay, cityDays]);

  const renderContent = () => {
    if (viewMode === 'trip') {
      return (
        <span className="tcb-text">
          <span className="tcb-segment-primary">Full Trip</span>
          <span className="tcb-sep" aria-hidden="true">&mdash;</span>
          <span className="tcb-segment tcb-hide-mobile">{TOTAL_DAYS} days, {TOTAL_CITIES} cities</span>
        </span>
      );
    }

    if (activeDay === -1) {
      return (
        <span className="tcb-text">
          <span className="tcb-segment-primary">{cityConfig.name} Overview</span>
          <span className="tcb-sep tcb-hide-mobile" aria-hidden="true">&mdash;</span>
          <span className="tcb-segment tcb-hide-mobile">{cityConfig.dateRange}</span>
          <span className="tcb-sep tcb-hide-mobile" aria-hidden="true">&mdash;</span>
          <span className="tcb-segment tcb-hide-mobile">{cityConfig.nights} nights</span>
        </span>
      );
    }

    if (!segments) return null;

    return (
      <span className="tcb-text">
        <span className="tcb-segment-primary">
          Day <span className="tcb-num">{segments.globalDay}</span>
          <span className="tcb-of-total">
            <span className="tcb-hide-mobile"> of </span>
            <span className="tcb-show-mobile">/</span>
            <span className="tcb-num">{TOTAL_DAYS}</span>
          </span>
        </span>
        <span className="tcb-sep tcb-hide-mobile" aria-hidden="true">&mdash;</span>
        <span className="tcb-segment tcb-hide-mobile">
          {segments.cityName} Day {segments.localDay}/{segments.totalCityDays}
        </span>
        <span className="tcb-sep tcb-hide-mobile" aria-hidden="true">&mdash;</span>
        <span className="tcb-segment tcb-hide-mobile">{segments.dateLabel}</span>
        <span className="tcb-sep tcb-hide-mobile" aria-hidden="true">&mdash;</span>
        <span className="tcb-segment tcb-remaining tcb-hide-mobile">
          <span className="tcb-num">{segments.remaining}</span> day{segments.remaining !== 1 ? 's' : ''} remaining
        </span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        'tcb-bar',
        viewMode === 'trip' && 'tcb-trip-mode',
        activeDay === -1 && viewMode !== 'trip' && 'tcb-overview-mode',
      )}
      style={{
        '--city-color': `var(${cityConfig.cssVar})`,
        '--tcb-progress': `${(progressFraction * 100).toFixed(1)}%`,
      } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={
        viewMode === 'trip'
          ? `Full trip: ${TOTAL_DAYS} days, ${TOTAL_CITIES} cities`
          : activeDay === -1
            ? `${cityConfig.name} overview, ${cityConfig.dateRange}, ${cityConfig.nights} nights`
            : segments
              ? `Day ${segments.globalDay} of ${TOTAL_DAYS}, ${segments.cityName} day ${segments.localDay} of ${segments.totalCityDays}, ${segments.dateLabel}, ${segments.remaining} days remaining`
              : ''
      }
    >
      <div className="tcb-content">{renderContent()}</div>
      <div className="tcb-progress-track" aria-hidden="true">
        <div className="tcb-progress-fill" />
      </div>
    </div>
  );
}
