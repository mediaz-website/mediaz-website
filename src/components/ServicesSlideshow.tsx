import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Camera,
  Clapperboard,
  Code2,
  Film,
  Image,
  Lightbulb,
  Megaphone,
  Mic2,
  Search,
  Share2,
  Video,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type ServiceSlide = {
  title: string
  slug: string
  description: string
  category: 'AI Media & Technology' | 'On-ground Production'
  icon: LucideIcon
}

const serviceSlides: ServiceSlide[] = [
  { title: 'AI Video Production', slug: 'ai-video-production', description: 'AI-powered brand films, product videos, ads, explainers and reels.', category: 'AI Media & Technology', icon: Clapperboard },
  { title: 'AI Voiceover & Audio', slug: 'ai-voiceover-audio', description: 'Voiceovers, narration and multilingual audio for digital content.', category: 'AI Media & Technology', icon: Mic2 },
  { title: 'AI Image & Creative Production', slug: 'ai-image-creative-production', description: 'Campaign visuals, product concepts and scroll-stopping creative assets.', category: 'AI Media & Technology', icon: Image },
  { title: 'AI Automation & Workflows', slug: 'ai-automation-workflows', description: 'Smart systems that simplify content, approvals and repetitive work.', category: 'AI Media & Technology', icon: Workflow },
  { title: 'Social Media & Profile Management', slug: 'social-media-management', description: 'Content planning, publishing workflows and profile management.', category: 'AI Media & Technology', icon: Share2 },
  { title: 'Website Development', slug: 'website-development', description: 'Business websites and landing pages built around your goals.', category: 'AI Media & Technology', icon: Code2 },
  { title: 'SEO & AEO', slug: 'seo-aeo', description: 'Improve brand discovery across search engines and AI answers.', category: 'AI Media & Technology', icon: Search },
  { title: 'AI Tools & Integrations', slug: 'ai-tools-integrations', description: 'Connected AI tools and assistants for smarter business workflows.', category: 'AI Media & Technology', icon: Bot },
  { title: 'Commercial & Advertising Shoots', slug: 'commercial-advertising-shoots', description: 'Campaign films, brand commercials and promotional productions.', category: 'On-ground Production', icon: Megaphone },
  { title: 'Product & Brand Photography', slug: 'product-brand-photography', description: 'Studio and location photography for products, catalogues and brands.', category: 'On-ground Production', icon: Camera },
  { title: 'Reels & Video Production', slug: 'reels-video-production', description: 'On-location reels, social videos, interviews and brand stories.', category: 'On-ground Production', icon: Video },
  { title: 'Podcast & Interview Production', slug: 'podcast-interview-production', description: 'Podcast shoots, founder conversations and multi-camera interviews.', category: 'On-ground Production', icon: Mic2 },
  { title: 'Events & Live Coverage', slug: 'events-live-coverage', description: 'Event films, highlights and live coverage across India.', category: 'On-ground Production', icon: Film },
  { title: 'Short Films & Documentaries', slug: 'short-films-documentaries', description: 'Documentaries, short films and purpose-led visual storytelling.', category: 'On-ground Production', icon: Lightbulb },
]

export default function ServicesSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = serviceSlides[activeIndex]
  const ActiveIcon = activeService.icon

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % serviceSlides.length)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + serviceSlides.length) % serviceSlides.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % serviceSlides.length)
  }

  return (
    <section
      aria-label="Our services slideshow"
      className="relative overflow-hidden border-y border-[#c5a46d]/20 bg-[#12110f] py-10 sm:py-14 lg:py-16"
    >
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#c5a46d]/[0.07] blur-3xl" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[#c5a46d] sm:text-[10px]">
              One creative partner · Complete capabilities
            </p>
            <h2 className="font-display text-xl tracking-[-0.03em] text-white sm:text-2xl lg:text-3xl">
              Explore our <span className="italic text-[#e0bd7e]">services.</span>
            </h2>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-lg text-[#e0bd7e] sm:text-xl">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="text-white/35"> / {String(serviceSlides.length).padStart(2, '0')}</span>
            </p>
            <p className="hidden text-[8px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:block">
              Auto slideshow · 1 sec
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[190px] items-center overflow-hidden border border-white/10 bg-gradient-to-r from-[#211e19] via-[#1b1916] to-[#171512] p-5 sm:min-h-[210px] sm:p-8 lg:min-h-[230px] lg:px-12">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#c5a46d]/[0.08] to-transparent sm:block" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.slug}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="relative z-10 flex w-full items-center gap-4 sm:gap-7 lg:gap-10"
              aria-live="polite"
            >
              <div className="flex size-14 shrink-0 items-center justify-center border border-[#c5a46d]/40 bg-[#c5a46d]/10 text-[#e0bd7e] sm:size-20 lg:size-24">
                <ActiveIcon size={26} strokeWidth={1.35} className="sm:hidden" />
                <ActiveIcon size={34} strokeWidth={1.25} className="hidden sm:block lg:hidden" />
                <ActiveIcon size={40} strokeWidth={1.2} className="hidden lg:block" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#c5a46d] sm:text-[9px] sm:tracking-[0.25em]">
                  {activeService.category}
                </p>
                <h3 className="max-w-3xl font-display text-xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl">
                  {activeService.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-white/55 sm:mt-3 sm:text-sm">
                  {activeService.description}
                </p>
                <Link
                  to={`/services#service-${activeService.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#e0bd7e] transition-colors hover:text-white sm:mt-5 sm:text-[10px]"
                >
                  Explore service <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-1.5" aria-label={`Slide ${activeIndex + 1} of ${serviceSlides.length}`}>
            {serviceSlides.map((service, index) => (
              <span
                key={service.slug}
                className={`h-1 flex-1 transition-colors duration-200 ${index === activeIndex ? 'bg-[#c5a46d]' : 'bg-white/15'}`}
              />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous service"
              className="flex size-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-[#c5a46d] hover:text-[#e0bd7e]"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next service"
              className="flex size-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-[#c5a46d] hover:text-[#e0bd7e]"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
