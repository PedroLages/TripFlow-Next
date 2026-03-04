"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface NotificationContextValue {
  // Realtime state
  isRealtimeConnected: boolean

  // UI state
  isPanelOpen: boolean
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void

  // Anchor ref for positioning panel
  anchorRef: React.RefObject<HTMLButtonElement> | null
  setAnchorRef: (ref: React.RefObject<HTMLButtonElement>) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return ctx
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth()
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [anchorRef, setAnchorRef] = useState<React.RefObject<HTMLButtonElement> | null>(null)

  // Setup Supabase realtime subscription
  useEffect(() => {
    // Only setup realtime if user is authenticated
    if (!user?.id) {
      setIsRealtimeConnected(false)
      return
    }

    const supabase = createClient()

    // Subscribe to notifications for current user
    const notificationChannel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload)
          // React Query will automatically refetch due to invalidation
          // or we can use queryClient here to update cache manually
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload)
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED')
      })

    setChannel(notificationChannel)

    return () => {
      notificationChannel.unsubscribe()
    }
  }, [user?.id])

  const openPanel = () => setIsPanelOpen(true)
  const closePanel = () => setIsPanelOpen(false)
  const togglePanel = () => setIsPanelOpen(prev => !prev)

  const value: NotificationContextValue = {
    isRealtimeConnected,
    isPanelOpen,
    openPanel,
    closePanel,
    togglePanel,
    anchorRef,
    setAnchorRef,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
