import ScrollReveal from './ScrollReveal'

export default function ContactCTA() {
  return (
    <section id="contact" className="px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-32">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Let's build something extraordinary
            </span>
            <span className="h-1 w-1 rounded-full bg-[#AEA8FE]" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#AEA8FE]">
              Open for turnkey projects & advisory
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-col gap-6">
            <a
              href="mailto:hicchancom@gmail.com"
              data-cursor="link"
              className="group relative inline-block max-w-full font-sans font-bold leading-[1.25] tracking-[-0.03em] text-[clamp(24px,6.2vw,92px)] md:text-[clamp(40px,6.8vw,96px)] py-2"
            >
              <span className="relative inline-block whitespace-nowrap gradient-text pb-3">
                hicchancom@gmail.com
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.04em] origin-left scale-x-0 bg-[#AEA8FE] transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://t.me/heechanwan"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 text-[15px] font-medium text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-black active:scale-[0.96]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.95 9.18c-.15.65-.53.81-1.08.51l-2.98-2.2-1.44 1.38c-.16.16-.29.29-.6.29l.21-3.04 5.53-5c.24-.21-.05-.33-.37-.12l-6.84 4.31-2.94-.92c-.64-.2-.65-.64.13-.95l11.49-4.43c.53-.2 1 .13.84.99z" />
                </svg>
                Telegram: @heechanwan
              </a>
              <span className="text-[14px] text-[var(--color-text-muted)]">
                Direct communication & fast response
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
