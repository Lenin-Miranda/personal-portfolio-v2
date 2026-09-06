"use client";

const ORIGIN_STORAGE_KEY = "portfolio-project-origin:v2";
const ORIGIN_HISTORY_KEY = "portfolioProjectOrigin";
const SHARED_MEDIA_NAME = "project-media";
const TRANSITION_GUARD_MS = 1800;

type ProjectOrigin = { savedAt: number; scrollY: number; slug: string };
type RouterNavigation = {
  back: () => void;
  push: (href: string, options?: { scroll?: boolean }) => void;
};
type StartTransitionOptions = {
  direction: "backward" | "forward";
  navigate: () => void;
  onTargetReady?: (target: HTMLElement) => void;
  source: HTMLElement;
  targetSelector: string;
  usesHistory?: boolean;
};

let transitionInFlight = false;
let activeOrigin: ProjectOrigin | null = null;

function isProjectOrigin(value: unknown): value is ProjectOrigin {
  if (!value || typeof value !== "object") return false;
  const origin = value as Partial<ProjectOrigin>;
  return (
    typeof origin.slug === "string" &&
    typeof origin.savedAt === "number" &&
    typeof origin.scrollY === "number" &&
    Number.isFinite(origin.scrollY) &&
    origin.scrollY >= 0 &&
    origin.savedAt <= Date.now() &&
    Date.now() - origin.savedAt < 1000 * 60 * 60 * 2
  );
}

function getStoredOrigin(slug: string) {
  if (activeOrigin?.slug === slug && isProjectOrigin(activeOrigin))
    return activeOrigin;
  try {
    const value: unknown = JSON.parse(
      window.sessionStorage.getItem(ORIGIN_STORAGE_KEY) ?? "null",
    );
    return isProjectOrigin(value) && value.slug === slug ? value : null;
  } catch {
    return null;
  }
}

function storeOrigin(slug: string) {
  const origin: ProjectOrigin = {
    savedAt: Date.now(),
    scrollY: window.scrollY,
    slug,
  };
  activeOrigin = origin;
  try {
    window.sessionStorage.setItem(ORIGIN_STORAGE_KEY, JSON.stringify(origin));
  } catch {
    // The in-memory origin still restores context when storage is unavailable.
  }
  return origin;
}

