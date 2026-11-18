import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { MagneticCursor } from './components/Motion'
import Hero from './components/Hero'
import Services from './components/Services'
import Showreel from './components/Showreel'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import Contact from './components/Contact'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'

function HomePage() {
  return <main><Hero /><Showreel /><Services /><Portfolio /><Process /><Contact /></main>
}

function RoutedPages() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])
  return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/portfolio" element={<PortfolioPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></motion.div></AnimatePresence>
}

function App() {
  return <BrowserRouter><div className="min-h-screen overflow-hidden bg-ink-950"><MagneticCursor /><Navbar /><RoutedPages /><Footer /></div></BrowserRouter>
}

export default App
