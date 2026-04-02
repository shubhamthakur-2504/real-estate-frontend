import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'

export function PropertyFilters({ searchTerm, typeFilter, onSearchChange, onTypeFilterChange }) {
  return (
    <Card className="p-4 border border-light dark:border-dark">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary" />
          <input
            type="text"
            placeholder="Search properties by title or city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light dark:border-dark text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-primary-600"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="app-select"
        >
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
      </div>
    </Card>
  )
}
