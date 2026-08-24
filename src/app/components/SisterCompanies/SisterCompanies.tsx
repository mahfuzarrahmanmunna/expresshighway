/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─────────────────────────────────────────────
   1. ECOSYSTEM DATA & ORBITAL CONFIGURATION
   ───────────────────────────────────────────── */
type Company = {
  id: number;
  src: string;
  name: string;
  category: string;
  orbit: { radiusX: number; radiusY: number; angle: number; depth: number };
};

const rawCompanies = [
  { name: "Express Logistics", category: "Supply Chain" },
  { name: "Express Hospitality", category: "Hotels & Resorts" },
  { name: "Express Buildtech", category: "Infrastructure" },
  { name: "Express Motors", category: "Automotive" },
  { name: "Express Energy", category: "Power & Resources" },
  { name: "Express Agro", category: "Agrotech" },
  { name: "Express Media", category: "Broadcasting" },
  { name: "Express Finance", category: "Investment" },
  { name: "Express Retail", category: "E-Commerce" },
  { name: "Express Health", category: "Pharmaceuticals" },
  { name: "Express Tech", category: "IT Solutions" },
  { name: "Express Foundation", category: "CSR" },
];

const orbitData = [
  { radiusX: 280, radiusY: 180, angle: 30, depth: 2 },
  { radiusX: 380, radiusY: 250, angle: 110, depth: 1 },
  { radiusX: 220, radiusY: 140, angle: 200, depth: 2 },
  { radiusX: 420, radiusY: 280, angle: 300, depth: 0 },
  { radiusX: 340, radiusY: 220, angle: 75, depth: 1 },
  { radiusX: 180, radiusY: 120, angle: 250, depth: 2 },
  { radiusX: 460, radiusY: 300, angle: 160, depth: 0 },
  { radiusX: 300, radiusY: 200, angle: 10, depth: 1 },
  { radiusX: 400, radiusY: 260, angle: 230, depth: 0 },
  { radiusX: 260, radiusY: 170, angle: 140, depth: 2 },
  { radiusX: 360, radiusY: 240, angle: 350, depth: 1 },
  { radiusX: 320, radiusY: 210, angle: 90, depth: 0 },
];

const companies: Company[] = rawCompanies.map((c, i) => ({
  id: i,
  src: i === 0 ? "/express/image.webp" : `/express/image (${i}).webp`,
  ...c,
  orbit: orbitData[i],
}));

/* ─────────────────────────────────────────────
   2. CINEMATIC WEBGL ATMOSPHERE (LAYER 1)
   ───────────────────────────────────────────── */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float n1 = snoise(uv * 2.0 + uTime * 0.08);
    float n2 = snoise(uv * 4.0 - uTime * 0.12);
    float leak = smoothstep(0.4, 0.9, n1 * n2) * 0.06;
    vec3 leakColor = vec3(0.1, 0.3, 0.6) * leak;
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5) * 1.5);
    vec3 finalColor = leakColor * vignette;
    gl_FragColor = vec4(finalColor, leak * vignette);
  }
