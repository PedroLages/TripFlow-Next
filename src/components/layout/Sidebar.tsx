"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Bell, MapPin } from 'lucide-react'
import { NotificationsPanel } from '@/components/Notifications/NotificationsPanel'
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

export function Sidebar() {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
        <div className="logo-icon"></div>
        {!isSidebarCollapsed && <div className="logo-text">TripFlow AI</div>}
      </div>

      <nav className="nav-links">
        <Link
          href="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          title="Dashboard"
        >
          <LayoutDashboard size={18} /> {!isSidebarCollapsed && <span>Dashboard</span>}
        </Link>

        <div
          className={`nav-item ${isNotificationsOpen ? 'active' : ''}`}
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} /> {!isSidebarCollapsed && <span>Notifications</span>}
          {!isSidebarCollapsed && (
            <span style={{ marginLeft: 'auto', background: 'var(--color-red)', color: 'white', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600 }}>3</span>
          )}
          <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        {!isSidebarCollapsed && (
          <div className="sidebar-section-title" style={{ marginTop: '24px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Trips
          </div>
        )}

        {MOCK_TRIPS.map(trip => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className={`nav-item ${pathname.startsWith(`/trips/${trip.id}`) ? 'active' : ''}`}
            title={trip.destination}
          >
            <MapPin size={18} color={trip.accentColor} />
            {!isSidebarCollapsed && (
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {trip.destination}
              </span>
            )}
          </Link>
        ))}

        {!isSidebarCollapsed && (
          <div className="nav-item" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ marginLeft: '26px' }}>+ New Trip</span>
          </div>
        )}

        <div className="nav-item" style={{ marginTop: 'auto' }} title="Settings" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={18} /> {!isSidebarCollapsed && <span>Settings</span>}
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </nav>

      <button
        className="sidebar-collapse-btn"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
