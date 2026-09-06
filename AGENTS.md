# Repository Guidance

## Project context

- This is a pnpm/Turborepo portfolio. The frontend is `apps/web`, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Motion.
- Preserve the existing stack and design direction unless the user's task explicitly calls for a change. Do not add runtime dependencies for ordinary styling or animation work when the current stack can handle it.
- Never invent portfolio claims, metrics, clients, testimonials, outcomes, or capabilities.

## Frontend skill routing

For frontend implementation, redesign, critique, or polish work, activate the smallest relevant set of repository skills from `.agents/skills`. Read each selected `SKILL.md` and its shared baseline before changing the interface.

When available and independently matched to the request, the existing broader `$design-taste-frontend`, `$impeccable`, `$emil-design-eng`, or `$redesign-existing-projects` skill may coordinate the overall frontend workflow. Use the repository skills below as the portfolio-specific decision and acceptance criteria; do not require a broader skill to be installed.

- Tokens and primitives: `$ui-design-system-engineering`
- Hierarchy and page composition: `$ui-visual-hierarchy-composition`
- CSS layout and breakpoint behavior: `$ui-advanced-responsive-layout`
- Type selection and text rhythm: `$ui-typography-engineering`
- React primitives and UI states: `$ui-component-architecture-states`
- Final rendered visual pass: `$ui-frontend-pixel-polish`
- Affordances and interaction feedback: `$ux-interaction-design`
- Animation and microinteractions: `$ux-motion-microinteractions`
- Narrative scroll sequences: `$ux-scroll-storytelling`
- Semantics, keyboard, contrast, and inclusive behavior: `$ux-accessibility-inclusive`
- Cross-device interaction adaptation: `$ux-responsive-device-adaptation`
- Portfolio journey and information architecture: `$ux-user-flow-architecture`

For a new page or broad redesign, begin with user flow, design system, visual hierarchy, typography, and responsive strategy. Add interaction, motion, scroll, or component skills only when the scope needs them. Always apply accessibility and device adaptation to interaction changes, and use pixel polish as the final visual review.

## Frontend completion standard

- Inspect existing components, content, assets, and styles before proposing a direction.
- Mobile must be intentionally composed, not merely a stacked desktop layout.
- Verify representative narrow, medium, and wide viewports; keyboard and focus behavior; content wrapping and overflow; and reduced motion when animation exists.
- Treat Linear, Stripe, Vercel, Apple, Notion, Framer, Raycast, and high-end portfolios as execution-quality references only. Do not clone their visual language.
