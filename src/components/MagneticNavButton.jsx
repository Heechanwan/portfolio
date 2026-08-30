import { useState, useRef } from 'react'

/**
 * Elastic Magnetic Navigation Button that absorbs the cursor
 * and moves slightly with mouse velocity within its magnetic field.
 */
export default function MagneticNavButton({
  onClick,
  direction = 'prev',
  ariaLabel,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const containerRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const onMouseMove = (e) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY

    // Fluid magnetic elasticity
    const multiplier = size === 'sm' ? 0.42 : 0.55
    setOffset({
      x: dx * multiplier,
      y: dy * multiplier,
    })
  }

  const onMouseEnter = () => {
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    setIsHovered(false)
    setOffset({ x: 0, y: 0 })
  }

  const isSmall = size === 'sm'
  const btnClasses = isSmall
    ? 'h-11 w-11 rounded-full'
    : 'h-14 w-14 md:h-16 md:w-16 rounded-full'

  const containerPadding = isSmall
    ? 'p-4 md:p-6'
    : 'p-10 md:p-14'

  return (
    <div
      ref={containerRef}
      data-cursor="magnetic"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`relative ${containerPadding} flex items-center justify-center pointer-events-auto select-none cursor-pointer`}
    >
      {/* Master Moving Target Container (Moves button + aura together as one inseparable unit) */}
      <div
        data-cursor="magnetic"
        className="relative flex items-center justify-center will-change-transform"
        style={{
          transform: isHovered
            ? `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0) scale(${isSmall ? 1.18 : 1.25})`
            : 'translate3d(0, 0, 0) scale(1)',
          transition: isHovered
            ? 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Attached Rotating Pastel Gradient Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2.5 rounded-full blur-md transition-opacity duration-300 will-change-transform"
          style={{
            opacity: isHovered ? 0.95 : 0,
            background: 'conic-gradient(from 0deg, #FCD34D, #AEA8FE, #F472B6, #818CF8, #FCD34D)',
            animation: isHovered ? 'borderRotate 2.4s linear infinite' : 'none',
          }}
        />

        {/* Main Magnetic Button */}
        <button
          type="button"
          aria-label={ariaLabel || (direction === 'prev' ? 'Previous slide' : 'Next slide')}
          className={`relative ${btnClasses} border border-white/30 bg-black/75 backdrop-blur-xl flex items-center justify-center text-white will-change-transform active:scale-95 z-10 shadow-2xl`}
          style={{
            transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
            borderColor: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.25)',
            backgroundColor: isHovered ? '#ffffff' : 'rgba(18, 20, 23, 0.85)',
            color: isHovered ? '#000000' : '#ffffff',
            boxShadow: isHovered
              ? '0 0 30px rgba(174,168,254,0.8), 0 0 50px rgba(252,211,77,0.45), inset 0 0 10px rgba(255,255,255,0.6)'
              : '0 10px 25px rgba(0,0,0,0.85)',
          }}
        >
          {direction === 'prev' ? (
            <svg
              width={isSmall ? '18' : '22'}
              height={isSmall ? '18' : '22'}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.5 15L7.5 10L12.5 5" />
            </svg>
          ) : (
            <svg
              width={isSmall ? '18' : '22'}
              height={isSmall ? '18' : '22'}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 5L12.5 10L7.5 15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
