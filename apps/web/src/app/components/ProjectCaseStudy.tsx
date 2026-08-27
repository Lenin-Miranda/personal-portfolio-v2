import Link from "next/link";

import type { FeaturedProject } from "../data/portfolio";
import { ArrowRight, ArrowUpRight } from "./Icons";
import ProjectCaseStudyHero, {
  type ProjectCaseStudyHeroData,
} from "./ProjectCaseStudyHero";
import { MaskedReveal, RevealGroup, RevealItem } from "./Reveal";
import SiteHeader from "./SiteHeader";

type ProjectCaseStudyProps = {
  nextProject: FeaturedProject;
  project: FeaturedProject;
};

const STORY_SECTIONS = [
  { field: "positioning", label: "Overview", number: "01" },
  { field: "build", label: "What I built", number: "02" },
  { field: "challenge", label: "Engineering challenge", number: "03" },
  { field: "result", label: "Result", number: "04" },
] as const;

export default function ProjectCaseStudy({
  nextProject,
  project,
}: ProjectCaseStudyProps) {
  const heroProject: ProjectCaseStudyHeroData = {
    alt: project.alt,
    id: project.id,
    image: project.image,
    links: project.links,
    number: project.number,
    positioning: project.positioning,
    role: project.role,
    stack: project.stack,
    status: project.status,
    title: project.title,
    tone: project.tone,
  };

  return (
    <div className="site-shell project-case-shell">
      <SiteHeader />
      <main className="project-case-main" id="main-content">
        <ProjectCaseStudyHero project={heroProject} />

        <article className="project-case-story">
          <div className="project-case-inner">
            <RevealGroup
              amount={0.28}
              className="project-story-intro"
              stagger={0.09}
            >
              <RevealItem className="eyebrow" level="meta">
                <p>Engineering narrative</p>
              </RevealItem>
              <MaskedReveal className="project-story-intro-title">
                <h2>From product intent to dependable behavior.</h2>
              </MaskedReveal>
            </RevealGroup>

            <div className="project-story-sections">
              {STORY_SECTIONS.map((section) => (
                <RevealGroup
                  amount={0.28}
                  className="project-story-section"
                  key={section.field}
                  stagger={0.09}
                >
                  <RevealItem className="project-story-number" level="meta">
                    <p>{section.number}</p>
                  </RevealItem>
                  <RevealItem className="project-story-label" level="meta">
                    <h2>{section.label}</h2>
                  </RevealItem>
                  <RevealItem className="project-story-copy">
                    <p>{project[section.field]}</p>
                  </RevealItem>
                </RevealGroup>
              ))}
            </div>

            <RevealGroup
              amount={0.3}
              className="project-case-explore"
              stagger={0.09}
            >
              <RevealItem className="project-story-number" level="meta">
                <p>05</p>
              </RevealItem>
              <RevealItem className="project-story-label" level="meta">
                <h2>Technology &amp; explore</h2>
              </RevealItem>
              <RevealItem className="project-case-explore-content">
                <p className="project-case-stack">
                  {project.stack.join(" / ")}
                </p>
                <div className="project-case-explore-links">
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
              </RevealItem>
            </RevealGroup>
          </div>
        </article>

        <nav aria-label="Project navigation" className="project-case-next">
          <div className="project-case-inner">
            <RevealGroup
              amount={0.3}
              className="project-case-next-inner"
              stagger={0.08}
            >
              <RevealItem level="meta">
                <p>Next project</p>
              </RevealItem>
              <RevealItem>
                <Link href={`/projects/${nextProject.id}`}>
                  <span>{nextProject.number}</span>
                  <strong>{nextProject.title}</strong>
                  <ArrowRight />
                </Link>
              </RevealItem>
            </RevealGroup>
          </div>
        </nav>
      </main>
    </div>
  );
}
