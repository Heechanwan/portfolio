import { useState, useRef, useEffect, useCallback } from 'react'
import { useParallax } from '../hooks/useParallax'
import { slideshowItems } from '../data/projects'
import ScrollReveal from './ScrollReveal'

// Elastic Magnetic Navigation Button that absorbs the cursor with tightly bound pastel gradient aura
function MagneticNavButton({ onClick, direction = 'prev', ariaLabel }) {
  const containerRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const onMouseMove = (e) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY

    // Generous, fluid magnetic elasticity
    setOffset({
      x: dx * 0.55,
      y: dy * 0.55,
    })
  }

  const onMouseEnter = () => {
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    setIsHovered(false)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      data-cursor="magnetic"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative p-12 md:p-16 flex items-center justify-center pointer-events-auto select-none"
    >
      {/* Master Moving Target Container (Moves button + aura together as one inseparable unit) */}
      <div
        data-cursor="magnetic"
        className="relative flex items-center justify-center will-change-transform"
        style={{
          transform: isHovered
            ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.26)`
            : 'translate3d(0, 0, 0) scale(1)',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Strictly Attached Rotating Pastel Gradient Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-full blur-md transition-opacity duration-300 will-change-transform"
          style={{
            opacity: isHovered ? 0.95 : 0,
            background: 'conic-gradient(from 0deg, #FCD34D, #AEA8FE, #F472B6, #818CF8, #FCD34D)',
            animation: isHovered ? 'borderRotate 2.4s linear infinite' : 'none',
          }}
        />

        {/* Main Magnetic Button */}
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className="relative h-14 w-14 md:h-16 md:w-16 rounded-full border border-white/30 bg-black/75 backdrop-blur-xl flex items-center justify-center text-white will-change-transform active:scale-95 z-10"
          style={{
            transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
            borderColor: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.25)',
            backgroundColor: isHovered ? '#ffffff' : 'rgba(18, 20, 23, 0.75)',
            color: isHovered ? '#000000' : '#ffffff',
            boxShadow: isHovered
              ? '0 0 35px rgba(174,168,254,0.75), 0 0 60px rgba(252,211,77,0.45), inset 0 0 15px rgba(255,255,255,0.6)'
              : '0 10px 30px rgba(0,0,0,0.85)',
          }}
        >
          {direction === 'prev' ? (
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.5 15L7.5 10L12.5 5" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 5L12.5 10L7.5 15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalSlides = slideshowItems.length

  const figureRef = useRef(null)
  const imgRefs = useRef([])
  const scrollPosRef = useRef(0)
  const targetSpeedRef = useRef(0)
  const currentSpeedRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafIdRef = useRef(null)

  const { containerRef, innerRef } = useParallax(0.08)

  // Interactive Cursor-Driven Physics Loop (Velocity increases towards top/bottom edges, slows in center)
  useEffect(() => {
    const figure = figureRef.current
    if (!figure) return

    const onMouseMove = (e) => {
      const rect = figure.getBoundingClientRect()
      const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      const deviation = relY - 0.5

      const deadZone = 0.08
      if (Math.abs(deviation) < deadZone) {
        targetSpeedRef.current = 0
      } else {
        const sign = Math.sign(deviation)
        const normalizedDev = (Math.abs(deviation) - deadZone) / (0.5 - deadZone)
        const intensity = Math.pow(normalizedDev, 1.7)
        const maxSpeed = 750
        targetSpeedRef.current = sign * intensity * maxSpeed
      }
    }

    const onMouseLeave = () => {
      targetSpeedRef.current = 0
    }

    figure.addEventListener('mousemove', onMouseMove, { passive: true })
    figure.addEventListener('mouseleave', onMouseLeave)

    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.12

      if (Math.abs(currentSpeedRef.current) > 0.5 || Math.abs(targetSpeedRef.current) > 0.5) {
        const activeImg = imgRefs.current[currentIndex]
        const container = containerRef.current

        if (activeImg && container) {
          const containerH = container.clientHeight
          const imgH = activeImg.clientHeight || activeImg.scrollHeight || 0
          const maxOverflow = Math.max(0, imgH - containerH)

          if (maxOverflow > 20) {
            scrollPosRef.current = Math.max(
              0,
              Math.min(maxOverflow, scrollPosRef.current + currentSpeedRef.current * dt)
            )
            activeImg.style.transform = `translate3d(0, -${scrollPosRef.current}px, 0)`
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    lastTimeRef.current = performance.now()
    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      figure.removeEventListener('mousemove', onMouseMove)
      figure.removeEventListener('mouseleave', onMouseLeave)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [currentIndex, containerRef])

  // Reset scroll position on slide change
  const changeSlide = useCallback((newIndex) => {
    scrollPosRef.current = 0
    targetSpeedRef.current = 0
    currentSpeedRef.current = 0

    if (imgRefs.current[newIndex]) {
      imgRefs.current[newIndex].style.transform = 'translate3d(0, 0px, 0)'
    }

    setCurrentIndex(newIndex)
  }, [])

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
    if (e.target.closest('button') || e.target.closest('.pointer-events-auto')) return
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
            data-cursor="link"
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#16181D] shadow-[0_25px_60px_rgba(0,0,0,0.85)] cursor-pointer"
          >
            {/* Main Image Showcase Viewport */}
            <div
              ref={containerRef}
              className="relative overflow-hidden aspect-[4/5] w-full md:aspect-[16/9] bg-[#14161A]"
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
              className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-25"
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

            {/* Left Magnetic Navigation Arrow Button with Expanded Trigger Zone */}
            <div className="absolute inset-y-0 left-0 flex items-center z-30 pointer-events-none">
              <MagneticNavButton
                onClick={handlePrev}
                direction="prev"
                ariaLabel="Previous work slide"
              />
            </div>

            {/* Right Magnetic Navigation Arrow Button with Expanded Trigger Zone */}
            <div className="absolute inset-y-0 right-0 flex items-center z-30 pointer-events-none">
              <MagneticNavButton
                onClick={handleNext}
                direction="next"
                ariaLabel="Next work slide"
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
                        ? 'w-5 bg-white'
                        : 'w-1.5 bg-white/40 hover:bg-white/80'
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
