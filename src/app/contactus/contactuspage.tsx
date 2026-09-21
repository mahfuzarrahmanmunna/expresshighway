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
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   2. CINEMATIC HERO (Dark Editorial Luxury)
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let splitInstance: SplitType | null = null;
    const tl = gsap.timeline({ delay: 0.3 });

    gsap.fromTo(
      bgRef.current,
      { scale: 1.15, opacity: 0, filter: "blur(15px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2.5, ease: "expo.out" }
    );

    const heading = document.querySelector<HTMLElement>(".hero-headline");
    if (heading) {
      splitInstance = new SplitType(heading, {
        types: "lines,words",
        lineClass: "overflow-hidden block",
      });
      gsap.set(".hero-headline .word", { yPercent: 110, opacity: 0 });
      tl.to(
        ".hero-headline .word",
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.8,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=1.5"
      );
    }

    tl.from(".hero-sub", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .from(".hero-cta", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .from(".live-indicator", { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.7)" }, "-=0.5");

    // 2.5D Mouse Parallax
    const bgX = gsap.quickTo(bgRef.current, "x", { duration: 2, ease: "power2.out" });
    const bgY = gsap.quickTo(bgRef.current, "y", { duration: 2, ease: "power2.out" });
    const txtX = gsap.quickTo(contentRef.current, "x", { duration: 1.5, ease: "power2.out" });
    const txtY = gsap.quickTo(contentRef.current, "y", { duration: 1.5, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      bgX(nx * -15);
      bgY(ny * -10);
      txtX(nx * 8);
      txtY(ny * 5);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Scroll Exit
    gsap.to(contentRef.current, {
      yPercent: -20,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      splitInstance?.revert();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-screen w-full bg-[#0c0b0b] overflow-hidden flex items-center">
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-[-40px] z-0">
        <Image
          src="/hero.jpg"
          alt="Luxury Highway"
          fill
          priority
          className="object-cover opacity-50"
        />
        {/* Luxury Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0b0b]/60 via-[#0c0b0b]/40 to-[#0c0b0b]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b0b] via-[#0c0b0b]/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-8 text-left">
          <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em] font-medium">
            <div className="block">Contact</div>
            <div className="block text-[#007DC6] italic font-light">Us.</div>
          </h2>
          <p className="hero-sub mt-12 text-lg md:text-xl font-light text-white/60 max-w-2xl leading-relaxed tracking-[0.01em]">
            We’re always here to connect with you. At Express Highway Inn, we believe in building strong relationships with our guests, investors, and partners. Whether you’re planning to visit, looking for investment opportunities, or simply want to know more about our world-class facilities, our team is ready to assist you 24/7.
          </p>

          <div className="hero-cta mt-14 flex flex-wrap gap-6">
            <a
              href="#enquiry"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0c0b0b] text-[10px] uppercase tracking-[0.35em] font-medium overflow-hidden hover:bg-[#007DC6] hover:text-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              data-cursor="ENQUIRE"
            >
              <span className="relative z-10">Start an Enquiry</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a
              href="#location"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/20 text-white text-[10px] uppercase tracking-[0.35em] font-medium hover:border-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-4 justify-end items-center pr-12">
          <div className="live-indicator relative flex flex-col items-end gap-3 border-r border-white/10 pr-8">
            <div className="relative flex items-center gap-3">
              <div className="relative w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-[#007DC6]/40 animate-ping"></span>
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#007DC6]"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">Available 24/7</span>
            </div>
            <span className="text-sm uppercase tracking-[0.25em] text-white font-medium">Express Highway Inn</span>
            <span className="text-xs text-white/40 font-light">Sampan Group</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. LOCATION & INTERACTIVE MAP (Leaflet + Esri Dark Tiles)
═══════════════════════════════════════════════════════════════ */
function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const text = document.querySelector<HTMLElement>(".loc-head");
    if (text) {
      new SplitType(text, { types: "lines", lineClass: "overflow-hidden block" });
      gsap.from(".loc-head .line", {
        yPercent: 110,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: text, start: "top 80%" },
      });
    }

    gsap.fromTo(
      ".map-container",
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".map-container", start: "top 75%" },
        onComplete: () => {
          if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_map) {
            (mapContainerRef.current as any)._leaflet_map.invalidateSize();
          }
        }
      }
    );
  }, { scope: ref });

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    let map: any = null;

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;
      if ((mapContainerRef.current as any)._leaflet_map) return;

      map = L.map(mapContainerRef.current, {
        center: [23.8132, 90.4254], // Bashundhara, Dhaka coordinates
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false
      });

      (mapContainerRef.current as any)._leaflet_map = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: 'bottomleft' }).addAttribution('Tiles &copy; Esri').addTo(map);

      // Esri Dark Gray Base Map (No API Key Required)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);
      
      // Esri Dark Gray Reference (Labels & Roads)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);

      // Custom Blue Marker
      const blueIcon = L.divIcon({
        className: "custom-blue-marker",
        html: `<div style="position: relative; width: 24px; height: 24px;">
                 <span style="position: absolute; inset: 0; background: #007DC6; border-radius: 50%; opacity: 0.4; animation: mapPing 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
                 <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: #007DC6; border-radius: 50%; border: 2px solid #0c0b0b; box-shadow: 0 0 15px rgba(0, 125, 198, 0.8);"></span>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([23.8132, 90.4254], { icon: blueIcon })
        .addTo(map)
        .bindPopup(
          `<div style="background: #0c0b0b; color: #fff; padding: 8px; border: 1px solid #007DC6; border-radius: 4px;">
             <b style="color: #007DC6; font-family: serif; font-weight: 500; font-size: 14px;">Express Highway Inn</b><br/>
             <span style="font-size: 11px; opacity: 0.8;">Head Office Location</span>
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
    <section id="location" ref={ref} className="bg-[#0c0b0b] text-white py-40 md:py-56 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mb-24">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-8">
            Head Office Location
          </span>
          <h2 className="loc-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-[-0.02em]">
            Easy to find.<br />Easy to reach.
          </h2>
          <p className="mt-10 text-base md:text-lg font-light text-white/50 max-w-xl leading-relaxed">
            Whether you’re planning to visit, looking for investment opportunities, or simply want to know more about our world-class facilities, our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col">
            <div className="border border-white/10 p-10 mb-8 bg-white/[0.02] backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-6">Corporate Landmark</span>
              <p className="text-xl font-[family-name:var(--font-playfair)] mb-2 text-[#007DC6]">Bashundhara, Dhaka</p>
              <p className="text-sm text-white/60 font-light">Sampan 21st Century, House-284, Block-B Road-1/A, Dhaka-1229, Bangladesh.</p>
            </div>
            <div className="border border-white/10 p-10 bg-white/[0.02] backdrop-blur-sm">
              <span className="font-[family-name:var(--font-playfair)] text-7xl md:text-8xl font-extralight text-white block leading-none">24/7</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mt-6">Assistance Available</span>
            </div>
          </div>

          <div className="lg:col-span-7 map-container relative w-full aspect-[4/5] md:aspect-square overflow-hidden border border-white/10" data-cursor="MAP">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-[#111]"></div>
            
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0b0b] via-transparent to-transparent z-[400]"></div>
            
            <div className="absolute top-[20%] left-[60%] flex flex-col items-center group cursor-pointer z-[500]" data-cursor="OPEN">
              <div className="relative w-4 h-4 hidden">
                <span className="absolute inset-0 rounded-full bg-[#007DC6]/50 animate-ping"></span>
                <span className="relative w-4 h-4 rounded-full bg-[#007DC6] border-2 border-[#0c0b0b] shadow-lg"></span>
              </div>
              <div className="mt-4 bg-[#FAFAFA] text-[#0c0b0b] p-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none shadow-2xl">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-[#007DC6]">Head Office</span>
                <span className="block text-sm font-[family-name:var(--font-playfair)] mt-2">Sampan Group</span>
                <span className="block text-[10px] text-[#0c0b0b]/50 mt-1">Bashundhara, Dhaka</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #111 !important;
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
          background: #0c0b0b !important;
          color: #007DC6 !important;
          border: 1px solid rgba(0, 125, 198, 0.3) !important;
          font-weight: 300;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1a !important;
        }
        .leaflet-control-attribution {
          background: rgba(12, 11, 11, 0.8) !important;
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(0, 125, 198, 0.6) !important;
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
   4. CONTACT DETAILS LIST (Minimalist Editorial)
═══════════════════════════════════════════════════════════════ */
function ContactList() {
  const contacts = [
    { num: "01", label: "Call Us", value: "+880 1906-896327", href: "tel:+8801906896327", Icon: Phone },
    { num: "02", label: "Email Us", value: "info@sampangroup.com.bd", href: "mailto:info@sampangroup.com.bd", Icon: Mail },
    { num: "03", label: "Visit Us", value: "Bashundhara, Dhaka", href: "#location", Icon: MapPin },
    { num: "04", label: "Office Hours", value: "10:00 AM - 06:00 PM", href: "#", Icon: Clock },
  ];

  return (
    <section className="bg-[#F7F6F2] text-[#0c0b0b] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-[#0c0b0b]/10">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="group relative flex items-center justify-between py-12 md:py-16 border-b border-[#0c0b0b]/10 cursor-pointer overflow-hidden"
              data-cursor={c.label.toUpperCase()}
            >
              <span className="absolute inset-0 bg-[#007DC6]/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
              <div className="relative flex items-center gap-8 md:gap-16">
                <span className="text-[10px] tracking-[0.3em] text-[#0c0b0b]/30 group-hover:text-[#007DC6] transition-colors duration-500 w-8">{c.num}</span>
                <div className="flex items-center gap-8">
                  <c.Icon className="h-6 w-6 text-[#0c0b0b]/30 group-hover:text-[#007DC6] transition-colors duration-500" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 mb-3">{c.label}</span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl font-light text-[#0c0b0b]/80 group-hover:text-[#0c0b0b] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                      {c.value}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <span className="hidden md:block w-0 h-px bg-[#007DC6] group-hover:w-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 text-[#0c0b0b]/20 group-hover:text-[#007DC6] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:rotate-45" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. SAMPAN GROUP HEAD OFFICE
═══════════════════════════════════════════════════════════════ */
function SampanOffice() {
  return (
    <section className="bg-white text-[#0c0b0b] py-32 md:py-48 overflow-hidden border-t border-[#0c0b0b]/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-8">Corporate Connection</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-light leading-[1.05] mb-10 tracking-[-0.02em]">
            The Sampan Group<br /><span className="text-[#007DC6] italic">Head Office.</span>
          </h2>
          <p className="text-lg font-light text-[#0c0b0b]/50 max-w-md leading-relaxed">
            For corporate enquiries, partnerships and wider Sampan Group matters, connect directly with our head office.
          </p>
        </div>
        <div className="border border-[#0c0b0b]/10 divide-y divide-[#0c0b0b]/10 bg-[#F7F6F2]">
          <div className="p-10 hover:bg-white transition-colors duration-500" data-cursor="CALL">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 block mb-4">Phone</span>
            <a href="tel:+8801906896327" className="text-xl font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors duration-300">+880 1906-896327</a>
          </div>
          <div className="p-10 hover:bg-white transition-colors duration-500" data-cursor="MAIL">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 block mb-4">Email</span>
            <a href="mailto:info@sampangroup.com.bd" className="text-xl font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors duration-300">info@sampangroup.com.bd</a>
          </div>
          <div className="p-10 hover:bg-white transition-colors duration-500">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 block mb-4">Address</span>
            <p className="text-xl font-[family-name:var(--font-playfair)] text-[#0c0b0b]/80">Sampan 21st Century, House-284, Block-B Road-1/A, Bashundhara, Dhaka-1229.</p>
          </div>
          <div className="p-10 hover:bg-white transition-colors duration-500">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 block mb-4">Office Hours</span>
            <p className="text-xl font-[family-name:var(--font-playfair)] text-[#0c0b0b]/80">10:00 AM - 06:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. ENQUIRY FORM (Clean White Editorial)
═══════════════════════════════════════════════════════════════ */
function EnquiryForm() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [type, setType] = useState("General");

  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 60%" } });
    const heading = document.querySelector<HTMLElement>(".form-head");
    if (heading) {
      new SplitType(heading, { types: "lines", lineClass: "overflow-hidden block" });
      gsap.set(".form-head .line", { yPercent: 110 });
      tl.to(".form-head .line", { yPercent: 0, duration: 1.8, stagger: 0.15, ease: "power4.out" });
    }
    tl.from(".form-anim", { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.8");

    const btn = btnRef.current;
    if (btn) {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        xTo(e.clientX - rect.left - rect.width / 2 * 0.4);
        yTo(e.clientY - rect.top - rect.height / 2 * 0.4);
      };
      const onMouseLeave = () => { xTo(0); yTo(0); };
      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);
      return () => { btn.removeEventListener("mousemove", onMouseMove); btn.removeEventListener("mouseleave", onMouseLeave); };
    }
  }, { scope: ref });

  return (
    <section id="enquiry" ref={ref} className="relative bg-[#F7F6F2] text-[#0c0b0b] py-32 md:py-56 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007DC6]/[0.03] blur-[150px] rounded-full" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="form-anim block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-10">Let&apos;s Talk</span>
          <h2 className="form-head font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05] mb-12 tracking-[-0.03em]">
            <div>Start a</div>
            <div className="text-[#007DC6] italic">Conversation.</div>
          </h2>
          <p className="form-anim text-lg font-light text-[#0c0b0b]/50 max-w-md leading-relaxed">Whether you are looking for membership information, planning an event or simply have a question, send us a message.</p>
        </div>
        <form className="form-anim flex flex-col gap-12">
          <div className="relative">
            <input type="text" id="name" required placeholder=" " className="peer w-full bg-transparent border-b border-[#0c0b0b]/15 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors duration-500 text-[#0c0b0b]" />
            <label htmlFor="name" className="absolute top-2 left-0 text-lg text-[#0c0b0b]/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Full Name</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <input type="tel" id="phone" required placeholder=" " className="peer w-full bg-transparent border-b border-[#0c0b0b]/15 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors duration-500 text-[#0c0b0b]" />
              <label htmlFor="phone" className="absolute top-2 left-0 text-lg text-[#0c0b0b]/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Phone</label>
            </div>
            <div className="relative">
              <input type="email" id="email" required placeholder=" " className="peer w-full bg-transparent border-b border-[#0c0b0b]/15 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors duration-500 text-[#0c0b0b]" />
              <label htmlFor="email" className="absolute top-2 left-0 text-lg text-[#0c0b0b]/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Email</label>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#0c0b0b]/40">Enquiry Type</span>
            <div className="relative flex gap-4">
              {["General", "Membership", "Inquiries"].map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`relative px-8 py-4 text-[10px] uppercase tracking-[0.25em] border transition-colors duration-500 ${type === t ? "bg-[#0c0b0b] text-white border-[#0c0b0b]" : "border-[#0c0b0b]/15 text-[#0c0b0b]/60 hover:border-[#0c0b0b]"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="relative">
            <textarea id="message" rows={3} required placeholder=" " className="peer w-full bg-transparent border-b border-[#0c0b0b]/15 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors duration-500 resize-none text-[#0c0b0b]"></textarea>
            <label htmlFor="message" className="absolute top-2 left-0 text-lg text-[#0c0b0b]/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Message</label>
          </div>
          <button ref={btnRef} type="submit" className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-[#0c0b0b] text-white text-[10px] uppercase tracking-[0.35em] font-medium overflow-hidden cursor-pointer mt-4 self-start hover:bg-[#007DC6] transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" data-cursor="SEND">
            <span className="relative z-10">Send Message</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. SOCIAL ROW
═══════════════════════════════════════════════════════════════ */
function SocialRow() {
  const socials = [
    { name: "Facebook", img: "/logo/expresslogo.png", group: "Express Highway Inn" },
    { name: "Facebook", img: "/logo/sampanretail.png", group: "Sampan Group" },
    { name: "Instagram", img: "/logo/sampanretail.png", group: "Sampan Group" },
    { name: "LinkedIn", img: "/logo/sampanretail.png", group: "Sampan Group" },
    { name: "YouTube", img: "/logo/sampanretail.png", group: "Sampan Group" },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (imgRef.current && hovered !== null) {
      gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.7, rotate: -5 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "power3.out" });
    }
  }, [hovered]);

  return (
    <section className="bg-[#0c0b0b] text-[#FAFAFA] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-12 text-center">Stay Connected</span>
        <div className="border-t border-white/10">
          {socials.map((s, i) => (
            <div key={i} className="group relative border-b border-white/10" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <a href="#" className="flex items-center justify-between py-12 md:py-16 cursor-pointer" data-cursor="OPEN">
                <div className="flex items-center gap-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">{s.group}</span>
                </div>
                <div className="flex items-center gap-6">
                  <h3 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-light text-white/40 group-hover:text-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">{s.name}</h3>
                  <ArrowUpRight className="h-6 w-6 text-white/30 group-hover:text-[#007DC6] group-hover:rotate-45 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </div>
              </a>
              {hovered === i && (
                <div ref={imgRef} className="hidden md:block absolute top-1/2 right-[30%] -translate-y-1/2 w-[220px] h-[140px] overflow-hidden border border-white/10 pointer-events-none z-20 shadow-2xl">
                  <Image src={s.img} alt={s.name} fill className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. FINAL CINEMATIC SECTION (Minimalist High Contrast)
═══════════════════════════════════════════════════════════════ */
function FinalCinematic() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const path = ref.current?.querySelector<SVGPathElement>(".final-route-path");
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }

    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 60%" } });
    tl.from(".final-text", { opacity: 0, y: 50, duration: 1.8, stagger: 0.2, ease: "power4.out" });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative min-h-screen bg-[#F7F6F2] text-[#0c0b0b] overflow-hidden flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007DC6]/[0.04] blur-[150px] rounded-full" />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="final-route-path" d="M0,90 L40,90 L60,50 L60,10" fill="none" stroke="#007DC6" strokeWidth="0.2" strokeDasharray="4" />
      </svg>
      <div className="relative z-10 text-center px-6">
        <h2 className="final-text font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,8vw,7rem)] font-light leading-[1.05] tracking-[-0.03em]">
          <div>Wherever the road</div>
          <div className="text-[#007DC6] italic">takes you,</div>
          <div>we&apos;ll be here.</div>
        </h2>
        <div className="final-text mt-16 flex flex-col items-center gap-5">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#0c0b0b]/40">Express Highway Inn</span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#007DC6]">Club & Lounge</span>
          <div className="w-16 h-px bg-[#007DC6]/40 mt-4"></div>
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
    <main className="bg-[#F7F6F2]">
      <Hero />
      <LocationSection />
      <ContactList />
      <SampanOffice />
      <EnquiryForm />
      <SocialRow />
      <FinalCinematic />
    </main>
  );
}