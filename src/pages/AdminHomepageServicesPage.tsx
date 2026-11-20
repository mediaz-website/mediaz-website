import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type ServicesContent = {
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  description: string
  topLinkText: string
  bottomLinkText: string
}

const defaults: ServicesContent = {
  eyebrow: 'What we create',
  headlineLine1: 'The art of',
  headlineLine2: 'visual storytelling.',
  description: 'From commercial films to brand campaigns, we bring concepts to life through creative thinking, professional production and powerful visuals.',
  topLinkText: 'Explore all capabilities',
  bottomLinkText: 'Discover all services',
}

const fields: { key: keyof ServicesContent; label: string; multiline?: boolean }[] = [
  { key: 'eyebrow', label: 'Section Label' },
  { key: 'headlineLine1', label: 'Heading – Line 1' },
  { key: 'headlineLine2', label: 'Heading – Line 2' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'topLinkText', label: 'Top Link Text' },
  { key: 'bottomLinkText', label: 'Bottom Button Text' },
]

export default function AdminHomepageServicesPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState<ServicesContent>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadContent() {
      const { data: draft, error: draftError } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', 'homepage')
        .eq('section_key', 'services_section_draft')
        .maybeSingle()

      if (draftError) setError(draftError.message)

      if (draft?.content && typeof draft.content === 'object') {
        if (active) setContent({ ...defaults, ...(draft.content as Partial<ServicesContent>) })
      } else {
        const { data: published, error: publishedError } = await supabase
          .from('site_content')
          .select('content')
          .eq('page_key', 'homepage')
          .eq('section_key', 'services_section')
          .maybeSingle()

        if (publishedError) setError(publishedError.message)
        if (active && published?.content && typeof published.content === 'object') {
          setContent({ ...defaults, ...(published.content as Partial<ServicesContent>) })
        }
      }

      if (active) setLoading(false)
    }

    loadContent()
    return () => { active = false }
  }, [])

  function updateField(key: keyof ServicesContent, value: string) {
    setContent((current) => ({ ...current, [key]: value }))
  }

  async function saveDraft() {
    setSaving(true)
    setError('')
    setMessage('')
    const { error: saveError } = await supabase.from('site_content').upsert({
      page_key: 'homepage',
      section_key: 'services_section_draft',
      content,
      is_published: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'page_key,section_key' })

    if (saveError) setError(saveError.message)
    else setMessage('Draft saved. Live website par abhi koi change nahi hua.')
    setSaving(false)
  }

  async function publishChanges() {
    setSaving(true)
    setError('')
    setMessage('')
    const { error: publishError } = await supabase.from('site_content').upsert({
      page_key: 'homepage',
      section_key: 'services_section',
      content,
      is_published: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'page_key,section_key' })

    if (publishError) setError(publishError.message)
    else setMessage('Homepage Services section successfully published.')
    setSaving(false)
  }

  if (loading) return <main className="min-h-screen bg-[#171512] p-8 text-[#c5a46d]">Loading Services CMS...</main>

  return (
    <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-sm text-[#c5a46d] hover:text-white">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">Homepage CMS</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Services Section</h1>
          <p className="mt-3 text-sm text-white/50">Edit the heading, description and links above/below the services cards. Service cards are managed in the existing Services module.</p>
        </div>
        {message && <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}
        {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/65">{field.label}</span>
              {field.multiline ? (
                <textarea value={content[field.key]} onChange={(event) => updateField(field.key, event.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]" />
              ) : (
                <input value={content[field.key]} onChange={(event) => updateField(field.key, event.target.value)} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]" />
              )}
            </label>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <button type="button" onClick={saveDraft} disabled={saving} className="flex items-center gap-2 rounded-lg border border-[#c5a46d]/50 px-5 py-3 text-sm font-semibold text-[#e0bd7e] hover:bg-[#c5a46d]/10 disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button type="button" onClick={publishChanges} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-3 text-sm font-bold text-[#171512] hover:bg-[#e6cb99] disabled:opacity-50">
            <Send size={16} /> {saving ? 'Publishing...' : 'Publish to Website'}
          </button>
        </div>
        <p className="mt-4 text-xs leading-6 text-white/35">Publishing updates only the Homepage Services section heading and text. The service cards remain managed separately.</p>
      </div>
    </main>
  )
}
