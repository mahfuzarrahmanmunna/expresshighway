"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Facilities Data (Perfectly Calculated for 12-Col Grid) ── */
/* 
   Row 1: 8 cols (16/10 ratio) + 4 cols (4/5 ratio) = Perfect height match
   Row 2: 4 cols (4/5 ratio) + 8 cols (16/10 ratio) = Perfect height match
   Row 3: 4 x 3 cols (1/1 ratio) = Perfect height match
*/
const FACILITIES_GRID = [
  {
    name: "VVIP Lounge",
    tag: "Exclusive, luxury, comfort",
    img: "/images/lounge.jpg",
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    name: "Salon & Spa",
    tag: "Pamper yourself daily",
    img: "/club/salon.jpg",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
  },
  {
    name: "Fine Dining",
    tag: "Fresh, flavorful, refreshing",
    img: "/club/resturant.png",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
  },
  {
    name: "Billiard Room",
    tag: "Fun, skill, competition",
    img: "/club/game.jpg",
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    name: "Swimming Pool",
    tag: "Relax, refresh, rejuvenate",
    img: "/club/pool.webp",
    size: "col-span-1 md:col-span-3 aspect-square",
  },
  {
    name: "Premium Accommodation",
    tag: "Exclusive stays for members",
    img: "/club/lounge.png",
    size: "col-span-1 md:col-span-3 aspect-square",
  },
  {
    name: "Juice & Drinks Bar",
    tag: "Fresh, flavorful, refreshing",
    img: "/club/bar.jpg",
    size: "col-span-1 md:col-span-3 aspect-square",
  },
  {
    name: "Prayer Room",
    tag: "Peaceful, serene, sacred",
    img: "/images/prayer.jpg",
    size: "col-span-1 md:col-span-3 aspect-square",
  },
];

const LOUNGE_JOURNEY = [
  {
    title: "VVIP Lounge",
    desc: "Exclusive, luxury, comfort",
    img: "/images/lounge.jpg",
  },
  {
    title: "Salon & Spa",
    desc: "Pamper yourself daily",
    img: "/club/salon.jpg",
  },
  {
    title: "Juice & Drinks Bar",
    desc: "Fresh, flavorful, refreshing",
    img: "/club/bar.jpg",
  },
  {
    title: "Billiard Room",
    desc: "Fun, skill, competition",
    img: "/club/billard.jpg",
  },
];

const MOSAIC_IMAGES = [
  {
    src: "/club/club.png",
    size: "col-span-2 row-span-2 aspect-square",
  },
  {
    src: "/club/club1.png",
    size: "col-span-1 row-span-1 aspect-square",
  },
  {
    src: "/club/club2.jpeg",
    size: "col-span-1 row-span-2 aspect-[1/2]",
  },
  {
    src: "/club/images.jpg",
    size: "col-span-2 row-span-1 aspect-[2/1]",
  },
];

/* ═══════════════════════════════════════════════════════════════
   1. GLOBAL CUSTOM CURSOR & GRAIN
═══════════════════════════════════════════════════════════════ */
function CustomCursorAndGrain() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const ringLabel = ringLabelRef.current;
    if (!dot || !ring || !ringLabel) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const yRing = gsap.quickTo(ring, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        const cursorText = interactive.getAttribute("data-cursor");
        gsap.to(ring, {
          scale: 3,
          borderColor: "rgba(0, 125, 198, 0.5)",
          backgroundColor: "rgba(0, 125, 198, 0.05)",
        });
        if (cursorText) {
          ringLabel.textContent = cursorText;
        }
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "transparent",
        });
        ringLabel.textContent = "";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 z-[9999] w-2 h-2 bg-white rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={ringRef}
        className="hidden md:flex fixed top-0 left-0 z-[9998] w-10 h-10 border border-white/40 rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%] items-center justify-center transition-colors duration-300"
      >
        <span ref={ringLabelRef} className="text-[7px] uppercase tracking-[0.2em] text-white opacity-0"></span>
      </div>

      {/* Global Grain Overlay */}
      <div
        className="fixed inset-0 z-[9997] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. CINEMATIC HERO
