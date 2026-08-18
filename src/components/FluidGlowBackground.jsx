import { useEffect, useRef } from 'react'

export default function FluidGlowBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let sceneInstance = null

    const base = import.meta.env.BASE_URL || '/'
    const jsonPath = `${base}scene.json`.replace('//', '/')
    const scriptSrc = `${base}unicornStudio.umd.js`.replace('//', '/')

    function initUnicorn() {
      if (!window.UnicornStudio || !containerRef.current || !isMounted) return

      try {
        window.UnicornStudio.addScene({
          element: containerRef.current,
          jsonFilePath: jsonPath,
          projectId: 'e8rNGA3o1GVhPu54S5UR',
          dpi: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1,
          scale: 1,
          fps: 60,
          lazyLoad: false,
          production: true,
        }).then((scene) => {
          if (!isMounted) {
            scene?.destroy?.()
            return
          }
          sceneInstance = scene
        }).catch((err) => {
          console.warn('Unicorn Studio scene fallback:', err)
        })
      } catch (e) {
        console.warn('Unicorn Studio init error:', e)
      }
    }

    if (window.UnicornStudio) {
      initUnicorn()
    } else {
      const script = document.createElement('script')
      script.src = scriptSrc
      script.async = true
      script.onload = () => {
        if (isMounted) initUnicorn()
      }
      document.body.appendChild(script)
    }

    return () => {
      isMounted = false
      if (sceneInstance) {
        try {
          sceneInstance.destroy?.()
        } catch (e) {}
      }
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden"
      style={{ background: 'var(--color-bg, #121417)' }}
    >
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        data-us-project="e8rNGA3o1GVhPu54S5UR"
        data-us-dpi="1.5"
        data-us-scale="1"
      />
    </div>
  )
}
