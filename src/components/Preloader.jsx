import { useState, useEffect, useRef } from 'react'

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [phase, setPhase] = useState('loading') // 'loading' | 'dispersing' | 'split' | 'hidden'
  const hasFinishedRef = useRef(false)
  const letters = ['A', 'N', 'W', 'A', 'R']

  useEffect(() => {
    if (hasFinishedRef.current) return

    const duration = 2200
    const start = Date.now()
    let raf

    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(Math.round((elapsed / duration) * 100), 100)
      setPercent(p)

      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        // Step 2: Letters smoothly glide into the center of the 5 columns
        setTimeout(() => {
          setPhase('dispersing')

          // Step 3: Columns split and slide up revealing the website directly behind
          setTimeout(() => {
            setPhase('split')

            // Step 4: Complete permanently and unmount
            setTimeout(() => {
              hasFinishedRef.current = true
              setPhase('hidden')
              onComplete?.()
            }, 850)
          }, 850)
        }, 250)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  if (phase === 'hidden' || hasFinishedRef.current) return null

  const isDispersed = phase === 'dispersing' || phase === 'split'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none select-none"
    >
      {/* 5 Dark Column Strips with 1px Subpixel Overlap (Guaranteed 100% Seamless Monolith) */}
      <div className="absolute inset-0 flex pointer-events-none w-[101vw]">
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <div
            key={colIndex}
            className="relative h-full flex-1 will-change-transform"
            style={{
              backgroundColor: '#121417',
              marginRight: '-1px',
              minWidth: 'calc(20% + 1px)',
              transform: phase === 'split' ? 'translateY(-100%)' : 'translateY(0%)',
              transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${
                phase === 'split' ? colIndex * 0.06 : 0
              }s`,
            }}
          />
        ))}
      </div>

      {/* 5 Animated Letters with Generous Proportional Spacing & Smooth Dispersal */}
      <div className="absolute inset-0 pointer-events-none">
        {letters.map((letter, i) => {
          // Progressive letter fill from left to right:
          // Letter 0: 0% - 20%
          // Letter 1: 20% - 40%
          // Letter 2: 40% - 60%
          // Letter 3: 60% - 80%
          // Letter 4: 80% - 100%
          const letterStart = i * 20
          const letterProgress = Math.max(0, Math.min(1, (percent - letterStart) / 20))

          // Target X in dispersed mode:
          // Col 0: 10%, Col 1: 30%, Col 2: 50%, Col 3: 70%, Col 4: 90%
          const dispersedX = i * 20 + 10

          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center will-change-[left,transform]"
              style={{
                // In loading phase: perfectly spaced center layout with zero collision
                // In dispersed phase: smoothly glides to column centers (10%, 30%, 50%, 70%, 90%)
                left: isDispersed
                  ? `${dispersedX}%`
                  : `calc(50% + ${(i - 2) * 88}px)`,
                transform: `translate(-50%, -50%) ${
                  phase === 'split' ? 'translateY(-100vh)' : 'translateY(0)'
                }`,
                transition: `left 1.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${
                  phase === 'split' ? i * 0.06 : 0
                }s`,
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Layer 1: Dark Letter with Crisp White Outline */}
                <span
                  className="font-black leading-none select-none tracking-normal"
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: 'clamp(44px, 6.5vw, 84px)',
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(255, 255, 255, 0.32)',
                  }}
                >
                  {letter}
                </span>

                {/* Layer 2: Solid White Interior Fill from Left to Right (Strictly inside letter shape) */}
                <div
                  className="absolute inset-0 overflow-hidden flex items-center justify-center will-change-[clip-path]"
                  style={{
                    clipPath: `inset(0 ${100 - letterProgress * 100}% 0 0)`,
                    transition: 'clip-path 0.05s linear',
                  }}
                >
                  <span
                    className="font-black leading-none select-none tracking-normal text-white"
                    style={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 'clamp(44px, 6.5vw, 84px)',
                      WebkitTextStroke: '2px #ffffff',
                    }}
                  >
                    {letter}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Live Percent Counter in Bottom Right */}
      <div
        className="pointer-events-none absolute bottom-8 right-8 md:bottom-12 md:right-12 font-serif font-light leading-none tracking-tight text-white/90 tabular-nums"
        style={{
          fontSize: 'clamp(22px, 2.8vw, 40px)',
          opacity: isDispersed ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        <span className="text-white/40 text-[0.6em] mr-2 font-sans uppercase tracking-[0.12em]">Loading</span>
        {percent}%
      </div>
    </div>
  )
}
