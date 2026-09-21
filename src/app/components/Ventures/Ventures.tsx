"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const VENTURES = [
  {
    index: "01",
    title: "Express Highway Club & Lounge",
    tag: "VVIP Lounge",
    desc: "An exclusive sanctuary of comfort and privilege for the modern traveller.",
    img: "/club/resturant.webp",
    link: "https://sampangroup.com",
  },
  {
    index: "02",
    title: "Sampan Condominium",
    tag: "Hotel & Motel",
    desc: "Premium living spaces designed for rest and rejuvenation on the road.",
    img: "/images/condomenium.jpg",
    link: "https://sampangroup.com",
  },
  {
    index: "03",
    title: "Sampan Trade Emporium",
    tag: "Super Mall",
    desc: "A comprehensive retail destination bringing daily needs and luxury together.",
    img: "/club/emporium.jpeg",
    link: "https://sampangroup.com",
  },
];

export default function Ventures() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const elements = node.querySelectorAll(".reveal-up, .reveal-card");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="ventures"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#080808] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      <div className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[300px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="venture-header reveal-up mb-20 flex flex-col items-center text-center md:mb-24">
          <span className="mb-6 block text-[10px] font-medium uppercase tracking-[0.4em] text-primary">
            Our Ventures
          </span>
          <h2 className="max-w-4xl font-[family-name:var(--font-playfair)] text-4xl font-medium leading-[1.05] text-gray-400 md:text-6xl lg:text-7xl">
            One Address, <span className="italic text-primary/80">endless possibilities.</span>
          </h2>
        </div>

        <div className="venture-grid grid gap-8 md:gap-12">
          {VENTURES.map((item) => (
            <article
              key={item.index}
              className="reveal-card group relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1.6fr]">
                <div className="relative h-[280px] overflow-hidden md:h-[360px]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    quality={80}
                  />
                </div>

                <div className="flex flex-col justify-center p-6 md:p-12">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-primary">{item.index}</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{item.tag}</span>
                  </div>

                  <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-3xl text-white md:text-4xl">
                    {item.title}
                  </h3>

                  <p className="max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                    {item.desc}
                  </p>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-primary transition-colors duration-300 hover:text-white"
                  >
                    Visit Platform
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}