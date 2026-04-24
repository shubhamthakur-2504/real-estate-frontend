import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, BarChart3, Home, TrendingUp, Users, Wallet } from 'lucide-react'
import { bookingRequestsApi, leadsApi, propertiesApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'

const LEAD_STATUS_ORDER = ['new', 'contacted', 'interested', 'viewing', 'negotiating', 'converted', 'lost']
const DATE_RANGE_OPTIONS = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'All', value: 'all' },
]

const pct = (value, total) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

const formatMonth = (date) => {
  return new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date)
}

const makeRecentMonths = (count) => {
  const now = new Date()
  const months = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: formatMonth(d),
    })
  }
  return months
}

const fetchAllPages = async (pageFetcher, pageSize = 100) => {
  let page = 1
  let totalPages = 1
  const allItems = []

  while (page <= totalPages) {
    const res = await pageFetcher({ page, limit: pageSize })
    const items = res?.properties || res?.leads || []
    allItems.push(...items)

    const pagination = res?.pagination
    if (pagination?.totalPages) {
      totalPages = pagination.totalPages
    } else {
      totalPages = items.length === pageSize ? page + 1 : page
    }

    page += 1
  }

  return allItems
}

export function Analytics() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [properties, setProperties] = useState([])
  const [leads, setLeads] = useState([])
  const [bookingRequests, setBookingRequests] = useState([])
  const [dateRange, setDateRange] = useState('30d')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedPropertyType, setSelectedPropertyType] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const isAdmin = user?.role === 'admin'

        const [propertyData, leadData, bookingRes] = await Promise.all([
          fetchAllPages((params) => (isAdmin ? propertiesApi.getAll(params) : propertiesApi.getMyProperties(params))),
          fetchAllPages((params) => (isAdmin ? leadsApi.getAll(params) : leadsApi.getAssignedToMe(params))),
          bookingRequestsApi.getAgentMy(),
        ])

        setProperties(propertyData)
        setLeads(leadData)
        setBookingRequests(bookingRes?.bookingRequests || [])
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError(err?.response?.data?.message || err.message || 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.role])

  const propertyMetaMap = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property._id?.toString()] = property
      return acc
    }, {})
  }, [properties])

  const dateCutoff = useMemo(() => {
    if (dateRange === 'all') return null

    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return cutoff
  }, [dateRange])

  const cities = useMemo(() => {
    const citySet = new Set()
    properties.forEach((property) => {
      if (property.city) citySet.add(property.city)
    })
    return Array.from(citySet).sort((a, b) => a.localeCompare(b))
  }, [properties])

  const propertyTypes = useMemo(() => {
    const typeSet = new Set()
    properties.forEach((property) => {
      if (property.propertyType) typeSet.add(property.propertyType)
    })
    return Array.from(typeSet).sort((a, b) => a.localeCompare(b))
  }, [properties])

  const matchesDate = (dateValue) => {
    if (!dateCutoff) return true
    if (!dateValue) return false
    return new Date(dateValue) >= dateCutoff
  }

  const matchesPropertyFilters = (property) => {
    if (!property) return false
    if (selectedCity !== 'all' && property.city !== selectedCity) return false
    if (selectedPropertyType !== 'all' && property.propertyType !== selectedPropertyType) return false
    return true
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      return matchesDate(property.createdAt) && matchesPropertyFilters(property)
    })
  }, [properties, dateCutoff, selectedCity, selectedPropertyType])

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (!matchesDate(lead.createdAt)) return false

      const leadProperty = lead.property || {}
      const mappedProperty = propertyMetaMap[leadProperty._id?.toString()] || null
      const propertyForFilter = {
        city: leadProperty.city || mappedProperty?.city,
        propertyType: leadProperty.propertyType || mappedProperty?.propertyType,
      }

      return matchesPropertyFilters(propertyForFilter)
    })
  }, [leads, dateCutoff, selectedCity, selectedPropertyType, propertyMetaMap])

  const filteredBookingRequests = useMemo(() => {
    return bookingRequests.filter((request) => {
      if (!matchesDate(request.createdAt)) return false

      const requestProperty = request.property || {}
      const mappedProperty = propertyMetaMap[requestProperty._id?.toString()] || null
      const propertyForFilter = {
        city: requestProperty.city || mappedProperty?.city,
        propertyType: requestProperty.propertyType || mappedProperty?.propertyType,
      }

      return matchesPropertyFilters(propertyForFilter)
    })
  }, [bookingRequests, dateCutoff, selectedCity, selectedPropertyType, propertyMetaMap])

  const summary = useMemo(() => {
    const totalProperties = filteredProperties.length
    const activeListings = filteredProperties.filter((p) => p.status === 'active').length
    const soldListings = filteredProperties.filter((p) => p.status === 'sold').length
    const onHoldListings = filteredProperties.filter((p) => p.status === 'on_hold').length

    const totalLeads = filteredLeads.length
    const convertedLeads = filteredLeads.filter((lead) => lead.status === 'converted').length
    const lostLeads = filteredLeads.filter((lead) => lead.status === 'lost').length

    const totalBookingRequests = filteredBookingRequests.length
    const paidBookingRequests = filteredBookingRequests.filter((b) => b.status === 'paid' || b.status === 'completed').length

    return {
      totalProperties,
      activeListings,
      soldListings,
      onHoldListings,
      totalLeads,
      convertedLeads,
      lostLeads,
      conversionRate: pct(convertedLeads, totalLeads),
      totalBookingRequests,
      paidBookingRequests,
      bookingPaidRate: pct(paidBookingRequests, totalBookingRequests),
    }
  }, [filteredProperties, filteredLeads, filteredBookingRequests])

  const leadStatusData = useMemo(() => {
    const map = LEAD_STATUS_ORDER.reduce((acc, status) => {
      acc[status] = 0
      return acc
    }, {})

    filteredLeads.forEach((lead) => {
      const status = lead.status || 'new'
      map[status] = (map[status] || 0) + 1
    })

    return LEAD_STATUS_ORDER.map((status) => ({
      label: status,
      value: map[status] || 0,
    }))
  }, [filteredLeads])

  const leadSourceData = useMemo(() => {
    const sourceMap = {}
    filteredLeads.forEach((lead) => {
      const source = lead.source || 'other'
      sourceMap[source] = (sourceMap[source] || 0) + 1
    })

    return Object.entries(sourceMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [filteredLeads])

  const monthlyLeadTrend = useMemo(() => {
    const months = makeRecentMonths(6)
    const monthMap = months.reduce((acc, month) => {
      acc[month.key] = 0
      return acc
    }, {})

    filteredLeads.forEach((lead) => {
      if (!lead.createdAt) return
      const created = new Date(lead.createdAt)
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`
      if (key in monthMap) {
        monthMap[key] += 1
      }
    })

    return months.map((month) => ({
      label: month.label,
      value: monthMap[month.key] || 0,
    }))
  }, [filteredLeads])

  const maxTrendValue = Math.max(1, ...monthlyLeadTrend.map((x) => x.value))
  const maxStatusValue = Math.max(1, ...leadStatusData.map((x) => x.value))
  const maxSourceValue = Math.max(1, ...leadSourceData.map((x) => x.value))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">Analytics</h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-1">
            Performance insights for properties, leads, and booking requests.
          </p>
        </div>
      </div>

      <Card className="p-4 border border-light dark:border-dark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-light-secondary dark:text-dark-secondary mb-2">
              Date Range
            </label>
            <div className="flex gap-2 flex-wrap">
              {DATE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                    dateRange === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-light dark:border-dark text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-light-secondary dark:text-dark-secondary mb-2">
              City
            </label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="app-select">
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-light-secondary dark:text-dark-secondary mb-2">
              Property Type
            </label>
            <select value={selectedPropertyType} onChange={(e) => setSelectedPropertyType(e.target.value)} className="app-select">
              <option value="all">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">Properties</p>
              <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-1">
                {loading ? '...' : summary.totalProperties}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Home className="text-blue-600 dark:text-blue-300" size={22} />
            </div>
          </div>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mt-3">
            Active {summary.activeListings} | On hold {summary.onHoldListings} | Sold {summary.soldListings}
          </p>
        </Card>

        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">Leads</p>
              <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-1">
                {loading ? '...' : summary.totalLeads}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <Users className="text-green-600 dark:text-green-300" size={22} />
            </div>
          </div>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mt-3">
            Converted {summary.convertedLeads} | Lost {summary.lostLeads}
          </p>
        </Card>

        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">Lead Conversion</p>
              <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-1">
                {loading ? '...' : `${summary.conversionRate}%`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900">
              <TrendingUp className="text-cyan-600 dark:text-cyan-300" size={22} />
            </div>
          </div>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mt-3">
            Based on converted / total leads
          </p>
        </Card>

        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">Booking Paid Rate</p>
              <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-1">
                {loading ? '...' : `${summary.bookingPaidRate}%`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Wallet className="text-purple-600 dark:text-purple-300" size={22} />
            </div>
          </div>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mt-3">
            Paid/completed {summary.paidBookingRequests} of {summary.totalBookingRequests}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-light-secondary dark:text-dark-secondary" />
            <h2 className="text-lg font-semibold text-light-primary dark:text-dark-primary">Lead Funnel</h2>
          </div>
          <div className="space-y-3">
            {leadStatusData.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-light-primary dark:text-dark-primary">{item.label}</span>
                  <span className="text-light-secondary dark:text-dark-secondary">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-light-tertiary dark:bg-dark-tertiary overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(item.value / maxStatusValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border border-light dark:border-dark">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-light-secondary dark:text-dark-secondary" />
            <h2 className="text-lg font-semibold text-light-primary dark:text-dark-primary">Lead Sources</h2>
          </div>
          <div className="space-y-3">
            {leadSourceData.length === 0 ? (
              <p className="text-sm text-light-secondary dark:text-dark-secondary">No source data available.</p>
            ) : (
              leadSourceData.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-light-primary dark:text-dark-primary">{item.label.replaceAll('_', ' ')}</span>
                    <span className="text-light-secondary dark:text-dark-secondary">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-light-tertiary dark:bg-dark-tertiary overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500"
                      style={{ width: `${(item.value / maxSourceValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5 border border-light dark:border-dark">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-light-secondary dark:text-dark-secondary" />
          <h2 className="text-lg font-semibold text-light-primary dark:text-dark-primary">Lead Inflow (Last 6 Months)</h2>
        </div>
        <div className="grid grid-cols-6 gap-3 items-end h-44">
          {monthlyLeadTrend.map((month) => (
            <div key={month.label} className="flex flex-col items-center justify-end gap-2">
              <div className="text-xs text-light-secondary dark:text-dark-secondary">{month.value}</div>
              <div className="w-full h-28 bg-light-tertiary dark:bg-dark-tertiary rounded-md relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-md bg-gradient-to-t from-indigo-500 to-blue-500"
                  style={{ height: `${(month.value / maxTrendValue) * 100}%` }}
                />
              </div>
              <div className="text-xs text-light-secondary dark:text-dark-secondary">{month.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
