# Portfolio motion system

The portfolio uses a finite system initialization as its strongest motion moment. Experience and featured work retain useful orientation and media transitions; supporting work and About become progressively quieter. Native scrolling and the existing editorial design remain intact. This refinement changes presentation, not portfolio claims, and adds no runtime dependencies.

## Hero: one system coming online

`heroSequence.ts` defines the choreography and publishes it as CSS custom properties. `hero-motion.css` owns the SVG and typography sequence. `ParticleLogo` reads the same CSS animation clock, so delayed asset decoding does not launch a second introduction.

| Desktop cue | Behavior                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| 0–140ms     | The layout is already reserved; the architectural foundation begins to connect. Controls remain usable.                  |
| 140–760ms   | A single bright segment follows the primary path. Interface and Services activate as it arrives, opening their branches. |
| 760ms       | The signal reaches the LM junction and the particle mark resolves from short construction lanes.                         |
| 860ms       | Lenin Miranda opens through one vertical mask.                                                                           |
| 1080–1360ms | The paired positioning lines resolve; Interface briefly echoes and a continuation reaches Data alongside infrastructure. |
| 1350–1850ms | Supporting copy appears and the environment settles completely.                                                          |

There is no loading overlay, blocking intro, pointer parallax, particle repulsion, or repeating ambient signal. Initialization ends at about 1.85 seconds on desktop. Compact screens and short landscape layouts scale it to 65% (about 1.2 seconds), shorten masks, and use fewer logo points. Phone portrait also removes a supporting branch and label.

The architecture occupies one stable grid band and physically joins the LM junction. The diagram and identity recede by at most 12px during desktop native scrolling; the line-and-node vocabulary continues in the Experience timeline. A literal animated path morph was deliberately avoided: additional geometry coordination would not improve orientation. Compact and reduced-motion modes omit hero scroll recession.

Default CSS is the readable final state. Spatial entrances apply only when scripting is enabled and reduced motion is not requested. Reduced motion and no JavaScript expose architecture, fallback LM, and typography immediately, with no traveling signal. Focused hero actions become fully visible immediately.

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
- `ParticleLogo` caps work at 420 desktop points and 240 compact points, with a 1.5 DPR cap. It sleeps until the shared logo cue, stops after settling, pauses while hidden/offscreen, and redraws settled output after resize. Asset failure leaves a visible LM fallback.
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

Refinement validation on September 6, 2026: all four commands passed, including all 18 browser cases. Changed source and documentation also passed Prettier and `git diff --check`.

`apps/web/e2e/project-navigation.spec.ts` contains nine tests in desktop and phone profiles (18 cases): keyboard home/case/return, exact scroll and focus restoration, direct URLs, browser Back, reload, repeated activation/history integrity, reduced motion, unavailable View Transitions API, stalled image decoding, and a response delayed beyond the transition guard. Some tests cover multiple guarantees. Assertions poll observable outcomes instead of assuming animation timing; console/runtime errors fail the suite. See `apps/web/e2e/README.md` for traces and reporting.

Rendered viewport checks use 320×740, 390×844, 430×932, 768×1024, 844×390, and 1440×1000. Additional checks cover keyboard behavior, menu focus, the native dropdown, reduced motion, no JavaScript, pointer invariance, hero settling, and interruption. Phone profiles emulate Chromium; physical Safari and Android checks remain useful complementary coverage.

Contact verification used a ten-line message at 320px, 390px, and landscape widths, plus intercepted error and success responses. The complete review text remained visible, focus stayed visible, and no live email was sent.

## Refinement file inventory

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
