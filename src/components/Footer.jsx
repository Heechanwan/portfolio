export default function Footer() {
  const socials = [
    {
      label: 'Telegram',
      href: 'https://t.me/heechanwan',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.95 9.18c-.15.65-.53.81-1.08.51l-2.98-2.2-1.44 1.38c-.16.16-.29.29-.6.29l.21-3.04 5.53-5c.24-.21-.05-.33-.37-.12l-6.84 4.31-2.94-.92c-.64-.2-.65-.64.13-.95l11.49-4.43c.53-.2 1 .13.84.99z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="border-t border-[var(--color-border)] px-5 py-10 md:px-10 md:py-12">
      <div className="mx-auto flex max-w-[89.5rem] flex-col gap-8 md:flex-row md:items-center md:justify-between text-[14px]">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[var(--color-text)]">
            Kuldashev Anwar
          </span>
          <span className="text-[var(--color-text-muted)] text-[13px]">
            Senior Fullstack Developer & Co-UX/UI Designer @ Briktobrick
          </span>
          <span className="text-[var(--color-text-muted)] text-[12px]">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="inline-flex items-center gap-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {icon}
              {label}
            </a>
          ))}
          <a
            href="mailto:hicchancom@gmail.com"
            data-cursor="pointer"
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            hicchancom@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
