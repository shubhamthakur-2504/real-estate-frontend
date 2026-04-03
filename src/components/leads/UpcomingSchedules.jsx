import { Card } from '@/components/ui/card'
import { Calendar, Phone, Mail, AlertCircle } from 'lucide-react'

export function UpcomingSchedules({ leads, typeFilter = '' }) {
  const getUpcomingDates = () => {
    const upcoming = []

    leads.forEach((lead) => {
      if (lead.nextFollowupDate) {
        upcoming.push({
          ...lead,
          type: 'followup',
          date: new Date(lead.nextFollowupDate),
          dateString: lead.nextFollowupDate,
          label: 'Follow-up',
        })
      }
      if (lead.viewingScheduledDate) {
        upcoming.push({
          ...lead,
          type: 'viewing',
          date: new Date(lead.viewingScheduledDate),
          dateString: lead.viewingScheduledDate,
          label: 'Viewing Scheduled',
        })
      }
    })

    // Filter by type if specified
    if (typeFilter) {
      return upcoming.filter((event) => event.type === typeFilter).sort((a, b) => a.date - b.date)
    }

    // Sort by date ascending (nearest first)
    return upcoming.sort((a, b) => a.date - b.date)
  }

  const formatFullDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    if (isToday) return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    if (isTomorrow) return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
    return `${diffDays}d away - ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
  }

  const getTypeColor = (type) => {
    return type === 'followup'
      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
      : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
  }

  const upcomingEvents = getUpcomingDates()

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-12 text-light-secondary dark:text-dark-secondary">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>No {typeFilter === 'followup' ? 'follow-up' : typeFilter === 'viewing' ? 'viewing' : 'upcoming'} schedules</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
          Upcoming Schedules ({upcomingEvents.length})
        </h3>
      </div>

      {upcomingEvents.map((event, index) => (
        <Card
          key={`${event._id}-${event.type}-${index}`}
          className="p-4 border border-light dark:border-dark hover:shadow-md dark:hover:shadow-dark transition-shadow bg-light-bg dark:bg-dark-bg"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Date Section */}
            <div className="flex-shrink-0 w-32">
              <div className="text-sm font-semibold text-light-primary dark:text-dark-primary">
                {formatFullDate(event.dateString)}
              </div>
              <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                {event.label}
              </div>
            </div>

            {/* Lead Info Section */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-light-primary dark:text-dark-primary truncate">
                {event.buyerName || 'N/A'}
              </div>

              <div className="text-sm text-light-secondary dark:text-dark-secondary mt-1 truncate">
                📍 {event.property?.title || 'N/A'}
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs text-light-secondary dark:text-dark-secondary">
                <div className="flex items-center gap-1 truncate">
                  <Mail size={14} />
                  <span className="truncate">{event.buyerEmail || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={14} />
                  {event.buyerPhone || 'N/A'}
                </div>
              </div>

              {/* Status & Interest */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-light dark:bg-dark text-light-primary dark:text-dark-primary font-medium">
                  {event.status}
                </span>
                {event.interest && (
                  <span className="text-xs px-2 py-1 rounded bg-light dark:bg-dark text-light-primary dark:text-dark-primary">
                    Interest: {event.interest}
                  </span>
                )}
              </div>
            </div>

            {/* Agent Info */}
            {event.agent && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs font-medium text-light-primary dark:text-dark-primary">
                  Agent
                </div>
                <div className="text-xs text-light-secondary dark:text-dark-secondary">
                  {event.agent.firstname} {event.agent.lastname || ''}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
