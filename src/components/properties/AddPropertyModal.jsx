import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { PropertyFormFields } from './PropertyFormFields'

export function AddPropertyModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    type: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    status: 'active',
    images: [],
    previewImages: [],
  })
  const [previewImages, setPreviewImages] = useState([])
  const [errors, setErrors] = useState({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        price: '',
        address: '',
        city: '',
        type: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        status: 'active',
        images: [],
        previewImages: [],
      })
      setPreviewImages([])
      setErrors({})
    }
  }, [isOpen])

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim())
      newErrors.description = 'Description is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.type) newErrors.type = 'Property type is required'
    if (!formData.area) newErrors.area = 'Area is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

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

  const handlePreviewImagesChange = (newPreviews) => {
    setPreviewImages(newPreviews)
    setFormData((prev) => ({
      ...prev,
      previewImages: newPreviews,
    }))
  }

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
            Add New Property
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertyFormFields
            formData={formData}
            onFieldChange={handleFieldChange}
            errors={errors}
            isSubmitting={isSubmitting}
            previewImages={previewImages}
            onPreviewImagesChange={handlePreviewImagesChange}
          />

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Property'}
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
