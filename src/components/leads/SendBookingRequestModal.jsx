import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function SendBookingRequestModal({ lead, isOpen, onClose, onSubmit, isSubmitting }) {
  const [tokenAmount, setTokenAmount] = useState('')
  const [expiresInDays, setExpiresInDays] = useState(3)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setTokenAmount('')
      setExpiresInDays(3)
      setNotes('')
    }
  }, [isOpen])

  if (!isOpen || !lead) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      leadId: lead._id,
      tokenAmount: tokenAmount ? Number(tokenAmount) : undefined,
      expiresInDays: Number(expiresInDays),
      notes: notes?.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-lg p-6 border border-light dark:border-dark" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">Send Booking Token Request</h3>
          <button onClick={onClose} className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4">
          Buyer: <span className="font-medium text-light-primary dark:text-dark-primary">{lead.buyerName || lead.buyer?.firstname || 'N/A'}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-1">Token Amount (INR)</label>
            <input
              type="number"
              min="1"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Leave blank for auto amount"
              className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-1">Expires In (Days)</label>
            <input
              type="number"
              min="1"
              max="7"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-1">Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add message for buyer"
              className="w-full px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border border-blue-400/30 font-semibold shadow-lg shadow-blue-900/25 transition-all duration-200 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-800/30 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:from-sky-500 dark:via-blue-500 dark:to-indigo-500 dark:text-slate-950 dark:border-sky-200/20 dark:shadow-sky-900/30 dark:hover:from-sky-400 dark:hover:via-blue-400 dark:hover:to-indigo-400 dark:hover:shadow-sky-800/40 dark:focus-visible:ring-sky-300/50 dark:focus-visible:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed px-5"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
