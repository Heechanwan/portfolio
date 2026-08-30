import { useEffect } from 'react'
import { useFX } from '../context/FXContext'

export default function CalculatorToast() {
  const { toastMessage, dismissToast } = useFX()

  useEffect(() => {
    if (!toastMessage) return

    const timer = setTimeout(() => {
      dismissToast()
    }, 6000)

    return () => clearTimeout(timer)
  }, [toastMessage, dismissToast])

  if (!toastMessage) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-6 z-[9990] max-w-[22rem] sm:max-w-sm animate-[fadeInUp_0.35s_cubic-bezier(0.16,1,0.3,1)] select-none"
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-[#15181F]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl"
        />

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-xl shadow-inner">
            📟
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5 font-sans text-[13px] font-bold tracking-wide text-amber-300">
              <span>TURBO LITE MODE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-white/90">
              {toastMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            data-cursor="pointer"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Timer Shrink Bar */}
        <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400"
            style={{
              animation: 'shrinkWidth 6s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  )
}
