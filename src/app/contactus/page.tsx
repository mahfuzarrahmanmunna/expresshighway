"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   1. GLOBAL CURSOR & GRAIN
═══════════════════════════════════════════════════════════════ */
function CustomCursorAndGrain() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const yRing = gsap.quickTo(ring, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        const cursorText = interactive.getAttribute("data-cursor");
        gsap.to(ring, {
          scale: 3.5,
          borderColor: "rgba(0, 125, 197, 0.6)",
          backgroundColor: "rgba(0, 125, 197, 0.05)",
        });
        if (cursorText && ring.querySelector("span")) {
          (ring.querySelector("span") as HTMLElement).textContent = cursorText;
        }
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "transparent",
        });
        if (ring.querySelector("span")) {
          (ring.querySelector("span") as HTMLElement).textContent = "";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 z-[9999] w-2 h-2 bg-white rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%]"
      ></div>
      <div
        ref={ringRef}
        className="hidden md:flex fixed top-0 left-0 z-[9998] w-10 h-10 border border-white/40 rounded-full pointer-events-none mix-blend-difference translate-x-[-50%] translate-y-[-50%] items-center justify-center transition-colors duration-300"
      >
        <span className="text-[7px] uppercase tracking-[0.2em] text-white opacity-0"></span>
      </div>
      <div
        className="fixed inset-0 z-[9997] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. THREE.JS HIGHWAY SCENE
═══════════════════════════════════════════════════════════════ */
function HighwayScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030405, 0.025);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x404040, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    scene.add(dirLight);
    const blueLight = new THREE.PointLight(0x007dc5, 2, 50);
    scene.add(blueLight);

    // Highway Curve
    const points = [];
    for (let i = 0; i < 100; i++) {
      points.push(new THREE.Vector3(Math.sin(i * 0.05) * 15, 0, -i * 4));
    }
    const curve = new THREE.CatmullRomCurve3(points);

    // Road Mesh
    const roadGeometry = new THREE.TubeGeometry(curve, 200, 4, 8, false);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x090b0d,
      roughness: 0.9,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    scene.add(road);

    // Light Trail (Tube following curve)
    const trailGeometry = new THREE.TubeGeometry(curve, 200, 0.2, 8, false);
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: 0x007dc5,
      transparent: true,
      opacity: 0.6,
    });
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    scene.add(trail);

    // Lane Markings
    const markings: { mesh: THREE.Mesh; offset: number }[] = [];
    const markingGeom = new THREE.PlaneGeometry(0.5, 2);
    const markingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    for (let i = 0; i < 40; i++) {
      const mark = new THREE.Mesh(markingGeom, markingMat);
      mark.rotation.x = -Math.PI / 2;
      scene.add(mark);
      markings.push({ mesh: mark, offset: i * 10 });
    }

    // Particles
    const particleGeom = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Camera Animation State
    const cameraTarget = new THREE.Vector3();
    const cameraLookAhead = new THREE.Vector3();
    const progress = { val: 0 };

    // ScrollTrigger controls camera progress
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        progress.val = self.progress * 0.95; // Keep camera on path
      },
    });

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Move camera along curve
      curve.getPointAt(progress.val, cameraTarget);
      camera.position.lerp(cameraTarget, 0.1);

      // Look slightly ahead
      curve.getPointAt(Math.min(progress.val + 0.05, 0.99), cameraLookAhead);
      camera.lookAt(cameraLookAhead);

      // Animate markings
      markings.forEach((m) => {
        const z = camera.position.z - m.offset + ((time * 20) % 10);
        m.mesh.position.set(
          camera.position.x + Math.sin(z * 0.05) * 15,
          0.1,
          z,
        );
      });

      // Pulse light trail
      trailMaterial.opacity = 0.4 + Math.sin(time) * 0.2;

      // Particle movement
      particles.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      st.kill();
      renderer.dispose();
      roadGeometry.dispose();
      roadMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      markingGeom.dispose();
      markingMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}

