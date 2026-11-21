import { ArrowUpRight, Play } from 'lucide-react'
import { images } from '../lib/images'
import { Reveal } from './Motion'
import { useHomepageSection } from '../hooks/useHomepageSection'

const defaults = { eyebrow: 'Watch the reel', headline: 'The work in motion.', duration: '01:42', videoUrl: '', imageUrl: '' }

export default function Showreel() {
  const content = useHomepageSection('showreel', defaults)
  const poster = content.imageUrl || images.studio
  return <section className="bg-ink-950 py-20 lg:py-28"><div className="mx-auto max-w-[1440px] px-6 lg:px-12"><Reveal><div className="relative overflow-hidden border border-white/15 bg-ink-800">
    {content.videoUrl ? <video src={content.videoUrl} poster={poster} controls playsInline className="h-[55vw] min-h-[360px] w-full object-cover lg:h-[620px]" /> : <img src={poster} alt="Mediazz Hub showreel" loading="lazy" className="h-[55vw] min-h-[360px] w-full object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0 lg:h-[620px]" />}
    {!content.videoUrl && <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"><span className="flex size-20 items-center justify-center rounded-full border border-white/50 bg-black/25 text-white/80 backdrop-blur-sm"><Play size={22} className="ml-1" /></span><span className="border border-[#e0bd7e]/60 bg-black/55 px-4 py-2 text-[10px] font-bold tracking-[0.24em] text-[#e0bd7e] uppercase backdrop-blur-sm">Showreel coming soon</span></div>}
    <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-5 bg-gradient-to-t from-black/80 to-transparent p-6 sm:flex-row sm:items-end sm:p-10 pointer-events-none"><div><p className="mb-3 text-[10px] font-semibold tracking-[0.35em] text-white/55 uppercase">{content.eyebrow}</p><h2 className="font-display text-4xl font-bold tracking-[-0.06em] text-white sm:text-6xl">{content.headline}</h2></div><span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/65 uppercase">{content.duration} <ArrowUpRight size={14} /></span></div>
  </div></Reveal></div></section>
}