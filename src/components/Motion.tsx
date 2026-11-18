import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxImage({ src, alt, className = '', imageClassName = '' }: { src: string; alt: string; className?: string; imageClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const y = useMotionValue(0)
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const imageY = useTransform(smoothY, [-1, 1], ['-4%', '4%'])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!inView || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight
      y.set(Math.max(-1, Math.min(1, progress)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [inView, y])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} loading="lazy" style={{ y: imageY }} className={`h-[108%] w-full object-cover ${imageClassName}`} />
    </div>
  )
}

export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const cursorX = useSpring(x, { stiffness: 400, damping: 35 })
  const cursorY = useSpring(y, { stiffness: 400, damping: 35 })

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    const move = (event: MouseEvent) => {
      x.set(event.clientX - 5)
      y.set(event.clientY - 5)
    }
    window.addEventListener('mousemove', move)
    return () => {
      media.removeEventListener('change', update)
      window.removeEventListener('mousemove', move)
    }
  }, [x, y])

  if (!enabled) return null
  return <motion.div style={{ x: cursorX, y: cursorY }} className="pointer-events-none fixed left-0 top-0 z-[100] size-2.5 rounded-full bg-white mix-blend-difference" />
}
