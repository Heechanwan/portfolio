import { useState, useRef, useEffect, useCallback } from 'react'
import { useParallax } from '../hooks/useParallax'
import { slideshowItems } from '../data/projects'
import ScrollReveal from './ScrollReveal'
import MagneticNavButton from './MagneticNavButton'

export default function Slideshow() {
  const { containerRef, innerRef } = useParallax(0.08)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const figureRef = useRef(null)
  const imgRefs = useRef([])

  const totalSlides = slideshowItems.length

  // Hardware GPU-Driven Slide Image Scrub Physics
  const scrollPosRef = useRef(0)
  const targetSpeedRef = useRef(0)
  const currentSpeedRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const isHoveredRef = useRef(false)
  const rafIdRef = useRef(null)
  const isLoopRunningRef = useRef(false)

  // Start physics loop only when needed (hovered or actively rewinding)
  const startLoopIfNeeded = useCallback(() => {
    if (isLoopRunningRef.current) return
    isLoopRunningRef.current = true
    lastTimeRef.current = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      const activeImg = imgRefs.current[currentIndex]
      const container = containerRef.current

      let shouldContinue = false

      if (activeImg && container) {
        const containerH = container.clientHeight
        const imgH = activeImg.clientHeight || activeImg.scrollHeight || 0
        const maxOverflow = Math.max(0, imgH - containerH)

        if (maxOverflow > 10) {
          if (isHoveredRef.current) {
            shouldContinue = true
            currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.14
            scrollPosRef.current = Math.max(
              0,
              Math.min(maxOverflow, scrollPosRef.current + currentSpeedRef.current * dt)
            )
            activeImg.style.transform = `translate3d(0, -${scrollPosRef.current.toFixed(1)}px, 0)`
          } else {
            // Buttery soft rewind back to top
            currentSpeedRef.current = 0
            if (scrollPosRef.current > 0.5) {
              shouldContinue = true
              scrollPosRef.current += (0 - scrollPosRef.current) * Math.min(1, dt * 3.5)
              activeImg.style.transform = `translate3d(0, -${scrollPosRef.current.toFixed(1)}px, 0)`
            } else if (scrollPosRef.current > 0) {
              scrollPosRef.current = 0
              activeImg.style.transform = 'translate3d(0, 0px, 0)'
            }
          }
        }
      }

      if (shouldContinue) {
        rafIdRef.current = requestAnimationFrame(tick)
      } else {
        isLoopRunningRef.current = false
        rafIdRef.current = null
      }
    }

    rafIdRef.current = requestAnimationFrame(tick)
  }, [currentIndex, containerRef])

  useEffect(() => {
    const figure = figureRef.current
    if (!figure) return

    const onMouseMove = (e) => {
      const rect = figure.getBoundingClientRect()
      const y = (e.clientY - rect.top) / rect.height - 0.5

      const deviation = y
      const deadZone = 0.08
      if (Math.abs(deviation) < deadZone) {
        targetSpeedRef.current = 0
      } else {
        const sign = Math.sign(deviation)
        const normalizedDev = (Math.abs(deviation) - deadZone) / (0.5 - deadZone)
        const intensity = Math.pow(normalizedDev, 1.6)
        const maxSpeed = 750
        targetSpeedRef.current = sign * intensity * maxSpeed
      }
    }

    const onMouseEnter = () => {
      isHoveredRef.current = true
      setIsHovered(true)
      startLoopIfNeeded()
    }

    const onMouseLeave = () => {
      isHoveredRef.current = false
      setIsHovered(false)
      targetSpeedRef.current = 0
      startLoopIfNeeded() // Allow smooth rewind
    }

    figure.addEventListener('mousemove', onMouseMove, { passive: true })
    figure.addEventListener('mouseenter', onMouseEnter)
    figure.addEventListener('mouseleave', onMouseLeave)

    return () => {
      figure.removeEventListener('mousemove', onMouseMove)
      figure.removeEventListener('mouseenter', onMouseEnter)
      figure.removeEventListener('mouseleave', onMouseLeave)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      isLoopRunningRef.current = false
    }
  }, [startLoopIfNeeded])

  // Slide transition
  const changeSlide = (nextIndex) => {
    if (nextIndex === currentIndex) return

    // Reset old slide
    const oldImg = imgRefs.current[currentIndex]
    if (oldImg) {
      oldImg.style.transform = 'translate3d(0, 0px, 0)'
    }

    scrollPosRef.current = 0
    targetSpeedRef.current = 0
    currentSpeedRef.current = 0
    setCurrentIndex(nextIndex)
  }

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const prev = (currentIndex - 1 + totalSlides) % totalSlides
    changeSlide(prev)
  }

  const handleNext = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const next = (currentIndex + 1) % totalSlides
    changeSlide(next)
  }

  // Click on slide scrolls smoothly to that specific project in the works section
  const handleFigureClick = (e) => {
    if (e.target.closest('button') || e.target.closest('[data-cursor="magnetic"]')) return
    const currentItem = slideshowItems[currentIndex]
    if (currentItem && currentItem.projectId) {
      const targetEl = document.getElementById('project-' + currentItem.projectId)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="px-5 py-16 md:px-10 md:py-32 select-none">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal>
          <figure
            ref={figureRef}
            onClick={handleFigureClick}
            data-cursor="eye"
            className="group relative rounded-2xl md:rounded-3xl border border-white/10 bg-[#16181D] shadow-[0_25px_60px_rgba(0,0,0,0.85)] cursor-pointer"
          >
            {/* Multi-Color Contour Border Glow strictly along the Carousel Frame - Active ONLY on Hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[2px] rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10 will-change-opacity"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.7), rgba(174, 168, 254, 0.8), rgba(244, 114, 182, 0.75), rgba(129, 140, 248, 0.8))',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 md:-inset-3 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 blur-xl md:blur-2xl -z-10 will-change-opacity"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.35), rgba(174, 168, 254, 0.45), rgba(244, 114, 182, 0.35), rgba(129, 140, 248, 0.4))',
              }}
            />

            {/* Main Image Showcase Viewport */}
            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[4/5] w-full md:aspect-[16/9] bg-[#14161A]"
            >
              <div ref={innerRef} className="h-[110%] w-full -mt-[5%]">
                {slideshowItems.map((item, i) => {
                  const isActive = i === currentIndex

                  return (
                    <div
                      key={i}
                      className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                    >
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          ref={(el) => (imgRefs.current[i] = el)}
                          alt={item.title}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="absolute inset-x-0 top-0 w-full object-cover object-top will-change-transform"
                          style={{
                            minHeight: '100%',
                            transform: 'translate3d(0, 0px, 0)',
                          }}
                          src={item.image}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Atmospheric Ambient Gradient Vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-25"
              style={{
                background:
                  'linear-gradient(180deg, rgba(18,20,23,0.1) 0%, rgba(18,20,23,0.2) 50%, rgba(18,20,23,0.8) 100%), linear-gradient(135deg, rgba(235,225,176,0.06) 0%, rgba(174,168,254,0.08) 100%)',
              }}
            />

            {/* Click to Jump to Project Hint on Hover */}
            <div className="absolute top-5 right-5 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[12px] font-medium text-white shadow-xl">
                <span>View case study</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2.5V9.5M6 9.5L9 6.5M6 9.5L3 6.5" />
                </svg>
              </span>
            </div>

            {/* Left Magnetic Navigation Arrow Button with Cursor Absorption */}
            <div className="absolute inset-y-0 left-0 flex items-center z-30 pointer-events-none">
              <MagneticNavButton
                onClick={handlePrev}
                direction="prev"
                ariaLabel="Previous work slide"
                size="lg"
              />
            </div>

            {/* Right Magnetic Navigation Arrow Button with Cursor Absorption */}
            <div className="absolute inset-y-0 right-0 flex items-center z-30 pointer-events-none">
              <MagneticNavButton
                onClick={handleNext}
                direction="next"
                ariaLabel="Next work slide"
                size="lg"
              />
            </div>

            {/* Bottom Floating Control Bar (Counter + Project Title + Dot Indicators) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/15 shadow-2xl">
              {/* Numeric Counter */}
              <span className="font-mono text-[12px] text-white/80 font-medium tabular-nums tracking-wider">
                0{currentIndex + 1} <span className="text-white/40">/</span> 0{totalSlides}
              </span>

              <div className="h-3 w-px bg-white/20" />

              {/* Current Project Name */}
              <span className="hidden sm:inline text-[13px] font-medium text-white/90">
                {slideshowItems[currentIndex]?.title}
              </span>

              <div className="hidden sm:block h-3 w-px bg-white/20" />

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {slideshowItems.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    data-cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      changeSlide(dotIdx)
                    }}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIdx === currentIndex
                        ? 'w-6 bg-white shadow-[0_0_8px_#ffffff]'
                        : 'w-1.5 bg-white/30 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  )
}
