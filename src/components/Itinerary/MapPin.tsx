"use client"

import React from 'react';
import { Plane, Hotel, Utensils, Camera, ShoppingBag, Train, Bus } from 'lucide-react';
import type { Activity } from '@/lib/itinerary-data';
import { PIN_SIZES } from '@/lib/map-tokens';
import styles from './MapPin.module.css';

interface MapPinProps {
  activity: Activity;
  color: string;
  /** Visit order number within the day (1, 2, 3...) */
  orderIndex?: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function getIcon(type: Activity['type'], size: number) {
  switch (type) {
    case 'flight':    return <Plane size={size} />;
    case 'hotel':     return <Hotel size={size} />;
    case 'food':      return <Utensils size={size} />;
    case 'activity':  return <Camera size={size} />;
    case 'shopping':  return <ShoppingBag size={size} />;
    case 'transport': return <Train size={size} />;
    default:          return <Camera size={size} />;
  }
}

export const MapPin: React.FC<MapPinProps> = ({
  activity,
  color,
  orderIndex,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const className = [
    styles.pin,
    isHovered && styles.hovered,
    isSelected && styles.selected,
  ].filter(Boolean).join(' ');

  const shadow = isSelected
    ? `0 0 0 3px white, 0 4px 16px ${color}88, 0 8px 24px rgba(0,0,0,0.25)`
    : isHovered
      ? `0 0 0 3px white, 0 0 12px ${color}66`
      : '0 2px 6px rgba(0,0,0,0.3)';

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: PIN_SIZES.default,
        height: PIN_SIZES.default,
        background: color,
        boxShadow: shadow,
      }}
      role="button"
      aria-label={`${orderIndex ? `Stop ${orderIndex}: ` : ''}${activity.title} — ${activity.type}`}
    >
      {/* Pulsing ring on hover */}
      {isHovered && (
        <span
          className={styles.pulseRing}
          style={{ '--ring-color': color } as React.CSSProperties}
        />
      )}

      {getIcon(activity.type, 14)}

      {orderIndex != null && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            color: color,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {orderIndex}
        </span>
      )}
    </div>
  );
};
