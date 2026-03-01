"use client";
import React from 'react';
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay } from '@/lib/itinerary-data';
import { CloudSun, Sun, CloudRain } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Use same mock weather function for consistency
function getMockWeather(dayIndex: number) {
  const conditions = [
    { icon: <Sun size={14} className="text-orange-500" />, text: 'Sunny', temp: 31 },
    { icon: <CloudSun size={14} className="text-yellow-500" />, text: 'Partly Cloudy', temp: 28 },
    { icon: <CloudRain size={14} className="text-blue-500" />, text: 'Light Rain', temp: 24 }
  ];
  return conditions[dayIndex % conditions.length];
}

interface DayNavigatorProps {
  days: ItineraryDay[];
  activeDay: number;
  onDayChange: (dayIndex: number) => void;
  citySlug: CitySlug;
}

export default function DayNavigator({
  days,
  activeDay,
  onDayChange,
  citySlug,
}: DayNavigatorProps) {
  const config = CITY_CONFIGS[citySlug];
  const CityIcon = config.icon;

  return (
    <div className="day-navigator-dropdown py-3 px-4 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <Select
        value={activeDay.toString()}
        onValueChange={(v) => onDayChange(Number(v))}
      >
        <SelectTrigger
          className="w-full sm:w-[320px] h-14 bg-card/50 backdrop-blur-md border border-border/50 rounded-xl shadow-sm focus:ring-1 transition-all"
          style={{ '--tw-ring-color': `var(${config.glowVar})` } as React.CSSProperties}
        >
          {activeDay === -1 ? (
            <div className="flex items-center gap-3 font-medium text-base">
              <CityIcon size={18} className="text-muted-foreground" />
              <span>{config.name} Overview</span>
            </div>
          ) : (() => {
            const currentDay = days.find(d => d.dayIndex === activeDay);
            if (!currentDay) return <SelectValue placeholder="Select Day" />;
            const weather = getMockWeather(currentDay.dayIndex);
            const globalDayNum = currentDay.dayIndex + 1;
            const currentLocalIndex = days.findIndex(d => d.dayIndex === activeDay);

            return (
              <div className="flex items-center justify-between w-full pr-2 overflow-hidden gap-2">
                <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2 text-left min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <span className="font-semibold text-sm whitespace-nowrap">
                      Day {globalDayNum}
                    </span>
                    <span className="text-muted-foreground font-normal text-sm truncate">
                      &bull; {config.name} {currentLocalIndex + 1}/{days.length}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden lg:block">
                    &bull; {currentDay.date}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap lg:hidden">
                    {currentDay.date}
                  </span>
                </div>
                <div className="flex items-center shrink-0 gap-1.5 text-xs font-medium text-muted-foreground bg-background/50 border border-border/40 px-2 py-1 rounded-full shadow-sm">
                  {weather.icon}
                  <span>{weather.temp}°</span>
                </div>
              </div>
            );
          })()}
        </SelectTrigger>
        <SelectContent className="max-h-[350px] bg-card/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl">
          <SelectItem value="-1" className="py-3 px-4 focus:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 font-medium">
              <CityIcon size={16} className="text-muted-foreground" />
              <span>{config.name} Overview</span>
            </div>
          </SelectItem>
          {days.map((day, localIndex) => {
            const weather = getMockWeather(day.dayIndex);
            // global day index starts at 1
            const globalDayNum = day.dayIndex + 1;

            return (
              <SelectItem
                key={day.dayIndex}
                value={day.dayIndex.toString()}
                className="py-3 px-4 focus:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between w-full sm:w-[280px]">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold text-sm">
                      Day {globalDayNum} &bull; <span className="text-muted-foreground font-normal">{config.name} {localIndex + 1}/{days.length}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-4 px-2.5 py-1 rounded-full bg-background/50 border border-border/40 shadow-sm">
                    {weather.icon}
                    <span>{weather.temp}°</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground ml-2 sm:ml-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(${config.cssVar})` }} />
        <span>Jump to any day in {config.name}</span>
      </div>
    </div>
  );
}
