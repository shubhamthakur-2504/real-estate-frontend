import api from './api'

export const bookingRequestsApi = {
  getMy: (status) => {
    return api
      .get('/booking-requests/buyer/my', { params: status ? { status } : {} })
      .then((res) => res.data.data || res.data)
  },

  getAgentMy: (status) => {
    return api
      .get('/booking-requests/agent/my', { params: status ? { status } : {} })
      .then((res) => res.data.data || res.data)
  },

  create: (payload) => {
    return api.post('/booking-requests', payload).then((res) => res.data.data || res.data)
  },

  cancel: (id, reason) => {
    return api.patch(`/booking-requests/${id}/cancel`, { reason }).then((res) => res.data.data || res.data)
  },

  refund: (id, reason) => {
    return api.patch(`/booking-requests/${id}/refund`, { reason }).then((res) => res.data.data || res.data)
  },

  complete: (id) => {
    return api.patch(`/booking-requests/${id}/complete`).then((res) => res.data.data || res.data)
  },
}
