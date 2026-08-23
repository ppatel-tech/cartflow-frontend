import { useEffect, useState } from 'react'
import { notificationApi } from '../api/notificationApi'
import type { NotificationResponse } from '../types/notification.types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  function loadNotifications() {
    setIsLoading(true)
    notificationApi.getAll(0, 30)
      .then((res) => setNotifications(res.data.data.content))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function handleMarkAsRead(id: number) {
    await notificationApi.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-8">Notifications</h1>

      {isLoading ? (
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No notifications yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.isRead && handleMarkAsRead(n.id)}
              className={`text-left py-4 flex gap-3 items-start ${!n.isRead ? 'bg-brass/5' : ''}`}
            >
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  n.isRead ? 'bg-hairline' : 'bg-brass'
                }`}
              />
              <div className="flex-1">
                <div className="flex justify-between items-baseline gap-3">
                  <p className={`font-body text-sm ${n.isRead ? 'text-ink/60' : 'text-ink font-medium'}`}>
                    {n.title}
                  </p>
                  <span className="font-mono text-[10px] text-ink/30 shrink-0">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="font-body text-xs text-ink/50 mt-1">{n.message}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}