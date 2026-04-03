import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Filter, AlertCircle, Edit2, MapPin, Building2 } from 'lucide-react'
import { leadsApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'

export function BuyerInquiries() {
  const { user } = useAuthStore()
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modal states
  const [editingId, setEditingId] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch buyer's inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching buyer inquiries...')
        
        const res = await leadsApi.getMyInquiries({ limit: 100 })
        
        console.log('Response from API:', res)
        console.log('Response type:', typeof res)
        console.log('Response keys:', Object.keys(res || {}))
        
        // Handle both response formats
        const inquiriesData = res?.leads || res?.data?.leads || []
        
        console.log('Parsed inquiries:', inquiriesData)
        console.log('Inquiries type:', typeof inquiriesData)
        console.log('Is array:', Array.isArray(inquiriesData))
        console.log('Inquiries count:', inquiriesData?.length || 0)
        
        if (!Array.isArray(inquiriesData)) {
          console.warn('Inquiries data is not an array:', inquiriesData)
          setInquiries([])
        } else {
          setInquiries(inquiriesData)
        }
      } catch (err) {
        console.error('Full error object:', err)
        console.error('Error message:', err.message)
        console.error('Error response:', err.response)
        setError(err.message || 'Failed to load your inquiries')
        toast.error('Failed to load inquiries: ' + (err.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchInquiries()
  }, [])

  // Filter inquiries based on search and status
  useEffect(() => {
    let filtered = inquiries

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (inquiry) =>
          inquiry.property?.title?.toLowerCase().includes(term) ||
          inquiry.property?.address?.toLowerCase().includes(term) ||
          inquiry.property?.city?.toLowerCase().includes(term)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((inquiry) => inquiry.status === statusFilter)
    }

    setFilteredInquiries(filtered)
  }, [searchTerm, statusFilter, inquiries])

  const handleStatusUpdate = async (inquiryId, status) => {
    try {
      setIsUpdating(true)
      await leadsApi.updateStatus(inquiryId, status)
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq))
      )
      setEditingId(null)
      setNewStatus('')
      toast.success('Status updated successfully')
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      contacted: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      interested: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      viewing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      negotiating: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      converted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      lost: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    }
    return colors[status] || colors.new
  }

  const statusOptions = ['new', 'contacted', 'interested', 'viewing', 'negotiating', 'converted', 'lost']
  // Buyers can only edit to these statuses (exclude 'new', 'contacted', 'converted', 'lost')
  const editableStatusOptions = ['interested', 'viewing', 'negotiating']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Inquiries</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track properties you're interested in and manage your inquiry status
        </p>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by property name, address, or city"
              className="w-full pl-9 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {(searchTerm || statusFilter) && (
            <Button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
          Loading your inquiries...
        </Card>
      ) : filteredInquiries.length === 0 ? (
        <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
          {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>

          <div className="grid gap-4">
            {filteredInquiries.map((inquiry) => (
              <Card
                key={inquiry._id}
                className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Property Info */}
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
                      {inquiry.property?.title || 'Property'}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{inquiry.property?.address}</p>
                        <p>{inquiry.property?.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building2 size={16} />
                      <span className="text-sm capitalize">
                        {inquiry.property?.propertyType || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Details */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ₹{inquiry.property?.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Interest Level</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {inquiry.interest || 'Not specified'}
                      </p>
                    </div>
                    {inquiry.budget && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your Budget</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ₹{inquiry.budget.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status Update */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    {editingId === inquiry._id ? (
                      <div className="space-y-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Select Status</option>
                          {editableStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(inquiry._id, newStatus)}
                            disabled={isUpdating || !newStatus}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isUpdating ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null)
                              setNewStatus('')
                            }}
                            disabled={isUpdating}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(inquiry._id)
                            setNewStatus(inquiry.status)
                          }}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14} />
                          Edit Status
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    Created: {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
