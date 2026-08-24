"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 769) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0,
      my = 0;
    let dx = 0,
      dy = 0;
    let rx = 0,
      ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      dx += (mx - dx) * 0.2;
      dy += (my - dy) * 0.2;
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;

      dot.style.left = dx + "px";
      dot.style.top = dy + "px";
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";

      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    const rafId = requestAnimationFrame(tick);

    /* ── Hover state listeners ── */
    const attachHover = (
      selector: string,
      dotClass: string,
      ringClass: string,
    ) => {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          dot.classList.add(dotClass);
          ring.classList.add(ringClass);
        });
        el.addEventListener("mouseleave", () => {
          dot.classList.remove(dotClass);
          ring.classList.remove(ringClass);
        });
      });
    };

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      attachHover("[data-cursor='hover']", "hovering", "hovering");
      attachHover("[data-cursor='text']", "text-hover", "text-hover");
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Initial attach
    attachHover("[data-cursor='hover']", "hovering", "hovering");
    attachHover("[data-cursor='text']", "text-hover", "text-hover");

    const onMouseDown = () => dot.classList.add("clicking");
    const onMouseUp = () => dot.classList.remove("clicking");
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
