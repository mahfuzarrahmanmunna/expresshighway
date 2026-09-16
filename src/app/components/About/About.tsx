"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, MapPin } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutLocation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* ── Split Type Heading ── */
      const heading = document.querySelector<HTMLElement>(".about-split-heading");
      if (heading) {
        SplitType.create(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.from(".about-split-heading .line > div", {
          yPercent: 120,
          rotateX: 20,
          opacity: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
          },
        });
      }

      /* ── Content Stagger Reveal ── */
      gsap.from(".about-anim", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 80%",
        },
      });

      /* ── Map Reveal & Scale ── */
      gsap.from(".map-wrapper", {
        opacity: 0,
        scale: 1.1,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".map-wrapper",
          start: "top 85%",
        },
      });

      /* ── Subtle Map Parallax ── */
      gsap.to(".map-iframe", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.04] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ─── Brand Statement (Left) ─── */}
          <div className="about-content flex flex-col">
            <span className="about-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              The Express Experience
            </span>

            <h2
              className="about-split-heading font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-[#0c0b0b] mb-10"
              style={{ perspective: "1000px" }}
            >
              Where Relaxation
              <br />
              Meets Luxury
            </h2>

            <div className="about-anim w-16 h-px bg-primary/40 mb-10" />

            <p className="about-anim text-sm md:text-base font-light text-[#0c0b0b]/60 leading-relaxed max-w-xl mb-12">
              Express Highway Inn is built around one idea: that a journey
              should never feel like a pause. Every corner of the property, from
              the restaurant to the VVIP Lounge, is designed for comfort,
              elegance and genuine care, so travelers arrive relaxed and members
              feel at home every single time.
            </p>

            {/* Minimal CTA */}
            <div className="about-anim">
              <a
                href="#about-detail"
                className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-[#0c0b0b]/80 hover:text-primary transition-colors duration-300"
              >
                Learn About Us
                <span className="relative w-12 h-px bg-[#0c0b0b]/30 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
                  <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                </span>
              </a>
            </div>
          </div>

          {/* ─── Google Map (Right) ─── */}
          <div className="about-anim relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
            {/* Architectural offset border */}
            <div className="absolute -inset-4 border border-[#0c0b0b]/10 pointer-events-none" />

            {/* Map Wrapper */}
            <div className="map-wrapper relative w-full h-full overflow-hidden border border-[#0c0b0b]/10">
              {/* CSS Filtered Light Google Map */}
              <iframe
                title="Express Highway Inn Location"
                src="https://maps.google.com/maps?q=Dhaka-Chittagong%20Highway&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="map-iframe absolute inset-[-10%] w-[120%] h-[120%] grayscale contrast-[0.95] opacity-90"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Gradient Overlays for seamless blending (Light Theme) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F7F6F2]/40 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-primary/[0.03] mix-blend-overlay" />

              {/* Glowing Location Pin UI */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="relative flex items-center justify-center">
                  {/* Ping animation */}
                  <span className="absolute h-4 w-4 rounded-full bg-primary/30 animate-ping"></span>
                  {/* Core dot */}
                  <span className="relative h-3 w-3 rounded-full bg-primary border-2 border-white shadow-[0_0_15px_4px_rgba(0,125,197,0.4)]"></span>
                </div>

                {/* Floating Address Card (Light Glassmorphism) */}
                <div className="mt-6 bg-white/70 backdrop-blur-md border border-[#0c0b0b]/10 px-5 py-4 flex items-center gap-3 shadow-xl">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#0c0b0b]/40">
                      Express Highway Inn
                    </p>
                    <p className="text-sm font-light text-[#0c0b0b]/90">
                      Dhaka - Chittagong Highway
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#0c0b0b]/10 pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#0c0b0b]/10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#0c0b0b]/10 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#0c0b0b]/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}