═══════════════════════════════════════════════════════════════ */
function ClubHero() {
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
        // Multi-layer Image Reveal
        .from(
          ".hero-bg-blur",
          {
            scale: 1.5,
            opacity: 0,
            filter: "blur(50px)",
            duration: 2,
            ease: "expo.out",
          },
          "-=1.2",
        )
        .from(
          ".hero-bg-sharp",
          {
            scale: 1.2,
            opacity: 0,
            filter: "blur(15px)",
            duration: 2,
            ease: "expo.out",
          },
          "-=1.8",
        )
        .from(
          ".hero-glow",
          { opacity: 0, duration: 2, ease: "power2.out" },
          "-=1",
        );

      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".hero-headline .word", {
          yPercent: 110,
          rotateX: 45,
          opacity: 0,
        });
        tl.to(
          ".hero-headline .word",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.6,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=1.5",
        );
      }

      tl.fromTo(
        ".hero-highlight-mask",
        { x: "-100%" },
        { x: "100%", duration: 1.5, ease: "power2.inOut" },
        "-=0.8",
      )
        .from(
          ".hero-sub",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        );

      // 3D Mouse Parallax
      const bgX = gsap.quickTo(".hero-bg-sharp", "x", {
        duration: 2,
        ease: "power2.out",
      });
      const bgY = gsap.quickTo(".hero-bg-sharp", "y", {
        duration: 2,
        ease: "power2.out",
      });
      const contentX = gsap.quickTo(".hero-content", "x", {
        duration: 1.5,
        ease: "power2.out",
      });
      const contentY = gsap.quickTo(".hero-content", "y", {
        duration: 1.5,
        ease: "power2.out",
      });

      const onMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgX(nx * -15);
        bgY(ny * -10);
        contentX(nx * 5);
        contentY(ny * 3);
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
            THE EXCLUSIVE
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white/90 font-medium">
            RETREAT FOR
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-primary/80 font-medium italic">
            THE MEMBERS
          </h1>
        </div>
      </div>

      {/* Multi-layer Background */}
      <div className="hero-bg-blur absolute inset-[-60px] z-0 opacity-50">
        <Image
          src="/hero.jpg"
          alt="Lounge Blurred"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-2xl bg-black/30" />
      </div>
      <div className="hero-bg-sharp absolute inset-0 z-[1]">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-3909d0bcfdd7?q=80&w=1920&auto=format&fit=crop"
          alt="VVIP Lounge"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95" />
      </div>
      <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.08] blur-[120px] rounded-full z-[2]"></div>

      <div className="hero-content relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.5rem,8vw,7rem)] leading-[1.02] font-medium">
          <div className="block">Express Highway Inn</div>
          <div className="block relative w-fit mx-auto mt-2">
            Club &amp;
            <span className="relative inline-block ml-4">
              <span className="relative z-10 text-primary/90 italic">
                Lounge
              </span>
              <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"></span>
            </span>
          </div>
        </h2>
        <p className="hero-sub mt-10 text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-relaxed">
          A private retreat inside Sampan Highway Inn with elegant interiors,
          premium amenities and fine dining, reserved exclusively for members.
        </p>

        <a
          href="#membership"
          className="hero-cta group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden mt-12"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10">Get Membership Benefits</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Premium Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">
          Scroll
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
   3. EDITORIAL FACILITIES (Architectural 12-Col Grid)
