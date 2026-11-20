
import { useEffect, useState } from 'react'
import { Star, Quote, MessageSquareQuote } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Testimonial {
  id: string
  client_name: string
  client_role: string | null
  company_name: string | null
  review: string
  rating: number
  avatar_url: string | null
  is_featured: boolean
  sort_order: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select(
          'id, client_name, client_role, company_name, review, rating, avatar_url, is_featured, sort_order'
        )
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (!error && data) {
        setTestimonials(data)
      }

      setLoading(false)
    }

    fetchTestimonials()
  }, [])

  if (loading || testimonials.length === 0) {
    return null
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#171512] px-5 py-24 sm:px-8 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#c5a46d]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c5a46d]">
            Client Experiences
          </p>

          <h2 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            What Our Clients
            <span className="block italic text-[#c5a46d]">
              Say About Us
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            Every project is a collaboration. Here's what our clients have to
            say about working with Mediazz Hub.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#211e19] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c5a46d]/40 sm:p-8"
            >
              <Quote
                size={34}
                className="mb-6 text-[#c5a46d]/60"
              />

              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className={
                      index < item.rating
                        ? 'fill-[#c5a46d] text-[#c5a46d]'
                        : 'text-white/15'
                    }
                  />
                ))}
              </div>

              <p className="flex-1 text-sm leading-7 text-white/75">
                “{item.review}”
              </p>

              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={item.client_name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a46d]/20 bg-[#c5a46d]/10 font-serif text-xl text-[#c5a46d]">
                    {item.client_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {item.client_name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-white/40">
                    {[item.client_role, item.company_name]
                      .filter(Boolean)
                      .join(' · ') || 'Client'}
                  </p>
                </div>

                {item.is_featured && (
                  <span className="ml-auto shrink-0 text-[#c5a46d]">
                    <MessageSquareQuote size={18} />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
