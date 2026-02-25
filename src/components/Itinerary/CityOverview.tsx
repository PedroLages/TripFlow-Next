"use client"

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Moon, Sun, TrainFront, Wallet, Languages } from 'lucide-react';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import { useCountUp } from '@/hooks/useCountUp';
import type { ItineraryDay } from '@/lib/itinerary-data';
import './CityOverview.css';

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
}

function StatCounter({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  const [ref, animatedValue] = useCountUp(value);
  return (
    <div className="co-stat" ref={ref as React.RefObject<HTMLDivElement>}>
      <span className="co-stat-value">{animatedValue}{suffix}</span>
      <span className="co-stat-label">{label}</span>
    </div>
  );
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

  // Derive city-level stats
  const allActivities = useMemo(
    () => cityDays.flatMap(d => d.activities),
    [cityDays]
  );
  const totalActivities = allActivities.length;
  const mustDoCount = allActivities.filter(a => a.status === 'Must Do').length;
  const bookedCount = allActivities.filter(a => a.status === 'Booked').length;
  const totalHours = Math.round(allActivities.reduce((sum, a) => sum + a.duration, 0) / 60);

  // Derive photo highlights from activities with images
  const photoHighlights = useMemo(() => {
    const photos: { imageUrl: string; title: string; dayIndex: number; dayLabel: string }[] = [];
    for (const day of cityDays) {
      for (const a of day.activities) {
        if (a.imageUrl) {
          const localDay = cityDays.indexOf(day) + 1;
          photos.push({
            imageUrl: a.imageUrl,
            title: a.title,
            dayIndex: day.dayIndex,
            dayLabel: `Day ${localDay}`,
          });
        }
      }
    }
    return photos.slice(0, 8);
  }, [cityDays]);

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

      {/* Section 2: Stats Counter Strip */}
      <div className="co-stats-strip" aria-live="polite">
        <StatCounter label="Activities" value={totalActivities} />
        <StatCounter label="Must-Dos" value={mustDoCount} />
        <StatCounter label="Booked" value={bookedCount} />
        <StatCounter label="Hours Planned" value={totalHours} suffix="h" />
      </div>

      {/* Section 3: Photo Highlights */}
      {photoHighlights.length > 0 && (
        <div className="co-section">
          <h3 className="co-section-title">Highlights</h3>
          <div className="co-photo-grid">
            {photoHighlights.map((photo, i) => (
              <motion.div
                key={photo.imageUrl}
                className="co-photo-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => onDaySelect(photo.dayIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDaySelect(photo.dayIndex);
                  }
                }}
                aria-label={`${photo.title} — click to view ${photo.dayLabel}`}
              >
                <div
                  className="co-photo-img"
                  style={{ backgroundImage: `url(${photo.imageUrl})` }}
                />
                <div className="co-photo-overlay">
                  <span className="co-photo-title">{photo.title}</span>
                  <span className="co-photo-day">{photo.dayLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Day Preview Cards */}
      <div className="co-section">
        <h3 className="co-section-title">Your Days</h3>
        <div className="co-day-cards-scroll">
          {cityDays.map((day, localIndex) => {
            const thumb = day.activities.find(a => a.imageUrl)?.imageUrl;
            return (
              <button
                key={day.dayIndex}
                className="co-day-card"
                onClick={() => onDaySelect(day.dayIndex)}
                aria-label={`Day ${localIndex + 1} — ${day.fullDate}, ${day.activities.length} activities`}
              >
                {thumb && (
                  <div
                    className="co-day-card-thumb"
                    style={{ backgroundImage: `url(${thumb})` }}
                  />
                )}
                <div className="co-day-card-info">
                  <span className="co-day-card-number">Day {localIndex + 1}</span>
                  <span className="co-day-card-date">{day.date}</span>
                  <span className="co-day-card-count">
                    {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 5: Quick Info Bar */}
      <div className="co-quick-info">
        <div className="co-info-item">
          <Sun size={16} />
          <div>
            <span className="co-info-label">Climate</span>
            <span className="co-info-value">{config.climate}</span>
          </div>
        </div>
        <div className="co-info-item">
          <TrainFront size={16} />
          <div>
            <span className="co-info-label">Getting Around</span>
            <span className="co-info-value">{config.transitTip}</span>
          </div>
        </div>
        <div className="co-info-item">
          <Wallet size={16} />
          <div>
            <span className="co-info-label">Budget</span>
            <span className="co-info-value">{config.budgetRange}</span>
          </div>
        </div>
        <div className="co-info-item">
          <Languages size={16} />
          <div>
            <span className="co-info-label">Language</span>
            <span className="co-info-value">{config.languageTip}</span>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="co-highlights">
        {config.highlights.map(h => (
          <span key={h} className="co-highlight-pill">
            <MapPin size={12} /> {h}
          </span>
        ))}
      </div>
    </div>
  );
};
