import { useFX } from '../context/FXContext'

export default function FXShockwaveOverlay() {
  const { isWarping, shockwaveOrigin } = useFX()

  if (!isWarping || !shockwaveOrigin) return null

  const originX = shockwaveOrigin.x ?? window.innerWidth - 44
  const originY = shockwaveOrigin.y ?? window.innerHeight - 44

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9970] overflow-hidden select-none"
      style={{
        '--origin-x': `${originX}px`,
        '--origin-y': `${originY}px`,
      }}
    >
      {/* 1. Blackout Curtain Wave (Wipes to black, then peels away to reveal changed site) */}
      <div
        className="absolute inset-0 bg-[#0c0e12] will-change-[clip-path]"
        style={{
          animation: 'blackoutWipeAndReveal 1.3s cubic-bezier(0.2, 0.9, 0.25, 1) forwards',
        }}
      />

      {/* 2. Leading Chromatic Gradient Wavefront Ring */}
      <div
        className="absolute h-[320vmax] w-[320vmax] rounded-full will-change-transform"
        style={{
          left: `${originX}px`,
          top: `${originY}px`,
          transform: 'translate(-50%, -50%)',
          animation: 'chromaticRingPulse 1.3s cubic-bezier(0.2, 0.9, 0.25, 1) forwards',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '6px solid rgba(255, 255, 255, 0.9)',
            boxShadow: `
              0 0 50px 15px rgba(6, 182, 212, 0.95),
              0 0 100px 35px rgba(236, 72, 153, 0.9),
              0 0 160px 60px rgba(174, 168, 254, 0.8),
              inset 0 0 60px 20px rgba(252, 211, 77, 0.6)
            `,
          }}
        />
      </div>

      {/* 3. Ambient Button Origin Glow at Start */}
      <div
        className="absolute h-72 w-72 rounded-full will-change-transform"
        style={{
          left: `${originX}px`,
          top: `${originY}px`,
          transform: 'translate(-50%, -50%)',
          animation: 'originGlow 0.5s ease-out forwards',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(6, 182, 212, 0.6) 40%, rgba(236, 72, 153, 0.4) 70%, transparent 100%)',
        }}
      />
    </div>
  )
}
