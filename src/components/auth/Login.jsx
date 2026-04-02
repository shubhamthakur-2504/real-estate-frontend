import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/utils/authStore'
import { authApi } from '@/services'
import { useReturnUrl } from '@/hooks/useReturnUrl'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { navigateToReturn } = useReturnUrl()
  const { user } = useAuthStore()
  const { login: storeLogin } = useAuthStore()
  const [searchParams] = useSearchParams()

  // Watch for successful login and navigate
  useEffect(() => {
    if (loginSuccess && user) {
      navigateToReturn()
      setLoginSuccess(false)
    }
  }, [loginSuccess, user, navigateToReturn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }

      const response = await authApi.login({ email, password })
      
      if (response?.token && response?.user) {
        // Store user and token
        storeLogin(response.user, response.token)
        toast.success('Login successful!')
        
        // Set flag to trigger navigation when user state updates
        setLoginSuccess(true)
      } else {
        setError('Login failed. Please try again.')
        toast.error('Login failed: Invalid response from server')
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Login failed'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4">
      <Card className="w-full max-w-md p-8 border border-light dark:border-dark">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            Welcome Back
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-2">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full !bg-primary !text-primary-foreground hover:!brightness-110 active:!brightness-95 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md hover:shadow-lg border-0"
            variant='default'
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin inline" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-center text-light-secondary dark:text-dark-secondary mt-6">
          Don't have an account?{' '}
          <Link
            to={`/register${searchParams.has('returnUrl') ? `?returnUrl=${searchParams.get('returnUrl')}` : ''}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Register here
          </Link>
        </p>
      </Card>
    </div>
  )
}
