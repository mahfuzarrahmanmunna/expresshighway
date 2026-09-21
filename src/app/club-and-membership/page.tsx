"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight, ArrowRight, Check, ChevronDown, X } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const MEMBERSHIP_TIERS = [
  {
    name: "Executive",
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
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
    offset: "",
  },
  {
    src: "/images/spa.jpeg",
    title: "Wellness & Salon",
    desc: "Rejuvenate on the road.",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
    offset: "lg:mt-24",
  },
  {
    src: "/images/billiards.png",
    title: "Recreation Room",
    desc: "Play, relax, compete.",
    size: "col-span-1 md:col-span-4 aspect-[4/5]",
    offset: "",
  },
  {
    src: "/images/resturant.png",
    title: "Fine Dining",
    desc: "Curated culinary experiences 24/7.",
    size: "col-span-2 md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
    offset: "lg:mt-16",
  },
];

export default function ClubAndMembershipPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (tierName: string) => {
    setSelectedTier(tierName);
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form slightly after closing for a clean UI
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedTier("");
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.3,
          }
        );
      }

      gsap.fromTo(q(".cm-hero-bg"),
        { scale: 1.05 },
        { scale: 1.15, duration: 8, ease: "power1.out" }
      );

      gsap.fromTo(q(".cm-hero-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.8,
        }
      );

      gsap.fromTo(q(".vp-card"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".vp-grid")[0], start: "top 85%" },
        }
      );

      gsap.fromTo(q(".tier-card"),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".tiers-grid")[0], start: "top 85%" },
        }
      );

      const items = gsap.utils.toArray<HTMLElement>(".facility-card");
      items.forEach((item) => {
        gsap.fromTo(item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 90%" },
          }
        );

        const imgWrap = item.querySelector(".facility-img-wrap");
        if (imgWrap) {
          gsap.to(imgWrap, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
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
        
        <div className="cm-hero-bg absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/lounge.jpg"
            alt="Express Highway Inn Club & Membership"
            fill
            priority
            className="object-cover opacity-40"
          />
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
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold">
              Express Highway Inn
            </span>
          </div>

          <h1 className="cm-hero-head font-[family-name:var(--font-playfair)] text-[clamp(3.5rem,10vw,9rem)] font-light leading-[1.05] tracking-[-0.03em] text-white mb-12">
            Club & <span className="italic text-[#C5A572]">Membership.</span>
          </h1>

          <p className="cm-hero-anim max-w-2xl mx-auto text-base md:text-lg font-light text-white/70 leading-[1.8]">
            An exclusive sanctuary on the Dhaka-Chittagong highway. Elevate your journey with unparalleled luxury, curated experiences, and a private retreat designed for the modern traveller.
          </p>

          <div className="cm-hero-anim mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span>Members Only Access</span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-[#C5A572]"></span>
            <span>Premium Hospitality</span>
          </div>
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
      {/* ─── INTRODUCTION & VALUE PROPOSITION ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6 block">
              The Membership
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-[#0c0b0b] mb-8 tracking-[-0.02em]">
              Beyond a <br/>
              <span className="italic text-[#C5A572]">Stop.</span>
            </h2>
            <div className="w-12 h-px bg-[#C5A572] mb-10"></div>
            <p className="text-base md:text-lg font-light text-[#0c0b0b]/70 leading-[1.9] max-w-md">
              The Express Highway Inn Club & Lounge is a private ecosystem built for those who demand more from the road. From 24/7 fine dining to a serene wellness center, we ensure your journey is as refined as your destination.
            </p>
          </div>

          <div className="lg:col-span-7 vp-grid flex flex-col gap-px bg-[#0c0b0b]/10 border border-[#0c0b0b]/10">
            {[
              { num: "01", title: "Seamless Travel", desc: "Skip the wait. Members enjoy priority check-in, dedicated highway assistance, and immediate access to our VVIP lounge facilities." },
              { num: "02", title: "Curated Luxury", desc: "From infinity pools to architectural suites, every inch of our property is designed to offer a retreat from the highway's hustle." },
              { num: "03", title: "Exclusive Ecosystem", desc: "Extend your privileges across the Sampan Group network, including discounts at Sampan Highway Inn and Sampan Agro & Golf Resort." },
            ].map((item) => (
              <div key={item.num} className="vp-card group relative bg-[#F7F6F2] p-8 md:p-10 flex flex-col md:flex-row gap-8 transition-colors duration-500 hover:bg-white overflow-hidden">
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5A572] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                
                <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#0c0b0b]/20 transition-colors duration-500 group-hover:text-[#C5A572]">
                  {item.num}
                </span>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-light text-[#0c0b0b] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-light text-[#0c0b0b]/60 leading-[1.8]">
                    {item.desc}
                  </p>
                </div>
                <ArrowUpRight className="absolute top-8 right-8 h-5 w-5 text-[#0c0b0b]/20 transition-all duration-500 group-hover:text-[#C5A572] group-hover:rotate-45" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── MEMBERSHIP TIERS ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full bg-[#080808] text-white py-24 md:py-32 overflow-hidden z-10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.06] blur-[150px] rounded-full"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-20 md:mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6 block">
              Choose Your Tier
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-[-0.02em] max-w-4xl">
              Membership <span className="italic text-[#C5A572]">Tiers.</span>
            </h2>
            <p className="mt-8 text-sm md:text-base font-light text-white/60 leading-relaxed max-w-2xl">
              Select a tier that aligns with your journey. All memberships are fully transferable to immediate family members.
            </p>
          </div>

          <div className="tiers-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`tier-card group relative flex flex-col p-8 md:p-10 border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  tier.highlight 
                    ? "bg-[#C5A572]/[0.05] border-[#C5A572]/40 scale-100 md:scale-105 shadow-2xl" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/30"
                }`}
              >
                {tier.highlight && (
                  <>
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#C5A572] z-10"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#C5A572] z-10"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#C5A572] z-10"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#C5A572] z-10"></div>
                  </>
                )}

                <div className="mb-8 text-center">
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-white mb-2">
                    {tier.name}
                  </h3>
                  {tier.highlight && (
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A572] font-bold">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-sm font-light text-white/50 leading-relaxed mb-8 pb-8 border-b border-white/10 text-center">
                  {tier.desc}
                </p>

                <ul className="flex flex-col gap-4 mb-10 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/80 font-light">
                      <Check className={`h-4 w-4 mt-1 shrink-0 ${tier.highlight ? "text-[#C5A572]" : "text-white/40"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => openModal(tier.name)}
                  className={`group/link inline-flex items-center justify-center gap-3 py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
                    tier.highlight 
                      ? "bg-[#C5A572] text-[#0c0b0b] hover:bg-white" 
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/30"
                  }`}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
                </button>
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
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-6 block">
              Member Experiences
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,7vw,6rem)] font-light leading-[0.85] tracking-tight text-[#0c0b0b]">
              Curated <br/>
              <span className="italic text-[#C5A572]">Spaces.</span>
            </h2>
          </div>
          <div className="max-w-xs lg:text-right lg:pb-4">
            <div className="hidden lg:block w-16 h-px bg-[#C5A572]/40 mb-6 ml-auto"></div>
            <p className="text-sm md:text-base font-light text-[#0c0b0b]/60 leading-[1.8]">
              Every corner is crafted to ensure your stop is not just a pause, but a premium destination.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-24">
          {FACILITY_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className={`facility-card group relative ${item.size} ${item.offset} overflow-hidden cursor-pointer border border-[#0c0b0b]/10 hover:border-[#0c0b0b]/30 transition-colors duration-700`}
            >
              <div className="facility-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full z-0 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover h-full w-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.04] group-hover:brightness-110"
                  quality={90}
                />
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
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/80 mb-3 font-medium drop-shadow-md">
                    {item.desc}
                  </p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)]">
                    {item.title}
                  </h3>
                  <div className="h-[1px] w-12 bg-[#C5A572]/80 mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
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
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#C5A572]/[0.08] blur-[150px] rounded-full"></div>
        
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#C5A572]/40 z-20 hidden md:block"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#C5A572]/40 z-20 hidden md:block"></div>

        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-8 block">
            Join the Express Highway Inn
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] mb-12 tracking-tight">
            Ready to Elevate <br/>
            <span className="italic text-[#C5A572]">Your Journey?</span>
          </h2>
          <p className="max-w-xl mx-auto text-base md:text-lg font-light text-white/70 leading-[1.8] mb-12">
            Apply for membership today and unlock a world of highway luxury. Our concierge team is ready to assist you 24/7.
          </p>
          <button 
            onClick={() => openModal("General Inquiry")} 
            className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#C5A572] text-[#0c0b0b] text-[10px] uppercase tracking-[0.35em] font-bold overflow-hidden cursor-pointer hover:bg-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="relative z-10">Apply for Membership</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── LUXURY MEMBERSHIP MODAL ─── */}
      {/* ════════════════════════════════════════ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(8,8,8,0.85)", backdropFilter: "blur(8px)" }}
          onClick={closeModal}
        >
          <div 
            className={`relative w-full max-w-2xl bg-[#F7F6F2] border border-[#0c0b0b]/10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ${
              isModalOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Architectural Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#C5A572] z-10 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#C5A572] z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#C5A572] z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#C5A572] z-10 pointer-events-none"></div>

            {/* Close Button */}
            <button 
              onClick={closeModal} 
              className="absolute top-6 right-6 md:top-8 md:right-8 z-20 p-2 text-[#0c0b0b]/40 hover:text-[#C5A572] transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>

            {!isSubmitted ? (
              <div className="p-8 md:p-12 overflow-y-auto">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-bold mb-4 block">
                  Application Form
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-[#0c0b0b] mb-2 tracking-tight">
                  Apply for Membership
                </h2>
                
                <div className="mb-8 pb-8 border-b border-[#0c0b0b]/10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 block mb-1">Selected Tier</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C5A572]" />
                    <span className="font-[family-name:var(--font-playfair)] text-xl font-light text-[#0c0b0b]">{selectedTier}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/50 font-bold">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[#0c0b0b]/20 py-3 focus:outline-none focus:border-[#C5A572] transition-colors duration-300 text-[#0c0b0b] font-light" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/50 font-bold">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[#0c0b0b]/20 py-3 focus:outline-none focus:border-[#C5A572] transition-colors duration-300 text-[#0c0b0b] font-light" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/50 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-[#0c0b0b]/20 py-3 focus:outline-none focus:border-[#C5A572] transition-colors duration-300 text-[#0c0b0b] font-light" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/50 font-bold">Additional Notes (Optional)</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={3} 
                      value={formData.message} 
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-[#0c0b0b]/20 py-3 focus:outline-none focus:border-[#C5A572] transition-colors duration-300 text-[#0c0b0b] font-light resize-none" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="group/link mt-4 inline-flex items-center justify-center gap-3 py-5 bg-[#C5A572] text-[#0c0b0b] text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 hover:bg-[#0c0b0b] hover:text-[#C5A572]"
                  >
                    Submit Application
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="relative w-20 h-20 flex items-center justify-center mb-8 border border-[#C5A572] rounded-full">
                  <div className="absolute inset-0 border border-[#C5A572]/20 rounded-full animate-ping"></div>
                  <Check className="h-10 w-10 text-[#C5A572]" />
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-[#0c0b0b] mb-4 tracking-tight">
                  Application Received
                </h2>
                <p className="text-sm md:text-base font-light text-[#0c0b0b]/60 leading-[1.8] max-w-md mb-10">
                  Thank you for your interest in the <span className="text-[#C5A572] font-medium">{selectedTier}</span> membership. Our concierge team will contact you shortly to complete the process.
                </p>
                <button 
                  onClick={closeModal}
                  className="group/link inline-flex items-center justify-center gap-3 py-4 px-8 border border-[#0c0b0b]/20 text-[#0c0b0b] text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 hover:bg-[#0c0b0b] hover:text-white"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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