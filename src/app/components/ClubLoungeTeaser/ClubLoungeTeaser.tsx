"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ClubLoungeTeaser() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const elements = node.querySelectorAll(".reveal-up, .reveal-scale, .reveal-right");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="club-lounge"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="pointer-events-none absolute bottom-0 left-0 h-[800px] w-[800px] rounded-full bg-primary/[0.04] blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative hidden h-[600px] w-full md:block md:h-[700px]">
            <div className="reveal-scale absolute left-0 top-0 h-[80%] w-[75%] overflow-hidden ">
              <Image
                src="/images/elegant-dining-room-interior-with-rich-decor.jpg"
                alt="VVIP Lounge Interior"
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
            </div>

            <div className="reveal-right absolute bottom-0 right-0 h-[50%] w-[55%] overflow-hidden border border-[#0c0b0b]/10 shadow-2xl">
              <Image
                src="/images/dining-table-with-chairs-tableware.jpg"
                alt="Club Spa and Pool"
                fill
                sizes="30vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            </div>

            <div className="pointer-events-none absolute right-[20%] top-[5%] h-[90%] w-px bg-[#0c0b0b]/10" />
            <div className="pointer-events-none absolute left-0 top-[80%] h-px w-[75%] bg-[#0c0b0b]/10" />

            <div className="absolute right-[15%] top-[5%] z-10 h-24 w-24 md:h-28 md:w-28">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[#0c0b0b]/10 bg-white/60 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(0,125,197,0.6)]" />
              </div>
            </div>
          </div>

          <div className="club-content flex flex-col">
            <span className="reveal-up mb-6 block text-[10px] font-medium uppercase tracking-[0.4em] text-primary">
              The Club & Lounge
            </span>

            <h2 className="reveal-up mb-10 font-[family-name:var(--font-playfair)] text-4xl font-medium leading-[1.05] text-[#0c0b0b] md:text-5xl lg:text-6xl">
              Express Highway Inn
              <br />
              Club & Lounge
            </h2>

            <div className="reveal-up mb-10 h-px w-16 bg-primary/40" />

            <p className="reveal-up max-w-xl text-sm font-light leading-relaxed text-[#0c0b0b]/60 md:text-base">
              A members-only retreat inside Sampan Highway Inn. The VVIP Lounge,
              billiards and card rooms, spa, gym, pool, and more — reserved for
              those who hold the card.
            </p>

            <div className="reveal-up mt-12">
              <a
                href="/club-and-membership"
                className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-[#0c0b0b]/80 transition-colors duration-300 hover:text-primary"
              >
                View Membership Benefits
                <span className="relative h-px w-12 bg-[#0c0b0b]/40 transition-all duration-500 group-hover:w-20 group-hover:bg-primary">
                  <ArrowRight className="absolute -top-[5px] right-0 h-3 w-3 translate-x-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-[400px] overflow-hidden border border-[#0c0b0b]/10 md:hidden">
          <Image
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"
            alt="VVIP Lounge"
            fill
            sizes="100vw"
            className="object-cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}