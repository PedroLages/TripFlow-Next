"use client"

import React from 'react';
import { Footprints, TrainFront, Ship, Car, Navigation, Plus } from 'lucide-react';
import './TransitConnector.css';

interface TransitConnectorProps {
  method: 'walk' | 'train' | 'car' | 'metro' | 'ferry';
  duration: number;
  onAddActivity?: () => void;
}

function getTransitIcon(method: TransitConnectorProps['method']) {
  switch (method) {
    case 'walk': return <Footprints size={14} />;
    case 'train': return <TrainFront size={14} />;
    case 'metro': return <TrainFront size={14} />;
    case 'ferry': return <Ship size={14} />;
    case 'car': return <Car size={14} />;
    default:
      return <Navigation size={14} />;
  }
}

export const TransitConnector: React.FC<TransitConnectorProps> = ({
  method,
  duration,
  onAddActivity,
}) => {
  return (
    <div className={`transit-connector transit-method-${method}`}>
      <div className="transit-line"></div>
      <div className="transit-pill">
        {getTransitIcon(method)}
        <span>{duration} min {method}</span>
      </div>
      <button
        className="inline-add-btn"
        aria-label="Add activity here"
        onClick={(e) => {
          e.stopPropagation();
          onAddActivity?.();
        }}
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  );
};
