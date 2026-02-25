"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CITY_ORDER, CITY_CONFIGS, TOTAL_NIGHTS, type CitySlug } from '@/lib/city-colors';
import './CityNavigator.css';

interface CityNavigatorProps {
  activeCity: CitySlug;
  onCityChange: (city: CitySlug) => void;
}

export default function CityNavigator({ activeCity, onCityChange }: CityNavigatorProps) {
  const pillRefs = useRef<Map<CitySlug, HTMLButtonElement | null>>(new Map());

  // Auto-scroll the active pill into view
  useEffect(() => {
    const activePill = pillRefs.current.get(activeCity);
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCity]);

  // Keyboard navigation: Left/Right arrows cycle through cities
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const currentIndex = CITY_ORDER.indexOf(activeCity);
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % CITY_ORDER.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + CITY_ORDER.length) % CITY_ORDER.length;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextCity = CITY_ORDER[nextIndex];
        onCityChange(nextCity);
        // Focus the next pill
        pillRefs.current.get(nextCity)?.focus();
      }
    },
    [activeCity, onCityChange],
  );

  return (
    <nav className="city-navigator" role="tablist" aria-label="Trip cities" onKeyDown={handleKeyDown}>
      <div className="city-pills-scroll">
        {CITY_ORDER.map((slug) => {
          const config = CITY_CONFIGS[slug];
          const Icon = config.icon;
          const isActive = activeCity === slug;

          return (
            <button
              key={slug}
              ref={(el) => { pillRefs.current.set(slug, el); }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={cn('city-pill', isActive && 'city-pill-active')}
              style={
                {
                  '--pill-color': `var(${config.cssVar})`,
                  '--pill-glow': `var(${config.glowVar})`,
                } as React.CSSProperties
              }
              onClick={() => onCityChange(slug)}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="city-pill-name">{config.name}</span>
              <span className="city-pill-nights">{config.nights}N</span>
              {isActive && (
                <motion.div
                  className="city-pill-indicator"
                  layoutId="cityIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Trip Progress Bar -- proportional segments per city */}
      <div className="trip-progress-bar" role="progressbar" aria-label="Trip progress">
        {CITY_ORDER.map((slug) => {
          const config = CITY_CONFIGS[slug];
          const widthPercent = (config.nights / TOTAL_NIGHTS) * 100;

          return (
            <button
              key={slug}
              className={cn('progress-segment', activeCity === slug && 'progress-segment-active')}
              style={
                {
                  width: `${widthPercent}%`,
                  '--segment-color': `var(${config.cssVar})`,
                } as React.CSSProperties
              }
              onClick={() => onCityChange(slug)}
              aria-label={`${config.name}: ${config.nights} nights`}
            />
          );
        })}
      </div>
    </nav>
  );
}
