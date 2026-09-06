---
name: ui-frontend-pixel-polish
description: "Perform the final visual-quality pass on implemented frontend work, catching alignment, optical icon placement, wrapping, borders, shadows, image crops, card sizing, overflow, whitespace, repetition, section endings, and mobile spacing defects. Use after a UI implementation or when asked to polish, refine, or remove generic AI-looking details."
---

# UI Frontend Polish and Pixel Quality

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before reviewing.

## Purpose

Find and correct the small visual failures that make an otherwise functional interface feel unconsidered. This is a final pass, not permission to replace the approved direction.

## Principles

- Inspect rendered output, not only source code.
- Correct systemic causes before local symptoms.
- Optical alignment may differ from mathematical alignment, especially for icons, type, and irregular marks.
- Restraint is a quality decision: removing an unnecessary effect is often the right polish.
- Validate real content and state changes; an idealized screenshot is insufficient.

## Implementation rules

1. Compare adjacent alignments, baselines, gaps, radii, borders, shadows, control heights, and icon sizes at representative viewports.
2. Inspect prominent text for widows, awkward wraps, clipping, inconsistent line boxes, and collisions during font loading.
3. Verify image focal points, aspect-ratio behavior, crop consistency, resolution, loading, and fallback treatment.
4. Check repeated items for accidental height mismatch while preserving meaningful content-driven variation.
5. Trace page edges and section boundaries for overflow, doubled spacing, dead zones, weak endings, and abrupt background transitions.
6. Remove repeated visual devices that make sections interchangeable. Keep one strong motif only when it supports identity.
7. Recheck hover, focus, active, loading, reduced-motion, and mobile output after every polish change.

## Anti-patterns

- Adding gradients, glow, noise, glass, or shadows merely to make the page feel finished.
- Making all cards equal height by clipping or hiding meaningful content.
- Treating every alignment difference as an error when optical balance requires an offset.
- Solving wrapping with hard-coded line breaks that fail at other widths.
- Polishing only the initial desktop viewport.
- Broad redesigns disguised as cleanup.

## Review checklist

- [ ] Alignment, baselines, spacing, radii, borders, shadows, controls, and icons are visually consistent.
- [ ] Type wraps naturally and remains clean during loading and resizing.
- [ ] Images crop intentionally and render at suitable quality.
- [ ] No accidental overflow, clipped focus, dead whitespace, or broken section transition remains.
- [ ] Repeated patterns support the content rather than creating generic sameness.
- [ ] Narrow, medium, wide, interaction-state, and reduced-motion passes all remain polished.
