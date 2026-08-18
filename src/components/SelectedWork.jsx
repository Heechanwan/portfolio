import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ScrollReveal from './ScrollReveal'

export default function SelectedWork() {
  const leftProjects = projects.filter(p => p.column === 'left')
  const rightProjects = projects.filter(p => p.column === 'right')

  return (
    <section id="works" className="px-5 py-16 md:px-10 md:py-32">
      <div className="mx-auto max-w-[89.5rem]">
        <ScrollReveal className="mb-12 md:mb-16">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] block mb-2">
            Selected Portfolio & Case Studies
          </span>
          <h2 className="font-sans font-bold text-[clamp(32px,4.5vw,60px)] leading-[1.05] tracking-[-0.03em]">
            Turnkey web applications & UI systems
          </h2>
        </ScrollReveal>

        <div className="grid gap-x-8 md:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-14 md:gap-[16rem]">
            {leftProjects.map((project) => (
              <ScrollReveal key={project.id}>
                <div id={`project-${project.id}`} className="scroll-mt-28">
                  <ProjectCard project={project} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right column — shifted down */}
          <div className="mt-14 flex flex-col gap-14 md:mt-[15rem] md:gap-[16rem]">
            {rightProjects.map((project) => (
              <ScrollReveal key={project.id}>
                <div id={`project-${project.id}`} className="scroll-mt-28">
                  <ProjectCard project={project} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
