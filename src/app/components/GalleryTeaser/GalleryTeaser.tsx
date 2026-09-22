"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const GALLERY_IMAGES = [
  { src: "/images/clubandlounge.jpeg", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/club/salon.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/club/bar.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/club/condomenium.jpg", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/images/swimmingpool.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/gym.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/room.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/club/rooms.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/images/WhatsApp Image 2025-11-02 at 5.51.44 PM.jpeg", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/images/WhatsApp_Image_2026-08-30_at_2.27.22_PM.jpg", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/images/freepik__enhance__34463.png", size: "col-span-1 md:col-span-4 aspect-[4/5]" },
  { src: "/images/WhatsApp_Image_2026-08-30_at_2.27.22_PM.jpg", size: "col-span-1 md:col-span-8 aspect-[4/5] md:aspect-[16/10]" },
  { src: "/images/restaurant-hall-with-round-square-tables-some-chairs-plants (3).jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/images/Express-Highway-Inn-New-Model-Design-4.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/images/restaurant-hall-with-round-square-tables-some-chairs-plants (2).jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
  { src: "/images/lighting.jpg", size: "col-span-1 md:col-span-3 aspect-[3/2]" },
];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Initialize Video.js
  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "metadata",
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        pictureInPictureToggle: false,
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Lightbox Keyboard Navigation
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

  // Scroll Reveal Observer
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
          
          {/* ════════════════════════════════════════ */}
          {/* PREMIUM VIDEO.JS BANNER SECTION           */}
          {/* ════════════════════════════════════════ */}
          <div className="reveal-up col-span-2 md:col-span-12 relative mb-2 md:mb-3 group">
            
            {/* Architectural Corner Accents */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t border-l border-[#0c0b0b]/30 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 group-hover:left-0 group-hover:border-[#007DC6]/80"></div>
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t border-r border-[#0c0b0b]/30 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 group-hover:right-0 group-hover:border-[#007DC6]/80"></div>
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b border-l border-[#0c0b0b]/30 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bottom-0 group-hover:left-0 group-hover:border-[#007DC6]/80"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b border-r border-[#0c0b0b]/30 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bottom-0 group-hover:right-0 group-hover:border-[#007DC6]/80"></div>

            {/* Video Wrapper */}
            <div className="relative w-full overflow-hidden border border-[#0c0b0b]/10 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.3)] bg-black">
              <div data-vjs-player className="w-full aspect-video">
                <video
                  ref={videoRef}
                  className="video-js vjs-big-play-centered vjs-theme-luxe"
                  poster="/images/cta.jpeg" 
                  playsInline
                >
                  <source src="/herovideo.mp4" type="video/mp4" />
                  <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a web browser that{" "}
                    <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
                      supports HTML5 video
                    </a>
                  </p>
                </video>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════ */}
          {/* STANDARD GALLERY IMAGES                   */}
          {/* ════════════════════════════════════════ */}
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

      {/* Premium Video.js Custom Theme */}
      <style jsx global>{`
        /* 1. Hide unnecessary UI elements for a cleaner look */
        .vjs-theme-luxe .vjs-volume-panel,
        .vjs-theme-luxe .vjs-settings-menu,
        .vjs-theme-luxe .vjs-remaining-time,
        .vjs-theme-luxe .vjs-picture-in-picture-control {
          display: none !important;
        }

        /* 2. Player Background */
        .vjs-theme-luxe.video-js {
          background-color: #050505;
          font-family: var(--font-sans), sans-serif;
        }

        /* 3. Big Play Button */
        .vjs-theme-luxe .vjs-big-play-button {
          width: 90px;
          height: 90px;
          line-height: 90px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translate(-50%, -50%) scale(1); /* Perfectly Centered */
          top: 50%;
          left: 50%;
          margin: 0;
          padding: 0;
        }

        .vjs-theme-luxe:hover .vjs-big-play-button {
          background-color: rgba(0, 125, 198, 0.2);
          border-color: #007DC6;
          box-shadow: 0 0 60px rgba(0, 125, 198, 0.4);
          transform: translate(-50%, -50%) scale(1.05);
        }

        .vjs-theme-luxe .vjs-big-play-button .vjs-icon-placeholder:before {
          font-size: 36px;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        /* 4. Control Bar Styling */
        .vjs-theme-luxe .vjs-control-bar {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
          height: 60px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .vjs-theme-luxe.vjs-user-active .vjs-control-bar,
        .vjs-theme-luxe.vjs-paused .vjs-control-bar {
          opacity: 1;
        }

        .vjs-theme-luxe .vjs-button > .vjs-icon-placeholder:before {
          line-height: 60px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
          font-size: 18px;
        }

        .vjs-theme-luxe .vjs-button:hover > .vjs-icon-placeholder:before {
          color: #fff;
        }

        /* 5. Progress Bar */
        .vjs-theme-luxe .vjs-progress-control {
          position: absolute;
          top: -10px; /* Hover above the control bar */
          left: 0;
          right: 0;
          width: 100%;
          height: 6px;
        }

        .vjs-theme-luxe .vjs-progress-holder {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 0;
          height: 2px;
          transition: height 0.3s ease, background-color 0.3s ease;
          margin: 0 20px;
        }

        .vjs-theme-luxe .vjs-progress-control:hover .vjs-progress-holder {
          height: 6px; /* Expand on hover */
          background-color: rgba(255, 255, 255, 0.25);
        }

        .vjs-theme-luxe .vjs-play-progress {
          background: #007DC6;
          border-radius: 0;
        }

        .vjs-theme-luxe .vjs-play-progress:before {
          color: #007DC6;
          font-size: 14px;
          top: -5px;
        }

        .vjs-theme-luxe .vjs-load-progress {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0;
        }

        /* 6. Time Display */
        .vjs-theme-luxe .vjs-current-time,
        .vjs-theme-luxe .vjs-duration {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.6);
          font-family: var(--font-sans), sans-serif;
        }

        .vjs-theme-luxe .vjs-time-divider {
          color: rgba(255, 255, 255, 0.3);
          font-size: 11px;
        }

        /* 7. Custom Spacing */
        .vjs-theme-luxe .vjs-control-bar {
          justify-content: space-between;
        }
        
        .vjs-theme-luxe .vjs-play-control {
          margin-right: 20px;
          flex: 0 0 auto;
        }

        .vjs-theme-luxe .vjs-time-control {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
        }

        /* Reveal Animation */
        .reveal-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-up.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}