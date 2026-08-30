import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const FXContext = createContext(null)

const STORAGE_KEY = 'portfolio_fx_enabled_v3'

export function FXProvider({ children }) {
  const [fxEnabled, setFxEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null) return JSON.parse(saved)
    } catch (e) {}
    return true
  })

  const [shockwaveOrigin, setShockwaveOrigin] = useState(null)
  const [isWarping, setIsWarping] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fxEnabled))
    } catch (e) {}
  }, [fxEnabled])

  const toggleFX = useCallback((origin = null) => {
    // Determine shockwave origin point (default bottom-right)
    const originPoint = origin || {
      x: window.innerWidth - 44,
      y: window.innerHeight - 44,
    }

    setShockwaveOrigin(originPoint)
    setIsWarping(true)

    // Switch state at the peak of blackout (520ms)
    setTimeout(() => {
      setFxEnabled((prev) => !prev)
    }, 520)

    // Complete the full wave cycle (wipe in to black + peel back out)
    setTimeout(() => {
      setIsWarping(false)
      setShockwaveOrigin(null)
    }, 1300)
  }, [])

  const settings = {
    webglBg: fxEnabled,
    cardOrbs: fxEnabled,
    tilt3D: fxEnabled,
  }

  return (
    <FXContext.Provider
      value={{
        fxEnabled,
        toggleFX,
        settings,
        isWarping,
        shockwaveOrigin,
      }}
    >
      {children}
    </FXContext.Provider>
  )
}

export function useFX() {
  const context = useContext(FXContext)
  if (!context) {
    throw new Error('useFX must be used within FXProvider')
  }
  return context
}
