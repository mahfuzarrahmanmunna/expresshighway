"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/banner/banner1.jpg", size: "col-span-2 md:col-span-12 aspect-[16/9] md:aspect-[21/9]" },
  { src: "/images/lounge.jpg", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/club/salon.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/club/bar.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/club/lounge.png", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/images/swimmingpool.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/gym.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/room.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/rooms.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewerIndex === null) return;
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowRight")
        setViewerIndex((prev) => (prev === null ? prev : (prev + 1) % GALLERY_IMAGES.length));
      if (event.key === "ArrowLeft")
        setViewerIndex((prev) =>
          prev === null ? prev : (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
        );
    };

    if (viewerIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [viewerIndex]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const elements = node.querySelectorAll(".reveal-up, .reveal-scale");
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

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-x-hidden bg-[#F7F6F2] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F9F8F6] via-[#F7F6F2] to-[#F0EFEA]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-8">
        <div className="gallery-header mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="w-full max-w-3xl md:w-auto">
            <span className="reveal-up mb-6 block text-[10px] font-medium uppercase tracking-[0.4em] text-primary">
              Visual Tour
            </span>
            <h2 className="gallery-heading reveal-up font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.05] tracking-[-0.02em] text-[#0c0b0b]">
              Curated <span className="italic text-primary/80">Gallery.</span>
            </h2>
          </div>

          <div className="w-full max-w-sm md:w-auto md:text-right">
            <div className="reveal-up mb-6 hidden h-px w-16 bg-primary/40 md:ml-auto md:block" />
            <p className="reveal-up text-sm font-light leading-[1.8] text-[#0c0b0b]/50 md:text-base">
              A glimpse into the architecture, ambiance, and meticulously curated spaces that define the Express Highway Inn experience.
            </p>
          </div>
        </div>

        <div className="gallery-grid grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-3">
          {GALLERY_IMAGES.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              onClick={() => setViewerIndex(index)}
              className={`gallery-item reveal-scale group relative cursor-zoom-in overflow-hidden bg-[#0c0b0b] select-none ${item.size}`}
            >
              <div className="gallery-img-wrap absolute inset-0 z-0 h-full w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt="Express Highway Inn Visual"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-[1.04] group-hover:brightness-110 group-hover:contrast-[1.05]"
                  quality={90}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-[1] bg-[#0c0b0b]/0 transition-colors duration-700 group-hover:bg-[#0c0b0b]/10" />
            </div>
          ))}
        </div>
      </div>

      {viewerIndex !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0B0B]/95 p-4 backdrop-blur-xl md:p-8"
          onClick={() => setViewerIndex(null)}
        >
          <button
            onClick={() => setViewerIndex(null)}
            className="absolute right-6 top-6 z-50 p-2 text-white/40 transition-colors duration-500 hover:text-white"
            aria-label="Close viewer"
          >
            <X className="h-8 w-8" strokeWidth={1} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              setViewerIndex((prev) =>
                prev === null ? prev : (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
              );
            }}
            className="group absolute left-4 top-1/2 z-50 -translate-y-1/2 p-2 text-white/40 transition-colors duration-500 hover:text-white md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10 transition-transform duration-500 group-hover:-translate-x-2" strokeWidth={1} />
          </button>

          <div
            className="lightbox-content relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[viewerIndex].src}
              alt="Express Highway Inn Expanded View"
              width={1920}
              height={1080}
              className="lightbox-image max-h-[85vh] max-w-full object-contain shadow-2xl md:max-h-[80vh]"
              quality={100}
              priority
            />
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              setViewerIndex((prev) => (prev === null ? prev : (prev + 1) % GALLERY_IMAGES.length));
            }}
            className="group absolute right-4 top-1/2 z-50 -translate-y-1/2 p-2 text-white/40 transition-colors duration-500 hover:text-white md:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}
