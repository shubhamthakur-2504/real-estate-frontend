import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/utils/authStore'

const getDefaultRouteByRole = (role) => {
  if (role === 'buyer') return '/buyer/properties'
  return '/dashboard'
}

const getSafeInternalReturnUrl = (rawReturnUrl) => {
  if (!rawReturnUrl) return null

  let decoded = rawReturnUrl
  try {
    decoded = decodeURIComponent(rawReturnUrl)
  } catch {
    return null
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null

  const [path] = decoded.split('?')
  if (path === '/login' || path === '/register' || path === '/') return null

  return decoded
}

export const useReturnUrl = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Get the return URL from query params, default to dashboard
  const getReturnUrl = (roleOverride) => {
    const returnUrl = searchParams.get('returnUrl')
    const safeReturnUrl = getSafeInternalReturnUrl(returnUrl)
    return safeReturnUrl || getDefaultRouteByRole(roleOverride || user?.role)
  }

  // Navigate to the return URL or default
  const navigateToReturn = (roleOverride) => {
    navigate(getReturnUrl(roleOverride), { replace: true })
  }

  return {
    returnUrl: getReturnUrl(),
    navigateToReturn,
  }
}
