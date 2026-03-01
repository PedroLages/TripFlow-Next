"use client";
import React, { useRef, useEffect } from 'react';
import { getDaysForCity, CITY_CONFIGS, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import { CloudSun, Sun, CloudRain, Thermometer, Droplets } from 'lucide-react';
import './DayNavigator.css';

// Mock Weather Data Generator for luxury polish
function getMockWeather(dayIndex: number) {
  const conditions = [
    { icon: <Sun size={14} />, text: 'Sunny', temp: 31, hourly: [
      { time: '9 AM', temp: 28, icon: <Sun size={12}/> },
      { time: '12 PM', temp: 31, icon: <Sun size={12}/> },
      { time: '3 PM', temp: 32, icon: <Sun size={12}/> },
      { time: '6 PM', temp: 29, icon: <Sun size={12}/> },
    ]},
    { icon: <CloudSun size={14} />, text: 'Partly Cloudy', temp: 28, hourly: [
      { time: '9 AM', temp: 24, icon: <CloudSun size={12}/> },
      { time: '12 PM', temp: 28, icon: <CloudSun size={12}/> },
      { time: '3 PM', temp: 27, icon: <CloudSun size={12}/> },
      { time: '6 PM', temp: 25, icon: <CloudSun size={12}/> },
    ]},
    { icon: <CloudRain size={14} />, text: 'Light Rain', temp: 24, hourly: [
      { time: '9 AM', temp: 22, icon: <CloudRain size={12}/> },
      { time: '12 PM', temp: 24, icon: <CloudRain size={12}/> },
      { time: '3 PM', temp: 23, icon: <CloudRain size={12}/> },
      { time: '6 PM', temp: 22, icon: <CloudSun size={12}/> },
    ]}
  ];
  return conditions[dayIndex % conditions.length];
}

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
  const CityIcon = config.icon;

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeDay]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeDay === -1) {
        // From Overview, go to first day
        onDayChange(days[0].dayIndex);
      } else {
        const currentLocalIndex = days.findIndex((d) => d.dayIndex === activeDay);
        if (currentLocalIndex < days.length - 1) {
          onDayChange(days[currentLocalIndex + 1].dayIndex);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeDay === -1) return; // Already on Overview
      const currentLocalIndex = days.findIndex((d) => d.dayIndex === activeDay);
      if (currentLocalIndex === 0) {
        onDayChange(-1); // Go to Overview
      } else if (currentLocalIndex > 0) {
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
      <button
        role="tab"
        aria-selected={activeDay === -1}
        tabIndex={activeDay === -1 ? 0 : -1}
        ref={activeDay === -1 ? activeTabRef : null}
        className={cn('day-tab overview-tab', activeDay === -1 && 'day-tab-active')}
        style={{
          '--tab-color': `var(${config.cssVar})`,
          '--tab-glow': `var(${config.glowVar})`,
        } as React.CSSProperties}
        onClick={() => onDayChange(-1)}
      >
        <CityIcon size={16} />
        <span className="day-tab-number">Overview</span>
        {activeDay === -1 && <span className="day-tab-bar" />}
      </button>
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
            {/* Weather Tooltip */}
            <div className="day-weather-badge">
              {getMockWeather(day.dayIndex).icon}
              <span>{getMockWeather(day.dayIndex).temp}°C</span>

              <div className="weather-tooltip">
                <div className="weather-tooltip-header">
                  {getMockWeather(day.dayIndex).icon}
                  <span>{getMockWeather(day.dayIndex).text}</span>
                </div>
                <div className="weather-hourly">
                  {getMockWeather(day.dayIndex).hourly.map((h, i) => (
                    <div key={i} className="hourly-slot">
                      <span className="hourly-time">{h.time}</span>
                      {h.icon}
                      <span className="hourly-temp">{h.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isActive && <span className="day-tab-bar" />}
          </button>
        );
      })}
    </div>
  );
}
