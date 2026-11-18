import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import { useRef } from 'react'
import { images } from '../lib/images'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh items-end overflow-hidden bg-black">
      <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[10%] h-[120%]">
        <img src={images.hero} alt="A vintage projector casting light in a dark studio" className="h-full w-full object-cover object-center opacity-75" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.5)_52%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.92)_0%,transparent_48%,rgba(0,0,0,0.22)_100%)]" />

      <motion.div style={{ y: textY }} className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 lg:px-12 lg:pb-24">
        <div className="max-w-5xl">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mb-8 flex items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-white/70 uppercase">
            <span className="size-1.5 rounded-full bg-white" /> Independent production studio · Est. 2025
          </motion.p>
          <h1 className="font-display text-[clamp(3.7rem,10vw,9.7rem)] leading-[0.86] font-bold tracking-[-0.075em] text-white">
            <span className="block overflow-hidden"><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }} className="block">Ideas deserve</motion.span></span>
            <span className="block overflow-hidden"><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }} className="block text-white/40">powerful execution.</motion.span></span>
          </h1>
          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="max-w-xs text-sm leading-relaxed text-white/70 sm:text-base">
              From concept to shoot to final edit. We create work that earns attention and stays with you.
            </motion.p>
            <motion.a initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.72 }} href="/portfolio" className="group flex w-fit items-center gap-3 rounded-full bg-white px-6 py-4 text-xs font-bold tracking-wide text-black uppercase transition-transform hover:scale-105">
              Explore our work <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </div>
        <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-5 text-[10px] tracking-[0.28em] text-white/50 uppercase sm:mt-24">
          <span>Commercial · Film · Photo</span>
          <span className="hidden items-center gap-3 sm:flex"><Play size={12} fill="currentColor" /> Showreel 01:42</span>
          <span className="flex items-center gap-2"><ArrowDown size={14} className="animate-bounce" /> Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  )
}