`;

function EcosystemShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms?.uTime)
        material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <>
      <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Sparkles
        count={40}
        scale={[15, 10, 5]}
        size={1}
        speed={0.15}
        color="#ffffff"
        opacity={0.2}
      />
    </>
  );
}

function EcosystemBackground({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-screen opacity-60">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <EcosystemShader />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. ARCHITECTURAL CURSOR & MOUSE LIGHT
   ───────────────────────────────────────────── */
function EcosystemCursor({
  cursorState,
}: {
  cursorState: "default" | "nearby" | "hover";
}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!cursorRef.current || !ringRef.current) return;
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.6,
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

  const label =
    cursorState === "hover"
      ? "OPEN"
      : cursorState === "nearby"
        ? "EXPLORE"
        : "VIEW";

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[1000] translate-x-[-50%] translate-y-[-50%] hidden md:flex items-center justify-center mix-blend-difference"
    >
      <div
        ref={ringRef}
        className={`absolute inset-0 border rounded-full transition-all duration-300 ${cursorState !== "default" ? "border-blue-400 scale-75" : "border-white/40 scale-100"}`}
      >
        <span className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      </div>
      <div className="absolute w-full h-full">
        <div className="absolute top-1/2 left-0 w-2 h-px bg-white/50 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-2 h-px bg-white/50 -translate-y-1/2" />
      </div>
      <span className="text-[8px] tracking-[0.3em] text-white font-mono uppercase flex items-center gap-1">
        {label}{" "}
        {cursorState === "hover" && <span className="text-[10px]">↗</span>}
      </span>
    </div>
  );
}

function MouseLight({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const x = useTransform(mouseX, (v) => `${v * 100}%`);
  const y = useTransform(mouseY, (v) => `${v * 100}%`);
  return (
    <motion.div
      className="absolute inset-0 z-[4] pointer-events-none hidden md:block"
      style={{
        background: useTransform(
          [x, y],
          ([latestX, latestY]: string[]) =>
            `radial-gradient(500px circle at ${latestX} ${latestY}, rgba(59, 130, 246, 0.05), transparent 70%)`,
        ),
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   4. ORBITAL LOGO ENTITY (LAYER 2)
   ───────────────────────────────────────────── */
interface LogoProps {
  company: Company;
  index: number;
  mouseX: any;
  mouseY: any;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  setActiveCompany: (c: Company | null) => void;
  isMobile: boolean;
}

function EcosystemLogo({
  company,
  index,
  mouseX,
  mouseY,
  activeIndex,
  setActiveIndex,
  setActiveCompany,
  isMobile,
}: LogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = activeIndex === index;
  const isDimmed = activeIndex !== null && !isHovered;

  const depthConfig = useMemo(() => {
    if (company.orbit.depth === 0)
      return {
        scale: 0.7,
        opacity: 0.4,
        blur: "1px",
        parallax: 15,
        color: "bg-transparent",
        border: "border-transparent",
      };
    if (company.orbit.depth === 1)
      return {
        scale: 0.9,
        opacity: 0.7,
        blur: "0px",
        parallax: 30,
        color: "bg-white/[0.02]",
        border: "border-white/5",
      };
    return {
      scale: 1.1,
      opacity: 1,
      blur: "0px",
      parallax: 50,
      color: "bg-white/[0.04]",
      border: "border-white/10",
    };
  }, [company.orbit]);

  const initialPos = useMemo(() => {
    const rad = (company.orbit.angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * company.orbit.radiusX,
      y: Math.sin(rad) * company.orbit.radiusY,
    };
  }, [company.orbit]);

  const parallaxX = useTransform(
    mouseX,
    [-0.5, 0.5],
    [-depthConfig.parallax, depthConfig.parallax],
  );
  const parallaxY = useTransform(
    mouseY,
    [-0.5, 0.5],
    [-depthConfig.parallax, depthConfig.parallax],
  );
  const smoothX = useSpring(parallaxX, {
    damping: 40,
    stiffness: 150,
    mass: 0.8,
  });
  const smoothY = useSpring(parallaxY, {
    damping: 40,
    stiffness: 150,
    mass: 0.8,
  });

  const rotateY = useTransform(
    smoothX,
    [-depthConfig.parallax, depthConfig.parallax],
    [-5, 5],
  );
  const rotateX = useTransform(
    smoothY,
    [-depthConfig.parallax, depthConfig.parallax],
    [5, -5],
  );

  return (
    <motion.div
      ref={ref}
      className="absolute z-10 ecosystem-logo"
      style={{
        left: "50%",
        top: "50%",
        x: isMobile ? "-50%" : initialPos.x,
        y: isMobile ? "-50%" : initialPos.y,
        opacity: isDimmed ? 0.2 : depthConfig.opacity,
        scale: isHovered ? depthConfig.scale * 1.1 : depthConfig.scale,
        zIndex: isHovered ? 50 : 10 + company.orbit.depth,
        filter: `blur(${isHovered ? "0px" : depthConfig.blur})`,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      onClick={() => setActiveCompany(company)}
    >
      <motion.div
        animate={{
          y: [0, company.orbit.depth * 5, 0],
          x: [0, company.orbit.depth * -3, 0],
        }}
        transition={{
          duration: 6 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          style={{
            x: isMobile ? 0 : smoothX,
            y: isMobile ? 0 : smoothY,
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            transformPerspective: 1200,
          }}
        >
          <div
            className={`relative w-24 h-12 md:w-28 md:h-14 flex items-center justify-center p-2 rounded-sm border backdrop-blur-sm transition-all duration-500 ${isHovered ? "bg-white/[0.08] border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : `${depthConfig.color} ${depthConfig.border}`}`}
          >
            <Image
              src={company.src}
              alt={company.name}
              width={120}
              height={60}
              className="w-full h-full object-contain"
              style={{
                filter: isHovered
                  ? "grayscale(0%) brightness(1.2)"
                  : "grayscale(100%)",
              }}
            />
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 -translate-x-1/2 mt-6 w-48 text-center pointer-events-none"
              >
                <span className="text-[8px] tracking-[0.3em] uppercase text-blue-400/80 font-mono block mb-1">
                  {company.category}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-sm text-white font-light">
                  {company.name}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   5. ORBITAL PATHS & GROUP CORE
   ───────────────────────────────────────────── */
function OrbitPaths() {
  const pathsRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (pathsRef.current) {
      const length = pathsRef.current.getTotalLength();
      gsap.set(pathsRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(pathsRef.current, {
        strokeDashoffset: 0,
        duration: 4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "#ecosystem-section", start: "top 40%" },
      });
    }
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full z-[5] pointer-events-none hidden md:block"
      preserveAspectRatio="none"
    >
      <path
        ref={pathsRef}
        d="M 50% 50% m -280, 0 a 280,180 0 1,0 560,0 a 280,180 0 1,0 -560,0 M 50% 50% m -380, 0 a 380,250 0 1,0 760,0 a 380,250 0 1,0 -760,0"
        fill="none"
        stroke="url(#orbitGradient)"
        strokeWidth="1"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GroupCore({ activeIndex }: { activeIndex: number | null }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
      <motion.div
        animate={{
          scale: activeIndex !== null ? 0.95 : 1,
          opacity: activeIndex !== null ? 0.5 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative w-20 h-20 md:w-24 md:h-24 border border-white/20 rounded-full bg-black/40 backdrop-blur-md flex flex-col items-center justify-center">
          <span className="text-[8px] tracking-[0.3em] uppercase text-blue-400 font-mono mb-1">
            The Group
          </span>
          <span className="font-[family-name:var(--font-playfair)] text-white text-lg font-light">
            EXPRESS
          </span>
          <div className="absolute inset-0 border border-white/10 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   6. MAIN SISTER CONCERNS ECOSYSTEM SECTION
   ───────────────────────────────────────────── */
export default function SisterConcerns() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useGSAP(
    () => {
      if (!isMounted || !headlineRef.current) return;

      // Robust SplitType initialization
      const split = new SplitType(headlineRef.current, {
        types: "lines, words",
        lineClass: "overflow-hidden block",
        wordClass: "inline-block will-change-transform",
      });

      if (split.words) {
        gsap.set(split.words, {
          yPercent: 120,
          rotateX: 20,
          opacity: 0,
          transformOrigin: "bottom center",
        });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
        });

        tl.to([letterboxTopRef.current, letterboxBottomRef.current], {
          height: "5vh",
          duration: 2,
          ease: "expo.inOut",
        })
          .to(
            split.words,
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1.4,
              stagger: 0.12,
              ease: "power4.out",
            },
            "-=1.5",
          )
          .fromTo(
            ".reveal-ui",
            {
              opacity: 0,
              y: 30,
              filter: "blur(8px)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.1,
              duration: 1,
              ease: "expo.out",
            },
            "-=0.8",
          )
          .fromTo(
            ecosystemRef.current,
            {
              opacity: 0,
              scale: 0.8,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 2,
              ease: "power3.out",
            },
            "-=1.5",
          )
          .fromTo(
            ".ecosystem-logo",
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=1.8",
          );

        // Cinematic Camera Push on Scroll
        gsap.to(ecosystemRef.current, {
          scale: 1.15,
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    },
    { scope: containerRef, dependencies: [isMounted] },
  );

  return (
    <section
      id="ecosystem-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050608] text-white overflow-hidden cursor-none py-32 md:py-0 md:h-screen md:flex md:items-center md:justify-center"
    >
      {!isMobile && (
        <EcosystemCursor
          cursorState={activeIndex !== null ? "hover" : "default"}
        />
      )}
      <CompanyModal
        company={activeCompany}
        onClose={() => setActiveCompany(null)}
      />

      {/* LAYER 1: ATMOSPHERE */}
      {isMounted && <EcosystemBackground isMobile={isMobile} />}

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
      <MouseLight mouseX={mouseX} mouseY={mouseY} />

      {/* LAYER 2: ECOSYSTEM & ORBITS */}
      <div
        ref={ecosystemRef}
        className="absolute inset-0 z-10 will-change-transform"
      >
        <OrbitPaths />
        <GroupCore activeIndex={activeIndex} />

        <div
          className={`relative w-full h-full ${isMobile ? "flex flex-col gap-6 px-6 py-12 overflow-y-auto" : "absolute inset-0"}`}
        >
          {isMobile ? (
            <div className="flex flex-col items-center gap-12 w-full max-w-md mx-auto pt-32">
              <div className="text-center mb-8">
                <span className="text-[8px] tracking-[0.3em] uppercase text-blue-400 font-mono block mb-2">
                  The Group
                </span>
                <span className="font-[family-name:var(--font-playfair)] text-white text-2xl font-light">
                  EXPRESS
                </span>
              </div>
              {companies.map((company, index) => (
                <EcosystemLogo
                  key={index}
                  company={company}
                  index={index}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  setActiveCompany={setActiveCompany}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            companies.map((company, index) => (
              <EcosystemLogo
                key={index}
                company={company}
                index={index}
                mouseX={mouseX}
                mouseY={mouseY}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setActiveCompany={setActiveCompany}
                isMobile={isMobile}
              />
            ))
          )}
        </div>
      </div>

      {/* LAYER 3: CONTENT & TYPOGRAPHY */}
      <div className="relative z-30 max-w-[1600px] mx-auto px-6 md:px-12 w-full pointer-events-none md:absolute md:top-0 md:left-0 md:h-full md:flex md:items-center">
        <div className="max-w-xl">
          <span className="reveal-ui block text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium mb-6 md:mb-8">
            Our Business Ecosystem
          </span>

          <h1
            ref={headlineRef}
            id="ecosystem-headline"
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-light tracking-tight inline-block"
            style={{ perspective: "1200px" }}
          >
            One Group. Many Possibilities.
          </h1>

          <div className="reveal-ui mt-8 md:mt-12 max-w-sm">
            <p className="text-xs md:text-sm text-white/50 leading-relaxed tracking-wide">
              A connected ecosystem of businesses, expertise and opportunities.
              Move your cursor to explore the network.
            </p>
          </div>

          <div className="reveal-ui mt-12 md:mt-16 flex items-center gap-4">
            <div className="h-px w-12 bg-white/30"></div>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-white/60">
              12+ ASSOCIATED BUSINESSES
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic Letterbox */}
      <div
        ref={letterboxTopRef}
        className="fixed top-0 inset-x-0 h-0 bg-black z-[60] pointer-events-none"
      />
      <div
        ref={letterboxBottomRef}
        className="fixed bottom-0 inset-x-0 h-0 bg-black z-[60] pointer-events-none flex items-end justify-center pb-4 md:pb-6"
      >
        <div className="text-[8px] md:text-[10px] tracking-[0.5em] text-white/30 font-mono uppercase">
          Constellation Ecosystem
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. CINEMATIC COMPANY MODAL
   ───────────────────────────────────────────── */
function CompanyModal({
  company,
  onClose,
}: {
  company: Company | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {company && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 md:p-16 cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.95, y: 10, opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-[#0a0c10] border border-white/10 rounded-sm p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/3 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-sm p-8">
              <Image
                src={company.src}
                alt={company.name}
                width={200}
                height={100}
                className="object-contain w-full h-auto"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-blue-400 font-mono mb-4">
                {company.category}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white font-light mb-8">
                {company.name}
              </h3>
              <button className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-white group w-fit">
                <span className="border-b border-white/30 group-hover:border-white transition-colors pb-1">
                  Explore Company
                </span>
                <span className="text-base">↗</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
