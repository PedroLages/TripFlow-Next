"use client"

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, Calendar, Moon, Sun, TrainFront, Wallet, Languages } from 'lucide-react';
import Image from 'next/image';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import { useCountUp } from '@/hooks/useCountUp';
import { resizeItineraryImage, type ItineraryDay, type LightboxSlide } from '@/lib/itinerary-data';
import { getBlurDataURL } from '@/lib/blur-data';
import './CityOverview.css';

interface CityOverviewProps {
  citySlug: CitySlug;
  cityDays: ItineraryDay[];
  onDaySelect: (dayIndex: number) => void;
  onOpenLightbox?: (slides: LightboxSlide[], startIndex: number) => void;
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
  onOpenLightbox,
}) => {
  const config = CITY_CONFIGS[citySlug];
  const CityIcon = config.icon;
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
          style={{ y: yImage }}
        >
          <Image
            src={config.heroImage}
            alt={`${config.name} hero`}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
        <motion.div className="co-hero-overlay" style={{ opacity: opacityOverlay }} />
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
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.08, duration: 0.5 }}
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
                  src={resizeItineraryImage(photo.imageUrl, 1200)}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="co-photo-img"
                  style={{ objectFit: 'cover' }}
                  {...(getBlurDataURL(photo.imageUrl) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(photo.imageUrl) } : {})}
                />
                <div className="co-photo-overlay">
                  <span className="co-photo-title">{photo.title}</span>
                  <button
                    className="co-photo-day-btn"
                    onClick={(e) => { e.stopPropagation(); onDaySelect(photo.dayIndex); }}
                  >
                    {photo.dayLabel} →
                  </button>
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
            const rawThumb = day.activities.find(a => a.imageUrl)?.imageUrl;
            const thumb = rawThumb ? resizeItineraryImage(rawThumb, 400) : undefined;
            return (
              <button
                key={day.dayIndex}
                className="co-day-card"
                onClick={() => onDaySelect(day.dayIndex)}
                aria-label={`Day ${localIndex + 1} — ${day.fullDate}, ${day.activities.length} activities`}
              >
                {thumb && (
                  <div className="co-day-card-thumb">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="160px"
                      style={{ objectFit: 'cover' }}
                      {...(getBlurDataURL(thumb) ? { placeholder: 'blur', blurDataURL: getBlurDataURL(thumb) } : {})}
                    />
                  </div>
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

      {/* Section 5: Quick Info Bar — stagger reveal */}
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
