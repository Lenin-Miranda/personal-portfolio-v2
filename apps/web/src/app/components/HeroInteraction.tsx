"use client";

import { type ReactNode, useEffect, useRef } from "react";

const POINTER_EASING = 0.11;
const SCROLL_EASING = 0.16;
const SETTLED_THRESHOLD = 0.001;

type HeroInteractionProps = {
  children: ReactNode;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function HeroInteraction({ children }: HeroInteractionProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    let animationFrame = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScroll = 0;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerIsInside = false;

    const renderFrame = () => {
      animationFrame = 0;

      if (reducedMotionQuery.matches) {
        hero.style.setProperty("--hero-x", "0");
        hero.style.setProperty("--hero-y", "0");
        hero.style.setProperty("--hero-scroll", "0");
        hero.style.setProperty("--hero-active", "0");
        return;
      }

      const bounds = hero.getBoundingClientRect();
      let targetX = 0;
      let targetY = 0;

      if (pointerIsInside && finePointerQuery.matches) {
        targetX = clamp(
          ((pointerClientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) *
            2,
          -1,
          1,
        );
        targetY = clamp(
          ((pointerClientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) *
            2,
          -1,
          1,
        );
      }

      const targetScroll = clamp(
        -bounds.top / Math.max(window.innerHeight * 0.72, 1),
        0,
        1,
      );

      currentX += (targetX - currentX) * POINTER_EASING;
      currentY += (targetY - currentY) * POINTER_EASING;
      currentScroll += (targetScroll - currentScroll) * SCROLL_EASING;

      hero.style.setProperty("--hero-x", currentX.toFixed(4));
      hero.style.setProperty("--hero-y", currentY.toFixed(4));
      hero.style.setProperty("--hero-scroll", currentScroll.toFixed(4));
      hero.style.setProperty(
        "--hero-active",
        pointerIsInside && finePointerQuery.matches ? "1" : "0",
      );

      const pointerIsSettled =
        Math.abs(targetX - currentX) < SETTLED_THRESHOLD &&
        Math.abs(targetY - currentY) < SETTLED_THRESHOLD;
      const scrollIsSettled =
        Math.abs(targetScroll - currentScroll) < SETTLED_THRESHOLD;

      if (!pointerIsSettled || !scrollIsSettled) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const requestRender = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointerQuery.matches || reducedMotionQuery.matches) {
        return;
      }

      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      pointerIsInside = true;
      requestRender();
    };

    const handlePointerLeave = () => {
      pointerIsInside = false;
      requestRender();
    };

    const handleCapabilityChange = () => {
      if (reducedMotionQuery.matches || !finePointerQuery.matches) {
        pointerIsInside = false;
      }

      requestRender();
    };

    const resizeObserver = new ResizeObserver(requestRender);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    reducedMotionQuery.addEventListener("change", handleCapabilityChange);
    finePointerQuery.addEventListener("change", handleCapabilityChange);
    requestRender();

    return () => {
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotionQuery.removeEventListener("change", handleCapabilityChange);
      finePointerQuery.removeEventListener("change", handleCapabilityChange);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero"
      id="top"
      ref={heroRef}
    >
      {children}
    </section>
  );
}
