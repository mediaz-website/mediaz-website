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

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'bg-black/75 backdrop-blur-xl' : ''}`}>
    <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12">
      <Link to="/" onClick={() => setOpen(false)} className="relative z-10 font-display text-lg font-bold tracking-[-0.06em] text-white">MEDIAZZ<span className="text-white/35">/HUB</span></Link>
      <div className="hidden items-center gap-8 md:flex">
        {links.map((link) => <NavLink key={link.href} to={link.href} className={({ isActive }) => `text-[10px] font-medium tracking-[0.18em] uppercase transition-colors ${isActive ? 'text-white' : 'text-white/55 hover:text-white'}`}>{link.label}</NavLink>)}
        <Link to="/contact" className="group flex items-center gap-2 rounded-full border border-white/35 px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-all hover:bg-white hover:text-black">Start a project <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
      </div>
      <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)} className="relative z-10 p-2 text-white md:hidden">{open ? <X size={21} /> : <Menu size={21} />}</button>
    </nav>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 bg-black px-6 md:hidden"><div className="flex flex-col gap-1 py-6">{links.map((link, index) => <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} key={link.href}><NavLink to={link.href} onClick={() => setOpen(false)} className={({ isActive }) => `block py-3 font-display text-3xl font-semibold tracking-tight ${isActive ? 'text-white' : 'text-white/60'}`}>{link.label}</NavLink></motion.div>)}<Link to="/contact" onClick={() => setOpen(false)} className="mt-4 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-semibold tracking-[0.2em] text-white uppercase">Start a project <ArrowUpRight size={14} /></Link></div></motion.div>}</AnimatePresence>
  </header>
}
