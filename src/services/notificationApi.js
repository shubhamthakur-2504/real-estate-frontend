import api from './api'

export const notificationApi = {
  /**
   * Get notifications
   * @param {Object} filters - { read, page, limit }
   * @returns {Promise} - { notifications, pagination }
   */
  getNotifications: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return api
      .get('/notifications' + (params.toString() ? '?' + params.toString() : ''))
      .then((res) => res.data.data || res.data)
  },

  /**
   * Get unread notification count
   * @returns {Promise} - { unreadCount }
   */
  getUnreadCount: () => {
    return api.get('/notifications/unread/count').then((res) => res.data.data || res.data)
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise}
   */
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`).then((res) => res.data.data || res.data)
  },

  /**
   * Mark all as read
   * @returns {Promise}
   */
  markAllAsRead: () => {
    return api.put('/notifications/all/read').then((res) => res.data)
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/notifications/${id}`).then((res) => res.data)
  },

  /**
   * Clear all notifications
   * @returns {Promise}
   */
  clearAll: () => {
    return api.delete('/notifications/all').then((res) => res.data)
  },
}
