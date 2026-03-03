"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import type { LightboxSlide } from '@/lib/itinerary-data';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import './lightbox-overrides.css';

const YARLLightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

interface LightboxProps {
  isOpen: boolean;
  slides: LightboxSlide[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  slides,
  initialIndex,
  onClose,
  onIndexChange,
}) => {
  if (!isOpen) return null;

  return (
    <YARLLightbox
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides.map(s => ({
        src: s.src,
        title: s.title,
      }))}
      on={{ view: ({ index }: { index: number }) => onIndexChange(index) }}
      plugins={[Zoom, Thumbnails, Captions]}
      carousel={{ finite: true }}
      zoom={{ maxZoomPixelRatio: 3 }}
      thumbnails={{ position: 'bottom', width: 80, height: 60 }}
      captions={{ showToggle: true, descriptionTextAlign: 'center' }}
      animation={{ fade: 250 }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
};
