"use client";
import React, { useRef, useEffect } from 'react';
import { getDaysForCity, CITY_CONFIGS, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import './DayNavigator.css';

interface DayNavigatorProps {
  days: ItineraryDay[];
  activeDay: number;
  onDayChange: (dayIndex: number) => void;
  citySlug: CitySlug;
}

export default function DayNavigator({
  days,
  activeDay,
  onDayChange,
  citySlug,
}: DayNavigatorProps) {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const cityDays = getDaysForCity(citySlug);
  const config = CITY_CONFIGS[citySlug];

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeDay]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentLocalIndex = days.findIndex((d) => d.dayIndex === activeDay);
    if (currentLocalIndex === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentLocalIndex < days.length - 1) {
        onDayChange(days[currentLocalIndex + 1].dayIndex);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentLocalIndex > 0) {
        onDayChange(days[currentLocalIndex - 1].dayIndex);
      }
    }
  };

  return (
    <div
      className="day-navigator"
      role="tablist"
      aria-label={`${config.name} days`}
      onKeyDown={handleKeyDown}
    >
      {days.map((day, localIndex) => {
        const isActive = activeDay === day.dayIndex;
        const activityCount = day.activities.length;
        return (
          <button
            key={day.dayIndex}
            ref={isActive ? activeTabRef : null}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn('day-tab', isActive && 'day-tab-active')}
            style={
              {
                '--tab-color': `var(${config.cssVar})`,
                '--tab-glow': `var(${config.glowVar})`,
              } as React.CSSProperties
            }
            onClick={() => onDayChange(day.dayIndex)}
          >
            <span className="day-tab-number">Day {localIndex + 1}</span>
            <span className="day-tab-date">{day.date}</span>
            {activityCount > 0 && (
              <span className="day-tab-count">{activityCount}</span>
            )}
            {isActive && <span className="day-tab-bar" />}
          </button>
        );
      })}
    </div>
  );
}
