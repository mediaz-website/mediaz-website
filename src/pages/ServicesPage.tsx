
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Clapperboard,
  Camera,
  Video,
  Play,
  Film,
  Lightbulb,
  Mic2,
  FileVideo,
  Sparkles,
  Music,
  Megaphone,
  WandSparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { serviceDetails } from '../lib/services'
import { PageHero, PageMeta, SectionHeading } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { useSiteContent } from '../hooks/useSiteContent'

interface Service {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  image_url: string | null
  icon: string | null
  sort_order: number
}

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  clapperboard: Clapperboard,
  film: Film,
  lightbulb: Lightbulb,
  play: Play,
  sparkles: Sparkles,
  video: Video,
  'wand-sparkles': WandSparkles,
  wand: WandSparkles,
  mic: Mic2,
  mic2: Mic2,
  'file-video': FileVideo,
  music: Music,
  megaphone: Megaphone,
}

function getServiceIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Camera

  const key = iconName.toLowerCase().trim().replaceAll(' ', '-')
  return iconMap[key] || iconMap[key.replaceAll('-', '')] || Camera
}

function getFallbackImage(title: string, index: number): string {
  const existingService = serviceDetails.find(
    (item) => item.title.toLowerCase() === title.toLowerCase()
  )

  if (existingService) return existingService.image

  const fallback = serviceDetails[index % serviceDetails.length]
  return fallback.image
}

export default function ServicesPage() {
  const pageContent = useSiteContent('services', 'main', {
    heroEyebrow: 'What we create', heroLine1: 'One creative house.', heroLine2: 'Endless possibilities.',
    heroDescription: 'From the first idea to the final frame, we bring concepts to life through thoughtful planning, professional production and cinematic storytelling.',
    sectionEyebrow: 'Our capabilities', sectionLine1: 'Everything your story', sectionLine2: 'needs to be seen.',
    sectionDescription: 'Explore our creative production services. Whether you need a single shoot or a complete campaign, we bring the right people, ideas and production expertise together.',
    cardCta: 'Discuss your project', closingEyebrow: 'Have a project in mind?', closingLine1: "Let's create something", closingLine2: 'worth remembering.',
    closingDescription: "Tell us what you have in mind. We'll help shape the concept, plan the production and bring your vision to life.", closingCta: 'Start a project',
  })
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchServices() {
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error loading services:', fetchError.message)

        if (active) {
          setError(true)
          setLoading(false)
        }

        return
      }

      if (active) {
        setServices(data || [])
        setLoading(false)
      }
    }

    fetchServices()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (loading || !window.location.hash) return

    const targetId = decodeURIComponent(window.location.hash.substring(1))

    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 400)

    return () => window.clearTimeout(timer)
  }, [loading, services])

  return (
    <>
      <PageMeta
        title="Services"
        description="Explore Mediazz Hub's creative production services, from commercial films and product shoots to brand campaigns and photography."
      />

      <PageHero
        eyebrow={pageContent.heroEyebrow}
        title={
          <>
            {pageContent.heroLine1}
            <br />
            <span className="text-white/35">{pageContent.heroLine2}</span>
          </>
        }
        description={pageContent.heroDescription}
      />

      <main className="bg-ink-950">
        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <SectionHeading
            eyebrow={pageContent.sectionEyebrow}
            title={
              <>
                {pageContent.sectionLine1}
                <br />
                <span className="text-white/35">{pageContent.sectionLine2}</span>
              </>
            }
            detail={pageContent.sectionDescription}
          />

          {loading ? (
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[550px] animate-pulse border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <p className="mt-16 text-center text-sm text-white/55">
              Services could not be loaded right now. Please refresh the page.
            </p>
          ) : services.length === 0 ? (
            <p className="mt-16 text-center text-sm text-white/55">
              Our services are being updated. Please check back soon.
            </p>
          ) : (
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.icon)
                const image =
                  service.image_url || getFallbackImage(service.title, index)

                return (
                  <Reveal key={service.id} delay={(index % 3) * 0.06}>
                    <article
                      id={`service-${service.slug}`}
                      className="group flex h-full scroll-mt-28 flex-col overflow-hidden border border-white/10 bg-[#211e19] transition duration-500 hover:border-[#c5a46d]/60"
                    >
                      <div className="relative h-64 overflow-hidden sm:h-72">
                        <img
                          src={image}
                          alt={service.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />

                        <div className="absolute left-6 top-6 flex items-center gap-3">
                          <span className="font-mono text-xs tracking-[0.2em] text-white/70">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="h-px w-8 bg-[#c5a46d]" />
                          <span className="text-[9px] font-semibold tracking-[0.25em] text-white/65 uppercase">
                            Mediazz Hub
                          </span>
                        </div>

                        <div className="absolute bottom-6 left-6 flex size-11 items-center justify-center border border-white/30 bg-black/25 text-[#e0bd7e] backdrop-blur-sm">
                          <Icon size={20} strokeWidth={1.4} />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-7">
                        <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                          {service.title}
                        </h3>

                        {service.short_description && (
                          <p className="mt-3 text-sm font-medium text-[#e0bd7e]">
                            {service.short_description}
                          </p>
                        )}

                        {service.description && (
                          <p className="mt-4 text-sm leading-relaxed text-white/60">
                            {service.description}
                          </p>
                        )}

                        <Link
                          to="/contact"
                          className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 mt-7 text-[10px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:text-[#e0bd7e]"
                        >
                          {pageContent.cardCta}
                          <ArrowUpRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}
        </section>

        <section className="border-t border-white/10 bg-[#0b0b0b] py-24 lg:py-32">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end lg:px-12">
            <div className="max-w-3xl">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">
                {pageContent.closingEyebrow}
              </p>

              <h2 className="font-serif text-5xl leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                {pageContent.closingLine1}
                <br />
                <span className="italic text-[#e0bd7e]">{pageContent.closingLine2}</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55">
                {pageContent.closingDescription}
              </p>
            </div>

            <Link
              to="/contact"
              className="flex w-fit shrink-0 items-center gap-4 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#171512] uppercase transition duration-300 hover:bg-[#e0bd7e]"
            >
              {pageContent.closingCta}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
