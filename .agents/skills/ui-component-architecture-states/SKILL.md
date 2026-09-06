---
name: ui-component-architecture-states
description: "Design or review reusable React UI primitives, composition APIs, variants, and complete interactive states for buttons, cards, forms, dialogs, navigation, badges, tabs, menus, and tooltips. Use when a frontend change repeats patterns, introduces interactions, or needs consistent loading, empty, success, warning, and error behavior."
---

# UI Component Architecture and States

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Create components that express product intent through clear APIs, sound semantics, and complete states without premature abstraction.

## Principles

- Abstract repeated behavior or meaning, not superficial markup coincidence.
- Prefer composition and small semantic variants over highly configurable monoliths.
- Keep native element behavior unless a custom interaction provides real value.
- State is part of the component contract and must be designed before implementation is considered complete.
- Accessibility, focus management, and async behavior belong inside the component architecture.

## Implementation rules

1. Search for existing primitives and patterns before adding a new component.
2. Define the semantic element, controlled/uncontrolled behavior, variant model, size model, and content slots before expanding the API.
3. Cover applicable default, hover, focus-visible, active, disabled, loading, success, warning, error, and empty states. Do not invent irrelevant states merely to complete a matrix.
4. Prevent invalid combinations through TypeScript types, constrained variants, or composition.
5. Preserve ref forwarding, names, labels, keyboard behavior, focus restoration, and escape/outside-click behavior where the pattern requires them.
6. Keep server and client component boundaries narrow in Next.js. Add `use client` only where state, browser APIs, or interaction requires it.
7. Test state transitions, rapid repeated actions, async failure, long content, missing optional content, and disabled behavior.

## Anti-patterns

- One-off buttons, cards, or form controls that differ only through copied class strings.
- A universal component with many booleans, implicit behavior, or contradictory variants.
- Clickable `div` elements, disabled controls that still act, or loading states that permit duplicate submission.
- Hover-only disclosure, invisible focus, or tooltips containing required information.
- Card abstractions that turn every piece of content into the same rounded container.
- Client-side state and dependencies added to components that can remain server-rendered.

## Review checklist

- [ ] Existing primitives were reused or deliberately extended where appropriate.
- [ ] Component semantics, API, variants, and ownership of state are clear.
- [ ] Every applicable interaction, async, feedback, and empty state is implemented.
- [ ] Keyboard, focus, labeling, disabled, and dismissal behavior are correct.
- [ ] TypeScript prevents or clearly handles invalid combinations.
- [ ] The abstraction reduces inconsistency without erasing meaningful design differences.
