import type { CSSProperties } from "react";
import { duration } from "./motion/tokens";

// One finite title sequence. The first signal reaches LM before the identity
// reveal; the continuation reaches Data as “infrastructure” resolves.
const signalStart = 0.14;
const signalTravel = 0.62;
export const heroSequence = {
  architecture: 0.04,
  signalStart,
  signalTravel,
  interfaceNode: signalStart + signalTravel * (240 / 920),
  servicesNode: signalStart + signalTravel * (600 / 920),
  logo: signalStart + signalTravel,
  name: 0.86,
  interface: 1.08,
  infrastructure: 1.25,
  dataStart: 1.08,
  dataTravel: duration.standard,
  support: 1.35,
  finish: 1.85,
} as const;

export const HERO_COMPACT_TIME_SCALE = 0.65;
export const HERO_CLOCK_ANIMATION = "hero-architecture-environment";

export const heroSequenceStyle = Object.fromEntries(
  Object.entries(heroSequence).map(([name, seconds]) => [
    `--hero-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
    `${seconds}s`,
  ]),
) as CSSProperties;

/** Read the CSS sequence clock, so slow asset decoding never starts a new intro. */
export function readHeroSequenceTime(hero: HTMLElement): number | null {
  const animation = hero
    .querySelector(".hero-path-plane")
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
