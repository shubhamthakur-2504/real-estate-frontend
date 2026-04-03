import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authApi } from '@/services/authApi'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'

export function Settings() {
  const { user, setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'password'

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {}
    if (!profileData.firstname?.trim()) newErrors.firstname = 'First name is required'
    if (!profileData.lastname?.trim()) newErrors.lastname = 'Last name is required'
    if (!profileData.email?.trim()) newErrors.email = 'Email is required'
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!profileData.phone?.trim()) newErrors.phone = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {}
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required'
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required'
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!validateProfileForm()) return

    try {
      setLoading(true)
      const response = await authApi.updateProfile({
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        phone: profileData.phone,
      })
      const updatedUser = response.user || response

      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!validatePasswordForm()) return

    try {
      setLoading(true)
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      toast.success('Password changed successfully')
    } catch (err) {
      console.error('Error changing password:', err)
      toast.error(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">Settings</h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-light dark:border-dark">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            activeTab === 'profile'
              ? 'text-primary dark:text-primary'
              : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
          }`}
        >
          <User size={18} />
          Profile
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            activeTab === 'password'
              ? 'text-primary dark:text-primary'
              : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
          }`}
        >
          <Lock size={18} />
          Security
          {activeTab === 'password' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
          )}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6 border border-light dark:border-dark">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
              Profile Information
            </h2>
            <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
              Update your personal details
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={profileData.firstname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.firstname && (
                  <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={14} />
                    {errors.firstname}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={profileData.lastname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.lastname && (
                  <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={14} />
                    {errors.lastname}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-primary dark:text-dark-primary opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
                Contact support to change email
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.phone && (
                <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setProfileData({
                    firstname: user?.firstname || '',
                    lastname: user?.lastname || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <Card className="p-6 border border-light dark:border-dark">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
              Change Password
            </h2>
            <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
              Update your password to keep your account secure
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="w-full px-3 py-2 pr-10 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.currentPassword}
                </div>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-3 py-2 pr-10 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="w-full px-3 py-2 pr-10 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
