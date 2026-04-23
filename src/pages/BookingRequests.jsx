import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CalendarClock, CheckCircle2, Clock3, Home, IndianRupee } from 'lucide-react'
import { bookingRequestsApi, paymentsApi } from '@/services'
import { loadRazorpayScript } from '@/utils/loadRazorpay'
import { useAuthStore } from '@/utils/authStore'
import { toast } from 'sonner'

export function BookingRequests() {
  const { user } = useAuthStore()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState({})

  const pendingCount = useMemo(
    () => requests.filter((item) => item.status === 'pending').length,
    [requests]
  )

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await bookingRequestsApi.getMy()
      setRequests(res.bookingRequests || [])
    } catch (err) {
      console.error('Error fetching booking requests:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load booking requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const getTimeLeftText = (expiresAt) => {
    const expiresMs = new Date(expiresAt).getTime()
    const diffMs = expiresMs - Date.now()

    if (diffMs <= 0) return 'Expired'

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours >= 24) {
      const days = Math.ceil(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} left`
    }

    return `${hours}h ${minutes}m left`
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

  const handlePay = async (request) => {
    const requestId = request._id

    try {
      setPaying((prev) => ({ ...prev, [requestId]: true }))

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (!keyId) {
        toast.error('Missing VITE_RAZORPAY_KEY_ID in frontend env')
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Unable to load Razorpay checkout script')
        return
      }

      const order = await paymentsApi.createOrder(requestId)

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Real Estate Platform',
        description: `Booking token for ${request.property?.title || 'property'}`,
        order_id: order.orderId,
        prefill: {
          name: user?.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          bookingRequestId: requestId,
          paymentId: order.paymentId,
        },
        handler: async (response) => {
          try {
            await paymentsApi.verifyOrder(response)
            toast.success('Booking token paid successfully')
            await fetchRequests()
          } catch (verifyErr) {
            try {
              const reconciled = await paymentsApi.reconcile(order.paymentId)
              if (reconciled.status === 'paid') {
                toast.success('Booking token paid successfully')
                await fetchRequests()
                return
              }
            } catch (reconcileErr) {
              console.error('Reconcile failed:', reconcileErr)
            }

            const message = verifyErr?.response?.data?.message || verifyErr.message || 'Payment verification failed'
            toast.error(message)
          }
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', async () => {
        try {
          await paymentsApi.reconcile(order.paymentId)
        } catch (error) {
          console.error('Reconcile failed after payment failure:', error)
        }
        toast.error('Payment failed or cancelled')
      })
      razorpay.open()
    } catch (err) {
      console.error('Error creating payment order:', err)
      const message = err?.response?.data?.message || err.message || 'Unable to start payment'
      toast.error(message)
    } finally {
      setPaying((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      cancelled: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      expired: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      refunded: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${classes[status] || classes.pending}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">Booking Requests</h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Pay booking tokens only for approved requests from your agent.
        </p>
      </div>

      <Card className="p-4 border border-light dark:border-dark">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-600" size={20} />
          <p className="text-sm text-light-primary dark:text-dark-primary">
            You have <span className="font-semibold">{pendingCount}</span> active request{pendingCount === 1 ? '' : 's'} waiting for payment.
          </p>
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
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          No booking requests yet. After inquiry and property visit, your agent can send a token request.
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((request) => {
            const isPending = request.status === 'pending'
            const isExpiredByTime = new Date(request.expiresAt).getTime() <= Date.now()

            return (
              <Card key={request._id} className="p-5 border border-light dark:border-dark space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-light-primary dark:text-dark-primary line-clamp-2">
                      {request.property?.title || 'Property'}
                    </h3>
                    <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1 flex items-center gap-1.5">
                      <Home size={14} />
                      {request.property?.city || 'N/A'}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark">
                    <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                      <IndianRupee size={14} /> Token Amount
                    </p>
                    <p className="font-semibold text-light-primary dark:text-dark-primary mt-1">
                      {Number(request.tokenAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark">
                    <p className="text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                      <CalendarClock size={14} />
                      {request.status === 'pending'
                        ? 'Expires'
                        : request.status === 'paid'
                          ? 'Paid On'
                          : request.status === 'completed'
                            ? 'Completed On'
                            : 'Updated'}
                    </p>
                    <p className="font-semibold text-light-primary dark:text-dark-primary mt-1">
                      {request.status === 'pending'
                        ? getTimeLeftText(request.expiresAt)
                        : request.status === 'paid'
                          ? formatDateTime(request.paidAt)
                          : request.status === 'completed'
                            ? formatDateTime(request.completedAt)
                            : formatDateTime(request.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={() => handlePay(request)}
                    disabled={!isPending || isExpiredByTime || !!paying[request._id]}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
                  >
                    {paying[request._id]
                      ? 'Initializing...'
                      : isPending
                        ? 'Pay Booking Token'
                        : 'Not Payable'}
                  </Button>
                  <p className="mt-2 text-xs text-light-secondary dark:text-dark-secondary flex items-center gap-1.5">
                    <Clock3 size={12} />
                    Property remains public until payment succeeds, then it moves to on-hold.
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
