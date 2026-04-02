import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/utils/authStore'

/**
 * Protected Route Component
 * Redirects to login with return URL if user is not authenticated
 */
const getDefaultRouteByRole = (role) => {
  if (role === 'buyer') return '/buyer/properties'
  return '/dashboard'
}

export function ProtectedRoute({ element, allowedRoles = [] }) {
  const { user } = useAuthStore()

  if (!user) {
    const currentPath = window.location.pathname + window.location.search
    const encodedReturnUrl = encodeURIComponent(currentPath)
    return <Navigate to={`/login?returnUrl=${encodedReturnUrl}`} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />
  }

  return element
}
