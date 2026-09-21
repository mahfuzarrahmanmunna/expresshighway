"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data (Layout Math Perfectly Calculated for 12-Col Grid) ── */
/*
   Row 1: 8 cols (16/10 ratio -> height 5 units) + 4 cols (4/5 ratio -> height 5 units) = Perfect match
   Row 2: 6 cols (4/3 ratio -> height 4.5 units) + 6 cols (4/3 ratio -> height 4.5 units) = Perfect match
   Row 3: 4 cols (4/5 ratio -> height 5 units) + 8 cols (16/10 ratio -> height 5 units) = Perfect match
   Row 4: 8 cols (4/3 ratio -> height 6 units) + 4 cols (2/3 ratio -> height 6 units) = Perfect match
*/
const AMENITIES = [
  {
    index: "01",
    title: "Highway Restaurant & Party Center",
    desc: "Open 24/7",
    img: "/images/resturant.png",
    size: "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/10]",
    offset: "",
    href: "https://www.sampangroup.com.bd/our-divisions/hospitality-highway-travel/sampan-highway-inn-restaurant-party-center"
  },
  {
    index: "02",
    title: "VVIP Lounge",
    desc: "Premium comfort, exclusively for members",
    img: "/images/clubandlounge.jpg",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/5]",
    offset: "lg:mt-24",
  },
  {
    index: "03",
    title: "Billiards & Card Room",
    desc: "Play, relax, compete",
    img: "/images/billiards.png",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-6 lg:aspect-[4/3]",
    offset: "",
  },
  {
    index: "04",
    title: "Sampan Mart",
    desc: "Your daily needs, on the way",
    img: "/images/sampanmart.jpeg",
    size: "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-6 lg:aspect-[4/3]",
    offset: "lg:mt-16",
    href: "https://www.sampangroup.com.bd/our-divisions/retail-super-shops/sampan-mart"
  },
  {
    index: "05",
    title: "EV Car Charging",
    desc: "Fast, convenient",
    img: "/images/evcharging.avif",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/5]",
    offset: "lg:mt-8",
    href: "https://www.sampangroup.com.bd/our-divisions/automotive-fuel-mobility/sampan-ev-car-charging-station"
  },
  {
    index: "06",
    title: "Automatic Car Wash",
    desc: "Quick, efficient",
    img: "/images/carwash.webp",
    size: "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/10]",
    offset: "lg:mt-20",
  },
  {
    index: "07",
    title: "Salon & Spa",
    desc: "Pamper yourself daily",
    img: "/images/spa.jpeg",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-8 lg:aspect-[4/3]",
    offset: "lg:mt-12",
  },
  {
    index: "08",
    title: "Prayer Room",
    desc: "Peaceful, always open",
    img: "/images/prayerroom.jpg",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-4 lg:aspect-[2/3]",
    offset: "lg:mt-32",
  },
];

export default function Amenities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Header Animation */
      gsap.from(".amenity-header > *", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".amenity-header",
          start: "top 85%",
        },
      });

      /* Grid Items Cinematic Reveal */
      const items = gsap.utils.toArray<HTMLElement>(".amenity-card");

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

        const imgWrap = item.querySelector<HTMLElement>(".amenity-img-wrap");
        if (imgWrap) {
          // Pre-scale to create the overflow buffer that makes
          // the parallax movement safe. Applied immediately to
          // avoid any first-frame flash of an unscaled image.
          gsap.set(imgWrap, { scale: 1.12 });

          // Symmetric, scrubbed counter-scroll drift.
          gsap.fromTo(
            imgWrap,
            { yPercent: 4 },
            {
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="amenities"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/3 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Editorial Header ─── */}
        <div className="amenity-header flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 md:mb-32">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              The Express Experience
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.85] tracking-tight text-[#0c0b0b]">
              Everything
              <br />
              On The Way.
            </h2>
          </div>
          <div className="max-w-xs lg:text-right lg:pb-4">
            <div className="hidden lg:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="text-sm md:text-base font-light text-[#0c0b0b]/50 leading-relaxed">
              Crafted for comfort and convenience. Every stop becomes part of the
              journey, tailored for the modern traveller.
            </p>
          </div>
        </div>

        {/* ─── Asymmetric Editorial Grid ─── */}
        <div className="amenities-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-24">
          {AMENITIES.map((item) => {
            // Dynamically render as <a> if href exists, otherwise <div>
            const CardTag = item.href ? 'a' : 'div';
            
            return (
              <CardTag
                key={item.index}
                href={item.href || undefined}
                target={item.href ? "_blank" : undefined}
                rel={item.href ? "noopener noreferrer" : undefined}
                className={`amenity-card group relative ${item.size} ${item.offset} overflow-hidden ${item.href ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {/* Parallax Image Stack */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="amenity-img-wrap absolute inset-0 will-change-transform">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="amenity-img object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      quality={90}
                    />
                  </div>
                </div>

                {/* Refined Bottom Gradient for Permanent Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-[1] pointer-events-none" />

                {/* Architectural Hover Border */}
                <div className="absolute inset-4 border border-white/0 group-hover:border-white/20 transition-all duration-700 z-[2] pointer-events-none"></div>

                {/* Content Layer (Always Visible) */}
                <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-between z-10">

                  {/* Top Row: Index & Arrow */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors duration-500 group-hover:text-primary drop-shadow-md">
                      {item.index}
                    </span>
                    {/* Elegant Circular Arrow Button */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-primary/50 transition-colors duration-500"></div>
                      <ArrowUpRight className="h-4 w-4 text-white/70 transition-all duration-500 group-hover:text-primary group-hover:rotate-45" />
                    </div>
                  </div>

                  {/* Bottom Content - Always Visible */}
                  {/* Subtle lift on hover for a premium feel */}
                  <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {/* Static Description */}
                    <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/80 mb-3 font-medium drop-shadow-md">
                      {item.desc}
                    </p>

                    {/* Title with Drop Shadow for maximum pop */}
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">
                      {item.title}
                    </h3>

                    {/* Static Bottom Line Indicator that expands on hover */}
                    <div className="h-[1px] w-12 bg-primary/80 mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
                  </div>
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}