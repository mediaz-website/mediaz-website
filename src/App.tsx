import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Showreel from './components/Showreel'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { MagneticCursor } from './components/Motion'

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-ink-950">
      <MagneticCursor />
      <Navbar />
      <main>
        <Hero />
        <Showreel />
        <Services />
        <Portfolio />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
