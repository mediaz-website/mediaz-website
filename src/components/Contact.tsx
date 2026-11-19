
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Reveal } from './Motion'

const serviceOptions = [
  'Commercial Shoot',
  'Product Shoot',
  'Photography',
  'Video Production',
  'Reels Production',
  'Brand Shoot',
  'Ad Shoot',
  'Creative Strategy',
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const service = String(data.get('service') ?? '')
    const message = String(data.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setStatus('error')
      setErrorMessage('Please fill in your name, email and message.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    console.log('CONTACT FORM SUBMIT STARTED')

    try {
      const { data: insertedData, error } = await supabase
        .from('enquiries')
        .insert({
          full_name: name,
          email: email,
          service_required: service || null,
          project_description: message,
        })
        .select()

      console.log('SUPABASE INSERT DATA:', insertedData)
      console.log('SUPABASE INSERT ERROR:', error)

      if (error) {
        console.error('Supabase enquiry error:', error)
        setStatus('error')
        setErrorMessage(error.message)
        return
      }

      console.log('ENQUIRY SAVED SUCCESSFULLY')

      form.reset()
      setStatus('success')
    } catch (err) {
      console.error('Unexpected enquiry error:', err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/15 bg-[#0b0b0b] py-28 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-28">
          <Reveal>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-white/45 uppercase">
              Let&apos;s work together
            </p>

            <h2 className="font-display text-6xl leading-[0.86] font-bold tracking-[-0.07em] text-white sm:text-7xl lg:text-9xl">
              Have an
              <br />
              <span className="text-white/35">idea?</span>
            </h2>

            <p className="mt-10 max-w-sm text-sm leading-relaxed text-white/55">
              Bring us the rough version. The half-formed thought. The impossible
              deadline. We&apos;ll bring the right questions.
            </p>

            <div className="mt-12 border-t border-white/15 pt-5">
              <a
                href="mailto:mediazhub@gmail.com"
                className="group flex w-fit items-center gap-3 text-sm text-white"
              >
                mediazhub@gmail.com
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="border-t border-white/20 pt-6">
              {status === 'success' ? (
                <div className="flex min-h-96 flex-col justify-center">
                  <CheckCircle2 size={34} className="text-white" />

                  <h3 className="mt-7 font-display text-3xl font-semibold text-white">
                    Message received.
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
                    Thanks for reaching out. We&apos;ll be in touch soon.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 w-fit text-xs font-semibold tracking-[0.2em] text-white uppercase underline underline-offset-4"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field id="name" label="Your name" type="text" />
                    <Field id="email" label="Email address" type="email" />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="mb-3 block text-[10px] font-semibold tracking-[0.25em] text-white/45 uppercase"
                    >
                      What can we make?
                    </label>

                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none transition-colors focus:border-white"
                    >
                      <option value="" className="bg-ink-900">
                        Choose a service
                      </option>

                      {serviceOptions.map((option) => (
                        <option key={option} value={option} className="bg-ink-900">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-3 block text-[10px] font-semibold tracking-[0.25em] text-white/45 uppercase"
                    >
                      Tell us about it
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="A little about the project, timing and ambition..."
                      className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white"
                    />
                  </div>

                  {status === 'error' && (
                    <p role="alert" className="text-sm text-white">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-bold tracking-[0.15em] text-black uppercase transition-transform hover:scale-105 disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        Sending
                        <Loader2 size={15} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Send enquiry
                        <ArrowUpRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  type,
}: {
  id: string
  label: string
  type: 'text' | 'email'
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 block text-[10px] font-semibold tracking-[0.25em] text-white/45 uppercase"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={label}
        className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white"
      />
    </div>
  )
}
