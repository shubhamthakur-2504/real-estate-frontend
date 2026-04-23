import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, MapPin, BedDouble, Bath, Ruler, Phone, Mail, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { leadsApi, authApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'

export function BuyerPropertyDetailModal({ property, isOpen, onClose, onInquirySent }) {
  const { user, setUser } = useAuthStore()
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [formData, setFormData] = useState({
    buyerName: user?.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : '',
    buyerEmail: user?.email || '',
    buyerPhone: user?.phone || '',
    interest: 'medium',
    budget: property?.price || '',
  })
  const [errors, setErrors] = useState({})

  // Auto-fill form when property changes or user logs in
  useEffect(() => {
    if (property || user) {
      setFormData((prev) => ({
        ...prev,
        buyerName: user?.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : prev.buyerName,
        buyerEmail: user?.email || prev.buyerEmail,
        buyerPhone: user?.phone || prev.buyerPhone,
        budget: property?.price || prev.budget,
      }))
    }
  }, [property, user])

  // Reset image carousel when property changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setImageLoading(true)
  }, [property?._id])

  if (!isOpen || !property) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.buyerName?.trim()) newErrors.buyerName = 'Name is required'
    if (!formData.buyerEmail?.trim()) newErrors.buyerEmail = 'Email is required'
    if (formData.buyerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = 'Invalid email'
    }
    if (!formData.buyerPhone?.trim()) newErrors.buyerPhone = 'Phone is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendInquiry = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      console.log('=== SEND INQUIRY DEBUG ===')
      console.log('User ID:', user?._id)
      console.log('User email:', user?.email)
      console.log('User role:', user?.role)
      
      const inquiryPayload = {
        propertyId: property._id,
        buyerId: user?._id,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        interest: formData.interest,
        budget: formData.budget ? parseInt(formData.budget) : null,
        source: 'property_page',
      }
      console.log('Sending inquiry payload:', inquiryPayload)
      
      await leadsApi.create(inquiryPayload)

      // Update buyer profile with phone number if not already set
      if (!user?.phone || user.phone !== formData.buyerPhone) {
        try {
          const updatedUserRes = await authApi.updateProfile({
            phone: formData.buyerPhone,
          })
          if (updatedUserRes.user) {
            setUser(updatedUserRes.user)
          }
        } catch (err) {
          console.error('Error updating profile with phone:', err)
          // Don't show error toast, the inquiry was successfully sent
        }
      }

      toast.success('Inquiry sent successfully! An agent will contact you soon.')
      setShowInquiryForm(false)
      setFormData({
        buyerName: user?.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : '',
        buyerEmail: user?.email || '',
        buyerPhone: user?.phone || '',
        interest: 'medium',
        budget: property?.price || '',
      })
      onInquirySent?.()
    } catch (err) {
      console.error('Error sending inquiry:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send inquiry'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toLocaleString()}` : 'Price on request'

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => typeof img === 'string' ? img : img.url)
    : []
  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setImageLoading(true)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageLoading(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-4 z-10 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full md:absolute md:top-4 md:right-4"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-6">
          {/* Image Carousel Section */}
          <div className="relative">
            {images.length > 0 ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-gray-100 dark:bg-gray-800">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Loading Image...</span>
                  </div>
                )}
                <img
                  src={currentImage}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                
                {/* Image Counter & Navigation */}
                {images.length > 1 && (
                  <>
                    {/* Image Counter */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    {/* Previous Button */}
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-2 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-2 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">No images available</span>
              </div>
            )}
          </div>

          {/* Property Title & Price */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {property.title}
            </h2>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {formatPrice(property.price)}
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-center mb-2">
                <BedDouble className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {property.bedrooms || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
            </Card>
            <Card className="p-4 text-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-center mb-2">
                <Bath className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {property.bathrooms || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
            </Card>
            <Card className="p-4 text-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-center mb-2">
                <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {property.propertyArea ? `${property.propertyArea} sqft` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
            </Card>
          </div>

          {/* Inquiry Form or Button */}
          {!showInquiryForm ? (
            <div className="space-y-3">
              <Button
                onClick={() => setShowInquiryForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg"
              >
                Send Inquiry
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Booking token payment is available after agent approval from the booking requests page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Send Inquiry</h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.buyerName && (
                  <div className="mt-1 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.buyerName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.buyerEmail && (
                  <div className="mt-1 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.buyerEmail}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.buyerPhone && (
                  <div className="mt-1 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.buyerPhone}
                  </div>
                )}
              </div>

              {/* Interest Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interest Level
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget (Optional)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Your budget"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInquiryForm(false)}
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-600 px-6 py-2 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 px-6 py-2 font-medium"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
