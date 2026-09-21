"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUp, ScrollText, FileText, ChevronDown } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Terms & Conditions Content Data ── */
const TERMS_SECTIONS = [
  {
    id: "acceptance-of-terms",
    title: "01. Acceptance of Terms",
    content: [
      "Welcome to Express Highway Inn. These Terms and Conditions (“Terms”) govern your access to and use of our website, facilities, membership programs, and services (collectively, the “Services”).",
      "By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you must not use our Services. Your continued use of the Services constitutes your ongoing acceptance of these Terms.",
    ],
  },
  {
    id: "membership-rules",
    title: "02. Membership & Usage",
    content: [
      "Membership at Express Highway Inn Club & Lounge is a privilege. We reserve the right to grant, deny, or revoke memberships at our sole discretion. Members must adhere to all club rules, dress codes, and conduct guidelines.",
      "Membership cards are non-transferable and may only be used by the registered individual. Any unauthorized use, duplication, or sharing of membership credentials will result in immediate termination without refund.",
    ],
  },
  {
    id: "bookings-reservations",
    title: "03. Bookings & Reservations",
    content: [
      "All bookings for rooms, events, and dining are subject to availability and confirmed only upon receipt of payment or deposit. We reserve the right to modify or cancel reservations due to unforeseen circumstances, in which case a full refund will be issued.",
      "Cancellations must be made at least 48 hours prior to the scheduled time to avoid cancellation fees. No-shows or late cancellations may be subject to a charge equivalent to one night’s stay or the reserved service cost.",
    ],
  },
  {
    id: "code-of-conduct",
    title: "04. Code of Conduct",
    content: [
      "To maintain the luxury ambiance of Express Highway Inn, guests and members are expected to conduct themselves with decorum and respect toward staff, property, and other guests.",
      "Any behavior deemed disruptive, illegal, or harmful to the environment and experience of others will result in immediate removal from the premises without refund. This includes intoxication, harassment, and vandalism.",
    ],
  },
  {
    id: "intellectual-property",
    title: "05. Intellectual Property",
    content: [
      "All content on this website, including but not limited to text, graphics, logos, images, and software, is the exclusive property of Express Highway Inn and Sampan Group. It is protected by international copyright and trademark laws.",
      "You may not reproduce, distribute, modify, or republish any part of the website or our promotional materials without prior written consent from our management team.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "06. Limitation of Liability",
    content: [
      "Express Highway Inn and its affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our Services or your inability to use them.",
      "While we take every precaution to ensure the safety of our guests and their belongings, we are not responsible for the loss or theft of personal property on our premises. Guests are encouraged to utilize the safety deposit boxes provided in rooms and at the front desk.",
    ],
  },
  {
    id: "termination-of-access",
    title: "07. Termination of Access",
    content: [
      "We reserve the right to suspend or terminate your access to our Services and premises at any time, without prior notice, if we believe you have violated these Terms or posed a threat to the safety and enjoyment of others.",
      "Upon termination, all privileges granted to you by Express Highway Inn cease immediately. Any prepaid fees may be forfeited depending on the severity of the violation.",
    ],
  },
  {
    id: "governing-law",
    title: "08. Governing Law & Jurisdiction",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.",
      "If you have any questions or concerns regarding these Terms & Conditions, please contact our legal department.",
      "Express Highway Inn (Sampan Group)\nSampan 21st Century, House-284, Block-B Road-1/A, Bashundhara, Dhaka-1229.\nEmail: legal@sampangroup.com.bd\nPhone: +880 1906-896327",
    ],
  },
];

