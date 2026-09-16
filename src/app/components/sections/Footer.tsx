"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowUpRight, ArrowUp, Phone, Mail } from "lucide-react";
import { gsap } from "gsap";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Club & Lounge", href: "#club-lounge" },
    { label: "Membership", href: "#membership" },
    { label: "Contact", href: "#contact" },
  ],
  "Sampan Ecosystem": [
    { label: "Sampan Group", href: "https://sampangroup.com" },
    { label: "LSHS", href: "#" },
    { label: "Sampan Agro & Golf", href: "#" },
    { label: "Sampan Highway Inn", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Membership Terms", href: "#" },
  ],
};

const CONTACT_ICONS = [
  { Icon: Phone, label: "Phone", href: "tel:+8801710000000" },
  { Icon: BsWhatsapp, label: "WhatsApp", href: "https://wa.me/8801710000000" },
  { Icon: Mail, label: "Email", href: "mailto:info@expresshighwayinn.com" },
  { Icon: BsFacebook, label: "Facebook", href: "https://facebook.com" },
];

/* ═══════════════════════════════════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════════════════════════════════ */
function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="group flex items-center gap-3 cursor-pointer border-none bg-transparent py-4"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-foreground/30 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/[0.05] group-hover:-translate-y-0.5">
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/20 transition-colors duration-300 group-hover:text-foreground/50">
        Back to top
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER INPUT
   ═══════════════════════════════════════════════════════════════ */
function NewsletterInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="mt-8">
      <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-foreground/20 mb-4">
        Stay Informed
      </p>
      <div className="flex items-center gap-0">
        <div
          className={cn(
            "flex-1 border-b transition-colors duration-[400ms]",
            focused ? "border-primary/40" : "border-white/[0.06]",
          )}
        >
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full border-none bg-transparent py-3 pr-2 text-[13px] text-foreground/70 outline-none placeholder:text-foreground/15"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center border-none bg-transparent cursor-pointer text-foreground/20 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-primary hover:translate-x-0.5"
          aria-label="Subscribe to newsletter"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-[9px] leading-relaxed text-foreground/10">
        Exclusive updates on highway events and membership tiers. No spam.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const { isReducedMotion } = useAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useScrollReveal(mainRef, { y: 40, disabled: isReducedMotion });
  useScrollReveal(dividerRef, { y: 20, disabled: isReducedMotion });
  useScrollReveal(logoRef, { y: 60, disabled: isReducedMotion });

  return (
    <footer className="relative bg-[#030303] overflow-hidden">
      {/* ── Ambient Background Glow ── */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.03] blur-[150px] rounded-full" />
      
      {/* ── Grain Texture ── */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* ARCHITECTURAL DIVIDER                 */}
      {/* ════════════════════════════════════════ */}
      <div ref={dividerRef} className={cn("relative z-10", !isReducedMotion && "opacity-0")}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-12">
          <div className="flex items-center justify-between">
            {/* Left accent */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />
              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-foreground/10">
                Expressway — KM 42
              </span>
            </div>

            {/* Center — coordinates */}
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                22°27&apos;N
              </span>
              <span className="h-px w-4 bg-white/[0.06]" />
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                91°48&apos;E
              </span>
            </div>

            {/* Right accent */}
            <div className="flex items-center gap-4">
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                Dhaka — Ctg
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MASSIVE TYPOGRAPHY LOGO              */}
      {/* ════════════════════════════════════════ */}
      <div ref={logoRef} className={cn("relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16", !isReducedMotion && "opacity-0")}>
        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,12vw,11rem)] leading-[0.85] font-medium text-foreground/90 tracking-tight select-none">
          Express<br/>
          <span className="text-primary/80 italic">Highway Inn.</span>
        </h2>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MAIN FOOTER CONTENT                   */}
      {/* ════════════════════════════════════════ */}
      <div ref={mainRef} className={cn("relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-16", !isReducedMotion && "opacity-0")}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          
          {/* ── Brand & Newsletter ── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <p className="text-[12px] leading-[2] text-foreground/25 max-w-sm">
              Where the highway leads to luxury. A private retreat for travellers, members, and corporate journeys, anchored by Sampan Group.
            </p>
            <NewsletterInput />
          </div>

          {/* ── Link Columns ── */}
          {Object.entries(FOOTER_LINKS).map(([heading, links], colIdx) => (
            <div
              key={heading}
              className="lg:col-span-2"
              style={{ animationDelay: `${colIdx * 100}ms` }}
            >
              <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-foreground/30 pb-4 border-b border-white/[0.04] mb-5">
                {heading}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group relative inline-flex items-center text-[12px] leading-none text-foreground/35 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-foreground/80 hover:pl-1"
                    >
                      {/* Hover underline */}
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/30 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Contact Mini Column ── */}
          <div className="lg:col-span-1">
            <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-foreground/30 pb-4 border-b border-white/[0.04] mb-5">
              Connect
            </h4>
            <div className="space-y-3.5">
              {[
                { label: "Phone", value: "+880 1710 000000" },
                { label: "Email", value: "info@express.com" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-foreground/15 mb-1">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-foreground/40 transition-colors duration-300 hover:text-foreground/60 cursor-pointer">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Socials / Contact Icons */}
            <div className="mt-8 flex items-center gap-2.5">
              {CONTACT_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  data-cursor={label.toUpperCase()}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] text-foreground/15 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/20 hover:text-primary/60 hover:bg-primary/[0.03] hover:scale-110"
                >
                  <Icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* BOTTOM BAR                           */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            {/* Copyright */}
            <p className="text-[9px] tracking-[0.15em] text-foreground/15">
              &copy; {new Date().getFullYear()} Express Highway Inn. A Sampan Group Venture. All rights reserved.
            </p>

            {/* Back to top */}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}