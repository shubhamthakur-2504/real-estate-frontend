import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { notificationApi } from '@/services'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, read, unread
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
  }, [filter, page])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await notificationApi.getNotifications({
        read: filter === 'all' ? undefined : filter === 'unread',
        page,
        limit: 20,
      })
      const data = res?.notifications || []
      setNotifications(data)
      if (res?.pagination) {
        setTotalPages(res.pagination.totalPages)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      )
      toast.success('Marked as read')
    } catch (err) {
      console.error('Error marking as read:', err)
      toast.error('Failed to mark as read')
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.delete(notificationId)
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
      toast.success('Notification deleted')
    } catch (err) {
      console.error('Error deleting notification:', err)
      toast.error('Failed to delete notification')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return

    try {
      await notificationApi.clearAll()
      setNotifications([])
      setPage(1)
      toast.success('All notifications cleared')
    } catch (err) {
      console.error('Error clearing notifications:', err)
      toast.error('Failed to clear notifications')
    }
  }

  const handleNotificationAction = (notification) => {
    if (notification.data?.actionUrl) {
      navigate(notification.data.actionUrl)
    }
    if (!notification.read) {
      handleMarkAsRead(notification._id)
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

  const filteredNotifications = notifications

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary flex items-center gap-2">
          <Bell size={32} />
          Notifications
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Stay updated with all your property and inquiry activities
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4 border border-light dark:border-dark flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFilter('all')
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary hover:opacity-80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter('unread')
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary hover:opacity-80'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => {
              setFilter('read')
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-primary text-white'
                : 'bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary hover:opacity-80'
            }`}
          >
            Read
          </button>
        </div>

        {notifications.length > 0 && (
          <Button onClick={handleClearAll} variant="destructive" size="sm">
            Clear all
          </Button>
        )}
      </Card>

      {/* Notifications List */}
      {loading ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          Loading notifications...
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-light-secondary dark:text-dark-secondary text-lg">
            No notifications
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm mt-1">
            You're all caught up!
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`p-4 border cursor-pointer transition-colors hover:opacity-90 flex items-start gap-4 ${
                  notification.read
                    ? 'border-light dark:border-dark bg-white dark:bg-slate-800'
                    : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                }`}
                onClick={() => handleNotificationAction(notification)}
              >
                {/* Icon */}
                <span className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-light-primary dark:text-dark-primary">
                        {notification.title}
                      </h3>
                      <p className="text-light-secondary dark:text-dark-secondary mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-light-secondary dark:text-dark-secondary mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!notification.read && (
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification._id)
                      }}
                      className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification._id)
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-light-secondary dark:text-dark-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
