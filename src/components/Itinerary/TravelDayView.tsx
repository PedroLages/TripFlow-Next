"use client"

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Plane, TrainFront, Clock, Luggage, MapPin, ArrowRight,
  CheckCircle2, Sparkles, AlertCircle,
  Hotel, Utensils, Camera, ShoppingBag, Globe,
} from 'lucide-react';
import { CITY_CONFIGS, getCityStyle, type CitySlug } from '@/lib/city-colors';
import type { Activity, LightboxSlide } from '@/lib/itinerary-data';
import { cn } from '@/lib/utils';
import './TravelDayView.css';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TravelDayViewProps {
  activities: Activity[];
  citySlug: CitySlug;
  dayLabel: string; // "Day 4 — Sat, Aug 30"
  onOpenLightbox?: (slides: LightboxSlide[], startIndex: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse a route string like "Flight Shanghai → Hong Kong" into parts. */
function parseRoute(title: string): { departing: string; arriving: string } | null {
  const arrowMatch = title.match(/(.+?)\s*[→➜\->]+\s*(.+)/);
  if (!arrowMatch) return null;

  const departing = arrowMatch[1].replace(/^(Flight|Train|Shinkansen|Bus|Ferry)\s+/i, '').trim();
  const arriving = arrowMatch[2].trim();

  return { departing, arriving };
}

/** Find the CitySlug that best matches a city name string. */
function findCitySlug(name: string): CitySlug | null {
  const lower = name.toLowerCase().replace(/\s+/g, '');
  for (const [slug, config] of Object.entries(CITY_CONFIGS)) {
    if (
      lower === slug ||
      lower === config.name.toLowerCase().replace(/\s+/g, '') ||
      config.name.toLowerCase().includes(lower) ||
      lower.includes(slug)
    ) {
      return slug as CitySlug;
    }
  }
  if (lower === 'hongkong' || lower.includes('hong')) return 'hongkong';
  return null;
}

/** Get the icon component for an activity type. */
function getSmallIcon(type: Activity['type']) {
  switch (type) {
    case 'flight': return <Plane size={16} />;
    case 'hotel': return <Hotel size={16} />;
    case 'food': return <Utensils size={16} />;
    case 'activity': return <Camera size={16} />;
    case 'shopping': return <ShoppingBag size={16} />;
    case 'transport': return <TrainFront size={16} />;
    default: return <MapPin size={16} />;
  }
}

/** Get a status badge element. */
function getStatusBadge(status?: string) {
  if (!status) return null;
  const icon = status === 'Booked'
    ? <CheckCircle2 size={12} />
    : status === 'Must Do'
      ? <Sparkles size={12} />
      : <AlertCircle size={12} />;
  return (
    <span className={cn('tdv-status-badge', `tdv-badge-${status.replace(/\s+/g, '-').toLowerCase()}`)}>
      {icon} {status}
    </span>
  );
}

/** Format duration in minutes to a readable string. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/** Determine if activity is a transport/flight type. */
function isTransportActivity(activity: Activity): boolean {
  return activity.type === 'flight' || activity.type === 'transport';
}

/** Compute approximate arrival time from departure time + duration. */
function computeArrivalTime(departureTime: string, durationMinutes: number): string {
  const match = departureTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const totalMinutes = hours * 60 + minutes + durationMinutes;
  let arrHours = Math.floor(totalMinutes / 60) % 24;
  const arrMinutes = totalMinutes % 60;

  const arrPeriod = arrHours >= 12 ? 'PM' : 'AM';
  if (arrHours > 12) arrHours -= 12;
  if (arrHours === 0) arrHours = 12;

  return `${arrHours}:${arrMinutes.toString().padStart(2, '0')} ${arrPeriod}`;
}

/** Detect if a departure time is early (before 9 AM). */
function isEarlyDeparture(time: string): boolean {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;
  const hours = parseInt(match[1], 10);
  const period = match[3].toUpperCase();
  return period === 'AM' && hours < 9 && hours !== 12;
}

// ---------------------------------------------------------------------------
// Timezone data for contextual tips
// ---------------------------------------------------------------------------

const TIMEZONE_INFO: Record<CitySlug, { abbr: string; utcOffset: number }> = {
  shanghai: { abbr: 'CST', utcOffset: 8 },
  hongkong: { abbr: 'HKT', utcOffset: 8 },
  osaka: { abbr: 'JST', utcOffset: 9 },
  kyoto: { abbr: 'JST', utcOffset: 9 },
  tokyo: { abbr: 'JST', utcOffset: 9 },
  beijing: { abbr: 'CST', utcOffset: 8 },
};

function getTimezoneHint(fromSlug: CitySlug | null, toSlug: CitySlug | null): string | null {
  if (!fromSlug || !toSlug) return null;
  const from = TIMEZONE_INFO[fromSlug];
  const to = TIMEZONE_INFO[toSlug];
  if (!from || !to) return null;
  const diff = to.utcOffset - from.utcOffset;
  if (diff === 0) return null;
  const sign = diff > 0 ? '+' : '';
  return `You'll arrive in ${to.abbr} (${sign}${diff}h from ${from.abbr})`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TravelDayView: React.FC<TravelDayViewProps> = ({
  activities,
  citySlug,
  dayLabel,
  onOpenLightbox,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Separate transport and non-transport activities
  const { transportActivity, afterArrivalActivities, route, departingSlug, arrivingSlug } = useMemo(() => {
    const transport = activities.find(isTransportActivity) ?? null;
    const afterArrival = activities.filter(a => !isTransportActivity(a));

    let routeInfo: ReturnType<typeof parseRoute> = null;
    let depSlug: CitySlug | null = null;
    let arrSlug: CitySlug | null = null;

    if (transport) {
      routeInfo = parseRoute(transport.title);
      if (routeInfo) {
        depSlug = findCitySlug(routeInfo.departing);
        arrSlug = findCitySlug(routeInfo.arriving);
      }
    }

    return {
      transportActivity: transport,
      afterArrivalActivities: afterArrival,
      route: routeInfo,
      departingSlug: depSlug,
      arrivingSlug: arrSlug,
    };
  }, [activities]);

  // City configs for departing/arriving
  const departingConfig = departingSlug ? CITY_CONFIGS[departingSlug] : null;
  const arrivingConfig = arrivingSlug ? CITY_CONFIGS[arrivingSlug] : null;
  const DepartingIcon = departingConfig?.icon ?? MapPin;
  const ArrivingIcon = arrivingConfig?.icon ?? MapPin;

  // Transport icon
  const isFlightType = transportActivity?.type === 'flight';
  const TransportIcon = isFlightType ? Plane : TrainFront;

  // Computed values
  const arrivalTime = transportActivity
    ? computeArrivalTime(transportActivity.time, transportActivity.duration)
    : '';
  const durationLabel = transportActivity ? formatDuration(transportActivity.duration) : '';
  const timezoneHint = getTimezoneHint(departingSlug, arrivingSlug);
  const showPackReminder = transportActivity && isEarlyDeparture(transportActivity.time);

  // Gradient CSS variables
  const gradientStyle = useMemo(() => {
    const depColor = departingSlug ? `var(--city-${departingSlug})` : 'var(--accent-primary)';
    const arrColor = arrivingSlug ? `var(--city-${arrivingSlug})` : 'var(--accent-secondary)';
    return {
      '--tdv-departing-color': depColor,
      '--tdv-arriving-color': arrColor,
    } as React.CSSProperties;
  }, [departingSlug, arrivingSlug]);

  return (
    <div className="tdv-container" style={{ ...getCityStyle(citySlug), ...gradientStyle }}>

      {/* Contextual Tips */}
      {(showPackReminder || timezoneHint) && (
        <motion.div
          className="tdv-tips"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {showPackReminder && (
            <div className="tdv-tip">
              <Luggage size={16} />
              <span>Pack your bags tonight &mdash; early departure tomorrow!</span>
            </div>
          )}
          {timezoneHint && (
            <div className="tdv-tip">
              <Globe size={16} />
              <span>{timezoneHint}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Large Transport Card */}
      {transportActivity && (
        <motion.div
          className="tdv-transport-card"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Gradient Background */}
          <div className="tdv-transport-gradient" />

          {/* Status Badge */}
          {transportActivity.status && (
            <div className="tdv-transport-status">
              {getStatusBadge(transportActivity.status)}
            </div>
          )}

          {/* Transport Icon */}
          <div className="tdv-transport-icon-wrap">
            <TransportIcon size={48} className="tdv-transport-icon" />
          </div>

          {/* City Transition Visual */}
          <div className="tdv-city-transition">
            {/* Departing City */}
            <div className="tdv-city-endpoint tdv-city-departing">
              <div className="tdv-city-icon-circle tdv-departing-circle">
                <DepartingIcon size={20} />
              </div>
              <span className="tdv-city-name">
                {route?.departing ?? 'Origin'}
              </span>
            </div>

            {/* Animated Path */}
            <div className="tdv-route-path">
              <div className="tdv-route-line" />
              <div className="tdv-route-dots">
                <span className="tdv-dot tdv-dot-1" />
                <span className="tdv-dot tdv-dot-2" />
                <span className="tdv-dot tdv-dot-3" />
              </div>
              <ArrowRight size={20} className="tdv-route-arrow" />
            </div>

            {/* Arriving City */}
            <div className="tdv-city-endpoint tdv-city-arriving">
              <div className="tdv-city-icon-circle tdv-arriving-circle">
                <ArrivingIcon size={20} />
              </div>
              <span className="tdv-city-name">
                {route?.arriving ?? 'Destination'}
              </span>
            </div>
          </div>

          {/* Time Details */}
          <div className="tdv-time-details">
            <div className="tdv-time-block">
              <span className="tdv-time-label">Departs</span>
              <span className="tdv-time-value">{transportActivity.time}</span>
            </div>
            <div className="tdv-duration-block">
              <Clock size={14} />
              <span className="tdv-duration-value">{durationLabel}</span>
            </div>
            <div className="tdv-time-block">
              <span className="tdv-time-label">Arrives</span>
              <span className="tdv-time-value">{arrivalTime || '--:--'}</span>
            </div>
          </div>

          {/* Transport Label */}
          <div className="tdv-transport-label">
            {isFlightType ? 'Flight' : transportActivity.title.split(/\s/)[0]}
          </div>
        </motion.div>
      )}

      {/* After Arrival Section */}
      {afterArrivalActivities.length > 0 && (
        <motion.div
          className="tdv-after-arrival"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 className="tdv-section-title">
            <MapPin size={16} />
            After arrival
          </h3>
          <div className="tdv-activity-list">
            {afterArrivalActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="tdv-mini-card"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.35 }}
              >
                <div className="tdv-mini-card-icon">
                  {getSmallIcon(activity.type)}
                </div>
                <div className="tdv-mini-card-content">
                  <span className="tdv-mini-card-time">{activity.time}</span>
                  <span className="tdv-mini-card-title">{activity.title}</span>
                </div>
                {activity.status && (
                  <div className="tdv-mini-card-status">
                    {getStatusBadge(activity.status)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state: transport-only day */}
      {afterArrivalActivities.length === 0 && transportActivity && (
        <motion.div
          className="tdv-arrival-note"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <p>Arrive and settle in. Rest up for tomorrow&apos;s adventures!</p>
        </motion.div>
      )}
    </div>
  );
};
