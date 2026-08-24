"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSplitText } from "@/lib/use-split-text";
import { useImageParallax } from "@/lib/use-parallax";
import { useAnimation } from "@/lib/animation-provider";
import { useSplashVisible } from "@/lib/splash-context";
import { cn } from "@/app/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════
   PRIMARY COLOR CONSTANTS (canvas / inline styles)
   CSS variables handle Tailwind classes; these handle dynamic RGBA.
   ═══════════════════════════════════════════════════════════════ */
const PC = { r: 0, g: 125, b: 197 };
const rgba = (a: number) => `rgba(${PC.r},${PC.g},${PC.b},${a})`;

// ═══════════════════════════════════════════
// FRAMER MOTION VARIANTS
// ═══════════════════════════════════════════
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const badgeVariants = {
  hidden: { y: -20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut, delay: 0.1 },
  },
};

const ctaContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 1.2 } },
};

const ctaChildVariants = {
  hidden: { y: 30, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOut },
  },
};

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 2 } },
};

// ═══════════════════════════════════════════
// MOUSE POSITION TYPE
// ═══════════════════════════════════════════
interface MousePos {
  x: number;
  y: number;
  active: boolean;
}

// ═══════════════════════════════════════════
// 3D TILT BUTTON WITH GLARE
// ═══════════════════════════════════════════
function TiltButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 180;

    gsap.to(btn, {
      rotateX,
      rotateY,
      transformPerspective: 600,
      duration: 0.35,
      ease: "power2.out",
    });

    if (glareRef.current) {
      glareRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.35) 0%, transparent 50%)`;
      gsap.to(glareRef.current, { opacity: 0.15, duration: 0.2 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      rotateX: 0,
      rotateY: 0,
      transformPerspective: 600,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    }
  }, []);

  return (
    <button
      ref={btnRef}
      className={cn(className, "transform-gpu")}
      style={{ transformStyle: "preserve-3d" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ transform: "translateZ(40px)" }}
      />
    </button>
  );
}

// ═══════════════════════════════════════════
// ENHANCED PARTICLE FIELD (mouse reactive)
// ═══════════════════════════════════════════
function ParticleField({
  mouseRef,
}: {
  mouseRef: React.RefObject<MousePos | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
      phase: number;
      speed: number;
      tier: "small" | "bokeh";
      baseVx: number;
      baseVy: number;
    }

    const small: Particle[] = Array.from({ length: 40 }, () => {
      const vx = (Math.random() - 0.5) * 0.2;
      const vy = -Math.random() * 0.25 - 0.08;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 1.2 + 0.4,
        baseOpacity: Math.random() * 0.35 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.004,
        tier: "small" as const,
      };
    });

    const bokeh: Particle[] = Array.from({ length: 8 }, () => {
      const vx = (Math.random() - 0.5) * 0.08;
      const vy = -Math.random() * 0.1 - 0.02;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 3 + 2,
        baseOpacity: Math.random() * 0.08 + 0.02,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.002,
        tier: "bokeh" as const,
      };
    });

    const all = [...small, ...bokeh];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current?.x ?? 0.5;
      const my = mouseRef.current?.y ?? 0.5;
      const isActive = mouseRef.current?.active ?? false;

      for (const p of all) {
        /* Mouse repulsion */
        if (isActive) {
          const dx = p.x / w - mx;
          const dy = p.y / h - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const force = (0.15 - dist) * 0.15;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        /* Velocity restoration */
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;

        /* Damping */
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        /* Wrap */
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const opacity = p.baseOpacity * (0.3 + 0.7 * Math.sin(p.phase));

        if (p.tier === "bokeh") {
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 4,
          );
          grad.addColorStop(0, rgba(opacity));
          grad.addColorStop(0.4, rgba(opacity * 0.3));
          grad.addColorStop(1, rgba(0));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          /* Core dot */
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(opacity);
          ctx.fill();

          /* Glow halo */
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 5,
          );
          grad.addColorStop(0, rgba(opacity * 0.15));
          grad.addColorStop(1, rgba(0));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2]"
    />
  );
}

// ═══════════════════════════════════════════
// MAIN HERO COMPONENT
// ═══════════════════════════════════════════
export default function Hero() {
  const { scrollTo, isReducedMotion } = useAnimation();
  const splashVisible = useSplashVisible();

  /* `canAnimate` is false while splash covers the page.
     When splash fades, this flips to true and all entrance
     animations begin their sequences. */
  const canAnimate = !splashVisible && !isReducedMotion;

  // ── Section ──
  const sectionRef = useRef<HTMLElement>(null);

  // ── Background layers ──
  const bgMouseW1Ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgMouseW2Ref = useRef<HTMLDivElement>(null);
  const bgLayer2Ref = useRef<HTMLDivElement>(null);

  // ── Text ──
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // ── Atmosphere ──
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  // ── Content wrappers ──
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const contentTiltRef = useRef<HTMLDivElement>(null);

  // ── Interactive ──
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // ── Mouse (shared with particles) ──
  const mouseRef = useRef<MousePos>({ x: 0.5, y: 0.5, active: false });

  // ══════════════════════════════════════
  // SPLIT TEXT — gated by splash + reduced-motion
  // Parent has opacity-0 so text is invisible until GSAP takes over.
  // ══════════════════════════════════════
  useSplitText(titleLine1Ref, {
    types: "chars",
    preset: "3D",
    stagger: 0.03,
    duration: 1,
    delay: 0.2,
    disabled: !canAnimate,
  });

  useSplitText(subtitleRef, {
    types: "words",
    preset: "blur",
    stagger: 0.035,
    duration: 0.8,
    delay: 0.8,
    disabled: !canAnimate,
  });

  // ══════════════════════════════════════
  // TITLE LINE 2 — 3D FLIP (direct GSAP, no SplitType)
  // ══════════════════════════════════════
  useEffect(() => {
    const el = titleLine2Ref.current;
    if (!el || !canAnimate) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          rotateX: -80,
          opacity: 0,
          transformOrigin: "center bottom",
          filter: "blur(10px)",
        },
        {
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.5,
          ease: "power3.out",
        },
      );
    });
    return () => ctx.revert();
  }, [canAnimate]);

  // ══════════════════════════════════════
  // BACKGROUND SCROLL PARALLAX (always active — scroll-based)
  // ══════════════════════════════════════
  useImageParallax(bgRef, { scale: 1.3 });
  useImageParallax(bgLayer2Ref, { scale: 1.15 });

  // ══════════════════════════════════════
  // GSAP: ORBS + SCAN + SCROLL + MARQUEE
  // Orbs & scan run immediately (atmospheric, not entrance).
  // Content scroll-out is always active.
  // ══════════════════════════════════════
  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, {
        x: 80,
        y: -60,
        scale: 1.3,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(orb2Ref.current, {
        x: -60,
        y: 40,
        scale: 0.7,
        duration: 13,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: -4,
      });
      gsap.to(orb3Ref.current, {
        x: 30,
        y: -80,
        scale: 1.1,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: -7,
      });
      gsap.to(scanLineRef.current, {
        top: "100%",
        duration: 8,
        ease: "none",
        repeat: -1,
      });

      /* Content scrolls up + fades as user scrolls past hero */
      gsap.to(contentScrollRef.current, {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "65% top",
          scrub: true,
        },
      });

      /* Marquee accelerates slightly on scroll */
      gsap.to(marqueeRef.current, {
        xPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  // ══════════════════════════════════════
  // MOUSE REACTIVE 3D SYSTEM (single rAF)
  // ══════════════════════════════════════
  useEffect(() => {
    if (isReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const tilt = { rx: 0, ry: 0 };
    const bgOff = { x: 0, y: 0 };
    const glowPos = { x: -300, y: -300 };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    let raf: number;
    const loop = () => {
      const m = mouseRef.current;

      /* Content 3D tilt (max ±2.5°) */
      const tTarget = m.active
        ? { rx: -(m.y - 0.5) * 5, ry: (m.x - 0.5) * 5 }
        : { rx: 0, ry: 0 };
      tilt.rx += (tTarget.rx - tilt.rx) * 0.04;
      tilt.ry += (tTarget.ry - tilt.ry) * 0.04;
      if (contentTiltRef.current) {
        contentTiltRef.current.style.transform = `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`;
      }

      /* Background mouse parallax */
      const bTarget = m.active
        ? { x: (m.x - 0.5) * -16, y: (m.y - 0.5) * -10 }
        : { x: 0, y: 0 };
      bgOff.x += (bTarget.x - bgOff.x) * 0.025;
      bgOff.y += (bTarget.y - bgOff.y) * 0.025;
      if (bgMouseW1Ref.current) {
        bgMouseW1Ref.current.style.transform = `translate(${bgOff.x * 0.5}px, ${bgOff.y * 0.5}px)`;
      }
      if (bgMouseW2Ref.current) {
        bgMouseW2Ref.current.style.transform = `translate(${bgOff.x}px, ${bgOff.y}px)`;
      }

      /* Cursor glow follow */
      const gTarget = m.active
        ? {
            x: m.x * section.offsetWidth - 150,
            y: m.y * section.offsetHeight - 150,
          }
        : { x: -300, y: -300 };
      glowPos.x += (gTarget.x - glowPos.x) * 0.06;
      glowPos.y += (gTarget.y - glowPos.y) * 0.06;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${glowPos.x}px, ${glowPos.y}px)`;
        cursorGlowRef.current.style.opacity = m.active ? "1" : "0";
      }

      raf = requestAnimationFrame(loop);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [isReducedMotion]);

  const marqueeText =
    "EXPRESS  \u2022  HIGHWAY RESORT  \u2022  ROUTE 66  \u2022  ARIZONA  \u2022  LUXURY  \u2022  IMMERSIVE  \u2022  CINEMATIC  \u2022  EXPERIENCE  \u2022  ";

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="group/scene relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* ════════════════════════════════════════ */}
      {/* BACKGROUND LAYER 1                       */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={bgMouseW1Ref}
        className="absolute inset-0 will-change-transform"
      >
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage:
              "url('https://picsum.photos/seed/EXPRESS-hwy-night/1920/1080.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
      </div>

      {/* ════════════════════════════════════════ */}
      {/* BACKGROUND LAYER 2                       */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={bgMouseW2Ref}
        className="absolute inset-0 will-change-transform"
      >
        <div
          ref={bgLayer2Ref}
          className="absolute inset-0 will-change-transform mix-blend-overlay opacity-40"
          style={{
            backgroundImage:
              "url('https://picsum.photos/seed/EXPRESS-road-lights/1920/1080.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
          }}
        />
      </div>

      {/* ════════════════════════════════════════ */}
      {/* COLOR GRADE STACK                        */}
      {/* ════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-primary/[0.04]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, transparent 0%, var(--background) 100%)",
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* NOISE GRAIN                              */}
      {/* ════════════════════════════════════════ */}
      <svg
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full opacity-[0.035]"
        style={{ mixBlendMode: "overlay" }}
      >
        <filter id="heroNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroNoise)" />
      </svg>

      {/* ════════════════════════════════════════ */}
      {/* PARTICLES (mouse reactive)               */}
      {/* ════════════════════════════════════════ */}
      {!isReducedMotion && <ParticleField mouseRef={mouseRef} />}

      {/* ════════════════════════════════════════ */}
      {/* FLOATING ORBS                            */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={orb1Ref}
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-[140px] will-change-transform"
      />
      <div
        ref={orb2Ref}
        className="pointer-events-none absolute -right-32 bottom-[10%] h-[500px] w-[500px] rounded-full bg-secondary/[0.03] blur-[120px] will-change-transform"
      />
      <div
        ref={orb3Ref}
        className="pointer-events-none absolute left-[30%] -top-20 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-[100px] will-change-transform"
      />

      {/* ════════════════════════════════════════ */}
      {/* SCAN LINE                                */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={scanLineRef}
        className="pointer-events-none absolute left-0 right-0 z-[4] h-px will-change-transform"
        style={{
          top: "-2px",
          background: `linear-gradient(90deg, transparent 0%, ${rgba(0.06)} 20%, ${rgba(0.12)} 50%, ${rgba(0.06)} 80%, transparent 100%)`,
          boxShadow: `0 0 30px 10px ${rgba(0.03)}`,
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* HORIZONTAL ACCENT LINES                 */}
      {/* ════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col justify-center px-[8%] lg:px-[12%]">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* CURSOR GLOW (mouse follow)              */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={cursorGlowRef}
        className="pointer-events-none absolute left-0 top-0 z-[7] h-[300px] w-[300px] rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${rgba(0.07)} 0%, transparent 70%)`,
          transform: "translate(-300px, -300px)",
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* MAIN CONTENT                             */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={contentScrollRef}
        className="relative z-[6] mx-auto w-full max-w-6xl px-6 pt-20 text-center lg:px-8"
      >
        <div
          ref={contentTiltRef}
          className="will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1200px",
          }}
        >
          {/* ── Badge ── */}
          <motion.div
            variants={badgeVariants}
            initial={isReducedMotion ? "visible" : "hidden"}
            animate={isReducedMotion || canAnimate ? "visible" : "hidden"}
            className="mb-10 inline-flex items-center gap-3 rounded-full border border-primary/15 bg-primary/[0.04] px-6 py-2.5 backdrop-blur-xl"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-primary/80">
              Now Accepting Reservations
            </span>
          </motion.div>

          {/* ── Title Line 1 (SplitText) ── */}
          <h1
            ref={titleLine1Ref}
            className={cn(
              "font-serif text-[clamp(3rem,11vw,9rem)] font-normal leading-[0.9] tracking-[-0.03em] text-foreground",
              /* Hidden until GSAP takes over; always visible if reduced-motion */
              !isReducedMotion && "opacity-0",
            )}
            style={{ perspective: "600px" }}
          >
            Where The
          </h1>

          {/* ── Title Line 2 (GSAP 3D flip — gradient) ── */}
          <h1
            ref={titleLine2Ref}
            className={cn(
              "mt-1 font-serif text-[clamp(3rem,11vw,9rem)] font-normal leading-[0.9] tracking-[-0.03em] text-transparent",
              !isReducedMotion && "opacity-0",
            )}
            style={{
              perspective: "600px",
              backgroundImage:
                "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 40%, var(--primary) 80%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              animation: "gradientShift 6s ease-in-out infinite",
            }}
          >
            Highway Meets Luxury
          </h1>

          {/* ── Divider ── */}
          <motion.div
            initial={
              isReducedMotion
                ? { scaleX: 1, opacity: 1 }
                : { scaleX: 0, opacity: 0 }
            }
            animate={
              isReducedMotion
                ? { scaleX: 1, opacity: 1 }
                : canAnimate
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 1.2, ease: easeOut, delay: 1 }}
            className="group/divider relative mx-auto mt-8 h-px w-16 origin-center cursor-default bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          >
            <div className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-primary/80 to-transparent transition-transform duration-1000 ease-out group-hover/divider:translate-x-[250%]" />
          </motion.div>

          {/* ── Subtitle (SplitText) ── */}
          <p
            ref={subtitleRef}
            className={cn(
              "mx-auto mt-8 max-w-lg text-[13px] leading-[1.8] tracking-[0.18em] uppercase text-muted-foreground/70",
              !isReducedMotion && "opacity-0",
            )}
            style={{ perspective: "600px" }}
          >
            An unparalleled resort experience nestled along the most scenic
            highway — where every mile brings you closer to extraordinary
          </p>

          {/* ── CTAs ── */}
          <motion.div
            variants={ctaContainerVariants}
            initial={isReducedMotion ? "visible" : "hidden"}
            animate={isReducedMotion || canAnimate ? "visible" : "hidden"}
            className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
          >
            {/* Primary CTA */}
            <TiltButton
              onClick={() => scrollTo("#booking")}
              className={cn(
                "group relative inline-flex items-center gap-3",
                "px-10 py-5",
                "text-[10px] font-bold tracking-[0.3em] uppercase text-primary-foreground bg-primary",
                "transition-shadow duration-[600ms]",
                `hover:shadow-[0_0_60px_-10px_${rgba(0.5)}]`,
              )}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span
                className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                }}
              />
              <span className="relative z-10">Reserve Your Stay</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </TiltButton>

            {/* Secondary CTA */}
            <TiltButton
              onClick={() => scrollTo("#experience")}
              className={cn(
                "group relative inline-flex items-center gap-3",
                "border border-border/40 px-10 py-5",
                "text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/80",
                "bg-transparent backdrop-blur-sm",
                "transition-all duration-[600ms]",
                "hover:border-primary/30 hover:text-foreground",
                `hover:shadow-[0_0_30px_-8px_${rgba(0.15)}]`,
              )}
            >
              <span className="relative z-10">Explore</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </TiltButton>
          </motion.div>

          {/* ── Micro info ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isReducedMotion
                ? { opacity: 1 }
                : canAnimate
                  ? { opacity: 1 }
                  : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-16 flex items-center justify-center gap-6 text-[9px] tracking-[0.25em] uppercase text-muted-foreground/30"
          >
            <span>Route 66</span>
            <span className="h-px w-6 bg-border/40" />
            <span>Arizona</span>
            <span className="h-px w-6 bg-border/40" />
            <span>Est. 2024</span>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* SCROLL INDICATOR                        */}
      {/* ════════════════════════════════════════ */}
      <motion.div
        variants={scrollIndicatorVariants}
        initial={isReducedMotion ? "visible" : "hidden"}
        animate={isReducedMotion || canAnimate ? "visible" : "hidden"}
        className="absolute bottom-24 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[8px] tracking-[0.4em] uppercase text-muted-foreground/25">
          Scroll
        </span>
        <button
          onClick={() => scrollTo("#experience")}
          className="group relative flex h-12 w-[22px] items-start justify-center rounded-full border border-border/30 p-2 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_15px_-3px_rgba(0,125,197,0.2)]"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
            className="h-1 w-1 rounded-full bg-primary/40 transition-all duration-500 group-hover:bg-primary group-hover:shadow-[0_0_6px_rgba(0,125,197,0.6)]"
          />
        </button>
      </motion.div>

      {/* ════════════════════════════════════════ */}
      {/* MARQUEE TICKER                          */}
      {/* ════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-[6] overflow-hidden border-t border-border/10">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          <span className="inline-block px-4 py-3 text-[9px] tracking-[0.35em] uppercase text-muted-foreground/20">
            {marqueeText}
          </span>
          <span className="inline-block px-4 py-3 text-[9px] tracking-[0.35em] uppercase text-muted-foreground/20">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* SIDE DECORATIONS                        */}
      {/* ════════════════════════════════════════ */}
      {/* Left */}
      <div className="pointer-events-none absolute left-5 top-1/2 z-[6] hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent transition-colors duration-700 group-hover/scene:via-primary/20" />
          <span
            className="text-[8px] tracking-[0.35em] uppercase text-muted-foreground/15 transition-all duration-700 group-hover/scene:text-muted-foreground/40"
            style={{ writingMode: "vertical-rl" }}
          >
            EXPRESS
          </span>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent transition-colors duration-700 group-hover/scene:via-primary/20" />
        </div>
      </div>

      {/* Right */}
      <div className="pointer-events-none absolute right-5 top-1/2 z-[6] hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent transition-colors duration-700 group-hover/scene:via-primary/20" />
          <span
            className="text-[8px] tracking-[0.35em] uppercase text-muted-foreground/15 transition-all duration-700 group-hover/scene:text-muted-foreground/40"
            style={{ writingMode: "vertical-rl" }}
          >
            35&#x2032;32&#x2033;N 111&#x2032;42&#x2033;W
          </span>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent transition-colors duration-700 group-hover/scene:via-primary/20" />
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* CORNER BRACKETS                         */}
      {/* ════════════════════════════════════════ */}
      {/* Top-Left */}
      <div className="pointer-events-none absolute left-6 top-24 z-[6] hidden h-10 w-10 lg:block">
        <div className="absolute left-0 top-0 h-px w-6 bg-primary/20 transition-all duration-500 group-hover/scene:w-8 group-hover/scene:bg-primary/40" />
        <div className="absolute left-0 top-0 h-6 w-px bg-primary/20 transition-all duration-500 group-hover/scene:h-8 group-hover/scene:bg-primary/40" />
      </div>
      {/* Top-Right */}
      <div className="pointer-events-none absolute right-6 top-24 z-[6] hidden h-10 w-10 lg:block">
        <div className="absolute right-0 top-0 h-px w-6 bg-primary/20 transition-all duration-500 group-hover/scene:w-8 group-hover/scene:bg-primary/40" />
        <div className="absolute right-0 top-0 h-6 w-px bg-primary/20 transition-all duration-500 group-hover/scene:h-8 group-hover/scene:bg-primary/40" />
      </div>
      {/* Bottom-Left */}
      <div className="pointer-events-none absolute bottom-24 left-6 z-[6] hidden h-10 w-10 lg:block">
        <div className="absolute bottom-0 left-0 h-px w-6 bg-primary/20 transition-all duration-500 group-hover/scene:w-8 group-hover/scene:bg-primary/40" />
        <div className="absolute bottom-0 left-0 h-6 w-px bg-primary/20 transition-all duration-500 group-hover/scene:h-8 group-hover/scene:bg-primary/40" />
      </div>
      {/* Bottom-Right */}
      <div className="pointer-events-none absolute bottom-24 right-6 z-[6] hidden h-10 w-10 lg:block">
        <div className="absolute bottom-0 right-0 h-px w-6 bg-primary/20 transition-all duration-500 group-hover/scene:w-8 group-hover/scene:bg-primary/40" />
        <div className="absolute bottom-0 right-0 h-6 w-px bg-primary/20 transition-all duration-500 group-hover/scene:h-8 group-hover/scene:bg-primary/40" />
      </div>
    </section>
  );
}
