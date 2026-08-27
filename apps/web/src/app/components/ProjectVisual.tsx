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
  const imageY = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.015, 1, 1.015],
  );

  return (
    <div className={`project-visual project-visual-${tone}`} ref={visualRef}>
      <span aria-hidden="true" className="project-visual-number">
        {number}
      </span>
      <motion.div
        className="project-image-reveal"
        initial={{ opacity: 0, scale: 1.025, y: 26 }}
        transition={{
          duration: 0.58,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ amount: 0.22, margin: "0px 0px -8% 0px", once: true }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
      >
        <motion.div
          className="project-image-frame"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            alt={alt}
            className="project-image"
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 56rem"
            src={image}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
