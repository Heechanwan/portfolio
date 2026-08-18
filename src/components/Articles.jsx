import { articles } from '../data/projects'
import { useParallax } from '../hooks/useParallax'
import ScrollReveal from './ScrollReveal'

function ArticleCard({ article }) {
  const { containerRef, innerRef } = useParallax(0.08)

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className="block group"
    >
      <article className="group">
        <div>
          <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <div ref={containerRef} className="relative overflow-hidden img-skeleton aspect-[16/9] w-full bg-[#16181D]">
              <div ref={innerRef} className="h-[110%] w-full -mt-[5%]">
                <img
                  alt={article.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={article.image}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
                  }}
                />
              </div>
            </div>
            {article.badge && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-[150px] w-[150px]"
                  style={{ background: 'radial-gradient(circle at top right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 80%)' }}
                />
                <div className="pointer-events-none absolute right-3 top-3 h-[68px] w-[68px] md:h-[84px] md:w-[84px] rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 flex items-center justify-center text-[10px] md:text-[11px] text-center font-bold text-black leading-tight shadow-xl">
                  {article.badgeText || 'Featured'}
                </div>
              </>
            )}
          </div>
          <h3 className="mt-5 text-[18px] font-medium leading-snug text-[var(--color-text)] transition-colors group-hover:text-[#AEA8FE]">
            {article.title}
          </h3>
          <p className="mt-1.5 max-w-[42ch] text-[14px] leading-[1.55] text-[var(--color-text-muted)]">
            {article.desc}
          </p>
        </div>
      </article>
    </a>
  )
}

export default function Articles() {
  return (
    <section id="experience" className="px-5 md:px-10 py-16 md:py-32">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] block mb-2">
              Engineering & Leadership Insights
            </span>
            <h2 className="font-sans font-bold text-[clamp(32px,4.5vw,60px)] leading-[1.05] tracking-[-0.03em]">
              Experience & mentorship
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid items-start gap-8 md:grid-cols-3">
          {articles.map((article, i) => (
            <ScrollReveal key={i}>
              <ArticleCard article={article} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
