import { useState, useEffect, useRef } from 'react'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [cursorType, setCursorType] = useState('default') // 'default' | 'pointer' | 'eye' | 'link' | 'magnetic' | 'prev' | 'next'
  const [isDown, setIsDown] = useState(false)
  const [isOut, setIsOut] = useState(false)

  const cursorRef = useRef(null)
  const pupilRef = useRef(null)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const pupilPosRef = useRef({ x: 0, y: 0 })
  const targetPupilRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onMediaChange = () => setEnabled(media.matches)
    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => media.removeEventListener('change', onMediaChange)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    if (!cursor) return

    // Direct 1:1 hardware GPU cursor tracking - 0ms latency
    const onPointerMove = (e) => {
      // Instant direct translation for zero lag at native 144Hz/240Hz/120Hz
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      if (isOut) setIsOut(false)

      const isFirst = lastPosRef.current.x === 0 && lastPosRef.current.y === 0
      const dx = isFirst ? 0 : e.clientX - lastPosRef.current.x
      const dy = isFirst ? 0 : e.clientY - lastPosRef.current.y
      const dist = Math.hypot(dx, dy)

      if (dist > 0.4) {
        const maxRx = 11
        const maxRy = 6.5
        const angle = Math.atan2(dy, dx)
        const intensity = Math.min(dist / 4.5, 1)

        targetPupilRef.current = {
          x: Math.cos(angle) * maxRx * intensity,
          y: Math.sin(angle) * maxRy * intensity,
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY }

      // Smooth pupil follow
      const pupilEl = pupilRef.current
      if (pupilEl) {
        pupilPosRef.current.x += (targetPupilRef.current.x - pupilPosRef.current.x) * 0.35
        pupilPosRef.current.y += (targetPupilRef.current.y - pupilPosRef.current.y) * 0.35
        pupilEl.style.transform = `translate3d(${pupilPosRef.current.x.toFixed(2)}px, ${pupilPosRef.current.y.toFixed(2)}px, 0)`
        targetPupilRef.current.x *= 0.88
        targetPupilRef.current.y *= 0.88
      }
    }

    const onPointerDown = () => setIsDown(true)
    const onPointerUp = () => setIsDown(false)
    const onMouseLeave = () => {
      setIsOut(true)
      lastPosRef.current = { x: 0, y: 0 }
    }
    const onMouseEnter = (e) => {
      setIsOut(false)
      lastPosRef.current = { x: e.clientX, y: e.clientY }
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }

    const onPointerOver = (e) => {
      const target = e.target
      if (!target) return

      // 1. Highest priority: Magnetic absorption zone (Slider & Card buttons)
      if (target.closest('[data-cursor="magnetic"]')) {
        setCursorType('magnetic')
        return
      }

      // 2. Directional arrow zones
      if (target.closest('[data-cursor="prev"]')) {
        setCursorType('prev')
        return
      }

      if (target.closest('[data-cursor="next"]')) {
        setCursorType('next')
        return
      }

      // 3. Project cards & eye inspection zones
      if (target.closest('[data-cursor="eye"], [data-cursor="link"], figure')) {
        setCursorType('eye')
        return
      }

      // 4. Regular buttons and interactive controls
      if (target.closest('[data-cursor="pointer"], button')) {
        setCursorType('pointer')
        return
      }

      // 5. Links
      if (target.closest('a')) {
        setCursorType('eye')
        return
      }

      setCursorType('default')
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointerover', onPointerOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.documentElement.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [enabled, isDown, isOut])

  if (!enabled) return null

  const isNavBtn = cursorType === 'prev' || cursorType === 'next'
  const isEye = cursorType === 'eye'
  const isMagnetic = cursorType === 'magnetic'

  // Size mapping
  const size = isNavBtn ? 56 : isEye ? 80 : cursorType === 'pointer' ? 14 : 28
  const opacity = isOut ? 0 : isMagnetic ? 0 : cursorType === 'default' ? 0.35 : 1
  const scale = isMagnetic ? 0 : 1

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform ${
        isNavBtn || isEye ? '' : 'mix-blend-difference'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 1. Directional Nav Button Mode (Left / Right with Rotating Pastel Aura) */}
      {isNavBtn ? (
        <div
          className="relative flex h-full w-full items-center justify-center will-change-transform select-none"
          style={{
            transform: isDown ? 'scale(0.92)' : 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Rotating Pastel Gradient Aura around Cursor Button */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2.5 rounded-full blur-md"
            style={{
              background: 'conic-gradient(from 0deg, #FCD34D, #AEA8FE, #F472B6, #818CF8, #FCD34D)',
              animation: 'borderRotate 2.4s linear infinite',
            }}
          />

          {/* Main Button Body */}
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/40 bg-black/90 shadow-[0_0_25px_rgba(174,168,254,0.6)] text-white backdrop-blur-md">
            {cursorType === 'prev' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6L15 12L9 18" />
              </svg>
            )}
          </div>
        </div>
      ) : isEye ? (
        /* 2. Interactive Clean Eye Mode on Project Cards with Pupil Tracking and Blink on Click */
        <div
          className="relative flex h-full w-full items-center justify-center will-change-[transform,opacity] select-none"
          style={{
            transform: isDown ? 'scale(0.94)' : 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Soft Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-full blur-lg opacity-50"
            style={{
              background: 'radial-gradient(circle, rgba(174,168,254,0.4) 0%, rgba(6,182,212,0.25) 50%, transparent 75%)',
            }}
          />

          {/* Outer Eyeball Frame */}
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/35 bg-black/85 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
            {/* Eyelid Morph / Realistic Blink Animation Container */}
            <div
              className="relative flex items-center justify-center will-change-transform"
              style={{
                transform: isDown ? 'scaleY(0.06)' : 'scaleY(1)',
                transition: isDown
                  ? 'transform 0.08s cubic-bezier(0.4, 0, 1, 1)'
                  : 'transform 0.2s cubic-bezier(0, 0, 0.2, 1)',
                transformOrigin: 'center',
              }}
            >
              {/* Clean Sclera Eyelid Outline */}
              <svg width="44" height="28" viewBox="0 0 44 28" fill="none" className="overflow-visible">
                <path
                  d="M2 14C8 5 15.5 1 22 1C28.5 1 36 5 42 14C36 23 28.5 27 22 27C15.5 27 8 23 2 14Z"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2"
                  fill="rgba(255, 255, 255, 0.12)"
                />
              </svg>

              {/* Single Clear Dark Pupil that visibly tracks mouse movement */}
              <div
                ref={pupilRef}
                className="pointer-events-none absolute h-4 w-4 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] will-change-transform flex items-center justify-center"
                style={{
                  top: 'calc(50% - 8px)',
                  left: 'calc(50% - 8px)',
                }}
              >
                {/* Deep Dark Center Pupil */}
                <div className="h-2.5 w-2.5 rounded-full bg-[#121417] flex items-center justify-center relative">
                  {/* Tiny light reflection */}
                  <div className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Standard / Pointer Ring Cursor Mode */
        <div
          className="flex h-full w-full items-center justify-center rounded-full border-[1.5px] border-white will-change-[transform,opacity]"
          style={{
            opacity: opacity,
            transform: isDown ? 'scale(0.88)' : `scale(${scale})`,
            backgroundColor: cursorType === 'pointer' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, background-color 0.2s ease',
          }}
        />
      )}
    </div>
  )
}
