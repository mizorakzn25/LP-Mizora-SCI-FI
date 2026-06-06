'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search, FileText, Code2, CheckSquare, Rocket,
  FolderOpen, ChevronRight, Lock, RotateCw,
  AlertTriangle, CheckCircle2, Cpu, Terminal as TerminalIcon,
  ArrowRight, Zap,
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface ImplementationSectionProps {
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

// ─── Display helper (Orbitron) ───
function Display({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace', ...style }}>
      {children}
    </span>
  );
}

// ─── Phase Data ───
interface PhaseData {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  description: string;
  checklist: string[];
  warning: string | null;
  badges: string[];
  icon: React.ElementType;
  previewColor: string;
  phaseNum: string;
  progress: number;
  scopeItems: string[];
  features: string[];
  targetMetric: string;
}

const PHASES: PhaseData[] = [
  {
    id: 'discovery',
    filename: '01_DISCOVERY.tsx',
    title: 'DISCOVERY',
    subtitle: 'KONSULTASI & ANALISIS KEBUTUHAN',
    description: 'Memahami kebutuhan, tujuan, dan tantangan proyek melalui diskusi awal sebagai dasar perencanaan.',
    checklist: ['Diskusi kebutuhan proyek', 'Identifikasi tantangan utama', 'Analisis tujuan dan prioritas'],
    warning: null,
    badges: ['Ringkasan Kebutuhan'],
    icon: Search,
    previewColor: '#10b981',
    phaseNum: 'PH-01',
    progress: 72,
    scopeItems: ['Analisis kebutuhan klien', 'Identifikasi tantangan', 'Pemetaan tujuan proyek'],
    features: ['Konsultasi awal', 'Studi kelayakan', 'Dokumentasi kebutuhan'],
    targetMetric: 'KEBUTUHAN TERDEFINISI',
  },
  {
    id: 'planning',
    filename: '02_PLANNING.tsx',
    title: 'PLANNING',
    subtitle: 'PERENCANAAN & STRUKTUR PROYEK',
    description: 'Menyusun arah pengerjaan, ruang lingkup, serta tahapan implementasi yang akan digunakan selama proyek berlangsung.',
    checklist: ['Penyusunan rencana kerja', 'Perancangan struktur solusi', 'Penyusunan roadmap proyek'],
    warning: 'Rencana dapat disesuaikan apabila terdapat perubahan kebutuhan sebelum tahap implementasi dimulai.',
    badges: ['Rencana Kerja', 'Roadmap Proyek'],
    icon: FileText,
    previewColor: '#10b981',
    phaseNum: 'PH-02',
    progress: 65,
    scopeItems: ['Penyusunan rencana', 'Perancangan arsitektur', 'Roadmap proyek'],
    features: ['Blueprint solusi', 'Timeline proyek', 'Alokasi sumber daya'],
    targetMetric: 'RENCANA TERSTRUKTUR',
  },
  {
    id: 'implementation',
    filename: '03_IMPLEMENTATION.tsx',
    title: 'IMPLEMENTATION',
    subtitle: 'PENGEMBANGAN & PENERAPAN',
    description: 'Melaksanakan proses pengerjaan secara bertahap berdasarkan rencana yang telah disetujui bersama.',
    checklist: ['Implementasi solusi', 'Penyempurnaan bertahap', 'Monitoring progres pengerjaan'],
    warning: null,
    badges: ['Tahap Pengembangan'],
    icon: Code2,
    previewColor: '#10b981',
    phaseNum: 'PH-03',
    progress: 58,
    scopeItems: ['Pengembangan solusi', 'Iterasi & perbaikan', 'Monitoring progres'],
    features: ['Sprint development', 'Code review', 'Progress tracking'],
    targetMetric: 'SOLUSI TERIMPLEMENTASI',
  },
  {
    id: 'validation',
    filename: '04_VALIDATION.tsx',
    title: 'VALIDATION',
    subtitle: 'PENGUJIAN & PENYESUAIAN',
    description: 'Melakukan pemeriksaan dan evaluasi untuk memastikan hasil sesuai dengan kebutuhan serta tujuan proyek.',
    checklist: ['Pemeriksaan hasil', 'Validasi kebutuhan', 'Penyesuaian akhir'],
    warning: null,
    badges: ['Laporan Validasi', 'Hasil Final'],
    icon: CheckSquare,
    previewColor: '#10b981',
    phaseNum: 'PH-04',
    progress: 80,
    scopeItems: ['Pengujian menyeluruh', 'Validasi kebutuhan', 'Penyesuaian akhir'],
    features: ['Quality assurance', 'User acceptance test', 'Bug fixing'],
    targetMetric: 'HASIL TERVALIDASI',
  },
  {
    id: 'delivery',
    filename: '05_DELIVERY.tsx',
    title: 'DELIVERY',
    subtitle: 'SERAH TERIMA & DUKUNGAN',
    description: 'Menyerahkan hasil akhir beserta dokumentasi dan panduan agar dapat digunakan dengan lebih mudah dan efektif.',
    checklist: ['Serah terima hasil', 'Dokumentasi pendukung', 'Panduan penggunaan'],
    warning: null,
    badges: ['Dokumentasi', 'Panduan Penggunaan'],
    icon: Rocket,
    previewColor: '#10b981',
    phaseNum: 'PH-05',
    progress: 90,
    scopeItems: ['Serah terima proyek', 'Dokumentasi lengkap', 'Panduan penggunaan'],
    features: ['Deployment', 'Training session', 'Support period'],
    targetMetric: 'PROYEK SELESAI',
  },
];

// ─── Code Lines Generator (memoized) ───
function generateCodeLines(phase: PhaseData): { text: string; type: 'comment' | 'keyword' | 'property' | 'string' | 'symbol' | 'check' | 'badge' | 'warning' }[] {
  const lines: { text: string; type: 'comment' | 'keyword' | 'property' | 'string' | 'symbol' | 'check' | 'badge' | 'warning' }[] = [];

  lines.push({ text: `// ═══ Phase ${phase.filename.split('_')[0]}: ${phase.title} ═══`, type: 'comment' });
  lines.push({ text: '', type: 'symbol' });
  lines.push({ text: 'const', type: 'keyword' });
  lines.push({ text: `  ${phase.id}`, type: 'property' });
  lines.push({ text: '  = {', type: 'symbol' });
  lines.push({ text: '', type: 'symbol' });
  lines.push({ text: `  title:`, type: 'property' });
  lines.push({ text: `    "${phase.subtitle}",`, type: 'string' });
  lines.push({ text: '', type: 'symbol' });
  lines.push({ text: `  description:`, type: 'property' });
  lines.push({ text: `    "${phase.description}",`, type: 'string' });
  lines.push({ text: '', type: 'symbol' });
  lines.push({ text: `  checklist: [`, type: 'property' });
  phase.checklist.forEach((item, i) => {
    lines.push({ text: `    ✓ "${item}"${i < phase.checklist.length - 1 ? ',' : ''}`, type: 'check' });
  });
  lines.push({ text: '  ],', type: 'symbol' });
  lines.push({ text: '', type: 'symbol' });

  if (phase.warning) {
    lines.push({ text: `  warning:`, type: 'property' });
    lines.push({ text: `    "${phase.warning}",`, type: 'warning' });
    lines.push({ text: '', type: 'symbol' });
  } else {
    lines.push({ text: '  warning: null,', type: 'property' });
    lines.push({ text: '', type: 'symbol' });
  }

  lines.push({ text: `  badges: [`, type: 'property' });
  phase.badges.forEach((badge, i) => {
    lines.push({ text: `    "${badge}"${i < phase.badges.length - 1 ? ',' : ''}`, type: 'badge' });
  });
  lines.push({ text: '  ],', type: 'symbol' });
  lines.push({ text: '', type: 'symbol' });
  lines.push({ text: '  status: "READY"', type: 'keyword' });
  lines.push({ text: '};', type: 'symbol' });

  return lines;
}

// ─── Syntax color map ───
function getLineColor(type: string): string {
  switch (type) {
    case 'comment': return 'rgba(255,255,255,0.22)';
    case 'keyword': return '#c084fc';
    case 'property': return 'rgba(255,255,255,0.65)';
    case 'string': return '#10b981';
    case 'check': return '#34d399';
    case 'badge': return '#10b981';
    case 'warning': return '#fbbf24';
    case 'symbol': return 'rgba(255,255,255,0.3)';
    default: return 'rgba(255,255,255,0.5)';
  }
}

// ─── Code Line Component ───
function CodeLine({ line, lineNum, isActive, delay }: {
  line: { text: string; type: string };
  lineNum: number;
  isActive: boolean;
  delay: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isActive || !line.text) return;

    const code = line.text;
    const startMs = performance.now() + delay;
    const charInterval = 14;
    let rafId: number;
    let lastCharCount = 0;

    const tick = (now: number) => {
      const elapsed = now - startMs;
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const charCount = Math.min(Math.floor(elapsed / charInterval), code.length);
      if (charCount !== lastCharCount) {
        lastCharCount = charCount;
        setDisplayed(code.slice(0, charCount));
        if (charCount >= code.length) {
          setDone(true);
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, line.text, delay]);

  if (!line.text) return <div className="h-[18px]" />;

  return (
    <div className="flex items-start gap-2 sm:gap-3 leading-[1.7] group/line">
      <span className="text-white/8 text-[8px] sm:text-[9px] w-4 sm:w-5 text-right shrink-0 select-none pt-[1px]">
        {String(lineNum).padStart(2, '0')}
      </span>
      <span
        className="text-[10px] sm:text-[11px] leading-[1.7] break-all"
        style={{ fontFamily: '"JetBrains Mono", monospace', color: getLineColor(line.type) }}
      >
        {displayed}
        {isActive && !done && (
          <span
            className="inline-block w-[4px] h-[11px] ml-px align-middle"
            style={{ background: '#10b981', animation: 'cmd-cursor-blink 0.55s step-end infinite' }}
          />
        )}
      </span>
    </div>
  );
}

// ─── Loading Animation Component (Mizora KZN style) ───
const LOADING_DURATION = 4000; // 4 seconds

function PreviewLoading() {
  const [percentage, setPercentage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Smooth percentage increment (same easing as LoadingScreen)
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setHasStarted(true);
      startTimeRef.current = performance.now();

      const animate = (now: number) => {
        if (!startTimeRef.current) return;
        const elapsed = now - startTimeRef.current;
        const rawProgress = Math.min(elapsed / LOADING_DURATION, 1);
        // Cubic ease-in-out
        const easedProgress = rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
        setPercentage(Math.round(easedProgress * 100));

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(startDelay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Dots animation — use CSS animation instead of setInterval
  const dotsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dotsRef.current;
    if (!el) return;
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 5;
      el.textContent = '.'.repeat(count);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const isComplete = percentage >= 100;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />

      {/* Subtle radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: hasStarted ? 0.06 : 0, scale: 1.2 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3"
        >
          <div
            className={`w-9 h-9 rounded-sm overflow-hidden relative transition-all duration-500 ${isComplete ? 'shadow-[0_0_20px_rgba(255,255,255,0.12)]' : ''}`}
          >
            <Image
              src="/images/mizora-logo.png"
              alt="Mizora KZN"
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1
            className="text-white text-[11px] sm:text-[13px] tracking-[0.35em] font-medium text-center"
            style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
          >
            MIZORA KZN
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"
          />
        </motion.div>

        {/* Percentage Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasStarted ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-3"
        >
          <div className={`relative transition-all duration-500 ${isComplete ? 'scale-105' : ''}`}>
            {isComplete && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                  animation: 'pulse-glow 1s ease-in-out infinite alternate',
                }}
              />
            )}
            <span
              className={`relative text-2xl sm:text-3xl font-bold tracking-wider tabular-nums transition-colors duration-500 ${isComplete ? 'text-white' : 'text-white/90'}`}
              style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
            >
              {percentage.toString().padStart(3, '0')}
            </span>
            <span
              className={`text-sm sm:text-base font-light ml-0.5 transition-colors duration-500 ${isComplete ? 'text-white/50' : 'text-white/30'}`}
              style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
            >
              %
            </span>
          </div>
        </motion.div>

        {/* Progress Bar (left-to-right line) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: hasStarted ? 1 : 0, scaleX: hasStarted ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-[160px] sm:max-w-[200px] origin-center mb-3"
        >
          <div className="relative h-[2px] w-full rounded-full overflow-hidden bg-white/[0.06]">
            {/* Glow behind bar */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[8px] rounded-full transition-[width] duration-100 ease-out"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))',
                filter: 'blur(4px)',
              }}
            />
            {/* Main bar */}
            <div
              className="absolute top-0 left-0 h-full bg-white/80 rounded-full transition-[width] duration-100 ease-out"
              style={{ width: `${percentage}%` }}
            />
            {/* Leading edge highlight */}
            {percentage > 0 && percentage < 100 && (
              <div
                className="absolute top-0 h-full w-2 bg-gradient-to-r from-white/70 to-transparent rounded-full transition-[left] duration-100 ease-out"
                style={{ left: `${percentage}%` }}
              />
            )}
            {/* Complete flash */}
            {isComplete && (
              <div
                className="absolute inset-0 bg-white rounded-full"
                style={{ animation: 'gpu-pulse 0.8s ease-in-out infinite alternate' }}
              />
            )}
          </div>
        </motion.div>

        {/* Loading text with dots */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-[8px] text-emerald-400/60 tracking-[0.15em] uppercase font-bold"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Loading<span ref={dotsRef} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Phase Preview Card (cmd-terminal style matching SOLUSI PENERAPAN) ───
function PhasePreviewCard({ phase, lang }: { phase: PhaseData; lang: Language }) {
  const Icon = phase.icon;

  return (
    <div className="p-2.5 h-full">
      <motion.div
        className="cmd-terminal h-full flex flex-col overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ─── Status Bar (dark header like SOLUSI PENERAPAN) ─── */}
        <div className="cmd-status-bar relative z-[5]">
          <div className="flex items-center justify-between">
            {/* Left: Green pulse + Phase ID */}
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                style={{ animation: 'cmd-status-pulse 2s ease-in-out infinite' }}
              />
              <Display className="text-[8px] tracking-[0.18em] uppercase font-bold text-emerald-400">
                {phase.phaseNum}
              </Display>
            </div>
            {/* Right: OPERATIONAL + Progress */}
            <div className="flex items-center gap-2">
              <Mono className="text-[6px] tracking-[0.1em] uppercase font-bold text-neutral-500">
                OPERATIONAL
              </Mono>
              <div className="cmd-progress" style={{ width: '36px', height: '3px' }}>
                <motion.div
                  className="cmd-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <Mono className="text-[7px] tracking-[0.05em] font-bold text-white">
                {phase.progress}%
              </Mono>
            </div>
          </div>
        </div>

        {/* ─── Card Content (scrollable) ─── */}
        <div className="flex-1 overflow-y-auto cmd-preview-scroll relative z-[5]">
          <div className="p-3.5">
            {/* Icon + Name + Tagline */}
            <div className="flex items-start gap-2.5 mb-3">
              <div className="cmd-icon-oct shrink-0" style={{ width: '32px', height: '32px' }}>
                <Icon className="w-3.5 h-3.5 text-black" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h3 className="font-sans font-black text-[10px] leading-tight tracking-tight text-black uppercase">
                  {phase.title}
                </h3>
                <Mono className="text-[7px] tracking-[0.12em] uppercase font-medium text-neutral-500 block mt-0.5">
                  {phase.subtitle}
                </Mono>
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-neutral-700 text-[9px] leading-relaxed mb-3">
              {phase.description}
            </p>

            {/* Scope + Features grid */}
            <div className="grid grid-cols-1 gap-3 pt-2.5 mb-3 border-t border-neutral-200/80">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                  <Mono className="text-[6px] tracking-[0.2em] uppercase font-bold text-black">
                    {lang === 'id' ? 'LINGKUP UTAMA' : 'DELIVERY SCOPE'}
                  </Mono>
                </div>
                <ul className="flex flex-col gap-1">
                  {phase.scopeItems.map((item, i) => (
                    <li key={i} className="cmd-scope-item">
                      <span className="text-emerald-600 text-[7px] font-bold shrink-0 mt-px" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        →
                      </span>
                      <span className="font-sans text-[8px] text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                  <Mono className="text-[6px] tracking-[0.2em] uppercase font-bold text-black">
                    {lang === 'id' ? 'FITUR OPERASIONAL' : 'OPERATIONAL FEATURES'}
                  </Mono>
                </div>
                <div className="flex flex-col gap-1">
                  {phase.features.map((feature, i) => (
                    <span key={i} className="cmd-feature-chip" style={{ fontSize: '7px', padding: '2px 6px' }}>
                      <span className="text-emerald-500 text-[8px]">◇</span>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="pt-2.5 mb-3 border-t border-neutral-200/80">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckSquare className="w-2.5 h-2.5 text-emerald-600" />
                <Mono className="text-[6px] tracking-[0.2em] uppercase font-bold text-black">
                  {lang === 'id' ? 'CHECKLIST' : 'CHECKLIST'}
                </Mono>
              </div>
              <div className="flex flex-col gap-1">
                {phase.checklist.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 p-1.5 rounded-sm"
                    style={{ background: 'rgba(16,185,129,0.04)', borderLeft: '2px solid rgba(16,185,129,0.3)' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                    <span className="font-sans text-[8px] text-neutral-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Warning */}
            {phase.warning && (
              <motion.div
                className="mb-3 p-2 rounded-sm flex items-start gap-2"
                style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderLeft: '2px solid rgba(251,191,36,0.5)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <AlertTriangle className="w-2.5 h-2.5 text-amber-500/70 shrink-0 mt-px" />
                <span className="font-sans text-[7px] text-neutral-600 leading-relaxed">{phase.warning}</span>
              </motion.div>
            )}

            {/* Badges */}
            <div className="pt-2.5 mb-3 border-t border-neutral-200/80">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-2.5 h-2.5 text-emerald-600" />
                <Mono className="text-[6px] tracking-[0.2em] uppercase font-bold text-black">
                  {lang === 'id' ? 'OUTPUT' : 'OUTPUT'}
                </Mono>
              </div>
              <div className="flex flex-wrap gap-1">
                {phase.badges.map((badge, i) => (
                  <motion.span
                    key={i}
                    className="px-2 py-0.5 rounded-[3px] text-[7px] font-medium"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#059669' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.2 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Target Footer */}
            <div className="cmd-target-bar flex items-center justify-between" style={{ padding: '6px 0 0' }}>
              <div>
                <Mono className="text-[5px] text-neutral-500 uppercase tracking-[0.16em] font-bold block mb-0.5">
                  TARGET OUTCOME
                </Mono>
                <Mono className="text-[7px] font-bold uppercase text-black">
                  {phase.targetMetric}
                </Mono>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-[6px] font-extrabold uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}
              >
                <span>ACTIVE</span>
                <ArrowRight className="w-2 h-2" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───
export default function ImplementationSection({ t, lang }: ImplementationSectionProps) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [terminalMsg, setTerminalMsg] = useState('$ 5 phases loaded. Click file to view →');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePhaseData = useMemo(() => PHASES.find(p => p.id === activePhase) || null, [activePhase]);
  const codeLines = useMemo(() => activePhaseData ? generateCodeLines(activePhaseData) : [], [activePhaseData]);

  const handleFileClick = useCallback((phase: PhaseData) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);

    setActivePhase(phase.id);
    setPreviewLoading(true);
    setTerminalMsg(`$ Opening ${phase.filename}...`);

    // 4-second loading animation (Mizora KZN style)
    loadingTimerRef.current = setTimeout(() => {
      setPreviewLoading(false);
    }, 4000);

    typingTimerRef.current = setTimeout(() => {
      setTerminalMsg(`$ ${phase.filename} opened ● Ready`);
    }, 600);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  return (
    <section id="implementation" className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#ECECF0' }}>

      {/* ═══ FUD SCI-FI DECORATIVE ELEMENTS ═══ */}
      <div className="cmd-section-edge" />
      <div className="absolute inset-0 cmd-dot-grid pointer-events-none" />
      <div className="cmd-radial-glow" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(236,236,240,0.9), transparent)' }}
      />
      <div className="absolute top-28 left-6 md:left-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />
      <div className="absolute top-28 right-6 md:right-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />

      {/* Floating corner brackets */}
      <div className="absolute top-20 left-8 md:left-16 pointer-events-none hidden lg:block">
        <div className="w-6 h-6 border-l-2 border-t-2 border-black/10 rounded-tl-sm" />
      </div>
      <div className="absolute bottom-20 right-8 md:right-16 pointer-events-none hidden lg:block">
        <div className="w-6 h-6 border-r-2 border-b-2 border-black/10 rounded-br-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ═══ SECTION HEADER (OUTSIDE IDE) ═══ */}
        <ScrollReveal yOffset={30} delay={0}>
          <div className="mb-14 md:mb-18">
            {/* Terminal command line */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-emerald-600 text-[12px] font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>&gt;</span>
              <Mono className="text-[10px] text-black tracking-[0.2em] uppercase font-bold">
                SECTOR_04 // IMPLEMENTATION PROCESS
              </Mono>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-black via-black/70 to-black/10" />
              <Mono className="text-[9px] text-emerald-600/70 tracking-[0.2em] uppercase font-bold">5 PHASES</Mono>
              <span className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1" style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }} />
            </div>

            {/* Headline */}
            <h2 className="font-display font-black text-[2.8rem] md:text-7xl text-black tracking-tight mb-0 leading-[0.92]">
              <span className="block uppercase">PELAKSANAAN</span>
              <span className="block uppercase text-[2rem] md:text-5xl mt-1">ALUR PROYEK</span>
            </h2>
            <div className="cmd-headline-line max-w-[200px]" />

            {/* Description */}
            <p className="font-sans font-medium text-sm md:text-base text-neutral-500 leading-relaxed max-w-3xl mt-5">
              {lang === 'id'
                ? 'Setiap proyek dikerjakan melalui tahapan yang jelas dan terstruktur untuk memastikan hasil yang sesuai dengan kebutuhan dan tujuan yang telah disepakati.'
                : 'Every project is carried out through clear and structured stages to ensure results that match the agreed needs and objectives.'
              }
            </p>

            {/* Micro decoration */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className={`w-[4px] h-[4px] rounded-full ${i < 5 ? 'bg-emerald-500/70' : 'bg-neutral-300/60'}`} />
                ))}
              </div>
              <Mono className="text-[7px] text-neutral-400 tracking-[0.2em] uppercase font-bold">IDE.WORKSPACE // V4.0.0</Mono>
              <span className="flex-1 h-px bg-neutral-200/50" />
              <Mono className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold">● ACTIVE</Mono>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ IDE-CENTRIC WORKSPACE ═══ */}
        <ScrollReveal yOffset={40} delay={0.1}>
          <div ref={sectionRef} className="relative overflow-hidden rounded-[12px] border" style={{
            background: 'linear-gradient(180deg, #0C0C0C 0%, #101010 50%, #0C0C0C 100%)',
            borderColor: 'rgba(16,185,129,0.15)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35), 0 0 80px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.6)',
          }}>

            {/* ═══ IDE Title Bar ═══ */}
            <div
              className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 relative"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
                borderBottom: '1px solid rgba(16,185,129,0.12)',
              }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-red-500/80" />
                <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-yellow-500/70" />
                <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <TerminalIcon className="w-3 h-3 text-emerald-500/40 hidden sm:block" />
                <Mono className="text-[8px] sm:text-[9px] text-white/30 tracking-[0.1em] uppercase font-bold truncate">
                  Mizora IDE — Cara Kerja
                </Mono>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'term-pulse-green 2s ease-in-out infinite' }} />
                <Mono className="text-[7px] sm:text-[8px] text-emerald-500/60 tracking-[0.1em] uppercase font-bold">Ready</Mono>
              </div>
            </div>

            {/* ═══ IDE Body ═══ */}
            <div className="flex flex-col lg:flex-row">

              {/* ─── Mobile Tab Bar (shows on < lg) ─── */}
              <div className="lg:hidden flex items-center overflow-x-auto gap-0.5 px-2 pt-2 ide-tabs-scrollable">
                {PHASES.map((phase) => {
                  const Icon = phase.icon;
                  const isActive = activePhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => handleFileClick(phase)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-t-[4px] shrink-0 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white/[0.06] border-b-2 border-emerald-500/60'
                          : 'bg-white/[0.02] hover:bg-white/[0.04] border-b-2 border-transparent'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? 'text-emerald-400/70' : 'text-white/25'}`} />
                      <span className={`text-[8px] tracking-[0.08em] uppercase font-bold ${isActive ? 'text-emerald-400/80' : 'text-white/30'}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {phase.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ─── File Explorer (desktop only) ─── */}
              <div className="hidden lg:flex flex-col w-[140px] xl:w-[160px] shrink-0 border-r border-white/[0.06]" style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
              }}>
                {/* Folder header */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.04]">
                  <FolderOpen className="w-3 h-3 text-emerald-500/40" />
                  <Mono className="text-[7px] text-white/30 tracking-[0.1em] uppercase font-bold">cara-kerja/</Mono>
                </div>

                {/* File items */}
                <div className="flex flex-col py-1">
                  {PHASES.map((phase) => {
                    const Icon = phase.icon;
                    const isActive = activePhase === phase.id;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => handleFileClick(phase)}
                        className={`flex items-center gap-2 px-3 py-2 text-left transition-all duration-150 cursor-pointer group/file ${
                          isActive
                            ? 'bg-emerald-500/[0.06] border-l-2 border-emerald-500/60'
                            : 'border-l-2 border-transparent hover:bg-white/[0.02] hover:border-emerald-500/20'
                        }`}
                      >
                        <Icon className={`w-3 h-3 shrink-0 transition-colors duration-150 ${
                          isActive ? 'text-emerald-400/70' : 'text-white/20 group-hover/file:text-white/35'
                        }`} />
                        <span className={`text-[7px] tracking-[0.06em] font-bold truncate transition-colors duration-150 ${
                          isActive ? 'text-emerald-400/80' : 'text-white/30 group-hover/file:text-white/50'
                        }`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {phase.filename}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ─── Main Content Area ─── */}
              <div className="flex-1 flex flex-col lg:flex-row min-w-0">

                {/* ─── Code Editor ─── */}
                <div className="flex-1 min-w-0 flex flex-col" style={{ flex: '3 1 0%' }}>
                  {/* Tab bar */}
                  <AnimatePresence mode="wait">
                    {activePhaseData && (
                      <motion.div
                        key={activePhaseData.id + '-tab'}
                        className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.04]"
                        style={{ background: 'rgba(255,255,255,0.015)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-[3px] border border-white/[0.06]">
                          <FileText className="w-2.5 h-2.5 text-emerald-500/40" />
                          <Mono className="text-[7px] text-white/50 tracking-[0.06em] font-bold">{activePhaseData.filename}</Mono>
                          <button
                            onClick={() => {
                              setActivePhase(null);
                              setPreviewLoading(false);
                              setTerminalMsg('$ File closed.');
                              if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
                            }}
                            className="ml-1 text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Code content */}
                  <div className="relative flex-1 px-3 sm:px-4 py-4 overflow-hidden">
                    {/* Scanline */}
                    <div className="term-scanline" />

                    {/* Inner glow */}
                    <div
                      className="absolute inset-0 pointer-events-none z-[2]"
                      style={{ boxShadow: 'inset 0 0 40px rgba(16,185,129,0.04), inset 0 0 80px rgba(0,0,0,0.15)' }}
                    />

                    <div className="relative z-[5] overflow-y-auto max-h-[320px] lg:max-h-[400px] ide-code-scroll">
                      {!activePhase ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-emerald-500/30" />
                            <Mono className="text-[9px] text-white/20 tracking-[0.1em] uppercase font-bold">
                              Select a file to view
                            </Mono>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-[5px] h-[11px] bg-emerald-500/30" style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }} />
                          </div>
                          <Mono className="text-[7px] text-white/10 tracking-[0.15em] uppercase font-bold">
                            5 files available in cara-kerja/
                          </Mono>
                        </div>
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activePhaseData!.id + '-code'}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {codeLines.map((line, i) => (
                              <CodeLine
                                key={i}
                                line={line}
                                lineNum={i + 1}
                                isActive={isInView && activePhase !== null}
                                delay={i * 60}
                              />
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>

                {/* ─── Live Preview ─── */}
                <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-white/[0.06]" style={{ flex: '2 1 0%' }}>
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.04]" style={{
                    background: 'rgba(255,255,255,0.015)',
                  }}>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Lock className="w-2.5 h-2.5 text-emerald-500/30" />
                      <RotateCw className={`w-2.5 h-2.5 text-white/15 ${previewLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-white/[0.03] rounded-[3px] px-2 py-0.5 border border-white/[0.04]">
                      <Mono className="text-[6px] sm:text-[7px] text-white/25 tracking-wider truncate">
                        {activePhase ? `localhost:3000/preview/${activePhase}` : 'https://localhost:3000'}
                      </Mono>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="flex-1 min-h-[220px] lg:min-h-0 relative overflow-hidden" style={{
                    background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.03) 0%, transparent 70%)',
                  }}>
                    <AnimatePresence mode="wait">
                      {!activePhase ? (
                        <motion.div
                          key="empty-preview"
                          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center">
                            <ChevronRight className="w-3 h-3 text-white/15" />
                          </div>
                          <Mono className="text-[7px] text-white/12 tracking-[0.12em] uppercase font-bold">
                            No preview
                          </Mono>
                        </motion.div>
                      ) : previewLoading ? (
                        <motion.div
                          key={activePhase + '-loading'}
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <PreviewLoading />
                        </motion.div>
                      ) : activePhaseData ? (
                        <motion.div
                          key={activePhase + '-preview'}
                          className="absolute inset-0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <PhasePreviewCard phase={activePhaseData} lang={lang} />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
                      backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ Terminal Bar ═══ */}
            <div
              className="flex items-center justify-between px-3.5 sm:px-4 py-2 relative"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
                borderTop: '1px solid rgba(16,185,129,0.08)',
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <TerminalIcon className="w-3 h-3 text-emerald-500/30 shrink-0" />
                <Mono className="text-[7px] sm:text-[8px] text-white/25 tracking-[0.06em] font-bold truncate">
                  {terminalMsg}
                </Mono>
                {activePhase && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-emerald-500/50 shrink-0" style={{ animation: 'term-pulse-green 2s ease-in-out infinite' }} />
                    <Mono className="text-[6px] sm:text-[7px] text-emerald-500/35 tracking-[0.08em] uppercase font-bold shrink-0">
                      {previewLoading ? 'LOADING' : 'ACTIVE'}
                    </Mono>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Cpu className="w-2.5 h-2.5 text-white/10" />
                <Mono className="text-[6px] sm:text-[7px] text-white/12 tracking-[0.08em] uppercase font-bold">
                  PID_{activePhase ? '200' : '---'}
                </Mono>
              </div>
            </div>

            {/* Corner brackets */}
            <span className="cmd-corner cmd-corner-tl" style={{ zIndex: 6, borderColor: 'rgba(16,185,129,0.15)' }} />
            <span className="cmd-corner cmd-corner-tr" style={{ zIndex: 6, borderColor: 'rgba(16,185,129,0.15)' }} />
            <span className="cmd-corner cmd-corner-bl" style={{ zIndex: 6, borderColor: 'rgba(16,185,129,0.15)' }} />
            <span className="cmd-corner cmd-corner-br" style={{ zIndex: 6, borderColor: 'rgba(16,185,129,0.15)' }} />

            {/* 3D Depth layers */}
            <div
              className="absolute inset-0 pointer-events-none z-[8] rounded-[12px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.05) 100%)',
              }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
