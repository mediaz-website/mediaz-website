
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

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
      {/* Background Video */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 h-[112%]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/mediazz-hero-model.png"
          className="h-full w-full object-cover object-center"
        >
          <source src="/mediazz-hero-model.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Strong Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 via-50% to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

      {/* Main Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-36 lg:px-16"
      >
        <div className="max-w-[650px]">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#e4c68d]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d5b477]" />
            Independent Creative Production House
          </motion.p>

          <h1 className="font-serif text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.98] tracking-[-0.045em] text-white drop-shadow-lg">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="block text-white"
            >
              Stories that
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="block italic text-[#e0bd7e] drop-shadow-lg"
            >
              move people.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 max-w-md text-sm leading-8 text-white drop-shadow-md sm:text-base"
          >
            From concept to shoot to final edit.
            We create powerful visuals that make brands unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href="/contact"
              className="group flex items-center gap-4 bg-[#c5a46d] px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#171512] transition-all duration-300 hover:bg-[#e6cb99] hover:shadow-lg"
            >
              Start a Project
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>

            <a
              href="/portfolio"
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-white drop-shadow-md transition-colors hover:text-[#e0bd7e]"
            >
              <Play size={14} />
              Explore Our Work
            </a>
          </motion.div>
        </div>

        {/* Bottom Information */}
        <div className="mt-20 flex items-center justify-between border-t border-white/40 pt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white sm:mt-24">
          <span>Films · Photography · Campaigns</span>

          <span className="hidden sm:block">
            Indore · India · Worldwide
          </span>

          <span className="flex items-center gap-2">
            <ArrowDown size={14} />
            Scroll to explore
          </span>
        </div>
      </motion.div>
    </section>
  )
}
