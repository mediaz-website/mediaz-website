import { ArrowUpRight, Camera, Clapperboard, Film, Lightbulb, Play, Sparkles, Video, WandSparkles } from 'lucide-react'
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
    <section id="services" className="bg-ink-950 py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-16 flex flex-col justify-between gap-8 lg:mb-24 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-white/45 uppercase">Capabilities</p>
            <h2 className="max-w-2xl font-display text-5xl leading-[0.92] font-bold tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">The full picture.<br /><span className="text-white/35">No weak frames.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">A single creative partner for the full production journey, from the first spark to the final frame.</p>
        </Reveal>
        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, tag, icon: Icon, image }, index) => (
            <Reveal key={title} delay={index * 0.04} className="h-full">
              <article className="group relative h-full min-h-72 overflow-hidden bg-ink-900">
                <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale transition duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
                <div className="relative flex h-full min-h-72 flex-col justify-between p-6">
                  <div className="flex items-start justify-between"><span className="text-[10px] tracking-[0.3em] text-white/50">{tag}</span><Icon size={19} strokeWidth={1.5} className="text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                  <div><h3 className="font-display text-xl font-semibold tracking-tight text-white">{title}</h3><div className="mt-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase opacity-0 transition-opacity group-hover:opacity-100">Explore <ArrowUpRight size={13} /></div></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
