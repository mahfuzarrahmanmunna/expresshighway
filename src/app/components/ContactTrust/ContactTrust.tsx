"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone,
  Mail,
  ArrowRight,
  Send,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Real Data ── */
const TRUST_BADGES = [
  { value: "Est. 2013", label: "Foundation Year" },
  { value: "REHAB", label: "Registered Developer" },
  { value: "04+", label: "Group Divisions" },
];

const CONTACT_METHODS = [
  {
    Icon: Phone,
    label: "Call Us",
    value: "+880 1906-896326",
    href: "tel:+8801906896326",
  },
  {
    Icon: BsWhatsapp,
    label: "WhatsApp",
    value: "+880 1906-896326",
    href: "https://wa.me/8801906896326",
  },
  {
    Icon: Mail,
    label: "Email Us",
    value: "info@sampangroup.com.bd",
    href: "mailto:info@sampangroup.com.bd",
  },
];

export default function ContactTrust() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Left Content Reveal */
      gsap.from(".contact-left-anim", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-left",
          start: "top 80%",
        },
      });

      /* Right Content Reveal */
      gsap.from(".contact-right-anim", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-right",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#007DC6]/[0.04] blur-[150px] rounded-full" />

      {/* Vertical Center Hairline */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-[#0c0b0b]/5"></div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* ─── LEFT: Enquiry & Trust ─── */}
          <div className="contact-left flex flex-col">
            <span className="contact-left-anim text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-6 block">
              Express Highway Inn Club & Lounge
            </span>

            <h2 className="contact-left-anim font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-[#0c0b0b] mb-12">
              Get your VVIP benefits
            </h2>

            {/* Short Form */}
            <form className="contact-left-anim mb-16">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 mb-4">
                Quick Enquiry
              </label>
              <div className="flex flex-col sm:flex-row gap-4 border-b border-[#0c0b0b]/10 pb-4 transition-colors focus-within:border-[#007DC6]/60">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-[#0c0b0b] placeholder:text-[#0c0b0b]/30 focus:outline-none text-sm md:text-base font-light"
                  required
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#0c0b0b]/80 hover:text-[#007DC6] transition-colors duration-300 whitespace-nowrap"
                >
                  Submit
                  <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="contact-left-anim mt-auto">
              <span className="block text-[10px] uppercase tracking-[0.4em] text-[#0c0b0b]/40 mb-6">
                Why Invest With Us
              </span>
              <div className="grid grid-cols-3 gap-px bg-[#0c0b0b]/5 border border-[#0c0b0b]/10">
                {TRUST_BADGES.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-[#F7F6F2] p-6 flex flex-col justify-center"
                  >
                    <span className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#007DC6] font-medium mb-2">
                      {badge.value}
                    </span>
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-[#0c0b0b]/50 leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Contact Tiles & Map ─── */}
          <div className="contact-right flex flex-col gap-6">
            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#0c0b0b]/5 border border-[#0c0b0b]/10">
              {CONTACT_METHODS.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  target={method.Icon !== Phone ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="contact-right-anim group bg-[#F7F6F2] p-6 flex flex-col items-start gap-4 hover:bg-[#007DC6]/[0.02] transition-colors duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 border border-[#0c0b0b]/10 rounded-full text-[#0c0b0b]/40 group-hover:text-[#007DC6] group-hover:border-[#007DC6]/30 transition-all duration-500">
                    <method.Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#0c0b0b]/40 mb-2">
                      {method.label}
                    </p>
                    <p className="text-sm font-light text-[#0c0b0b]/80 break-all">
                      {method.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Get Directions Map Tile */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=23.5433,90.4012"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-right-anim group relative flex-1 min-h-[400px] overflow-hidden border border-[#0c0b0b]/10"
            >
              {/* Natural Map Iframe (Exact Coordinates) */}
              <iframe
                title="Express Highway Inn Location"
                src="https://maps.google.com/maps?q=23.5433,90.4012&z=13&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Map Overlays (Subtle shadow for text readability) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0b0b]/60 via-transparent to-transparent" />

              {/* Center Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-4 w-4 rounded-full bg-[#007DC6]/40 animate-ping"></span>
                  <span className="relative h-3 w-3 rounded-full bg-[#007DC6] border-2 border-white shadow-[0_0_15px_4px_rgba(0,125,197,0.5)]"></span>
                </div>
              </div>

              {/* Bottom Floating CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 mb-1">
                    Our Location
                  </p>
                  <p className="text-lg font-[family-name:var(--font-playfair)] text-white font-medium">
                    Dhaka - Chittagong Hwy
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 bg-[#0c0b0b]/80 backdrop-blur-md border border-white/10 py-3 px-5">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white group-hover:text-[#007DC6] transition-colors duration-300">
                    Get Directions
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#007DC6] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-white/20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/20 pointer-events-none" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}