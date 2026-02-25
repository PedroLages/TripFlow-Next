export interface NotificationUser {
  name: string
  avatar: string
  color: string
}

export interface Notification {
  id: string
  user: NotificationUser
  action: string
  target: string
  time: string
  type: 'comment' | 'task' | 'upload' | 'default'
  isRead: boolean
}
