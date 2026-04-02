import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/common/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Properties } from '@/pages/Properties'
import { BuyerProperties } from '@/pages/BuyerProperties'
import { Leads } from '@/pages/Leads'
import { UploadPage } from '@/pages/Upload'
import { Settings } from '@/pages/Settings'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import { useAuthStore } from '@/utils/authStore'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Protected Layout Component - checks auth before rendering
function ProtectedLayout() {
  const { user } = useAuthStore()

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
  const { user } = useAuthStore()
  const defaultRoute = user?.role === 'buyer' ? '/buyer/properties' : '/dashboard'

  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
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
              path="/properties"
              element={<ProtectedRoute element={<Properties />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/buyer/properties"
              element={<ProtectedRoute element={<BuyerProperties />} allowedRoles={['buyer']} />}
            />
            <Route
              path="/leads"
              element={<ProtectedRoute element={<Leads />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/upload"
              element={<ProtectedRoute element={<UploadPage />} allowedRoles={['agent', 'admin']} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Settings />} allowedRoles={['buyer', 'agent', 'admin']} />}
            />
          </Route>

          {/* Redirect root based on auth status */}
          <Route
            path="/"
            element={
              user ? <Navigate to={defaultRoute} replace /> : <Navigate to="/login" replace />
            }
          />

          {/* 404 catch-all */}
          <Route path="*" element={<Navigate to={user ? defaultRoute : '/login'} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
