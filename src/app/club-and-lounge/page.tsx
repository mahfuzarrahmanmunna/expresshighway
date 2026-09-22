"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight, ArrowUpRight, Plus, X, ArrowLeft } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const FACILITIES_GRID = [
  { name: "VVIP Lounge", tag: "Exclusive, luxury, comfort", img: "/images/clubandlounge.jpeg", size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { name: "Salon & Spa", tag: "Pamper yourself daily", img: "/club/salon.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { name: "Fine Dining", tag: "Fresh, flavorful, refreshing", img: "/images/dinning.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { name: "Billiard Room", tag: "Fun, skill, competition", img: "/club/game.jpg", size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { name: "Swimming Pool", tag: "Relax, refresh, rejuvenate", img: "/club/pool.webp", size: "col-span-1 md:col-span-3 aspect-square" },
  { name: "Premium Accommodation", tag: "Exclusive stays for members", img: "/images/accommodation.jpg", size: "col-span-1 md:col-span-3 aspect-square" },
  { name: "Juice & Drinks Bar", tag: "Fresh, flavorful, refreshing", img: "/club/bar.jpg", size: "col-span-1 md:col-span-3 aspect-square" },
  { name: "Prayer Room", tag: "Peaceful, serene, sacred", img: "/images/prayerroom.jpg", size: "col-span-1 md:col-span-3 aspect-square" },
];

const MOSAIC_IMAGES = [
  { src: "/club/club.png", size: "col-span-2 row-span-2 aspect-square" },
  { src: "/club/club1.png", size: "col-span-1 row-span-1 aspect-square" },
  { src: "/club/club2.jpeg", size: "col-span-1 row-span-2 aspect-[1/2]" },
  { src: "/club/images.jpg", size: "col-span-2 row-span-1 aspect-[2/1]" },
];

/* ═══════════════════════════════════════════════════════════════
   1. CINEMATIC HERO
═══════════════════════════════════════════════════════════════ */
function ClubHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    gsap.set(".hero-intro-line", { transformOrigin: "bottom center", rotateX: 90, opacity: 0 });
    tl.to(".hero-intro-line", { rotateX: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power4.out" })
      .to(".hero-intro-screen", { yPercent: -100, duration: 1.5, ease: "power4.inOut", delay: 0.8 })
      .from(".hero-bg-blur", { scale: 1.8, opacity: 0, filter: "blur(80px)", duration: 2.5, ease: "expo.out" }, "-=1.5")
      .from(".hero-bg-sharp", { scale: 1.3, opacity: 0, filter: "blur(20px)", duration: 2.5, ease: "expo.out" }, "-=2.2")
      .from(".hero-glow", { opacity: 0, duration: 3, ease: "power2.out" }, "-=1.5");

    const heading = document.querySelector<HTMLElement>(".hero-headline");
    if (heading) {
      new SplitType(heading, { types: "lines,words", lineClass: "overflow-hidden block" });
      gsap.set(".hero-headline .word", { yPercent: 110, rotateX: 45, opacity: 0 });
      tl.to(".hero-headline .word", { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.8, stagger: 0.1, ease: "power4.out" }, "-=1.8");
    }

    tl.fromTo(".hero-highlight-mask", { x: "-100%" }, { x: "100%", duration: 1.8, ease: "power2.inOut" }, "-=1")
      .from(".hero-sub", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, "-=1")
      .from(".hero-cta", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .from(".hero-scroll", { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, "-=0.5");

    const bgX = gsap.quickTo(".hero-bg-sharp", "x", { duration: 2.5, ease: "power2.out" });
    const bgY = gsap.quickTo(".hero-bg-sharp", "y", { duration: 2.5, ease: "power2.out" });
    const contentX = gsap.quickTo(".hero-content", "x", { duration: 1.8, ease: "power2.out" });
    const contentY = gsap.quickTo(".hero-content", "y", { duration: 1.8, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      bgX(nx * -20); bgY(ny * -15); contentX(nx * 8); contentY(ny * 5);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div className="hero-intro-screen fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 mb-10">Express Highway Inn</span>
        <div className="overflow-hidden py-2"><h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white/90 font-light tracking-tight">THE EXCLUSIVE</h1></div>
        <div className="overflow-hidden py-2"><h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white/90 font-light tracking-tight">RETREAT FOR</h1></div>
        <div className="overflow-hidden py-2"><h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-[#007DC6] font-light italic tracking-tight">THE MEMBERS</h1></div>
      </div>

      <div className="hero-bg-blur absolute inset-[-80px] z-0 opacity-40">
        <Image src="/hero.jpg" alt="Lounge Blurred" fill priority className="object-cover" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/40" />
      </div>
      <div className="hero-bg-sharp absolute inset-0 z-[1]">
        <Image src="/hero.jpg" alt="VVIP Lounge" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>
      <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#007DC6]/[0.06] blur-[150px] rounded-full z-[2]"></div>

      <div className="hero-content relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.8rem,9vw,8rem)] leading-[1.02] font-light tracking-[-0.02em]">
          <div className="block">Express Highway Inn</div>
          <div className="block relative w-fit mx-auto mt-4">
            Club &amp;
            <span className="relative inline-block ml-6">
              <span className="relative z-10 text-[#007DC6] italic font-normal">Lounge</span>
              <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/90 to-transparent"></span>
            </span>
          </div>
        </h2>
        <p className="hero-sub mt-12 text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-[1.8] tracking-wide">
          A private retreat inside Sampan Highway Inn with elegant interiors, premium amenities and fine dining, reserved exclusively for members.
        </p>
        <a href="/club-and-membership" className="hero-cta group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#007DC6] text-white text-[10px] uppercase tracking-[0.4em] font-medium overflow-hidden mt-14 border border-[#007DC6]/50">
          <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
          <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-500">Get Membership Benefits</span>
          <ArrowRight className="relative z-10 h-4 w-4 group-hover:text-[#0a0a0a] transition-all duration-500 group-hover:translate-x-1" />
        </a>
      </div>

      <div className="hero-scroll absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10">
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/40">Scroll</span>
        <div className="relative w-px h-16 bg-white/20 overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-[#007DC6] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style jsx>{`@keyframes scrollDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. EDITORIAL FACILITIES
═══════════════════════════════════════════════════════════════ */
function FacilitiesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const text = document.querySelector<HTMLElement>(".fac-head");
    if (text) {
      new SplitType(text, { types: "lines", lineClass: "overflow-hidden block" });
      gsap.from(".fac-head .line", { yPercent: 110, duration: 1.5, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: text, start: "top 85%" } });
    }
    const cards = gsap.utils.toArray<HTMLElement>(".fac-card");
    cards.forEach((card) => {
      gsap.fromTo(card, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power4.out", scrollTrigger: { trigger: card, start: "top 90%" } });
      const imgWrap = card.querySelector(".fac-img-wrap");
      if (imgWrap) gsap.to(imgWrap, { yPercent: -20, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 2 } });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="bg-[#F7F6F2] text-[#0a0a0a] py-32 md:py-48 overflow-hidden border-b border-[#0a0a0a]/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-24">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.5em] text-[#007DC6] font-medium mb-8">01 — Premium Amenities</span>
            <h2 className="fac-head font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-light leading-[1.05] tracking-tight">The Members&apos;<br />Sanctuary.</h2>
          </div>
          <p className="max-w-sm text-sm md:text-base font-light text-black/60 leading-[1.8] tracking-wide">Every detail is curated for your comfort. From recreation to relaxation, the Club & Lounge offers an ecosystem of premium amenities.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
          {FACILITIES_GRID.map((item, i) => (
            <div key={i} className={`fac-card group relative ${item.size} overflow-hidden cursor-pointer border border-[#0a0a0a]/10 hover:border-[#007DC6]/40 transition-colors duration-700`}>
              <div className="fac-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full z-0 overflow-hidden">
                <Image src={item.img} alt={item.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" quality={90} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[1] pointer-events-none" />
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/80 font-medium drop-shadow-md">0{i + 1}</span>
                  <div className="w-10 h-10 border border-white/30 flex items-center justify-center rounded-full group-hover:bg-[#007DC6] group-hover:border-[#007DC6] transition-all duration-500">
                    <ArrowUpRight className="h-4 w-4 text-white group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </div>
                <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/80 mb-4 font-medium drop-shadow-md">{item.tag}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl text-white font-light leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">{item.name}</h3>
                  <div className="h-[1px] w-12 bg-[#007DC6] mt-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-24" />
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
   3. MONUMENTAL TYPOGRAPHY (Refactored Layout & Animation)
═══════════════════════════════════════════════════════════════ */
function DayAtLounge() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(ref);

    // Single Coordinated Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "+=150%", // Extended cinematic scroll
        pin: true,
        scrub: 1.5, // Ultra-smooth scrub
        anticipatePin: 1
      }
    });

    // Set initial states
    gsap.set(q(".day-line-1, .day-line-2, .day-line-3, .day-line-4"), { yPercent: 110 });
    gsap.set(q(".day-img-frame"), { opacity: 0, scale: 0.92, y: 30 });
    gsap.set(q(".day-img-inner"), { scale: 1 });
    gsap.set(q(".day-bg-number"), { opacity: 0, scale: 1.1 });

    // Fluid Choreography with slight overlaps
    tl.to(q(".day-bg-number"), { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0)
      .to(q(".day-line-1"), { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.1)
      .to(q(".day-img-frame"), { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.3)
      .to(q(".day-line-2"), { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.5)
      .to(q(".day-line-3"), { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.7)
      .to(q(".day-line-4"), { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.9);

    // Subtle continuous parallax after entrance
    tl.to(q(".day-img-frame"), { y: -40, duration: 1.5, ease: "none" }, 1.5)
      .to(q(".day-img-inner"), { scale: 1.04, duration: 1.5, ease: "none" }, 1.5);

  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] bg-[#F7F6F2] text-[#0a0a0a] overflow-hidden flex items-center justify-center border-b border-[#0a0a0a]/10">
      
      {/* Architectural Watermark Number */}
      <div className="day-bg-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] md:text-[42rem] font-[family-name:var(--font-playfair)] font-light text-[#0a0a0a]/[0.025] pointer-events-none select-none z-0">
        02
      </div>

      {/* 
        CSS Grid Layout Architecture:
        Row 1: Top Text Zone (STEP IN,)
        Row 2: Dedicated Image Zone (Floating Image)
        Row 3: Bottom Text Zone (AND THE / HIGHWAY / FALLS AWAY.)
        This prevents any overlap while maintaining an editorial flow.
      */}
      <div className="grid grid-rows-[1fr_auto_1fr] h-full w-full max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Top Text Zone */}
        <div className="flex flex-col justify-end items-center pb-8 md:pb-14">
          <div className="overflow-hidden py-1">
            <h2 className="day-line-1 font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.9] font-light tracking-tight text-center">
              STEP IN,
            </h2>
          </div>
        </div>

        {/* Dedicated Floating Image Zone */}
        <div className="flex items-center justify-center md:justify-end md:pr-[15%] py-4 md:py-0">
          <div className="day-img-frame relative w-[min(82vw,340px)] h-[50vw] md:w-[380px] md:h-[230px] pointer-events-auto group">
            {/* Refined Architectural Outer Frame */}
            <div className="absolute -inset-3 border border-[#007DC6]/25 z-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:inset-0"></div>
            {/* Inner Image with Depth */}
            <div className="day-img-inner relative w-full h-full overflow-hidden border-[6px] border-[#F7F6F2] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] z-10">
              <Image 
                src="/hero.jpg" 
                alt="Lounge Detail" 
                fill 
                className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-[1.04]" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Text Zone */}
        <div className="flex flex-col justify-start items-center pt-8 md:pt-14 gap-y-1">
          <div className="overflow-hidden py-1">
            <h2 className="day-line-2 font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.9] font-light tracking-tight text-[#0a0a0a]/80">
              AND THE
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <h2 className="day-line-3 font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.9] font-light tracking-tight text-[#007DC6] italic">
              HIGHWAY
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <h2 className="day-line-4 font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.9] font-light tracking-tight">
              FALLS AWAY.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. EDITORIAL PHOTO MOSAIC & LIGHTBOX VIEWER
═══════════════════════════════════════════════════════════════ */
function PhotoMosaic() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // Fix for Next.js Portal Hydration

  useGSAP(() => {
    const images = gsap.utils.toArray<HTMLElement>(".mosaic-img");
    images.forEach((img, i) => {
      gsap.fromTo(img, { y: i % 2 === 0 ? 60 : -60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: img, start: "top 85%" } });
    });
  }, { scope: ref });

  useEffect(() => {
    setMounted(true); // Ensure portal only renders on client
  }, []);

  // Lightbox Animations & Lock Scroll
  useEffect(() => {
    if (activeIndex !== null) {
      gsap.fromTo(".lightbox-overlay", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".lightbox-image-wrap", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [activeIndex]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => prev === null ? null : (prev + 1) % MOSAIC_IMAGES.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => prev === null ? null : (prev - 1 + MOSAIC_IMAGES.length) % MOSAIC_IMAGES.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setActiveIndex((prev) => prev === null ? null : (prev + 1) % MOSAIC_IMAGES.length); };
  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setActiveIndex((prev) => prev === null ? null : (prev - 1 + MOSAIC_IMAGES.length) % MOSAIC_IMAGES.length); };

  return (
    <>
      <section ref={ref} className="bg-[#0a0a0a] text-white py-32 md:py-48 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.5em] text-[#007DC6] font-medium mb-8">03 — Visual Diary</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-light leading-[1.05] tracking-tight">A Glimpse <span className="italic text-[#007DC6]/80">Inside.</span></h2>
            </div>
            <span className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/60 hover:text-[#007DC6] transition-colors duration-300 cursor-pointer">
              Click to Enlarge 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[280px]">
            {MOSAIC_IMAGES.map((item, i) => (
              <div key={i} className={`mosaic-img relative ${item.size} overflow-hidden group cursor-pointer`} onClick={() => setActiveIndex(i)}>
                <Image src={item.src} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={85} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
                <div className="absolute inset-0 border border-white/0 group-hover:border border-white/20 m-4 transition-all duration-500"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-[#007DC6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
                  <Plus className="h-5 w-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Lightbox Viewer via Portal */}
      {mounted && activeIndex !== null && createPortal(
        <div className="lightbox-overlay fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-16" onClick={() => setActiveIndex(null)}>
          
          {/* Close Button */}
          <button onClick={() => setActiveIndex(null)} className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Close">
            <X className="h-5 w-5" />
          </button>

          {/* Prev Button */}
          <button onClick={handlePrev} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Previous">
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Next Button */}
          <button onClick={handleNext} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Next">
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Image Container */}
          <div className="lightbox-image-wrap relative w-full max-w-5xl h-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={MOSAIC_IMAGES[activeIndex].src} alt={`Gallery Enlarged ${activeIndex}`} fill className="object-contain" quality={100} />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/60 font-medium z-[10000]">
            0{activeIndex + 1} / 0{MOSAIC_IMAGES.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. LIQUID MAGNETIC FINAL CTA
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.fromTo(".cta-bg", { scale: 1.05 }, { scale: 1.2, duration: 20, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 65%" } });
    const heading = document.querySelector<HTMLElement>(".cta-headline");
    if (heading) {
      new SplitType(heading, { types: "lines", lineClass: "overflow-hidden block" });
      gsap.set(".cta-headline .line", { yPercent: 110 });
      tl.to(".cta-headline .line", { yPercent: 0, duration: 1.8, stagger: 0.15, ease: "power4.out" });
    }
    tl.from(".cta-eyebrow", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, "-=0.5")
      .from(".cta-sub", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .from(".cta-btn", { opacity: 0, scale: 0.8, duration: 1.2, ease: "back.out(1.7)" }, "-=0.5");

    const btn = btnRef.current;
    const liquid = liquidRef.current;
    if (btn && liquid) {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const xLiq = gsap.quickTo(liquid, "x", { duration: 0.8, ease: "power3.out" });
      const yLiq = gsap.quickTo(liquid, "y", { duration: 0.8, ease: "power3.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.3); yTo(y * 0.3); xLiq(x * 0.6); yLiq(y * 0.6);
      };
      const onMouseLeave = () => { xTo(0); yTo(0); xLiq(0); yLiq(0); };
      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);
      return () => { btn.removeEventListener("mousemove", onMouseMove); btn.removeEventListener("mouseleave", onMouseLeave); };
    }
  }, { scope: ref });

  return (
    <section ref={ref} className="relative bg-[#050505] text-white py-40 md:py-64 overflow-hidden">
      <div className="cta-bg absolute inset-0 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-3909d0bcfdd7?q=80&w=1920&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/95 z-[1]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[#007DC6]/[0.06] blur-[150px] rounded-full z-[1]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        <span className="cta-eyebrow block text-[10px] uppercase tracking-[0.5em] text-[#007DC6] font-medium mb-10">Membership Required</span>
        <h2 className="cta-headline font-[family-name:var(--font-playfair)] text-[clamp(3rem,9vw,8rem)] font-light leading-[1.05] mb-12 tracking-[-0.02em]">
          <div>THIS IS A</div>
          <div className="text-[#007DC6] italic">MEMBERS&apos; SPACE</div>
        </h2>
        <p className="cta-sub text-lg md:text-xl font-light text-white/60 max-w-xl mx-auto leading-[1.8] mb-16 tracking-wide">Access to the Club & Lounge is exclusively for Express Highway Inn Club & Lounge members.</p>
        <a ref={btnRef} href="#membership" className="cta-btn group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#007DC6] text-white text-[10px] uppercase tracking-[0.4em] font-medium overflow-hidden cursor-pointer border border-white/10">
          <span ref={liquidRef} className="absolute inset-0 bg-[#0096E0] rounded-full scale-0 group-hover:scale-[3] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ mixBlendMode: "screen" }}></span>
          <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
          <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-300">View Membership Plans</span>
          <ArrowRight className="relative z-10 h-4 w-4 group-hover:text-[#0a0a0a] transition-all duration-500 group-hover:translate-x-2 group-hover:rotate-45" />
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
      <ClubHero />
      <FacilitiesGrid />
      <DayAtLounge />
      <PhotoMosaic />
      <FinalCTA />
    </main>
  );
}