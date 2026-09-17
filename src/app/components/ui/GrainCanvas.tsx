"use client";

import { useEffect, useRef } from "react";

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const nextWidth = Math.max(1, Math.floor(window.innerWidth));
      const nextHeight = Math.max(1, Math.floor(window.innerHeight));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let running = true;
    let rafId: number | null = null;

    const draw = () => {
      if (!running) return;

      const w = canvas.width;
      const h = canvas.height;

      if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) {
        rafId = window.requestAnimationFrame(draw);
        return;
      }

      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 20;
      }

      ctx.putImageData(imgData, 0, 0);
      rafId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[8999] pointer-events-none opacity-[0.04] mix-blend-screen"
    />
  );
}
