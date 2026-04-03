import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Home, FileText, AlertCircle, Plus, BarChart3, Settings } from 'lucide-react'
import { propertiesApi, leadsApi } from '@/services'
import { useAuthStore } from '@/utils/authStore'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
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
          <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary mb-5">
            Quick Access
          </h2>
          <div className="space-y-2">
            {/* Add Property Button */}
            <button
              onClick={() => navigate('/properties')}
              className="w-full p-4 flex items-center gap-3 rounded-lg border border-light dark:border-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Plus size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                  Add Property
                </p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  List new property
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-secondary">→</span>
            </button>

            {/* View Leads Button */}
            <button
              onClick={() => navigate('/leads')}
              className="w-full p-4 flex items-center gap-3 rounded-lg border border-light dark:border-dark hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 dark:hover:border-green-600 transition-all group"
            >
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <Users size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                  View Leads
                </p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  Manage leads
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-secondary">→</span>
            </button>

            {/* View Reports Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full p-4 flex items-center gap-3 rounded-lg border border-light dark:border-dark hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
            >
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                  Analytics
                </p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  View reports
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-secondary">→</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className="w-full p-4 flex items-center gap-3 rounded-lg border border-light dark:border-dark hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 dark:hover:border-orange-600 transition-all group"
            >
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <Settings size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                  Settings
                </p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  Manage account
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-secondary">→</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
