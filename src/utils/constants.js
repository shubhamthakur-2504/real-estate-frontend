// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

export { API_BASE_URL, API_TIMEOUT }
