
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react'
import { PageMeta } from '../components/PageFrame'
import { supabase } from '../lib/supabase'

const services = [
  'Commercial Shoot',
  'Product Photography & Videography',
  'Brand Shoot',
  'Reels Production',
  'Corporate Video Production',
  'Advertising Shoot',
  'Professional Photography',
  'Creative Strategy & Concept Planning',
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

    console.log('CONTACT FORM SUBMIT STARTED')

    try {
      const { error: insertError } = await supabase
        .from('enquiries')
        .insert({
          full_name: name,
          business_name: brand,
          email: email,
          whatsapp: whatsapp,
          service_required: service,
          project_budget: budget,
          project_description: description,
        })

      console.log('SUPABASE INSERT ERROR:', insertError)

      if (insertError) {
        console.error('Enquiry submission failed:', insertError)
        setStatus('error')
        setError(insertError.message)
        return
      }

      console.log('ENQUIRY SAVED SUCCESSFULLY')

      form.reset()
      setStatus('success')
    } catch (err) {
      console.error('Unexpected enquiry error:', err)
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
        description="Share your project brief with Mediazz Hub."
      />

      <main className="min-h-screen bg-[#f5f3ef] px-5 py-24 text-[#171717] sm:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl">

          <div className="mb-14 text-center">
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] uppercase text-black/45">
              MEDIAZZ HUB
            </p>

            <h1 className="font-display text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
              Start a Project<span className="text-black/30">.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-black/55">
              Tell us about your idea. Share your requirements and our creative
              team will connect with you.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center border border-black/10 bg-white p-8 text-center sm:p-14">
              <CheckCircle2 size={42} />

              <h2 className="mt-7 font-display text-4xl font-bold tracking-tight">
                Thank you.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/55">
                Your enquiry has been successfully submitted. Our team will
                connect with you soon.
              </p>

              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-9 text-xs font-semibold uppercase tracking-widest underline underline-offset-4"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-black/10 bg-white p-6 sm:p-10 lg:p-14"
              noValidate
            >
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
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
                  className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50"
                >
                  Project description
                </label>

                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Tell us about your idea, requirements and timeline..."
                  className="w-full resize-none border-b border-black/20 bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="mt-6 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-9 flex items-center gap-3 rounded-full bg-[#171717] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-black/75 disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <>
                    Submitting
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Submit project enquiry
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-black/40">
            From Concept to Shoot · Mediazz Hub
          </p>
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
        className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50"
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
        className="w-full border-b border-black/20 bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
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
        className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50"
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        required
        defaultValue=""
        className="w-full border-b border-black/20 bg-transparent py-4 text-sm text-black outline-none focus:border-black"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
