"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ClubLoungeTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Content Stagger Reveal */
      gsap.from(".club-anim", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".club-content",
          start: "top 80%",
        },
      });

      /* Image Collage Reveal & Parallax */
      gsap.from(".club-img-main", {
        opacity: 0,
        scale: 1.15,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".club-visuals",
          start: "top 85%",
        },
      });

      gsap.from(".club-img-sub", {
        opacity: 0,
        y: 60,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: ".club-visuals",
          start: "top 85%",
        },
      });

      /* Subtle Parallax on Scroll */
      gsap.to(".club-img-main", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".club-img-sub", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* Rotating Seal */
      gsap.to(".club-seal", {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="club-lounge"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/[0.04] blur-[150px] rounded-full" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ─── Visuals Collage (Left) ─── */}
          <div className="club-visuals relative w-full h-[600px] md:h-[700px] hidden md:block">
            {/* Main Background Image */}
            <div className="club-img-main absolute top-0 left-0 w-[75%] h-[80%] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop"
                alt="VVIP Lounge Interior"
                fill
                sizes="50vw"
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Sub Image (Spa/Pool) */}
            <div className="club-img-sub absolute bottom-0 right-0 w-[55%] h-[50%] overflow-hidden border border-white/[0.05] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=800&auto=format&fit=crop"
                alt="Club Spa and Pool"
                fill
                sizes="30vw"
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Architectural Lines */}
            <div className="absolute top-[5%] right-[20%] w-px h-[90%] bg-white/[0.05] pointer-events-none" />
            <div className="absolute top-[80%] left-0 w-[75%] h-px bg-white/[0.05] pointer-events-none" />

            {/* Floating Rotating Seal */}
            <div className="absolute top-[5%] right-[15%] w-24 h-24 md:w-28 md:h-28 z-10">
              <div className="club-seal relative w-full h-full flex items-center justify-center">
                {/* Circular Text SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full text-primary/60"
                >
                  <defs>
                    <path
                      id="circle"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text className="text-[8px] uppercase tracking-[0.2em] fill-current">
                    <textPath href="#circle">
                      Members Only · Exclusive Access ·{" "}
                    </textPath>
                  </text>
                </svg>
                {/* Center Icon */}
                <div className="w-10 h-10 rounded-full border border-primary/40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(0,125,197,0.6)]" />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Content (Right) ─── */}
          <div className="club-content flex flex-col">
            <span className="club-anim text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6 block">
              The Club & Lounge
            </span>

            <h2 className="club-anim font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-foreground mb-10">
              Express Highway Inn
              <br />
              Club & Lounge
            </h2>

            <div className="club-anim w-16 h-px bg-primary/40 mb-10" />

            <p className="club-anim text-sm md:text-base font-light text-foreground/50 leading-relaxed max-w-xl mb-12">
              A members-only retreat inside Sampan Highway Inn. The VVIP Lounge,
              billiards and card rooms, spa, gym, pool, and more — reserved for
              those who hold the card.
            </p>

            {/* Minimal CTA */}
            <div className="club-anim">
              <a
                href="#membership"
                className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                View Membership Benefits
                <span className="relative w-12 h-px bg-foreground/40 group-hover:bg-primary transition-all duration-500 group-hover:w-20">
                  <ArrowRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Visual (hidden on desktop) */}
        <div className="md:hidden mt-12 relative w-full h-[400px] overflow-hidden border border-white/[0.05]">
          <Image
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"
            alt="VVIP Lounge"
            fill
            sizes="100vw"
            className="object-cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
