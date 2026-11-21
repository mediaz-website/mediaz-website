import { ArrowUpRight, Bot, Camera, CheckCircle2, Clapperboard, Code2, Image, Mic2, Search, Share2, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero, PageMeta, SectionHeading } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { images } from '../lib/images'

const aiCapabilities = [
  { icon: Clapperboard, title: 'AI Video Production', text: 'Promotional films, product videos, AI ads, reels, explainers and virtual influencer content.' },
  { icon: Mic2, title: 'AI Voiceover & Audio', text: 'AI voiceovers, narration and multilingual audio support for videos, ads and digital content.' },
  { icon: Image, title: 'AI Image & Creative Production', text: 'AI-generated images, campaign visuals, product concepts, creative assets and image-to-image workflows.' },
  { icon: Workflow, title: 'AI Automation & Workflows', text: 'Custom automations for content planning, production coordination, repetitive tasks and business processes.' },
  { icon: Share2, title: 'Social Media & Profile Management', text: 'Content planning, profile management, publishing workflows and ongoing social media support.' },
  { icon: Code2, title: 'Website Development', text: 'Business websites, landing pages and digital experiences built around your goals.' },
  { icon: Search, title: 'SEO & AEO', text: 'Search engine optimisation and Answer Engine Optimisation to improve how people discover your brand.' },
  { icon: Bot, title: 'AI Tools & Integrations', text: 'Practical AI assistants, connected tools and custom workflows that support your team.' },
]

const groundCapabilities = [
  { title: 'Commercial & Advertising Shoots', text: 'Campaign films, ad shoots and promotional productions.' },
  { title: 'Product & Brand Photography', text: 'Studio and location photography, catalogues and brand visuals.' },
  { title: 'Reels & Video Production', text: 'On-location reels, corporate films, interviews and social content.' },
  { title: 'Podcasts, Events & Films', text: 'Multi-camera podcasts, event coverage, documentaries and short films.' },
]

const workflow = [
  ['01', 'Understand the brief', 'We learn about your business, audience, objectives and the right mix of AI and on-ground production.'],
  ['02', 'Plan the creative & workflow', 'We shape the concept, production plan, content strategy and any automation needed.'],
  ['03', 'Create & execute', 'Our team brings the work to life through AI tools, real shoots, development and connected workflows.'],
  ['04', 'Edit, optimise & deliver', 'We refine the output, prepare platform-ready formats and hand over the final work.'],
]

const faqs = [
  ['Does Mediazz Hub only create AI videos?', 'No. We work across AI video, AI voiceover, AI images, automation, social media management, website development, SEO and AEO, as well as traditional on-ground media production.'],
  ['Do you also provide traditional photo and video shoots?', 'Yes. We plan and execute commercial shoots, product photography, brand films, reels, podcasts, events and other on-ground productions.'],
  ['Can you automate media production workflows?', 'Yes. We can build practical automations for content planning, asset handling, approvals, publishing and repetitive production or business tasks.'],
  ['Can AI and on-ground production be combined?', 'Absolutely. A project can combine real footage, AI-generated visuals, voiceovers, editing and automation depending on the creative brief.'],
  ['Where do you work?', 'Mediazz Hub is based in Indore and works with brands and businesses across India.'],
]

