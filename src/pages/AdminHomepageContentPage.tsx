import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdminServicesPage from './AdminServicesPage'
import AdminTestimonialsPage from './AdminTestimonialsPage'

type Section = {
  pageKey?: string
  key: string
  title: string
  description: string
  fields: { key: string; label: string; multiline?: boolean; hint?: string }[]
  defaults: Record<string, string>
}

const sections: Section[] = [
  {
    key: 'hero', title: 'Hero Section', description: 'Manage the main homepage banner, buttons and background media.',
    fields: [
      { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Headline – Line 1' }, { key: 'headlineLine2', label: 'Headline – Line 2' },
      { key: 'description', label: 'Description', multiline: true }, { key: 'primaryCtaText', label: 'Primary Button Text' },
      { key: 'primaryCtaUrl', label: 'Primary Button Link', hint: 'Example: /contact' }, { key: 'secondaryCtaText', label: 'Secondary Button Text' },
      { key: 'secondaryCtaUrl', label: 'Secondary Button Link', hint: 'Example: /portfolio' }, { key: 'bottomLeft', label: 'Bottom Left Text' },
      { key: 'bottomCenter', label: 'Bottom Center Text' }, { key: 'bottomRight', label: 'Bottom Right Text' },
      { key: 'backgroundVideoUrl', label: 'Background Video URL', hint: 'MP4 URL; leave blank to show background image.' },
      { key: 'backgroundImageUrl', label: 'Background Image / Video Poster URL' },
    ],
    defaults: {
      eyebrow: 'Independent Creative Production House', headlineLine1: 'Stories that', headlineLine2: 'move people.',
      description: 'From concept to shoot to final edit. We create powerful visuals that make brands unforgettable.',
      primaryCtaText: 'Start a Project', primaryCtaUrl: '/contact', secondaryCtaText: 'Explore Our Work', secondaryCtaUrl: '/portfolio',
      bottomLeft: 'Films · Photography · Campaigns', bottomCenter: 'Indore · India · Worldwide', bottomRight: 'Scroll to explore',
      backgroundVideoUrl: '/mediazz-hero-model.mp4', backgroundImageUrl: '/mediazz-hero-model.png',
    },
  },
  {
    key: 'services_section', title: 'Services Section', description: 'Edit the heading and links above/below the homepage service cards. Service cards remain in the Services module.',
    fields: [
      { key: 'eyebrow', label: 'Section Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' },
      { key: 'description', label: 'Description', multiline: true }, { key: 'topLinkText', label: 'Top Link Text' }, { key: 'bottomLinkText', label: 'Bottom Button Text' },
    ],
    defaults: {
      eyebrow: 'What we create', headlineLine1: 'The art of', headlineLine2: 'visual storytelling.',
      description: 'From commercial films to brand campaigns, we bring concepts to life through creative thinking, professional production and powerful visuals.',
      topLinkText: 'Explore all capabilities', bottomLinkText: 'Discover all services',
    },
  },
  {
    key: 'showreel', title: 'Showreel', description: 'Edit the showreel heading, label, duration and media URLs.',
    fields: [{ key: 'eyebrow', label: 'Top Label' }, { key: 'headline', label: 'Heading' }, { key: 'duration', label: 'Duration' }, { key: 'videoUrl', label: 'Video URL' }, { key: 'imageUrl', label: 'Poster Image URL' }],
    defaults: { eyebrow: 'Watch the reel', headline: 'The work in motion.', duration: '01:42', videoUrl: '', imageUrl: '' },
  },
  {
    key: 'portfolio_section', title: 'Portfolio', description: 'Edit the portfolio section heading and call-to-action.',
    fields: [{ key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'ctaText', label: 'CTA Text' }],
    defaults: { eyebrow: 'Selected work', headlineLine1: 'Made to be', headlineLine2: 'remembered.', ctaText: 'Start a conversation' },
  },
  {
    key: 'testimonials_section', title: 'Testimonials Heading', description: 'Edit the title and introduction above client reviews.',
    fields: [{ key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'description', label: 'Description', multiline: true }],
    defaults: { eyebrow: 'Client Experiences', headlineLine1: 'What Our Clients', headlineLine2: 'Say About Us', description: "Every project is a collaboration. Here's what our clients have to say about working with Mediazz Hub." },
  },
  {
    key: 'process_section', title: 'Our Process', description: 'Edit the process section heading, four steps and closing statement.',
    fields: [
      { key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' },
      { key: 'step1Title', label: 'Step 1 Title' }, { key: 'step1Text', label: 'Step 1 Description', multiline: true },
      { key: 'step2Title', label: 'Step 2 Title' }, { key: 'step2Text', label: 'Step 2 Description', multiline: true },
      { key: 'step3Title', label: 'Step 3 Title' }, { key: 'step3Text', label: 'Step 3 Description', multiline: true },
      { key: 'step4Title', label: 'Step 4 Title' }, { key: 'step4Text', label: 'Step 4 Description', multiline: true },
      { key: 'closingLine1', label: 'Closing Line 1' }, { key: 'closingLine2', label: 'Closing Line 2' },
    ],
    defaults: {
      eyebrow: 'The approach', headlineLine1: 'Good work starts', headlineLine2: 'with good questions.',
      step1Title: 'Discover', step1Text: 'We get close to the why — your ambition, your audience, and the feeling the work needs to leave behind.',
      step2Title: 'Shape', step2Text: 'We turn a spark into a clear creative direction, with the visual language and story mapped before the cameras roll.',
      step3Title: 'Make', step3Text: 'Our crew brings the idea into the real world with calm, exacting production and a relentless eye for detail.',
      step4Title: 'Finish', step4Text: 'Edit, grade, sound and deliver. Every final frame gets the same care as the first one.',
      closingLine1: 'Make something', closingLine2: 'worth watching.',
    },
  },
  {
    key: 'contact_section', title: 'Contact Section', description: 'Edit the contact headline, description and displayed email.',
    fields: [{ key: 'eyebrow', label: 'Top Label' }, { key: 'headlineLine1', label: 'Heading – Line 1' }, { key: 'headlineLine2', label: 'Heading – Line 2' }, { key: 'description', label: 'Description', multiline: true }, { key: 'email', label: 'Contact Email' }],
    defaults: { eyebrow: "Let's work together", headlineLine1: 'Have an', headlineLine2: 'idea?', description: "Bring us the rough version. The half-formed thought. The impossible deadline. We'll bring the right questions.", email: 'mediazhub@gmail.com' },
  },
  {
    pageKey: 'about', key: 'main', title: 'About Page',
    description: 'Edit About page hero, introduction, stats, key headings and closing call-to-action.',
    fields: [
      { key: 'heroEyebrow', label: 'Hero Top Label' }, { key: 'heroLine1', label: 'Hero Heading Line 1' }, { key: 'heroLine2', label: 'Hero Heading Line 2' }, { key: 'heroDescription', label: 'Hero Description', multiline: true }, { key: 'heroCta', label: 'Hero Button Text' },
      { key: 'introEyebrow', label: 'Introduction Label' }, { key: 'introHeading1', label: 'Introduction Heading Line 1' }, { key: 'introHeading2', label: 'Introduction Heading Line 2' }, { key: 'introLead', label: 'Introduction Main Text', multiline: true }, { key: 'introText1', label: 'Introduction Paragraph 1', multiline: true }, { key: 'introText2', label: 'Introduction Paragraph 2', multiline: true },
      { key: 'statsProjects', label: 'Projects Stat' }, { key: 'statsYear', label: 'Journey Year Stat' }, { key: 'statsIndustries', label: 'Industries Stat' }, { key: 'statsReach', label: 'Reach Stat' },
      { key: 'servicesEyebrow', label: 'Capabilities Label' }, { key: 'servicesHeading1', label: 'Capabilities Heading Line 1' }, { key: 'servicesHeading2', label: 'Capabilities Heading Line 2' }, { key: 'servicesDescription', label: 'Capabilities Description', multiline: true },
      { key: 'industriesEyebrow', label: 'Industries Label' }, { key: 'industriesHeading1', label: 'Industries Heading Line 1' }, { key: 'industriesHeading2', label: 'Industries Heading Line 2' }, { key: 'industriesDescription', label: 'Industries Description', multiline: true },
      { key: 'closingEyebrow', label: 'Closing Label' }, { key: 'closingHeading1', label: 'Closing Heading Line 1' }, { key: 'closingHeading2', label: 'Closing Heading Line 2' }, { key: 'closingDescription', label: 'Closing Description', multiline: true }, { key: 'closingCta', label: 'Closing Button Text' },
    ],
    defaults: {
      heroEyebrow: 'About Mediazz Hub · Est. 2023', heroLine1: 'We turn ideas', heroLine2: 'into experiences.', heroDescription: 'A creative media production house bringing concepts, brands and stories to life through photography, filmmaking and end-to-end creative production.', heroCta: 'Explore Our Work',
      introEyebrow: 'Who We Are', introHeading1: 'More than', introHeading2: 'just production.', introLead: 'Mediazz Hub is a creative media production house based in Indore, Madhya Pradesh, working with multiple brands and businesses since 2023.',
      introText1: 'What started as a creative vision has grown into a production partner for businesses across different industries. From advertising campaigns and product shoots to celebrity shoots, podcasts, short films and event productions, we have completed 500+ projects across multiple creative services.',
      introText2: 'Our approach brings concept planning, creative direction, production, photography, filmmaking and final editing together — making the entire process more connected, collaborative and effective.',
      statsProjects: '500+', statsYear: '2023', statsIndustries: 'Multiple', statsReach: 'India',
      servicesEyebrow: 'What We Create', servicesHeading1: 'One creative vision.', servicesHeading2: 'Many possibilities.', servicesDescription: 'From a single frame to a complete campaign, our production capabilities cover a wide range of creative formats.',
      industriesEyebrow: 'Industries & Experiences', industriesHeading1: 'Different worlds.', industriesHeading2: 'One vision.', industriesDescription: 'Our projects have taken us across industries, audiences and creative environments. Every business has a different story, and every production needs its own approach.',
      closingEyebrow: 'Have A Story To Tell?', closingHeading1: "Let's create something", closingHeading2: 'worth remembering.', closingDescription: 'Tell us about your brand, your vision and the story you want to bring to life.', closingCta: 'Start A Project',
    },
  },
  {
    pageKey: 'services', key: 'main', title: 'Services Page',
    description: 'Edit Services page headings and closing call-to-action. Individual service cards are managed in Services.',
    fields: [
      { key: 'heroEyebrow', label: 'Hero Label' }, { key: 'heroLine1', label: 'Hero Heading Line 1' }, { key: 'heroLine2', label: 'Hero Heading Line 2' }, { key: 'heroDescription', label: 'Hero Description', multiline: true },
      { key: 'sectionEyebrow', label: 'Capabilities Label' }, { key: 'sectionLine1', label: 'Capabilities Heading Line 1' }, { key: 'sectionLine2', label: 'Capabilities Heading Line 2' }, { key: 'sectionDescription', label: 'Capabilities Description', multiline: true },
      { key: 'cardCta', label: 'Service Card Link Text' }, { key: 'closingEyebrow', label: 'Closing Label' }, { key: 'closingLine1', label: 'Closing Heading Line 1' }, { key: 'closingLine2', label: 'Closing Heading Line 2' }, { key: 'closingDescription', label: 'Closing Description', multiline: true }, { key: 'closingCta', label: 'Closing Button Text' },
    ],
    defaults: {
      heroEyebrow: 'What we create', heroLine1: 'One creative house.', heroLine2: 'Endless possibilities.', heroDescription: 'From the first idea to the final frame, we bring concepts to life through thoughtful planning, professional production and cinematic storytelling.',
      sectionEyebrow: 'Our capabilities', sectionLine1: 'Everything your story', sectionLine2: 'needs to be seen.', sectionDescription: 'Explore our creative production services. Whether you need a single shoot or a complete campaign, we bring the right people, ideas and production expertise together.',
      cardCta: 'Discuss your project', closingEyebrow: 'Have a project in mind?', closingLine1: "Let's create something", closingLine2: 'worth remembering.', closingDescription: "Tell us what you have in mind. We'll help shape the concept, plan the production and bring your vision to life.", closingCta: 'Start a project',
    },
  },
  {
    pageKey: 'portfolio', key: 'main', title: 'Portfolio Page',
    description: 'Edit Portfolio page headings and closing call-to-action. Project cards are managed in Projects.',
    fields: [
      { key: 'heroEyebrow', label: 'Hero Label' }, { key: 'heroLine1', label: 'Hero Heading Line 1' }, { key: 'heroLine2', label: 'Hero Heading Line 2' }, { key: 'heroDescription', label: 'Hero Description', multiline: true },
      { key: 'sectionEyebrow', label: 'Portfolio Section Label' }, { key: 'sectionLine1', label: 'Section Heading Line 1' }, { key: 'sectionLine2', label: 'Section Heading Line 2' }, { key: 'sectionDescription', label: 'Section Description', multiline: true },
      { key: 'closingEyebrow', label: 'Closing Label' }, { key: 'closingLine1', label: 'Closing Heading Line 1' }, { key: 'closingLine2', label: 'Closing Heading Line 2' }, { key: 'closingCta', label: 'Closing Button Text' },
    ],
    defaults: {
      heroEyebrow: 'Our visual world', heroLine1: 'Stories made', heroLine2: 'to be remembered.', heroDescription: 'Every frame has a purpose. Explore the creative directions, visual styles and production possibilities we bring to brands and businesses.',
      sectionEyebrow: 'Selected visual directions', sectionLine1: 'Different stories.', sectionLine2: 'One creative vision.', sectionDescription: 'Explore our range of visual storytelling across different formats, industries and creative styles. Published projects are updated directly from our production studio.',
      closingEyebrow: 'Have a story to tell?', closingLine1: 'Have a story that needs', closingLine2: 'a visual world?', closingCta: 'Bring us the brief',
    },
  },
  {
    pageKey: 'contact', key: 'main', title: 'Contact Page',
    description: 'Edit Contact page introduction and enquiry panel headings. Enquiry submission remains unchanged.',
    fields: [
      { key: 'heroEyebrow', label: 'Top Label' }, { key: 'heroLine1', label: 'Heading Line 1' }, { key: 'heroLine2', label: 'Heading Line 2' }, { key: 'heroDescription', label: 'Introduction', multiline: true },
      { key: 'formEyebrow', label: 'Form Top Label' }, { key: 'formHeading', label: 'Form Heading' }, { key: 'sideEyebrow', label: 'Side Panel Label' }, { key: 'sideHeading', label: 'Side Panel Heading' }, { key: 'sideDescription', label: 'Side Panel Description', multiline: true },
    ],
    defaults: {
      heroEyebrow: "Let's create something together", heroLine1: 'Have a project', heroLine2: 'in mind?', heroDescription: "Every great visual begins with an idea. Tell us what you're planning, and let's turn that idea into something worth remembering.",
      formEyebrow: 'Start a conversation', formHeading: 'Tell us about your project.', sideEyebrow: 'Project enquiry', sideHeading: "Let's create something memorable.", sideDescription: 'Share your project requirements with us. Our creative team will get back to you.',
    },
  },
  {
    pageKey: 'global', key: 'main', title: 'Global Settings',
    description: 'Edit shared navigation labels and footer information across the website.',
    fields: [
      { key: 'navHome', label: 'Navigation: Home' }, { key: 'navAbout', label: 'Navigation: About' }, { key: 'navServices', label: 'Navigation: Services' }, { key: 'navPortfolio', label: 'Navigation: Portfolio' }, { key: 'navContact', label: 'Navigation: Contact' }, { key: 'navCta', label: 'Navigation Button Text' },
      { key: 'footerDescription', label: 'Footer Description', multiline: true }, { key: 'footerTagline', label: 'Footer Tagline' }, { key: 'footerEmail', label: 'Footer Email' }, { key: 'footerPhone', label: 'Footer WhatsApp Display' }, { key: 'footerLocation', label: 'Footer Location' }, { key: 'footerAvailability', label: 'Footer Availability Text' }, { key: 'footerClosing', label: 'Footer Closing Line' },
    ],
    defaults: {
      navHome: 'Home', navAbout: 'About', navServices: 'Services', navPortfolio: 'Portfolio', navContact: 'Contact', navCta: 'Start a Project',
      footerDescription: 'An independent creative media production house creating powerful visual stories for ambitious brands.', footerTagline: 'From Concept to Shoot', footerEmail: 'mediazzhub@gmail.com', footerPhone: 'WhatsApp · +91 8358063254', footerLocation: 'Indore, Madhya Pradesh, India', footerAvailability: 'Available for projects across India', footerClosing: 'Made for brands with somewhere to go.',
    },
  },
]

export default function AdminHomepageContentPage() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('homepage:hero')
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const activeSection = sections.find((item) => (item.pageKey || 'homepage') + ':' + item.key === activeId)
  const activeKey = activeSection?.key || ''
  const activePageKey = activeSection?.pageKey || 'homepage'

  useEffect(() => {
    let active = true
    async function loadSection() {
      setLoading(true); setError(''); setMessage('')
      if (!activeSection) { setLoading(false); return }
      const { data: draft, error: draftError } = await supabase.from('site_content').select('content').eq('page_key', activePageKey).eq('section_key', activeKey + '_draft').maybeSingle()
      if (draftError) setError(draftError.message)
      let content = draft?.content as Record<string, string> | null
      if (!content) {
        const { data, error: readError } = await supabase.from('site_content').select('content').eq('page_key', activePageKey).eq('section_key', activeKey).maybeSingle()
        if (readError) setError(readError.message)
        content = data?.content as Record<string, string> | null
      }
      if (active) { setValues({ ...activeSection.defaults, ...(content || {}) }); setLoading(false) }
    }
    loadSection()
    return () => { active = false }
  }, [activeId])

  async function save(publish: boolean) {
    if (!activeSection) return
    setSaving(true); setError(''); setMessage('')
    const target = publish ? activeKey : activeKey + '_draft'
    const { error: writeError } = await supabase.from('site_content').upsert({
      page_key: activePageKey, section_key: target, content: values, is_published: publish, updated_at: new Date().toISOString(),
    }, { onConflict: 'page_key,section_key' })
    if (writeError) setError(writeError.message)
    else setMessage(publish ? activeSection.title + ' successfully published.' : 'Draft saved. Live website is unchanged.')
    setSaving(false)
  }

  return <main className="min-h-screen bg-[#171512] px-4 py-8 text-white sm:px-8"><div className="mx-auto max-w-5xl">
    <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-sm text-[#c5a46d]"><ArrowLeft size={16}/> Back to Dashboard</button>
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c5a46d]">Website Content Manager</p>
    <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Website CMS</h1>
    <p className="mt-3 text-sm text-white/50">Manage all website pages from one place. Select a page or shared settings tab, edit its content, then save as draft or publish.</p>
    <div className="my-7 flex flex-wrap gap-2">{sections.map((section) => <button key={(section.pageKey || 'homepage') + ':' + section.key} onClick={() => setActiveId((section.pageKey || 'homepage') + ':' + section.key)} className={activeId === (section.pageKey || 'homepage') + ':' + section.key ? 'rounded-lg bg-[#c5a46d] px-4 py-2 text-sm font-semibold text-[#171512]' : 'rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70'}>{section.title}</button>)}<button onClick={() => setActiveId('manage-services')} className={activeId === 'manage-services' ? 'rounded-lg bg-[#c5a46d] px-4 py-2 text-sm font-semibold text-[#171512]' : 'rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70'}>Manage Service Cards</button><button onClick={() => setActiveId('manage-testimonials')} className={activeId === 'manage-testimonials' ? 'rounded-lg bg-[#c5a46d] px-4 py-2 text-sm font-semibold text-[#171512]' : 'rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70'}>Manage Testimonials</button></div>
    <div className="mb-6"><h2 className="text-2xl font-serif">{activeSection?.title || (activeId === 'manage-services' ? 'Manage Service Cards' : 'Manage Testimonials')}</h2>{activeSection && <p className="mt-2 text-sm text-white/50">{activeSection.description}</p>}</div>
    {message && <p className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</p>}
    {error && <p className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
    {activeId === 'manage-services' ? <AdminServicesPage /> : activeId === 'manage-testimonials' ? <AdminTestimonialsPage /> : loading ? <p className="text-[#c5a46d]">Loading section...</p> : <div className="grid gap-5 md:grid-cols-2">{(activeSection?.fields || []).map((field) => <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/65">{field.label}</span>{field.multiline ? <textarea rows={4} value={values[field.key] || ''} onChange={(e) => setValues((old) => ({ ...old, [field.key]: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"/> : <input value={values[field.key] || ''} onChange={(e) => setValues((old) => ({ ...old, [field.key]: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#211e19] px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"/>}{field.hint && <span className="mt-1 block text-[11px] text-white/35">{field.hint}</span>}</label>)}</div>}
    {activeSection && <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6"><button disabled={saving || loading} onClick={() => save(false)} className="flex items-center gap-2 rounded-lg border border-[#c5a46d]/50 px-5 py-3 text-sm font-semibold text-[#e0bd7e] disabled:opacity-50"><Save size={16}/>{saving ? 'Saving...' : 'Save Draft'}</button><button disabled={saving || loading} onClick={() => save(true)} className="flex items-center gap-2 rounded-lg bg-[#c5a46d] px-5 py-3 text-sm font-bold text-[#171512] disabled:opacity-50"><Send size={16}/>{saving ? 'Publishing...' : 'Publish to Website'}</button></div>
    <p className="mt-4 text-xs text-white/35">Draft and published content are stored separately for each section. Publishing changes only the selected section.</p>
  </div></main>
}
