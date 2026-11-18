import { ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { images } from '../lib/images'
import { Reveal } from './Motion'

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} — Mediazz Hub`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description)
  }, [description, title])
  return null
}

export function PageHero({ eyebrow, title, description, image = images.hero }: { eyebrow: string; title: ReactNode; description: string; image?: string }) {
  return <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-black pt-36"><div className="absolute inset-0"><img src={image} alt="" className="h-full w-full object-cover opacity-55 grayscale" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.38)_70%,rgba(0,0,0,0.58))]" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" /></div><div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-12 lg:pb-24"><Reveal><p className="mb-6 flex items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-white/60 uppercase"><span className="size-1.5 rounded-full bg-white" />{eyebrow}</p><h1 className="max-w-5xl font-display text-[clamp(3.8rem,9vw,9rem)] leading-[0.86] font-bold tracking-[-0.075em] text-white">{title}</h1><p className="mt-8 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">{description}</p></Reveal><div className="mt-16 flex items-center justify-between border-t border-white/20 pt-5 text-[10px] tracking-[0.28em] text-white/45 uppercase"><span>Mediazz Hub · Indore, India</span><span className="flex items-center gap-2"><ArrowDown size={14} className="animate-bounce" /> Scroll to explore</span></div></div></section>
}

export function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: ReactNode; detail?: string }) {
  return <Reveal className="mb-14 flex flex-col justify-between gap-7 lg:mb-20 lg:flex-row lg:items-end"><div><p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-white/45 uppercase">{eyebrow}</p><h2 className="max-w-3xl font-display text-5xl leading-[0.9] font-bold tracking-[-0.065em] text-white sm:text-6xl lg:text-8xl">{title}</h2></div>{detail && <p className="max-w-xs text-sm leading-relaxed text-white/55">{detail}</p>}</Reveal>
}

export function PageImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <motion.div initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={`overflow-hidden ${className}`}><img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0" /></motion.div>
}
