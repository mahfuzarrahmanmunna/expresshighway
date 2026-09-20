"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, ArrowRight, Check, ChevronDown } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const MEMBERSHIP_TIERS = [
  {
    name: "Executive",
    price: "BDT 50,000",
    period: "/year",
    desc: "Designed for the frequent traveler seeking comfort and essential privileges.",
    features: [
      "10% discount on F&B",
      "Access to VVIP Lounge",
      "Priority highway assistance",
      "4 Guest passes per year",
    ],
    highlight: false,
  },
  {
    name: "VVIP Elite",
    price: "BDT 150,000",
    period: "/year",
    desc: "Our flagship membership for those who demand the highest echelon of luxury.",
    features: [
      "25% discount on F&B & Spa",
      "Priority booking for Suites",
      "Free EV Charging & Car Wash",
      "Unlimited Guest passes",
      "Access to Sampan Golf Academy",
    ],
    highlight: true,
  },
  {
    name: "Corporate",
    price: "Custom",
    period: "",
    desc: "Tailored packages for businesses looking to reward and host their teams.",
    features: [
      "Bulk booking discounts",
      "Dedicated event spaces",
      "Corporate billing options",
      "Customized employee perks",
    ],
    highlight: false,
  },
];

const FACILITY_HIGHLIGHTS = [
  {
    src: "/images/lounge.jpg",
    title: "The VVIP Lounge",
    desc: "A private sanctuary of quietude.",
    size: "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/10]",
    offset: "",
  },
  {
    src: "/images/spa.jpeg",
    title: "Wellness & Salon",
    desc: "Rejuvenate on the road.",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/5]",
    offset: "lg:mt-24",
  },
  {
    src: "/images/billiards.png",
    title: "Recreation Room",
    desc: "Play, relax, compete.",
    size: "aspect-[4/5] sm:col-span-1 sm:aspect-[4/5] lg:col-span-4 lg:aspect-[4/5]",
    offset: "",
  },
  {
    src: "/images/resturant.png",
    title: "Fine Dining",
    desc: "Curated culinary experiences 24/7.",
    size: "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/10]",
    offset: "lg:mt-16",
  },
];

