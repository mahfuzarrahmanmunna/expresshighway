"use client";

import { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
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
      let splitInstance: SplitType | undefined;
      
      // ── Only run SplitType on Desktop to prevent mobile DOM conflicts ──
      const isDesktop = window.innerWidth > 768;

      if (isDesktop && headlineRef.current) {
        splitInstance = new SplitType(headlineRef.current, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        const words = headlineRef.current.querySelectorAll(".word");
        words.forEach((word) => {
          const text = word.textContent?.trim().toLowerCase();
          if (text === "luxury" || text === "highway") {
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
      } else if (headlineRef.current) {
        // On mobile, just set it to opacity 0 so it can fade in normally
        gsap.set(headlineRef.current, { opacity: 0 });
      }

      // ── Cinematic Loading Sequence ──
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsLoaded(true),
      });

      tl.fromTo(
        loadingLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power4.inOut" }
      )
        .fromTo(
          "#loading-text",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.6"
        )
        .to(
          loadingLineRef.current,
          { scaleX: 0, duration: 0.8, ease: "power4.inOut" },
          "+=0.3"
        )
        .to(
          loadingRef.current,
          { yPercent: -100, duration: 1, ease: "power4.inOut" },
          "-=0.4"
        )
        .fromTo(
          bgRef.current,
          { scale: 1.15, opacity: 0, filter: "blur(15px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 2,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          tagRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=1.2"
        );

      // Animate headline differently based on device
      if (isDesktop) {
        tl.to(
          "#hero-headline .line > div",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=1"
        );
      } else {
        tl.to(
          "#hero-headline",
          { opacity: 1, duration: 1.2, ease: "power3.out" },
          "-=1"
        );
      }

      tl.to(
          descRef.current,
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.9"
        )
        .to(
          ctaRef.current,
          { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .to(scrollRef.current, { opacity: 1, duration: 0.6 }, "-=0.3")
        .to(
          [sideLeftRef.current, sideRightRef.current],
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.8"
        );

      // ── 2.5D Parallax (Desktop only) ──
      if (isDesktop) {
        const bgXTo = gsap.quickTo(bgRef.current, "x", { duration: 2, ease: "power2.out" });
        const bgYTo = gsap.quickTo(bgRef.current, "y", { duration: 2, ease: "power2.out" });
        const textXTo = gsap.quickTo(contentRef.current, "x", { duration: 1.5, ease: "power2.out" });
        const textYTo = gsap.quickTo(contentRef.current, "y", { duration: 1.5, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          bgXTo(nx * -10);
          bgYTo(ny * -8);
          textXTo(nx * 12);
          textYTo(ny * 6);
        };

        window.addEventListener("mousemove", handleMouseMove);

        // ── Scroll Exit ──
        const heroScrollTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(bgRef.current, { scale: 1 + p * 0.15, y: p * -50 });
            gsap.set(contentRef.current, {
              y: p * -150,
              opacity: 1 - p * 2,
              scale: 1 - p * 0.08,
            });

            if (overlayRef.current) {
              // Slightly darken on scroll, but kept lighter than before
              overlayRef.current.style.backgroundColor = `rgba(0,0,0,${0.2 + p * 0.4})`;
            }

            const nav = document.querySelector(".nav-main");
            if (nav) {
              if (p > 0.02) nav.classList.add("nav-scrolled");
              else nav.classList.remove("nav-scrolled");
            }
          },
        });

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          heroScrollTrigger.kill();
          if (splitInstance) splitInstance.revert();
        };
      }
    },
    { scope: containerRef }
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
            className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl tracking-[0.4em] font-medium opacity-0 text-white"
          >
            EXPRESS HIGHWAY INN
          </div>
          <div
            ref={loadingLineRef}
            className="absolute bottom-[-10px] left-0 w-full h-[1px] bg-white/80 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Background Video Container */}
      <div
        ref={bgRef}
        className="absolute inset-[-60px] will-change-transform opacity-0 z-[0]"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/herovideo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Luxury Cinematic Overlays - Lightened for visibility */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] transition-colors duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }} // Reduced base darkness
      />
      <div 
        className="absolute inset-0 z-[3] pointer-events-none" 
        style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)" }} // Softer vignette
      />
      {/* Stronger gradient only at the bottom to keep text readable */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* WebGL Light Leaks */}
      {isLoaded && <WebGLDepth />}

      {/* Content */}
      <div
        ref={contentRef}
        id="hero-content"
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 will-change-transform"
      >
        <div className="max-w-4xl">
          <p
            ref={tagRef}
            className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-primary   mb-8 font-medium opacity-0 translate-y-5 will-change-transform"
          >
            Premium Hospitality & Club
          </p>

          <h1
            ref={headlineRef}
            id="hero-headline"
            className="font-[family-name:var(--font-playfair)] text-[2.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] text-white drop-shadow-lg"
            style={{ perspective: "1200px" }}
            data-cursor="text"
            dangerouslySetInnerHTML={{ __html: "Where the Highway Leads to Luxury" }}
          />

          <p
            ref={descRef}
            className="mt-8 text-sm md:text-lg font-light text-white/80 max-w-2xl mx-auto leading-relaxed opacity-0 translate-y-10 will-change-transform drop-shadow-md"
          >
            Express Highway Inn brings fine dining, an exclusive Club & Lounge,
            and everyday convenience together in one address, for every
            traveller on the road and every member who calls it their stop.
          </p>

          {/* Glassmorphism CTA Buttons */}
          <div
            ref={ctaRef}
            className="mt-12 flex flex-col sm:flex-row gap-5 justify-center opacity-0 scale-90 will-change-transform"
          >
            <MagneticButton strength={0.4}>
              <a 
                href="/club-and-lounge" 
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 border border-white/20 backdrop-blur-md text-[10px] uppercase tracking-[0.35em] font-medium text-white overflow-hidden transition-all duration-500 hover:bg-white/20 hover:border-white/40"
              >
                <span className="relative z-10">Explore Club & Lounge</span>
              </a>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <a
                href="/contactus"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-black/20 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-[0.35em] font-medium text-white/80 overflow-hidden transition-all duration-500 hover:bg-black/40 hover:text-white hover:border-white/20"
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full transition-transform duration-500 group-hover:scale-150" />
                <span className="relative z-10">Contact Us</span>
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
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/50 font-medium">
          Scroll to discover
        </span>
      </div>

      {/* Side Labels */}
      <div
        ref={sideLeftRef}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block opacity-0"
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase text-white/50"
          style={{ writingMode: "vertical-rl" }}
        >
          Est. 2025 - Premium Hospitality
        </span>
      </div>
      <div
        ref={sideRightRef}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block opacity-0"
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase text-white/50"
          style={{ writingMode: "vertical-rl" }}
        >
          Expressway - KM 42
        </span>
      </div>
    </div>
  );
}
