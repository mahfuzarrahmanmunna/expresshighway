/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial, Sparkles } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Project = {
  id: string;
  title: string;
  location: string;
  architect: string;
  year: string;
  category: string;
  description: string;
  image: string;
  ambient: string;
  fogColor: string;
  sunColor: string;
  tint: string;
  reflection?: number;
  exposure?: number;
};

type ProjectLayerProps = {
  project: Project;
  position: [number, number, number];
  index: number;
};

type CameraRigProps = {
  progressRef: React.MutableRefObject<number>;
  projects: Project[];
  setActiveProject: (index: number) => void;
};

/* ─────────────────────────────────────────────
   1. PREMIUM GLASS & REFLECTION SHADER
   ───────────────────────────────────────────── */
const BuildingMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uReflection: 0.5,
    uTransition: 0,
    uExposure: 1.0,
    uTint: new THREE.Color(0xffffff),
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uReflection;
  uniform float uTransition;
  uniform float uExposure;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    // Sample texture with subtle UV distortion for glass refraction
    vec2 distortedUv = vUv + vec2(sin(uTime * 0.5 + vUv.y * 10.0) * 0.001, 0.0);
    vec4 tex = texture2D(uTexture, distortedUv);
    
    // Dynamic Glass Reflection (Diagonal Volumetric Sweep)
    float refl = sin((vUv.x + vUv.y * 2.0) * 8.0 + uTime * 0.4) * 0.5 + 0.5;
    refl = pow(refl, 8.0) * uReflection;
    
    // Top glow (Sky bounce light)
    float topGlow = smoothstep(0.5, 1.0, vUv.y) * (sin(uTime * 0.3) * 0.2 + 0.8);
    
    // Color Grading & Exposure
    vec3 color = tex.rgb * uExposure * uTint;
    color += refl + (vec3(0.9, 0.95, 1.0) * topGlow * 0.15 * uReflection);
    
    // Transition blur effect (fake motion blur)
    float blur = uTransition * 0.02;
    vec4 blurTex = texture2D(uTexture, vUv + vec2(blur, blur * 0.5));
    color = mix(color, blurTex.rgb, uTransition);
    
    // Cinematic Contrast
    color = pow(color, vec3(1.1)); 
    
    gl_FragColor = vec4(color, 1.0);
  }
  `,
);
extend({ BuildingMaterial });

/* ─────────────────────────────────────────────
   2. MULTI-LAYER 3D SCENE (Architectural Depth)
   ───────────────────────────────────────────── */
function ProjectLayer({ project, position, index }: ProjectLayerProps) {
  const texture = useTexture(project.image);
  const matRef = useRef<any>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      {/* Sky / Ambient Background Layer */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[50, 25]} />
        <meshBasicMaterial color={project.ambient} />
      </mesh>

      {/* Main Building Layer */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[18, 10]} />
        {/* @ts-ignore */}
        <buildingMaterial
          ref={matRef}
          uTexture={texture}
          uReflection={project.reflection || 0.4}
          uExposure={project.exposure || 1.0}
          uTint={project.tint}
        />
      </mesh>

      {/* Foreground Atmospheric Haze */}
      <mesh position={[0, 0, 6]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial
          color={project.fogColor}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   3. VIRTUAL CAMERA RIG & PHYSICAL LIGHTING
   ───────────────────────────────────────────── */
function CameraRig({
  progressRef,
  projects,
  setActiveProject,
}: CameraRigProps) {
  const scene = useThree((state) => state.scene);
  const stateRef = useRef<{ activeIndex: number }>({ activeIndex: 0 });
  const fogRef = useRef<THREE.FogExp2>(
    new THREE.FogExp2(projects[0].fogColor, 0.015),
  );
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (fogRef.current) {
      scene.fog = fogRef.current;
    }
    if (sunRef.current) {
      sunRef.current.color = new THREE.Color(projects[0].sunColor);
    }
  }, [scene, projects]);

  useFrame((state) => {
    // Cast to PerspectiveCamera to access 'fov' safely
    const camera = state.camera as THREE.PerspectiveCamera;
    const p = progressRef.current;
    const segment = 1 / projects.length;
    const activeIndex = Math.min(projects.length - 1, Math.floor(p / segment));
    const localP = (p % segment) / segment;

    // Update Active Project State for DOM
    if (activeIndex !== stateRef.current.activeIndex) {
      stateRef.current.activeIndex = activeIndex;
      setActiveProject(activeIndex);
    }

    // Dynamic Weather & Fog System
    const fog = fogRef.current;
    if (fog) {
      const targetColor = new THREE.Color(projects[activeIndex].fogColor);
      fog.color.lerp(targetColor, 0.05);
      const targetDensity = 0.01 + Math.sin(localP * Math.PI) * 0.035;
      fog.density += (targetDensity - fog.density) * 0.1;
    }

    // Dynamic Sun Lighting
    if (sunRef.current) {
      const sunColor = new THREE.Color(projects[activeIndex].sunColor);
      sunRef.current.color.lerp(sunColor, 0.05);
      sunRef.current.intensity = 0.5 + (1 - localP) * 0.5; // Dim slightly during transition
    }

    // Cinematic Camera Path (Slow -> Fast -> Slow)
    const startZ = activeIndex * -18 + 8;
    const endZ = (activeIndex + 1) * -18 + 8;

    // Custom Ease for Drone Acceleration
    const eased = gsap.parseEase("expo.inOut")(localP);
    camera.position.z = startZ + (endZ - startZ) * eased;

    // Dynamic FOV (Speed Warp)
    const targetFov = 45 + Math.sin(localP * Math.PI) * 12;
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    // Organic Drone Breathing & Mouse Stabilization
    const { mouse, clock } = state;
    const time = clock.elapsedTime;

    camera.position.x +=
      (mouse.x * 1.5 + Math.sin(time * 0.3) * 0.5 - camera.position.x) * 0.05;
    camera.position.y +=
      (mouse.y * 1.0 + Math.cos(time * 0.2) * 0.3 - camera.position.y) * 0.05;

    camera.rotation.z += (mouse.x * 0.02 - camera.rotation.z) * 0.05;
    camera.rotation.x += (-mouse.y * 0.05 - camera.rotation.x) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight ref={sunRef} position={[5, 5, 5]} intensity={1.5} />
      {/* Floating Environmental Dust */}
      <Sparkles
        count={80}
        scale={[20, 10, 20]}
        size={1.5}
        speed={0.3}
        color="#ffffff"
        opacity={0.4}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   4. ARCHITECT HUD & LUXURY OVERLAYS
   ───────────────────────────────────────────── */
function DroneCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0); // Fix: use ref instead of mutating local variable

  useEffect(() => {
    if (!cursorRef.current || !ringRef.current) return;

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onScroll = (self: any) => {
      rotationRef.current += self.getVelocity() * 0.001;
      gsap.to(ringRef.current, {
        rotation: rotationRef.current,
        duration: 2,
        ease: "power2.out",
      });
    };

    const st = ScrollTrigger.create({ onUpdate: onScroll });
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      st.kill();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[1000] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center mix-blend-difference"
    >
      <div
        ref={ringRef}
        className="absolute inset-0 border border-white/40 rounded-full"
      >
        <span className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      </div>
      <div className="absolute w-full h-full">
        <div className="absolute top-1/2 left-0 w-2 h-px bg-white/50 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-2 h-px bg-white/50 -translate-y-1/2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   5. MAIN CINEMATIC PORTFOLIO COMPONENT
   ───────────────────────────────────────────── */
export default function LivingPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<number>(0);
  const flashTriggeredRef = useRef<boolean>(false);

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blueprintRefs = useRef<(SVGPathElement | null)[]>([]);
  const hudProgressRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeProject, setActiveProject] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const projects: Project[] = [
    {
      id: "01",
      title: "Aura of the Peak",
      location: "23.8103° N, 90.4125° E",
      architect: "SPRT Architects",
      year: "2024",
      category: "Luxury Residential",
      description:
        "A sanctuary carved into the clouds, where silence speaks louder than words.",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=85&w=1920&h=1080&auto=format&fit=crop",
      ambient: "#0a0c10",
      fogColor: "#15181f",
      sunColor: "#9db4ff",
      tint: "#a0b4d8",
      reflection: 0.3,
      exposure: 0.9,
    },
    {
      id: "02",
      title: "The Obsidian Tower",
      location: "40.7128° N, 74.0060° W",
      architect: "ZHA Studio",
      year: "2023",
      category: "Commercial High-Rise",
      description: "Glass and steel converge in a monolith of modern ambition.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1920&h=1080&auto=format&fit=crop",
      ambient: "#1a1208",
      fogColor: "#2a1a08",
      sunColor: "#ffaa55",
      tint: "#ffd1a0",
      reflection: 0.7,
      exposure: 1.1,
    },
    {
      id: "03",
      title: "Villa Serenity",
      location: "34.0522° N, 118.2437° W",
      architect: "Foster + Partners",
      year: "2022",
      category: "Private Estate",
      description: "Where architecture dissolves into the natural landscape.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1920&h=1080&auto=format&fit=crop",
      ambient: "#080d14",
      fogColor: "#080d14",
      sunColor: "#4488ff",
      tint: "#88aacc",
      reflection: 0.4,
      exposure: 1.0,
    },
    {
      id: "04",
      title: "Aura Pavilion",
      location: "51.5074° N, 0.1278° W",
      architect: "BIG Group",
      year: "2024",
      category: "Cultural Center",
      description: "A nocturnal beacon illuminating the city's artistic pulse.",
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=85&w=1920&h=1080&auto=format&fit=crop",
      ambient: "#000000",
      fogColor: "#050505",
      sunColor: "#ffffff",
      tint: "#ffffff",
      reflection: 0.9,
      exposure: 0.8,
    },
  ];

  useEffect(() => setIsMounted(true), []);

  useGSAP(() => {
    if (!isMounted) return;

    // ── Master Scroll Trigger (Drives WebGL Camera) ──
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      onUpdate: (self) => {
        progressRef.current = self.progress;

        const segment = 1 / projects.length;
        const localP = (self.progress % segment) / segment;

        // Cinematic Corridor Transition
        if (localP > 0.45 && localP < 0.55) {
          if (!flashTriggeredRef.current) {
            flashTriggeredRef.current = true;
            gsap
              .timeline()
              .to(transitionRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.in",
              })
              .to(
                transitionRef.current,
                { opacity: 0, duration: 0.8, ease: "power2.out" },
                ">0.1",
              );
          }
        } else {
          flashTriggeredRef.current = false;
        }
      },
    });

    // ── Cinematic Letterbox Entry ──
    gsap.to([letterboxTopRef.current, letterboxBottomRef.current], {
      height: "8vh",
      duration: 2,
      ease: "expo.inOut",
      delay: 0.5,
    });

    // ── Project UI Choreography ──
    projects.forEach((_, index) => {
      const seg = 1 / projects.length;
      const startProg = index * seg;
      const endProg = (index + 1) * seg;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${startProg * 100}% top`,
            end: `top+=${endProg * 100}% top`,
            scrub: 1.5,
          },
        })
        // Blueprint Animation
        .fromTo(
          blueprintRefs.current[index],
          { opacity: 0, strokeDashoffset: 1000 },
          {
            opacity: 0.5,
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          0.1,
        )
        .to(blueprintRefs.current[index], { opacity: 0, duration: 1 }, 2.5)

        // Typography & HUD Reveal
        .fromTo(
          contentRefs.current[index]?.querySelectorAll(".reveal") || [],
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 1,
            ease: "expo.out",
          },
          1.5,
        )
        // HUD Progress Bar
        .fromTo(
          hudProgressRefs.current[index],
          { width: "0%" },
          { width: "100%", duration: 4, ease: "none" },
          0,
        )
        // Exit Animation
        .to(
          contentRefs.current[index]?.querySelectorAll(".reveal") || [],
          {
            opacity: 0,
            y: -20,
            filter: "blur(4px)",
            stagger: 0.02,
            duration: 0.5,
          },
          4,
        );
    });
  }, [isMounted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[900vh] bg-black cursor-none"
    >
      <DroneCursor />

      {/* Sticky Drone Camera Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* WebGL Canvas (Physical 3D Scene) */}
        {isMounted && (
          <Canvas
            camera={{ fov: 45, position: [0, 0, 8] }}
            className="absolute inset-0"
            gl={{ antialias: true }}
          >
            <CameraRig
              progressRef={progressRef}
              projects={projects}
              setActiveProject={setActiveProject}
            />
            {projects.map((project, index) => (
              <ProjectLayer
                key={index}
                project={project}
                position={[0, 0, -index * 18]}
                index={index}
              />
            ))}

            {/* Premium Post-Processing */}
            <EffectComposer multisampling={4}>
              <DepthOfField
                focusDistance={0.01}
                focalLength={0.02}
                bokehScale={4}
                height={480}
              />
              <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                intensity={0.8}
                mipmapBlur
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0005, 0.0005]}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
              <Noise opacity={0.015} blendFunction={BlendFunction.OVERLAY} />
            </EffectComposer>
          </Canvas>
        )}

        {/* Cinematic Letterbox */}
        <div
          ref={letterboxTopRef}
          className="absolute top-0 inset-x-0 h-0 bg-black z-[60] pointer-events-none"
        />
        <div
          ref={letterboxBottomRef}
          className="absolute bottom-0 inset-x-0 h-0 bg-black z-[60] pointer-events-none flex items-end justify-center pb-6"
        >
          <div className="text-[10px] tracking-[0.5em] text-white/30 font-mono uppercase">
            Scroll to Fly
          </div>
        </div>

        {/* DOM Overlays (UI, HUD, Blueprints) */}
        <div className="absolute inset-0 pointer-events-none z-10 will-change-transform">
          {/* Project UI Layers */}
          {projects.map((project, index) => (
            <div key={index} className="absolute inset-0 z-20">
              {/* Architectural Blueprint SVG */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <svg
                  className="w-[60vw] h-[60vh] opacity-0"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    ref={(el: SVGPathElement | null) => {
                      if (el) blueprintRefs.current[index] = el;
                    }}
                    d="M 10 90 L 10 20 L 90 20 L 90 90 M 20 90 L 20 30 L 80 30 L 80 90 M 50 20 L 50 90 M 10 50 L 90 50 M 30 50 L 30 20 M 70 50 L 70 20"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="0.15"
                    strokeDasharray="1000"
                    style={{
                      filter: "drop-shadow(0 0 1px rgba(255,255,255,0.8))",
                    }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="15"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.1"
                    fill="none"
                  />
                  <path
                    d="M 48 50 L 52 50 M 50 48 L 50 52"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="0.2"
                  />
                </svg>
              </div>

              {/* Luxury Typography & Content */}
              <div
                ref={(el: HTMLDivElement | null) => {
                  if (el) contentRefs.current[index] = el;
                }}
                className="relative z-20 w-full h-full flex flex-col justify-end md:justify-center pb-[15vh] md:pb-0 px-6 md:px-[10vw]"
              >
                <div className="max-w-2xl">
                  {/* Project Meta */}
                  <div className="flex items-center gap-4 mb-4 reveal">
                    <span className="text-xs tracking-[0.3em] text-white/50 font-mono">
                      {project.id}
                    </span>
                    <div className="h-px w-12 bg-white/30"></div>
                    <span className="text-xs tracking-[0.3em] text-white/50 font-mono uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h3 className="font-[family-name:var(--font-playfair)] text-[3rem] md:text-[7rem] font-light tracking-tight leading-[0.9] text-white mb-6 reveal">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-white/60 font-light max-w-md mb-8 reveal leading-relaxed">
                    {project.description}
                  </p>

                  {/* Architectural Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">
                        Location
                      </div>
                      <div className="text-xs text-white/80 font-mono">
                        {project.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">
                        Architect
                      </div>
                      <div className="text-xs text-white/80 font-mono">
                        {project.architect}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">
                        Year
                      </div>
                      <div className="text-xs text-white/80 font-mono">
                        {project.year}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">
                        Status
                      </div>
                      <div className="text-xs text-emerald-400/80 font-mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant Architectural HUD (Bottom Right) */}
              <div className="absolute bottom-[12vh] md:bottom-[10vh] right-6 md:right-[10vw] z-30 hidden md:block">
                <div className="border border-white/10 backdrop-blur-md bg-black/20 p-4 w-64">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Scan Progress
                    </span>
                    <span className="text-[10px] text-cyan-400/80 font-mono">
                      Active
                    </span>
                  </div>
                  <div className="h-px w-full bg-white/10 mb-4">
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        if (el) hudProgressRefs.current[index] = el;
                      }}
                      className="h-full bg-gradient-to-r from-cyan-400/50 to-white/80"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>Sector {project.id}</span>
                    <span>Altitude Secure</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* White Corridor Transition */}
        <div
          ref={transitionRef}
          className="absolute inset-0 z-[55] bg-white opacity-0 pointer-events-none will-change-transform"
        />
      </div>
    </div>
  );
}
