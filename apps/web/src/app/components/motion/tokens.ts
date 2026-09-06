import type { CSSProperties } from "react";

// Seconds for Motion; CSS receives the same values from the root layout.
export const duration = {
  micro: 0.12,
  fast: 0.18,
  standard: 0.28,
  reveal: 0.6,
  cinematic: 0.85,
  section: 0.7,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const stagger = { tight: 0.055, content: 0.085 } as const;
export const distance = { small: 8, content: 20, hero: 32 } as const;
export const spring = {
  soft: { type: "spring", stiffness: 170, damping: 28 },
  snappy: { type: "spring", stiffness: 360, damping: 32 },
  magnetic: { type: "spring", stiffness: 220, damping: 24 },
} as const;

export const motionCssProperties = {
  ...Object.fromEntries(
    Object.entries(duration).map(([name, seconds]) => [
      `--motion-${name}`,
      `${seconds}s`,
    ]),
  ),
  "--motion-large": `${duration.section}s`,
  "--ease-out": `cubic-bezier(${ease.out.join(",")})`,
  "--ease-in-out": `cubic-bezier(${ease.inOut.join(",")})`,
  "--stagger-tight": `${stagger.tight}s`,
  "--stagger-content": `${stagger.content}s`,
} as CSSProperties;
