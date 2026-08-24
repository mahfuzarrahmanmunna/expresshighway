"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { gsap } from "gsap";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const FOOTER_LINKS: Record<string, string[]> = {
  Residences: [
    "Skyline Penthouse",
    "Garden Villa",
    "Horizon Suite",
    "Studio Collection",
    "Villa Estates",
  ],
  Company: [
    "About Us",
    "Our Vision",
    "Architecture",
    "Sustainability",
    "Careers",
  ],
  Resources: ["Brochure", "Floor Plans", "Virtual Tour", "FAQ", "Press"],
};

const SOCIALS = [
  { Icon: BsInstagram, label: "Instagram" },
  { Icon: BsFacebook, label: "Facebook" },
  { Icon: BsTwitter, label: "Twitter" },
  { Icon: BsLinkedin, label: "LinkedIn" },
];

/* Images for the marquee strip */
const MARQUEE_IMAGES = [
  "https://picsum.photos/seed/elysian-ft-1/400/500",
  "https://picsum.photos/seed/elysian-ft-2/400/500",
  "https://picsum.photos/seed/elysian-ft-3/400/500",
  "https://picsum.photos/seed/elysian-ft-4/400/500",
  "https://picsum.photos/seed/elysian-ft-5/400/500",
  "https://picsum.photos/seed/elysian-ft-6/400/500",
];

/* ═══════════════════════════════════════════════════════════════
   IMAGE MARQUEE — GSAP infinite scroll
   ═══════════════════════════════════════════════════════════════ */
function ImageMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const images = track.querySelectorAll<HTMLDivElement>(".marquee-img");

    /* Duplicate images for seamless loop */
    images.forEach((img) => {
      const clone = img.cloneNode(true) as HTMLDivElement;
      track.appendChild(clone);
    });

    /* Calculate total width of original set */
    let totalWidth = 0;
    images.forEach((img) => {
      totalWidth += img.offsetWidth + 16; /* 16 = gap-4 */
    });

    /* Infinite scroll */
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        duration: totalWidth / 40 /* ~40px per second */,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(
            (x: number) => parseFloat(String(x)) % totalWidth,
          ),
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#080808] to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#080808] to-transparent" />
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#080808] to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#080808] to-transparent" />

      <div ref={trackRef} className="flex gap-4 py-4 will-change-transform">
        {MARQUEE_IMAGES.map((src, i) => (
          <div
            key={i}
            className="marquee-img relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden sm:h-[260px] sm:w-[200px] md:h-[320px] md:w-[240px]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Number */}
            <span className="absolute bottom-3 left-3 text-[9px] font-mono tracking-[0.15em] text-white/30">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        Exclusive updates on new residences and events. No spam.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const { scrollTo, isReducedMotion } = useAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useScrollReveal(mainRef, { y: 40, disabled: isReducedMotion });
  useScrollReveal(dividerRef, { y: 20, disabled: isReducedMotion });

  return (
    <footer className="relative bg-[#080808]">
      {/* ════════════════════════════════════════ */}
      {/* IMAGE MARQUEE STRIP                   */}
      {/* ════════════════════════════════════════ */}
      <div className="border-b border-white/[0.04]">
        {!isReducedMotion ? (
          <ImageMarquee />
        ) : (
          /* Reduced motion: static grid instead of scrolling */
          <div className="flex gap-3 overflow-x-auto px-6 py-4 scrollbar-none">
            {MARQUEE_IMAGES.map((src, i) => (
              <div
                key={i}
                className="relative h-40 w-32 flex-shrink-0 overflow-hidden sm:h-48 sm:w-40"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════ */}
      {/* ARCHITECTURAL DIVIDER                 */}
      {/* ════════════════════════════════════════ */}
      <div ref={dividerRef} className={cn(!isReducedMotion && "opacity-0")}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="flex items-center justify-between">
            {/* Left accent */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />
              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-foreground/10">
                Express Residences
              </span>
            </div>

            {/* Center — coordinates */}
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                33°27′N
              </span>
              <span className="h-px w-4 bg-white/[0.06]" />
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                112°04′W
              </span>
            </div>

            {/* Right accent */}
            <div className="flex items-center gap-4">
              <span className="text-[8px] font-mono tracking-[0.2em] text-foreground/10">
                Phoenix, AZ
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MAIN FOOTER CONTENT                   */}
      {/* ════════════════════════════════════════ */}
      <div ref={mainRef} className={cn(!isReducedMotion && "opacity-0")}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* ── Brand Column ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              {/* Logo */}
              <div className="flex items-baseline gap-1">
                <span
                  className="font-serif text-lg tracking-[0.2em] uppercase text-foreground/90"
                  style={{ textShadow: "0 0 40px rgba(0,125,197,0.08)" }}
                >
                  EXPRESS
                </span>
                <span className="inline-block h-[3px] w-[3px] rounded-full bg-primary/50 align-super" />
              </div>

              {/* Description */}
              <p className="mt-6 max-w-sm text-[12px] leading-[2] text-foreground/25">
                Redefining luxury living through architectural excellence,
                meticulous craftsmanship, and an unwavering commitment to
                creating residences that inspire.
              </p>

              {/* Newsletter */}
              {/* <NewsletterInput /> */}
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
                    <li key={link}>
                      <a
                        href="#"
                        className="group relative inline-flex items-center text-[12px] leading-none text-foreground/35 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-foreground/80 hover:pl-1"
                      >
                        {/* Hover underline */}
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/30 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ── Contact Mini Column ── */}
            <div className="lg:col-span-1">
              <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-foreground/30 pb-4 border-b border-white/[0.04] mb-5">
                Contact
              </h4>
              <div className="space-y-3.5">
                {[
                  { label: "Phone", value: "+1 800 555 0199" },
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

              {/* Socials */}
              <div className="mt-8 flex items-center gap-2.5">
                {SOCIALS.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
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
        <div className="border-t border-white/[0.04]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
              {/* Copyright */}
              <p className="text-[9px] tracking-[0.15em] text-foreground/15">
                &copy; {new Date().getFullYear()} Express Residences. All rights
                reserved.
              </p>

              {/* Legal links */}
              <div className="flex items-center gap-5">
                {["Privacy Policy", "Terms of Service", "Sitemap"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-[9px] tracking-[0.15em] text-foreground/15 transition-colors duration-300 hover:text-foreground/35"
                    >
                      {link}
                    </a>
                  ),
                )}
              </div>

              {/* Back to top */}
              <BackToTop />
            </div>
          </div>
        </div>
      </div>

      {/* ── Subtle bottom gradient ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
    </footer>
  );
}
