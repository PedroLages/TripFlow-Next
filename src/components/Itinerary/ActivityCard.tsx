"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Hotel, Utensils, Camera, MapPin, Sparkles,
  ShoppingBag, CheckCircle2, AlertCircle, Ship,
  Star, Clock, MapPin as MapPinIcon,
  CreditCard, HelpCircle, XCircle, StickyNote, GripVertical,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { cn } from '@/lib/utils';
import { getCityStyle } from '@/lib/city-colors';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity, LightboxSlide } from '@/lib/itinerary-data';
import { PhotoCarousel } from './PhotoCarousel';
import './ActivityCard.css';

interface ActivityCardProps {
  activity: Activity;
  citySlug: CitySlug;
  isExpanded: boolean;
  isLiveNow?: boolean;
  isHighlighted?: boolean;
  onToggleExpand: () => void;
  onOpenSuggestions: () => void;
  onOpenLightbox?: (slides: LightboxSlide[], startIndex: number) => void;
  onHover?: (activityId: string | null) => void;
  index: number;
}

function getIconForType(type: Activity['type']) {
  switch (type) {
    case 'flight': return <Plane size={18} />;
    case 'hotel': return <Hotel size={18} />;
    case 'food': return <Utensils size={18} />;
    case 'activity': return <Camera size={18} />;
    case 'shopping': return <ShoppingBag size={18} />;
    case 'transport': return <Ship size={18} />;
    default: return <MapPin size={18} />;
  }
}

function getStatusBadgeIcon(status: string) {
  switch (status) {
    case 'Booked': return <CheckCircle2 size={12} />;
    case 'Paid': return <CreditCard size={12} />;
    case 'Pending': return <Clock size={12} />;
    case 'Must Do': return <Sparkles size={12} />;
    case 'Considering': return <HelpCircle size={12} />;
    case 'Optional': return <AlertCircle size={12} />;
    case 'Cancelled': return <XCircle size={12} />;
    default: return null;
  }
}

export const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(({
  activity,
  citySlug,
  isExpanded,
  isLiveNow,
  isHighlighted,
  onToggleExpand,
  onOpenSuggestions,
  onOpenLightbox,
  onHover,
  index,
}, ref) => {
  const cityStyle = getCityStyle(citySlug);
  const isCancelled = activity.status === 'Cancelled';
  const hasNotes = !!(activity as Activity & { notes?: string }).notes;
  const notes = (activity as Activity & { notes?: string }).notes;
  const tags = (activity as Activity & { tags?: string[] }).tags;
  const firstPhoto = activity.photos?.[0] ?? activity.imageUrl;

  return (
    <div
      ref={ref}
      className={cn(
        'activity-card-wrapper',
        isHighlighted && 'activity-card-highlighted',
        !isExpanded && 'activity-card-compact',
      )}
      style={cityStyle}
      onMouseEnter={() => onHover?.(activity.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {isLiveNow && <div className="live-time-indicator"></div>}

      <div className={cn('duration-bar', `type-${activity.type}`)} />

      <div className="timeline-time" style={{ fontVariantNumeric: 'tabular-nums' }}>{activity.time}</div>

      <div className="timeline-node">
        <div className="node-icon">{getIconForType(activity.type)}</div>
      </div>

      <Card
        className={cn('timeline-content-card', isExpanded && 'expanded')}
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
      >
        {/* Task 12: Mobile drag handle — visible only on mobile */}
        <div className="mobile-drag-handle" aria-hidden="true">
          <GripVertical size={16} />
        </div>

        {/* Tier 1 -- Collapsed: compact single-line with status badge inline */}
        {activity.status && (
          <div className={cn('status-badge', `badge-${activity.status.replace(/\s+/g, '-').toLowerCase()}`)}>
            {getStatusBadgeIcon(activity.status)} {activity.status}
          </div>
        )}
        <CardContent className="timeline-card-inner">
          <div className="activity-info">
            <h4 className={cn('activity-title', isCancelled && 'activity-title-cancelled')}>
              {activity.title}
            </h4>
            <div className="activity-duration">
              {activity.duration} min
              {hasNotes && (
                <span className="activity-notes-preview">
                  <StickyNote size={10} /> Note
                </span>
              )}
            </div>
          </div>
        </CardContent>

        {/* Tier 2 -- Expanded: thumbnail, metadata, notes, tags, AI insights */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="activity-discussion-panel"
            >
              {/* Thumbnail + metadata row */}
              <div className="activity-expanded-content">
                {firstPhoto && (
                  <div
                    className="activity-expanded-thumb"
                    onClick={(e) => {
                      e.stopPropagation();
                      const allPhotos = activity.photos ?? (activity.imageUrl ? [activity.imageUrl] : []);
                      const slides = allPhotos.map(src => ({ src, title: activity.title }));
                      onOpenLightbox?.(slides, 0);
                    }}
                  >
                    <img
                      src={firstPhoto}
                      alt={activity.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="activity-expanded-details">
                  {activity.place && (
                    <div className="activity-metadata">
                      {activity.place.rating && (
                        <span className="meta-rating">
                          <Star size={12} fill="currentColor" /> {activity.place.rating}
                          {activity.place.reviewCount && (
                            <span className="meta-muted">({activity.place.reviewCount.toLocaleString()})</span>
                          )}
                        </span>
                      )}
                      {activity.place.priceLevel && (
                        <span className="meta-price">
                          {'$'.repeat(activity.place.priceLevel)}
                          <span className="meta-muted">{'$'.repeat(4 - activity.place.priceLevel)}</span>
                        </span>
                      )}
                      {activity.place.openingHours && (
                        <span className="meta-hours">
                          <Clock size={11} /> {activity.place.openingHours}
                        </span>
                      )}
                      {activity.place.address && (
                        <span className="meta-address">
                          <MapPinIcon size={11} /> {activity.place.address}
                        </span>
                      )}
                    </div>
                  )}
                  {/* AI Insights button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="vote-btn"
                    onClick={(e) => { e.stopPropagation(); onOpenSuggestions(); }}
                    aria-label="AI Insights"
                  >
                    <Sparkles size={14} className="text-accent" style={{ marginRight: '4px' }} /> Insight
                  </Button>
                </div>
              </div>

              {/* Notes section (replaces votes/comments) */}
              <div className="activity-notes-section" onClick={(e) => e.stopPropagation()}>
                <label className="activity-notes-label">Notes</label>
                <textarea
                  className="activity-notes-textarea"
                  placeholder="Add personal notes for this activity..."
                  defaultValue={notes ?? ''}
                  readOnly
                  aria-label="Personal notes"
                />
              </div>

              {/* Tags display */}
              {tags && tags.length > 0 && (
                <div className="activity-tags" onClick={(e) => e.stopPropagation()}>
                  {tags.map(tag => (
                    <span key={tag} className="activity-tag">{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
});
ActivityCard.displayName = 'ActivityCard';
