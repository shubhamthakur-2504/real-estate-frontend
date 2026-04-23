import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/utils/authStore'

const getDefaultRouteByRole = (role) => {
  if (role === 'buyer') return '/buyer/properties'
  return '/dashboard'
}

export const useReturnUrl = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Get the return URL from query params, default to dashboard
  const getReturnUrl = (roleOverride) => {
    const returnUrl = searchParams.get('returnUrl')
    return returnUrl ? decodeURIComponent(returnUrl) : getDefaultRouteByRole(roleOverride || user?.role)
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
