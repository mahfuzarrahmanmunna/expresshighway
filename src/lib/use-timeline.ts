// ──────────────────────────────────────────────────────────────
// lib/use-timeline.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

interface TimelineStep {
  /** Target element or selector (relative to container) */
  target: string;
  /** GSAP fromTo vars */
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  /** Position label (e.g. ">", "<+=0.5") */
  position?: string | number;
}

interface UseTimelineOptions {
  /** ScrollTrigger trigger selector (relative to container) */
  trigger?: string;
  /** Start position */
  start?: string;
  /** End position */
  end?: string;
  /** Scrub */
  scrub?: boolean | number;
  /** Dev markers */
  markers?: boolean;
  /** Disable */
  disabled?: boolean;
}

export function useTimeline(
  containerRef: React.RefObject<HTMLElement | null>,
  steps: TimelineStep[],
  options: UseTimelineOptions = {},
) {
  const {
    trigger,
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    markers = false,
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled || !steps.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger ? container.querySelector(trigger) : container,
          start,
          end,
          scrub: scrub || undefined,
          once: !scrub ? true : undefined,
          markers,
        },
      });

      tlRef.current = tl;

      steps.forEach((step) => {
        const el = container.querySelector(step.target);
        if (!el) return;

        tl.fromTo(el, step.from, {
          ...step.to,
          position: step.position ?? ">",
        });
      });

      if (isReducedMotion) {
        tl.progress(1).kill();
      }
    }, container);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isReducedMotion]);

  return tlRef;
}
