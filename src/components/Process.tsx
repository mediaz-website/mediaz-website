import { ArrowRight } from 'lucide-react'
import { Reveal } from './Motion'
import { useHomepageSection } from '../hooks/useHomepageSection'

const steps = [
  ['01', 'Discover', 'We get close to the why — your ambition, your audience, and the feeling the work needs to leave behind.'],
  ['02', 'Shape', 'We turn a spark into a clear creative direction, with the visual language and story mapped before the cameras roll.'],
  ['03', 'Make', 'Our crew brings the idea into the real world with calm, exacting production and a relentless eye for detail.'],
  ['04', 'Finish', 'Edit, grade, sound and deliver. Every final frame gets the same care as the first one.'],
]

const defaults = { eyebrow: 'The approach', headlineLine1: 'Good work starts', headlineLine2: 'with good questions.', step1Title: 'Discover', step1Text: 'We get close to the why — your ambition, your audience, and the feeling the work needs to leave behind.', step2Title: 'Shape', step2Text: 'We turn a spark into a clear creative direction, with the visual language and story mapped before the cameras roll.', step3Title: 'Make', step3Text: 'Our crew brings the idea into the real world with calm, exacting production and a relentless eye for detail.', step4Title: 'Finish', step4Text: 'Edit, grade, sound and deliver. Every final frame gets the same care as the first one.', closingLine1: 'Make something', closingLine2: 'worth watching.' }

export default function Process() {
  const content = useHomepageSection('process_section', defaults)
  const steps = [['01', content.step1Title, content.step1Text], ['02', content.step2Title, content.step2Text], ['03', content.step3Title, content.step3Text], ['04', content.step4Title, content.step4Text]]
  return (
    <section id="process" className="bg-ink-950 py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-16 max-w-3xl lg:mb-24"><p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-white/45 uppercase"{content.eyebrow}</p><h2 className="font-display text-5xl leading-[0.92] font-bold tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">{content.headlineLine1}<br /><span className="text-white/35">{content.headlineLine2}</span></h2></Reveal>
        <div className="grid border-t border-white/15 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, text], index) => <Reveal key={number} delay={index * 0.08} className="border-b border-white/15 p-6 md:border-r md:last:border-r-0 lg:min-h-72 lg:p-8"><div className="flex items-center justify-between"><span className="text-[10px] tracking-[0.3em] text-white/45">{number}</span>{index < steps.length - 1 && <ArrowRight size={15} className="hidden text-white/30 lg:block" />}</div><h3 className="mt-16 font-display text-2xl font-semibold text-white lg:mt-20">{title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{text}</p></Reveal>)}
        </div>
        <Reveal className="mt-28 overflow-hidden border-y border-white/15 py-12 lg:mt-40 lg:py-20"><p className="font-display text-center text-[clamp(2.8rem,7vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.07em] text-white">{content.closingLine1}<br /><span className="text-white/35">{content.closingLine2}</span></p></Reveal>
      </div>
    </section>
  )
}
