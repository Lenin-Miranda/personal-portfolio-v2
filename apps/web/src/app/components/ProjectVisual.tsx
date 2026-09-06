"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useRef } from "react";

import { duration, ease, spring, stagger } from "./motion/tokens";
import { useMotionCapabilities } from "./motion/useMotionCapabilities";

import "./project-motion.css";

type ProjectVisualProps = {
  alt: string;
  image: string;
  number: string;
  preload?: boolean;
  projectId: string;
  tone: "dark" | "light";
  variant?: "card" | "hero";
};

export default function ProjectVisual({
  alt,
  image,
  number,
  preload = false,
  projectId,
  tone,
  variant = "card",
}: ProjectVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const pointerBounds = useRef<DOMRect | null>(null);
  const { compact, finePointer, reduced } = useMotionCapabilities();
  const depthEnabled = finePointer && !compact && !reduced;
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
  const sharedMediaAttribute =
    variant === "hero"
      ? { "data-project-hero-media": projectId }
      : { "data-project-card-media": projectId };
  const settleDuration = compact ? duration.reveal : duration.cinematic;
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!depthEnabled || event.pointerType === "touch") return;
    const bounds = pointerBounds.current;
    if (!bounds) return;
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
  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    pointerBounds.current = null;
  };

  return (
    <motion.div
      className={`project-visual project-visual-${tone} project-visual-${variant}`}
      initial={variant === "card" && !reduced ? "hidden" : false}
      onPointerCancel={resetPointer}
      onPointerEnter={() => {
        if (depthEnabled)
          pointerBounds.current =
            visualRef.current?.getBoundingClientRect() ?? null;
      }}
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      ref={visualRef}
      viewport={{ amount: 0.24, margin: "0px 0px -6% 0px", once: true }}
      whileInView="visible"
    >
      <motion.span
        aria-hidden="true"
        className="project-visual-number"
        style={{ x: depthEnabled ? numberX : 0 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: reduced ? 0 : duration.standard,
              ease: ease.out,
            },
          },
        }}
      >
        {number}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="project-visual-highlight"
        style={{ x: depthEnabled ? highlightX : 0 }}
      />
      <motion.div
        className="project-image-reveal"
        variants={{
          hidden: { clipPath: "inset(12% 0% 88% 0%)" },
          visible: {
            clipPath: "inset(-15% -10% -15% -10%)",
            transition: {
              delay: reduced ? 0 : stagger.tight,
              duration: reduced ? 0 : settleDuration,
              ease: ease.out,
            },
          },
        }}
      >
        <motion.div
          className="project-image-depth"
          style={{
            rotateX: depthEnabled ? rotateX : 0,
            rotateY: depthEnabled ? rotateY : 0,
            x: depthEnabled ? x : 0,
          }}
          variants={{
            hidden: { scale: compact ? 1.02 : 1.055 },
            visible: {
              scale: 1,
              transition: {
                duration: reduced ? 0 : settleDuration,
                ease: ease.out,
              },
            },
          }}
        >
          <motion.div
            className="project-image-frame"
            style={{
              scale: depthEnabled ? imageScale : 1,
              y: depthEnabled ? imageY : 0,
            }}
            {...sharedMediaAttribute}
          >
            <Image
              alt={alt}
              className="project-image"
              fill
              preload={preload}
              sizes={
                variant === "hero"
                  ? "(max-width: 767px) 100vw, (max-width: 1727px) 88vw, 95rem"
                  : "(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 56rem"
              }
              src={image}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
