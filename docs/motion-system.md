# Portfolio motion system

The portfolio uses a finite system initialization as its strongest motion moment. Experience and featured work retain useful orientation and media transitions; supporting work and About become progressively quieter. Native scrolling and the existing editorial design remain intact. This refinement changes presentation, not portfolio claims, and adds no runtime dependencies.

## Hero: system discovery becomes identity

The signature opening transforms the composition itself. A large architecture occupies the title's reserved area; a diagnostic scan reveals it, one signal traverses Interface → Services → AI/Processing → Data, and the graph converges into LM. Typography then takes over the same visual space. Controls stay usable throughout.

`HeroArchitecture.tsx` owns two intentional diagram compositions: the large temporary discovery stage and the restrained resting rail. `heroSequence.ts` publishes a shared CSS clock. The canvas reads that clock, so delayed assets or hydration join the current phase instead of launching a separate introduction.

| Desktop cue | Behavior                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–80ms      | Final document dimensions already exist. Grid is dormant; actions and navigation are usable.                                                                          |
| 80–560ms    | A thin scan moves across the title area, revealing routes, sparse coordinates, node outlines, and labels through a clipping mask.                                     |
| 580–1280ms  | One accent segment follows the primary system route and activates its four software-layer nodes before reaching the identity junction.                                |
| 1280–1800ms | The whole graph contracts and travels toward the actual LM center. Its main path retracts into a final fragment. Temporary labels disappear early in the convergence. |
| 1450–2055ms | Three construction lanes feed structured particle streams into LM while the last diagram fragments are still converging.                                              |
| 1580–2220ms | The name claims the center with a horizontal wipe, a 0.96-scale start, and a small controlled settle. No letter-by-letter motion or blur is used.                     |
| 1910–2450ms | Interface resolves alongside its node echo; infrastructure resolves alongside the Services/AI/Data signal continuation and completion tick.                           |
| 2140–2500ms | Supporting copy becomes visible; the entire sequence stops.                                                                                                           |

| Before                                 | After                                                                        | Why                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| A small animated strip above the title | Architecture temporarily occupies the title area, then converges into LM     | The entire composition changes before the identity takes over.           |
| Logo points moved only a few pixels    | Three grid-aligned source rows feed inward and bend into the glyph           | The graph and particles share a visible transfer.                        |
| A vertical name mask                   | One editorial name object uses a horizontal wipe and restrained scale settle | Typography becomes the second focal event without per-letter decoration. |

The introduction lasts 2.5 seconds on desktop and 1.6 seconds on compact/short landscape layouts (64% time scale). Phone portrait has its own three-node routing geometry, combining Services/AI, fewer coordinate marks, 240 particles, and shorter travel. Tablet keeps the four-layer route with reduced branches and coordinate emphasis. Short landscape uses a lower stage and the compact clock.

The discovery layer is absolute. `HeroInteraction` measures the mark and stage once per geometry change, stores the collapse destination locally on the stage, and never reads layout in the animation loop. Convergence uses transforms and SVG stroke retraction. The final rail stays attached to the LM frame. Desktop native scrolling retains the existing recession of at most 12px; compact and reduced-motion modes omit it.

Default CSS is the readable final state. Reduced motion and no JavaScript hide discovery, scan, signal travel, construction lanes, and spatial typography effects. Architecture, LM fallback, identity, copy, and actions remain immediately available. There is no loading overlay, pointer parallax, particle repulsion, repeat pulse, or ambient loop.

## Shared vocabulary and restraint

`components/motion/tokens.ts` supplies Motion values and root CSS custom properties.

| Token     | Duration | Purpose                                 |
| --------- | -------- | --------------------------------------- |
| micro     | 120ms    | Small state feedback                    |
| fast      | 180ms    | Controls and exits                      |
| standard  | 280ms    | Navigation, form steps, node activation |
| reveal    | 600ms    | Headings, supporting copy, media        |
| section   | 700ms    | Section masks and shared media          |
| cinematic | 850ms    | Featured media settling                 |

The shared exit curve is `[0.16, 1, 0.3, 1]`. Stagger intervals are 55ms and 85ms; displacement tokens are 8px, 20px, and 32px. Existing Reveal APIs remain. Phone effects shorten, and focused controls reveal immediately.

Retained: active Experience timeline, restrained section surface handoffs, featured media masks, small control feedback, native shared-media navigation, active navigation, and directional contact steps.

