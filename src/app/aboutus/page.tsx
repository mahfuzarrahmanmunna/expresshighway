"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const TIMELINE_MILESTONES = [
  {
    year: "2013",
    title: "Sampan 21st Century",
    desc: "The foundation of Sampan Group's vision for modern infrastructure.",
  },
  {
    year: "2013",
    title: "Sampan Taj Bashundhara",
    desc: "Expanding our footprint in premium residential living.",
  },
  {
    year: "2014",
    title: "Sampan Niketon",
    desc: "Further establishing our commitment to architectural excellence.",
  },
  {
    year: "2021",
    title: "Sampan Highway Inn",
    desc: "Entering the hospitality sector with a flagship highway destination.",
  },
  {
    year: "2022",
    title: "Sampan White House",
    desc: "Broadening our hospitality portfolio with premium accommodations.",
  },
  {
    year: "2026",
    title: "Express Highway Inn",
    desc: "The next chapter: An exclusive Club & Lounge for the modern traveller.",
    highlight: true,
  },
];

const DIVISIONS = [
  {
    num: "01",
    title: "Sampan Development Ltd.",
    desc: "Land sale, share, condominium, building construction.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "02",
    title: "Sampan Highway Inn",
    desc: "Flagship, most recognized brand nationally.",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "London School of Higher Studies",
    desc: "CIPS, CMI, Hospitality, UK courses, international.",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "04",
    title: "Sampan Auto",
    desc: "Car sales, imports, and Japanese parts.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
  },
];

const ALLIED_LOGOS = [
  "REHAB",
  "FBCCI",
  "BARVIDA",
  "BPL",
  "Mercedes-Benz",
  "CIPS",
  "DGDP",
  "BVF",
];

/* ═══════════════════════════════════════════════════════════════
   1. CUSTOM CURSOR SYSTEM
═══════════════════════════════════════════════════════════════ */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement;
      const cursorType = target
        .closest("[data-cursor]")
        ?.getAttribute("data-cursor");

      if (cursorType) {
        gsap.to(cursor, {
          scale: 2.5,
          backgroundColor: "rgba(0, 125, 197, 0.1)",
          borderColor: "rgba(0, 125, 197, 0.4)",
          duration: 0.3,
        });
        label.textContent = cursorType;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.3)",
          duration: 0.3,
        });
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 z-[9999] w-8 h-8 border border-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <span
        ref={labelRef}
        className="text-[8px] uppercase tracking-[0.2em] text-white opacity-0 scale-80 transition-transform"
      ></span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO — 3D ROTATE + TEXT MASK SLIDE + SCALE REVEAL
═══════════════════════════════════════════════════════════════ */
function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      // 3D Rotate Intro
      gsap.set(".hero-intro-line", {
        transformOrigin: "bottom center",
        rotateX: 90,
        opacity: 0,
      });
      tl.to(".hero-intro-line", {
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
      })
        .to(".hero-intro-screen", {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.6,
        })
        // Image Scale Reveal
        .from(
          ".hero-bg",
          {
            scale: 1.5,
            opacity: 0,
            filter: "blur(20px)",
            duration: 2.5,
            ease: "expo.out",
          },
          "-=1.2",
        );

      // Text Mask Slide for Headline
      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".hero-headline .line > div", { yPercent: 110 });
        tl.to(
          ".hero-headline .line > div",
          { yPercent: 0, duration: 1.6, stagger: 0.2, ease: "power4.out" },
          "-=1.5",
        );
      }

      // Text Mask Slide (The sweeping mask)
      tl.fromTo(
        ".hero-highlight-mask",
        { x: "-100%" },
        { x: "100%", duration: 1.5, ease: "power2.inOut" },
        "-=0.8",
      )
        .from(
          ".hero-sub",
          { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-meta",
          { opacity: 0, y: 20, duration: 1, ease: "power3.out" },
          "-=0.6",
        );

      const bgX = gsap.quickTo(".hero-bg", "x", {
        duration: 2,
        ease: "power2.out",
      });
      const bgY = gsap.quickTo(".hero-bg", "y", {
        duration: 2,
        ease: "power2.out",
      });
      const onMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgX(nx * -15);
        bgY(ny * -10);
      };
      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div className="hero-intro-screen fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">
          Express Highway Inn
        </span>
        <div className="overflow-hidden">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white/90 font-medium">
            THE STORY
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white/90 font-medium">
            BEHIND
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-primary/80 font-medium italic">
            THE JOURNEY
          </h1>
        </div>
      </div>

      <div className="hero-bg absolute inset-[-40px] z-0">
        <Image
          src="/banner/banner1.jpg"
          alt="Highway"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] font-medium">
          <div className="block">Built on the Highway.</div>
          <div className="block relative w-fit mx-auto">
            Backed by
            <span className="relative inline-block ml-4">
              <span className="relative z-10 text-primary/90 italic">
                Sampan Group.
              </span>
              <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>
            </span>
          </div>
        </h2>
        <p className="hero-sub mt-10 text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-relaxed">
          Express Highway Inn is where Sampan Group&apos;s hospitality vision
          comes to life.
        </p>
      </div>

      <div className="hero-meta absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30">
          Est. 2021 • Hospitality • Lifestyle • Highway
        </span>
        <div className="relative w-px h-12 bg-white/20 overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-primary animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. OUR STORY — CHARACTER REVEAL + WORD REVEAL + SPLIT IMAGE REVEAL
