"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const PANELS = [
  {
    tag: "01 — Our Origin",
    title: "Our Story",
    content:
      "Express Highway Inn was born with a vision to redefine travel and hospitality along the busy highways of Bangladesh. Strategically located on the Dhaka–Chittagong Highway, it was designed to be more than just a resting place — it is a destination where relaxation meets luxury.",
    shimmer: "story",
    /* Luxury building facade at golden hour */
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop&q=85",
  },
  {
    tag: "02 — Our Purpose",
    title: "Our Mission",
    content:
      "At Express Highway Inn, our mission is to redefine highway hospitality by offering a perfect balance of comfort, luxury, and convenience. We are committed to providing world-class service, modern amenities, and a welcoming atmosphere that caters to the diverse needs of travelers, families, and business professionals.",
    shimmer: "mission",
    /* Grand hotel lobby interior */
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=85",
  },
  {
    tag: "03 — Our Principles",
    title: "Our Values",
    content:
      "At Express Highway Inn, our values guide everything we do. We believe in hospitality first, welcoming every guest with warmth, care, and respect. Our commitment to excellence ensures the highest standards in service, comfort, and luxury. With integrity and transparency, we build trust while embracing innovation to enhance every experience.",
    shimmer: "values",
    /* Luxury interior detail — marble & light */
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop&q=85",
  },
  {
    tag: "04 — Our Network",
    title: "Allied Organizations",
    content:
      "United in vision, strength, and shared success. Our partnerships reflect our commitment to a broader ecosystem of excellence, connecting trusted entities to build a future of unparalleled service and reliability.",
    shimmer: "organizations",
    /* Aerial view of modern architecture / cityscape */
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&q=85",
  },
];

