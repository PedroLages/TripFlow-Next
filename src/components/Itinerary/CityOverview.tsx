"use client"

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Moon } from 'lucide-react';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import './CityOverview.css';

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
}

export const CityOverview: React.FC<CityOverviewProps> = ({
  citySlug,
  cityDays,
  onDaySelect,
}) => {
  const config = CITY_CONFIGS[citySlug];
  const CityIcon = config.icon;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacityOverlay = useTransform(scrollYProgress, [0, 1], [0.3, 0.7]);

  return (
    <div className="city-overview" style={getCityStyle(citySlug)}>
      {/* Section 1: Parallax Hero */}
      <div
        className="co-hero"
        ref={containerRef}
        role="img"
        aria-label={`${config.name} — ${config.tagline}`}
      >
        <motion.div
          className="co-hero-image"
          style={{
            backgroundImage: `url(${config.heroImage})`,
            y: yImage,
          }}
        />
        <motion.div className="co-hero-overlay" style={{ opacity: opacityOverlay }} />
        <div className="co-hero-content">
          <motion.div
            className="co-hero-icon"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CityIcon size={32} />
          </motion.div>
          <motion.h2
            className="co-hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {config.name}
          </motion.h2>
          <motion.p
            className="co-hero-tagline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {config.tagline}
          </motion.p>
          <motion.div
            className="co-hero-meta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="co-meta-pill">
              <Calendar size={14} /> {config.dateRange}
            </span>
            <span className="co-meta-pill">
              <Moon size={14} /> {config.nights} nights
            </span>
          </motion.div>
        </div>
      </div>

      {/* Sections 2-5 will be added in subsequent tasks */}
    </div>
  );
};
