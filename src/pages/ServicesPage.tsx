import {
  ArrowDownRight, ArrowUpRight, Bot, Camera, Clapperboard, Code2,
  Film, Image, Megaphone, Mic2, Search, Share2, Sparkles, Video, Workflow,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PageMeta } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { images } from '../lib/images'

const aiServices = [
  { slug: 'ai-video-production', title: 'AI Video Production', text: 'Promotional films, product videos, AI ads, reels, explainers and virtual influencer content.', icon: Clapperboard, tag: 'Video & motion' },
  { slug: 'ai-voiceover-audio', title: 'AI Voiceover & Audio', text: 'Natural-sounding voiceovers, narration, multilingual audio and sound support for campaigns.', icon: Mic2, tag: 'Voice & sound' },
  { slug: 'ai-image-creative-production', title: 'AI Image & Creative Production', text: 'Campaign visuals, product concepts, creative assets and image-generation workflows.', icon: Image, tag: 'Visual creation' },
  { slug: 'ai-automation-workflows', title: 'AI Automation & Workflows', text: 'Custom workflows for content planning, production coordination, approvals and repetitive tasks.', icon: Workflow, tag: 'Systems & automation' },
  { slug: 'social-media-management', title: 'Social Media & Profile Management', text: 'Content calendars, profile management, publishing workflows and ongoing social support.', icon: Share2, tag: 'Digital presence' },
  { slug: 'website-development', title: 'Website Development', text: 'Business websites, landing pages and digital experiences designed around your goals.', icon: Code2, tag: 'Web experiences' },
  { slug: 'seo-aeo', title: 'SEO & AEO', text: 'Search and answer-engine optimisation to make your brand easier to discover online.', icon: Search, tag: 'Search visibility' },
  { slug: 'ai-tools-integrations', title: 'AI Tools & Integrations', text: 'Practical AI assistants, connected tools and integrations that help teams work smarter.', icon: Bot, tag: 'Connected tools' },
]

const groundServices = [
  { slug: 'commercial-advertising-shoots', title: 'Commercial & Advertising Shoots', text: 'Campaign films, ad shoots, brand commercials and promotional productions.', icon: Megaphone, tag: 'Campaign production' },
  { slug: 'product-brand-photography', title: 'Product & Brand Photography', text: 'Studio and location photography, catalogues, ecommerce visuals and brand imagery.', icon: Camera, tag: 'Photography' },
  { slug: 'reels-video-production', title: 'Reels & Video Production', text: 'On-location reels, social videos, corporate films, interviews and brand stories.', icon: Video, tag: 'Video production' },
  { slug: 'podcast-interview-production', title: 'Podcast & Interview Production', text: 'Multi-camera podcasts, interviews, founder stories and professional studio shoots.', icon: Mic2, tag: 'Audio & conversation' },
  { slug: 'events-live-coverage', title: 'Events & Live Coverage', text: 'Event films, live coverage, highlight edits and brand activations across India.', icon: Film, tag: 'Events' },
  { slug: 'short-films-documentaries', title: 'Short Films & Documentaries', text: 'Documentaries, short films, institutional films and visual storytelling.', icon: Clapperboard, tag: 'Film & storytelling' },
]

function CapabilityCard({ item, index, tone }: { item: typeof aiServices[number] | typeof groundServices[number]; index: number; tone: 'ai' | 'ground' }) {
  const Icon = item.icon
  return (
    <Reveal delay={(index % 4) * 0.05} className="h-full">
      <article id={`service-${item.slug}`} className="group flex h-full scroll-mt-32 flex-col border border-white/10 bg-[#201e1a] p-6 transition duration-500 hover:-translate-y-1 hover:border-[#c5a46d]/65 hover:bg-[#28241e] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-12 items-center justify-center border border-[#c5a46d]/35 bg-[#c5a46d]/10 text-[#e0bd7e]"><Icon size={21} strokeWidth={1.5} /></span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#c5a46d]">{item.tag}</p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">{item.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{item.text}</p>
        <Link to="/contact" className="mt-7 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-[#e0bd7e]">
          Discuss this service <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </article>
    </Reveal>
  )
}

