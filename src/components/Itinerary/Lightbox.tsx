"use client"

import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Lightbox.css';

interface LightboxProps {
  isOpen: boolean;
  photos: string[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  photos,
  initialIndex,
  onClose,
  onIndexChange,
}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    if (initialIndex > 0) onIndexChange(initialIndex - 1);
  }, [initialIndex, onIndexChange]);

  const goNext = useCallback(() => {
    if (initialIndex < photos.length - 1) onIndexChange(initialIndex + 1);
  }, [initialIndex, photos.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowLeft': goPrev(); break;
        case 'ArrowRight': goNext(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, goPrev, goNext]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      containerRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;
    const preload = (idx: number) => {
      if (idx >= 0 && idx < photos.length) {
        const img = new Image();
        img.src = photos[idx];
      }
    };
    preload(initialIndex - 1);
    preload(initialIndex + 1);
  }, [isOpen, initialIndex, photos]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          ref={containerRef}
          tabIndex={-1}
        >
          <motion.img
            key={initialIndex}
            className="lightbox-image"
            src={photos[initialIndex]}
            alt={`Photo ${initialIndex + 1} of ${photos.length}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Close button */}
          <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
            <X size={24} />
          </button>

          {/* Navigation */}
          {initialIndex > 0 && (
            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          {initialIndex < photos.length - 1 && (
            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Counter */}
          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {initialIndex + 1} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
