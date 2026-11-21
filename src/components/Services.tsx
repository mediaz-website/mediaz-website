import {
  ArrowUpRight, Bot, Camera, Clapperboard, Code2, Film, Image,
  Lightbulb, Megaphone, Mic2, Search, Share2, Video, Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { images } from '../lib/images'
import { Reveal } from './Motion'
import { useHomepageSection } from '../hooks/useHomepageSection'

interface ServicesSectionContent extends Record<string, string> {
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  description: string
  topLinkText: string
  bottomLinkText: string
}

const defaultSectionContent: ServicesSectionContent = {
  eyebrow: 'What we create',
  headlineLine1: 'The art of',
  headlineLine2: 'visual storytelling.',
  description: 'AI-powered media, production automation, digital solutions and professional on-ground shoots — connected under one creative partner.',
  topLinkText: 'Explore all capabilities',
  bottomLinkText: 'Discover all services',
}

type Service = {
  title: string
  slug: string
  description: string
  icon: LucideIcon
  image: string
  mode: 'AI Media' | 'On-ground'
}

const services: Service[] = [
  { title: 'AI Video Production', slug: 'ai-video-production', description: 'AI-powered brand films, product videos, ads, explainers and reels.', icon: Clapperboard, image: images.creative, mode: 'AI Media' },
  { title: 'AI Voiceover & Audio', slug: 'ai-voiceover-audio', description: 'Voiceovers, narration and multilingual audio for digital content.', icon: Mic2, image: images.studio, mode: 'AI Media' },
  { title: 'AI Image & Creative Production', slug: 'ai-image-creative-production', description: 'Campaign visuals, product concepts and scroll-stopping creative assets.', icon: Image, image: images.fashion, mode: 'AI Media' },
  { title: 'AI Automation & Workflows', slug: 'ai-automation-workflows', description: 'Smart systems that simplify content, approvals and repetitive work.', icon: Workflow, image: images.creative, mode: 'AI Media' },
  { title: 'Social Media & Profile Management', slug: 'social-media-management', description: 'Content planning, publishing workflows and profile management.', icon: Share2, image: images.neonFashion, mode: 'AI Media' },
  { title: 'Website Development', slug: 'website-development', description: 'Business websites and landing pages built around your goals.', icon: Code2, image: images.studio, mode: 'AI Media' },
  { title: 'SEO & AEO', slug: 'seo-aeo', description: 'Improve brand discovery across search engines and AI answers.', icon: Search, image: images.creative, mode: 'AI Media' },
  { title: 'AI Tools & Integrations', slug: 'ai-tools-integrations', description: 'Connected AI tools and assistants for smarter business workflows.', icon: Bot, image: images.lifestyle, mode: 'AI Media' },
  { title: 'Commercial & Advertising Shoots', slug: 'commercial-advertising-shoots', description: 'Campaign films, brand commercials and promotional productions.', icon: Megaphone, image: images.camera, mode: 'On-ground' },
  { title: 'Product & Brand Photography', slug: 'product-brand-photography', description: 'Studio and location photography for products, catalogues and brands.', icon: Camera, image: images.clothing, mode: 'On-ground' },
  { title: 'Reels & Video Production', slug: 'reels-video-production', description: 'On-location reels, social videos, interviews and brand stories.', icon: Video, image: images.photographer, mode: 'On-ground' },
  { title: 'Podcast & Interview Production', slug: 'podcast-interview-production', description: 'Podcast shoots, founder conversations and multi-camera interviews.', icon: Mic2, image: images.studio, mode: 'On-ground' },
  { title: 'Events & Live Coverage', slug: 'events-live-coverage', description: 'Event films, highlights and live coverage across India.', icon: Film, image: images.food, mode: 'On-ground' },
  { title: 'Short Films & Documentaries', slug: 'short-films-documentaries', description: 'Documentaries, short films and purpose-led visual storytelling.', icon: Lightbulb, image: images.camera, mode: 'On-ground' },
]

export default function Services() {
  const sectionContent = useHomepageSection('services_section', defaultSectionContent)

  return (
    <section id="services" className="relative overflow-hidden bg-[#0b0b0d] py-16 sm:py-24 lg:py-36">
      <div className="pointer-events-none absolute -left-48 top-1/4 size-[34rem] rounded-full bg-[#c5a46d]/[0.045] blur-[110px]" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:mb-14 sm:gap-8 lg:mb-20 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">{sectionContent.eyebrow}</p>
            <h2 className="max-w-3xl font-display text-[2.65rem] leading-[.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
              {sectionContent.headlineLine1}<br /><span className="italic text-[#e0bd7e]">{sectionContent.headlineLine2}</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-white/60">{sectionContent.description}</p>
            <Link to="/services#services-grid" className="mt-6 inline-flex items-center gap-3 border-b border-[#c5a46d]/60 pb-2 text-[10px] font-semibold tracking-[0.2em] text-[#e0bd7e] uppercase transition-colors hover:text-white">
              {sectionContent.topLinkText}<ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">14 capabilities · 2 production formats</p>
          <span className="border border-[#c5a46d]/30 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e0bd7e]">Service previews</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:gap-5">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Reveal key={service.slug} delay={(index % 4) * 0.05} className={`h-full ${index % 7 === 0 ? "lg:col-span-5" : index % 7 === 1 ? "lg:col-span-7" : "lg:col-span-4"}`}>
                <Link to={`/services#service-${service.slug}`} className="group relative block h-full min-h-[230px] overflow-hidden rounded-[2px] sm:min-h-[300px] bg-[#211e19] transition-transform duration-700 hover:-translate-y-2 sm:min-h-[350px] lg:min-h-[390px]">
                  <img src={service.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />
                  <div className="absolute inset-0 border border-white/10 transition duration-500 group-hover:border-[#c5a46d]/70" />
                  <div className="relative flex min-h-[230px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6 sm:min-h-[350px]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-white/70">{String(index + 1).padStart(2, '0')}</span>
                      <span className="flex size-10 items-center justify-center border border-white/30 bg-black/20 text-[#e0bd7e] backdrop-blur-sm"><Icon size={18} strokeWidth={1.5} /></span>
                    </div>
                    <div>
                      <span className="mb-3 inline-flex border border-white/25 bg-black/25 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#e0bd7e]">{service.mode}</span>
                      <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-2xl">{service.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70">{service.description}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/25 pt-3 sm:mt-5 sm:pt-4">
                        <span className="text-[9px] font-semibold tracking-[0.25em] text-white/70 uppercase">Explore service</span>
                        <ArrowUpRight size={17} className="text-[#e0bd7e] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex justify-center lg:mt-16">
          <Link to="/services#services-grid" className="group inline-flex items-center gap-4 border border-[#c5a46d]/60 px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition duration-300 hover:bg-[#c5a46d] hover:text-[#171512]">
            {sectionContent.bottomLinkText}<ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