═══════════════════════════════════════════════════════════════ */
function FacilitiesGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const text = document.querySelector<HTMLElement>(".fac-head");
      if (text) {
        new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".fac-head .line", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".fac-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          }
        );

        const imgWrap = card.querySelector(".fac-img-wrap");
        if (imgWrap) {
          gsap.to(imgWrap, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#F7F6F2] text-[#0c0b0b] py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
              01 - Premium Amenities
            </span>
            <h2 className="fac-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
              The Members&apos;
              <br />
              Sanctuary.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-black/50 leading-relaxed">
            Every detail is curated for your comfort. From recreation to
            relaxation, the Club & Lounge offers an ecosystem of premium
            amenities.
          </p>
        </div>

        {/* Perfect 12-Col Architectural Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8">
          {FACILITIES_GRID.map((item, i) => (
            <div
              key={i}
              className={`fac-card group relative ${item.size} overflow-hidden cursor-pointer border border-[#0c0b0b]/10 hover:border-[#0c0b0b]/30 transition-colors duration-700`}
            >
              {/* Parallax Image Wrapper */}
              <div className="fac-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full z-0 overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  quality={90}
                />
              </div>

              {/* Refined Bottom Gradient for Permanent Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[1] pointer-events-none" />

              {/* Content Layer (Always Visible) */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                
                {/* Top Row: Index & Arrow */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors duration-500 group-hover:text-primary drop-shadow-md">
                    0{i + 1}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-white/60 transition-all duration-500 group-hover:text-primary group-hover:rotate-45" />
                </div>

                {/* Bottom Content */}
                <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/80 mb-3 font-medium drop-shadow-md">
                    {item.tag}
                  </p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">
                    {item.name}
                  </h3>
                  <div className="h-[1px] w-12 bg-primary/80 mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. MONUMENTAL TYPOGRAPHY (Day at the Lounge)
═══════════════════════════════════════════════════════════════ */
function DayAtLounge() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        },
      });

      // Line choreography
      tl.from(".line-1", { x: -100, opacity: 0, duration: 1 }, 0)
        .from(".line-2", { x: 100, opacity: 0, duration: 1 }, 0.2)
        .from(
          ".line-3",
          { scale: 0.7, filter: "blur(10px)", opacity: 0, duration: 1 },
          0.4,
        )
        .from(
          ".line-4",
          { letterSpacing: "0.2em", opacity: 0, duration: 1 },
          0.6,
        );

      // Floating Image
      gsap.fromTo(
        ".float-img",
        { scale: 0.7, rotate: -5, opacity: 0, y: 50 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: ".float-img", start: "top 80%" },
        },
      );

      gsap.to(".float-img", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen bg-[#F7F6F2] text-black overflow-hidden flex items-center justify-center"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-6 text-center pointer-events-none">
        <div className="overflow-hidden mb-2">
          <h2 className="line-1 font-[family-name:var(--font-playfair)] text-[clamp(3rem,10vw,8rem)] leading-[1.05] font-medium tracking-tight">
            STEP IN,
          </h2>
        </div>

        {/* Floating Image inside typography */}
        <div className="relative w-full flex justify-center my-4 pointer-events-auto">
          <div className="float-img relative w-[250px] h-[150px] md:w-[400px] md:h-[250px] overflow-hidden border border-black/10">
            <Image
              src="/hero.jpg"
              alt="Lounge Detail"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="overflow-hidden mb-2">
          <h2 className="line-2 font-[family-name:var(--font-playfair)] text-[clamp(3rem,10vw,8rem)] leading-[1.05] font-medium tracking-tight text-black/80">
            AND THE
          </h2>
        </div>
        <div className="overflow-hidden mb-2">
          <h2 className="line-3 font-[family-name:var(--font-playfair)] text-[clamp(3rem,10vw,8rem)] leading-[1.05] font-medium tracking-tight text-primary/90 italic">
            HIGHWAY
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="line-4 font-[family-name:var(--font-playfair)] text-[clamp(3rem,10vw,8rem)] leading-[1.05] font-medium tracking-tight">
            FALLS AWAY.
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. HORIZONTAL CINEMATIC LOUNGE JOURNEY
═══════════════════════════════════════════════════════════════ */
function LoungeJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          onUpdate: (self) => {
            if (progressRef.current)
              progressRef.current.style.width = `${self.progress * 100}%`;
            const idx = Math.min(
              LOUNGE_JOURNEY.length - 1,
              Math.floor(self.progress * LOUNGE_JOURNEY.length),
            );
            setActiveIndex(idx);
          },
        },
      });

      // Cinematic Panel Transitions
      panels.forEach((panel) => {
        const img = panel.querySelector(".tl-img");
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: "left 60%",
          end: "right 40%",
          onUpdate: (self) => {
            const progress = self.progress; // 0 to 1
            const scale = 1 - Math.abs(progress - 0.5) * 0.3;
            const opacity = 0.3 + (1 - Math.abs(progress - 0.5)) * 0.7;

            if (img) {
              gsap.to(img, {
                scale: scale,
                opacity: opacity,
                duration: 0.3,
                ease: "power2.out",
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
      className="relative h-screen bg-[#050505] text-white overflow-hidden hidden md:block"
      style={{ perspective: "1200px" }}
    >
      <div className="relative h-full flex flex-col justify-center z-10">
        <div className="mb-16 flex items-end justify-between px-16">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6">
              02 - The Experience
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl font-medium">
              A Standing Reservation.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light text-white/40">
            Drag to explore the lounge.
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-20 px-40"
          data-cursor="DRAG"
        >
          {LOUNGE_JOURNEY.map((m, i) => (
            <div key={i} className="tl-panel flex-shrink-0 w-[60vw] relative">
              <div
                className="relative w-full h-[70vh] overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="tl-img absolute inset-0">
                  <Image
                    src={m.img}
                    alt={m.title}
                    fill
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                </div>

                {/* Text escaping container */}
                <div
                  className="absolute top-1/2 right-[-100px] -translate-y-1/2 text-right z-10"
                  style={{ transform: "translateZ(80px)" }}
                >
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-3">
                    0{i + 1}
                  </span>
                  <h3 className="text-6xl font-medium mb-2 font-[family-name:var(--font-playfair)]">
                    {m.title}
                  </h3>
                  <p className="text-base text-white/50 max-w-xs ml-auto">
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-16 left-16 right-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em]">
              0{activeIndex + 1} / 04
            </span>
            <span className="text-[10px] tracking-[0.3em] text-primary">
              {LOUNGE_JOURNEY[activeIndex].title.toUpperCase()}
            </span>
          </div>
          <div className="relative w-1/3 h-px bg-white/10">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-primary/60 w-0"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. EDITORIAL PHOTO MOSAIC
═══════════════════════════════════════════════════════════════ */
function PhotoMosaic() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const images = gsap.utils.toArray<HTMLElement>(".mosaic-img");
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: i % 2 === 0 ? 50 : -50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: { trigger: img, start: "top 85%" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#050505] text-white py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 auto-rows-[200px]">
          {MOSAIC_IMAGES.map((item, i) => (
            <div
              key={i}
              className={`mosaic-img relative ${item.size} overflow-hidden group cursor-pointer`}
              data-cursor="OPEN"
            >
              <Image
                src={item.src}
                alt={`Gallery ${i}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                quality={80}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. LIQUID MAGNETIC FINAL CTA
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // Slow Ken Burns
      gsap.fromTo(
        ".cta-bg",
        { scale: 1.05 },
        {
          scale: 1.15,
          duration: 15,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });

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

      // Liquid Magnetic Button
      const btn = btnRef.current;
      const liquid = liquidRef.current;
      if (btn && liquid) {
        const xTo = gsap.quickTo(btn, "x", {
          duration: 0.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(btn, "y", {
          duration: 0.4,
          ease: "power3.out",
        });
        const xLiq = gsap.quickTo(liquid, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const yLiq = gsap.quickTo(liquid, "y", {
          duration: 0.6,
          ease: "power3.out",
        });

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          xTo(x * 0.3);
          yTo(y * 0.3);
          xLiq(x * 0.5);
          yLiq(y * 0.5);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
          xLiq(0);
          yLiq(0);
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
      className="relative bg-black text-white py-32 md:py-56 overflow-hidden"
    >
      <div
        className="cta-bg absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-3909d0bcfdd7?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95 z-[1]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/[0.08] blur-[150px] rounded-full z-[1]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        <span className="cta-eyebrow block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-8">
          Membership Required
        </span>

        <h2 className="cta-headline font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[1.05] mb-10">
          <div>THIS IS A</div>
          <div className="text-primary/90 italic">MEMBERS&apos; SPACE</div>
        </h2>

        <p className="cta-sub text-lg md:text-xl font-light text-white/50 max-w-xl mx-auto leading-relaxed mb-12">
          Access to the Club & Lounge is exclusively for Express Highway Inn
          Club & Lounge members.
        </p>

        <a
          ref={btnRef}
          href="#membership"
          className="cta-btn group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden cursor-pointer"
          data-cursor="EXPLORE"
        >
          <span
            ref={liquidRef}
            className="absolute inset-0 bg-[#0096E0] rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ mixBlendMode: "screen" }}
          ></span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10">View Membership Plans</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ClubLoungePage() {
  return (
    <main className="bg-[#050505]">
      <CustomCursorAndGrain />
      <ClubHero />
      <FacilitiesGrid />
      <DayAtLounge />
      <LoungeJourney />
      <PhotoMosaic />
      <FinalCTA />
    </main>
  );
}