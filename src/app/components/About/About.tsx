"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, MapPin, Navigation } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutLocation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
            onComplete: () => {
              if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_map) {
                (mapContainerRef.current as any)._leaflet_map.invalidateSize();
              }
            }
          },
        }
      );

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  /* ── Leaflet Map Initialization ── */
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    let map: any = null;

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;
      if ((mapContainerRef.current as any)._leaflet_map) return;

      const targetLat = 23.5433;
      const targetLng = 90.4012;

      map = L.map(mapContainerRef.current, {
        center: [targetLat, targetLng],
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      (mapContainerRef.current as any)._leaflet_map = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: 'bottomleft' }).addAttribution('Tiles &copy; Esri').addTo(map);

      // Esri Light Gray Canvas (Luxury Minimalist Map)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);
      
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);

      // Custom Brand Marker
      const customIcon = L.divIcon({
        className: "custom-luxury-marker",
        html: `<div style="position: relative; width: 24px; height: 24px;">
                 <span style="position: absolute; inset: 0; background: #007DC6; border-radius: 50%; opacity: 0.3; animation: mapPing 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
                 <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #007DC6; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 15px rgba(0, 125, 198, 0.6);"></span>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([targetLat, targetLng], { icon: customIcon }).addTo(map);
      
      setTimeout(() => map.invalidateSize(), 1000);
    };

    if ((window as any).L) {
      initializeMap();
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    }

    return () => {
      if (map) {
        map.remove();
        if (mapContainerRef.current) {
          delete (mapContainerRef.current as any)._leaflet_map;
        }
      }
    };
  }, []);

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

            {/* Architectural Coordinates */}
            <div className="about-anim grid grid-cols-2 gap-8 mb-12 max-w-xs">
              <div className="border-l border-[#0c0b0b]/10 pl-4">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#0c0b0b]/40 mb-2">Latitude</span>
                <span className="text-sm font-light text-[#0c0b0b]/80 font-[family-name:var(--font-playfair)]">23.5433° N</span>
              </div>
              <div className="border-l border-[#0c0b0b]/10 pl-4">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#0c0b0b]/40 mb-2">Longitude</span>
                <span className="text-sm font-light text-[#0c0b0b]/80 font-[family-name:var(--font-playfair)]">90.4012° E</span>
              </div>
            </div>

            {/* Minimal CTA */}
            <div className="about-anim">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=23.5433,90.4012"
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
              
              {/* Leaflet Map Container */}
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

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

      {/* ── Leaflet Custom Styling Overrides ── */}
      <style jsx global>{`
        .leaflet-container {
          background: #F9F8F6 !important;
          font-family: var(--font-sans) !important;
          outline: none;
          z-index: 1;
        }
        .leaflet-control-zoom a {
          background: #FFFFFF !important;
          color: #0c0b0b !important;
          border: 1px solid rgba(12, 11, 11, 0.1) !important;
          font-weight: 300;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .leaflet-control-zoom a:hover {
          background: #0c0b0b !important;
          color: #FFFFFF !important;
        }
        .leaflet-control-attribution {
          background: rgba(249, 248, 246, 0.8) !important;
          color: rgba(12, 11, 11, 0.4) !important;
          font-size: 8px !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(0, 125, 198, 0.8) !important;
        }
        @keyframes mapPing {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}