/* ═══════════════════════════════════════════════════════════════
   3. CINEMATIC HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".hero-headline .word", { yPercent: 110, opacity: 0 });
        tl.to(".hero-headline .word", {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.15,
          ease: "power4.out",
        });
      }

      tl.from(
        ".hero-sub",
        { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
        "-=0.8",
      )
        .from(
          ".hero-cta",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".live-indicator",
          { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.7)" },
          "-=0.5",
        );

      // Parallax typography on scroll
      gsap.to(".hero-content", {
        yPercent: -20,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-[150vh] w-full bg-[#030405] overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex items-center">
        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-0">
          <HighwayScene />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030405] via-transparent to-transparent z-[1]"></div>
        </div>

        {/* Left Typography */}
        <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6">
            <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(3rem,9vw,8rem)] leading-[0.95] font-medium">
              <div className="block">Get in</div>
              <div className="block text-primary italic">Touch.</div>
            </h2>
            <p className="hero-sub mt-10 text-lg md:text-xl font-light text-white/60 max-w-xl leading-relaxed">
              For membership enquiries, pricing, corporate events or general
              questions — we&apos;re here, right on the highway.
            </p>

            <div className="hero-cta mt-12 flex flex-wrap gap-4">
              <a
                href="#enquiry"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden"
                data-cursor="ENQUIRE"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <span className="relative z-10">Start an Enquiry</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#location"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-white/5 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Floating Location Indicator */}
          <div className="hidden lg:flex lg:col-span-6 justify-end items-center pr-12">
            <div className="live-indicator relative flex flex-col items-end gap-2">
              <div className="relative flex items-center gap-3">
                <div className="relative w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping"></span>
                  <span className="relative inline-flex w-3 h-3 rounded-full bg-primary"></span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                  Live Location
                </span>
              </div>
              <span className="text-sm uppercase tracking-[0.2em] text-white/80">
                Express Highway Inn
              </span>
              <span className="text-xs text-white/40">Your Destination</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. LOCATION & INTERACTIVE MAP
