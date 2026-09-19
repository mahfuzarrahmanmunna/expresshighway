"use client";

import { useRef, useCallback, useState } from "react";
import { ArrowUpRight, ArrowUp, Phone, Mail } from "lucide-react";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { BsFacebook, BsLinkedin } from "react-icons/bs";

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/aboutus" },
    { label: "Club & Lounge", href: "/club-and-lounge" },
    { label: "Membership", href: "/membership" },
    { label: "Contact", href: "/contactus" },
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
  { Icon: Phone, label: "Phone", href: "tel:+8801906896326" },
  { Icon: Mail, label: "Email", href: "mailto:info@sampangroup.com.bd" },
  { Icon: BsLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sampangroup/" },
  { Icon: BsFacebook, label: "Facebook", href: "https://www.facebook.com/expresshighwayinn/" },
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
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-gray-400 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/[0.05] group-hover:-translate-y-0.5">
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 transition-colors duration-300 group-hover:text-foreground/80">
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
    <div className="mt-10">
      <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-gray-400 mb-4">
        Stay Informed
      </p>
      <div className="flex items-center gap-0">
        <div
          className={cn(
            "flex-1 border-b transition-colors duration-[400ms]",
            focused ? "border-primary/60" : "border-white/20",
          )}
        >
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email address"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full border-none bg-transparent py-3 pr-2 text-[13px] text-gray-400 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center border-none bg-transparent cursor-pointer text-gray-400 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-primary hover:translate-x-1"
          aria-label="Subscribe to newsletter"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-[9px] leading-relaxed text-gray-400">
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
    <footer className="relative bg-[#050608] overflow-hidden">
      {/* ── Top Blend Gradient ── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] to-transparent z-[1]" />

      {/* ── Ambient Background Glow ── */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/[0.04] blur-[180px] rounded-full" />
      
      {/* ── Grain Texture ── */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* ARCHITECTURAL DIVIDER                 */}
      {/* ════════════════════════════════════════ */}
      <div ref={dividerRef} className={cn("relative z-10", !isReducedMotion && "opacity-0")}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-12">
          <div className="flex items-center justify-between">
            {/* Left accent */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/25" />
              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-gray-400">
                Expressway — KM 42
              </span>
            </div>

            {/* Center — coordinates */}
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-[8px] font-mono tracking-[0.2em] text-gray-400">
                22°27&apos;N
              </span>
              <span className="h-1 w-1 bg-primary/60 rounded-full" />
              <span className="text-[8px] font-mono tracking-[0.2em] text-gray-400">
                91°48&apos;E
              </span>
            </div>

            {/* Right accent */}
            <div className="flex items-center gap-4">
              <span className="text-[8px] font-mono tracking-[0.2em] text-gray-400">
                Dhaka — Ctg
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/25" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MASSIVE TYPOGRAPHY LOGO              */}
      {/* ════════════════════════════════════════ */}
      <div ref={logoRef} className={cn("relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-20", !isReducedMotion && "opacity-0")}>
        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,12vw,11rem)] leading-[0.85] font-medium tracking-tight select-none bg-gradient-to-b from-white via-white/70 to-white/30 bg-clip-text text-transparent">
          Express<br/>
          <span className="italic text-primary/80">Highway Inn.</span>
        </h2>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MAIN FOOTER CONTENT                   */}
      {/* ════════════════════════════════════════ */}
      <div ref={mainRef} className={cn("relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-20", !isReducedMotion && "opacity-0")}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          
          {/* ── Brand & Newsletter ── */}
          <div className="lg:col-span-5 xl:col-span-5">
            <p className="text-[13px] leading-[1.8] text-gray-400 max-w-sm font-light">
              Where the highway leads to luxury. A private retreat for travellers, members, and corporate journeys, anchored by Sampan Group.
            </p>
            <NewsletterInput />
          </div>

          {/* ── Link Columns ── */}
          <div className="lg:col-span-4 xl:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(FOOTER_LINKS).map(([heading, links], colIdx) => (
              <div key={heading}>
                <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-gray-400 pb-4 border-b border-white/15 mb-5 flex items-center gap-2">
                  <span className="text-primary/70">{`0${colIdx + 1}`}</span>
                  {heading}
                </h4>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group relative inline-flex items-center text-[12px] leading-none text-gray-400 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-foreground hover:pl-2"
                      >
                        {/* Hover dot indicator */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-1 bg-primary rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-left-3" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Contact & Connect Column ── */}
          <div className="lg:col-span-3 xl:col-span-3">
            <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-gray-400 pb-4 border-b border-white/15 mb-5 flex items-center gap-2">
              <span className="text-primary/70">04</span>
              Connect
            </h4>
            <div className="space-y-5">
              {[
                { label: "Phone", value: "+8801906-896326", href: "tel:+8801906896326" },
                { label: "Email", value: "info@sampangroup.com.bd", href: "mailto:info@sampangroup.com.bd" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-gray-400 mb-1.5">
                    {item.label}
                  </p>
                  <a 
                    href={item.href}
                    className="text-[13px] text-gray-400 transition-colors duration-300 hover:text-foreground cursor-pointer font-light block"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>

            {/* Socials / Contact Icons */}
            <div className="mt-8 flex items-center gap-3">
              {CONTACT_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  data-cursor={label.toUpperCase()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-400 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/50 hover:text-primary hover:bg-primary/[0.05] hover:scale-110"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* BOTTOM BAR                           */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            {/* Copyright */}
            <p className="text-[9px] tracking-[0.15em] text-gray-400 font-light">
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