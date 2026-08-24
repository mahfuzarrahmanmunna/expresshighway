"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealOptions {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  disabled?: boolean;
}

/**
 * One-shot scroll reveal. Element starts at CSS opacity-0 (applied by
 * caller) and GSAP animates it to visible when it enters the viewport.
 * Respects `disabled` for prefers-reduced-motion.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  opts: ScrollRevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || opts.disabled) return;

    const {
      y = 40,
      x = 0,
      scale,
      duration = 0.9,
      delay = 0,
      stagger,
      start = "top 88%",
    } = opts;

    const from: gsap.TweenVars = { y, x, opacity: 0 };
    const to: gsap.TweenVars = {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
    };

    if (scale !== undefined) {
      from.scale = scale;
      to.scale = 1;
    }
    if (stagger) to.stagger = stagger;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.disabled]);
}
