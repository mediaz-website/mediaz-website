import { ArrowUpRight, CheckCircle2, Clapperboard, Film, Image, Lightbulb, Sparkles, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero, PageMeta, SectionHeading } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { images } from '../lib/images'

const videoTypes = [
  { icon: Video, title: 'AI Promotional Videos', text: 'Campaign-ready videos for launches, offers and brand communication.' },
  { icon: Image, title: 'AI Product Videos', text: 'Turn product images and creative concepts into engaging product visuals.' },
  { icon: Clapperboard, title: 'AI Commercial & Ad Films', text: 'Concept-led advertising videos created for digital campaigns.' },
  { icon: Sparkles, title: 'AI Avatar & Influencer Videos', text: 'Presenter-style and virtual influencer videos for brand storytelling.' },
  { icon: Film, title: 'Image-to-Video & Text-to-Video', text: 'Bring still images, written ideas and visual concepts into motion.' },
  { icon: Lightbulb, title: 'AI Explainer Videos & Reels', text: 'Simplify ideas and create short-form content for social platforms.' },
]

const process = [
  ['01', 'Concept & Script Planning', 'We understand your objective, audience and message, then shape the concept and script.'],
  ['02', 'Visual & Creative Direction', 'We define the visual style, scenes, references and overall creative direction.'],
  ['03', 'AI Video Generation', 'We use suitable AI workflows to create and refine the required video shots.'],
  ['04', 'Editing & Final Delivery', 'We edit, add sound and finishing touches, then deliver the agreed formats.'],
]

const faqs = [
  ['What is AI video production?', 'AI video production uses AI-powered tools as part of a creative workflow to generate or animate visuals and turn concepts into videos.'],
  ['Can you create AI product videos from product photos?', 'Yes. Depending on the product images and brief, we can create animated product visuals and short promotional videos.'],
  ['Can AI videos be used for advertisements and social media?', 'Yes. We can plan videos for digital advertisements, websites and social media formats, including vertical reels.'],
  ['Do you provide scripting and editing?', 'Yes. Our workflow can include concept planning, script development, visual direction, AI generation, editing and final delivery.'],
  ['How do we start an AI video project?', 'Share your idea, reference examples, product details and intended platform through our project enquiry form.'],
]

export default function AIVideoProductionPage() {
  return (
    <>
      <PageMeta
        title="AI Video Production Company in Indore"
        description="Create AI videos for brands, products and advertising campaigns with Mediazz Hub. Explore AI video production services in Indore."
      />
      <PageHero
        eyebrow="AI Video Production · Indore"
        title={<>Ideas into motion.<br /><span className="text-white/35">Powered by AI.</span></>}
        description="Creative AI video production for brands and businesses — from concept planning and visual direction to AI generation, editing and final delivery."
        image={images.creative}
      />

      <main className="bg-ink-950 text-white">
        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-24 lg:grid-cols-2 lg:px-12 lg:py-32">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">Creative production, reimagined</p>
            <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-6xl">AI Video Production Services in Indore</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-white/65 sm:text-base">
            <p>At Mediazz Hub, we combine creative thinking, production experience and AI-powered workflows to create engaging videos for brands, products and campaigns.</p>
            <p>From an early concept to the final edit, we help shape the story, plan the visuals, generate the footage and finish the video for its intended platform. Every project is approached according to its brief, audience and creative requirements.</p>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#171512] py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <SectionHeading eyebrow="What we create" title={<>AI video formats.<br /><span className="text-white/35">Built around your brief.</span></>} detail="Choose a format that fits your product, campaign or communication goal. We can also combine multiple formats in one production." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videoTypes.map((item, index) => {
                const Icon = item.icon
                return <Reveal key={item.title} delay={(index % 3) * 0.05} className="h-full">
                  <article className="h-full border border-white/10 bg-[#211e19] p-7 transition-colors hover:border-[#c5a46d]/60">
                    <Icon className="mb-8 text-[#e0bd7e]" size={25} strokeWidth={1.4} />
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
                  </article>
                </Reveal>
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
          <SectionHeading eyebrow="Our workflow" title={<>From first thought<br /><span className="text-white/35">to final frame.</span></>} detail="A clear production process keeps the creative direction and final output aligned with your brief." />
          <div className="grid gap-8 md:grid-cols-2">
            {process.map(([number, title, text]) => <Reveal key={number} className="border-t border-white/20 pt-6">
              <span className="font-mono text-xs tracking-[0.2em] text-[#c5a46d]">{number}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">{text}</p>
            </Reveal>)}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#171512] py-24 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:px-12">
            <div>
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">Why Mediazz Hub</p>
              <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-6xl">Creative thinking meets AI workflows.</h2>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-white/60 sm:text-base">
              <p><strong className="text-white">Production-first approach.</strong> We begin with the story and the audience, not just the tool.</p>
              <p><strong className="text-white">End-to-end execution.</strong> Concept planning, visual direction, generation and editing come together in one workflow.</p>
              <p><strong className="text-white">Made for real use cases.</strong> We plan outputs for product communication, brand campaigns, advertising and social media.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
          <SectionHeading eyebrow="Where it works" title={<>AI videos for<br /><span className="text-white/35">different business needs.</span></>} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Brands & startups', 'Manufacturers & D2C businesses', 'Product launches & ecommerce', 'Advertising & social campaigns'].map((item) => <div key={item} className="border border-white/10 bg-[#211e19] p-6 text-sm font-medium text-white/75"><CheckCircle2 className="mb-5 text-[#c5a46d]" size={19} />{item}</div>)}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#171512] py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <SectionHeading eyebrow="Common questions" title={<>AI video production<br /><span className="text-white/35">FAQs.</span></>} />
            <div className="divide-y divide-white/10">
              {faqs.map(([question, answer]) => <details key={question} className="group py-6">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-white marker:hidden">{question}</summary>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/55">{answer}</p>
              </details>)}
            </div>
          </div>
        </section>

        <section className="bg-[#0b0b0b] py-24 lg:py-32">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-6 lg:flex-row lg:items-end lg:px-12">
            <div className="max-w-3xl">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">Have an idea?</p>
              <h2 className="font-serif text-5xl leading-tight tracking-tight sm:text-6xl">Let’s create your next <span className="italic text-[#e0bd7e]">AI video.</span></h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">Tell us about your brand, product or campaign. We’ll help plan the right creative approach.</p>
            </div>
            <Link to="/contact" className="flex w-fit items-center gap-4 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#171512] uppercase transition hover:bg-[#e0bd7e]">Discuss your project <ArrowUpRight size={17} /></Link>
          </div>
        </section>
      </main>
    </>
  )
}
