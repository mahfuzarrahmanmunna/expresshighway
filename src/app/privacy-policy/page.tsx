"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUp, ShieldCheck, FileText, ChevronDown } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Privacy Policy Content Data ── */
const POLICY_SECTIONS = [
  {
    id: "introduction",
    title: "01. Introduction",
    content: [
      "Welcome to Express Highway Inn (“we,” “us,” or “our”). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or stay at our properties.",
      "We comply with all applicable data protection laws and regulations. By accessing or using our services, you consent to the practices described in this policy. If you do not agree with the terms outlined here, please discontinue use of our website and services immediately.",
    ],
  },
  {
    id: "information-collection",
    title: "02. Information We Collect",
    content: [
      "We collect various types of information to provide and improve our services. This includes Personal Identifiable Information (PII) such as your name, email address, phone number, and payment details when you make a booking or purchase a membership.",
      "Additionally, we automatically collect certain non-personal data, such as your IP address, browser type, operating system, and browsing behavior on our site through cookies and similar tracking technologies.",
    ],
  },
  {
    id: "use-of-information",
    title: "03. How We Use Your Information",
    content: [
      "The information we collect is used to process transactions, manage your membership, and provide you with the personalized luxury experience you expect from Express Highway Inn.",
      "We may also use your data to communicate with you regarding updates, promotional offers, and events. Furthermore, aggregated and anonymized data is utilized to analyze trends, improve our website functionality, and enhance the security of our digital infrastructure.",
    ],
  },
  {
    id: "data-sharing",
    title: "04. Sharing of Information",
    content: [
      "We do not sell, trade, or rent your personal information to third parties. However, we may share your data with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you (e.g., payment gateways, IT hosting, and email providers).",
      "These third parties are contractually obligated to keep your information confidential and secure. We may also disclose your information if legally compelled to do so by law enforcement or government regulations.",
    ],
  },
  {
    id: "data-security",
    title: "05. Data Security",
    content: [
      "We implement industry-standard physical, technical, and administrative security measures designed to protect your personal information against unauthorized access, loss, misuse, or alteration.",
      "Despite our robust efforts, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.",
    ],
  },
  {
    id: "your-rights",
    title: "06. Your Privacy Rights",
    content: [
      "Depending on your location, you may have specific rights regarding your personal information. These rights may include the right to access the data we hold about you, request corrections to inaccurate data, or request the deletion of your personal data.",
      "You also have the right to opt-out of receiving marketing communications from us at any time. You can exercise these rights by contacting our privacy team using the details provided below.",
    ],
  },
  {
    id: "policy-changes",
    title: "07. Changes to This Policy",
    content: [
      "We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated revision date.",
      "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our services after any changes signifies your acceptance of the updated policy.",
    ],
  },
  {
    id: "contact-us",
    title: "08. Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please reach out to our Privacy Team.",
      "Express Highway Inn (Sampan Group)\nSampan 21st Century, House-284, Block-B Road-1/A, Bashundhara, Dhaka-1229.\nEmail: privacy@sampangroup.com.bd\nPhone: +880 1906-896327",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("introduction");

  /* ── GSAP Scroll Animations ── */
  useGSAP(
    () => {
      let splitInstance: SplitType | null = null;
      const heading = document.querySelector<HTMLElement>(".pp-hero-head");
      if (heading) {
        splitInstance = new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.from(".pp-hero-head .word", {
          yPercent: 110,
          opacity: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        });
      }

      /* Slow Cinematic Background Zoom */
      gsap.to(".pp-hero-bg", {
        scale: 1.1,
        duration: 8,
        ease: "power1.out",
      });

      gsap.from(".pp-hero-anim", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.8,
      });

      /* Content Sections Scroll Reveal */
      gsap.utils.toArray<HTMLElement>(".pp-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".pp-content-anim"), {
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

    POLICY_SECTIONS.forEach((section) => {
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
        <div className="pp-hero-bg absolute inset-0 z-0 will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
            alt="Luxury Hotel Architecture"
            fill
            priority
            className="object-cover opacity-50"
          />
          {/* Dark Cinematic Gradients for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70"></div>
          {/* Gold Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C5A572]/[0.08] blur-[150px] rounded-full"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          
          <div className="pp-hero-anim flex items-center justify-center gap-3 mb-10">
            <ShieldCheck className="h-5 w-5 text-[#C5A572]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium">
              Legal & Compliance
            </span>
          </div>

          <h1 className="pp-hero-head font-[family-name:var(--font-playfair)] text-[clamp(3.5rem,10vw,9rem)] font-light leading-[1.05] tracking-[-0.03em] text-white mb-12">
            Privacy <span className="italic text-[#C5A572]">Policy.</span>
          </h1>

          <p className="pp-hero-anim max-w-2xl mx-auto text-base md:text-lg font-light text-white/60 leading-[1.8]">
            Your trust is paramount to us. This document outlines exactly how we collect, use, and protect your data at Express Highway Inn.
          </p>

          <div className="pp-hero-anim mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Last Updated: May 15, 2024</span>
            <span className="hidden md:block h-1 w-1 rounded-full bg-[#C5A572]"></span>
            <span>Version 2.1</span>
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div className="pp-hero-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
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
          <aside className="lg:col-span-4 ">
            {/* Added explicit sticky positioning and top offset */}
            <div className="lg:sticky lg:top-10 h-fit border-l border-[#0c0b0b]/10 pl-8">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-4 w-4 text-[#C5A572]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 font-medium">Contents</span>
              </div>
              
              <nav className="flex flex-col gap-5">
                {POLICY_SECTIONS.map((section) => (
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
                  Need help understanding our policies?
                </p>
                <a href="mailto:privacy@sampangroup.com.bd" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A572] hover:text-[#0c0b0b] transition-colors">
                  Contact Us
                  <ArrowUp className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </aside>

          {/* ─── Content Body (Right/Bottom) ─── */}
          <div className="lg:col-span-8 flex flex-col gap-24 md:gap-32">
            {POLICY_SECTIONS.map((section) => (
              <article key={section.id} id={section.id} className="pp-section scroll-mt-24">
                <h2 className="pp-content-anim font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light text-[#0c0b0b] mb-8 tracking-[-0.01em]">
                  {section.title}
                </h2>
                
                {/* Luxury Divider */}
                <div className="pp-content-anim w-12 h-px bg-[#C5A572] mb-10"></div>

                <div className="flex flex-col gap-6">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="pp-content-anim text-base md:text-lg font-light text-[#0c0b0b]/50 leading-[1.9] whitespace-pre-line">
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