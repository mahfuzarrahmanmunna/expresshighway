"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, ArrowRight, Check, ChevronDown, X, ArrowLeft } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const BENEFITS = [
  "Guaranteed access to the VVIP Lounge and Premium Accommodation Rooms, even during peak travel",
  "Preferred rates at the Highway Restaurant and Sampan Mart",
  "Wellness on the road - Salon & Spa, Gym and Pool included",
  "Priority EV charging, car wash and towing support",
  "A quiet, dedicated Prayer Room and 24/7 CRM Banking Booth",
  "Entertainment - Billiards, Card Room and Juice & Drinks Bar access",
  "A recognized card across Sampan Group's growing highway network",
];

const STEPS = [
  { num: "01", title: "Enquire", desc: "Submit the membership form or call our team." },
  { num: "02", title: "Verify", desc: "Our team confirms your details and preferred tier." },
  { num: "03", title: "Activate", desc: "Receive your membership card and start using the Club & Lounge immediately." },
];

const FACILITY_HIGHLIGHTS = [
  { src: "/images/lounge.jpg", title: "The VVIP Lounge", desc: "A private sanctuary of quietude.", size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]", offset: "" },
  { src: "/images/spa.jpeg", title: "Wellness & Salon", desc: "Rejuvenate on the road.", size: "col-span-1 md:col-span-4 aspect-[4/5]", offset: "lg:mt-24" },
  { src: "/images/Billiards.jpeg", title: "Recreation Room", desc: "Play, relax, compete.", size: "col-span-1 md:col-span-4 aspect-[4/5]", offset: "" },
  { src: "/images/resturant.png", title: "Fine Dining", desc: "Curated culinary experiences 24/7.", size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]", offset: "lg:mt-16" },
];

