
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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { images } from '../lib/images'
import { Reveal } from './Motion'

const services = [
  { title: 'Commercial Shoot', tag: '01', icon: Clapperboard, image: images.camera },
  { title: 'Product Shoot', tag: '02', icon: Sparkles, image: images.clothing },
  { title: 'Photography', tag: '03', icon: Camera, image: images.photographer },
  { title: 'Video Production', tag: '04', icon: Video, image: images.studio },
  { title: 'Reels Production', tag: '05', icon: Play, image: images.neonFashion },
  { title: 'Brand Shoot', tag: '06', icon: WandSparkles, image: images.fashion },
  { title: 'Ad Shoot', tag: '07', icon: Film, image: images.food },
  { title: 'Creative Strategy', tag: '08', icon: Lightbulb, image: images.creative },
]

export default function Services() {
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, tag, icon: Icon, image }, index) => (
            <Reveal key={title} delay={(index % 4) * 0.06} className="h-full">
              <Link
                to="/services#service-08"
                className="group relative block h-full min-h-[320px] overflow-hidden bg-[#211e19] sm:min-h-[350px]"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 transition-colors duration-500 group-hover:from-black/80" />

                <div className="absolute inset-0 border border-white/10 transition duration-500 group-hover:border-[#c5a46d]/70" />

                <div className="relative flex min-h-[320px] flex-col justify-between p-6 sm:min-h-[350px]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/70">
                      {tag}
                    </span>

                    <span className="flex size-10 items-center justify-center border border-white/30 bg-black/20 text-[#e0bd7e] backdrop-blur-sm transition duration-500 group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#171512]">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                      {title}
                    </h3>

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
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center lg:mt-16">
          <Link
            to="/services#service-08"
            className="group inline-flex items-center gap-4 border border-[#c5a46d]/60 px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition duration-300 hover:bg-[#c5a46d] hover:text-[#171512]"
          >
            Discover all 13 services
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>

      </div>
    </section>
  )
}
