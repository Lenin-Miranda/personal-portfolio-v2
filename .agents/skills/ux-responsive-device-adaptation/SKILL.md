---
name: ux-responsive-device-adaptation
description: "Adapt frontend content, navigation, interactions, motion, density, performance, orientation, and touch behavior across desktop, mobile, tablet, and hybrid input devices. Use when responsive work changes how people navigate or interact, not only how boxes resize."
---

# UX Responsive and Device Adaptation

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Ensure each device class receives an intentional experience based on input, attention, reach, space, orientation, and performance constraints.

## Principles

- Viewport width does not reliably identify input method; design for capability rather than device stereotypes.
- Mobile content priority is a product decision, not a CSS stacking rule.
- Touch needs larger targets and stable surfaces; desktop can support denser information and precise hover enhancement.
- Orientation and browser chrome can materially change the usable viewport.
- Performance is part of responsive UX, especially for media and scroll-linked experiences.

## Implementation rules

1. Identify essential content and actions for narrow contexts, then preserve them before secondary decoration or detail.
2. Never make hover the only route to information or action. Gate hover enhancements with appropriate capability queries when behavior differs.
3. Design touch targets and spacing for reliable activation; avoid overlapping targets and important actions at unstable screen edges.
4. Simplify motion, sticky behavior, canvas work, and simultaneous media on constrained devices while preserving meaning.
5. Make mobile navigation easy to discover, operate with one hand where practical, dismiss, and resume without losing context.
6. Adapt information density: use disclosure, grouping, or concise summaries rather than indiscriminately hiding proof.
7. Test touch laptop/hybrid conditions, portrait and landscape, safe areas, dynamic viewport height, coarse pointers, reduced motion, and slower devices or networks where relevant.

## Anti-patterns

- Copying desktop hover, cursor, drag, or pinned-scroll behavior directly to touch.
- Device detection in JavaScript when responsive CSS or capability queries express the need.
- Hiding core project proof or contact actions on mobile to simplify the layout.
- Hamburger menus with unclear state, tiny close targets, lost focus, or background scrolling.
- Assuming all narrow screens are touch-only or all large screens have a mouse.
- Heavy animation and oversized media that make mobile feel like a degraded desktop version.

## Review checklist

- [ ] Core content and primary actions remain prominent at narrow widths.
- [ ] Touch, mouse, keyboard, and hybrid input paths are all viable.
- [ ] Hover is enhancement rather than a requirement.
- [ ] Navigation, disclosure, reach, targets, density, and scroll behavior suit the available space and input.
- [ ] Portrait, landscape, safe-area, browser-chrome, and dynamic viewport behavior are stable.
- [ ] Mobile performance and motion complexity are proportionate to the device context.
