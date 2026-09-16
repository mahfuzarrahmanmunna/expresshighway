"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Curated Gallery Data (with custom grid spans) ── */
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
    src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
    title: "Infinity Pool",
    size: "col-span-1 md:col-span-3 aspect-[4/5]",
  },
  {
    src: "/club/gym.jpg",
    title: "Fitness Center",
    size: "col-span-2 md:col-span-6 aspect-[4/5] md:aspect-[16/10]",
  },
  {
    src: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=800&auto=format&fit=crop",
    title: "Luxury Suites",
    size: "col-span-2 md:col-span-4 aspect-[4/5] md:aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    title: "Architectural Details",
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/9]",
  },
];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Header Animation */
      gsap.from(".gallery-header-anim", {
        opacity: 0,
        y: 50,
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-header",
          start: "top 85%",
        },
      });

      /* Grid Items Clip-Path Reveal */
      const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(100% 0% 0% 0%)" }, // Start hidden from bottom
          {
            clipPath: "inset(0% 0% 0% 0%)", // Reveal to full
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
    },
    { scope: containerRef },
  );

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="gallery-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div className="max-w-2xl">
            <span className="gallery-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              Visual Tour
            </span>
            <h2 className="gallery-header-anim font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.02] text-[#0c0b0b]">
              Our Curated Gallery
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="gallery-header-anim text-sm md:text-base font-light text-[#0c0b0b]/50 leading-relaxed">
              A glimpse into the architecture, ambiance, and meticulously
              curated spaces that define the Express Highway Inn experience.
            </p>
          </div>
        </div>

        {/* ─── Asymmetric 12-Column Grid ─── */}
        <div className="gallery-grid group/grid grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((item, i) => (
            <div
              key={i}
              className={`gallery-item group relative ${item.size} overflow-hidden cursor-pointer bg-white`}
            >
              {/* Parallax Image Wrapper */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="gallery-img object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover/grid:scale-[1.02]"
                  quality={90}
                />
              </div>

              {/* Hover Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0b]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]" />
              
              {/* Dimming Effect: When grid is hovered, dim image. If this item is hovered, keep it bright */}
              <div className="absolute inset-0 bg-[#F7F6F2] opacity-0 group-hover/grid:opacity-60 group-hover:opacity-0 transition-opacity duration-500 z-[2]" />

              {/* Top Index Indicator */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
                <span className="text-[10px] tracking-[0.3em] text-[#0c0b0b]/40 font-light transition-colors duration-500 group-hover:text-white">
                  0{i + 1} / 08
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#0c0b0b]/40 transition-all duration-500 group-hover:text-white group-hover:rotate-45" />
              </div>

              {/* Bottom Title Reveal */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <div className="overflow-hidden">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-3xl text-white font-medium leading-tight translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {item.title}
                  </h3>
                </div>
                <div className="h-[1px] w-0 bg-primary mt-3 group-hover:w-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" />
              </div>
            </div>
          ))}
        </div>

        {/* ─── CTA Wrap ─── */}
        <div className="gallery-cta-wrap flex justify-center mt-20">
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
    </section>
  );
}