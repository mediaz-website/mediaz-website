import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const serviceOptions = [
  'Brand Film',
  'Commercial Production',
  'Motion Design',
  'Post-Production',
  'Sound Design',
  'Creative Direction',
  'Something else',
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

    const { error } = await supabase.from('contact_submissions').insert({
      name,
      email,
      service: service || null,
      message,
    })

    if (error) {
      setStatus('error')
      setErrorMessage('Something went wrong sending your message. Please try again.')
      return
    }

    form.reset()
    setStatus('success')
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-ink-900/50" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-ink-300 uppercase">
              Get in Touch
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Let&apos;s make
              <br />
              <span className="text-ink-400">something great.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-200 sm:text-base">
              Tell us about your project — timelines, ambitions, rough ideas all welcome. We reply
              to every message within one business day.
            </p>
            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <p className="text-sm text-ink-200">
                <span className="text-ink-400">Email — </span>
                <a href="mailto:hello@mediazzhub.com" className="text-white transition-colors hover:text-ink-300">
                  hello@mediazzhub.com
                </a>
              </p>
              <p className="text-sm text-ink-200">
                <span className="text-ink-400">Studio — </span>
                By appointment, city centre location
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-800/70 p-8 backdrop-blur-sm sm:p-10">
            {status === 'success' ? (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <CheckCircle2 size={48} strokeWidth={1.5} className="text-white" />
                <h3 className="mt-6 font-display text-2xl font-bold text-white">Message sent</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-200">
                  Thanks for reaching out. We&apos;ll get back to you within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-ink-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold tracking-wide text-ink-200 uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border border-white/15 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder-ink-400 transition-colors outline-none focus:border-white/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold tracking-wide text-ink-200 uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-white/15 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder-ink-400 transition-colors outline-none focus:border-white/50"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="mb-2 block text-xs font-semibold tracking-wide text-ink-200 uppercase">
                    Service
                  </label>
                  <select
                    id="service"
                    name="service"
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-white/15 bg-ink-900/80 px-4 py-3 text-sm text-white transition-colors outline-none focus:border-white/50"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option} className="bg-ink-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold tracking-wide text-ink-200 uppercase">
                    Project details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none rounded-xl border border-white/15 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder-ink-400 transition-colors outline-none focus:border-white/50"
                  />
                </div>

                {status === 'error' && (
                  <p role="alert" className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      Sending
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
