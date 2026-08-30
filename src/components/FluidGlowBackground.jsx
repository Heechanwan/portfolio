import { useEffect, useRef } from 'react'
import { useFX } from '../context/FXContext'

export default function FluidGlowBackground() {
  const { settings } = useFX()
  const containerRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    function init() {
      if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
        try {
          window.UnicornStudio.init()
        } catch (err) {
          console.warn('Unicorn Studio init fallback:', err)
        }
      }
    }

    if (window.UnicornStudio) {
      init()
    } else {
      const checkInterval = setInterval(() => {
        if (window.UnicornStudio) {
          clearInterval(checkInterval)
          init()
        }
      }, 50)

      return () => clearInterval(checkInterval)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden"
      style={{ background: 'var(--color-bg, #121417)' }}
    >
      {/* Lite Mode Static Clean Gradient (Visible when WebGL is toggled off) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: settings.webglBg ? 0 : 1,
          background: 'radial-gradient(ellipse at 80% 10%, rgba(174,168,254,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, rgba(6,182,212,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Unicorn Studio Interactive WebGL Fluid Scene (Hardware GPU Accelerated) */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full will-change-[opacity,transform] transition-opacity duration-500 ease-out"
        style={{
          opacity: settings.webglBg ? 1 : 0,
          visibility: settings.webglBg ? 'visible' : 'hidden',
          transform: 'translate3d(0, 0, 0)',
        }}
        data-us-project="e8rNGA3o1GVhPu54S5UR"
        data-us-dpi="1"
        data-us-scale="1"
      />
    </div>
  )
}
