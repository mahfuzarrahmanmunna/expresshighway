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
    img: "https://images.unsplash.com/photo-1584132967334-10e02831ac14?q=80&w=800&auto=format&fit=crop",
    link: "https://sampangroup.com",
  },
  {
    index: "02",
    title: "Sampan Condominium",
    tag: "Hotel & Motel",
    desc: "Premium living spaces designed for rest and rejuvenation on the road.",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    link: "https://sampangroup.com",
  },
  {
    index: "03",
    title: "Sampan Trade Emporium",
    tag: "Super Mall",
    desc: "A comprehensive retail destination bringing daily needs and luxury together.",
    img: "https://images.unsplash.com/photo-1568834543543-38b8b36c1b78?q=80&w=800&auto=format&fit=crop",
    link: "https://sampangroup.com",
  },
];

// ── Three.js Background Component ──
function TownshipCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Architectural Wireframe Terrain
    const geometry = new THREE.PlaneGeometry(25, 25, 40, 40);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0a4a74,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2.2;
    terrain.position.y = -2;
    scene.add(terrain);

    // Store original positions for morphing
    const positions = geometry.attributes.position.array as Float32Array;
    const originalPositions = [...positions];

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Morph terrain vertices
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const dist = Math.sqrt(x * x + y * y);
        positions[i + 2] =
          Math.sin(dist * 1.5 - time * 0.8) * 0.5 +
          Math.cos(x * 0.5 + time * 0.3) * 0.3;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Parallax camera movement
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (5 + mouse.y * 1 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
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
      className="relative w-full bg-[#030303] py-24 md:py-32 overflow-hidden"
    >
      {/* Three.js Ambient Background */}
      <TownshipCanvas />

      {/* Gradient Overlays for Readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] z-[1]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/[0.03] blur-[150px] rounded-full z-[1]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Section Header ─── */}
        <div className="venture-header flex flex-col items-center text-center mb-20 md:mb-24">
          <span className="venture-header-anim text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6 block">
            Our Ventures
          </span>
          <h2 className="venture-header-anim font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-foreground max-w-4xl">
            One Address,{" "}
            <span className="text-primary/80 italic">A Complete</span> Highway
            Township
          </h2>
          <p className="venture-header-anim mt-8 text-sm md:text-base font-light text-foreground/50 leading-relaxed max-w-2xl">
            Express Highway Inn sits alongside three sister projects that make
            this stretch of highway a destination in itself.
          </p>
        </div>

        {/* ─── Ventures Grid ─── */}
        <div className="venture-grid grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.03] border border-white/[0.03]">
          {VENTURES.map((item) => (
            <div
              key={item.index}
              className="venture-card group relative bg-[#030303] aspect-[3/4] md:aspect-auto md:min-h-[600px] overflow-hidden cursor-pointer"
            >
              {/* Image Layer */}
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-20"
                quality={85}
              />

              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-700 group-hover:from-black" />
              <div className="absolute inset-0 bg-[#030303] opacity-50 group-hover:opacity-0 transition-opacity duration-700" />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-[0.3em] text-white/20 font-light transition-colors duration-500 group-hover:text-primary/60">
                    {item.index}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 transition-colors duration-500 group-hover:text-white/80 bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom */}
                <div className="relative">
                  {/* Masked Blurb Animation */}
                  <div className="overflow-hidden mb-5">
                    <p className="text-sm font-light text-foreground/60 translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                      {item.desc}
                    </p>
                  </div>

                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white font-medium leading-tight mb-8">
                    {item.title}
                  </h3>

                  {/* Learn More Link */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors duration-300"
                  >
                    Learn More
                    <span className="relative w-8 h-px bg-foreground/40 group-hover/link:bg-primary transition-all duration-500 group-hover/link:w-14">
                      <ArrowUpRight className="absolute right-0 -top-[5px] h-3 w-3 text-primary opacity-0 group-hover/link:opacity-100 transition-all duration-300 translate-x-2 group-hover/link:translate-x-0" />
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
