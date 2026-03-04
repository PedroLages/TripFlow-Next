"use client"

import { useParams } from 'next/navigation'
import { TripDetail } from '@/components/TripDetail/TripDetail'

const MOCK_TRIPS = [
  {
    id: 1,
    destination: 'Japan Circuit',
    dates: 'Oct 12 - Oct 26, 2026',
    status: 'PLANNING',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    collaborators: 2,
    accentColor: 'var(--color-blue)',
  },
  {
    id: 2,
    destination: 'Amalfi Coast Escape',
    dates: 'Jun 05 - Jun 15, 2026',
    status: 'BOOKED',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=1600&auto=format&fit=crop',
    collaborators: 4,
    accentColor: 'var(--color-green)',
  },
]

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const trip = MOCK_TRIPS.find(t => String(t.id) === tripId)

  if (!trip) return <p>Trip not found</p>

  return <TripDetail trip={trip} />
}
