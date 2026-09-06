"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import ProjectVisualInteraction from "./ProjectVisualInteraction";
import { duration, ease, stagger } from "./motion/tokens";
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
  const planeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const { compact, finePointer, reduced } = useMotionCapabilities();
  const depthEnabled = finePointer && !compact && !reduced;
  const sharedMediaAttribute =
    variant === "hero"
      ? { "data-project-hero-media": projectId }
      : { "data-project-card-media": projectId };
  const settleDuration = compact ? duration.reveal : duration.cinematic;

  return (
    <motion.div
      className={`project-visual project-visual-${tone} project-visual-${variant}`}
      initial={variant === "card" && !reduced ? "hidden" : false}
      ref={visualRef}
      viewport={{ amount: 0.24, margin: "0px 0px -6% 0px", once: true }}
      whileInView="visible"
    >
      {depthEnabled ? (
        <ProjectVisualInteraction
          frameRef={frameRef}
          highlightRef={highlightRef}
          numberRef={numberRef}
          planeRef={planeRef}
          variant={variant}
          visualRef={visualRef}
        />
      ) : null}
      <motion.span
        aria-hidden="true"
        className="project-visual-number"
        ref={numberRef}
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
      <span
        aria-hidden="true"
        className="project-visual-highlight"
        ref={highlightRef}
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
          <div ref={planeRef}>
            <div
              className="project-image-frame"
              ref={frameRef}
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
                    : "(max-width: 1023px) 100vw, (max-width: 1199px) 58vw, 56rem"
                }
                src={image}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
