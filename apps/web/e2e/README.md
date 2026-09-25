# Browser behavior tests

Install the test browser once after installing workspace dependencies:

```sh
pnpm --filter @portfolio/web exec playwright install chromium
```

Run from the repository root:

```sh
pnpm test:e2e
```

Playwright builds the production app and starts a separate server on `127.0.0.1:3100`. The server stops when the run finishes; keep that port available. The suite runs in desktop and phone Chromium profiles and checks:

- Keyboard navigation into a case study and back, with exact scroll and focus restoration.
- Direct URLs, native browser Back, and reloads.
- Repeated activation without duplicate history entries.
- Navigation with reduced motion or without the View Transitions API.
- Image decoding that never completes.
- Slow case-study responses that outlast the visual transition.
- Hero completion, readable final text, stopped CSS/canvas animation, and first-load layout stability.
- Reduced-motion and no-JavaScript Hero fallbacks.
- Hero overflow at narrow phone, tablet, and short landscape sizes.
- Keyboard navigation while the Hero introduction is still in progress.

Assertions wait for observable navigation outcomes. They do not depend on a fixed animation duration. Both profiles also fail on browser console or runtime errors. The phone profile emulates touch and viewport behavior in Chromium; it does not replace a device or Safari visual review.

Hero tests observe browser layout-shift entries and canvas paint activity. The intro-interaction test pauses CSS animation to keep its input check independent of machine speed. Visual composition and choreography still require watching the sequence.

To run one profile:

```sh
pnpm --filter @portfolio/web exec playwright test --project=desktop
```

On failure, screenshots and traces are saved under `apps/web/test-results/`. Open the local HTML report with:

```sh
pnpm --filter @portfolio/web exec playwright show-report
```

Generated reports and results are ignored by Git and ESLint.

## Prerequisites and troubleshooting

Install workspace dependencies from the root with the pinned pnpm version before installing Chromium. If the server cannot start, check that port `3100` is free; `reuseExistingServer` is disabled so the suite never silently reuses another process.

Run production builds and browser suites sequentially. A missing browser executable requires rerunning the install command above. Inspect the retained trace and screenshot for a failed assertion before increasing timeouts.

Contact-form tests must intercept requests instead of sending real email. Return to the [root README](../../../README.md) for environment and workspace setup.
