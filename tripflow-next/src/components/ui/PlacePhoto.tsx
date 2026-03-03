'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { Camera, Plane, Utensils, ShoppingBag, MapPin, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitySlug } from '@/lib/city-colors'
import './PlacePhoto.css'

export interface PlacePhotoAttribution {
  photographer: string
  photographerUrl?: string
  source: 'unsplash' | 'pexels' | 'google' | 'local' | 'user'
  sourceUrl?: string
}

type PlacePhotoSize = 'thumb' | 'card' | 'hero' | 'carousel'

const SIZE_CONFIG: Record<PlacePhotoSize, { width: number; height: number; aspectRatio: string; sizes: string }> = {
  thumb:    { width: 400,  height: 300,  aspectRatio: '4/3',  sizes: '170px' },
  card:     { width: 800,  height: 450,  aspectRatio: '16/9', sizes: '(max-width: 768px) 100vw, 600px' },
  hero:     { width: 1600, height: 900,  aspectRatio: '16/9', sizes: '100vw' },
  carousel: { width: 1200, height: 900,  aspectRatio: '4/3',  sizes: '(max-width: 768px) 100vw, 50vw' },
}

function getIconForType(type?: string) {
  const size = 28
  switch (type) {
    case 'flight': return <Plane size={size} />
    case 'hotel': return <Building size={size} />
    case 'food': return <Utensils size={size} />
    case 'shopping': return <ShoppingBag size={size} />
    default: return <MapPin size={size} />
  }
}

const SOURCE_LABELS: Record<string, string> = {
  unsplash: 'Unsplash',
  pexels: 'Pexels',
  google: 'Google',
}

interface PlacePhotoProps {
  src?: string
  alt: string
  citySlug?: CitySlug
  attribution?: PlacePhotoAttribution
  size?: PlacePhotoSize
  aspectRatio?: string
  showAttribution?: boolean
  onClick?: () => void
  priority?: boolean
  className?: string
  activityType?: string
  isLoading?: boolean
}

export function PlacePhoto({
  src,
  alt,
  citySlug,
  attribution,
  size = 'card',
  aspectRatio: customAspectRatio,
  showAttribution = true,
  onClick,
  priority = false,
  className,
  activityType,
  isLoading = false,
}: PlacePhotoProps) {
  const config = SIZE_CONFIG[size]
  const ratio = customAspectRatio || config.aspectRatio

  const [imgError, setImgError] = useState(false)
  const handleError = useCallback(() => setImgError(true), [])

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('place-photo', 'place-photo--loading', `place-photo--${size}`, className)}
        style={{ aspectRatio: ratio }}
        aria-label={`Loading photo of ${alt}`}
      >
        <div className="place-photo-shimmer" />
        <div className="place-photo-loading-icon">
          <Camera size={size === 'hero' ? 32 : size === 'thumb' ? 16 : 24} />
        </div>
      </div>
    )
  }

  // Fallback state
  if (!src || imgError) {
    return (
      <div
        className={cn('place-photo', 'place-photo--fallback', `place-photo--${size}`, className)}
        style={{ aspectRatio: ratio, '--city-color': citySlug ? `var(--city-${citySlug})` : undefined } as React.CSSProperties}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
        aria-label={alt}
      >
        <div className="place-photo-fallback-icon">
          {getIconForType(activityType)}
        </div>
        <span className="place-photo-fallback-label">{alt}</span>
      </div>
    )
  }

  // Photo state
  return (
    <div
      className={cn('place-photo', `place-photo--${size}`, className)}
      style={{ aspectRatio: ratio }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={config.width}
        height={config.height}
        sizes={config.sizes}
        priority={priority}
        className="place-photo-img"
        onError={handleError}
      />
      {showAttribution && attribution && (
        <div className="place-photo-attribution">
          <span>
            Photo by{' '}
            {attribution.photographerUrl ? (
              <a href={attribution.photographerUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                {attribution.photographer}
              </a>
            ) : attribution.photographer}
            {attribution.source !== 'local' && attribution.source !== 'user' && attribution.sourceUrl && (
              <>
                {' on '}
                <a href={attribution.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  {SOURCE_LABELS[attribution.source] ?? attribution.source}
                </a>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
