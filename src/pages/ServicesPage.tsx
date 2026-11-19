
import { useEffect } from 'react'
import { ArrowUpRight, Clapperboard, Camera, Video, Play, Film, Lightbulb, Mic2, FileVideo, Sparkles, Music, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceDetails } from '../lib/services'
import { PageHero, PageMeta, SectionHeading } from '../components/PageFrame'
import { Reveal } from '../components/Motion'

const serviceIcons = [
  Clapperboard,
  Sparkles,
  Camera,
  Play,
  Video,
  Film,
  Camera,
  Lightbulb,
  Mic2,
  FileVideo,
  Sparkles,
  Music,
  Megaphone,
]

export default function ServicesPage() {
  useEffect(() => {
    if (window.location.hash === '#service-08') {
      const timer = window.setTimeout(() => {
        document.getElementById('service-08')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 600)

      return () => window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <PageMeta
        title="Services"
        description="Explore Mediazz Hub's complete creative production services, from commercial films and product shoots to podcasts, documentaries, campaigns and photography."
      />

      <PageHero
        eyebrow="What we create"
        title={
          <>
            One creative house.
            <br />
            <span className="text-white/35">Endless possibilities.</span>
          </>
        }
        description="From the first idea to the final frame, we bring concepts to life through thoughtful planning, professional production and cinematic storytelling."
      />

      <main className="bg-ink-950">
        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <SectionHeading
            eyebrow="Our capabilities"
            title={
              <>
                Everything your story
                <br />
                <span className="text-white/35">needs to be seen.</span>
              </>
            }
            detail="Explore our creative production services. Whether you need a single shoot or a complete campaign, we bring the right people, ideas and production expertise together."
          />

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceDetails.map((service, index) => {
              const Icon = serviceIcons[index] || Camera

              return (
                <Reveal key={service.number} delay={(index % 3) * 0.06}>
                  <article
                    id={service.number === '08' ? 'service-08' : undefined}
                    className="group flex h-full scroll-mt-28 flex-col overflow-hidden border border-white/10 bg-[#211e19] transition duration-500 hover:border-[#c5a46d]/60"
                  >
                    <div className="relative h-64 overflow-hidden sm:h-72">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />

                      <div className="absolute left-6 top-6 flex items-center gap-3">
                        <span className="font-mono text-xs tracking-[0.2em] text-white/70">
                          {service.number}
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

                      <p className="mt-3 text-sm font-medium text-[#e0bd7e]">
                        {service.short}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-white/60">
                        {service.description}
                      </p>

                      <div className="mt-7 border-t border-white/10 pt-5">
                        <p className="mb-4 text-[9px] font-semibold tracking-[0.25em] text-white/40 uppercase">
                          What we deliver
                        </p>

                        <ul className="space-y-2">
                          {service.deliverables.map((deliverable) => (
                            <li
                              key={deliverable}
                              className="flex items-start gap-3 text-xs leading-relaxed text-white/65"
                            >
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#c5a46d]" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        to="/contact"
                        className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:text-[#e0bd7e]"
                      >
                        Discuss your project
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
        </section>

        <section className="border-t border-white/10 bg-[#0b0b0b] py-24 lg:py-32">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end lg:px-12">
            <div className="max-w-3xl">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">
                Have a project in mind?
              </p>

              <h2 className="font-serif text-5xl leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Let's create something
                <br />
                <span className="italic text-[#e0bd7e]">worth remembering.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55">
                Tell us what you have in mind. We'll help shape the concept,
                plan the production and bring your vision to life.
              </p>
            </div>

            <Link
              to="/contact"
              className="flex w-fit shrink-0 items-center gap-4 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#171512] uppercase transition duration-300 hover:bg-[#e0bd7e]"
            >
              Start a project
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
