// ──────────────────────────────────────────────────────────────
// lib/use-pinned-section.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./animation-provider";

interface UsePinnedSectionOptions {
  /** ScrollTrigger start */
  start?: string;
  /** ScrollTrigger end */
  end?: string;
  /** End trigger element selector */
  endTrigger?: string;
  /** Pin spacer */
  spacerClass?: string;
  /** Dev markers */
  markers?: boolean;
  /** Disable */
  disabled?: boolean;
}

export function usePinnedSection(
  ref: React.RefObject<HTMLElement | null>,
  options: UsePinnedSectionOptions = {},
) {
  const {
    start = "top top",
    end = "+=100%",
    endTrigger,
    spacerClass,
    markers = false,
    disabled = false,
  } = options;

  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || isReducedMotion) return;

            const ctx = gsap.context(() => {
              ScrollTrigger.create({
                trigger: el,
                start,
                end: endTrigger ? undefined : end,
                endTrigger: endTrigger
                  ? document.querySelector(endTrigger)
                  : undefined,
                // ✅ Cast to any to bypass GSAP's incomplete type definition for PinConfig
                pin: (spacerClass ? { pin: true, spacerClass } : true) as any,
                markers,
              });
            }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isReducedMotion]);
}
