import { ArrowUpRight, Play } from 'lucide-react'
import { images } from '../lib/images'
import { ParallaxImage, Reveal } from './Motion'
import { useHomepageSection } from '../hooks/useHomepageSection'

const projects = [
  { title: 'The Art of the Cut', type: 'Commercial · Film', image: images.camera, className: 'lg:col-span-7' },
  { title: 'Form / Function', type: 'Product · Still Life', image: images.clothing, className: 'lg:col-span-5 lg:mt-24' },
  { title: 'After Hours', type: 'Fashion · Campaign', image: images.neonFashion, className: 'lg:col-span-5' },
  { title: 'On the Table', type: 'Food · Lifestyle', image: images.food, className: 'lg:col-span-7 lg:mt-24' },
  { title: 'Anaya · AI Influencer Showcase', type: 'AI Media · Video Production', image: images.creative, className: 'lg:col-span-7' },
]

const sectionDefaults = { eyebrow: 'Selected work', headlineLine1: 'Made to be', headlineLine2: 'remembered.', ctaText: 'Start a conversation' }

export default function Portfolio() {
  const content = useHomepageSection('portfolio_section', sectionDefaults)
  return (
    <section id="work" data-section="selected-work" aria-label="Selected Work" className="relative overflow-hidden bg-[#111113] py-16 sm:py-28 lg:py-40">
      <div className="pointer-events-none absolute -right-48 top-1/3 size-[38rem] rounded-full border border-[#c5a46d]/10" /><div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:mb-16 sm:gap-8 lg:mb-24 lg:flex-row lg:items-end">
          <div><p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-white/45 uppercase">{content.eyebrow}</p><h2 className="font-display text-[2.65rem] leading-[.95] font-bold tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">{content.headlineLine1}<br /><span className="text-white/35">{content.headlineLine2}</span></h2></div>
          <a href="#contact" className="group flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-white uppercase">{content.ctaText} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
        </Reveal>
        <div className="grid gap-x-4 gap-y-10 sm:gap-y-14 lg:grid-cols-12 lg:gap-y-0">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08} className={project.className}>
              <article className="group cursor-pointer">
                <div className="mediazz-image-frame relative overflow-hidden bg-ink-700">
                  <ParallaxImage src={project.image} alt={project.title} className="h-[62vw] max-h-[660px] min-h-[210px] sm:min-h-[340px]" imageClassName="saturate-[.82] transition duration-1000 group-hover:scale-110 group-hover:saturate-100" />
                  <span className="absolute left-5 top-5 z-10 border border-[#e0bd7e]/60 bg-black/65 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-[#e0bd7e] uppercase backdrop-blur-sm">Demo concept</span><div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30"><div className="flex size-16 scale-90 items-center justify-center rounded-full border border-white/50 bg-black/25 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"><Play size={19} fill="currentColor" /></div></div>
                </div>
                <div className="mt-3 flex items-start justify-between border-t border-white/15 pt-4"><div><h3 className="font-display text-lg font-semibold text-white sm:text-xl">{project.title}</h3><p className="mt-1 text-[10px] font-semibold tracking-[0.25em] text-white/45 uppercase">{project.type}</p><p className="mt-2 text-[10px] font-medium tracking-[0.12em] text-[#e0bd7e]/80 uppercase">Real project showcase · Coming soon</p></div><ArrowUpRight size={18} className="text-white/45 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" /></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
