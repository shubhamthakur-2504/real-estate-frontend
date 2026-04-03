import api from './api'

export const wishlistApi = {
  /**
   * Get buyer's wishlist
   * @param {Object} filters - { page, limit }
   * @returns {Promise} - { wishlist, pagination }
   */
  getWishlist: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return api.get('/wishlist' + (params.toString() ? '?' + params.toString() : '')).then((res) => res.data.data || res.data)
  },

  /**
   * Check if property is in wishlist
   * @param {string} propertyId - Property ID
   * @returns {Promise} - { isInWishlist }
   */
  checkWishlist: (propertyId) => {
    return api.get(`/wishlist/check/${propertyId}`).then((res) => res.data.data || res.data)
  },

  /**
   * Add property to wishlist
   * @param {string} propertyId - Property ID
   * @param {Object} data - { note }
   * @returns {Promise} - { wishlistItem }
   */
  add: (propertyId, data = {}) => {
    return api.post(`/wishlist/${propertyId}`, data).then((res) => res.data.data || res.data)
  },

  /**
   * Remove property from wishlist
   * @param {string} propertyId - Property ID
   * @returns {Promise}
   */
  remove: (propertyId) => {
    return api.delete(`/wishlist/${propertyId}`).then((res) => res.data)
  },

  /**
   * Update wishlist note
   * @param {string} propertyId - Property ID
   * @param {Object} data - { note }
   * @returns {Promise} - { wishlistItem }
   */
  updateNote: (propertyId, data) => {
    return api.put(`/wishlist/${propertyId}`, data).then((res) => res.data.data || res.data)
  },
}
