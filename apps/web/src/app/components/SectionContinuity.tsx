"use client";

import { useEffect, useRef } from "react";

const SECTIONS = [
  { id: "experience", label: "Experience", number: "01", surface: "paper" },
  { id: "work", label: "Selected work", number: "02", surface: "dark" },
  { id: "about", label: "About", number: "03", surface: "paper" },
  { id: "contact", label: "Contact", number: "04", surface: "dark" },
] as const;

type SectionMetric = {
  bottom: number;
  element: HTMLElement;
  height: number;
  top: number;
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(Math.max(value, minimum), maximum);
}

function smoothstep(value: number) {
  const clamped = clamp(value);
  return clamped * clamped * (3 - 2 * clamped);
}

export default function SectionContinuity() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const sectionElements = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => section !== null);
    const markers = rail
      ? Array.from(
          rail.querySelectorAll<HTMLElement>("[data-continuity-marker]"),
        )
      : [];

    if (
      !rail ||
      sectionElements.length !== SECTIONS.length ||
      markers.length !== SECTIONS.length
    ) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let animationFrame = 0;
    let footerTop = Number.POSITIVE_INFINITY;
    let metrics: SectionMetric[] = [];
    let lastSurface = "";
    let lastTransition = "";

    const setMarker = (
      index: number,
      opacity: number,
      x: number,
      y: number,
      scale: number,
    ) => {
      const marker = markers[index];

      if (!marker) {
        return;
      }

      marker.style.opacity = opacity.toFixed(4);
      marker.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    };

    const render = () => {
      animationFrame = 0;

      if (metrics.length !== SECTIONS.length) {
        return;
      }

      if (reducedMotionQuery.matches) {
        rail.style.setProperty("--continuity-visible", "0");
        metrics.forEach(({ element }) => {
          element.style.setProperty("--section-enter-opacity", "1");
          element.style.setProperty("--section-enter-shift", "0px");
          element.style.setProperty("--section-exit-opacity", "1");
          element.style.setProperty("--section-exit-shift", "0px");
          element.style.setProperty("--section-handoff-clip", "100%");
        });
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollPosition = window.scrollY;
      const enterProgress = metrics.map(({ top }) =>
        clamp(
          (viewportHeight - (top - scrollPosition)) / (viewportHeight * 0.65),
        ),
      );

      metrics.forEach(({ element }, index) => {
        const enter = smoothstep(enterProgress[index] ?? 0);
        const exit = smoothstep(enterProgress[index + 1] ?? 0);

        element.style.setProperty(
          "--section-enter-opacity",
          (0.78 + enter * 0.22).toFixed(4),
        );
        element.style.setProperty(
          "--section-enter-shift",
          `${((1 - enter) * 20).toFixed(2)}px`,
        );
        element.style.setProperty(
          "--section-exit-opacity",
          (1 - exit * 0.3).toFixed(4),
        );
        element.style.setProperty(
          "--section-exit-shift",
          `${(-exit * 22).toFixed(2)}px`,
        );
        element.style.setProperty(
          "--section-handoff-clip",
          `${((1 - enter) * 100).toFixed(3)}%`,
        );
      });

      let upcomingIndex = metrics.findIndex(
        ({ top }) => top - scrollPosition > viewportHeight * 0.35,
      );

      if (upcomingIndex === -1) {
        upcomingIndex = SECTIONS.length;
      }

      const currentIndex = upcomingIndex - 1;
      const nextIndex = upcomingIndex < SECTIONS.length ? upcomingIndex : -1;
      const rawTransition =
        nextIndex >= 0 ? (enterProgress[nextIndex] ?? 0) : 0;
      const transition = smoothstep(rawTransition);
      const entryVisibility = smoothstep(enterProgress[0] ?? 0);
      const footerPosition = footerTop - scrollPosition;
      const footerFadeEnd =
        viewportHeight - Math.min(130, viewportHeight * 0.16);
      const footerFadeStart = viewportHeight - 40;
      const endVisibility = clamp(
        (footerPosition - footerFadeEnd) /
          Math.max(footerFadeStart - footerFadeEnd, 1),
      );
      const railVisibility = entryVisibility * smoothstep(endVisibility);

      markers.forEach((_, index) => setMarker(index, 0, 0, 12, 0.97));

      let currentX = 0;
      let currentY = -transition * 11;
      let nextX = 0;
      let nextY = (1 - transition) * 13;
      let trackShift = 0;
      let trackScale = 1;
      let frameOpacity = 0;
      let frameScale = 0.94;

      if (nextIndex === 1) {
        currentX = -transition * 7;
        nextX = (1 - transition) * 7;
        frameOpacity = transition;
        frameScale = 0.94 + transition * 0.06;
        trackScale = 0.9 + transition * 0.1;
      } else if (nextIndex === 2) {
        currentY = -transition * 16;
        nextY = (1 - transition) * 16;
        frameOpacity = 1 - transition;
        frameScale = 1 - transition * 0.04;
        trackShift = -transition * 8;
        trackScale = 1 - transition * 0.12;
      } else if (nextIndex === 3) {
        currentX = -transition * 9;
        currentY = -transition * 4;
        nextX = (1 - transition) * 9;
        nextY = (1 - transition) * 4;
        trackShift = transition * 6;
        trackScale = 1 - transition * 0.18;
      }

      if (currentIndex >= 0) {
        setMarker(
          currentIndex,
          1 - transition,
          currentX,
          currentY,
          1 - transition * 0.025,
        );
      }

      if (nextIndex >= 0) {
        setMarker(
          nextIndex,
          transition,
          nextX,
          nextY,
          0.975 + transition * 0.025,
        );
      }

      const readingIndex =
        nextIndex >= 0 && transition >= 0.5 ? nextIndex : currentIndex;
      const safeReadingIndex = Math.max(readingIndex, 0);
      const readingMetric = metrics[safeReadingIndex];
      const readingProgress = readingMetric
        ? clamp(
            (scrollPosition + viewportHeight * 0.35 - readingMetric.top) /
              Math.max(
                readingMetric.height - viewportHeight * 0.65,
                viewportHeight * 0.35,
              ),
          )
        : 0;

      const railSample = viewportHeight - 36;
      let surfaceIndex = -1;

      metrics.forEach(({ bottom, top }, index) => {
        if (
          top - scrollPosition <= railSample &&
          bottom - scrollPosition > railSample
        ) {
          surfaceIndex = index;
        }
      });

      const surface =
        surfaceIndex >= 0 ? SECTIONS[surfaceIndex]?.surface : "dark";
      const transitionName =
        currentIndex < 0
          ? "hero-experience"
          : nextIndex === 1
            ? "experience-work"
            : nextIndex === 2
              ? "work-about"
              : nextIndex === 3
                ? "about-contact"
                : "contact-end";

      rail.style.setProperty("--continuity-visible", railVisibility.toFixed(4));
      rail.style.setProperty(
        "--continuity-rail-shift",
        `${((1 - railVisibility) * 12).toFixed(2)}px`,
      );
      rail.style.setProperty("--continuity-transition", transition.toFixed(4));
      rail.style.setProperty(
        "--continuity-section-progress",
        readingProgress.toFixed(4),
      );
      rail.style.setProperty(
        "--continuity-node-position",
        `${(readingProgress * 100).toFixed(3)}%`,
      );
      rail.style.setProperty(
        "--continuity-track-shift",
        `${trackShift.toFixed(2)}px`,
      );
      rail.style.setProperty("--continuity-track-scale", trackScale.toFixed(4));
      rail.style.setProperty(
        "--continuity-frame-opacity",
        frameOpacity.toFixed(4),
      );
      rail.style.setProperty("--continuity-frame-scale", frameScale.toFixed(4));

      if (surface && surface !== lastSurface) {
        rail.dataset.surface = surface;
        lastSurface = surface;
      }

      if (transitionName !== lastTransition) {
        rail.dataset.transition = transitionName;
        lastTransition = transitionName;
      }
    };

    const requestRender = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const measure = () => {
      const footer = document.querySelector<HTMLElement>(".site-footer");

      metrics = sectionElements.map((element) => {
        const bounds = element.getBoundingClientRect();
        const top = bounds.top + window.scrollY;

        return {
          bottom: top + bounds.height,
          element,
          height: bounds.height,
          top,
        };
      });
      footerTop = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      requestRender();
    };

    const handleCapabilityChange = () => {
      requestRender();
    };
    const handleResize = () => {
      measure();
    };
    const resizeObserver = new ResizeObserver(measure);

    sectionElements.forEach((section) => resizeObserver.observe(section));
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    reducedMotionQuery.addEventListener("change", handleCapabilityChange);
    document.fonts.ready.then(measure).catch(() => undefined);
    measure();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", handleResize);
      reducedMotionQuery.removeEventListener("change", handleCapabilityChange);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="continuity-rail"
      data-surface="dark"
      data-transition="hero-experience"
      ref={railRef}
    >
      <div className="continuity-marker-window">
        <span className="continuity-marker-frame" />
        {SECTIONS.map((section) => (
          <div
            className="continuity-marker"
            data-continuity-marker
            key={section.id}
          >
            <span>{section.number}</span>
            <span>{section.label}</span>
          </div>
        ))}
      </div>

      <div className="continuity-track">
        <span className="continuity-track-fill" />
        <span className="continuity-track-node" />
      </div>
    </div>
  );
}
