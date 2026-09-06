"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { HERO_CLOCK_ANIMATION, heroSequenceStyle } from "./heroSequence";

/** A static stage: only native scroll can gently recede the initialized system. */
export default function HeroInteraction({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia(
      "(max-width: 47.99rem), (orientation: landscape) and (max-height: 30rem)",
    );
    let frame = 0;
    let visible = false;
    let documentTop = 0;
    let viewportHeight = window.innerHeight;

    const render = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const progress =
        reducedQuery.matches || compactQuery.matches
          ? 0
          : Math.min(
              Math.max((window.scrollY - documentTop) / viewportHeight, 0),
              1,
            );
      hero.style.setProperty("--hero-scroll", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(render);
    };
    const measure = () => {
      documentTop = hero.getBoundingClientRect().top + window.scrollY;
      viewportHeight = Math.max(window.innerHeight, 1);
      schedule();
    };
    const updateCapability = () => {
      window.removeEventListener("scroll", schedule);
      if (reducedQuery.matches || compactQuery.matches) {
        hero.style.setProperty("--hero-scroll", "0");
      } else {
        window.addEventListener("scroll", schedule, { passive: true });
        schedule();
      }
      if (reducedQuery.matches) hero.dataset.initialized = "true";
    };
    const completeSequence = (event: AnimationEvent) => {
      if (event.animationName === HERO_CLOCK_ANIMATION)
        hero.dataset.initialized = "true";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) measure();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resizeObserver = new ResizeObserver(measure);
    observer.observe(hero);
    resizeObserver.observe(hero);
    reducedQuery.addEventListener("change", updateCapability);
    compactQuery.addEventListener("change", updateCapability);
    window.addEventListener("resize", measure, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    hero.addEventListener("animationend", completeSequence);
    updateCapability();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", schedule);
      hero.removeEventListener("animationend", completeSequence);
      reducedQuery.removeEventListener("change", updateCapability);
      compactQuery.removeEventListener("change", updateCapability);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero"
      id="top"
      ref={heroRef}
      style={heroSequenceStyle}
    >
      {children}
    </section>
  );
}
