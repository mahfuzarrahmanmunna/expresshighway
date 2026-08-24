"use client";

import { useRef, useEffect, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { SectionHeader } from "../ui/section-header";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const COLLECTION = [
  {
    title: "Studio Loft",
    price: "From $1.2M",
    image: "https://picsum.photos/seed/EXPRESS-studio/800/1100",
    sqft: "450 sq ft",
    floors: "12–18",
  },
  {
    title: "One Bedroom",
    price: "From $1.8M",
    image: "https://picsum.photos/seed/EXPRESS-1bed/800/1100",
    sqft: "750 sq ft",
    floors: "15–24",
  },
  {
    title: "Two Bedroom",
    price: "From $2.4M",
    image: "https://picsum.photos/seed/EXPRESS-2bed/800/1100",
    sqft: "1,200 sq ft",
    floors: "20–30",
  },
  {
    title: "Three Bedroom",
    price: "From $3.1M",
    image: "https://picsum.photos/seed/EXPRESS-3bed/800/1100",
    sqft: "1,800 sq ft",
    floors: "25–35",
  },
  {
    title: "Penthouse",
    price: "From $4.2M",
    image: "https://picsum.photos/seed/EXPRESS-pent/800/1100",
    sqft: "3,500 sq ft",
    floors: "38–42",
  },
  {
    title: "Villa Estate",
    price: "From $5.8M",
    image: "https://picsum.photos/seed/EXPRESS-villa/800/1100",
    sqft: "6,200 sq ft",
    floors: "Ground",
  },
];

export default function PropertyCollection() {
  const { isReducedMotion } = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /* Progress indicator refs */
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const progressCounterRef = useRef<HTMLSpanElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const progressCurrentRef = useRef<HTMLSpanElement>(null);

  /* Floating background refs */
  const bgGridRef = useRef<HTMLDivElement>(null);
  const bgLine1Ref = useRef<HTMLDivElement>(null);
  const bgLine2Ref = useRef<HTMLDivElement>(null);
  const bgOrbRef = useRef<HTMLDivElement>(null);

  /* Card refs */
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollReveal(headerRef, { y: 40, disabled: isReducedMotion });

  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    if (isReducedMotion || !trackRef.current || !sectionRef.current) return;

    const track = trackRef.current;
    const section = sectionRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const cleanupFns: (() => void)[] = [];

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const getAmount = () =>
            Math.max(0, -(track.scrollWidth - window.innerWidth + 80));
          const totalDistance = Math.abs(getAmount());

          if (totalDistance === 0) return;

          /* ═══════════════════════════════════════════════
             1. CINEMATIC HORIZONTAL SCROLL
             Heavy inertia scrub for weight & momentum
          ═══════════════════════════════════════════════ */
          gsap.to(track, {
            x: getAmount,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1.5,
              end: () => `+=${totalDistance}`,
              invalidateOnRefresh: true,
            },
          });

          /* ═══════════════════════════════════════════════
             21. SECTION TRANSITION — Camera Approach
             Slow zoom-in as section enters viewport
          ═══════════════════════════════════════════════ */
          gsap.fromTo(
            track,
            { scale: 0.94, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 95%",
                end: "top top",
                scrub: 1,
              },
            },
          );

          /* ═══════════════════════════════════════════════
             5. CINEMATIC CARD ENTRANCE
             Clip-path reveal — movie-scene style
          ═══════════════════════════════════════════════ */
          cards.forEach((card, i) => {
            gsap.fromTo(
              card,
              { clipPath: "inset(100% 0 0 0)", opacity: 0 },
              {
                clipPath: "inset(0% 0 0 0)",
                opacity: 1,
                duration: 1.4,
                delay: i * 0.09,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 82%",
                  toggleActions: "play none none none",
                },
              },
            );
          });

          /* ═══════════════════════════════════════════════
             PRE-CACHE INNER LAYER REFS
             Rules 4, 6, 7, 8, 10, 11, 12, 13, 18, 20
          ═══════════════════════════════════════════════ */
          const imageLayers = cards.map(
            (c) => c.querySelector("[data-image-layer]") as HTMLElement,
          );
          const gradientOverlays = cards.map(
            (c) => c.querySelector("[data-gradient-overlay]") as HTMLElement,
          );
          const captionLayers = cards.map(
            (c) => c.querySelector("[data-caption-layer]") as HTMLElement,
          );
          const innerLayers = cards.map(
            (c) => c.querySelector("[data-card-inner]") as HTMLElement,
          );
          const glassReflections = cards.map(
            (c) => c.querySelector("[data-glass-reflection]") as HTMLElement,
          );
          const lightSweeps = cards.map(
            (c) => c.querySelector("[data-light-sweep]") as HTMLElement,
          );
          const mouseLights = cards.map(
            (c) => c.querySelector("[data-mouse-light]") as HTMLElement,
          );

          /* ═══════════════════════════════════════════════
             6, 7, 18, 20. SCROLL-BASED FOCUS
             Depth of field · Motion blur · Dynamic shadows
             Only fires during the pinned scroll range
          ═══════════════════════════════════════════════ */
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${totalDistance}`,
            onUpdate(self) {
              const velocity = Math.abs(self.getVelocity());
              const motionBlur = Math.min(velocity / 22000, 1.2);

              cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const vpCenter = window.innerWidth / 2;
                const dist =
                  (cardCenter - vpCenter) / (window.innerWidth * 0.55);
                const absDist = Math.abs(dist);
                const clamp = Math.min(absDist, 1.5);

                /* Rule 7 — Depth of field blur */
                const dofBlur = clamp > 0.6 ? (clamp - 0.6) * 5.5 : 0;

                /* Rule 6 — Focus: scale, lift */
                const focus = 1 - Math.min(clamp, 1);
                const focusScale = 1 + focus * 0.05;
                const focusY = focus * -14;

                /* Rule 20 — Dynamic shadow */
                const shY = focus * 45;
                const shBlur = focus * 70;
                const shSpread = focus * -8;
                const shAlpha = focus * 0.55;

                gsap.set(card, {
                  scale: focusScale,
                  y: focusY,
                  force3D: true,
                  boxShadow: `0 ${shY}px ${shBlur}px ${shSpread}px rgba(0,0,0,${shAlpha})`,
                });

                /* Rule 4 — Image layer independent parallax */
                if (imageLayers[i]) {
                  gsap.set(imageLayers[i], {
                    y: dist * -28,
                    scale: 1.1 + focus * 0.03,
                    force3D: true,
                    filter: `blur(${dofBlur + motionBlur}px) brightness(${1 - clamp * 0.3})`,
                  });
                }

                /* Rule 12 — Dynamic gradient (sunlight shift) */
                if (gradientOverlays[i]) {
                  gsap.set(gradientOverlays[i], {
                    opacity: 0.55 + clamp * 0.45,
                  });
                }

                /* Rule 13 — Caption independent proximity */
                if (captionLayers[i]) {
                  const capAlpha = Math.max(0, 1 - clamp * 1.6);
                  gsap.set(captionLayers[i], {
                    y: (1 - capAlpha) * 28,
                    opacity: capAlpha,
                    force3D: true,
                  });
                }
              });
            },
          });

          /* ═══════════════════════════════════════════════
             8. INFINITE AMBIENT MOTION
             Breathing scale + translateY — image feels alive
          ═══════════════════════════════════════════════ */
          imageLayers.forEach((layer, i) => {
            if (!layer) return;
            gsap.to(layer, {
              y: "-=5",
              scale: 1.13,
              duration: 7 + i * 0.7,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });

          /* ═══════════════════════════════════════════════
             10. GLASS REFLECTION
             Diagonal sweep, low opacity, staggered
          ═══════════════════════════════════════════════ */
          glassReflections.forEach((ref, i) => {
            if (!ref) return;
            gsap.fromTo(
              ref,
              { x: "-130%" },
              {
                x: "130%",
                duration: 5.5 + i * 0.8,
                ease: "none",
                repeat: -1,
                delay: i * 0.9,
              },
            );
          });

          /* ═══════════════════════════════════════════════
             11. MOVING LIGHT SWEEP
             Slow horizontal light — showroom feel
          ═══════════════════════════════════════════════ */
          lightSweeps.forEach((sweep, i) => {
            if (!sweep) return;
            gsap.fromTo(
              sweep,
              { x: "-100%" },
              {
                x: "280%",
                duration: 10 + i * 1.3,
                ease: "power1.inOut",
                repeat: -1,
                delay: i * 1.8,
              },
            );
          });

          /* ═══════════════════════════════════════════════
             9. MOUSE PERSPECTIVE (Desktop)
             Smooth rotateX/Y via quickTo — no snapping
          ═══════════════════════════════════════════════ */
          const quickSetters = innerLayers.map((inner) => {
            if (!inner) return null;
            return {
              rotY: gsap.quickTo(inner, "rotateY", {
                duration: 0.8,
                ease: "power2.out",
              }),
              rotX: gsap.quickTo(inner, "rotateX", {
                duration: 0.8,
                ease: "power2.out",
              }),
            };
          });

          const onMouseMove = (e: MouseEvent) => {
            cards.forEach((card, i) => {
              const rect = card.getBoundingClientRect();
              const isOver =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

              if (isOver && quickSetters[i]) {
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                quickSetters[i]!.rotY(nx * 4);
                quickSetters[i]!.rotX(-ny * 3);

                /* Rule 14 — Mouse light via CSS variable */
                card.style.setProperty(
                  "--mouse-x",
                  `${e.clientX - rect.left}px`,
                );
                card.style.setProperty(
                  "--mouse-y",
                  `${e.clientY - rect.top}px`,
                );

                /* Show mouse light */
                if (mouseLights[i]) {
                  gsap.to(mouseLights[i], { opacity: 1, duration: 0.4 });
                }
              }
            });
          };

          const onMouseLeave = () => {
            quickSetters.forEach((qs) => {
              if (qs) {
                qs.rotY(0);
                qs.rotX(0);
              }
            });
            mouseLights.forEach((ml) => {
              if (ml) gsap.to(ml, { opacity: 0, duration: 0.5 });
            });
          };

          track.addEventListener("mousemove", onMouseMove);
          track.addEventListener("mouseleave", onMouseLeave);
          cleanupFns.push(() => {
            track.removeEventListener("mousemove", onMouseMove);
            track.removeEventListener("mouseleave", onMouseLeave);
          });

          /* ═══════════════════════════════════════════════
             16. DYNAMIC PROGRESS INDICATOR
             Architectural timeline + counter + label
          ═══════════════════════════════════════════════ */
          if (progressFillRef.current) {
            gsap.to(progressFillRef.current, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: true,
              },
            });
          }

          if (progressIndicatorRef.current) {
            gsap.to(progressIndicatorRef.current, {
              x: () => {
                const parent = progressFillRef.current?.parentElement;
                return parent ? parent.offsetWidth - 6 : 0;
              },
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: true,
              },
            });
          }

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${totalDistance}`,
            onUpdate(self) {
              const p = self.progress;

              if (progressCounterRef.current) {
                progressCounterRef.current.textContent = `${Math.round(p * 100)}%`;
              }

              const idx = Math.min(
                Math.floor(p * cards.length),
                cards.length - 1,
              );

              if (progressCurrentRef.current) {
                progressCurrentRef.current.textContent = String(
                  idx + 1,
                ).padStart(2, "0");
              }

              if (progressLabelRef.current && COLLECTION[idx]) {
                progressLabelRef.current.textContent = COLLECTION[idx].title;
              }
            },
          });

          /* ═══════════════════════════════════════════════
             19. FLOATING BACKGROUND ELEMENTS
             Grid · Lines · Ambient orb — independent speeds
          ═══════════════════════════════════════════════ */
          if (bgGridRef.current) {
            gsap.to(bgGridRef.current, {
              x: -350,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: 4,
              },
            });
          }
          if (bgLine1Ref.current) {
            gsap.to(bgLine1Ref.current, {
              x: -180,
              opacity: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: 2.5,
              },
            });
          }
          if (bgLine2Ref.current) {
            gsap.to(bgLine2Ref.current, {
              x: -240,
              opacity: 0.08,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: 3.2,
              },
            });
          }
          if (bgOrbRef.current) {
            gsap.to(bgOrbRef.current, {
              x: -120,
              scale: 1.3,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalDistance}`,
                scrub: 5,
              },
            });
          }
        },
      });
    }, section);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, [isReducedMotion]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-32"
    >
      {/* ── Architectural top divider ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-30"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,125,197,0.15) 50%, transparent 95%)",
        }}
      />

      {/* ═══════════════════════════════════════════
          19. FLOATING BACKGROUND ELEMENTS
      ═══════════════════════════════════════════ */}
      <div
        ref={bgGridRef}
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          willChange: "transform",
        }}
      />
      <div
        ref={bgLine1Ref}
        className="pointer-events-none absolute top-[28%] left-0 h-px w-[200%] opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(0,125,197,0.06) 50%, transparent 90%)",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={bgLine2Ref}
        className="pointer-events-none absolute top-[68%] left-0 h-px w-[200%] opacity-15"
        style={{
          background:
            "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.04) 50%, transparent 85%)",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={bgOrbRef}
        className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.015]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,125,197,0.5), transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* ═══════════════════════════════════════════
          HEADER (above pin area)
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div ref={headerRef} className={cn(!isReducedMotion && "opacity-0")}>
          <SectionHeader
            label="The Collection"
            title="Explore Every Residence Type"
            subtitle="From intimate studios to expansive villas, find the home that matches your vision."
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HORIZONTAL SCROLL TRACK
      ═══════════════════════════════════════════ */}
      <div
        ref={trackRef}
        className="relative z-10 flex gap-8 pl-6 lg:pl-[calc((100vw-80rem)/2+1.5rem)]"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {COLLECTION.map((item, i) => (
          <article
            key={item.title}
            ref={setCardRef(i)}
            className="group relative w-[280px] flex-shrink-0 cursor-pointer sm:w-[320px] lg:w-[400px]"
            style={
              {
                perspective: 1200,
                willChange: "transform, box-shadow",
                "--mouse-x": "50%",
                "--mouse-y": "50%",
              } as React.CSSProperties
            }
          >
            {/* ── Rule 9: Mouse-driven 3D rotation layer ── */}
            <div
              data-card-inner
              className="relative"
              style={{ willChange: "transform" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.015]">
                {/* ── Rule 4: Image layer (independent parallax) ── */}
                <div
                  data-image-layer
                  className="absolute inset-0"
                  style={{ willChange: "transform, filter" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover scale-110"
                    draggable={false}
                  />

                  {/* ── Rule 10: Glass Reflection ── */}
                  <div
                    data-glass-reflection
                    className="absolute inset-0 pointer-events-none -translate-x-full"
                    style={{ willChange: "transform" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rotate-[-20deg] scale-150" />
                  </div>

                  {/* ── Rule 11: Light Sweep ── */}
                  <div
                    data-light-sweep
                    className="absolute inset-y-0 left-0 w-1/3 pointer-events-none -translate-x-full"
                    style={{ willChange: "transform" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />
                  </div>

                  {/* ── Rule 12: Dynamic Gradient Overlay ── */}
                  <div
                    data-gradient-overlay
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                    style={{ willChange: "opacity" }}
                  />
                </div>

                {/* ── Rule 14: Mouse Light (radial follows cursor) ── */}
                <div
                  data-mouse-light
                  className="absolute inset-0 pointer-events-none opacity-0 z-[2]"
                  style={{
                    background:
                      "radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.055), transparent 40%)",
                  }}
                />

                {/* ── Rule 15: Blueprint Grid Overlay ── */}
                <div
                  className="absolute inset-0 pointer-events-none z-[1] opacity-[0.02]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* ── Rule 15: Corner Decorations (architectural brackets) ── */}
                <div className="absolute left-4 top-4 z-10 transition-transform duration-700 ease-out group-hover:scale-110 origin-top-left">
                  <div className="h-8 w-px bg-white/[0.12]" />
                  <div className="h-px w-8 bg-white/[0.12] -mt-px" />
                </div>
                <div className="absolute right-4 bottom-4 z-10 flex flex-col items-end transition-transform duration-700 ease-out group-hover:scale-110 origin-bottom-right">
                  <span className="text-[7px] font-mono tracking-[0.2em] text-white/[0.12] mb-1.5">
                    0{i + 1}
                  </span>
                  <div className="h-px w-8 bg-white/[0.12]" />
                  <div className="h-8 w-px bg-white/[0.12] -mt-px ml-auto" />
                </div>

                {/* ── Rule 15: Measurement marks (side) ── */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-3 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div
                        className="h-px bg-white/[0.08]"
                        style={{ width: 8 + j * 3 }}
                      />
                    </div>
                  ))}
                </div>

                {/* ── Rule 13: Caption Layer (independent proximity anim) ── */}
                <div
                  data-caption-layer
                  className="absolute bottom-0 left-0 right-0 p-6 z-10"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="h-px w-8 bg-primary/25 mb-4 transition-all duration-700 ease-out group-hover:w-14 group-hover:bg-primary/50" />
                  <h3 className="font-serif text-xl tracking-wide text-white/90 transition-colors duration-500 group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] tracking-[0.15em] uppercase text-white/35">
                    {item.price}
                  </p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="text-[8px] font-mono tracking-[0.15em] text-white/18">
                      {item.sqft}
                    </span>
                    <span className="text-[8px] text-white/10">|</span>
                    <span className="text-[8px] font-mono tracking-[0.15em] text-white/18">
                      Fl {item.floors}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-2.5 text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 transition-all duration-500 ease-out group-hover:text-white/70 group-hover:translate-x-1.5">
                    <span>Discover</span>
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-500 ease-out group-hover:rotate-45" />
                  </div>
                </div>

                {/* ── Rule 14: Hover border glow ── */}
                <div className="absolute inset-0 border border-white/[0.03] transition-all duration-700 group-hover:border-white/[0.1] group-hover:shadow-[inset_0_0_40px_rgba(255,255,255,0.015)] z-[3] pointer-events-none" />
              </div>
            </div>
          </article>
        ))}

        {/* End padding for last card */}
        <div className="w-6 flex-shrink-0 lg:w-[calc((100vw-80rem)/2-1.5rem)]" />
      </div>

      {/* ═══════════════════════════════════════════
          16. DYNAMIC PROGRESS INDICATOR
          Architectural timeline with counter + label
      ═══════════════════════════════════════════ */}
      <div className="absolute bottom-8 left-0 right-0 z-20 hidden px-8 lg:px-16 lg:flex items-center gap-6">
        {/* Current / Total counter */}
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/15 flex-shrink-0 select-none">
          <span ref={progressCurrentRef} className="text-white/30">
            01
          </span>
          <span className="text-white/[0.07] mx-0.5">/</span>
          <span className="text-white/[0.07]">
            {String(COLLECTION.length).padStart(2, "0")}
          </span>
        </span>

        {/* Progress track with markers */}
        <div className="relative flex-1 h-px bg-white/[0.05]">
          {/* Fill line */}
          <div
            ref={progressFillRef}
            className="absolute inset-y-0 left-0 bg-primary/25 origin-left scale-x-0"
            style={{ willChange: "transform" }}
          />

          {/* Card position markers (static dots) */}
          {COLLECTION.map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full border border-white/[0.08] bg-[#050505] transition-colors duration-500"
              style={{ left: `${(i / (COLLECTION.length - 1)) * 100}%` }}
            />
          ))}

          {/* Moving indicator dot */}
          <div
            ref={progressIndicatorRef}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-primary shadow-[0_0_10px_rgba(0,125,197,0.5)]"
            style={{ willChange: "transform", left: 0 }}
          />
        </div>

        {/* Label + Percentage */}
        <div className="flex items-center gap-5 flex-shrink-0 justify-end">
          <span
            ref={progressLabelRef}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25 w-36 text-right truncate select-none"
          >
            {COLLECTION[0].title}
          </span>
          <span
            ref={progressCounterRef}
            className="text-[10px] font-mono text-white/[0.12] w-9 text-right tabular-nums select-none"
          >
            0%
          </span>
        </div>
      </div>
    </section>
  );
}
