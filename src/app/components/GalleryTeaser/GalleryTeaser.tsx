"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Curated Editorial Gallery Data ── */
/* 
   Layout Math (Desktop 12-col grid):
   Row 1: 12 cols (21/9 cinematic ratio) = Full width feature intro
   Row 2: 8 cols (16/10 ratio -> height 5 units) + 4 cols (4/5 ratio -> height 5 units) = Perfect match
   Row 3: 4 cols (4/5 ratio -> height 5 units) + 8 cols (16/10 ratio -> height 5 units) = Perfect match
   Row 4: 4 x 3 cols (3/2 ratio -> height 2 units) = Perfect match
   
   Mobile (2-col grid):
   - Features span 2 cols (full width)
   - Portraits/Squares span 1 col
   - Math pairs perfectly to prevent layout gaps
*/
const GALLERY_IMAGES = [
  {
    src: "/banner/banner1.jpg",
    size: "col-span-2 md:col-span-12 aspect-[16/9] md:aspect-[21/9]",
  },
  {
    src: "/images/lounge.jpg",
    size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    src: "/club/salon.jpg",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
  },
  {
    src: "/club/bar.jpg",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
  },
  {
    src: "/club/lounge.png",
    size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    src: "/images/swimmingpool.jpg",
    size: "col-span-1 md:col-span-3 aspect-[3/2]",
  },
  {
    src: "/club/gym.jpg",
    size: "col-span-1 md:col-span-3 aspect-[3/2]",
  },
  {
    src: "/club/room.jpg",
    size: "col-span-1 md:col-span-3 aspect-[3/2]",
  },
  {
    src: "/club/rooms.jpg",
    size: "col-span-1 md:col-span-3 aspect-[3/2]",
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
      
      // Animate Lightbox In
      gsap.fromTo(
        ".lightbox-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(
        ".lightbox-image",
        { opacity: 0, scale: 0.95, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out", delay: 0.1 }
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

      /* Grid Items Clip-Path Reveal & Parallax */
      const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
      
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "power4.out",
            delay: (i % 3) * 0.15, // Stagger based on column position
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
            },
          }
        );

        /* 
          Subtle Vertical Parallax on Inner Wrapper.
          By animating the wrapper instead of the image, 
          we prevent GSAP transform conflicts with CSS hover transforms.
        */
        const imgWrap = item.querySelector(".gallery-img-wrap");
        if (imgWrap) {
          gsap.to(imgWrap, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-x-hidden"
    >
      {/* Ambient Subtle Background Tone */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F9F8F6] via-[#F7F6F2] to-[#F0EFEA]" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-8 relative z-10">
        
        {/* ─── Editorial Header Block ─── */}
        <div className="gallery-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="max-w-3xl w-full md:w-auto">
            <span className="gallery-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              Visual Tour
            </span>
            <h2 
              className="gallery-heading font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] text-[#0c0b0b] tracking-[-0.02em]"
              style={{ perspective: "1000px" }}
            >
              Curated <span className="italic text-primary/80">Gallery.</span>
            </h2>
          </div>
          <div className="max-w-sm w-full md:w-auto md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto gallery-header-anim"></div>
            <p className="gallery-header-anim text-sm md:text-base font-light text-[#0c0b0b]/50 leading-[1.8]">
              A glimpse into the architecture, ambiance, and meticulously curated spaces that define the Express Highway Inn experience.
            </p>
          </div>
        </div>

        {/* ─── Pure Editorial 12-Column Grid ─── */}
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3">
          {GALLERY_IMAGES.map((item, i) => (
            <div
              key={i}
              onClick={() => setViewerIndex(i)}
              className={`gallery-item group relative ${item.size} overflow-hidden cursor-zoom-in bg-[#0c0b0b] select-none`}
            >
              {/* Parallax Wrapper (Moved by GSAP) */}
              <div className="gallery-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full z-0 overflow-hidden">
                {/* Inner Image (Scaled by CSS Hover) */}
                <Image
                  src={item.src}
                  alt="Express Highway Inn Visual"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover h-full w-full transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.04] group-hover:brightness-110 group-hover:contrast-[1.05]"
                  quality={90}
                />
              </div>

              {/* Extremely Subtle Vignette for Depth (No text) */}
              <div className="absolute inset-0 bg-[#0c0b0b]/0 group-hover:bg-[#0c0b0b]/10 transition-colors duration-700 z-[1] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────── */}
      {/* ─── Pure Luxury Lightbox / Image Viewer ─── */}
      {/* ────────────────────────────────────────────────── */}
      {viewerIndex !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-[9999] bg-[#0B0B0B]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setViewerIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setViewerIndex(null)}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors duration-500 p-2 z-50"
            aria-label="Close viewer"
          >
            <X className="h-8 w-8" strokeWidth={1} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewerIndex(
                (viewerIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
              );
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-500 p-2 z-50 group"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10 transition-transform duration-500 group-hover:-translate-x-2" strokeWidth={1} />
          </button>

          {/* Pure Image Content - No Captions */}
          <div
            className="lightbox-content relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[viewerIndex].src}
              alt="Express Highway Inn Expanded View"
              width={1920}
              height={1080}
              className="lightbox-image object-contain max-w-full max-h-[85vh] md:max-h-[80vh] shadow-2xl"
              quality={100}
              priority
            />
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewerIndex((viewerIndex + 1) % GALLERY_IMAGES.length);
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-500 p-2 z-50 group"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}