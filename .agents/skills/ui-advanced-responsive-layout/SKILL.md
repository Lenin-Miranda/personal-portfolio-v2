---
name: ui-advanced-responsive-layout
description: "Build or review resilient responsive layouts with Grid, Flexbox, intrinsic sizing, fluid type and spacing, container queries, clamp(), and a content-driven breakpoint strategy. Use for multi-column layouts, complex media, overflow bugs, or interfaces that must adapt beyond simple desktop-to-mobile stacking."
---

# UI Advanced Responsive Layout

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Create layouts that remain composed across realistic and unusual viewports without accumulating breakpoint patches.

## Principles

- Let content and available space determine layout changes; device labels are only approximations.
- Prefer intrinsic sizing, wrapping, min/max constraints, and fluid ranges before adding a breakpoint.
- Choose Grid for two-dimensional relationships and Flexbox for one-dimensional distribution.
- Mobile is an authored composition with its own priority, spacing, and interaction constraints.
- Robust layouts tolerate text growth, zoom, localization, missing content, and extreme aspect ratios.

## Implementation rules

1. Start from the narrowest meaningful layout and add complexity only when space supports it.
2. Use `minmax()`, `auto-fit`/`auto-fill`, `min()`, `max()`, `clamp()`, logical properties, and sensible max-widths where they express the constraint directly.
3. Add breakpoints where content begins to collide, wrap badly, or lose hierarchy. Avoid copying a generic breakpoint catalog without evidence.
4. Use container queries when a component's behavior depends on its allocated width rather than the viewport.
5. Set `min-width: 0` on constrained flex/grid children when needed; constrain media and long strings; distinguish intentional clipping from accidental overflow.
6. Keep source order meaningful. Use visual reordering only when keyboard, screen-reader, and reading order remain correct.
7. Verify at narrow phone, wide phone, tablet, laptop, large desktop, short landscape, and at least 200% zoom when relevant.

## Anti-patterns

- Shrinking the desktop layout until it fits or stacking every column without reprioritizing content.
- Pixel-perfect breakpoint patches for individual devices.
- Fixed heights around variable text, controls, navigation, or project content.
- Viewport units without dynamic viewport fallbacks where mobile browser chrome matters.
- Absolute positioning for primary document layout.
- Hiding important information solely to avoid solving a responsive layout problem.
- Horizontal page scrolling, clipped focus rings, or media that controls the viewport width.

## Review checklist

- [ ] The layout is usable from narrow mobile through large desktop and short landscape.
- [ ] Breakpoints respond to content failure points, not arbitrary device names.
- [ ] Type, spacing, and containers scale fluidly where appropriate.
- [ ] Grid/Flexbox choices reflect the actual layout relationship.
- [ ] Text growth, zoom, long strings, media, and optional content do not cause accidental overflow.
- [ ] Mobile order and emphasis are intentional, and DOM order remains accessible.
