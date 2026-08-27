"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

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

  return (
    <div
      className={`project-visual project-visual-${tone} project-visual-${variant}`}
      ref={visualRef}
    >
      <span aria-hidden="true" className="project-visual-number">
        {number}
      </span>
      <motion.div
        className="project-image-reveal"
        initial={
          variant === "card" ? { opacity: 0, scale: 1.025, y: 26 } : false
        }
        transition={{
          duration: 0.58,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={
          variant === "card"
            ? { amount: 0.22, margin: "0px 0px -8% 0px", once: true }
            : undefined
        }
        whileInView={
          variant === "card" ? { opacity: 1, scale: 1, y: 0 } : undefined
        }
      >
        <motion.div
          className="project-image-frame"
          style={{ scale: imageScale, y: imageY }}
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
    </div>
  );
}
