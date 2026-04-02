import { useSearchParams, useNavigate } from 'react-router-dom'

export const useReturnUrl = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Get the return URL from query params, default to dashboard
  const getReturnUrl = () => {
    const returnUrl = searchParams.get('returnUrl')
    return returnUrl ? decodeURIComponent(returnUrl) : '/dashboard'
  }

  // Navigate to the return URL or default
  const navigateToReturn = () => {
    navigate(getReturnUrl(), { replace: true })
  }

  return {
    returnUrl: getReturnUrl(),
    navigateToReturn,
  }
}
