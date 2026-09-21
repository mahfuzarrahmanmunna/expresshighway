"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Gallery Data ── */
const GALLERY_IMAGES = [
  { src: "/images/highwayinn.jpg", title: "Sampan Highway Inn", desc: "Whether you need a quick refreshing bite, authentic Bengali sweets, artisanal pickles, or a quiet restful suite, our transit hub provides complete comfort and hospitality under one roof." },
  { src: "/club/room.jpg", title: "VVIP Rest Suites", desc: "Acoustically engineered suites offering plush king-size beds, private en-suite rain showers, smart IPTV, and climate control for quiet respite from highway rumble." },
  { src: "/highwayinn/vvip-lounge.jpeg", title: "Executive Lounge", desc: "Lavish seating with quiet ambiance, complimentary refreshments, and premium amenities for executives and families seeking an upscale rest stop." },
  { src: "/highwayinn/fast-food.jpeg", title: "Sampan Fast Food", desc: "Serving up delicious, piping-hot burgers, crispy fried chicken, wraps, and quick savory bites prepared freshly to keep you energized on your journey." },
];

/* ═══════════════════════════════════════════════════════════════
   HIGHWAY HOSPITALITY SECTION (Interactive Gallery)
═══════════════════════════════════════════════════════════════ */
function HighwayHospitality() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let splitInstance: SplitType | null = null;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });

    const heading = document.querySelector<HTMLElement>(".hospitality-head");
    if (heading) {
      splitInstance = new SplitType(heading, {
        types: "lines,words",
        lineClass: "overflow-hidden block",
      });
      gsap.set(".hospitality-head .word", { yPercent: 110, opacity: 0 });
      tl.to(
        ".hospitality-head .word",
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.8,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.5"
      );
    }

    tl.from(".hospitality-eyebrow", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=1.5")
      .from(".hospitality-sub", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8")
      .from(".hospitality-cta", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8");

    // Gallery Stagger Reveal Animation
    gsap.fromTo(
      ".gallery-item",
      { clipPath: "inset(100% 0 0 0)", y: 40 },
      {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".gallery-wrap", start: "top 85%" },
      }
    );

    return () => {
      splitInstance?.revert();
    };
  }, { scope: ref });

  return (
    <section ref={ref} className="relative bg-[#F7F6F2] text-[#0c0b0b] py-24 md:py-40 lg:py-56 overflow-hidden border-t border-[#0c0b0b]/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        {/* Top Editorial Layout: Text Left, CTA Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20 lg:mb-28 items-end">
          <div className="lg:col-span-8 flex flex-col">
            <span className="hospitality-eyebrow block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-medium mb-6 md:mb-8">
              Highway Hospitality
            </span>
            <h2 className="hospitality-head font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] md:leading-[1.05] tracking-[-0.02em] text-[#0c0b0b]">
              Where Every Journey Deserves a Better Stop.
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start gap-6 md:gap-8">
            <p className="hospitality-sub text-base md:text-lg lg:text-xl font-light text-[#0c0b0b]/50 max-w-md leading-relaxed tracking-[0.01em]">
              Discover <span className="text-[#0c0b0b] font-normal">Sampan Highway Inn</span> - a 24/7 premium transit destination at KM 103, bringing together refined dining, restful suites, executive comfort, and seamless highway access.
            </p>
            <a
              href="https://www.sampangroup.com.bd/our-divisions/hospitality-highway-travel/sampan-highway-inn"
              target="_blank"
              className="hospitality-cta group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#0c0b0b] text-white text-[10px] uppercase tracking-[0.35em] font-medium overflow-hidden hover:bg-[#007DC6] transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              data-cursor="DISCOVER"
            >
              <span className="relative z-10">Discover Highway Inn</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Interactive Image Gallery (Responsive) */}
        {/* Mobile: Vertical Stack | Desktop: Horizontal Accordion */}
        <div className="gallery-wrap relative w-full flex flex-col md:flex-row gap-4 md:gap-2 h-auto md:h-[60vh] lg:h-[80vh]">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-item group relative w-full h-[420px] md:h-full md:flex-1 overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:md:flex-[4] border border-[#0c0b0b]/10"
              data-cursor="VIEW"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 opacity-90"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0b] via-[#0c0b0b]/20 to-transparent transition-opacity duration-700 group-hover:opacity-100 opacity-80"></div>
              </div>

              {/* Number Marker */}
              <div className="absolute top-6 left-6 z-10 text-white">
                <span className="text-[10px] tracking-[0.4em] opacity-70">0{i + 1}</span>
              </div>

              {/* Content Overlay */}
              {/* On mobile: always visible. On desktop: hidden by default, slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10 text-white transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0 md:translate-y-6 md:group-hover:translate-y-0">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl font-light mb-2 leading-tight">
                  {img.title}
                </h3>
                <p className="text-sm text-white/70 md:text-white/0 md:max-h-0 md:group-hover:max-h-32 md:group-hover:text-white/70 max-h-32 overflow-hidden transition-all duration-500">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* KM 103 Marker Overlay Below Gallery */}
        <div className="mt-10 md:mt-12 flex items-center gap-4 md:gap-6">
          <div className="w-16 md:w-32 h-px bg-[#007DC6]/30"></div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-[#0c0b0b]/40">Location Marker</span>
            <span className="block text-xl md:text-2xl font-[family-name:var(--font-playfair)] text-[#007DC6] mt-1">KM 103</span>
          </div>
          <div className="flex-1 h-px bg-[#0c0b0b]/10 ml-4 md:ml-6"></div>
        </div>

      </div>
    </section>
  );
}

export default HighwayHospitality;