'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal, ArrowRight, XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Cpu,
  EyeOff, Shuffle, RefreshCw, Activity, UserX, FileX, TrendingDown,
  Search, Compass, ListChecks, Shield, FileCheck, BarChart3, Rocket,
  LucideIcon, Layers, TrendingUp, Zap, CircleCheck, CircleX, GitBranch,
  ChevronRight, CircleDot,
} from 'lucide-react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface WorkflowSectionProps {
  t: TranslationSet;
  lang: Language;
}

// ─── Mono helper ───
function Mono({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={{ fontFamily: '"JetBrains Mono", monospace', ...style }}>
      {children}
    </span>
  );
}

// ─── Item-level icons for each terminal line ───
const LEFT_ICONS: LucideIcon[] = [EyeOff, Shuffle, RefreshCw, Activity, UserX, FileX, TrendingDown];
const RIGHT_ICONS: LucideIcon[] = [Search, Compass, ListChecks, Shield, FileCheck, BarChart3, Rocket];

// ─── Terminal Data ───
const TERMINAL_LEFT = {
  title: 'TANPA STRUKTUR',
  filename: 'unstructured.log',
  status: 'UNSTABLE',
  exitCode: 'ERR_UNSPECIFIED',
  items: [
    'Tujuan tidak jelas',
    'Proses berubah-ubah',
    'Revisi berlebihan',
    'Sulit dipantau',
    'Bergantung pada individu',
    'Tidak terdokumentasi',
    'Sulit dikembangkan',
  ],
};

const TERMINAL_RIGHT = {
  title: 'DENGAN STRUKTUR',
  filename: 'structured.log',
  status: 'OPERATIONAL',
  exitCode: 'OK_COMPLETE',
  items: [
    'Analisis kebutuhan',
    'Perencanaan yang jelas',
    'Workflow terorganisir',
    'Validasi bertahap',
    'Dokumentasi lengkap',
    'Hasil lebih konsisten',
    'Fondasi siap berkembang',
  ],
};

// ─── Scroll-triggered Typing Line ───
function TypingLine({
  text,
  delay,
  symbol,
  symbolColor,
  lineNum,
  icon: Icon,
  isInView,
  isHovered,
}: {
  text: string;
  delay: number;
  symbol: string;
  symbolColor: string;
  lineNum: number;
  icon: LucideIcon;
  isInView: boolean;
  isHovered: boolean;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  // RAF-based typewriter animation
  useEffect(() => {
    if (!isInView) return;
    const startMs = performance.now() + delay;
    const charInterval = 22;
    let rafId: number;
    let lastCharCount = 0;

    const tick = (now: number) => {
      const elapsed = now - startMs;
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const charCount = Math.min(Math.floor(elapsed / charInterval), text.length);
      if (charCount !== lastCharCount) {
        lastCharCount = charCount;
        setDisplayed(text.slice(0, charCount));
        if (charCount >= text.length) {
          setDone(true);
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, delay, text]);

  return (
    <motion.div
      className="flex items-center gap-2.5 sm:gap-3 leading-[2] group/line cursor-default"
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: delay / 1000 * 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Line number */}
      <span className="text-white/10 text-[9px] sm:text-[10px] w-4 sm:w-5 text-right shrink-0 select-none">
        {String(lineNum).padStart(2, '0')}
      </span>

      {/* Symbol */}
      <span className="text-[11px] sm:text-[12px] font-bold shrink-0" style={{ color: symbolColor }}>
        {symbol}
      </span>

      {/* Icon — appears after line typed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={done ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
        className="shrink-0"
      >
        <Icon
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-200"
          style={{ color: isHovered ? symbolColor : `${symbolColor}80` }}
        />
      </motion.div>

      {/* Text */}
      <span
        className="text-[11px] sm:text-[12px] transition-colors duration-200"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.75)',
        }}
      >
        {displayed}
        {isInView && !done && (
          <span
            className="inline-block w-[5px] h-[12px] ml-0.5 align-middle"
            style={{ background: symbolColor, animation: 'cmd-cursor-blink 0.55s step-end infinite' }}
          />
        )}
      </span>
    </motion.div>
  );
}

