import type { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user: { name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=47', color: 'var(--color-purple)' },
    action: 'commented on',
    target: 'Day 2 Itinerary',
    time: '10m ago',
    type: 'comment',
    isRead: false,
  },
  {
    id: 'n2',
    user: { name: 'Alex C.', avatar: 'https://i.pravatar.cc/150?img=33', color: 'var(--color-blue)' },
    action: 'assigned a task to you:',
    target: 'Book Kyoto Train Tickets',
    time: '2h ago',
    type: 'task',
    isRead: false,
  },
  {
    id: 'n3',
    user: { name: 'Jessica L.', avatar: 'https://i.pravatar.cc/150?img=5', color: 'var(--color-green)' },
    action: 'uploaded',
    target: 'Hotel Reservation PDF',
    time: 'Yesterday',
    type: 'upload',
    isRead: true,
  },
]
