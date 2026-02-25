"use client"

import React from 'react';
import { Footprints, Train, Ship, Map, Plus } from 'lucide-react';
import './TransitConnector.css';

interface TransitConnectorProps {
  method: 'walk' | 'train' | 'car' | 'metro' | 'ferry';
  duration: number;
  onAddActivity?: () => void;
}

function getTransitIcon(method: TransitConnectorProps['method']) {
  switch (method) {
    case 'walk': return <Footprints size={14} />;
    case 'train': return <Train size={14} />;
    case 'metro': return <Train size={14} />;
    case 'ferry': return <Ship size={14} />;
    case 'car':
    default:
      return <Map size={14} />;
  }
}

export const TransitConnector: React.FC<TransitConnectorProps> = ({
  method,
  duration,
  onAddActivity,
}) => {
  return (
    <div className="transit-connector">
      <div className="transit-line"></div>
      <div className="transit-pill">
        {getTransitIcon(method)}
        <span>{duration}m {method}</span>
      </div>
      <div
        className="inline-add-btn"
        title="Add activity here"
        onClick={(e) => {
          e.stopPropagation();
          onAddActivity?.();
        }}
      >
        <Plus size={14} strokeWidth={3} />
      </div>
    </div>
  );
};