// ─── 3D Terminal Card Component ───
function TerminalCard({
  data,
  variant,
  index,
  icons,
}: {
  data: typeof TERMINAL_LEFT;
  variant: 'danger' | 'success';
  index: number;
  icons: LucideIcon[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const [isHovered, setIsHovered] = useState(false);

  // ─── 3D Tilt on mouse move ───
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const isDanger = variant === 'danger';
  const accentColor = isDanger ? '#ef4444' : '#10b981';
  const accentDim = isDanger ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.18)';
  const accentGlow = isDanger ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)';
  const accentGlowStrong = isDanger ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)';
  const dotColor = isDanger ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <ScrollReveal yOffset={40} delay={index * 0.15}>
      <div className="term-perspective" style={{ perspective: '1200px' }}>
        <motion.div
          ref={cardRef}
          className="term-card relative overflow-hidden rounded-[12px] border cursor-default"
          style={{
            background: 'linear-gradient(180deg, #0C0C0C 0%, #101010 30%, #0C0C0C 70%, #0A0A0A 100%)',
            borderColor: isDanger ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.18)',
            boxShadow: `
              0 2px 4px rgba(0,0,0,0.4),
              0 8px 24px rgba(0,0,0,0.35),
              0 24px 56px ${accentGlow},
              0 0 80px ${accentGlow},
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(0,0,0,0.6)
            `,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          whileHover={{
            borderColor: isDanger ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)',
            boxShadow: `
              0 4px 8px rgba(0,0,0,0.45),
              0 16px 40px rgba(0,0,0,0.4),
              0 32px 72px ${accentDim},
              0 0 100px ${accentGlowStrong},
              inset 0 1px 0 rgba(255,255,255,0.07),
              inset 0 -1px 0 rgba(0,0,0,0.6)
            `,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ═══ Terminal Title Bar ═══ */}
          <div
            className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 relative"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
              borderBottom: `1px solid ${isDanger ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`,
            }}
          >
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-red-500/80" />
              <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-yellow-500/70" />
              <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-emerald-500/70" />
            </div>

            {/* Terminal title */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Mono className="text-[9px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.12em] uppercase font-bold truncate" style={{ color: accentColor }}>
                {data.title}
              </Mono>
              <span className="text-white/8 text-[7px] hidden sm:inline">—</span>
              <Mono className="text-[7px] sm:text-[8px] text-white/20 tracking-[0.08em] hidden sm:inline">
                {data.filename}
              </Mono>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} style={{ animation: isDanger ? 'term-pulse-red 2s ease-in-out infinite' : 'term-pulse-green 2s ease-in-out infinite' }} />
              <Mono className="text-[7px] sm:text-[8px] tracking-[0.1em] uppercase font-bold" style={{ color: accentColor, opacity: 0.75 }}>
                {data.status}
              </Mono>
            </div>
          </div>

          {/* ═══ Progress Bar — Visual Metric ═══ */}
          <div className="px-3.5 sm:px-4 pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <Mono className="text-[7px] sm:text-[8px] text-white/20 tracking-[0.12em] uppercase font-bold">
                {isDanger ? 'COMPLETION_RATE' : 'COMPLETION_RATE'}
              </Mono>
              <Mono className="text-[8px] sm:text-[9px] font-bold" style={{ color: accentColor }}>
                {isDanger ? '23%' : '94%'}
              </Mono>
            </div>
            <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)` }}
                initial={{ width: 0 }}
                animate={isInView ? { width: isDanger ? '23%' : '94%' } : { width: 0 }}
                transition={{ duration: 1.5, delay: 0.8 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* ═══ Terminal Body ═══ */}
          <div className="relative px-3.5 sm:px-4 py-4 overflow-hidden">
            {/* Scanline overlay */}
            <div className="term-scanline" />

            {/* SVG noise texture */}
            <div
              className="absolute inset-0 pointer-events-none z-[1] opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
              }}
            />

            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none z-[2] rounded-[6px]"
              style={{ boxShadow: `inset 0 0 50px ${accentGlow}, inset 0 0 100px rgba(0,0,0,0.2)` }}
            />

            {/* Content */}
            <div className="relative z-[5]">
              {/* Header comment */}
              <div className="flex items-center gap-2 mb-3 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-white/20 text-[10px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>#</span>
                <Mono className="text-[8px] sm:text-[9px] text-white/20 tracking-[0.08em] uppercase font-bold">
                  {isDanger ? '⚠ UNSTRUCTURED OUTPUT LOG' : '✓ STRUCTURED OUTPUT LOG'}
                </Mono>
              </div>

              {/* Typed lines with icons */}
              <div className="flex flex-col">
                {data.items.map((item, i) => (
                  <TypingLine
                    key={i}
                    text={item}
                    delay={400 + i * 280 + index * 200}
                    symbol={isDanger ? '✕' : '✓'}
                    symbolColor={accentColor}
                    lineNum={i + 1}
                    icon={icons[i]}
                    isInView={isInView}
                    isHovered={isHovered}
                  />
                ))}
              </div>

              {/* Blinking cursor at end */}
              <div className="flex items-center gap-2 mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-emerald-500 text-[10px] sm:text-[11px] font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>$</span>
                <span
                  className="inline-block w-[7px] h-[13px] bg-white/35"
                  style={{ animation: 'cmd-cursor-blink 0.65s step-end infinite' }}
                />
                <span className="flex-1" />
                <Mono className="text-[6px] sm:text-[7px] text-white/12 tracking-[0.12em] uppercase font-bold">
                  EXIT: {data.exitCode}
                </Mono>
              </div>
            </div>
          </div>

          {/* ═══ Terminal Footer — Status Bar ═══ */}
          <div
            className="flex items-center justify-between px-3.5 sm:px-4 py-2 relative"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
              borderTop: `1px solid ${isDanger ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}`,
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                {isDanger ? (
                  <AlertTriangle className="w-3 h-3 text-red-500/50" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                )}
                <Mono className="text-[7px] sm:text-[8px] text-white/25 tracking-[0.1em] uppercase font-bold">
                  {isDanger ? 'RISK: HIGH' : 'RISK: LOW'}
                </Mono>
              </div>
              <div className="w-px h-3 bg-white/[0.06]" />
              <Mono className="text-[7px] sm:text-[8px] text-white/18 tracking-[0.08em] uppercase font-bold">
                {isDanger ? '7 ISSUES' : '7 PASSED'}
              </Mono>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Cpu className="w-2.5 h-2.5 text-white/10" />
              <Mono className="text-[6px] sm:text-[7px] text-white/12 tracking-[0.08em] uppercase font-bold">
                PID_{isDanger ? '404' : '200'}
              </Mono>
            </div>
          </div>

          {/* Corner brackets */}
          <span className="cmd-corner cmd-corner-tl" style={{ zIndex: 6, borderColor: isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }} />
          <span className="cmd-corner cmd-corner-tr" style={{ zIndex: 6, borderColor: isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }} />
          <span className="cmd-corner cmd-corner-bl" style={{ zIndex: 6, borderColor: isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }} />
          <span className="cmd-corner cmd-corner-br" style={{ zIndex: 6, borderColor: isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }} />

          {/* Left accent bar */}
          <div
            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-sm z-[7] transition-opacity duration-300"
            style={{
              background: `linear-gradient(180deg, transparent 5%, ${accentColor} 30%, ${accentColor} 70%, transparent 95%)`,
              opacity: isHovered ? 0.7 : 0.35,
            }}
          />

          {/* 3D Depth layers — top light reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-[8] rounded-[12px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.05) 100%)',
            }}
          />
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const durationMs = duration * 1000;
    let rafId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      setCount(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════
// PREMIUM 9/10+ WIDGET CARDS
// ══════════════════════════════════════════════════════════════

// ─── Mini Sparkline SVG (animated) ───
function MiniSparkline({ data, color, width = 64, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <motion.polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-fill-${color.replace('#','')})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* End dot */}
      <motion.circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 1.2 }}
      />
    </svg>
  );
}

// ─── Circular Progress Ring ───
function ProgressRing({ percent, color, size = 44, strokeWidth = 3 }: { percent: number; color: string; size?: number; strokeWidth?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={inView ? { strokeDashoffset: offset } : {}}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Glow dot at end */}
      <motion.circle
        cx={size / 2}
        cy={size / 2 - radius}
        r="2.5"
        fill={color}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 1, 0.6] } : {}}
        transition={{ duration: 0.4, delay: 1.8 }}
      />
    </svg>
  );
}

// ─── Premium Metric Widget Card ───
function MetricWidget({
  label,
  icon: Icon,
  color,
  delay = 0,
  children,
}: {
  label: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScrollReveal yOffset={20} delay={delay}>
      <motion.div
        className="relative overflow-hidden rounded-[10px] border cursor-default group"
        style={{
          background: 'linear-gradient(145deg, #FAFAFA 0%, #F5F5F7 50%, #F0F0F3 100%)',
          borderColor: isHovered ? `${color}30` : 'rgba(0,0,0,0.06)',
          boxShadow: isHovered
            ? `0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px ${color}12`
            : '0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, ${color}, ${color}60, transparent)`,
            opacity: isHovered ? 0.8 : 0.3,
          }}
        />

        {/* Holo shimmer on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background: `linear-gradient(105deg, transparent 30%, ${color}08 45%, rgba(255,255,255,0.15) 50%, ${color}08 55%, transparent 70%)`,
          }}
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Content */}
        <div className="relative z-[5] p-4 sm:p-5">
          {/* Header row: icon + label */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                background: isHovered ? `${color}12` : `${color}08`,
                boxShadow: isHovered ? `0 0 12px ${color}15` : 'none',
              }}
            >
              <Icon
                className="w-3 h-3 transition-colors duration-300"
                style={{ color: isHovered ? color : `${color}99` }}
              />
            </div>
            <Mono className="text-[7px] sm:text-[8px] tracking-[0.15em] uppercase font-bold text-neutral-400">
              {label}
            </Mono>
          </div>

          {/* Body */}
          {children}
        </div>

        {/* Corner accent — bottom right */}
        <div
          className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 100% 100%, ${color}08, transparent 70%)`,
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Status Indicator Widget ───
function StatusWidget({ delay = 0 }: { delay?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScrollReveal yOffset={20} delay={delay}>
      <motion.div
        className="relative overflow-hidden rounded-[10px] border cursor-default group"
        style={{
          background: 'linear-gradient(145deg, #FAFAFA 0%, #F5F5F7 50%, #F0F0F3 100%)',
          borderColor: isHovered ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.06)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(16,185,129,0.08)'
            : '0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), rgba(16,185,129,0.9), rgba(16,185,129,0.5), transparent)',
            opacity: isHovered ? 0.8 : 0.3,
          }}
        />

        {/* Content */}
        <div className="relative z-[5] p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                background: isHovered ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)',
                boxShadow: isHovered ? '0 0 12px rgba(16,185,129,0.12)' : 'none',
              }}
            >
              <ShieldCheck
                className="w-3 h-3 transition-colors duration-300"
                style={{ color: isHovered ? '#10b981' : 'rgba(16,185,129,0.7)' }}
              />
            </div>
            <Mono className="text-[7px] sm:text-[8px] tracking-[0.15em] uppercase font-bold text-neutral-400">STATUS</Mono>
          </div>

          {/* Status display */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <span
                className="w-3 h-3 rounded-full bg-emerald-500 block"
                style={{ animation: 'term-pulse-green 2s ease-in-out infinite' }}
              />
              <span
                className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500/30"
                style={{ animation: 'widget-pulse-ring 2s ease-out infinite' }}
              />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-black font-sans uppercase tracking-wider block leading-tight">
                Structured
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Preferred
              </span>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div
          className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 100% 100%, rgba(16,185,129,0.06), transparent 70%)',
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Flow Pipeline Widget (UNSTRUCTURED → STRUCTURED) ───
function FlowPipelineWidget({ delay = 0 }: { delay?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScrollReveal yOffset={15} delay={delay}>
      <motion.div
        className="relative overflow-hidden rounded-[10px] border cursor-default"
        style={{
          background: 'linear-gradient(145deg, #FAFAFA 0%, #F5F5F7 50%, #F0F0F3 100%)',
          borderColor: isHovered ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)',
          boxShadow: isHovered
            ? '0 6px 20px rgba(0,0,0,0.05), 0 0 0 1px rgba(16,185,129,0.06)'
            : '0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative z-[5] px-5 py-3.5">
          <div className="flex items-center justify-between gap-3">
            {/* UNSTRUCTURED */}
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <CircleX className="w-4 h-4 text-red-400/70" />
              </div>
              <Mono className="text-[8px] sm:text-[9px] tracking-[0.12em] uppercase font-bold text-red-400/80">UNSTRUCTURED</Mono>
            </div>

            {/* Arrow pipeline */}
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <div className="h-px flex-1 bg-gradient-to-r from-red-200/50 via-neutral-200/30 to-transparent" />
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50" />
              </motion.div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200/30 to-emerald-200/50" />
            </div>

            {/* STRUCTURED */}
            <div className="flex items-center gap-2">
              <Mono className="text-[8px] sm:text-[9px] tracking-[0.12em] uppercase font-bold text-emerald-500/80">STRUCTURED</Mono>
              <div className="relative shrink-0">
                <CircleCheck className="w-4 h-4 text-emerald-500/70" />
              </div>
            </div>
          </div>

          {/* PIPELINE.OPTIMIZED badge */}
          <div className="flex items-center justify-center mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-1.5">
              <Zap className="w-2.5 h-2.5 text-emerald-500/50" />
              <Mono className="text-[6px] sm:text-[7px] tracking-[0.15em] uppercase font-bold text-emerald-600/50">
                PIPELINE.OPTIMIZED
              </Mono>
              <motion.span
                className="w-1 h-1 rounded-full bg-emerald-500/60"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Main Component ───
export default function WorkflowSection({ t, lang }: WorkflowSectionProps) {
  return (
    <section id="workflow" className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#ECECF0' }}>

      {/* ═══ FUD SCI-FI DECORATIVE ELEMENTS ═══ */}

      {/* Top edge */}
      <div className="cmd-section-edge" />

      {/* Dot grid */}
      <div className="absolute inset-0 cmd-dot-grid pointer-events-none" />

      {/* Radial glow */}
      <div className="cmd-radial-glow" />

      {/* Top radial accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)' }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(236,236,240,0.9), transparent)' }}
      />

      {/* Side accent lines */}
      <div className="absolute top-28 left-6 md:left-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />
      <div className="absolute top-28 right-6 md:right-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />

      {/* Left binary markers */}
      <div className="absolute left-10 md:left-20 top-[40%] pointer-events-none hidden lg:flex flex-col items-center gap-5">
        {[0, 1, 1, 0, 1, 0].map((bit, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${bit ? 'bg-emerald-500/40' : 'bg-neutral-300/30'}`} />
            <Mono className="text-[6px] tracking-[0.2em] font-bold text-neutral-400/40">{String(bit)}</Mono>
          </div>
        ))}
      </div>

      {/* Right pipeline connector */}
      <div className="absolute right-10 md:right-20 top-[35%] pointer-events-none hidden lg:flex flex-col items-center gap-0">
        <div className="w-px h-6 bg-black/10" />
        <div className="w-1.5 h-1.5 rotate-45 border border-black/12" />
        <div className="w-px h-12 bg-gradient-to-b from-black/8 to-emerald-500/15" />
        <Terminal className="w-3 h-3 text-emerald-500/25 mb-2" />
        <div className="w-px h-8 bg-emerald-500/10" />
        <div className="w-1 h-1 rounded-full bg-emerald-500/20" />
      </div>

      {/* Floating corner brackets */}
      <div className="absolute top-20 left-8 md:left-16 pointer-events-none hidden lg:block">
        <div className="w-6 h-6 border-l-2 border-t-2 border-black/10 rounded-tl-sm" />
      </div>
      <div className="absolute bottom-20 right-8 md:right-16 pointer-events-none hidden lg:block">
        <div className="w-6 h-6 border-r-2 border-b-2 border-black/10 rounded-br-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ═══ SECTION HEADER ═══ */}
        <ScrollReveal yOffset={30} delay={0}>
          <div className="mb-14 md:mb-18">
            {/* Terminal command line */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-emerald-600 text-[12px] font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>&gt;</span>
              <Mono className="text-[10px] text-black tracking-[0.2em] uppercase font-bold">
                SECTOR_03 // PRODUCTION PIPELINE
              </Mono>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-black via-black/70 to-black/10" />
              <Mono className="text-[9px] text-emerald-600/70 tracking-[0.2em] uppercase font-bold">2 PHASES</Mono>
              <span className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1" style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }} />
            </div>

            {/* Headline */}
            <h2 className="font-display font-black text-[2.8rem] md:text-7xl text-black tracking-tight mb-0 leading-[0.92]">
              <span className="block uppercase">PERBEDAAN</span>
            </h2>
            <div className="cmd-headline-line max-w-[200px]" />

            {/* Description */}
            <p className="font-sans font-medium text-sm md:text-base text-neutral-500 leading-relaxed max-w-3xl mt-5">
              {lang === 'id'
                ? 'Setiap proyek dikerjakan melalui proses yang jelas dan terukur untuk memastikan hasil yang lebih terarah, efisien, dan sesuai kebutuhan.'
                : t.workflow.subtitle
              }
            </p>

            {/* Micro decoration */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className={`w-[4px] h-[4px] rounded-full ${i < 4 ? 'bg-emerald-500/70' : 'bg-neutral-300/60'}`} />
                ))}
              </div>
              <Mono className="text-[7px] text-neutral-400 tracking-[0.2em] uppercase font-bold">PIPELINE.READY // V3.1.0</Mono>
              <span className="flex-1 h-px bg-neutral-200/50" />
              <Mono className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold">● ACTIVE</Mono>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ DUAL TERMINAL CARDS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <TerminalCard data={TERMINAL_LEFT} variant="danger" index={0} icons={LEFT_ICONS} />
          <TerminalCard data={TERMINAL_RIGHT} variant="success" index={1} icons={RIGHT_ICONS} />
        </div>

        {/* ═══ VS Divider ═══ */}
        <ScrollReveal yOffset={15} delay={0.2}>
          <div className="flex items-center justify-center mt-8 md:mt-10 gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent" />
            <div className="flex items-center gap-2.5">
              <XCircle className="w-3.5 h-3.5 text-red-400/40" />
              <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-neutral-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>VS</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/40" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent" />
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            PREMIUM METRICS STRIP — 9/10+ WIDGET CARDS
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">

          {/* ─── STRUCTURE_DELTA ─── */}
          <MetricWidget
            label="STRUCTURE_DELTA"
            icon={GitBranch}
            color="#10b981"
            delay={0}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-[28px] font-black text-black font-sans leading-none">
                    +<AnimatedCounter target={7} />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Optimizations
                  </span>
                </div>
                {/* Mini bar indicators */}
                <div className="flex items-center gap-1 mt-2.5">
                  {[35, 50, 42, 65, 78, 88, 94].map((val, i) => (
                    <motion.div
                      key={i}
                      className="h-[14px] rounded-[2px] flex-1 min-w-0"
                      style={{
                        background: i < 3
                          ? 'rgba(239,68,68,0.15)'
                          : `rgba(16,185,129,${0.15 + (val / 100) * 0.35})`,
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.div
                        className="w-full rounded-[2px]"
                        style={{
                          height: `${val}%`,
                          background: i < 3
                            ? 'rgba(239,68,68,0.4)'
                            : `rgba(16,185,129,${0.3 + (val / 100) * 0.5})`,
                          marginTop: `${100 - val}%`,
                        }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Mini sparkline */}
              <MiniSparkline data={[20, 35, 28, 50, 65, 78, 94]} color="#10b981" />
            </div>
          </MetricWidget>

          {/* ─── RISK_REDUCTION ─── */}
          <MetricWidget
            label="RISK_REDUCTION"
            icon={TrendingDown}
            color="#10b981"
            delay={0.08}
          >
            <div className="flex items-center gap-4">
              {/* Progress ring */}
              <ProgressRing percent={84} color="#10b981" size={52} strokeWidth={3.5} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-[28px] font-black text-black font-sans leading-none">
                    ▼ <AnimatedCounter target={84} suffix="%" />
                  </span>
                </div>
                {/* Risk scale */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <Mono className="text-[6px] tracking-[0.1em] uppercase font-bold text-red-400/60">HIGH RISK</Mono>
                    <Mono className="text-[6px] tracking-[0.1em] uppercase font-bold text-emerald-500/60">LOW RISK</Mono>
                  </div>
                  <div className="h-[3px] rounded-full bg-gradient-to-r from-red-400/20 via-yellow-400/15 to-emerald-400/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #ef4444, #eab308, #10b981)',
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: '84%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </MetricWidget>

          {/* ─── STATUS ─── */}
          <StatusWidget delay={0.16} />
        </div>

        {/* ═══ FLOW PIPELINE INDICATOR ═══ */}
        <FlowPipelineWidget delay={0.24} />
      </div>
    </section>
  );
}
