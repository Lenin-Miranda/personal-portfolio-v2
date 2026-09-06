"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { openProject } from "./ProjectRouteTransition";

type ProjectTransitionLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  slug: string;
};

function shouldUseNativeLink(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export default function ProjectTransitionLink({
  ariaLabel,
  children,
  className,
  slug,
}: ProjectTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || shouldUseNativeLink(event)) {
      return;
    }

    const source = event.currentTarget
      .closest(".project-chapter")
      ?.querySelector<HTMLElement>("[data-project-card-media]");

    if (!source) {
      return;
    }

    event.preventDefault();
    openProject(router, slug, source);
  };

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href={`/projects/${slug}`}
      onClick={handleClick}
      onFocus={() => router.prefetch(`/projects/${slug}`)}
    >
      {children}
    </Link>
  );
}
