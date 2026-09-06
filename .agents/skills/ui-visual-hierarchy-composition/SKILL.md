---
name: ui-visual-hierarchy-composition
description: "Design or critique page and section composition for hierarchy, whitespace, rhythm, density, alignment, focal points, CTA prominence, balance, and mobile/desktop visual weight. Use when a layout works functionally but feels flat, crowded, amateur, repetitive, or unclear."
---

# UI Visual Hierarchy and Composition

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Make the intended reading order obvious and give each section the visual weight its role in the portfolio story deserves.

## Principles

- Hierarchy begins with content importance, not font size or special effects.
- Whitespace groups related information and separates ideas; it is not leftover space.
- Strong composition usually needs one dominant idea, a supporting layer, and quiet tertiary detail.
- Repetition creates rhythm only when contrasted with meaningful changes in pace, scale, or alignment.
- Mobile composition must reprioritize content rather than merely collapse columns.

## Implementation rules

1. Identify the section's primary message, supporting proof, and next action before arranging elements.
2. Establish a deliberate reading path using position, scale, contrast, spacing, and alignment. Do not make every item equally loud.
3. Use a consistent container logic and alignment anchors across adjacent sections, then break the grid only for a clear focal reason.
4. Vary section density and transitions to create pace. Let dense proof sections follow quieter orientation moments.
5. Give primary CTAs sufficient contrast and proximity to the decision they advance; keep secondary actions visibly secondary.
6. Test realistic long titles, metadata, project descriptions, and absent optional content for wrapping and balance.
7. Compose narrow screens independently: reorder when meaning requires it, protect key proof, and remove decorative competition.

## Anti-patterns

- Every section centered, equally padded, and built from interchangeable cards.
- Huge headings used to manufacture importance while the supporting content remains unclear.
- Arbitrary asymmetry that damages reading order or alignment.
- Dead whitespace caused by fixed heights, mismatched columns, or sparse cards rather than intentional pause.
- Several competing accent colors, images, or CTAs in one viewport.
- Abrupt section endings with no visual or narrative handoff.

## Review checklist

- [ ] A first-time visitor can identify the primary message and action within seconds.
- [ ] Heading levels, type scale, contrast, and spacing express a clear reading order.
- [ ] Alignment anchors and container behavior feel deliberate across sections.
- [ ] Density varies purposefully and whitespace groups content correctly.
- [ ] Primary and secondary actions have the right relative emphasis.
- [ ] Desktop and mobile compositions both have intentional focal points and clean section transitions.
