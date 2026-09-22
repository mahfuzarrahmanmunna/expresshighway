"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const VENTURES = [
  {
    index: "01",
    title: "Express Highway Club & Lounge",
    tag: "VVIP Lounge",
    desc: "An exclusive sanctuary of comfort and privilege for the modern traveller.",
    img: "/images/clubandlounge.jpeg",
    link: "https://sampangroup.com.bd",
  },
  {
    index: "02",
    title: "Sampan Condominium",
    tag: "Hotel & Motel",
    desc: "Premium living spaces designed for rest and rejuvenation on the road.",
    img: "/images/condomenium.jpg",
    link: "https://sampangroup.com.bd",
  },
  {
    index: "03",
    title: "Sampan Trade Emporium",
    tag: "Super Mall",
    desc: "A comprehensive retail destination bringing daily needs and luxury together.",
    img: "/club/emporium.jpeg",
    link: "https://sampangroup.com.bd",
  },
];

export default function Ventures() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      
      /* ── Premium Split Heading Reveal ── */
      const heading = q(".ventures-heading")[0];
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
          wordClass: "inline-block will-change-transform",
        });

        gsap.fromTo(q(".ventures-heading .word"),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
            },
          }
        );
      }

      /* ── Header Sub-elements Animation ── */
      gsap.fromTo(q(".ventures-header-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ventures-header",
            start: "top 85%",
          },
        }
      );

      /* ── Cards Cinematic Reveal & Parallax ── */
      const cards = gsap.utils.toArray<HTMLElement>(".venture-card");
      
      cards.forEach((card) => {
        const img = card.querySelector(".venture-img-wrap");
        const textEls = card.querySelectorAll(".venture-text");
        const ghostNum = card.querySelector(".venture-ghost-num");
        
        /* Image Wipe In Reveal */
        if (img) {
          gsap.fromTo(img,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
              },
            }
          );
        }

        /* Subtle Parallax on Image */
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
          });
        }

        /* Ghost Number Float */
        if (ghostNum) {
          gsap.fromTo(ghostNum,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
              },
            }
          );
        }

        /* Text Stagger Reveal */
        gsap.fromTo(textEls,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="ventures"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#080808] text-white py-24 md:py-32"
    >
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[300px] w-[1000px] -translate-x-1/2 rounded-full bg-[#C5A572]/[0.04] blur-[150px]" />
      
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "80px 80px" }}></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* ─── Editorial Header ─── */}
        <div className="ventures-header flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-24 md:mb-32">
          <div className="max-w-3xl">
            <span className="ventures-header-anim block text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium mb-8">
              Our Ventures
            </span>
            <h2 
              className="ventures-heading font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{ perspective: "1000px" }}
            >
              One Address, <br/>
              <span className="italic text-[#C5A572]/80">Endless Possibilities.</span>
            </h2>
          </div>
          <div className="max-w-sm md:text-right">
            <div className="hidden md:block w-16 h-px bg-[#C5A572]/40 mb-6 ml-auto ventures-header-anim"></div>
            <p className="ventures-header-anim text-sm md:text-base font-light text-white/50 leading-[1.8]">
              Explore the integrated ecosystem of luxury, lifestyle, and convenience that defines the Express Highway Inn experience.
            </p>
          </div>
        </div>

        {/* ─── Alternating Dynamic Grid ─── */}
        <div className="flex flex-col gap-24 md:gap-32">
          {VENTURES.map((item, i) => {
            const isReversed = i % 2 !== 0;

            return (
              <article
                key={item.index}
                className="venture-card group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                
                {/* Architectural Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#C5A572]/30 z-20 hidden md:block"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#C5A572]/30 z-20 hidden md:block"></div>

                {/* Ghost Index Number */}
                <span 
                  className={`venture-ghost-num absolute top-0 z-0 font-[family-name:var(--font-playfair)] text-[120px] md:text-[180px] leading-none text-white/[0.03] pointer-events-none select-none ${
                    isReversed ? "right-0 md:right-[-20px] text-right" : "left-0 md:left-[-20px] text-left"
                  }`}
                >
                  {item.index}
                </span>

                {/* Image Wrapper - Conditionally Ordered */}
                <div 
                  className={`relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden border border-white/10 ${
                    isReversed ? "md:col-span-7 md:order-2" : "md:col-span-7 md:order-1"
                  }`}
                >
                  {/* Inner Wrapper for Parallax & Reveal */}
                  <div className="venture-img-wrap absolute inset-0 top-[-10%] h-[120%] w-full overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-top object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-105"
                      quality={90}
                    />
                  </div>
                  {/* Subtle Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Content - Conditionally Ordered */}
                <div 
                  className={`flex flex-col justify-center py-4 ${
                    isReversed ? "md:col-span-5 md:order-1 md:pr-12" : "md:col-span-5 md:order-2 md:pl-12"
                  }`}
                >
                  <div className="venture-text flex items-center gap-4 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A572] font-medium">{item.index}</span>
                    <span className="h-px w-8 bg-white/20"></span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{item.tag}</span>
                  </div>

                  <h3 className="venture-text font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight leading-[1.1]">
                    {item.title}
                  </h3>

                  <p className="venture-text max-w-md text-sm md:text-base font-light text-white/60 leading-[1.8] mb-10">
                    {item.desc}
                  </p>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="venture-text group/link relative inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-[#C5A572] font-medium transition-colors duration-300 hover:text-white w-fit"
                  >
                    Visit Platform
                    <span className="relative w-12 h-px bg-[#C5A572]/40 group-hover/link:bg-white transition-colors duration-500">
                      <span className="absolute inset-0 bg-white origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1 group-hover/link:rotate-45" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}