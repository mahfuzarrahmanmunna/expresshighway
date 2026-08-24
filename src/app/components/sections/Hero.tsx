"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import MagneticButton from "../ui/MagneticButton";

const WebGLDepth = dynamic(() => import("../ui/WebGLDepth"), { ssr: false });

gsap.registerPlugin(useGSAP, ScrollTrigger);


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const loadingLineRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const sideLeftRef = useRef<HTMLDivElement>(null);
  const sideRightRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useGSAP(
    () => {
      // ── Split Type ──
      if (headlineRef.current) {
        SplitType.create(headlineRef.current, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        const words = headlineRef.current.querySelectorAll(".word");
        words.forEach((word) => {
          const text = word.textContent?.trim().toLowerCase();
          if (text === "luxury" || text === "timeless") {
            word.classList.add("text-shimmer");
          }
        });

        const lines = headlineRef.current.querySelectorAll(".line > div");
        gsap.set(lines, {
          yPercent: 120,
          rotateX: 20,
          opacity: 0,
          transformOrigin: "bottom center",
        });
      }

      // ── Cinematic Loading Sequence ──
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsLoaded(true),
      });

      tl.fromTo(
        loadingLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power4.inOut" },
      )
        .fromTo(
          "#loading-text",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.6",
        )
        .to(
          loadingLineRef.current,
          { scaleX: 0, duration: 0.8, ease: "power4.inOut" },
          "+=0.3",
        )
        .to(
          loadingRef.current,
          { yPercent: -100, duration: 1, ease: "power4.inOut" },
          "-=0.4",
        )
        .fromTo(
          bgRef.current,
          { scale: 1.25, opacity: 0, filter: "blur(10px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          tagRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=1",
        )
        .to(
          "#hero-headline .line > div",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.8",
        )
        .to(
          descRef.current,
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.9",
        )
        .to(
          ctaRef.current,
          { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .to(scrollRef.current, { opacity: 1, duration: 0.6 }, "-=0.3")
        .to(
          [sideLeftRef.current, sideRightRef.current],
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.8",
        );

      // ── Ken Burns ──
      gsap.to(bgRef.current, {
        scale: 1.08,
        duration: 30,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      // ── 2.5D Parallax ──
      const bgXTo = gsap.quickTo(bgRef.current, "x", {
        duration: 2,
        ease: "power2.out",
      });
      const bgYTo = gsap.quickTo(bgRef.current, "y", {
        duration: 2,
        ease: "power2.out",
      });
      const textXTo = gsap.quickTo(contentRef.current, "x", {
        duration: 1.5,
        ease: "power2.out",
      });
      const textYTo = gsap.quickTo(contentRef.current, "y", {
        duration: 1.5,
        ease: "power2.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgXTo(nx * -15);
        bgYTo(ny * -10);
        textXTo(nx * 18);
        textYTo(ny * 8);
      };

      if (window.innerWidth > 1024) {
        window.addEventListener("mousemove", handleMouseMove);
      }

      // ── Scroll Exit ──
      const heroScrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(bgRef.current, { scale: 1 + p * 0.2, y: p * -50 });
          gsap.set(contentRef.current, {
            y: p * -150,
            opacity: 1 - p * 2,
            scale: 1 - p * 0.08,
          });

          if (overlayRef.current) {
            overlayRef.current.style.backgroundColor = `rgba(0,0,0,${
              0.4 + p * 0.6
            })`;
          }

          // Nav scroll state
          const nav = document.querySelector(".glass-material");
          if (nav) {
            if (p > 0.02) nav.classList.add("nav-scrolled");
            else nav.classList.remove("nav-scrolled");
          }
        },
      });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        heroScrollTrigger.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Loading Screen */}
      <div
        ref={loadingRef}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        <div className="relative flex flex-col items-center">
          <div
            id="loading-text"
            className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl tracking-[0.3em] font-medium opacity-0"
          >
            ERA RESIDENCE
          </div>
          <div
            ref={loadingLineRef}
            className="absolute bottom-[-10px] left-0 w-full h-[1px] bg-white/80 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-[-60px] will-change-transform opacity-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&q=85"
          alt="ERA Residence Luxury Property"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] bg-black/40 transition-colors"
      />

      {/* WebGL Light Leaks */}
      {isLoaded && <WebGLDepth />}

      {/* Content */}
      <div
        ref={contentRef}
        id="hero-content"
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 will-change-transform"
      >
        <div className="max-w-5xl">
          <p
            ref={tagRef}
            className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-primary/70 mb-8 font-medium opacity-0 translate-y-5 will-change-transform"
          >
            Exclusive Collection 2025
          </p>

          <h1
            ref={headlineRef}
            id="hero-headline"
            className="font-[family-name:var(--font-playfair)] text-[2.8rem] md:text-[5rem] lg:text-[6.5rem] font-medium tracking-tight leading-[0.95] text-white"
            style={{ perspective: "1200px" }}
            data-cursor="text"
          >
            Where Luxury Meets Timeless Architecture
          </h1>

          <p
            ref={descRef}
            className="mt-10 text-sm md:text-lg font-light text-white/35 max-w-xl mx-auto leading-relaxed opacity-0 translate-y-10 will-change-transform"
          >
            An exclusive collection of residences where every detail has been
            crafted to perfection, offering unparalleled views and timeless
            elegance.
          </p>

          <div
            ref={ctaRef}
            className="mt-12 flex flex-col sm:flex-row gap-5 justify-center opacity-0 scale-90 will-change-transform"
          >
            <MagneticButton strength={0.4}>
              <a href="#residences" className="btn-primary block">
                Explore Residences
              </a>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <a
                href="#experience"
                className="btn-outline flex items-center justify-center gap-3"
              >
                <span className="w-2 h-2 border border-current rounded-full" />
                Watch The Film
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 opacity-0 flex flex-col items-center gap-4"
      >
        <div className="w-px h-16 bg-white/10 relative overflow-hidden hero-scroll-line" />
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/15 font-medium">
          Scroll to discover
        </span>
      </div>

      {/* Side Labels */}
      <div
        ref={sideLeftRef}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block opacity-0"
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase text-white/10"
          style={{ writingMode: "vertical-rl" }}
        >
          Est. 2024 — Premium Living
        </span>
      </div>
      <div
        ref={sideRightRef}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block opacity-0"
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase text-white/10"
          style={{ writingMode: "vertical-rl" }}
        >
          48°51&apos;N 2°21&apos;E
        </span>
      </div>
    </div>
  );
}
