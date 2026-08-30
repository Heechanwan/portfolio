import { useState, useRef } from 'react'
import { useFX } from '../context/FXContext'

export default function FXToggleButton() {
  const { fxEnabled, toggleFX, isWarping } = useFX()
  const btnRef = useRef(null)
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = (e) => {
    const btn = btnRef.current
    let origin = null

    if (btn) {
      const rect = btn.getBoundingClientRect()
      origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }

    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 220)

    toggleFX(origin)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9980] select-none group">
      {/* Floating Tooltip / Label on Hover */}
      <div
        className="pointer-events-none absolute bottom-full right-0 mb-2.5 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap"
      >
        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#121417]/95 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 shadow-xl backdrop-blur-md">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              fxEnabled ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-white/40'
            }`}
          />
          <span>{fxEnabled ? 'FX: Active (Click to disable)' : 'FX: Off (Click to enable)'}</span>
        </div>
      </div>

      {/* Main FX Toggle Icon Button */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        aria-label={fxEnabled ? 'Disable visual effects' : 'Enable visual effects'}
        data-cursor="pointer"
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#121417]/90 text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-85"
        style={{
          transform: isPressed ? 'scale(0.82)' : undefined,
          borderColor: fxEnabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Luminous Ambient Glow (Active when FX is on) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 rounded-full blur-md transition-opacity duration-500 -z-10"
          style={{
            opacity: fxEnabled ? 0.75 : 0,
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(236, 72, 153, 0.6) 50%, rgba(174, 168, 254, 0.4) 80%, transparent 100%)',
          }}
        />

        {/* Icon: Magic Sparkles / Aperture Wave */}
        <div className="relative flex items-center justify-center will-change-transform">
          {fxEnabled ? (
            /* Active FX Sparkle Icon */
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white drop-shadow-[0_0_8px_rgba(174,168,254,0.9)]"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="3" fill="#AEA8FE" stroke="none" />
            </svg>
          ) : (
            /* Disabled / Lite Mode Eye/Sparkle Off Icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/40"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" />
            </svg>
          )}
        </div>
      </button>
    </div>
  )
}
