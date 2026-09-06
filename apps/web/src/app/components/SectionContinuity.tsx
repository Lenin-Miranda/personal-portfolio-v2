"use client";

import { useEffect, useRef } from "react";

const SECTIONS = [
  { id: "experience", number: "01", surface: "paper" },
  { id: "work", number: "02", surface: "dark" },
  { id: "about", number: "03", surface: "paper" },
  { id: "contact", number: "04", surface: "dark" },
] as const;

type ElementMetric = {
  bottom: number;
  element: HTMLElement;
  height: number;
  top: number;
};

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(value: number) {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
}

function measureElements(elements: HTMLElement[], scrollY: number) {
  return elements.map((element): ElementMetric => {
    const bounds = element.getBoundingClientRect();
    const top = bounds.top + scrollY;
    return { element, top, bottom: top + bounds.height, height: bounds.height };
  });
}

function updateSectionSurfaces(
  metrics: ElementMetric[],
  scrollY: number,
  viewport: number,
) {
  for (const { element, top, bottom } of metrics) {
    if (bottom < scrollY - viewport || top > scrollY + viewport * 2) continue;
    const entered = smoothstep((scrollY + viewport - top) / (viewport * 0.65));
    element.style.setProperty(
      "--section-handoff-clip",
      `${((1 - entered) * 100).toFixed(3)}%`,
    );
  }
}

function updateExperienceProgress(
  metrics: ElementMetric[],
  readingLine: number,
) {
  for (const { element, top, bottom, height } of metrics) {
    const progress = clamp((readingLine - top) / Math.max(height, 1));
    element.style.setProperty("--experience-progress", progress.toFixed(4));
    const active = String(readingLine >= top && readingLine < bottom);
    if (element.dataset.active !== active) element.dataset.active = active;
  }
}

