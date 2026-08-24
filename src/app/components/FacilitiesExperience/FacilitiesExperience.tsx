/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─────────────────────────────────────────────
   1. FACILITY DATA & CATEGORIES
   ───────────────────────────────────────────── */
type Facility = {
  id: number;
  name: string;
  tagline: string;
  category: string;
  src: string;
};

const facilities: Facility[] = [
  {
    id: 1,
    name: "Highway Club & Lounge",
    tagline: "Elegance Redefined",
    category: "Leisure",
    src: "https://images.unsplash.com/photo-1584132967334-10e028070cc1?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Billiards",
    tagline: "Fun, Skill, Competition",
    category: "Leisure",
    src: "https://images.unsplash.com/photo-1612564237258-0f1688d4d7f9?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Card Rooms",
    tagline: "Play, Strategy, Enjoyment",
    category: "Leisure",
    src: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Super Shop",
    tagline: "Fulfill Your Daily Needs",
    category: "Convenience",
    src: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "VVIP Lounge",
    tagline: "Exclusive, Luxury, Comfort",
    category: "Luxury",
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "EV Car Charging",
    tagline: "Fast, Convenient",
    category: "Convenience",
    src: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Automatic Car Wash",
    tagline: "Quick, Efficient",
    category: "Convenience",
    src: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Salon & SPA",
    tagline: "Pamper Yourself Daily",
    category: "Luxury",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "GYM",
    tagline: "Strength, Fitness, Wellness",
    category: "Wellness",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "Swimming Pool",
    tagline: "Relax, Refresh, Rejuvenate",
    category: "Wellness",
    src: "https://images.unsplash.com/photo-1582736317407-4c1b9e6b6d0f?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 11,
    name: "Prayers Room",
    tagline: "Peaceful, Serene, Sacred",
    category: "Spiritual",
    src: "https://images.unsplash.com/photo-1592216504820-94ae23a6d2c1?q=85&w=1920&auto=format&fit=crop",
  },
  {
    id: 12,
    name: "CRM Banking Booth 24/7",
    tagline: "Convenient, Accessible, Reliable",
    category: "Convenience",
    src: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=85&w=1920&auto=format&fit=crop",
  },
];

/* ─────────────────────────────────────────────
   2. MAIN COMPONENT LOGIC
   ───────────────────────────────────────────── */
