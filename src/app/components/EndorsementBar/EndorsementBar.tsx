"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SISTER_CONCERNS = [
  { name: "Sampan Group", link: "https://sampangroup.com" },
  { name: "LSHS", link: "#" },
  { name: "Sampan Agro & Golf Resort", link: "#" },
  { name: "Sampan Highway Inn", link: "#" },
];

export default function EndorsementBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".endorsement-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.1,
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
      className="relative w-full bg-[#030303] py-20 md:py-24 border-y border-white/[0.05] overflow-hidden"
    >
      {/* Ambient Center Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/[0.04] blur-[120px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── Brand Statement ─── */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="endorsement-anim text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6 block">
            Our Legacy
          </span>
          <p className="endorsement-anim font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl font-light text-foreground/70 leading-relaxed max-w-3xl">
            Our mother company,{" "}
            <span className="text-primary font-medium not-italic">
              Sampan Group
            </span>{" "}
            is building trusted hospitality, education, real estate and lifestyle brands across Bangladesh.
          </p>
        </div>

        {/* ─── Logo Row / Links ─── */}
        <div className="endorsement-anim flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {SISTER_CONCERNS.map((concern, i) => (
            <div key={concern.name} className="flex items-center gap-8 md:gap-12">
              <a
                href={concern.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-sm md:text-base font-light tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-500"
              >
                {concern.name}
                {/* Subtle underline on hover */}
                <span className="absolute -bottom-2 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"></span>
              </a>

              {/* Architectural Divider */}
              {i < SISTER_CONCERNS.length - 1 && (
                <span className="hidden md:block h-4 w-px bg-white/[0.08]"></span>
              )}
            </div>
          ))}
        </div>

        {/* ─── Learn More CTA ─── */}
        <div className="endorsement-anim flex justify-center mt-16">
          <a 
            href="https://sampangroup.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-foreground/80 hover:text-primary transition-colors duration-300"
          >
            Learn More
            <span className="relative w-12 h-px bg-foreground/40 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
              <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}