import { PROJECT_STATUS_LABELS, type FeaturedProject } from "../data/portfolio";
import { ArrowUpRight } from "./Icons";
import ProjectVisual from "./ProjectVisual";
import Reveal from "./Reveal";

type ProjectCardProps = {
  project: FeaturedProject;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-chapter" id={project.id}>
      <div className="project-layout">
        <div className="project-media-shell">
          <ProjectVisual
            alt={project.alt}
            image={project.image}
            number={project.number}
            tone={project.tone}
          />
        </div>

        <Reveal className="project-copy">
          <div className="project-meta">
            <span>{project.number} / Featured project</span>
            <div className="project-meta-detail">
              <span
                className={`project-status project-status-${project.status}`}
              >
                <span aria-hidden="true" className="project-status-dot" />
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
              <span className="project-role">{project.role}</span>
            </div>
          </div>

          <h3>{project.title}</h3>
          <p className="project-positioning">{project.positioning}</p>

          <dl className="project-notes">
            <div>
              <dt>What I built</dt>
              <dd>{project.build}</dd>
            </div>
            <div>
              <dt>Engineering challenge</dt>
              <dd>{project.challenge}</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>{project.result}</dd>
            </div>
          </dl>

          <p className="project-stack">{project.stack.join(" / ")}</p>

          <div className="project-links">
            {project.links.map((link) => (
              <a
                className="text-link text-link-light"
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
        </Reveal>
      </div>
    </article>
  );
}