export default function FacilitiesExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Global mouse tracking for image parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, {
    damping: 40,
    stiffness: 150,
    mass: 0.5,
  });
  const smoothMouseY = useSpring(mouseY, {
    damping: 40,
    stiffness: 150,
    mass: 0.5,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useGSAP(() => {
    if (headlineRef.current) {
      const split = new SplitType(headlineRef.current, {
        types: "lines,words", // Fixed syntax here
        lineClass: "overflow-hidden block",
        wordClass: "inline-block will-change-transform",
      });

      if (split.words) {
        gsap.set(split.words, { yPercent: 120, opacity: 0 });
        gsap.to(split.words, {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 60%" },
        });
      }
    }

    // Pinned Scroll Sequence Logic (Desktop only)
    if (!isMobile && stickyRef.current && containerRef.current) {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 8}`, // 8x viewport height for 12 slides
        pin: stickyRef.current,
        scrub: 1,
        onUpdate: (self) => {
          const newIndex = Math.min(11, Math.floor(self.progress * 12));
          if (newIndex !== activeIndex) setActiveIndex(newIndex);

          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleY(${self.progress})`;
          }
        },
        onLeaveBack: () => {
          setActiveIndex(0);
          if (progressLineRef.current)
            progressLineRef.current.style.transform = `scaleY(0)`;
        },
      });

      return () => {
        st.kill();
      };
    }
  }, [isMobile, activeIndex]);

  const currentFacility = facilities[activeIndex];
  const isHoveringNav = hoveredIndex !== null;
  const previewFacility = facilities[hoveredIndex || 0];

  // Image Parallax Transforms
  const imageX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const imageY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#050608] text-white"
    >
      {/* ── INTRO SECTION ── */}
      <div className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto w-full">
          <span className="block text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-blue-400 font-mono mb-6 md:mb-8">
            Era Residence / Experiences
          </span>
          <h1
            ref={headlineRef}
            className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-light tracking-tight"
          >
            Everything You Need.
            <br />
            Within Reach.
          </h1>
          <div className="mt-12 max-w-xl">
            <p className="text-sm md:text-base text-white/40 leading-relaxed tracking-wide">
              Designed around comfort, leisure, wellness and everyday
              convenience — every facility is thoughtfully curated to elevate
              your stay.
            </p>
          </div>
        </div>
      </div>

      {/* ── MOBILE VERTICAL EXPERIENCE ── */}
      {isMobile ? (
        <div className="relative px-6 pb-32 flex flex-col gap-24">
          {facilities.map((facility, index) => (
            <MobileFacilityCard
              key={facility.id}
              facility={facility}
              index={index}
            />
          ))}
        </div>
      ) : (
        /* ── DESKTOP PINNED CINEMATIC EXPERIENCE ── */
        <>
          {/* Pinned Container */}
          <div
            ref={stickyRef}
            className="relative w-full h-screen overflow-hidden"
          >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundColor:
                    currentFacility.category === "Luxury"
                      ? "#080a0d"
                      : currentFacility.category === "Wellness"
                        ? "#05070a"
                        : "#050608",
                }}
                transition={{ duration: 1.5 }}
              />
            </div>

            {/* Main Asymmetric Layout */}
            <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-12 flex items-center justify-between">
              {/* Left: Typography & Metadata */}
              <div className="w-1/3 relative z-20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest">
                    {String(activeIndex + 1).padStart(2, "0")} / 12
                  </span>
                  <div className="h-px w-12 bg-blue-400/50"></div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
                    {currentFacility.category}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${activeIndex}`}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-6xl font-light leading-[0.9] tracking-tight mb-4">
                      {currentFacility.name}
                    </h2>
                    <p className="text-lg text-white/60 italic">
                      {currentFacility.tagline}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-[-100px] left-0 flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/30 font-mono">
                  <span>Era Residence</span>
                  <div className="w-6 h-px bg-white/20"></div>
                  <span>Scroll to explore ↓</span>
                </div>
              </div>

              {/* Right: Cinematic Image System */}
              <div className="absolute top-0 right-0 w-[60%] h-full flex items-center justify-center">
                {/* Active Image */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`img-${activeIndex}`}
                    className="relative w-full h-[75vh] overflow-hidden rounded-sm"
                    initial={{
                      opacity: 0,
                      scale: 1.1,
                      clipPath: "inset(100% 0 0 0)",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      clipPath: "inset(0% 0 0 0)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      clipPath: "inset(0 0 100% 0)",
                    }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      style={{ x: imageX, y: imageY }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={currentFacility.src}
                        alt={currentFacility.name}
                        fill
                        priority={activeIndex === 0}
                        className="object-cover"
                        sizes="60vw"
                      />
                      {/* Subtle Image Grain/Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                    </motion.div>

                    {/* Border Frame */}
                    <div className="absolute inset-4 border border-white/10 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Nav Hover Peek Preview */}
                <AnimatePresence>
                  {isHoveringNav && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-[15%] right-[10%] w-64 h-40 z-30 border border-white/10 overflow-hidden shadow-2xl pointer-events-none"
                    >
                      <Image
                        src={previewFacility.src}
                        alt={previewFacility.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                        <span className="text-xs text-white font-light">
                          {previewFacility.name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Navigation Rail */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 h-[60vh] flex items-start gap-4">
              {/* Progress Line Container */}
              <div className="relative h-full w-px bg-white/10 mt-2">
                <motion.div
                  ref={progressLineRef}
                  className="absolute top-0 left-0 w-full bg-blue-400 origin-top"
                  style={{ height: "100%", scaleY: 0 }}
                />
              </div>

              {/* Nav List */}
              <div className="flex flex-col gap-1 overflow-y-auto h-full pr-2 hide-scrollbar">
                {facilities.map((facility, index) => (
                  <button
                    key={facility.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      // Optional: Scroll to specific facility instantly
                      const targetY =
                        containerRef.current!.offsetTop +
                        window.innerHeight +
                        window.innerHeight * 8 * (index / 12);
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }}
                    className={`flex items-center gap-3 py-1 text-left transition-all duration-300 ${
                      activeIndex === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-40 -translate-x-2 hover:opacity-80"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono ${activeIndex === index ? "text-blue-400" : "text-white/50"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[10px] tracking-[0.2em] uppercase ${activeIndex === index ? "text-white" : "text-white/60"}`}
                    >
                      {facility.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. MOBILE FACILITY CARD COMPONENT
   ───────────────────────────────────────────── */
function MobileFacilityCard({
  facility,
  index,
}: {
  facility: Facility;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Simple viewport entry animation
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative w-full">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] font-mono text-blue-400 tracking-widest">
          {String(index + 1).padStart(2, "0")} / 12
        </span>
        <div className="h-px w-8 bg-blue-400/50"></div>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/50">
          {facility.category}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-light leading-[0.9] tracking-tight mb-2">
          {facility.name}
        </h2>
        <p className="text-sm text-white/50 italic mb-6">{facility.tagline}</p>

        <div className="relative w-full h-[50vh] overflow-hidden rounded-sm">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src={facility.src}
              alt={facility.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
          </motion.div>
          <div className="absolute inset-3 border border-white/10 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}
