import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Eye, Edit2, Trash2 } from 'lucide-react'

export function PropertiesTable({
  properties,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString()}`
    }
    return price || 'N/A'
  }

  return (
    <Card className="border border-light dark:border-dark overflow-hidden">
      {loading ? (
        <div className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="p-8 text-center text-light-secondary dark:text-dark-secondary">
          No properties found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-tertiary dark:bg-dark-tertiary border-b border-light dark:border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-light-primary dark:text-dark-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light dark:divide-dark">
              {properties.map((property) => (
                <tr
                  key={property._id}
                  className="hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-light-primary dark:text-dark-primary">
                      {property.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-light-secondary dark:text-dark-secondary">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      {property.city || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-light-primary dark:text-dark-primary">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                      {property.propertyType || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-light-primary dark:text-dark-primary">
                      {formatPrice(property.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded ${
                        property.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : property.status === 'sold'
                            ? 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      }`}
                    >
                      {property.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-light dark:border-dark"
                      onClick={() => onView(property)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-light dark:border-dark text-primary-600"
                      onClick={() => onEdit(property)}
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-light dark:border-dark text-red-600"
                      onClick={() => onDelete(property)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
