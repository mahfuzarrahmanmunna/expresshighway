"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, MapPin } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Map Configuration ── */
/* 
  Coordinates for Express Highway Inn (Daudkandi) extracted from your link.
  Used for the "Get Directions" button.
*/
const MAP_LAT = 23.696839590829157;
const MAP_LNG = 90.53096697602183;

export default function AboutLocation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;

      /* ── Split Type Heading ── */
      const heading = document.querySelector<HTMLElement>(".about-split-heading");
      if (heading) {
        splitInstance = SplitType.create(heading, {
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
      gsap.fromTo(
        ".map-wrapper",
        { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          duration: 2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".map-wrapper",
            start: "top 85%",
          },
        }
      );

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#F9F8F6] text-[#0c0b0b] py-32 md:py-48 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[800px] h-[800px] bg-[#007DC6]/[0.03] blur-[180px] rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* ─── Left Column: Brand Statement ─── */}
          <div className="about-content lg:col-span-5 flex flex-col">
            <span className="about-anim text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-8 block">
              The Express Experience
            </span>

            <h2
              className="about-split-heading font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-12 tracking-[-0.02em]"
              style={{ perspective: "1000px" }}
            >
              Where Relaxation
              <br />
              <span className="italic text-[#007DC6]">Meets Luxury.</span>
            </h2>

            <div className="about-anim w-16 h-px bg-[#0c0b0b]/20 mb-12" />

            <p className="about-anim text-base md:text-lg font-light text-[#0c0b0b]/60 leading-[1.9] max-w-md mb-12">
              Express Highway Inn is built around one idea: that a journey should never feel like a pause. Every corner of the property is designed for comfort, elegance and genuine care, so travelers arrive relaxed and members feel at home every single time.
            </p>

            {/* Minimal CTA */}
            <div className="about-anim">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_LAT},${MAP_LNG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-[#0c0b0b]/80 hover:text-[#007DC6] transition-colors duration-300"
              >
                Get Directions
                <span className="relative w-12 h-px bg-[#0c0b0b]/30 group-hover:bg-[#007DC6] transition-all duration-500 group-hover:w-20">
                  <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-[#007DC6] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                </span>
              </a>
            </div>
          </div>

          {/* ─── Right Column: Bespoke Map Container ─── */}
          <div className="lg:col-span-7 relative">
            <div className="map-wrapper relative w-full h-[60vh] md:h-[75vh] overflow-hidden border border-[#0c0b0b]/10 bg-[#F9F8F6]">
              
              {/* Google Maps Iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.415843887747!2d90.53096697602183!3d23.696839590829157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b5d09a1b0c3f%3A0x5b0f161298224bab!2sExpress%20Highway%20Inn!5e0!3m2!1sbn!2sbd!4v1789988420452!5m2!1sbn!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 w-full h-full z-[1]"
              />

              {/* Map UI Overlays */}
              <div className="pointer-events-none absolute inset-0 z-[400]">
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-gradient-to-b from-[#F9F8F6] to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007DC6] opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007DC6]"></span>
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#0c0b0b]/60 font-medium">Live Location</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#0c0b0b]/40">EHI - 01</span>
                </div>

                {/* Bottom Floating Address Card */}
                <div className="absolute bottom-8 left-8 right-8 md:right-auto">
                  <div className="bg-white/80 backdrop-blur-xl border border-[#0c0b0b]/10 p-6 md:p-8 shadow-2xl pointer-events-auto w-full md:w-auto">
                    <div className="flex items-start gap-5">
                      <div className="flex items-center justify-center w-10 h-10 border border-[#007DC6]/20 rounded-full text-[#007DC6] mt-1">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 mb-2">Head Office Location</span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-light text-[#0c0b0b] mb-2 leading-tight">Express Highway Inn</h3>
                        <p className="text-sm text-[#0c0b0b]/50 font-light leading-relaxed max-w-xs">
                          Dhaka - Chittagong Highway, Daudkandi, Bangladesh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Architectural Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#0c0b0b]/10 pointer-events-none z-[500]"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#0c0b0b]/10 pointer-events-none z-[500]"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#0c0b0b]/10 pointer-events-none z-[500]"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#0c0b0b]/10 pointer-events-none z-[500]"></div>
            </div>
            
            {/* Offset Background Frame */}
            <div className="hidden md:block absolute -bottom-6 -right-6 w-2/3 h-2/3 border border-[#0c0b0b]/5 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}