import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Mail, Phone, Briefcase, Target, Clock } from 'lucide-react'

export function LeadDetailModal({ lead, isOpen, onClose }) {
  if (!isOpen || !lead) return null

  const getLeadName = (lead) => {
    if (lead.buyer?.firstname) return `${lead.buyer.firstname} ${lead.buyer.lastname || ''}`.trim()
    if (lead.buyer?.firstName) return `${lead.buyer.firstName} ${lead.buyer.lastName || ''}`.trim()
    if (lead.buyerName) return lead.buyerName
    return 'Lead Name'
  }

  const getLeadEmail = (lead) => {
    return lead.buyer?.email || lead.buyerEmail || 'N/A'
  }

  const getLeadPhone = (lead) => {
    return lead.buyer?.phone || lead.buyerPhone || 'N/A'
  }

  const getLeadStatusColor = (status) => {
    const statusMap = {
      new: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      contacted: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
      interested: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
      viewing: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      negotiating: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
      converted: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      lost: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    }
    return statusMap[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide p-6 border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
            Lead Details
          </h3>
          <button
            onClick={onClose}
            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Name & Status */}
        <div className="mb-6 pb-4 border-b border-light dark:border-dark">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
              {getLeadName(lead)}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getLeadStatusColor(
                lead.status
              )}`}
            >
              {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'N/A'}
            </span>
          </div>
          <p className="text-light-secondary dark:text-dark-secondary">
            Interested in: {lead.property?.title || 'Property'}
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
            Contact Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-light-secondary dark:text-dark-secondary">
              <Mail size={18} className="flex-shrink-0" />
              <a
                href={`mailto:${getLeadEmail(lead)}`}
                className="text-primary-600 hover:underline"
              >
                {getLeadEmail(lead)}
              </a>
            </div>
            <div className="flex items-center gap-3 text-light-secondary dark:text-dark-secondary">
              <Phone size={18} className="flex-shrink-0" />
              <a href={`tel:${getLeadPhone(lead)}`} className="hover:text-primary-600">
                {getLeadPhone(lead)}
              </a>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="mb-6">
          <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
            Lead Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lead.budget && (
              <div className="p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
                <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-1">
                  <Briefcase size={16} />
                  <span className="text-sm font-medium">Budget</span>
                </div>
                <p className="text-light-primary dark:text-dark-primary font-semibold">
                  ₹{lead.budget?.toLocaleString()}
                </p>
              </div>
            )}
            {lead.preferredTimeline && (
              <div className="p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
                <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-1">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Timeline</span>
                </div>
                <p className="text-light-primary dark:text-dark-primary font-semibold">
                  {lead.preferredTimeline}
                </p>
              </div>
            )}
            {lead.interest && (
              <div className="p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
                <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-1">
                  <Target size={16} />
                  <span className="text-sm font-medium">Interest Level</span>
                </div>
                <p className="text-light-primary dark:text-dark-primary font-semibold capitalize">
                  {lead.interest}
                </p>
              </div>
            )}
            {lead.source && (
              <div className="p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
                <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-1">
                  <span className="text-sm font-medium">Source</span>
                </div>
                <p className="text-light-primary dark:text-dark-primary font-semibold capitalize">
                  {lead.source?.replace(/_/g, ' ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="mb-6">
          <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
            Dates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-light-secondary dark:text-dark-secondary">Created:</span>
              <p className="text-light-primary dark:text-dark-primary font-medium">
                {formatDate(lead.createdAt)}
              </p>
            </div>
            {lead.lastContactedAt && (
              <div>
                <span className="text-light-secondary dark:text-dark-secondary">Last Contacted:</span>
                <p className="text-light-primary dark:text-dark-primary font-medium">
                  {formatDate(lead.lastContactedAt)}
                </p>
              </div>
            )}
            {lead.nextFollowupDate && (
              <div>
                <span className="text-light-secondary dark:text-dark-secondary">
                  Next Follow-up:
                </span>
                <p className="text-light-primary dark:text-dark-primary font-medium">
                  {formatDate(lead.nextFollowupDate)}
                </p>
              </div>
            )}
            {lead.viewingScheduledDate && (
              <div>
                <span className="text-light-secondary dark:text-dark-secondary">
                  Viewing Scheduled:
                </span>
                <p className="text-light-primary dark:text-dark-primary font-medium">
                  {formatDate(lead.viewingScheduledDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {lead.notes && lead.notes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
              Notes ({lead.notes.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {lead.notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark"
                >
                  <p className="text-light-primary dark:text-dark-primary text-sm mb-1">
                    {note?.message || note}
                  </p>
                  <span className="text-xs text-light-secondary dark:text-dark-secondary">
                    {note?.createdAt ? formatDate(note.createdAt) : 'No date'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-light dark:border-dark">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
