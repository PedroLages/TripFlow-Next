"use client"

import React from 'react';
import { Plane, Hotel, Utensils, Camera, ShoppingBag, Train, Bus } from 'lucide-react';
import type { Activity } from '@/lib/itinerary-data';
import { PIN_SIZES } from '@/lib/map-tokens';
import { cn } from '@/lib/utils';

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
  const shadow = isSelected
    ? `0 0 0 3px white, 0 4px 16px ${color}88, 0 8px 24px rgba(0,0,0,0.25)`
    : isHovered
      ? `0 0 0 3px white, 0 0 12px ${color}66`
      : '0 2px 6px rgba(0,0,0,0.3)';

  return (
    <div
      className={cn(
        // Base styles
        "relative rounded-full border-[2.5px] border-white",
        "flex items-center justify-center text-white cursor-pointer",
        "opacity-85 transition-all duration-200 ease-out",
        // Hover state
        isHovered && "scale-115 opacity-100",
        // Selected state
        isSelected && "scale-130 -translate-y-1 opacity-100 brightness-115"
      )}
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
          className="absolute -inset-[2px] rounded-full border-2 pulse-ring pointer-events-none"
          style={{ borderColor: color }}
        />
      )}

      {getIcon(activity.type, 14)}

      {orderIndex != null && (
        <span
          className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-white text-[10px] font-bold flex items-center justify-center shadow-sm"
          style={{ color }}
        >
          {orderIndex}
        </span>
      )}
    </div>
  );
};
