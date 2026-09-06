# Portfolio motion system

The existing editorial layout and schematic identity now share one motion vocabulary. Portfolio data, project claims, runtime dependencies, and native scrolling remain unchanged.

## Vocabulary

`apps/web/src/app/components/motion/tokens.ts` is the source for Motion and CSS. The server root layout exposes its values as custom properties.

| Token     | Duration | Purpose                               |
| --------- | -------- | ------------------------------------- |
| micro     | 120ms    | Small state feedback                  |
| fast      | 180ms    | Controls and exits                    |
| standard  | 280ms    | Navigation and form steps             |
| reveal    | 600ms    | Supporting content and media          |
| section   | 700ms    | Heading masks and shared media        |
| cinematic | 850ms    | Hero environment and project settling |

The shared exit curve is `[0.16, 1, 0.3, 1]`. Tight and content stagger intervals are 55ms and 85ms. Small, content, and hero distances are 8px, 20px, and 32px. Soft, snappy, and magnetic springs are available centrally.

`Reveal` maintains the existing component API. Metadata, body copy, and headings have different distances and durations. `MaskedReveal` supports `rise`, `line`, and `quiet`; About uses the quiet pattern while Work and Contact introduce line masks. Phone distances, durations, and staggers shorten. Important focused controls reveal immediately.

## Choreography and interactions

- Hero: schematic paths connect before nodes activate; adjacent data lanes resolve into the LM mark; identity and paired positioning lines open through masks; supporting content and actions follow. The sequence finishes around one second without a loading overlay.
- Hero depth: cached bounds, time-based interpolation, small opposing layer offsets, native-scroll recession, and visibility-aware scheduling. Canvas particles settle completely; resize does not replay the entrance.
- Experience: the existing continuity controller also progresses a vertical timeline and prioritizes the current entry through its node. Metadata leads the masked role and detailed proof. Copy keeps full reading contrast.
- Continuity: restrained surface handoffs and a vertical progress indicator in the desktop gutter. Phones use navigation context without a floating reading overlay. About principles stay still, and its excessive desktop minimum heights are reduced.
- Projects: numbers lead a media mask and scale settle; engineering details follow tightly. Fine-pointer interaction stays near one degree and three pixels, with a short cursor-responsive border accent.
- Routes: the existing native View Transitions API uses project media as its anchor. The Selected work link returns through matching history with the exact saved scroll position. Direct visits return to the matching project. Browser Back stays native and can interrupt an active transition.
- Navigation: the fixed header surface compacts without changing document geometry. Upward scrolling and keyboard focus strengthen navigation; the active section gains a thin underline.
- Actions: magnetic labels move at most three pixels inside stable link targets. Underlines, arrows, pressed states, and focus feedback share timing.
- Contact: a progressing divider introduces the finale. Form steps move in the direction of navigation; focus transfers when the next stage mounts. Pending, error, success, and reset states remain explicit and accessible.

The native cursor is retained. A custom cursor did not add useful orientation to this portfolio.

## Implementation decisions

Server content components remain server components. Client code owns only interaction, animation, and transient state. No additional runtime libraries were added.

`useMotionCapabilities` shares three live media-query subscriptions across consumers. Pointer effects require fine-pointer/hover capability, and meaningful scroll effects have compact/reduced alternatives. Hero canvas work is bounded to 420 points on desktop and 220 on compact screens, and both canvas and pointer loops stop when idle, offscreen, or hidden.

The continuity controller caches geometry and schedules one pass per scroll frame; it also drives the experience timeline, avoiding another scroll listener. Its progress node uses transforms. Hover effects that animated row padding were removed.

Route transitions have an 1800ms safety bound, a bounded image decode wait, cleanup on interruption, single-navigation guards, entry-specific origin validation, and normal routing fallbacks. They never await requestAnimationFrame inside the browser snapshot callback, where rendering can be suspended.

Reduced motion removes parallax, complex route transitions, continuous animation, and spatial reveals. CSS also exposes content before hydration, and a noscript fallback exposes server-rendered copy and media. Keyboard navigation, mobile menu focus trapping, form validation and live status announcements remain intact. Contact testing used intercepted responses, with no real email sent.

## File inventory

Created:

- `apps/web/src/app/components/motion/tokens.ts`
- `apps/web/src/app/components/motion/useMotionCapabilities.ts`
- `apps/web/src/app/components/MagneticLink.tsx`
- `apps/web/src/app/components/hero-motion.css`
- `apps/web/src/app/components/narrative-motion.css`
- `apps/web/src/app/components/navigation-contact-motion.css`
- `apps/web/src/app/components/project-motion.css`
- `docs/motion-system.md`

Significantly modified:

- Hero: `Hero.tsx`, `HeroInteraction.tsx`, `ParticleLogo.tsx`
- Shared narrative: `Reveal.tsx`, `SectionContinuity.tsx`, `ExperienceSection.tsx`, `AboutSection.tsx`
- Projects: `ProjectCard.tsx`, `ProjectVisual.tsx`, `ProjectsShowcase.tsx`, `ProjectRouteTransition.ts`, `ProjectTransitionLink.tsx`, `ProjectBackLink.tsx`, `ProjectCaseStudyHero.tsx`, `ProjectCaseStudy.tsx`
- Navigation/contact: `SiteHeader.tsx`, `ContactSection.tsx`, `ContactForm.tsx`
- App styling: `globals.css`, `layout.tsx`

## Verification

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- Prettier check on changed frontend files and this document.
- Production browser checks also cover normal touch reveals, stationary touch depth, and server-rendered content without JavaScript.
- Rendered checks at 1440×1000, 1280×633, 768×1024, 390×844, 320×740, and 844×390.
- Keyboard/focus, active navigation, mobile menu focus trap and Escape restoration, content wrapping and overflow, initial and live reduced-motion changes.
- Project navigation, exact origin restoration, direct visits, browser Back interruption, unavailable/throwing native API, repeated activation, slow routes, and indefinitely pending image decode.
- Contact field validation, forward/back value retention, review, pending state, mocked failure recovery, mocked success, reset, and focus handoffs.

A sandboxed Turbopack build initially failed because its CSS worker could not bind a local port. After moving aside that failed cache and running with normal process permissions, the production build passed. No application configuration was changed for this environment issue.

Browser evidence and ad hoc verification scripts are under `/private/tmp/portfolio-motion-checks` and `/private/tmp/portfolio-navigation-checks`; they are not runtime dependencies or repository test scaffolding.

## Follow-up quality work

Measure LCP, INP, and CLS on the deployed build under representative network conditions before making comparative performance claims. A physical iPhone/Safari and Android/Chrome pass would complement the Chromium viewport and capability checks. Future case-study footage can improve project proof when authentic recordings become available.
