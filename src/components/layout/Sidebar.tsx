"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { SettingsModal } from '@/components/Settings/SettingsModal'

interface TripData {
  id: string
  destination: string
  accentColor: string
}

const MOCK_TRIPS: TripData[] = [
  { id: '1', destination: 'Japan Circuit', accentColor: 'var(--color-blue)' },
  { id: '2', destination: 'Amalfi Coast Escape', accentColor: 'var(--color-green)' },
]

export function Sidebar({ isDrawerOpen, onDrawerClose }: { isDrawerOpen?: boolean; onDrawerClose?: () => void }) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Desktop/Tablet sidebar — CSS handles responsive collapse & mobile hide */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-container">
          <div className="logo-icon"></div>
          <div className="logo-text">TripFlow AI</div>
        </div>

        <nav className="nav-links">
          <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} title="Dashboard">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </Link>



          <div className="sidebar-section-title">
            Your Trips
          </div>

          {MOCK_TRIPS.map(trip => (
            <Link key={trip.id} href={`/trips/${trip.id}`} className={`nav-item ${pathname.startsWith(`/trips/${trip.id}`) ? 'active' : ''}`} title={trip.destination}>
              <MapPin size={18} color={trip.accentColor} />
              <span>{trip.destination}</span>
            </Link>
          ))}

          <button type="button" className="nav-item" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <span style={{ marginLeft: '26px' }}>+ New Trip</span>
          </button>

          <button type="button" className="nav-item" style={{ marginTop: 'auto', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left' }} title="Settings" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={18} /> <span>Settings</span>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </button>
        </nav>

        <button className="sidebar-collapse-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Mobile drawer overlay — only rendered when open */}
      {isDrawerOpen && (
        <>
          <div className="sidebar-drawer-backdrop" onClick={onDrawerClose} />
          <aside className="sidebar sidebar-drawer">
            <div className="logo-container" style={{ justifyContent: 'flex-start' }}>
              <div className="logo-icon"></div>
              <div className="logo-text">TripFlow AI</div>
              <button className="sidebar-drawer-close" onClick={onDrawerClose} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className="nav-links">
              <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={onDrawerClose}>
                <LayoutDashboard size={18} /> <span>Dashboard</span>
              </Link>



              <div className="sidebar-section-title" style={{ marginTop: '24px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Trips
              </div>

              {MOCK_TRIPS.map(trip => (
                <Link key={trip.id} href={`/trips/${trip.id}`} className={`nav-item ${pathname.startsWith(`/trips/${trip.id}`) ? 'active' : ''}`} onClick={onDrawerClose}>
                  <MapPin size={18} color={trip.accentColor} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.destination}</span>
                </Link>
              ))}

              <button type="button" className="nav-item" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={onDrawerClose}>
                <span style={{ marginLeft: '26px' }}>+ New Trip</span>
              </button>

              <button type="button" className="nav-item" style={{ marginTop: 'auto', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={() => setIsSettingsOpen(true)}>
                <Settings size={18} /> <span>Settings</span>
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
              </button>
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
