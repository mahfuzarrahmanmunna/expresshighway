"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, MapPin } from "lucide-react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
import { cn } from "@/app/lib/utils";
import {
  useAnimation,
  useActiveSection,
  useScrollLock,
} from "@/lib/animation-provider";

/* ── Config ── */
const NAV_ITEMS = [
  { label: "Experience", href: "#about" },
  { label: "Residences", href: "#featured" },
  { label: "Collection", href: "#collection" },
  { label: "Amenities", href: "#amenities" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const MOBILE_ITEMS = [...NAV_ITEMS, { label: "Book a Tour", href: "#contact" }];

const SOCIAL_ICONS = [
  { Icon: BsInstagram, label: "Instagram" },
  { Icon: BsFacebook, label: "Facebook" },
  { Icon: BsTwitter, label: "Twitter" },
  { Icon: BsLinkedin, label: "LinkedIn" },
] as const;

/* ── Props ── */
interface NavbarProps {
  splashVisible: boolean;
}

/* ── Framer variants — ease typed as tuple to satisfy TS ── */
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeIn: [number, number, number, number] = [0.7, 0, 0.84, 0];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: easeIn },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.15 + i * 0.06,
    },
  }),
};

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */
export default function Navbar({ splashVisible }: NavbarProps) {
  const { scrollTo: smoothScrollTo } = useAnimation();
  const activeSection = useActiveSection(
    NAV_ITEMS.map((i) => i.href.replace("#", "")),
  );
  const { lock, unlock } = useScrollLock();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const mobileLinksRef = useRef<(HTMLButtonElement | null)[]>([]);
  const splitInstancesRef = useRef<SplitType[]>([]);
  const hasEnteredRef = useRef(false);

  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  /* ════════════════════════════════════════════════════════════
     1. ENTRANCE ANIMATION
     ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (prefersReducedMotion.current || splashVisible || hasEnteredRef.current)
      return;
    hasEnteredRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      /* Top bar slides down */
      tl.from(".nav-topbar", {
        y: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      /* Main bar */
      tl.from(
        ".nav-main",
        { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );

      /* Stagger children */
      tl.from(
        ".nav-logo",
        { opacity: 0, y: -8, duration: 0.5, ease: "power3.out" },
        "-=0.3",
      );
      tl.from(
        ".nav-link",
        {
          opacity: 0,
          y: -8,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        },
        "-=0.35",
      );
      tl.from(
        ".nav-right-item",
        {
          opacity: 0,
          y: -8,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        },
        "-=0.3",
      );
      tl.from(
        ".nav-mobile-toggle",
        { opacity: 0, y: -8, duration: 0.45, ease: "power3.out" },
        "-=0.3",
      );
    }, navRef);

    return () => ctx.revert();
  }, [splashVisible]);

  /* ════════════════════════════════════════════════════════════
     2. SCROLL BEHAVIOUR
     ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId: number;
    let isHidden = false;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > lastScrollY && y - lastScrollY > 2;
        const up = y < lastScrollY && lastScrollY - y > 2;
        const past = y > 60;

        setIsScrolled(past);

        /* Top bar collapses on scroll */
        if (topBarRef.current) {
          topBarRef.current.style.maxHeight = past ? "0px" : "40px";
          topBarRef.current.style.opacity = past ? "0" : "1";
        }

        /* Logo subtle scale */
        if (logoRef.current && !prefersReducedMotion.current) {
          gsap.to(logoRef.current, {
            scale: past ? 0.96 : 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }

        /* Hide / reveal main nav */
        if (!prefersReducedMotion.current) {
          if (past && down && !isHidden) {
            isHidden = true;
            gsap.to(".nav-main", {
              y: "-100%",
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          } else if ((up || !past) && isHidden) {
            isHidden = false;
            gsap.to(".nav-main", {
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            });
          }
        }

        lastScrollY = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ════════════════════════════════════════════════════════════
     3. MOBILE MENU SPLIT-TYPE
     ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isMobileOpen) {
      splitInstancesRef.current.forEach((s) => s.revert());
      splitInstancesRef.current = [];
      return;
    }
    if (prefersReducedMotion.current) return;

    const timer = setTimeout(() => {
      mobileLinksRef.current.forEach((el) => {
        if (!el) return;
        try {
          const split = new SplitType(el, { types: "chars" });
          splitInstancesRef.current.push(split);
          gsap.fromTo(
            split.chars,
            {
              y: 50,
              opacity: 0,
              rotateX: -80,
              color: "transparent",
              transformOrigin: "center bottom",
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              color: "var(--foreground)",
              stagger: 0.012,
              duration: 0.65,
              ease: "power3.out",
            },
          );
        } catch {
          gsap.to(el, {
            opacity: 1,
            color: "var(--foreground)",
            duration: 0.4,
          });
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [isMobileOpen]);

  /* ════════════════════════════════════════════════════════════
     4. SCROLL LOCK + RE-SYNC
     ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (isMobileOpen) {
      lock();
      gsap.to(".nav-main", {
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      unlock();
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsScrolled(y > 60);
        if (y <= 60) {
          gsap.to(".nav-main", {
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          });
        }
      });
    }
  }, [isMobileOpen, lock, unlock]);

  /* ── Escape key ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ════════════════════════════════════════════════════════════
     5. HANDLERS
     ════════════════════════════════════════════════════════════ */
  const handleClick = useCallback(
    (href: string) => {
      const wasOpen = isMobileOpen;
      setIsMobileOpen(false);
      setTimeout(() => smoothScrollTo(href), wasOpen ? 350 : 0);
    },
    [smoothScrollTo, isMobileOpen],
  );

  const openMobileMenu = useCallback(() => setIsMobileOpen(true), []);

  const handleCtaDown = useCallback((e: React.PointerEvent) => {
    if (prefersReducedMotion.current) return;
    gsap.set(e.currentTarget, { scale: 0.97 });
  }, []);

  const handleCtaUp = useCallback((e: React.PointerEvent) => {
    if (prefersReducedMotion.current) return;
    gsap.set(e.currentTarget, { clearProps: "scale" });
  }, []);

  /* ════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════ */
  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[1000]"
      >
        {/* ════════════════════════════════════════ */}
        {/* TOP UTILITY BAR                          */}
        {/* ════════════════════════════════════════ */}
        <div
          ref={topBarRef}
          className="nav-topbar w-full overflow-hidden border-b border-white/[0.04] transition-[max-height,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ maxHeight: "40px" }}
        >
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
            {/* Left info */}
            <div className="hidden items-center gap-4 sm:flex">
              <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-foreground/25">
                <MapPin className="h-2.5 w-2.5" />
                Phoenix, Arizona
              </span>
              <span className="h-2.5 w-px bg-white/[0.06]" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/25">
                Mon — Sat: 9AM — 7PM
              </span>
            </div>

            {/* Right info */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+18005551234"
                className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-foreground/25 transition-colors duration-300 hover:text-primary/60"
              >
                <Phone className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">+1 800 555 1234</span>
                <span className="sm:hidden">Call Us</span>
              </a>
              <span className="h-2.5 w-px bg-white/[0.06]" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/25">
                Est. 2009
              </span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* MAIN NAV BAR                             */}
        {/* ════════════════════════════════════════ */}
        <div
          className={cn(
            "nav-main w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            isScrolled
              ? "bg-[#050505]/80 backdrop-blur-[24px] backdrop-saturate-[1.5] border-b border-white/[0.06] shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
              : "bg-transparent border-b border-transparent",
          )}
        >
          <div className="mx-auto flex h-16 items-center justify-between px-5 sm:px-6 lg:px-8 md:h-[72px]">
            {/* ── Logo ── */}
            <button
              ref={logoRef}
              onClick={() => handleClick("#hero")}
              aria-label="Scroll to top"
              className="nav-logo group flex items-center gap-0 bg-transparent border-none p-0 cursor-pointer"
            >
              <span
                className={cn(
                  "text-[1.15rem] sm:text-[1.3rem] font-light tracking-[0.25em] uppercase text-foreground transition-all duration-400",
                  "group-hover:text-primary group-hover:tracking-[0.3em]",
                )}
                style={{
                  textShadow: "0 0 50px rgba(0,125,197,0.12)",
                }}
              >
                EXPRESS
              </span>
              <span
                className={cn(
                  "ml-1.5 inline-block h-1 w-1 rounded-full bg-primary/50 transition-all duration-500",
                  "group-hover:bg-primary group-hover:h-1.5 group-hover:w-1.5",
                )}
              />
            </button>

            {/* ── Desktop Links ── */}
            <div className="hidden items-center lg:flex">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.href;
                return (
                  <div key={item.href} className="flex items-center">
                    {/* Subtle dot separator between items */}
                    {i > 0 && (
                      <span className="mx-3 h-[3px] w-[3px] rounded-full bg-white/[0.08]" />
                    )}
                    <button
                      onClick={() => handleClick(item.href)}
                      className={cn(
                        "nav-link group relative cursor-pointer bg-transparent border-none p-0",
                        "text-[10px] font-normal tracking-[0.18em] uppercase py-2 px-1",
                        "transition-[color,letter-spacing] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "hover:tracking-[0.22em]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:rounded-sm",
                        isActive
                          ? "text-primary font-medium"
                          : "text-foreground/40 hover:text-foreground/80",
                      )}
                    >
                      {item.label}
                      {/* Active underline */}
                      <span
                        className={cn(
                          "absolute bottom-0 left-1/2 h-px -translate-x-1/2",
                          "bg-primary/60",
                          "transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive ? "w-full" : "w-0 group-hover:w-3/4",
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop Right ── */}
            <div className="hidden items-center gap-5 lg:flex">
              <button
                onClick={() => handleClick("#contact")}
                className={cn(
                  "nav-right-item group relative inline-flex items-center gap-2.5 cursor-pointer overflow-hidden border-none",
                  "px-6 py-2.5 rounded-none",
                  "text-[10px] font-medium tracking-[0.2em] uppercase text-white bg-primary",
                  "transition-[transform,box-shadow] duration-[300ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                  "hover:scale-[1.03] hover:shadow-[0_0_40px_-8px_rgba(0,125,197,0.45)]",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050505]",
                )}
                onPointerDown={handleCtaDown}
                onPointerUp={handleCtaUp}
                onPointerLeave={handleCtaUp}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">Schedule a Tour</span>
                <ArrowRight className="relative z-10 h-3 w-3 transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              onClick={openMobileMenu}
              className="nav-mobile-toggle lg:hidden relative flex h-10 w-10 items-center justify-center cursor-pointer border-none bg-transparent rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
              aria-label="Open navigation menu"
              aria-expanded={isMobileOpen}
            >
              <div className="flex flex-col items-center justify-center gap-[5px]">
                <span
                  className={cn(
                    "block h-px w-5 bg-foreground/70 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-5 bg-foreground/70 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  )}
                />
              </div>
              {/* Hover ring */}
              <span className="absolute inset-0 rounded-full border border-white/[0.06] transition-colors duration-300 hover:border-primary/20" />
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════ */}
      {/* MOBILE FULLSCREEN MENU                   */}
      {/* ════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[999] flex flex-col bg-[#050505]/[0.98] backdrop-blur-[40px] overflow-hidden"
            style={{ perspective: "800px" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Subtle grid background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Radial glow */}
            <div
              className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.04]"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,125,197,0.6), transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            {/* Close button */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
              <span className="text-[10px] font-light tracking-[0.3em] uppercase text-foreground/15">
                Menu
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="relative flex h-10 w-10 items-center justify-center cursor-pointer border-none bg-transparent rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                aria-label="Close navigation menu"
              >
                <span className="block h-px w-5 bg-foreground/60 rotate-45 absolute" />
                <span className="block h-px w-5 bg-foreground/60 -rotate-45 absolute" />
                <span className="absolute inset-0 rounded-full border border-white/[0.06]" />
              </button>
            </div>

            {/* Navigation links — centered vertically */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
              <nav className="flex flex-col items-center gap-1 sm:gap-2">
                {MOBILE_ITEMS.map((item, index) => (
                  <button
                    key={item.href}
                    ref={(el) => {
                      mobileLinksRef.current[index] = el;
                    }}
                    onClick={() => handleClick(item.href)}
                    className={cn(
                      "bg-transparent border-none cursor-pointer p-0",
                      "font-serif font-light leading-[1.2] tracking-wide text-transparent",
                      "text-[clamp(2rem,8vw,3.5rem)]",
                      "transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:text-primary rounded-sm",
                      /* Last item (Book a Tour) styled as CTA */
                      index === MOBILE_ITEMS.length - 1 && "text-primary",
                    )}
                    style={{ perspective: "600px" }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 px-5 pb-8 sm:px-8 sm:pb-10">
              {/* Divider */}
              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                {/* Phone */}
                <a
                  href="tel:+18005551234"
                  className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/30 transition-colors duration-300 hover:text-primary/60"
                >
                  <Phone className="h-3 w-3" />
                  +1 800 555 1234
                </a>

                {/* Socials */}
                <div className="flex items-center gap-3">
                  {SOCIAL_ICONS.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-foreground/20 transition-all duration-300 hover:border-primary/20 hover:text-primary/60 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>

                {/* Location */}
                <span className="hidden items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-foreground/20 sm:flex">
                  <MapPin className="h-3 w-3" />
                  Phoenix, AZ
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
