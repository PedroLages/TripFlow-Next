"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CITY_CONFIGS, type CitySlug, getCityStyle } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { Sparkles, Plus, Clock, Plane, Hotel, Utensils, Camera, ShoppingBag, Train, CheckCircle2, Cloud, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import './DaySummary.css';

interface DaySummaryProps {
  day: ItineraryDay;
  citySlug: CitySlug;
  onAutoFill: () => void;
  onAddActivity: () => void;
  isGenerating: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  flight: <Plane size={14} />,
  hotel: <Hotel size={14} />,
  food: <Utensils size={14} />,
  activity: <Camera size={14} />,
  shopping: <ShoppingBag size={14} />,
  transport: <Train size={14} />,
};

const weatherData: Record<CitySlug, { temp: string; condition: string; icon: React.ReactNode }> = {
  shanghai: { temp: '32°C', condition: 'Hot & Humid', icon: <Sun size={18} /> },
  hongkong: { temp: '31°C', condition: 'Tropical', icon: <Cloud size={18} /> },
  osaka: { temp: '29°C', condition: 'Warm', icon: <Sun size={18} /> },
  kyoto: { temp: '28°C', condition: 'Pleasant', icon: <Sun size={18} /> },
  tokyo: { temp: '27°C', condition: 'Clear Skies', icon: <Sun size={18} /> },
  beijing: { temp: '26°C', condition: 'Dry & Clear', icon: <Sun size={18} /> },
};

export default function DaySummary({
  day,
  citySlug,
  onAutoFill,
  onAddActivity,
  isGenerating,
}: DaySummaryProps) {
  const activities = day.activities ?? [];

  const totalActivities = activities.length;
  const totalHours = Math.round(
    activities.reduce((sum, a) => sum + a.duration, 0) / 60
  );
  const transitMinutes = activities.reduce(
    (sum, a) => sum + (a.transitToNext?.duration || 0),
    0
  );
  const bookedCount = activities.filter((a) => a.status === 'Booked').length;

  const typeCounts: Record<string, number> = {};
  for (const a of activities) {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  }

  const config = CITY_CONFIGS[citySlug];
  const Icon = config.icon;
  const weather = weatherData[citySlug];

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={day.dayIndex}
        className="day-summary"
        style={getCityStyle(citySlug)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* City Hero Header */}
        <div className="day-summary-hero">
          <div className="day-summary-hero-bg" />
          <div className="day-summary-hero-content">
            <Icon size={28} aria-hidden="true" />
            <div>
              <h3 className="day-summary-city">{config.name}</h3>
              <p className="day-summary-date">{day.fullDate}</p>
            </div>
          </div>
        </div>

        {/* Day Stats */}
        <div className="day-summary-stats">
          <div className="day-stat">
            <span className="day-stat-value">{totalActivities}</span>
            <span className="day-stat-label">Activities</span>
          </div>
          <div className="day-stat">
            <span className="day-stat-value">{totalHours}h</span>
            <span className="day-stat-label">Planned</span>
          </div>
          <div className="day-stat">
            <span className="day-stat-value">{transitMinutes}m</span>
            <span className="day-stat-label">Transit</span>
          </div>
          <div className="day-stat">
            <span className="day-stat-value">{bookedCount}</span>
            <span className="day-stat-label">Booked</span>
          </div>
        </div>

        {/* Activity Type Breakdown */}
        {totalActivities > 0 && (
          <div className="day-summary-breakdown">
            <h4 className="day-summary-section-title">Activity Types</h4>
            <div className="type-breakdown-grid">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="type-breakdown-item">
                  {typeIcons[type]}
                  <span className="type-count">{count}</span>
                  <span className="type-label">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Hint */}
        <div className="day-summary-weather">
          {weather.icon}
          <span className="weather-temp">{weather.temp}</span>
          <span className="weather-condition">{weather.condition}</span>
        </div>

        {/* Quick Actions */}
        <div className="day-summary-actions">
          <Button
            fullWidth
            variant="secondary"
            icon={<Sparkles size={16} />}
            onClick={onAutoFill}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'AI Auto-fill Day'}
          </Button>
          <Button
            fullWidth
            icon={<Plus size={16} />}
            onClick={onAddActivity}
          >
            Add Activity
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
