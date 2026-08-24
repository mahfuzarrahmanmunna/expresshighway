"use client";

const ITEMS = [
  "Architecture",
  "Luxury",
  "Design",
  "Elegance",
  "Heritage",
  "Innovation",
];

export default function Marquee() {
  return (
    <section className="py-8 border-y border-white/5 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-[var(--background)] z-10 pointer-events-none" />
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="marquee-item"
            data-cursor="text"
          >
            {item}
          </span>
        ))}
      </div>
      {/* Dots between items — done via CSS gap trick; simpler to just use the items */}
    </section>
  );
}
