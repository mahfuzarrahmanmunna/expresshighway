"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { Phone, Mail, ArrowUpRight, Send } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACT_METHODS = [
  {
    Icon: Phone,
    label: "Call Us",
    value: "+880 1906-896326",
    href: "tel:+8801906896326",
    sub: "Mon-Sun: 10AM - 6PM",
  },
  {
    Icon: BsWhatsapp,
    label: "WhatsApp",
    value: "+880 1906-896326",
    href: "https://wa.me/8801906896326",
    sub: "Response within 5 mins",
  },
  {
    Icon: Mail,
    label: "Email Us",
    value: "info@sampangroup.com.bd",
    href: "mailto:info@sampangroup.com.bd",
    sub: "24/7 Support Available",
  },
];

export default function ContactEnquiry() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      let splitInstance: SplitType | null = null;

      const setupAnimations = () => {
        if (!containerRef.current) return;

        const heading = q(".contact-heading")[0];
        if (heading) {
          splitInstance = new SplitType(heading, {
            types: "lines,words",
            lineClass: "contact-line",
            wordClass: "contact-word",
          });

          gsap.from(q(".contact-word"), {
            yPercent: 110,
            opacity: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "power4.out",
            immediateRender: false, // Prevents permanently hidden text
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
            },
          });
        }

        gsap.from(q(".contact-left-anim"), {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          immediateRender: false, // Prevents permanently hidden cards
          scrollTrigger: {
            trigger: q(".contact-left")[0],
            start: "top 85%",
          },
        });

        gsap.from(q(".contact-right-anim"), {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false, // Prevents permanently hidden form
          scrollTrigger: {
            trigger: q(".contact-right")[0],
            start: "top 85%",
          },
        });
      };

      // Run immediately to prevent FOUC and missed ScrollTriggers
      setupAnimations();

      // Recalculate trigger positions after fonts load to fix any layout shifts
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      return () => {
        splitInstance?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-[#F7F6F2] py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#007DC6]/[0.06] blur-[150px] rounded-full" />
      
      {/* Subtle Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ─── LEFT COLUMN: Contact Methods ─── */}
          <div className="contact-left lg:col-span-5 flex flex-col">
            <span className="contact-left-anim text-[11px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-6 block">
              Connect With Us
            </span>
            
            <h2 
              className="contact-heading font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] text-[#4D4D4F] mb-12 tracking-[-0.02em]"
              style={{ perspective: "1000px" }}
            >
              Let&apos;s Begin a <span className="italic text-[#007DC6]">Conversation.</span>
            </h2>

            <div className="contact-left-anim w-16 h-px bg-[#4D4D4F] mb-12" />

            <p className="contact-left-anim text-base md:text-lg font-normal text-[#4D4D4F] leading-[1.9] max-w-md mb-12">
              Whether you are looking for membership information, planning an event, or simply have a question, our team is ready to assist you 24/7.
            </p>

            {/* Contact Tiles Grid */}
            <div className="flex flex-col gap-4">
              {CONTACT_METHODS.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="contact-left-anim group relative flex items-center gap-6 p-6 bg-white shadow-sm border border-[#4D4D4F]/15 hover:border-[#007DC6]/50 hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
                >
                  {/* Left Hover Accent Line */}
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-[#007DC6] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                  
                  {/* Icon Container */}
                  <div className="relative flex items-center justify-center w-14 h-14 border border-[#4D4D4F]/20 rounded-full text-[#4D4D4F] group-hover:border-[#007DC6] group-hover:text-[#007DC6] group-hover:bg-[#007DC6]/[0.05] transition-all duration-500">
                    <method.Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#4D4D4F] mb-1 transition-colors duration-500 group-hover:text-[#007DC6] font-bold">
                      {method.label} <span className="ml-2 text-[#4D4D4F]/60 font-normal lowercase tracking-normal">{method.sub}</span>
                    </p>
                    <h3 className="text-lg md:text-xl font-[family-name:var(--font-playfair)] text-[#4D4D4F] font-medium transition-colors duration-500">
                      {method.value}
                    </h3>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="h-5 w-5 text-[#4D4D4F]/60 group-hover:text-[#007DC6] transition-all duration-500 group-hover:rotate-45" />
                </a>
              ))}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Premium Form Panel ─── */}
          <div className="contact-right lg:col-span-7 flex flex-col">
            <div className="relative bg-[#0c0b0b] text-white p-8 md:p-12 lg:p-16 flex-1 overflow-hidden border border-[#0c0b0b]/10">
              
              {/* Architectural Background Grid Lines */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
              
              {/* Luxury Background Glow inside Form */}
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#007DC6]/[0.1] blur-[100px] rounded-full"></div>
              
              {/* Architectural Corners */}
              <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#007DC6] z-10"></div>
              <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#007DC6] z-10"></div>
              <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#007DC6] z-10"></div>
              <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#007DC6] z-10"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-12 contact-right-anim">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-6 block">
                    Quick Enquiry
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight text-white">
                    Let&apos;s plan your <br/>
                    <span className="italic text-[#007DC6]">next stop.</span>
                  </h3>
                </div>

                <form className="contact-right-anim flex flex-col gap-6 flex-1">
                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input 
                        type="text" 
                        id="enquiry-name" 
                        required 
                        placeholder=" " 
                        className="peer w-full bg-white/10 border border-white/40 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/20 transition-all duration-500 text-white font-medium" 
                      />
                      <label 
                        htmlFor="enquiry-name" 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/80 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                      >
                        Full Name
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="tel" 
                        id="enquiry-phone" 
                        required 
                        placeholder=" " 
                        className="peer w-full bg-white/10 border border-white/40 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/20 transition-all duration-500 text-white font-medium" 
                      />
                      <label 
                        htmlFor="enquiry-phone" 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/80 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                      >
                        Phone / WhatsApp
                      </label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input 
                      type="email" 
                      id="enquiry-email" 
                      required 
                      placeholder=" " 
                      className="peer w-full bg-white/10 border border-white/40 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/20 transition-all duration-500 text-white font-medium" 
                    />
                    <label 
                      htmlFor="enquiry-email" 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/80 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Short Enquiry Field */}
                  <div className="relative flex-1">
                    <textarea 
                      id="enquiry-message" 
                      rows={4} 
                      required 
                      placeholder=" " 
                      className="peer w-full h-full bg-white/10 border border-white/40 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/20 transition-all duration-500 resize-none text-white font-medium" 
                    />
                    <label 
                      htmlFor="enquiry-message" 
                      className="absolute left-4 top-6 text-base text-white/80 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                    >
                      Your Enquiry
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="contact-right-anim mt-4">
                    <button 
                      type="submit" 
                      className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#007DC6] text-white text-[11px] uppercase tracking-[0.35em] font-bold overflow-hidden cursor-pointer hover:bg-white hover:text-[#0c0b0b] transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-auto"
                    >
                      <span className="relative z-10">Send Enquiry</span>
                      <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}