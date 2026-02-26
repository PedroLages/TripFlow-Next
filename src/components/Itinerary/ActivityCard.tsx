"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Hotel, Utensils, Camera, MapPin, Sparkles,
  ThumbsUp, ThumbsDown, MessageSquare, Send, ShoppingBag,
  CheckCircle2, AlertCircle, Ship,
  Star, Clock, MapPin as MapPinIcon,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { cn } from '@/lib/utils';
import { getCityStyle } from '@/lib/city-colors';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity } from '@/lib/itinerary-data';
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
  onOpenLightbox?: (photos: string[], startIndex: number) => void;
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
    case 'Must Do': return <Sparkles size={12} />;
    case 'Optional': return <AlertCircle size={12} />;
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

  return (
    <div
      ref={ref}
      className={cn('activity-card-wrapper', isHighlighted && 'activity-card-highlighted')}
      style={cityStyle}
      onMouseEnter={() => onHover?.(activity.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {isLiveNow && <div className="live-time-indicator"></div>}

      <div
        className={cn('duration-bar', `type-${activity.type}`)}
        style={{ height: `${Math.max(60, activity.duration * 0.8)}px` }}
      ></div>

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
        {(activity.photos?.length || activity.imageUrl) && (
          <PhotoCarousel
            photos={activity.photos ?? (activity.imageUrl ? [activity.imageUrl] : [])}
            alt={activity.title}
            onPhotoClick={(photoIndex) => {
              const allPhotos = activity.photos ?? (activity.imageUrl ? [activity.imageUrl] : []);
              onOpenLightbox?.(allPhotos, photoIndex);
            }}
          />
        )}
        {activity.status && (
          <div className={cn('status-badge', `badge-${activity.status.replace(/\s+/g, '-').toLowerCase()}`)}>
            {getStatusBadgeIcon(activity.status)} {activity.status}
          </div>
        )}
        <CardContent className="timeline-card-inner">
          <div className="activity-info">
            <h4 className="activity-title">{activity.title}</h4>
            <div className="activity-duration">{activity.duration} minutes</div>
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
          </div>
          <div className="activity-actions">
            <div className="interaction-stats">
              <Button
                variant="ghost"
                size="sm"
                className="vote-btn"
                onClick={(e) => { e.stopPropagation(); onOpenSuggestions(); }}
                aria-label="AI Insights"
              >
                <Sparkles size={14} className="text-accent" style={{ marginRight: '4px' }} /> Insight
              </Button>
              <span><ThumbsUp size={14} aria-hidden="true" /> {activity.votes.up}</span>
              <span><MessageSquare size={14} aria-hidden="true" /> {activity.comments.length}</span>
            </div>
          </div>
        </CardContent>

        {/* Expansion Panel for Discussion */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="activity-discussion-panel"
            >
              <div className="expansion-actions" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Button size="sm" variant="ghost" className="vote-btn active" aria-label={`Upvote (${activity.votes.up})`}>
                  <ThumbsUp size={16} /> {activity.votes.up}
                </Button>
                <Button size="sm" variant="ghost" className="vote-btn" aria-label={`Downvote (${activity.votes.down})`}>
                  <ThumbsDown size={16} /> {activity.votes.down}
                </Button>
                <div style={{ flex: 1 }}></div>
                <Button size="sm" variant="secondary" icon={<Camera size={14} />} aria-label="Add photo">Add Photo</Button>
              </div>

              <div className="comments-section">
                {activity.comments.length > 0 ? (
                  <div className="comments-list">
                    {activity.comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <img src={comment.avatar} alt="" className="comment-avatar" width={28} height={28} />
                        <div className="comment-body">
                          <strong>{comment.user}</strong> <span className="comment-time">{comment.time}</span>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-comments">No comments yet. Start the discussion!</p>
                )}
                <div className="comment-input-area">
                  <img src="https://i.pravatar.cc/150?u=1" alt="You" className="comment-avatar" width={28} height={28} />
                  <input
                    type="text"
                    placeholder="Add a comment\u2026"
                    aria-label="Add a comment"
                    className="glass-input full-width-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button className="send-btn" onClick={(e) => e.stopPropagation()} aria-label="Send comment">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
});
ActivityCard.displayName = 'ActivityCard';
