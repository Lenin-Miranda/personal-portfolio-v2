"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

type ProjectVisualProps = {
  alt: string;
  image: string;
  number: string;
  tone: "dark" | "light";
};

export default function ProjectVisual({
  alt,
  image,
  number,
  tone,
}: ProjectVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: visualRef,
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.035, 1, 1.035],
  );

  return (
    <div className={`project-visual project-visual-${tone}`} ref={visualRef}>
      <span aria-hidden="true" className="project-visual-number">
        {number}
      </span>
      <motion.div
        className="project-image-frame"
        style={{
          scale: imageScale,
          y: imageY,
        }}
      >
        <Image
          alt={alt}
          className="project-image"
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 56rem"
          src={image}
        />
      </motion.div>
    </div>
  );
}
