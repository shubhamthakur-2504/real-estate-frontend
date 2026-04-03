import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, AlertCircle } from 'lucide-react'

export function AddLeadModal({
  isOpen,
  onClose,
  onSubmit,
  properties = [],
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    property: '',
    budget: '',
    interest: 'medium',
    preferredTimeline: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        property: '',
        budget: '',
        interest: 'medium',
        preferredTimeline: '',
      })
      setErrors({})
    }
  }, [isOpen])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.buyerName.trim()) newErrors.buyerName = 'Name is required'
    if (!formData.buyerEmail.trim()) newErrors.buyerEmail = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail))
      newErrors.buyerEmail = 'Invalid email format'
    if (!formData.buyerPhone.trim()) newErrors.buyerPhone = 'Phone is required'
    if (!formData.property) newErrors.property = 'Property is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        property: formData.property,
        budget: formData.budget ? parseInt(formData.budget) : null,
        interest: formData.interest,
        preferredTimeline: formData.preferredTimeline || null,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide p-6 border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
            Add New Lead
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer Name */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Buyer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => handleFieldChange('buyerName', e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter buyer's name"
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            {errors.buyerName && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.buyerName}
              </div>
            )}
          </div>

          {/* Buyer Email */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.buyerEmail}
              onChange={(e) => handleFieldChange('buyerEmail', e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter buyer's email"
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            {errors.buyerEmail && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.buyerEmail}
              </div>
            )}
          </div>

          {/* Buyer Phone */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.buyerPhone}
              onChange={(e) => handleFieldChange('buyerPhone', e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter buyer's phone"
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            {errors.buyerPhone && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.buyerPhone}
              </div>
            )}
          </div>

          {/* Property */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Property <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.property}
              onChange={(e) => handleFieldChange('property', e.target.value)}
              disabled={isSubmitting}
              className="app-select disabled:opacity-50"
            >
              <option value="">Select a property</option>
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>
                  {prop.title} - {prop.city}
                </option>
              ))}
            </select>
            {errors.property && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.property}
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Budget
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => handleFieldChange('budget', e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter budget (₹)"
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Interest Level */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Interest Level
            </label>
            <select
              value={formData.interest}
              onChange={(e) => handleFieldChange('interest', e.target.value)}
              disabled={isSubmitting}
              className="app-select disabled:opacity-50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Preferred Timeline */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Preferred Timeline
            </label>
            <select
              value={formData.preferredTimeline}
              onChange={(e) => handleFieldChange('preferredTimeline', e.target.value)}
              disabled={isSubmitting}
              className="app-select disabled:opacity-50"
            >
              <option value="">Select timeline</option>
              <option value="ASAP">ASAP</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
