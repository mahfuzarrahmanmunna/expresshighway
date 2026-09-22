"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight, ArrowUpRight, Plus, Check } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Data ── */
const BENEFITS = [
  {
    num: "01",
    title: "Stay Ahead of the Rush",
    desc: "Guaranteed access to the VVIP Lounge and Premium Accommodation Rooms, even during peak travel.",
    img: "https://images.unsplash.com/photo-1584132967334-10e02831ac14?q=80&w=1200&auto=format&fit=crop",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    num: "02",
    title: "Better Value, Every Visit",
    desc: "Enjoy preferred rates at the Highway Restaurant and Sampan Mart.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-1",
  },
  {
    num: "03",
    title: "Wellness Without Leaving the Road",
    desc: "Salon, Spa, Gym and Pool access built into your journey.",
    img: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-1",
  },
  {
    num: "04",
    title: "Keep Moving",
    desc: "Priority EV charging, automatic car wash and towing support.",
    img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c1?q=80&w=1200&auto=format&fit=crop",
    size: "md:col-span-2",
  },
  {
    num: "05",
    title: "A Moment of Peace",
    desc: "A dedicated Prayer Room and 24/7 CRM Banking Booth.",
    img: "https://images.unsplash.com/photo-1591453243431-1d6b2f4f6e2d?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-1",
  },
  {
    num: "06",
    title: "Play. Unwind. Connect.",
    desc: "Access to Billiards, Card Room and the Juice & Drinks Bar.",
    img: "/images/Billiards.jpeg",
    size: "md:col-span-1",
  },
  {
    num: "07",
    title: "One Card. A Growing Network.",
    desc: "A recognized membership card across Sampan Group's growing highway network.",
    img: "https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1200&auto=format&fit=crop",
    size: "md:col-span-2",
  },
];

const TIMELINE_TIMES = [
  {
    time: "07:30",
    title: "Arrive",
    img: "https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "08:00",
    title: "Breakfast",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "09:00",
    title: "Lounge",
    img: "https://images.unsplash.com/photo-1584132967334-10e02831ac14?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "12:30",
    title: "Business",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "17:00",
    title: "Wellness",
    img: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "20:00",
    title: "Dinner",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop",
  },
  {
    time: "22:00",
    title: "Rest",
    img: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=1200&auto=format&fit=crop",
  },
];

const TRAVEL_MODES = [
  {
    title: "For You",
    desc: "Wellness, lounge, dining, relaxation.",
    img: "https://images.unsplash.com/photo-1540555700478-4be289caecef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "For Family",
    desc: "Accommodation, entertainment, convenience.",
    img: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "For Business",
    desc: "Private lounge, banking, meeting-friendly.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
  },
];

const FAQ_ITEMS = [
  {
    q: "Who can apply for membership?",
    a: "Membership is open to individuals, families, and corporate entities seeking premium hospitality and lifestyle benefits on the highway.",
  },
  {
    q: "Can membership be used by family members?",
    a: "Yes, our Family Tier allows designated family members to enjoy full access to the Club & Lounge facilities.",
  },
  {
    q: "Is membership valid across other Sampan properties?",
    a: "Your card is recognized across the growing Sampan Highway Inn network, with upcoming expansions to other Sampan Group ventures.",
  },
  {
    q: "How do I renew or upgrade?",
    a: "Memberships are annual. Upgrades can be made at any time by contacting our concierge. This is a lead-capture enquiry, not a payment checkout. Membership is confirmed directly by the Sampan team.",
  },
];

const TRUST_LOGOS = [
  "Sampan Group",
  "Sampan Highway Inn",
  "London School",
  "Sampan Agro & Golf",
];

