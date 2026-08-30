import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { FXProvider } from './context/FXContext'
import CustomCursor from './components/CustomCursor'
import FluidGlowBackground from './components/FluidGlowBackground'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import Slideshow from './components/Slideshow'
import SelectedWork from './components/SelectedWork'
import WhatIDo from './components/WhatIDo'
import KindWords from './components/KindWords'
import Articles from './components/Articles'
import ContactCTA from './components/ContactCTA'
import Footer from './components/Footer'
import FXToggleButton from './components/FXToggleButton'
import FXShockwaveOverlay from './components/FXShockwaveOverlay'

function MainContent({ loaded, setLoaded }) {
  return (
    <>
      {/* Directional water bow-wave forward glow */}
      <FluidGlowBackground />

      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <div className="relative z-10">
        <Header />

        <main>
          <Hero />
          <Slideshow />
          <SelectedWork />
          <WhatIDo />
          <KindWords />
          <Articles />
          <ContactCTA />
        </main>

        <Footer />
      </div>

      {/* Tactile FX Toggle Icon Button at Bottom Right */}
      <FXToggleButton />

      {/* Fullscreen Optical Liquid Light Shockwave */}
      <FXShockwaveOverlay />
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Initialize Lenis smooth scroll with luxurious coasting momentum
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <FXProvider>
      {/* Sleek dynamic cursor with interactive living Eye & directional arrows */}
      <CustomCursor />

      <MainContent loaded={loaded} setLoaded={setLoaded} />
    </FXProvider>
  )
}