export default function SectionContinuity() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const sections = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => section !== null);
    if (!rail || sections.length !== SECTIONS.length) return;

    const markers = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-continuity-marker]"),
    );
    const experience = Array.from(
      document.querySelectorAll<HTMLElement>("[data-experience-entry]"),
    );
    const footer = document.querySelector<HTMLElement>(".site-footer");
    const track = rail.querySelector<HTMLElement>(".continuity-track");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopRail = window.matchMedia("(min-width: 64rem)");
    let frame = 0;
    let disposed = false;
    let sectionMetrics: ElementMetric[] = [];
    let surfaceExtensions: number[] = [];
    let experienceMetrics: ElementMetric[] = [];
    let viewport = window.innerHeight;
    let footerTop = Number.POSITIVE_INFINITY;
    let trackLength = 0;
    let railMidpoint = 0;
    let railBottom = 0;
    let railHeight = 1;
    let activeMarker = -1;

    const updateRail = (scrollY: number) => {
      if (!desktopRail.matches) {
        rail.style.setProperty("--continuity-visible", "0");
        return;
      }

      const readingLine = scrollY + viewport * 0.35;
      const upcoming = sectionMetrics.findIndex(({ top }) => top > readingLine);
      const index =
        upcoming < 0 ? sectionMetrics.length - 1 : Math.max(upcoming - 1, 0);
      const current = sectionMetrics[index];
      const first = sectionMetrics[0];
      if (!current || !first) return;

      if (index !== activeMarker) {
        markers.forEach((marker, markerIndex) => {
          marker.style.opacity = markerIndex === index ? "1" : "0";
        });
        activeMarker = index;
      }

      const progress = clamp(
        (readingLine - current.top) /
          Math.max(current.height - viewport * 0.65, viewport * 0.35),
      );
      const entered = smoothstep(
        (scrollY + viewport - first.top) / (viewport * 0.65),
      );
      const beforeFooter = smoothstep(
        (footerTop - scrollY - railBottom) / railHeight,
      );
      rail.style.setProperty(
        "--continuity-visible",
        (entered * beforeFooter).toFixed(4),
      );
      rail.style.setProperty(
        "--continuity-section-progress",
        progress.toFixed(4),
      );
      rail.style.setProperty(
        "--continuity-node-y",
        `${(progress * trackLength).toFixed(2)}px`,
      );

      // The following chapter's clipped surface can extend above its layout box.
      // Sample the rail's actual midpoint, including that visible handoff.
      const sample = scrollY + railMidpoint;
      let surfaceIndex = -1;
      sectionMetrics.forEach(({ top }, index) => {
        const entered = smoothstep(
          (scrollY + viewport - top) / (viewport * 0.65),
        );
        if (top - (surfaceExtensions[index] ?? 0) * entered <= sample) {
          surfaceIndex = index;
        }
      });
      const surface = SECTIONS[surfaceIndex]?.surface ?? "dark";
      if (rail.dataset.surface !== surface) rail.dataset.surface = surface;
    };

    const render = () => {
      frame = 0;
      if (
        disposed ||
        document.hidden ||
        sectionMetrics.length !== SECTIONS.length
      )
        return;

      if (reducedMotion.matches) {
        rail.style.setProperty("--continuity-visible", "0");
        sections.forEach((element) =>
          element.style.setProperty("--section-handoff-clip", "0%"),
        );
        experience.forEach((element) => {
          element.style.setProperty("--experience-progress", "1");
          delete element.dataset.active;
        });
        return;
      }

      const scrollY = window.scrollY;
      updateSectionSurfaces(sectionMetrics, scrollY, viewport);
      updateExperienceProgress(experienceMetrics, scrollY + viewport * 0.52);
      updateRail(scrollY);
    };

    const requestRender = () => {
      if (!disposed && !document.hidden && !frame)
        frame = window.requestAnimationFrame(render);
    };

    // All layout reads stay in this measurement pass; scrolling only uses caches.
    const measure = () => {
      if (disposed) return;
      const scrollY = window.scrollY;
      viewport = Math.max(window.innerHeight, 1);
      sectionMetrics = measureElements(sections, scrollY);
      surfaceExtensions = sections.map(
        (section) =>
          Number.parseFloat(
            window.getComputedStyle(section, "::before").height,
          ) || 0,
      );
      experienceMetrics = measureElements(experience, scrollY);
      footerTop = footer
        ? footer.getBoundingClientRect().top + scrollY
        : Number.POSITIVE_INFINITY;
      const railBounds = rail.getBoundingClientRect();
      railHeight = Math.max(railBounds.height, 1);
      railMidpoint = railBounds.top + railHeight / 2;
      railBottom = railBounds.bottom;
      trackLength = track?.offsetHeight ?? 0;
      requestRender();
    };

    const updateCapabilities = () => {
      window.removeEventListener("scroll", requestRender);
      if (!reducedMotion.matches)
        window.addEventListener("scroll", requestRender, { passive: true });
      measure();
    };
    const updateVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else measure();
    };
    const observer = new ResizeObserver(measure);
    sections.forEach((section) => observer.observe(section));
    const hero = document.getElementById("top");
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    updateCapabilities();
    window.addEventListener("resize", measure, { passive: true });
    document.addEventListener("visibilitychange", updateVisibility);
    reducedMotion.addEventListener("change", updateCapabilities);
    desktopRail.addEventListener("change", updateCapabilities);
    document.fonts.ready.then(measure).catch(() => undefined);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", updateVisibility);
      reducedMotion.removeEventListener("change", updateCapabilities);
      desktopRail.removeEventListener("change", updateCapabilities);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="continuity-rail"
      data-surface="dark"
      ref={railRef}
    >
      <div className="continuity-marker-window">
        {SECTIONS.map((section) => (
          <span
            className="continuity-marker"
            data-continuity-marker
            key={section.id}
          >
            {section.number}
          </span>
        ))}
      </div>
      <div className="continuity-track">
        <span className="continuity-track-fill" />
        <span className="continuity-track-node" />
      </div>
    </div>
  );
}
