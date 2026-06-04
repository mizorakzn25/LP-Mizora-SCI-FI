'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';

interface HeroSectionProps {
  t: TranslationSet;
  lang: Language;
  isLoading?: boolean;
}

export default function HeroSection({ t, lang, isLoading }: HeroSectionProps) {
  const scrollToSegment = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // ─── Animation Control ───
  // Only start hero entrance after loading screen exits
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (isLoading === undefined || !isLoading) {
      const timer = setTimeout(() => setCanAnimate(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // ─── F — Subheadline Typewriter ───
  // Max 2.5s total visual: typewriter starts at 0.55s, 12ms/char → ~2.34s for ~149 chars
  const [subheadChars, setSubheadChars] = useState(0);

  useEffect(() => {
    if (!canAnimate) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const text = t.hero.subheadline;
    const startDelay = 550; // ms after canAnimate
    const charSpeed = 12; // ms per character

    for (let i = 0; i <= text.length; i++) {
      timeouts.push(setTimeout(() => setSubheadChars(i), startDelay + i * charSpeed));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [canAnimate, t.hero.subheadline]);

  const subheadText = t.hero.subheadline.slice(0, subheadChars);

  // ─── Infinite Marquee Ticker (ROW 2 — Client names) ───
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const animRef = useRef<number | null>(null);
  const positionRef = useRef(0);

  // ─── System Status Cycle (ROW 1 — Cycling system abbreviations) ───
  const SYSTEMS = ['MACS', 'MACPS', 'MATLS', 'MASDM', 'MAOBS', 'MAOVDS', 'MALVCS', 'MAUBS'] as const;
  const [activeSystemIdx, setActiveSystemIdx] = useState(0);
  const [systemGlitching, setSystemGlitching] = useState(false);

  useEffect(() => {
    const CYCLE_MS = 3500;
    const GLITCH_MS = 300;
    const interval = setInterval(() => {
      setSystemGlitching(true);
      setTimeout(() => {
        setActiveSystemIdx((prev) => (prev + 1) % SYSTEMS.length);
        setSystemGlitching(false);
      }, GLITCH_MS);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // ─── Tag Stream Ticker (ROW 3 — Tags, slower speed) ───
  const tagRef = useRef<HTMLDivElement>(null);
  const tagAnimRef = useRef<number | null>(null);
  const tagPositionRef = useRef(0);
  const [tagPaused, setTagPaused] = useState(false);

  // ROW 2 animation
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    const speed = 0.6;

    const animate = () => {
      if (!isPaused && !isDragging) {
        positionRef.current -= speed;
        const halfWidth = ticker.scrollWidth / 2;
        if (Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current += halfWidth;
        }
        ticker.style.transform = `translateX(${positionRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, isDragging]);

  // ROW 3 animation (slower)
  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;

    const speed = 0.3;

    const animate = () => {
      if (!tagPaused) {
        tagPositionRef.current -= speed;
        const halfWidth = tag.scrollWidth / 2;
        if (Math.abs(tagPositionRef.current) >= halfWidth) {
          tagPositionRef.current += halfWidth;
        }
        tag.style.transform = `translateX(${tagPositionRef.current}px)`;
      }
      tagAnimRef.current = requestAnimationFrame(animate);
    };

    tagAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (tagAnimRef.current) cancelAnimationFrame(tagAnimRef.current);
    };
  }, [tagPaused]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - positionRef.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const x = e.clientX - startX;
    positionRef.current = x;
    if (tickerRef.current) {
      tickerRef.current.style.transform = `translateX(${x}px)`;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const tickerItems = t.hero.clientTicker.split(' · ');
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  // ROW 3 — Tag stream items
  const tagItems = ['AUTOMATION', 'AI WORKFLOW', 'SYSTEM BUILDER', 'N8N', 'MAKE.COM', 'ZAPIER', 'CHATBOT', 'INTEGRATION', 'CUSTOM GPT', 'WORKFLOW'];
  const repeatedTags = [...tagItems, ...tagItems, ...tagItems, ...tagItems];

  // ─── Shared easing ───
  const easeOut = [0.16, 1, 0.3, 1] as const;

  // ─── U7 — Parallax Scroll Layers ───
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Each layer scrolls at different speed → depth effect
  // Farther back = slower, closer = faster
  const parallaxF8 = useTransform(scrollYProgress, [0, 1], [0, -15]);    // Corner Data Readout — deepest background
  const parallaxF1 = useTransform(scrollYProgress, [0, 1], [0, -30]);    // Status Bar Divider
  const parallaxHeadline = useTransform(scrollYProgress, [0, 1], [0, -50]); // Tagline + Headline
  const parallaxLogo = useTransform(scrollYProgress, [0, 1], [0, -70]);   // Logo card
  const parallaxTicker = useTransform(scrollYProgress, [0, 1], [0, -90]); // Ticker strip

  // ─── U2 — Cursor Light Trail ───
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });

  const handleSectionMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // ─── U1 — Logo Card 3D Tilt ───
  const logoCardRef = useRef<HTMLDivElement>(null);
  const [logoTilt, setLogoTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleLogoMouseMove = (e: React.MouseEvent) => {
    if (!logoCardRef.current) return;
    const rect = logoCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;
    setLogoTilt({ rotateX, rotateY });
  };

  const handleLogoMouseLeave = () => {
    setLogoTilt({ rotateX: 0, rotateY: 0 });
  };

  // ─── U4 — Magnetic CTA Buttons ───
  const cta1Ref = useRef<HTMLButtonElement>(null);
  const cta2Ref = useRef<HTMLButtonElement>(null);
  const [cta1Offset, setCta1Offset] = useState({ x: 0, y: 0 });
  const [cta2Offset, setCta2Offset] = useState({ x: 0, y: 0 });

  const handleMagneticMove = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLButtonElement | null>,
    setter: (val: { x: number; y: number }) => void
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setter({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMagneticLeave = (setter: (val: { x: number; y: number }) => void) => {
    setter({ x: 0, y: 0 });
  };

  // ─── U3 — Glitch Text Flash ───
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!canAnimate) return;
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };
    const interval = setInterval(() => {
      if (Math.random() < 0.35) triggerGlitch();
    }, 5000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [canAnimate]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-20 pb-16 md:pt-24 md:pb-20 bg-white overflow-hidden flex flex-col justify-center min-h-[92vh]"
      onMouseMove={handleSectionMouseMove}
    >
      {/* U2 — Cursor Light Trail */}
      <div
        className="absolute pointer-events-none z-[5] transition-opacity duration-300"
        style={{
          left: cursorPos.x - 200,
          top: cursorPos.y - 200,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: cursorPos.x > 0 ? 1 : 0,
        }}
      />


      {/* ─── F8 — Corner Data Readout (Parallax Layer: deepest) ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="absolute inset-0 pointer-events-none z-20"
        style={{ y: parallaxF8 }}
      >
        {/* Top-left readout */}
        <span
          className="absolute top-6 left-6 md:top-8 md:left-12 text-[7px] text-neutral-400/60 tracking-[0.25em] uppercase font-bold"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {'// SECTOR_01'}
        </span>
        {/* Top-right readout */}
        <span
          className="absolute top-6 right-6 md:top-8 md:right-12 text-[7px] text-neutral-400/60 tracking-[0.25em] uppercase font-bold"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          SIG:ACTIVE
        </span>
        {/* Bottom-left readout */}
        <span
          className="absolute bottom-6 left-6 md:bottom-8 md:left-12 text-[7px] text-neutral-400/60 tracking-[0.25em] uppercase font-bold"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          REF:0x4KZN
        </span>
        {/* Bottom-right readout */}
        <span
          className="absolute bottom-6 right-6 md:bottom-8 md:right-12 text-[7px] text-neutral-400/60 tracking-[0.25em] uppercase font-bold"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          LAT 6.2°S
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">

        {/* ─── F1 — HUD Status Bar Divider + Badge (Parallax Layer: back) ─── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, delay: 0, ease: easeOut }}
          className="relative pb-5 mb-10"
          style={{ y: parallaxF1 }}
        >
          {/* Content row */}
          <div className="flex items-center justify-between mb-3.5">
            <span
              className="font-mono text-[9px] text-neutral-500 tracking-[0.25em] uppercase font-bold"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              {t.hero.systemStatus}
            </span>

            {/* B — Status Badge with glitch flash */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.9 }}
              animate={canAnimate ? { opacity: [0, 0.7, 0.3, 1], scaleX: [0.9, 1.03, 0.98, 1] } : { opacity: 0, scaleX: 0.9 }}
              transition={{ duration: 0.35, delay: 0.1, ease: easeOut }}
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-sm border border-neutral-300/80 font-mono text-[8.5px] uppercase shadow-sm relative"
            >
              <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-neutral-300" />
              <span className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-neutral-300" />
              <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-neutral-300" />
              <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-neutral-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] sci-fi-pulse shrink-0" />
              <span className="text-neutral-800 font-bold tracking-wider">{t.hero.statusBadge}</span>
            </motion.div>
          </div>

          {/* F1 — HUD Divider Line */}
          <div className="relative h-0">
            {/* Main line */}
            <div className="absolute inset-x-0 h-[1px] bg-neutral-200/80" />

            {/* Left end-cap: L-corner + dot */}
            <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-2 h-2 border-l border-b border-neutral-300" />
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-neutral-300" />

            {/* Right end-cap: mirrored L-corner + dot */}
            <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 border-r border-b border-neutral-300" />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-neutral-300" />

            {/* Center tick mark */}
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1px] h-[6px] bg-neutral-300" />
          </div>

          {/* H1 — Segmented Dot Bar (below divider) */}
          <motion.div
            className="flex items-center gap-[5px] mt-2.5 justify-center"
            initial={{ opacity: 0 }}
            animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className={`w-[3px] h-[3px] rounded-full shrink-0 ${
                  i < 4 ? 'bg-neutral-400' : 'bg-neutral-200'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={canAnimate ? { scale: 1, opacity: i < 4 ? 1 : 0.5 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.25 + i * 0.03, ease: easeOut }}
              />
            ))}
            {/* Right-side label */}
            <span
              className="ml-2 text-[6.5px] text-neutral-400 tracking-[0.2em] uppercase font-bold"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              4/12
            </span>
          </motion.div>
        </motion.div>

        {/* ─── F2 — Main Grid with HUD Corner Brackets ─── */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6 px-4 md:px-6">
          {/* ╔ Top-Left Corner Bracket */}
          <motion.span
            className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-neutral-300 pointer-events-none"
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: easeOut }}
            style={{ transformOrigin: 'top left' }}
          />
          {/* ╗ Top-Right Corner Bracket */}
          <motion.span
            className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-neutral-300 pointer-events-none"
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
            transition={{ duration: 0.3, delay: 0.45, ease: easeOut }}
            style={{ transformOrigin: 'top right' }}
          />
          {/* ╚ Bottom-Left Corner Bracket */}
          <motion.span
            className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-neutral-300 pointer-events-none"
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
            transition={{ duration: 0.3, delay: 0.5, ease: easeOut }}
            style={{ transformOrigin: 'bottom left' }}
          />
          {/* ╝ Bottom-Right Corner Bracket */}
          <motion.span
            className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-neutral-300 pointer-events-none"
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
            transition={{ duration: 0.3, delay: 0.55, ease: easeOut }}
            style={{ transformOrigin: 'bottom right' }}
          />

          {/* ─── F10 — Crosshair Center Mark ─── */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={canAnimate ? { opacity: 0.15, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.7, ease: easeOut }}
          >
            {/* Horizontal line */}
            <span className="absolute w-6 h-[1px] bg-neutral-400" />
            {/* Vertical line */}
            <span className="absolute w-[1px] h-6 bg-neutral-400" />
            {/* Center dot */}
            <span className="absolute w-[3px] h-[3px] rounded-full bg-neutral-400" />
          </motion.div>
          {/* Headline Area (Parallax Layer: mid) */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            style={{ y: parallaxHeadline }}
          >

            {/* ─── C + F6 — Tagline Badge with Accent (slide from left) ─── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={canAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.35, delay: 0.18, ease: easeOut }}
              className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-sm mb-6 shadow-sm"
            >
              {/* F6 — Left accent tick */}
              <span className="w-[2px] h-3 bg-neutral-500 rounded-full shrink-0" />
              {/* F6 — Glow dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-white sci-fi-pulse shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
              <span
                className="text-[10px] text-neutral-300 font-bold tracking-[0.2em] uppercase leading-none"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {t.hero.tagline}
              </span>
              {/* F6 — Right accent tick */}
              <span className="w-[2px] h-3 bg-neutral-500 rounded-full shrink-0" />
            </motion.div>

            {/* ─── D/E + U3 — Headline Text Reveal with Glitch ─── */}
            <div className="mb-6">
              <h1
                className={`font-sans font-black text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tighter text-[#0A0A0A] uppercase flex flex-col transition-none ${isGlitching ? 'hero-glitch' : ''}`}
              >
                {/* D — Headline 1 */}
                <div className="relative overflow-hidden">
                  <span className="text-[#0A0A0A] block">{t.hero.headlinePart1}</span>
                  <motion.div
                    className="absolute inset-0 bg-white origin-right"
                    initial={{ scaleX: 1 }}
                    animate={canAnimate ? { scaleX: 0 } : { scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.28, ease: [0.76, 0, 0.24, 1] }}
                  />
                </div>
                {/* E — Headline 2 */}
                <div className="relative overflow-hidden">
                  <span className="text-black block">{t.hero.headlinePart2}</span>
                  <motion.div
                    className="absolute inset-0 bg-white origin-right"
                    initial={{ scaleX: 1 }}
                    animate={canAnimate ? { scaleX: 0 } : { scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.45, ease: [0.76, 0, 0.24, 1] }}
                  />
                </div>
              </h1>
            </div>

            {/* ─── F + F9 + H2 — Subheadline Typewriter with Bracket & Chevron Stream ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.1, delay: 0.55 }}
              className="max-w-xl mb-10 relative pl-4"
            >
              {/* F9 — Left bracket marks */}
              <span className="absolute left-0 top-0 w-[1px] h-2 bg-neutral-300" />
              <span className="absolute left-0 top-0 w-1.5 h-[1px] bg-neutral-300" />
              <span className="absolute left-0 bottom-0 w-[1px] h-2 bg-neutral-300" />
              <span className="absolute left-0 bottom-0 w-1.5 h-[1px] bg-neutral-300" />

              <p className="font-sans font-medium text-sm md:text-sm text-neutral-500 leading-relaxed tracking-tight">
                {subheadText}
                {subheadChars < t.hero.subheadline.length && subheadChars > 0 && (
                  <span className="typewriter-cursor">█</span>
                )}
              </p>

              {/* H2 — Chevron Slider Stream (appears after typewriter finishes) */}
              <motion.div
                className="flex items-center mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={
                  canAnimate && subheadChars >= t.hero.subheadline.length
                    ? { opacity: 1, height: 'auto' }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.5, ease: easeOut }}
              >
                {/* Chevron wave — each chevron pulses left-to-right */}
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.svg
                      key={`chev-${i}`}
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      className="shrink-0"
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        x: [0, 2, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: i * 0.12,
                        ease: 'easeInOut',
                      }}
                    >
                      <polyline
                        points="1,0.5 4.5,3 1,5.5"
                        fill="none"
                        stroke="#737373"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  ))}
                </div>

                {/* Right endpoint — live indicator */}
                <span className="flex items-center gap-1.5 ml-2">
                  <span className="w-[3px] h-[3px] rounded-full bg-neutral-400 sci-fi-pulse" />
                  <span
                    className="text-[6.5px] text-neutral-400 tracking-[0.15em] uppercase font-bold"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    STREAM
                  </span>
                </span>
              </motion.div>
            </motion.div>

            {/* ─── F4 — CTA with Corner Ticks ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={canAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.75 }}
              className="relative w-full sm:w-auto py-3 px-3"
            >
              {/* ┌ Top-Left tick */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neutral-300 pointer-events-none" />
              {/* ┐ Top-Right tick */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neutral-300 pointer-events-none" />
              {/* └ Bottom-Left tick */}
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-neutral-300 pointer-events-none" />
              {/* ┘ Bottom-Right tick */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neutral-300 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                {/* U4 — CTA 1 (Magnetic) */}
                <button
                  ref={cta1Ref}
                  onClick={() => scrollToSegment('contact')}
                  onMouseMove={(e) => handleMagneticMove(e, cta1Ref, setCta1Offset)}
                  onMouseLeave={() => handleMagneticLeave(setCta1Offset)}
                  style={{
                    transform: `translate(${cta1Offset.x}px, ${cta1Offset.y}px)`,
                    transition: cta1Offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.15s ease-out',
                  }}
                  className="hero-cta-primary group px-8 py-4 bg-[#0A0A0A] text-white border border-[#0A0A0A] rounded-sm font-sans font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.ctaConsultText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                {/* U4 — CTA 2 (Magnetic) */}
                <button
                  ref={cta2Ref}
                  onClick={() => scrollToSegment('ratecard')}
                  onMouseMove={(e) => handleMagneticMove(e, cta2Ref, setCta2Offset)}
                  onMouseLeave={() => handleMagneticLeave(setCta2Offset)}
                  style={{
                    transform: `translate(${cta2Offset.x}px, ${cta2Offset.y}px)`,
                    transition: cta2Offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.15s ease-out',
                  }}
                  className="hero-cta-secondary group px-8 py-4 bg-white text-[#0A0A0A] border border-neutral-300 rounded-sm font-sans font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.hero.ctaRatecardText}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── H + U1 — Hero Image (Parallax Layer: foreground) ─── */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            style={{ y: parallaxLogo }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={canAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.45, delay: 0.22, ease: easeOut }}
              style={{ perspective: '800px' }}
            >
              <div
                ref={logoCardRef}
                onMouseMove={handleLogoMouseMove}
                onMouseLeave={handleLogoMouseLeave}
                className="relative w-full max-w-sm aspect-square p-2 bg-white border border-neutral-200/80 rounded-sm shadow-2xl overflow-hidden group hover:border-black/20"
                style={{
                  transform: `rotateX(${logoTilt.rotateX}deg) rotateY(${logoTilt.rotateY}deg)`,
                  transition: logoTilt.rotateX === 0 && logoTilt.rotateY === 0
                    ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s'
                    : 'transform 0.1s ease-out, border-color 0.3s',
                  transformStyle: 'preserve-3d',
                }}
              >

                {/* ─── F3 — Double-Layer Corner Brackets ─── */}
                {/* Outer layer ╔ Top-Left */}
                <motion.span
                  className="absolute -top-px -left-px w-4 h-4 border-t-[2px] border-l-[2px] border-neutral-300 origin-top-left"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.5, ease: easeOut }}
                />
                {/* Outer layer ╗ Top-Right */}
                <motion.span
                  className="absolute -top-px -right-px w-4 h-4 border-t-[2px] border-r-[2px] border-neutral-300 origin-top-right"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.52, ease: easeOut }}
                />
                {/* Outer layer ╚ Bottom-Left */}
                <motion.span
                  className="absolute -bottom-px -left-px w-4 h-4 border-b-[2px] border-l-[2px] border-neutral-300 origin-bottom-left"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.56, ease: easeOut }}
                />
                {/* Outer layer ╝ Bottom-Right */}
                <motion.span
                  className="absolute -bottom-px -right-px w-4 h-4 border-b-[2px] border-r-[2px] border-neutral-300 origin-bottom-right"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.58, ease: easeOut }}
                />
                {/* Inner layer ┌ Top-Left */}
                <motion.span
                  className="absolute top-2 left-2 w-3 h-3 border-t border-l border-neutral-200 origin-top-left"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.6, ease: easeOut }}
                />
                {/* Inner layer ┐ Top-Right */}
                <motion.span
                  className="absolute top-2 right-2 w-3 h-3 border-t border-r border-neutral-200 origin-top-right"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.62, ease: easeOut }}
                />
                {/* Inner layer └ Bottom-Left */}
                <motion.span
                  className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-neutral-200 origin-bottom-left"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.66, ease: easeOut }}
                />
                {/* Inner layer ┘ Bottom-Right */}
                <motion.span
                  className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-neutral-200 origin-bottom-right"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={canAnimate ? { scaleX: 1, scaleY: 1 } : { scaleX: 0, scaleY: 0 }}
                  transition={{ duration: 0.25, delay: 0.68, ease: easeOut }}
                />

                {/* Scanline */}
                <div className="absolute left-0 right-0 h-[2px] bg-[#000000]/10 top-0 pointer-events-none z-10 scanline-animate" />

                {/* Image label top — fade in */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.65 }}
                  className="absolute top-2 left-4 text-[7px] text-neutral-400 tracking-widest uppercase z-10"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {t.hero.imageLabelTop}
                </motion.div>

                {/* Logo */}
                <div className="w-full h-full bg-neutral-50 rounded-sm flex items-center justify-center p-6 overflow-hidden relative border border-neutral-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)] pointer-events-none" />
                  <Image
                    src="/images/mizora-logo.png"
                    alt="Mizora KZN Logo"
                    width={500}
                    height={500}
                    priority
                    className="w-full h-full object-contain relative z-10"
                    style={{ maxHeight: '320px' }}
                  />
                </div>

                {/* Image label bottom — fade in */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.2, delay: 0.72 }}
                  className="absolute bottom-3 left-3 right-3 p-2 bg-white/95 border border-neutral-200 rounded-xs flex items-center justify-between text-[7.5px] text-neutral-500 tracking-wider shadow-sm z-10"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#0A0A0A] sci-fi-pulse" />
                    {t.hero.imageLabelBottom}
                  </span>
                  <span className="text-black font-extrabold">ACTIVE</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── F5 — 3D EMBEDDED HUD DATA STRIP (Parallax Layer: closest) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 1.2, ease: easeOut }}
          className="relative mt-20"
          style={{ perspective: '1400px', y: parallaxTicker }}
        >
          {/* ─── Outer Bezel — Premium Raised 3D Frame ─── */}
          <div
            className="relative rounded-md overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #E8E8EC 0%, #D8D8DD 40%, #CDCDD3 100%)',
              border: '1.5px solid rgba(0,0,0,0.12)',
              boxShadow:
                '0 -1px 0 rgba(255,255,255,0.7) inset, 0 1px 0 rgba(0,0,0,0.15) inset, 0 2px 0 rgba(255,255,255,0.5), 0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06), 0 12px 36px rgba(0,0,0,0.04)',
              transform: 'rotateX(1.2deg)',
              transformOrigin: 'center top',
              padding: '4px',
            }}
          >
            {/* ─── Bezel Top Edge — Light reflection strip ─── */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-md"
              style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 70%, transparent 95%)' }}
            />

            {/* Corner accent brackets — Top Left */}
            <span className="absolute top-1 left-1 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-neutral-500/40 z-20" />
            {/* Top Right */}
            <span className="absolute top-1 right-1 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-neutral-500/40 z-20" />
            {/* Bottom Left */}
            <span className="absolute bottom-1 left-1 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-neutral-500/40 z-20" />
            {/* Bottom Right */}
            <span className="absolute bottom-1 right-1 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-neutral-500/40 z-20" />

            {/* Edge glow dots — 4 corners (larger, brighter) */}
            <span className="absolute top-2 left-2 w-[5px] h-[5px] rounded-full bg-neutral-800/30 z-20 shadow-[0_0_6px_rgba(0,0,0,0.15)]" />
            <span className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-neutral-800/30 z-20 shadow-[0_0_6px_rgba(0,0,0,0.15)]" />
            <span className="absolute bottom-2 left-2 w-[5px] h-[5px] rounded-full bg-neutral-800/30 z-20 shadow-[0_0_6px_rgba(0,0,0,0.15)]" />
            <span className="absolute bottom-2 right-2 w-[5px] h-[5px] rounded-full bg-neutral-800/30 z-20 shadow-[0_0_6px_rgba(0,0,0,0.15)]" />

            {/* ─── Recessed Inner Panel — Deep inset with pronounced depth ─── */}
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #F4F4F7 0%, #EAEAEE 100%)',
                boxShadow:
                  'inset 0 2px 6px rgba(0,0,0,0.1), inset 0 -1px 0 rgba(255,255,255,0.6), inset 0 1px 0 rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >

              {/* ─── ROW 1 — System Status Bar (Cycling with MHOSOQ) ─── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                className="flex items-center justify-between px-5 py-3 border-b border-neutral-300/50"
              >
                <div className="flex items-center gap-3">
                  {/* Live pulse dot — larger */}
                  <span className="relative flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#0A0A0A] shrink-0" />
                    <span className="absolute w-2 h-2 rounded-full bg-[#0A0A0A] sci-fi-pulse shrink-0" />
                  </span>
                  <span
                    className="text-[10px] text-neutral-900 font-extrabold tracking-[0.2em] uppercase"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    LIVE
                  </span>
                  {/* System abbreviation with MHOSOQ font — cycling animation */}
                  <span
                    className={`text-[9px] tracking-[0.18em] uppercase font-bold ml-1 transition-all duration-200 ${systemGlitching ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
                    style={{ fontFamily: 'var(--font-mhosoc), "Orbitron", "JetBrains Mono", monospace', color: '#0A0A0A' }}
                  >
                    {SYSTEMS[activeSystemIdx]}
                  </span>
                  <span
                    className="text-[8.5px] text-neutral-500 tracking-[0.15em] uppercase font-bold"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    _STATUS: ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Segmented dots — progress indicator matching system index */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={`sys-dot-${i}`}
                      className={`w-[3px] h-[3px] rounded-full transition-all duration-300 ${i <= activeSystemIdx ? 'bg-neutral-700' : 'bg-neutral-300'}`}
                    />
                  ))}
                  <span
                    className="text-[9px] text-neutral-600 tracking-[0.18em] uppercase font-extrabold"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    OK
                  </span>
                </div>
              </motion.div>

              {/* ─── ROW 2 — Client Marquee Ticker (spacious, readable) ─── */}
              <div className="relative py-5 px-5">
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.3, delay: 1.35 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <span className="w-[5px] h-[5px] rounded-full bg-neutral-400 sci-fi-pulse shrink-0" />
                  <span
                    className="text-[9px] text-neutral-500 tracking-[0.22em] uppercase font-bold"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    {t.hero.trustedBy}
                  </span>
                  <span className="flex-1 h-[1px] bg-neutral-300/50" />
                </motion.div>

                <div
                  className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)' }}
                  onMouseEnter={() => { setIsPaused(true); setTagPaused(true); }}
                  onMouseLeave={() => { setIsPaused(false); setTagPaused(false); }}
                >
                  <div
                    ref={tickerRef}
                    className="flex items-center gap-10 whitespace-nowrap will-change-transform"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                  >
                    {repeatedItems.map((item, idx) => (
                      <span
                        key={`client-${idx}`}
                        className="font-sans font-black text-base md:text-lg text-neutral-600 uppercase tracking-[0.18em] hover:text-black transition-colors duration-300 shrink-0"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── Divider between ROW 2 and ROW 3 ─── */}
              <div className="mx-5 h-[1px] bg-neutral-300/40" />

              {/* ─── ROW 3 — Tag Stream (slower parallax, bigger text) ─── */}
              <div className="relative py-4 px-5">
                <div
                  className="relative overflow-hidden select-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)' }}
                >
                  <div
                    ref={tagRef}
                    className="flex items-center gap-5 whitespace-nowrap will-change-transform"
                  >
                    {repeatedTags.map((tag, idx) => (
                      <span
                        key={`tag-${idx}`}
                        className="inline-flex items-center gap-2 text-[9px] text-neutral-500 uppercase tracking-[0.16em] font-bold shrink-0"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        <span className="w-[5px] h-[1px] bg-neutral-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── H9 — Notched Bottom Edge ─── */}
              <div className="relative h-[8px] border-t border-neutral-300/40">
                <div className="absolute inset-x-0 top-0 flex items-center">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={`notch-${i}`}
                      className="flex-1 h-[4px] border-r border-neutral-400/30"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Bezel Bottom Edge — Shadow strip ─── */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-md"
              style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 70%, transparent 95%)' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
