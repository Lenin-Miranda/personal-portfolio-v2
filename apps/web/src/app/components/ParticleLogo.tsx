"use client";

import { type RefObject, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const LOGO_PATH = "/brand/lenin-miranda-icon.png";
const SOURCE_SIZE = 512;

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
    delay: 1050 + random() * 800,
    duration: 1600 + random() * 700,
    endX: centerX + point.x * logoSize,
    endY: targetCenterY + point.y * logoSize,
    opacity: 0.64 + random() * 0.3,
    radius: (isCompact ? 0.95 : 1.1) + random() * 1.35,
    startX: centerX + (random() - 0.5) * nameWidth,
    startY: sourceCenterY + (random() - 0.5) * (isCompact ? 24 : 34),
    twinkleOffset: random() * Math.PI * 2,
    twinkleSpeed: 0.0013 + random() * 0.0012,
  }));
}

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

export default function ParticleLogo({ nameRef }: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const logoImage = new Image();
    let animationFrame = 0;
    let hasAnimated = false;
    let isDisposed = false;
    let logoPoints: LogoPoint[] = [];

    const drawParticles = (
      particles: Particle[],
      elapsed: number,
      twinkle: boolean,
    ) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);

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
            ? 0.62 +
              0.38 *
                ((Math.sin(
                  elapsed * particle.twinkleSpeed + particle.twinkleOffset,
                ) +
                  1) /
                  2)
            : 1;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.opacity * reveal * twinkleStrength})`;
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const render = (animate: boolean) => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

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
      const particles = buildParticles(logoPoints, width, height, namePosition);

      if (reduceMotion) {
        drawParticles(particles, Number.POSITIVE_INFINITY, false);
        return;
      }

      const startedAt = animate ? performance.now() : performance.now() - 5000;
      let lastDrawAt = 0;

      const drawFrame = (timestamp: number) => {
        if (isDisposed) {
          return;
        }

        if (timestamp - lastDrawAt >= 1000 / 30) {
          drawParticles(particles, timestamp - startedAt, true);
          lastDrawAt = timestamp;
        }

        animationFrame = window.requestAnimationFrame(drawFrame);
      };

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const renderForCurrentSize = () => {
      if (logoPoints.length === 0) {
        return;
      }

      window.cancelAnimationFrame(animationFrame);
      render(!hasAnimated);
      hasAnimated = true;
    };

    const resizeObserver = new ResizeObserver(renderForCurrentSize);
    resizeObserver.observe(canvas);

    if (nameRef.current) {
      resizeObserver.observe(nameRef.current);
    }

    logoImage.onload = () => {
      if (isDisposed) {
        return;
      }

      logoPoints = collectLogoPoints(logoImage);
      renderForCurrentSize();
    };
    logoImage.src = LOGO_PATH;

    return () => {
      isDisposed = true;
      logoImage.onload = null;
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [nameRef, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
