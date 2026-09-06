"use client";

import { useSyncExternalStore } from "react";

const queries = [
  "(prefers-reduced-motion: reduce)",
  "(max-width: 47.99rem)",
  "(hover: hover) and (pointer: fine)",
] as const;
const subscribers = new Set<() => void>();
let media: MediaQueryList[] = [];

function getSnapshot() {
  return queries.reduce(
    (flags, query, index) =>
      flags | (window.matchMedia(query).matches ? 1 << index : 0),
    0,
  );
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(callback: () => void) {
  if (!subscribers.size) {
    media = queries.map((query) => window.matchMedia(query));
    media.forEach((query) => query.addEventListener("change", notify));
  }
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
    if (!subscribers.size) {
      media.forEach((query) => query.removeEventListener("change", notify));
      media = [];
    }
  };
}

const getServerSnapshot = () => 0;

/** Shared capability listeners, independent of how many reveals are mounted. */
export function useMotionCapabilities() {
  const flags = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    reduced: Boolean(flags & 1),
    compact: Boolean(flags & 2),
    finePointer: Boolean(flags & 4),
  };
}
