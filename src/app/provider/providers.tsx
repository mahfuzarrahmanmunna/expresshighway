"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AnimationProvider } from "@/lib/animation-provider";
import SmoothScroller from "../components/ui/SmoothScroller";
import GlassNavbar from "../components/sections/GlassNavbar";
import Footer from "../components/sections/Footer";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const root = document.scrollingElement || document.documentElement || document.body;
    root.scrollTop = 0;
    root.scrollLeft = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <AnimationProvider>
      <SmoothScroller>
        <GlassNavbar />
        {children}
        <Footer />
      </SmoothScroller>
    </AnimationProvider>
  );
}