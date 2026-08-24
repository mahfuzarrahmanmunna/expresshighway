// ──────────────────────────────────────────────────────────────
// lib/use-horizontal-scroll.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

interface UseHorizontalScrollOptions {
  /** Selector for items inside the container */
  itemSelector?: string;
  /** Gap between items in px */
  gap?: number;
  /** ScrollTrigger start */
  start?: string;
  /** Dev markers */
  markers?: boolean;
  /** Disable (falls back to normal scroll) */
  disabled?: boolean;
}

export function useHorizontalScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  wrapperRef: React.RefObject<HTMLElement | null>,
  options: UseHorizontalScrollOptions = {},
) {
  const {
    itemSelector = "> *",
    gap = 24,
    start = "top top",
    markers = false,
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper || disabled || isReducedMotion) return;

    const items = wrapper.querySelectorAll(itemSelector);
    if (!items.length) return;

    // Calculate total scroll width
    const totalWidth =
      Array.from(items).reduce(
        (acc, item) => acc + (item as HTMLElement).offsetWidth + gap,
        0,
      ) - gap;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        x: () => -(totalWidth - container.offsetWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start,
          end: () => `+=${totalWidth - container.offsetWidth}`,
          markers,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isReducedMotion]);
}
