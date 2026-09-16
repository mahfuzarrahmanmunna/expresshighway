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
  MessageSquare,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   1. GLOBAL CURSOR & GRAIN (Light Theme Adapted)
═══════════════════════════════════════════════════════════════ */
function CustomCursorAndGrain() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        const cursorText = interactive.getAttribute("data-cursor");
        gsap.to(ring, {
          scale: 3.5,
          borderColor: "rgba(0, 125, 198, 0.6)",
          backgroundColor: "rgba(0, 125, 198, 0.05)",
        });
        if (cursorText && ring.querySelector("span")) {
          (ring.querySelector("span") as HTMLElement).textContent = cursorText;
        }
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(77, 77, 79, 0.3)",
          backgroundColor: "transparent",
        });
        if (ring.querySelector("span")) {
          (ring.querySelector("span") as HTMLElement).textContent = "";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 z-[9999] w-2 h-2 bg-[#4D4D4F] rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={ringRef}
        className="hidden md:flex fixed top-0 left-0 z-[9998] w-10 h-10 border border-[#4D4D4F]/40 rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%] items-center justify-center transition-colors duration-300"
      >
        <span className="text-[7px] uppercase tracking-[0.2em] text-[#4D4D4F] opacity-0"></span>
      </div>
      <div
        className="fixed inset-0 z-[9997] pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. CINEMATIC HERO (White Luxury Parallax)
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    gsap.fromTo(
      bgRef.current,
      { scale: 1.15, opacity: 0, filter: "blur(15px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" }
    );

    const heading = document.querySelector<HTMLElement>(".hero-headline");
    if (heading) {
      new SplitType(heading, {
        types: "lines,words",
        lineClass: "overflow-hidden block",
      });
      gsap.set(".hero-headline .word", { yPercent: 110, opacity: 0 });
      tl.to(
        ".hero-headline .word",
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=1.5"
      );
    }

    tl.from(".hero-sub", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8")
      .from(".hero-cta", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8")
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

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-screen w-full bg-white overflow-hidden flex items-center">
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-[-40px] z-0">
        <Image
          src="https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Highway"
          fill
          priority
          className="object-cover"
        />
        {/* Luxury White Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 text-left">
          <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-[#4D4D4F] text-[clamp(3rem,9vw,8rem)] leading-[0.95] font-medium">
            <div className="block">Get in</div>
            <div className="block text-[#007DC6] italic">Touch.</div>
          </h2>
          <p className="hero-sub mt-10 text-lg md:text-xl font-light text-[#4D4D4F]/70 max-w-xl leading-relaxed">
            For membership enquiries, pricing, corporate events or general questions — we&apos;re here, right on the highway.
          </p>

          <div className="hero-cta mt-12 flex flex-wrap gap-4">
            <a
              href="#enquiry"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#007DC6] text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden hover:bg-[#0096E0] transition-colors duration-500"
              data-cursor="ENQUIRE"
            >
              <span className="relative z-10">Start an Enquiry</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#location"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#4D4D4F]/20 text-[#4D4D4F] text-[11px] uppercase tracking-[0.3em] font-medium hover:border-[#C3161C] hover:text-[#C3161C] transition-colors duration-300"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-5 justify-end items-center pr-12">
          <div className="live-indicator relative flex flex-col items-end gap-2">
            <div className="relative flex items-center gap-3">
              <div className="relative w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-[#007DC6]/60 animate-ping"></span>
                <span className="relative inline-flex w-3 h-3 rounded-full bg-[#007DC6]"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#4D4D4F]/60">Live Location</span>
            </div>
            <span className="text-sm uppercase tracking-[0.2em] text-[#4D4D4F]">Express Highway Inn</span>
            <span className="text-xs text-[#4D4D4F]/50">Your Destination</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. LOCATION & INTERACTIVE MAP
═══════════════════════════════════════════════════════════════ */
function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const text = document.querySelector<HTMLElement>(".loc-head");
    if (text) {
      new SplitType(text, { types: "lines", lineClass: "overflow-hidden block" });
      gsap.from(".loc-head .line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: text, start: "top 80%" },
      });
    }

    const path = ref.current?.querySelector<SVGPathElement>(".map-route-path");
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".map-container", start: "top 75%" },
      });
    }
  }, { scope: ref });

  return (
    <section id="location" ref={ref} className="bg-white text-[#4D4D4F] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mb-20">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-6">
            Right on the Highway
          </span>
          <h2 className="loc-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05]">
            Easy to find.<br />Easy to reach.
          </h2>
          <p className="mt-8 text-base md:text-lg font-light text-[#4D4D4F]/60 max-w-xl leading-relaxed">
            Whether you&apos;re stopping for the night, visiting the Club & Lounge, planning an event or simply need directions, our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col">
            <div className="border border-[#4D4D4F]/10 p-8 mb-8 bg-[#FAFAFA]">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mb-4">Highway Landmark</span>
              <p className="text-xl font-[family-name:var(--font-playfair)] mb-2 text-[#007DC6]">Dhaka - Chittagong Highway</p>
              <p className="text-sm text-[#4D4D4F]/70">Mirsarai, Chittagong, Bangladesh</p>
            </div>
            <div className="border border-[#4D4D4F]/10 p-8 bg-[#FAFAFA]">
              <span className="font-[family-name:var(--font-playfair)] text-6xl md:text-7xl font-medium text-[#007DC6] block leading-none">24/7</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mt-4">Open Every Day</span>
            </div>
          </div>

          <div className="lg:col-span-7 map-container relative w-full aspect-[4/5] md:aspect-square overflow-hidden border border-[#4D4D4F]/10" data-cursor="MAP">
            <iframe
              title="Express Highway Inn Location"
              src="https://maps.google.com/maps?q=Mirsarai%20Chittagong&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full grayscale contrast-[0.9] opacity-90"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
            <div className="pointer-events-none absolute inset-0 bg-[#007DC6]/[0.01] mix-blend-overlay"></div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path className="map-route-path" d="M0,80 L40,80 L60,50 L60,20" fill="none" stroke="#007DC6" strokeWidth="0.5" strokeDasharray="4" />
            </svg>
            <div className="absolute top-[20%] left-[60%] flex flex-col items-center group cursor-pointer" data-cursor="OPEN">
              <div className="relative w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-[#007DC6]/50 animate-ping"></span>
                <span className="relative w-4 h-4 rounded-full bg-[#007DC6] border-2 border-white shadow-lg"></span>
              </div>
              <div className="mt-2 bg-[#4D4D4F] backdrop-blur-md text-white p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-[#FCB813]">Your Destination</span>
                <span className="block text-sm font-[family-name:var(--font-playfair)] mt-1">Express Highway Inn</span>
                <span className="block text-[10px] text-white/60 mt-1">Open 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. CONTACT DETAILS LIST
═══════════════════════════════════════════════════════════════ */
function ContactList() {
  const contacts = [
    { num: "01", label: "Call Us", value: "+880 1710 000000", href: "tel:+8801710000000", Icon: Phone },
    { num: "02", label: "WhatsApp", value: "+880 1710 000000", href: "https://wa.me/8801710000000", Icon: MessageSquare },
    { num: "03", label: "Email", value: "info@expresshighwayinn.com", href: "mailto:info@expresshighwayinn.com", Icon: Mail },
    { num: "04", label: "Visit", value: "Dhaka - Chittagong Hwy", href: "#location", Icon: MapPin },
  ];

  return (
    <section className="bg-[#F7F6F2] text-[#4D4D4F] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-[#4D4D4F]/10">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.num === "02" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between py-12 border-b border-[#4D4D4F]/10 cursor-pointer overflow-hidden"
              data-cursor={c.label.toUpperCase()}
            >
              <span className="absolute inset-0 bg-[#007DC6]/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
              <div className="relative flex items-center gap-8 md:gap-16">
                <span className="text-[10px] tracking-[0.3em] text-[#4D4D4F]/30 group-hover:text-[#007DC6] transition-colors w-8">{c.num}</span>
                <div className="flex items-center gap-6">
                  <c.Icon className="h-6 w-6 text-[#4D4D4F]/40 group-hover:text-[#007DC6] transition-colors" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 mb-2">{c.label}</span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl font-medium text-[#4D4D4F]/80 group-hover:text-[#007DC6] transition-all duration-500 group-hover:translate-x-3">
                      {c.value}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <span className="hidden md:block w-0 h-px bg-[#007DC6] group-hover:w-16 transition-all duration-500"></span>
                <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 text-[#4D4D4F]/30 group-hover:text-[#007DC6] transition-all duration-500 group-hover:translate-x-2 group-hover:rotate-45" />
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
    <section className="bg-white text-[#4D4D4F] py-32 md:py-48 overflow-hidden border-t border-[#4D4D4F]/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-6">Corporate Connection</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05] mb-8">
            The Sampan Group<br /><span className="text-[#007DC6]">Head Office.</span>
          </h2>
          <p className="text-lg font-light text-[#4D4D4F]/60 max-w-md leading-relaxed">
            For corporate enquiries, partnerships and wider Sampan Group matters, connect directly with our head office.
          </p>
        </div>
        <div className="border border-[#4D4D4F]/10 divide-y divide-[#4D4D4F]/10 bg-[#FAFAFA]">
          <div className="p-8 hover:bg-[#007DC6]/[0.02] transition-colors" data-cursor="CALL">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mb-2">Phone</span>
            <a href="tel:+8801710000000" className="text-xl font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors">+880 1710 000000</a>
          </div>
          <div className="p-8 hover:bg-[#007DC5]/[0.02] transition-colors" data-cursor="CALL">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mb-2">WhatsApp</span>
            <a href="https://wa.me/8801710000000" target="_blank" rel="noopener noreferrer" className="text-xl font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors">+880 1710 000000</a>
          </div>
          <div className="p-8 hover:bg-[#007DC6]/[0.02] transition-colors" data-cursor="MAIL">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mb-2">Email</span>
            <a href="mailto:info@sampangroup.com" className="text-xl font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors">info@sampangroup.com</a>
          </div>
          <div className="p-8 hover:bg-[#007DC6]/[0.02] transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/50 block mb-2">Address</span>
            <p className="text-xl font-[family-name:var(--font-playfair)] text-[#4D4D4F]/80">Gulshan, Dhaka, Bangladesh</p>
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
      tl.to(".form-head .line", { yPercent: 0, duration: 1.5, stagger: 0.15, ease: "power4.out" });
    }
    tl.from(".form-anim", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.8");

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
    <section id="enquiry" ref={ref} className="relative bg-white text-[#4D4D4F] py-32 md:py-56 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007DC6]/[0.04] blur-[150px] rounded-full" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="form-anim block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-8">Let&apos;s Talk</span>
          <h2 className="form-head font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] mb-10">
            <div>Start a</div>
            <div className="text-[#007DC6] italic">Conversation.</div>
          </h2>
          <p className="form-anim text-lg font-light text-[#4D4D4F]/60 max-w-md leading-relaxed">Whether you are looking for membership information, planning an event or simply have a question, send us a message.</p>
        </div>
        <form className="form-anim flex flex-col gap-10">
          <div className="relative">
            <input type="text" id="name" required placeholder=" " className="peer w-full bg-transparent border-b border-[#4D4D4F]/20 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors text-[#4D4D4F]" />
            <label htmlFor="name" className="absolute top-2 left-0 text-lg text-[#4D4D4F]/50 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Full Name</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <input type="tel" id="phone" required placeholder=" " className="peer w-full bg-transparent border-b border-[#4D4D4F]/20 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors text-[#4D4D4F]" />
              <label htmlFor="phone" className="absolute top-2 left-0 text-lg text-[#4D4D4F]/50 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Phone</label>
            </div>
            <div className="relative">
              <input type="email" id="email" required placeholder=" " className="peer w-full bg-transparent border-b border-[#4D4D4F]/20 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors text-[#4D4D4F]" />
              <label htmlFor="email" className="absolute top-2 left-0 text-lg text-[#4D4D4F]/50 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Email</label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#4D4D4F]/50">Enquiry Type</span>
            <div className="relative flex gap-4">
              {["General", "Membership", "Inquiries"].map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`relative px-6 py-3 text-[11px] uppercase tracking-[0.2em] border transition-colors duration-300 ${type === t ? "bg-[#007DC6] text-white border-[#007DC6]" : "border-[#4D4D4F]/20 text-[#4D4D4F]/70 hover:border-[#007DC6]"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="relative">
            <textarea id="message" rows={3} required placeholder=" " className="peer w-full bg-transparent border-b border-[#4D4D4F]/20 pb-4 pt-2 text-lg focus:outline-none focus:border-[#007DC6] transition-colors resize-none text-[#4D4D4F]"></textarea>
            <label htmlFor="message" className="absolute top-2 left-0 text-lg text-[#4D4D4F]/50 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6]">Message</label>
          </div>
          <button ref={btnRef} type="submit" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#007DC6] text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden cursor-pointer mt-4 self-start hover:bg-[#0096E0] transition-colors" data-cursor="SEND">
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
    { name: "Facebook", img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop", group: "Express Highway Inn" },
    { name: "Facebook", img: "https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=800&auto=format&fit=crop", group: "Sampan Group" },
    { name: "Instagram", img: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=800&auto=format&fit=crop", group: "Sampan Group" },
    { name: "LinkedIn", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop", group: "Sampan Group" },
    { name: "YouTube", img: "https://images.unsplash.com/photo-1611132944641-7573e0c5b57e?q=80&w=800&auto=format&fit=crop", group: "Sampan Group" },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (imgRef.current && hovered !== null) {
      gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.7, rotate: -5 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [hovered]);

  return (
    <section className="bg-[#F7F6F2] text-[#4D4D4F] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-6 text-center">Stay Connected</span>
        <div className="border-t border-[#4D4D4F]/10 mt-12">
          {socials.map((s, i) => (
            <div key={i} className="group relative border-b border-[#4D4D4F]/10" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <a href="#" className="flex items-center justify-between py-8 md:py-12 cursor-pointer" data-cursor="OPEN">
                <div className="flex items-center gap-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#4D4D4F]/30">{s.group}</span>
                </div>
                <div className="flex items-center gap-6">
                  <h3 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-medium text-[#4D4D4F]/40 group-hover:text-[#007DC6] transition-colors duration-500">{s.name}</h3>
                  <ArrowUpRight className="h-6 w-6 text-[#4D4D4F]/30 group-hover:text-[#007DC6] group-hover:rotate-45 transition-all duration-500" />
                </div>
              </a>
              {hovered === i && (
                <div ref={imgRef} className="hidden md:block absolute top-1/2 right-[30%] -translate-y-1/2 w-[200px] h-[130px] overflow-hidden border border-[#4D4D4F]/10 pointer-events-none z-20 shadow-2xl">
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
   8. FINAL CINEMATIC SECTION (White Background)
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
    tl.from(".final-text", { opacity: 0, y: 50, duration: 1.5, stagger: 0.2, ease: "power4.out" });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative min-h-screen bg-[#F7F6F2] text-[#4D4D4F] overflow-hidden flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007DC6]/[0.05] blur-[150px] rounded-full" />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="final-route-path" d="M0,90 L40,90 L60,50 L60,10" fill="none" stroke="#007DC6" strokeWidth="0.2" strokeDasharray="4" />
      </svg>
      <div className="relative z-10 text-center px-6">
        <h2 className="final-text font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[1.05]">
          <div>Wherever the road</div>
          <div className="text-[#007DC6] italic">takes you,</div>
          <div>we&apos;ll be here.</div>
        </h2>
        <div className="final-text mt-12 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#4D4D4F]/50">Express Highway Inn</span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#007DC6]">Club & Lounge</span>
          <div className="w-16 h-px bg-[#007DC6]/50 mt-4"></div>
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
    <main className="bg-white">
      <CustomCursorAndGrain />
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