function waitForElement(selector: string, signal: AbortSignal) {
  return new Promise<HTMLElement>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const cleanup = () => {
      observer.disconnect();
      signal.removeEventListener("abort", handleAbort);
    };
    const handleAbort = () => {
      cleanup();
      reject(signal.reason);
    };
    const observer = new MutationObserver(() => {
      const target = document.querySelector<HTMLElement>(selector);
      if (target) {
        cleanup();
        resolve(target);
      }
    });
    signal.addEventListener("abort", handleAbort, { once: true });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

/** A slow image must never keep a browser navigation snapshot frozen. */
async function waitForMedia(target: HTMLElement, signal: AbortSignal) {
  let timeout = 0;
  let handleAbort: () => void = () => undefined;
  const boundedWait = new Promise<void>((resolve) => {
    handleAbort = resolve;
    timeout = window.setTimeout(resolve, 180);
    signal.addEventListener("abort", handleAbort, { once: true });
    if (signal.aborted) resolve();
  });
  try {
    await Promise.race([
      Promise.all(
        Array.from(target.querySelectorAll("img"), (image) =>
          image.decode().catch(() => undefined),
        ),
      ),
      boundedWait,
    ]);
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", handleAbort);
  }
}

function restoreFocus(target: HTMLElement, direction: "backward" | "forward") {
  const focusTarget =
    direction === "forward"
      ? document.getElementById("project-case-title")
      : target
          .closest(".project-chapter")
          ?.querySelector<HTMLElement>(".project-case-study-link");
  focusTarget?.focus({ preventScroll: true });
}

async function startProjectTransition({
  direction,
  navigate,
  onTargetReady,
  source,
  targetSelector,
  usesHistory = false,
}: StartTransitionOptions) {
  if (transitionInFlight) return;
  transitionInFlight = true;

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousScrollRestoration = window.history.scrollRestoration;
  const controller = new AbortController();
  const sourceChapter = source.closest<HTMLElement>(".project-chapter");
  const canAnimate =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    typeof document.startViewTransition === "function";
  let transition: ViewTransition | undefined;
  let target: HTMLElement | null = null;
  let didNavigate = false;
  let expectedHistoryEvent = usesHistory;

  const interrupt = () => {
    controller.abort();
    transition?.skipTransition();
  };
  const handlePopState = () => {
    // router.back() produces the first popstate itself; subsequent ones interrupt.
    if (expectedHistoryEvent) {
      expectedHistoryEvent = false;
      return;
    }
    interrupt();
  };
  const guard = window.setTimeout(interrupt, TRANSITION_GUARD_MS);
  const navigateOnce = () => {
    if (didNavigate) return;
    didNavigate = true;
    navigate();
  };

  root.style.scrollBehavior = "auto";
  if (direction === "backward") window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", handlePopState);

  const update = async () => {
    // Capture the old media first, then remove its name before the new tree mounts.
    source.style.removeProperty("view-transition-name");
    const targetPromise = waitForElement(targetSelector, controller.signal);
    navigateOnce();
    try {
      target = await targetPromise;
      if (controller.signal.aborted) return;
      onTargetReady?.(target);
      if (canAnimate) target.style.viewTransitionName = SHARED_MEDIA_NAME;
      await waitForMedia(target, controller.signal);
      // Rendering is suspended inside this callback: awaiting rAF would deadlock
      // until the guard expires instead of letting the shared-media animation run.
    } catch {
      // The enhancement can expire while the route continues loading normally.
    }
  };

  try {
    if (canAnimate) {
      root.dataset.projectTransition = direction;
      sourceChapter?.setAttribute("data-project-opening", "true");
      source.style.viewTransitionName = SHARED_MEDIA_NAME;
      transition = document.startViewTransition(update);
      // ready rejects when the browser declines a snapshot; routing must still work.
      void transition.ready.catch(() => undefined);
      await transition.finished.catch(() => undefined);
    } else {
      await update();
    }
  } catch {
    // A synchronous browser API failure should behave exactly like a normal link.
    navigateOnce();
  } finally {
    window.clearTimeout(guard);
    controller.abort();
    window.removeEventListener("popstate", handlePopState);
    source.style.removeProperty("view-transition-name");
    // The callback mutates target asynchronously, outside TypeScript's narrowing.
    const resolvedTarget = target as HTMLElement | null;
    resolvedTarget?.style.removeProperty("view-transition-name");
    sourceChapter?.removeAttribute("data-project-opening");
    delete root.dataset.projectTransition;
    transitionInFlight = false;
    window.dispatchEvent(new Event("project-transition-finished"));
    if (resolvedTarget?.isConnected) restoreFocus(resolvedTarget, direction);
    root.style.scrollBehavior = previousScrollBehavior;
    window.history.scrollRestoration = previousScrollRestoration;
  }
}

export function openProject(
  router: RouterNavigation,
  slug: string,
  source: HTMLElement,
) {
  if (transitionInFlight) return;
  const origin = storeOrigin(slug);
  if (window.location.hash) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }
  void startProjectTransition({
    direction: "forward",
    navigate: () => router.push(`/projects/${slug}`),
    onTargetReady: () => {
      window.scrollTo({ behavior: "instant", left: 0, top: 0 });
      // Match the saved origin to this history entry, including after a reload.
      window.history.replaceState(
        { ...window.history.state, [ORIGIN_HISTORY_KEY]: origin },
        "",
      );
    },
    source,
    targetSelector: `[data-project-hero-media="${slug}"]`,
  });
}

export function returnToProjectOrigin(
  router: RouterNavigation,
  slug: string,
  source: HTMLElement,
) {
  const origin = getStoredOrigin(slug);
  const historyOrigin: unknown = window.history.state?.[ORIGIN_HISTORY_KEY];
  const canReturnThroughHistory = Boolean(
    origin &&
    isProjectOrigin(historyOrigin) &&
    historyOrigin.slug === slug &&
    historyOrigin.savedAt === origin.savedAt,
  );
  void startProjectTransition({
    direction: "backward",
    navigate: () =>
      canReturnThroughHistory ? router.back() : router.push(`/#${slug}`),
    onTargetReady: (target) => {
      const chapter = target.closest<HTMLElement>(".project-chapter");
      // A revisited chapter is already established in the visitor's spatial model.
      chapter?.setAttribute("data-project-restored", "true");
      if (canReturnThroughHistory && origin) {
        window.scrollTo({ behavior: "instant", left: 0, top: origin.scrollY });
      } else {
        chapter?.scrollIntoView({ behavior: "instant", block: "start" });
      }
    },
    source,
    targetSelector: `[data-project-card-media="${slug}"]`,
    usesHistory: canReturnThroughHistory,
  });
}
