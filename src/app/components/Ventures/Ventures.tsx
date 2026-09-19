"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
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
    img: "/club/condominium.png",
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

// ── Three.js Background Component ──
function TownshipCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.MeshBasicMaterial | null = null;

    const handleContextLoss = (event: Event) => {
      console.warn("WebGL context lost. Disposing 3D background.");
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };

    canvas.addEventListener('webglcontextlost', handleContextLoss, false);

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 5, 6);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false,
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      geometry = new THREE.PlaneGeometry(25, 25, 40, 40);
      material = new THREE.MeshBasicMaterial({
        color: 0x0a4a74,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const terrain = new THREE.Mesh(geometry, material);
      terrain.rotation.x = -Math.PI / 2.2;
      terrain.position.y = -2;
      scene.add(terrain);

      const positions = geometry.attributes.position.array as Float32Array;
      const originalPositions = [...positions];

      const mouse = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouseMove);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        for (let i = 0; i < positions.length; i += 3) {
          const x = originalPositions[i];
          const y = originalPositions[i + 1];
          const dist = Math.sqrt(x * x + y * y);
          positions[i + 2] =
            Math.sin(dist * 1.5 - time * 0.8) * 0.5 +
            Math.cos(x * 0.5 + time * 0.3) * 0.3;
        }
        geometry!.attributes.position.needsUpdate = true;
        geometry!.computeVertexNormals();

        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (5 + mouse.y * 1 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        if (renderer) renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener('webglcontextlost', handleContextLoss);
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();
      };
    } catch (error) {
      console.warn("WebGL initialization failed. Background disabled.", error);
      canvas.style.display = 'none';
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
}

// ── Main Section Component ──
export default function Ventures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Header Animation */
      gsap.from(".venture-header-anim", {
        opacity: 0,
        y: 50,
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".venture-header",
          start: "top 85%",
        },
      });

      /* Cards Stagger */
      gsap.from(".venture-card", {
        opacity: 0,
        y: 80,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".venture-grid",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="ventures"
      ref={containerRef}
      className="relative w-full bg-[#080808] py-24 md:py-32 overflow-hidden"
    >
      {/* Three.js Ambient Background */}
      <TownshipCanvas />

      {/* Gradient Overlays for Readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] z-[1]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/[0.04] blur-[150px] rounded-full z-[1]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="venture-header flex flex-col items-center text-center mb-20 md:mb-24">
          <span className="venture-header-anim text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 block">
            Our Ventures
          </span>
          <h2 className="venture-header-anim text-gray-400 font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-foreground max-w-4xl">
            One Address,{" "}
            <span className="text-primary italic">A Complete</span> Highway
            Township
          </h2>
          <p className="venture-header-anim mt-8 text-sm md:text-base font-light text-gray-400 leading-relaxed max-w-2xl">
            Express Highway Inn sits alongside three sister projects that make
            this stretch of highway a destination in itself.
          </p>
        </div>

        {/* ─── Ventures Grid ─── */}
        <div className="venture-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {VENTURES.map((item) => (
            <div
              key={item.index}
              className="venture-card relative aspect-[3/4] md:aspect-auto md:min-h-[600px] overflow-hidden cursor-pointer border border-white/10"
            >
              {/* Image Layer - Fully visible, vibrant colors, no hover scaling */}
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                quality={90}
              />

              {/* Subtle bottom gradient for text readability over bright images */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />

              {/* Content - Always Visible */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-[0.3em] text-white font-light bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {item.index}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom */}
                <div className="relative">
                  {/* Always visible description */}
                  <p className="text-sm font-light text-white/90 drop-shadow-lg mb-5">
                    {item.desc}
                  </p>

                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white font-medium leading-tight mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h3>

                  {/* Static Learn More Link */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/90 hover:text-primary transition-colors duration-300"
                  >
                    Learn More
                    <span className="relative w-8 h-px bg-white/80">
                      <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}