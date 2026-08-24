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
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const draw = () => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
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
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      running = false;
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
