"use client";

import type { ReactNode } from "react";

import { AnimationProvider } from "@/lib/animation-provider";
import GlassNavbar from "../components/sections/GlassNavbar";
import Footer from "../components/sections/Footer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AnimationProvider>
      <GlassNavbar />
      {children}
      <Footer />
    </AnimationProvider>
  );
}