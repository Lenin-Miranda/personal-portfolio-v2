import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@portfolio/content";
import Image from "next/image";

import { Reveal } from "./reveal";

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-2">
      {projects.map((project, index) => (
        <Reveal
          className={
            project.featured
              ? "lg:col-span-7 lg:row-span-2"
              : "lg:col-span-5 lg:row-span-1"
          }
          delay={index * 0.08}
          key={project.name}
        >
          <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)]">
            <a
              className={`relative block overflow-hidden ${
                project.featured
                  ? "aspect-[4/3] lg:min-h-[34rem]"
                  : "aspect-[16/9]"
              }`}
              href={project.href ?? project.source}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.name}`}
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes={
                  project.featured
                    ? "(max-width: 1024px) 100vw, 58vw"
                    : "(max-width: 1024px) 100vw, 42vw"
                }
                className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
              />
            </a>

            <div className="flex flex-1 flex-col gap-5 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="font-display text-2xl tracking-[-0.025em] sm:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-sm leading-6 text-[var(--muted)] sm:text-base">
                    {project.description}
                  </p>
                </div>
                <a
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--surface-strong)] active:scale-[0.98]"
                  href={project.href ?? project.source}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.name}`}
                >
                  <ArrowUpRight aria-hidden="true" size={19} />
                </a>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                <p className="text-xs leading-5 text-[var(--muted)]">
                  {project.technologies.join(" / ")}
                </p>
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--accent)]"
                  href={project.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubLogo aria-hidden="true" size={18} />
                  Source
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
