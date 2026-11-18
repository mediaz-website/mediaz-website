import { Clapperboard, Film, Palette, PenTool, Sparkles, Volume2 } from 'lucide-react'

const services = [
  {
    icon: Film,
    title: 'Brand Films',
    description:
      'Cinematic brand stories that capture who you are and why it matters — shot, directed and delivered end to end.',
  },
  {
    icon: Clapperboard,
    title: 'Commercial Production',
    description:
      'High-impact commercials for TV and digital, from concept boards to final broadcast-ready masters.',
  },
  {
    icon: Palette,
    title: 'Motion Design',
    description:
      'Kinetic typography, logo animation and full 2D/3D motion graphics that give your brand a living identity.',
  },
  {
    icon: Sparkles,
    title: 'Post-Production',
    description:
      'Precision editing, color grading, VFX and finishing that give every frame a polished, premium look.',
  },
  {
    icon: Volume2,
    title: 'Sound Design',
    description:
      'Original scores, mixing and sound design that add depth, emotion and atmosphere to every scene.',
  },
  {
    icon: PenTool,
    title: 'Creative Direction',
    description:
      'Concept development, scripting and art direction — the strategic thinking behind work that performs.',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-ink-300 uppercase">
              What We Do
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Full-stack production,
              <br />
              <span className="text-ink-400">under one roof.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-200">
            One team for the entire pipeline — strategy, shoot, sound and screen. No handoffs, no
            dilution of the vision.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-ink-700/60"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors duration-500 group-hover:bg-white group-hover:text-black">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-200">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
