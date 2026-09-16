"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const affiliations = [
  {
    num: "01",
    name: "Real Estate & Housing Association of Bangladesh",
    logo: "/images/affiliation/rehab.png",
  },
  {
    num: "02",
    name: "Federation of Bangladesh Chambers of Commerce & Industry (FBCCI)",
    logo: "/images/affiliation/fbcci.png",
  },
  {
    num: "03",
    name: "Bangladesh Reconditioned Vehicles Importers & Dealers Assoc. (BARVIDA)",
    logo: "/images/affiliation/barvia.png",
  },
  {
    num: "04",
    name: "Bangladesh Arm's Dealer and Importer Association",
    logo: "/images/affiliation/bad.png",
  },
  {
    num: "05",
    name: "Bangladesh PABX Association",
    logo: "/images/affiliation/pabx.png",
  },
  {
    num: "06",
    name: "Bangladesh LPG Autogas Station Owner’s Association",
    logo: "/images/affiliation/lpg.png",
  },
  {
    num: "07",
    name: "Bangladesh Volleyball Federation (AD-Hoc Community)",
    logo: "/images/affiliation/bvf.png",
  },
  {
    num: "08",
    name: "Barisal Bulls",
    logo: "/images/affiliation/barishalbulls.png",
  },
  {
    num: "09",
    name: "Barisal Club (1864)",
    logo: "/images/affiliation/lis.png",
  },
  {
    num: "10",
    name: "Bangladesh Premier League (BPL)",
    logo: "/images/affiliation/bpl.png",
  },
  {
    num: "11",
    name: "Mercedes-Benz",
    logo: "/images/affiliation/mercedes.png",
  },
  {
    num: "12",
    name: "Chartered Institute of Procurement & Supply UK (CIPS)",
    logo: "/images/affiliation/cips.png",
  },
  {
    num: "13",
    name: "Directorate General Defence Purchase (DGDP)",
    logo: "/images/affiliation/dgdp.png",
  },
  {
    num: "14",
    name: "Shooter's Shooting Club",
    logo: "/images/affiliation/shoot.png",
  },
  {
    num: "15",
    name: "Express Highway Club And Lounge",
    logo: "/images/affiliation/EHCl.png",
  },
  {
    num: "16",
    name: "Bangladesh Archery Federation",
    logo: "/images/affiliation/Archery.png",
  },
  {
    num: "17",
    name: "Sampan Golf Academy",
    logo: "/images/affiliation/Sampan Golf Academy.png",
  },
  {
    num: "18",
    name: "Sampan Golf Academy",
    logo: "/images/affiliation/Asset 26@4x.png",
  },
];

export default function Affiliations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Header Animation */
      gsap.from(".affil-header-anim", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".affil-header",
          start: "top 85%",
        },
      });

      /* Grid Items Stagger */
      gsap.from(".affil-card", {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 1,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".affil-grid",
          start: "top 85%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="affiliations"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-20 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow - Responsive sizing */}
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/[0.04] blur-[120px] md:blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="affil-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 sm:mb-16 md:mb-20">
          <div className="max-w-2xl">
            <span className="affil-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-4 sm:mb-6 block">
              Governance & Trust
            </span>
            <h2 className="affil-header-anim font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-[#0c0b0b]">
              Affiliations &<br />
              Accreditations
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="affil-header-anim text-sm md:text-base font-light text-[#0c0b0b]/50 leading-relaxed">
              Our commitment to excellence is recognized by leading national and
              international bodies. We partner with the best to ensure
              unparalleled standards.
            </p>
          </div>
        </div>

        {/* ─── Seamless Hairline Grid ─── */}
        {/* 
          Bulletproof 1px border grid: 
          Container gets Top/Left borders. Cards get Bottom/Right borders. 
          This eliminates subpixel rendering gaps and double borders.
        */}
        <div className="affil-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-[#E5E5E5]">
          {affiliations.map((item, i) => (
            <div
              key={`${item.num}-${i}`}
              className="affil-card group relative bg-white border-r border-b border-[#E5E5E5] aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center transition-colors duration-500 group-hover:bg-[#FAFAFA]"
            >
              {/* Top Index */}
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] sm:text-[10px] tracking-[0.3em] text-[#0c0b0b]/20 font-light transition-colors duration-500 group-hover:text-primary">
                {item.num}
              </span>

              {/* Logo Wrapper */}
              <div className="relative w-full h-10 sm:h-12 md:h-14 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-contain transition-all duration-500 opacity-40"
                />
                {/* Subtle Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,125,197,0.08), transparent 70%)",
                  }}
                />
              </div>

              {/* Masked Name Animation */}
              {/* On mobile: text is visible by default. On desktop (sm+): animates on hover */}
              <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-4 pb-3 sm:pb-4 overflow-hidden">
                <div className="overflow-hidden">
                  <p className="text-center text-[11px] sm:text-[10px] leading-tight font-light tracking-wide text-[#0c0b0b]/80 sm:text-[#0c0b0b]/0 translate-y-0 sm:translate-y-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:translate-y-0 sm:group-hover:text-[#0c0b0b]/80 line-clamp-2">
                    {item.name}
                  </p>
                </div>
                {/* Bottom Line Indicator */}
                <div className="h-[1px] w-6 sm:w-0 bg-primary mt-3 mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}