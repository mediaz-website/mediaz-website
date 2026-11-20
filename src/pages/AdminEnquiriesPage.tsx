
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Download,
  MessageCircle,
  CalendarDays,
  Save,
  X,
  Inbox,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

type Enquiry = {
  id: string
  created_at: string
  full_name: string
  business_name: string | null
  email: string
  whatsapp: string | null
  service_required: string | null
  project_budget: string | null
  project_description: string | null
  status: string | null
  internal_notes: string | null
  follow_up_at: string | null
}

const statuses = [
  'New',
  'Contacted',
  'Follow-up',
  'Quotation Sent',
  'Won',
  'Lost',
]

const statusStyles: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Contacted: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  'Follow-up': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'Quotation Sent': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  Won: 'bg-green-500/10 text-green-300 border-green-500/20',
  Lost: 'bg-red-500/10 text-red-300 border-red-500/20',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toDateInput(value: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

function cleanPhone(value: string) {
  return value.replace(/\D/g, '')
}

export default function AdminEnquiriesPage() {
  const navigate = useNavigate()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editStatus, setEditStatus] = useState('New')
  const [editNotes, setEditNotes] = useState('')
  const [editFollowUp, setEditFollowUp] = useState('')

  async function loadEnquiries() {
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

      if (roleError || !admin || !['owner', 'admin'].includes(admin.role)) {
        navigate('/admin/login', { replace: true })
        return
      }

      const { data, error: enquiryError } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (enquiryError) throw enquiryError

      setEnquiries((data ?? []) as Enquiry[])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load enquiries.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnquiries()
  }, [])

  function openEnquiry(item: Enquiry) {
    setSelected(item)
    setEditStatus(item.status || 'New')
    setEditNotes(item.internal_notes || '')
    setEditFollowUp(toDateInput(item.follow_up_at))
    setSaveMessage('')
  }

  async function saveEnquiry() {
    if (!selected) return

    setSaving(true)
    setSaveMessage('')

    try {
      const followUpValue = editFollowUp
        ? new Date(`${editFollowUp}T12:00:00`).toISOString()
        : null

      const { data, error: updateError } = await supabase
        .from('enquiries')
        .update({
          status: editStatus,
          internal_notes: editNotes,
          follow_up_at: followUpValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selected.id)
        .select()
        .single()

      if (updateError) throw updateError

      const updated = data as Enquiry

      setEnquiries((current) =>
        current.map((item) => item.id === updated.id ? updated : item)
      )

      setSelected(updated)
      setSaveMessage('Changes saved successfully.')
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : 'Unable to save changes.'
      )
    } finally {
      setSaving(false)
    }
  }

  const filteredEnquiries = useMemo(() => {
    const term = search.toLowerCase().trim()

    return enquiries.filter((item) => {
      const matchesFilter =
        filter === 'All' || (item.status || 'New') === filter

      const searchable = [
        item.full_name,
        item.business_name,
        item.email,
        item.whatsapp,
        item.service_required,
        item.project_description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesFilter && searchable.includes(term)
    })
  }, [enquiries, search, filter])

  function exportCSV() {
    const headers = [
      'Name',
      'Business',
      'Email',
      'WhatsApp',
      'Service',
      'Budget',
      'Description',
      'Status',
      'Created At',
      'Follow Up',
      'Internal Notes',
    ]

    const rows = filteredEnquiries.map((item) => [
      item.full_name,
      item.business_name || '',
      item.email,
      item.whatsapp || '',
      item.service_required || '',
      item.project_budget || '',
      item.project_description || '',
      item.status || 'New',
      item.created_at,
      item.follow_up_at || '',
      item.internal_notes || '',
    ])

    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mediazz-hub-enquiries.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const countFor = (status: string) =>
    enquiries.filter((item) =>
      (item.status || 'New') === status
    ).length

  return (
    <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">
              Mediazz Hub Admin
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl">
              Enquiries & CRM
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Manage client enquiries and track your sales pipeline.
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
              onClick={loadEnquiries}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={filteredEnquiries.length === 0}
              className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-4 py-2.5 text-sm font-bold text-[#171512] hover:bg-[#e0bd7e] disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { label: 'Total', value: enquiries.length },
            { label: 'New', value: countFor('New') },
            { label: 'Contacted', value: countFor('Contacted') },
            { label: 'Follow-up', value: countFor('Follow-up') },
            { label: 'Quotation', value: countFor('Quotation Sent') },
            { label: 'Won', value: countFor('Won') },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-[#211e19] p-4"
            >
              <p className="text-xs text-white/45">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by client, business, email, service..."
              className="w-full rounded-lg border border-white/10 bg-[#211e19] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#c5a46d]"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#211e19]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">Client Enquiries</h2>
            <span className="text-xs text-white/40">
              {filteredEnquiries.length} records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-white/50">
              Loading enquiries...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <Inbox size={34} className="mb-4 text-[#c5a46d]" />
              <p className="font-semibold">No enquiries found</p>
              <p className="mt-2 text-sm text-white/40">
                New website enquiries will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredEnquiries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openEnquiry(item)}
                  className="grid w-full gap-3 px-5 py-5 text-left transition hover:bg-white/[0.03] md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.full_name}
                    </p>
                    <p className="mt-1 truncate text-xs text-white/40">
                      {item.business_name || item.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/70">
                      {item.service_required || 'Service not specified'}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {item.project_budget || 'Budget not specified'}
                    </p>
                  </div>

                  <div className="text-xs text-white/45">
                    {formatDate(item.created_at)}
                  </div>

                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status || 'New'] || statusStyles.New}`}>
                      {item.status || 'New'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#c5a46d]">
                    View details →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#211e19] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#211e19] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c5a46d]">
                  Enquiry Details
                </p>
                <h2 className="mt-1 font-serif text-2xl">
                  {selected.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close enquiry"
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Business', selected.business_name],
                  ['Email', selected.email],
                  ['WhatsApp', selected.whatsapp],
                  ['Service', selected.service_required],
                  ['Budget', selected.project_budget],
                  ['Received', formatDate(selected.created_at)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {label}
                    </p>
                    <p className="break-words text-sm text-white/85">
                      {value || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>

              {selected.project_description && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Project Requirements
                  </p>
                  <p className="whitespace-pre-wrap rounded-lg bg-[#171512] p-4 text-sm leading-7 text-white/75">
                    {selected.project_description}
                  </p>
                </div>
              )}

              {selected.whatsapp && (
                <a
                  href={`https://wa.me/${cleanPhone(selected.whatsapp)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  <MessageCircle size={17} />
                  Contact on WhatsApp
                </a>
              )}

              <div className="border-t border-white/10 pt-5">
                <h3 className="mb-4 font-semibold text-white">
                  Update Lead
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Lead Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(event) => setEditStatus(event.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#171512] px-3 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
                      <CalendarDays size={14} />
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={editFollowUp}
                      onChange={(event) => setEditFollowUp(event.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#171512] px-3 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Internal Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(event) => setEditNotes(event.target.value)}
                    placeholder="Add client discussion, quotation details or follow-up notes..."
                    className="w-full resize-y rounded-lg border border-white/10 bg-[#171512] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                  />
                </div>

                {saveMessage && (
                  <p className="mt-3 text-sm text-[#e0bd7e]">
                    {saveMessage}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
                  >
                    Close
                  </button>
                  <button
                    onClick={saveEnquiry}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-2.5 text-sm font-bold text-[#171512] hover:bg-[#e0bd7e] disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
