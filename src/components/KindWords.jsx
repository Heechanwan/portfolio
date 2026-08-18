import ScrollReveal from './ScrollReveal'

export default function KindWords() {
  return (
    <section id="about" className="px-5 py-16 md:px-10 md:py-32">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal className="mb-12 md:mb-16">
          <h2 className="font-sans font-bold text-[clamp(32px,4.5vw,60px)] leading-[1.05] tracking-[-0.03em]">
            Kind words
          </h2>
        </ScrollReveal>

        <div className="border-t border-[var(--color-border)]">
          <ScrollReveal>
            <article className="grid gap-8 border-b border-[var(--color-border)] py-12 md:grid-cols-12 md:gap-10 md:py-16">
              <blockquote className="font-serif font-light tracking-[-0.015em] text-[clamp(18px,1.6vw,24px)] leading-[1.45] md:col-span-8">
                "Anwar is a rare breed of engineer: deeply skilled in architectural full-stack code, uncompromising on UI/UX detail, and fearless with complex security and custom API integrations. Over our collaborations at Briktobrick and on international client deliveries, he consistently exceeds expectations."
              </blockquote>
              <figcaption className="flex flex-col text-[14px] md:col-span-4 md:items-end md:text-right">
                <span className="font-medium text-[var(--color-text)]">Briktobrick Agency Team</span>
                <span className="mt-1 text-[var(--color-text-muted)]">Digital Product Studio, Spain</span>
                <span className="text-[var(--color-text-muted)]">Senior Fullstack & Co-Design Partner</span>
              </figcaption>
            </article>

            <article className="grid gap-8 border-b border-[var(--color-border)] py-12 md:grid-cols-12 md:gap-10 md:py-16">
              <blockquote className="font-serif font-light tracking-[-0.015em] text-[clamp(18px,1.6vw,24px)] leading-[1.45] md:col-span-8">
                "Anwar creates exceptional, top-tier design and visual identity that gives our brand a distinct magnetic edge and helps our media content blow up and gain viral reach. Working with him brings direct commercial results."
              </blockquote>
              <figcaption className="flex flex-col text-[14px] md:col-span-4 md:items-end md:text-right">
                <span className="font-medium text-[var(--color-text)]">GoodGrade School</span>
                <span className="mt-1 text-[var(--color-text-muted)]">Modern Education Brand</span>
                <span className="text-[var(--color-text-muted)]">Tashkent, Uzbekistan</span>
              </figcaption>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
