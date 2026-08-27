"use client";

import { useEffect, useRef } from "react";

const LOGO_PATH = "/brand/lenin-miranda-mark.png";
const SOURCE_SIZE = 512;
const INTRO_DURATION = 2400;
const INTERACTION_RADIUS = 84;
const MAX_REPULSION = 10;
const POINTER_EASING = 0.16;

type LogoPoint = {
  x: number;
  y: number;
};

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

function collectLogoPoints(image: HTMLImageElement) {
  const sourceCanvas = document.createElement("canvas");
  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!sourceContext) {
    return [];
  }

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
  const sampleGap = 6;

  for (let y = 0; y < SOURCE_SIZE; y += sampleGap) {
    for (let x = 0; x < SOURCE_SIZE; x += sampleGap) {
      const pixelIndex = (y * SOURCE_SIZE + x) * 4;
      const red = pixels[pixelIndex] ?? 0;
      const green = pixels[pixelIndex + 1] ?? 0;
      const blue = pixels[pixelIndex + 2] ?? 0;
      const alpha = pixels[pixelIndex + 3] ?? 0;

      if (alpha > 160 && (red + green + blue) / 3 > 68) {
        points.push({ x: x / SOURCE_SIZE - 0.5, y: y / SOURCE_SIZE - 0.5 });
      }
    }
  }

  return points;
}

function buildParticles(points: LogoPoint[], width: number, height: number) {
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

  const isCompact = width < 460;
  const visiblePoints = shuffledPoints.slice(0, isCompact ? 180 : 300);
  const logoSize = Math.min(width * 0.86, height * 0.9, 470);
  const centerX = width / 2;
  const centerY = height / 2;

  return visiblePoints.map((point) => ({
    delay: 120 + random() * 520,
    duration: 1200 + random() * 620,
    endX: centerX + point.x * logoSize,
    endY: centerY + point.y * logoSize,
    offsetX: 0,
    offsetY: 0,
    opacity: 0.66 + random() * 0.34,
    radius: (isCompact ? 0.85 : 1) + random() * 1.2,
    startX: centerX + (random() - 0.5) * width * 0.9,
    startY: height * (0.74 + random() * 0.18),
  }));
}

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

export default function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { desynchronized: true });

    if (!context) {
      return;
    }

    const image = new Image();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canInteract =
      !reducedMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointer = { active: false, x: 0, y: 0 };
    let animationFrame = 0;
    let disposed = false;
    let introStartedAt = 0;
    let isAnimating = false;
    let points: LogoPoint[] = [];
    let particles: Particle[] = [];

    const draw = (elapsed: number, interactive: boolean) => {
      const bounds = canvas.getBoundingClientRect();
      let needsAnotherFrame = elapsed < INTRO_DURATION;

      context.clearRect(0, 0, bounds.width, bounds.height);
      context.fillStyle = "#f5f2ea";

      for (const particle of particles) {
        const rawProgress = reducedMotion
          ? 1
          : (elapsed - particle.delay) / particle.duration;
        const progress = Math.min(Math.max(rawProgress, 0), 1);

        if (progress <= 0) {
          continue;
        }

        const easedProgress = easeOutQuart(progress);
        const baseX =
          particle.startX + (particle.endX - particle.startX) * easedProgress;
        const baseY =
          particle.startY + (particle.endY - particle.startY) * easedProgress;
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

        const offsetDeltaX = targetX - particle.offsetX;
        const offsetDeltaY = targetY - particle.offsetY;
        particle.offsetX += offsetDeltaX * POINTER_EASING;
        particle.offsetY += offsetDeltaY * POINTER_EASING;

        if (Math.abs(offsetDeltaX) > 0.04 || Math.abs(offsetDeltaY) > 0.04) {
          needsAnotherFrame = true;
        }

        context.globalAlpha = particle.opacity * Math.min(progress * 3, 1);
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
      return needsAnotherFrame;
    };

    const tick = (timestamp: number) => {
      if (disposed) {
        return;
      }

      const keepAnimating = draw(timestamp - introStartedAt, canInteract);

      if (keepAnimating) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        isAnimating = false;
      }
    };

    const requestDraw = () => {
      if (isAnimating || reducedMotion) {
        return;
      }

      isAnimating = true;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const updateLayout = () => {
      if (points.length === 0) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = buildParticles(points, width, height);

      if (reducedMotion) {
        draw(Number.POSITIVE_INFINITY, false);
      } else {
        introStartedAt = performance.now();
        requestDraw();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const wasActive = pointer.active;
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.x <= bounds.width &&
        pointer.y >= 0 &&
        pointer.y <= bounds.height;

      if (pointer.active || wasActive) {
        requestDraw();
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      requestDraw();
    };

    const parent = canvas.parentElement;
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(canvas);

    if (canInteract && parent) {
      parent.addEventListener("pointermove", handlePointerMove);
      parent.addEventListener("pointerleave", handlePointerLeave);
    }

    image.onload = () => {
      if (disposed) {
        return;
      }

      points = collectLogoPoints(image);
      updateLayout();
    };
    image.src = LOGO_PATH;

    if (image.complete && image.naturalWidth > 0) {
      image.onload(new Event("load"));
    }

    return () => {
      disposed = true;
      image.onload = null;
      resizeObserver.disconnect();
      parent?.removeEventListener("pointermove", handlePointerMove);
      parent?.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas aria-hidden="true" className="particle-canvas" ref={canvasRef} />
  );
}
