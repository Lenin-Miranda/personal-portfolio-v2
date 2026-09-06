"use client";

import { useEffect, useRef } from "react";
import { duration, stagger } from "./motion/tokens";

const LOGO_PATH = "/brand/lenin-miranda-mark.png";
const SOURCE_SIZE = 512;
const INTRO_DURATION = (duration.reveal + duration.fast) * 1000;
const INTERACTION_RADIUS = 72;
const MAX_REPULSION = 5;

type LogoPoint = { x: number; y: number };
type Particle = {
  delay: number;
  duration: number;
  endX: number;
  endY: number;
  offsetX: number;
  offsetY: number;
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
  return shuffledPoints.slice(0, compact ? 220 : 420).map((point) => {
    const endX = centerX + point.x * logoSize;
    const endY = centerY + point.y * logoSize;
    return {
      delay:
        (stagger.tight * 2 +
          (point.x + 0.5) * stagger.content +
          random() * stagger.tight) *
        1000,
      duration:
        (duration.standard + random() * duration.fast) *
        1000 *
        (compact ? 0.7 : 1),
      endX,
      endY,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.68 + random() * 0.32,
      radius: (compact ? 0.95 : 1.1) + random() * 0.55,
      // Points resolve from adjacent data lanes, never from a distant cloud.
      startX: centerX + (Math.round(point.x * 12) / 12) * logoSize,
      startY: endY + (point.y < 0 ? -1 : 1) * (compact ? 10 : 22),
    };
  });
}

export default function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d", { desynchronized: true });
    if (!context) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const compactQuery = window.matchMedia("(max-width: 47.99rem)");
    const image = new Image();
    const pointer = { active: false, x: 0, y: 0 };
    let animationFrame = 0;
    let disposed = false;
    let visible = false;
    let introStartedAt: number | null = null;
    let lastTimestamp = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points: LogoPoint[] = [];
    let particles: Particle[] = [];

    const canInteract = () =>
      !reducedQuery.matches && pointerQuery.matches && !compactQuery.matches;
    const draw = (elapsed: number, deltaTime: number) => {
      const reduced = reducedQuery.matches;
      const interactive = canInteract();
      let needsAnotherFrame = !reduced && elapsed < INTRO_DURATION;
      let hasVisiblePoints = false;
      const interpolation = 1 - Math.exp(-deltaTime / (duration.fast * 500));
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f5f2ea";

      for (const particle of particles) {
        const progress = reduced
          ? 1
          : Math.min(
              Math.max((elapsed - particle.delay) / particle.duration, 0),
              1,
            );
        if (progress <= 0) continue;
        hasVisiblePoints = true;
        const eased = 1 - Math.pow(1 - progress, 4);
        const baseX =
          particle.startX + (particle.endX - particle.startX) * eased;
        const baseY =
          particle.startY + (particle.endY - particle.startY) * eased;
        let targetX = 0;
        let targetY = 0;

        if (interactive && progress === 1 && pointer.active) {
          const deltaX = particle.endX - pointer.x;
          const deltaY = particle.endY - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);
          if (distance > 0.001 && distance < INTERACTION_RADIUS) {
            const force =
              Math.pow(1 - distance / INTERACTION_RADIUS, 2) * MAX_REPULSION;
            targetX = (deltaX / distance) * force;
            targetY = (deltaY / distance) * force;
          }
        }

        const deltaX = targetX - particle.offsetX;
        const deltaY = targetY - particle.offsetY;
        particle.offsetX = reduced
          ? 0
          : particle.offsetX + deltaX * interpolation;
        particle.offsetY = reduced
          ? 0
          : particle.offsetY + deltaY * interpolation;
        if (!reduced && (Math.abs(deltaX) > 0.04 || Math.abs(deltaY) > 0.04))
          needsAnotherFrame = true;

        context.globalAlpha = particle.opacity * Math.min(progress * 4, 1);
        context.beginPath();
        context.arc(
          baseX + particle.offsetX,
          baseY + particle.offsetY,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;
      if (hasVisiblePoints) parent.dataset.ready = "true";
      return needsAnotherFrame;
    };

    const tick = (timestamp: number) => {
      animationFrame = 0;
      if (disposed || !visible || document.hidden || points.length === 0)
        return;
      const deltaTime = lastTimestamp
        ? Math.min(timestamp - lastTimestamp, 40)
        : 16;
      lastTimestamp = timestamp;
      if (draw(timestamp - (introStartedAt ?? timestamp), deltaTime)) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        lastTimestamp = 0;
      }
    };

    const requestDraw = () => {
      if (!animationFrame && visible && !document.hidden && points.length > 0) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const stopDrawing = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastTimestamp = 0;
      pointer.active = false;
    };

    const updateLayout = (force = false) => {
      if (points.length === 0) return;
      const bounds = canvas.getBoundingClientRect();
      const nextWidth = Math.max(Math.round(bounds.width), 1);
      const nextHeight = Math.max(Math.round(bounds.height), 1);
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
      particles = buildParticles(
        points,
        width,
        height,
        compactQuery.matches || !pointerQuery.matches,
      );
      // Preserve the intro clock on resize, orientation changes, and re-entry.
      introStartedAt ??= performance.now();
      requestDraw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canInteract() || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      requestDraw();
    };
    const handlePointerLeave = () => {
      pointer.active = false;
      requestDraw();
    };
    const handleCapabilityChange = () => {
      pointer.active = false;
      updateLayout(true);
      requestDraw();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopDrawing();
      else requestDraw();
    };

    const resizeObserver = new ResizeObserver(() => updateLayout());
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) requestDraw();
      else stopDrawing();
    });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    parent.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    parent.addEventListener("pointerleave", handlePointerLeave);
    reducedQuery.addEventListener("change", handleCapabilityChange);
    pointerQuery.addEventListener("change", handleCapabilityChange);
    compactQuery.addEventListener("change", handleCapabilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    image.onload = () => {
      if (disposed || points.length > 0) return;
      points = collectLogoPoints(image);
      updateLayout();
    };
    image.src = LOGO_PATH;

    return () => {
      disposed = true;
      image.onload = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
      reducedQuery.removeEventListener("change", handleCapabilityChange);
      pointerQuery.removeEventListener("change", handleCapabilityChange);
      compactQuery.removeEventListener("change", handleCapabilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopDrawing();
    };
  }, []);

  return (
    <div aria-hidden="true" className="particle-logo">
      <span className="particle-logo-fallback">&lt;LM/&gt;</span>
      <canvas className="particle-canvas" ref={canvasRef} />
    </div>
  );
}
