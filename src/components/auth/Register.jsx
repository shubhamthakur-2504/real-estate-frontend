import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/utils/authStore'
import { authApi } from '@/services'
import { useReturnUrl } from '@/hooks/useReturnUrl'
import { toast } from 'sonner'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'buyer',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { navigateToReturn } = useReturnUrl()
  const { login: storeLogin } = useAuthStore()
  const [searchParams] = useSearchParams()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all required fields')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await authApi.register({
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      })

      if (response?.token && response?.user) {
        // Store user and token
        storeLogin(response.user, response.token)
        toast.success('Registration successful!')
        
        // Small delay to ensure auth state propagates before navigation
        setTimeout(() => navigateToReturn(), 100)
      } else {
        setError('Registration failed. Please try again.')
        toast.error('Registration failed: Invalid response from server')
      }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-8">
      <Card className="w-full max-w-md p-8 border border-light dark:border-dark">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            Create Account
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-2">
            Join our real estate platform
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="app-select"
            >
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full !bg-primary !text-primary-foreground hover:!brightness-110 active:!brightness-95 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-base shadow-md hover:shadow-lg border-0"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin inline" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-light-secondary dark:text-dark-secondary mt-6">
          Already have an account?{' '}
          <Link
            to={`/login${searchParams.has('returnUrl') ? `?returnUrl=${searchParams.get('returnUrl')}` : ''}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
