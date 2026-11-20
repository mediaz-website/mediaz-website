
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Save,
  FolderKanban,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/admin/ImageUpload'

type Project = {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  client_name: string | null
  category: string | null
  project_date: string | null
  location: string | null
  short_description: string | null
  project_description: string | null
  services: string[]
  cover_image_url: string | null
  gallery_images: string[]
  video_url: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
}

const emptyForm = {
  title: '',
  slug: '',
  client_name: '',
  category: '',
  project_date: '',
  location: '',
  short_description: '',
  project_description: '',
  services: '',
  cover_image_url: '',
  gallery_images: '',
  video_url: '',
  is_featured: false,
  is_published: false,
  sort_order: '0',
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatDate(value: string | null) {
  if (!value) return 'Not specified'

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminProjectsPage() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  // Current user's role
  const [currentRole, setCurrentRole] = useState('')

  // Only Owner and Admin can delete projects
  const canDeleteProjects = ['owner', 'admin'].includes(currentRole)

  async function loadProjects() {
    setLoading(true)
    setError('')

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user) {
        navigate('/admin/login', { replace: true })
        return
      }

      const { data: admin, error: roleError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (
        roleError ||
        !admin ||
        !['owner', 'admin', 'editor', 'producer'].includes(
          String(admin.role).toLowerCase()
        )
      ) {
        navigate('/admin/login', { replace: true })
        return
      }

      setCurrentRole(String(admin.role).toLowerCase())

      const { data, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      setProjects((data ?? []) as Project[])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load projects.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function openNewProject() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setError('')
    setModalOpen(true)
  }

  function openEditProject(project: Project) {
    setEditingId(project.id)
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      client_name: project.client_name || '',
      category: project.category || '',
      project_date: project.project_date || '',
      location: project.location || '',
      short_description: project.short_description || '',
      project_description: project.project_description || '',
      services: (project.services || []).join(', '),
      cover_image_url: project.cover_image_url || '',
      gallery_images: (project.gallery_images || []).join('\n'),
      video_url: project.video_url || '',
      is_featured: project.is_featured,
      is_published: project.is_published,
      sort_order: String(project.sort_order ?? 0),
    })

    setMessage('')
    setError('')
    setModalOpen(true)
  }

  function updateField(
    field: keyof typeof emptyForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateGalleryImage(index: number, value: string) {
    setForm((current) => {
      const images = current.gallery_images.split('\n')
      images[index] = value

      return {
        ...current,
        gallery_images: images.join('\n'),
      }
    })
  }

  function addGalleryImageSlot() {
    setForm((current) => ({
      ...current,
      gallery_images: [
        ...current.gallery_images.split('\n'),
        '',
      ].join('\n'),
    }))
  }

  function removeGalleryImageSlot(index: number) {
    setForm((current) => ({
      ...current,
      gallery_images: current.gallery_images
        .split('\n')
        .filter((_, imageIndex) => imageIndex !== index)
        .join('\n'),
    }))
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const slug = createSlug(form.slug || form.title)

      if (!slug) {
        throw new Error('Please enter a valid project title.')
      }

      const projectData = {
        title: form.title.trim(),
        slug,
        client_name: form.client_name.trim() || null,
        category: form.category.trim() || null,
        project_date: form.project_date || null,
        location: form.location.trim() || null,
        short_description: form.short_description.trim() || null,
        project_description: form.project_description.trim() || null,
        services: form.services
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        cover_image_url: form.cover_image_url.trim() || null,
        gallery_images: form.gallery_images
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        video_url: form.video_url.trim() || null,
        is_featured: form.is_featured,
        is_published: form.is_published,
        sort_order: Number(form.sort_order) || 0,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert(projectData)

        if (insertError) throw insertError
      }

      setModalOpen(false)
      setMessage(
        editingId
          ? 'Project updated successfully.'
          : 'Project created successfully.'
      )

      await loadProjects()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save project.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(project: Project) {
    // Additional frontend role protection
    if (!canDeleteProjects) {
      setError('You do not have permission to delete projects.')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This cannot be undone.`
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    )

    setMessage('Project deleted successfully.')
  }

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase().trim()

    return projects.filter((project) => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Published' && project.is_published) ||
        (filter === 'Draft' && !project.is_published)

      const searchable = [
        project.title,
        project.client_name,
        project.category,
        project.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesFilter && searchable.includes(term)
    })
  }, [projects, search, filter])

  return (
    <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">
              Mediazz Hub Admin
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl">
              Projects & Case Studies
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Manage your production projects and website case studies.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              Back to Dashboard
            </button>

            <button
              onClick={loadProjects}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={openNewProject}
              className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-4 py-2.5 text-sm font-bold text-[#171512] hover:bg-[#e0bd7e]"
            >
              <Plus size={17} />
              Add Project
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: 'Total Projects', value: projects.length },
            {
              label: 'Published',
              value: projects.filter((item) => item.is_published).length,
            },
            {
              label: 'Drafts',
              value: projects.filter((item) => !item.is_published).length,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-[#211e19] p-4"
            >
              <p className="text-xs text-white/45">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
            {message}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, clients, categories..."
              className="w-full rounded-lg border border-white/10 bg-[#211e19] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#c5a46d]"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
          >
            <option value="All">All projects</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#211e19]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">All Projects</h2>

            <span className="text-xs text-white/40">
              {filteredProjects.length} projects
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-white/50">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <FolderKanban size={36} className="mb-4 text-[#c5a46d]" />

              <p className="font-semibold">No projects found</p>

              <p className="mt-2 text-sm text-white/40">
                Click Add Project to create your first project.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center"
                >
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="h-20 w-full rounded-lg object-cover sm:w-32"
                    />
                  ) : (
                    <div className="flex h-20 w-full items-center justify-center rounded-lg bg-[#171512] text-[#c5a46d] sm:w-32">
                      <FolderKanban size={28} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{project.title}</h3>

                    <p className="mt-1 text-xs text-white/45">
                      {[
                        project.client_name,
                        project.category,
                        formatDate(project.project_date),
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                          project.is_published
                            ? 'border-green-500/20 bg-green-500/10 text-green-300'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {project.is_published ? 'Published' : 'Draft'}
                      </span>

                      {project.is_featured && (
                        <span className="rounded-full border border-[#c5a46d]/30 bg-[#c5a46d]/10 px-2.5 py-1 text-[10px] text-[#e0bd7e]">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditProject(project)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    {/* Delete button: Owner and Admin only */}
                    {canDeleteProjects && (
                      <button
                        onClick={() => deleteProject(project)}
                        className="rounded-lg border border-red-500/20 p-2 text-red-300 hover:bg-red-500/10"
                        aria-label={`Delete ${project.title}`}
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#211e19] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#211e19] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c5a46d]">
                  Project Management
                </p>

                <h2 className="mt-1 font-serif text-2xl">
                  {editingId ? 'Edit Project' : 'Add New Project'}
                </h2>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close project form"
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveProject} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Project Title *
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(event) => {
                      const title = event.target.value

                      setForm((current) => ({
                        ...current,
                        title,
                        slug: editingId ? current.slug : createSlug(title),
                      }))
                    }}
                    placeholder="e.g. Sharma Sweets Brand Film"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    URL Slug *
                  </label>

                  <input
                    required
                    value={form.slug}
                    onChange={(event) => updateField('slug', event.target.value)}
                    placeholder="sharma-sweets-brand-film"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Client Name
                  </label>

                  <input
                    value={form.client_name}
                    onChange={(event) => updateField('client_name', event.target.value)}
                    placeholder="Client or brand"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Category
                  </label>

                  <input
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    placeholder="Commercial Shoot, Product Shoot..."
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Project Date
                  </label>

                  <input
                    type="date"
                    value={form.project_date}
                    onChange={(event) => updateField('project_date', event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Location
                  </label>

                  <input
                    value={form.location}
                    onChange={(event) => updateField('location', event.target.value)}
                    placeholder="Indore, India"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Services
                  </label>

                  <input
                    value={form.services}
                    onChange={(event) => updateField('services', event.target.value)}
                    placeholder="Photography, Video Production, Editing"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />

                  <p className="mt-1 text-[10px] text-white/35">
                    Separate multiple services with commas.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(event) => updateField('sort_order', event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Short Description
                  </label>

                  <textarea
                    rows={2}
                    value={form.short_description}
                    onChange={(event) => updateField('short_description', event.target.value)}
                    placeholder="A short introduction for the portfolio card..."
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Project Description
                  </label>

                  <textarea
                    rows={5}
                    value={form.project_description}
                    onChange={(event) => updateField('project_description', event.target.value)}
                    placeholder="Describe the project, concept, production and final outcome..."
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Cover Image"
                    value={form.cover_image_url}
                    onChange={(url) => updateField('cover_image_url', url)}
                    folder="projects/covers"
                  />
                </div>

                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Gallery Images
                    </label>

                    <p className="text-xs text-white/40">
                      Upload multiple project images. You can add or remove image slots.
                    </p>
                  </div>

                  {form.gallery_images.split('\n').map((url, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-start"
                    >
                      <div className="min-w-0 flex-1">
                        <ImageUpload
                          label={`Gallery Image ${index + 1}`}
                          value={url}
                          onChange={(nextUrl) => updateGalleryImage(index, nextUrl)}
                          folder="projects/gallery"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeGalleryImageSlot(index)}
                        className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addGalleryImageSlot}
                    className="rounded-lg border border-[#c5a46d]/40 px-4 py-2.5 text-sm text-[#e0bd7e] hover:bg-[#c5a46d]/10"
                  >
                    + Add Gallery Image
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Video URL
                  </label>

                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(event) => updateField('video_url', event.target.value)}
                    placeholder="YouTube, Vimeo or video URL"
                    className="w-full rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 border-t border-white/10 pt-5">
                <label className="flex items-center gap-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) => updateField('is_featured', event.target.checked)}
                    className="h-4 w-4 accent-[#c5a46d]"
                  />
                  Featured Project
                </label>

                <label className="flex items-center gap-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(event) => updateField('is_published', event.target.checked)}
                    className="h-4 w-4 accent-[#c5a46d]"
                  />
                  Publish on Website
                </label>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-2.5 text-sm font-bold text-[#171512] hover:bg-[#e0bd7e] disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
