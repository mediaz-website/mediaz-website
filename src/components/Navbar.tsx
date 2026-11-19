
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#faf9f6]/95 text-[#171717] backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-12 lg:py-4">

        {/* Mediazz Hub PNG Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="relative z-10 flex items-center"
        >
          <img
            src="/mediazz-logo.png"
            alt="Mediazz Hub"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-black'
                    : 'text-black/55 hover:text-black'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="group flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-xs font-semibold tracking-wide text-white transition-all hover:bg-black/75"
          >
            Start a Project
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 p-2 text-black md:hidden"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-black/10 bg-[#faf9f6] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {links.map((link, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  key={link.href}
                >
                  <NavLink
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 text-xl font-semibold tracking-tight ${
                        isActive ? 'text-black' : 'text-black/55'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center gap-2 border-t border-black/10 pt-5 text-sm font-semibold text-black"
              >
                Start a Project
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
