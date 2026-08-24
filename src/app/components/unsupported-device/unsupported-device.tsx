"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { DeviceSpecs } from "@/lib/use-device-check";

interface UnsupportedDeviceProps {
  specs: DeviceSpecs;
}

export default function UnsupportedDevice({ specs }: UnsupportedDeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.set(iconRef.current, { opacity: 0, scale: 0.8, rotateX: -30 });
      tl.to(iconRef.current, {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1,
        ease: "power3.out",
      });

      tl.set(textRef.current, { opacity: 0, y: 30, filter: "blur(8px)" });
      tl.to(
        textRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      );

      tl.set(detailsRef.current, { opacity: 0, y: 20 });
      tl.to(
        detailsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--background)", perspective: "600px" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        ref={iconRef}
        className="relative mb-8"
        style={{ opacity: 0, transformOrigin: "center center" }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border/30 bg-muted/20 backdrop-blur-sm">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/40"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/5 blur-2xl" />
      </div>

      <div ref={textRef} className="text-center" style={{ opacity: 0 }}>
        <h2 className="font-serif text-2xl tracking-wide text-foreground md:text-3xl">
          Premium Experience Required
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground/60">
          This experience is designed for high-end devices. Your current device
          does not meet the minimum performance requirements to render the
          cinematic animations.
        </p>
      </div>

      <div ref={detailsRef} className="mt-8" style={{ opacity: 0 }}>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/30">
          <span>Score: {specs.score}/5</span>
          <span className="hidden h-px w-4 bg-border sm:block" />
          <span>RAM: {specs.details.deviceMemory}GB</span>
          <span className="hidden h-px w-4 bg-border sm:block" />
          <span>Cores: {specs.details.cores}</span>
          <span className="hidden h-px w-4 bg-border sm:block" />
          <span>WebGL2: {specs.details.hasWebGL2 ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
}
