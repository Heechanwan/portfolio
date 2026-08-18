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
    {
      label: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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
