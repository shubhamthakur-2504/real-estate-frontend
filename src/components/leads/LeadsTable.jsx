import { Button } from '@/components/ui/button'
import { Mail, Phone, Calendar, Eye, Edit, Trash2, MessageSquare, Wallet } from 'lucide-react'

export function LeadsTable({
  leads,
  onViewDetails,
  onEditStatus,
  onAddNote,
  onSendBookingRequest,
  onDelete,
  loading,
}) {
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
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

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

  if (loading) {
    return (
      <div className="text-center py-8 text-light-secondary dark:text-dark-secondary">
        Loading leads...
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-light-secondary dark:text-dark-secondary">
        No leads found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => {
        const isTokenBlocked = lead.status === 'lost' || lead.status === 'converted'
        return (
        <div
          key={lead._id}
          className="p-4 border border-light dark:border-dark rounded-lg hover:shadow-md dark:hover:shadow-dark transition-shadow bg-light-bg dark:bg-dark-bg"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-light-primary dark:text-dark-primary">
                  {getLeadName(lead)}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getLeadStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'N/A'}
                </span>
              </div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">
                Interested in: {lead.property?.title || 'Property'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 text-sm">
            <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary">
              <Mail size={14} className="flex-shrink-0" />
              <a
                href={`mailto:${getLeadEmail(lead)}`}
                className="text-primary-600 hover:underline truncate"
              >
                {getLeadEmail(lead)}
              </a>
            </div>
            <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary">
              <Phone size={14} className="flex-shrink-0" />
              <a
                href={`tel:${getLeadPhone(lead)}`}
                className="hover:text-primary-600 truncate"
              >
                {getLeadPhone(lead)}
              </a>
            </div>
            <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary">
              <Calendar size={14} className="flex-shrink-0" />
              <span>{formatDate(lead.createdAt)}</span>
            </div>
            {lead.budget && (
              <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary">
                <span className="font-medium">Budget:</span>
                <span>₹{lead.budget?.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails(lead)}
              variant="outline"
              size="sm"
              className="border-light dark:border-dark"
            >
              <Eye size={14} className="mr-1" />
              View
            </Button>
            <Button
              onClick={() => onEditStatus(lead)}
              variant="outline"
              size="sm"
              className="border-light dark:border-dark"
            >
              <Edit size={14} className="mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => onAddNote(lead)}
              variant="outline"
              size="sm"
              className="border-light dark:border-dark"
            >
              <MessageSquare size={14} className="mr-1" />
              Note
            </Button>
            <Button
              onClick={() => onSendBookingRequest(lead)}
              variant="outline"
              size="sm"
              className="border-light dark:border-dark"
              disabled={isTokenBlocked}
              title={isTokenBlocked ? 'Token request is disabled for lost/converted leads' : 'Send booking token request'}
            >
              <Wallet size={14} className="mr-1" />
              Token
            </Button>
            <Button
              onClick={() => onDelete(lead)}
              variant="outline"
              size="sm"
              className="border-light dark:border-dark text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
        )
      })}
    </div>
  )
}
