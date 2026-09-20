"use client";

import { useRef, useEffect, useState } from "react";
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
    img: "/images/sampandevelopment.jpeg",
  },
  {
    num: "02",
    title: "Sampan Highway Inn",
    desc: "Flagship, most recognized brand nationally.",
    img: "/images/highwayinn.jpeg",
  },
  {
    num: "03",
    title: "London School of Higher Studies",
    desc: "CIPS, CMI, Hospitality, UK courses, international.",
    img: "/images/london-school.jpeg",
  },
  {
    num: "04",
    title: "Sampan Auto",
    desc: "Car sales, imports, and Japanese parts.",
    img: "/images/sampanauto.jpeg",
  },
];

const AFFILIATIONS = [
  { num: "01", name: "Real Estate & Housing Association of Bangladesh", logo: "/images/affiliation/rehab.png" },
  { num: "02", name: "Federation of Bangladesh Chambers of Commerce & Industry (FBCCI)", logo: "/images/affiliation/fbcci.png" },
  { num: "03", name: "Bangladesh Reconditioned Vehicles Importers & Dealers Assoc. (BARVIDA)", logo: "/images/affiliation/barvia.png" },
  { num: "04", name: "Bangladesh Arm's Dealer and Importer Association", logo: "/images/affiliation/bad.png" },
  { num: "05", name: "Bangladesh PABX Association", logo: "/images/affiliation/pabx.png" },
  { num: "06", name: "Bangladesh LPG Autogas Station Owner’s Association", logo: "/images/affiliation/lpg.png" },
  { num: "07", name: "Bangladesh Volleyball Federation (AD-Hoc Community)", logo: "/images/affiliation/bvf.png" },
  { num: "08", name: "Barisal Bulls", logo: "/images/affiliation/barishalbulls.png" },
  { num: "09", name: "Barisal Club (1864)", logo: "/images/affiliation/lis.png" },
  { num: "10", name: "Bangladesh Premier League (BPL)", logo: "/images/affiliation/bpl.png" },
  { num: "11", name: "Mercedes-Benz", logo: "/images/affiliation/mercedes.png" },
  { num: "12", name: "Chartered Institute of Procurement & Supply UK (CIPS)", logo: "/images/affiliation/cips.png" },
  { num: "13", name: "Directorate General Defence Purchase (DGDP)", logo: "/images/affiliation/dgdp.png" },
  { num: "14", name: "Shooter's Shooting Club", logo: "/images/affiliation/shoot.png" },
  { num: "15", name: "Express Highway Club And Lounge", logo: "/images/affiliation/EHCl.png" },
  { num: "16", name: "Bangladesh Archery Federation", logo: "/images/affiliation/Archery.png" },
  { num: "17", name: "Sampan Golf Academy", logo: "/images/affiliation/Sampan Golf Academy.png" },
];

// Luxury Theme Colors
const COLORS = {
  bgLight: "#F9F8F6",
  bgDark: "#0B0B0B",
  textDark: "#141414",
  accent: "#C5A572", // Brass/Gold
};

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

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement;
      const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorType) {
        gsap.to(cursor, {
          scale: 3.5,
          backgroundColor: "rgba(197, 165, 114, 0.1)",
          borderColor: "rgba(197, 165, 114, 0.6)",
          duration: 0.4,
        });
        label.textContent = cursorType;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.4 });
      } else {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(20, 20, 20, 0.3)",
          duration: 0.4,
        });
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.4 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 z-[9999] w-6 h-6 border border-black/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-difference"
    >
      <span
        ref={labelRef}
        className="text-[8px] uppercase tracking-[0.2em] text-white opacity-0 scale-80 transition-transform"
      ></span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO - 3D ROTATE + TEXT MASK SLIDE + SCALE REVEAL
