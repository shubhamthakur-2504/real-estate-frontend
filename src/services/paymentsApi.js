import api from './api'

export const paymentsApi = {
  createOrder: (bookingRequestId) => {
    return api.post('/payments/orders', { bookingRequestId }).then((res) => res.data.data || res.data)
  },

  verifyOrder: (payload) => {
    return api.post('/payments/verify', payload).then((res) => res.data.data || res.data)
  },

  getStatus: (paymentId) => {
    return api.get(`/payments/${paymentId}/status`).then((res) => res.data.data || res.data)
  },

  reconcile: (paymentId) => {
    return api.post(`/payments/${paymentId}/reconcile`).then((res) => res.data.data || res.data)
  },

  getMyPayments: (limit = 20) => {
    return api.get('/payments/my', { params: { limit } }).then((res) => res.data.data || res.data)
  },
}
