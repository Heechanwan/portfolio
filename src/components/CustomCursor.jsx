import { useState, useEffect, useRef } from 'react'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [cursorType, setCursorType] = useState('default') // 'default' | 'pointer' | 'link' | 'magnetic'
  const [isDown, setIsDown] = useState(false)
  const [isOut, setIsOut] = useState(false)

  const cursorRef = useRef(null)
  const arrowRef = useRef(null)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const currentAngleRef = useRef(0)

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
    const arrow = arrowRef.current
    if (!cursor) return

    let raf = null

    // Direct 1:1 hardware GPU cursor tracking (Pure translation, zero transform override)
    const onPointerMove = (e) => {
      const dx = e.clientX - lastPosRef.current.x
      const dy = e.clientY - lastPosRef.current.y
      const dist = Math.hypot(dx, dy)

      if (dist > 1.5) {
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI
        currentAngleRef.current = targetAngle
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY }

      if (raf) return
      raf = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
        if (arrow) {
          arrow.style.transform = `rotate(${currentAngleRef.current}deg)`
        }
        if (isOut) setIsOut(false)
        raf = null
      })
    }

    const onPointerDown = () => setIsDown(true)
    const onPointerUp = () => setIsDown(false)
    const onMouseLeave = () => setIsOut(true)
    const onMouseEnter = () => setIsOut(false)

    const onPointerOver = (e) => {
      const target = e.target
      if (!target) return

      // 1. Highest priority: Magnetic absorption zone (Slider buttons)
      if (target.closest('[data-cursor="magnetic"]')) {
        setCursorType('magnetic')
        return
      }

      // 2. Interactive Links / Project cards
      if (target.closest('[data-cursor="link"]')) {
        setCursorType('link')
        return
      }

      // 3. Regular buttons and small controls
      if (target.closest('[data-cursor="pointer"], button')) {
        setCursorType('pointer')
        return
      }

      // 4. Anchor links & figure cards
      if (target.closest('a, figure')) {
        setCursorType('link')
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
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled, isDown, isOut])

  if (!enabled) return null

  // Size mapping
  const size = cursorType === 'link' ? 96 : cursorType === 'pointer' ? 14 : 28
  const isMagnetic = cursorType === 'magnetic'
  const opacity = isOut ? 0 : isMagnetic ? 0 : cursorType === 'default' ? 0.35 : 1
  const scale = isMagnetic ? 0 : isDown ? 0.9 : 1

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
        willChange: 'transform, width, height',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Inner scaling node: Handles smooth, un-interrupted shrinking and fading */}
      <div
        className="flex h-full w-full items-center justify-center rounded-full border-[1.5px] border-white will-change-[transform,opacity]"
        style={{
          opacity: opacity,
          transform: `scale(${scale})`,
          backgroundColor: cursorType === 'link' || cursorType === 'pointer' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease, background-color 0.2s ease',
        }}
      >
        {/* Directional Velocity-Tracking Compass Arrow */}
        <div
          ref={arrowRef}
          className="flex h-1/2 w-1/2 items-center justify-center will-change-transform"
          style={{
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
            opacity: cursorType === 'link' ? 1 : 0,
            transform: `rotate(${currentAngleRef.current}deg) scale(${cursorType === 'link' ? 1 : 0.6})`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full fill-none stroke-black"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h15M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
