"use client"

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { BottomTabBar } from './BottomTabBar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="app-container">
      <Sidebar isDrawerOpen={isDrawerOpen} onDrawerClose={() => setIsDrawerOpen(false)} />
      <main className="main-content">
        {children}
      </main>
      {/* Always render — CSS shows only on mobile via @media (max-width: 767px) */}
      <BottomTabBar onMenuClick={() => setIsDrawerOpen(true)} notificationCount={2} />
    </div>
  )
}