/* ═══════════════════════════════════════════════════════════════
   2. CINEMATIC HERO WITH FLOATING CARD
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(".hero-bg-blur", {
        scale: 1.5,
        opacity: 0,
        filter: "blur(50px)",
        duration: 2,
        ease: "expo.out",
      })
        .from(
          ".hero-bg-sharp",
          {
            scale: 1.2,
            opacity: 0,
            filter: "blur(15px)",
            duration: 2,
            ease: "expo.out",
          },
          "-=1.8",
        )
        .from(".hero-overlay", { opacity: 0.8, duration: 2 }, "-=1.5");

      const heading = document.querySelector<HTMLElement>(".hero-headline");
      if (heading) {
        new SplitType(heading, {
          types: "lines,words",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".hero-headline .word", {
          yPercent: 110,
          rotateX: 45,
          opacity: 0,
        });
        tl.to(
          ".hero-headline .word",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=1.2",
        );
      }

      tl.fromTo(
        ".hero-highlight-mask",
        { x: "-100%" },
        { x: "100%", duration: 1.5, ease: "power2.inOut" },
        "-=0.8",
      )
        .from(
          ".hero-sub",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 30, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-card-anim",
          {
            opacity: 0,
            scale: 0.8,
            rotateY: -20,
            x: 80,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=1.2",
        );

      // Mouse Parallax
      const bgX = gsap.quickTo(".hero-bg-sharp", "x", {
        duration: 2,
        ease: "power2.out",
      });
      const bgY = gsap.quickTo(".hero-bg-sharp", "y", {
        duration: 2,
        ease: "power2.out",
      });
      const cardX = gsap.quickTo(".hero-card-anim", "x", {
        duration: 1.5,
        ease: "power2.out",
      });
      const cardY = gsap.quickTo(".hero-card-anim", "y", {
        duration: 1.5,
        ease: "power2.out",
      });

      const onMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        bgX(nx * -15);
        bgY(ny * -10);
        cardX(nx * 10);
        cardY(ny * 6);
      };
      window.addEventListener("mousemove", onMouseMove);

      // Floating Card Loop
      gsap.to(".hero-card-anim", {
        y: "-=10",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => window.removeEventListener("mousemove", onMouseMove);
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen w-full bg-black overflow-hidden flex items-center"
      style={{ perspective: "1000px" }}
    >
      <div className="hero-bg-blur absolute inset-[-60px] z-0 opacity-50">
        <Image
          src="https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop"
          alt="Highway Blurred"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-2xl bg-black/30" />
      </div>
      <div className="hero-bg-sharp absolute inset-0 z-[1]">
        <Image
          src="https://images.unsplash.com/photo-1502810365585-9e3d2c92e88d?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Highway"
          fill
          priority
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 text-left">
          <h2 className="hero-headline font-[family-name:var(--font-playfair)] text-white text-[clamp(2.5rem,7vw,6rem)] leading-[1.02] font-medium">
            <div className="block">Join the Club.</div>
            <div className="block relative w-fit mt-2">
              Own the
              <span className="relative inline-block ml-4">
                <span className="relative z-10 text-primary/90 italic">
                  Highway.
                </span>
                <span className="hero-highlight-mask absolute inset-0 z-20 bg-gradient-to-r from-transparent via-primary/60 to-transparent"></span>
              </span>
            </div>
          </h2>
          <p className="hero-sub mt-10 text-lg font-light text-white/60 max-w-xl leading-relaxed">
            Membership to Express Highway Inn Club & Lounge unlocks every
            facility at Sampan Highway Inn - for you, your family and your
            business travel, every time you&apos;re on the road.
          </p>

          <div className="hero-cta mt-12 flex flex-wrap gap-4">
            <a
              href="#enquiry"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden"
              data-cursor="ENQUIRE"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#0096E0] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10">Start Your Membership</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#benefits"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-white/5 transition-colors"
            >
              Explore Member Benefits
            </a>
          </div>
        </div>

        {/* Right Floating Card */}
        <div className="lg:col-span-5 hidden lg:flex justify-end items-center">
          <div className="hero-card-anim relative w-[320px] h-[200px] rounded-xl border border-white/20 backdrop-blur-md bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-2xl overflow-hidden p-6 flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.3em] text-white/40">
                  Express Highway Inn
                </span>
                <span className="block text-sm font-[family-name:var(--font-playfair)] text-white/90 mt-1">
                  Club & Lounge
                </span>
              </div>
              <div className="w-8 h-5 bg-gradient-to-br from-yellow-200/80 to-yellow-800/80 rounded-sm border border-white/20"></div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-[0.4em] text-primary/80 font-medium block">
                Member
              </span>
              <div className="flex justify-end gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-white/30"></span>
                <span className="w-2 h-2 rounded-full bg-white/30"></span>
                <span className="w-2 h-2 rounded-full bg-white/30"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. MEMBERSHIP INTRO (Monumental Typography)
