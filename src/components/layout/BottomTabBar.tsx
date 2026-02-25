"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Map, Bell, Menu } from 'lucide-react'

interface BottomTabBarProps {
  onMenuClick: () => void
  notificationCount?: number
}

export function BottomTabBar({ onMenuClick, notificationCount = 0 }: BottomTabBarProps) {
  const pathname = usePathname()

  const tabs = [
    { icon: LayoutDashboard, label: 'Home', href: '/', isActive: pathname === '/' },
    { icon: Map, label: 'Trips', href: '/trips', isActive: pathname.startsWith('/trips') },
    { icon: Bell, label: 'Alerts', href: '#notifications', isActive: false, badge: notificationCount },
    { icon: Menu, label: 'Menu', href: '#menu', isActive: false, onClick: onMenuClick },
  ]

  return (
    <nav className="bottom-tab-bar" aria-label="Mobile navigation">
      {tabs.map(tab => {
        const Icon = tab.icon
        if (tab.onClick) {
          return (
            <button key={tab.label} className={`bottom-tab ${tab.isActive ? 'active' : ''}`} onClick={tab.onClick} aria-label={tab.label}>
              <Icon size={20} />
              <span className="bottom-tab-label">{tab.label}</span>
            </button>
          )
        }
        return (
          <Link key={tab.label} href={tab.href} className={`bottom-tab ${tab.isActive ? 'active' : ''}`} aria-label={tab.label}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} />
              {tab.badge && tab.badge > 0 ? (
                <span className="bottom-tab-badge">{tab.badge}</span>
              ) : null}
            </div>
            <span className="bottom-tab-label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
