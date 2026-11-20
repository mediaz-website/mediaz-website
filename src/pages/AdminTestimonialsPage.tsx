
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Star,
  MessageSquareQuote,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  client_role: string | null
  company_name: string | null
  review: string
  rating: number
  avatar_url: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
}

const emptyForm = {
  client_name: '',
  client_role: '',
  company_name: '',
  review: '',
  rating: 5,
  avatar_url: '',
  is_featured: false,
  is_published: false,
  sort_order: 0,
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTestimonials(data || [])
    }

    setLoading(false)
  }

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        item.client_name.toLowerCase().includes(searchText) ||
        (item.company_name || '').toLowerCase().includes(searchText) ||
        item.review.toLowerCase().includes(searchText)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'published' && item.is_published) ||
        (filter === 'draft' && !item.is_published) ||
        (filter === 'featured' && item.is_featured)

      return matchesSearch && matchesFilter
    })
  }, [testimonials, search, filter])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (item: Testimonial) => {
    setEditingId(item.id)
    setForm({
      client_name: item.client_name,
      client_role: item.client_role || '',
      company_name: item.company_name || '',
      review: item.review,
      rating: item.rating,
      avatar_url: item.avatar_url || '',
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
      client_name: form.client_name.trim(),
      client_role: form.client_role.trim() || null,
      company_name: form.company_name.trim() || null,
      review: form.review.trim(),
      rating: Number(form.rating),
      avatar_url: form.avatar_url.trim() || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingId)
      : await supabase.from('testimonials').insert([payload])

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    await fetchTestimonials()
    setSaving(false)
  }

  const togglePublish = async (item: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({
        is_published: !item.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchTestimonials()
  }

  const deleteTestimonial = async (item: Testimonial) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the review by ${item.client_name}?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchTestimonials()
  }

  const publishedCount = testimonials.filter(
    (item) => item.is_published
  ).length

  const featuredCount = testimonials.filter(
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
            <h1 className="text-3xl font-semibold">Testimonials</h1>
            <p className="mt-2 text-sm text-white/50">
              Manage client reviews and testimonials displayed on your website.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
          >
            <Plus size={18} />
            Add Testimonial
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Reviews"
            value={testimonials.length}
            icon={<MessageSquareQuote size={20} />}
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
              placeholder="Search by client, company or review..."
              className="w-full rounded-lg border border-white/10 bg-[#191919] py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-400/60"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none focus:border-amber-400/60"
          >
            <option value="all">All Testimonials</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-400" size={30} />
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#191919] py-16 text-center">
            <MessageSquareQuote
              size={36}
              className="mx-auto mb-4 text-white/30"
            />
            <h3 className="text-lg font-medium">No testimonials found</h3>
            <p className="mt-2 text-sm text-white/40">
              Add your first client testimonial to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-xl border border-white/10 bg-[#191919] p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.client_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 font-semibold text-amber-400">
                        {item.client_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold">{item.client_name}</h3>
                      <p className="text-xs text-white/45">
                        {[item.client_role, item.company_name]
                          .filter(Boolean)
                          .join(' · ') || 'Client'}
                      </p>
                    </div>
                  </div>

                  {item.is_featured && (
                    <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-400">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={
                        index < item.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-white/20'
                      }
                    />
                  ))}
                </div>

                <p className="mb-5 flex-1 text-sm leading-6 text-white/65">
                  “{item.review}”
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
                      onClick={() => deleteTestimonial(item)}
                      title="Delete"
                      className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-red-500/50 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
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
                  {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Enter the client's review details below.
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
                <FormField label="Client Name *">
                  <input
                    required
                    value={form.client_name}
                    onChange={(e) =>
                      setForm({ ...form, client_name: e.target.value })
                    }
                    className="form-input"
                    placeholder="Client name"
                  />
                </FormField>

                <FormField label="Designation / Role">
                  <input
                    value={form.client_role}
                    onChange={(e) =>
                      setForm({ ...form, client_role: e.target.value })
                    }
                    className="form-input"
                    placeholder="Business Owner"
                  />
                </FormField>

                <FormField label="Company Name">
                  <input
                    value={form.company_name}
                    onChange={(e) =>
                      setForm({ ...form, company_name: e.target.value })
                    }
                    className="form-input"
                    placeholder="Company name"
                  />
                </FormField>

                <FormField label="Rating">
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="form-input"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Client Review *">
                <textarea
                  required
                  rows={5}
                  value={form.review}
                  onChange={(e) =>
                    setForm({ ...form, review: e.target.value })
                  }
                  className="form-input resize-y"
                  placeholder="Write the client's testimonial..."
                />
              </FormField>

              <FormField label="Client Photo URL (Optional)">
                <input
                  type="url"
                  value={form.avatar_url}
                  onChange={(e) =>
                    setForm({ ...form, avatar_url: e.target.value })
                  }
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                />
              </FormField>

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
                  Featured testimonial
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
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Save Testimonial'}
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
