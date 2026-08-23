export interface NotificationResponse {
  id: number
  title: string
  message: string
  notificationType: 'EMAIL' | 'SYSTEM'
  isRead: boolean
  createdAt: string
}