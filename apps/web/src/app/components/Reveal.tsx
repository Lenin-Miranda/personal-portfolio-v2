"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";

export type RevealLevel = "heading" | "content" | "meta";

type RevealProps = {
  amount?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  level?: RevealLevel;
};

type RevealGroupProps = RevealProps & {
  stagger?: number;
};

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  level?: RevealLevel;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const LEVEL_MOTION: Record<
  RevealLevel,
  { duration: number; opacity: number; y: number }
> = {
  heading: { duration: 0.64, opacity: 0, y: 34 },
  content: { duration: 0.52, opacity: 0, y: 24 },
  meta: { duration: 0.38, opacity: 0, y: 10 },
};

const ITEM_VARIANTS: Variants = {
  hidden: (level: RevealLevel = "content") => ({
    opacity: LEVEL_MOTION[level].opacity,
    y: LEVEL_MOTION[level].y,
  }),
  visible: (level: RevealLevel = "content") => ({
    opacity: 1,
    transition: {
      duration: LEVEL_MOTION[level].duration,
      ease: EASE_OUT,
    },
    y: 0,
  }),
};

const MASK_VARIANTS: Variants = {
  hidden: { opacity: 0.2, y: "108%" },
  visible: {
    opacity: 1,
    transition: { duration: 0.64, ease: EASE_OUT },
    y: "0%",
  },
};

export default function Reveal({
  amount = 0.25,
  children,
  className,
  delay = 0,
  level = "content",
}: RevealProps) {
  const motionLevel = LEVEL_MOTION[level];

  return (
    <motion.div
      className={`motion-reveal${className ? ` ${className}` : ""}`}
      initial={{ opacity: motionLevel.opacity, y: motionLevel.y }}
      transition={{
        delay,
        duration: motionLevel.duration,
        ease: EASE_OUT,
      }}
      viewport={{ amount, margin: "0px 0px -8% 0px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  amount = 0.28,
  children,
  className,
  delay = 0,
  stagger = 0.09,
}: RevealGroupProps) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      viewport={{ amount, margin: "0px 0px -8% 0px", once: true }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  level = "content",
}: RevealItemProps) {
  return (
    <motion.div
      className={`reveal-item${className ? ` ${className}` : ""}`}
      custom={level}
      variants={ITEM_VARIANTS}
    >
      {children}
    </motion.div>
  );
}

export function MaskedReveal({
  children,
  className,
}: Omit<RevealItemProps, "level">) {
  return (
    <div className={`reveal-mask${className ? ` ${className}` : ""}`}>
      <motion.div className="reveal-mask-inner" variants={MASK_VARIANTS}>
        {children}
      </motion.div>
    </div>
  );
}
