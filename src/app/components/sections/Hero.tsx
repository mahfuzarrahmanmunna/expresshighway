"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#070707] text-white">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero.jpg"
          className="h-full w-full object-cover opacity-75"
        >
          <source src="/herovideo.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          className={`max-w-4xl transition-all duration-700 ease-out ${
            isReady ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.45em] text-white/70">
            Premium hospitality • Dhaka–Chittagong Highway
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-medium tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[6rem]">
            Where the Highway Leads to Luxury
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm text-white/75 md:text-lg">
            Express Highway Inn blends fine dining, a dedicated Club & Lounge,
            and everyday convenience in one refined stop for travellers and members.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/club-and-lounge"
              className="inline-flex items-center justify-center border border-white/25 bg-white/10 px-8 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Explore Club & Lounge
            </Link>
            <Link
              href="/contactus"
              className="inline-flex items-center justify-center border border-white/15 bg-black/15 px-8 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/85 backdrop-blur-sm transition hover:bg-black/25 hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center text-[8px] uppercase tracking-[0.4em] text-white/50">
        Scroll to discover
      </div>
    </section>
  );
}
