---
name: ux-accessibility-inclusive
description: "Implement or audit accessible frontend semantics, keyboard navigation, visible focus, screen-reader behavior, contrast, reduced motion, touch targets, forms, labels, errors, and logical tab order. Use for every meaningful UI interaction and whenever reviewing frontend quality or inclusive UX."
---

# UX Accessibility and Inclusive Design

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Make the portfolio understandable and operable across input methods, assistive technologies, sensory needs, zoom levels, and device constraints as a core measure of quality.

## Principles

- Use native HTML semantics before ARIA or custom widgets.
- Keyboard and screen-reader paths must preserve the same information and outcome as pointer interaction.
- Focus is a visible, managed state, not a browser artifact to suppress.
- Color, motion, position, and sound cannot be the only carriers of meaning.
- Accessibility fixes should address the interaction model, not merely satisfy an automated checker.

## Implementation rules

1. Choose landmarks, heading levels, lists, links, buttons, labels, and form elements for their actual meaning.
2. Add ARIA only when native semantics cannot express the required name, role, state, or relationship. Never use ARIA to repair the wrong element.
3. Maintain logical DOM and tab order. Move focus only for a user-initiated context change, and restore it when dialogs or transient layers close.
4. Provide a clearly visible `:focus-visible` treatment that is not clipped by overflow. Include skip navigation when repeated navigation warrants it.
5. Validate text, UI component, focus-indicator, and state contrast against actual backgrounds. Do not rely on opacity assumptions.
6. Pair form controls with persistent labels, useful instructions, programmatically associated errors, and a clear correction path.
7. Provide generous touch targets, reduced-motion behavior, text zoom/reflow, alternative text for meaningful imagery, and empty alt text for decorative imagery.
8. Combine automated checks with keyboard traversal, zoom/reflow, reduced motion, and targeted screen-reader inspection.

## Anti-patterns

- Clickable non-interactive elements, positive `tabindex`, or custom controls that omit standard keys.
- Placeholder-only labels or errors conveyed only by red borders.
- Removing outlines without an equally visible replacement.
- Redundant or incorrect roles, verbose ARIA, or alt text that repeats adjacent copy.
- Hover-only content, tiny controls, auto-playing motion, or focus trapped behind an overlay.
- Visual CSS reordering that contradicts DOM reading and tab order.
- Declaring accessibility complete because a scanner reports zero violations.

## Review checklist

- [ ] Landmarks, headings, controls, lists, and links use correct native semantics.
- [ ] The entire flow works by keyboard with visible, unclipped focus and logical order.
- [ ] Names, roles, states, errors, and updates are conveyed to assistive technology.
- [ ] Text, controls, states, and focus indicators have sufficient contrast.
- [ ] Forms, images, touch targets, zoom/reflow, and reduced motion are handled intentionally.
- [ ] Automated results are supplemented by manual interaction checks.
