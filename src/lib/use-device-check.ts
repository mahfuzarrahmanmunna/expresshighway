// ──────────────────────────────────────────────────────────────
// lib/use-device-check.ts
// ──────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";

export interface DeviceSpecs {
  isSupported: boolean;
  score: number;
  details: {
    deviceMemory: number;
    cores: number;
    hasWebGL2: boolean;
    pixelRatio: number;
    screenWidth: number;
    touchPoints: number;
  };
}

// Adjust this to be more/less strict (max 5)
const MIN_SCORE = 2;

export function useDeviceCheck(): DeviceSpecs {
  const [specs, setSpecs] = useState<DeviceSpecs>({
    isSupported: true,
    score: 5,
    details: {
      deviceMemory: 8,
      cores: 8,
      hasWebGL2: true,
      pixelRatio: 2,
      screenWidth: 1920,
      touchPoints: 1,
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── WebGL2 Check ──
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    const hasWebGL2 = !!gl;

    // ── Device Memory (Chrome-only API) ──
    const nav = navigator as Navigator & { deviceMemory?: number };
    const deviceMemory = nav.deviceMemory ?? 4;

    // ── CPU Cores ──
    const cores = navigator.hardwareConcurrency ?? 4;

    // ── Display ──
    const pixelRatio = window.devicePixelRatio ?? 1;
    const screenWidth = window.screen.width;
    const touchPoints = navigator.maxTouchPoints ?? 0;

    // ── Scoring (each category 0–1) ──
    let score = 0;

    // Memory
    score += deviceMemory >= 8 ? 1 : deviceMemory >= 4 ? 0.6 : 0.2;

    // CPU
    score += cores >= 8 ? 1 : cores >= 4 ? 0.6 : 0.2;

    // WebGL (hard requirement)
    score += hasWebGL2 ? 1 : 0;

    // Pixel ratio (retina displays)
    score += pixelRatio >= 3 ? 1 : pixelRatio >= 2 ? 0.7 : 0.3;

    // Screen width
    score += screenWidth >= 1440 ? 1 : screenWidth >= 1024 ? 0.5 : 0.2;

    setSpecs({
      isSupported: score >= MIN_SCORE,
      score: Math.round(score * 10) / 10,
      details: {
        deviceMemory,
        cores,
        hasWebGL2,
        pixelRatio,
        screenWidth,
        touchPoints,
      },
    });
  }, []);

  return specs;
}
