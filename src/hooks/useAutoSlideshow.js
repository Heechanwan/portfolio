import { useState, useEffect, useCallback, useRef } from 'react'

export function useAutoSlideshow(totalSlides, intervalMs = 4000) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef(Date.now())
  const rafRef = useRef(null)

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startTimeRef.current = Date.now() - progress * intervalMs

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(elapsed / intervalMs, 1)
      setProgress(p)

      if (p >= 1) {
        setCurrentIndex(prev => (prev + 1) % totalSlides)
        setProgress(0)
        startTimeRef.current = Date.now()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPaused, totalSlides, intervalMs])

  return { currentIndex, isPaused, progress, togglePause }
}
