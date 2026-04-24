import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, Calendar, List } from 'lucide-react'
import { bookingRequestsApi, leadsApi, propertiesApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'
import { LeadsFilter } from '@/components/leads/LeadsFilter'
import { LeadsTable } from '@/components/leads/LeadsTable'
import { LeadDetailModal } from '@/components/leads/LeadDetailModal'
import { UpdateLeadStatusModal } from '@/components/leads/UpdateLeadStatusModal'
import { AddNoteModal } from '@/components/leads/AddNoteModal'
import { DeleteConfirmModal } from '@/components/leads/DeleteConfirmModal'
import { AddLeadModal } from '@/components/leads/AddLeadModal'
import { UpcomingSchedules } from '@/components/leads/UpcomingSchedules'
import { SendBookingRequestModal } from '@/components/leads/SendBookingRequestModal'

export function Leads() {
  const PAGE_SIZE = 20
  const { user } = useAuthStore()
  const [leads, setLeads] = useState([])
  const [properties, setProperties] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('all') // 'all' or 'upcoming'

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('') // '' | 'followup' | 'viewing'

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingRequestModalOpen, setBookingRequestModalOpen] = useState(false)

  // Current selected lead
  const [selectedLead, setSelectedLead] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const loadMoreRef = useRef(null)

  const loadLeads = async (targetPage, reset = false) => {
    if (reset) {
      setLoading(true)
      setError(null)
      setHasMore(true)
    } else {
      if (loadingMore || !hasMore) return
      setLoadingMore(true)
    }

    try {
      const isAdmin = user?.role === 'admin'
      const leadsResponse = isAdmin
        ? await leadsApi.getAll({ page: targetPage, limit: PAGE_SIZE })
        : await leadsApi.getAssignedToMe({ page: targetPage, limit: PAGE_SIZE })

      const leadsData = leadsResponse.leads || leadsResponse || []
      const pagination = leadsResponse.pagination || {}
      const nextHasMore = pagination.totalPages
        ? pagination.currentPage < pagination.totalPages
        : leadsData.length === PAGE_SIZE

      setLeads((prev) => {
        if (reset) return leadsData

        const existingIds = new Set(prev.map((item) => item._id))
        const uniqueNew = leadsData.filter((item) => !existingIds.has(item._id))
        return [...prev, ...uniqueNew]
      })

      setHasMore(nextHasMore)
      setCurrentPage(targetPage + 1)
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError(err.message || 'Failed to load leads')
      toast.error('Failed to load leads')
    } finally {
      if (reset) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  // Fetch leads and properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch properties created by logged-in user (agent or admin)
        const propsResponse = await propertiesApi.getPropertiesCreatedByMe()
        const propsData = propsResponse.properties || propsResponse || []
        setProperties(propsData)
      } catch (err) {
        console.error('Error fetching properties:', err)
        toast.error('Failed to load properties list')
      }
    }

    setCurrentPage(1)
    setLeads([])
    loadLeads(1, true)
    fetchProperties()
  }, [user?.role])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && viewMode === 'all' && !loading && !loadingMore && hasMore) {
          loadLeads(currentPage, false)
        }
      },
      { rootMargin: '120px' }
    )

    const target = loadMoreRef.current
    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
      observer.disconnect()
    }
  }, [currentPage, hasMore, loading, loadingMore, viewMode, user?.role])

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          (lead.buyerName?.toLowerCase().includes(term) ||
            lead.buyerEmail?.toLowerCase().includes(term) ||
            lead.buyer?.email?.toLowerCase().includes(term))
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [searchTerm, statusFilter, leads])

  // Handle add lead
  const handleAddLead = () => {
    setAddModalOpen(true)
  }

  // Handle add lead submit
  const handleAddLeadSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      const response = await leadsApi.create({
        propertyId: formData.property,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        budget: formData.budget,
        interest: formData.interest,
        preferredTimeline: formData.preferredTimeline,
      })
      toast.success('Lead created successfully')
      setAddModalOpen(false)
      
      // Extract lead data from response
      const newLead = response.data || response
      setLeads((prev) => [...prev, newLead])
    } catch (err) {
      console.error('Error creating lead:', err)
      toast.error(err.message || 'Failed to create lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle view details
  const handleViewDetails = (lead) => {
    setSelectedLead(lead)
    setDetailModalOpen(true)
  }

  // Handle edit status
  const handleEditStatus = (lead) => {
    setSelectedLead(lead)
    setUpdateModalOpen(true)
  }

  // Handle update status submit
  const handleUpdateStatusSubmit = async (formData) => {
    if (!selectedLead) return

    try {
      setIsSubmitting(true)
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== '')
      )
      await leadsApi.update(selectedLead._id, payload)
      toast.success('Lead updated successfully')
      setUpdateModalOpen(false)

      // Refresh lead
      const response = await leadsApi.getById(selectedLead._id)
      const updatedLead = response.data || response
      setLeads((prev) =>
        prev.map((lead) => (lead._id === selectedLead._id ? updatedLead : lead))
      )
      setSelectedLead(null)
    } catch (err) {
      console.error('Error updating lead:', err)
      toast.error(err.message || 'Failed to update lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle add note
  const handleAddNote = (lead) => {
    setSelectedLead(lead)
    setNoteModalOpen(true)
  }

  // Handle add note submit
  const handleAddNoteSubmit = async (noteText) => {
    if (!selectedLead) return

    try {
      setIsSubmitting(true)
      const newNote = {
        message: noteText,
      }
      const updatedNotes = selectedLead.notes ? [...selectedLead.notes, newNote] : [newNote]
      await leadsApi.update(selectedLead._id, { notes: updatedNotes })
      toast.success('Note added successfully')
      setNoteModalOpen(false)

      // Refresh lead
      const response = await leadsApi.getById(selectedLead._id)
      const updatedLead = response.data || response
      setLeads((prev) =>
        prev.map((lead) => (lead._id === selectedLead._id ? updatedLead : lead))
      )
      setSelectedLead(null)
    } catch (err) {
      console.error('Error adding note:', err)
      toast.error(err.message || 'Failed to add note')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = (lead) => {
    setSelectedLead(lead)
    setDeleteModalOpen(true)
  }

  const handleSendBookingRequest = (lead) => {
    if (lead.status === 'lost' || lead.status === 'converted') {
      toast.error('Cannot send booking token for lost or converted leads')
      return
    }

    setSelectedLead(lead)
    setBookingRequestModalOpen(true)
  }

  const handleSendBookingRequestSubmit = async (payload) => {
    try {
      setIsSubmitting(true)
      await bookingRequestsApi.create(payload)
      toast.success('Booking token request sent to buyer')
      setBookingRequestModalOpen(false)
      setSelectedLead(null)
    } catch (err) {
      console.error('Error sending booking request:', err)
      const message = err?.response?.data?.message || err.message || 'Failed to send booking request'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedLead) return

    try {
      setIsSubmitting(true)
      await leadsApi.delete(selectedLead._id)
      toast.success('Lead deleted successfully')
      setDeleteModalOpen(false)
      setLeads((prev) => prev.filter((lead) => lead._id !== selectedLead._id))
      setSelectedLead(null)
    } catch (err) {
      console.error('Error deleting lead:', err)
      toast.error(err.message || 'Failed to delete lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            Leads
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-1">
            Manage and track your leads
          </p>
        </div>
        <Button
          onClick={handleAddLead}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border border-blue-400/30 font-semibold shadow-lg shadow-blue-900/25 transition-all duration-200 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-800/30 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:from-sky-500 dark:via-blue-500 dark:to-indigo-500 dark:text-slate-950 dark:border-sky-200/20 dark:shadow-sky-900/30 dark:hover:from-sky-400 dark:hover:via-blue-400 dark:hover:to-indigo-400 dark:hover:shadow-sky-800/40 dark:focus-visible:ring-sky-300/50 dark:focus-visible:ring-offset-slate-900 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Lead
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

      {/* View Tabs */}
      <div className="flex gap-0 border-b border-light dark:border-dark pt-6">
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            viewMode === 'all'
              ? 'text-primary dark:text-primary'
              : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
          }`}
        >
          <List size={18} />
          All Leads
          {viewMode === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setViewMode('upcoming')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            viewMode === 'upcoming'
              ? 'text-primary dark:text-primary'
              : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
          }`}
        >
          <Calendar size={18} />
          Upcoming Schedules
          {viewMode === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
          )}
        </button>
      </div>

      {/* Filter */}
      {viewMode === 'all' && (
        <LeadsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      )}

      {/* Content Based on View Mode */}
      {viewMode === 'all' ? (
        <>
          {/* Leads Table */}
          <LeadsTable
            leads={filteredLeads}
            onViewDetails={handleViewDetails}
            onEditStatus={handleEditStatus}
            onAddNote={handleAddNote}
            onSendBookingRequest={handleSendBookingRequest}
            onDelete={handleDelete}
            loading={loading}
          />

          <div ref={loadMoreRef} className="h-6" />
          {!loading && loadingMore && (
            <div className="text-center text-sm text-light-secondary dark:text-dark-secondary">
              Loading more leads...
            </div>
          )}
          {!loading && !hasMore && leads.length > 0 && (
            <div className="text-center text-sm text-light-secondary dark:text-dark-secondary">
              You've reached the end.
            </div>
          )}

          {/* Stats */}
          {!loading && (
            <div className="text-sm text-light-secondary dark:text-dark-secondary">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          )}
        </>
      ) : (
        <>
          {/* Upcoming Schedules Filter */}
          <Card className="p-4 border border-light dark:border-dark">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-light-primary dark:text-dark-primary whitespace-nowrap">
                Filter by Type:
              </label>
              <select
                value={scheduleTypeFilter}
                onChange={(e) => setScheduleTypeFilter(e.target.value)}
                className="app-select"
              >
                <option value="">All Schedules</option>
                <option value="followup">Follow-ups Only</option>
                <option value="viewing">Viewings Only</option>
              </select>
            </div>
          </Card>

          {/* Upcoming Schedules View */}
          <UpcomingSchedules leads={leads} typeFilter={scheduleTypeFilter} />
        </>
      )}

      {/* Modals */}
      <AddLeadModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddLeadSubmit}
        properties={properties}
        isSubmitting={isSubmitting}
      />

      <LeadDetailModal
        lead={selectedLead}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedLead(null)
        }}
      />

      <UpdateLeadStatusModal
        lead={selectedLead}
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false)
          setSelectedLead(null)
        }}
        onSubmit={handleUpdateStatusSubmit}
        isSubmitting={isSubmitting}
      />

      <AddNoteModal
        lead={selectedLead}
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false)
          setSelectedLead(null)
        }}
        onSubmit={handleAddNoteSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        lead={selectedLead}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedLead(null)
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
      />

      <SendBookingRequestModal
        lead={selectedLead}
        isOpen={bookingRequestModalOpen}
        onClose={() => {
          setBookingRequestModalOpen(false)
          setSelectedLead(null)
        }}
        onSubmit={handleSendBookingRequestSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