export default function AIVideoProductionPage() {
  return (
    <>
      <PageMeta
        title="AI Media Production & Technology Solutions in Indore"
        description="Mediazz Hub combines AI media production, AI voiceovers, AI images, automation, social media management, website development, SEO and AEO with professional on-ground shoots across India."
      />
      <PageHero
        eyebrow="AI Media · Technology · Production"
        title={<>More than AI.<br /><span className="text-white/35">Complete media solutions.</span></>}
        description="From AI-generated media and smart automation to real-world shoots and complete creative production — one partner for your brand’s digital and on-ground needs."
        image={images.creative}
      />

      <main className="bg-ink-950 text-white">
        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-24 lg:grid-cols-2 lg:px-12 lg:py-32">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">One partner. Two production worlds.</p>
            <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-6xl">AI-powered creativity. Real-world production.</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-white/65 sm:text-base">
            <p>Mediazz Hub is a creative media production and technology partner. We create digital content with AI, build automation that makes production workflows smarter, and execute professional shoots on the ground.</p>
            <p>Some projects need AI-generated visuals, voiceovers or automated workflows. Others need cameras, lighting, locations, people and a production crew. We bring both capabilities together — choosing the right approach for the brief, not forcing every project into one format.</p>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#171512] py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <SectionHeading eyebrow="01 · AI & digital capabilities" title={<>Create smarter.<br /><span className="text-white/35">Work more efficiently.</span></>} detail="AI-powered media, digital services and connected workflows to help brands create, communicate and operate better." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {aiCapabilities.map((item, index) => {
                const Icon = item.icon
                return <Reveal key={item.title} delay={(index % 4) * 0.05} className="h-full">
                  <article className="h-full border border-white/10 bg-[#211e19] p-7 transition-colors hover:border-[#c5a46d]/60">
                    <Icon className="mb-8 text-[#e0bd7e]" size={25} strokeWidth={1.4} />
                    <h3 className="font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
                  </article>
                </Reveal>
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
          <SectionHeading eyebrow="02 · On-ground production" title={<>Real people. Real places.<br /><span className="text-white/35">Professional production.</span></>} detail="When the story needs real-world craft, our production team plans and executes shoots from concept to final edit." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {groundCapabilities.map((item, index) => <Reveal key={item.title} delay={index * 0.05} className="h-full">
              <article className="h-full border border-white/10 bg-[#211e19] p-7">
                <Camera className="mb-8 text-[#e0bd7e]" size={25} strokeWidth={1.4} />
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
              </article>
            </Reveal>)}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-7">
            <p className="text-sm text-white/55">Need a dedicated shoot or complete campaign?</p>
            <Link to="/services" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e0bd7e] hover:text-white">Explore all production services <ArrowUpRight size={15} /></Link>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#171512] py-24 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:px-12">
            <div>
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">Why Mediazz Hub</p>
              <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-6xl">The right mix of creativity, technology and execution.</h2>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-white/60 sm:text-base">
              <p><strong className="text-white">One connected partner.</strong> AI media, on-ground production, digital presence and automation under one roof.</p>
              <p><strong className="text-white">Purpose-led use of AI.</strong> We use AI where it improves creative possibilities, speed or workflow — and real production where it matters.</p>
              <p><strong className="text-white">End-to-end thinking.</strong> From concept and planning to execution, editing, optimisation and delivery.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
          <SectionHeading eyebrow="How we work" title={<>From brief<br /><span className="text-white/35">to finished outcome.</span></>} detail="A flexible process that brings the right people, tools and production approach together." />
          <div className="grid gap-8 md:grid-cols-2">
            {workflow.map(([number, title, text]) => <Reveal key={number} className="border-t border-white/20 pt-6">
              <span className="font-mono text-xs tracking-[0.2em] text-[#c5a46d]">{number}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">{text}</p>
            </Reveal>)}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#171512] py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <SectionHeading eyebrow="Common questions" title={<>AI, media & production<br /><span className="text-white/35">FAQs.</span></>} />
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
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">Have a project in mind?</p>
              <h2 className="font-serif text-5xl leading-tight tracking-tight sm:text-6xl">Let’s build something <span className="italic text-[#e0bd7e]">meaningful.</span></h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">Tell us what you want to create, improve or automate. We’ll help you choose the right production approach.</p>
            </div>
            <Link to="/contact" className="flex w-fit items-center gap-4 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#171512] uppercase transition hover:bg-[#e0bd7e]">Discuss your project <ArrowUpRight size={17} /></Link>
          </div>
        </section>
      </main>
    </>
  )
}
