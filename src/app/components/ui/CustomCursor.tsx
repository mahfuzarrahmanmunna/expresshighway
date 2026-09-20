"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // GSAP quickTo for buttery smooth, spring-like trailing animation
    const xTo = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    // High-performance hover detection using event delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea, [data-cursor]");
      
      if (interactive) {
        const cursorText = interactive.getAttribute("data-cursor");
        
        // If it's a text input, make the cursor look like a text caret
        if (interactive.tagName === "INPUT" || interactive.tagName === "TEXTAREA") {
          gsap.to(ring, { 
            scale: 0.4, 
            borderColor: "rgba(255, 255, 255, 0.8)", 
            backgroundColor: "transparent", 
            duration: 0.3 
          });
          gsap.to(dot, { scale: 0.5, duration: 0.3 });
          label.textContent = "";
          gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        } 
        // If it has a custom label (e.g., data-cursor="VIEW"), show it
        else if (cursorText && cursorText !== "hover") {
          label.textContent = cursorText;
          gsap.to(ring, { 
            scale: 3.2, 
            borderColor: "rgba(0, 125, 198, 0.6)", 
            backgroundColor: "rgba(0, 125, 198, 0.08)", 
            duration: 0.4, 
            ease: "power3.out" 
          });
          gsap.to(dot, { scale: 0, duration: 0.3 });
          gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, delay: 0.05 });
        } 
        // Standard interactive hover (links/buttons)
        else {
          gsap.to(ring, { 
            scale: 1.8, 
            borderColor: "rgba(0, 125, 198, 0.8)", 
            backgroundColor: "rgba(0, 125, 198, 0.05)", 
            duration: 0.4, 
            ease: "power3.out" 
          });
          gsap.to(dot, { scale: 1.5, duration: 0.3 });
          label.textContent = "";
          gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        }
      } else {
        // Reset to default state
        gsap.to(ring, { 
          scale: 1, 
          borderColor: "rgba(255, 255, 255, 0.3)", 
          backgroundColor: "transparent", 
          duration: 0.4, 
          ease: "power3.out" 
        });
        gsap.to(dot, { scale: 1, duration: 0.3 });
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
      }
    };

    // Click animation
    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.2 });
      gsap.to(ring, { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    };

    // Out of bounds (leave window)
    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* The Core Dot */}
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 z-[99999] w-2 h-2 bg-white rounded-full pointer-events-none mix-blend-difference"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>
      
      {/* The Outer Ring & Label Container */}
      <div
        ref={ringRef}
        className="hidden md:flex fixed top-0 left-0 z-[99998] w-10 h-10 border border-white/30 rounded-full pointer-events-none mix-blend-difference items-center justify-center"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <span 
          ref={labelRef} 
          className="text-[8px] uppercase tracking-[0.15em] text-white opacity-0 scale-75 transition-none mix-blend-normal"
        ></span>
      </div>
    </>
  );
}