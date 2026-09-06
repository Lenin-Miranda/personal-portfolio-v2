"use client";

import { styleEffect } from "motion";
import { useScroll, useSpring, useTransform } from "motion/react";
import { type RefObject, useEffect } from "react";

import { spring } from "./motion/tokens";

type ElementRef<T extends HTMLElement> = RefObject<T | null>;
type ProjectVisualInteractionProps = {
  frameRef: ElementRef<HTMLDivElement>;
  highlightRef: ElementRef<HTMLSpanElement>;
  numberRef: ElementRef<HTMLSpanElement>;
  planeRef: ElementRef<HTMLDivElement>;
  variant: "card" | "hero";
  visualRef: ElementRef<HTMLDivElement>;
};

/** Mounted only where depth is useful; the shared-media DOM never changes. */
export default function ProjectVisualInteraction({
  frameRef,
  highlightRef,
  numberRef,
  planeRef,
  variant,
  visualRef,
}: ProjectVisualInteractionProps) {
  const pointerX = useSpring(0, spring.magnetic);
  const pointerY = useSpring(0, spring.magnetic);
  const rotateX = useTransform(pointerY, [-1, 1], [0.75, -0.75]);
  const rotateY = useTransform(pointerX, [-1, 1], [-1, 1]);
  const x = useTransform(pointerX, [-1, 1], [-3, 3]);
  const numberX = useTransform(pointerX, [-1, 1], [-2, 2]);
  const highlightX = useTransform(pointerX, [-1, 1], [-70, 70]);
  const { scrollYProgress } = useScroll({
    offset:
      variant === "hero"
        ? ["start start", "end start"]
        : ["start end", "end start"],
    target: visualRef,
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    variant === "hero" ? ["0%", "3%"] : ["-2%", "2%"],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === "hero" ? [1, 1.006, 1.012] : [1.015, 1, 1.015],
  );

  useEffect(() => {
    const visual = visualRef.current;
    const plane = planeRef.current;
    const frame = frameRef.current;
    const number = numberRef.current;
    const highlight = highlightRef.current;
    if (!visual || !plane || !frame || !number || !highlight) return;

    const release = [
      styleEffect(plane, { rotateX, rotateY, x }),
      styleEffect(frame, { scale: imageScale, y: imageY }),
      styleEffect(number, { x: numberX }),
      styleEffect(highlight, { x: highlightX }),
    ];
    let bounds: DOMRect | null = null;
    const enter = () => {
      bounds = visual.getBoundingClientRect();
    };
    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
      bounds = null;
    };
    const move = (event: PointerEvent) => {
      if (!bounds || event.pointerType === "touch") return;
      pointerX.set(
        Math.max(
          -1,
          Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
        ),
      );
      pointerY.set(
        Math.max(
          -1,
          Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
        ),
      );
    };

    visual.addEventListener("pointerenter", enter);
    visual.addEventListener("pointermove", move, { passive: true });
    visual.addEventListener("pointerleave", reset);
    visual.addEventListener("pointercancel", reset);
    return () => {
      release.forEach((cleanup) => cleanup());
      visual.removeEventListener("pointerenter", enter);
      visual.removeEventListener("pointermove", move);
      visual.removeEventListener("pointerleave", reset);
      visual.removeEventListener("pointercancel", reset);
      [plane, frame, number, highlight].forEach((element) =>
        element.style.removeProperty("transform"),
      );
    };
  }, [
    frameRef,
    highlightRef,
    highlightX,
    imageScale,
    imageY,
    numberRef,
    numberX,
    planeRef,
    pointerX,
    pointerY,
    rotateX,
    rotateY,
    visualRef,
    x,
  ]);

  return null;
}
