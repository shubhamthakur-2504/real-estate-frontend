import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

export function PropertyFormFields({
  formData,
  onFieldChange,
  errors = {},
  isSubmitting = false,
  onRemoveExistingImage = null,
  previewImages = [],
  onPreviewImagesChange = null,
}) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      isNew: true,
    }))
    const updatedPreviews = [...previewImages, ...newPreviews]
    if (onPreviewImagesChange) {
      onPreviewImagesChange(updatedPreviews)
    }
    onFieldChange('images', [...(formData.images || []), ...files])
  }

  const removeImage = (index) => {
    const imageToRemove = previewImages[index]
    
    // If it's an existing image from the server, notify parent to delete it
    if (imageToRemove.publicId && onRemoveExistingImage) {
      onRemoveExistingImage(imageToRemove.publicId)
    }
    
    const updatedPreviews = previewImages.filter((_, i) => i !== index)
    if (onPreviewImagesChange) {
      onPreviewImagesChange(updatedPreviews)
    }
    const newImages = (formData.images || []).filter((_, i) => i !== index)
    onFieldChange('images', newImages)
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="Property title"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Description *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Property description"
          rows="4"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Price *
        </label>
        <input
          type="number"
          value={formData.price || ''}
          onChange={(e) => onFieldChange('price', Number(e.target.value))}
          placeholder="Enter price"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.price && (
          <p className="text-sm text-red-600 mt-1">{errors.price}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Address *
        </label>
        <input
          type="text"
          value={formData.address || ''}
          onChange={(e) => onFieldChange('address', e.target.value)}
          placeholder="Property address"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          City *
        </label>
        <input
          type="text"
          value={formData.city || ''}
          onChange={(e) => onFieldChange('city', e.target.value)}
          placeholder="City"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.city && (
          <p className="text-sm text-red-600 mt-1">{errors.city}</p>
        )}
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Property Type *
        </label>
        <select
          value={formData.type || ''}
          onChange={(e) => onFieldChange('type', e.target.value)}
          className="app-select"
          disabled={isSubmitting}
        >
          <option value="">Select type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type}</p>
        )}
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Area (sq ft) *
        </label>
        <input
          type="number"
          value={formData.area || ''}
          onChange={(e) => onFieldChange('area', Number(e.target.value))}
          placeholder="Area in sq ft"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
        {errors.area && (
          <p className="text-sm text-red-600 mt-1">{errors.area}</p>
        )}
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Bedrooms
        </label>
        <input
          type="number"
          value={formData.bedrooms || ''}
          onChange={(e) => onFieldChange('bedrooms', Number(e.target.value))}
          placeholder="Number of bedrooms"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Bathrooms
        </label>
        <input
          type="number"
          value={formData.bathrooms || ''}
          onChange={(e) => onFieldChange('bathrooms', Number(e.target.value))}
          placeholder="Number of bathrooms"
          className="w-full px-3 py-2 border border-light dark:border-dark rounded-md bg-light dark:bg-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Status
        </label>
        <select
          value={formData.status || 'active'}
          onChange={(e) => onFieldChange('status', e.target.value)}
          className="app-select"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
          Images
        </label>
        <div className="border-2 border-dashed border-light dark:border-dark rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="w-8 h-8 mx-auto mb-2 text-light-secondary dark:text-dark-secondary" />
            <p className="text-sm text-light-secondary dark:text-dark-secondary">
              Click to upload images
            </p>
          </label>
        </div>

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previewImages.map((preview, index) => (
              <div
                key={index}
                className="relative group border border-light dark:border-dark rounded-lg overflow-hidden"
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