export default function ClubAndMembershipPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<string>("VVIP Elite");

  /* ── GSAP Scroll Animations ── */
  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const heading = document.querySelector<HTMLElement>(".cm-hero-head");
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.from(".cm-hero-head .word", {
          yPercent: 110,
          opacity: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        });
      }

      /* Slow Cinematic Background Zoom */
      gsap.to(".cm-hero-bg", {
        scale: 1.1,
        duration: 8,
        ease: "power1.out",
      });

      gsap.from(".cm-hero-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.8,
      });

      /* Tiers Stagger Reveal */
      gsap.from(".tier-card", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".tiers-grid",
          start: "top 85%",
        },
      });

      /* Facilities Cinematic Reveal */
      const items = gsap.utils.toArray<HTMLElement>(".facility-card");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
            },
          }
        );

        const img = item.querySelector(".facility-img");
        if (img) {
          gsap.to(img, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="relative w-full bg-[#F7F6F2] text-[#0c0b0b] overflow-x-hidden font-[family-name:var(--font-sans)]">
      
      {/* ── Ambient Grain Texture ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* ════════════════════════════════════════ */}
      {/* ─── CINEMATIC IMAGE HERO BANNER ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#080808]">
        
        {/* Luxury Dark Background Image */}
        <div className="cm-hero-bg absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/lounge.jpg"
            alt="Express Highway Inn Club & Lounge"
            fill
            priority
            className="object-cover opacity-40"
          />
          {/* Dark Cinematic Gradients for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70"></div>
          {/* Gold Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.08] blur-[150px] rounded-full"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          
          <div className="cm-hero-anim flex items-center justify-center gap-3 mb-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium">
              Express Highway Inn
            </span>
          </div>

          <h1 className="cm-hero-head font-[family-name:var(--font-playfair)] text-[clamp(3.5rem,10vw,9rem)] font-light leading-[1.05] tracking-[-0.03em] text-white mb-12">
            Club & <span className="italic text-primary">Lounge.</span>
          </h1>

          <p className="cm-hero-anim max-w-2xl mx-auto text-base md:text-lg font-light text-white/60 leading-[1.8]">
            An exclusive sanctuary on the Dhaka-Chittagong highway. Elevate your journey with unparalleled luxury, curated experiences, and a private retreat designed for the modern traveller.
          </p>

          <div className="cm-hero-anim mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Members Only Access</span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-primary"></span>
            <span>Premium Hospitality</span>
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div className="cm-hero-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">Scroll to Explore</span>
          <div className="relative w-px h-12 bg-white/20 overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-primary animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
          <ChevronDown className="h-3 w-3 text-white/30" />
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── INTRODUCTION & VALUE PROPOSITION ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
          {/* Left Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              The Membership
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-[#0c0b0b] mb-8 tracking-[-0.02em]">
              Beyond a <br/>
              <span className="italic text-primary/80">Stop.</span>
            </h2>
            <div className="w-12 h-px bg-primary mb-10"></div>
            <p className="text-base md:text-lg font-light text-[#0c0b0b]/60 leading-[1.9] max-w-md">
              The Express Highway Inn Club & Lounge is a private ecosystem built for those who demand more from the road. From 24/7 fine dining to a serene wellness center, we ensure your journey is as refined as your destination.
            </p>
          </div>

          {/* Right Architectural Points */}
          <div className="lg:col-span-7 flex flex-col gap-px bg-[#0c0b0b]/10 border border-[#0c0b0b]/10">
            {[
              { num: "01", title: "Seamless Travel", desc: "Skip the wait. Members enjoy priority check-in, dedicated highway assistance, and immediate access to our VVIP lounge facilities." },
              { num: "02", title: "Curated Luxury", desc: "From infinity pools to architectural suites, every inch of our property is designed to offer a retreat from the highway's hustle." },
              { num: "03", title: "Exclusive Ecosystem", desc: "Extend your privileges across the Sampan Group network, including discounts at Sampan Highway Inn and Sampan Agro & Golf Resort." },
            ].map((item) => (
              <div key={item.num} className="group relative bg-[#F7F6F2] p-8 md:p-10 flex flex-col md:flex-row gap-8 transition-colors duration-500 hover:bg-white">
                <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#0c0b0b]/20 transition-colors duration-500 group-hover:text-primary">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-light text-[#0c0b0b] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-light text-[#0c0b0b]/50 leading-[1.8]">
                    {item.desc}
                  </p>
                </div>
                <ArrowUpRight className="absolute top-8 right-8 h-5 w-5 text-[#0c0b0b]/20 transition-all duration-500 group-hover:text-primary group-hover:rotate-45" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── MEMBERSHIP TIERS ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full bg-[#080808] text-white py-24 md:py-32 overflow-hidden z-10">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.06] blur-[150px] rounded-full"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-20 md:mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              Choose Your Tier
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-[-0.02em] max-w-4xl">
              Membership <span className="italic text-primary/80">Tiers.</span>
            </h2>
            <p className="mt-8 text-sm md:text-base font-light text-white/60 leading-relaxed max-w-2xl">
              Select a tier that aligns with your journey. All memberships are fully transferable to immediate family members.
            </p>
          </div>

          {/* Tiers Grid */}
          <div className="tiers-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div
                key={tier.name}
                onMouseEnter={() => setActiveTier(tier.name)}
                className={`tier-card group relative flex flex-col p-8 md:p-10 border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  tier.highlight 
                    ? "bg-primary/[0.05] border-primary/40 scale-100 md:scale-105 shadow-2xl" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/30"
                }`}
              >
                {/* Architectural Corners */}
                {tier.highlight && (
                  <>
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-primary/60"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-primary/60"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-primary/60"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-primary/60"></div>
                  </>
                )}

                <div className="mb-8">
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-light text-white mb-2">
                    {tier.name}
                  </h3>
                  {tier.highlight && (
                    <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-medium">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex items-end gap-2 mb-10">
                  <span className={`font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-light ${tier.highlight ? "text-primary" : "text-white"}`}>
                    {tier.price}
                  </span>
                  {tier.period && <span className="text-sm text-white/40 mb-2">{tier.period}</span>}
                </div>

                <p className="text-sm font-light text-white/50 leading-relaxed mb-8 pb-8 border-b border-white/10">
                  {tier.desc}
                </p>

                <ul className="flex flex-col gap-4 mb-10 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/70 font-light">
                      <Check className={`h-4 w-4 mt-1 shrink-0 ${tier.highlight ? "text-primary" : "text-white/40"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a 
                  href="#contact" 
                  className={`group/link inline-flex items-center justify-center gap-3 py-5 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${
                    tier.highlight 
                      ? "bg-primary text-[#0c0b0b] hover:bg-white" 
                      : "bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── EXCLUSIVE FACILITIES GRID ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 md:py-32 z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 md:mb-24">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
              Member Experiences
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.85] tracking-tight text-[#0c0b0b]">
              Curated <br/>
              <span className="italic text-primary/80">Spaces.</span>
            </h2>
          </div>
          <div className="max-w-xs lg:text-right lg:pb-4">
            <div className="hidden lg:block w-16 h-px bg-primary/40 mb-6 ml-auto"></div>
            <p className="text-sm md:text-base font-light text-[#0c0b0b]/50 leading-[1.8]">
              Every corner is crafted to ensure your stop is not just a pause, but a premium destination.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-24">
          {FACILITY_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className={`facility-card group relative ${item.size} ${item.offset} overflow-hidden cursor-pointer border border-[#0c0b0b]/10 hover:border-[#0c0b0b]/30 transition-colors duration-700`}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="facility-img object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  quality={90}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[1] pointer-events-none" />

              <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-between z-10">
                <div className="flex justify-end">
                  <ArrowUpRight className="h-5 w-5 text-white/60 transition-all duration-500 group-hover:text-primary group-hover:rotate-45" />
                </div>
                <div>
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/80 mb-3 font-medium drop-shadow-md">
                    {item.desc}
                  </p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">
                    {item.title}
                  </h3>
                  <div className="h-[1px] w-12 bg-primary/80 mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── FINAL CTA ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full bg-[#080808] text-white py-24 md:py-32 overflow-hidden z-10">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/[0.08] blur-[150px] rounded-full"></div>
        
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-8 block">
            Join the Express Highway Inn
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] mb-12 tracking-tight">
            Ready to Elevate <br/>
            <span className="italic text-primary/80">Your Journey?</span>
          </h2>
          <p className="max-w-xl mx-auto text-base md:text-lg font-light text-white/60 leading-[1.8] mb-12">
            Apply for membership today and unlock a world of highway luxury. Our concierge team is ready to assist you 24/7.
          </p>
          <a 
            href="/contactus" 
            className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-primary text-[#0c0b0b] text-[10px] uppercase tracking-[0.35em] font-medium overflow-hidden cursor-pointer hover:bg-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="relative z-10">Apply for Membership</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </main>
  );
}