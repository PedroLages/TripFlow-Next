"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, MessageSquare, ListTodo, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import './NotificationsPanel.css';

interface Notification {
  id: string;
  user: {
    name: string;
    avatar: string;
    color: string;
  };
  action: string;
  target: string;
  time: string;
  type: 'comment' | 'task' | 'upload' | 'default';
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user: { name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=47', color: 'var(--color-purple)' },
    action: 'commented on',
    target: 'Day 2 Itinerary',
    time: '10m ago',
    type: 'comment',
    isRead: false
  },
  {
    id: 'n2',
    user: { name: 'Alex C.', avatar: 'https://i.pravatar.cc/150?img=33', color: 'var(--color-blue)' },
    action: 'assigned a task to you:',
    target: 'Book Kyoto Train Tickets',
    time: '2h ago',
    type: 'task',
    isRead: false
  },
  {
    id: 'n3',
    user: { name: 'Jessica L.', avatar: 'https://i.pravatar.cc/150?img=5', color: 'var(--color-green)' },
    action: 'uploaded',
    target: 'Hotel Reservation PDF',
    time: 'Yesterday',
    type: 'upload',
    isRead: true
  }
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const getIconForType = (type: string, color: string) => {
    switch (type) {
      case 'comment': return <MessageSquare size={14} color={color} />;
      case 'task': return <ListTodo size={14} color={color} />;
      case 'upload': return <UploadCloud size={14} color={color} />;
      default: return <Clock size={14} color={color} />;
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to catch clicks outside the panel */}
          <div className="notifications-backdrop" onClick={onClose} />

          <motion.div
            className="notifications-panel glass-panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="notifications-header">
              <h3>Notifications</h3>
              <div className="header-actions">
                <Button variant="ghost" size="sm" onClick={markAllRead} className="mark-read-btn">
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

                    <div className="notif-avatar" style={{ backgroundImage: `url(${notif.user.avatar})` }}>
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
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="notifications-footer">
              <span className="view-all-link">View Activity History</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
