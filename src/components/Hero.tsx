import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import { useRef } from 'react'
import { supabase } from '../lib/supabase'

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
  headlineLine1: 'Stories that',
  headlineLine2: 'move people.',
  description: 'From concept to shoot to final edit. We create powerful visuals that make brands unforgettable.',
  primaryCtaText: 'Start a Project',
  primaryCtaUrl: '/contact',
  secondaryCtaText: 'Explore Our Work',
  secondaryCtaUrl: '/portfolio',
  bottomLeft: 'Films · Photography · Campaigns',
  bottomCenter: 'Indore · India · Worldwide',
  bottomRight: 'Scroll to explore',
  backgroundVideoUrl: '/mediazz-hero-model.mp4',
  backgroundImageUrl: '/mediazz-hero-model.png',
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#171512]"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 h-[112%]">
        {content.backgroundVideoUrl ? (
          <video
            autoPlay muted loop playsInline preload="auto"
            poster={content.backgroundImageUrl || defaults.backgroundImageUrl}
            className="h-full w-full object-cover object-center"
          >
            <source src={content.backgroundVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={content.backgroundImageUrl || defaults.backgroundImageUrl}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 via-50% to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-36 lg:px-16"
      >
        <div className="max-w-[650px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#e4c68d]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d5b477]" />
            {content.eyebrow}
          </motion.p>

          <h1 className="font-serif text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.98] tracking-[-0.045em] text-white drop-shadow-lg">
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="block text-white"
            >
              {content.headlineLine1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="block italic text-[#e0bd7e] drop-shadow-lg"
            >
              {content.headlineLine2}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 max-w-md text-sm leading-8 text-white drop-shadow-md sm:text-base"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href={content.primaryCtaUrl}
              className="group flex items-center gap-4 bg-[#c5a46d] px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#171512] transition-all duration-300 hover:bg-[#e6cb99] hover:shadow-lg"
            >
              {content.primaryCtaText}
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <a
              href={content.secondaryCtaUrl}
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-white drop-shadow-md transition-colors hover:text-[#e0bd7e]"
            >
              <Play size={14} />
              {content.secondaryCtaText}
            </a>
          </motion.div>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/40 pt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white sm:mt-24">
          <span>{content.bottomLeft}</span>
          <span className="hidden sm:block">{content.bottomCenter}</span>
          <span className="flex items-center gap-2">
            <ArrowDown size={14} /> {content.bottomRight}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
