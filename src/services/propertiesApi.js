import api from './api'

export const propertiesApi = {
  /**
   * Get all properties with filters and pagination
   * @param {Object} filters - { search, type, priceMin, priceMax, city, status, page, limit }
   * @returns {Promise} - { properties, total, pages }
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return api.get('/properties?' + params.toString()).then((res) => res.data.data || res.data)
  },

  /**
   * Get single property by ID
   * @param {string} id - Property ID
   * @returns {Promise} - { property }
   */
  getById: (id) => {
    return api.get(`/properties/${id}`).then((res) => res.data.data || res.data)
  },

  /**
   * Create new property (agent/admin only)
   * @param {Object} propertyData - { title, description, type, price, location, city, state,... }
   * @returns {Promise} - { property }
   */
  create: (propertyData) => {
    return api.post('/properties', propertyData).then((res) => res.data.data || res.data)
  },

  /**
   * Update property (owner/admin only)
   * @param {string} id - Property ID
   * @param {Object} propertyData - { title, description, price, ... }
   * @returns {Promise} - { property }
   */
  update: (id, propertyData) => {
    return api.put(`/properties/${id}`, propertyData).then((res) => res.data.data || res.data)
  },

  /**
   * Delete property (owner/admin only)
   * @param {string} id - Property ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/properties/${id}`).then((res) => res.data.data || res.data)
  },

  /**
   * Toggle property as favorite
   * @param {string} id - Property ID
   * @returns {Promise} - { property }
   */
  toggleFavorite: (id) => {
    return api.post(`/properties/${id}/favorite`).then((res) => res.data.data || res.data)
  },

  /**
   * Get user's favorite properties
   * @returns {Promise} - { properties }
   */
  getFavorites: () => {
    return api.get('/properties/favorites/my').then((res) => res.data.data || res.data)
  },

  /**
   * Attach uploaded image to property
   * @param {string} propertyId
   * @param {{url: string, publicId: string, order?: number}} image
   */
  addImage: (propertyId, image) => {
    return api.post(`/properties/${propertyId}/images/add`, image).then((res) => res.data.data || res.data)
  },

  /**
   * Set featured image for property
   * @param {string} propertyId
   * @param {{url: string, publicId: string}} image
   */
  setFeaturedImage: (propertyId, image) => {
    return api.post(`/properties/${propertyId}/images/featured`, image).then((res) => res.data.data || res.data)
  },

  /**
   * Remove image from property
   * @param {string} propertyId
   * @param {string} publicId - Cloudinary public ID
   */
  removeImage: (propertyId, publicId) => {
    return api.delete(`/properties/${propertyId}/images/remove`, { data: { publicId } }).then((res) => res.data.data || res.data)
  },

  /**
   * Get properties owned by current user
   * @returns {Promise} - { properties }
   */
  getMyProperties: () => {
    return api.get('/properties/agent/my').then((res) => res.data.data || res.data)
  },

  /**
   * Get properties created by logged-in user (agent or admin)
   * For dropdown in forms - returns minimal data
   * @returns {Promise} - { properties }
   */
  getPropertiesCreatedByMe: () => {
    return api.get('/properties/me/created').then((res) => res.data.data || res.data)
  },

  /**
   * Search properties by location
   * @param {Object} coords - { latitude, longitude, radius }
   * @returns {Promise} - { properties }
   */
  searchByLocation: (coords) => {
    return api.get('/properties/search/location', { params: coords }).then((res) => res.data)
  },

  /**
   * Get featured properties
   * @returns {Promise} - { properties }
   */
  getFeatured: () => {
    return api.get('/properties/featured').then((res) => res.data)
  },

  /**
   * Get property statistics
   * @returns {Promise} - { totalProperties, activeListings, avgPrice, ... }
   */
  getStats: () => {
    return api.get('/properties/stats').then((res) => res.data)
  },
}
