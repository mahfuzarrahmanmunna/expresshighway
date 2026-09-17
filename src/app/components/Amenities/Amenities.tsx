"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data (Extended with layout properties) ── */
const AMENITIES = [
  {
    index: "01",
    title: "Highway Restaurant & Party Center",
    desc: "Open 24/7",
    img: "/images/resturant.png",
    size: "aspect-[4/5] lg:col-span-7 lg:aspect-[16/10]",
    offset: "",
  },
  {
    index: "02",
    title: "VVIP Lounge",
    desc: "Premium comfort, exclusively for members",
    img: "/images/lounge.jpg",
    size: "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:aspect-[4/5]",
    offset: "lg:mt-32",
  },
  {
    index: "03",
    title: "Billiards & Game Zone",
    desc: "Play, relax, compete",
    img: "/images/billiards.png",
    size: "aspect-[4/5] lg:col-span-5 lg:aspect-[4/5]",
    offset: "",
  },
  {
    index: "04",
    title: "Sampan Mart",
    desc: "Your daily needs, on the way",
    img: "/images/sampanmart.jpg",
    size: "aspect-[16/10] lg:col-span-6 lg:col-start-7 lg:aspect-[16/10]",
    offset: "lg:mt-12",
  },
  {
    index: "05",
    title: "EV Car Charging",
    desc: "Fast, convenient",
    img: "/images/evcharging.avif",
    size: "aspect-[4/5] lg:col-span-7 lg:aspect-[16/10]",
    offset: "",
  },
  {
    index: "06",
    title: "Automatic Car Wash",
    desc: "Quick, efficient",
    img: "/images/carwash.webp",
    size: "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:aspect-[4/5]",
    offset: "lg:mt-24",
  },
  {
    index: "07",
    title: "Salon & Spa",
    desc: "Pamper yourself daily",
    img: "/images/spa.avif",
    size: "aspect-[4/5] lg:col-span-5 lg:aspect-[4/5]",
    offset: "",
  },
  {
    index: "08",
    title: "Prayer Room",
    desc: "Peaceful, always open",
    img: "/images/prayerroom.jpg",
    size: "aspect-[16/10] lg:col-span-6 lg:col-start-7 lg:aspect-[16/10]",
    offset: "lg:mt-16",
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

        /* Subtle Image Parallax (Counter-scroll) */
        const img = item.querySelector(".amenity-img");
        if (img) {
          gsap.to(img, {
            yPercent: -12,
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
        <div className="amenities-grid grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-x-8 lg:gap-y-24">
          {AMENITIES.map((item) => (
            <div
              key={item.index}
              className={`amenity-card group relative ${item.size} ${item.offset} overflow-hidden cursor-pointer`}
            >
              {/* Parallax Image Wrapper */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="amenity-img object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  quality={90}
                />
              </div>

              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 group-hover:from-black/90 z-[1]" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-between z-10">
                {/* Top Row: Index & Arrow */}
                <div className="flex justify-between items-start">
                  <span className="font-[family-name:var(--font-playfair)] text-xl text-white/30 transition-colors duration-500 group-hover:text-white/80">
                    {item.index}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-white/0 transition-all duration-500 group-hover:text-white/90 -translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>

                {/* Bottom Content */}
                <div className="relative">
                  {/* Masked Subtitle Animation */}
                  <div className="overflow-hidden mb-3">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/60 translate-y-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      {item.desc}
                    </p>
                  </div>

                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl text-white font-medium leading-tight tracking-tight">
                    {item.title}
                  </h3>

                  {/* Bottom Line Indicator */}
                  <div className="h-[1px] w-0 bg-white/60 mt-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}