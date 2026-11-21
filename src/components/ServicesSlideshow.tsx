import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type ServiceSlide = {
  title: string
  slug: string
  description: string
  category: 'AI Media & Technology' | 'On-ground Production'
  image: string
}

const serviceSlides: ServiceSlide[] = [
  { title: 'AI Video Production', slug: 'ai-video-production', description: 'AI-powered brand films, product videos, ads, explainers and reels.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=85' },
  { title: 'AI Voiceover & Audio', slug: 'ai-voiceover-audio', description: 'Voiceovers, narration and multilingual audio for digital content.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85' },
  { title: 'AI Image & Creative Production', slug: 'ai-image-creative-production', description: 'Campaign visuals, product concepts and scroll-stopping creative assets.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1000&q=85' },
  { title: 'AI Automation & Workflows', slug: 'ai-automation-workflows', description: 'Smart systems that simplify content, approvals and repetitive work.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Social Media & Profile Management', slug: 'social-media-management', description: 'Content planning, publishing workflows and profile management.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Website Development', slug: 'website-development', description: 'Business websites and landing pages built around your goals.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=85' },
  { title: 'SEO & AEO', slug: 'seo-aeo', description: 'Improve brand discovery across search engines and AI answers.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1000&q=85' },
  { title: 'AI Tools & Integrations', slug: 'ai-tools-integrations', description: 'Connected AI tools and assistants for smarter business workflows.', category: 'AI Media & Technology', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Commercial & Advertising Shoots', slug: 'commercial-advertising-shoots', description: 'Campaign films, brand commercials and promotional productions.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Product & Brand Photography', slug: 'product-brand-photography', description: 'Studio and location photography for products, catalogues and brands.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Reels & Video Production', slug: 'reels-video-production', description: 'On-location reels, social videos, interviews and brand stories.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Podcast & Interview Production', slug: 'podcast-interview-production', description: 'Podcast shoots, founder conversations and multi-camera interviews.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Events & Live Coverage', slug: 'events-live-coverage', description: 'Event films, highlights and live coverage across India.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Short Films & Documentaries', slug: 'short-films-documentaries', description: 'Documentaries, short films and purpose-led visual storytelling.', category: 'On-ground Production', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85' },
]

export default function ServicesSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const activeService = serviceSlides[activeIndex]

  useEffect(() => {
    if (isPaused) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % serviceSlides.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [isPaused])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX
    setIsPaused(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current !== null) {
      const swipeDistance = event.clientX - pointerStartX.current
      if (Math.abs(swipeDistance) > 50) {
        setActiveIndex((current) => (swipeDistance < 0
          ? (current + 1) % serviceSlides.length
          : (current - 1 + serviceSlides.length) % serviceSlides.length))
      }
    }
    pointerStartX.current = null
    setIsPaused(false)
  }

  const handlePointerCancel = () => {
    pointerStartX.current = null
    setIsPaused(false)
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
              Auto slideshow · 5 sec
            </p>
          </div>
        </div>

        <div\n          className="relative flex min-h-[190px] items-center overflow-hidden border border-white/10 bg-gradient-to-r from-[#211e19] via-[#1b1916] to-[#171512] p-5 sm:min-h-[210px] sm:p-8 lg:min-h-[230px] lg:px-12 touch-pan-y select-none cursor-grab active:cursor-grabbing"\n          onPointerDown={handlePointerDown}\n          onPointerUp={handlePointerUp}\n          onPointerCancel={handlePointerCancel}\n          onLostPointerCapture={handlePointerCancel}\n        >
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
              <div className="h-32 w-28 shrink-0 overflow-hidden border border-white/10 sm:h-40 sm:w-52 lg:h-44 lg:w-64">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
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

        </div>
      </div>
    </section>
  )
}
