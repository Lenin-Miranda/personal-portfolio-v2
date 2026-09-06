---
name: ux-motion-microinteractions
description: "Establish or review purposeful frontend motion systems, microinteractions, easing, duration, springs, stagger, entrances, exits, hover feedback, navigation transitions, reveals, and reduced-motion behavior. Use when animation supports state, continuity, hierarchy, or portfolio storytelling."
---

# UX Motion Design and Microinteractions

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Use motion to explain state change, preserve spatial continuity, direct attention, and add measured character without delaying content or turning the portfolio into a demo reel.

## Principles

- Every animation needs a reason: feedback, continuity, orientation, hierarchy, or narrative emphasis.
- Duration should reflect distance, scale, and consequence. Frequent controls feel faster than large scene changes.
- One coherent easing and spring vocabulary feels more polished than many bespoke curves.
- Exit behavior matters as much as entrance behavior.
- Reduced motion should preserve information and state, not simply remove content.

## Implementation rules

1. Define a small motion vocabulary before adding local animations: fast feedback `100–180ms`, standard transitions `180–300ms`, large visual transitions `300–500ms`, and longer storytelling motion only when justified.
2. Prefer CSS transitions for simple property changes. Use the existing Motion library for coordinated sequences, enter/exit orchestration, gestures, scroll-linked transforms, or spring behavior.
3. Animate compositor-friendly `transform` and `opacity` when possible; avoid layout thrashing and large persistent `will-change` usage.
4. Keep hover movement subtle and stable. Reserve spring overshoot for interactions whose physical character benefits from it.
5. Stagger only when order communicates hierarchy; keep groups tight enough that the last item does not feel delayed.
6. Implement `prefers-reduced-motion` behavior for CSS and `useReducedMotion` or an equivalent path for Motion. Remove pinning and large spatial transforms when necessary.
7. Verify interruption, rapid input, route changes, back navigation, and animation cleanup.

## Anti-patterns

- Animating every element on entry or replaying reveals whenever it re-enters the viewport.
- Excessive bounce, scale, floating, parallax, cursor-following, or gradient motion.
- Long transitions on navigation or common controls.
- Motion used to conceal loading latency without honest progress feedback.
- Staggers that make users wait to read or act.
- A reduced-motion mode that leaves elements hidden, pinned, or spatially displaced.
- Adding another animation library when CSS or the existing Motion package is sufficient.

## Review checklist

- [ ] Each animation has an articulated feedback, continuity, orientation, hierarchy, or narrative purpose.
- [ ] Durations and easing belong to a small, consistent vocabulary.
- [ ] Common interactions respond quickly and remain interruptible.
- [ ] Entrances, exits, route changes, and async transitions preserve state clarity.
- [ ] Motion avoids unnecessary layout and paint cost.
- [ ] Reduced-motion behavior exposes the same content and functionality without disorienting movement.
