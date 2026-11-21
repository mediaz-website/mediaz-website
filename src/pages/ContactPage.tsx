
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  MapPin,
  Clapperboard,
  Sparkles,
} from 'lucide-react'
import { PageMeta } from '../components/PageFrame'
import { supabase } from '../lib/supabase'
import { useSiteContent } from '../hooks/useSiteContent'

const services = [
  'Commercial Shoot',
  'Product Photography & Videography',
  'Brand Shoot',
  'Reels Production',
  'Corporate Video Production',
  'Advertising Shoot',
  'Professional Photography',
  'Creative Strategy & Concept Planning',
  'Podcast & Interview Production',
  'Short Films & Documentaries',
  'Celebrity & Model Shoots',
  'Event & Music Production',
  'Campaign & Promotional Production',
  'AI Video Production',
  'AI Voiceover & Audio',
  'AI Image & Creative Production',
  'AI Automation & Workflow Development',
  'Social Media & Profile Management',
  'Website Development',
  'SEO & AEO',
  'AI Tools & Integrations',
]

const budgets = [
  'Below ₹10,000',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000+',
  'Not sure yet',
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const pageContent = useSiteContent('contact', 'main', {
    heroEyebrow: "Let's create something together", heroLine1: 'Have a project', heroLine2: 'in mind?',
    heroDescription: "Every great visual begins with an idea. Tell us what you're planning, and let's turn that idea into something worth remembering.",
    formEyebrow: 'Start a conversation', formHeading: 'Tell us about your project.',
    sideEyebrow: 'Project enquiry', sideHeading: "Let's create something memorable.",
    sideDescription: 'Share your project requirements with us. Our creative team will get back to you.',
  })
  
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const brand = String(data.get('brand') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const whatsapp = String(data.get('whatsapp') ?? '').trim()
    const service = String(data.get('service') ?? '')
    const budget = String(data.get('budget') ?? '')
    const description = String(data.get('description') ?? '').trim()

    if (!name || !brand || !email || !whatsapp || !service || !budget || !description) {
      setStatus('error')
      setError('Please complete every field so we can understand your project.')
      return
    }

    setStatus('sending')
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('enquiries')
        .insert({
          full_name: name,
          business_name: brand,
          email,
          whatsapp,
          service_required: service,
          project_budget: budget,
          project_description: description,
        })

      if (insertError) {
        setStatus('error')
        setError(insertError.message)
        return
      }

      form.reset()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <>
      <PageMeta
        title="Start a Project"
        description="Share your creative production brief with Mediazz Hub."
      />

      <main className="min-h-screen bg-[#0b0b0d] px-6 pb-24 pt-36 text-white sm:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-[1440px]">

          <div className="mb-16 max-w-4xl lg:mb-24">
            <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
              {pageContent.heroEyebrow}
            </p>

            <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
              {pageContent.heroLine1}
              <br />
              <span className="italic text-[#e0bd7e]">{pageContent.heroLine2}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65">
              {pageContent.heroDescription}
            </p>
          </div>

          {status === 'success' ? (
            <div className="grid gap-12 border border-white/15 bg-[#141416] p-7 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">

              <div className="flex flex-col justify-center">
                <div className="flex size-16 items-center justify-center rounded-full border border-[#c5a46d]/50 text-[#e0bd7e]">
                  <CheckCircle2 size={32} />
                </div>

                <p className="mt-9 text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
                  Enquiry received
                </p>

                <h2 className="mt-4 font-display text-5xl text-white sm:text-6xl">
                  Thank you<span className="text-[#e0bd7e]">.</span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
                  Your project enquiry has been successfully submitted.
                  Our team will review your requirements and connect with you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-10 w-fit border-b border-[#c5a46d] pb-2 text-xs font-bold tracking-[0.2em] text-[#e0bd7e] uppercase transition-colors hover:text-white"
                >
                  Submit another enquiry
                </button>
              </div>

              <div className="border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <p className="text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
                  Now let's connect
                </p>

                <h3 className="mt-4 font-display text-3xl text-white">
                  Get in touch with us.
                </h3>

                <div className="mt-9 space-y-8">

                  <a
                    href="https://wa.me/918358063254"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center border border-white/15 text-[#e0bd7e] transition-colors group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#0b0b0d]">
                      <MessageCircle size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                        WhatsApp
                      </span>
                      <span className="mt-2 block text-base font-semibold text-white group-hover:text-[#e0bd7e]">
                        +91 83580 63254
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto text-white/40 group-hover:text-[#e0bd7e]" size={17} />
                  </a>

                  <a
                    href="mailto:mediazzhub@gmail.com"
                    className="group flex items-center gap-4"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center border border-white/15 text-[#e0bd7e] transition-colors group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#0b0b0d]">
                      <Mail size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                        Email
                      </span>
                      <span className="mt-2 block text-base font-semibold text-white group-hover:text-[#e0bd7e]">
                        mediazzhub@gmail.com
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto text-white/40 group-hover:text-[#e0bd7e]" size={17} />
                  </a>

                  <div className="flex items-center gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center border border-white/15 text-[#e0bd7e]">
                      <MapPin size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                        Based in
                      </span>
                      <span className="mt-2 block text-base font-semibold text-white">
                        Indore, Madhya Pradesh, India
                      </span>
                      <span className="mt-1 block text-sm text-white/50">
                        Working across India
                      </span>
                    </span>
                  </div>

                </div>

                <div className="mt-10 border-t border-white/15 pt-7">
                  <p className="text-xs font-bold tracking-[0.25em] text-white/45 uppercase">
                    Mediazz Hub · From Concept to Shoot
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">

              <div className="lg:col-span-4">
                <div className="border-t border-white/20 pt-7">
                  <p className="text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
                    {pageContent.sideEyebrow}
                  </p>

                  <h2 className="mt-5 font-display text-3xl leading-tight text-white sm:text-4xl">
                    {pageContent.sideHeading}
                  </h2>

                  <p className="mt-5 max-w-sm text-base leading-relaxed text-white/60">
                    {pageContent.sideDescription}
                  </p>

                  <div className="mt-14 flex items-center gap-3 text-[#e0bd7e]">
                    <Clapperboard size={19} strokeWidth={1.5} />
                    <span className="text-xs font-bold tracking-[0.25em] uppercase">
                      From Concept to Shoot
                    </span>
                  </div>

                  <div className="mt-14 border-t border-white/15 pt-7">
                    <p className="mb-5 text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
                      Follow our work
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://www.instagram.com/mediazz_hub/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-[#c5a46d] hover:text-[#e0bd7e]"
                      >
                        <span className="text-lg font-bold">◎</span>
                        Instagram
                        <ArrowUpRight size={15} />
                      </a>

                      <a
                        href="https://www.facebook.com/share/1A3MJows48/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-[#c5a46d] hover:text-[#e0bd7e]"
                      >
                        <span className="text-base font-bold">f</span>
                        Facebook
                        <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="border border-white/15 bg-[#141416] p-6 sm:p-10 lg:p-12">

                  <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/10 pb-7">
                    <div>
                      <p className="text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
                        {pageContent.formEyebrow}
                      </p>
                      <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                        {pageContent.formHeading}
                      </h2>
                    </div>
                    <Sparkles className="hidden shrink-0 text-[#c5a46d] sm:block" size={28} strokeWidth={1.2} />
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                      <Field id="name" label="Full name" placeholder="Your full name" />
                      <Field id="brand" label="Business / brand name" placeholder="Your business or brand" />
                      <Field id="email" label="Email address" type="email" placeholder="you@company.com" />
                      <Field id="whatsapp" label="WhatsApp number" type="tel" placeholder="+91 ..." />
                    </div>

                    <SelectField
                      id="service"
                      label="Service required"
                      options={services}
                      placeholder="Choose a service"
                    />

                    <SelectField
                      id="budget"
                      label="Approximate project budget"
                      options={budgets}
                      placeholder="Choose a budget range"
                    />

                    <div className="mt-8">
                      <label
                        htmlFor="description"
                        className="mb-3 block text-sm font-bold tracking-[0.15em] text-white/70 uppercase"
                      >
                        Project description
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={5}
                        placeholder="Tell us about your idea, requirements and timeline..."
                        className="w-full resize-none border-b border-white/20 bg-transparent py-4 text-base font-semibold text-white outline-none placeholder:font-normal placeholder:text-white/35 transition-colors focus:border-[#c5a46d]"
                      />
                    </div>

                    {status === 'error' && (
                      <p role="alert" className="mt-6 text-sm font-semibold text-red-400">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="mt-10 flex w-full items-center justify-center gap-4 bg-[#c5a46d] px-8 py-5 text-xs font-bold tracking-[0.2em] text-[#0b0b0d] uppercase transition-colors hover:bg-[#e0bd7e] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                    >
                      {status === 'sending' ? (
                        <>
                          Submitting enquiry
                          <Loader2 size={17} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Submit project enquiry
                          <ArrowUpRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="mt-6 text-xs font-medium leading-relaxed text-white/45">
                      Your details will be used to understand and respond to
                      your project enquiry.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/15 pt-7 sm:flex-row sm:items-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-white/45 uppercase">
              Mediazz Hub · Creative Production House
            </p>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c5a46d] uppercase">
              From Concept to Shoot
            </p>
          </div>

        </div>
      </main>
    </>
  )
}

function Field({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string
  label: string
  placeholder: string
  type?: 'text' | 'email' | 'tel'
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 block text-sm font-bold tracking-[0.15em] text-white/70 uppercase"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={
          id === 'name' ? 'name' :
          id === 'email' ? 'email' :
          id === 'whatsapp' ? 'tel' : 'organization'
        }
        className="w-full border-b border-white/20 bg-transparent py-4 text-base font-semibold text-white outline-none placeholder:font-normal placeholder:text-white/35 transition-colors focus:border-[#c5a46d]"
      />
    </div>
  )
}

function SelectField({
  id,
  label,
  options,
  placeholder,
}: {
  id: string
  label: string
  options: readonly string[]
  placeholder: string
}) {
  return (
    <div className="mt-8">
      <label
        htmlFor={id}
        className="mb-3 block text-sm font-bold tracking-[0.15em] text-white/70 uppercase"
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        required
        defaultValue=""
        className="w-full border-b border-white/20 bg-[#141416] py-4 text-base font-semibold text-white outline-none transition-colors focus:border-[#c5a46d]"
      >
        <option value="" disabled className="bg-[#141416] text-white/60">
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-[#141416] text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
