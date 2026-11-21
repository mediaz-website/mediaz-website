import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { images } from '../lib/images'
import { Reveal } from './Motion'

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | Mediazz Hub`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description)
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [description, title])
  return null
}

export function PageHero({ eyebrow, title, description, image = images.hero }: { eyebrow: string; title: ReactNode; description: string; image?: string }) {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden border-b border-white/10 bg-[#171512] pt-36 lg:min-h-[76vh]">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#171512_0%,rgba(23,21,18,.92)_42%,rgba(23,21,18,.35)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-transparent to-[#171512]/35" />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-10 px-6 pb-14 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:pb-20">
        <Reveal>
          <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d5b77e]"><span className="h-px w-9 bg-[#c5a46d]" />{eyebrow}</p>
          <h1 className="max-w-5xl font-display text-[clamp(3.6rem,8vw,8rem)] font-extrabold leading-[.88] tracking-[-.075em] text-white">{title}</h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>
        </Reveal>
        <Reveal delay={0.12} className="hidden min-w-48 border-l border-[#c5a46d]/50 pl-5 pb-1 lg:block">
          <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-[#d5b77e]">Mediazz Hub</span>
          <span className="mt-3 block max-w-40 font-display text-2xl font-semibold leading-tight text-white">Ideas into visual experiences.</span>
          <span className="mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45"><ArrowUpRight size={13} /> Indore · India · Worldwide</span>
        </Reveal>
        <div className="flex items-center justify-between border-t border-white/15 pt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40 lg:col-span-2">
          <span>Concept · Creation · Delivery</span>
          <span className="flex items-center gap-2"><ArrowDown size={13} className="animate-bounce" /> Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: ReactNode; detail?: string }) {
  return (
    <Reveal className="mb-14 flex flex-col justify-between gap-7 lg:mb-20 lg:flex-row lg:items-end">
      <div><p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#c5a46d]"><span className="h-px w-7 bg-[#c5a46d]" />{eyebrow}</p><h2 className="max-w-3xl font-display text-5xl font-extrabold leading-[.92] tracking-[-.065em] text-white sm:text-6xl lg:text-8xl">{title}</h2></div>
      {detail && <p className="max-w-sm border-l border-white/15 pl-5 text-sm leading-relaxed text-white/55">{detail}</p>}
    </Reveal>
  )
}

export function PageImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <motion.div initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={`overflow-hidden ${className}`}><img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" /></motion.div>
}
