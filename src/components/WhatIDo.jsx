import { services } from '../data/projects'
import ScrollReveal from './ScrollReveal'

export default function WhatIDo() {
  return (
    <section id="services" className="px-5 py-16 md:px-10 md:py-32">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal>
          <h2 className="mb-10 font-sans font-bold text-[clamp(32px,4.5vw,60px)] leading-[1.05] tracking-[-0.03em] md:mb-16 md:text-center">
            What I do
          </h2>
        </ScrollReveal>

        <ul className="grid border-t border-[var(--color-border)] md:grid-cols-3">
          {services.map((svc, i) => (
            <ScrollReveal
              key={svc.num}
              as="div"
              className={`border-b border-[var(--color-border)] ${
                (i + 1) % 3 !== 0 ? 'md:border-r md:border-[var(--color-border)]' : ''
              }`}
            >
              <li className="py-6 md:p-8">
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">{svc.num}</span>
                <h3 className="mt-5 font-sans font-semibold text-[22px] md:text-[25px] leading-tight md:mt-8">
                  {svc.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.55] text-[var(--color-text-muted)] md:mt-6 md:max-w-[34ch]">
                  {svc.desc}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ul>

        <ScrollReveal>
          <div className="flex flex-col items-start gap-6 border-b border-[var(--color-border)] py-12 md:flex-row md:items-center md:justify-between md:gap-10 md:px-8 md:py-14">
            <p className="font-serif font-light leading-[1.15] tracking-[-0.02em] text-[clamp(22px,2.4vw,32px)] md:max-w-[28ch]">
              <span className="gradient-text">Have a project in mind? Let's talk.</span>
            </p>
            <a
              href="#contact"
              data-cursor="pointer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white bg-white px-6 text-[15px] font-medium leading-none text-black transition-colors duration-200 hover:bg-transparent hover:text-white"
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h8" />
                <path d="M7.5 3.5L11 7L7.5 10.5" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
