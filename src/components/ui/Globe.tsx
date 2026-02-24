"use client"

import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

interface GlobeProps {
  className?: string;
  size?: number;
}

export const Globe: React.FC<GlobeProps> = ({ className, size = 1000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.15,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.2 : 0.8,
      mapSamples: isDark ? 16000 : 12000,
      mapBrightness: isDark ? 6 : 4,
      baseColor: isDark ? [0.1, 0.1, 0.12] : [0.8, 0.85, 0.9],
      markerColor: [0.15, 0.4, 0.9],
      glowColor: isDark ? [0.1, 0.1, 0.15] : [0.9, 0.95, 1],
      markers: [
        { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
        { location: [40.6333, 14.6029], size: 0.08 },  // Amalfi
        { location: [-8.4095, 115.1889], size: 0.06 }, // Bali
        { location: [40.7128, -74.0060], size: 0.05 }, // NY
        { location: [48.8566, 2.3522], size: 0.05 },   // Paris
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.001;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [size, isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: 1
      }}
      className={className}
    />
  );
};
