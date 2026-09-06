import { expect, test, type Page } from "@playwright/test";

const project = { slug: "impostor-futbol", title: "Impostor Fútbol Online" };
const casePath = `/projects/${project.slug}`;
const caseLink = (page: Page) =>
  page.getByRole("link", {
    name: `View ${project.title} case study`,
    exact: true,
  });
const backLink = (page: Page) =>
  page
    .getByRole("region", { name: project.title, exact: true })
    .getByRole("link", { name: "Selected work", exact: true });
const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(
    pageErrors.get(page),
    "The browser should not report runtime errors",
  ).toEqual([]);
});

async function prepareProject(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const link = caseLink(page);
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await expect(link).toBeInViewport();
  return page.evaluate(() => Math.round(window.scrollY));
}

async function expectCaseStudy(page: Page, focused = true) {
  await expect(page).toHaveURL(new RegExp(`${casePath}$`));
  const heading = page.getByRole("heading", { name: project.title, level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");
  if (focused) await expect(heading).toBeFocused();
}

async function expectOrigin(page: Page, scrollY: number, focused = true) {
  await expect(page).toHaveURL(/\/$/);
  const link = caseLink(page);
  if (focused) await expect(link).toBeFocused();
  // Poll the resulting position rather than sleeping for a specific animation.
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)))
    .toBe(scrollY);
  await expect(link).toBeInViewport();
}

test("keyboard opens a case study and Selected work restores the exact reading position", async ({
  page,
}) => {
  const origin = await prepareProject(page);
  expect(origin).toBeGreaterThan(0);
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await expect(
    page.getByRole("heading", { name: "Engineering challenge", exact: true }),
  ).toBeVisible();
  await backLink(page).click();
  await expectOrigin(page, origin);
});

test("a direct case-study visit returns to its matching homepage project", async ({
  page,
}) => {
  await page.goto(casePath);
  await expectCaseStudy(page, false);
  await backLink(page).click();
  await expect(page).toHaveURL(new RegExp(`/#${project.slug}$`));
  await expect(page.locator(`#${project.slug}`)).toBeInViewport();
  await expect(caseLink(page)).toBeFocused();
});

test("browser Back retains the original homepage reading position", async ({
  page,
}) => {
  const origin = await prepareProject(page);
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await page.goBack();
  await expectOrigin(page, origin, false);
});

test("a reload preserves the originating project and scroll position", async ({
  page,
}) => {
  const origin = await prepareProject(page);
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await page.reload();
  await expectCaseStudy(page, false);
  await backLink(page).click();
  await expectOrigin(page, origin);
});

test("rapid repeated activation creates one visit and one return", async ({
  page,
}) => {
  const origin = await prepareProject(page);
  const historyLength = await page.evaluate(() => history.length);
  await caseLink(page).evaluate((element: HTMLAnchorElement) => {
    element.click();
    element.click();
    element.click();
  });
  await expectCaseStudy(page);
  expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
  await backLink(page).click();
  await expectOrigin(page, origin);
});

test("navigation and exact restoration work without the View Transitions API", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    });
  });
  const origin = await prepareProject(page);
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await backLink(page).click();
  await expectOrigin(page, origin);
});

test("reduced motion exposes content and skips native spatial transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const record = { calls: 0 };
    Object.defineProperty(window, "__nativeTransitionRecord", {
      value: record,
    });
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = (...args) => {
      record.calls++;
      return original(...args);
    };
  });
  const origin = await prepareProject(page);
  await expect(page.locator(`#${project.slug} .project-image-frame`)).toHaveCSS(
    "transform",
    "none",
  );
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await expect(
    page.getByRole("heading", { name: project.title, level: 1 }),
  ).toHaveCSS("transform", "none");
  await backLink(page).click();
  await expectOrigin(page, origin);
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __nativeTransitionRecord?: { calls: number } })
          .__nativeTransitionRecord?.calls,
    ),
  ).toBe(0);
});

test("a stalled image decode cannot strand navigation or its return", async ({
  page,
}) => {
  const origin = await prepareProject(page);
  await page.evaluate(() => {
    HTMLImageElement.prototype.decode = () => new Promise(() => {});
  });
  await caseLink(page).press("Enter");
  await expectCaseStudy(page);
  await backLink(page).click();
  await expectOrigin(page, origin);
});

test("a slow case-study response preserves the exact return position", async ({
  page,
}) => {
  await page.route("**/projects/**", async (route) => {
    // Exercise loading beyond the short visual bailout, not an animation frame.
    await new Promise((resolve) => setTimeout(resolve, 4200));
    await route.continue().catch(() => undefined);
  });
  const origin = await prepareProject(page);
  const historyLength = await page.evaluate(() => history.length);
  await caseLink(page).press("Enter");
  // Expired enhancements leave arrival focus to the router's ordinary behavior.
  await expectCaseStudy(page, false);
  await backLink(page).click();
  await expectOrigin(page, origin);
  expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
});