═══════════════════════════════════════════════════════════════ */
function OurStory() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });

      // Character Reveal (Eyebrow)
      const eyebrow = document.querySelector<HTMLElement>(".story-eyebrow");
      if (eyebrow) {
        new SplitType(eyebrow, { types: "chars", charClass: "inline-block" });
        tl.from(".story-eyebrow .char", {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Word Reveal (Heading)
      const heading = document.querySelector<HTMLElement>(".story-headline");
      if (heading) {
        new SplitType(heading, { types: "words", wordClass: "inline-block" });
        tl.from(
          ".story-headline .word",
          {
            opacity: 0,
            y: 50,
            rotateX: 45,
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.4",
        );
      }

      tl.from(
        ".story-divider",
        { width: 0, duration: 1, ease: "power3.out" },
        "-=0.6",
      )
        .from(
          ".story-p1",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          ".story-p2",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.6",
        );

      // Split Image Reveal
      tl.from(
        ".story-img-left",
        { xPercent: -100, duration: 1.5, ease: "power4.out" },
        "-=1",
      ).from(
        ".story-img-right",
        { xPercent: 100, duration: 1.5, ease: "power4.out" },
        "<",
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-white text-black py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-5 flex flex-col">
          <span className="story-eyebrow text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
            01 — Our Story
          </span>
          <h2
            className="story-headline font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium leading-[1.05] mb-10"
            style={{ perspective: "500px" }}
          >
            Our Story
          </h2>
          <div className="story-divider w-16 h-px bg-black/20 mb-10"></div>
          <p className="story-p1 text-base md:text-lg font-light text-black/60 leading-relaxed mb-6">
            Express Highway Inn began with a simple observation:
            Bangladesh&apos;s highways move faster every year, but the places to
            rest along them hadn&apos;t kept pace. Sampan Group set out to
            change that by building a property where a quick stop feels like a
            proper retreat.
          </p>
          <p className="story-p2 text-base md:text-lg font-light text-black/60 leading-relaxed">
            Today, Sampan Highway Inn stands as one of Sampan Group&apos;s
            flagship hospitality ventures, anchoring a growing highway township
            of hotels, residences and retail.
          </p>
        </div>

        {/* Split Image Reveal Structure */}
        <div
          className="lg:col-span-7 relative w-full aspect-[4/5] overflow-hidden group"
          data-cursor="VIEW"
        >
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <div className="story-img-left w-[200%] h-full">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                alt="Architecture Left"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
            <div className="story-img-right w-[200%] h-full -translate-x-1/2">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                alt="Architecture Right"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-8 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 block">
              Express Highway Inn
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-primary/80 block mt-1">
              01 / Architecture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. STORY STATEMENT — MORPHING TEXT + PERSPECTIVE REVEAL
═══════════════════════════════════════════════════════════════ */
function StoryStatement() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const text = document.querySelector<HTMLElement>(".statement-text");
      if (text) {
        // Morphing Text (simulated via blur/scale scrub)
        new SplitType(text, { types: "chars", charClass: "inline-block" });
        gsap.fromTo(
          ".statement-text .char",
          { filter: "blur(15px)", scale: 0.5, opacity: 0 },
          {
            filter: "blur(0px)",
            scale: 1,
            opacity: 1,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 1.5,
            },
          },
        );
      }

      // Perspective Reveal (Subtext)
      gsap.fromTo(
        ".statement-sub",
        { z: -300, opacity: 0, rotateY: 20 },
        {
          z: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: { trigger: ".statement-sub", start: "top 80%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-white text-black py-32 md:py-56 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="statement-text font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.1] font-medium tracking-tight">
          A journey should never feel like a pause.
        </h2>
        <p className="statement-sub mt-10 text-lg md:text-xl font-light text-black/50 max-w-2xl mx-auto leading-relaxed">
          Express Highway Inn was created around a simple idea: highway travel
          deserves better places to stop, rest and reconnect.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. TOWNSHIP — SCROLL ROTATION + VERTICAL REVEAL + IMAGE DISTORTION
═══════════════════════════════════════════════════════════════ */
function TownshipVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scroll Rotation for Heading
      gsap.to(".town-head", {
        rotate: -2,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Vertical Reveal (Clip Path Top/Bottom)
      gsap.fromTo(
        ".town-image-wrap",
        { clipPath: "inset(50% 0 50% 0)" },
        {
          clipPath: "inset(0% 0% 0% 0)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: { trigger: ".town-image-wrap", start: "top 75%" },
        },
      );

      // Image Distortion (Scale + Skew scrub)
      gsap.to(".town-image", {
        scale: 1.1,
        skewX: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#F7F7F5] text-black pt-32 md:pt-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center mb-16">
        <h2 className="town-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05] inline-block">
          More Than a Stop.
          <br />
          <span className="text-primary/80 italic">A Growing Destination.</span>
        </h2>
      </div>

      <div
        className="town-image-wrap relative w-full h-[60vh] md:h-[80vh] overflow-hidden mb-[-10%] z-10"
        data-cursor="EXPLORE"
      >
        <Image
          src="https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop"
          alt="Panoramic Highway"
          fill
          className="town-image object-cover"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. TIMELINE — IMAGE STACKING + CLIP-PATH REVEAL
═══════════════════════════════════════════════════════════════ */
function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.innerWidth < 768) return;

      const panels = gsap.utils.toArray<HTMLElement>(".tl-panel");
      const totalWidth = trackRef.current?.offsetWidth || 0;

      const horizontalTween = gsap.to(trackRef.current, {
        x: () => -(totalWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel) => {
        const isHighlight = panel.classList.contains("tl-highlight");
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: "left center",
          end: "right center",
          onEnter: () => {
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#0d0d0d", duration: 1 });
              gsap.to(".tl-line-active", { width: "100%", duration: 1 });
              // Image Stacking effect for 2026
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 0 0 0)",
                duration: 1.5,
                ease: "power4.out",
              });
            }
          },
          onLeave: () => {
            gsap.to(panel, { autoAlpha: 0.4, scale: 0.9, duration: 1 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#080808", duration: 1 });
              gsap.to(".tl-line-active", { width: "0%", duration: 1 });
            }
          },
          onEnterBack: () => {
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#0d0d0d", duration: 1 });
              gsap.to(".tl-line-active", { width: "100%", duration: 1 });
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 0 0 0)",
                duration: 1.5,
                ease: "power4.out",
              });
            }
          },
          onLeaveBack: () => {
            gsap.to(panel, { autoAlpha: 0.4, scale: 0.9, duration: 1 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#080808", duration: 1 });
              gsap.to(".tl-line-active", { width: "0%", duration: 1 });
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 100% 0 0)",
                duration: 1,
              });
            }
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen bg-[#080808] text-white overflow-hidden hidden md:block"
    >
      <div className="tl-bg absolute inset-0 bg-[#080808] transition-colors duration-1000"></div>

      <div className="relative h-full flex flex-col justify-center px-16 z-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6">
              02 — Our Journey
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl font-medium">
              Built Over Time.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light text-white/40">
            Drag to explore the timeline.
          </p>
        </div>

        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2">
          <div className="tl-line-active h-full bg-primary/60 w-0 transition-all duration-1000"></div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-32 items-center"
          data-cursor="DRAG"
        >
          {TIMELINE_MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`tl-panel relative flex-shrink-0 w-[40vw] ${m.highlight ? "tl-highlight" : ""}`}
              style={{ opacity: 0.4, transform: "scale(0.9)" }}
            >
              <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full border-2 border-[#080808] -translate-y-1/2 bg-white/40"></div>

              <div
                className={`pl-12 flex ${m.highlight ? "items-center gap-12" : ""}`}
              >
                <div>
                  <span className="block text-4xl font-[family-name:var(--font-playfair)] mb-4 text-white/80">
                    {m.year}
                  </span>
                  <h3 className="text-2xl font-medium mb-4">{m.title}</h3>
                  <p className="text-sm text-white/40 max-w-xs">{m.desc}</p>
                </div>

                {/* Image Stacking Element for 2026 */}
                {m.highlight && (
                  <div
                    className="tl-highlight-img relative w-[300px] h-[200px] overflow-hidden"
                    style={{ clipPath: "inset(0 100% 0 0)" }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"
                      alt="2026 Highlight"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Vertical Fallback */}
      <div className="md:hidden absolute inset-0 bg-[#080808] p-8 overflow-y-auto">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6">
          02 — Our Journey
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium mb-16">
          Built Over Time.
        </h2>
        {TIMELINE_MILESTONES.map((m, i) => (
          <div key={i} className="border-l border-white/10 pl-8 pb-16 relative">
            <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-primary"></div>
            <span className="block text-2xl font-[family-name:var(--font-playfair)] text-primary/80 mb-2">
              {m.year}
            </span>
            <h3 className="text-xl font-medium mb-2">{m.title}</h3>
            <p className="text-sm text-white/40">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ALLIED ORGANIZATIONS — CLIP-PATH REVEAL + LINE REVEAL
═══════════════════════════════════════════════════════════════ */
function AlliedOrganizations() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Line Reveal for Text
      const text = document.querySelector<HTMLElement>(".allied-head");
      if (text) {
        new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".allied-head .line", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      // Diagonal Clip-Path Reveal for Logos
      gsap.utils.toArray<HTMLElement>(".allied-logo").forEach((logo) => {
        gsap.fromTo(
          logo,
          { clipPath: "inset(0 0 100% 0)", opacity: 0, scale: 0.9 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: logo, start: "top 85%" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-white text-black py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
              03 — Trust & Affiliation
            </span>
            <h2 className="allied-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
              Built on Trust.
              <br />
              Connected by Partnership.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-black/50 leading-relaxed">
            Our relationships with recognized organizations, professional bodies
            and strategic partners strengthen the standards behind everything we
            build.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/10">
          {ALLIED_LOGOS.map((logo, i) => (
            <div
              key={i}
              className="allied-logo group border-r border-b border-black/10 aspect-[3/2] flex items-center justify-center p-8 cursor-pointer relative overflow-hidden"
              data-cursor="OPEN →"
            >
              <span className="absolute top-0 left-0 w-full h-px bg-black/0 group-hover:bg-primary origin-left transition-all duration-500 group-hover:scale-x-100"></span>
              <span className="absolute top-0 right-0 h-full w-px bg-black/0 group-hover:bg-primary origin-top transition-all duration-500 delay-100 group-hover:scale-y-100"></span>
              <span className="absolute bottom-0 right-0 w-full h-px bg-black/0 group-hover:bg-primary origin-right transition-all duration-500 delay-200 group-hover:scale-x-100"></span>
              <span className="absolute bottom-0 left-0 h-full w-px bg-black/0 group-hover:bg-primary origin-bottom transition-all duration-500 delay-300 group-hover:scale-y-100"></span>

              <span className="text-xl md:text-2xl font-[family-name:var(--font-playfair)] tracking-wide text-black/40 transition-all duration-500 group-hover:text-black group-hover:scale-110">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. DIVISIONS — IMAGE + TEXT MASK (HOVER REVEAL)
═══════════════════════════════════════════════════════════════ */
function Divisions() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-white text-black py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
              04 — Sampan Group Concerns
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
              Different Industries.
              <br />
              One Connected Vision.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-black/50 leading-relaxed">
            Across hospitality, real estate, education and automotive services,
            Sampan Group continues to build businesses around one connected
            vision.
          </p>
        </div>

        {/* Expanding Flex Grid with Image + Text Mask Reveal */}
        <div className="hidden md:flex gap-2 h-[500px] border border-black/10">
          {DIVISIONS.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex-1 p-8 border-r border-black/10 last:border-r-0 cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: hovered === i ? 2 : 1 }}
            >
              {/* Image + Text Mask Effect */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={d.img}
                  alt={d.title}
                  fill
                  className="object-cover transition-transform duration-700"
                  style={{
                    transform: hovered === i ? "scale(1)" : "scale(1.1)",
                    opacity: hovered === i ? 0.2 : 0,
                  }}
                />
              </div>
              <div
                className="absolute inset-0 bg-white/80 z-[1]"
                style={{ opacity: hovered === i ? 0.8 : 0 }}
              ></div>

              {/* Oversized Background Number */}
              <span
                className="absolute top-4 right-4 font-[family-name:var(--font-playfair)] text-[12rem] leading-none text-black/5 transition-all duration-700 pointer-events-none z-[2]"
                style={{
                  opacity: hovered === i ? 0.1 : 0.03,
                  transform: hovered === i ? "scale(1.2)" : "scale(1)",
                }}
              >
                {d.num}
              </span>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-sm font-medium text-black/30 mb-8 block transition-colors duration-300 group-hover:text-primary">
                    {d.num}
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium">
                    {d.title}
                  </h3>
                </div>

                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: hovered === i ? "200px" : "0px",
                    opacity: hovered === i ? 1 : 0,
                  }}
                >
                  <p className="text-sm font-light text-black/60 mb-6 pt-4">
                    {d.desc}
                  </p>
                  <div className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Fallback */}
        <div className="md:hidden grid grid-cols-1 gap-px bg-black/10 border border-black/10">
          {DIVISIONS.map((d, i) => (
            <div key={i} className="bg-white p-8 relative">
              <span className="text-sm font-medium text-black/30 mb-8 block">
                {d.num}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium mb-4">
                {d.title}
              </h3>
              <p className="text-sm font-light text-black/60">{d.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-black/80 hover:text-primary transition-colors duration-300"
          >
            View All Divisions
            <span className="relative w-12 h-px bg-black/40 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
              <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. ECOSYSTEM STATEMENT — 3D ROTATE + PERSPECTIVE REVEAL
═══════════════════════════════════════════════════════════════ */
function EcosystemStatement() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 3D Rotate + Perspective Reveal
      gsap.from(".eco-line-1", {
        rotateX: 90,
        opacity: 0,
        z: -100,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.from(".eco-line-2", {
        rotateX: 90,
        opacity: 0,
        z: -100,
        transformOrigin: "right center",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      gsap.from(".eco-line-3", {
        rotateX: 90,
        opacity: 0,
        z: -100,
        transformOrigin: "bottom center",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 50%" },
      });

      gsap.fromTo(
        ".eco-vision-mask",
        { x: "-100%" },
        {
          x: "100%",
          duration: 1.5,
          ease: "power2.inOut",
          delay: 1,
          scrollTrigger: { trigger: ref.current, start: "top 50%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-white text-black py-32 md:py-56 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center gap-8 md:gap-12">
        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,10vw,9rem)] leading-[0.95] font-medium tracking-tight">
          <div className="overflow-hidden">
            <div className="eco-line-1 inline-block">ONE GROUP.</div>
          </div>
          <div className="overflow-hidden">
            <div className="eco-line-2 inline-block text-black/50">
              MULTIPLE INDUSTRIES.
            </div>
          </div>
          <div className="overflow-hidden relative w-fit mx-auto">
            <div className="eco-line-3 inline-block relative z-10 text-primary italic">
              ONE VISION.
            </div>
            <div className="eco-vision-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          </div>
        </h2>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. FINAL CTA — IMAGE DISTORTION + TEXT MASK SLIDE
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Image Distortion (Scale + Skew)
      gsap.fromTo(
        ".cta-bg",
        { opacity: 0.05, scale: 1.15, skewX: 3, filter: "blur(10px)" },
        {
          opacity: 0.35,
          scale: 1,
          skewX: 0,
          filter: "blur(0px)",
          duration: 3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });

      // Text Mask Slide for Headline
      const heading = document.querySelector<HTMLElement>(".cta-headline");
      if (heading) {
        new SplitType(heading, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".cta-headline .line", { yPercent: 110 });
        tl.to(".cta-headline .line", {
          yPercent: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "power4.out",
        });
      }

      tl.from(
        ".cta-eyebrow",
        { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
        "-=0.5",
      )
        .from(
          ".cta-sub",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".cta-btn",
          { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.7)" },
          "-=0.5",
        );

      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", {
          duration: 0.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(btn, "y", {
          duration: 0.4,
          ease: "power3.out",
        });

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          xTo(x * 0.4);
          yTo(y * 0.4);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
        return () => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative bg-[#070707] text-white py-32 md:py-56 overflow-hidden"
    >
      <div
        className="cta-bg absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707] via-transparent to-[#070707] z-[1]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.05] blur-[150px] rounded-full z-[1]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <span className="cta-eyebrow block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-8">
          The Next Chapter Awaits
        </span>

        <h2 className="cta-headline font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1.05] mb-10">
          <div>Ready to</div>
          <div>Experience It?</div>
        </h2>

        <p className="cta-sub text-lg md:text-xl font-light text-white/50 max-w-xl mx-auto leading-relaxed mb-12">
          Discover the private world of Express Highway Inn Club & Lounge.
        </p>

        <a
          ref={btnRef}
          href="/membership"
          className="cta-btn group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden cursor-pointer"
          data-cursor="EXPLORE"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10">
            Explore Club & Lounge Membership
          </span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <main className="bg-white">
      <CustomCursor />
      <AboutHero />
      <OurStory />
      <StoryStatement />
      <TownshipVisual />
      <Timeline />
      <AlliedOrganizations />
      <Divisions />
      <EcosystemStatement />
      <FinalCTA />
    </main>
  );
}
