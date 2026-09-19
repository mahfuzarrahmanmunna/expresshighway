"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Curated Gallery Data ── */
const GALLERY_IMAGES = [
  {
    src: "/images/lounge.jpg",
    title: "VVIP Lounge",
    size: "col-span-2 md:col-span-6 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    src: "/club/salon.jpg",
    title: "Wellness & Spa",
    size: "col-span-1 md:col-span-3 aspect-[4/5]",
  },
  {
    src: "/club/bar.jpg",
    title: "Recreation Room",
    size: "col-span-1 md:col-span-3 aspect-[4/5]",
  },
  {
    src: "/club/lounge.png",
    title: "Fine Dining",
    size: "col-span-1 md:col-span-3 aspect-[4/5]",
  },
  {
    src: "/images/swimmingpool.jpg",
    title: "Infinity Pool",
    size: "col-span-1 md:col-span-3 aspect-[4/5]",
  },
  {
    src: "/club/gym.jpg",
    title: "Fitness Center",
    size: "col-span-2 md:col-span-6 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    src: "/club/room.jpg",
    title: "Luxury Suites",
    size: "col-span-2 md:col-span-4 aspect-[4/5] md:aspect-square",
  },
  {
    src: "/club/rooms.jpg",
    title: "Architectural Details",
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/9]",
  },
];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  /* ── Lightbox Keyboard Navigation & Scroll Lock ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerIndex === null) return;
      if (e.key === "Escape") setViewerIndex(null);
      if (e.key === "ArrowRight")
        setViewerIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_IMAGES.length
        );
      if (e.key === "ArrowLeft")
        setViewerIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        );
    };

    if (viewerIndex !== null) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".lightbox-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".lightbox-content",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [viewerIndex]);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      
      /* ── Premium Split Heading Reveal ── */
      const heading = document.querySelector<HTMLElement>(".gallery-heading");
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.from(".gallery-heading .word", {
          yPercent: 120,
          opacity: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
          },
        });
      }

      /* Header Sub-elements Animation */
      gsap.from(".gallery-header-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-header",
          start: "top 85%",
        },
      });

      /* Grid Items Clip-Path Reveal */
      const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
            },
          }
        );

        /* Image Parallax (Counter-scroll) */
        const img = item.querySelector(".gallery-img");
        if (img) {
          gsap.to(img, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      /* CTA Reveal */
      gsap.from(".gallery-cta-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-cta-wrap",
          start: "top 90%",
        },
      });

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-32 md:py-48 overflow-x-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="gallery-header flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-20 md:mb-28">
          <div className="max-w-3xl">
            <span className="gallery-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-8 block">
              Visual Tour
            </span>
            <h2 
              className="gallery-heading font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] text-[#0c0b0b] tracking-[-0.02em]"
              style={{ perspective: "1000px" }}
            >
              Curated <span className="italic text-primary/80">Gallery.</span>
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto gallery-header-anim"></div>
            <p className="gallery-header-anim text-sm md:text-base font-light text-[#0c0b0b]/50 leading-[1.8]">
              A glimpse into the architecture, ambiance, and meticulously curated spaces that define the Express Highway Inn experience.
            </p>
          </div>
        </div>

        {/* ─── Asymmetric 12-Column Grid ─── */}
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-5">
          {GALLERY_IMAGES.map((item, i) => (
            <div
              key={i}
              onClick={() => setViewerIndex(i)}
              className={`gallery-item group relative ${item.size} overflow-hidden cursor-zoom-in bg-[#0c0b0b] select-none`}
            >
              {/* Parallax Image Wrapper */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="gallery-img object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.05]"
                  quality={90}
                />
              </div>

              {/* Persistent Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0b]/90 via-[#0c0b0b]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-[1]" />

              {/* Top Index Indicator */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
                <span className="text-[10px] tracking-[0.3em] text-white/70 transition-colors duration-500 group-hover:text-white">
                  0{i + 1} / 08
                </span>
                <Expand className="h-4 w-4 text-white/70 transition-all duration-500 group-hover:text-white group-hover:scale-110" />
              </div>

              {/* Bottom Title - Always Visible, lifts on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl text-white font-medium leading-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                  {item.title}
                </h3>
                <div className="h-[1px] w-8 bg-primary mt-3 group-hover:w-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
            </div>
          ))}
        </div>

        {/* ─── CTA Wrap ─── */}
        <div className="gallery-cta-wrap flex justify-center mt-24">
          <div className="gallery-cta-anim">
            <a
              href="#full-gallery"
              className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-[#0c0b0b]/80 hover:text-primary transition-colors duration-300"
            >
              View Full Gallery
              <span className="relative w-12 h-px bg-[#0c0b0b]/40 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
                <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────── */}
      {/* ─── Luxury Lightbox / Image Viewer ─────────────── */}
      {/* ────────────────────────────────────────────────── */}
      {viewerIndex !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-[100] bg-[#0c0b0b]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setViewerIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setViewerIndex(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-300 p-2 z-50"
            aria-label="Close viewer"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewerIndex(
                (viewerIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
              );
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300 p-2 z-50 group"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>

          {/* Image Content */}
          <div
            className="lightbox-content relative w-full max-w-6xl h-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 w-full flex items-center justify-center">
              <Image
                src={GALLERY_IMAGES[viewerIndex].src}
                alt={GALLERY_IMAGES[viewerIndex].title}
                width={1600}
                height={1000}
                className="object-contain max-w-full max-h-[75vh] rounded-sm shadow-2xl"
                quality={100}
                priority
              />
            </div>
            
            {/* Caption */}
            <div className="mt-8 text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-3 block">
                0{viewerIndex + 1} / 0{GALLERY_IMAGES.length}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white font-medium">
                {GALLERY_IMAGES[viewerIndex].title}
              </h3>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewerIndex((viewerIndex + 1) % GALLERY_IMAGES.length);
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300 p-2 z-50 group"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </section>
  );
}