═══════════════════════════════════════════════════════════════ */
function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const text = document.querySelector<HTMLElement>(".loc-head");
      if (text) {
        new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".loc-head .line", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      // SVG Route Drawing
      const path =
        ref.current?.querySelector<SVGPathElement>(".map-route-path");

      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 3,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".map-container", start: "top 75%" },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="location"
      ref={ref}
      className="bg-[#F7F6F2] text-black py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mb-20">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            Right on the Highway
          </span>
          <h2 className="loc-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05]">
            Easy to find.
            <br />
            Easy to reach.
          </h2>
          <p className="mt-8 text-base md:text-lg font-light text-black/50 max-w-xl leading-relaxed">
            Whether you&apos;re stopping for the night, visiting the Club &
            Lounge, planning an event or simply need directions, our team is
            ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border border-black/10 p-8 mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 block mb-4">
                Highway Landmark
              </span>
              <p className="text-xl font-[family-name:var(--font-playfair)] mb-2">
                Dhaka - Chittagong Highway
              </p>
              <p className="text-sm text-black/60">
                Mirsarai, Chittagong, Bangladesh
              </p>
            </div>

            <div className="border border-black/10 p-8">
              <span className="font-[family-name:var(--font-playfair)] text-6xl md:text-7xl font-medium text-primary block leading-none">
                24/7
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 block mt-4">
                Open Every Day
              </span>
            </div>
          </div>

          {/* Right: Interactive Map */}
          <div
            className="lg:col-span-7 map-container relative w-full aspect-[4/5] md:aspect-square overflow-hidden border border-black/10"
            data-cursor="MAP"
          >
            <iframe
              title="Express Highway Inn Location"
              src="https://maps.google.com/maps?q=Mirsarai%20Chittagong&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full grayscale invert contrast-[0.9] brightness-[0.85] opacity-90"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Map Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-transparent to-transparent"></div>
            <div className="pointer-events-none absolute inset-0 bg-primary/[0.02] mix-blend-overlay"></div>

            {/* SVG Route */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                className="map-route-path"
                d="M0,80 L40,80 L60,50 L60,20"
                fill="none"
                stroke="#007DC5"
                strokeWidth="0.5"
                strokeDasharray="4"
              />
            </svg>

            {/* Custom Marker */}
            <div
              className="absolute top-[20%] left-[60%] flex flex-col items-center group cursor-pointer"
              data-cursor="OPEN"
            >
              <div className="relative w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping"></span>
                <span className="relative w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg"></span>
              </div>

              <div className="mt-2 bg-black/80 backdrop-blur-md text-white p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-primary">
                  Your Destination
                </span>
                <span className="block text-sm font-[family-name:var(--font-playfair)] mt-1">
                  Express Highway Inn
                </span>
                <span className="block text-[10px] text-white/60 mt-1">
                  Open 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. CONTACT DETAILS LIST
═══════════════════════════════════════════════════════════════ */
function ContactList() {
  const contacts = [
    {
      num: "01",
      label: "Call Us",
      value: "+880 1710 000000",
      href: "tel:+8801710000000",
      Icon: Phone,
    },
    {
      num: "02",
      label: "WhatsApp",
      value: "+880 1710 000000",
      href: "https://wa.me/8801710000000",
      Icon: MessageSquare,
    },
    {
      num: "03",
      label: "Email",
      value: "info@expresshighwayinn.com",
      href: "mailto:info@expresshighwayinn.com",
      Icon: Mail,
    },
    {
      num: "04",
      label: "Visit",
      value: "Dhaka - Chittagong Hwy",
      href: "#location",
      Icon: MapPin,
    },
  ];

  return (
    <section className="bg-[#030405] text-white py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-white/10">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.num === "02" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between py-12 border-b border-white/10 cursor-pointer overflow-hidden"
              data-cursor={c.label.toUpperCase()}
            >
              {/* Hover Background Expand */}
              <span className="absolute inset-0 bg-primary/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>

              <div className="relative flex items-center gap-8 md:gap-16">
                <span className="text-[10px] tracking-[0.3em] text-white/20 group-hover:text-primary/70 transition-colors w-8">
                  {c.num}
                </span>

                <div className="flex items-center gap-6">
                  <c.Icon className="h-6 w-6 text-white/30 group-hover:text-primary transition-colors" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                      {c.label}
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl font-medium text-white/80 group-hover:text-white transition-all duration-500 group-hover:translate-x-3">
                      {c.value}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                <span className="hidden md:block w-0 h-px bg-primary group-hover:w-16 transition-all duration-500"></span>
                <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-primary transition-all duration-500 group-hover:translate-x-2 group-hover:rotate-45" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. SAMPAN GROUP HEAD OFFICE
═══════════════════════════════════════════════════════════════ */
function SampanOffice() {
  return (
    <section className="bg-[#090B0D] text-white py-32 md:py-48 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            Corporate Connection
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05] mb-8">
            The Sampan Group
            <br />
            Head Office.
          </h2>
          <p className="text-lg font-light text-white/50 max-w-md leading-relaxed">
            For corporate enquiries, partnerships and wider Sampan Group
            matters, connect directly with our head office.
          </p>
        </div>

        <div className="border border-white/10 divide-y divide-white/10">
          <div className="p-8 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              Phone
            </span>
            <a
              href="tel:+8801710000000"
              className="text-xl font-[family-name:var(--font-playfair)] hover:text-primary transition-colors"
              data-cursor="CALL"
            >
              +880 1710 000000
            </a>
          </div>
          <div className="p-8 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              WhatsApp
            </span>
            <a
              href="https://wa.me/8801710000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-[family-name:var(--font-playfair)] hover:text-primary transition-colors"
              data-cursor="CALL"
            >
              +880 1710 000000
            </a>
          </div>
          <div className="p-8 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              Email
            </span>
            <a
              href="mailto:info@sampangroup.com"
              className="text-xl font-[family-name:var(--font-playfair)] hover:text-primary transition-colors"
              data-cursor="MAIL"
            >
              info@sampangroup.com
            </a>
          </div>
          <div className="p-8 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              Address
            </span>
            <p className="text-xl font-[family-name:var(--font-playfair)] text-white/80">
              Gulshan, Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ENQUIRY FORM
═══════════════════════════════════════════════════════════════ */
function EnquiryForm() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [type, setType] = useState("General");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });

      const heading = document.querySelector<HTMLElement>(".form-head");
      if (heading) {
        new SplitType(heading, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".form-head .line", { yPercent: 110 });
        tl.to(".form-head .line", {
          yPercent: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "power4.out",
        });
      }

      tl.from(
        ".form-anim",
        { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.8",
      );

      // Magnetic Button
      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", {
          duration: 0.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(btn, "y", {
          duration: 0.4,
          ease: "power3.out",
        });

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          xTo(x * 0.4);
          yTo(y * 0.4);
        };
        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
        return () => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="enquiry"
      ref={ref}
      className="relative bg-black text-white py-32 md:py-56 overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-[1]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <span className="form-anim block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-8">
            Let&apos;s Talk
          </span>
          <h2 className="form-head font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] mb-10">
            <div>Start a</div>
            <div className="text-primary italic">Conversation.</div>
          </h2>
          <p className="form-anim text-lg font-light text-white/50 max-w-md leading-relaxed">
            Whether you are looking for membership information, planning an
            event or simply have a question, send us a message.
          </p>
        </div>

        <form className="form-anim flex flex-col gap-10">
          <div className="relative">
            <input
              type="text"
              id="name"
              required
              placeholder=" "
              className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
            >
              Full Name
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <input
                type="tel"
                id="phone"
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
              />
              <label
                htmlFor="phone"
                className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
              >
                Phone
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
              />
              <label
                htmlFor="email"
                className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
              >
                Email
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Enquiry Type
            </span>
            <div className="relative flex gap-4">
              {["General", "Membership", "Inquiries"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`relative px-6 py-3 text-[11px] uppercase tracking-[0.2em] border transition-colors duration-300 ${type === t ? "bg-primary text-white border-primary" : "border-white/20 text-white/60 hover:border-white/40"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="message"
              rows={3}
              required
              placeholder=" "
              className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors resize-none"
            ></textarea>
            <label
              htmlFor="message"
              className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-16px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
            >
              Message
            </label>
          </div>

          <button
            ref={btnRef}
            type="submit"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden cursor-pointer mt-4 self-start"
            data-cursor="SEND"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10">Send Message</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. SOCIAL ROW
═══════════════════════════════════════════════════════════════ */
function SocialRow() {
  const socials = [
    {
      name: "Facebook",
      img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
      group: "Express Highway Inn",
    },
    {
      name: "Facebook",
      img: "https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=800&auto=format&fit=crop",
      group: "Sampan Group",
    },
    {
      name: "Instagram",
      img: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=800&auto=format&fit=crop",
      group: "Sampan Group",
    },
    {
      name: "LinkedIn",
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      group: "Sampan Group",
    },
    {
      name: "YouTube",
      img: "https://images.unsplash.com/photo-1611132944641-7573e0c5b57e?q=80&w=800&auto=format&fit=crop",
      group: "Sampan Group",
    },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (imgRef.current && hovered !== null) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.7, rotate: -5 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "power3.out" },
      );
    }
  }, [hovered]);

  return (
    <section className="bg-[#030405] text-white py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6 text-center">
          Stay Connected
        </span>

        <div className="border-t border-white/10 mt-12">
          {socials.map((s, i) => (
            <div
              key={i}
              className="group relative border-b border-white/10"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <a
                href="#"
                className="flex items-center justify-between py-8 md:py-12 cursor-pointer"
                data-cursor="OPEN"
              >
                <div className="flex items-center gap-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                    {s.group}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <h3 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-medium text-white/40 group-hover:text-white transition-colors duration-500">
                    {s.name}
                  </h3>
                  <ArrowUpRight className="h-6 w-6 text-white/20 group-hover:text-primary group-hover:rotate-45 transition-all duration-500" />
                </div>
              </a>

              {/* Floating Image Preview */}
              {hovered === i && (
                <div
                  ref={imgRef}
                  className="hidden md:block absolute top-1/2 right-[30%] -translate-y-1/2 w-[200px] h-[130px] overflow-hidden border border-white/10 pointer-events-none z-20 shadow-2xl"
                >
                  <Image
                    src={s.img}
                    alt={s.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. FINAL CINEMATIC SECTION
═══════════════════════════════════════════════════════════════ */
function FinalCinematic() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".final-bg",
        { scale: 1.1 },
        {
          scale: 1.2,
          duration: 3,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      tl.from(".final-text", {
        opacity: 0,
        y: 50,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen bg-black text-white overflow-hidden flex items-center justify-center"
    >
      <div
        className="final-bg absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95 z-[1]"></div>

      <div className="relative z-10 text-center px-6">
        <h2 className="final-text font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[1.05]">
          <div>Wherever the road</div>
          <div className="text-primary italic">takes you,</div>
          <div>we&apos;ll be here.</div>
        </h2>
        <div className="final-text mt-12 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            Express Highway Inn
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
            Club & Lounge
          </span>
          <div className="w-16 h-px bg-primary/50 mt-4"></div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  return (
    <main className="bg-[#030405]">
      <CustomCursorAndGrain />
      <Hero />
      <LocationSection />
      <ContactList />
      <SampanOffice />
      <EnquiryForm />
      <SocialRow />
      <FinalCinematic />
    </main>
  );
}
