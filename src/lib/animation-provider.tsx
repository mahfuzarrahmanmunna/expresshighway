"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface AnimationContextValue {
  lenis: null;
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

const AnimationContext = createContext<AnimationContextValue | null>(null);
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const scrollTo = useCallback(
    (target: string | HTMLElement, options: ScrollOptions = {}) => {
      const { immediate = false } = options;
      const element =
        typeof target === "string" ? document.querySelector(target) : target;

      if (!element) return;

      if (immediate || isReducedMotion) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [isReducedMotion],
  );

  const value: AnimationContextValue = {
    lenis: null,
    scrollTo,
    scrollProgress: 0,
    isReducedMotion,
    refreshScrollTriggers: () => {},
  };

  return (
    <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
  );
}

export function useAnimation() {
  const ctx = useContext(AnimationContext);
  if (!ctx) {
    throw new Error("useAnimation must be used within <AnimationProvider>");
  }
  return ctx;
}

export function useLenis() {
  const { lenis } = useAnimation();
  return lenis;
}

export function useScrollProgress() {
  const { scrollProgress } = useAnimation();
  return scrollProgress;
}

export function useReducedMotion() {
  const { isReducedMotion } = useAnimation();
  return isReducedMotion;
}

export function useSmoothScroll() {
  const { scrollTo } = useAnimation();
  return scrollTo;
}

export function useRefreshTriggers() {
  const { refreshScrollTriggers } = useAnimation();
  return refreshScrollTriggers;
}

export function useActiveSection(
  sectionIds: string[],
  rootMargin = "-40% 0px -55% 0px",
) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const selectors = sectionIds
      .map((id) => `[id="${id.replace("#", "")}"]`)
      .join(",");
    const elements = selectors ? document.querySelectorAll(selectors) : [];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return active;
}

export function useScrollLock() {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    document.body.style.overflow = "hidden";
    setIsLocked(true);
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = "";
    setIsLocked(false);
  }, []);

  const toggle = useCallback(
    (state?: boolean) => {
      const shouldLock = state ?? !isLocked;
      if (shouldLock) lock();
      else unlock();
    },
    [isLocked, lock, unlock],
  );

  return { lock, unlock, toggle, isLocked };
}

export default AnimationProvider;
