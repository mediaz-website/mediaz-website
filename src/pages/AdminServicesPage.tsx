
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Loader2,
  BriefcaseBusiness,
  Star,
} from 'lucide-react'

interface Service {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  image_url: string | null
  icon: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
}

const emptyForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  image_url: '',
  icon: '',
  is_featured: false,
  is_published: false,
  sort_order: 0,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setServices(data || [])
    }

    setLoading(false)
  }

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.slug.toLowerCase().includes(searchText) ||
        (item.short_description || '').toLowerCase().includes(searchText)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'published' && item.is_published) ||
        (filter === 'draft' && !item.is_published) ||
        (filter === 'featured' && item.is_featured)

      return matchesSearch && matchesFilter
    })
  }, [services, search, filter])

  const makeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (item: Service) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      short_description: item.short_description || '',
      description: item.description || '',
      image_url: item.image_url || '',
      icon: item.icon || '',
      is_featured: item.is_featured,
      is_published: item.is_published,
      sort_order: item.sort_order,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title.trim(),
      slug: makeSlug(form.slug || form.title),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      icon: form.icon.trim() || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert([payload])

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    await fetchServices()
    setSaving(false)
  }

  const togglePublish = async (item: Service) => {
    const { error } = await supabase
      .from('services')
      .update({
        is_published: !item.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchServices()
  }

  const deleteService = async (item: Service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchServices()
  }

  const publishedCount = services.filter(
    (item) => item.is_published
  ).length

  const featuredCount = services.filter(
    (item) => item.is_featured
  ).length

  return (
    <div className="min-h-screen bg-[#101010] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Website Management
            </p>
            <h1 className="text-3xl font-semibold">Services</h1>
            <p className="mt-2 text-sm text-white/50">
              Manage the services displayed on your website.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Services"
            value={services.length}
            icon={<BriefcaseBusiness size={20} />}
          />
          <StatCard
            label="Published"
            value={publishedCount}
            icon={<Eye size={20} />}
          />
          <StatCard
            label="Featured"
            value={featuredCount}
            icon={<Star size={20} />}
          />
        </div>

        {error && !modalOpen && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-lg border border-white/10 bg-[#191919] py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-400/60"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none focus:border-amber-400/60"
          >
            <option value="all">All Services</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-400" size={30} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#191919] py-16 text-center">
            <BriefcaseBusiness
              size={36}
              className="mx-auto mb-4 text-white/30"
            />
            <h3 className="text-lg font-medium">No services found</h3>
            <p className="mt-2 text-sm text-white/40">
              Add your first service to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#191919]"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-white/5">
                    <BriefcaseBusiness
                      size={36}
                      className="text-white/20"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/40">
                        /{item.slug}
                      </p>
                    </div>

                    {item.is_featured && (
                      <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-400">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mb-5 flex-1 text-sm leading-6 text-white/55">
                    {item.short_description || 'No short description added.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.is_published
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(item)}
                        title={item.is_published ? 'Unpublish' : 'Publish'}
                        className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-amber-400/50 hover:text-amber-400"
                      >
                        {item.is_published ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit"
                        className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-amber-400/50 hover:text-amber-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteService(item)}
                        title="Delete"
                        className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-red-500/50 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-6 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#191919] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Service' : 'Add Service'}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Enter your service details below.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Service Title *">
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: form.slug ? form.slug : makeSlug(e.target.value),
                      })
                    }
                    className="form-input"
                    placeholder="Commercial Shoot"
                  />
                </FormField>

                <FormField label="URL Slug *">
                  <input
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: makeSlug(e.target.value) })
                    }
                    className="form-input"
                    placeholder="commercial-shoot"
                  />
                </FormField>
              </div>

              <FormField label="Short Description">
                <textarea
                  rows={2}
                  value={form.short_description}
                  onChange={(e) =>
                    setForm({ ...form, short_description: e.target.value })
                  }
                  className="form-input resize-y"
                  placeholder="A short introduction to this service..."
                />
              </FormField>

              <FormField label="Full Description">
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="form-input resize-y"
                  placeholder="Describe the service in detail..."
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Service Image URL (Optional)">
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </FormField>

                <FormField label="Icon Name (Optional)">
                  <input
                    value={form.icon}
                    onChange={(e) =>
                      setForm({ ...form, icon: e.target.value })
                    }
                    className="form-input"
                    placeholder="camera"
                  />
                </FormField>
              </div>

              <FormField label="Display Order">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: Number(e.target.value) })
                  }
                  className="form-input"
                />
              </FormField>

              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm({ ...form, is_featured: e.target.checked })
                    }
                    className="accent-amber-400"
                  />
                  Featured service
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                    className="accent-amber-400"
                  />
                  Publish on website
                </label>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Service'
                      : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          background: #101010;
          padding: 11px 13px;
          color: white;
          font-size: 14px;
          outline: none;
        }
        .form-input:focus {
          border-color: rgba(251,191,36,0.65);
        }
        .form-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#191919] p-5">
      <div className="mb-3 flex items-center justify-between text-white/45">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  )
}
