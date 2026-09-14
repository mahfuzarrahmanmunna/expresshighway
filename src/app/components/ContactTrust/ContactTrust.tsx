"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
// Note: If you don't have lucide's BsWhatsapp, swap with your react-icons import:
// import { BsWhatsapp } from "react-icons/bs";
// For this code, I will mock a WhatsApp icon component to ensure it runs.

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TRUST_BADGES = [
  { value: "20+", label: "Years in Business" },
  { value: "REHAB", label: "Registered Land Developer" },
  { value: "15+", label: "Years Delivering Projects" },
];

const CONTACT_METHODS = [
  {
    Icon: Phone,
    label: "Call Us",
    value: "+880 1710 000000",
    href: "tel:+8801710000000",
  },
  {
    Icon: BsWhatsapp,
    label: "WhatsApp",
    value: "+880 1710 000000",
    href: "https://wa.me/8801710000000",
  },
  {
    Icon: Mail,
    label: "Email Us",
    value: "info@expresshighwayinn.com",
    href: "mailto:info@expresshighwayinn.com",
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
      className="relative w-full bg-[#030303] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/[0.04] blur-[150px] rounded-full" />

      {/* Vertical Center Hairline */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.03]"></div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* ─── LEFT: Enquiry & Trust ─── */}
          <div className="contact-left flex flex-col">
            <span className="contact-left-anim text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6 block">
              Express Highway Inn Club & Lounge
            </span>

            <h2 className="contact-left-anim font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-foreground mb-12">
              Get your VVIP benefits
            </h2>

            {/* Short Form */}
            <form className="contact-left-anim mb-16">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                Quick Enquiry
              </label>
              <div className="flex flex-col sm:flex-row gap-4 border-b border-white/[0.08] pb-4 transition-colors focus-within:border-primary/40">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-foreground placeholder:text-foreground/30 focus:outline-none text-sm md:text-base font-light"
                  required
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/80 hover:text-primary transition-colors duration-300 whitespace-nowrap"
                >
                  Submit
                  <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="contact-left-anim mt-auto">
              <span className="block text-[10px] uppercase tracking-[0.4em] text-foreground/40 mb-6">
                Why Invest With Us
              </span>
              <div className="grid grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05]">
                {TRUST_BADGES.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-[#030303] p-6 flex flex-col justify-center"
                  >
                    <span className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-primary font-medium mb-2">
                      {badge.value}
                    </span>
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-foreground/50 leading-tight">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05]">
              {CONTACT_METHODS.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  target={method.Icon !== Phone ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="contact-right-anim group bg-[#030303] p-6 flex flex-col items-start gap-4 hover:bg-primary/[0.02] transition-colors duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 border border-white/[0.08] rounded-full text-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                    <method.Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                      {method.label}
                    </p>
                    <p className="text-sm font-light text-foreground/80 break-all">
                      {method.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Get Directions Map Tile */}
            <a
              href="https://maps.google.com/?q=Dhaka-Chittagong+Highway"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-right-anim group relative flex-1 min-h-[400px] overflow-hidden border border-white/[0.05]"
            >
              {/* Dark Map Iframe */}
              <iframe
                title="Express Highway Inn Location"
                src="https://maps.google.com/maps?q=Dhaka-Chittagong%20Highway&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full grayscale invert contrast-[0.9] brightness-[0.85] opacity-80 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Map Overlays */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/40" />
              <div className="pointer-events-none absolute inset-0 bg-primary/[0.02] mix-blend-overlay" />

              {/* Center Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-4 w-4 rounded-full bg-primary/40 animate-ping"></span>
                  <span className="relative h-3 w-3 rounded-full bg-primary border-2 border-white shadow-[0_0_15px_4px_rgba(0,125,197,0.5)]"></span>
                </div>
              </div>

              {/* Bottom Floating CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1">
                    Our Location
                  </p>
                  <p className="text-lg font-[family-name:var(--font-playfair)] text-white font-medium">
                    Dhaka - Chittagong Hwy
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/[0.05] py-3 px-5">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/80 group-hover:text-primary transition-colors duration-300">
                    Get Directions
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-white/10 pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/10 pointer-events-none" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
