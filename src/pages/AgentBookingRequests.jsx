import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CalendarClock, CheckCircle2, Clock3, IndianRupee, User } from 'lucide-react'
import { bookingRequestsApi } from '@/services'
import { toast } from 'sonner'

export function AgentBookingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await bookingRequestsApi.getAgentMy(statusFilter || undefined)
      setRequests(res.bookingRequests || [])
    } catch (err) {
      console.error('Error loading booking requests:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load booking requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const stats = useMemo(() => {
    return {
      pending: requests.filter((r) => r.status === 'pending').length,
      paid: requests.filter((r) => r.status === 'paid').length,
      refunded: requests.filter((r) => r.status === 'refunded').length,
    }
  }, [requests])

  const formatExpiry = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours >= 24) {
      const days = Math.ceil(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} left`
    }
    return `${hours}h left`
  }

  const formatDateTime = (value) => {
    if (!value) return 'N/A'
    return new Date(value).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const doAction = async (id, action) => {
    const reason = window.prompt(`Optional reason for ${action}:`) || undefined
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }))
      if (action === 'cancel') {
        await bookingRequestsApi.cancel(id, reason)
        toast.success('Booking request cancelled')
      } else if (action === 'complete') {
        await bookingRequestsApi.complete(id)
        toast.success('Booking completed and property marked sold')
      } else {
        await bookingRequestsApi.refund(id, reason)
        toast.success('Booking request marked refunded')
      }
      await fetchRequests()
    } catch (err) {
      console.error(`Failed to ${action}:`, err)
      toast.error(err?.response?.data?.message || err.message || `Failed to ${action}`)
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">Booking Token Requests</h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Track pending token requests and verify who has paid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 border border-light dark:border-dark">Pending: <span className="font-semibold">{stats.pending}</span></Card>
        <Card className="p-4 border border-light dark:border-dark">Paid: <span className="font-semibold">{stats.paid}</span></Card>
        <Card className="p-4 border border-light dark:border-dark">Refunded: <span className="font-semibold">{stats.refunded}</span></Card>
      </div>

      <Card className="p-4 border border-light dark:border-dark">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-light-primary dark:text-dark-primary">Filter:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="app-select">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">Loading booking requests...</Card>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">No booking requests found.</Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((request) => (
            <Card key={request._id} className="p-5 border border-light dark:border-dark space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-light-primary dark:text-dark-primary line-clamp-2">{request.property?.title || 'Property'}</h3>
                  <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">{request.property?.city || 'N/A'}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{request.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark">
                  <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-1.5"><IndianRupee size={14} />Token</p>
                  <p className="font-semibold text-light-primary dark:text-dark-primary mt-1">{Number(request.tokenAmount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark">
                  <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                    <CalendarClock size={14} />
                    {request.status === 'pending' ? 'Expiry' : request.status === 'paid' ? 'Paid On' : request.status === 'completed' ? 'Completed On' : 'Updated'}
                  </p>
                  <p className="font-semibold text-light-primary dark:text-dark-primary mt-1">
                    {request.status === 'pending'
                      ? formatExpiry(request.expiresAt)
                      : request.status === 'paid'
                        ? formatDateTime(request.paidAt)
                        : request.status === 'completed'
                          ? formatDateTime(request.completedAt)
                          : formatDateTime(request.updatedAt)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                <User size={14} />
                Buyer: {request.buyer?.firstname || 'N/A'} {request.buyer?.lastname || ''}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={request.status !== 'pending' || !!actionLoading[request._id]}
                  onClick={() => doAction(request._id, 'cancel')}
                >
                  {actionLoading[request._id] ? 'Working...' : 'Cancel'}
                </Button>
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={request.status !== 'paid' || !!actionLoading[request._id]}
                  onClick={() => doAction(request._id, 'refund')}
                >
                  {actionLoading[request._id] ? 'Working...' : 'Mark Refunded'}
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={request.status !== 'paid' || !!actionLoading[request._id]}
                  onClick={() => doAction(request._id, 'complete')}
                >
                  {actionLoading[request._id] ? 'Working...' : 'Mark Sold'}
                </Button>
              </div>

              <p className="text-xs text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                <Clock3 size={12} />
                Paid requests indicate buyer token received.
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
