import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from './Motion'
import { useHomepageSection } from '../hooks/useHomepageSection'

const defaults = {
  eyebrow: 'Our approach',
  headlineLine1: 'From first thought',
  headlineLine2: 'to final frame.',
  step1Title: 'Concept',
  step1Text: 'Understand the brand, audience and objective before shaping the story.',
  step2Title: 'Creative Strategy',
  step2Text: 'Build the creative direction, visual language, script and production plan.',
  step3Title: 'Production',
  step3Text: 'Prepare the crew, talent, locations, equipment and production details.',
  step4Title: 'Shoot',
  step4Text: 'Bring the idea to life through focused on-ground production.',
  closingLine1: 'One creative partner.',
  closingLine2: 'Every frame considered.',
}

const steps = [
  ['01', 'Concept', 'Start with the brief, the audience and the story worth telling.'],
  ['02', 'Creative Strategy', 'Shape the idea, visual direction, script and production plan.'],
  ['03', 'Production', 'Coordinate the crew, talent, locations, equipment and schedule.'],
  ['04', 'Shoot', 'Capture the story with professional cameras, lighting and direction.'],
  ['05', 'Editing', 'Refine every frame with editing, colour, sound and finishing.'],
  ['06', 'Final Delivery', 'Deliver polished, platform-ready assets in the required formats.'],
]

export default function Process() {
  const content = useHomepageSection('process_section', defaults)
  return (
    <section id="process" className="relative overflow-hidden bg-[#0b0b0d] py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 mediazz-section-line opacity-30" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-10 max-w-3xl sm:mb-16 lg:mb-20">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">{content.eyebrow}</p>
          <h2 className="font-display text-[2.7rem] font-bold leading-[.95] tracking-[-0.065em] text-white sm:text-6xl lg:text-8xl">{content.headlineLine1}<br /><span className="text-[#c5a46d]">{content.headlineLine2}</span></h2>
        </Reveal>
        <div className="grid border-l border-t border-white/12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([number, title, description], index) => <Reveal key={number} delay={index * 0.06} className="group min-h-[205px] border-b border-r border-white/12 bg-white/[0.015] p-5 transition-colors duration-500 hover:bg-white/[0.045] sm:p-7 lg:min-h-[235px] lg:p-8">
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.3em] text-[#c5a46d]">{number}</span><span className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/45 transition-colors group-hover:border-[#c5a46d] group-hover:text-[#e5c995]">{index === 5 ? <Check size={15} /> : <ArrowRight size={15} />}</span></div>
            <h3 className="mt-10 font-display text-xl font-semibold tracking-tight text-white sm:mt-14 sm:text-2xl">{title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{description}</p>
          </Reveal>)}
        </div>
        <Reveal className="mt-14 border-y border-white/12 py-8 sm:mt-20 sm:py-12 lg:mt-28 lg:py-16">
          <p className="font-display text-center text-[clamp(2.4rem,7vw,7rem)] font-bold leading-[.92] tracking-[-0.07em] text-white">{content.closingLine1}<br /><span className="text-[#c5a46d]">{content.closingLine2}</span></p>
        </Reveal>
      </div>
    </section>
  )
}
