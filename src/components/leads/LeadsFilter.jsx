import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'

export function LeadsFilter({ searchTerm, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <Card className="p-4 border border-light dark:border-dark">
      <div className="flex gap-4 items-center flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <Search size={18} className="text-light-secondary dark:text-dark-secondary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-b border-light dark:border-dark px-2 py-1 text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-light-primary dark:text-dark-primary whitespace-nowrap">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="app-select"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="viewing">Viewing</option>
            <option value="negotiating">Negotiating</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
