"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import type { IconType } from "react-icons";
import { cn } from "@/app/lib/utils";
import {
  useAnimation,
  useActiveSection,
  useScrollLock,
} from "@/lib/animation-provider";

/* ── Config ── */
const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Club & Lounge", href: "#club-lounge" },
  { label: "Membership", href: "#membership" }, // Commercial Page
  { label: "Contact", href: "#contact" },
  { label: "Sampan Group", href: "#sampan-group" },
];

const MOBILE_ITEMS = [...NAV_ITEMS];

interface ContactLink {
  Icon: LucideIcon | IconType;
  label: string;
  href: string;
}

const CONTACT_ICONS: ContactLink[] = [
  { Icon: Phone, label: "Phone", href: "tel:+8801710000000" },
  { Icon: BsWhatsapp, label: "WhatsApp", href: "https://wa.me/8801710000000" },
  { Icon: Mail, label: "Email", href: "mailto:info@expresshighwayinn.com" },
  { Icon: BsFacebook, label: "Facebook", href: "https://facebook.com" },
];

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

      tl.from(".nav-topbar", {
        y: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      tl.from(
        ".nav-main",
        { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );

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

        if (topBarRef.current) {
          topBarRef.current.style.maxHeight = past ? "0px" : "40px";
          topBarRef.current.style.opacity = past ? "0" : "1";
        }

        if (logoRef.current && !prefersReducedMotion.current) {
          gsap.to(logoRef.current, {
            scale: past ? 0.96 : 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }

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
              <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/25">
                Express Highway Inn
              </span>
              <span className="h-2.5 w-px bg-white/[0.06]" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/25">
                Premium Hospitality
              </span>
            </div>

            {/* Right info */}
            <div className="flex items-center gap-4">
              <a
                href="mailto:info@expresshighwayinn.com"
                className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-foreground/25 transition-colors duration-300 hover:text-primary/60"
              >
                <Mail className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">
                  info@expresshighwayinn.com
                </span>
                <span className="sm:hidden">Email Us</span>
              </a>
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
              onClick={() => handleClick("#home")}
              aria-label="Scroll to top"
              className="nav-logo group flex items-center gap-0 bg-transparent border-none p-0 cursor-pointer"
            >
              <span
                className={cn(
                  "text-[0.95rem] sm:text-[1.1rem] font-light tracking-[0.2em] uppercase text-foreground transition-all duration-400",
                  "group-hover:text-primary group-hover:tracking-[0.25em]",
                )}
                style={{
                  textShadow: "0 0 50px rgba(0,125,197,0.12)",
                }}
              >
                EXPRESS HIGHWAY INN
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
                const isCta = item.href === "#membership"; // Highlight Membership

                return (
                  <div key={item.href} className="flex items-center">
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
                        isCta
                          ? "text-primary border border-primary/40 px-4 py-2 rounded-sm hover:bg-primary/10 hover:border-primary"
                          : isActive
                            ? "text-primary font-medium"
                            : "text-foreground/40 hover:text-foreground/80",
                      )}
                    >
                      {item.label}
                      {!isCta && (
                        <span
                          className={cn(
                            "absolute bottom-0 left-1/2 h-px -translate-x-1/2",
                            "bg-primary/60",
                            "transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isActive ? "w-full" : "w-0 group-hover:w-3/4",
                          )}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop Right (Contact / Socials) ── */}
            <div className="hidden items-center gap-3 lg:flex">
              {CONTACT_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="nav-right-item flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-foreground/30 transition-all duration-300 hover:border-primary/20 hover:text-primary/60 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              onClick={openMobileMenu}
              className="nav-mobile-toggle lg:hidden relative flex h-10 w-10 items-center justify-center cursor-pointer border-none bg-transparent rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
              aria-label="Open navigation menu"
              aria-expanded={isMobileOpen}
            >
              <div className="flex flex-col items-center justify-center gap-[5px]">
                <span className="block h-px w-5 bg-foreground/70 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="block h-px w-5 bg-foreground/70 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
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
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

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

            {/* Navigation links */}
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
                      item.href === "#membership" && "text-primary",
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
              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                <a
                  href="tel:+8801710000000"
                  className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/30 transition-colors duration-300 hover:text-primary/60"
                >
                  <Phone className="h-3 w-3" />
                  +88 01710 000000
                </a>

                {/* Socials & Contact Icons */}
                <div className="flex items-center gap-3">
                  {CONTACT_ICONS.map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-foreground/20 transition-all duration-300 hover:border-primary/20 hover:text-primary/60 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
