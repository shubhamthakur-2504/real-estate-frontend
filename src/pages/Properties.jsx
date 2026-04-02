import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, MapPin, Eye, Edit2, Trash2 } from 'lucide-react'
import { propertiesApi, uploadsApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { AddPropertyModal } from '@/components/properties/AddPropertyModal'
import { EditPropertyModal } from '@/components/properties/EditPropertyModal'
import { PropertyDetailModal } from '@/components/properties/PropertyDetailModal'
import { DeleteConfirmModal } from '@/components/properties/DeleteConfirmModal'

export function Properties() {
  const { user } = useAuthStore()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const loadProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const isAdmin = user?.role === 'admin'
      const response = isAdmin
        ? await propertiesApi.getAll({ limit: 100 })
        : await propertiesApi.getMyProperties()

      const propsData = response.properties || []
      setProperties(propsData)
      setFilteredProperties(propsData)
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError(err.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [user?.role])

  // Filter properties based on search and type
  useEffect(() => {
    let filtered = properties

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter) {
      filtered = filtered.filter((p) => p.propertyType === typeFilter)
    }

    setFilteredProperties(filtered)
  }, [searchTerm, typeFilter, properties])

  const handleCreateProperty = async (formData) => {
    try {
      setCreating(true)

      const created = await propertiesApi.create({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        city: formData.city,
        propertyType: formData.type,
        propertyArea: Number(formData.area),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        status: formData.status,
      })

      const propertyId = created?._id || created?.id

      if (propertyId && formData.images.length > 0) {
        const uploadFormData = new FormData()
        formData.images.forEach((file) => uploadFormData.append('files', file))
        const uploadRes = await uploadsApi.uploadPropertyImages(uploadFormData)
        const images = uploadRes.images || []

        for (let i = 0; i < images.length; i += 1) {
          const image = images[i]
          await propertiesApi.addImage(propertyId, {
            url: image.url,
            publicId: image.publicId,
            order: i + 1,
          })
        }

        if (images[0]) {
          await propertiesApi.setFeaturedImage(propertyId, {
            url: images[0].url,
            publicId: images[0].publicId,
          })
        }
      }

      toast.success('Property created successfully!')
      setShowAddForm(false)
      await loadProperties()
    } catch (err) {
      console.error('Create property failed:', err)
      toast.error(err.response?.data?.message || 'Failed to create property')
    } finally {
      setCreating(false)
    }
  }

  const handleViewProperty = (property) => {
    setSelectedProperty(property)
    setShowDetailModal(true)
  }

  const handleEditProperty = (property) => {
    setSelectedProperty(property)
    setShowEditModal(true)
    setShowDetailModal(false)
  }

  const handleSubmitEdit = async (propertyId, formData) => {
    try {
      setUpdating(true)

      await propertiesApi.update(propertyId, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        city: formData.city,
        propertyType: formData.type,
        propertyArea: Number(formData.area),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        status: formData.status,
      })

      // Upload new images if any
      if (formData.images.length > 0) {
        const uploadFormData = new FormData()
        formData.images.forEach((file) => uploadFormData.append('files', file))
        const uploadRes = await uploadsApi.uploadPropertyImages(uploadFormData)
        const images = uploadRes.images || []

        for (let i = 0; i < images.length; i += 1) {
          const image = images[i]
          await propertiesApi.addImage(propertyId, {
            url: image.url,
            publicId: image.publicId,
            order: (selectedProperty.images?.length || 0) + i + 1,
          })
        }
      }

      toast.success('Property updated successfully!')
      setShowEditModal(false)
      await loadProperties()
    } catch (err) {
      console.error('Update property failed:', err)
      toast.error(err.response?.data?.message || 'Failed to update property')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return

    try {
      setDeleting(true)
      await propertiesApi.delete(selectedProperty._id)
      toast.success('Property deleted successfully!')
      setShowDeleteConfirm(false)
      setSelectedProperty(null)
      await loadProperties()
    } catch (err) {
      console.error('Delete property failed:', err)
      toast.error(err.response?.data?.message || 'Failed to delete property')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await propertiesApi.update(propertyId, { status: newStatus })
      toast.success(`Property status updated to ${newStatus}`)
      await loadProperties()
    } catch (err) {
      console.error('Status update failed:', err)
      toast.error('Failed to update property status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            {user?.role === 'admin' ? 'All Properties' : 'My Properties'}
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-1">
            {user?.role === 'admin'
              ? 'View and manage platform properties'
              : 'Manage and view your own property listings'}
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:brightness-110"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Property
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {/* Filters */}
      <PropertyFilters
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Properties Table */}
      <Card className="border border-light dark:border-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-secondary dark:text-dark-secondary">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center text-light-secondary dark:text-dark-secondary">
            No properties found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-tertiary dark:bg-dark-tertiary border-b border-light dark:border-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-light-primary dark:text-dark-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light dark:divide-dark">
                {filteredProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-light-primary dark:text-dark-primary">
                        {property.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-light-secondary dark:text-dark-secondary">
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        {property.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-light-primary dark:text-dark-primary">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                        {property.propertyType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-light-primary dark:text-dark-primary">
                        ₹{property.price?.toLocaleString() || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          property.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : property.status === 'sold'
                              ? 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        }`}
                      >
                        {property.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-light dark:border-dark"
                        onClick={() => handleViewProperty(property)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-light dark:border-dark text-primary-600"
                        onClick={() => handleEditProperty(property)}
                      >
                        <Edit2 size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-light dark:border-dark text-red-600"
                        onClick={() => {
                          setSelectedProperty(property)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stats */}
      {!loading && (
        <div className="text-sm text-light-secondary dark:text-dark-secondary">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      )}

      {/* Modals */}
      <AddPropertyModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateProperty}
        isSubmitting={creating}
      />

      <PropertyDetailModal
        isOpen={showDetailModal}
        property={selectedProperty}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEditProperty}
        onDelete={(property) => {
          setShowDetailModal(false)
          setSelectedProperty(property)
          setShowDeleteConfirm(true)
        }}
        onStatusChange={handleStatusChange}
        isUpdating={updating}
      />

      <EditPropertyModal
        isOpen={showEditModal}
        property={selectedProperty}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEdit}
        isSubmitting={updating}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        property={selectedProperty}
        onConfirm={handleDeleteProperty}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setSelectedProperty(null)
        }}
        isDeleting={deleting}
      />
    </div>
  )
}
