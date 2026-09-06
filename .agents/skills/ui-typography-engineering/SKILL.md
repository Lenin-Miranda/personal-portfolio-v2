---
name: ui-typography-engineering
description: "Establish or review polished frontend typography: font roles, hierarchy, weight, line-height, tracking, measure, contrast, labels, metadata, buttons, and responsive scaling. Use when selecting fonts, defining type tokens, or correcting text that feels generic, oversized, cramped, or inconsistent."
---

# UI Typography Engineering

Read [the shared frontend quality baseline](../_shared/frontend-quality-baseline.md) before making decisions.

## Purpose

Use typography as the primary structure and voice of the portfolio, with deliberate roles that remain readable and distinctive across devices.

## Principles

- Choose fonts for the content, brand voice, available licenses/files, and performance—not trend value.
- Create hierarchy through a combination of family, size, weight, leading, tracking, case, color, and space.
- Body copy needs a readable measure and rhythm before it needs visual novelty.
- Display type may be expressive, but it must not overpower the visitor's understanding of who the portfolio represents.
- Labels and metadata should be quiet without becoming illegible.

## Implementation rules

1. Audit loaded font files, fallbacks, font-display behavior, synthesized weights, and current roles before changing type.
2. Define a compact type scale for display, page heading, section heading, subheading, body, label, caption, metadata, and controls as needed.
3. Use fluid sizing only across bounded ranges. Set line-height and tracking per role instead of relying on browser or framework defaults.
4. Keep paragraphs at a comfortable measure, normally driven by characters rather than arbitrary container width. Protect rag quality in prominent copy.
5. Use weight and contrast sparingly so muted text still meets accessibility needs against its actual background.
6. Match button and navigation typography to interaction priority; preserve legibility at small sizes and avoid excessive tracking in long labels.
7. Verify font loading, fallback layout shift, zoom, long headings, and narrow-screen wrapping.

## Anti-patterns

- An enormous generic hero heading used as the entire identity.
- Too many families, weights, uppercase treatments, or unrelated type scales.
- Tight line-height on wrapping headings or wide, low-leading body paragraphs.
- Arbitrary tracking, especially on body copy or long uppercase text.
- Muted text with insufficient contrast or metadata made tiny to appear refined.
- Depending on an unavailable licensed font without a credible fallback.

## Review checklist

- [ ] Every text style has a clear semantic role and belongs to a compact scale.
- [ ] Font selection, loading, available weights, and fallbacks are intentional.
- [ ] Headings wrap cleanly without dominating the composition by default.
- [ ] Paragraph measure, leading, and contrast support sustained reading.
- [ ] Labels, captions, metadata, buttons, and navigation remain legible and consistent.
- [ ] Typography responds gracefully across widths, zoom levels, and font-loading states.
