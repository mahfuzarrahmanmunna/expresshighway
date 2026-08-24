// ──────────────────────────────────────────────────────────────
// lib/use-gsap-animation.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

// ──────────────────────────────────────────────
// Preset Animation Variants
// ──────────────────────────────────────────────
type AnimationPreset =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "revealMask"
  | "blurReveal"
  | "clipReveal";

interface UseGSAPAnimationOptions {
  /** GSAP animation preset */
  preset?: AnimationPreset;
  /** Custom GSAP from vars (overrides preset) */
  from?: gsap.TweenVars;
  /** Custom GSAP to vars (overrides preset) */
  to?: gsap.TweenVars;
  /** ScrollTrigger start position */
  start?: string;
  /** ScrollTrigger end position */
  end?: string;
  /** Toggle or one-shot */
  toggle?: boolean;
  /** Stagger delay for child elements */
  stagger?: number;
  /** Base duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Easing */
  ease?: string;
  /** ScrollTrigger scrub */
  scrub?: boolean | number;
  /** Marker (dev only) */
  markers?: boolean;
  /** Disable entirely */
  disabled?: boolean;
  /** Run once then destroy trigger */
  once?: boolean;
}

const PRESETS: Record<
  AnimationPreset,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  fadeUp: {
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1 },
  },
  fadeDown: {
    from: { y: -60, opacity: 0 },
    to: { y: 0, opacity: 1 },
  },
  fadeLeft: {
    from: { x: -80, opacity: 0 },
    to: { x: 0, opacity: 1 },
  },
  fadeRight: {
    from: { x: 80, opacity: 0 },
    to: { x: 0, opacity: 1 },
  },
  scaleIn: {
    from: { scale: 0.85, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  revealMask: {
    from: { yPercent: 100 },
    to: { yPercent: 0 },
  },
  blurReveal: {
    from: { filter: "blur(12px)", opacity: 0 },
    to: { filter: "blur(0px)", opacity: 1 },
  },
  clipReveal: {
    from: { clipPath: "inset(100% 0% 0% 0%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)" },
  },
};

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────
export function useGSAPAnimation(
  ref: React.RefObject<HTMLElement | null>,
  options: UseGSAPAnimationOptions = {},
) {
  const {
    preset = "fadeUp",
    from,
    to,
    start = "top 85%",
    end = "bottom 20%",
    toggle = false,
    stagger = 0,
    duration = 0.9,
    delay = 0,
    ease = "power3.out",
    scrub = false,
    markers = false,
    disabled = false,
    once = true,
  } = options;

  const isReducedMotion = useReducedMotion();
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || (isReducedMotion && !scrub)) {
      // If reduced motion, just show the element
      if (el && isReducedMotion) {
        const presetConfig = PRESETS[preset];
        gsap.set(el, presetConfig.to);
      }
      return;
    }

    if (once && hasRunRef.current) return;

    const presetConfig = PRESETS[preset];
    const fromVars: gsap.TweenVars = {
      ...(presetConfig?.from ?? {}),
      ...(from ?? {}),
      duration: scrub ? undefined : duration,
      delay: scrub ? undefined : delay,
      ease: scrub ? undefined : ease,
      stagger: stagger || undefined,
    };

    const toVars: gsap.TweenVars = {
      ...(presetConfig?.to ?? {}),
      ...(to ?? {}),
      duration: scrub ? undefined : duration,
      ease: scrub ? undefined : ease,
      stagger: stagger || undefined,
    };

    const ctx = gsap.context(() => {
      if (toggle) {
        gsap.to(el, {
          ...toVars,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            toggleActions: "play reverse play reverse",
            markers,
          },
        });

        // Set initial state
        gsap.set(el, fromVars);
      } else if (scrub) {
        gsap.fromTo(
          el,
          { ...fromVars, duration: undefined, ease: undefined },
          {
            ...toVars,
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub,
              markers,
            },
          },
        );
      } else {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            markers,
            onEnter: () => {
              if (once) hasRunRef.current = true;
            },
          },
        });
      }
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, disabled, isReducedMotion]);
}

// ──────────────────────────────────────────────
// Batch Animation Hook (for lists/grids)
// ──────────────────────────────────────────────
export function useGSAPStagger(
  parentRef: React.RefObject<HTMLElement | null>,
  childSelector: string,
  options: Omit<UseGSAPAnimationOptions, "stagger"> & { stagger?: number } = {},
) {
  const {
    preset = "fadeUp",
    from,
    to,
    start = "top 85%",
    stagger = 0.1,
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    markers = false,
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent || disabled) return;

    const children = parent.querySelectorAll(childSelector);
    if (!children.length) return;

    if (isReducedMotion) {
      const presetConfig = PRESETS[preset];
      gsap.set(children, presetConfig.to);
      return;
    }

    const presetConfig = PRESETS[preset];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        {
          ...(presetConfig?.from ?? {}),
          ...(from ?? {}),
        },
        {
          ...(presetConfig?.to ?? {}),
          ...(to ?? {}),
          duration,
          delay,
          ease,
          stagger,
          scrollTrigger: {
            trigger: parent,
            start,
            once: true,
            markers,
          },
        },
      );
    }, parent);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childSelector, preset, disabled, isReducedMotion]);
}
