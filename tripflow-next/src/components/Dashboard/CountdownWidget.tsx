"use client"

import { useState, useEffect } from 'react'
import './CountdownWidget.css'

interface CountdownWidgetProps {
  departureDate: string; // ISO date string
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const difference = target - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

export function CountdownWidget({ departureDate, className = '' }: CountdownWidgetProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(departureDate))
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(departureDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [departureDate])

  if (!timeRemaining) {
    return <div className={`countdown-widget ${className}`} style={{ opacity: 0 }}>...</div>
  }

  return (
    <div className={`countdown-widget ${className}`}>
      <div className="countdown-segment">
        <span className="countdown-number">{String(timeRemaining.days).padStart(2, '0')}</span>
        <span className="countdown-label">days</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-segment">
        <span className="countdown-number">{String(timeRemaining.hours).padStart(2, '0')}</span>
        <span className="countdown-label">hours</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-segment">
        <span className="countdown-number">{String(timeRemaining.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">min</span>
      </div>
    </div>
  )
}
