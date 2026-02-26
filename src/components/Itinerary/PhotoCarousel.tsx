"use client"

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlurDataURL } from '@/lib/blur-data';
import './PhotoCarousel.css';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  onPhotoClick: (index: number) => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, alt, onPhotoClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (photos.length === 0) return null;

  // Single photo — no carousel UI needed
  if (photos.length === 1) {
    const blur = getBlurDataURL(photos[0]);
    return (
      <div
        className="photo-carousel-single"
        onClick={(e) => { e.stopPropagation(); onPhotoClick(0); }}
        role="button"
        aria-label={`${alt} — click to view photo`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPhotoClick(0); }
        }}
      >
        <Image
          src={photos[0]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ objectFit: 'cover' }}
          {...(blur ? { placeholder: 'blur', blurDataURL: blur } : {})}
        />
      </div>
    );
  }

  return (
    <div className="photo-carousel" onClick={(e) => e.stopPropagation()}>
      <div className="photo-carousel-viewport" ref={emblaRef}>
        <div className="photo-carousel-container">
          {photos.map((photo, i) => {
            const blur = getBlurDataURL(photo);
            return (
              <div
                key={i}
                className="photo-carousel-slide"
                role="button"
                aria-label={`${alt} — photo ${i + 1} of ${photos.length}`}
                tabIndex={0}
                onClick={() => onPhotoClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPhotoClick(i); }
                }}
              >
                <Image
                  src={photo}
                  alt={`${alt} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{ objectFit: 'cover' }}
                  {...(blur ? { placeholder: 'blur', blurDataURL: blur } : {})}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Chevron buttons */}
      {canScrollPrev && (
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canScrollNext && (
        <button
          className="carousel-btn carousel-btn-next"
          onClick={() => emblaApi?.scrollNext()}
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
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
