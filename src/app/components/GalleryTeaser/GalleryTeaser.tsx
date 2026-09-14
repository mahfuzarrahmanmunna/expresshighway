"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Curated Gallery Data ── */
const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1584132967334-10e02831ac14?q=80&w=800&auto=format&fit=crop",
    title: "VVIP Lounge",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=800&auto=format&fit=crop",
    title: "Wellness & Spa",
  },
  {
    src: "https://images.unsplash.com/photo-1611132944641-7573e0c5b57e?q=80&w=800&auto=format&fit=crop",
    title: "Recreation Room",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    title: "Fine Dining",
  },
  {
    src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
    title: "Infinity Pool",
  },
  {
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
    title: "Fitness Center",
  },
  {
    src: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=800&auto=format&fit=crop",
    title: "Luxury Suites",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    title: "Architectural Details",
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

      /* Grid Items Stagger */
      gsap.from(".gallery-item", {
        opacity: 0,
        scale: 0.95,
        y: 40,
        duration: 1.2,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 80%",
        },
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
      className="relative w-full bg-[#030303] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="gallery-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div className="max-w-2xl">
            <span className="gallery-header-anim text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6 block">
              Visual Tour
            </span>
            <h2 className="gallery-header-anim font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.02] text-foreground">
              Our Curated Gallery
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="gallery-header-anim text-sm md:text-base font-light text-foreground/50 leading-relaxed">
              A glimpse into the architecture, ambiance, and meticulously
              curated spaces that define the Express Highway Inn experience.
            </p>
          </div>
        </div>

        {/* ─── Seamless Hairline Grid ─── */}
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.03] border border-white/[0.03]">
          {GALLERY_IMAGES.map((item, i) => (
            <div
              key={i}
              className="gallery-item group relative bg-[#030303] aspect-[3/4] md:aspect-square overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-40"
                quality={80}
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent transition-opacity duration-700 group-hover:from-black/90" />
              <div className="absolute inset-0 bg-[#030303] opacity-40 group-hover:opacity-0 transition-opacity duration-700" />

              {/* Hover UI - Index & Arrow */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
                <span className="text-[10px] tracking-[0.3em] text-white/20 font-light transition-colors duration-500 group-hover:text-primary/60">
                  0{i + 1}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/0 transition-all duration-500 group-hover:text-white/80 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>

              {/* Bottom Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                {/* Masked Title Animation */}
                <div className="overflow-hidden">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg md:text-xl text-white font-medium leading-tight translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title}
                  </h3>
                </div>
                <div className="h-[1px] w-0 bg-primary mt-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10" />
              </div>
            </div>
          ))}
        </div>

        {/* ─── CTA Wrap ─── */}
        <div className="gallery-cta-wrap flex justify-center mt-16">
          <div className="gallery-cta-anim">
            <a
              href="#full-gallery"
              className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              View Gallery
              <span className="relative w-12 h-px bg-foreground/40 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
                <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
