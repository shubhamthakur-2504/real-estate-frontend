import { Card } from '@/components/ui/card'
import { Calendar, Phone, Mail, AlertCircle } from 'lucide-react'

export function UpcomingSchedules({ leads, typeFilter = '' }) {
  const getScheduleEvents = () => {
    const events = []

    leads.forEach((lead) => {
      if (lead.nextFollowupDate) {
        events.push({
          ...lead,
          type: 'followup',
          date: new Date(lead.nextFollowupDate),
          dateString: lead.nextFollowupDate,
          label: 'Follow-up',
        })
      }
      if (lead.viewingScheduledDate) {
        events.push({
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
      return events.filter((event) => event.type === typeFilter).sort((a, b) => a.date - b.date)
    }

    return events.sort((a, b) => a.date - b.date)
  }

  const getStartOfToday = () => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  const formatFullDate = (dateString) => {
    const date = new Date(dateString)
    const today = getStartOfToday()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    if (isToday) return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    if (isTomorrow) return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
    return `${diffDays}d away - ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
  }

  const formatArchivedDate = (dateString) => {
    const date = new Date(dateString)
    const today = getStartOfToday()
    const diffDays = Math.ceil((today - date) / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return `Yesterday - ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
    return `${diffDays}d ago - ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
  }

  const getTypeColor = (type) => {
    return type === 'followup'
      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
      : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
  }

  const allEvents = getScheduleEvents()
  const startOfToday = getStartOfToday()
  const upcomingEvents = allEvents.filter((event) => event.date >= startOfToday)
  const archivedEvents = allEvents.filter((event) => event.date < startOfToday).sort((a, b) => b.date - a.date)

  if (allEvents.length === 0) {
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

      {upcomingEvents.length === 0 ? (
        <Card className="p-4 border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-sm text-light-secondary dark:text-dark-secondary">
          No upcoming schedules. Past schedules are available in archived section below.
        </Card>
      ) : (
        upcomingEvents.map((event, index) => (
          <Card
            key={`${event._id}-${event.type}-${index}`}
            className="p-4 border border-light dark:border-dark hover:shadow-md dark:hover:shadow-dark transition-shadow bg-light-bg dark:bg-dark-bg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-shrink-0 w-32">
                <div className="text-sm font-semibold text-light-primary dark:text-dark-primary">
                  {formatFullDate(event.dateString)}
                </div>
                <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                  {event.label}
                </div>
              </div>

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
        ))
      )}

      {archivedEvents.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-light-secondary dark:text-dark-secondary" />
            <h4 className="text-sm font-semibold text-light-secondary dark:text-dark-secondary">
              Archived Schedules ({archivedEvents.length})
            </h4>
          </div>

          <div className="space-y-2">
            {archivedEvents.map((event, index) => (
              <Card
                key={`archived-${event._id}-${event.type}-${index}`}
                className="p-3 border border-light dark:border-dark bg-light-bg/70 dark:bg-dark-bg/70 opacity-90"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-light-primary dark:text-dark-primary truncate">
                      {event.buyerName || 'N/A'}
                    </div>
                    <div className="text-xs text-light-secondary dark:text-dark-secondary truncate">
                      {formatArchivedDate(event.dateString)} • {event.label} • {event.property?.title || 'N/A'}
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
