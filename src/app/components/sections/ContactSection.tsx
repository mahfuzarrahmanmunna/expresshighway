"use client";

import { useRef, useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import { useAnimation } from "@/lib/animation-provider";
import { cn } from "@/app/lib/utils";

const CONTACT_INFO = [
  { Icon: Phone, label: "Phone", value: "+1 (800) 555-0199" },
  { Icon: Mail, label: "Email", value: "residences@EXPRESS.com" },
  { Icon: MapPin, label: "Location", value: "123 EXPRESS Boulevard, AZ 86001" },
];

export default function ContactSection() {
  const { isReducedMotion } = useAnimation();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useScrollReveal(leftRef, { y: 50, disabled: isReducedMotion });
  useScrollReveal(rightRef, { y: 50, delay: 0.15, disabled: isReducedMotion });

  return (
    <section id="contact" className="relative bg-[#050505] py-32">
      {/* Subtle accent */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[150px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label="Get in Touch"
          title="Begin Your Journey"
          subtitle="Our team is ready to guide you through every step of finding your perfect residence."
        />

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Left — info */}
          <div
            ref={leftRef}
            className={cn("lg:col-span-2", !isReducedMotion && "opacity-0")}
          >
            <div className="space-y-8">
              {CONTACT_INFO.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-foreground/80">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

            <p className="mt-8 text-[12px] leading-[1.8] text-muted-foreground/40">
              Schedule a private consultation with our residency advisors. We
              offer in-person tours, virtual walkthroughs, and tailored
              presentations for discerning buyers.
            </p>
          </div>

          {/* Right — form */}
          <div
            ref={rightRef}
            className={cn("lg:col-span-3", !isReducedMotion && "opacity-0")}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    name: "name",
                    label: "Full Name",
                    type: "text",
                    placeholder: "John Smith",
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "john@example.com",
                  },
                  {
                    name: "phone",
                    label: "Phone",
                    type: "tel",
                    placeholder: "+1 (555) 000-0000",
                  },
                  {
                    name: "budget",
                    label: "Budget Range",
                    type: "text",
                    placeholder: "$2M — $5M",
                  },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <label
                      htmlFor={field.name}
                      className={cn(
                        "mb-2 block text-[10px] tracking-[0.25em] uppercase transition-colors duration-300",
                        focused === field.name
                          ? "text-primary"
                          : "text-muted-foreground/40",
                      )}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                      className={cn(
                        "w-full border-b bg-transparent py-3 text-sm text-foreground/90 outline-none transition-colors duration-300 placeholder:text-muted-foreground/20",
                        focused === field.name
                          ? "border-primary/40"
                          : "border-white/[0.08]",
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className={cn(
                    "mb-2 block text-[10px] tracking-[0.25em] uppercase transition-colors duration-300",
                    focused === "message"
                      ? "text-primary"
                      : "text-muted-foreground/40",
                  )}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your ideal residence..."
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={cn(
                    "w-full resize-none border-b bg-transparent py-3 text-sm text-foreground/90 outline-none transition-colors duration-300 placeholder:text-muted-foreground/20",
                    focused === "message"
                      ? "border-primary/40"
                      : "border-white/[0.08]",
                  )}
                />
              </div>

              <button
                type="submit"
                className="group mt-8 inline-flex items-center gap-3 rounded-lg border-none bg-primary px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-[400ms] hover:scale-[1.03] hover:shadow-[0_0_40px_-8px_rgba(0,125,197,0.4)] active:scale-[0.97] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
