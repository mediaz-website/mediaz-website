import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type SectionKey = 'showreel' | 'portfolio_section' | 'testimonials_section' | 'process_section' | 'contact_section'
type Field = { key: string; label: string; multiline?: boolean }
type Section = { key: SectionKey; title: string; description: string; fields: Field[]; defaults: Record<string, string> }

const sections: Section[] = [
  { key: 'showreel', title: 'Showreel', description: 'Edit the showreel heading, label, duration and media URL.', fields: [
    { key: 'eyebrow', label: 'Top Label' }, { key: 'headline', label: 'Heading' }, { key: 'duration', label: 'Duration' }, { key: 'videoUrl', label: 'Video URL' }, { key: 'imageUrl', label: 'Poster Image URL' }
  ], defaults: { eyebrow: 'Watch the reel', headline: 'The work in motion.', duration: '01:42', videoUrl: '', imageUrl: '' } },
  { key: 'portfolio_section', title: 'Portfolio', description: 'Edit the portfolio section heading and call-to-action.', fields: [
    { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'ctaText', label: 'CTA Text' }
  ], defaults: { eyebrow: 'Selected work', headlineLine1: 'Made to be', headlineLine2: 'remembered.', ctaText: 'Start a conversation' } },
  { key: 'testimonials_section', title: 'Testimonials Heading', description: 'Edit the title and introduction above client reviews.', fields: [
    { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'description', label: 'Description', multiline: true }
  ], defaults: { eyebrow: 'Client Experiences', headlineLine1: 'What Our Clients', headlineLine2: 'Say About Us', description: "Every project is a collaboration. Here's what our clients have to say about working with Mediazz Hub." } },
  { key: 'process_section', title: 'Our Process', description: 'Edit the process section heading, four steps and closing statement.', fields: [
    { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' },
    { key: 'step1Title', label: 'Step 1 Title' }, { key: 'step1Text', label: 'Step 1 Description', multiline: true },
    { key: 'step2Title', label: 'Step 2 Title' }, { key: 'step2Text', label: 'Step 2 Description', multiline: true },
    { key: 'step3Title', label: 'Step 3 Title' }, { key: 'step3Text', label: 'Step 3 Description', multiline: true },
    { key: 'step4Title', label: 'Step 4 Title' }, { key: 'step4Text', label: 'Step 4 Description', multiline: true },
    { key: 'closingLine1', label: 'Closing Line 1' }, { key: 'closingLine2', label: 'Closing Line 2' }
  ], defaults: { eyebrow: 'The approach', headlineLine1: 'Good work starts', headlineLine2: 'with good questions.', step1Title: 'Discover', step1Text: 'We get close to the why — your ambition, your audience, and the feeling the work needs to leave behind.', step2Title: 'Shape', step2Text: 'We turn a spark into a clear creative direction, with the visual language and story mapped before the cameras roll.', step3Title: 'Make', step3Text: 'Our crew brings the idea into the real world with calm, exacting production and a relentless eye for detail.', step4Title: 'Finish', step4Text: 'Edit, grade, sound and deliver. Every final frame gets the same care as the first one.', closingLine1: 'Make something', closingLine2: 'worth watching.' } },
  { key: 'contact_section', title: 'Contact Section', description: 'Edit the contact headline, description and displayed email.', fields: [
    { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'description', label: 'Description', multiline: true }, { key: 'email', label: 'Contact Email' }
  ], defaults: { eyebrow: "Let's work together", headlineLine1: 'Have an', headlineLine2: 'idea?', description: "Bring us the rough version. The half-formed thought. The impossible deadline. We'll bring the right questions.", email: 'mediazhub@gmail.com' } }
]

export default function AdminHomepageContentPage() {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState<SectionKey>('showreel')
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const activeSection = sections.find((item) => item.key === activeKey)!

  useEffect(() => { loadSection(activeKey) }, [activeKey])

  async function loadSection(key: SectionKey) {
    setLoading(true); setError(''); setMessage('')
    const section = sections.find((item) => item.key === key)!
    const { data: draft, error: draftError } = await supabase.from('site_content').select('content').eq('page_key', 'homepage').eq('section_key', key + '_draft').maybeSingle()
    if (draftError) setError(draftError.message)
    let content = draft?.content as Record<string, string> | null
    if (!content) {
      const { data, error: readError } = await supabase.from('site_content').select('content').eq('page_key', 'homepage').eq('section_key', key).maybeSingle()
      if (readError) setError(readError.message)
      content = data?.content as Record<string, string> | null
    }
    setValues({ ...section.defaults, ...(content || {}) })
    setLoading(false)
  }

  async function save(publish: boolean) {
    setSaving(true); setError(''); setMessage('')
    const target = publish ? activeKey : activeKey + '_draft'
    const { error: writeError } = await supabase.from('site_content').upsert({
      page_key: 'homepage', section_key: target, content: values, is_published: publish, updated_at: new Date().toISOString()
    }, { onConflict: 'page_key,section_key' })
    if (writeError) setError(writeError.message)
    else setMessage(publish ? 'Section successfully published to the website.' : 'Draft saved. Live website is unchanged.')
    setSaving(false)
  }

  return <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8"><div className="mx-auto max-w-5xl">
    <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-sm text-[#c5a46d]"><ArrowLeft size={16}/> Back to Dashboard</button>
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">Homepage CMS</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Other Homepage Sections</h1>
    <p className="mt-3 text-sm text-white/50">Manage the remaining homepage content from one place.</p>
    <div className="my-7 flex flex-wrap gap-2">{sections.map((section) => <button key={section.key} onClick={() => setActiveKey(section.key)} className={activeKey === section.key ? 'rounded-lg bg-[#c5a46d] px-4 py-2 text-sm font-semibold text-[#171512]' : 'rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70'}>{section.title}</button>)}</div>
    <div className="mb-6"><h2 className="text-2xl font-serif">{activeSection.title}</h2><p className="mt-2 text-sm text-white/50">{activeSection.description}</p></div>
    {message && <p className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</p>}
    {error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
    {loading ? <p className="text-[#c5a46d]">Loading section...</p> : <div className="grid gap-5 md:grid-cols-2">{activeSection.fields.map((field) => <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/65">{field.label}</span>{field.multiline ? <textarea rows={4} value={values[field.key] || ''} onChange={(e) => setValues((old) => ({ ...old, [field.key]: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"/> : <input value={values[field.key] || ''} onChange={(e) => setValues((old) => ({ ...old, [field.key]: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"/>}</label>)}</div>}
    <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6"><button disabled={saving || loading} onClick={() => save(false)} className="flex items-center gap-2 rounded-lg border border-[#c5a46d]/50 px-5 py-3 text-sm font-semibold text-[#e0bd7e] disabled:opacity-50"><Save size={16}/>{saving ? 'Saving...' : 'Save Draft'}</button><button disabled={saving || loading} onClick={() => save(true)} className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-3 text-sm font-bold text-[#171512] disabled:opacity-50"><Send size={16}/>{saving ? 'Publishing...' : 'Publish to Website'}</button></div>
    <p className="mt-4 text-xs text-white/35">Each section is saved separately. Publish updates only the selected section.</p>
  </div></main>
}