/* Each panel has a subtle ambient colour temperature shift */
const PANEL_ORBS: [string, string][] = [
  ["rgba(0,125,197,0.05)", "rgba(0,60,120,0.04)"] /* cool blue */,
  ["rgba(255,200,100,0.04)", "rgba(180,120,60,0.03)"] /* warm graphite */,
  ["rgba(200,140,50,0.045)", "rgba(160,100,30,0.035)"] /* deep bronze */,
  ["rgba(120,180,255,0.04)", "rgba(60,100,180,0.03)"] /* elegant cool */,
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function About() {
  /* ── refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const lightSweepGlowRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const progressDotRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const sideLeftRef = useRef<HTMLDivElement>(null);
  const sideRightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbARef = useRef<(HTMLDivElement | null)[]>([]);
  const orbBRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgImageRef = useRef<(HTMLDivElement | null)[]>([]);

  const setPanelRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      panelsRef.current[i] = el;
    },
    [],
  );
  const setOrbARef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      orbARef.current[i] = el;
    },
    [],
  );
  const setOrbBRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      orbBRef.current[i] = el;
    },
    [],
  );
  const setBgImageRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      bgImageRef.current[i] = el;
    },
    [],
  );

  /* ══════════════════════════════════════════════════════════════
     ANIMATIONS
  ══════════════════════════════════════════════════════════════ */
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        /* ── 1. SPLIT TYPE ── */
        panelsRef.current.forEach((panel) => {
          if (!panel) return;
          const heading = panel.querySelector("h2");
          if (!heading) return;

          const SPLIT_TYPES = "lines,words" as const;

          SplitType.create(heading, {
            types: SPLIT_TYPES,
            lineClass: "overflow-hidden block",
            wordClass: "inline-block will-change-transform",
          });

          heading.querySelectorAll(".word").forEach((word) => {
            const t = word.textContent?.trim().toLowerCase();
            if (t === PANELS.find((p) => p.shimmer === t)?.shimmer) {
              word.classList.add("text-shimmer");
            }
          });

          gsap.set(heading.querySelectorAll(".line > div"), {
            yPercent: 120,
            rotateX: 20,
            opacity: 0,
            transformOrigin: "bottom center",
          });
        });

        /* ── 2. INITIAL STATES ── */
        panelsRef.current.slice(1).forEach((p) => {
          if (p)
            gsap.set(p, {
              opacity: 0,
              yPercent: 25,
              scale: 0.96,
              filter: "blur(8px)",
            });
        });

        // Background images 2-3 start hidden & zoomed
        bgImageRef.current.slice(1).forEach((img) => {
          if (img) gsap.set(img, { opacity: 0, scale: 1.15 });
        });
        // First image starts slightly zoomed for Ken Burns entry
        if (bgImageRef.current[0]) {
          gsap.set(bgImageRef.current[0], { scale: 1.08, opacity: 1 });
        }

        gsap.set(lightSweepRef.current, { left: "-4px", opacity: 0 });
        gsap.set(lightSweepGlowRef.current, { left: "-100px", opacity: 0 });
        gsap.set(progressFillRef.current, { scaleY: 0 });
        gsap.set([sideLeftRef.current, sideRightRef.current], { opacity: 0 });

        /* ── 3. AMBIENT FLOATING (always alive) ── */
        // Lens breathing
        gsap.to(stickyRef.current, {
          scale: 1.003,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Active background Ken Burns (slow zoom out)
        // We'll handle per-image Ken Burns in the timeline instead

        // Ambient orbs drift
        orbARef.current.forEach((orb, i) => {
          if (!orb) return;
          gsap.to(orb, {
            x: 25 + i * 8,
            y: -18 - i * 5,
            duration: 8 + i * 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.7,
          });
        });
        orbBRef.current.forEach((orb, i) => {
          if (!orb) return;
          gsap.to(orb, {
            x: -20 - i * 10,
            y: 22 + i * 4,
            duration: 7 + i * 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.9,
          });
        });

        // Vignette breathing
        gsap.to(vignetteRef.current, {
          opacity: 0.6,
          duration: 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Progress glow pulse
        gsap.to(progressGlowRef.current, {
          opacity: 0.6,
          scale: 1.2,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        /* ── 4. MOUSE PARALLAX (6-layer depth) ── */
        if (window.innerWidth > 1024) {
          const bgX = gsap.quickTo(bgRef.current, "x", {
            duration: 2.5,
            ease: "power2.out",
          });
          const bgY = gsap.quickTo(bgRef.current, "y", {
            duration: 2.5,
            ease: "power2.out",
          });
          const contentX = gsap.quickTo(contentRef.current, "x", {
            duration: 1.8,
            ease: "power2.out",
          });
          const contentY = gsap.quickTo(contentRef.current, "y", {
            duration: 1.8,
            ease: "power2.out",
          });

          // Per-image parallax (images shift opposite to content for depth)
          const imgQuickX: Record<number, ReturnType<typeof gsap.quickTo>> = {};
          const imgQuickY: Record<number, ReturnType<typeof gsap.quickTo>> = {};
          bgImageRef.current.forEach((img, i) => {
            if (!img) return;
            imgQuickX[i] = gsap.quickTo(img, "x", {
              duration: 3,
              ease: "power2.out",
            });
            imgQuickY[i] = gsap.quickTo(img, "y", {
              duration: 3,
              ease: "power2.out",
            });
          });

          const onMouseMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;

            bgX(nx * -4);
            bgY(ny * -3);
            contentX(nx * 12);
            contentY(ny * 6);

            // Images move at their own rate (between bg and content)
            Object.keys(imgQuickX).forEach((key) => {
              const idx = parseInt(key);
              imgQuickX[idx]?.(nx * -6);
              imgQuickY[idx]?.(ny * -4);
            });
          };

          window.addEventListener("mousemove", onMouseMove);
          gsap.set(containerRef.current, {
            _mouseCleanup: () =>
              window.removeEventListener("mousemove", onMouseMove),
          } as any);
        }

        /* ── 5. CANVAS — Floating Architectural Dust ── */
        const canvas = canvasRef.current;
        if (canvas) {
          const c = canvas.getContext("2d");
          if (c) {
            const resize = () => {
              canvas.width = window.innerWidth / 3;
              canvas.height = window.innerHeight / 3;
            };
            resize();
            window.addEventListener("resize", resize);

            interface Particle {
              x: number;
              y: number;
              vx: number;
              vy: number;
              size: number;
              opacity: number;
              life: number;
              maxLife: number;
            }
            const particles: Particle[] = [];
            for (let i = 0; i < 30; i++) {
              particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: -Math.random() * 0.2 - 0.05,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.35 + 0.1,
                life: 0,
                maxLife: 300 + Math.random() * 400,
              });
            }

            let running = true;
            const drawParticles = () => {
              if (!running || !c) return;
              c.clearRect(0, 0, canvas.width, canvas.height);

              particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                const lifeRatio = p.life / p.maxLife;
                const alpha =
                  lifeRatio < 0.1
                    ? p.opacity * (lifeRatio / 0.1)
                    : lifeRatio > 0.85
                      ? p.opacity * (1 - (lifeRatio - 0.85) / 0.15)
                      : p.opacity;

                c.beginPath();
                c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                c.fillStyle = `rgba(200, 210, 230, ${alpha})`;
                c.fill();

                if (p.y < -5 || p.life > p.maxLife) {
                  p.x = Math.random() * canvas.width;
                  p.y = canvas.height + 5;
                  p.life = 0;
                  p.vx = (Math.random() - 0.5) * 0.15;
                  p.vy = -Math.random() * 0.2 - 0.05;
                }
              });

              requestAnimationFrame(drawParticles);
            };
            requestAnimationFrame(drawParticles);

            gsap.set(containerRef.current, {
              _canvasCleanup: () => {
                running = false;
              },
            } as any);
          }
        }

        /* ── 6. CINEMATIC SCROLL TIMELINE ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
              gsap.set(progressFillRef.current, { scaleY: self.progress });
              if (progressDotRef.current) {
                progressDotRef.current.style.top = `${self.progress * 100}%`;
              }
              const idx = Math.min(4, Math.floor(self.progress * 4) + 1);
              if (indexRef.current) indexRef.current.textContent = `0${idx}`;
            },
          },
        });

        // ── Panel 1: image Ken Burns settle + heading reveal ──
        tl.to(
          bgImageRef.current[0],
          { scale: 1.03, duration: 3, ease: "power2.out" },
          0,
        );
        tl.to(
          panelsRef.current[0]?.querySelectorAll(".line > div") ?? [],
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
          },
          0,
        );

        const p1Tag = panelsRef.current[0]?.querySelector(".panel-tag");
        const p1Body = panelsRef.current[0]?.querySelector(".panel-body");
        if (p1Tag)
          tl.fromTo(
            p1Tag,
            { filter: "blur(6px)", opacity: 0, y: 10 },
            {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            0.3,
          );
        if (p1Body)
          tl.fromTo(
            p1Body,
            { filter: "blur(6px)", opacity: 0, y: 12 },
            {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            },
            0.5,
          );

        // ── Hold Panel 1 ──
        tl.to({}, { duration: 1.5 });

        // ── PANEL TRANSITIONS (loop) ──
        for (let i = 0; i < PANELS.length - 1; i++) {
          const outPanel = panelsRef.current[i];
          const inPanel = panelsRef.current[i + 1];
          const outImg = bgImageRef.current[i];
          const inImg = bgImageRef.current[i + 1];
          if (!outPanel || !inPanel || !outImg || !inImg) continue;

          const inWords = inPanel.querySelectorAll(".line > div");
          const inTag = inPanel.querySelector(".panel-tag");
          const inBody = inPanel.querySelector(".panel-body");

          // ── Background cross-fade (starts slightly before text) ──

          // Outgoing image: slow zoom out + fade
          tl.to(
            outImg,
            {
              scale: 1.12,
              opacity: 0,
              duration: 1.2,
              ease: "power2.inOut",
            },
            "<",
          );

          // Incoming image: starts zoomed in, settles to normal
          tl.set(inImg, { opacity: 1 }, "<0.15");
          tl.to(
            inImg,
            {
              scale: 1.03,
              duration: 1.4,
              ease: "power2.out",
            },
            "<",
          );

          // Continue Ken Burns on incoming image (very slow drift)
          tl.to(
            inImg,
            {
              scale: 1.06,
              duration: 2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 1,
            },
            "<0.8",
          );

          // ── Camera push forward ──
          tl.to(
            contentRef.current,
            { scale: 1.015, duration: 0.4, ease: "power2.inOut" },
            "<0.1",
          );

          // ── Environment darkens slightly ──
          tl.to(
            overlayRef.current,
            { opacity: "+=0.06", duration: 0.5, ease: "power2.inOut" },
            "<",
          );

          // ── Light sweep across ──
          tl.set(lightSweepRef.current, { left: "-4px", opacity: 1 }, "<");
          tl.set(
            lightSweepGlowRef.current,
            { left: "-100px", opacity: 1 },
            "<",
          );
          tl.to(
            lightSweepRef.current,
            { left: "calc(100% + 4px)", duration: 0.6, ease: "power2.inOut" },
            ">0.1",
          );
          tl.to(
            lightSweepGlowRef.current,
            { left: "calc(100% + 100px)", duration: 0.6, ease: "power2.inOut" },
            "<",
          );
          tl.to(lightSweepRef.current, { opacity: 0, duration: 0.2 }, ">-0.1");
          tl.to(lightSweepGlowRef.current, { opacity: 0, duration: 0.2 }, "<");

          // ── Current panel exits (lose focus) ──
          tl.to(
            outPanel,
            {
              opacity: 0,
              yPercent: -25,
              scale: 1.06,
              filter: "blur(10px)",
              duration: 0.8,
              ease: "power3.inOut",
            },
            "<0.1",
          );

          // ── Next panel enters (comes into focus) ──
          tl.to(
            inPanel,
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
            },
            "<0.15",
          );

          // Camera settles back
          tl.to(
            contentRef.current,
            { scale: 1, duration: 0.5, ease: "power2.inOut" },
            "<0.2",
          );

          // Environment lightens
          tl.to(
            overlayRef.current,
            { opacity: "-=0.06", duration: 0.5, ease: "power2.inOut" },
            "<",
          );

          // Tag reveal
          if (inTag) {
            tl.fromTo(
              inTag,
              { filter: "blur(8px)", opacity: 0, y: 10 },
              {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              "<0.3",
            );
          }

          // Heading words stagger in
          if (inWords.length) {
            tl.to(
              inWords,
              {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.12,
                ease: "power4.out",
              },
              "<0.15",
            );
          }

          // Body text reveal
          if (inBody) {
            tl.fromTo(
              inBody,
              { filter: "blur(8px)", opacity: 0, y: 12 },
              {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              },
              "<0.2",
            );
          }

          // Colour evolution — cross-fade ambient orbs
          const prevOrbA = orbARef.current[i];
          const nextOrbA = orbARef.current[i + 1];
          const prevOrbB = orbBRef.current[i];
          const nextOrbB = orbBRef.current[i + 1];
          if (prevOrbA && nextOrbA) {
            tl.to(
              prevOrbA,
              { opacity: 0, duration: 0.8, ease: "power2.inOut" },
              "<0.4",
            );
            tl.to(
              nextOrbA,
              { opacity: 1, duration: 0.8, ease: "power2.inOut" },
              "<",
            );
          }
          if (prevOrbB && nextOrbB) {
            tl.to(
              prevOrbB,
              { opacity: 0, duration: 0.8, ease: "power2.inOut" },
              "<0.5",
            );
            tl.to(
              nextOrbB,
              { opacity: 1, duration: 0.8, ease: "power2.inOut" },
              "<",
            );
          }

          // Hold
          if (i < PANELS.length - 2) {
            tl.to({}, { duration: 1.5 });
          }
        }

        // ── SCROLL ENDING: environment opens up ──
        tl.to(
          overlayRef.current,
          { opacity: "-=0.15", duration: 0.8, ease: "power2.inOut" },
          ">",
        );
        tl.to(
          vignetteRef.current,
          { opacity: 0.2, duration: 0.8, ease: "power2.out" },
          "<",
        );
        tl.to(
          contentRef.current,
          { scale: 0.985, duration: 0.8, ease: "power2.inOut" },
          "<",
        );

        /* ── 7. SIDE LABELS ── */
        gsap.to([sideLeftRef.current, sideRightRef.current], {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stickyRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });

        /* ── 8. BACKGROUND PARALLAX ── */
        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        /* ── 9. DECORATIVE CORNERS FADE ── */
        gsap.fromTo(
          ".about-corner",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stickyRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }, containerRef);

      /* ── CLEANUP ── */
      return () => {
        const el = containerRef.current as any;
        if (el?._mouseCleanup) el._mouseCleanup();
        if (el?._canvasCleanup) el._canvasCleanup();
      };
    },
    { scope: containerRef },
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div ref={containerRef} className="relative w-full h-[500vh]" id="about">
      {/* ────────────────────────────────────────────
          STICKY PINNED VIEWPORT
      ──────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ transformOrigin: "center center" }}
      >
        {/* ═══════ LAYER 1: Background Atmosphere ═══════ */}
        <div
          ref={bgRef}
          className="absolute inset-[-40px] z-0 will-change-transform"
        >
          {/* Base dark fill (shows through image transparency) */}
          <div className="absolute inset-0 bg-[#050505]" />

          {/* ── Per-panel background images (stacked, cross-faded) ── */}
          {PANELS.map((panel, i) => (
            <div
              key={`bg-${i}`}
              ref={setBgImageRef(i)}
              className="absolute inset-[-20px] will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                quality={i === 0 ? 90 : 75}
              />
              {/* Per-image colour grade overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${PANEL_ORBS[i][0].replace("0.0", "0.08")} 0%,
                    transparent 40%,
                    transparent 60%,
                    ${PANEL_ORBS[i][1].replace("0.0", "0.06")} 100%
                  )`,
                  mixBlendMode: "overlay",
                }}
              />
              {/* Bottom gradient for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.2) 35%, transparent 55%, rgba(5,5,5,0.3) 100%)",
                }}
              />
            </div>
          ))}

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
            }}
          />

          {/* Ambient colour orbs (per-panel, cross-faded) */}
          {PANEL_ORBS.map((colors, i) => (
            <div
              key={`orb-${i}`}
              className="absolute inset-0 pointer-events-none z-[2]"
            >
              <div
                ref={setOrbARef(i)}
                className="absolute top-[15%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[140px] will-change-transform"
                style={{
                  background: `radial-gradient(circle, ${colors[0]}, transparent 70%)`,
                  opacity: i === 0 ? 1 : 0,
                }}
              />
              <div
                ref={setOrbBRef(i)}
                className="absolute bottom-[20%] right-[15%] w-[35vw] h-[35vw] rounded-full blur-[120px] will-change-transform"
                style={{
                  background: `radial-gradient(circle, ${colors[1]}, transparent 70%)`,
                  opacity: i === 0 ? 1 : 0,
                }}
              />
            </div>
          ))}
        </div>

        {/* ═══════ LAYER 2: Canvas Dust Particles ═══════ */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[3] pointer-events-none opacity-40 mix-blend-screen"
          style={{ width: "100%", height: "100%" }}
        />

        {/* ═══════ LAYER 3: Overlay + Vignette ═══════ */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[4] bg-black/40 pointer-events-none transition-colors"
        />
        <div
          ref={vignetteRef}
          className="absolute inset-0 z-[4] pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ═══════ LAYER 4: Decorative Elements ═══════ */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          {/* Center architectural line */}
          <div className="absolute top-1/2 left-[8%] right-[8%] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

          {/* Corner marks */}
          <div className="about-corner absolute top-8 left-8 md:top-12 md:left-12">
            <div className="w-10 h-px bg-white/[0.1]" />
            <div className="w-px h-10 bg-white/[0.1] -mt-px" />
          </div>
          <div className="about-corner absolute top-8 right-8 md:top-12 md:right-12">
            <div className="w-10 h-px bg-white/[0.1]" />
            <div className="w-px h-10 bg-white/[0.1] -mt-px ml-auto" />
          </div>
          <div className="about-corner absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <div className="w-10 h-px bg-white/[0.1]" />
            <div className="w-px h-10 bg-white/[0.1] mt-px" />
          </div>
          <div className="about-corner absolute bottom-8 right-8 md:bottom-12 md:right-12">
            <div className="w-10 h-px bg-white/[0.1]" />
            <div className="w-px h-10 bg-white/[0.1] mt-px ml-auto" />
          </div>
        </div>

        {/* ═══════ LAYER 5: Content Panels ═══════ */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-[10] flex items-center justify-center px-6"
          style={{ perspective: "1200px" }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={i}
              ref={setPanelRef(i)}
              className={`absolute w-full max-w-4xl flex flex-col items-center text-center will-change-transform ${
                i === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Tag */}
              <p
                className={`panel-tag text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-primary/70 mb-8 font-medium ${
                  i === 0 ? "" : "opacity-0"
                }`}
              >
                {panel.tag}
              </p>

              {/* Heading */}
              <h2
                className="font-[family-name:var(--font-playfair)] text-[2.6rem] md:text-[4.5rem] lg:text-[6rem] font-medium tracking-tight leading-[0.95] text-white mb-10 md:mb-12"
                style={{
                  perspective: "1200px",
                  textShadow: "0 4px 30px rgba(0,0,0,0.6)",
                }}
                data-cursor="text"
              >
                {panel.title}
              </h2>

              {/* Body */}
              <p
                className={`panel-body text-sm md:text-lg font-light text-white/45 max-w-2xl mx-auto leading-[1.8] ${
                  i === 0 ? "" : "opacity-0"
                }`}
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
              >
                {panel.content}
              </p>
            </div>
          ))}
        </div>

        {/* ═══════ LAYER 6: UI Elements ═══════ */}

        {/* ── Light Sweep (transitions) ── */}
        <div
          ref={lightSweepGlowRef}
          className="absolute top-0 z-[12] w-[200px] h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,125,197,0.04) 30%, rgba(0,125,197,0.08) 50%, rgba(0,125,197,0.04) 70%, transparent 100%)",
          }}
        />
        <div
          ref={lightSweepRef}
          className="absolute top-0 z-[13] w-[2px] h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 5%, rgba(0,125,197,0.9) 30%, rgba(0,125,197,1) 50%, rgba(0,125,197,0.9) 70%, transparent 95%)",
            boxShadow:
              "0 0 15px 4px rgba(0,125,197,0.4), 0 0 50px 15px rgba(0,125,197,0.15), 0 0 100px 30px rgba(0,125,197,0.05)",
          }}
        />

        {/* ── Progress Indicator (Liquid Glass) ── */}
        <div
          ref={sideLeftRef}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-[20] hidden lg:flex flex-col items-center gap-5"
        >
          <span
            className="text-[7px] tracking-[0.5em] uppercase text-white/20 font-light"
            style={{ writingMode: "vertical-rl" }}
          >
            Shampaan Express
          </span>

          {/* Track */}
          <div className="relative w-[2px] h-24 rounded-full overflow-visible">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                backdropFilter: "blur(4px)",
              }}
            />
            <div
              ref={progressFillRef}
              className="absolute top-0 left-0 w-full rounded-full origin-top will-change-transform"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0,125,197,0.3), rgba(0,125,197,0.8), rgba(163,230,53,0.5))",
                boxShadow: "0 0 8px rgba(0,125,197,0.3)",
                transform: "scaleY(0)",
              }}
            />
            <div
              ref={progressGlowRef}
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full will-change-transform"
              style={{
                top: "0%",
                background:
                  "radial-gradient(circle, rgba(0,125,197,0.5) 0%, transparent 70%)",
                filter: "blur(6px)",
                transform: "translate(-50%, -50%)",
                opacity: 0.4,
              }}
            />
            <div
              ref={progressDotRef}
              className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full will-change-transform"
              style={{
                top: "0%",
                background: "rgba(0,125,197,1)",
                boxShadow:
                  "0 0 6px 2px rgba(0,125,197,0.6), 0 0 15px 4px rgba(0,125,197,0.2)",
                transform: "translate(-50%, -50%)",
                transition: "top 0.1s linear",
              }}
            />
          </div>

          <span
            ref={indexRef}
            className="text-[8px] tracking-[0.4em] uppercase text-primary/50 font-medium"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            01
          </span>
        </div>

        {/* ── Right Side Label ── */}
        <div
          ref={sideRightRef}
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-[20] hidden lg:block"
        >
          <span
            className="text-[7px] tracking-[0.5em] uppercase text-white/20 font-light"
            style={{ writingMode: "vertical-rl" }}
          >
            About Us — Our Legacy
          </span>
        </div>
      </div>
    </div>
  );
}
