"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const affiliations = [
  { num: "01", name: "Real Estate & Housing Association of Bangladesh", logo: "/images/affiliation/rehab.png" },
  { num: "02", name: "Federation of Bangladesh Chambers of Commerce & Industry (FBCCI)", logo: "/images/affiliation/fbcci.png" },
  { num: "03", name: "Bangladesh Reconditioned Vehicles Importers & Dealers Assoc. (BARVIDA)", logo: "/images/affiliation/barvia.png" },
  { num: "04", name: "Bangladesh Arm's Dealer and Importer Association", logo: "/images/affiliation/bad.png" },
  { num: "05", name: "Bangladesh PABX Association", logo: "/images/affiliation/pabx.png" },
  { num: "06", name: "Bangladesh LPG Autogas Station Owner’s Association", logo: "/images/affiliation/lpg.png" },
  { num: "07", name: "Bangladesh Volleyball Federation (AD-Hoc Community)", logo: "/images/affiliation/bvf.png" },
  { num: "08", name: "Barisal Bulls", logo: "/images/affiliation/barishalbulls.png" },
  { num: "09", name: "Barisal Club (1864)", logo: "/images/affiliation/lis.png" },
  { num: "10", name: "Bangladesh Premier League (BPL)", logo: "/images/affiliation/bpl.png" },
  { num: "11", name: "Mercedes-Benz", logo: "/images/affiliation/mercedes.png" },
  { num: "12", name: "Chartered Institute of Procurement & Supply UK (CIPS)", logo: "/images/affiliation/cips.png" },
  { num: "13", name: "Directorate General Defence Purchase (DGDP)", logo: "/images/affiliation/dgdp.png" },
  { num: "14", name: "Shooter's Shooting Club", logo: "/images/affiliation/shoot.png" },
  { num: "15", name: "Express Highway Club And Lounge", logo: "/images/affiliation/EHCl.png" },
  { num: "16", name: "Bangladesh Archery Federation", logo: "/images/affiliation/Archery.png" },
  { num: "17", name: "Sampan Golf Academy", logo: "/images/affiliation/Sampan Golf Academy.png" },
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

      /* Grid Items Cinematic Reveal */
      gsap.fromTo(
        ".affil-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".affil-grid",
            start: "top 85%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="affiliations"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] blur-[150px] rounded-full" />

      {/* Subtle Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="affil-header flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-20 md:mb-24">
          <div className="max-w-2xl">
            <span className="affil-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              Governance & Trust
            </span>
            <h2 className="affil-header-anim font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] text-[#0c0b0b] tracking-tight">
              Affiliations &<br />
              <span className="italic text-primary/80">Accreditations.</span>
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="affil-header-anim text-sm md:text-base font-light text-[#0c0b0b]/50 leading-[1.8]">
              Our commitment to excellence is recognized by leading national and international bodies. We partner with the best to ensure unparalleled standards.
            </p>
          </div>
        </div>

        {/* ─── Architectural Seamless Grid (Max 4 Columns) ─── */}
        {/* 
          The gap-px on a dark background creates perfect, hairline-thin 1px borders.
          Max 4 columns on desktop (lg:grid-cols-4).
        */}
        <div className="affil-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#0c0b0b]/10 border border-[#0c0b0b]/10">
          {affiliations.map((item, i) => (
            <div
              key={`${item.num}-${i}`}
              className="affil-card group relative bg-[#F7F6F2] hover:bg-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] aspect-[5/4] overflow-hidden flex flex-col items-center justify-center p-6 md:p-8"
            >
              {/* Ghost Architectural Index */}
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] text-[#0c0b0b]/20 font-light transition-colors duration-500 group-hover:text-primary z-10">
                {item.num}
              </span>

              {/* Logo Wrapper */}
              <div className="relative w-full h-12 md:h-14 flex items-center justify-center mb-4">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain relative z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]  grayscale-0 opacity-100 group-hover:scale-110"
                />
              </div>

              {/* Name & Line - Always Visible */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center">
                <div className="overflow-hidden">
                  <p className="text-[11px] sm:text-[12px] leading-tight font-light tracking-wide text-[#0c0b0b]/60 group-hover:text-[#0c0b0b] transition-colors duration-500 line-clamp-2">
                    {item.name}
                  </p>
                </div>
                {/* Animated Bottom Line Indicator */}
                <div className="h-[1px] w-6 bg-primary/40 mt-3 mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12 group-hover:bg-primary"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}