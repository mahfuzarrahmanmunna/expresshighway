"use client";

import type { ReactNode } from "react";

import { AnimationProvider } from "@/lib/animation-provider";
import SmoothScroller from "../components/ui/SmoothScroller";
import GlassNavbar from "../components/sections/GlassNavbar";
import Footer from "../components/sections/Footer";

export function Providers({ children }: { children: ReactNode }) {
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