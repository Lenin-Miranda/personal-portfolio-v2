---
name: ui-design-system-engineering
description: "Establish or review frontend design tokens, visual primitives, component variants, and systematic spacing, type, color, radius, border, shadow, grid, container, and icon decisions. Use when creating shared styles, building multiple related components, or correcting inconsistent arbitrary values."
---

# UI Design System Engineering

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Turn repeated visual decisions into a coherent, maintainable system without flattening the portfolio's identity. Apply the smallest token and primitive set that supports the real interface.

## Principles

- Name tokens by role when their meaning matters: surface, text, muted text, border, accent, success, warning, and error.
- Separate foundations from component choices. A button variant may consume spacing and color tokens but should not redefine them.
- Use a bounded scale with intentional exceptions. Tokens are a decision tool, not a reason to force every value onto a mathematical sequence.
- Prefer semantic variants over a collection of boolean props or one-off utility clusters.
- Preserve useful existing conventions before introducing a new abstraction.

## Implementation rules

1. Inventory repeated values and existing CSS variables, Tailwind theme values, component APIs, and layout constraints before adding tokens.
2. Define only tokens with at least one clear consumer or an imminent, demonstrated need. Use CSS custom properties or the project's Tailwind 4 theme conventions as appropriate.
3. Establish coherent scales for spacing, typography, radii, borders, shadows, container widths, breakpoints, grid gaps, control heights, and icon sizes.
4. Keep semantic color pairs legible in every used state. Include foreground values for filled surfaces and status colors.
5. Standardize component dimensions and variants at the primitive boundary. Keep escape hatches explicit and rare.
6. Document any deliberately exceptional value beside the code when its reason would otherwise be lost.
7. Avoid adding a component library or token dependency unless the requested scope justifies its runtime and maintenance cost.

## Anti-patterns

- Unrelated values such as `19px`, slightly different grays, or near-duplicate radii with no compositional reason.
- A token for every raw value, producing aliases that hide rather than reduce inconsistency.
- Color names such as `gray-2` in component APIs when the role is what consumers need.
- Component variants that combine incompatible concerns or allow invalid visual states.
- Changing the entire system to solve a single local exception.
- Heavy shadows, gradients, or rounded containers becoming the default visual primitive.

## Review checklist

- [ ] Repeated values use an intentional shared token or primitive.
- [ ] Spacing, typography, colors, radii, borders, shadows, containers, grids, control heights, and icon sizes form coherent scales.
- [ ] Semantic colors include accessible foreground and interaction states.
- [ ] Component variants have clear names and do not permit contradictory combinations.
- [ ] Exceptions have a concrete visual or functional reason.
- [ ] No unnecessary runtime dependency or speculative abstraction was added.
