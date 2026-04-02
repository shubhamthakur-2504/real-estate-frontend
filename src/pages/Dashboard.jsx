import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Home, FileText, AlertCircle } from 'lucide-react'
import { propertiesApi, leadsApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'

export function Dashboard() {
  const { user } = useAuthStore()
  const [propertiesStats, setPropertiesStats] = useState(null)
  const [leadsStats, setLeadsStats] = useState(null)
  const [recentProperties, setRecentProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const isAdmin = user?.role === 'admin'

        // Admin sees global stats; agents see only their own portfolio and leads.
        const [propsRes, leadsRes] = await Promise.all([
          isAdmin ? propertiesApi.getAll({ limit: 100 }) : propertiesApi.getMyProperties(),
          isAdmin ? leadsApi.getAll({ limit: 100 }) : leadsApi.getAssignedToMe(),
        ])

        // Set stats
        const propertiesList = propsRes.properties || []
        const leadsList = leadsRes.leads || []

        const totalProperties = propsRes.pagination?.totalProperties || propertiesList.length || 0
        const activeProperties =
          propertiesList.filter((p) => (p.status || '').toLowerCase() === 'active').length || 0
        const totalLeads = leadsRes.pagination?.totalLeads || leadsList.length || 0

        setPropertiesStats({
          total: totalProperties,
          active: activeProperties,
        })

        setLeadsStats({
          total: totalLeads,
          converted: leadsList.filter((l) => l.status === 'converted').length || 0,
        })

        // Set recent properties
        setRecentProperties(propertiesList.slice(0, 5))
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.role])

  const stats = [
    {
      title: 'Total Properties',
      value: propertiesStats?.total || '0',
      icon: Home,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Active Listings',
      value: propertiesStats?.active || '0',
      icon: TrendingUp,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900',
    },
    {
      title: 'Total Leads',
      value: leadsStats?.total || '0',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Converted',
      value: leadsStats?.converted || '0',
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
            Dashboard
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-1">
            {user?.role === 'admin'
              ? "Platform-wide performance overview."
              : "Your portfolio and lead performance overview."}
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
          Generate Report
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="p-6 border border-light dark:border-dark hover:shadow-lg dark:hover:shadow-dark transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-light-secondary dark:text-dark-secondary font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-2">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${stat.color}`} size={24} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <Card className="lg:col-span-2 p-6 border border-light dark:border-dark">
          <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary mb-4">
            Recent Properties
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-light-secondary dark:text-dark-secondary">Loading...</p>
            ) : recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div
                  key={property._id}
                  className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light dark:border-dark hover:border-primary-600 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-light-primary dark:text-dark-primary">
                        {property.title}
                      </h3>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary">
                        {property.location?.city || property.city || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'Active'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-light-secondary dark:text-dark-secondary">No properties found</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border border-light dark:border-dark">
          <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
              Add Property
            </Button>
            <Button className="w-full bg-secondary-600 hover:bg-secondary-700 text-white">
              Add Lead
            </Button>
            <Button
              variant="outline"
              className="w-full border-light dark:border-dark"
            >
              View Reports
            </Button>
            <Button
              variant="outline"
              className="w-full border-light dark:border-dark"
            >
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
