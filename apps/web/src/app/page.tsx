import {
  ArrowDown,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";
import { principles, site } from "@portfolio/content";
import Image from "next/image";

import { ProjectGrid } from "@/components/project-grid";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main className="grain overflow-clip bg-[var(--page)]">
      <SiteHeader />

      <section
        className="mx-auto grid min-h-[100dvh] w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-10"
        id="home"
      >
        <Reveal className="flex max-w-2xl flex-col items-start">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {site.role}
          </p>
          <h1 className="font-display max-w-[12ch] text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Digital products, built with depth.
          </h1>
          <p className="mt-7 max-w-[52ch] text-base leading-7 text-[var(--muted)] sm:text-lg">
            I connect thoughtful interfaces, reliable systems, and the details
            that make software feel complete.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--accent-ink)] transition-transform duration-300 active:scale-[0.98]"
              href="#work"
            >
              View work
              <ArrowDown aria-hidden="true" size={17} weight="bold" />
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[var(--surface)] active:scale-[0.98]"
              href={site.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ArrowUpRight aria-hidden="true" size={17} weight="bold" />
            </a>
          </div>
        </Reveal>

        <Reveal className="relative" delay={0.12}>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] lg:aspect-[4/5] xl:aspect-[5/4]">
            <Image
              src="/media/architectural-hero.png"
              alt="Abstract architectural composition in graphite and cyan"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center lg:object-[64%_center]"
            />
          </div>
        </Reveal>
      </section>

      <section
        className="mx-auto w-full max-w-[1400px] px-4 py-24 sm:px-6 sm:py-32 lg:px-10"
        id="work"
      >
        <Reveal className="mb-12 max-w-3xl sm:mb-16">
          <h2 className="font-display text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Selected work with real edges.
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-7 text-[var(--muted)] sm:text-lg">
            Products across real-time experiences, productivity, and the systems
            underneath them.
          </p>
        </Reveal>
        <ProjectGrid />
      </section>

      <section
        className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-10"
        id="approach"
      >
        <Reveal>
          <h2 className="font-display max-w-[10ch] text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Useful beats impressive.
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-7 text-[var(--muted)]">
            Strong software makes the complicated parts easier to understand,
            operate, and trust.
          </p>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {principles.map((principle, index) => (
            <Reveal delay={index * 0.06} key={principle.title}>
              <article className="grid grid-cols-1 gap-3 border-b border-[var(--line)] py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10 sm:py-9">
                <h3 className="text-lg font-semibold tracking-[-0.02em]">
                  {principle.title}
                </h3>
                <p className="max-w-[50ch] text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                  {principle.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-[1400px] px-4 pb-5 pt-24 sm:px-6 sm:pt-32 lg:px-10"
        id="contact"
      >
        <Reveal className="rounded-[24px] bg-[var(--surface-strong)] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <h2 className="font-display max-w-[12ch] text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Let&apos;s make something worth using.
          </h2>
          <a
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--page)] transition-transform duration-300 active:scale-[0.98]"
            href={`mailto:${site.email}`}
          >
            Email me
            <ArrowUpRight aria-hidden="true" size={17} weight="bold" />
          </a>
        </Reveal>
      </section>

      <footer className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <a
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--text)]"
            href={`mailto:${site.email}`}
          >
            <EnvelopeSimple aria-hidden="true" size={18} />
            Email
          </a>
          <a
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--text)]"
            href={site.github}
            target="_blank"
            rel="noreferrer"
          >
            <GithubLogo aria-hidden="true" size={18} />
            GitHub
          </a>
          <a
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--text)]"
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinLogo aria-hidden="true" size={18} />
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
