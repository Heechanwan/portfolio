import { useEffect, useRef } from 'react'

export function useParallax(speed = 0.12) {
  const ref = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const container = ref.current
    const inner = innerRef.current
    if (!container || !inner) return

    let isVisible = false
    let raf = null
    let ticking = false

    // Observer ensures we only compute parallax when in or near viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) onScroll()
      },
      { rootMargin: '100px 0px 100px 0px' }
    )

    observer.observe(container)

    const onScroll = () => {
      if (!isVisible || ticking) return
      ticking = true
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const windowH = window.innerHeight
        const progress = (windowH - rect.top) / (windowH + rect.height)
        const clampedProgress = Math.max(0, Math.min(1, progress))
        const offset = (clampedProgress - 0.5) * rect.height * speed
        inner.style.transform = `translate3d(0, ${offset}px, 0)`
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return { containerRef: ref, innerRef }
}
