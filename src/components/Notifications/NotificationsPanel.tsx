"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, MessageSquare, ListTodo, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockNotifications } from '@/lib/mock-notifications'
import type { Notification } from '@/types/notification'
import './NotificationsPanel.css'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  onUnreadCountChange?: (count: number) => void
}

function getIconForType(type: Notification['type'], color: string) {
  switch (type) {
    case 'comment': return <MessageSquare size={14} color={color} />
    case 'task': return <ListTodo size={14} color={color} />
    case 'upload': return <UploadCloud size={14} color={color} />
    default: return <Clock size={14} color={color} />
  }
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    onUnreadCountChange?.(unreadCount)
  }, [unreadCount, onUnreadCountChange])

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap: return focus when panel closes
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus()
    }
  }, [isOpen])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  const removeNotification = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="notifications-backdrop"
            onClick={onClose}
            role="presentation"
          />

          <motion.div
            ref={panelRef}
            className="notifications-panel glass-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications panel"
            tabIndex={-1}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="notifications-header">
              <h3>Notifications</h3>
              <div className="header-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="mark-read-btn"
                  disabled={unreadCount === 0}
                >
                  <Check size={14} /> Mark all read
                </Button>
              </div>
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Check size={24} color="var(--color-green)" />
                  <p>You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  >
                    {!notif.isRead && <div className="unread-dot" />}

                    <div className="notif-avatar-wrapper">
                      <img
                        className="notif-avatar"
                        src={notif.user.avatar}
                        alt={notif.user.name}
                        loading="lazy"
                      />
                      <div className="notif-icon-badge" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        {getIconForType(notif.type, notif.user.color)}
                      </div>
                    </div>

                    <div className="notif-content">
                      <p className="notif-text">
                        <strong>{notif.user.name}</strong> {notif.action} <strong>{notif.target}</strong>
                      </p>
                      <span className="notif-time">{notif.time}</span>
                    </div>

                    <button
                      className="notif-clear-btn"
                      onClick={(e) => removeNotification(notif.id, e)}
                      aria-label={`Remove notification from ${notif.user.name}`}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="notifications-footer">
              <button className="view-all-link" type="button">
                View Activity History
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
