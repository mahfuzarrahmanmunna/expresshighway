"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Check,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   1. CINEMATIC SPLIT HERO & GOOGLE MAP
═══════════════════════════════════════════════════════════════ */
function ContactHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      const heading = q(".hero-head")[0];
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.fromTo(
          q(".hero-head .word"),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          }
        );
      }

      gsap.fromTo(
        q(".hero-anim"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        q(".map-container"),
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".map-container")[0], start: "top 80%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex flex-col lg:flex-row bg-[#0c0b0b] overflow-hidden"
    >
      {/* Left Content Panel */}
      <div className="lg:w-[45%] flex flex-col justify-center p-8 md:p-16 lg:p-20 relative z-10 border-r border-white/10">
        <span className="hero-anim block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-8">
          Express Highway Inn
        </span>
        <h1 className="hero-head font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,6rem)] font-light leading-[1.05] tracking-[-0.02em] text-white mb-10">
          Get in <span className="italic text-[#007DC6]">Touch.</span>
        </h1>
        <p className="hero-anim text-base md:text-lg font-light text-white/60 max-w-md leading-[1.8] mb-12">
          For membership enquiries, pricing, corporate events or general
          questions - we are here, right on the highway.
        </p>

        {/* Contact details grid */}
        <div className="hero-anim grid grid-cols-2 gap-px bg-white/10 border border-white/10 max-w-md">
          <div className="bg-[#0c0b0b] p-6 flex flex-col gap-3">
            <MapPin className="h-5 w-5 text-[#007DC6]" strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Head Office
            </span>
            <p className="text-sm text-white/80 font-light leading-relaxed">
              Sampan 21st Century, House-284, Block-B Road-1/A, Dhaka-1229.
            </p>
          </div>
          <div className="bg-[#0c0b0b] p-6 flex flex-col gap-3">
            <Clock className="h-5 w-5 text-[#007DC6]" strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Availability
            </span>
            <p className="text-sm text-white/80 font-light leading-relaxed">
              24/7 Assistance Available
            </p>
          </div>
        </div>
      </div>

      {/* Right Google Map Panel */}
      <div className="lg:w-[55%] h-[60vh] lg:h-auto relative map-container overflow-hidden group">
        {/* Map Wrapper with CSS Filter for Dark Mode Aesthetic */}
        <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [filter:invert(0.92)_hue-rotate(180deg)_brightness(0.9)_contrast(0.9)] group-hover:[filter:invert(0)_hue-rotate(0deg)_brightness(1)_contrast(1)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.4159813598767!2d90.5309669753343!3d23.69683467870697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b5d09a1b0c3f%3A0x5b0f161298224bab!2sExpress%20Highway%20Inn!5e0!3m2!1sbn!2sbd!4v1790056548754!5m2!1sbn!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Floating Glassmorphism Address Card on Map */}
        <div className="absolute bottom-8 left-8 right-8 lg:right-auto lg:w-[340px] bg-[#0c0b0b]/80 backdrop-blur-xl border border-white/10 p-6 z-[500] pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#007DC6] block mb-3">
            Corporate Landmark
          </span>
          <p className="text-xl font-[family-name:var(--font-playfair)] mb-1 text-white">
            Express Highway Inn
          </p>
          <p className="text-sm text-white/60 font-light">
            Bangladesh
          </p>
        </div>

        {/* Architectural Corners on Map */}
        <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#007DC6]/60 z-[500] pointer-events-none transition-all duration-500 group-hover:scale-150"></div>
        <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#007DC6]/60 z-[500] pointer-events-none transition-all duration-500 group-hover:scale-150"></div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. CONTACT GRID (Minimalist Architectural)
═══════════════════════════════════════════════════════════════ */
function ContactGrid() {
  const ref = useRef<HTMLDivElement>(null);

  const contacts = [
    { num: "01", label: "Call Us", value: "+880 1906-896327", href: "tel:+8801906896327", Icon: Phone },
    { num: "02", label: "WhatsApp", value: "+880 1906-896327", href: "https://wa.me/8801906896327", Icon: MessageCircle },
    { num: "03", label: "Email Us", value: "info@expresshighwayinn.com", href: "mailto:info@expresshighwayinn.com", Icon: Mail },
    { num: "04", label: "Office Hours", value: "10:00 AM - 06:00 PM", href: "#", Icon: Clock },
  ];

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(
        q(".cg-card"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[#F7F6F2] text-[#0c0b0b] py-24 md:py-32 overflow-hidden border-t border-[#0c0b0b]/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-[#0c0b0b]/10">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="cg-card group relative p-8 md:p-10 border-r border-b border-[#0c0b0b]/10 hover:bg-white transition-all duration-500 overflow-hidden h-full flex flex-col justify-between min-h-[220px] hover:-translate-y-1"
            >
              {/* Hover Accent Line (Top) */}
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#007DC6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>

              <div className="flex items-start justify-between mb-8">
                <span className="text-[10px] tracking-[0.3em] text-[#0c0b0b]/30 transition-colors duration-500 group-hover:text-[#007DC6]">
                  {c.num}
                </span>
                <c.Icon
                  className="h-6 w-6 text-[#0c0b0b]/30 group-hover:text-[#007DC6] transition-all duration-500 group-hover:scale-110"
                  strokeWidth={1}
                />
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0c0b0b]/40 mb-3">
                  {c.label}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg md:text-xl font-light text-[#0c0b0b] transition-colors duration-500">
                  {c.value}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. SAMPAN OFFICE & ENQUIRY FORM (Dark Premium Panel)
═══════════════════════════════════════════════════════════════ */
function EnquiryForm() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [type, setType] = useState("General");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000); // Reset after 4s
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });

      const heading = q(".form-head")[0];
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.set(q(".form-head .word"), { yPercent: 110 });
        tl.to(q(".form-head .word"), {
          yPercent: 0,
          duration: 1.4,
          stagger: 0.08,
          ease: "power4.out",
        });
      }

      tl.fromTo(
        q(".form-anim"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
      );

      // Magnetic Button Effect
      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
        
        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          xTo(e.clientX - rect.left - rect.width / 2 * 0.4);
          yTo(e.clientY - rect.top - rect.height / 2 * 0.4);
        };
        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
        return () => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    },
    { scope: ref }
  );

  return (
    <section
      id="enquiry"
      ref={ref}
      className="relative bg-[#0c0b0b] text-white py-24 md:py-32 overflow-hidden"
    >
      {/* Architectural Background Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Luxury Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#007DC6]/[0.08] blur-[150px] rounded-full"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Sampan Office Info */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="form-anim block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-8">
            Corporate Connection
          </span>
          <h3 className="form-head font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] mb-10 tracking-[-0.02em]">
            The Sampan Group
            <br />
            <span className="italic text-[#007DC6]/80">Head Office.</span>
          </h3>
          <p className="form-anim text-base font-light text-white/50 max-w-md leading-relaxed mb-12">
            For corporate enquiries, partnerships and wider Sampan Group matters,
            connect directly with our head office.
          </p>

          <div className="flex flex-col gap-8">
            <div className="form-anim group">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 flex items-center gap-2">
                <Phone className="h-3 w-3 text-[#007DC6]" /> Phone
              </p>
              <a
                href="tel:+8801906896327"
                className="text-lg font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors duration-300"
              >
                +880 1906-896327
              </a>
            </div>
            <div className="form-anim group">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 flex items-center gap-2">
                <Mail className="h-3 w-3 text-[#007DC6]" /> Email
              </p>
              <a
                href="mailto:info@sampangroup.com.bd"
                className="text-lg font-[family-name:var(--font-playfair)] hover:text-[#007DC6] transition-colors duration-300"
              >
                info@sampangroup.com.bd
              </a>
            </div>
            <div className="form-anim group">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 flex items-center gap-2">
                <MapPin className="h-3 w-3 text-[#007DC6]" /> Address
              </p>
              <p className="text-lg font-[family-name:var(--font-playfair)] text-white/80">
                Sampan 21st Century, House-284, Block-B Road-1/A, Bashundhara,
                Dhaka-1229.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form Panel */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="form-anim relative bg-white/[0.02] border border-white/10 p-8 md:p-12 lg:p-16 flex-1 overflow-hidden">
            {/* Panel Architectural Corners */}
            <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#007DC6]/50 z-10"></div>
            <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#007DC6]/50 z-10"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#007DC6]/50 z-10"></div>
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#007DC6]/50 z-10"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-12">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-6 block">
                  Enquiry Form
                </span>
                <h4 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-light leading-[1.1] tracking-tight text-white">
                  Start a <span className="italic text-[#007DC6]">Conversation.</span>
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder=" "
                    className="peer w-full bg-white/[0.03] border border-white/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/[0.05] transition-all duration-500 text-white font-medium"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                  >
                    Full Name
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder=" "
                      className="peer w-full bg-white/[0.03] border border-white/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/[0.05] transition-all duration-500 text-white font-medium"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                    >
                      Phone
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder=" "
                      className="peer w-full bg-white/[0.03] border border-white/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/[0.05] transition-all duration-500 text-white font-medium"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-white/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                    >
                      Email
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                    Enquiry Type
                  </span>
                  <div className="relative flex flex-wrap gap-3">
                    {["General", "Membership", "Inquiries"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`relative px-6 py-3 text-[10px] uppercase tracking-[0.25em] border transition-colors duration-500 ${
                          type === t
                            ? "bg-[#007DC6] text-white border-[#007DC6]"
                            : "border-white/15 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex-1 min-h-[120px]">
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder=" "
                    className="peer w-full h-full bg-white/[0.03] border border-white/15 px-4 pt-6 pb-2 text-base focus:outline-none focus:border-[#007DC6] focus:bg-white/[0.05] transition-all duration-500 resize-none text-white font-medium"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-6 text-base text-white/60 transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-[#007DC6] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-[#007DC6] pointer-events-none"
                  >
                    Message
                  </label>
                </div>

                <button
                  ref={btnRef}
                  type="submit"
                  className={`group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-[11px] uppercase tracking-[0.35em] font-bold overflow-hidden cursor-pointer mt-4 self-start transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    submitted
                      ? "bg-green-500 text-white"
                      : "bg-[#007DC6] text-white hover:bg-white hover:text-[#0c0b0b]"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {submitted ? (
                      <>
                        Message Sent <Check className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Send Message{" "}
                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SOCIAL ROW (Brand Colors & Icons)
═══════════════════════════════════════════════════════════════ */
function SocialRow() {
  const ref = useRef<HTMLDivElement>(null);

  const socials = [
    { name: "Facebook", group: "Express Highway Inn", href: "https://www.facebook.com/expresshighwayinn/", Icon: FaFacebook, color: "#1877F2" },
    { name: "Facebook", group: "Sampan Group", href: "https://www.facebook.com/sampangroup/", Icon: FaFacebook, color: "#1877F2" },
    { name: "Instagram", group: "Sampan Group", href: "#", Icon: FaInstagram, color: "#E4405F" },
    { name: "LinkedIn", group: "Sampan Group", href: "https://www.linkedin.com/company/sampangroup/", Icon: FaLinkedin, color: "#0A66C2" },
    { name: "YouTube", group: "Sampan Group", href: "#", Icon: FaYoutube, color: "#FF0000" },
  ];

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(
        q(".social-row"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="bg-[#F7F6F2] text-[#0c0b0b] py-24 md:py-32 overflow-hidden border-t border-[#0c0b0b]/10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[#007DC6] font-bold mb-4">
            Stay Connected
          </span>
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-light tracking-tight">
            Follow our journey.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-l border-[#0c0b0b]/10">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-row group relative p-8 border-r border-b border-[#0c0b0b]/10 hover:bg-white transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[180px] hover:-translate-y-1"
            >
              {/* Hover Accent Line (Top) - Now uses Brand Color */}
              <span
                className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ backgroundColor: s.color }}
              ></span>

              <div className="flex items-start justify-between">
                <span className="text-[9px] tracking-[0.3em] text-[#0c0b0b]/30 uppercase">
                  {s.group}
                </span>
                {/* Social Icon with Brand Color */}
                <s.Icon
                  className="h-5 w-5 transition-all duration-500 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                  style={{ color: s.color }}
                />
              </div>

              <h4 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-light text-[#0c0b0b]/80 group-hover:text-[#0c0b0b] transition-colors duration-500 flex items-center gap-2">
                {s.name}
                <ArrowUpRight
                  className="h-4 w-4 text-[#0c0b0b]/30 group-hover:rotate-45 transition-all duration-500"
                  style={{ color: s.color }}
                />
              </h4>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ContactSection() {
  return (
    <main className="bg-[#F7F6F2]">
      <ContactHero />
      <ContactGrid />
      <EnquiryForm />
      <SocialRow />
    </main>
  );
}