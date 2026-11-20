
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Film,
  Lightbulb,
  Play,
  Sparkles,
  Video,
  WandSparkles,
  Mic2,
  FileVideo,
  Music,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../lib/images'
import { supabase } from '../lib/supabase'
import { Reveal } from './Motion'

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

const fallbackImages = [
  images.camera,
  images.clothing,
  images.photographer,
  images.studio,
  images.neonFashion,
  images.fashion,
  images.food,
  images.creative,
]

function getServiceIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Camera

  const key = iconName.toLowerCase().trim().replaceAll(' ', '-')
  return iconMap[key] || iconMap[key.replaceAll('-', '')] || Camera
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading homepage services:', error.message)
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

  return (
    <section id="services" className="bg-[#171512] py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-14 flex flex-col justify-between gap-8 lg:mb-20 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">
              What we create
            </p>

            <h2 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
              The art of
              <br />
              <span className="italic text-[#e0bd7e]">visual storytelling.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-white/60">
              From commercial films to brand campaigns, we bring concepts to life
              through creative thinking, professional production and powerful visuals.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-3 border-b border-[#c5a46d]/60 pb-2 text-[10px] font-semibold tracking-[0.2em] text-[#e0bd7e] uppercase transition-colors hover:text-white"
            >
              Explore all capabilities
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[320px] animate-pulse bg-white/5 sm:min-h-[350px]"
              />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon)
              const image =
                service.image_url || fallbackImages[index % fallbackImages.length]

              return (
                <Reveal key={service.id} delay={(index % 4) * 0.06} className="h-full">
                  <Link
                    to={`/services#service-${service.slug}`}
                    className="group relative block h-full min-h-[320px] overflow-hidden bg-[#211e19] sm:min-h-[350px]"
                  >
                    <img
                      src={image}
                      alt={service.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 transition-colors duration-500 group-hover:from-black/80" />

                    <div className="absolute inset-0 border border-white/10 transition duration-500 group-hover:border-[#c5a46d]/70" />

                    <div className="relative flex min-h-[320px] flex-col justify-between p-6 sm:min-h-[350px]">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-white/70">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="flex size-10 items-center justify-center border border-white/30 bg-black/20 text-[#e0bd7e] backdrop-blur-sm transition duration-500 group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#171512]">
                          <Icon size={18} strokeWidth={1.5} />
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                          {service.title}
                        </h3>

                        {service.short_description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/65">
                            {service.short_description}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
                          <span className="text-[9px] font-semibold tracking-[0.25em] text-white/65 uppercase">
                            Explore service
                          </span>

                          <ArrowUpRight
                            size={17}
                            className="text-[#e0bd7e] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-white/50">
            Our services are being updated. Please check back soon.
          </p>
        )}

        <Reveal className="mt-12 flex justify-center lg:mt-16">
          <Link
            to="/services"
            className="group inline-flex items-center gap-4 border border-[#c5a46d]/60 px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition duration-300 hover:bg-[#c5a46d] hover:text-[#171512]"
          >
            Discover all services
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
