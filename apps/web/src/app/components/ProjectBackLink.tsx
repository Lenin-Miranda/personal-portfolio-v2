"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { ArrowLeft } from "./Icons";
import { returnToProjectOrigin } from "./ProjectRouteTransition";

type ProjectBackLinkProps = {
  slug: string;
};

export default function ProjectBackLink({ slug }: ProjectBackLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const source = document.querySelector<HTMLElement>(
      `[data-project-hero-media="${slug}"]`,
    );

    if (!source) {
      return;
    }

    event.preventDefault();
    returnToProjectOrigin(router, slug, source);
  };

  return (
    <Link
      className="project-back-link"
      href={`/#${slug}`}
      onClick={handleClick}
    >
      <ArrowLeft />
      Selected work
    </Link>
  );
}
