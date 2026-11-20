
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { supabase } from './lib/supabase'

// Public website components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Services from './components/Services'
import Showreel from './components/Showreel'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import Contact from './components/Contact'

// Public website pages
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ContactPage from './pages/ContactPage'

// Admin pages
import AdminLoginPage from './pages/AdminLoginPage'
import AdminRegistrationPage from './pages/AdminRegistrationPage'
import AdminResetPasswordPage from './pages/AdminResetPasswordPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminEnquiriesPage from './pages/AdminEnquiriesPage'
import AdminProjectsPage from './pages/AdminProjectsPage'
import AdminTestimonialsPage from './pages/AdminTestimonialsPage'
import AdminServicesPage from './pages/AdminServicesPage'
import AdminTeamPage from './pages/AdminTeamPage'
import AdminAIAssistantPage from './pages/AdminAIAssistantPage'
import AdminHomepageHeroPage from './pages/AdminHomepageHeroPage'
import AdminHomepageServicesPage from './pages/AdminHomepageServicesPage'

// HOME PAGE
function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Showreel />
      <Portfolio />
      <Testimonials />
      <Process />
      <Contact />
    </>
  )
}

// PUBLIC WEBSITE LAYOUT
function PublicWebsite() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 300)
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

// ADMIN ACCESS GUARD
function AdminAccessGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  const navigate = useNavigate()
  const allowedRoleKey = allowedRoles?.join('|') ?? ''

  useEffect(() => {
    let active = true

    const checkAccess = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          navigate('/admin/login', { replace: true })
          return
        }

        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle()

        if (adminError || !adminData?.role) {
          await supabase.auth.signOut()
          navigate('/admin/login', { replace: true })
          return
        }

        const userRole = String(adminData.role).toLowerCase()

        const { data: profileData, error: profileError } = await supabase
          .from('team_profiles')
          .select('profile_completed')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileError || !profileData?.profile_completed) {
          navigate('/admin/register', { replace: true })
          return
        }

        const roles = allowedRoleKey
          ? allowedRoleKey.split('|')
          : null

        if (roles && !roles.includes(userRole)) {
          navigate('/admin', { replace: true })
          return
        }

        if (active) {
          setAllowed(true)
        }
      } catch (error) {
        console.error('Admin access check failed:', error)
        navigate('/admin/login', { replace: true })
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    checkAccess()

    return () => {
      active = false
    }
  }, [navigate, allowedRoleKey])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
        <p>Checking access...</p>
      </div>
    )
  }

  if (!allowed) {
    return null
  }

  return <>{children}</>
}

// MAIN APP
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin authentication pages */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegistrationPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

        {/* Homepage Hero CMS: Owner, Admin and Editor */}
        <Route
          path="/admin/cms/homepage-hero"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin', 'editor']}>
              <AdminHomepageHeroPage />
            </AdminAccessGuard>
          }
        />

        {/* Homepage Services CMS: Owner, Admin and Editor */}
        <Route
          path="/admin/cms/homepage-services"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin', 'editor']}>
              <AdminHomepageServicesPage />
            </AdminAccessGuard>
          }
        />

        {/* AI Website Assistant: Owner, Admin and Editor */}
        <Route
          path="/admin/ai-assistant"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin', 'editor']}>
              <AdminAIAssistantPage />
            </AdminAccessGuard>
          }
        />

        {/* Enquiries: Owner + Admin */}
        <Route
          path="/admin/enquiries"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin']}>
              <AdminEnquiriesPage />
            </AdminAccessGuard>
          }
        />

        {/* Projects: All roles */}
        <Route
          path="/admin/projects"
          element={
            <AdminAccessGuard
              allowedRoles={['owner', 'admin', 'editor', 'producer']}
            >
              <AdminProjectsPage />
            </AdminAccessGuard>
          }
        />

        {/* Testimonials: Owner + Admin + Editor */}
        <Route
          path="/admin/testimonials"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin', 'editor']}>
              <AdminTestimonialsPage />
            </AdminAccessGuard>
          }
        />

        {/* Services: Owner + Admin + Editor */}
        <Route
          path="/admin/services"
          element={
            <AdminAccessGuard allowedRoles={['owner', 'admin', 'editor']}>
              <AdminServicesPage />
            </AdminAccessGuard>
          }
        />

        {/* Team Management: Owner only */}
        <Route
          path="/admin/team"
          element={
            <AdminAccessGuard allowedRoles={['owner']}>
              <AdminTeamPage />
            </AdminAccessGuard>
          }
        />

        {/* Dashboard: All authorized roles */}
        <Route
          path="/admin"
          element={
            <AdminAccessGuard>
              <AdminDashboardPage />
            </AdminAccessGuard>
          }
        />

        {/* Unknown admin routes */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

        {/* Public website */}
        <Route path="/*" element={<PublicWebsite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
