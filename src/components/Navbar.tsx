
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'

const serviceItems = [
  { title: 'AI Automation & Workflows', slug: 'ai-automation-workflows', group: 'ai-production' },
  { title: 'AI Image & Creative Production', slug: 'ai-image-creative-production', group: 'ai-production' },
  { title: 'AI Tools & Integrations', slug: 'ai-tools-integrations', group: 'ai-production' },
  { title: 'AI Video Production', slug: 'ai-video-production', group: 'ai-production' },
  { title: 'AI Voiceover & Audio', slug: 'ai-voiceover-audio', group: 'ai-production' },
  { title: 'Commercial & Advertising Shoots', slug: 'commercial-advertising-shoots', group: 'on-ground-production' },
  { title: 'Events & Live Coverage', slug: 'events-live-coverage', group: 'on-ground-production' },
  { title: 'On-ground Production', slug: 'on-ground-production', group: 'on-ground-production' },
  { title: 'Podcast & Interview Production', slug: 'podcast-interview-production', group: 'on-ground-production' },
  { title: 'Product & Brand Photography', slug: 'product-brand-photography', group: 'on-ground-production' },
  { title: 'Reels & Video Production', slug: 'reels-video-production', group: 'on-ground-production' },
  { title: 'SEO & AEO', slug: 'seo-aeo', group: 'ai-production' },
  { title: 'Short Films & Documentaries', slug: 'short-films-documentaries', group: 'on-ground-production' },
  { title: 'Social Media & Profile Management', slug: 'social-media-management', group: 'ai-production' },
  { title: 'Website Development', slug: 'website-development', group: 'ai-production' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const globalContent = useSiteContent('global', 'main', { navHome: 'Home', navAbout: 'About', navServices: 'Services', navPortfolio: 'Portfolio', navContact: 'Contact', navCta: 'Start a Project' })
  const links = [
    { label: globalContent.navHome, href: '/' },
    { label: globalContent.navAbout, href: '/about' },
    { label: globalContent.navServices, href: '/services' },
    { label: globalContent.navPortfolio, href: '/portfolio' },
    { label: globalContent.navContact, href: '/contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#171512]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
          : 'bg-[#171512]/75'
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-12 lg:py-4">

        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="relative z-50 flex shrink-0 items-center"
        >
          <img
            src="/mediazz-logo.png"
            alt="Mediazz Hub"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {links.map((link) => (
            <div key={link.href} className={link.href === '/services' ? 'group relative' : 'relative'}>
              <NavLink
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `relative py-2 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-[#e0bd7e]' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-[#c5a46d] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
              {link.href === '/services' && (
                <div className="invisible absolute left-0 top-full z-50 mt-3 w-80 translate-y-2 border border-white/10 bg-[#171512] p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <Link to="/services#services-grid" className="mb-1 block border-b border-white/10 px-4 py-3 text-sm font-semibold text-[#e0bd7e] transition-colors hover:bg-white/5">All Services <span className="ml-2 text-[9px] uppercase tracking-wider text-white/35">A–Z</span></Link>
                  <div className="max-h-[65vh] overflow-y-auto">
                    {serviceItems.map((service) => (
                      <Link key={service.slug} to={`/services#${service.slug === "ai-video-production" || service.group === "ai-production" ? `service-${service.slug}` : `service-${service.slug}`}`} className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-[#e0bd7e]">{service.title}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            to="/contact"
            className="group flex items-center gap-2 border border-[#c5a46d] bg-[#c5a46d] px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-[#171512] uppercase transition-all duration-300 hover:bg-[#e0bd7e]"
          >
            {globalContent.navCta}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative z-50 flex size-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#c5a46d] hover:text-[#e0bd7e] md:hidden"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'calc(100dvh - 76px)', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-full overflow-y-auto border-t border-white/10 bg-[#171512] md:hidden"
          >
            <div className="flex min-h-full flex-col justify-between px-7 py-8">

              <div>
                <p className="mb-7 text-[10px] font-bold tracking-[0.3em] text-[#c5a46d] uppercase">
                  Navigation
                </p>

                <div className="flex flex-col">
                  {links.map((link, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      key={link.href}
                      className="border-b border-white/10"
                    >
                      <NavLink
                        to={link.href}
                        end={link.href === '/'}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between py-5 font-serif text-3xl transition-colors ${
                            isActive ? 'text-[#e0bd7e]' : 'text-white/75 hover:text-white'
                          }`
                        }
                      >
                        {link.label}
                        <ArrowUpRight size={19} className="text-[#c5a46d]" />
                      </NavLink>
                      {link.href === '/services' && (
                        <div className="border-t border-white/10 py-2 pl-4">
                          <Link to="/services#services-grid" onClick={() => setOpen(false)} className="flex items-center justify-between py-3 text-sm font-semibold text-[#e0bd7e]">All Services <ArrowUpRight size={15} /></Link>
                          {serviceItems.map((service) => (
                            <Link key={service.slug} to={`/services#service-${service.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 text-sm text-white/60 transition-colors hover:text-[#e0bd7e]">{service.title}<ArrowUpRight size={14} className="text-[#c5a46d]" /></Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-8 flex items-center justify-center gap-3 bg-[#c5a46d] px-6 py-5 text-xs font-bold tracking-[0.18em] text-[#171512] uppercase transition-colors hover:bg-[#e0bd7e]"
                >
                  Start a Project
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              {/* Social Links */}
              <div className="mt-12 border-t border-white/15 pt-7">
                <p className="mb-5 text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                  Connect with us
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  <a
                    href="https://www.instagram.com/mediazz_hub/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#e0bd7e]"
                  >
                    <span className="text-xl font-bold">◎</span>
                    Instagram
                  </a>

                  <a
                    href="https://www.facebook.com/share/1A3MJows48/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#e0bd7e]"
                  >
                    <span className="text-lg font-bold">f</span>
                    Facebook
                  </a>

                  <a
                    href="https://wa.me/918358063254"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#e0bd7e]"
                  >
                    <MessageCircle size={17} />
                    WhatsApp
                  </a>
                </div>

                <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
                  Indore · India · Worldwide
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
