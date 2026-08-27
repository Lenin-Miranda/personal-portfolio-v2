import {
  ADDITIONAL_PROJECTS,
  FEATURED_PROJECTS,
  PROJECT_STATUS_LABELS,
} from "../data/portfolio";
import { ArrowUpRight } from "./Icons";
import ProjectCard from "./ProjectCard";
import { MaskedReveal, RevealGroup, RevealItem } from "./Reveal";

export default function ProjectsShowcase() {
  return (
    <section
      aria-labelledby="work-title"
      className="section projects-section"
      id="work"
    >
      <div className="section-inner project-section-inner">
        <RevealGroup className="section-heading">
          <RevealItem className="section-index" level="meta">
            <p>02 / Selected work</p>
          </RevealItem>
          <MaskedReveal className="section-heading-title">
            <h2 id="work-title">Systems are the product.</h2>
          </MaskedReveal>
          <RevealItem className="section-deck">
            <p>
              Selected builds that connect interface decisions to state, data,
              validation, and the behavior users depend on.
            </p>
          </RevealItem>
        </RevealGroup>

        <div className="featured-projects">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="additional-work">
          <RevealGroup className="additional-work-heading">
            <RevealItem className="eyebrow" level="meta">
              <p>Additional build notes</p>
            </RevealItem>
            <MaskedReveal className="additional-work-title">
              <h3>More of the system, less of the thumbnail.</h3>
            </MaskedReveal>
          </RevealGroup>

          <div className="additional-project-list">
            {ADDITIONAL_PROJECTS.map((project) => (
              <RevealGroup
                amount={0.28}
                className="additional-project"
                key={project.title}
                stagger={0.08}
              >
                <RevealItem className="additional-project-number" level="meta">
                  <span>{project.number}</span>
                </RevealItem>
                <RevealItem className="additional-project-copy">
                  <div className="additional-project-titleline">
                    <h4>{project.title}</h4>
                    <span
                      className={`project-status project-status-${project.status}`}
                    >
                      <span aria-hidden="true" className="project-status-dot" />
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>
                  <p>{project.description}</p>
                </RevealItem>
                <RevealItem className="additional-project-meta" level="meta">
                  <p>{project.stack.join(" / ")}</p>
                  {project.links.length > 0 ? (
                    <div>
                      {project.links.map((link) => (
                        <a
                          href={link.href}
                          key={link.href}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {link.label}
                          <span className="sr-only">, opens in a new tab</span>
                          <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </RevealItem>
              </RevealGroup>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
