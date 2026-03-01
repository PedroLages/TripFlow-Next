"use client"

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Users } from 'lucide-react'
import { CollaborationPanel } from '@/components/Collaboration/CollaborationPanel'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { ThemeToggle } from '@/components/layout/ThemeProvider'
import { NotificationBell } from '@/components/Notifications/NotificationBell'

const MOCK_TRIPS: Record<string, { destination: string; dates: string; collaborators: number }> = {
  '1': { destination: 'Japan Circuit', dates: 'Oct 12 - Oct 26, 2026', collaborators: 2 },
  '2': { destination: 'Amalfi Coast Escape', dates: 'Jun 05 - Jun 15, 2026', collaborators: 4 },
}

const TABS = [
  { label: 'Overview', path: '' },
  { label: 'Itinerary', path: '/itinerary' },
  { label: 'Budget', path: '/budget' },
  { label: 'Voting', path: '/voting' },
]

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const { tripId } = useParams<{ tripId: string }>()
  const pathname = usePathname()
  const [isCollabOpen, setIsCollabOpen] = useState(false)

  const trip = MOCK_TRIPS[tripId] ?? { destination: 'Unknown Trip', dates: '', collaborators: 0 }
  const basePath = `/trips/${tripId}`

  const isTabActive = (tabPath: string) => {
    const fullPath = basePath + tabPath
    if (tabPath === '') return pathname === basePath
    return pathname.startsWith(fullPath)
  }

  return (
    <>
      <header className="top-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', paddingBottom: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>{trip.destination}</h1>
            <p>{trip.dates} &bull; {trip.collaborators} members</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <NotificationBell tripId={tripId} />
            <ThemeToggle />
            <button
              className="glass-panel"
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '100px' }}
              onClick={() => setIsCollabOpen(true)}
              aria-label={`View collaborators (${trip.collaborators} members)`}
            >
              <Users size={18} />
              <span style={{ fontWeight: 500 }}>Collaborators ({trip.collaborators})</span>
            </button>
            <ExportMenu />
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?u=1" alt="Your profile" width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
            </div>
          </div>
        </div>

        <div className="trip-local-nav" style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0px', marginTop: '8px' }}>
          {TABS.map(tab => {
            const active = isTabActive(tab.path)
            return (
              <Link
                key={tab.label}
                href={basePath + tab.path}
                style={{
                  padding: '8px 0 16px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'all var(--transition-smooth)',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </header>

      <div className="tab-content-wrapper" style={{ position: 'relative', flex: 1 }}>
        {children}
      </div>

      <CollaborationPanel isOpen={isCollabOpen} onClose={() => setIsCollabOpen(false)} />
    </>
  )
}
