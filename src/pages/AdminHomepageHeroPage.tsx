import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type HeroContent = {
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  description: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText: string
  secondaryCtaUrl: string
  bottomLeft: string
  bottomCenter: string
  bottomRight: string
  backgroundVideoUrl: string
  backgroundImageUrl: string
}

const defaults: HeroContent = {
  eyebrow: 'Independent Creative Production House',
  headlineLine1: 'Stories that',
  headlineLine2: 'move people.',
  description: 'From concept to shoot to final edit. We create powerful visuals that make brands unforgettable.',
  primaryCtaText: 'Start a Project',
  primaryCtaUrl: '/contact',
  secondaryCtaText: 'Explore Our Work',
  secondaryCtaUrl: '/portfolio',
  bottomLeft: 'Films · Photography · Campaigns',
  bottomCenter: 'Indore · India · Worldwide',
  bottomRight: 'Scroll to explore',
  backgroundVideoUrl: '/mediazz-hero-model.mp4',
  backgroundImageUrl: '/mediazz-hero-model.png',
}

const fields: { key: keyof HeroContent; label: string; multiline?: boolean; hint?: string }[] = [
  { key: 'eyebrow', label: 'Top Label' },
  { key: 'headlineLine1', label: 'Headline – Line 1' },
  { key: 'headlineLine2', label: 'Headline – Line 2' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'primaryCtaText', label: 'Primary Button Text' },
  { key: 'primaryCtaUrl', label: 'Primary Button Link', hint: 'Example: /contact' },
  { key: 'secondaryCtaText', label: 'Secondary Button Text' },
  { key: 'secondaryCtaUrl', label: 'Secondary Button Link', hint: 'Example: /portfolio' },
  { key: 'bottomLeft', label: 'Bottom Left Text' },
  { key: 'bottomCenter', label: 'Bottom Center Text' },
  { key: 'bottomRight', label: 'Bottom Right Text' },
  { key: 'backgroundVideoUrl', label: 'Background Video URL', hint: 'MP4 URL or leave blank to show the background image' },
  { key: 'backgroundImageUrl', label: 'Background Image / Video Poster URL' },
]

export default function AdminHomepageHeroPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState<HeroContent>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadContent() {
      setLoading(true)
      const { data, error: draftError } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', 'homepage')
        .eq('section_key', 'hero_draft')
        .maybeSingle()

      if (draftError) {
        setError(draftError.message)
      } else if (data?.content && typeof data.content === 'object') {
        if (active) setContent({ ...defaults, ...(data.content as Partial<HeroContent>) })
      } else {
        const { data: published, error: publishedError } = await supabase
          .from('site_content')
          .select('content')
          .eq('page_key', 'homepage')
          .eq('section_key', 'hero')
          .maybeSingle()

        if (publishedError) setError(publishedError.message)
        if (active && published?.content && typeof published.content === 'object') {
          setContent({ ...defaults, ...(published.content as Partial<HeroContent>) })
        }
      }

      if (active) setLoading(false)
    }

    loadContent()
    return () => { active = false }
  }, [])

  function updateField(key: keyof HeroContent, value: string) {
    setContent((current) => ({ ...current, [key]: value }))
  }

  async function saveDraft() {
    setSaving(true)
    setError('')
    setMessage('')

    const { error: saveError } = await supabase
      .from('site_content')
      .upsert({
        page_key: 'homepage',
        section_key: 'hero_draft',
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

    const { error: saveError } = await supabase
      .from('site_content')
      .upsert({
        page_key: 'homepage',
        section_key: 'hero',
        content,
        is_published: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_key,section_key' })

    if (saveError) setError(saveError.message)
    else setMessage('Homepage Hero successfully published.')

    setSaving(false)
  }

  if (loading) {
    return <main className="min-h-screen bg-[#171512] p-8 text-[#c5a46d]">Loading Hero CMS...</main>
  }

  return (
    <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-sm text-[#c5a46d] hover:text-white">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">Homepage CMS</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Hero Section</h1>
          <p className="mt-3 text-sm text-white/50">Edit the homepage hero content. Save Draft keeps the live website unchanged.</p>
        </div>

        {message && <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}
        {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/65">{field.label}</span>
              {field.multiline ? (
                <textarea
                  value={content[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                />
              ) : (
                <input
                  value={content[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm text-white outline-none focus:border-[#c5a46d]"
                />
              )}
              {field.hint && <span className="mt-1 block text-[11px] text-white/35">{field.hint}</span>}
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-[#c5a46d]/50 px-5 py-3 text-sm font-semibold text-[#e0bd7e] hover:bg-[#c5a46d]/10 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={publishChanges}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-3 text-sm font-bold text-[#171512] hover:bg-[#e6cb99] disabled:opacity-50"
          >
            <Send size={16} /> {saving ? 'Publishing...' : 'Publish to Website'}
          </button>
        </div>
        <p className="mt-4 text-xs leading-6 text-white/35">Publishing updates only the Homepage Hero section. Other website sections remain unchanged.</p>
      </div>
    </main>
  )
}
