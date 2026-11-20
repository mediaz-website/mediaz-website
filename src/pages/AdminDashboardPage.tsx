
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  BriefcaseBusiness,
  Star,
  Users,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Clock,
  WandSparkles,
  PanelsTopLeft,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const allModules = [
  {
    name: 'Homepage CMS',
    icon: PanelsTopLeft,
    path: '/admin/cms/homepage-content',
    roles: ['owner', 'admin', 'editor'],
    description: 'Manage Hero, Services, Showreel, Portfolio, Testimonials, Process and Contact sections.',
  },
  {
    name: 'Enquiries & CRM',
    icon: Inbox,
    path: '/admin/enquiries',
    roles: ['owner', 'admin'],
    description: 'Manage client enquiries, lead status and follow-ups.',
  },
  {
    name: 'Projects & Case Studies',
    icon: FolderKanban,
    path: '/admin/projects',
    roles: ['owner', 'admin', 'editor', 'producer'],
    description: 'Manage projects, case studies and published work.',
  },
  {
    name: 'Services',
    icon: BriefcaseBusiness,
    path: '/admin/services',
    roles: ['owner', 'admin', 'editor'],
    description: 'Add, edit and publish website services.',
  },
  {
    name: 'Testimonials',
    icon: Star,
    path: '/admin/testimonials',
    roles: ['owner', 'admin', 'editor'],
    description: 'Manage client testimonials and reviews.',
  },
  {
    name: 'AI Website Assistant',
    icon: WandSparkles,
    path: '/admin/ai-assistant',
    roles: ['owner', 'admin', 'editor'],
    description: 'Update website content with AI-assisted previews.',
  },
  {
    name: 'Team & Users',
    icon: Users,
    path: '/admin/team',
    roles: ['owner'],
    description: 'Invite team members and manage their access.',
  },
]

