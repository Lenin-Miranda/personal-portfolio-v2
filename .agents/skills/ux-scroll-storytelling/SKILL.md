---
name: ux-scroll-storytelling
description: "Design or review narrative scroll experiences using progressive reveals, sticky sections, controlled parallax, pinned visuals, section transitions, progress, and scroll-driven emphasis. Use for project showcases or portfolio sequences where scrolling should communicate a story; do not use for routine page layout."
---

# UX Scroll Storytelling

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Make scrolling advance a coherent portfolio narrative while preserving normal browser control, accessible content order, and a practical fallback.

## Principles

- Start with the story beats, not the animation technique.
- Scroll should reveal relationships or progress, never become an obstacle to reading.
- Sticky and pinned scenes need clear entry, progression, and release.
- The document must remain understandable without scroll-linked animation.
- Use spatial effects sparingly so the few important moments retain force.

## Implementation rules

1. Write the narrative sequence first: context, challenge, action, proof, outcome, and next step as applicable.
2. Map each scroll phase to a meaningful content or visual state. Keep progress monotonic and make the current stage understandable.
3. Prefer CSS sticky positioning and bounded transforms. Use the existing Motion library only when interpolation or coordinated state genuinely needs it.
4. Size scroll ranges from content and viewport constraints; avoid huge empty tracks used only to prolong an effect.
5. Provide a non-pinned, in-flow reduced-motion path with the same content order and actions.
6. Preserve native wheel, trackpad, touch, keyboard, scrollbar, find-in-page, anchor-link, and back-navigation behavior.
7. Verify short and tall viewports, mobile browser chrome, touch momentum, resize/orientation changes, late-loading media, and direct links.

## Anti-patterns

- Scroll-jacking, hidden scrollbars, fixed wheel increments, or forced snapping for ordinary content.
- Pinning a scene because it looks cinematic without a narrative reason.
- Random parallax layers, constant scrubbed motion, or transforms that induce nausea.
- Content that is inaccessible until a precise scroll position is reached.
- Long blank scroll distances, trapped sections, or unclear release points.
- A mobile fallback that remains performance-heavy or consumes several screens for one sentence.

## Review checklist

- [ ] The sequence communicates a clear story even with animation disabled.
- [ ] Every phase corresponds to meaningful content or emphasis.
- [ ] Sticky/pinned scenes enter and release cleanly at unusual viewport heights.
- [ ] Native scrolling, keyboard access, anchors, and browser history remain intact.
- [ ] Mobile and reduced-motion paths are concise, readable, and complete.
- [ ] Performance remains smooth without excessive listeners, layout reads, or media cost.