═══════════════════════════════════════════════════════════════ */
function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const tl = gsap.timeline({ delay: 0.3 });

      gsap.set(".hero-intro-line", { transformOrigin: "bottom center", rotateX: 90, opacity: 0 });
      tl.to(".hero-intro-line", {
        rotateX: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
      })
        .to(".hero-intro-screen", {
          yPercent: -100,
          duration: 1.5,
          ease: "power4.inOut",
          delay: 0.8,
        })
        .from(
          ".hero-bg",
          { scale: 1.6, opacity: 0, filter: "blur(30px)", duration: 3, ease: "expo.out" },
          "-=1.5"
        );

      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        splitInstance = new SplitType(heading, { types: "lines,words", lineClass: "overflow-hidden block" });
        gsap.set(".hero-headline .line > div", { yPercent: 110 });
        tl.to(
          ".hero-headline .line > div",
          { yPercent: 0, duration: 1.8, stagger: 0.25, ease: "expo.out" },
          "-=1.8"
        );
      }

      tl.fromTo(
        ".hero-highlight-mask",
        { x: "-100%" },
        { x: "100%", duration: 1.8, ease: "power2.inOut" },
        "-=1"
      )
        .from(".hero-sub", { opacity: 0, y: 40, duration: 1.5, ease: "power3.out" }, "-=1")
        .from(".hero-meta", { opacity: 0, y: 20, duration: 1.2, ease: "power3.out" }, "-=0.8");

      const bgX = gsap.quickTo(".hero-bg", "x", { duration: 2, ease: "power2.out" });
      const bgY = gsap.quickTo(".hero-bg", "y", { duration: 2, ease: "power2.out" });
      const onMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgX(nx * -20);
        bgY(ny * -15);
      };
      window.addEventListener("mousemove", onMouseMove);

      return () => {
        splitInstance?.revert();
        window.removeEventListener("mousemove", onMouseMove);
      };
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="relative h-screen w-full bg-[#0B0B0B] overflow-hidden flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div className="hero-intro-screen fixed inset-0 z-[100] bg-[#0B0B0B] flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A572] mb-10 font-light">
          Express Highway Inn
        </span>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white/90 font-light tracking-tight">
            THE STORY
          </h1>
        </div>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white/90 font-light tracking-tight">
            BEHIND
          </h1>
        </div>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-[#C5A572] font-light italic tracking-tight">
            THE JOURNEY
          </h1>
        </div>
      </div>

      <div className="hero-bg absolute inset-[-60px] z-0 will-change-transform">
        <Image
          src="/banner/banner1.jpg"
          alt="Highway"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/30 to-[#0B0B0B]/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.5rem,8vw,7rem)] leading-[1.05] font-light tracking-tight">
          <div className="block">Built on the Highway.</div>
          <div className="block relative w-fit mx-auto">
            Backed by
            <span className="relative inline-block ml-4">
              <span className="relative z-10 text-[#C5A572] italic font-normal">Sampan Group.</span>
              <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/90 to-transparent"></span>
            </span>
          </div>
        </h2>
        <p className="hero-sub mt-12 text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-[1.8] tracking-wide">
          Express Highway Inn is where Sampan Group&apos;s hospitality vision comes to life.
        </p>
      </div>

      <div className="hero-meta absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10">
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-light">
          Est. 2021 • Hospitality • Lifestyle • Highway
        </span>
        <div className="relative w-px h-16 bg-white/20 overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-[#C5A572] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. OUR STORY - CHARACTER REVEAL + WORD REVEAL + SPLIT IMAGE
═══════════════════════════════════════════════════════════════ */
function OurStory() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let eyebrowSplit: SplitType | null = null;
      let headingSplit: SplitType | null = null;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });

      const eyebrow = document.querySelector<HTMLElement>(".story-eyebrow");
      if (eyebrow) {
        eyebrowSplit = new SplitType(eyebrow, { types: "chars", charClass: "inline-block" });
        tl.from(".story-eyebrow .char", {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      const heading = document.querySelector<HTMLElement>(".story-headline");
      if (heading) {
        headingSplit = new SplitType(heading, { types: "words", wordClass: "inline-block" });
        tl.from(
          ".story-headline .word",
          { opacity: 0, y: 60, rotateX: 45, stagger: 0.1, duration: 1.2, ease: "expo.out" },
          "-=0.4"
        );
      }

      tl.from(".story-divider", { width: 0, duration: 1.2, ease: "power3.out" }, "-=0.8")
        .from(".story-p1", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .from(".story-p2", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=0.8");

      tl.from(
        ".story-img-left",
        { xPercent: -100, duration: 1.8, ease: "expo.out" },
        "-=1.2"
      ).from(
        ".story-img-right",
        { xPercent: 100, duration: 1.8, ease: "expo.out" },
        "<"
      );

      return () => {
        eyebrowSplit?.revert();
        headingSplit?.revert();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[#F9F8F6] text-[#141414] py-40 md:py-56 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        <div className="lg:col-span-5 flex flex-col">
          <span className="story-eyebrow text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8 block">
            01 - Our Story
          </span>
          <h2
            className="story-headline font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-light leading-[1.05] mb-10 tracking-tight"
            style={{ perspective: "500px" }}
          >
            Our Story
          </h2>
          <div className="story-divider w-16 h-px bg-[#C5A572] mb-12"></div>
          <p className="story-p1 text-base md:text-lg font-light text-[#141414]/70 leading-[1.9] mb-8 tracking-wide">
            Express Highway Inn began with a simple observation: Bangladesh&apos;s highways move faster every year, but the places to rest along them hadn&apos;t kept pace. Sampan Group set out to change that by building a property where a quick stop feels like a proper retreat, and where a membership card opens the door to something far more exclusive. 
          </p>
          <p className="story-p2 text-base md:text-lg font-light text-[#141414]/70 leading-[1.9] tracking-wide">
            Today, Sampan Highway Inn stands as one of Sampan Group&apos;s flagship hospitality ventures, anchoring a growing highway township of hotels, residences and retail.
          </p>
        </div>

        <div className="lg:col-span-7 relative w-full aspect-[4/5] overflow-hidden group" data-cursor="VIEW">
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <div className="story-img-left w-[200%] h-full">
              <Image
                src="/images/condomenium.jpg"
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
                src="/images/condomenium.jpg"
                alt="Architecture Right"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-10 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/90 block font-medium">
              Express Highway Inn
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A572] block mt-2">
              01 / Architecture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. TIMELINE - IMAGE STACKING + CLIP-PATH REVEAL
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
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1.2 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#0B0B0B", duration: 1.2 });
              gsap.to(".tl-line-active", { width: "100%", duration: 1.2 });
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 0 0 0)",
                duration: 1.8,
                ease: "expo.out",
              });
            }
          },
          onLeave: () => {
            gsap.to(panel, { autoAlpha: 0.3, scale: 0.95, duration: 1.2 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#050505", duration: 1.2 });
              gsap.to(".tl-line-active", { width: "0%", duration: 1.2 });
            }
          },
          onEnterBack: () => {
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1.2 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#0B0B0B", duration: 1.2 });
              gsap.to(".tl-line-active", { width: "100%", duration: 1.2 });
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 0 0 0)",
                duration: 1.8,
                ease: "expo.out",
              });
            }
          },
          onLeaveBack: () => {
            gsap.to(panel, { autoAlpha: 0.3, scale: 0.95, duration: 1.2 });
            if (isHighlight) {
              gsap.to(".tl-bg", { backgroundColor: "#050505", duration: 1.2 });
              gsap.to(".tl-line-active", { width: "0%", duration: 1.2 });
              gsap.to(panel.querySelector(".tl-highlight-img"), {
                clipPath: "inset(0 100% 0 0)",
                duration: 1.2,
              });
            }
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative h-screen bg-[#050505] text-white overflow-hidden hidden md:block">
      <div className="tl-bg absolute inset-0 bg-[#050505] transition-colors duration-1000"></div>

      <div className="relative h-full flex flex-col justify-center px-16 z-10">
        <div className="mb-20 flex items-end justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-6">
              02 - Our Journey
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl font-light tracking-tight">
              Built Over Time.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light text-white/40 tracking-wide">
            Drag to explore the timeline.
          </p>
        </div>

        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2">
          <div className="tl-line-active h-full bg-[#C5A572]/60 w-0 transition-all duration-1000"></div>
        </div>

        <div ref={trackRef} className="flex gap-32 items-center px-20" data-cursor="DRAG">
          {TIMELINE_MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`tl-panel relative flex-shrink-0 w-[40vw] ${m.highlight ? "tl-highlight" : ""}`}
              style={{ opacity: 0.3, transform: "scale(0.95)" }}
            >
              <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full border-2 border-[#050505] -translate-y-1/2 bg-[#C5A572]"></div>

              <div className={`pl-12 flex ${m.highlight ? "items-center gap-16" : ""}`}>
                <div>
                  <span className="block text-5xl font-[family-name:var(--font-playfair)] mb-5 text-white/80 font-light">
                    {m.year}
                  </span>
                  <h3 className="text-3xl font-light mb-5 font-[family-name:var(--font-playfair)]">{m.title}</h3>
                  <p className="text-sm text-white/40 max-w-xs leading-[1.8] tracking-wide">{m.desc}</p>
                </div>

                {m.highlight && (
                  <div
                    className="tl-highlight-img relative w-[350px] h-[250px] overflow-hidden border border-[#C5A572]/20"
                    style={{ clipPath: "inset(0 100% 0 0)" }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop"
                      alt="2026 Highlight"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C5A572]/20 to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden absolute inset-0 bg-[#050505] p-8 overflow-y-auto">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-6">
          02 - Our Journey
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-light mb-16 tracking-tight">
          Built Over Time.
        </h2>
        {TIMELINE_MILESTONES.map((m, i) => (
          <div key={i} className="border-l border-white/10 pl-8 pb-16 relative">
            <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-[#C5A572]"></div>
            <span className="block text-2xl font-[family-name:var(--font-playfair)] text-[#C5A572] mb-2 font-light">
              {m.year}
            </span>
            <h3 className="text-xl font-light mb-2 font-[family-name:var(--font-playfair)]">{m.title}</h3>
            <p className="text-sm text-white/40 leading-[1.8]">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. ALLIED ORGANIZATIONS - IMAGE GRID LOGOS
═══════════════════════════════════════════════════════════════ */
function AlliedOrganizations() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const text = document.querySelector<HTMLElement>(".allied-head");
      if (text) {
        splitInstance = new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".allied-head .line", {
          yPercent: 110,
          duration: 1.5,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      gsap.utils.toArray<HTMLElement>(".allied-logo").forEach((logo) => {
        gsap.fromTo(
          logo,
          { clipPath: "inset(0 0 100% 0)", opacity: 0, scale: 0.9 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: { trigger: logo, start: "top 85%" },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[#F9F8F6] text-[#141414] py-40 md:py-56 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-24">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8">
              03 - Trust & Affiliation
            </span>
            <h2 className="allied-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-light leading-[1.05] tracking-tight">
              Built on Trust.
              <br />
              Connected by Partnership.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-[#141414]/50 leading-[1.8] tracking-wide">
            Our relationships with recognized organizations, professional bodies and strategic partners strengthen the standards behind everything we build.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#141414]/10">
          {AFFILIATIONS.map((item, i) => (
            <div
              key={item.num}
              className="allied-logo group border-r border-b border-[#141414]/10 aspect-[3/2] flex items-center justify-center p-8 cursor-pointer relative overflow-hidden"
              data-cursor="OPEN →"
            >
              {/* Hover Border Accents */}
              <span className="absolute top-0 left-0 w-full h-px bg-[#C5A572] origin-left transition-all duration-500 scale-x-0 group-hover:scale-x-100"></span>
              <span className="absolute top-0 right-0 h-full w-px bg-[#C5A572] origin-top transition-all duration-500 delay-100 scale-y-0 group-hover:scale-y-100"></span>
              <span className="absolute bottom-0 right-0 w-full h-px bg-[#C5A572] origin-right transition-all duration-500 delay-200 scale-x-0 group-hover:scale-x-100"></span>
              <span className="absolute bottom-0 left-0 h-full w-px bg-[#C5A572] origin-bottom transition-all duration-500 delay-300 scale-y-0 group-hover:scale-y-100"></span>

              {/* Logo Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-contain transition-all duration-500 p-2 md:p-4"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. DIVISIONS - IMAGE + TEXT MASK (HOVER REVEAL)
═══════════════════════════════════════════════════════════════ */
function Divisions() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-[#0B0B0B] text-white py-40 md:py-56 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-24">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8">
              04 - Sampan Group Concerns
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-light leading-[1.05] tracking-tight">
              Different Industries.
              <br />
              One Connected Vision.
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-white/50 leading-[1.8] tracking-wide">
            Across hospitality, real estate, education and automotive services, Sampan Group continues to build businesses around one connected vision.
          </p>
        </div>

        <div className="hidden md:flex gap-2 h-[550px] border border-white/10">
          {DIVISIONS.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex-1 p-10 border-r border-white/10 last:border-r-0 cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: hovered === i ? 2.5 : 1 }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={d.img}
                  alt={d.title}
                  fill
                  className="object-cover transition-transform duration-700"
                  style={{
                    transform: hovered === i ? "scale(1)" : "scale(1.1)",
                    opacity: hovered === i ? 0.3 : 0,
                  }}
                />
              </div>
              <div
                className="absolute inset-0 bg-[#0B0B0B]/80 z-[1]"
                style={{ opacity: hovered === i ? 0.8 : 0 }}
              ></div>

              <span
                className="absolute top-6 right-6 font-[family-name:var(--font-playfair)] text-[14rem] leading-none text-white/5 transition-all duration-700 pointer-events-none z-[2]"
                style={{
                  opacity: hovered === i ? 0.1 : 0.03,
                  transform: hovered === i ? "scale(1.2)" : "scale(1)",
                }}
              >
                {d.num}
              </span>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-sm font-light text-white/30 mb-8 block transition-colors duration-300 group-hover:text-[#C5A572]">
                    {d.num}
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-light tracking-tight">
                    {d.title}
                  </h3>
                </div>

                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: hovered === i ? "250px" : "0px",
                    opacity: hovered === i ? 1 : 0,
                  }}
                >
                  <p className="text-sm font-light text-white/60 mb-8 pt-4 leading-[1.8] tracking-wide">
                    {d.desc}
                  </p>
                  <div className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#C5A572]">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden grid grid-cols-1 gap-px bg-white/10 border border-white/10">
          {DIVISIONS.map((d, i) => (
            <div key={i} className="bg-[#0B0B0B] p-10 relative">
              <span className="text-sm font-light text-white/30 mb-8 block">{d.num}</span>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-light mb-4 tracking-tight">{d.title}</h3>
              <p className="text-sm font-light text-white/60 leading-[1.8] tracking-wide">{d.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-white/80 hover:text-[#C5A572] transition-colors duration-300"
          >
            View All Divisions
            <span className="relative w-12 h-px bg-white/40 group-hover:bg-[#C5A572] transition-all duration-500 group-hover:w-20">
              <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-[#C5A572] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. FINAL CTA - IMAGE DISTORTION + TEXT MASK SLIDE
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-bg",
        { opacity: 0.05, scale: 1.2, skewX: 5, filter: "blur(15px)" },
        {
          opacity: 0.4,
          scale: 1,
          skewX: 0,
          filter: "blur(0px)",
          duration: 3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });

      const heading = document.querySelector<HTMLElement>(".cta-headline");
      if (heading) {
        new SplitType(heading, { types: "lines", lineClass: "overflow-hidden block" });
        gsap.set(".cta-headline .line", { yPercent: 110 });
        tl.to(".cta-headline .line", {
          yPercent: 0,
          duration: 1.8,
          stagger: 0.15,
          ease: "expo.out",
        });
      }

      tl.from(".cta-eyebrow", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=0.5")
        .from(".cta-sub", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=1")
        .from(".cta-btn", { opacity: 0, scale: 0.8, duration: 1.2, ease: "back.out(1.7)" }, "-=0.6");

      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

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
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative bg-[#070707] text-white py-44 md:py-64 overflow-hidden">
      <div
        className="cta-bg absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('/images/cta.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707] via-transparent to-[#070707] z-[1]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.05] blur-[150px] rounded-full z-[1]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center flex flex-col items-center">
        <span className="cta-eyebrow block text-[10px] uppercase tracking-[0.5em] text-[#C5A572] font-medium mb-10">
          The Next Chapter Awaits
        </span>

        <h2 className="cta-headline font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[1.05] mb-12 tracking-tight">
          <div>Ready to</div>
          <div>Experience It?</div>
        </h2>

        <p className="cta-sub text-lg md:text-xl font-light text-white/50 max-w-xl mx-auto leading-[1.8] mb-12 tracking-wide">
          Discover the private world of Express Highway Inn Club & Lounge.
        </p>

        <a
          ref={btnRef}
          href="/membership"
          className="cta-btn group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#C5A572] text-[#0B0B0B] text-[11px] uppercase tracking-[0.4em] font-medium overflow-hidden cursor-pointer"
          data-cursor="EXPLORE"
        >
          <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-20"></span>
          <span className="relative z-10">Explore Club & Lounge Membership</span>
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
    <main className="bg-[#F9F8F6] font-[family-name:var(--font-sans)]">
      <CustomCursor />
      <AboutHero />
      <OurStory />
      <Timeline />
      <AlliedOrganizations />
      <Divisions />
      <FinalCTA />
    </main>
  );
}