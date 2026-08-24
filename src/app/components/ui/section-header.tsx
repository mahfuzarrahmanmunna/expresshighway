"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  /** true = dark text on light bg; false = light text on dark bg */
  light?: boolean;
  align?: "left" | "center";
  className?: string;
}

// Consistent premium easing
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        "mb-16 sm:mb-24",
        className,
      )}
    >
      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={cn(
          "inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.3em] uppercase",
          light ? "text-primary" : "text-primary/80",
        )}
      >
        {align === "center" && <span className="h-px w-6 bg-primary/40" />}
        {label}
        {align === "center" && <span className="h-px w-6 bg-primary/40" />}
      </motion.span>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
        className={cn(
          "mt-5 font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em]",
          light ? "text-neutral-900" : "text-foreground",
        )}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
          className={cn(
            "mt-6 max-w-2xl text-[15px] sm:text-base leading-[1.8]",
            light ? "text-neutral-500" : "text-muted-foreground/70",
          )}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Animated Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: easeOut, delay: 0.4 }}
        className={cn(
          "mt-8 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent",
          align === "center" ? "w-24" : "w-16 origin-left",
        )}
      />
    </div>
  );
}
