import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, Trash2 } from 'lucide-react'
import { notificationApi } from '@/services'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Refetch notifications when bell opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount()
      setUnreadCount(res?.unreadCount || 0)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await notificationApi.getNotifications({ limit: 10, page: 1 })
      const notifs = res?.notifications || []
      setNotifications(notifs)

      // Update unread count
      const unread = notifs.filter((n) => !n.read).length
      setUnreadCount(unread)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await notificationApi.markAsRead(notification._id)
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true, readAt: new Date() } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      // Navigate to action URL
      if (notification.data?.actionUrl) {
        navigate(notification.data.actionUrl)
        setIsOpen(false)
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation()
    try {
      await notificationApi.delete(notificationId)
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
      toast.success('Notification deleted')
    } catch (err) {
      console.error('Error deleting notification:', err)
      toast.error('Failed to delete notification')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, readAt: new Date() })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (err) {
      console.error('Error marking all as read:', err)
      toast.error('Failed to mark all as read')
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      lead_assigned: '🎯',
      lead_status_updated: '📋',
      inquiry_received: '💌',
      message: '💬',
      system: '⚙️',
    }
    return icons[type] || '📢'
  }

  const getNotificationColor = (read) => {
    return read ? 'bg-white dark:bg-slate-800' : 'bg-blue-50 dark:bg-blue-900/20'
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-accent rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 bg-white dark:bg-slate-900 border border-light dark:border-dark rounded-lg shadow-xl">
          <div className="border-b border-light dark:border-dark p-4 flex items-center justify-between">
            <h3 className="font-semibold text-light-primary dark:text-dark-primary">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:underline"
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-light-secondary dark:text-dark-secondary">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-light-secondary dark:text-dark-secondary">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 border-b border-light dark:border-dark hover:opacity-90 transition-opacity flex items-start gap-3 ${getNotificationColor(notification.read)}`}
                >
                  <span className="text-xl flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-light-secondary dark:text-dark-secondary line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, notification._id)}
                    className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>

                  {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-light dark:border-dark p-3 text-center">
              <button
                onClick={() => {
                  navigate('/notifications')
                  setIsOpen(false)
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
