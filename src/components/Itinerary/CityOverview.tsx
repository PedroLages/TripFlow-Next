"use client"

import React from 'react';
import type { CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';

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
  return (
    <div className="city-overview">
      <p>City Overview for {citySlug} — coming soon</p>
    </div>
  );
};
