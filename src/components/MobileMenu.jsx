export default function MobileMenu({ isOpen, onClose }) {
  const links = [
    { label: 'Works', href: '#works' },
    { label: 'Services', href: '#services' },
    { label: 'Experience', href: '#experience' },
  ]

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Column backgrounds */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-full flex-1"
            style={{
              backgroundColor: 'var(--color-bg)',
              transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
              transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? i * 0.05 : (3 - i) * 0.03}s`,
            }}
          />
        ))}
      </div>

      {/* Menu content */}
      <div
        className="relative flex h-full flex-col px-5 pb-10 pt-28"
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}
      >
        <nav className="flex flex-col gap-2">
          {links.map(({ label, href }, i) => (
            <a key={label} href={href} className="block py-2" onClick={onClose}>
              <span
                className="block font-serif font-light tracking-[-0.03em] text-[clamp(44px,11vw,72px)] leading-[1] text-[var(--color-text)]"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(14px)',
                  transition: `opacity 0.5s ease ${0.35 + i * 0.08}s, transform 0.5s ease ${0.35 + i * 0.08}s`,
                }}
              >
                {label}
              </span>
            </a>
          ))}

          <div
            className="flex flex-wrap items-center gap-3 pt-6"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s',
            }}
          >
            <a
              href="mailto:hicchancom@gmail.com"
              onClick={onClose}
              className="inline-flex h-12 items-center rounded-full border border-white bg-white px-6 text-[15px] font-medium leading-none text-black transition-all duration-200 hover:bg-transparent hover:text-white active:scale-[0.96]"
            >
              Get in touch
            </a>
            <a
              href="https://t.me/heechanwan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/60 uppercase tracking-[0.08em] transition-all duration-150 hover:border-white active:scale-[0.96] h-12 px-5 text-[13px] gap-2 text-[var(--color-text)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.95 9.18c-.15.65-.53.81-1.08.51l-2.98-2.2-1.44 1.38c-.16.16-.29.29-.6.29l.21-3.04 5.53-5c.24-.21-.05-.33-.37-.12l-6.84 4.31-2.94-.92c-.64-.2-.65-.64.13-.95l11.49-4.43c.53-.2 1 .13.84.99z" />
              </svg>
              Telegram
            </a>
          </div>
        </nav>

        <div
          className="mt-auto flex flex-col gap-2"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.7s',
          }}
        >
          <a
            href="mailto:hicchancom@gmail.com"
            className="self-start text-[clamp(20px,5.5vw,28px)] font-serif font-light leading-[1.1] tracking-[-0.02em] gradient-text"
          >
            hicchancom@gmail.com
          </a>
          <span className="text-[14px] text-[var(--color-text-muted)]">
            Senior Fullstack & Co-UX/UI Designer @ Briktobrick
          </span>
        </div>
      </div>
    </div>
  )
}
