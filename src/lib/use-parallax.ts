// ──────────────────────────────────────────────────────────────
// lib/use-parallax.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

interface UseParallaxOptions {
  /** Speed multiplier: positive = moves with scroll, negative = against */
  speed?: number;
  /** Direction */
  direction?: "y" | "x";
  /** ScrollTrigger start */
  start?: string;
  /** ScrollTrigger end */
  end?: string;
  /** Disable */
  disabled?: boolean;
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  options: UseParallaxOptions = {},
) {
  const {
    speed = -0.3,
    direction = "y",
    start = "top bottom",
    end = "bottom top",
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || isReducedMotion) return;

    const prop = direction === "y" ? "y" : "x";
    const distance = Math.abs(speed) * 200;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [prop]: speed > 0 ? -distance : distance },
        {
          [prop]: speed > 0 ? distance : -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, direction, disabled, isReducedMotion]);
}

/**
 * Parallax for background images (scale on scroll)
 */
export function useImageParallax(
  ref: React.RefObject<HTMLElement | null>,
  options: { scale?: number; disabled?: boolean } = {},
) {
  const { scale = 1.15, disabled = false } = options;
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [scale, disabled, isReducedMotion]);
}
