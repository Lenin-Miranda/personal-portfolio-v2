"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { duration } from "./motion/tokens";

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

    if (!hero) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const depthQuery = window.matchMedia(
      "(min-width: 48rem) and (hover: hover) and (pointer: fine)",
    );
    let animationFrame = 0;
    let lastTimestamp = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScroll = 0;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerIsInside = false;
    let isVisible = false;
    let boundsAreDirty = true;
    let heroLeft = 0;
    let heroTop = 0;
    let heroWidth = 1;
    let heroHeight = 1;
    let viewportHeight = window.innerHeight;

    const resetDepth = () => {
      currentX = 0;
      currentY = 0;
      currentScroll = 0;
      pointerIsInside = false;
      hero.style.setProperty("--hero-x", "0");
      hero.style.setProperty("--hero-y", "0");
      hero.style.setProperty("--hero-scroll", "0");
      hero.style.setProperty("--hero-active", "0");
    };

    const renderFrame = (timestamp: number) => {
      animationFrame = 0;

      if (!isVisible || document.hidden) return;
      if (reducedMotionQuery.matches || !depthQuery.matches) {
        resetDepth();
        return;
      }

      // The hero itself never transforms. Cache its geometry and read again
      // only after a resize; pointer interpolation does not need layout reads.
      if (boundsAreDirty) {
        const bounds = hero.getBoundingClientRect();
        heroLeft = bounds.left;
        heroTop = bounds.top + window.scrollY;
        heroWidth = Math.max(bounds.width, 1);
        heroHeight = Math.max(bounds.height, 1);
        viewportHeight = window.innerHeight;
        boundsAreDirty = false;
      }

      const scrollY = window.scrollY;
      const targetX = pointerIsInside
        ? clamp(((pointerClientX - heroLeft) / heroWidth - 0.5) * 2, -1, 1)
        : 0;
      const targetY = pointerIsInside
        ? clamp(
            ((pointerClientY - heroTop + scrollY) / heroHeight - 0.5) * 2,
            -1,
            1,
          )
        : 0;
      const targetScroll = clamp(
        (scrollY - heroTop) / Math.max(viewportHeight * 0.9, 1),
        0,
        1,
      );
      const elapsed = lastTimestamp
        ? Math.min(timestamp - lastTimestamp, 40)
        : 16;
      const pointerEase = 1 - Math.exp(-elapsed / (duration.fast * 500));
      const scrollEase = 1 - Math.exp(-elapsed / (duration.standard * 250));
      lastTimestamp = timestamp;

      currentX += (targetX - currentX) * pointerEase;
      currentY += (targetY - currentY) * pointerEase;
      currentScroll += (targetScroll - currentScroll) * scrollEase;

      hero.style.setProperty("--hero-x", currentX.toFixed(4));
      hero.style.setProperty("--hero-y", currentY.toFixed(4));
      hero.style.setProperty("--hero-scroll", currentScroll.toFixed(4));
      hero.style.setProperty("--hero-active", pointerIsInside ? "1" : "0");

      if (
        Math.abs(targetX - currentX) > SETTLED_THRESHOLD ||
        Math.abs(targetY - currentY) > SETTLED_THRESHOLD ||
        Math.abs(targetScroll - currentScroll) > SETTLED_THRESHOLD
      ) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      } else {
        lastTimestamp = 0;
      }
    };

    const requestRender = () => {
      if (!animationFrame && isVisible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const stopRendering = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastTimestamp = 0;
      pointerIsInside = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (
        !depthQuery.matches ||
        reducedMotionQuery.matches ||
        event.pointerType === "touch"
      ) {
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

    const handleResize = () => {
      boundsAreDirty = true;
      requestRender();
    };

    const handleCapabilityChange = () => {
      if (reducedMotionQuery.matches || !depthQuery.matches) {
        stopRendering();
        resetDepth();
      } else {
        requestRender();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopRendering();
      else requestRender();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? false;
      if (isVisible) {
        boundsAreDirty = true;
        requestRender();
      } else {
        stopRendering();
      }
    });
    const resizeObserver = new ResizeObserver(handleResize);
    intersectionObserver.observe(hero);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleCapabilityChange);
    depthQuery.addEventListener("change", handleCapabilityChange);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleCapabilityChange);
      depthQuery.removeEventListener("change", handleCapabilityChange);
      stopRendering();
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
