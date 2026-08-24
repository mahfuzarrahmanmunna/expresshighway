// ──────────────────────────────────────────────────────────────
// lib/use-count-up.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

interface UseCountUpOptions {
  /** Target number */
  end: number;
  /** Starting number */
  start?: number;
  /** Duration in seconds */
  duration?: number;
  /** Decimal places */
  decimals?: number;
  /** Prefix (e.g. "$") */
  prefix?: string;
  /** Suffix (e.g. "%") */
  suffix?: string;
  /** Thousand separator */
  separator?: string;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Easing */
  ease?: string;
}

function formatNumber(
  n: number,
  decimals: number,
  prefix: string,
  suffix: string,
  separator: string,
): string {
  const fixed = n.toFixed(decimals);
  if (!separator) return `${prefix}${fixed}${suffix}`;

  const [intPart, decPart] = fixed.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return `${prefix}${formatted}${decPart ? "." + decPart : ""}${suffix}`;
}

export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  options: UseCountUpOptions,
) {
  const {
    end,
    start = 0,
    duration = 2,
    decimals = 0,
    prefix = "",
    suffix = "",
    separator = ",",
    triggerStart = "top 85%",
    ease = "power2.out",
  } = options;

  const isReducedMotion = useReducedMotion();
  const objRef = useRef({ value: start });

  // State is only needed for the animated path
  const [displayValue, setDisplayValue] = useState(() =>
    formatNumber(start, decimals, prefix, suffix, separator),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion) return; // Skip effect entirely if reduced motion

    objRef.current.value = start;

    const ctx = gsap.context(() => {
      gsap.to(objRef.current, {
        value: end,
        duration,
        ease,
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          once: true,
        },
        onUpdate: () => {
          // This is an async callback from GSAP, so it's safe to use setState here
          setDisplayValue(
            formatNumber(
              objRef.current.value,
              decimals,
              prefix,
              suffix,
              separator,
            ),
          );
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start, duration, decimals, isReducedMotion]);

  // If reduced motion is on, bypass state entirely and return the formatted end value.
  // This prevents the synchronous setState in effect error.
  return isReducedMotion
    ? formatNumber(end, decimals, prefix, suffix, separator)
    : displayValue;
}
