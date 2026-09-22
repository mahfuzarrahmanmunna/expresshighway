"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

// Ensure these are registered. If you have a layout file that does this globally, you can remove these two lines.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function OurStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      let splitInstance: SplitType | null = null;

      /* ── Pin Background Image ── */
      // This pins the background image to the top of the viewport while the 
      // text content scrolls over it, creating the exact effect you requested.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        animation: gsap.to(q(".story-bg-image"), { yPercent: 15, ease: "none" }),
        pin: q(".story-bg-wrapper")[0],
        pinSpacing: false,
      });

      /* ── Heading Word Reveal ── */
      const heading = q(".story-heading")[0];
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.fromTo(q(".story-heading .word"),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
          }
        );
      }

      /* ── Content Stagger Reveal ── */
      gsap.fromTo(q(".story-anim"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        }
      );

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-[#080808] text-white overflow-hidden">
      
      {/* ─── Pinned Background Image Layer ─── */}
      <div className="story-bg-wrapper absolute top-0 left-0 w-full h-screen z-0 overflow-hidden">
        <div className="story-bg-image relative w-full h-full will-change-transform">
          <Image
            src="/banner/banner1.jpg" // Replace with your preferred architectural or highway image
            alt="Express Highway Inn Architecture"
            fill
            priority
            className="object-cover"
            quality={90}
          />
        </div>
        
        {/* Cinematic Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/95 via-[#080808]/80 to-[#080808]/95 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[#080808]/40 backdrop-bl-[2px] pointer-events-none"></div>
      </div>

      {/* ─── Scrolling Content Layer ─── */}
      {/* min-h-screen ensures the section is tall enough to allow the background to pin and scroll over */}
      <div className="relative z-10 min-h-screen flex items-center py-32 md:py-48">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          
          <span className="story-anim block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8">
            01 - Our Story
          </span>
          
          <h2 
            className="story-heading font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,6rem)] font-light leading-[1.05] tracking-[-0.02em] text-white mb-12"
            style={{ perspective: "1000px" }}
          >
            Our Story
          </h2>

          <div className="story-anim w-16 h-px bg-[#C5A572] mx-auto mb-12"></div>

          <p className="story-anim text-base md:text-lg font-light text-white/70 leading-[1.9] mb-8 max-w-2xl mx-auto">
            Express Highway Inn began with a simple observation: Bangladesh&apos;s highways move faster every year, but the places to rest along them hadn&apos;t kept pace. Sampan Group set out to change that by building a property where a quick stop feels like a proper retreat, and where a membership card opens the door to something far more exclusive.
          </p>
          
          <p className="story-anim text-base md:text-lg font-light text-white/70 leading-[1.9] max-w-2xl mx-auto">
            Today, Sampan Highway Inn stands as one of Sampan Group&apos;s flagship hospitality ventures, anchoring a growing highway township of hotels, residences and retail.
          </p>

        </div>
      </div>

      {/* ─── Architectural Corner Accents ─── */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/20 z-20 hidden md:block pointer-events-none"></div>
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/20 z-20 hidden md:block pointer-events-none"></div>
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/20 z-20 hidden md:block pointer-events-none"></div>
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/20 z-20 hidden md:block pointer-events-none"></div>

    </section>
  );
}