type DashboardStats = {
  totalEnquiries: number
  pendingEnquiries: number
  totalProjects: number
  publishedServices: number
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  const [checking, setChecking] = useState(true)
  const [authorised, setAuthorised] = useState(false)
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [stats, setStats] = useState<DashboardStats>({
    totalEnquiries: 0,
    pendingEnquiries: 0,
    totalProjects: 0,
    publishedServices: 0,
  })

  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    let active = true

    async function verifyAdmin() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        const user = session?.user

        if (sessionError || !user) {
          if (active) navigate('/admin/login', { replace: true })
          return
        }

        const { data: admin, error: roleError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle()

        if (roleError || !admin) {
          await supabase.auth.signOut()
          if (active) navigate('/admin/login', { replace: true })
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('team_profiles')
          .select('profile_completed')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (!profile?.profile_completed) {
          if (active) navigate('/admin/register', { replace: true })
          return
        }

        if (active) {
          setRole(String(admin.role).toLowerCase())
          setEmail(user.email ?? '')
          setAuthorised(true)
        }
      } catch {
        if (active) navigate('/admin/login', { replace: true })
      } finally {
        if (active) setChecking(false)
      }
    }

    verifyAdmin()

    return () => {
      active = false
    }
  }, [navigate])

  useEffect(() => {
    if (!authorised || !role) return

    let active = true

    async function loadStats() {
      setStatsLoading(true)
      setStatsError('')

      try {
        const nextStats: DashboardStats = {
          totalEnquiries: 0,
          pendingEnquiries: 0,
          totalProjects: 0,
          publishedServices: 0,
        }

        const canViewEnquiries = ['owner', 'admin'].includes(role)
        const canViewServices = ['owner', 'admin', 'editor'].includes(role)

        const requests: Promise<void>[] = []

        if (canViewEnquiries) {
          requests.push(
            (async () => {
              const { data, error } = await supabase
                .from('enquiries')
                .select('status')

              if (error) throw error

              const enquiries = data ?? []

              nextStats.totalEnquiries = enquiries.length

              const completedStatuses = [
                'closed',
                'converted',
                'completed',
                'resolved',
                'won',
                'lost',
                'archived',
                'cancelled',
              ]

              nextStats.pendingEnquiries = enquiries.filter((item) => {
                const status = String(item.status ?? 'new')
                  .toLowerCase()
                  .trim()

                return !completedStatuses.includes(status)
              }).length
            })()
          )
        }

        requests.push(
          (async () => {
            const { count, error } = await supabase
              .from('projects')
              .select('id', { count: 'exact', head: true })

            if (error) throw error

            nextStats.totalProjects = count ?? 0
          })()
        )

        if (canViewServices) {
          requests.push(
            (async () => {
              const { count, error } = await supabase
                .from('services')
                .select('id', { count: 'exact', head: true })
                .eq('is_published', true)

              if (error) throw error

              nextStats.publishedServices = count ?? 0
            })()
          )
        }

        await Promise.all(requests)

        if (active) setStats(nextStats)
      } catch (error) {
        console.error('Dashboard statistics error:', error)

        if (active) {
          setStatsError(
            error instanceof Error
              ? error.message
              : 'Unable to load dashboard statistics.'
          )
        }
      } finally {
        if (active) setStatsLoading(false)
      }
    }

    loadStats()

    return () => {
      active = false
    }
  }, [authorised, role])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const visibleModules = allModules.filter((module) =>
    module.roles.includes(role)
  )

  function openModule(path: string) {
    navigate(path)
    setMenuOpen(false)
  }

  async function refreshStats() {
    setStatsLoading(true)
    setStatsError('')

    try {
      const nextStats: DashboardStats = {
        totalEnquiries: 0,
        pendingEnquiries: 0,
        totalProjects: 0,
        publishedServices: 0,
      }

      const requests: Promise<void>[] = []

      if (['owner', 'admin'].includes(role)) {
        requests.push(
          (async () => {
            const { data, error } = await supabase
              .from('enquiries')
              .select('status')

            if (error) throw error

            const enquiries = data ?? []
            nextStats.totalEnquiries = enquiries.length

            const completedStatuses = [
              'closed',
              'converted',
              'completed',
              'resolved',
              'won',
              'lost',
              'archived',
              'cancelled',
            ]

            nextStats.pendingEnquiries = enquiries.filter((item) => {
              const status = String(item.status ?? 'new')
                .toLowerCase()
                .trim()

              return !completedStatuses.includes(status)
            }).length
          })()
        )
      }

      requests.push(
        (async () => {
          const { count, error } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true })

          if (error) throw error
          nextStats.totalProjects = count ?? 0
        })()
      )

      if (['owner', 'admin', 'editor'].includes(role)) {
        requests.push(
          (async () => {
            const { count, error } = await supabase
              .from('services')
              .select('id', { count: 'exact', head: true })
              .eq('is_published', true)

            if (error) throw error
            nextStats.publishedServices = count ?? 0
          })()
        )
      }

      await Promise.all(requests)
      setStats(nextStats)
    } catch (error) {
      console.error('Dashboard statistics error:', error)
      setStatsError(
        error instanceof Error
          ? error.message
          : 'Unable to refresh dashboard statistics.'
      )
    } finally {
      setStatsLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] text-[#c5a46d]">
        Verifying admin access...
      </main>
    )
  }

  if (!authorised) {
    return <Navigate to="/admin/login" replace />
  }

  const statCards = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: Inbox,
      roles: ['owner', 'admin'],
      description: 'All enquiries received',
    },
    {
      title: 'Pending Enquiries',
      value: stats.pendingEnquiries,
      icon: Clock,
      roles: ['owner', 'admin'],
      description: 'Awaiting closure or conversion',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      roles: ['owner', 'admin', 'editor', 'producer'],
      description: 'All projects and case studies',
    },
    {
      title: 'Published Services',
      value: stats.publishedServices,
      icon: BriefcaseBusiness,
      roles: ['owner', 'admin', 'editor'],
      description: 'Services visible on the website',
    },
  ]

  const visibleStats = statCards.filter((item) =>
    item.roles.includes(role)
  )

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <div className="flex min-h-screen">
        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#211e19] transition-transform lg:static lg:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <div>
              <p className="font-serif text-xl text-white">Mediazz Hub</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#c5a46d]">
                Admin Studio
              </p>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/60 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <button
              onClick={() => openModule('/admin')}
              className="flex w-full items-center gap-3 rounded-lg bg-[#c5a46d]/15 px-4 py-3 text-left text-sm font-semibold text-[#e0bd7e]"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            {visibleModules.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  onClick={() => openModule(item.path)}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-[#e0bd7e]"
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              )
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 px-3">
              <p className="truncate text-xs text-white/70">{email}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-[#c5a46d]">
                {role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c5a46d]">
                  Management Portal
                </p>
                <p className="mt-1 text-sm text-white/60">Overview</p>
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">Welcome back</p>
              <p className="text-xs text-white/40">Mediazz Hub {role}</p>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">
                  {role} Dashboard
                </p>

                <h1 className="font-serif text-3xl text-white sm:text-4xl">
                  Welcome to your Admin Studio.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                  Access the Mediazz Hub modules assigned to your role.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshStats}
                disabled={statsLoading}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#c5a46d] transition hover:bg-white/5 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={statsLoading ? 'animate-spin' : ''}
                />
                Refresh Stats
              </button>
            </div>

            <div className="mb-10">
              <div className="mb-4">
                <h2 className="font-serif text-xl text-white">
                  Business Overview
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Live statistics from your Mediazz Hub database
                </p>
              </div>

              {statsError && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  Unable to load statistics: {statsError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {visibleStats.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-[#211e19] p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c5a46d]/10 text-[#c5a46d]">
                          <Icon size={20} />
                        </div>

                        {statsLoading && (
                          <RefreshCw
                            size={14}
                            className="animate-spin text-white/30"
                          />
                        )}
                      </div>

                      <p className="text-xs text-white/50">{item.title}</p>

                      <p className="mt-2 font-serif text-3xl text-white">
                        {item.value}
                      </p>

                      <p className="mt-2 text-[11px] text-white/35">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="font-serif text-xl text-white">
                Management Modules
              </h2>
              <p className="mt-1 text-xs text-white/40">
                Open the modules available to your role
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleModules.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => openModule(item.path)}
                    className="rounded-xl border border-white/10 bg-[#211e19] p-5 text-left transition hover:border-[#c5a46d]/40"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#c5a46d]/10 text-[#c5a46d]">
                      <Icon size={21} />
                    </div>

                    <h2 className="text-sm font-semibold text-white">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-xs leading-6 text-white/40">
                      {item.description}
                    </p>

                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#c5a46d]">
                      Open Module →
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
