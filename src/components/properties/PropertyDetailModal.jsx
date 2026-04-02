import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function PropertyDetailModal({
  isOpen,
  property,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdating,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !property) return null

  const images = property.images || []
  const hasMultipleImages = images.length > 1

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange(property._id, newStatus)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'sold':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isUpdating && onClose()}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative w-full bg-light dark:bg-dark">
            <img
              src={images[currentImageIndex]?.url || images[currentImageIndex]}
              alt={property.title}
              className="w-full h-96 object-cover"
            />

            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-2">
                {property.title}
              </h2>
              <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-2">
                {property.city}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">
                Price
              </p>
              <p className="text-2xl font-bold text-primary">
                ₹{property.price?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">
                Status
              </p>
              <select
                value={property.status || 'active'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="app-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">
                Area
              </p>
              <p className="text-light-primary dark:text-dark-primary font-semibold">
                {property.propertyArea?.toLocaleString()} sq ft
              </p>
            </div>
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">
                Type
              </p>
              <p className="text-light-primary dark:text-dark-primary font-semibold capitalize">
                {property.propertyType}
              </p>
            </div>
            {property.bedrooms !== undefined && (
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Bedrooms
                </p>
                <p className="text-light-primary dark:text-dark-primary font-semibold">
                  {property.bedrooms}
                </p>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Bathrooms
                </p>
                <p className="text-light-primary dark:text-dark-primary font-semibold">
                  {property.bathrooms}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">
              Address
            </p>
            <p className="text-light-primary dark:text-dark-primary">
              {property.address}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-2">
              Description
            </p>
            <p className="text-light-primary dark:text-dark-primary leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-light dark:border-dark">
            <Button
              onClick={() => {
                onEdit(property)
                onClose()
              }}
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                onDelete(property)
                onClose()
              }}
              disabled={isUpdating}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </Button>
            <Button
              onClick={onClose}
              disabled={isUpdating}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
