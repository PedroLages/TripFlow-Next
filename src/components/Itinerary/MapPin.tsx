"use client"

import React from 'react';
import { Plane, Hotel, Utensils, Camera, ShoppingBag, Train } from 'lucide-react';
import type { Activity } from '@/lib/itinerary-data';

interface MapPinProps {
  activity: Activity;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function getSmallIcon(type: Activity['type']) {
  const size = 14;
  switch (type) {
    case 'flight': return <Plane size={size} />;
    case 'hotel': return <Hotel size={size} />;
    case 'food': return <Utensils size={size} />;
    case 'activity': return <Camera size={size} />;
    case 'shopping': return <ShoppingBag size={size} />;
    case 'transport': return <Train size={size} />;
    default: return <Camera size={size} />;
  }
}

export const MapPin: React.FC<MapPinProps> = ({
  activity,
  color,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
  const shadow = isSelected || isHovered
    ? `0 0 12px ${color}66`
    : '0 2px 6px rgba(0,0,0,0.3)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: color,
        border: '2.5px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        transform: `scale(${scale}) translateY(${isSelected ? '-4px' : '0'})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: shadow,
      }}
      role="button"
      aria-label={`${activity.title} — ${activity.type}`}
    >
      {getSmallIcon(activity.type)}
    </div>
  );
};
