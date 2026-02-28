"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import {
  Search, Plane, Hotel, Utensils, Camera, MapPin, ShoppingBag, Ship,
} from 'lucide-react';
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors';
import type { ItineraryDay, Activity } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import './ActivitySearch.css';

interface ActivitySearchProps {
  isOpen: boolean;
  onClose: () => void;
  allDays: ItineraryDay[];
  onNavigate: (city: CitySlug, dayIndex: number, activityId: string) => void;
}

interface SearchResult {
  activity: Activity;
  day: ItineraryDay;
  citySlug: CitySlug;
  cityName: string;
}

function getTypeIcon(type: Activity['type']) {
  switch (type) {
    case 'flight': return <Plane size={14} />;
    case 'hotel': return <Hotel size={14} />;
    case 'food': return <Utensils size={14} />;
    case 'activity': return <Camera size={14} />;
    case 'shopping': return <ShoppingBag size={14} />;
    case 'transport': return <Ship size={14} />;
    default: return <MapPin size={14} />;
  }
}

export const ActivitySearch: React.FC<ActivitySearchProps> = ({
  isOpen,
  onClose,
  allDays,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search logic
  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matches: SearchResult[] = [];

    for (const day of allDays) {
      const citySlug = day.city;
      const cityName = CITY_CONFIGS[citySlug].name;

      for (const activity of day.activities) {
        const searchable = [
          activity.title,
          activity.type,
          activity.status ?? '',
          cityName,
          day.date,
          day.fullDate,
          activity.place?.placeCategory ?? '',
          activity.place?.address ?? '',
        ].join(' ').toLowerCase();

        if (searchable.includes(q)) {
          matches.push({ activity, day, citySlug, cityName });
        }
      }
    }

    return matches.slice(0, 20);
  }, [query, allDays]);

  // Group by city
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.citySlug]) groups[r.citySlug] = [];
      groups[r.citySlug].push(r);
    }
    return groups;
  }, [results]);

  // Flat results for keyboard nav
  const flatResults = results;

  const handleSelect = useCallback((result: SearchResult) => {
    onNavigate(result.citySlug, result.day.dayIndex, result.activity.id);
    onClose();
  }, [onNavigate, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatResults[selectedIndex]);
    }
  };

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  let flatIndex = -1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="as-dialog" showCloseButton={false}>
        <DialogTitle className="sr-only">Search activities</DialogTitle>

        <div className="as-search-header">
          <Search size={18} className="as-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="as-search-input"
            placeholder="Search activities, cities, dates..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            aria-label="Search activities"
          />
          <kbd className="as-kbd">esc</kbd>
        </div>

        <div className="as-results" ref={listRef} role="listbox">
          {query.length === 0 && (
            <div className="as-empty">
              Type to search activities across all cities
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="as-empty">
              No activities match &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(grouped).map(([citySlug, cityResults]) => {
            const config = CITY_CONFIGS[citySlug as CitySlug];
            const CityIcon = config.icon;

            return (
              <div key={citySlug} className="as-city-group">
                <div className="as-city-header">
                  <CityIcon size={14} />
                  <span>{config.name}</span>
                </div>
                {cityResults.map(result => {
                  flatIndex++;
                  const isSelected = flatIndex === selectedIndex;
                  const currentIndex = flatIndex;

                  return (
                    <button
                      key={result.activity.id}
                      className={cn('as-result-item', isSelected && 'as-result-selected')}
                      data-selected={isSelected}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <span className="as-result-icon">{getTypeIcon(result.activity.type)}</span>
                      <span className="as-result-info">
                        <span className="as-result-title">{result.activity.title}</span>
                        <span className="as-result-meta">
                          Day {result.day.dayIndex + 1} &middot; {result.day.date} &middot; {result.activity.time}
                        </span>
                      </span>
                      {result.activity.status && (
                        <span className={cn(
                          'as-result-status',
                          `as-status-${result.activity.status.toLowerCase().replace(/\s+/g, '-')}`
                        )}>
                          {result.activity.status}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