export default function ClubAndMembershipPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // Fix for Next.js Portal Hydration
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tier: "Executive",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  /* ── GSAP Scroll Animations ── */
  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      let splitInstance: SplitType | null = null;

      const heading = q(".cm-hero-head")[0];
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.fromTo(q(".cm-hero-head .word"),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.1, ease: "power4.out", delay: 0.3 }
        );
      }

      gsap.fromTo(q(".cm-hero-bg"),
        { scale: 1.05 },
        { scale: 1.15, duration: 8, ease: "power1.out" }
      );

      gsap.fromTo(q(".cm-hero-anim"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.8 }
      );

      const revealItems = q(".reveal-item");
      if (revealItems.length) {
        revealItems.forEach((item) => {
          gsap.fromTo(item,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 88%" } }
          );
        });
      }

      const items = gsap.utils.toArray<HTMLElement>(".facility-card");
      items.forEach((item) => {
        gsap.fromTo(item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: item, start: "top 90%" } }
        );

        const imgWrap = item.querySelector(".facility-img-wrap");
        if (imgWrap) {
          gsap.to(imgWrap, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.5 }
          });
        }
      });

      return () => { splitInstance?.revert(); };
    },
    { scope: containerRef }
  );

  /* ── Lightbox Mount & Keyboard Navigation ── */
  useEffect(() => {
    setMounted(true); // Ensure portal only renders on client
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      gsap.fromTo(".lb-overlay", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".lb-image-wrap", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 });
      gsap.fromTo(".lb-text", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.3 });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [activeIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => prev === null ? null : (prev + 1) % FACILITY_HIGHLIGHTS.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => prev === null ? null : (prev - 1 + FACILITY_HIGHLIGHTS.length) % FACILITY_HIGHLIGHTS.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setActiveIndex((prev) => prev === null ? null : (prev + 1) % FACILITY_HIGHLIGHTS.length); };
  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setActiveIndex((prev) => prev === null ? null : (prev - 1 + FACILITY_HIGHLIGHTS.length) % FACILITY_HIGHLIGHTS.length); };

  return (
    <main ref={containerRef} className="relative w-full bg-[#F7F6F2] text-[#0c0b0b] overflow-x-hidden font-[family-name:var(--font-sans)]">
      
      {/* ── Ambient Grain Texture ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* ════════════════════════════════════════ */}
      {/* ─── CINEMATIC IMAGE HERO BANNER ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#080808]">
        
        <div className="cm-hero-bg absolute inset-0 z-0 will-change-transform">
          <Image src="/images/lounge.jpg" alt="Express Highway Inn Club & Membership" fill priority className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.08] blur-[150px] rounded-full"></div>
        </div>

        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#C5A572]/40 z-20 hidden md:block"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          <div className="cm-hero-anim flex items-center justify-center gap-3 mb-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold">Express Highway Inn</span>
          </div>

          <h1 className="cm-hero-head font-[family-name:var(--font-playfair)] text-[clamp(3.5rem,10vw,8rem)] font-light leading-[1.05] tracking-[-0.03em] text-white mb-12">
            Join the Club. <br/>
            <span className="italic text-[#C5A572]">Own the Highway.</span>
          </h1>

          <p className="cm-hero-anim max-w-2xl mx-auto text-base md:text-lg font-light text-white/70 leading-[1.8]">
            Membership to Express Highway Inn Club &amp; Lounge unlocks every facility at Sampan Highway Inn - for you, your family and your business travel, every time you&apos;re on the road.
          </p>
        </div>

        <div className="cm-hero-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50">Scroll to Explore</span>
          <div className="relative w-px h-12 bg-white/20 overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-[#C5A572] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
          <ChevronDown className="h-3 w-3 text-white/40" />
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── WHY JOIN (VALUE STATEMENTS) ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="reveal-item block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6">Why Join</span>
          <h2 className="reveal-item font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05] text-[#0c0b0b] tracking-[-0.02em] max-w-4xl">
            Why Members Choose <br/>
            <span className="italic text-[#C5A572]">Sampan Highway Inn.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0c0b0b]/10 border border-[#0c0b0b]/10">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="reveal-item group relative bg-[#F7F6F2] hover:bg-white transition-colors duration-500 p-8 md:p-10 flex flex-col gap-6 min-h-[220px] overflow-hidden">
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5A572] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 flex items-center justify-center border border-[#0c0b0b]/10 rounded-full transition-colors duration-500 group-hover:border-[#C5A572]/50">
                  <Check className="h-4 w-4 text-[#0c0b0b]/30 group-hover:text-[#C5A572] transition-colors duration-500" />
                </div>
                <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#0c0b0b]/10 transition-colors duration-500 group-hover:text-[#C5A572]/20">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="text-sm md:text-base font-light text-[#0c0b0b]/70 leading-[1.8]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── HOW IT WORKS ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full bg-[#080808] text-white py-24 md:py-32 overflow-hidden z-10">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.06] blur-[150px] rounded-full"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="reveal-item block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6">The Process</span>
            <h2 className="reveal-item font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] max-w-4xl">
              How It <span className="italic text-[#C5A572]">Works.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {STEPS.map((step) => (
              <div key={step.num} className="reveal-item group relative bg-[#080808] hover:bg-[#111111] transition-colors duration-500 p-10 md:p-12 min-h-[300px] flex flex-col justify-between overflow-hidden">
                <span className="absolute top-4 right-4 text-[100px] leading-none font-[family-name:var(--font-playfair)] text-white/[0.03] pointer-events-none transition-colors duration-500 group-hover:text-[#C5A572]/10">{step.num}</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A572] font-bold mb-4 block">Step {step.num}</span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">{step.title}</h3>
                  <div className="w-10 h-px bg-[#C5A572] mb-6 transition-all duration-500 group-hover:w-16"></div>
                </div>
                <p className="text-sm md:text-base font-light text-white/50 leading-[1.8] relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── CTA / ENQUIRY FORM ─── */}
      {/* ════════════════════════════════════════ */}
      <section id="enquiry" className="relative w-full bg-[#F7F6F2] text-[#0c0b0b] py-24 md:py-32 overflow-hidden z-10 border-t border-[#0c0b0b]/10">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="reveal-item block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6">Enquiry Form</span>
            <h2 className="reveal-item font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] max-w-4xl">
              Start Your <span className="italic text-[#C5A572]">Membership.</span>
            </h2>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="reveal-item relative bg-white border border-[#0c0b0b]/10 p-8 md:p-12 lg:p-16 overflow-hidden shadow-xl">
              <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#C5A572]/50 z-10"></div>
              <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#C5A572]/50 z-10"></div>
              <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#C5A572]/50 z-10"></div>
              <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#C5A572]/50 z-10"></div>

              <div className="relative z-10 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input type="text" id="name" name="name" required placeholder=" " className="peer w-full bg-[#F7F6F2] border border-[#0c0b0b]/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#C5A572] focus:bg-white transition-all duration-500 text-[#0c0b0b] font-medium" />
                    <label htmlFor="name" className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#0c0b0b]/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#C5A572] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#C5A572] pointer-events-none">Full Name</label>
                  </div>
                  <div className="relative">
                    <input type="tel" id="phone" name="phone" required placeholder=" " className="peer w-full bg-[#F7F6F2] border border-[#0c0b0b]/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#C5A572] focus:bg-white transition-all duration-500 text-[#0c0b0b] font-medium" />
                    <label htmlFor="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#0c0b0b]/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#C5A572] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#C5A572] pointer-events-none">Phone</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input type="email" id="email" name="email" required placeholder=" " className="peer w-full bg-[#F7F6F2] border border-[#0c0b0b]/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#C5A572] focus:bg-white transition-all duration-500 text-[#0c0b0b] font-medium" />
                    <label htmlFor="email" className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#0c0b0b]/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#C5A572] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#C5A572] pointer-events-none">Email</label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="tier" className="text-[10px] uppercase tracking-[0.2em] text-[#0c0b0b]/60 font-bold">Preferred Tier</label>
                    <select id="tier" name="tier" value={formData.tier} onChange={handleInputChange} className="w-full bg-[#F7F6F2] border border-[#0c0b0b]/15 px-4 py-[14px] text-base focus:outline-none focus:border-[#C5A572] focus:bg-white transition-all duration-500 text-[#0c0b0b] font-medium appearance-none cursor-pointer">
                      <option value="Executive">Executive</option>
                      <option value="VVIP Elite">VVIP Elite</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea id="message" name="message" rows={4} required placeholder=" " className="peer w-full bg-[#F7F6F2] border border-[#0c0b0b]/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#C5A572] focus:bg-white transition-all duration-500 resize-none text-[#0c0b0b] font-medium" />
                  <label htmlFor="message" className="absolute left-4 top-6 text-base text-[#0c0b0b]/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#C5A572] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#C5A572] pointer-events-none">Message</label>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0c0b0b]/40 font-light text-left md:max-w-xs">Note: This is a lead-capture form, not a payment checkout - membership is confirmed via the Sampan team.</p>
                  <button type="submit" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#0c0b0b] text-white text-[10px] uppercase tracking-[0.35em] font-bold overflow-hidden cursor-pointer hover:bg-[#C5A572] hover:text-[#0c0b0b] transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-auto">
                    <span className="relative z-10">Submit Enquiry</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="reveal-item relative bg-white border border-[#0c0b0b]/10 p-12 md:p-20 flex flex-col items-center justify-center text-center min-h-[400px] overflow-hidden shadow-xl">
              <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#C5A572]/50 z-10"></div>
              <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#C5A572]/50 z-10"></div>
              <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#C5A572]/50 z-10"></div>
              <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#C5A572]/50 z-10"></div>

              <div className="relative w-20 h-20 flex items-center justify-center mb-8 border border-[#C5A572] rounded-full">
                <div className="absolute inset-0 border border-[#C5A572]/20 rounded-full animate-ping"></div>
                <Check className="h-10 w-10 text-[#C5A572]" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-[#0c0b0b] mb-4 tracking-tight">Enquiry Received</h2>
              <p className="text-sm md:text-base font-light text-[#0c0b0b]/60 leading-[1.8] max-w-md mb-10">Thank you for your interest in the Express Highway Inn Club &amp; Lounge. Our concierge team will contact you shortly to complete the process.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── EXCLUSIVE FACILITIES GRID ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 md:mb-24">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6 block">Member Experiences</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,7vw,6rem)] font-light leading-[0.85] tracking-tight text-[#0c0b0b]">
              Curated <br/>
              <span className="italic text-[#C5A572]">Spaces.</span>
            </h2>
          </div>
          <div className="max-w-xs lg:text-right lg:pb-4">
            <div className="hidden lg:block w-16 h-px bg-[#C5A572]/40 mb-6 ml-auto"></div>
            <p className="text-sm md:text-base font-light text-[#0c0b0b]/60 leading-[1.8]">Every corner is crafted to ensure your stop is not just a pause, but a premium destination.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-24">
          {FACILITY_HIGHLIGHTS.map((item, i) => (
            <div
              key={item.title}
              className={`facility-card group relative ${item.size} ${item.offset} overflow-hidden cursor-pointer border border-[#0c0b0b]/10 hover:border-[#0c0b0b]/30 transition-colors duration-700`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="facility-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full z-0 overflow-hidden">
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover h-full w-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.04] group-hover:brightness-110" quality={90} />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[1] pointer-events-none" />

              <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-between z-10">
                <div className="flex justify-end">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#C5A572]/50 transition-colors duration-500"></div>
                    <ArrowUpRight className="h-4 w-4 text-white/70 transition-all duration-500 group-hover:text-[#C5A572] group-hover:rotate-45" />
                  </div>
                </div>
                <div className="relative transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/80 mb-3 font-medium drop-shadow-md">{item.desc}</p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">{item.title}</h3>
                  <div className="h-[1px] w-12 bg-[#C5A572]/80 mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── LIGHTBOX IMAGE VIEWER ─── */}
      {/* ════════════════════════════════════════ */}
      {mounted && activeIndex !== null && createPortal(
        <div className="lb-overlay fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-16" onClick={() => setActiveIndex(null)}>
          
          <button onClick={() => setActiveIndex(null)} className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Close">
            <X className="h-5 w-5" />
          </button>

          <button onClick={handlePrev} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Previous">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button onClick={handleNext} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-[10000]" aria-label="Next">
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="lb-image-wrap relative w-full max-w-5xl h-full max-h-[80vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-full">
              <Image src={FACILITY_HIGHLIGHTS[activeIndex].src} alt={FACILITY_HIGHLIGHTS[activeIndex].title} fill className="object-contain" quality={100} />
            </div>
            <div className="lb-text absolute bottom-0 left-0 right-0 text-center pb-4">
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mb-1">{FACILITY_HIGHLIGHTS[activeIndex].title}</h3>
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/60 font-medium">0{activeIndex + 1} / 0{FACILITY_HIGHLIGHTS.length}</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </main>
  );
}