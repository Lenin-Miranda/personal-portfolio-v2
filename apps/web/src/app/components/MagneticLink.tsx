"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, type ComponentProps, type PointerEvent } from "react";
import { spring } from "./motion/tokens";
import { useMotionCapabilities } from "./motion/useMotionCapabilities";

/** The hit area stays still; only the label responds, by at most three pixels. */
export default function MagneticLink({
  children,
  className = "",
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  onBlur,
  ...props
}: ComponentProps<"a">) {
  const { reduced, finePointer } = useMotionCapabilities();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, spring.magnetic);
  const y = useSpring(pointerY, spring.magnetic);
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) {
      pointerX.set(0);
      pointerY.set(0);
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, pointerX, pointerY, x, y]);

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
  };

  return (
    <a
      {...props}
      className={`magnetic-link ${className}`}
      onPointerMove={(event) => {
        move(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        reset();
        onPointerLeave?.(event);
      }}
      onPointerCancel={(event) => {
        reset();
        onPointerCancel?.(event);
      }}
      onBlur={(event) => {
        reset();
        onBlur?.(event);
      }}
    >
      <motion.span className="magnetic-link-label" style={{ x, y }}>
        {children}
      </motion.span>
    </a>
  );
}
