// ──────────────────────────────────────────────────────────────
// lib/use-split-text.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useReducedMotion } from "./animation-provider";

type SplitUnit = "chars" | "words" | "lines";

interface UseSplitTextOptions {
  /** What to split into */
  types?: SplitUnit;
  /** Animation preset */
  preset?: "reveal" | "slideUp" | "blur" | "3D" | "wave";
  /** Stagger between units */
  stagger?: number;
  /** Duration per unit */
  duration?: number;
  /** Delay before animation */
  delay?: number;
  /** Easing */
  ease?: string;
  /** ScrollTrigger start */
  start?: string;
  /** Scrub mode */
  scrub?: boolean | number;
  /** Dev markers */
  markers?: boolean;
  /** Disable */
  disabled?: boolean;
}

const SPLIT_PRESETS: Record<
  string,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  reveal: {
    from: { y: 100, opacity: 0, rotateX: -80 },
    to: { y: 0, opacity: 1, rotateX: 0 },
  },
  slideUp: {
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1 },
  },
  blur: {
    from: { filter: "blur(10px)", opacity: 0 },
    to: { filter: "blur(0px)", opacity: 1 },
  },
  "3D": {
    from: { y: 40, opacity: 0, rotateX: -90, transformOrigin: "center bottom" },
    to: { y: 0, opacity: 1, rotateX: 0 },
  },
  wave: {
    from: { y: 30, opacity: 0, scale: 0.8 },
    to: { y: 0, opacity: 1, scale: 1 },
  },
};

export function useSplitText(
  ref: React.RefObject<HTMLElement | null>,
  options: UseSplitTextOptions = {},
) {
  const {
    types = "words",
    preset = "slideUp",
    stagger = 0.03,
    duration = 0.7,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
    scrub = false,
    markers = false,
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();
  const splitInstanceRef = useRef<SplitType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    // Cleanup previous split
    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
    }

    const split = new SplitType(el, { types });
    splitInstanceRef.current = split;

    const targets = split[types] as HTMLElement[];
    if (!targets?.length) return;

    if (isReducedMotion) {
      gsap.set(targets, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        scale: 1,
      });
      return;
    }

    const presetConfig = SPLIT_PRESETS[preset] ?? SPLIT_PRESETS.slideUp;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { ...presetConfig.from },
        {
          ...presetConfig.to,
          stagger,
          duration: scrub ? undefined : duration,
          delay: scrub ? undefined : delay,
          ease: scrub ? undefined : ease,
          scrollTrigger: scrub
            ? {
                trigger: el,
                start,
                scrub,
                markers,
              }
            : {
                trigger: el,
                start,
                once: true,
                markers,
              },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      splitInstanceRef.current?.revert();
      splitInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types, preset, disabled, isReducedMotion]);

  return splitInstanceRef;
}
