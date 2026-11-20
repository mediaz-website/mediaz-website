
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()\n  const globalContent = useSiteContent('global', 'main', { navHome: 'Home', navAbout: 'About', navServices: 'Services', navPortfolio: 'Portfolio', navContact: 'Contact', navCta: '{globalContent.navCta}' })\n  const links = [\n    { label: globalContent.navHome, href: '/' },\n    { label: globalContent.navAbout, href: '/about' },\n    { label: globalContent.navServices, href: '/services' },\n    { label: globalContent.navPortfolio, href: '/portfolio' },\n    { label: globalContent.navContact, href: '/contact' },\n  ]

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
            <NavLink
              key={link.href}
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
          ))}

          <Link
            to="/contact"
            className="group flex items-center gap-2 border border-[#c5a46d] bg-[#c5a46d] px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-[#171512] uppercase transition-all duration-300 hover:bg-[#e0bd7e]"
          >
            Start a Project
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
