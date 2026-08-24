"use client";

import { useRef, useEffect } from "react";
import { ArrowUpRight, BedDouble, Bath, Maximize } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { SectionHeader } from "../ui/section-header";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PROPERTIES = [
  {
    title: "The Skyline Penthouse",
    location: "Tower A · Floor 52",
    price: "$4,200,000",
    beds: 4,
    baths: 5,
    area: "6,200",
    image: "https://picsum.photos/seed/elysian-skyline/800/1000",
    tag: "Exclusive",
  },
  {
    title: "The Garden Villa",
    location: "Courtyard · Ground Floor",
    price: "$3,800,000",
    beds: 5,
    baths: 6,
    area: "7,800",
    image: "https://picsum.photos/seed/elysian-garden-villa/800/1000",
    tag: "New Release",
  },
  {
    title: "The Horizon Suite",
    location: "Tower B · Floor 38",
    price: "$2,950,000",
    beds: 3,
    baths: 4,
    area: "4,500",
    image: "https://picsum.photos/seed/elysian-horizon/800/1000",
    tag: "Premium",
  },
];

export default function FeaturedProperties() {
  const { isReducedMotion } = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleImgRef = (i: number) => (el: HTMLImageElement | null) => {
    imgRefs.current[i] = el;
  };

  /* 
    ✅ Fixed: Replaced useRef with useEffect for proper GSAP context 
    and lifecycle handling. Consolidated all animations into one robust block.
  */
  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      /* 1. Animate the grid container in */
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        },
      );

      /* 2. Staggered image mask reveal */
      imgRefs.current.forEach((img) => {
        if (!img) return;
        gsap.fromTo(
          img,
          { clipPath: "inset(100% 0 0 0)", scale: 1.15 },
          {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            clearProps: "transform,opacity,filter", // Prevents blurry images
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative bg-[#FDFDFC] py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle architectural top line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,125,197,0.15) 50%, transparent 95%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 sm:mb-20 lg:mb-24 max-w-3xl">
          <SectionHeader
            label="Featured Residences"
            title="Curated Architectural Living"
            subtitle="Each home is meticulously designed to offer an unparalleled living experience, blending architectural brilliance with natural beauty."
            light
            align="left"
          />
        </div>

        {/* Properties Grid - Mobile First */}
        <div
          ref={cardsRef}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10",
            !isReducedMotion && "opacity-0", // Hidden until GSAP takes over
          )}
        >
          {PROPERTIES.map((prop, i) => (
            <article
              key={prop.title}
              className="group relative flex flex-col cursor-pointer"
            >
              {/* Image container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-100">
                <img
                  ref={handleImgRef(i)}
                  src={prop.image}
                  alt={prop.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />

                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Overlay Elements */}
                <div className="absolute inset-x-0 top-0 p-5 sm:p-6 flex items-start justify-between">
                  {/* Tag */}
                  <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[9px] font-medium tracking-[0.2em] uppercase text-white backdrop-blur-md">
                    {prop.tag}
                  </span>
                  {/* Hover Icon */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 scale-90 transition-all duration-500 backdrop-blur-md group-hover:opacity-100 group-hover:scale-100 group-hover:bg-white group-hover:text-neutral-900">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Editorial Index Number */}
                <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 text-white/30 font-serif text-2xl pointer-events-none">
                  0{i + 1}
                </div>
              </div>

              {/* Info - Kept outside image for cleaner typography */}
              <div className="mt-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl tracking-tight text-neutral-900">
                      {prop.title}
                    </h3>
                    <p className="mt-2 text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                      {prop.location}
                    </p>
                  </div>
                  <span className="text-base sm:text-lg font-medium tracking-tight text-primary whitespace-nowrap">
                    {prop.price}
                  </span>
                </div>

                {/* Specs */}
                <div className="mt-6 pt-5 border-t border-neutral-200 flex items-center gap-6">
                  <span className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                    <BedDouble className="h-4 w-4 text-neutral-400" />
                    {prop.beds} Beds
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                    <Bath className="h-4 w-4 text-neutral-400" />
                    {prop.baths} Baths
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium ml-auto">
                    <Maximize className="h-4 w-4 text-neutral-400" />
                    {prop.area} ft²
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <button className="group relative inline-flex items-center gap-3 border border-neutral-300 px-8 py-4 text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-700 transition-colors duration-300 hover:border-primary hover:text-primary">
            <span className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative z-10">View All Residences</span>
            <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