export default function TermsConditionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("acceptance-of-terms");

  /* ── GSAP Scroll Animations ── */
  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const heading = document.querySelector<HTMLElement>(".tc-hero-head");
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.from(".tc-hero-head .word", {
          yPercent: 110,
          opacity: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        });
      }

      /* Slow Cinematic Background Zoom */
      gsap.to(".tc-hero-bg", {
        scale: 1.1,
        duration: 8,
        ease: "power1.out",
      });

      gsap.from(".tc-hero-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.8,
      });

      /* Content Sections Scroll Reveal */
      gsap.utils.toArray<HTMLElement>(".tc-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".tc-content-anim"), {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  /* ── ScrollSpy Logic ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    TERMS_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full bg-[#F9F8F6] text-[#0c0b0b] overflow-x-hidden font-[family-name:var(--font-sans)]">
      
      {/* ── Ambient Grain Texture ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* ════════════════════════════════════════ */}
      {/* ─── DARK CINEMATIC IMAGE HERO BANNER ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#080808]">
        
        {/* Luxury Dark Background Image */}
        <div className="tc-hero-bg absolute inset-0 z-0 will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920&auto=format&fit=crop"
            alt="Luxury Hotel Lounge"
            fill
            priority
            className="object-cover opacity-40"
          />
          {/* Dark Cinematic Gradients for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70"></div>
          {/* Gold Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.08] blur-[150px] rounded-full"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          
          <div className="tc-hero-anim flex items-center justify-center gap-3 mb-10">
            <ScrollText className="h-5 w-5 text-[#C5A572]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium">
              Legal & Compliance
            </span>
          </div>

          <h1 className="tc-hero-head font-[family-name:var(--font-playfair)] text-[clamp(3rem,9vw,8rem)] font-light leading-[1.05] tracking-[-0.03em] text-white mb-12">
            Terms & <span className="italic text-[#C5A572]">Conditions.</span>
          </h1>

          <p className="tc-hero-anim max-w-2xl mx-auto text-base md:text-lg font-light text-white/60 leading-[1.8]">
            Please read these terms carefully before using our services. They outline the rules and guidelines for your experience at Express Highway Inn.
          </p>

          <div className="tc-hero-anim mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Last Updated: May 15, 2024</span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-[#C5A572]"></span>
            <span>Version 1.0</span>
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div className="tc-hero-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">Scroll to Read</span>
          <div className="relative w-px h-12 bg-white/20 overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-[#C5A572] animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
          <ChevronDown className="h-3 w-3 text-white/30" />
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ─── MAIN LAYOUT: TOC & CONTENT ─── */}
      {/* ════════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">

          {/* ─── Sticky Table of Contents (Left/Top) ─── */}
          <aside className="lg:col-span-4">
            {/* Explicit sticky positioning */}
            <div className="lg:sticky lg:top-10 h-fit border-l border-[#0c0b0b]/10 pl-8">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-4 w-4 text-[#C5A572]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 font-medium">Contents</span>
              </div>
              
              <nav className="flex flex-col gap-5">
                {TERMS_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`group relative text-sm font-light transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeSection === section.id ? "text-[#0c0b0b] translate-x-2" : "text-[#0c0b0b]/30 hover:text-[#0c0b0b]/70"
                    }`}
                  >
                    {section.title}
                    <span className={`absolute left-[-32px] top-1/2 -translate-y-1/2 h-[1px] bg-[#C5A572] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeSection === section.id ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-50"
                    }`}></span>
                  </a>
                ))}
              </nav>

              <div className="mt-12 pt-8 border-t border-[#0c0b0b]/10 hidden lg:block">
                <p className="text-xs text-[#0c0b0b]/30 font-light leading-relaxed mb-4">
                  Have questions about our terms?
                </p>
                <a href="mailto:legal@sampangroup.com.bd" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A572] hover:text-[#0c0b0b] transition-colors">
                  Contact Us
                  <ArrowUp className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </aside>

          {/* ─── Content Body (Right/Bottom) ─── */}
          <div className="lg:col-span-8 flex flex-col gap-24 md:gap-32">
            {TERMS_SECTIONS.map((section) => (
              <article key={section.id} id={section.id} className="tc-section scroll-mt-24">
                <h2 className="tc-content-anim font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-[#0c0b0b] mb-8 tracking-[-0.01em]">
                  {section.title}
                </h2>
                
                {/* Luxury Divider */}
                <div className="tc-content-anim w-12 h-px bg-[#C5A572] mb-10"></div>

                <div className="flex flex-col gap-6">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="tc-content-anim text-base md:text-lg font-light text-[#0c0b0b]/50 leading-[1.9] whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>


      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          background: #F9F8F6;
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </main>
  );
}
