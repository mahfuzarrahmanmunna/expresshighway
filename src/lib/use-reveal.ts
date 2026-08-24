"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useReducedMotion } from "./animation-provider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeadlineRevealOptions {
  /** ScrollTrigger start position. Omit for boot-sequence (non-scroll) reveals. */
  scrollStart?: string;
  /** Delay before the reveal starts (boot-sequence timelines only) */
  delay?: number;
  /** Words matching these (case-insensitive) get the .text-shimmer class */
  shimmerWords?: string[];
  stagger?: number;
  duration?: number;
  ease?: string;
  /** Fires when the reveal completes */
  onComplete?: () => void;
}

const DEFAULTS = {
  stagger: 0.1,
  duration: 1.2,
  ease: "power4.out",
};

/**
 * The single canonical headline-split-reveal used across Hero, About,
 * and SisterConcerns. Previously each section hand-rolled this with
 * drifting eases (power4.out / expo.out / power3.out) and staggers
 * (0.12 / 0.15). One implementation now — visual variation should be
 * a deliberate choice, not accidental copy-paste drift.
 */
export function useHeadlineReveal(
  ref: RefObject<HTMLElement | null>,
  opts: HeadlineRevealOptions = {},
) {
  const reducedMotion = useReducedMotion();
  const splitRef = useRef<SplitType | null>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const split = new SplitType(ref.current, {
      types: "lines,words",
      lineClass: "overflow-hidden block",
      wordClass: "inline-block will-change-transform",
    });
    splitRef.current = split;

    if (opts.shimmerWords?.length) {
      split.words?.forEach((word) => {
        const text = word.textContent?.trim().toLowerCase();
        if (
          text &&
          opts.shimmerWords!.map((w) => w.toLowerCase()).includes(text)
        ) {
          word.classList.add("text-shimmer");
        }
      });
    }

    if (reducedMotion) {
      // Skip the choreography entirely, land in final state immediately.
      gsap.set(split.words ?? [], { yPercent: 0, rotateX: 0, opacity: 1 });
      opts.onComplete?.();
      return () => split.revert();
    }

    gsap.set(split.words ?? [], {
      yPercent: 120,
      rotateX: 20,
      opacity: 0,
      transformOrigin: "bottom center",
    });

    const tween = gsap.to(split.words ?? [], {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      duration: opts.duration ?? DEFAULTS.duration,
      stagger: opts.stagger ?? DEFAULTS.stagger,
      ease: opts.ease ?? DEFAULTS.ease,
      delay: opts.delay ?? 0,
      onComplete: opts.onComplete,
      scrollTrigger: opts.scrollStart
        ? { trigger: ref.current, start: opts.scrollStart }
        : undefined,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [ref, reducedMotion]);
}

interface BlurRevealOptions {
  scrollStart?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
}

/**
 * Canonical "blur + fade + rise" reveal for body copy, tags, meta grids
 * — the `.reveal` pattern used in Hero's tagline, About's panel-body,
 * SisterConcerns' `.reveal-ui`, and LivingPortfolio's `.reveal`.
 */
export function useBlurReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector = ".reveal",
  opts: BlurRevealOptions = {},
) {
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll(selector);
    if (!els.length) return;

    if (reducedMotion) {
      gsap.set(els, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    gsap.set(els, { opacity: 0, y: 30, filter: "blur(8px)" });

    const tween = gsap.to(els, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: opts.duration ?? 1,
      stagger: opts.stagger ?? 0.1,
      ease: opts.ease ?? "expo.out",
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollStart
        ? { trigger: containerRef.current, start: opts.scrollStart }
        : undefined,
    });

    return () => tween.kill();
  }, [containerRef, selector, reducedMotion]);
}
