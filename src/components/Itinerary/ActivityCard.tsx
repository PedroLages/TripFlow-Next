"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Hotel, Utensils, Camera, MapPin, Sparkles,
  ThumbsUp, ThumbsDown, MessageSquare, Send, ShoppingBag,
  CheckCircle2, AlertCircle, Ship,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { cn } from '@/lib/utils';
import { getCityStyle } from '@/lib/city-colors';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity } from '@/lib/itinerary-data';
import './ActivityCard.css';

interface ActivityCardProps {
  activity: Activity;
  citySlug: CitySlug;
  isExpanded: boolean;
  isLiveNow?: boolean;
  onToggleExpand: () => void;
  onOpenSuggestions: () => void;
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

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  citySlug,
  isExpanded,
  isLiveNow,
  onToggleExpand,
  onOpenSuggestions,
  index,
}) => {
  const cityStyle = getCityStyle(citySlug);

  return (
    <div className="activity-card-wrapper" style={cityStyle}>
      {isLiveNow && <div className="live-time-indicator"></div>}

      <div
        className={cn('duration-bar', `type-${activity.type}`)}
        style={{ height: `${Math.max(60, activity.duration * 0.8)}px` }}
      ></div>

      <div className="timeline-time">{activity.time}</div>

      <div className="timeline-node">
        <div className="node-icon">{getIconForType(activity.type)}</div>
      </div>

      <Card
        className={cn('timeline-content-card', isExpanded && 'expanded')}
        onClick={onToggleExpand}
      >
        {activity.imageUrl && (
          <div
            className="activity-card-image"
            style={{ backgroundImage: `url(${activity.imageUrl})` }}
          ></div>
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
          </div>
          <div className="activity-actions">
            <div className="interaction-stats">
              <Button
                variant="ghost"
                size="sm"
                className="vote-btn"
                onClick={(e) => { e.stopPropagation(); onOpenSuggestions(); }}
                title="AI Insights"
              >
                <Sparkles size={14} className="text-accent" style={{ marginRight: '4px' }} /> Insight
              </Button>
              <span><ThumbsUp size={14} /> {activity.votes.up}</span>
              <span><MessageSquare size={14} /> {activity.comments.length}</span>
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
                <Button size="sm" variant="ghost" className="vote-btn active">
                  <ThumbsUp size={16} /> {activity.votes.up}
                </Button>
                <Button size="sm" variant="ghost" className="vote-btn">
                  <ThumbsDown size={16} /> {activity.votes.down}
                </Button>
                <div style={{ flex: 1 }}></div>
                <Button size="sm" variant="secondary" icon={<Camera size={14} />}>Add Photo</Button>
              </div>

              <div className="comments-section">
                {activity.comments.length > 0 ? (
                  <div className="comments-list">
                    {activity.comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <img src={comment.avatar} alt="" className="comment-avatar" />
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
                  <img src="https://i.pravatar.cc/150?u=1" alt="You" className="comment-avatar" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="glass-input full-width-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button className="send-btn" onClick={(e) => e.stopPropagation()}>
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
};
