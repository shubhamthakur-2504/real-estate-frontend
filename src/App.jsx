import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/common/Layout'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { Analytics } from '@/pages/Analytics'
import { Properties } from '@/pages/Properties'
import { BuyerProperties } from '@/pages/BuyerProperties'
import { BuyerInquiries } from '@/pages/BuyerInquiries'
import { BookingRequests } from '@/pages/BookingRequests'
import { Wishlist } from '@/pages/Wishlist'
import { Notifications } from '@/pages/Notifications'
import { Leads } from '@/pages/Leads'
import { AgentBookingRequests } from '@/pages/AgentBookingRequests'
import { Settings } from '@/pages/Settings'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import { useAuthStore } from '@/utils/authStore'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Protected Layout Component - checks auth before rendering
function ProtectedLayout() {
  const { user, hasHydrated } = useAuthStore()

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    const currentPath = window.location.pathname
    const encodedReturnUrl = encodeURIComponent(currentPath)
    return <Navigate to={`/login?returnUrl=${encodedReturnUrl}`} replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Landing Page - public route */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes - accessible without login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Auth Check */}
          <Route element={<ProtectedLayout />}>
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute element={<Analytics />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/properties"
              element={<ProtectedRoute element={<Properties />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/buyer/properties"
              element={<ProtectedRoute element={<BuyerProperties />} allowedRoles={['buyer']} />}
            />
            <Route
              path="/buyer/inquiries"
              element={<ProtectedRoute element={<BuyerInquiries />} allowedRoles={['buyer']} />}
            />
            <Route
              path="/buyer/booking-requests"
              element={<ProtectedRoute element={<BookingRequests />} allowedRoles={['buyer']} />}
            />
            <Route
              path="/buyer/wishlist"
              element={<ProtectedRoute element={<Wishlist />} allowedRoles={['buyer']} />}
            />
            <Route
              path="/notifications"
              element={<ProtectedRoute element={<Notifications />} allowedRoles={['buyer', 'agent', 'admin']} />}
            />
            <Route
              path="/leads"
              element={<ProtectedRoute element={<Leads />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/agent/booking-requests"
              element={<ProtectedRoute element={<AgentBookingRequests />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Settings />} allowedRoles={['buyer', 'agent', 'admin']} />}
            />
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
