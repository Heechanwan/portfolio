import { useState, useEffect, useRef } from 'react'

export default function D20EasterEgg({ children }) {
  const [isRolling, setIsRolling] = useState(false)
  const [rollResult, setRollResult] = useState(null)
  const [displayNumber, setDisplayNumber] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const intervalRef = useRef(null)

  const rollD20 = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (intervalRef.current) clearInterval(intervalRef.current)

    setIsClosing(false)
    setShowModal(true)
    setIsRolling(true)
    setRollResult(null)

    // Rapid pulsing number flicker (every 45ms)
    intervalRef.current = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 20) + 1)
    }, 45)

    // Settle on final number after 800ms
    setTimeout(() => {
      clearInterval(intervalRef.current)
      const rolled = Math.floor(Math.random() * 20) + 1
      setDisplayNumber(rolled)
      setRollResult(rolled)
      setIsRolling(false)
    }, 800)
  }

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
      setRollResult(null)
      setIsRolling(false)
    }, 320)
  }

  const isNat20 = rollResult === 20

  const getFlavorText = (val) => {
    if (val === 20) return { title: '👑 NATURAL 20! 👑', desc: 'CRITICAL HIT! A legendary artifact of pure perfection is born!', color: 'text-amber-300 font-black' }
    if (val === 1) return { title: 'NATURAL 1! 💀', desc: 'Critical Fumble! Your d20 tumbled off the table into the abyss.', color: 'text-red-400 font-bold' }
    if (val >= 16) return { title: `ROLLED ${val}! ✨`, desc: 'Great Success! +5 modifier to Inspiration, Design & Architecture.', color: 'text-emerald-300 font-bold' }
    if (val >= 10) return { title: `ROLLED ${val}! ⚔️`, desc: 'Solid turn! Campaign encounter cleared with style.', color: 'text-[#AEA8FE] font-medium' }
    return { title: `ROLLED ${val}! 🛡️`, desc: 'Saving throw passed. Ready for the next adventure.', color: 'text-[#EBE1B0]' }
  }

  return (
    <>
      {/* Interactive Trigger Word (No displacement on hover) */}
      <span
        onClick={rollD20}
        data-cursor="pointer"
        className="group/dnd relative inline-flex items-center gap-1.5 font-semibold text-[var(--color-text)] underline decoration-[#AEA8FE] decoration-[0.12rem] underline-offset-[0.2em] transition-colors duration-200 hover:text-[#AEA8FE] hover:decoration-amber-300 cursor-pointer select-none"
        title="Click to roll the 20-sided DND die!"
      >
        {children || 'DND'}
        <span className="inline-block text-[0.9em] opacity-80 group-hover/dnd:opacity-100 transition-opacity duration-200">
          🎲
        </span>
      </span>

      {/* Floating 3D d20 Dice Modal with Smooth Spring Entrance & Exit */}
      {showModal && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-lg select-none"
          style={{
            opacity: isClosing ? 0 : 1,
            transition: 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Modal Container with Smooth Scale & Blur Transition */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative p-[2px] rounded-3xl overflow-hidden w-[360px] max-w-[92vw] shadow-[0_30px_90px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out ${
              isNat20 ? 'shadow-[0_0_80px_rgba(251,191,36,0.6)]' : ''
            }`}
            style={{
              transform: isClosing ? 'scale(0.9) translateY(12px)' : 'scale(1) translateY(0)',
              filter: isClosing ? 'blur(6px)' : 'blur(0px)',
              opacity: isClosing ? 0 : 1,
              transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease, filter 0.32s ease, box-shadow 0.6s ease',
            }}
          >
            {/* Legendary Conic Light Laser Beam Running Around Perimeter on Nat 20 */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-[150%] transition-opacity duration-700 ${
                isNat20 ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #f59e0b 330deg, #fde047 360deg)',
                animation: 'borderRotate 2s linear infinite',
              }}
            />

            {/* Standard Border Frame */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 rounded-3xl border transition-colors duration-700 ${
                isNat20 ? 'border-amber-400/50' : 'border-white/20'
              }`}
            />

            {/* Modal Card Body with Fixed Stable Dimensions (No Layout Jumps) */}
            <div
              className="relative flex flex-col items-center justify-between p-8 rounded-3xl bg-[#13151b] text-center overflow-hidden min-h-[390px] transition-all duration-700 ease-out"
              style={{
                boxShadow: isNat20 ? 'inset 0 0 50px rgba(251,191,36,0.35)' : 'none',
              }}
            >
              {/* Radiant Background Aura */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
                style={{
                  background: isNat20
                    ? 'radial-gradient(circle at 50% 35%, rgba(251,191,36,0.4) 0%, rgba(245,158,11,0.2) 45%, transparent 75%)'
                    : 'radial-gradient(circle at 50% 35%, rgba(174,168,254,0.2) 0%, rgba(235,225,176,0.08) 50%, transparent 75%)',
                }}
              />

              {/* D20 Icosahedron Graphic */}
              <div className="relative mt-2 h-32 w-32 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className={`h-full w-full transition-all duration-500 ${
                    isNat20
                      ? 'drop-shadow-[0_0_35px_rgba(251,191,36,0.9)]'
                      : 'drop-shadow-[0_0_20px_rgba(174,168,254,0.6)]'
                  }`}
                >
                  {/* Outer Polygon */}
                  <polygon
                    points="50,5 92,28 92,72 50,95 8,72 8,28"
                    fill="#1b1e26"
                    stroke={isNat20 ? '#fbbf24' : '#AEA8FE'}
                    strokeWidth={isNat20 ? '3.5' : '2.5'}
                    className="transition-colors duration-500"
                  />
                  {/* Facet Lines */}
                  <line x1="50" y1="5" x2="50" y2="95" stroke={isNat20 ? '#fbbf24' : '#AEA8FE'} strokeWidth="1.2" opacity="0.4" className="transition-colors duration-500" />
                  <line x1="8" y1="28" x2="92" y2="28" stroke={isNat20 ? '#fbbf24' : '#AEA8FE'} strokeWidth="1.2" opacity="0.4" className="transition-colors duration-500" />
                  <line x1="8" y1="72" x2="92" y2="72" stroke={isNat20 ? '#fbbf24' : '#AEA8FE'} strokeWidth="1.2" opacity="0.4" className="transition-colors duration-500" />
                  <polygon
                    points="50,22 78,68 22,68"
                    fill={isNat20 ? 'rgba(251,191,36,0.35)' : 'rgba(174,168,254,0.18)'}
                    stroke={isNat20 ? '#fde047' : '#AEA8FE'}
                    strokeWidth={isNat20 ? '2.5' : '2'}
                    className="transition-colors duration-500"
                  />
                </svg>

                {/* Pulsing Number in Center */}
                <div className="absolute inset-0 flex items-center justify-center pt-2">
                  <span
                    className={`font-mono text-3xl md:text-4xl font-black tracking-tight leading-none transition-transform duration-75 ${
                      isRolling ? 'scale-110 text-white animate-pulse' : ''
                    } ${
                      isNat20
                        ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,1)] scale-115'
                        : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                    }`}
                  >
                    {displayNumber}
                  </span>
                </div>
              </div>

              {/* Stable Reserved Height Text Container (Zero Layout Jumps) */}
              <div className="my-3 min-h-[96px] w-full flex flex-col items-center justify-center">
                {!isRolling && rollResult && (
                  <div
                    className="flex flex-col items-center gap-1.5"
                    style={{
                      animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <h3 className={`font-serif text-2xl tracking-wide ${getFlavorText(rollResult).color}`}>
                      {getFlavorText(rollResult).title}
                    </h3>
                    <p className="text-[14px] leading-snug text-white/80 max-w-[28ch]">
                      {getFlavorText(rollResult).desc}
                    </p>
                  </div>
                )}

                {isRolling && (
                  <p className="font-serif text-lg text-white/60 animate-pulse">
                    Rolling d20 die...
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={rollD20}
                  className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 active:scale-95 ${
                    isNat20
                      ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                      : 'border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  Roll again 🎲
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-white/10 px-4 py-2 text-[13px] text-white/50 transition-all hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
