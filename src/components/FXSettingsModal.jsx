import { useRef, useEffect } from 'react'
import { useFX } from '../context/FXContext'

export default function FXSettingsModal() {
  const {
    settings,
    toggleSetting,
    setPotatoMode,
    setUltraMode,
    isPotato,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useFX()

  const panelRef = useRef(null)

  // Click outside to close
  useEffect(() => {
    if (!isSettingsOpen) return

    const onClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsSettingsOpen(false)
      }
    }

    window.addEventListener('pointerdown', onClickOutside)
    return () => window.removeEventListener('pointerdown', onClickOutside)
  }, [isSettingsOpen, setIsSettingsOpen])

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-[9980] select-none">
      {/* Popover Settings Menu */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-label="Graphics and performance settings"
          className="absolute bottom-14 right-0 w-80 max-w-[calc(100vw-3rem)] animate-[fadeInUp_0.25s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl border border-white/15 bg-[#14161C]/95 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-400/20 to-purple-400/20 text-sm">
                ⚙️
              </span>
              <div>
                <h3 className="font-sans text-[14px] font-bold text-white leading-none">
                  Graphics & FX
                </h3>
                <span className="text-[11px] text-white/50">Performance & shader controls</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              aria-label="Close settings"
              data-cursor="pointer"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-xs text-white/60 hover:bg-white/15 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={setUltraMode}
              data-cursor="pointer"
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[12px] font-semibold transition-all ${
                !isPotato
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>⚡ Ultra (All FX)</span>
            </button>

            <button
              type="button"
              onClick={setPotatoMode}
              data-cursor="pointer"
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[12px] font-semibold transition-all ${
                isPotato
                  ? 'border-amber-400/50 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>🥔 Potato Mode</span>
            </button>
          </div>

          {/* Individual Toggle Switches */}
          <div className="mt-4 space-y-3">
            {[
              {
                id: 'webglBg',
                label: 'Background Fluid (WebGL)',
                desc: 'Dynamic fluid shader & light trails',
                checked: settings.webglBg,
              },
              {
                id: 'cardOrbs',
                label: 'Project Card Mesh Orbs',
                desc: 'Moving fluid color gradient orbs',
                checked: settings.cardOrbs,
              },
              {
                id: 'tilt3D',
                label: '3D Parallax Tilt',
                desc: 'Physical card tilt following cursor',
                checked: settings.tilt3D,
              },
            ].map((toggle) => (
              <label
                key={toggle.id}
                data-cursor="pointer"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.06] cursor-pointer"
              >
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-white/90 leading-tight">
                    {toggle.label}
                  </div>
                  <div className="text-[11px] text-white/40 leading-snug mt-0.5">
                    {toggle.desc}
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <input
                  type="checkbox"
                  checked={toggle.checked}
                  onChange={() => toggleSetting(toggle.id)}
                  className="sr-only"
                />
                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
                    toggle.checked ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-black shadow-md transition-transform duration-200 ease-in-out ${
                      toggle.checked ? 'translate-x-5 bg-white' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-3.5 text-center text-[10.5px] text-white/35">
            Disabling shaders unlocks 240 FPS potato speed 🏎️
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen((prev) => !prev)}
        aria-label="Open graphics and FX settings"
        data-cursor="pointer"
        className="group relative flex items-center gap-2 rounded-full border border-white/20 bg-[#121417]/90 px-3.5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/40 active:scale-95"
      >
        {/* Soft Ambient Radial Glow Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-full blur-md opacity-50 transition-opacity duration-300 group-hover:opacity-90 -z-10"
          style={{
            background: isPotato
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(239, 68, 68, 0.3) 60%, transparent 85%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.35) 60%, transparent 85%)',
          }}
        />

        <div className="relative flex items-center gap-2 z-10">
          <span className="text-[14px]">{isPotato ? '🥔' : '⚡'}</span>
          <span className="font-sans text-[12px] font-bold tracking-wider text-white uppercase">
            {isPotato ? 'Lite Mode' : 'FX Settings'}
          </span>
          <span
            className={`h-2 w-2 rounded-full ${
              isPotato ? 'bg-amber-400' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
            }`}
          />
        </div>
      </button>
    </div>
  )
}
