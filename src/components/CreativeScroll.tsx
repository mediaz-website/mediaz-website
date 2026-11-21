import { motion, useScroll, useSpring } from 'framer-motion'

export default function CreativeScroll() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 })
  return (
    <>
      <motion.div style={{ scaleX, transformOrigin: '0% 50%' }} className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-gradient-to-r from-[#8d6a3d] via-[#e5c995] to-[#fff0c9]" />
      <div aria-hidden="true" className="mediazz-grain" />
    </>
  )
}
