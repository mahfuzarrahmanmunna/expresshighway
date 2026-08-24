"use client";

import { useEffect, type MutableRefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CounterOptions {
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  disabled?: boolean;
}

export interface CounterItem {
  endValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number; // 👈 YOU MUST ADD THIS LINE
}

/**
 * Single-element counter.
 */
export function useCounter(
  ref: MutableRefObject<HTMLElement | null>,
  endValue: number,
  opts: CounterOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (opts.disabled) {
      const { prefix = "", suffix = "", decimals = 0 } = opts;
      el.textContent = prefix + endValue.toFixed(decimals) + suffix;
      return;
    }

    const { duration = 2.2, prefix = "", suffix = "", decimals = 0 } = opts;
    const obj = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: endValue,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate() {
          el!.textContent = prefix + obj.value.toFixed(decimals) + suffix;
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, opts.disabled]);
}

/**
 * Bulk counter — animates multiple elements from a single useEffect.
 * Accepts the ref object itself (not .current) to avoid reading
 * refs during render.
 *
 * @param refsRef  - MutableRefObject holding the array of DOM elements
 * @param items    - Config for each counter (must be same length as refs)
 * @param disabled - prefers-reduced-motion override
 */
export function useCounters(
  refsRef: MutableRefObject<(HTMLElement | null)[]>,
  items: CounterItem[],
  disabled = false,
) {
  useEffect(() => {
    /* Read .current safely inside the effect, not during render */
    const refs = refsRef.current;

    if (disabled) {
      refs.forEach((el, i) => {
        if (!el) return;
        const { prefix = "", suffix = "", decimals = 0 } = items[i] ?? {};
        el.textContent =
          prefix + (items[i]?.endValue ?? 0).toFixed(decimals) + suffix;
      });
      return;
    }

        const ctx = gsap.context(() => {
          refs.forEach((el, i) => {
            if (!el) return;

            // 1. Get the item safely
            const item = items[i];
            if (!item) return;

            // 2. Destructure all properties from the item
            const {
              endValue,
              prefix = "",
              suffix = "",
              decimals = 0,
              duration = 2.2,
            } = item;

            const obj = { value: 0 };

            gsap.to(obj, {
              value: endValue, // Now endValue is properly defined
              duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
              onUpdate() {
                el!.textContent = prefix + obj.value.toFixed(decimals) + suffix;
              },
            });
          });
        });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
