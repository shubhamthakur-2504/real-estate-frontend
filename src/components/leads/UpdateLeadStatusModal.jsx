import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, AlertCircle } from 'lucide-react'

export function UpdateLeadStatusModal({
  lead,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    status: 'new',
    interest: 'medium',
    budget: '',
    preferredTimeline: '',
    nextFollowupDate: '',
    viewingScheduledDate: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        status: lead.status || 'new',
        interest: lead.interest || 'medium',
        budget: lead.budget || '',
        preferredTimeline: lead.preferredTimeline || '',
        nextFollowupDate: lead.nextFollowupDate ? lead.nextFollowupDate.split('T')[0] : '',
        viewingScheduledDate: lead.viewingScheduledDate
          ? lead.viewingScheduledDate.split('T')[0]
          : '',
      })
      setErrors({})
    }
  }, [isOpen, lead])

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

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const validateForm = () => {
    const newErrors = {}
    const today = getTodayDate()

    if (!formData.status) newErrors.status = 'Status is required'
    if (formData.nextFollowupDate && formData.nextFollowupDate < today) {
      newErrors.nextFollowupDate = 'Follow-up date cannot be in the past'
    }
    if (formData.viewingScheduledDate && formData.viewingScheduledDate < today) {
      newErrors.viewingScheduledDate = 'Viewing date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  if (!isOpen || !lead) return null

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
            Update Lead Status
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Info */}
        <div className="mb-4 p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Lead:</span> {lead.buyerName || 'N/A'}
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Property:</span> {lead.property?.title || 'N/A'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Lead Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              disabled={isSubmitting}
              className="app-select disabled:opacity-50"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="viewing">Viewing</option>
              <option value="negotiating">Negotiating</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            {errors.status && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.status}
              </div>
            )}
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
              placeholder="Enter budget amount"
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
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

          {/* Next Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Next Follow-up Date
            </label>
            <input
              type="date"
              value={formData.nextFollowupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleFieldChange('nextFollowupDate', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            {errors.nextFollowupDate && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.nextFollowupDate}
              </div>
            )}
          </div>

          {/* Viewing Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Viewing Scheduled Date
            </label>
            <input
              type="date"
              value={formData.viewingScheduledDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleFieldChange('viewingScheduledDate', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            {errors.viewingScheduledDate && (
              <div className="mt-1 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.viewingScheduledDate}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Lead'}
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
