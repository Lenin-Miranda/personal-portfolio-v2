"use client";

import { useRef } from "react";

import ParticleLogo from "./ParticleLogo";

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);

  return (
    <section className="font-galaxie-copernicus relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4">
      <ParticleLogo nameRef={nameRef} />

      <div className="relative z-10 flex w-full max-w-[90rem] translate-y-[10dvh] items-center justify-center sm:translate-y-[12dvh]">
        <div ref={nameRef} className="relative">
          <h1 className="hero-title relative z-10 whitespace-nowrap text-center text-[clamp(3rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-stone-300">
            Lenin Miranda
          </h1>
        </div>
      </div>
    </section>
  );
}
