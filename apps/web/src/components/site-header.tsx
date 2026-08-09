import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@portfolio/content";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--page)]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10"
        aria-label="Primary navigation"
      >
        <a
          className="flex shrink-0 items-center gap-3"
          href="#home"
          aria-label="Lenin Miranda, home"
        >
          <Image
            src="/brand/lenin-miranda-mark.png"
            alt=""
            width={42}
            height={42}
            sizes="42px"
            className="rounded-[12px]"
            priority
          />
          <span className="text-sm font-semibold tracking-[-0.02em]">
            {site.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <a
            className="transition-colors hover:text-[var(--text)]"
            href="#work"
          >
            Work
          </a>
          <a
            className="transition-colors hover:text-[var(--text)]"
            href="#approach"
          >
            Approach
          </a>
          <a
            className="transition-colors hover:text-[var(--text)]"
            href="#contact"
          >
            Contact
          </a>
        </div>

        <a
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2.5 text-sm font-semibold text-[var(--page)] transition-transform duration-300 active:scale-[0.98]"
          href={`mailto:${site.email}`}
        >
          Email me
          <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
        </a>
      </nav>
    </header>
  );
}
