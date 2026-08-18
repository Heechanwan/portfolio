import { useEffect, useRef } from 'react'
import ScrollReveal from './ScrollReveal'
import { useParallax } from '../hooks/useParallax'
import D20EasterEgg from './D20EasterEgg'

export default function Hero() {
  const { containerRef, innerRef } = useParallax(0.08)
  const heroRef = useRef(null)
  const portraitCardRef = useRef(null)
  const lensLayerRef = useRef(null)
  const lensRingRef = useRef(null)
  const transformTargetRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const portrait = portraitCardRef.current
    const lensLayer = lensLayerRef.current
    const lensRing = lensRingRef.current
    const transformTarget = transformTargetRef.current

    if (!hero || !portrait || !lensLayer || !lensRing || !transformTarget) return

    let rafHero = null
    let rafPortrait = null

    // 1. Zero-lag GPU parallax for portrait container
    const onHeroMouseMove = (e) => {
      if (rafHero) return
      rafHero = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window
        const x = (e.clientX / innerWidth - 0.5) * 12
        const y = (e.clientY / innerHeight - 0.5) * 12
        transformTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
        rafHero = null
      })
    }

    // 2. Zero-lag GPU Reveal Lens on portrait
    const onPortraitMouseMove = (e) => {
      if (rafPortrait) return
      rafPortrait = requestAnimationFrame(() => {
        const rect = portrait.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        lensLayer.style.clipPath = `circle(120px at ${x}px ${y}px)`
        lensRing.style.transform = `translate3d(${x - 120}px, ${y - 120}px, 0)`
        rafPortrait = null
      })
    }

    const onPortraitMouseEnter = () => {
      lensLayer.style.transition = 'none'
      lensRing.style.opacity = '1'
      lensRing.style.transform = 'scale(1)'
    }

    const onPortraitMouseLeave = () => {
      lensLayer.style.transition = 'clip-path 0.35s ease-out'
      lensLayer.style.clipPath = 'circle(0px at 50% 50%)'
      lensRing.style.opacity = '0'
    }

    hero.addEventListener('mousemove', onHeroMouseMove, { passive: true })
    portrait.addEventListener('mousemove', onPortraitMouseMove, { passive: true })
    portrait.addEventListener('mouseenter', onPortraitMouseEnter)
    portrait.addEventListener('mouseleave', onPortraitMouseLeave)

    return () => {
      hero.removeEventListener('mousemove', onHeroMouseMove)
      portrait.removeEventListener('mousemove', onPortraitMouseMove)
      portrait.removeEventListener('mouseenter', onPortraitMouseEnter)
      portrait.removeEventListener('mouseleave', onPortraitMouseLeave)
      if (rafHero) cancelAnimationFrame(rafHero)
      if (rafPortrait) cancelAnimationFrame(rafPortrait)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col justify-between px-5 pt-32 pb-16 md:px-10 md:pt-36 lg:pt-40 md:min-h-screen"
    >
      <div className="relative mx-auto flex w-full max-w-[89.5rem] flex-1 flex-col justify-between">
        {/* Top & Middle Grid */}
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-8">
          {/* Left Column: Headline & Bio */}
          <div className="md:col-span-7 lg:col-span-7 z-10">
            <ScrollReveal>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[12px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Senior Fullstack • 10+ Years Experience
              </div>

              <h1 className="font-sans font-bold leading-[1.05] tracking-[-0.035em] text-[clamp(38px,5vw,5.5rem)]">
                Kuldashev{' '}
                <span className="font-sans italic font-bold gradient-text underline decoration-[#AEA8FE] decoration-[0.12rem] underline-offset-[0.18em] pr-[0.12em] -mr-[0.12em]">
                  Anwar
                </span>
                .<br />
                <span className="text-[var(--color-text)]">Senior Fullstack Developer &<br /></span>
                <span className="text-[var(--color-text)]">Co-UX/UI Designer at Briktobrick.<br /></span>
                <span className="text-[var(--color-text-muted)] font-normal text-[clamp(22px,3vw,3.2rem)] leading-tight mt-2 block">
                  Turnkey web apps, cybersecurity & AI agents.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal className="mt-6 max-w-[44ch] flex flex-col gap-3">
              <p className="text-[15px] leading-[1.65] text-[var(--color-text-muted)]">
                Over a decade architecting full-stack solutions, custom WooCommerce/WordPress engines, and turnkey platforms. Specializing in AI agent workflows, Godot game dev, and mentoring the next generation of engineers at <span className="text-[var(--color-text)] font-medium">IMPACT Academy</span>.
              </p>
              <p className="text-[14px] leading-[1.6] text-[var(--color-text-muted)] border-l-2 border-[#AEA8FE]/40 pl-3.5 italic">
                Beyond code, I’m simply a cheerful, kind person who loves exploring new ideas, creating from scratch, and hosting tabletop <D20EasterEgg>DND</D20EasterEgg> adventures.
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Zero-Lag GPU Reveal Lens Portrait */}
          <div className="md:col-span-5 lg:col-span-5 md:flex md:justify-end z-10">
            <ScrollReveal className="w-full max-w-[24rem] sm:max-w-[28rem] md:max-w-[32rem] lg:max-w-[34rem]">
              <div
                ref={transformTargetRef}
                className="will-change-transform transition-transform duration-200 ease-out"
              >
                <div
                  ref={(el) => {
                    containerRef.current = el
                    portraitCardRef.current = el
                  }}
                  data-cursor="lens"
                  className="group relative cursor-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl select-none"
                  style={{
                    aspectRatio: '583 / 640',
                  }}
                >
                  {/* Accent glow backdrop */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(235,225,176,0.2) 0%, rgba(174,168,254,0.2) 100%)',
                    }}
                  />

                  <div className="relative h-full w-full overflow-hidden">
                    <div ref={innerRef} className="h-[110%] w-full -mt-[5%]">
                      {/* Layer 1: Base Black & White Photo */}
                      <img
                        alt="Kuldashev Anwar"
                        className="absolute inset-0 h-full w-full object-cover grayscale contrast-105"
                        src="/images/photo_bw.jpg"
                        decoding="async"
                        fetchPriority="high"
                      />

                      {/* Layer 2: Colored Photo Revealed Inside Circular Cursor Lens */}
                      <div
                        ref={lensLayerRef}
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden will-change-[clip-path]"
                        style={{
                          clipPath: 'circle(0px at 50% 50%)',
                        }}
                      >
                        <img
                          alt="Kuldashev Anwar Colored"
                          className="absolute inset-0 h-full w-full object-cover"
                          src="/images/photo_colored.jpg"
                          decoding="async"
                        />
                      </div>

                      {/* Interactive Lens Ring Border */}
                      <div
                        ref={lensRingRef}
                        className="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-[#AEA8FE] shadow-[0_0_20px_rgba(174,168,254,0.6)] opacity-0 will-change-transform transition-opacity duration-200"
                        style={{
                          width: 240,
                          height: 240,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: 'radial-gradient(140% 100% at 50% 60%, rgba(18,20,23,0) 40%, rgba(18,20,23,0.45) 100%)',
                    }}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Details Grid */}
        <ScrollReveal className="mt-16 pt-8 border-t border-[var(--color-border)] md:mt-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 text-[0.9375rem]">
            {[
              ['Experience', '10+ Years in IT'],
              ['Agency Role', 'Senior Fullstack @ Briktobrick'],
              ['Mentorship', 'IT Mentor @ IMPACT Academy'],
              ['Cybersecurity', 'API Hardening & Anti-Bot'],
              ['Game Dev & AI', 'Godot Engine & AI Agents'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[var(--color-text-muted)] text-[0.6875rem] uppercase tracking-[0.08em]">
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-[var(--color-text)] leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  )
}
