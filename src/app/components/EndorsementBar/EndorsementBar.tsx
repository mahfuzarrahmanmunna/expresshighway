"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SISTER_CONCERNS = [
  { name: "Express Highway Inn", link: "#", logo: "/logo/expresshighwayinn.png" },
  { name: "LSHS", link: "https://cips.lshs.co.uk/", logo: "/logo/lshs.png" },
  { name: "Sampan Group", link: "https://sampangroup.com", logo: "/logo/sampanretail.png" },
];

export default function EndorsementBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".endorsement-anim", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#080808] py-24 md:py-32 border-y border-white/[0.05] overflow-hidden"
    >
      {/* Ambient Center Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/[0.05] blur-[150px] rounded-full" />

      {/* Grain Texture for Premium Feel */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* ─── Brand Statement ─── */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="endorsement-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-8 block">
            The Sampan Group Legacy
          </span>
          <p className="endorsement-anim font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-light text-foreground/80 leading-[1.4] max-w-4xl">
            Built on a foundation of trust, delivering excellence in hospitality, education, and real estate across Bangladesh.
          </p>
        </div>

        {/* ─── Architectural Logo Grid ─── */}
        <div className="endorsement-anim border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] backdrop-blur-sm bg-white/[0.01]">
          {SISTER_CONCERNS.map((concern) => (
            <a
              key={concern.name}
              href={concern.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center p-12 md:p-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.02]"
              data-cursor="OPEN"
            >
              {/* Hover Accent Line (Top) */}
              <span className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"></span>
              
              <Image
                src={concern.logo}
                alt={concern.name}
                width={260}
                height={90}
                className="h-20 md:h-24 w-auto object-contain opacity-50  transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              
              {/* Subtle text reveal on hover */}
              <span className="mt-8 text-[10px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-primary transition-colors duration-500">
                Visit Website
              </span>
            </a>
          ))}
        </div>

        {/* ─── Learn More CTA ─── */}
        <div className="endorsement-anim flex justify-center mt-20">
          <a 
            href="https://sampangroup.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-foreground/60 hover:text-primary transition-colors duration-300"
          >
            Explore the whole ecosystem
            <span className="relative w-16 h-px bg-foreground/20 group-hover:bg-primary transition-all duration-500 group-hover:w-24">
              <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}