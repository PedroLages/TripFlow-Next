"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Dashboard } from '@/components/Dashboard/Dashboard'
import { AIGeneratorWizard } from '@/components/AIGenerator/AIGeneratorWizard'
import { ThemeToggle } from '@/components/layout/ThemeProvider'

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

export default function HomePage() {
  const router = useRouter()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <>
      <header className="top-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>Good afternoon, Pedro.</h1>
            <p>Ready for your next adventure?</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ThemeToggle />
            <div className="search-container" style={{ position: 'relative', cursor: 'text' }} onClick={() => setIsWizardOpen(true)}>
              <Sparkles size={16} className="search-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)', zIndex: 1 }} />
              <input type="text" className="search-bar" placeholder="Ask AI to plan a trip..." readOnly style={{ paddingLeft: '40px', cursor: 'pointer', outline: 'none' }} />
            </div>
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?u=1" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </header>

      <Dashboard
        trips={MOCK_TRIPS}
        onTripClick={(tripData) => {
          router.push(`/trips/${tripData.id}`)
        }}
      />

      {isWizardOpen && (
        <AIGeneratorWizard
          onClose={() => setIsWizardOpen(false)}
          onComplete={(data) => {
            console.log('Trip Generated', data)
            setIsWizardOpen(false)
          }}
        />
      )}
    </>
  )
}
