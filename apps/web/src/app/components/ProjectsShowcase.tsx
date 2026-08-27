import {
  ADDITIONAL_PROJECTS,
  FEATURED_PROJECTS,
  PROJECT_STATUS_LABELS,
} from "../data/portfolio";
import { ArrowUpRight } from "./Icons";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function ProjectsShowcase() {
  return (
    <section
      aria-labelledby="work-title"
      className="section projects-section"
      id="work"
    >
      <div className="section-inner project-section-inner">
        <Reveal className="section-heading">
          <p className="section-index">02 / Selected work</p>
          <h2 id="work-title">Systems are the product.</h2>
          <p className="section-deck">
            Selected builds that connect interface decisions to state, data,
            validation, and the behavior users depend on.
          </p>
        </Reveal>

        <div className="featured-projects">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="additional-work">
          <Reveal className="additional-work-heading">
            <p className="eyebrow">Additional build notes</p>
            <h3>More of the system, less of the thumbnail.</h3>
          </Reveal>

          <div className="additional-project-list">
            {ADDITIONAL_PROJECTS.map((project, index) => (
              <Reveal
                className="additional-project"
                delay={index * 0.04}
                key={project.title}
              >
                <span className="additional-project-number">
                  {project.number}
                </span>
                <div className="additional-project-copy">
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
                </div>
                <div className="additional-project-meta">
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
