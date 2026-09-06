import type { CSSProperties } from "react";

// A single clock connects discovery, convergence, particles, and typography.
export const heroSequence = {
  scan: 0.08,
  scanTravel: 0.48,
  signalStart: 0.58,
  signalTravel: 0.7,
  collapse: 1.28,
  collapseTravel: 0.52,
  logo: 1.45,
  resting: 1.7,
  name: 1.58,
  nameTravel: 0.64,
  interface: 1.91,
  infrastructure: 2.06,
  echoTravel: 0.31,
  completion: 2.37,
  support: 2.14,
  finish: 2.5,
} as const;

export const HERO_COMPACT_TIME_SCALE = 0.64;
export const HERO_CLOCK_ANIMATION = "hero-system-clock";

export const heroSequenceStyle = {
  ...Object.fromEntries(
    Object.entries(heroSequence).map(([name, seconds]) => [
      `--hero-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      `${seconds}s`,
    ]),
  ),
  "--hero-compact-scale": HERO_COMPACT_TIME_SCALE,
} as CSSProperties;

/** Slow hydration/asset decoding joins the current sequence, never a new intro. */
export function readHeroSequenceTime(hero: HTMLElement): number | null {
  const animation = hero
    .querySelector(".hero-boot-stage")
    ?.getAnimations()
    .find(
      (candidate) =>
        candidate instanceof CSSAnimation &&
        candidate.animationName === HERO_CLOCK_ANIMATION,
    );
  return typeof animation?.currentTime === "number"
    ? animation.currentTime / 1000
    : null;
}
