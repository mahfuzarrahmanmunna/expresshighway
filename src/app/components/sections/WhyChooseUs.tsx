"use client";

import { useRef } from "react";
import {
  Building2,
  MapPin,
  Smartphone,
  Shield,
  TrendingUp,
  Leaf,
} from "lucide-react";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";
import { SectionHeader } from "../ui/section-header";

const FEATURES = [
  {
    Icon: Building2,
    title: "Architectural Excellence",
    desc: "Award-winning designs by world-renowned architects, every line and curve intentional.",
  },
  {
    Icon: MapPin,
    title: "Prime Location",
    desc: "Strategically positioned in the most coveted address, with unparalleled connectivity.",
  },
  {
    Icon: Smartphone,
    title: "Smart Living",
    desc: "Integrated home automation, climate control, and security at your fingertips.",
  },
  {
    Icon: Shield,
    title: "Secure Community",
    desc: "24/7 concierge surveillance, biometric access, and fortified perimeter systems.",
  },
  {
    Icon: TrendingUp,
    title: "Investment Value",
    desc: "Historically appreciating assets with proven returns in premium real estate markets.",
  },
  {
    Icon: Leaf,
    title: "Sustainable Design",
    desc: "LEED-certified construction with solar integration and green living spaces.",
  },
];

export default function WhyChooseUs() {
  const { isReducedMotion } = useAnimation();
  const gridRef = useRef<HTMLDivElement>(null);

  useScrollReveal(gridRef, { y: 50, stagger: 0.1, disabled: isReducedMotion });

  return (
    <section id="amenities" className="relative bg-white py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label="Why EXPRESS"
          title="Built for Those Who Demand More"
          subtitle="Every detail has been considered to deliver a living experience beyond expectation."
          light
        />

        <div
          ref={gridRef}
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
            !isReducedMotion && "opacity-0",
          )}
        >
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_8px_40px_-12px_rgba(0,125,197,0.12)] hover:-translate-y-1"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/[0.06] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-medium tracking-wide text-gray-900">
                {title}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.8] text-gray-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
