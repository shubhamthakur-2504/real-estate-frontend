import api from './api'

export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - { firstName, lastName, email, password, phone, role }
   * @returns {Promise} - { user, token }
   */
  register: (userData) => {
    return api.post('/auth/register', userData).then((res) => {
      // Backend returns { success, message, data: { user, accessToken } }
      const { user, accessToken } = res.data.data || {}
      return { user, token: accessToken }
    })
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { user, token }
   */
  login: (credentials) => {
    return api.post('/auth/login', credentials).then((res) => {
      // Backend returns { success, message, data: { user, accessToken } }
      const { user, accessToken } = res.data.data || {}
      return { user, token: accessToken }
    })
  },

  /**
   * Refresh access token (auto-called on 401)
   * Refresh token is sent as HTTP-only cookie
   * @returns {Promise} - { token }
   */
  refreshToken: () => {
    return api.post('/auth/refresh').then((res) => res.data)
  },

  /**
   * Logout user (clears refresh token cookie)
   * @returns {Promise}
   */
  logout: () => {
    return api.post('/auth/logout').then((res) => res.data)
  },

  /**
   * Get current user profile
   * @returns {Promise} - { user }
   */
  getProfile: () => {
    return api.get('/auth/profile').then((res) => {
      const { user } = res.data.data || {}
      return { user }
    })
  },

  /**
   * Update user profile
   * @param {Object} userData - { firstName, lastName, phone, profilePicture }
   * @returns {Promise} - { user }
   */
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData).then((res) => {
      const { user } = res.data.data || {}
      return { user }
    })
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: (passwordData) => {
    return api.post('/auth/change-password', passwordData).then((res) => res.data)
  },
}
