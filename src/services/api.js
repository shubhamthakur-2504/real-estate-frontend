import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent infinite refresh loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if the request is NOT a login, register, or refresh-token request
      const isAuthRoute = originalRequest.url.includes('/auth/login') || 
                          originalRequest.url.includes('/auth/register') || 
                          originalRequest.url.includes('/auth/refresh-token')

      if (isAuthRoute) {
        // Don't try to refresh for auth routes themselves
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        redirectToLogin()
        return Promise.reject(error)
      }

      // Try to refresh the token
      if (!isRefreshing) {
        isRefreshing = true
        originalRequest._retry = true

        try {
          // Create a request without interceptors to avoid infinite loops
          // Refresh token is sent as HTTP-only cookie automatically with withCredentials
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { 
              timeout: API_TIMEOUT,
              withCredentials: true,
            }
          )

          const { token: newToken } = response.data

          localStorage.setItem('token', newToken)
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

          processQueue(null, newToken)
          isRefreshing = false

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (err) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          processQueue(err, null)
          isRefreshing = false
          redirectToLogin()
          return Promise.reject(err)
        }
      }

      // If already refreshing, queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    return Promise.reject(error)
  }
)

/**
 * Redirect to login with return URL encoded in query params
 */
const redirectToLogin = () => {
  const currentPath = window.location.pathname + window.location.search
  const encodedReturnUrl = encodeURIComponent(currentPath)
  window.location.href = `/login?returnUrl=${encodedReturnUrl}`
}

export default api
