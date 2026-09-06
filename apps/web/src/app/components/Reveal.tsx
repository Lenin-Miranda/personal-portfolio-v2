"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";
import { distance, duration, ease, stagger as sequence } from "./motion/tokens";
import { useMotionCapabilities } from "./motion/useMotionCapabilities";

export type RevealLevel = "heading" | "content" | "meta";
type RevealPattern = "rise" | "line" | "quiet";
type RevealProps = {
  amount?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  level?: RevealLevel;
};
type RevealGroupProps = RevealProps & { stagger?: number };
type RevealItemProps = Pick<RevealProps, "children" | "className" | "level">;
type RevealSettings = {
  compact: boolean;
  delay?: number;
  level: RevealLevel;
  reduced: boolean;
};

const levelMotion = {
  heading: { duration: duration.section, y: distance.hero },
  content: { duration: duration.reveal, y: distance.content },
  meta: { duration: duration.standard, y: distance.small },
};

const itemVariants: Variants = {
  hidden: ({ compact, level, reduced }: RevealSettings) => ({
    opacity: reduced ? 1 : 0,
    y: reduced ? 0 : levelMotion[level].y * (compact ? 0.45 : 1),
  }),
  visible: ({ compact, delay = 0, level, reduced }: RevealSettings) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: reduced ? 0 : delay * (compact ? 0.5 : 1),
      duration: reduced ? 0 : levelMotion[level].duration * (compact ? 0.8 : 1),
      ease: ease.out,
    },
  }),
};

export default function Reveal({
  amount = 0.25,
  children,
  className,
  delay = 0,
  level = "content",
}: RevealProps) {
  const { compact, reduced } = useMotionCapabilities();
  return (
    <motion.div
      className={`motion-reveal${className ? ` ${className}` : ""}`}
      custom={{ compact, delay, level, reduced }}
      initial="hidden"
      variants={itemVariants}
      viewport={{ amount, margin: "0px 0px -8% 0px", once: true }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  amount = 0.22,
  children,
  className,
  delay = 0,
  stagger = sequence.content,
}: RevealGroupProps) {
  const { compact, reduced } = useMotionCapabilities();
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduced ? 0 : delay * (compact ? 0.5 : 1),
            staggerChildren: reduced ? 0 : stagger * (compact ? 0.6 : 1),
          },
        },
      }}
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
  const { compact, reduced } = useMotionCapabilities();
  return (
    <motion.div
      className={`reveal-item${className ? ` ${className}` : ""}`}
      custom={{ compact, level, reduced }}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}

export function MaskedReveal({
  children,
  className,
  pattern = "rise",
}: Omit<RevealItemProps, "level"> & { pattern?: RevealPattern }) {
  const { compact, reduced } = useMotionCapabilities();
  const variants: Variants = {
    hidden: reduced
      ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
      : pattern === "quiet"
        ? { opacity: 0, y: 0 }
        : pattern === "line"
          ? {
              opacity: 1,
              y: compact ? 8 : 16,
              clipPath: "inset(0% 0% 100% 0%)",
            }
          : { opacity: 0.4, y: compact ? "35%" : "105%" },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: reduced ? 0 : duration.section * (compact ? 0.75 : 1),
        ease: ease.out,
      },
    },
  };
  return (
    <div
      className={`reveal-mask reveal-mask-${pattern}${className ? ` ${className}` : ""}`}
    >
      <motion.div className="reveal-mask-inner" variants={variants}>
        {children}
      </motion.div>
    </div>
  );
}
