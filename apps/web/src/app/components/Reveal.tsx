"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      transition={{
        delay: reduceMotion ? 0 : delay,
        duration: reduceMotion ? 0 : 0.72,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.14, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
