"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PROJECT_STATUS_LABELS, type FeaturedProject } from "../data/portfolio";
import { ArrowUpRight } from "./Icons";
import ProjectBackLink from "./ProjectBackLink";
import ProjectVisual from "./ProjectVisual";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type ProjectCaseStudyHeroData = Pick<
  FeaturedProject,
  | "alt"
  | "id"
  | "image"
  | "links"
  | "number"
  | "positioning"
  | "role"
  | "stack"
  | "status"
  | "title"
  | "tone"
>;

type ProjectCaseStudyHeroProps = {
  project: ProjectCaseStudyHeroData;
};

export default function ProjectCaseStudyHero({
  project,
}: ProjectCaseStudyHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isEstablished, setIsEstablished] = useState(false);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: heroRef,
  });
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.64]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -22]);

  useEffect(() => {
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => setIsEstablished(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const reveal = () => setIsEstablished(true);

    if (document.documentElement.dataset.projectTransition) {
      window.addEventListener("project-transition-finished", reveal, {
        once: true,
      });

      return () =>
        window.removeEventListener("project-transition-finished", reveal);
    }

    const frame = window.requestAnimationFrame(reveal);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const transition = (delay: number, duration = 0.52) => ({
    delay: reduceMotion ? 0 : delay,
    duration: reduceMotion ? 0 : duration,
    ease: EASE_OUT,
  });

  return (
    <section
      aria-labelledby="project-case-title"
      className="project-case-hero"
      id="top"
      ref={heroRef}
    >
      <div className="project-case-inner project-case-hero-inner">
        <motion.div
          animate={isEstablished ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="project-case-topline"
          initial={false}
          transition={transition(0.04, 0.38)}
        >
          <ProjectBackLink slug={project.id} />
          <p>{project.number} / Project case study</p>
        </motion.div>

        <motion.div
          className="project-case-heading"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <div className="project-case-title-block">
            <div className="project-case-title-mask">
              <motion.h1
                animate={
                  isEstablished
                    ? { opacity: 1, y: "0%" }
                    : { opacity: 0.2, y: "108%" }
                }
                id="project-case-title"
                initial={false}
                transition={transition(0.1, 0.64)}
              >
                {project.title}
              </motion.h1>
            </div>

            <motion.p
              animate={
                isEstablished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              className="project-case-positioning"
              initial={false}
              transition={transition(0.2)}
            >
              {project.positioning}
            </motion.p>
          </div>

          <motion.dl
            animate={
              isEstablished ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
            }
            className="project-case-meta"
            initial={false}
            transition={transition(0.29, 0.46)}
          >
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span
                  className={`project-status project-status-${project.status}`}
                >
                  <span aria-hidden="true" className="project-status-dot" />
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>{project.stack.join(" / ")}</dd>
            </div>
          </motion.dl>
        </motion.div>

        <div className="project-case-media-shell">
          <ProjectVisual
            alt={project.alt}
            image={project.image}
            number={project.number}
            preload
            projectId={project.id}
            tone={project.tone}
            variant="hero"
          />
        </div>

        <motion.div
          animate={isEstablished ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="project-case-hero-links"
          initial={false}
          transition={transition(0.38, 0.4)}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
