import { useState, useRef, useCallback, useEffect } from 'react'
import { useParallax } from '../hooks/useParallax'
import { useFX } from '../context/FXContext'
import MagneticNavButton from './MagneticNavButton'

export default function ProjectCard({ project }) {
  const { settings } = useFX()
  const { containerRef, innerRef } = useParallax(0.06)
  const cardRef = useRef(null)
  const innerCardRef = useRef(null)
  const activeImgRef = useRef(null)

  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const scrollPosRef = useRef(0)
  const targetSpeedRef = useRef(0)
  const currentSpeedRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const isHoveredRef = useRef(false)
  const rafIdRef = useRef(null)
  const isLoopRunningRef = useRef(false)
  const tiltRafRef = useRef(null)

  const allImages = project.hoverImages && project.hoverImages.length > 0
    ? [project.image, ...project.hoverImages]
    : [project.image]

  const hasMultipleImages = allImages.length > 1
  const isContain = project.fit === 'contain'
  const isAac = project.id === 'aac'

  // Reset scroll and re-measure when switching images
  const handlePrev = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    scrollPosRef.current = 0
    targetSpeedRef.current = 0
    currentSpeedRef.current = 0
    if (activeImgRef.current) activeImgRef.current.style.transform = 'translate3d(0, 0px, 0)'
    setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  const handleNext = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    scrollPosRef.current = 0
    targetSpeedRef.current = 0
    currentSpeedRef.current = 0
    if (activeImgRef.current) activeImgRef.current.style.transform = 'translate3d(0, 0px, 0)'
    setActiveImgIndex((prev) => (prev + 1) % allImages.length)
  }, [allImages.length])

  // Start physics loop only when needed (hovered or actively rewinding)
  const startLoopIfNeeded = useCallback(() => {
    if (isLoopRunningRef.current || isContain) return
    isLoopRunningRef.current = true
    lastTimeRef.current = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      const activeImg = activeImgRef.current
      const container = containerRef.current

      let shouldContinue = false

      if (activeImg && container) {
        const containerH = container.clientHeight
        const imgH = activeImg.clientHeight || activeImg.scrollHeight || 0
        const maxOverflow = Math.max(0, imgH - containerH)

        if (maxOverflow > 20) {
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
  }, [isContain, containerRef])

  // Interactive Cursor-Driven Physics, Fluid Ripple Tracking & Throttled 3D Tilt
  useEffect(() => {
    const card = cardRef.current
    const innerCard = innerCardRef.current
    if (!card || !innerCard) return

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100

      // Dynamic liquid light origin for fluid radial wave
      card.style.setProperty('--mouse-x', `${px.toFixed(1)}%`)
      card.style.setProperty('--mouse-y', `${py.toFixed(1)}%`)

      if (tiltRafRef.current) return
      tiltRafRef.current = requestAnimationFrame(() => {
        tiltRafRef.current = null
        const x = px / 100 - 0.5
        const y = py / 100 - 0.5

        // Optional 3D Tilt
        if (settings.tilt3D) {
          const rotX = (-y * 6).toFixed(2)
          const rotY = (x * 6).toFixed(2)
          innerCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`
        } else {
          innerCard.style.transform = 'none'
        }

        // Cursor-Driven Vertical Pan Physics
        const deviation = y // -0.5 to +0.5
        const deadZone = 0.08
        if (Math.abs(deviation) < deadZone) {
          targetSpeedRef.current = 0
        } else {
          const sign = Math.sign(deviation)
          const normalizedDev = (Math.abs(deviation) - deadZone) / (0.5 - deadZone)
          const intensity = Math.pow(normalizedDev, 1.6)
          const maxSpeed = 680
          targetSpeedRef.current = sign * intensity * maxSpeed
        }
      })
    }

    const onMouseEnter = (e) => {
      isHoveredRef.current = true
      setIsHovered(true)
      const rect = card.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--mouse-x', `${px.toFixed(1)}%`)
      card.style.setProperty('--mouse-y', `${py.toFixed(1)}%`)
      innerCard.style.transition = 'transform 0.12s ease-out'
      startLoopIfNeeded()
    }

    const onMouseLeave = () => {
      isHoveredRef.current = false
      setIsHovered(false)
      targetSpeedRef.current = 0
      innerCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      innerCard.style.transform = 'rotateX(0deg) rotateY(0deg)'
      startLoopIfNeeded() // Let it rewind smoothly to top
    }

    card.addEventListener('mousemove', onMouseMove, { passive: true })
    card.addEventListener('mouseenter', onMouseEnter)
    card.addEventListener('mouseleave', onMouseLeave)

    return () => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseenter', onMouseEnter)
      card.removeEventListener('mouseleave', onMouseLeave)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current)
      isLoopRunningRef.current = false
    }
  }, [startLoopIfNeeded, settings.tilt3D])

  const content = (
    <div
      ref={cardRef}
      data-cursor="eye"
      className="group relative select-none"
      style={{
        perspective: settings.tilt3D ? '1000px' : 'none',
      }}
    >
      <div
        ref={innerCardRef}
        className="will-change-transform"
        style={{
          transformStyle: settings.tilt3D ? 'preserve-3d' : 'flat',
        }}
      >
        {/* Media Frame Container */}
        <div className="relative" data-cursor="eye">
          {/* Dynamic Fluid Liquid Light Halo Expanding from Mouse Cursor Outward */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 sm:-inset-3 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl opacity-0 scale-90 transition-all duration-700 ease-out group-hover:opacity-90 group-hover:scale-100 -z-10 will-change-[opacity,transform]"
            style={{
              background: `
                radial-gradient(circle 380px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.78) 0%, rgba(236, 72, 153, 0.7) 40%, rgba(16, 185, 129, 0.6) 75%, transparent 100%),
                radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.5) 0%, transparent 60%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.5) 0%, transparent 60%)
              `,
            }}
          />

          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl transition-all duration-300 ease-out group-hover:border-white/30 z-10"
            style={{
              background: isAac
                ? 'linear-gradient(145deg, #151822 0%, #1e1b2f 50%, #16222c 100%)'
                : '#16181D',
            }}
          >
            {/* AAC Custom Ambient Glow */}
            {isAac && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background: 'radial-gradient(circle at 50% 30%, rgba(174,168,254,0.18) 0%, rgba(235,225,176,0.08) 50%, transparent 80%)',
                }}
              />
            )}

            <div
              ref={containerRef}
              className={`relative overflow-hidden aspect-[4/5] w-full ${
                isContain
                  ? 'flex items-center justify-center p-6 md:p-8 bg-[#16181D]'
                  : 'img-skeleton'
              }`}
            >
              <div ref={innerRef} className="relative h-[110%] w-full -mt-[5%]">
                {allImages.map((src, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                    style={{ opacity: i === activeImgIndex ? 1 : 0 }}
                  >
                    {isContain ? (
                      <img
                        alt={i === 0 ? project.title : ''}
                        aria-hidden={i !== activeImgIndex}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105"
                        src={src}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                        }}
                      />
                    ) : (
                      /* Long Image: Interactive Cursor-Driven Physics Scroll */
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          ref={i === activeImgIndex ? activeImgRef : null}
                          alt={i === 0 ? project.title : ''}
                          aria-hidden={i !== activeImgIndex}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-x-0 top-0 w-full object-cover object-top will-change-transform"
                          style={{
                            transform: 'translate3d(0, 0px, 0)',
                          }}
                          src={src}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive Liquid Gradient Overlay with Active Moving Fluid Mesh */}
            {!isContain && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden opacity-95 transition-opacity duration-700 ease-out group-hover:opacity-25"
              >
                {/* Continuous Vibrant Base Mesh */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.48) 0%, rgba(219, 39, 119, 0.52) 50%, rgba(16, 185, 129, 0.48) 100%)',
                  }}
                />

                {/* Liquid Ripple Spreading from Cursor point */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 will-change-opacity"
                  style={{
                    background: `radial-gradient(circle 420px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.45) 0%, rgba(219, 39, 119, 0.38) 45%, rgba(16, 185, 129, 0.25) 75%, transparent 100%)`,
                  }}
                />

                {settings.cardOrbs && (
                  <>
                    {/* Orb 1: Glowing Saturated Turquoise Fluid Light */}
                    <div
                      className="absolute -top-1/3 -left-1/3 h-[135%] w-[135%] rounded-full blur-[40px] will-change-transform"
                      style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.72) 0%, rgba(14, 165, 233, 0.36) 45%, transparent 75%)',
                        animation: 'fluidOrb1 10s ease-in-out infinite alternate',
                      }}
                    />

                    {/* Orb 2: Glowing Saturated Velvet Rose Pink Fluid Light */}
                    <div
                      className="absolute -bottom-1/3 -right-1/3 h-[135%] w-[135%] rounded-full blur-[45px] will-change-transform"
                      style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.75) 0%, rgba(219, 39, 119, 0.38) 45%, transparent 75%)',
                        animation: 'fluidOrb2 12s ease-in-out infinite alternate',
                      }}
                    />

                    {/* Orb 3: Glowing Saturated Mint Green Fluid Light */}
                    <div
                      className="absolute top-1/4 -right-1/3 h-[120%] w-[120%] rounded-full blur-[40px] will-change-transform"
                      style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.68) 0%, rgba(5, 150, 105, 0.32) 45%, transparent 75%)',
                        animation: 'fluidOrb3 11s ease-in-out infinite alternate',
                      }}
                    />
                  </>
                )}

                {/* Soft Dark Contrast Vignette */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(14,16,21,0.04) 0%, rgba(14,16,21,0.24) 50%, rgba(14,16,21,0.85) 100%)',
                  }}
                />
              </div>
            )}

            {/* Elastic Magnetic Left & Right Navigation Buttons with Full Cursor Absorption */}
            {hasMultipleImages && (
              <>
                {/* Left Magnetic Navigation Button */}
                <div className="absolute inset-y-0 left-0 flex items-center z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MagneticNavButton
                    onClick={handlePrev}
                    direction="prev"
                    ariaLabel="Previous image"
                    size="sm"
                  />
                </div>

                {/* Right Magnetic Navigation Button */}
                <div className="absolute inset-y-0 right-0 flex items-center z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MagneticNavButton
                    onClick={handleNext}
                    direction="next"
                    ariaLabel="Next image"
                    size="sm"
                  />
                </div>

                {/* Fluid Image Indicator Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {allImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      data-cursor="pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        scrollPosRef.current = 0
                        targetSpeedRef.current = 0
                        currentSpeedRef.current = 0
                        if (activeImgRef.current) activeImgRef.current.style.transform = 'translate3d(0, 0px, 0)'
                        setActiveImgIndex(dotIdx)
                      }}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        dotIdx === activeImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <figcaption className="mt-5" data-cursor="eye">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[19px] font-medium text-[var(--color-text)] flex items-center gap-2">
              {project.title}
              {project.badge && (
                <span className="text-[11px] font-sans uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full border border-[#AEA8FE]/40 bg-[#AEA8FE]/10 gradient-text">
                  {project.badge}
                </span>
              )}
            </span>
            <span className="shrink-0 whitespace-nowrap text-[14px] text-[var(--color-text-muted)] font-mono">
              {project.year}
            </span>
          </div>

          {project.category && (
            <span className="mt-0.5 block text-[12px] uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              {project.category}
            </span>
          )}

          <p className="mt-2 text-[14px] leading-[1.55] text-[var(--color-text-muted)]">
            {project.description}
          </p>

          {project.note && (
            <p className="mt-1 text-[11px] italic text-[var(--color-text-muted)] opacity-75">
              {project.note}
            </p>
          )}

          {project.link && (
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#AEA8FE] transition-transform duration-200 group-hover:translate-x-1">
              Visit project
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" />
              </svg>
            </span>
          )}
        </figcaption>
      </div>
    </div>
  )

  if (project.link) {
    return (
      <figure className="group">
        <a
          className="block"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="eye"
        >
          {content}
        </a>
      </figure>
    )
  }

  return (
    <figure className="group" data-cursor="eye">
      {content}
    </figure>
  )
}
