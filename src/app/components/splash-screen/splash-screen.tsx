"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Background Layers ──
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const bgGradient2Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const ambientLightRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  // ── Border & Frame ──
  const borderFrameRef = useRef<HTMLDivElement>(null);
  const borderPathRef = useRef<SVGPathElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);

  // ── Corner Accents ──
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);

  // ── Content ──
  const contentStackRef = useRef<HTMLDivElement>(null);
  const topLabelRef = useRef<HTMLDivElement>(null);
  const subLabelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterGlowRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressDotRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const phaseLabel1Ref = useRef<HTMLDivElement>(null);
  const phaseLabel2Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoAccentRef = useRef<HTMLDivElement>(null);

  // ── Side Decorations ──
  const sideLeftRef = useRef<HTMLDivElement>(null);
  const sideRightRef = useRef<HTMLDivElement>(null);

  // ── Effects ──
  const sweepLineRef = useRef<HTMLDivElement>(null);
  const sweepGlowRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const exitFlashRef = useRef<HTMLDivElement>(null);

  const activeLabelRef = useRef(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    /* ═══════════════════════════════════════════════════ *
     *  SPLIT TEXT HELPER                                    *
     *  Blur + Opacity + Y translation + Slight rotation    *
     * ═══════════════════════════════════════════════════ */
    const splitText = (el: HTMLElement | null) => {
      if (!el) return [];
      const text = el.textContent || "";
      el.textContent = "";
      const chars: HTMLSpanElement[] = [];
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(110%) rotate(5deg)";
        span.style.filter = "blur(8px)";
        span.style.willChange = "transform, opacity, filter";
        el.appendChild(span);
        chars.push(span);
      });
      return chars;
    };

    const topChars = splitText(topLabelRef.current);
    const subChars = splitText(subLabelRef.current);

    /* ═══════════════════════════════════════════════════ *
     *  FLOATING PARTICLES                                   *
     *  Extremely few · Slow · Opacity < 5%                 *
     * ═══════════════════════════════════════════════════ */
    const particles: HTMLDivElement[] = [];
    if (particleContainerRef.current) {
      for (let i = 0; i < 7; i++) {
        const p = document.createElement("div");
        p.style.position = "absolute";
        const size = 1 + Math.random() * 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.borderRadius = "50%";
        p.style.background = "rgba(255,255,255,0.5)";
        p.style.left = `${10 + Math.random() * 80}%`;
        p.style.top = `${10 + Math.random() * 80}%`;
        p.style.opacity = "0";
        p.style.willChange = "transform, opacity";
        particleContainerRef.current.appendChild(p);
        particles.push(p);
      }
    }

    /* ═══════════════════════════════════════════════════ *
     *  GSAP CONTEXT                                         *
     * ═══════════════════════════════════════════════════ */
    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────────
       *  CONTINUOUS ANIMATIONS — Start immediately
       *  These run in parallel with the main timeline
       * ───────────────────────────────────────────────── */

      // 1. Breathing background gradient (Layer 1)
      gsap.to(bgGradientRef.current, {
        scale: 1.12,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 2. Secondary gradient — slower, different phase (Layer 2)
      gsap.to(bgGradient2Ref.current, {
        scale: 1.18,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 3. Animated grid — slow vertical drift + opacity breathing
      gsap.to(gridRef.current, {
        backgroundPositionY: "80px",
        duration: 22,
        ease: "none",
        repeat: -1,
      });
      gsap.to(gridRef.current, {
        opacity: 0.02,
        duration: 10,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 4. Animated grain — very slow continuous shift
      gsap.to(grainRef.current, {
        backgroundPositionX: "128px",
        backgroundPositionY: "128px",
        duration: 12,
        ease: "none",
        repeat: -1,
      });

      // 5. Ambient volumetric light — slow L→R sweep (showroom lighting)
      gsap.fromTo(
        ambientLightRef.current,
        { xPercent: -40 },
        {
          xPercent: 40,
          duration: 12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
      gsap.to(ambientLightRef.current, {
        opacity: 0.5,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 6. Floating particles — barely perceptible
      particles.forEach((p, i) => {
        gsap.to(p, {
          opacity: 0.015 + Math.random() * 0.025,
          duration: 2.5,
          ease: "sine.out",
          delay: 1.5 + i * 0.4,
        });
        gsap.to(p, {
          y: `${(Math.random() - 0.5) * 120}px`,
          x: `${(Math.random() - 0.5) * 80}px`,
          duration: 18 + Math.random() * 12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(p, {
          scale: 0.4 + Math.random() * 0.6,
          duration: 6 + Math.random() * 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // 7. Breathing counter glow — continuous 0.8 → 1.0 → 0.8
      gsap.to(counterGlowRef.current, {
        scale: 1.0,
        opacity: 0.07,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 8. Progress bar moving gradient
      gsap.to(progressFillRef.current, {
        backgroundPositionX: "200%",
        duration: 3.5,
        ease: "none",
        repeat: -1,
      });

      // 9. Progress dot pulse
      gsap.to(progressDotRef.current, {
        boxShadow:
          "0 0 14px 3px rgba(0,125,197,0.7), 0 0 40px 10px rgba(0,125,197,0.25)",
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 10. Logo accent subtle pulse
      gsap.to(logoAccentRef.current, {
        opacity: 0.8,
        scale: 1.3,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* ─────────────────────────────────────────────────
       *  PHASES
       * ───────────────────────────────────────────────── */
      const phases = [
        { threshold: 0, label: "INITIALIZING SYSTEMS" },
        { threshold: 18, label: "LOADING ASSETS" },
        { threshold: 40, label: "RENDERING EXPERIENCE" },
        { threshold: 65, label: "OPTIMIZING SHADERS" },
        { threshold: 88, label: "FINALIZING" },
        { threshold: 100, label: "WELCOME" },
      ];

      /* ─────────────────────────────────────────────────
       *  MAIN TIMELINE
       * ───────────────────────────────────────────────── */
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          /* ═══════════════════════════════════════════════════
           *  CINEMATIC EXIT TRANSITION
           *
           *  1. Camera zooms back out
           *  2. Everything fades + blur increases
           *  3. Sweep line crosses screen
           *  4. Ambient light intensifies
           *  5. Camera zooms in
           *  6. Soft white light flash
           *  7. Flash fades → hero reveals
           * ═══════════════════════════════════════════════════ */
          const exitTl = gsap.timeline({ onComplete: () => onComplete() });

          const contentEls = [
            counterRef.current,
            counterGlowRef.current,
            progressTrackRef.current,
            progressFillRef.current,
            progressDotRef.current,
            progressGlowRef.current,
            phaseLabel1Ref.current,
            phaseLabel2Ref.current,
            logoRef.current,
            logoAccentRef.current,
            centerLineRef.current,
            sideLeftRef.current,
            sideRightRef.current,
            cornerTLRef.current,
            cornerTRRef.current,
            cornerBLRef.current,
            cornerBRRef.current,
            borderFrameRef.current,
            ...topChars,
            ...subChars,
            ...particles,
          ].filter(Boolean);

          // 1. Camera zooms back out (from loading zoom)
          exitTl.to(
            panelRef.current,
            { scale: 1, duration: 0.6, ease: "expo.out" },
            0,
          );

          // 2. Everything blurs and fades (stagger)
          exitTl.to(
            contentEls,
            {
              filter: "blur(16px)",
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              stagger: 0.006,
            },
            0.1,
          );

          // 3. Sweep line + glow — final pass
          exitTl.set(sweepLineRef.current, { left: "-4px", opacity: 1 }, 0.35);
          exitTl.set(
            sweepGlowRef.current,
            { left: "-120px", opacity: 1 },
            0.35,
          );
          exitTl.to(
            sweepLineRef.current,
            {
              left: "calc(100% + 4px)",
              duration: 0.5,
              ease: "power3.inOut",
            },
            0.35,
          );
          exitTl.to(
            sweepGlowRef.current,
            {
              left: "calc(100% + 120px)",
              duration: 0.5,
              ease: "power3.inOut",
            },
            0.35,
          );

          // 4. Ambient light intensifies
          exitTl.to(
            ambientLightRef.current,
            { opacity: 0.8, duration: 0.4, ease: "power2.in" },
            0.4,
          );

          // 5. Camera zooms in
          exitTl.to(
            panelRef.current,
            { scale: 1.04, duration: 0.5, ease: "power2.in" },
            0.5,
          );

          // 6. Soft white light flash
          exitTl.to(
            exitFlashRef.current,
            { opacity: 1, duration: 0.25, ease: "power2.in" },
            0.75,
          );

          // Hide all content behind flash
          exitTl.set(contentEls, { visibility: "hidden" }, 1.0);

          // 7. Flash fades out → hero reveals
          exitTl.to(
            exitFlashRef.current,
            { opacity: 0, duration: 0.7, ease: "power2.out" },
            1.05,
          );
          exitTl.to(
            panelRef.current,
            { scale: 1, duration: 0.9, ease: "expo.out" },
            1.05,
          );
        },
      });

      /* ═══════════════════════════════════════════════════
       *  TIMELINE SEQUENCE
       * ═══════════════════════════════════════════════════ */

      // 1. Cinematic camera slowly zooms in (imperceptible)
      tl.from(
        panelRef.current,
        { scale: 0.985, duration: 5.5, ease: "power1.inOut" },
        0,
      );

      // 2. SVG Border Drawing — Top → Right → Bottom → Left
      if (borderPathRef.current) {
        const path = borderPathRef.current;
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: "power2.inOut",
          },
          0.2,
        );
      }

      // 3. Corner Accents — draw + glow + elastic settle
      const corners = [
        cornerTLRef.current,
        cornerTRRef.current,
        cornerBLRef.current,
        cornerBRRef.current,
      ].filter((c): c is HTMLDivElement => c !== null);

      corners.forEach((c, i) => {
        const lines = c.querySelectorAll<HTMLDivElement>(".corner-line");
        const glow = c.querySelector<HTMLDivElement>(".corner-glow");
        gsap.set(lines, { scaleX: 0, scaleY: 0 });
        gsap.set(glow, { opacity: 0, scale: 0.4 });

        tl.to(
          lines,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.08,
          },
          0.5 + i * 0.08,
        );

        tl.to(
          glow,
          {
            opacity: 0.5,
            scale: 1,
            duration: 1.4,
            ease: "elastic.out(1, 0.7)",
          },
          0.7 + i * 0.08,
        );

        // Subtle settle
        tl.to(
          lines,
          { scale: 0.97, duration: 0.8, ease: "elastic.out(1, 0.5)" },
          1.6 + i * 0.08,
        );
      });

      // 4. Center line extends
      tl.set(centerLineRef.current, { scaleX: 0 });
      tl.to(
        centerLineRef.current,
        { scaleX: 1, duration: 1.6, ease: "expo.out" },
        0.4,
      );

      // 5. Typography Reveal — blur + opacity + Y + rotation + settle
      tl.to(
        topChars,
        {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          rotation: 0,
          duration: 1.5,
          stagger: 0.035,
          ease: "expo.out",
        },
        0.7,
      );

      tl.to(
        subChars,
        {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          rotation: 0,
          duration: 1.3,
          stagger: 0.025,
          ease: "expo.out",
        },
        0.9,
      );

      // 6. Content fade in — blur + opacity + Y
      const fadeEls = [
        counterRef.current,
        counterGlowRef.current,
        progressTrackRef.current,
        phaseLabel1Ref.current,
        logoRef.current,
      ].filter(Boolean);

      tl.set(fadeEls, { opacity: 0, y: 30, filter: "blur(8px)" });
      tl.to(
        fadeEls,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.6,
          stagger: 0.1,
          ease: "expo.out",
        },
        1.1,
      );

      tl.set(logoAccentRef.current, { opacity: 0, scale: 0 });
      tl.to(
        logoAccentRef.current,
        { opacity: 0.6, scale: 1, duration: 1, ease: "expo.out" },
        1.4,
      );

      // 7. Side decorations
      tl.set([sideLeftRef.current, sideRightRef.current], {
        opacity: 0,
        x: (i: number) => (i === 0 ? -20 : 20),
      });
      tl.to(
        [sideLeftRef.current, sideRightRef.current],
        { opacity: 1, x: 0, duration: 1.4, ease: "expo.out" },
        1.5,
      );

      // 8. Premium Counter + Progress (digit-strip animation)
      let currentPhase = -1;
      const progressObj = { value: 0 };

      tl.to(
        progressObj,
        {
          value: 100,
          duration: 4.2,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(progressObj.value);
            const digits = String(v).padStart(3, "0").split("");

            // ── Digit strip animation ──
            digits.forEach((d, i) => {
              const strip = stripRefs.current[i];
              if (!strip) return;

              const lastDigit = parseInt(strip.dataset.digit || "0");
              const newDigit = parseInt(d);

              if (lastDigit !== newDigit) {
                strip.dataset.digit = String(newDigit);

                // Slide upward to new digit
                gsap.to(strip, {
                  yPercent: -newDigit * 10,
                  duration: 0.9,
                  ease: "expo.out",
                });

                // Blur during change, snap clear
                gsap
                  .timeline()
                  .to(strip, { filter: "blur(3px)", duration: 0.1 })
                  .to(strip, {
                    filter: "blur(0px)",
                    duration: 0.4,
                    delay: 0.15,
                  });

                // Emit soft glow pulse
                gsap.fromTo(
                  counterGlowRef.current,
                  { scale: 1.15, opacity: 0.12 },
                  {
                    scale: 1.0,
                    opacity: 0.05,
                    duration: 0.9,
                    ease: "expo.out",
                  },
                );
              }
            });

            // ── Progress bar ──
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${v}%`;
            }
            if (progressDotRef.current) {
              progressDotRef.current.style.left = `calc(${v}% - 3px)`;
            }
            if (progressGlowRef.current) {
              progressGlowRef.current.style.left = `calc(${v}% - 20px)`;
              progressGlowRef.current.style.opacity = `${0.3 + (v / 100) * 0.5}`;
            }

            // ── Phase labels crossfade ──
            const newPhase = phases.filter((p) => v >= p.threshold).length - 1;
            if (newPhase !== currentPhase) {
              currentPhase = newPhase;
              const label = phases[currentPhase].label;
              const l1 = phaseLabel1Ref.current;
              const l2 = phaseLabel2Ref.current;
              if (!l1 || !l2) return;

              if (activeLabelRef.current === 1) {
                l2.textContent = label;
                gsap.to(l1, {
                  opacity: 0,
                  y: -10,
                  filter: "blur(4px)",
                  duration: 0.3,
                  overwrite: true,
                });
                gsap.fromTo(
                  l2,
                  { opacity: 0, y: 10, filter: "blur(4px)" },
                  {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.5,
                    ease: "expo.out",
                    overwrite: true,
                  },
                );
                activeLabelRef.current = 2;
              } else {
                l1.textContent = label;
                gsap.to(l2, {
                  opacity: 0,
                  y: -10,
                  filter: "blur(4px)",
                  duration: 0.3,
                  overwrite: true,
                });
                gsap.fromTo(
                  l1,
                  { opacity: 0, y: 10, filter: "blur(4px)" },
                  {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.5,
                    ease: "expo.out",
                    overwrite: true,
                  },
                );
                activeLabelRef.current = 1;
              }
            }
          },
        },
        1.3,
      );

      // Hold at 100%
      tl.to({}, { duration: 0.8 });
    }, wrapper);

    /* ═══════════════════════════════════════════════════ *
     *  MULTI-LAYER PARALLAX (Mouse Movement)                *
     *  Each layer moves at a different speed                *
     * ═══════════════════════════════════════════════════ */
    const parallaxLayers = [
      { ref: bgGradientRef, depth: 4, dur: 2.5 },
      { ref: bgGradient2Ref, depth: 5, dur: 2.8 },
      { ref: gridRef, depth: 8, dur: 2.2 },
      { ref: grainRef, depth: 3, dur: 3.0 },
      { ref: ambientLightRef, depth: -6, dur: 2.0 },
      { ref: particleContainerRef, depth: 10, dur: 1.8 },
      { ref: vignetteRef, depth: -4, dur: 2.5 },
      { ref: borderFrameRef, depth: 14, dur: 1.6 },
      { ref: contentStackRef, depth: 10, dur: 1.8 },
      { ref: sideLeftRef, depth: 16, dur: 1.4 },
      { ref: sideRightRef, depth: 16, dur: 1.4 },
    ];

    const xToFuncs = parallaxLayers.map((l) =>
      l.ref.current
        ? gsap.quickTo(l.ref.current, "x", {
            duration: l.dur,
            ease: "power3.out",
          })
        : null,
    );
    const yToFuncs = parallaxLayers.map((l) =>
      l.ref.current
        ? gsap.quickTo(l.ref.current, "y", {
            duration: l.dur,
            ease: "power3.out",
          })
        : null,
    );

    /* ═══════════════════════════════════════════════════ *
     *  CURSOR LIGHT — Smooth lerp follow                   *
     * ═══════════════════════════════════════════════════ */
    const cursorX = gsap.quickTo(cursorGlowRef.current, "x", {
      duration: 1.2,
      ease: "power3.out",
    });
    const cursorY = gsap.quickTo(cursorGlowRef.current, "y", {
      duration: 1.2,
      ease: "power3.out",
    });

    /* ═══════════════════════════════════════════════════ *
     *  MOUSE HANDLER                                       *
     * ═══════════════════════════════════════════════════ */
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      parallaxLayers.forEach((l, i) => {
        const move = l.depth * 0.8;
        xToFuncs[i]?.(nx * move);
        yToFuncs[i]?.(ny * move);
      });

      cursorX(e.clientX);
      cursorY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onComplete]);

  /* ════════════════════════════════════════════════════ */
  /*  RENDER                                               */
  /* ════════════════════════════════════════════════════ */

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* ════════════════════════════════════════════════
          LAYER 1: Animated Background Gradients (breathing)
          ════════════════════════════════════════════════ */}
      <div
        ref={bgGradientRef}
        className="pointer-events-none absolute inset-[-20%] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 30% 40%, rgba(0,125,197,0.05) 0%, transparent 70%)",
          opacity: 0.6,
        }}
      />
      <div
        ref={bgGradient2Ref}
        className="pointer-events-none absolute inset-[-20%] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 70% 60%, rgba(0,80,120,0.04) 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 2: Animated Grid (slow vertical drift)
          ════════════════════════════════════════════════ */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-[-40px] opacity-[0.015] will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 3: Animated Film Grain (1-3% opacity)
          ════════════════════════════════════════════════ */}
      <div
        ref={grainRef}
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 4: Ambient Volumetric Light (showroom sweep)
          ════════════════════════════════════════════════ */}
      <div
        ref={ambientLightRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(0,125,197,0.06) 0%, transparent 65%)",
          mixBlendMode: "screen",
          opacity: 0,
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 5: Floating Particles
          ════════════════════════════════════════════════ */}
      <div
        ref={particleContainerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      />

      {/* ════════════════════════════════════════════════
          LAYER 6: Vignette
          ════════════════════════════════════════════════ */}
      <div
        ref={vignetteRef}
        className="pointer-events-none absolute inset-[-20px] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--background) 100%)",
        }}
      />

      {/* ════════════════════════════════════════════════
          MAIN PANEL (camera target)
          ════════════════════════════════════════════════ */}
      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "var(--background)", willChange: "transform" }}
      >
        {/* ══════════════════════════════════════════════
            LAYER 7: SVG Border Frame (path drawing)
            Top → Right → Bottom → Left
            ══════════════════════════════════════════════ */}
        <div
          ref={borderFrameRef}
          className="pointer-events-none absolute inset-4 sm:inset-6 md:inset-10 lg:inset-14 will-change-transform"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <path
              ref={borderPathRef}
              d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
              pathLength={100}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                opacity: 0,
              }}
            />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════
            LAYER 8: Corner Accents (draw + glow + settle)
            ══════════════════════════════════════════════ */}
        {/* Top-Left */}
        <div
          ref={cornerTLRef}
          className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6 md:left-10 md:top-10 lg:left-14 lg:top-14 will-change-transform"
        >
          <div
            className="corner-glow absolute -left-3 -top-3 h-16 w-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,125,197,0.2) 0%, transparent 70%)",
              opacity: 0,
              filter: "blur(8px)",
            }}
          />
          <div className="corner-line absolute left-0 top-0 h-px w-8 origin-left bg-white/[0.14] sm:w-10 md:w-14" />
          <div className="corner-line absolute left-0 top-0 h-8 w-px origin-top bg-white/[0.14] sm:h-10 md:h-14" />
        </div>

        {/* Top-Right */}
        <div
          ref={cornerTRRef}
          className="pointer-events-none absolute right-4 top-4 sm:right-6 sm:top-6 md:right-10 md:top-10 lg:right-14 lg:top-14 will-change-transform"
        >
          <div
            className="corner-glow absolute -right-3 -top-3 h-16 w-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,125,197,0.2) 0%, transparent 70%)",
              opacity: 0,
              filter: "blur(8px)",
            }}
          />
          <div className="corner-line absolute right-0 top-0 h-px w-8 origin-right bg-white/[0.14] sm:w-10 md:w-14" />
          <div className="corner-line absolute right-0 top-0 h-8 w-px origin-top bg-white/[0.14] sm:h-10 md:h-14" />
        </div>

        {/* Bottom-Left */}
        <div
          ref={cornerBLRef}
          className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10 lg:bottom-14 lg:left-14 will-change-transform"
        >
          <div
            className="corner-glow absolute -bottom-3 -left-3 h-16 w-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,125,197,0.2) 0%, transparent 70%)",
              opacity: 0,
              filter: "blur(8px)",
            }}
          />
          <div className="corner-line absolute bottom-0 left-0 h-px w-8 origin-left bg-white/[0.14] sm:w-10 md:w-14" />
          <div className="corner-line absolute bottom-0 left-0 h-8 w-px origin-bottom bg-white/[0.14] sm:h-10 md:h-14" />
        </div>

        {/* Bottom-Right */}
        <div
          ref={cornerBRRef}
          className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 lg:bottom-14 lg:right-14 will-change-transform"
        >
          <div
            className="corner-glow absolute -bottom-3 -right-3 h-16 w-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,125,197,0.2) 0%, transparent 70%)",
              opacity: 0,
              filter: "blur(8px)",
            }}
          />
          <div className="corner-line absolute bottom-0 right-0 h-px w-8 origin-right bg-white/[0.14] sm:w-10 md:w-14" />
          <div className="corner-line absolute bottom-0 right-0 h-8 w-px origin-bottom bg-white/[0.14] sm:h-10 md:h-14" />
        </div>

        {/* ══════════════════════════════════════════════
            LAYER 9: Center Horizontal Line
            ══════════════════════════════════════════════ */}
        <div
          ref={centerLineRef}
          className="absolute left-[10%] right-[10%] top-1/2 h-px origin-center will-change-transform"
          style={{
            transform: "translateY(-50%) scaleX(0)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 15%, rgba(0,125,197,0.18) 50%, rgba(255,255,255,0.06) 85%, transparent 100%)",
          }}
        />

        {/* ══════════════════════════════════════════════
            LAYER 10: Content Stack (parallax depth)
            ══════════════════════════════════════════════ */}
        <div
          ref={contentStackRef}
          className="relative z-10 flex flex-col items-center px-6 will-change-transform"
        >
          {/* Top label — Split Text */}
          <div
            ref={topLabelRef}
            className="mb-10 overflow-hidden text-[8px] font-medium uppercase tracking-[0.35em] text-muted-foreground/30 sm:mb-14 sm:text-[9px] sm:tracking-[0.45em]"
          >
            Loading Experience
          </div>

          {/* Sub label — Split Text */}
          <div
            ref={subLabelRef}
            className="mb-8 overflow-hidden text-[7px] font-light uppercase tracking-[0.5em] text-muted-foreground/15 sm:mb-10 sm:text-[8px]"
          >
            Luxury Residences
          </div>

          {/* ════════════════════════════════════════════
              Premium Counter (Digit Strips)
              Each digit slides · blurs · snaps · glows
              ════════════════════════════════════════════ */}
          <div className="relative">
            {/* Breathing glow behind counter */}
            <div
              ref={counterGlowRef}
              className="absolute inset-0 -z-10 rounded-full"
              style={{
                opacity: 0.03,
                transform: "scale(0.8)",
                background:
                  "radial-gradient(circle, rgba(0,125,197,0.5) 0%, transparent 70%)",
                filter: "blur(50px)",
                willChange: "transform, opacity",
              }}
            />

            {/* Digit strips */}
            <div
              ref={counterRef}
              className="flex font-mono leading-none text-foreground"
              style={{
                opacity: 0,
                fontSize: "clamp(3.5rem, 22vw, 14rem)",
                fontWeight: 200,
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum"',
                willChange: "opacity, transform, filter",
              }}
            >
              {[0, 1, 2].map((pos) => (
                <div
                  key={pos}
                  className="overflow-hidden"
                  style={{ height: "1em" }}
                >
                  <div
                    ref={(el) => {
                      stripRefs.current[pos] = el;
                    }}
                    className="flex flex-col"
                    data-digit="0"
                    style={{ willChange: "transform, filter" }}
                  >
                    {Array.from({ length: 10 }, (_, n) => (
                      <span
                        key={n}
                        className="block text-center"
                        style={{ height: "1em", lineHeight: 1 }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════
              Luxury Progress Bar
              Moving gradient · glow · endpoint pulse
              ════════════════════════════════════════════ */}
          <div className="mt-8 w-[180px] sm:mt-12 sm:w-[240px] md:w-[280px]">
            <div
              ref={progressTrackRef}
              className="relative h-px w-full"
              style={{
                opacity: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 100%)",
                willChange: "opacity, transform, filter",
              }}
            >
              {/* Fill — animated moving gradient */}
              <div
                ref={progressFillRef}
                className="absolute inset-y-0 left-0"
                style={{
                  width: "0%",
                  background:
                    "linear-gradient(90deg, rgba(0,125,197,0.3) 0%, rgba(0,125,197,0.85) 30%, rgba(0,200,255,0.6) 50%, rgba(163,230,53,0.5) 75%, rgba(0,125,197,0.3) 100%)",
                  backgroundSize: "200% 100%",
                  willChange: "width, background-position",
                }}
              />

              {/* Moving glow following fill edge */}
              <div
                ref={progressGlowRef}
                className="absolute top-1/2 h-4 w-10 -translate-y-1/2"
                style={{
                  left: "calc(0% - 20px)",
                  background:
                    "radial-gradient(ellipse, rgba(0,125,197,0.5) 0%, transparent 70%)",
                  filter: "blur(6px)",
                  opacity: 0,
                  willChange: "left, opacity",
                }}
              />

              {/* Endpoint dot with pulse */}
              <div
                ref={progressDotRef}
                className="absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full"
                style={{
                  left: "calc(0% - 3px)",
                  background: "rgba(0,180,255,0.95)",
                  boxShadow: "0 0 8px 2px rgba(0,125,197,0.5)",
                  willChange: "left, box-shadow",
                }}
              />
            </div>

            {/* Tick marks + labels */}
            <div className="mt-2.5 flex justify-between">
              {[0, 25, 50, 75, 100].map((tick) => (
                <div key={tick} className="flex flex-col items-center gap-1">
                  <div
                    className="h-2 w-px"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                  <span className="text-[6px] font-mono tracking-wider text-muted-foreground/15 sm:text-[7px]">
                    {tick}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase label crossfade pair */}
          <div className="relative mt-5 h-4 w-56 overflow-hidden text-center sm:mt-6 sm:w-64">
            <div
              ref={phaseLabel1Ref}
              className="absolute inset-0 flex items-center justify-center text-[8px] font-medium uppercase tracking-[0.3em] sm:text-[9px] sm:tracking-[0.35em]"
              style={{
                opacity: 0,
                color: "rgba(0,125,197,0.5)",
                willChange: "opacity, transform, filter",
              }}
            >
              INITIALIZING SYSTEMS
            </div>
            <div
              ref={phaseLabel2Ref}
              className="absolute inset-0 flex items-center justify-center text-[8px] font-medium uppercase tracking-[0.3em] sm:text-[9px] sm:tracking-[0.35em]"
              style={{
                opacity: 0,
                color: "rgba(0,125,197,0.5)",
                willChange: "opacity, transform, filter",
              }}
            >
              INITIALIZING SYSTEMS
            </div>
          </div>

          {/* Logo + accent */}
          <div className="mt-12 flex items-center gap-1.5 sm:mt-16">
            <div
              ref={logoRef}
              className="text-[10px] font-normal uppercase tracking-[0.5em] text-foreground/15 sm:text-[11px] sm:tracking-[0.7em]"
              style={{
                opacity: 0,
                willChange: "opacity, transform, filter",
              }}
            >
              EXPRESS
            </div>
            <div
              ref={logoAccentRef}
              className="h-[4px] w-[4px] rounded-full bg-primary/60"
              style={{
                opacity: 0,
                willChange: "opacity, transform",
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            LAYER 11: Side Decorations (parallax depth)
            ══════════════════════════════════════════════ */}
        {/* Left */}
        <div
          ref={sideLeftRef}
          className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 md:left-6 lg:left-8 md:block will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-16 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
            <span
              className="text-[6px] uppercase tracking-[0.5em] text-muted-foreground/12"
              style={{ writingMode: "vertical-rl" }}
            >
              Est. 2024
            </span>
            <div
              className="h-16 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div
          ref={sideRightRef}
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 md:right-6 lg:right-8 md:block will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-16 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
            <span
              className="text-[6px] uppercase tracking-[0.5em] text-muted-foreground/12"
              style={{ writingMode: "vertical-rl" }}
            >
              Premium
            </span>
            <div
              className="h-16 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          LAYER 12: Sweep Line + Glow (exit transition)
          ════════════════════════════════════════════════ */}
      <div
        ref={sweepGlowRef}
        className="pointer-events-none absolute inset-y-0 z-20 w-[120px]"
        style={{
          left: "-120px",
          opacity: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,125,197,0.03) 30%, rgba(0,125,197,0.1) 50%, rgba(0,125,197,0.03) 70%, transparent 100%)",
        }}
      />
      <div
        ref={sweepLineRef}
        className="pointer-events-none absolute inset-y-0 z-20 w-[2px]"
        style={{
          left: "-4px",
          opacity: 0,
          background: "rgba(0,180,255,0.95)",
          boxShadow:
            "0 0 12px 3px rgba(0,125,197,0.5), 0 0 40px 12px rgba(0,125,197,0.2), 0 0 80px 25px rgba(0,125,197,0.08)",
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 13: Cursor Light (smooth lerp follow)
          ════════════════════════════════════════════════ */}
      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed z-30 h-[500px] w-[500px] rounded-full"
        style={{
          left: -250,
          top: -250,
          background:
            "radial-gradient(circle, rgba(0,125,197,0.05) 0%, transparent 60%)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* ════════════════════════════════════════════════
          LAYER 14: Exit Flash (cinematic white light)
          ════════════════════════════════════════════════ */}
      <div
        ref={exitFlashRef}
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          opacity: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.98) 0%, rgba(240,250,255,0.95) 100%)",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