═══════════════════════════════════════════════════════════════ */
function IntroStatement() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const text = document.querySelector<HTMLElement>(".intro-text");
      if (text) {
        new SplitType(text, { types: "words", wordClass: "inline-block" });
        gsap.from(".intro-text .word", {
          opacity: 0,
          y: 80,
          filter: "blur(10px)",
          stagger: 0.1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#F7F6F2] text-black py-32 md:py-56 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-left md:text-center">
        <h2 className="intro-text font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,7rem)] leading-[1.05] font-medium tracking-tight">
          More than a membership card. It is your access to{" "}
          <span className="text-primary italic">comfort</span>,{" "}
          <span className="text-primary italic">convenience</span>, and private{" "}
          <span className="text-primary italic">hospitality</span>.
        </h2>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. WHY JOIN (Editorial Benefit Grid)
═══════════════════════════════════════════════════════════════ */
function WhyJoin() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const text = document.querySelector<HTMLElement>(".why-head");
      if (text) {
        new SplitType(text, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.from(".why-head .line", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: text, start: "top 80%" },
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".benefit-card");
      const clipPaths = [
        "inset(0 100% 0 0)",
        "inset(0 0 0 100%)",
        "inset(100% 0 0 0)",
        "inset(0 0 100% 0)",
      ];

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: clipPaths[i % 4], opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="benefits"
      ref={ref}
      className="bg-[#F7F6F2] text-black py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            Why Members Choose Sampan
          </span>
          <h2 className="why-head font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
            One membership.
            <br />A complete highway lifestyle.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className={`benefit-card group relative ${b.size} bg-black overflow-hidden cursor-pointer`}
              data-cursor="VIEW"
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={b.img}
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={80}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/70"></div>

              <span className="absolute top-4 left-4 font-[family-name:var(--font-playfair)] text-[100px] leading-none text-white/[0.08] pointer-events-none transition-all duration-500 group-hover:text-white/30">
                {b.num}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <div className="overflow-hidden mb-2">
                  <span className="block text-[9px] uppercase tracking-[0.3em] text-primary translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Benefit {b.num}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-medium transition-transform duration-500 group-hover:translate-x-3">
                  {b.title}
                </h3>
                <div className="h-[1px] w-0 bg-primary mt-3 transition-all duration-700 group-hover:w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. MEMBER EXPERIENCE (Horizontal Timeline)
═══════════════════════════════════════════════════════════════ */
function MemberTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.innerWidth < 768) return;

      const panels = gsap.utils.toArray<HTMLElement>(".time-panel");
      const totalWidth = trackRef.current?.offsetWidth || 0;

      const horizontalTween = gsap.to(trackRef.current, {
        x: () => -(totalWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current)
              progressRef.current.style.width = `${self.progress * 100}%`;
          },
        },
      });

      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: "left 60%",
          end: "right 40%",
          onEnter: () =>
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1 }),
          onLeave: () =>
            gsap.to(panel, { autoAlpha: 0.3, scale: 0.9, duration: 1 }),
          onEnterBack: () =>
            gsap.to(panel, { autoAlpha: 1, scale: 1, duration: 1 }),
          onLeaveBack: () =>
            gsap.to(panel, { autoAlpha: 0.3, scale: 0.9, duration: 1 }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-screen bg-[#050505] text-white overflow-hidden hidden md:block"
    >
      <div className="relative h-full flex flex-col justify-center z-10">
        <div className="mb-16 flex items-end justify-between px-16">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.4em] text-primary/80 font-medium mb-6">
              05 - Member Experience
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl font-medium">
              Your Day. Your Way.
            </h2>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2">
          <div ref={progressRef} className="h-full bg-primary/60 w-0"></div>
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-24 px-40"
          data-cursor="DRAG"
        >
          {TIMELINE_TIMES.map((t, i) => (
            <div
              key={i}
              className="time-panel flex-shrink-0 w-[50vw] relative"
              style={{ opacity: 0.3, transform: "scale(0.9)" }}
            >
              <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full border-2 border-[#050505] -translate-y-1/2 bg-primary"></div>

              <div className="pl-12 flex items-center gap-16">
                <div className="flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-4">
                    0{i + 1}
                  </span>
                  <h3 className="text-5xl font-medium mb-4 font-[family-name:var(--font-playfair)]">
                    {t.time}
                  </h3>
                  <p className="text-2xl text-white/60 uppercase tracking-widest">
                    {t.title}
                  </p>
                </div>
                <div className="relative w-[300px] h-[200px] overflow-hidden">
                  <Image
                    src={t.img}
                    alt={t.title}
                    fill
                    className="object-cover"
                    quality={80}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. TRAVEL MODES (Interactive 3-Way Split)
═══════════════════════════════════════════════════════════════ */
function TravelModes() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-[#050505] text-white py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            Designed for Every Journey
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
            For You. For Family. For Business.
          </h2>
        </div>

        <div className="hidden md:flex h-[500px] border border-white/10">
          {TRAVEL_MODES.map((m, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex-1 border-r border-white/10 last:border-r-0 overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: hovered === i ? 2 : 1 }}
              data-cursor="EXPLORE"
            >
              <Image
                src={m.img}
                alt={m.title}
                fill
                className="object-cover transition-transform duration-700"
                style={{
                  transform: hovered === i ? "scale(1)" : "scale(1.1)",
                  opacity: hovered === i ? 0.3 : 0.15,
                }}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <span
                  className="text-sm font-medium text-primary/80 mb-2 block transition-all duration-300"
                  style={{ opacity: hovered === i ? 1 : 0.5 }}
                >
                  {m.title}
                </span>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: hovered === i ? "200px" : "0px",
                    opacity: hovered === i ? 1 : 0,
                  }}
                >
                  <p className="text-sm font-light text-white/60 pt-2">
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Fallback */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {TRAVEL_MODES.map((m, i) => (
            <div
              key={i}
              className="relative h-[200px] border border-white/10 overflow-hidden"
            >
              <Image
                src={m.img}
                alt={m.title}
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <span className="text-sm font-medium text-primary/80 mb-2 block">
                  {m.title}
                </span>
                <p className="text-sm font-light text-white/60">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. HOW IT WORKS (Giant Steps)
═══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".step-num", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ".steps-grid", start: "top 70%" },
      });

      gsap.fromTo(
        ".step-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".steps-grid", start: "top 70%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#F7F6F2] text-black py-32 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            06 - The Process
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
            Membership, Made Simple.
          </h2>
        </div>

        <div className="steps-grid relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
          <div className="absolute top-[60px] left-[16%] right-[16%] h-px bg-black/10 hidden md:block">
            <div className="step-line h-full bg-primary origin-left scale-x-0"></div>
          </div>

          {["Enquire", "Verify", "Activate"].map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center"
            >
              <span className="step-num font-[family-name:var(--font-playfair)] text-[140px] md:text-[160px] leading-none text-black/[0.06] font-medium">
                0{i + 1}
              </span>
              <span className="absolute top-[70px] text-sm uppercase tracking-[0.3em] text-primary font-medium mt-4 bg-[#F7F6F2] px-4">
                {step}
              </span>
              <p className="mt-8 text-base font-light text-black/50 max-w-xs">
                {i === 0 &&
                  "Submit your details and preferences through our enquiry form."}
                {i === 1 &&
                  "Our concierge team will contact you to verify details and confirm your tier."}
                {i === 2 &&
                  "Receive your digital card and activate your membership instantly."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. TRUST / ECOSYSTEM
═══════════════════════════════════════════════════════════════ */
function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".trust-logo").forEach((logo) => {
        gsap.fromTo(
          logo,
          { clipPath: "inset(0 100% 0 0)", opacity: 0, filter: "grayscale(1)" },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            filter: "grayscale(0)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: logo, start: "top 85%" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="bg-[#050505] text-white py-32 md:py-48 overflow-hidden border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
          07 - Trust & Ecosystem
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05] mb-12">
          Backed by <span className="text-primary italic">Sampan Group.</span>
        </h2>
        <p className="text-lg font-light text-white/50 max-w-2xl mx-auto leading-relaxed mb-20">
          Your membership is part of a growing ecosystem of hospitality,
          education, real estate and lifestyle brands.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
          {TRUST_LOGOS.map((logo, i) => (
            <div
              key={i}
              className="trust-logo group border-r border-b border-white/10 aspect-[3/2] flex items-center justify-center p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xl md:text-2xl font-[family-name:var(--font-playfair)] tracking-wide text-white/40 transition-all duration-500 group-hover:text-white group-hover:scale-105">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. FAQ (Editorial List)
═══════════════════════════════════════════════════════════════ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    refs.current.forEach((ans, i) => {
      if (!ans) return;
      if (openIndex === i) {
        gsap.to(ans, {
          height: "auto",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        });
      } else {
        gsap.to(ans, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
        });
      }
    });
  }, [openIndex]);

  return (
    <section className="bg-[#F7F6F2] text-black py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-6">
            08 - Information
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-medium leading-[1.05]">
            Everything you need to know.
          </h2>
        </div>

        <div className="border-t border-black/10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-black/10">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="group w-full flex items-center justify-between py-8 text-left cursor-pointer"
              >
                <div className="flex items-center gap-8">
                  <span className="text-[10px] tracking-[0.3em] text-black/30 font-medium">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-[family-name:var(--font-playfair)] font-medium transition-transform duration-300 group-hover:translate-x-2">
                    {item.q}
                  </h3>
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <span
                    className={`absolute h-px w-4 bg-primary transition-all duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                  ></span>
                  <span
                    className={`absolute h-px w-4 bg-primary transition-all duration-300 ${openIndex === i ? "rotate-[-45deg]" : "rotate-90"}`}
                  ></span>
                </div>
              </button>
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="overflow-hidden"
                style={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p className="pb-8 pl-16 text-base font-light text-black/60 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. MEMBERSHIP ENQUIRY (Cinematic Form)
═══════════════════════════════════════════════════════════════ */
function EnquiryForm() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);
  const [tier, setTier] = useState("Individual");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-bg",
        { scale: 1.15 },
        {
          scale: 1,
          duration: 3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      const heading = document.querySelector<HTMLElement>(".form-head");
      if (heading) {
        new SplitType(heading, {
          types: "lines",
          lineClass: "overflow-hidden block",
        });
        gsap.set(".form-head .line", { yPercent: 110 });
        tl.to(".form-head .line", {
          yPercent: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "power4.out",
        });
      }
      tl.from(
        ".form-anim",
        { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.8",
      );

      // Liquid Magnetic Button
      const btn = btnRef.current;
      const liquid = liquidRef.current;
      if (btn && liquid) {
        const xTo = gsap.quickTo(btn, "x", {
          duration: 0.4,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(btn, "y", {
          duration: 0.4,
          ease: "power3.out",
        });
        const xLiq = gsap.quickTo(liquid, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const yLiq = gsap.quickTo(liquid, "y", {
          duration: 0.6,
          ease: "power3.out",
        });

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          xTo(x * 0.3);
          yTo(y * 0.3);
          xLiq(x * 0.5);
          yLiq(y * 0.5);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
          xLiq(0);
          yLiq(0);
        };

        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
        return () => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    },
    { scope: ref },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="enquiry"
      ref={ref}
      className="relative bg-black text-white py-32 md:py-56 overflow-hidden"
    >
      <div
        className="cta-bg absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1584132967334-10e02831ac14?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-[1]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side */}
        <div className="flex flex-col justify-center">
          <span className="form-anim block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-8">
            09 - Start Your Membership
          </span>
          <h2 className="form-head font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] mb-10">
            <div>Begin the</div>
            <div className="text-primary italic">Journey.</div>
          </h2>
          <p className="form-anim text-lg font-light text-white/50 max-w-md leading-relaxed mb-12">
            Tell us how you would like to experience Express Highway Inn Club &
            Lounge. Our team will contact you to confirm the right membership
            option.
          </p>
          <div className="form-anim border-l-2 border-primary pl-6">
            <p className="text-sm text-white/70 italic">
              The highway is waiting.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2">
              Express Highway Inn Club & Lounge
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="form-anim flex flex-col gap-8"
          >
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
              />
              <label
                htmlFor="name"
                className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-12px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
              >
                Full Name
              </label>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
                />
                <label
                  htmlFor="phone"
                  className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-12px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
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
                  className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors"
                />
                <label
                  htmlFor="email"
                  className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-12px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
                >
                  Email
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Preferred Tier
              </span>
              <div className="grid grid-cols-3 gap-4">
                {["Individual", "Family", "Corporate"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`relative py-4 text-[11px] uppercase tracking-[0.2em] border transition-colors duration-300 ${tier === t ? "bg-primary text-white border-primary" : "border-white/20 text-white/60 hover:border-white/40"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                id="message"
                rows={3}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-lg focus:outline-none focus:border-primary transition-colors resize-none"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute top-2 left-0 text-lg text-white/40 transition-all duration-300 peer-focus:top-[-12px] peer-focus:text-[10px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:text-primary"
              >
                Message
              </label>
            </div>

            <button
              ref={btnRef}
              type="submit"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden cursor-pointer mt-4 self-start"
              data-cursor="ENQUIRE"
            >
              <span
                ref={liquidRef}
                className="absolute inset-0 bg-[#0096E0] rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ mixBlendMode: "screen" }}
              ></span>
              <span className="relative z-10">Submit Enquiry</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45" />
            </button>

            <p className="text-[10px] text-white/30 mt-4">
              This is a lead-capture enquiry, not a payment checkout. Membership
              is confirmed directly by the Sampan team.
            </p>
          </form>
        ) : (
          <div className="form-anim flex flex-col items-center justify-center text-center border border-white/10 p-16">
            <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center mb-8">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-medium mb-4">
              Enquiry Received
            </h3>
            <p className="text-lg font-light text-white/50 max-w-sm">
              Thank you. Our concierge team will contact you shortly to confirm
              your membership.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function MembershipPage() {
  return (
    <main className="bg-[#050505]">
      <Hero />
      <IntroStatement />
      <WhyJoin />
      <MemberTimeline />
      <TravelModes />
      <HowItWorks />
      <TrustSection />
      <FAQ />
      <EnquiryForm />
    </main>
  );
}
