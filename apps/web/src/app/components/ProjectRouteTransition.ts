"use client";

const ORIGIN_STORAGE_KEY = "portfolio-project-origin:v1";
const SHARED_MEDIA_NAME = "project-media";
const TRANSITION_GUARD_MS = 2500;

type ProjectOrigin = {
  savedAt: number;
  scrollY: number;
  slug: string;
};

type RouterNavigation = {
  back: () => void;
  push: (href: string, options?: { scroll?: boolean }) => void;
};

type TransitionDirection = "backward" | "forward";

type StartTransitionOptions = {
  direction: TransitionDirection;
  navigate: () => void;
  onFinished?: () => void;
  onTargetReady?: (target: HTMLElement) => void;
  source: HTMLElement;
  targetSelector: string;
};

let transitionInFlight = false;
let activeOriginSlug: string | null = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsViewTransitions() {
  return typeof document.startViewTransition === "function";
}

function getStoredOrigin(slug: string) {
  try {
    const value = window.sessionStorage.getItem(ORIGIN_STORAGE_KEY);

    if (!value) {
      return null;
    }

    const origin = JSON.parse(value) as ProjectOrigin;
    const isRecent = Date.now() - origin.savedAt < 1000 * 60 * 60 * 2;

    return origin.slug === slug && isRecent ? origin : null;
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

  try {
    window.sessionStorage.setItem(ORIGIN_STORAGE_KEY, JSON.stringify(origin));
    activeOriginSlug = slug;
  } catch {
    // Navigation remains fully functional when storage is unavailable.
    activeOriginSlug = slug;
  }
}

function waitForElement(selector: string, signal: AbortSignal) {
  return new Promise<HTMLElement>((resolve, reject) => {
    const existing = document.querySelector<HTMLElement>(selector);

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const target = document.querySelector<HTMLElement>(selector);

      if (target) {
        observer.disconnect();
        resolve(target);
      }
    });

    const handleAbort = () => {
      observer.disconnect();
      reject(new DOMException("Project transition interrupted", "AbortError"));
    };

    signal.addEventListener("abort", handleAbort, { once: true });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function waitForMedia(target: HTMLElement, signal: AbortSignal) {
  const images = Array.from(target.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      if (signal.aborted) {
        return;
      }

      try {
        await image.decode();
      } catch {
        // A cached source can be captured even if decode reports an interruption.
      }
    }),
  );
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function startProjectTransition({
  direction,
  navigate,
  onFinished,
  onTargetReady,
  source,
  targetSelector,
}: StartTransitionOptions) {
  if (transitionInFlight) {
    return;
  }

  if (prefersReducedMotion() || !supportsViewTransitions()) {
    transitionInFlight = true;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollRestoration = window.history.scrollRestoration;
    const controller = new AbortController();
    const guard = window.setTimeout(
      () => controller.abort(),
      TRANSITION_GUARD_MS,
    );
    const targetPromise = waitForElement(targetSelector, controller.signal);

    if (direction === "backward") {
      root.style.scrollBehavior = "auto";
      window.history.scrollRestoration = "manual";
    }

    navigate();

    try {
      const target = await targetPromise;
      onTargetReady?.(target);
      onFinished?.();
    } catch {
      // The route still completes if its enhancement target cannot be found.
    } finally {
      window.clearTimeout(guard);
      transitionInFlight = false;

      if (direction === "backward") {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            root.style.scrollBehavior = previousScrollBehavior;
            window.history.scrollRestoration = previousScrollRestoration;
          });
        });
      }
    }

    return;
  }

  transitionInFlight = true;
  const root = document.documentElement;
  const sourceChapter = source.closest<HTMLElement>(".project-chapter");
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousScrollRestoration = window.history.scrollRestoration;
  const controller = new AbortController();
  const guard = window.setTimeout(
    () => controller.abort(),
    TRANSITION_GUARD_MS,
  );
  const handlePopState = () => controller.abort();
  let target: HTMLElement | null = null;

  root.dataset.projectTransition = direction;

  if (direction === "backward") {
    root.style.scrollBehavior = "auto";
    window.history.scrollRestoration = "manual";
  }

  sourceChapter?.setAttribute("data-project-opening", "true");
  source.style.viewTransitionName = SHARED_MEDIA_NAME;
  window.addEventListener("popstate", handlePopState, { once: true });

  await nextFrame();

  const transition = document.startViewTransition(async () => {
    const targetPromise = waitForElement(targetSelector, controller.signal);
    navigate();

    try {
      target = await targetPromise;
      onTargetReady?.(target);
      target.style.viewTransitionName = SHARED_MEDIA_NAME;
      await waitForMedia(target, controller.signal);
    } catch {
      // The route still completes; only the progressive transition is skipped.
    }
  });

  transition.finished
    .catch(() => undefined)
    .finally(() => {
      window.clearTimeout(guard);
      window.removeEventListener("popstate", handlePopState);
      source.style.removeProperty("view-transition-name");
      target?.style.removeProperty("view-transition-name");
      sourceChapter?.removeAttribute("data-project-opening");
      delete root.dataset.projectTransition;
      transitionInFlight = false;
      onFinished?.();
      window.dispatchEvent(new Event("project-transition-finished"));

      if (direction === "backward") {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            root.style.scrollBehavior = previousScrollBehavior;
            window.history.scrollRestoration = previousScrollRestoration;
          });
        });
      }
    });
}

export function openProject(
  router: RouterNavigation,
  slug: string,
  source: HTMLElement,
) {
  storeOrigin(slug);

  if (window.location.hash) {
    const cleanOriginUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(
      window.history.state,
      "",
      cleanOriginUrl || "/",
    );
  }

  void startProjectTransition({
    direction: "forward",
    navigate: () => router.push(`/projects/${slug}`),
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
  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;
  const originBelongsToThisVisit =
    activeOriginSlug === slug || navigationEntry?.type === "reload";
  const canReturnThroughHistory = origin && originBelongsToThisVisit;

  if (!canReturnThroughHistory) {
    router.push(`/#${slug}`);
    return;
  }

  void startProjectTransition({
    direction: "backward",
    navigate: () => router.back(),
    onFinished: () => {
      window.scrollTo({ behavior: "instant", left: 0, top: origin.scrollY });
    },
    onTargetReady: () => {
      window.scrollTo({ behavior: "instant", left: 0, top: origin.scrollY });
    },
    source,
    targetSelector: `[data-project-card-media="${slug}"]`,
  });
}
