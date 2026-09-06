# Repository guidance

- Portfolio frontend: `apps/web`; pnpm/Turborepo, Next.js App Router, React, TypeScript, Tailwind CSS, and Motion.
- Read relevant version-matched Next.js guidance in `apps/web/node_modules/next/dist/docs` before changing framework behavior.
- Preserve portfolio data and verified claims. Do not invent clients, outcomes, metrics, or capabilities.
- Keep content in Server Components; isolate browser interaction work. Reuse the existing stack without adding runtime animation dependencies.
- Motion tokens and capability subscriptions live in `apps/web/src/app/components/motion`. See `docs/motion-system.md` for choreography, ownership, and navigation guarantees.
- Hero initialization is finite and has no pointer-following or particle-repulsion behavior. Pointer enhancements belong only to controls and project media.
- Preserve native scrolling, browser history, exact project-origin restoration, keyboard focus, mobile menu behavior, and readable reduced-motion/no-JavaScript output.
- Before completing frontend changes, inspect phone, tablet, desktop, and short landscape layouts. Check wrapping, overflow, keyboard focus, reduced motion, and interruption behavior.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test:e2e` when changing navigation or browser interactions. Browser tests build and serve production output locally.
- Contact tests must intercept requests; do not send real email during verification.
