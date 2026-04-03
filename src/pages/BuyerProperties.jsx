import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, MapPin, BedDouble, Bath, ArrowUpDown, AlertCircle } from 'lucide-react'
import { propertiesApi } from '@/services'
import { BuyerPropertyDetailModal } from '@/components/properties/BuyerPropertyDetailModal'

export function BuyerProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Filters
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [cardImageLoading, setCardImageLoading] = useState({})

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await propertiesApi.getAll({ limit: 100, status: 'active' })
        setProperties(res.properties || [])
      } catch (err) {
        console.error('Error loading buyer properties:', err)
        setError(err.message || 'Failed to load properties')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const visibleProperties = useMemo(() => {
    let list = [...properties]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      )
    }

    // Property type filter
    if (propertyTypeFilter) {
      list = list.filter((p) => p.propertyType === propertyTypeFilter)
    }

    // City filter
    if (cityFilter) {
      list = list.filter((p) => p.city?.toLowerCase() === cityFilter.toLowerCase())
    }

    // Price range filter
    if (priceRange.min) {
      list = list.filter((p) => (p.price || 0) >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      list = list.filter((p) => (p.price || 0) <= parseInt(priceRange.max))
    }

    // Sorting
    if (sortBy === 'priceLowHigh') list.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === 'priceHighLow') list.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return list
  }, [properties, search, sortBy, propertyTypeFilter, cityFilter, priceRange])

  // Get unique cities for dropdown
  const uniqueCities = useMemo(() => {
    return [...new Set(properties.map((p) => p.city).filter(Boolean))].sort()
  }, [properties])

  // Get unique property types
  const uniquePropertyTypes = useMemo(() => {
    return [...new Set(properties.map((p) => p.propertyType).filter(Boolean))].sort()
  }, [properties])

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toLocaleString()}` : 'Price on request'

  const handleViewDetails = (property) => {
    setSelectedProperty(property)
    setDetailModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
          Find Your Next Property
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Browse active listings with details and compare options quickly.
        </p>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {/* Search and Sort */}
      <Card className="p-4 border border-light dark:border-dark">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-secondary dark:text-dark-secondary"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, or address"
              className="w-full pl-9 pr-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary"
            />
          </div>
          <div className="relative">
            <ArrowUpDown
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-secondary dark:text-dark-secondary"
              size={16}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="app-select pl-9"
            >
              <option value="newest">Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 border border-light dark:border-dark">
        <p className="text-sm font-semibold text-light-primary dark:text-dark-primary mb-3">
          Filters
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Property Type */}
          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="app-select"
          >
            <option value="">All Types</option>
            {uniquePropertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="app-select"
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
            className="px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
            className="px-3 py-2 rounded border border-light dark:border-dark bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary"
          />

          {/* Clear Filters */}
          {(propertyTypeFilter || cityFilter || priceRange.min || priceRange.max) && (
            <Button
              onClick={() => {
                setPropertyTypeFilter('')
                setCityFilter('')
                setPriceRange({ min: '', max: '' })
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          Loading properties...
        </Card>
      ) : visibleProperties.length === 0 ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          No properties found for your filters.
        </Card>
      ) : (
        <>
          <p className="text-sm text-light-secondary dark:text-dark-secondary">
            Showing {visibleProperties.length} properties
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visibleProperties.map((p) => (
              <Card
                key={p._id}
                className="overflow-hidden border border-light dark:border-dark hover:shadow-lg transition-shadow"
              >
                <div className="h-44 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 relative">
                  {p.images && p.images.length > 0 && (
                    <>
                      {cardImageLoading[p._id] && (
                        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse z-10" />
                      )}
                      <img
                        src={typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onLoad={() => setCardImageLoading((prev) => ({ ...prev, [p._id]: false }))}
                        onError={() => setCardImageLoading((prev) => ({ ...prev, [p._id]: false }))}
                        onLoadStart={() => setCardImageLoading((prev) => ({ ...prev, [p._id]: true }))}
                      />
                    </>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-light-primary dark:text-dark-primary line-clamp-2">
                      {p.title}
                    </h3>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatPrice(p.price)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-light-secondary dark:text-dark-secondary">
                    <MapPin size={15} className="mr-1" />
                    <span>{p.city || 'N/A'}</span>
                  </div>

                  <div className="flex gap-4 text-sm text-light-secondary dark:text-dark-secondary">
                    <div className="flex items-center gap-1">
                      <BedDouble size={15} /> {p.bedrooms ?? '-'} Beds
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath size={15} /> {p.bathrooms ?? '-'} Baths
                    </div>
                  </div>

                  <Button
                    onClick={() => handleViewDetails(p)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-medium"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Property Detail Modal */}
      <BuyerPropertyDetailModal
        property={selectedProperty}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedProperty(null)
        }}
        onInquirySent={() => {
          setDetailModalOpen(false)
          setSelectedProperty(null)
        }}
      />
    </div>
  )
}
