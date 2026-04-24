import api from './api'

export const leadsApi = {
  /**
   * Get all leads with filters and pagination
   * @param {Object} filters - { search, status, source, page, limit, assignedTo }
   * @returns {Promise} - { leads, total, pages }
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return api.get('/leads?' + params.toString()).then((res) => res.data.data || res.data)
  },

  /**
   * Get single lead by ID
   * @param {string} id - Lead ID
   * @returns {Promise} - { lead }
   */
  getById: (id) => {
    return api.get(`/leads/${id}`).then((res) => res.data)
  },

  /**
   * Create new lead
   * @param {Object} leadData - { buyerId, propertyId, status, source, notes, interest }
   * @returns {Promise} - { lead }
   */
  create: (leadData) => {
    return api.post('/leads', leadData).then((res) => res.data)
  },

  /**
   * Update lead status and details
   * @param {string} id - Lead ID
   * @param {Object} leadData - { status, assignedTo, notes, followUpDate, viewingDate, ... }
   * @returns {Promise} - { lead }
   */
  update: (id, leadData) => {
    return api.put(`/leads/${id}`, leadData).then((res) => res.data)
  },

  /**
   * Delete lead
   * @param {string} id - Lead ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/leads/${id}`).then((res) => res.data)
  },

  /**
   * Assign lead to agent
   * @param {string} id - Lead ID
   * @param {string} agentId - Agent ID
   * @returns {Promise} - { lead }
   */
  assignToAgent: (id, agentId) => {
    return api.put(`/leads/${id}/assign`, { assignedTo: agentId }).then((res) => res.data)
  },

  /**
   * Update lead status
   * @param {string} id - Lead ID
   * @param {string} status - new status (new, contacted, interested, viewing, negotiating, converted, lost)
   * @returns {Promise} - { lead }
   */
  updateStatus: (id, status) => {
    return api.patch(`/leads/${id}/status`, { status }).then((res) => res.data)
  },

  /**
   * Add note to lead
   * @param {string} id - Lead ID
   * @param {string} note - Note text
   * @returns {Promise} - { lead }
   */
  addNote: (id, note) => {
    return api.post(`/leads/${id}/notes`, { note }).then((res) => res.data)
  },

  /**
   * Get leads statistics
   * @returns {Promise} - { totalLeads, conversionRate, statusBreakdown, ... }
   */
  getStats: () => {
    return api.get('/leads/stats').then((res) => res.data)
  },

  /**
   * Get my inquiries (for buyers)
   * @param {Object} filters - { status, page, limit }
   * @returns {Promise} - { leads, pagination }
   */
  getMyInquiries: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return api.get('/leads/buyer/my-leads?' + params.toString()).then((res) => {
      console.log('Raw API response:', res)
      const data = res.data?.data || res.data
      console.log('Extracted data:', data)
      return data
    })
  },

  /**
   * Get my assigned leads (for agents)
   * @param {Object} filters - { page, limit, status }
   * @returns {Promise} - { leads }
   */
  getAssignedToMe: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    const query = params.toString()
    return api.get(`/leads/agent/my-leads${query ? `?${query}` : ''}`).then((res) => res.data.data || res.data)
  },

  /**
   * Get leads for a property
   * @param {string} propertyId - Property ID
   * @returns {Promise} - { leads }
   */
  getByProperty: (propertyId) => {
    return api.get(`/leads/property/${propertyId}`).then((res) => res.data)
  },
}
