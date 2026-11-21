
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { PageMeta } from '../components/PageFrame'
import { Reveal } from '../components/Motion'

type Project = {
  id: string
  title: string
  slug: string
  client_name: string | null
  category: string | null
  project_date: string | null
  location: string | null
  short_description: string | null
  project_description: string | null
  services: string[] | null
  cover_image_url: string | null
  gallery_images: string[] | null
  video_url: string | null
}

export default function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    async function loadProject() {
      if (!slug) {
        setError('Project not found.')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle()

        if (error) throw error

        if (active) {
          if (data) {
            setProject(data as Project)
          } else {
            setError('This project is unavailable or has not been published.')
          }
        }
      } catch (err) {
        console.error('Project details error:', err)
        if (active) setError('Unable to load this project. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProject()

    return () => {
      active = false
    }
  }, [slug])

  const gallery = [
    ...(project?.cover_image_url ? [project.cover_image_url] : []),
    ...(project?.gallery_images || []),
  ].filter((url, index, list) => url && list.indexOf(url) === index)

  const showPrevious = () => {
    if (selectedImage !== null && gallery.length) {
      setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length)
    }
  }

  const showNext = () => {
    if (selectedImage !== null && gallery.length) {
      setSelectedImage((selectedImage + 1) % gallery.length)
    }
  }

  useEffect(() => {
    if (selectedImage === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null)
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedImage, gallery.length])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] text-sm tracking-widest text-white/50 uppercase">
        Loading project...
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#171512] px-6 text-center text-white">
        <h1 className="font-display text-4xl">Project unavailable</h1>
        <p className="max-w-md text-sm text-white/50">{error}</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 bg-[#c5a46d] px-6 py-4 text-xs font-bold tracking-widest text-[#171512] uppercase"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </main>
    )
  }

  return (
    <>
      <PageMeta
        title={project.title}
        description={project.short_description || project.project_description || 'Explore this Mediazz Hub production project.'}
      />

      <main className="min-h-screen bg-[#171512] text-white">
        <section className="relative flex min-h-[65vh] items-end overflow-hidden bg-[#0b0b0b] lg:min-h-[78vh]">
          {project.cover_image_url && (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-black/35 to-black/20" />

          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 lg:px-12 lg:pb-24">
            <Link
              to="/portfolio"
              className="mb-12 inline-flex items-center gap-2 text-xs tracking-widest text-white/70 uppercase transition hover:text-[#e0bd7e]"
            >
              <ArrowLeft size={16} /> Back to Portfolio
            </Link>

            <Reveal>
              <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#e0bd7e] uppercase">
                {project.category || 'Creative Production'}
              </p>
              <h1 className="max-w-5xl font-display text-5xl leading-[0.95] font-bold tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                {project.title}
              </h1>
              {project.short_description && (
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                  {project.short_description}
                </p>
              )}
            </Reveal>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 lg:grid-cols-3 lg:px-12 lg:py-28">
          <div className="lg:col-span-2">
            <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#c5a46d] uppercase">
              About the project
            </p>
            <h2 className="mb-7 font-display text-3xl leading-tight sm:text-4xl">
              Behind the creative vision.
            </h2>
            <p className="whitespace-pre-line text-sm leading-8 text-white/65 sm:text-base">
              {project.project_description || project.short_description || 'A creative production project by Mediazz Hub.'}
            </p>

            {project.services && project.services.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-white/45 uppercase">
                  Services delivered
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <span key={service} className="border border-white/20 px-4 py-2 text-xs text-white/75">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit border-t border-white/20 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="mb-7 text-[10px] font-semibold tracking-[0.3em] text-[#c5a46d] uppercase">
              Project information
            </p>

            {[
              ['Client', project.client_name],
              ['Category', project.category],
              ['Date', project.project_date],
              ['Location', project.location],
            ].filter((item) => item[1]).map(([label, value]) => (
              <div key={label} className="mb-6 border-b border-white/10 pb-5">
                <p className="mb-2 text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</p>
                <p className="text-sm text-white/85">{value}</p>
              </div>
            ))}
          </aside>
        </section>

        {gallery.length > 0 && (
          <section className="border-t border-white/10 bg-[#0b0b0b] px-6 py-20 lg:px-12 lg:py-28">
            <div className="mx-auto max-w-[1440px]">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#c5a46d] uppercase">
                Visual gallery
              </p>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
                <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
                  Every frame tells a story.
                </h2>
                <p className="text-xs text-white/45">{gallery.length} Images</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((url, index) => (
                  <Reveal key={`${url}-${index}`} delay={index * 0.04}>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-[#211e19]"
                    >
                      <img
                        src={url}
                        alt={`${project.title} gallery ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                        <ArrowUpRight size={28} />
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.video_url && (
          <section className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
            <p className="mb-6 text-[10px] font-semibold tracking-[0.3em] text-[#c5a46d] uppercase">
              Project film
            </p>
            <a
              href={project.video_url}
              target="_blank"
              rel="noreferrer"
              className="group flex aspect-video items-center justify-center border border-white/15 bg-black text-white"
            >
              <span className="flex size-20 items-center justify-center rounded-full border border-white/50 transition group-hover:border-[#e0bd7e] group-hover:text-[#e0bd7e]">
                <Play size={26} fill="currentColor" />
              </span>
            </a>
            <p className="mt-4 text-xs text-white/45">Open project video <ArrowUpRight size={13} className="inline" /></p>
          </section>
        )}

        <section className="border-t border-white/10 bg-[#0b0b0b] px-6 py-20 text-center lg:py-28">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#c5a46d] uppercase">
            Have a project in mind?
          </p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
            Let’s create something memorable.
          </h2>
          <Link
            to="/contact"
            className="mt-9 inline-flex items-center gap-3 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#171512] uppercase transition hover:bg-[#e0bd7e]"
          >
            Start a conversation <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery"
              className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/40 text-white hover:text-[#e0bd7e]"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showPrevious()
              }}
              aria-label="Previous image"
              className="absolute left-3 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/50 text-white sm:left-8"
            >
              <ArrowLeft size={21} />
            </button>

            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-6xl flex-col items-center"
            >
              <img
                src={gallery[selectedImage]}
                alt={`${project.title} gallery ${selectedImage + 1}`}
                className="max-h-[78vh] w-full object-contain"
              />
              <p className="mt-4 text-xs text-white/50">
                {selectedImage + 1} / {gallery.length}
              </p>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              aria-label="Next image"
              className="absolute right-3 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/50 text-white sm:right-8"
            >
              <ArrowRight size={21} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
