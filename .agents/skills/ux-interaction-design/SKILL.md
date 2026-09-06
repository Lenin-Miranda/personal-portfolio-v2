---
name: ux-interaction-design
description: "Design or review predictable frontend interactions, affordances, click and navigation feedback, progressive disclosure, cursors, state changes, and transition behavior. Use when adding or changing interactive controls, navigation, disclosure, selection, or direct manipulation."
---

# UX Interaction Design

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Make every interaction discoverable, responsive, and unsurprising while keeping the interface calm enough for portfolio content to lead.

## Principles

- A control's appearance, label, placement, and cursor should communicate what will happen before activation.
- Feedback should begin immediately, even when completion is asynchronous.
- Interaction priority should mirror task priority; not every element deserves equal emphasis or motion.
- Progressive disclosure should reduce cognitive load without hiding information visitors need to decide.
- Similar actions must behave consistently across the site and input methods.

## Implementation rules

1. Define the trigger, expected result, feedback, completion state, cancellation path, and failure behavior for each interaction.
2. Use native links for navigation and buttons for actions. Keep labels outcome-oriented and make external, download, or destructive behavior clear when relevant.
3. Provide visible hover where hover exists, focus-visible for keyboard users, pressed/active feedback, disabled semantics, and a truthful busy state.
4. Keep optimistic feedback reversible or reconcile it clearly when the underlying action fails.
5. Use progressive disclosure only when the hidden content is secondary and the trigger communicates expanded/collapsed state.
6. Preserve context through navigation, filtering, selection, or back behavior. Avoid surprising scroll or focus jumps.
7. Verify mouse, keyboard, touch, and assistive-technology behavior as applicable.

## Anti-patterns

- Clickable surfaces with no visible affordance or with misleading cursors.
- Hover-only actions or information.
- Animations standing in for state labels, selection indicators, or completion feedback.
- Disabled controls with no explanation when the next step is not obvious.
- Whole cards made clickable when they contain nested actions with conflicting targets.
- Links that unexpectedly download, open a new context, or change state without a cue.
- Delayed visual feedback that makes the interface feel unresponsive.

## Review checklist

- [ ] Every interactive element communicates whether it navigates, acts, selects, or reveals.
- [ ] Hover, focus-visible, active/pressed, disabled, busy, success, and failure feedback exist where applicable.
- [ ] Labels and cursors match actual behavior.
- [ ] Progressive disclosure preserves access to important information and exposes state.
- [ ] Navigation, focus, and scroll context remain predictable.
- [ ] Mouse, keyboard, and touch paths produce equivalent outcomes.
