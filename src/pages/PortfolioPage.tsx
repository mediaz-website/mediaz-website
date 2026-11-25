
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { images } from '../lib/images'
import { PageHero, PageMeta, SectionHeading } from '../components/PageFrame'
import { Reveal } from '../components/Motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { supabase } from '../lib/supabase'

type PortfolioProject = {
  id: string
  slug?: string
  title: string
  category: string
  type: string
  image: string
  isDemo: boolean
  videoUrl?: string
}

const demoProjects: PortfolioProject[] = [
  { id: 'demo-1', title: 'Light / Motion', category: 'Commercial & Advertising', type: 'Demo project · Film study', image: images.camera, isDemo: true },
  { id: 'demo-2', title: 'Object Study 01', category: 'Product Photography', type: 'Demo project · Still life', image: images.clothing, isDemo: true },
  { id: 'demo-3', title: 'Color / Form', category: 'Brand Campaigns', type: 'Demo project · Campaign study', image: images.fashion, isDemo: true },
  { id: 'demo-4', title: 'Vertical Energy', category: 'Reels & Social Media', type: 'Demo project · Social study', image: images.neonFashion, isDemo: true },
  { id: 'demo-5', title: 'The Working Cut', category: 'Corporate Videos', type: 'Demo project · Studio study', image: images.studio, isDemo: true },
  { id: 'demo-6', title: 'Table Stories', category: 'Food & Lifestyle', type: 'Demo project · Lifestyle study', image: images.food, isDemo: true },
  { id: 'demo-7', title: 'The Human Frame', category: 'Brand Campaigns', type: 'Demo project · Portrait study', image: images.photographer, isDemo: true },
  { id: 'demo-8', title: 'The Quiet Detail', category: 'Product Photography', type: 'Demo project · Detail study', image: images.lifestyle, isDemo: true },
  { id: 'ai-demo-1', title: 'Anaya Sharma · AI Influencer', category: 'AI & Automation', type: 'AI-generated influencer videos · Showcase link to be added', image: images.creative, isDemo: true, videoUrl: '' },
  { id: 'ai-demo-2', title: 'AI Video & Creative Production', category: 'AI & Automation', type: 'AI video, image and voiceover production · Showcase link to be added', image: images.studio, isDemo: true, videoUrl: '' },
  { id: 'ai-demo-3', title: 'AI Production Workflows', category: 'AI & Automation', type: 'Content and media production automation · Showcase link to be added', image: images.lifestyle, isDemo: true, videoUrl: '' },
]

