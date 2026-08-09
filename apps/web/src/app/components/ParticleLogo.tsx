"use client";

import { type RefObject, useEffect, useRef } from "react";

const LOGO_PATH = "/brand/lenin-miranda-icon.png";
const SOURCE_SIZE = 512;
const INTRO_DURATION = 4000;
const SETTLED_FRAME_INTERVAL = 1000 / 30;

type LogoPoint = {
  x: number;
  y: number;
};

type NamePosition = {
  centerY: number;
  top: number;
};

type Particle = {
  delay: number;
  duration: number;
  endX: number;
  endY: number;
  opacity: number;
  radius: number;
  startX: number;
  startY: number;
  twinkleOffset: number;
  twinkleSpeed: number;
};

type ParticleLogoProps = {
  nameRef: RefObject<HTMLDivElement | null>;
};

type DrawArea = {
  height: number;
  width: number;
  x: number;
  y: number;
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
      const brightness = (red + green + blue) / 3;

      if (alpha > 160 && brightness > 68) {
        points.push({
          x: x / SOURCE_SIZE - 0.5,
          y: y / SOURCE_SIZE - 0.5,
        });
      }
    }
  }

  return points;
}

function buildParticles(
  points: LogoPoint[],
  width: number,
  height: number,
  namePosition: NamePosition,
) {
  const random = createRandom(2026);
  const shuffledPoints = [...points];

  for (let index = shuffledPoints.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const currentPoint = shuffledPoints[index];
    const swapPoint = shuffledPoints[swapIndex];

    if (!currentPoint || !swapPoint) {
      continue;
    }

    shuffledPoints[index] = swapPoint;
    shuffledPoints[swapIndex] = currentPoint;
  }

  const isCompact = width < 640;
  const particleLimit = isCompact ? 190 : 340;
  const logoSize = Math.min(
    width * (isCompact ? 0.82 : 0.68),
    height * (isCompact ? 0.9 : 0.92),
    760,
  );
  const visiblePoints = shuffledPoints.slice(0, particleLimit);
  const logoBottom = visiblePoints.reduce(
    (lowestPoint, point) => Math.max(lowestPoint, point.y),
    0,
  );
  const centerX = width / 2;
  const targetCenterY = namePosition.top - 20 - logoBottom * logoSize;
  const sourceCenterY = namePosition.centerY;
  const nameWidth = Math.min(width * 0.78, 920);

  return visiblePoints.map((point) => ({
    delay: 750 + random() * 600,
    duration: 1750 + random() * 650,
    endX: centerX + point.x * logoSize,
    endY: targetCenterY + point.y * logoSize,
    opacity: 0.72 + random() * 0.28,
    radius: (isCompact ? 0.95 : 1.1) + random() * 1.35,
    startX: centerX + (random() - 0.5) * nameWidth,
    startY: sourceCenterY + (random() - 0.5) * (isCompact ? 24 : 34),
    twinkleOffset: random() * Math.PI * 2,
    twinkleSpeed: 0.0022 + random() * 0.0014,
  }));
}

function getDrawArea(particles: Particle[], width: number, height: number) {
  const padding = 8;
  let left = width;
  let right = 0;
  let top = height;
  let bottom = 0;

  for (const particle of particles) {
    left = Math.min(left, particle.startX, particle.endX);
    right = Math.max(right, particle.startX, particle.endX);
    top = Math.min(top, particle.startY, particle.endY);
    bottom = Math.max(bottom, particle.startY, particle.endY);
  }

  const x = Math.max(Math.floor(left - padding), 0);
  const y = Math.max(Math.floor(top - padding), 0);

  return {
    height: Math.min(Math.ceil(bottom + padding), height) - y,
    width: Math.min(Math.ceil(right + padding), width) - x,
    x,
    y,
  } satisfies DrawArea;
}

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

export default function ParticleLogo({ nameRef }: ParticleLogoProps) {
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

    const logoImage = new Image();
    let animationFrame = 0;
    let drawArea: DrawArea = { height: 0, width: 0, x: 0, y: 0 };
    let isDisposed = false;
    let lastDrawAt = 0;
    let logoPoints: LogoPoint[] = [];
    let particles: Particle[] = [];
    let startedAt = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const drawParticles = (
      particles: Particle[],
      elapsed: number,
      twinkle: boolean,
    ) => {
      context.clearRect(
        drawArea.x,
        drawArea.y,
        drawArea.width,
        drawArea.height,
      );
      context.fillStyle = "#ffffff";

      for (const particle of particles) {
        const rawProgress = (elapsed - particle.delay) / particle.duration;
        const progress = Math.min(Math.max(rawProgress, 0), 1);

        if (progress <= 0) {
          continue;
        }

        const easedProgress = easeOutQuart(progress);
        const x =
          particle.startX + (particle.endX - particle.startX) * easedProgress;
        const y =
          particle.startY + (particle.endY - particle.startY) * easedProgress;
        const reveal = Math.min(progress * 3, 1);
        const twinkleStrength =
          twinkle && progress === 1
            ? 0.28 +
              0.72 *
                Math.pow(
                  (Math.sin(
                    elapsed * particle.twinkleSpeed + particle.twinkleOffset,
                  ) +
                    1) /
                    2,
                  2,
                )
            : 1;

        context.globalAlpha = particle.opacity * reveal * twinkleStrength;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const updateParticleLayout = () => {
      if (logoPoints.length === 0) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const nameBounds = nameRef.current?.getBoundingClientRect();
      const namePosition = nameBounds
        ? {
            centerY: nameBounds.top - bounds.top + nameBounds.height / 2,
            top: nameBounds.top - bounds.top,
          }
        : {
            centerY: height * 0.62,
            top: height * 0.55,
          };
      particles = buildParticles(logoPoints, width, height, namePosition);
      drawArea = getDrawArea(particles, width, height);

      if (reduceMotion) {
        drawParticles(particles, Number.POSITIVE_INFINITY, false);
      }
    };

    const drawFrame = (timestamp: number) => {
      if (isDisposed) {
        return;
      }

      const elapsed = timestamp - startedAt;
      const isIntroPlaying = elapsed < INTRO_DURATION;

      if (isIntroPlaying || timestamp - lastDrawAt >= SETTLED_FRAME_INTERVAL) {
        drawParticles(particles, elapsed, true);
        lastDrawAt = timestamp;
      }

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const handleResize = () => {
      updateParticleLayout();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    if (nameRef.current) {
      resizeObserver.observe(nameRef.current);
    }

    const prepareLogo = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          logoImage.onload = () => resolve();
          logoImage.onerror = () => reject(new Error("Logo image failed"));
          logoImage.src = LOGO_PATH;

          if (logoImage.complete && logoImage.naturalWidth > 0) {
            resolve();
          }
        });
      } catch {
        return;
      }

      if (isDisposed) {
        return;
      }

      logoPoints = collectLogoPoints(logoImage);
      startedAt = performance.now();
      updateParticleLayout();

      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    void prepareLogo();

    return () => {
      isDisposed = true;
      logoImage.onload = null;
      logoImage.onerror = null;
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [nameRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
