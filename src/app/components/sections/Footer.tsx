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
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/aboutus" },
  { label: "Club & Lounge", href: "/club-and-lounge" },
  { label: "Membership", href: "/club-and-membership" },
  { label: "Contact", href: "/contactus" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Membership Terms", href: "/club-and-membership" },
];

const ECOSYSTEM_LINKS = [
  { label: "Sampan Group", href: "https://sampangroup.com" },
  { label: "London School Of Higher Studies", href: "https://cips.lshs.co.uk/" },
  { label: "Sampan Agro & Golf", href: "https://www.sampangroup.com.bd/our-divisions/hospitality-highway-travel/sampan-agro-golf-club-lounge" },
  { label: "Sampan Highway Inn", href: "https://www.sampangroup.com.bd/our-divisions/hospitality-highway-travel/sampan-highway-inn" },
];

const CONTACT_ICONS = [
  { Icon: Phone, label: "Phone", href: "tel:+8801906896326" },
  { Icon: Mail, label: "Email", href: "mailto:info@sampangroup.com.bd" },
  { Icon: BsLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sampangroup/" },
  { Icon: BsFacebook, label: "Facebook", href: "https://www.facebook.com/expresshighwayinn/" },
];

/* ═══════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <h4 className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-white/50 pb-4 border-b border-white/10 mb-6 flex items-center gap-2">
      <span className="text-primary/70">{num}</span>
      {title}
    </h4>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="group relative inline-block text-[13px] sm:text-[14px] leading-[1.5] text-white/40 hover:text-white transition-all duration-300 ease-out hover:translate-x-1"
      >
        {label}
      </a>
    </li>
  );
}

function BackToTop() {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 cursor-pointer border-none bg-transparent py-4"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/[0.05] group-hover:scale-105">
        <ArrowUp className="h-4 w-4" />
      </span>
      <span className="text-[12px] tracking-[0.2em] uppercase text-white/50 transition-colors duration-300 group-hover:text-white">
        Back to top
      </span>
    </button>
  );
}

function NewsletterInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="mt-10">
      <p className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-white/50 mb-5">
        Stay Informed
      </p>
      <div className="flex items-center gap-0">
        <div
          className={cn(
            "flex-1 border-b transition-colors duration-[400ms]",
            focused ? "border-primary/60" : "border-white/15",
          )}
        >
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email address"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full border-none bg-transparent py-3 pr-2 text-[14px] text-white outline-none placeholder:text-white/30"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center border-none bg-transparent cursor-pointer text-white/40 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-primary hover:translate-x-1"
          aria-label="Subscribe to newsletter"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-white/30 font-light">
        Exclusive updates on highway events and membership tiers. No spam.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FOOTER COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const { isReducedMotion } = useAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useScrollReveal(mainRef, { y: 40, disabled: isReducedMotion });
  useScrollReveal(dividerRef, { y: 20, disabled: isReducedMotion });
  useScrollReveal(logoRef, { y: 60, disabled: isReducedMotion });

  // Container classes for consistent alignment
  const containerClasses = "mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-16";

  return (
    <footer className="relative w-full bg-[#050608] overflow-hidden">
      {/* ── Ambient Background Elements ── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] to-transparent z-[1]" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/[0.04] blur-[180px] rounded-full" />
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
        <div className={cn(containerClasses, "pt-24 pb-12")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/25" />
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/40">
                Expressway - KM 42
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-[11px] font-mono tracking-[0.2em] text-white/40">
                22°27&apos;N
              </span>
              <span className="h-1 w-1 bg-primary/60 rounded-full" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-white/40">
                91°48&apos;E
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono tracking-[0.2em] text-white/40">
                Dhaka - Ctg
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/25" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* GIANT TYPOGRAPHY LOGO                 */}
      {/* ════════════════════════════════════════ */}
      <div ref={logoRef} className={cn("relative z-10", containerClasses, !isReducedMotion && "opacity-0", "pb-20")}>
        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,12vw,11rem)] leading-[0.85] font-medium tracking-tight select-none bg-gradient-to-b from-white via-white/70 to-white/30 bg-clip-text text-transparent">
          Express<br/>
          <span className="italic text-primary/80">Highway Inn.</span>
        </h2>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MAIN 12-COLUMN GRID                   */}
      {/* ════════════════════════════════════════ */}
      <div ref={mainRef} className={cn("relative z-10", containerClasses, !isReducedMotion && "opacity-0", "pb-20")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-x-8 xl:gap-x-12">
          
          {/* ── 01. Brand & Newsletter (4 Cols) ── */}
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-[14px] leading-[1.8] text-white/40 max-w-[340px] font-light">
              Where the highway leads to luxury. A private retreat for travellers, members, and corporate journeys, anchored by Sampan Group.
            </p>
            <NewsletterInput />
          </div>

          {/* ── 02. Navigation & Legal (2 Cols) ── */}
          <div className="sm:col-span-1 lg:col-span-2 flex flex-col gap-12">
            <div>
              <SectionHeading num="01" title="Navigation" />
              <ul className="space-y-4">
                {NAV_LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
            
            
          </div>

          {/* ── 03. Ecosystem (3 Cols) ── */}
          <div className="sm:col-span-1 lg:col-span-3">
            <SectionHeading num="02" title="Ecosystem" />
            <ul className="space-y-4">
              {ECOSYSTEM_LINKS.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* ── 04. Connect (3 Cols) ── */}
          <div className="sm:col-span-2 lg:col-span-3">
            <SectionHeading num="04" title="Connect" />
            <div className="space-y-6">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-2">
                  Phone
                </p>
                <a 
                  href="tel:+8801906896326" 
                  className="text-[14px] text-white/60 hover:text-white transition-colors duration-300 font-light block"
                >
                  +880 1906-896326
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-2">
                  Email
                </p>
                <a 
                  href="mailto:info@sampangroup.com.bd" 
                  className="text-[14px] text-white/60 hover:text-white transition-colors duration-300 font-light block break-all"
                >
                  info@sampangroup.com.bd
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-3">
              {CONTACT_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  data-cursor={label.toUpperCase()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/50 hover:text-primary hover:bg-primary/[0.05] hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* BOTTOM BAR                            */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-white/[0.08]">
        <div className={cn(containerClasses, "py-8")}>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-[12px] tracking-[0.15em] text-white/40 font-light text-center sm:text-left">
              &copy; {new Date().getFullYear()} Express Highway Inn. A Sampan Group Venture. All rights reserved.
            </p>
            <div>
              <ul className="md:flex gap-6 items-center justify-center block">
                {LEGAL_LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}