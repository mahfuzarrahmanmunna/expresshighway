"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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

    // Primary blue light leaks
    float n1 = snoise(uv * 2.0 + uTime * 0.1);
    float n2 = snoise(uv * 4.0 - uTime * 0.15);
    float leak = smoothstep(0.4, 0.9, n1 * n2) * 0.12;
    vec3 leakColor = vec3(0.0, 0.49, 0.77) * leak;

    // Warm secondary leak
    float n3 = snoise(uv * 1.5 - uTime * 0.08);
    float warmLeak = smoothstep(0.5, 0.95, n3) * 0.04;
    vec3 warmColor = vec3(1.0, 0.7, 0.3) * warmLeak;

    // Film Grain
    float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    grain = (grain - 0.5) * 0.035;

    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.5);

    vec3 finalColor = leakColor + warmColor + grain;
    float finalAlpha = (leak + warmLeak + abs(grain)) * vignette;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

function CinematicShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1920,
          typeof window !== "undefined" ? window.innerHeight : 1080,
        ),
      },
    }),
    [],
  );

    useFrame((state) => {
      if (meshRef.current) {
        // Cast to ShaderMaterial to access the uniforms property
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms && material.uniforms.uTime) {
          material.uniforms.uTime.value = state.clock.elapsedTime;
        }
      }
    });

  return (
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
  );
}

export default function WebGLDepth() {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-screen opacity-60">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <CinematicShader />
      </Canvas>
    </div>
  );
}
