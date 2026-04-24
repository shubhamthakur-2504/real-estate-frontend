import { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, Home, Users, Settings, Heart, CheckCircle, Wallet, BarChart3 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeSwitcher } from './ThemeSwitcher'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { useAuthStore } from '@/utils/authStore'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout, user } = useAuthStore()
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const propertiesRoute = user?.role === 'buyer' ? '/buyer/properties' : '/properties'

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['agent', 'admin'] },
    { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['agent', 'admin'] },
    { label: 'Properties', href: propertiesRoute, icon: Home, roles: ['buyer', 'agent', 'admin'] },
    { label: 'My Wishlist', href: '/buyer/wishlist', icon: Heart, roles: ['buyer'] },
    { label: 'My Inquiries', href: '/buyer/inquiries', icon: CheckCircle, roles: ['buyer'] },
    { label: 'Booking Requests', href: '/buyer/booking-requests', icon: Wallet, roles: ['buyer'] },
    { label: 'Booking Requests', href: '/agent/booking-requests', icon: Wallet, roles: ['agent', 'admin'] },
    { label: 'Leads', href: '/leads', icon: Users, roles: ['agent', 'admin'] },
    { label: 'Settings', href: '/settings', icon: Settings, roles: ['buyer', 'agent', 'admin'] },
  ]

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user?.role))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleNavigation = (href) => {
    navigate(href)
  }

  const isActive = (href) => location.pathname === href

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-border bg-card
                   transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-40 flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-light dark:border-dark flex-shrink-0">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              RealEstate
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-accent"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                title={item.label}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
            size={sidebarOpen ? 'default' : 'icon'}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-background/90 backdrop-blur
                          flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Welcome Back
            </h2>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            <ThemeSwitcher />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
