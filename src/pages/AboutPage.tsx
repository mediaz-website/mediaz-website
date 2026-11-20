
import { useState } from 'react'
import {
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Camera,
  Video,
  Mic2,
  Megaphone,
  Film,
  Building2,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { images } from '../lib/images'
import { PageMeta } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { useSiteContent } from '../hooks/useSiteContent'

const stats = [
  ['500+', 'Projects Completed'],
  ['2023', 'Our Journey Began'],
  ['Multiple', 'Industries Served'],
  ['India', 'Our Reach'],
]

const services = [
  { icon: Clapperboard, title: 'Commercial & Ad Films', description: 'Brand commercials, promotional films, campaign shoots and advertising creatives.' },
  { icon: Camera, title: 'Product Photography', description: 'Product photography, catalogue shoots, ecommerce visuals and creative product campaigns.' },
  { icon: Video, title: 'Reels & Video Production', description: 'Social media reels, short-form videos, brand films and corporate videos.' },
  { icon: Mic2, title: 'Podcast & Interviews', description: 'Podcast production, celebrity interviews, conversations and studio shoots.' },
  { icon: Film, title: 'Short Films & Documentaries', description: 'Short films, school documentaries, event films and visual storytelling.' },
  { icon: Megaphone, title: 'Creative & Campaign Production', description: 'Creative concepts, campaign planning, digital advertisements and production execution.' },
]

const industries = [
  'Automotive & Car Showrooms',
  'Fashion & Clothing Manufacturers',
  'D2C & Ecommerce Brands',
  'Food, Cafes & Hospitality',
  'Events & Entertainment',
  'Real Estate & Architecture',
  'Education & Institutions',
  'Beauty, Salon & Lifestyle',
  'Sports & Fitness',
  'Devotional & Cultural Events',
  'Music & Performing Arts',
  'Travel, Airbnb & Experiences',
  'Digital Marketing Agencies',
  'Corporate & Professional Brands',
]

const collaborations = [
  'REAL ESTATE',
  'JEEP',
  'TATA IPL FANPARK',
  'MG / Morris Garages',
]

const process = [
  ['01', 'Discover', 'Understanding your brand, audience, goals and the story worth telling.'],
  ['02', 'Concept', 'Developing the creative direction, visual approach and production plan.'],
  ['03', 'Shoot', 'Bringing the concept to life with the right team, equipment and execution.'],
  ['04', 'Post-Production', 'Editing, colour grading, sound and final delivery across formats.'],
]

const gallery = [
  { src: images.studio, title: 'Creative Production', category: 'Behind The Scenes' },
  { src: images.photographer, title: 'The Art of Shooting', category: 'Production' },
]

export default function AboutPage() {
  const content = useSiteContent('about', 'main', {
    heroEyebrow: 'About Mediazz Hub · Est. 2023', heroLine1: 'We turn ideas', heroLine2: 'into experiences.',
    heroDescription: 'A creative media production house bringing concepts, brands and stories to life through photography, filmmaking and end-to-end creative production.', heroCta: 'Explore Our Work',
    introEyebrow: 'Who We Are', introHeading1: 'More than', introHeading2: 'just production.',
    introLead: 'Mediazz Hub is a creative media production house based in Indore, Madhya Pradesh, working with multiple brands and businesses since 2023.',
    introText1: 'What started as a creative vision has grown into a production partner for businesses across different industries. From advertising campaigns and product shoots to celebrity shoots, podcasts, short films and event productions, we have completed 500+ projects across multiple creative services.',
    introText2: 'Our approach brings concept planning, creative direction, production, photography, filmmaking and final editing together — making the entire process more connected, collaborative and effective.',
    statsProjects: '500+', statsYear: '2023', statsIndustries: 'Multiple', statsReach: 'India',
    servicesEyebrow: 'What We Create', servicesHeading1: 'One creative vision.', servicesHeading2: 'Many possibilities.', servicesDescription: 'From a single frame to a complete campaign, our production capabilities cover a wide range of creative formats.',
    industriesEyebrow: 'Industries & Experiences', industriesHeading1: 'Different worlds.', industriesHeading2: 'One vision.', industriesDescription: 'Our projects have taken us across industries, audiences and creative environments. Every business has a different story, and every production needs its own approach.',
    closingEyebrow: 'Have A Story To Tell?', closingHeading1: "Let's create something", closingHeading2: 'worth remembering.', closingDescription: 'Tell us about your brand, your vision and the story you want to bring to life.', closingCta: 'Start A Project',
  })
  const stats = [[content.statsProjects, 'Projects Completed'], [content.statsYear, 'Our Journey Began'], [content.statsIndustries, 'Industries Served'], [content.statsReach, 'Our Reach']]
  
  const [activeImage, setActiveImage] = useState<number | null>(null)

  const nextImage = () => {
    if (activeImage !== null) {
      setActiveImage((activeImage + 1) % gallery.length)
    }
  }

  const previousImage = () => {
    if (activeImage !== null) {
      setActiveImage((activeImage - 1 + gallery.length) % gallery.length)
    }
  }

  return (
    <>
      <PageMeta
        title="About Mediazz Hub"
        description="Discover Mediazz Hub, an Indore-based creative media production house with 500+ completed projects since 2023."
      />

      <main className="overflow-hidden bg-[#171512] text-white">

        {/* ABOUT HERO */}
        <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-[#171512] pt-36">
          <div className="absolute inset-0">
            <img
              src={images.studio}
              alt="Creative media production"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/90 via-transparent to-black/20" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-16 lg:pb-28">
            <Reveal>
              <p className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f0d49a]" />
                {content.heroEyebrow}
              </p>

              <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.96] tracking-[-0.045em] text-white">
                {content.heroLine1}
                <br />
                {content.heroLine2}
              </h1>

              <p className="mt-9 max-w-xl text-sm leading-8 text-white/95 sm:text-base">
                {content.heroDescription}
              </p>

              <Link
                to="/portfolio"
                className="group mt-9 inline-flex items-center gap-4 bg-[#c5a46d] px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#171512] transition-all hover:bg-[#e0bd7e]"
              >
                {content.heroCta}
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Reveal>
          </div>

          <div className="absolute bottom-7 right-8 hidden text-[10px] uppercase tracking-[0.25em] text-white/85 lg:block">
            Indore · India · Worldwide
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-[#171512] py-24 lg:py-36">
          <div className="mx-auto grid max-w-[1440px] gap-14 px-6 lg:grid-cols-12 lg:gap-20 lg:px-16">
            <Reveal className="lg:col-span-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                {content.introEyebrow}
              </p>

              <h2 className="mt-7 font-serif text-5xl leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
                {content.introHeading1}
                <br />
                <span className="italic text-[#f0d49a]">{content.introHeading2}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
              <p className="text-xl leading-relaxed text-white sm:text-2xl">
                {content.introLead}
              </p>

              <p className="mt-7 text-sm leading-8 text-white/85">
                {content.introText1}
              </p>

              <p className="mt-5 text-sm leading-8 text-white/85">
                {content.introText2}
              </p>
            </Reveal>
          </div>
        </section>

        {/* NUMBERS */}
        <section className="border-y border-white/10 bg-[#211e19] py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-12 px-6 md:grid-cols-4 lg:px-16">
            {stats.map(([number, label], index) => (
              <Reveal key={label} delay={index * 0.08} className="text-center md:border-r md:border-white/10 last:border-0">
                <p className="font-serif text-5xl tracking-tight text-[#f0d49a] sm:text-6xl">
                  {number}
                </p>
                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/85 sm:text-[10px]">
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-[#171512] py-24 lg:py-36">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <Reveal className="mb-16 max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                {content.servicesEyebrow}
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.045em] text-white sm:text-7xl">
                {content.servicesHeading1}
                <br />
                <span className="italic text-[#f0d49a]">{content.servicesHeading2}</span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-8 text-white/85">
                {content.servicesDescription}
              </p>
            </Reveal>

            <div className="grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, description }, index) => (
                <Reveal
                  key={title}
                  delay={index * 0.07}
                  className="group border-b border-white/20 p-7 transition-colors duration-300 hover:bg-white/[0.045] sm:border-r lg:min-h-[280px] lg:p-9"
                >
                  <Icon
                    size={27}
                    strokeWidth={1.5}
                    className="text-[#f0d49a] transition-transform duration-300 group-hover:scale-110"
                  />

                  <h3 className="mt-12 font-serif text-2xl font-semibold text-white transition-colors group-hover:text-[#f0d49a]">
                    {title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/85">
                    {description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRIES */}
        <section className="bg-[#211e19] py-24 lg:py-36">
          <div className="mx-auto grid max-w-[1440px] gap-14 px-6 lg:grid-cols-5 lg:gap-20 lg:px-16">
            <Reveal className="lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                {content.industriesEyebrow}
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
                {content.industriesHeading1}
                <br />
                <span className="italic text-[#f0d49a]">{content.industriesHeading2}</span>
              </h2>

              <p className="mt-7 text-sm leading-8 text-white/85">
                {content.industriesDescription}
              </p>

              <div className="mt-9 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0d49a]">
                <Building2 size={17} />
                Multi-industry experience
              </div>
            </Reveal>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 border-t border-white/20 sm:grid-cols-2">
                {industries.map((industry, index) => (
                  <Reveal
                    key={industry}
                    delay={index * 0.035}
                    className="flex items-center gap-4 border-b border-white/20 py-5 pr-3"
                  >
                    <span className="font-mono text-[10px] text-[#f0d49a]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-medium text-white/95 transition-colors hover:text-[#f0d49a]">
                      {industry}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BRAND COLLABORATIONS */}
        <section className="bg-[#171512] py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <Reveal className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                Selected Brand Collaborations
              </p>

              <h2 className="mt-6 font-serif text-5xl tracking-[-0.045em] text-white sm:text-6xl">
                Brands & <span className="italic text-[#f0d49a]">businesses.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/85">
                We have had the opportunity to work on projects connected with established names, automotive showrooms, events and growing businesses.
              </p>
            </Reveal>

            <div className="mt-16 grid grid-cols-2 border-y border-white/20 md:grid-cols-4">
              {collaborations.map((brand, index) => (
                <Reveal
                  key={brand}
                  delay={index * 0.08}
                  className="flex min-h-36 items-center justify-center border-b border-white/20 p-6 text-center transition-colors duration-300 hover:bg-white/[0.04] md:border-b-0 md:border-r last:border-0"
                >
                  <span className="font-serif text-xl font-semibold tracking-wide text-white transition-colors hover:text-[#f0d49a] sm:text-2xl">
                    {brand}
                  </span>
                </Reveal>
              ))}
            </div>

            <p className="mt-7 text-center text-[10px] leading-6 text-white/75">
              Selected project and production associations. Brand names are used for portfolio identification only.
            </p>
          </div>
        </section>

        {/* VISUAL GALLERY */}
        <section className="bg-[#211e19] py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                  Behind The Creative
                </p>

                <h2 className="mt-5 font-serif text-5xl tracking-[-0.045em] text-white sm:text-6xl">
                  The art of <span className="italic text-[#f0d49a]">making.</span>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-white/85">
                Every frame has a thought behind it. Every detail has a purpose.
              </p>
            </Reveal>

            <div className="grid gap-7 md:grid-cols-2">
              {gallery.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.12}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className="group block w-full cursor-pointer text-left"
                    aria-label={`View ${item.title}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#29251e]">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a46d] text-[#171512] opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight size={20} />
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-b border-white/20 pb-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#f0d49a]">
                          {item.category}
                        </p>
                        <h3 className="mt-2 font-serif text-2xl text-white">
                          {item.title}
                        </h3>
                      </div>

                      <ArrowUpRight size={19} className="text-[#f0d49a]" />
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* OUR PROCESS */}
        <section className="bg-[#171512] py-24 lg:py-36">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <Reveal className="mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
                How We Work
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.045em] text-white sm:text-7xl">
                From concept
                <br />
                <span className="italic text-[#f0d49a]">to final frame.</span>
              </h2>
            </Reveal>

            <div className="grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-4">
              {process.map(([number, title, description], index) => (
                <Reveal
                  key={number}
                  delay={index * 0.1}
                  className="border-b border-white/20 p-7 transition-colors duration-300 hover:bg-white/[0.045] sm:border-r lg:min-h-[270px] lg:p-8"
                >
                  <span className="font-mono text-[11px] text-[#f0d49a]">
                    {number}
                  </span>

                  <h3 className="mt-16 font-serif text-3xl font-semibold text-white">
                    {title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/85">
                    {description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-white/10 bg-[#211e19] px-6 py-28 text-center lg:py-40">
          <Reveal className="mx-auto max-w-4xl">
            <Sparkles size={25} className="mx-auto text-[#f0d49a]" />

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d49a]">
              {content.closingEyebrow}
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-white sm:text-7xl">
              {content.closingHeading1}
              <br />
              <span className="italic text-[#f0d49a]">{content.closingHeading2}</span>
            </h2>

            <p className="mx-auto mt-7 max-w-lg text-sm leading-8 text-white/85">
              {content.closingDescription}
            </p>

            <Link
              to="/contact"
              className="group mt-10 inline-flex items-center gap-5 bg-[#c5a46d] px-8 py-5 text-xs font-bold uppercase tracking-[0.18em] text-[#171512] transition-all duration-300 hover:bg-[#e0bd7e]"
            >
              {content.closingCta}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </section>

      </main>

      {/* IMAGE POPUP */}
      {activeImage !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090807]/95 p-5 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#c5a46d] hover:text-black"
          >
            <X size={23} />
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation()
              previousImage()
            }}
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#c5a46d] hover:text-black sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="max-h-[85vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={gallery[activeImage].src}
              alt={gallery[activeImage].title}
              className="max-h-[75vh] max-w-full object-contain"
            />

            <p className="mt-5 text-center font-serif text-2xl text-white">
              {gallery[activeImage].title}
            </p>
          </div>

          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#c5a46d] hover:text-black sm:right-8"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  )
}