Removed: hero pointer depth, logo repulsion, duplicate section content movement, repetitive secondary-project and capability reveals, technology stagger, logo hover twist, and excess continuity-rail choreography. The native cursor remains.

## Layout and hierarchy

- Experience dates, roles, and evidence align at their top edge. Content determines row height; former viewport-sized heading and row minimums are removed.
- Work, Experience, About, Contact, and case studies use distinct spacing. Case media and narrative rows no longer reserve arbitrary tall minimums.
- Section, project, case-study, and contact type scales use calmer maxima and readable line heights. Mobile headings have dedicated wrapping.
- Tablet projects place media above proof instead of squeezing engineering detail into a narrow adjacent column. Responsive image sizes follow that layout.
- Featured projects place the case-study action after positioning, followed by engineering evidence and a semantic, wrapping technology list. Secondary project rows remain still.
- Mobile capability headings use the full width. The five-step contact flow remains; review shows the complete message instead of clipping it to four lines.

## Ownership and performance

Content remains in Server Components where practical; browser behavior is isolated in client components.

- `HeroInteraction` owns native-scroll recession, cached geometry, sequence completion, and visibility/capability lifecycle. There are no hero pointer listeners or `--hero-x`, `--hero-y`, or `--hero-active` variables.
- `ParticleLogo` caps work at 420 desktop points and 240 compact points, with a 1.5 DPR cap. Its three source rows match the SVG lanes at 28%, 50%, and 72% of mark height. Grid-aligned points travel roughly 36–80px on desktop and 30–47px on compact layouts, first along a row, then through a controlled curve into LM. It sleeps until the shared logo cue, pauses while hidden/offscreen, and stops after settling. A settled latch prevents replay on later resize or preference changes. Asset failure leaves a visible LM fallback.
- `useMotionCapabilities` shares live media-query subscriptions. `ProjectVisual` keeps its shared media DOM stable; `ProjectVisualInteraction` mounts only with a fine hover pointer, noncompact viewport, and no reduced-motion preference. Unsupported modes mount none of that controller's scroll, spring, or pointer hooks. Capability changes clean listeners and styles.
- `SectionContinuity` keeps one scheduled scroll pass and cached measurements for surfaces, Experience progress, and the rail. Named helpers clarify ownership without multiplying hooks/listeners. It shrank from 416 to 272 lines. The rail uses a simple chapter number and progress; contrast follows the actual surface beneath its midpoint, including section handoffs. Tablet, phone, and reduced-motion modes hide it.
- Geometry reads occur during measurement or pointer entry, not repeatedly during scroll rendering. Hidden documents pause scheduled work. No permanent hero loop, WebGL, or new rendering framework is used.

These are implementation bounds, not measured field-performance claims. Measure deployed LCP, INP, and CLS before making comparisons.

## Navigation, contact, and accessibility

Native View Transitions remain the shared-media navigation mechanism. Safeguards include an 1800ms animation bound, bounded image decode, interruption cleanup, repeated-activation guards, history-entry origin validation, and ordinary routing fallback. The snapshot callback never waits for requestAnimationFrame, because rendering can be suspended during snapshot capture.

Selected work restores the saved scroll position and initiating link focus. Direct case-study visits return to the matching project. Browser Back remains native, and reload preserves originating history data.

Origin recording is independent of the animation timeout: a matching case-study mount consumes its pending origin even after a slow response outlasts the snapshot guard. Browser history interruption or page exit cancels pending context. This adds no delayed focus, scrolling, or navigation.

The header compacts after 56px and expands below 32px, with a separate 12px direction deadband. This prevents tiny scroll changes from flickering its state. Active section, keyboard visibility, mobile focus trap, Escape dismissal, and focus restoration remain intact.

Contact keeps validation, announcements, explicit pending/error/success states, and focus handoffs. Enter on the intent dropdown retains native select behavior; Next advances the step. Review exposes the entire message. Test submissions must be intercepted; do not send live email for verification.

## Verification

Run from the root:

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

Install Chromium once with `pnpm --filter @portfolio/web exec playwright install chromium`. Browser tests also build production output, start an isolated server on port 3100, and stop it when finished. Avoid concurrent production builds using the same `.next` directory.

Signature Hero validation on September 6, 2026: all four commands passed, including all 36 browser cases (18 Hero and 18 project-navigation cases). Changed source and documentation also passed Prettier and `git diff --check`.

