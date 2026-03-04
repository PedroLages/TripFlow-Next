"use client"

import { forwardRef, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { useNotificationContext } from './NotificationProvider'
import { NotificationsPanel } from './NotificationsPanel'

interface NotificationBellProps {
  tripId?: string
  className?: string
}

export const NotificationBell = forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ tripId, className = '' }, ref) => {
    const { togglePanel, isPanelOpen, setAnchorRef, closePanel } = useNotificationContext()
    const { unreadCount } = useNotifications({ tripId })
    const internalRef = useRef<HTMLButtonElement>(null)
    const buttonRef = (ref || internalRef) as React.RefObject<HTMLButtonElement>

    // Register button ref with context on mount
    useEffect(() => {
      setAnchorRef(buttonRef)
    }, [buttonRef, setAnchorRef])

    return (
      <div style={{ position: 'relative' }}>
        <button
          ref={buttonRef}
          type="button"
          className={`glass-panel ${isPanelOpen ? 'active' : ''} ${className}`}
          onClick={togglePanel}
          aria-label="Toggle notifications"
          title="Notifications"
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            border: 'none',
            padding: 0
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              className="nav-badge"
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                border: '2px solid var(--bg-card)',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
        <NotificationsPanel isOpen={isPanelOpen} onClose={closePanel} />
      </div>
    )
  }
)

NotificationBell.displayName = 'NotificationBell'
