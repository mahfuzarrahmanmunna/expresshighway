"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const AMENITIES = [
  {
    index: "01",
    title: "Highway Restaurant & Party Center",
    desc: "Open 24/7",
    img: "/images/resturant.png",
  },
  {
    index: "02",
    title: "VVIP Lounge",
    desc: "Premium comfort, exclusively for members",
    img: "/images/lounge.jpg",
  },
  {
    index: "03",
    title: "Billiards & Game Zone",
    desc: "Play, relax, compete",
    img: "/images/billiards.png",
  },
  {
    index: "04",
    title: "Sampan Mart",
    desc: "Your daily needs, on the way",
    img: "/images/sampanmart.jpg",
  },
  {
    index: "05",
    title: "EV Car Charging",
    desc: "Fast, convenient",
    img: "/images/evcharging.avif",
  },
  {
    index: "06",
    title: "Automatic Car Wash",
    desc: "Quick, efficient",
    img: "/images/carwash.webp",
  },
  {
    index: "07",
    title: "Salon & Spa",
    desc: "Pamper yourself daily",
    img: "/images/spa.avif",
  },
  {
    index: "08",
    title: "Prayer Room",
    desc: "Peaceful, always open",
    img: "/images/prayerroom.jpg",
  },
];

export default function Amenities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Header Animation */
      gsap.from(".amenity-header > *", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".amenity-header",
          start: "top 85%",
        },
      });

      /* Grid Items Stagger */
      gsap.from(".amenity-card", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".amenities-grid",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="amenities"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.04] blur-[120px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="amenity-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-24">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              The Express Experience
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.02] text-[#0c0b0b]">
              Everything On The Way
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="text-sm md:text-base font-light text-[#0c0b0b]/50 leading-relaxed">
              Crafted for comfort and convenience. Whether you are stopping for
              an hour or staying for the night, every detail is tailored for the
              modern traveller.
            </p>
          </div>
        </div>

        {/* ─── Amenities Grid (Seamless with hairline dividers) ─── */}
        {/* The dark gap-px background creates ultra-clean 1px borders between white cards */}
        <div className="amenities-grid grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#0c0b0b]/10 border border-[#0c0b0b]/10">
          {AMENITIES.map((item) => (
            <div
              key={item.index}
              className="amenity-card group relative bg-white aspect-[3/4] overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-20"
                quality={80}
              />

              {/* Top Overlay (White gradient for text readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent transition-opacity duration-700 group-hover:from-white" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-[0.3em] text-[#0c0b0b]/30 font-light transition-colors duration-500 group-hover:text-primary">
                    {item.index}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[#0c0b0b]/0 transition-all duration-500 group-hover:text-[#0c0b0b]/80 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>

                {/* Bottom Content */}
                <div className="relative">
                  {/* Masked Subtitle Animation */}
                  <div className="overflow-hidden mb-3">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary translate-y-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      {item.desc}
                    </p>
                  </div>

                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-[#0c0b0b] font-medium leading-tight">
                    {item.title}
                  </h3>

                  {/* Bottom Line Indicator */}
                  <div className="h-[1px] w-0 bg-primary mt-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}