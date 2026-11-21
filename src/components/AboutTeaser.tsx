import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { images } from '../lib/images'
import { Reveal } from './Motion'

export default function AboutTeaser() {
  return (
    <section id="about-mediazz" aria-label="About Mediazz Hub" className="relative overflow-hidden border-y border-white/10 bg-[#111113] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12">
        <Reveal className="relative lg:col-span-6">
          <div className="mediazz-image-frame aspect-[4/3] overflow-hidden bg-[#1c1c20]">
            <img src={images.studio} alt="Mediazz Hub creative production studio and filming equipment" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/80 sm:bottom-6 sm:left-6">Behind every frame · A team with a vision</span>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c5a46d]">About Mediazz Hub</p>
          <h2 className="mt-5 font-display text-[clamp(2.5rem,6vw,5.4rem)] font-bold leading-[.94] tracking-[-.07em] text-white">Your vision.<br /><span className="text-[#c5a46d]">Our production.</span></h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">We are an Indore-based creative media production house helping brands and businesses turn ideas into powerful visual stories — from concept planning and creative direction to professional shoots, editing and final delivery.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
            <div><p className="font-display text-3xl font-bold text-[#e5c995]">Concept</p><p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/45">Creative planning</p></div>
            <div><p className="font-display text-3xl font-bold text-[#e5c995]">Final Cut</p><p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/45">Production & editing</p></div>
          </div>
          <Link to="/about" className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5c995] transition-colors hover:text-white">Discover Mediazz Hub <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  )
}