export default function ServicesPage() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const targetId = decodeURIComponent(location.hash.slice(1))
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 450)
    return () => window.clearTimeout(timer)
  }, [location.hash])

  return (
    <>
      <PageMeta title="Services" description="Explore Mediazz Hub's AI media production and on-ground production services, from AI videos and automation to commercial shoots, photography and films." />
      <main className="overflow-hidden bg-[#171512] text-white">
        <section className="relative flex min-h-[78vh] items-end border-b border-white/10 px-6 pb-14 pt-36 lg:min-h-[82vh] lg:px-12 lg:pb-20">
          <div className="absolute inset-0">
            <img src={images.creative} alt="" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171512] via-[#171512]/90 to-[#171512]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-transparent to-[#171512]/30" />
          </div>
          <div className="relative mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <Reveal>
              <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d0b27c]"><span className="h-px w-9 bg-[#c5a46d]" /> Two production worlds. One creative partner.</p>
              <h1 className="max-w-4xl font-display text-[clamp(3.5rem,8vw,8.5rem)] font-extrabold leading-[.88] tracking-[-.075em]">Make it <span className="text-[#d8bb87]">real.</span><br />Make it <span className="text-white/45">remarkable.</span></h1>
              <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">From AI-powered media and smart automation to real-world shoots and films — explore every way Mediazz Hub can bring your brand to life.</p>
            </Reveal>
            <Reveal delay={0.12} className="grid gap-3 sm:grid-cols-2">
              <a href="#ai-production" className="group border border-[#c5a46d]/55 bg-[#c5a46d]/10 p-5 backdrop-blur-sm transition hover:bg-[#c5a46d]/20 sm:p-6">
                <Sparkles className="mb-8 text-[#e0bd7e]" size={25} />
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#e0bd7e]">01 / Worldwide</span>
                <strong className="mt-2 block font-display text-xl leading-tight sm:text-2xl">AI Media & Technology</strong>
                <span className="mt-4 flex items-center gap-2 text-xs text-white/60">Explore AI services <ArrowDownRight size={15} className="transition-transform group-hover:translate-y-1" /></span>
              </a>
              <a href="#on-ground-production" className="group border border-white/20 bg-black/20 p-5 backdrop-blur-sm transition hover:border-[#c5a46d]/55 hover:bg-white/5 sm:p-6">
                <Camera className="mb-8 text-[#e0bd7e]" size={25} />
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">02 / Pan India</span>
                <strong className="mt-2 block font-display text-xl leading-tight sm:text-2xl">On-ground Production</strong>
                <span className="mt-4 flex items-center gap-2 text-xs text-white/60">Explore shoot services <ArrowDownRight size={15} className="transition-transform group-hover:translate-y-1" /></span>
              </a>
            </Reveal>
            <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40 lg:col-span-2"><span>Concept & strategy</span><span>Production & execution</span><span>Editing & delivery</span><span>Indore · India · Worldwide</span></div>
          </div>
        </section>

        <section id="services-grid" className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-l-2 border-[#c5a46d] pl-5"><p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c5a46d]">AI production</p><p className="mt-2 text-sm text-white/60">Digital-first content, creative technology and workflows. Available worldwide.</p></div>
            <div className="border-l-2 border-white/30 pl-5"><p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/65">On-ground production</p><p className="mt-2 text-sm text-white/60">Physical shoots, photography, films and event coverage. Available Pan India.</p></div>
          </div>
        </section>

        <section id="ai-production" className="scroll-mt-24 border-y border-white/10 bg-[#1d1a16] py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <Reveal className="mb-12 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d5b77e]">01 / Worldwide availability</p><h2 className="font-display text-5xl font-extrabold leading-[.94] tracking-[-.065em] sm:text-6xl lg:text-8xl">AI Media <span className="text-[#d5b77e]">&</span><br />Technology.</h2></div>
              <div><p className="max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">Create, scale and manage digital media with AI-powered production, creative services and connected workflows. Work with us from anywhere in the world.</p><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d5b77e]">Remote collaboration · Worldwide delivery</p></div>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{aiServices.map((item, index) => <CapabilityCard key={item.slug} item={item} index={index} tone="ai" />)}</div>
            <div className="mt-12 grid gap-6 border border-[#c5a46d]/30 bg-[#c5a46d]/[0.07] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b77e]">Actual work · AI media & automation</p><h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">See ideas turned into real digital experiences.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Explore AI-generated videos, virtual influencer content, creative experiments and production workflows made by Mediazz Hub.</p></div>
              <Link to="/portfolio" className="inline-flex w-fit items-center gap-3 bg-[#c5a46d] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512] transition hover:bg-[#e0bd7e]">View AI work in portfolio <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section id="on-ground-production" className="scroll-mt-24 bg-[#171512] py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <Reveal className="mb-12 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d5b77e]">02 / Pan India availability</p><h2 className="font-display text-5xl font-extrabold leading-[.94] tracking-[-.065em] sm:text-6xl lg:text-8xl">On-ground<br /><span className="text-white/40">Production.</span></h2></div>
              <div><p className="max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">Real locations. Real people. Real stories. Our production team plans and executes shoots across India, from concept and pre-production to final editing.</p><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d5b77e]">Shoot planning · On-location execution · Final edits</p></div>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{groundServices.map((item, index) => <CapabilityCard key={item.slug} item={item} index={index} tone="ground" />)}</div>
            <div className="mt-12 grid gap-6 border border-white/15 bg-white/[0.035] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b77e]">Actual work · On-ground production</p><h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">See the craft behind every frame.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Browse commercial shoots, product photography, reels, brand films, podcasts and other productions delivered by our crew.</p></div>
              <Link to="/portfolio" className="inline-flex w-fit items-center gap-3 border border-[#c5a46d] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e0bd7e] transition hover:bg-[#c5a46d] hover:text-[#171512]">View production portfolio <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#0d0c0a] py-20 lg:py-28">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-6 lg:flex-row lg:items-end lg:px-12">
            <div className="max-w-3xl"><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d5b77e]">One brief. The right production mix.</p><h2 className="font-display text-4xl font-extrabold leading-tight tracking-[-.06em] sm:text-6xl">Not sure which route <span className="text-[#d5b77e]">fits your idea?</span></h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">Tell us what you want to create. We’ll recommend the right combination of AI media, on-ground production and automation.</p></div>
            <Link to="/contact" className="inline-flex w-fit items-center gap-3 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512] transition hover:bg-[#e0bd7e]">Plan a project <ArrowUpRight size={17} /></Link>
          </div>
        </section>
      </main>
    </>
  )
}
