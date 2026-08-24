// ──────────────────────────────────────────────────────────────
// lib/animation-provider.tsx
// ──────────────────────────────────────────────────────────────
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "lenis";

// ──────────────────────────────────────────────
// Plugin Registration (safe for SSR)
// ──────────────────────────────────────────────
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface AnimationContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: ScrollOptions) => void;
  scrollProgress: number;
  isReducedMotion: boolean;
  refreshScrollTriggers: () => void;
}

interface ScrollOptions {
  offset?: number;
  duration?: number;
  ease?: string;
  immediate?: boolean;
  lock?: boolean;
}

interface AnimationProviderProps {
  children: ReactNode;
  skipSplash?: boolean;
}

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────
const AnimationContext = createContext<AnimationContextValue | null>(null);

// ──────────────────────────────────────────────
// External Store: prefers-reduced-motion
// ──────────────────────────────────────────────
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

// ──────────────────────────────────────────────
// External Store: Lenis instance
// ──────────────────────────────────────────────
let lenisInstance: Lenis | null = null;
const lenisSubscribers = new Set<() => void>();

function subscribeLenis(callback: () => void) {
  lenisSubscribers.add(callback);
  return () => {
    lenisSubscribers.delete(callback);
  };
}

function getLenisSnapshot() {
  return lenisInstance;
}

function getLenisServerSnapshot() {
  return null;
}

function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
  lenisSubscribers.forEach((cb) => cb());
}

// ──────────────────────────────────────────────
// Provider Component
// ──────────────────────────────────────────────
export function AnimationProvider({
  children,
  skipSplash = false,
}: AnimationProviderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isInitializedRef = useRef(false);

  // ── External store subscriptions ──
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const lenis = useSyncExternalStore(
    subscribeLenis,
    getLenisSnapshot,
    getLenisServerSnapshot,
  );

  // ── Initialize Lenis + GSAP Sync ──
  useEffect(() => {
    if (isInitializedRef.current || typeof window === "undefined") return;
    isInitializedRef.current = true;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenisInstance(instance);

    instance.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      instance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    instance.on("scroll", ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    if (mq.matches) {
      instance.options.duration = 0;
      instance.options.smoothWheel = false;
    }

    return () => {
      gsap.ticker.remove(instance.raf as unknown as gsap.TickerCallback);
      instance.destroy();
      setLenisInstance(null);
      isInitializedRef.current = false;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ── Lock/Unlock scroll based on Splash Screen state ──
  useEffect(() => {
    if (!lenis) return;
    if (skipSplash) {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [lenis, skipSplash]);

  // ── Programmatic Scroll ──
  const scrollTo = useCallback(
    (target: string | HTMLElement, options: ScrollOptions = {}) => {
      const {
        offset = 0,
        duration = 1.2,
        ease = "power3.inOut",
        immediate = false,
        lock = false,
      } = options;

      if (immediate || isReducedMotion) {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }

      if (lock && lenis) {
        lenis.stop();
        const captured = lenis;
        setTimeout(() => captured.start(), (duration + 0.1) * 1000);
      }

      const el =
        typeof target === "string" ? document.querySelector(target) : target;

      if (el) {
        gsap.to(window, {
          scrollTo: { y: el, offsetY: offset },
          duration,
          ease,
        });
      }
    },
    [isReducedMotion, lenis],
  );

  // ── Refresh All ScrollTriggers ──
  const refreshScrollTriggers = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  // ── Context Value ──
  const value: AnimationContextValue = {
    lenis,
    scrollTo,
    scrollProgress,
    isReducedMotion,
    refreshScrollTriggers,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

// ──────────────────────────────────────────────
// Hooks
// ──────────────────────────────────────────────

/** Access the full animation context */
export function useAnimation() {
  const ctx = useContext(AnimationContext);
  if (!ctx) {
    throw new Error("useAnimation must be used within <AnimationProvider>");
  }
  return ctx;
}

/** Access the Lenis instance directly */
export function useLenis() {
  const { lenis } = useAnimation();
  return lenis;
}

/** Global scroll progress 0–1 */
export function useScrollProgress() {
  const { scrollProgress } = useAnimation();
  return scrollProgress;
}

/** Whether the user prefers reduced motion */
export function useReducedMotion() {
  const { isReducedMotion } = useAnimation();
  return isReducedMotion;
}

/** Convenience: smooth scroll to target */
export function useSmoothScroll() {
  const { scrollTo } = useAnimation();
  return scrollTo;
}

/** Refresh all ScrollTriggers (call after layout changes) */
export function useRefreshTriggers() {
  const { refreshScrollTriggers } = useAnimation();
  return refreshScrollTriggers;
}

/**
 * Track which section is currently in view.
 * Returns the active section id (with # prefix) or empty string.
 */
export function useActiveSection(
  sectionIds: string[],
  rootMargin = "-40% 0px -55% 0px",
) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const selectors = sectionIds
      .map((id) => `[id="${id.replace("#", "")}"]`)
      .join(",");
    const els = document.querySelectorAll(selectors);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin, threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return active;
}

/**
 * Track scroll progress of a specific element relative to viewport.
 * Returns progress 0→1 as the element scrolls through view.
 */
export function useElementScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [ref]);

  return progress;
}

/**
 * Lock/unlock Lenis scrolling (useful for modals, drawers)
 */
export function useScrollLock() {
  const { lenis } = useAnimation();

  const lock = useCallback(() => lenis?.stop(), [lenis]);
  const unlock = useCallback(() => lenis?.start(), [lenis]);
  const toggle = useCallback(
    (state?: boolean) => {
      const shouldLock = state ?? !lenis?.isStopped;
      shouldLock ? lock() : unlock();
    },
    [lenis, lock, unlock],
  );

  return { lock, unlock, toggle, isLocked: lenis?.isStopped ?? false };
}

export default AnimationProvider;
