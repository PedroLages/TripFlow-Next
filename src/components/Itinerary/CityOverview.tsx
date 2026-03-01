"use client"

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MapPin, Calendar, Moon, Sun, TrainFront, Wallet, Languages,
  CheckCircle2, AlertCircle, Clock, ChevronRight, Utensils,
  Ticket, Bus, CloudSun, Thermometer, Droplets,
} from 'lucide-react';
import Image from 'next/image';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import { resizeItineraryImage, type ItineraryDay, type LightboxSlide } from '@/lib/itinerary-data';
import { getBlurDataURL } from '@/lib/blur-data';
import './CityOverview.css';

// ---------------------------------------------------------------------------
// Density helpers (mirroring TripOverview)
// ---------------------------------------------------------------------------

function getDensityLevel(totalMinutes: number): 'light' | 'moderate' | 'heavy' | 'over' {
  const hours = totalMinutes / 60;
  if (hours <= 4) return 'light';
  if (hours <= 8) return 'moderate';
  if (hours <= 12) return 'heavy';
  return 'over';
}

function getDensityColor(level: ReturnType<typeof getDensityLevel>): string {
  switch (level) {
    case 'light': return 'var(--density-light, #22c55e)';
    case 'moderate': return 'var(--density-moderate, #22c55e)';
    case 'heavy': return 'var(--density-heavy, #f59e0b)';
    case 'over': return 'var(--density-over, #ef4444)';
  }
}

// ---------------------------------------------------------------------------
// Weather mock data (late Aug - mid Sep 2026)
// ---------------------------------------------------------------------------

const CITY_WEATHER: Record<CitySlug, { temp: string; high: number; low: number; condition: string; humidity: string }> = {
  shanghai:  { temp: '28-33°C', high: 33, low: 28, condition: 'Hot & Humid',       humidity: '80%' },
  hongkong:  { temp: '28-31°C', high: 31, low: 28, condition: 'Tropical Showers',  humidity: '82%' },
  osaka:     { temp: '26-30°C', high: 30, low: 26, condition: 'Warm & Sunny',      humidity: '65%' },
  kyoto:     { temp: '24-28°C', high: 28, low: 24, condition: 'Pleasant',          humidity: '60%' },
  tokyo:     { temp: '24-27°C', high: 27, low: 24, condition: 'Clear Skies',       humidity: '55%' },
  beijing:   { temp: '22-26°C', high: 26, low: 22, condition: 'Dry & Clear',       humidity: '45%' },
};

// ---------------------------------------------------------------------------
// Budget mock data (per-day estimates by category)
// ---------------------------------------------------------------------------

const CITY_BUDGET: Record<CitySlug, { total: number; food: number; activities: number; transport: number }> = {
  shanghai:  { total: 80,  food: 30, activities: 25, transport: 25 },
  hongkong:  { total: 120, food: 45, activities: 40, transport: 35 },
  osaka:     { total: 100, food: 40, activities: 30, transport: 30 },
  kyoto:     { total: 90,  food: 30, activities: 35, transport: 25 },
  tokyo:     { total: 110, food: 40, activities: 40, transport: 30 },
  beijing:   { total: 70,  food: 25, activities: 25, transport: 20 },
};

// ---------------------------------------------------------------------------
// Sub-component: MiniRouteSummary
// ---------------------------------------------------------------------------

