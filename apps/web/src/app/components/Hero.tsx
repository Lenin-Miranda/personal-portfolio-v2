"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

import ParticleLogo from "./ParticleLogo";

const entranceEase = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="font-galaxie-copernicus relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4">
      <ParticleLogo nameRef={nameRef} />

      <div className="relative z-10 flex w-full max-w-[90rem] translate-y-[10dvh] items-center justify-center sm:translate-y-[12dvh]">
        <div ref={nameRef} className="relative">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 1.45,
              ease: entranceEase,
            }}
            className="relative z-10 whitespace-nowrap text-center text-[clamp(3rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-stone-300"
          >
            Lenin Miranda
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
