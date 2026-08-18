import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { label: 'Works', href: '#works' },
    { label: 'Services', href: '#services' },
    { label: 'Experience', href: '#experience' },
  ]

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 px-5 py-5 transition-opacity duration-500 md:px-10"
      >
        {/* Blur backdrop */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full backdrop-blur-xl transition-opacity duration-500"
          style={{
            backgroundColor: 'rgba(18, 20, 23, 0.65)',
            opacity: scrolled ? 1 : 0,
          }}
        />
        <div className="relative mx-auto flex max-w-[89.5rem] items-center justify-between">
          {/* Logo / Name */}
          <div className="flex items-baseline gap-[24px] text-[15px] whitespace-nowrap">
            <a href="/" data-cursor="pointer" className="font-medium text-[var(--color-text)] transition-opacity hover:opacity-80">
              Kuldashev Anwar
            </a>
            <span className="hidden text-[var(--color-text-muted)] text-[13px] md:inline">
              Senior Fullstack & Co-UX/UI Designer @ Briktobrick
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-[15px] md:flex">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-cursor="pointer"
                className="group relative inline-block py-1 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {label}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            ))}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/heechanwan"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/40 bg-white/5 px-3.5 text-[12px] uppercase tracking-[0.08em] leading-none transition-all duration-150 hover:border-white active:scale-[0.96]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.95 9.18c-.15.65-.53.81-1.08.51l-2.98-2.2-1.44 1.38c-.16.16-.29.29-.6.29l.21-3.04 5.53-5c.24-.21-.05-.33-.37-.12l-6.84 4.31-2.94-.92c-.64-.2-.65-.64.13-.95l11.49-4.43c.53-.2 1 .13.84.99z" />
                </svg>
                @heechanwan
              </a>
              <a
                href="mailto:hicchancom@gmail.com"
                data-cursor="pointer"
                className="inline-flex h-9 items-center rounded-full border border-white bg-white px-4 leading-none text-black font-medium transition-all duration-200 hover:bg-transparent hover:text-white active:scale-[0.96]"
              >
                Get in touch
              </a>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            data-cursor="pointer"
            className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden text-[var(--color-text)] transition-transform duration-150 active:scale-90"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className="absolute left-0 right-0 h-px bg-current transition-transform duration-300 ease-out"
                style={{
                  top: menuOpen ? '50%' : 0,
                  transform: menuOpen ? 'rotate(45deg)' : 'none',
                }}
              />
              <span
                className="absolute left-0 right-0 bottom-0 h-px bg-current transition-transform duration-300 ease-out"
                style={{
                  bottom: menuOpen ? '50%' : 0,
                  top: menuOpen ? '50%' : 'auto',
                  transform: menuOpen ? 'rotate(-45deg)' : 'none',
                }}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