`apps/web/e2e/project-navigation.spec.ts` contains nine tests in desktop and phone profiles (18 cases): keyboard home/case/return, exact scroll and focus restoration, direct URLs, browser Back, reload, repeated activation/history integrity, reduced motion, unavailable View Transitions API, stalled image decoding, and a response delayed beyond the transition guard. Some tests cover multiple guarantees. Assertions poll observable outcomes instead of assuming animation timing; console/runtime errors fail the suite. See `apps/web/e2e/README.md` for traces and reporting.

`apps/web/e2e/hero.spec.ts` adds completed/readable content, stopped CSS/canvas work, first-load layout stability, reduced motion with no animation starts, no-JavaScript fallback, five viewport bounds checks, and keyboard navigation while the intro is paused. Its assertions wait for observable states and do not require exact animation timing.

Rendered viewport checks use 320×740, 390×844, 430×932, 768×1024, 844×390, and 1440×1000. Additional checks cover keyboard behavior, menu focus, the native dropdown, reduced motion, no JavaScript, pointer invariance, hero settling, and interruption. Phone profiles emulate Chromium; physical Safari and Android checks remain useful complementary coverage.

Contact verification used a ten-line message at 320px, 390px, and landscape widths, plus intercepted error and success responses. The complete review text remained visible, focus stayed visible, and no live email was sent.

## Signature Hero file inventory

Created:

- `apps/web/src/app/components/HeroArchitecture.tsx`
- `apps/web/e2e/hero.spec.ts`

Modified:

- `apps/web/src/app/components/Hero.tsx`
- `apps/web/src/app/components/HeroInteraction.tsx`
- `apps/web/src/app/components/ParticleLogo.tsx`
- `apps/web/src/app/components/heroSequence.ts`
- `apps/web/src/app/components/hero-motion.css`
- `apps/web/e2e/README.md`
- `docs/motion-system.md`

The signature pass preserves portfolio copy, project data, navigation behavior, contact behavior, the existing motion primitives, and all previous project tests. It adds no dependency.

## Previous refinement file inventory

Created:

- `apps/web/src/app/components/heroSequence.ts`
- `apps/web/src/app/components/ProjectVisualInteraction.tsx`
- `apps/web/playwright.config.ts`
- `apps/web/e2e/project-navigation.spec.ts`
- `apps/web/e2e/README.md`

Significantly modified:

- Hero: `Hero.tsx`, `HeroInteraction.tsx`, `ParticleLogo.tsx`, `hero-motion.css`.
- Content and narrative: `AboutSection.tsx`, `ProjectCard.tsx`, `ProjectVisual.tsx`, `ProjectsShowcase.tsx`, `SectionContinuity.tsx`, `narrative-motion.css`, `globals.css`.
- Navigation/contact: `SiteHeader.tsx`, `ContactForm.tsx`, `ProjectRouteTransition.ts`, `ProjectCaseStudyHero.tsx`.
- Tooling/documentation: root and web `package.json`, `pnpm-lock.yaml`, `.gitignore`, `apps/web/eslint.config.mjs`, `apps/web/next.config.ts`, `AGENTS.md`, `README.md`, and this document.

Removed after checking references:

- `.agents/skills/_shared/frontend-quality-baseline.md`.
- `.agents/skills/ui-advanced-responsive-layout/SKILL.md`
- `.agents/skills/ui-component-architecture-states/SKILL.md`
- `.agents/skills/ui-design-system-engineering/SKILL.md`
- `.agents/skills/ui-frontend-pixel-polish/SKILL.md`
- `.agents/skills/ui-typography-engineering/SKILL.md`
- `.agents/skills/ui-visual-hierarchy-composition/SKILL.md`
- `.agents/skills/ux-accessibility-inclusive/SKILL.md`
- `.agents/skills/ux-interaction-design/SKILL.md`
- `.agents/skills/ux-motion-microinteractions/SKILL.md`
- `.agents/skills/ux-responsive-device-adaptation/SKILL.md`
- `.agents/skills/ux-scroll-storytelling/SKILL.md`
- `.agents/skills/ux-user-flow-architecture/SKILL.md`

These were generic agent workflow artifacts referenced only within that guidance collection.

The concise root `AGENTS.md` remains because it records repository-specific maintenance rules. Next.js `agentRules: false` prevents duplicate generated `apps/web/AGENTS.md` and `CLAUDE.md` artifacts; root guidance still directs maintainers to bundled version-matched framework docs. Existing runtime motion primitives remain. Playwright is the only new development dependency.