export default function PortfolioPage() {
  const pageContent = useSiteContent('portfolio', 'main', {
    heroEyebrow: 'Our visual world', heroLine1: 'Stories made', heroLine2: 'to be remembered.',
    heroDescription: 'Explore our on-ground productions, AI-generated videos, digital creatives and automation projects — bringing real-world craft and AI-powered creativity together.',
    sectionEyebrow: 'Selected visual directions', sectionLine1: 'Different stories.', sectionLine2: 'One creative vision.',
    sectionDescription: 'Browse real-world shoots, AI media showcases and production workflow projects. We will keep adding video showcase links as each project is published.',
    closingEyebrow: 'Have a story to tell?', closingLine1: 'Have a story that needs', closingLine2: 'a visual world?', closingCta: 'Bring us the brief',
  })
  
  const navigate = useNavigate()
  const [activeAiCategory, setActiveAiCategory] = useState('All AI work')
  const [activeGroundCategory, setActiveGroundCategory] = useState('All shoot work')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [publishedProjects, setPublishedProjects] = useState<PortfolioProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPublishedProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, slug, category, client_name, cover_image_url')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        if (active && data) {
          const formattedProjects: PortfolioProject[] = data.map((project) => ({
            id: project.id,
            slug: project.slug,
            title: project.title,
            category: project.category || 'Other Projects',
            type: project.client_name
              ? `${project.client_name} · ${project.category || 'Project'}`
              : project.category || 'Media Production',
            image: project.cover_image_url || images.camera,
            isDemo: false,
          }))

          setPublishedProjects(formattedProjects)
        }
      } catch (error) {
        console.error('Unable to load published portfolio projects:', error)
      } finally {
        if (active) setLoadingProjects(false)
      }
    }

    loadPublishedProjects()

    return () => {
      active = false
    }
  }, [])

  const allProjects = [...publishedProjects, ...demoProjects]

  const isAiProject = (project: PortfolioProject) =>
    project.category === 'AI & Automation' || /ai|automation/i.test(project.category)

  const aiProjects = allProjects.filter(isAiProject)
  const groundProjects = allProjects.filter((project) => !isAiProject(project))
  const aiCategories = [
    'All AI work',
    ...Array.from(new Set(aiProjects.map((project) => project.category))),
  ]
  const groundCategories = [
    'All shoot work',
    ...Array.from(new Set(groundProjects.map((project) => project.category))),
  ]
  const aiVisibleProjects = activeAiCategory === 'All AI work'
    ? aiProjects
    : aiProjects.filter((project) => project.category === activeAiCategory)
  const groundVisibleProjects = activeGroundCategory === 'All shoot work'
    ? groundProjects
    : groundProjects.filter((project) => project.category === activeGroundCategory)
  const visibleProjects = [...aiVisibleProjects, ...groundVisibleProjects]
  const demoVisibleProjects = visibleProjects.filter((project) => project.isDemo)

  const selectedProject =
    selectedIndex !== null ? demoVisibleProjects[selectedIndex] : null

  const showPrevious = () => {
    if (selectedIndex !== null && demoVisibleProjects.length > 0) {
      setSelectedIndex(
        (selectedIndex - 1 + demoVisibleProjects.length) % demoVisibleProjects.length
      )
    }
  }

  const showNext = () => {
    if (selectedIndex !== null && demoVisibleProjects.length > 0) {
      setSelectedIndex((selectedIndex + 1) % demoVisibleProjects.length)
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedIndex, demoVisibleProjects.length])

  return (
    <>
      <PageMeta
        title="Portfolio"
        description="Explore Mediazz Hub's portfolio of on-ground media production, AI videos, digital creatives and media automation projects."
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://mediazhub.com/portfolio#webpage",
          "url": "https://mediazhub.com/portfolio",
          "name": "Mediazz Hub Portfolio",
          "description": "A showcase of on-ground media production, AI videos, digital creatives and media automation projects.",
          "about": { "@id": "https://mediazhub.com/#organization" },
          "publisher": { "@id": "https://mediazhub.com/#organization" },
          "inLanguage": "en-IN"
        }}
      />

      <PageHero
        eyebrow={pageContent.heroEyebrow}
        title={
          <>
            {pageContent.heroLine1}
            <br />
            <span className="text-white/35">{pageContent.heroLine2}</span>
          </>
        }
        description={pageContent.heroDescription}
        image={images.fashion}
      />

      <main className="bg-[#0b0b0d]">
        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <SectionHeading
            eyebrow={pageContent.sectionEyebrow}
            title={
              <>
                {pageContent.sectionLine1}
                <br />
                <span className="text-white/35">{pageContent.sectionLine2}</span>
              </>
            }
            detail={pageContent.sectionDescription}
          />

          <div className="mb-10 mt-12 grid gap-5 md:grid-cols-2">
            <div id="ai-production-portfolio" className="scroll-mt-28 border border-[#c5a46d]/35 bg-[#141416] p-6 sm:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#d5b77e]">01 / Worldwide</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white">AI Production</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">AI-created videos, images, voiceovers and digital media, supported by smart workflows and automation for brands worldwide.</p>
            </div>
            <div id="on-ground-portfolio" className="scroll-mt-28 border border-white/15 bg-[#191714] p-6 sm:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#d5b77e]">02 / Pan India</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white">On-ground Production</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">Real-world shoots, photography, commercials, reels, podcasts and films produced by our crew across India.</p>
            </div>
          </div>

          {loadingProjects && (
            <p className="mb-8 text-center text-xs tracking-widest text-white/40 uppercase">
              Loading published projects...
            </p>
          )}

          <div className="grid items-start gap-12 lg:grid-cols-2">
            <section className="border border-[#c5a46d]/25 bg-[#141416]/50 p-4 sm:p-6">
              <h3 className="mb-4 font-display text-2xl font-bold text-white">AI Production Work</h3>
              <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-5">
                {aiCategories.map((category) => (
                  <button key={category} type="button" onClick={() => { setActiveAiCategory(category); setSelectedIndex(null) }} className={`rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${activeAiCategory === category ? 'border-[#c5a46d] bg-[#c5a46d] text-[#0b0b0d]' : 'border-white/20 text-white/55 hover:border-[#c5a46d] hover:text-white'}`}>{category}</button>
                ))}
              </div>
              <motion.div layout className="grid gap-10 sm:grid-cols-2">
                {aiVisibleProjects.map((project, index) => (
                  <motion.article layout key={project.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.03 }} className="group">
                <button
                  type="button"
                  onClick={() => {
                    if (project.isDemo) {
                      const demoIndex = demoVisibleProjects.findIndex(
                        (item) => item.id === project.id
                      )
                      setSelectedIndex(demoIndex)
                    } else if (project.slug) {
                      navigate(`/portfolio/${project.slug}`)
                    }
                  }}
                  aria-label={`View ${project.title}`}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[1.15] overflow-hidden bg-[#141416]">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/25">
                      <div className="flex size-16 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <ArrowUpRight size={23} />
                      </div>
                    </div>

                    <span className="absolute left-5 top-5 border border-white/30 bg-black/40 px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                      {project.category === 'AI & Automation' ? 'AI Showcase · Link Pending' : project.isDemo ? 'Demo Visual' : 'Published Project'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between border-t border-white/15 pt-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-[10px] tracking-[0.2em] text-white/45 uppercase">
                        {project.type}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="text-[#e0bd7e] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </button>
              </motion.article>
            ))}
              </motion.div>
              {aiVisibleProjects.length === 0 && <p className="py-10 text-sm text-white/50">No AI projects in this category yet.</p>}
            </section>
            <section className="border border-white/15 bg-[#191714]/50 p-4 sm:p-6">
              <h3 className="mb-4 font-display text-2xl font-bold text-white">On-ground Production Work</h3>
              <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-5">
                {groundCategories.map((category) => (
                  <button key={category} type="button" onClick={() => { setActiveGroundCategory(category); setSelectedIndex(null) }} className={`rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${activeGroundCategory === category ? 'border-[#c5a46d] bg-[#c5a46d] text-[#0b0b0d]' : 'border-white/20 text-white/55 hover:border-[#c5a46d] hover:text-white'}`}>{category}</button>
                ))}
              </div>
              <motion.div layout className="grid gap-10 sm:grid-cols-2">
                {groundVisibleProjects.map((project, index) => (
                  <motion.article layout key={project.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.03 }} className="group">
                    <button type="button" onClick={() => {
                      if (project.isDemo) {
                        const demoIndex = demoVisibleProjects.findIndex((item) => item.id === project.id)
                        setSelectedIndex(demoIndex)
                      } else if (project.slug) {
                        navigate('/portfolio/' + project.slug)
                      }
                    }} aria-label={'View ' + project.title} className="block w-full text-left">
                      <div className="relative aspect-[1.15] overflow-hidden bg-[#141416]">
                        <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/25"><div className="flex size-16 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100"><ArrowUpRight size={23} /></div></div>
                        <span className="absolute left-5 top-5 border border-white/30 bg-black/40 px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">{project.isDemo ? 'Demo Visual' : 'Published Project'}</span>
                      </div>
                      <div className="mt-4 flex items-start justify-between border-t border-white/15 pt-4"><div><h3 className="font-display text-xl font-semibold text-white">{project.title}</h3><p className="mt-1 text-[10px] tracking-[0.2em] text-white/45 uppercase">{project.type}</p></div><ArrowUpRight size={17} className="text-[#e0bd7e]" /></div>
                    </button>
                  </motion.article>
                ))}
              </motion.div>
              {groundVisibleProjects.length === 0 && <p className="py-10 text-sm text-white/50">No on-ground projects in this category yet.</p>}
            </section>
          </div>

          <AnimatePresence>
            {visibleProjects.length === 0 && !loadingProjects && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-sm text-white/55"
              >
                No projects in this category yet.
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        <section className="border-t border-white/15 bg-[#0b0b0b] py-24 text-center lg:py-32">
          <Reveal>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a46d] uppercase">
              {pageContent.closingEyebrow}
            </p>

            <h2 className="mx-auto max-w-4xl font-display text-4xl leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
              {pageContent.closingLine1}
              <br />
              <span className="italic text-[#e0bd7e]">{pageContent.closingLine2}</span>
            </h2>

            <Link
              to="/contact"
              className="mt-9 inline-flex items-center gap-3 bg-[#c5a46d] px-7 py-5 text-[10px] font-bold tracking-[0.2em] text-[#0b0b0d] uppercase transition-colors hover:bg-[#e0bd7e]"
            >
              {pageContent.closingCta}
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </section>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close image viewer"
              className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/40 text-white transition hover:border-[#c5a46d] hover:text-[#e0bd7e]"
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
              className="absolute left-3 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/50 text-white transition hover:border-[#c5a46d] hover:text-[#e0bd7e] sm:left-8"
            >
              <ArrowLeft size={21} />
            </button>

            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
            >
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="max-h-[76vh] w-full object-contain"
              />

              <div className="mt-5 flex w-full items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl text-white sm:text-2xl">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-1 text-[10px] tracking-[0.18em] text-white/50 uppercase">
                    {selectedProject.type}
                  </p>
                  {selectedProject.videoUrl ? (
                    <a href={selectedProject.videoUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e0bd7e] hover:text-white">Watch project <ArrowUpRight size={14} /></a>
                  ) : selectedProject.category === 'AI & Automation' ? (
                    <p className="mt-3 text-xs text-white/45">Video showcase link will be added.</p>
                  ) : null}
                </div>

                <span className="shrink-0 text-xs text-white/50">
                  {selectedIndex! + 1} / {demoVisibleProjects.length}
                </span>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              aria-label="Next image"
              className="absolute right-3 z-10 flex size-11 items-center justify-center border border-white/30 bg-black/50 text-white transition hover:border-[#c5a46d] hover:text-[#e0bd7e] sm:right-8"
            >
              <ArrowRight size={21} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
