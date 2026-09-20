"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Send,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsLinkedin, BsYoutube } from "react-icons/bs";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const COLORS = {
  bgLight: "#F9F8F6",
  bgDark: "#0B0B0B",
  textDark: "#141414",
  accent: "#C5A572", // Brass/Gold
};

/* ═══════════════════════════════════════════════════════════════
   1. CUSTOM CURSOR SYSTEM
═══════════════════════════════════════════════════════════════ */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement;
      const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorType) {
        gsap.to(cursor, {
          scale: 3.5,
          backgroundColor: "rgba(197, 165, 114, 0.1)",
          borderColor: "rgba(197, 165, 114, 0.6)",
          duration: 0.4,
        });
        label.textContent = cursorType;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.4 });
      } else {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(20, 20, 20, 0.3)",
          duration: 0.4,
        });
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.4 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 z-[9999] w-6 h-6 border border-black/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-difference"
    >
      <span
        ref={labelRef}
        className="text-[8px] uppercase tracking-[0.2em] text-white opacity-0 scale-80 transition-transform"
      ></span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO - 3D ROTATE + TEXT MASK SLIDE + SCALE REVEAL
═══════════════════════════════════════════════════════════════ */
function ContactHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const tl = gsap.timeline({ delay: 0.3 });

      gsap.set(".hero-intro-line", { transformOrigin: "bottom center", rotateX: 90, opacity: 0 });
      tl.to(".hero-intro-line", {
        rotateX: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
      })
        .to(".hero-intro-screen", {
          yPercent: -100,
          duration: 1.5,
          ease: "power4.inOut",
          delay: 0.8,
        })
        .from(
          ".hero-bg",
          { scale: 1.6, opacity: 0, filter: "blur(30px)", duration: 3, ease: "expo.out" },
          "-=1.5"
        );

      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        splitInstance = new SplitType(heading, { types: "lines,words", lineClass: "overflow-hidden block" });
        gsap.set(".hero-headline .line > div", { yPercent: 110 });
        tl.to(
          ".hero-headline .line > div",
          { yPercent: 0, duration: 1.8, stagger: 0.25, ease: "expo.out" },
          "-=1.8"
        );
      }

      tl.fromTo(
        ".hero-highlight-mask",
        { x: "-100%" },
        { x: "100%", duration: 1.8, ease: "power2.inOut" },
        "-=1"
      )
        .from(".hero-sub", { opacity: 0, y: 40, duration: 1.5, ease: "power3.out" }, "-=1")
        .from(".hero-meta", { opacity: 0, y: 20, duration: 1.2, ease: "power3.out" }, "-=0.8");

      const bgX = gsap.quickTo(".hero-bg", "x", { duration: 2, ease: "power2.out" });
      const bgY = gsap.quickTo(".hero-bg", "y", { duration: 2, ease: "power2.out" });
      const onMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgX(nx * -20);
        bgY(ny * -15);
      };
      window.addEventListener("mousemove", onMouseMove);

      return () => {
        splitInstance?.revert();
        window.removeEventListener("mousemove", onMouseMove);
      };
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="relative h-screen w-full bg-[#0B0B0B] overflow-hidden flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div className="hero-intro-screen fixed inset-0 z-[100] bg-[#0B0B0B] flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A572] mb-10 font-light">
          Express Highway Inn
        </span>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white/90 font-light tracking-tight">
            CONNECT
          </h1>
        </div>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white/90 font-light tracking-tight">
            WITH
          </h1>
        </div>
        <div className="overflow-hidden py-2">
          <h1 className="hero-intro-line font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-[#C5A572] font-light italic tracking-tight">
            OUR JOURNEY
          </h1>
        </div>
      </div>

      <div className="hero-bg absolute inset-[-60px] z-0 will-change-transform">
        <Image
          src="/banner/banner1.jpg"
          alt="Highway Contact"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/30 to-[#0B0B0B]/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.5rem,8vw,7rem)] leading-[1.05] font-light tracking-tight">
          <div className="block">Get in</div>
          <div className="block relative w-fit mx-auto">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#C5A572] italic font-normal">Touch.</span>
              <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/90 to-transparent"></span>
            </span>
          </div>
        </h2>
        <p className="hero-sub mt-12 text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-[1.8] tracking-wide">
          For membership enquiries, pricing, corporate events or general questions - we&apos;re here, right on the highway.
        </p>
      </div>

      <div className="hero-meta absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10">
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-light">
          Enquiries • Pricing • Events • Highway
        </span>
        <div className="relative w-px h-16 bg-white/20 overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-[#C5A572] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. CONTACT DETAILS & MAP - SPLIT IMAGE + MAP REVEAL
═══════════════════════════════════════════════════════════════ */
function ContactDetails() {
  const ref = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });

      tl.from(".contact-eyebrow", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
        .from(".contact-headline", { opacity: 0, y: 60, duration: 1.2, ease: "expo.out" }, "-=0.4")
        .from(".contact-divider", { width: 0, duration: 1.2, ease: "power3.out" }, "-=0.8");

      tl.from(
        ".detail-card",
        { opacity: 0, y: 40, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.8"
      );

      gsap.fromTo(
        ".map-wrap",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".map-wrap", start: "top 85%" },
          onComplete: () => {
            if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_map) {
              (mapContainerRef.current as any)._leaflet_map.invalidateSize();
            }
          }
        }
      );
    },
    { scope: ref }
  );

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
        attributionControl: false
      });

      (mapContainerRef.current as any)._leaflet_map = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: 'bottomleft' }).addAttribution('Tiles &copy; Esri').addTo(map);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);
      
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);

      const goldIcon = L.divIcon({
        className: "custom-gold-marker",
        html: `<div style="position: relative; width: 24px; height: 24px;">
                 <span style="position: absolute; inset: 0; background: #C5A572; border-radius: 50%; opacity: 0.4; animation: mapPing 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
                 <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: #C5A572; border-radius: 50%; border: 2px solid #0B0B0B; box-shadow: 0 0 15px rgba(197, 165, 114, 0.8);"></span>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([targetLat, targetLng], { icon: goldIcon })
        .addTo(map)
        .bindPopup(
          `<div style="background: #0B0B0B; color: #fff; padding: 8px; border: 1px solid #C5A572; border-radius: 4px;">
             <b style="color: #C5A572; font-family: serif; font-weight: 500; font-size: 14px;">Express Highway Inn</b><br/>
             <span style="font-size: 11px; opacity: 0.8;">Dhaka - Chittagong Highway</span>
           </div>`
        );
        
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
    <section ref={ref} className="bg-[#F9F8F6] text-[#141414] py-40 md:py-56 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="contact-eyebrow text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8 block">
              01 - Contact Details
            </span>
            <h2 className="contact-headline font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-light leading-[1.05] mb-10 tracking-tight">
              Find Us <br/> On the Highway.
            </h2>
            <div className="contact-divider w-16 h-px bg-[#C5A572] mb-12"></div>

            <div className="space-y-16">
              {/* EHI Card */}
              <div className="detail-card border-l border-[#141414]/10 pl-8 group hover:border-[#C5A572] transition-colors duration-500">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#141414]/40 mb-6 font-medium">
                  Express Highway Inn
                </h3>
                <div className="space-y-4 text-base md:text-lg font-light text-[#141414]/80 tracking-wide">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-[#C5A572] mt-1 flex-shrink-0" />
                    <span>Highway Landmark Directions, Dhaka - Chittagong Highway</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <span>+880 1XXX-XXXXXX</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <span>+880 1XXX-XXXXXX (WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <a href="mailto:[email protected]" className="hover:text-[#C5A572] transition-colors">[email protected]</a>
                  </div>
                </div>
              </div>

              {/* Sampan Group Card */}
              <div className="detail-card border-l border-[#141414]/10 pl-8 group hover:border-[#C5A572] transition-colors duration-500">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#141414]/40 mb-6 font-medium">
                  Sampan Group Head Office
                </h3>
                <div className="space-y-4 text-base md:text-lg font-light text-[#141414]/80 tracking-wide">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-[#C5A572] mt-1 flex-shrink-0" />
                    <span>Sampan Group Corporate Office, Dhaka</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <span>+880 1XXX-XXXXXX</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <span>+880 1XXX-XXXXXX (WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-[#C5A572] flex-shrink-0" />
                    <a href="mailto:[email protected]" className="hover:text-[#C5A572] transition-colors">[email protected]</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="w-full lg:w-1/2 sticky top-32">
            <div
              className="map-wrap relative w-full h-[60vh] md:h-[80vh] overflow-hidden border border-[#141414]/10 z-10"
              data-cursor="EXPLORE"
            >
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-[#0B0B0B]" />
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent z-[400]"></div>
              
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md border border-[#141414]/10 px-8 py-5 flex items-center gap-5 shadow-2xl z-[500]">
                <div className="relative w-2.5 h-2.5">
                  <span className="absolute inset-0 rounded-full bg-[#C5A572]/40 animate-ping"></span>
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#C5A572]"></span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.4em] text-[#141414]/40">Highway Routing</span>
                  <span className="block text-sm font-medium text-[#141414] font-[family-name:var(--font-playfair)]">Dhaka - Chittagong Corridor</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #0B0B0B !important;
          font-family: var(--font-sans) !important;
          outline: none;
        }
        .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-zoom a {
          background: #0B0B0B !important;
          color: #C5A572 !important;
          border: 1px solid rgba(197, 165, 114, 0.3) !important;
          font-weight: 300;
        }
        .leaflet-control-zoom a:hover {
          background: #141414 !important;
        }
        .leaflet-control-attribution {
          background: rgba(11, 11, 11, 0.8) !important;
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(197, 165, 114, 0.6) !important;
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

/* ═══════════════════════════════════════════════════════════════
   4. ENQUIRY FORM - MINIMALIST LUXURY INPUTS
═══════════════════════════════════════════════════════════════ */
function EnquiryForm() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const text = document.querySelector<HTMLElement>(".form-head");
      if (text) {
        splitInstance = new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".form-head .line", {
          yPercent: 110,
          duration: 1.5,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      gsap.from(".form-group", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".form-container", start: "top 70%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[#0B0B0B] text-white py-40 md:py-56 overflow-hidden">
      <div className="mx-auto max-w-3xl px-8 lg:px-12 text-center">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8">
          02 - Enquiries
        </span>
        <h2 className="form-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-light leading-[1.05] tracking-tight mb-20">
          Send Us a Message
        </h2>

        <form className="form-container flex flex-col gap-16 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="form-group relative border-b border-white/20 pb-4">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Name</label>
              <input 
                type="text" 
                placeholder="Your Full Name" 
                className="w-full bg-transparent text-white text-lg font-light outline-none placeholder:text-white/30"
              />
            </div>
            <div className="form-group relative border-b border-white/20 pb-4">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Phone</label>
              <input 
                type="text" 
                placeholder="+880 1XXX XXX XXX" 
                className="w-full bg-transparent text-white text-lg font-light outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="form-group relative border-b border-white/20 pb-4">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="[email protected]" 
              className="w-full bg-transparent text-white text-lg font-light outline-none placeholder:text-white/30"
            />
          </div>

          <div className="form-group relative border-b border-white/20 pb-4">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Enquiry Type</label>
            <select className="w-full bg-transparent text-white text-lg font-light outline-none appearance-none cursor-pointer">
              <option value="" disabled selected className="bg-[#0B0B0B]">Select Enquiry Type</option>
              <option value="general" className="bg-[#0B0B0B]">General</option>
              <option value="membership" className="bg-[#0B0B0B]">Membership</option>
              <option value="inquiries" className="bg-[#0B0B0B]">Inquiries</option>
            </select>
          </div>

          <div className="form-group relative border-b border-white/20 pb-4">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Message</label>
            <textarea 
              rows={3} 
              placeholder="Write your message here..." 
              className="w-full bg-transparent text-white text-lg font-light outline-none placeholder:text-white/30 resize-none"
            ></textarea>
          </div>

          <div className="form-group flex justify-center mt-8">
            <button
              type="button"
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#C5A572] text-[#0B0B0B] text-[11px] uppercase tracking-[0.4em] font-medium overflow-hidden cursor-pointer"
              data-cursor="SEND"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-20"></span>
              <span className="relative z-10">Send Message</span>
              <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. SOCIAL ROW - CONNECTED GRID
═══════════════════════════════════════════════════════════════ */
function SocialRow() {
  return (
    <section className="bg-[#F9F8F6] text-[#141414] py-32 md:py-40 overflow-hidden border-t border-[#141414]/10">
      <div className="mx-auto max-w-7xl px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 pb-16 md:pb-0 border-b md:border-b-0 md:border-r border-[#141414]/10">
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-light tracking-tight">Express Highway Inn</h3>
          <a href="#" className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-[#141414]/60 hover:text-[#C5A572] transition-colors" data-cursor="VISIT">
            <span>Facebook</span>
            <span className="relative w-8 h-px bg-[#141414]/40 group-hover:bg-[#C5A572] group-hover:w-12 transition-all duration-500"></span>
            <FaFacebook className="h-4 w-4" />
          </a>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-8">
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-light tracking-tight">Sampan Group</h3>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-8">
            <a href="#" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#141414]/60 hover:text-[#C5A572] transition-colors" data-cursor="VISIT">
              <span>Facebook</span>
              <FaFacebook className="h-4 w-4" />
            </a>
            <a href="#" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#141414]/60 hover:text-[#C5A572] transition-colors" data-cursor="VISIT">
              <span>Instagram</span>
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="#" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#141414]/60 hover:text-[#C5A572] transition-colors" data-cursor="VISIT">
              <span>LinkedIn</span>
              <BsLinkedin className="h-4 w-4" />
            </a>
            <a href="#" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#141414]/60 hover:text-[#C5A572] transition-colors" data-cursor="VISIT">
              <span>YouTube</span>
              <BsYoutube className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  return (
    <main className="bg-[#F9F8F6] font-[family-name:var(--font-sans)]">
      <CustomCursor />
      <ContactHero />
      <ContactDetails />
      <EnquiryForm />
      <SocialRow />
    </main>
  );
}