"use client";

import { useEffect, useRef } from "react";
import { duration, stagger } from "./motion/tokens";
import {
  HERO_COMPACT_TIME_SCALE,
  heroSequence,
  readHeroSequenceTime,
} from "./heroSequence";

const LOGO_PATH = "/brand/lenin-miranda-mark.png";
const SOURCE_SIZE = 512;
const CONSTRUCTION_LANES = [0.28, 0.5, 0.72] as const;

type LogoPoint = { x: number; y: number };
type Particle = {
  delay: number;
  duration: number;
  endX: number;
  endY: number;
  releaseX: number;
  opacity: number;
  radius: number;
  startX: number;
  startY: number;
};

function createRandom(seed: number) {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function collectLogoPoints(image: HTMLImageElement): LogoPoint[] {
  const sourceCanvas = document.createElement("canvas");
  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!sourceContext) return [];

  sourceCanvas.width = SOURCE_SIZE;
  sourceCanvas.height = SOURCE_SIZE;
  sourceContext.drawImage(image, 0, 0, SOURCE_SIZE, SOURCE_SIZE);
  const pixels = sourceContext.getImageData(
    0,
    0,
    SOURCE_SIZE,
    SOURCE_SIZE,
  ).data;
  const points: LogoPoint[] = [];
  let minX = SOURCE_SIZE;
  let maxX = 0;
  let minY = SOURCE_SIZE;
  let maxY = 0;

  for (let y = 0; y < SOURCE_SIZE; y += 5) {
    for (let x = 0; x < SOURCE_SIZE; x += 5) {
      const index = (y * SOURCE_SIZE + x) * 4;
      const brightness =
        ((pixels[index] ?? 0) +
          (pixels[index + 1] ?? 0) +
          (pixels[index + 2] ?? 0)) /
        3;
      if ((pixels[index + 3] ?? 0) > 160 && brightness > 68) {
        points.push({ x, y });
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Normalize the actual mark, excluding the square asset's empty margins.
  const inkWidth = Math.max(maxX - minX, 1);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  return points.map(({ x, y }) => ({
    x: (x - centerX) / inkWidth,
    y: (y - centerY) / inkWidth,
  }));
}

function buildParticles(
  points: LogoPoint[],
  width: number,
  height: number,
  compact: boolean,
): Particle[] {
  const random = createRandom(2026);
  const shuffledPoints = [...points];
  for (let index = shuffledPoints.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = shuffledPoints[index];
    const replacement = shuffledPoints[swapIndex];
    if (current && replacement) {
      shuffledPoints[index] = replacement;
      shuffledPoints[swapIndex] = current;
    }
  }

  const logoSize = Math.min(width * 0.7, height * 1.65, 330);
  const centerX = width / 2;
  const centerY = height / 2;
  const timeScale = compact ? HERO_COMPACT_TIME_SCALE : 1;
  const grid = compact ? 6 : 8;
  const frameInset = 3;
  return shuffledPoints.slice(0, compact ? 240 : 420).map((point) => {
    const endX = centerX + point.x * logoSize;
    const endY = centerY + point.y * logoSize;
    const laneIndex = CONSTRUCTION_LANES.reduce<number>(
      (nearest, lane, index) =>
        Math.abs(lane * height - endY) <
        Math.abs((CONSTRUCTION_LANES[nearest] ?? 0.5) * height - endY)
          ? index
          : nearest,
      0,
    );
    const startY = (CONSTRUCTION_LANES[laneIndex] ?? 0.5) * height;
    const side = point.x < 0 ? -1 : 1;
    const travel = compact ? 30 + random() * 15 : 36 + random() * 42;
    const horizontalTravel = Math.sqrt(
      Math.max(travel * travel - (startY - endY) ** 2, 0),
    );
    const startX = Math.min(
      Math.max(
        Math.round((endX + side * horizontalTravel) / grid) * grid,
        frameInset,
      ),
      width - frameInset,
    );
    const distanceFromCenter =
      Math.abs(startX - centerX) / Math.max(centerX, 1);
    return {
      delay:
        (laneIndex * stagger.tight * 0.4 +
          distanceFromCenter * stagger.tight +
          random() * 0.01) *
        timeScale,
      duration:
        (duration.standard + duration.fast + random() * 0.035) * timeScale,
      endX,
      endY,
      // The cubic initially follows its construction row, then turns into the
      // glyph. The row is shared with the SVG fragments collapsing into LM.
      releaseX: startX + (endX - startX) * 0.7,
      opacity: 0.72 + random() * 0.28,
      radius: (compact ? 0.95 : 1.1) + random() * 0.5,
      startX,
      startY,
    };
  });
}

export default function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !parent || !hero) return;
    const context = canvas.getContext("2d", { desynchronized: true });
    if (!context) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia(
      "(max-width: 47.99rem), (orientation: landscape) and (max-height: 30rem)",
    );
    const image = new Image();
    let frame = 0;
    let wakeTimer = 0;
    let disposed = false;
    let visible = false;
    let settled = reducedQuery.matches;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points: LogoPoint[] = [];
    let particles: Particle[] = [];

    const draw = (elapsed: number) => {
      let complete = true;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f5f2ea";
      for (const particle of particles) {
        const progress = Math.min(
          Math.max((elapsed - particle.delay) / particle.duration, 0),
          1,
        );
        if (progress < 1) complete = false;
        if (progress <= 0) continue;
        const eased = 1 - Math.pow(1 - progress, 3);
        const remaining = 1 - eased;
        const x =
          remaining ** 3 * particle.startX +
          3 * remaining ** 2 * eased * particle.releaseX +
          (3 * remaining * eased ** 2 + eased ** 3) * particle.endX;
        const y =
          particle.startY + (particle.endY - particle.startY) * eased ** 3;
        context.globalAlpha = particle.opacity * Math.min(progress * 7, 1);
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      parent.dataset.ready = "true";
      parent.dataset.settled = String(complete);
      if (complete) settled = true;
      return complete;
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wakeTimer);
      frame = 0;
      wakeTimer = 0;
    };
    const render = () => {
      frame = 0;
      wakeTimer = 0;
      if (disposed || !visible || document.hidden || !particles.length) return;
      const time = readHeroSequenceTime(hero);
      if (settled || reducedQuery.matches || time === null) {
        draw(Number.POSITIVE_INFINITY);
        return;
      }
      const logoCue =
        heroSequence.logo *
        (compactQuery.matches ? HERO_COMPACT_TIME_SCALE : 1);
      if (time < logoCue) {
        // Sleep until the shared signal reaches the LM node; no idle canvas loop.
        wakeTimer = window.setTimeout(render, (logoCue - time) * 1000);
      } else if (!draw(time - logoCue)) {
        frame = requestAnimationFrame(render);
      }
    };
    const schedule = () => {
      if (!frame && !wakeTimer && visible && !document.hidden)
        frame = requestAnimationFrame(render);
    };
    const updateLayout = (force = false) => {
      if (!points.length) return;
      const nextWidth = Math.max(canvas.clientWidth, 1);
      const nextHeight = Math.max(canvas.clientHeight, 1);
      const nextRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (
        !force &&
        width === nextWidth &&
        height === nextHeight &&
        pixelRatio === nextRatio
      )
        return;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = buildParticles(points, width, height, compactQuery.matches);
      schedule();
    };
    const capabilityChanged = () => {
      stop();
      if (reducedQuery.matches) settled = true;
      updateLayout(true);
      schedule();
    };
    const visibilityChanged = () => {
      if (document.hidden) stop();
      else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) schedule();
      else stop();
    });
    const resizeObserver = new ResizeObserver(() => updateLayout());
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    reducedQuery.addEventListener("change", capabilityChanged);
    compactQuery.addEventListener("change", capabilityChanged);
    document.addEventListener("visibilitychange", visibilityChanged);

    image.onload = () => {
      if (disposed || points.length) return;
      points = collectLogoPoints(image);
      updateLayout();
    };
    image.src = LOGO_PATH;

    return () => {
      disposed = true;
      image.onload = null;
      observer.disconnect();
      resizeObserver.disconnect();
      reducedQuery.removeEventListener("change", capabilityChanged);
      compactQuery.removeEventListener("change", capabilityChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      stop();
    };
  }, []);

  return (
    <div aria-hidden="true" className="particle-logo">
      <span className="particle-logo-fallback">&lt;LM/&gt;</span>
      <canvas className="particle-canvas" ref={canvasRef} />
    </div>
  );
}