const MiniRouteSummary: React.FC<{
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
}> = ({ cityDays, onDaySelect }) => (
  <div className="co-route-summary">
    <h3 className="co-section-title">Route at a Glance</h3>
    <div className="co-route-flow">
      {cityDays.map((day, i) => {
        const totalMin = day.activities.reduce((s, a) => s + a.duration, 0);
        const density = getDensityLevel(totalMin);
        const count = day.activities.length;
        return (
          <React.Fragment key={day.dayIndex}>
            {i > 0 && <ChevronRight size={12} className="co-route-arrow" />}
            <button
              className="co-route-day"
              onClick={() => onDaySelect(day.dayIndex)}
              title={`Day ${i + 1}: ${count} activities, ~${Math.round(totalMin / 60)}h`}
            >
              <span className="co-route-day-num">D{i + 1}</span>
              <span
                className="co-route-density"
                style={{
                  backgroundColor: count > 0 ? getDensityColor(density) : 'var(--border-subtle)',
                }}
              />
              <span className="co-route-day-count">{count}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Sub-component: BudgetSummary
// ---------------------------------------------------------------------------

const BudgetSummary: React.FC<{
  citySlug: CitySlug;
  nights: number;
  activityCount: number;
}> = ({ citySlug, nights, activityCount }) => {
  const budget = CITY_BUDGET[citySlug];
  const totalEstimate = budget.total * nights;
  const categories = [
    { label: 'Food',       value: budget.food,       icon: <Utensils size={12} /> },
    { label: 'Activities', value: budget.activities,  icon: <Ticket size={12} /> },
    { label: 'Transport',  value: budget.transport,   icon: <Bus size={12} /> },
  ];

  return (
    <div className="co-budget-summary">
      <div className="co-budget-header">
        <Wallet size={14} className="co-budget-icon" />
        <div className="co-budget-headline">
          <span className="co-budget-total">~${totalEstimate}</span>
          <span className="co-budget-sub">est. for {nights} nights</span>
        </div>
        <span className="co-budget-per-day">~${budget.total}/day</span>
      </div>
      <div className="co-budget-categories">
        {categories.map(c => (
          <div key={c.label} className="co-budget-cat">
            {c.icon}
            <span className="co-budget-cat-label">{c.label}</span>
            <span className="co-budget-cat-value">${c.value}</span>
          </div>
        ))}
      </div>
      <div className="co-budget-bar">
        {categories.map(c => (
          <div
            key={c.label}
            className="co-budget-bar-seg"
            style={{ flex: c.value }}
            title={`${c.label}: $${c.value}/day`}
          />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: WeatherStrip
// ---------------------------------------------------------------------------

const WeatherStrip: React.FC<{ citySlug: CitySlug }> = ({ citySlug }) => {
  const weather = CITY_WEATHER[citySlug];
  return (
    <div className="co-weather-strip">
      <CloudSun size={16} className="co-weather-icon" />
      <div className="co-weather-info">
        <span className="co-weather-condition">{weather.condition}</span>
        <span className="co-weather-detail">
          <Thermometer size={11} /> {weather.temp}
          <span className="co-weather-sep" />
          <Droplets size={11} /> {weather.humidity}
        </span>
      </div>
      <div className="co-weather-bar" title={`${weather.low}°C — ${weather.high}°C`}>
        <div
          className="co-weather-bar-fill"
          style={{ width: `${Math.min(100, ((weather.high - 15) / 25) * 100)}%` }}
        />
      </div>
    </div>
  );
};

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
  onOpenLightbox?: (slides: LightboxSlide[], startIndex: number) => void;
}

export const CityOverview: React.FC<CityOverviewProps> = ({
  citySlug,
  cityDays,
  onDaySelect,
  onOpenLightbox,
}) => {
  const config = CITY_CONFIGS[citySlug];
  const CityIcon = config.icon;
  const shouldReduceMotion = useReducedMotion();

  // Task 15: Removed parallax — motion budget cut to 3 signature effects
  // (Keeping: blur transitions, stagger reveals, card expand/collapse)

  // Derive city-level stats
  const allActivities = useMemo(
    () => cityDays.flatMap(d => d.activities),
    [cityDays]
  );
  const totalActivities = allActivities.length;
  const mustDoCount = allActivities.filter(a => a.status === 'Must Do').length;
  const bookedCount = allActivities.filter(a => a.status === 'Booked').length;
  const totalHours = Math.round(allActivities.reduce((sum, a) => sum + a.duration, 0) / 60);

  // Derive photo highlights — prioritize Must Do, cap at 6
  const photoHighlights = useMemo(() => {
    const photos: { imageUrl: string; title: string; dayIndex: number; dayLabel: string; status?: string }[] = [];
    for (const day of cityDays) {
      for (const a of day.activities) {
        if (a.imageUrl) {
          const localDay = cityDays.indexOf(day) + 1;
          photos.push({
            imageUrl: a.imageUrl,
            title: a.title,
            dayIndex: day.dayIndex,
            dayLabel: `Day ${localDay}`,
            status: a.status,
          });
        }
      }
    }
    // Must-Do first, then Booked, then the rest
    const priority = (s?: string) => s === 'Must Do' ? 0 : s === 'Booked' ? 1 : 2;
    photos.sort((a, b) => priority(a.status) - priority(b.status));
    return photos.slice(0, 6);
  }, [cityDays]);

  return (
    <div className="city-overview" style={getCityStyle(citySlug)}>
      {/* Section 1: Parallax Hero */}
      <div
        className="co-hero"
        role="img"
        aria-label={`${config.name} — ${config.tagline}`}
      >
        <div className="co-hero-image">
          <Image
            src={config.heroImage}
            alt={`${config.name} hero`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="co-hero-overlay" />
        <div className="co-hero-content">
          <motion.div
            className="co-hero-icon"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CityIcon size={32} />
          </motion.div>
          <motion.h2
            className="co-hero-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {config.name}
          </motion.h2>
          <motion.p
            className="co-hero-tagline"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {config.tagline}
          </motion.p>
          <motion.div
            className="co-hero-meta"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
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

      {/* Section 2: Progress Bar */}
      <div className="co-progress-bar">
        <div className="co-progress-stats">
          <div className="co-progress-ring-wrap">
            <svg className="co-progress-ring" viewBox="0 0 36 36" aria-hidden="true">
              <circle className="co-progress-ring-bg" cx="18" cy="18" r="15.5" />
              <circle
                className="co-progress-ring-fill"
                cx="18" cy="18" r="15.5"
                strokeDasharray={`${totalActivities > 0 ? (bookedCount / totalActivities) * 97.4 : 0} 97.4`}
              />
            </svg>
            <span className="co-progress-ring-label">{totalActivities > 0 ? Math.round((bookedCount / totalActivities) * 100) : 0}%</span>
          </div>
          <div className="co-progress-counts">
            <span className="co-progress-count">
              <CheckCircle2 size={14} />
              <strong>{bookedCount}</strong>/{totalActivities} booked
            </span>
            {mustDoCount > bookedCount && (
              <span className="co-progress-count co-progress-alert">
                <AlertCircle size={14} />
                {mustDoCount - bookedCount} must-dos unbooked
              </span>
            )}
          </div>
          <span className="co-progress-hours">
            <Clock size={14} /> {totalHours}h planned
          </span>
        </div>
        <div className="co-progress-segments" aria-label="Day-by-day booking progress">
          {cityDays.map((day, i) => {
            const dayBooked = day.activities.filter(a => a.status === 'Booked').length;
            const dayTotal = day.activities.length;
            const pct = dayTotal > 0 ? dayBooked / dayTotal : 0;
            return (
              <div
                key={day.dayIndex}
                className="co-progress-segment"
                style={{
                  flex: 1,
                  backgroundColor: dayTotal === 0
                    ? 'var(--border-subtle)'
                    : pct === 1
                      ? 'var(--city-color)'
                      : pct > 0
                        ? 'color-mix(in srgb, var(--city-color) 40%, var(--border-subtle))'
                        : 'var(--border-subtle)',
                }}
                title={`Day ${i + 1}: ${dayBooked}/${dayTotal} booked`}
              />
            );
          })}
        </div>
      </div>

      {/* Section 3: Mini Route + Budget + Weather */}
      <div className="co-glance-row">
        <MiniRouteSummary cityDays={cityDays} onDaySelect={onDaySelect} />
        <BudgetSummary
          citySlug={citySlug}
          nights={config.nights}
          activityCount={totalActivities}
        />
      </div>
      <WeatherStrip citySlug={citySlug} />

      {/* Section 4: Day Preview Cards — enhanced with status + preview */}
      <div className="co-section">
        <h3 className="co-section-title">Your Days</h3>
        <div className="co-day-cards-scroll">
          {cityDays.map((day, localIndex) => {
            const rawThumb = day.activities.find(a => a.imageUrl)?.imageUrl;
            const thumb = rawThumb ? resizeItineraryImage(rawThumb, 400) : undefined;
            const previewTitles = day.activities.slice(0, 2).map(a => a.title).join(', ');
            const statusCounts = {
              booked: day.activities.filter(a => a.status === 'Booked').length,
              mustDo: day.activities.filter(a => a.status === 'Must Do').length,
              optional: day.activities.filter(a => a.status === 'Optional' || !a.status).length,
            };
            return (
              <button
                key={day.dayIndex}
                className="co-day-card"
                onClick={() => onDaySelect(day.dayIndex)}
                aria-label={`Day ${localIndex + 1} — ${day.fullDate}, ${day.activities.length} activities, ${statusCounts.booked} booked`}
              >
                {thumb && (
                  <div className="co-day-card-thumb">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="220px"
                      style={{ objectFit: 'cover' }}
                      {...(getBlurDataURL(thumb) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(thumb) } : {})}
                    />
                  </div>
                )}
                <div className="co-day-card-info">
                  <div className="co-day-card-header">
                    <span className="co-day-card-number">Day {localIndex + 1}</span>
                    <span className="co-day-card-date">{day.date}</span>
                  </div>
                  {previewTitles && (
                    <span className="co-day-card-preview">{previewTitles}</span>
                  )}
                  <div className="co-day-card-footer">
                    <div className="co-day-card-dots" aria-label={`${statusCounts.booked} booked, ${statusCounts.mustDo} must-do, ${statusCounts.optional} optional`}>
                      {day.activities.map(a => (
                        <span
                          key={a.id}
                          className={`co-status-dot ${a.status === 'Booked' ? 'booked' : a.status === 'Must Do' ? 'must-do' : 'optional'}`}
                        />
                      ))}
                    </div>
                    <span className="co-day-card-count">
                      {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 5: Photo Strip */}
      {photoHighlights.length > 0 && (
        <div className="co-section">
          <div className="co-section-header">
            <h3 className="co-section-title">Highlights</h3>
            {photoHighlights.length >= 4 && (
              <button
                className="co-photo-view-all"
                onClick={() => onOpenLightbox?.(
                  photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })),
                  0,
                )}
              >
                View all
              </button>
            )}
          </div>
          <div className="co-photo-strip">
            {photoHighlights.map((photo, i) => (
              <div
                key={photo.imageUrl}
                className="co-photo-strip-item"
                onClick={() => onOpenLightbox?.(
                  photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })),
                  i,
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox?.(photoHighlights.map(p => ({ src: p.imageUrl, title: p.title })), i);
                  }
                }}
                aria-label={`${photo.title} — click to view photo`}
              >
                <Image
                  src={resizeItineraryImage(photo.imageUrl, 800)}
                  alt={photo.title}
                  fill
                  sizes="280px"
                  loading="lazy"
                  className="co-photo-strip-img"
                  style={{ objectFit: 'cover' }}
                  {...(getBlurDataURL(photo.imageUrl) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(photo.imageUrl) } : {})}
                />
                <div className="co-photo-strip-overlay">
                  <span className="co-photo-title">{photo.title}</span>
                  <button
                    className="co-photo-day-btn"
                    onClick={(e) => { e.stopPropagation(); onDaySelect(photo.dayIndex); }}
                  >
                    {photo.dayLabel} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 6: Quick Info Bar — stagger reveal */}
      <motion.div
        className="co-quick-info"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {[
          { icon: <Sun size={16} />, label: 'Climate', value: config.climate },
          { icon: <TrainFront size={16} />, label: 'Getting Around', value: config.transitTip },
          { icon: <Wallet size={16} />, label: 'Budget', value: config.budgetRange },
          { icon: <Languages size={16} />, label: 'Language', value: config.languageTip },
        ].map((info) => (
          <motion.div
            key={info.label}
            className="co-info-item"
            variants={shouldReduceMotion ? undefined : {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
          >
            {info.icon}
            <div>
              <span className="co-info-label">{info.label}</span>
              <span className="co-info-value">{info.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Highlights — cascade reveal */}
      <motion.div
        className="co-highlights"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {config.highlights.map(h => (
          <motion.span
            key={h}
            className="co-highlight-pill"
            variants={shouldReduceMotion ? undefined : {
              hidden: { opacity: 0, scale: 0.85 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
            }}
          >
            <MapPin size={12} /> {h}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
