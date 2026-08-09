"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import ParticleLogo from "./ParticleLogo";

const RESUME_PATH = "/resume/Lenin-Miranda-Resume.pdf";

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);

  return (
    <section className="font-galaxie-copernicus relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4">
      <header className="hero-interface absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <Link
          href="/"
          aria-label="Lenin Miranda, home"
          className="rounded-[0.7rem] outline-none transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-stone-200 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-700 active:scale-[0.98]"
        >
          <Image
            src="/brand/lenin-miranda-mark.png"
            alt=""
            width={48}
            height={48}
            preload
            className="size-10 rounded-[0.65rem] sm:size-12 sm:rounded-[0.8rem]"
          />
        </Link>

        <a
          href={RESUME_PATH}
          download="Lenin-Miranda-Resume.pdf"
          aria-label="Download Lenin Miranda's résumé as a PDF"
          className="group flex items-baseline gap-2 border-b border-stone-300/35 pb-1 font-sans text-xs text-stone-200 outline-none transition-[border-color,color,transform] duration-200 hover:border-stone-100 hover:text-stone-50 focus-visible:ring-2 focus-visible:ring-stone-200 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-700 active:translate-y-px sm:text-sm"
        >
          <span>Résumé</span>
          <span className="text-[0.65rem] tracking-[0.08em] text-stone-300/65 transition-colors duration-200 group-hover:text-stone-200">
            PDF
          </span>
        </a>
      </header>

      <ParticleLogo nameRef={nameRef} />

      <div className="relative z-10 flex w-full max-w-[90rem] translate-y-[10dvh] items-center justify-center sm:translate-y-[12dvh]">
        <div ref={nameRef} className="relative">
          <h1 className="hero-title relative z-10 whitespace-nowrap text-center text-[clamp(3rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-stone-300">
            Lenin Miranda
          </h1>
        </div>
      </div>

      <div className="hero-interface pointer-events-none absolute bottom-5 left-5 z-20 font-sans sm:bottom-8 sm:left-8">
        <p className="text-xs leading-relaxed text-stone-200 sm:text-sm">
          Software Engineer
        </p>
        <p className="text-[0.7rem] leading-relaxed text-stone-300/65 sm:text-xs">
          Las Vegas, NV
        </p>
      </div>
    </section>
  );
}
