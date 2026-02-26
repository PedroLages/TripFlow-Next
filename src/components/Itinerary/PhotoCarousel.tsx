"use client"

import React, { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PhotoCarousel.css';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  onPhotoClick: (index: number) => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, alt, onPhotoClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(index);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(Math.min(newIndex, photos.length - 1));
  }, [photos.length]);

  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div
        className="photo-carousel-single"
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url(${photos[0]})` }}
        onClick={(e) => { e.stopPropagation(); onPhotoClick(0); }}
      />
    );
  }

  return (
    <div className="photo-carousel" onClick={(e) => e.stopPropagation()}>
      <div
        className="photo-carousel-track"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            className="photo-carousel-slide"
            role="img"
            aria-label={`${alt} — photo ${i + 1} of ${photos.length}`}
            style={{ backgroundImage: `url(${photo})` }}
            onClick={() => onPhotoClick(i)}
          />
        ))}
      </div>

      {/* Chevron buttons */}
      {activeIndex > 0 && (
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={() => scrollTo(activeIndex - 1)}
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {activeIndex < photos.length - 1 && (
        <button
          className="carousel-btn carousel-btn-next"
          onClick={() => scrollTo(activeIndex + 1)}
          aria-label="Next photo"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Dot indicators */}
      <div className="carousel-dots">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
