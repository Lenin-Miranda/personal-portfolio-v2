import { expect, test, type Locator, type Page } from "@playwright/test";

type HeroProbe = {
  animationStarts: number;
  canvasPaints: number;
  layoutShift: number;
  maxOverflow: number;
};
type LayoutShiftEntry = PerformanceEntry & {
  hadRecentInput: boolean;
  value: number;
};

const errors = new WeakMap<Page, string[]>();
const hero = (page: Page) => page.locator(".hero");

test.beforeEach(async ({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on("pageerror", (error) => messages.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") messages.push(message.text());
  });
  await page.addInitScript(() => {
    const probe: HeroProbe = {
      animationStarts: 0,
      canvasPaints: 0,
      layoutShift: 0,
      maxOverflow: 0,
    };
    Object.defineProperty(window, "__heroProbe", { value: probe });
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (
      this: CanvasRenderingContext2D,
      ...args: Parameters<typeof clear>
    ) {
      if (this.canvas.closest(".particle-logo")) probe.canvasPaints++;
      return clear.apply(this, args);
    };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) probe.layoutShift += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    document.addEventListener("animationstart", (event) => {
      if (event.target instanceof Element && event.target.closest(".hero"))
        probe.animationStarts++;
    });
    document.addEventListener("DOMContentLoaded", () => {
      const sample = () => {
        probe.maxOverflow = Math.max(
          probe.maxOverflow,
          document.documentElement.scrollWidth - window.innerWidth,
        );
        if (document.querySelector('.hero[data-initialized="true"]')) return;
        requestAnimationFrame(sample);
      };
      sample();
    });
  });
});

test.afterEach(async ({ page }) => {
  expect(errors.get(page), "Hero should not produce browser errors").toEqual(
    [],
  );
});

/** Visibility alone does not detect transparent or fully masked text. */
async function expectReadable(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect
    .poll(() =>
      locator.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const text = range.getBoundingClientRect();
        const line = element.getBoundingClientRect();
        // Font ranges include unused ascent/descent outside a tight line-height.
        // Check the line's rendered height while preserving the actual text width.
        const textTop = Math.max(text.top, line.top);
        const textBottom = Math.min(text.bottom, line.bottom);
        let left = text.left;
        let right = text.right;
        let top = textTop;
        let bottom = textBottom;
        for (
          let current: Element | null = element;
          current;
          current = current.parentElement
        ) {
          const style = getComputedStyle(current);
          if (
            Number(style.opacity) < 0.95 ||
            style.visibility === "hidden" ||
            style.display === "none"
          )
            return false;
          // All spatial text masks must open fully in the readable state.
          if (style.clipPath !== "none") {
            const inset = style.clipPath.match(/^inset\(([^)]*)\)$/);
            if (
              !inset ||
              inset[1]
                ?.split("round")[0]
                ?.trim()
                .split(/\s+/)
                .some((value) => Number.parseFloat(value) > 0)
            )
              return false;
          }
          const bounds = current.getBoundingClientRect();
          if (["hidden", "clip"].includes(style.overflowX)) {
            left = Math.max(left, bounds.left);
            right = Math.min(right, bounds.right);
          }
          if (["hidden", "clip"].includes(style.overflowY)) {
            top = Math.max(top, bounds.top);
            bottom = Math.min(bottom, bounds.bottom);
          }
        }
        return (
          Math.max(right - left, 0) * Math.max(bottom - top, 0) >
          text.width * (textBottom - textTop) * 0.8
        );
      }),
    )
    .toBe(true);
}

async function expectHeroCopy(page: Page) {
  await expect(page.locator("#hero-title")).toContainText("Lenin Miranda");
  for (const content of [
    hero(page).getByText("Lenin Miranda", { exact: true }),
    hero(page).getByText("builds from interface", { exact: true }),
    hero(page).getByText("to infrastructure.", { exact: true }),
    hero(page).getByText("Full-stack software engineer", { exact: true }),
    hero(page).getByText(/^I build product interfaces/),
    hero(page).getByRole("link", { name: "Selected work", exact: true }),
    hero(page).getByRole("link", { name: "Start a conversation", exact: true }),
  ])
    await expectReadable(content);
}

async function expectSettled(page: Page) {
  await expect(hero(page)).toHaveAttribute("data-initialized", "true");
  await expect(hero(page).locator(".particle-logo")).toHaveAttribute(
    "data-settled",
    "true",
  );
  await expect
    .poll(() =>
      hero(page).evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter(
              (animation) =>
                animation.playState === "running" || animation.pending,
            ).length,
      ),
    )
    .toBe(0);
}

test("the introduction resolves into readable, still content without shifting the page", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectSettled(page);
  await expectHeroCopy(page);
  await page.evaluate(() => document.fonts.ready);
  const observation = await page.evaluate(async () => {
    const probe = Reflect.get(window, "__heroProbe") as HeroProbe;
    const before = probe.canvasPaints;
    // Give a stray canvas loop several opportunities to draw after settling.
    for (let frame = 0; frame < 8; frame++)
      await new Promise(requestAnimationFrame);
    return {
      before,
      after: probe.canvasPaints,
      animationStarts: probe.animationStarts,
      layoutShift: probe.layoutShift,
    };
  });
  expect(observation.after).toBe(observation.before);
  expect(observation.animationStarts).toBeGreaterThan(0);
  // Allow only negligible rounding noise, not visible movement of normal flow.
  expect(observation.layoutShift).toBeLessThanOrEqual(0.001);
});

test("reduced motion shows the final identity without playing the introduction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectSettled(page);
  await expectHeroCopy(page);
  expect(
    await page.evaluate(
      () => (Reflect.get(window, "__heroProbe") as HeroProbe).animationStarts,
    ),
  ).toBe(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the identity, positioning, logo fallback, and actions stay readable", async ({
    page,
  }) => {
    await page.goto("/");
    await expectHeroCopy(page);
    await expectReadable(hero(page).locator(".particle-logo-fallback"));
    await expect(
      hero(page).getByRole("link", { name: "Selected work", exact: true }),
    ).toHaveAttribute("href", "#work");
    await expect(
      hero(page).getByRole("link", {
        name: "Start a conversation",
        exact: true,
      }),
    ).toHaveAttribute("href", /^mailto:/);
  });
});

for (const viewport of [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
]) {
  test(`the Hero remains readable without horizontal overflow at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectSettled(page);
    await expectHeroCopy(page);
    expect(
      await page.evaluate(
        () => (Reflect.get(window, "__heroProbe") as HeroProbe).maxOverflow,
      ),
    ).toBeLessThanOrEqual(1);
    const overflow = await hero(page)
      .locator(
        ".hero-load-title, .hero-statement-line, .hero-intro > p, .hero-actions",
      )
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const bounds = range.getBoundingClientRect();
            return bounds.left < -1 || bounds.right > window.innerWidth + 1;
          })
          .map((element) => element.textContent),
      );
    expect(
      overflow,
      "Hero text and actions should fit within the viewport",
    ).toEqual([]);
  });
}

test("Selected work remains keyboard operable while the introduction is in progress", async ({
  page,
}) => {
  await page.addInitScript(() => {
    // Hold the intro so this interaction never races a fast or slow test machine.
    document.addEventListener("animationstart", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".hero"))
        return;
      event.target.getAnimations().forEach((animation) => animation.pause());
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const link = hero(page).getByRole("link", {
    name: "Selected work",
    exact: true,
  });
  await expect(hero(page)).not.toHaveAttribute("data-initialized", "true");
  await link.focus();
  await expect(link).toBeFocused();
  await link.press("Enter");
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});
