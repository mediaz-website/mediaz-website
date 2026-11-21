import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { images } from '../lib/images'

type HeroContent = {
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  description: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText: string
  secondaryCtaUrl: string
  bottomLeft: string
  bottomCenter: string
  bottomRight: string
  backgroundVideoUrl: string
  backgroundImageUrl: string
}

const defaults: HeroContent = {
  eyebrow: 'Independent Creative Production House',
  headlineLine1: 'We Create.',
  headlineLine2: 'You Grow.',
  description: 'Concept, professional shoots and final edits — everything your brand needs to tell its story.',
  primaryCtaText: 'Start a Project',
  primaryCtaUrl: '/contact',
  secondaryCtaText: 'Watch Showreel',
  secondaryCtaUrl: '/portfolio',
  bottomLeft: 'Commercial Films · Product · Photography · Reels',
  bottomCenter: 'Indore · India · Worldwide',
  bottomRight: 'Scroll to explore',
  backgroundVideoUrl: '',
  backgroundImageUrl: images.studio,
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [content, setContent] = useState<HeroContent>(defaults)

  useEffect(() => {
    let active = true
    async function loadHeroContent() {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('page_key', 'homepage')
        .eq('section_key', 'hero')
        .eq('is_published', true)
        .maybeSingle()
      if (error) {
        console.error('Hero CMS load failed:', error)
        return
      }
      if (active && data?.content && typeof data.content === 'object') {
        setContent({ ...defaults, ...(data.content as Partial<HeroContent>) })
      }
    }
    loadHeroContent()
    return () => { active = false }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])

  return (
    <section ref={ref} id="top" className="relative flex min-h-[78svh] items-center overflow-hidden bg-[#0b0b0d] sm:min-h-[92svh]">
      <motion.div style={{ y: imageY }} animate={{ scale: [1.015, 1.07] }} transition={{ duration: 24, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute inset-0 h-[112%]">
        <img
          src={content.backgroundImageUrl || images.studio}
          alt="Behind the scenes of a professional creative production studio"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,8,.96)_0%,rgba(7,7,8,.78)_38%,rgba(7,7,8,.18)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-black/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[18%] hidden size-[34rem] rounded-full border border-[#e5c995]/20 lg:block"><div className="absolute inset-8 rounded-full border border-dashed border-[#e5c995]/20" /><div className="absolute left-[12%] top-[18%] size-2 rounded-full bg-[#e5c995] shadow-[0_0_28px_8px_rgba(197,164,109,.35)]" /></div>
      <motion.div style={{ y: textY }} className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-16">
        <div className="max-w-[760px]">
          <div className="mb-8 hidden items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45 sm:flex"><span className="h-px w-12 bg-[#c5a46d]" />Concept · Shoot · Final Editing</div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#e4c68d] sm:mb-8 sm:gap-3 sm:text-[10px] sm:tracking-[0.35em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d5b477]" />{content.eyebrow}
          </motion.p>
          <h1 className="font-display text-[clamp(3.25rem,12vw,8.6rem)] leading-[0.88] font-bold tracking-[-0.075em] text-white drop-shadow-lg sm:text-[clamp(3.5rem,8.2vw,8.6rem)]">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="block">{content.headlineLine1}</motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }} className="block italic text-[#e5c995]">{content.headlineLine2}</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-5 max-w-md text-[13px] leading-6 text-white drop-shadow-md sm:mt-8 sm:text-base sm:leading-8">{content.description}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="mt-7 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-5">
            <a href={content.primaryCtaUrl} className="group flex min-h-12 items-center gap-3 bg-[#c5a46d] px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#171512] transition-all duration-300 hover:bg-[#e6cb99] hover:shadow-lg sm:gap-4 sm:px-7 sm:py-4 sm:text-xs">{content.primaryCtaText}<ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
            <a href={content.secondaryCtaUrl} className="flex min-h-12 items-center gap-3 text-xs font-bold uppercase tracking-wider text-white drop-shadow-md transition-colors hover:text-[#e0bd7e]"><Play size={14} />{content.secondaryCtaText}</a>
          </motion.div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-white/25 pt-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:mt-20 sm:pt-5 sm:text-[9px] sm:tracking-[0.25em]">
          <span>{content.bottomLeft}</span><span className="hidden sm:block">{content.bottomCenter}</span><span className="flex items-center gap-2"><ArrowDown size={14} />{content.bottomRight}</span>
        </div>
      </motion.div>
    </section>
  )
}
