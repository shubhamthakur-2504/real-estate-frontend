import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, MapPin, BedDouble, Bath, Heart, AlertCircle, Trash2 } from 'lucide-react'
import { wishlistApi } from '@/services'
import { BuyerPropertyDetailModal } from '@/components/properties/BuyerPropertyDetailModal'
import { toast } from 'sonner'

export function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [filteredWishlist, setFilteredWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [cardImageLoading, setCardImageLoading] = useState({})
  const [removingId, setRemovingId] = useState(null)

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await wishlistApi.getWishlist({ limit: 100 })
        const items = res?.wishlist || []
        setWishlist(items)
        setFilteredWishlist(items)
      } catch (err) {
        console.error('Error loading wishlist:', err)
        setError(err.message || 'Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  // Filter wishlist by search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredWishlist(wishlist)
      return
    }

    const q = search.toLowerCase()
    const filtered = wishlist.filter(
      (item) =>
        item.property?.title?.toLowerCase().includes(q) ||
        item.property?.city?.toLowerCase().includes(q) ||
        item.property?.address?.toLowerCase().includes(q)
    )
    setFilteredWishlist(filtered)
  }, [search, wishlist])

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toLocaleString()}` : 'Price on request'

  const handleViewDetails = (property) => {
    setSelectedProperty(property)
    setDetailModalOpen(true)
  }

  const handleRemove = async (propertyId) => {
    try {
      setRemovingId(propertyId)
      await wishlistApi.remove(propertyId)
      setWishlist((prev) => prev.filter((item) => item.property._id !== propertyId))
      toast.success('Removed from wishlist')
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      toast.error(err.message || 'Failed to remove from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={32} />
          My Wishlist
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary mt-1">
          Your saved properties for future reference
        </p>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {/* Search */}
      <Card className="p-4 border border-light dark:border-dark">
        <div className="relative">
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
      </Card>

      {/* Results */}
      {loading ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          Loading wishlist...
        </Card>
      ) : wishlist.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-light-secondary dark:text-dark-secondary text-lg">
            Your wishlist is empty
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm mt-1">
            Start adding properties to save them for later
          </p>
        </Card>
      ) : filteredWishlist.length === 0 ? (
        <Card className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          No properties match your search
        </Card>
      ) : (
        <>
          <p className="text-sm text-light-secondary dark:text-dark-secondary">
            {filteredWishlist.length} of {wishlist.length} properties
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredWishlist.map((item) => {
              const p = item.property
              return (
                <Card
                  key={item._id}
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

                    {item.note && (
                      <p className="text-xs text-light-secondary dark:text-dark-secondary italic bg-light-bg dark:bg-dark-bg p-2 rounded">
                        Note: {item.note}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleViewDetails(p)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 font-medium"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleRemove(p._id)}
                        disabled={removingId === p._id}
                        variant="outline"
                        className="px-3 py-2 disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
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
      />
    </div>
  )
}
