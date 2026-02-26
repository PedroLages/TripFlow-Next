"use client"

import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { Button } from '../ui/ButtonLegacy';
import { getCityStyle } from '@/lib/city-colors';
import type { CitySlug } from '@/lib/city-colors';
import type { Activity } from '@/lib/itinerary-data';
import { ActivityCard } from './ActivityCard';
import { TransitConnector } from './TransitConnector';
import './DayTimeline.css';

interface DayTimelineProps {
  activities: Activity[];
  citySlug: CitySlug;
  dayLabel: string;
  onReorder: (newOrder: Activity[]) => void;
  onAutoFill: () => void;
  onOpenSuggestions: () => void;
  onAddActivity: () => void;
  onOpenLightbox?: (photos: string[], startIndex: number) => void;
  isGenerating: boolean;
  expandedActivity: string | null;
  onToggleExpand: (id: string | null) => void;
  hoveredActivityId?: string | null;
  selectedPinId?: string | null;
  onActivityHover?: (activityId: string | null) => void;
  activityRefs?: React.MutableRefObject<Map<string, HTMLElement>>;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  activities,
  citySlug,
  dayLabel,
  onReorder,
  onAutoFill,
  onOpenSuggestions,
  onAddActivity,
  onOpenLightbox,
  isGenerating,
  expandedActivity,
  onToggleExpand,
  hoveredActivityId,
  selectedPinId,
  onActivityHover,
  activityRefs,
}) => {
  const cityStyle = getCityStyle(citySlug);

  return (
    <div className="timeline-container" style={cityStyle}>
      <div className="timeline-line"></div>

      <Reorder.Group
        axis="y"
        values={activities}
        onReorder={onReorder}
        className="reorder-timeline"
      >
        {activities.map((activity, index) => {
          const isExpanded = expandedActivity === activity.id;
          const isLiveNow = index === 1 && activities.length > 1;

          return (
            <Reorder.Item
              key={activity.id}
              value={activity}
              className="timeline-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <ActivityCard
                activity={activity}
                citySlug={citySlug}
                isExpanded={isExpanded}
                isLiveNow={isLiveNow}
                isHighlighted={selectedPinId === activity.id || hoveredActivityId === activity.id}
                onToggleExpand={() => onToggleExpand(isExpanded ? null : activity.id)}
                onOpenSuggestions={onOpenSuggestions}
                onOpenLightbox={onOpenLightbox}
                onHover={onActivityHover}
                ref={(el) => {
                  if (el && activityRefs?.current) activityRefs.current.set(activity.id, el);
                }}
                index={index}
              />

              {activity.transitToNext && (
                <TransitConnector
                  method={activity.transitToNext.method}
                  duration={activity.transitToNext.duration}
                  onAddActivity={onAddActivity}
                />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {isGenerating ? (
        <div className="generating-day-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="magic-wand-spinner"
          >
            <Sparkles size={48} color="var(--accent-primary)" aria-hidden="true" />
          </motion.div>
          <h3 className="gradient-text">AI is crafting your perfect sequence\u2026</h3>
          <p className="text-secondary">Analyzing local transit times and crowd patterns.</p>

          <div className="skeleton-timeline">
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card half"></div></div>
            <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="empty-day-state">
          <div className="empty-icon"><Compass size={48} aria-hidden="true" /></div>
          <h3>Nothing planned yet</h3>
          <p>Use AI to quickly build a smart itinerary for this day, or add locations manually.</p>
          <Button
            className="mt-4 magic-wand-btn"
            size="md"
            icon={<Sparkles size={16} />}
            onClick={onAutoFill}
          >
            Auto-fill {dayLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
