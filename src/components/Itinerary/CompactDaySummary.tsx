"use client"

import React from 'react';
import { Sparkles, Plus, Sun, Cloud } from 'lucide-react';
import { type CitySlug, getCityStyle } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import './CompactDaySummary.css';

interface CompactDaySummaryProps {
  day: ItineraryDay;
  citySlug: CitySlug;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

const weatherData: Record<CitySlug, { temp: string; icon: React.ReactNode }> = {
  shanghai: { temp: '32°C', icon: <Sun size={14} /> },
  hongkong: { temp: '31°C', icon: <Cloud size={14} /> },
  osaka: { temp: '29°C', icon: <Sun size={14} /> },
  kyoto: { temp: '28°C', icon: <Sun size={14} /> },
  tokyo: { temp: '27°C', icon: <Sun size={14} /> },
  beijing: { temp: '26°C', icon: <Sun size={14} /> },
};

export const CompactDaySummary: React.FC<CompactDaySummaryProps> = ({
  day,
  citySlug,
  onAutoFill,
  onAddActivity,
  isGenerating,
}) => {
  const activities = day.activities ?? [];
  const totalActivities = activities.length;
  const totalHours = Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / 60);
  const transitMinutes = activities.reduce((sum, a) => sum + (a.transitToNext?.duration || 0), 0);
  const bookedCount = activities.filter(a => a.status === 'Booked').length;
  const weather = weatherData[citySlug];

  return (
    <div className="compact-day-summary" style={getCityStyle(citySlug)}>
      <div className="compact-stats-row">
        <span className="compact-stat"><strong>{totalActivities}</strong> activities</span>
        <span className="compact-stat"><strong>{totalHours}h</strong> planned</span>
        <span className="compact-stat"><strong>{transitMinutes}m</strong> transit</span>
        <span className="compact-stat"><strong>{bookedCount}</strong> booked</span>
        <span className="compact-stat compact-weather">{weather.icon} {weather.temp}</span>
      </div>

      {/* Floating action cluster - positioned by CSS */}
      <div className="compact-actions">
        <button
          className="compact-action-btn"
          onClick={onAutoFill}
          disabled={isGenerating}
          aria-label="AI Auto-fill day"
        >
          <Sparkles size={16} />
        </button>
        <button
          className="compact-action-btn"
          onClick={onAddActivity}
          aria-label="Add activity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
