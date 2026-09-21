"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MotionLink = motion(Link);

const NAV_ITEMS = [
  { label: "Home", number: "01", href: "/" },
  { label: "About", number: "02", href: "/aboutus" },
  { label: "Club & Lounge", number: "03", href: "/club-and-lounge" },
  { label: "Contact", number: "04", href: "/contactus" },
  { label: "Sampan Group", number: "05", href: "https://sampangroup.com.bd" },
];

export default function GlassNavbar() {
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --------------------------------------------------
  // MOUSE PARALLAX
  // --------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [1.5, -1.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-1.5, 1.5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // --------------------------------------------------
  // NAVBAR SCROLL MORPH
  // --------------------------------------------------
  useEffect(() => {
    const nav = navRef.current;
    const inner = innerRef.current;
    if (!nav || !inner) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "80px top",
        end: "200px top",
        onUpdate: (self) => {
          const p = self.progress;
          setIsScrolled(p > 0.15);

          gsap.to(nav, {
            paddingTop: `${16 - p * 5}px`,
            paddingBottom: `${16 - p * 5}px`,
            borderRadius: `${28 - p * 8}px`,
            duration: 0.35,
            overwrite: true,
            ease: "power3.out",
          });

          gsap.to(inner, {
            backgroundColor: `rgba(8,8,8,${0.38 + p * 0.48})`,
            borderColor: `rgba(255,255,255,${0.08 + p * 0.1})`,
            boxShadow: `
              0 ${10 + p * 12}px ${35 + p * 20}px rgba(0,0,0,${0.15 + p * 0.2}),
              inset 0 1px 0 rgba(255,255,255,${0.06 + p * 0.05})
            `,
            duration: 0.35,
            overwrite: true,
            ease: "power3.out",
          });
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // --------------------------------------------------
  // CLOSE MOBILE MENU ON RESIZE
  // --------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --------------------------------------------------
  // LOCK BODY WHEN MOBILE MENU OPEN
  // --------------------------------------------------
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={false}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        style={
          isMounted
            ? {
                rotateX,
                rotateY,
                transformPerspective: 1400,
              }
            : {
                transformPerspective: 1400,
              }
        }
        className="fixed top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-[9000] will-change-transform"
      >
        {/* Outer Glow */}
        <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-white/[0.08] via-transparent to-white/[0.08] pointer-events-none" />

        {/* Main Glass */}
        <div
          ref={innerRef}
          className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/40 backdrop-blur-2xl backdrop-saturate-150"
        >
          <motion.div
            className="absolute top-0 -left-[30%] w-[35%] h-full pointer-events-none bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skew-x-[-20deg]"
            animate={isMounted ? { x: ["0%", "380%"] } : { x: "0%" }}
            transition={{ duration: isMounted ? 9 : 0, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex items-center justify-between px-5 md:px-7 py-4 md:py-5">
            <MotionLink
              href="/"
              className="group flex items-center gap-4"
              initial={false}
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="relative flex items-center justify-center overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                <img src="/logo/Logo1.png" alt="Logo" className=" h-12 md:h-16 relative z-10" />
              </div>
            </MotionLink>

            <div className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <MotionLink
                  key={item.label}
                  href={item.href}
                  initial={false}
                  target={item.label === "Sampan Group" ? "_blank" : undefined}
                  rel={item.label === "Sampan Group" ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.045)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Changed to light by default, darker on hover */}
                  <span className="text-[10px] tracking-[0.15em] text-white/50 group-hover:text-white/20 transition-colors duration-300">
                    {item.number}
                  </span>
                  <span className="relative z-10 text-[13px] uppercase tracking-[0.18em] text-white group-hover:text-white/40 transition-all duration-300">
                    {item.label}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-4 right-4 h-px origin-left bg-gradient-to-r from-primary via-primary/60 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </MotionLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <motion.a href="tel:+8801906896326" data-cursor="CALL" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-primary hover:bg-white/5 transition-colors" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Phone size={13} strokeWidth={1.5} />
                </motion.a>
                <motion.a href="https://www.linkedin.com/company/sampangroup/" target="_blank" rel="noopener noreferrer" data-cursor="VISIT" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-primary hover:bg-white/5 transition-colors" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <FaLinkedinIn size={13} />
                </motion.a>
                <motion.a href="mailto:info@sampangroup.com.bd" data-cursor="MAIL" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-primary hover:bg-white/5 transition-colors" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Mail size={13} strokeWidth={1.5} />
                </motion.a>
                <motion.a href="https://www.facebook.com/expresshighwayinn/" target="_blank" rel="noopener noreferrer" data-cursor="VISIT" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-primary hover:bg-white/5 transition-colors" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <FaFacebookF size={13} />
                </motion.a>
              </div>

              <MotionLink
                href="/club-and-membership"
                initial={false}
                className="hidden md:flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2.5 text-[9px] uppercase tracking-[0.18em] text-primary hover:text-white overflow-hidden relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10">Membership</span>
                <ArrowUpRight size={13} className="relative z-10 transition-transform duration-500 group-hover:rotate-45" />
              </MotionLink>

              <motion.button
                onClick={() => setMenuOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="xl:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white"
              >
                <Menu size={17} strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE FULLSCREEN MENU */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
        className="fixed inset-0 z-[9500] bg-[#080808] backdrop-blur-3xl"
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:70px_70px]" />

        <div className="relative z-10 flex items-center justify-between px-6 py-6">
          <div>
            <div className="text-lg tracking-[0.35em] text-white">EXPRESS</div>
            <div className="text-[7px] tracking-[0.3em] text-white/30 uppercase">Highway Inn</div>
          </div>
          <button onClick={() => setMenuOpen(false)} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative z-10 px-6 pt-8 pb-8 flex flex-col h-[calc(100vh-100px)] justify-between overflow-y-auto">
          <div>
            {NAV_ITEMS.map((item, index) => (
              <MotionLink
                key={item.label}
                href={item.href}
                initial={false}
                target={item.label === "Sampan Group" ? "_blank" : undefined}
                rel={item.label === "Sampan Group" ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between py-5 border-b border-white/[0.08]"
              >
                <div className="flex items-center gap-5">
                  {/* Changed to light by default, darker on hover */}
                  <span className="text-[9px] text-white/50 group-hover:text-white/20 transition-colors">{item.number}</span>
                  <span className="text-2xl font-light tracking-tight text-white group-hover:text-white/40 transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight size={18} className="text-white/30 group-hover:text-primary group-hover:rotate-45 transition-all duration-500" />
              </MotionLink>
            ))}
          </div>

          <div className="mt-10">
            <MotionLink
              href="#membership"
              initial={false}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-white text-[11px] uppercase tracking-[0.2em] font-medium"
            >
              Get Membership
              <ArrowUpRight size={16} />
            </MotionLink>

            {/* Detailed Contact Info Grid */}
            <div className="mt-10 grid grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 mb-2 flex items-center gap-1.5">
                  <Phone size={10} strokeWidth={1.5} /> Call us
                </p>
                <a href="tel:+8801906896326" className="text-[13px] text-white/60 hover:text-white transition-colors block">
                  +880 1906-896326
                </a>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 mb-2 flex items-center gap-1.5">
                  <Mail size={10} strokeWidth={1.5} /> Email us
                </p>
                <a href="mailto:info@sampangroup.com.bd" className="text-[13px] text-white/60 hover:text-white transition-colors block break-all">
                  info@sampangroup.com.bd
                </a>
              </div>
            </div>

            <div className="mt-6 text-left">
              <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 mb-2 flex items-center gap-1.5">
                <MapPin size={10} strokeWidth={1.5} /> Visit us
              </p>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Head Office: Sampan 21st Century, House-284, Block-B Road-1/A, Bashundhara, Dhaka-1229, Bangladesh.
              </p>
            </div>

            <div className="flex justify-center gap-6 mt-10 pt-8 border-t border-white/[0.04]">
              <a href="tel:+8801906896326" className="text-white/50 hover:text-primary transition-colors"><Phone size={16} /></a>
              <a href="https://www.linkedin.com/company/sampangroup/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors"><FaLinkedinIn size={16} /></a>
              <a href="mailto:info@sampangroup.com.bd" className="text-white/50 hover:text-primary transition-colors"><Mail size={16} /></a>
              <a href="https://www.facebook.com/expresshighwayinn/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors"><FaFacebookF size={16} /></a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}