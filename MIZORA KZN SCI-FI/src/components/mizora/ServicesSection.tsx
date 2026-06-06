'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Compass,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Zap,
  FileText,
  Users,
  Target,
  LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet, ServiceItem } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

// ─── Props ───
interface ServicesSectionProps {
  t: TranslationSet;
  lang: Language;
}

// ─── Icon Map ───
const iconMap: Record<string, LucideIcon> = {
  Layers,
  Compass,
  Shield,
  TrendingUp,
};

// ─── Mono helper ───
function Mono({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{ fontFamily: '"JetBrains Mono", monospace', ...style }}
    >
      {children}
    </span>
  );
}

// ─── Display helper (Orbitron) ───
function Display({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace', ...style }}
    >
      {children}
    </span>
  );
}

// ─── Progress values per service ───
const SERVICE_PROGRESS: Record<string, number> = {
  'svc-01': 72,
  'svc-02': 65,
  'svc-03': 58,
  'svc-04': 80,
};

// ─── Animation Variants ───
const summaryVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const detailVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 14,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const detailContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.12 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const detailItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.1 },
  },
};

// ─── Corner Brackets ───
function CornerBrackets() {
  return (
    <>
      <span className="cmd-corner cmd-corner-tl" />
      <span className="cmd-corner cmd-corner-tr" />
      <span className="cmd-corner cmd-corner-bl" />
      <span className="cmd-corner cmd-corner-br" />
    </>
  );
}

// ─── Service Card Component ───
function CommandTerminalCard({
  service,
  index,
  lang,
  viewDetailText,
}: {
  service: ServiceItem;
  index: number;
  lang: Language;
  viewDetailText: string;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  // Measure summary height for smooth detail transition
  useEffect(() => {
    if (!showDetail && summaryRef.current) {
      let rafId: number | null = null;
      const ro = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setCardHeight(summaryRef.current?.offsetHeight);
        });
      });
      ro.observe(summaryRef.current);
      setCardHeight(summaryRef.current.offsetHeight);
      return () => {
        ro.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [showDetail]);

  const handleViewDetail = () => {
    if (summaryRef.current) {
      setCardHeight(summaryRef.current.offsetHeight);
    }
    setShowDetail(true);
    setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const offsetTop = rect.top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 400);
  };

  const handleBack = () => {
    setShowDetail(false);
    setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const offsetTop = rect.top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 400);
  };

  const progress = SERVICE_PROGRESS[service.id] || 67;
  const Icon = iconMap[service.iconName] || Layers;

  return (
    <ScrollReveal yOffset={24} delay={index * 0.08} className="h-full">
      <motion.div
        ref={cardRef}
        className={`cmd-terminal ${showDetail ? 'cmd-terminal-active' : ''}`}
      >
        {/* Scanline overlay for active state */}
        {showDetail && <div className="cmd-scanline-overlay" />}

        {/* Corner Brackets */}
        <CornerBrackets />

        {/* Subtle SVG noise texture overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
          }}
        />

        {/* Subtle inner glow border — emerald tinted */}
        <div
          className="absolute inset-0 pointer-events-none z-[2] rounded-[10px]"
          style={{
            boxShadow: 'inset 0 0 30px rgba(16,185,129,0.02), inset 0 0 60px rgba(255,255,255,0.1)',
          }}
        />

        {/* ═══ STATUS BAR ═══ */}
        <div className="cmd-status-bar relative z-[3]">
          <div className="flex items-center justify-between">
            {/* Left: Green pulse dot with glow + Service ID in Orbitron */}
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                style={{ animation: 'cmd-status-pulse 2s ease-in-out infinite' }}
              />
              <Display
                className="text-[10px] tracking-[0.18em] uppercase font-bold text-emerald-400"
              >
                {service.id.toUpperCase()}
              </Display>
            </div>

            {/* Right: OPERATIONAL label + Progress bar + Percentage */}
            <div className="flex items-center gap-3">
              <Mono
                className="text-[8px] tracking-[0.1em] uppercase font-bold text-neutral-500"
                style={{ animation: 'cmd-data-stream 3s ease-in-out infinite' }}
              >
                OPERATIONAL
              </Mono>
              <div className="cmd-progress">
                <motion.div
                  className="cmd-progress-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <Mono className="text-[9px] tracking-[0.05em] font-bold text-white">
                {progress}%
              </Mono>
            </div>
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        <AnimatePresence mode="wait">
          {!showDetail ? (
            /* ──── SUMMARY VIEW ──── */
            <motion.div
              key="summary"
              ref={summaryRef}
              variants={summaryVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-5 flex flex-col justify-between"
            >
              <div className="w-full">
                {/* Icon + Name + Tagline */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="cmd-icon-oct shrink-0">
                    <Icon className="w-5 h-5 text-black" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans font-black text-sm leading-tight tracking-tight text-black uppercase">
                      {service.name}
                    </h3>
                    <Mono className="text-[9px] tracking-[0.15em] uppercase font-medium text-neutral-500 block mt-0.5">
                      {service.tagline}
                    </Mono>
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-neutral-700 text-xs leading-relaxed mb-4">
                  {service.benefit}
                </p>

                {/* Scope + Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5 mb-4 border-t border-neutral-200/80">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                        {lang === 'id' ? 'LINGKUP UTAMA' : 'DELIVERY SCOPE'}
                      </Mono>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {service.scope.slice(0, 4).map((item, idy) => (
                        <li key={idy} className="cmd-scope-item">
                          <span
                            className="text-emerald-600 text-[9px] font-bold shrink-0 mt-px"
                            style={{ fontFamily: '"JetBrains Mono", monospace' }}
                          >
                            →
                          </span>
                          <span className="font-sans text-[11px] text-neutral-700">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                      <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                        {lang === 'id' ? 'FITUR OPERASIONAL' : 'OPERATIONAL FEATURES'}
                      </Mono>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {service.features.map((feature, idz) => (
                        <span key={idz} className="cmd-feature-chip">
                          <span className="text-emerald-500 text-[10px]">◇</span>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Target + CTA */}
              <div className="cmd-target-bar flex items-center justify-between">
                <div>
                  <Mono className="text-[7px] text-neutral-500 uppercase tracking-[0.16em] font-bold block mb-0.5">
                    TARGET OUTCOME
                  </Mono>
                  <Mono className="text-[10px] font-bold uppercase text-black">
                    {service.targetMetric}
                  </Mono>
                </div>
                <button
                  onClick={handleViewDetail}
                  className="cmd-cta group flex items-center gap-1.5 px-4 py-2 rounded-sm text-[9px] font-extrabold uppercase tracking-widest text-white cursor-pointer"
                >
                  <span>{viewDetailText}</span>
                  <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* ──── DETAIL VIEW ──── */
            <motion.div
              key="detail"
              variants={detailVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-full relative"
              style={
                cardHeight
                  ? {
                      minHeight: `${cardHeight}px`,
                      maxHeight: `${cardHeight}px`,
                    }
                  : undefined
              }
            >
              {/* Detail Header — dark background with emerald accent */}
              <div className="cmd-detail-header flex items-center justify-between px-5 pt-3.5 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="cmd-icon-oct !w-9 !h-9 shrink-0">
                    <Icon className="w-4 h-4 text-black" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-[12px] text-white tracking-tight uppercase">
                      {service.detail.title}
                    </h3>
                    <Mono className="text-[7px] text-neutral-400 tracking-[0.16em] uppercase font-bold">
                      {lang === 'id' ? 'DETAIL LAYANAN' : 'SERVICE DETAILS'}
                    </Mono>
                  </div>
                </div>
                {/* Back button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[8px] font-extrabold uppercase tracking-widest cursor-pointer shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>{lang === 'id' ? 'Kembali' : 'Back'}</span>
                </button>
              </div>

              {/* Detail Content — scrollable */}
              <motion.div
                className="flex-1 overflow-y-auto px-5 py-4 min-h-0 cmd-detail-scroll"
                variants={detailContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* About */}
                <motion.div variants={detailItemVariants} className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="w-3 h-3 text-emerald-600" />
                    <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                      {lang === 'id' ? 'TENTANG LAYANAN' : 'ABOUT SERVICE'}
                    </Mono>
                  </div>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    {service.detail.about}
                  </p>
                </motion.div>

                {/* Suitable For */}
                <motion.div variants={detailItemVariants} className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Users className="w-3 h-3 text-emerald-600" />
                    <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                      {lang === 'id' ? 'COCOK UNTUK' : 'SUITABLE FOR'}
                    </Mono>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.detail.suitableFor.map((item, i) => (
                      <span
                        key={i}
                        className="cmd-detail-chip px-2.5 py-1 text-[10px] font-medium text-neutral-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Work Items */}
                <motion.div variants={detailItemVariants} className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                      {lang === 'id'
                        ? 'YANG AKAN DIKERJAKAN'
                        : 'WHAT WILL BE DONE'}
                    </Mono>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {service.detail.workItems.map((item, i) => (
                      <div key={i} className="cmd-detail-row p-2.5 rounded-sm">
                        <div className="flex items-start gap-2.5">
                          <Mono className="text-[9px] font-bold shrink-0 mt-0.5 text-emerald-600">
                            {String(i + 1).padStart(2, '0')}
                          </Mono>
                          <div>
                            <h5 className="text-black text-xs font-bold mb-0.5">
                              {item.title}
                            </h5>
                            <p className="text-neutral-600 text-[11px] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Deliverables */}
                <motion.div variants={detailItemVariants} className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Target className="w-3 h-3 text-emerald-600" />
                    <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                      DELIVERABLES
                    </Mono>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {service.detail.deliverables.map((item, i) => (
                      <div
                        key={i}
                        className="cmd-deliverable-item flex items-center gap-2 p-2 rounded-sm"
                      >
                        <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
                        <span className="text-[11px] font-medium text-neutral-700">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Benefits */}
                <motion.div variants={detailItemVariants} className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <Mono className="text-[8px] tracking-[0.2em] uppercase font-bold text-black">
                      {lang === 'id' ? 'MANFAAT' : 'BENEFITS'}
                    </Mono>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {service.detail.benefits.map((item, i) => (
                      <div
                        key={i}
                        className="cmd-benefit-item p-2.5 rounded-sm"
                      >
                        <h5 className="text-black text-[11px] font-bold mb-0.5">
                          {item.title}
                        </h5>
                        <p className="text-neutral-600 text-[10px] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Detail Footer CTA */}
              <div className="px-5 py-2.5 border-t border-neutral-200/80 shrink-0">
                <button
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) {
                      const offset =
                        el.getBoundingClientRect().top + window.pageYOffset - 85;
                      window.scrollTo({ top: offset, behavior: 'smooth' });
                    }
                  }}
                  className="cmd-cta w-full py-2.5 text-center text-white font-bold text-[9px] uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <span>{service.detail.ctaLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ScrollReveal>
  );
}

// ─── Main Component ───
export default function ServicesSection({ t, lang }: ServicesSectionProps) {
  return (
    <div
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: '#ECECF0' }}
    >
      {/* Section top edge — emerald gradient line */}
      <div className="cmd-section-edge" />

      {/* Dot grid background (light) */}
      <div className="absolute inset-0 cmd-dot-grid pointer-events-none" />

      {/* Subtle radial emerald glow behind cards */}
      <div className="cmd-radial-glow" />

      {/* Top radial accent — more visible */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)',
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(236,236,240,0.9), transparent)',
        }}
      />

      {/* Decorative side accent lines */}
      <div className="absolute top-28 left-6 md:left-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />
      <div className="absolute top-28 right-6 md:right-12 bottom-28 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ─── Section Header (Terminal-style) ─── */}
        <ScrollReveal yOffset={30} delay={0}>
          <div className="mb-14 md:mb-18">
            {/* Terminal command line with blinking cursor */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-emerald-600 text-[12px] font-bold"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                &gt;
              </span>
              <Mono className="text-[10px] text-black tracking-[0.2em] uppercase font-bold">
                SECTOR_02 // OPERATIONAL CAPABILITIES
              </Mono>
              <span className="flex-1 h-px bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <Mono className="text-[9px] text-emerald-600/70 tracking-[0.2em] uppercase font-bold">
                {t.services.servicesList.length} SERVICES
              </Mono>
              <span
                className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1"
                style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }}
              />
            </div>

            {/* Headline — stacked: BOTH LINES BLACK, Orbitron font */}
            <h2 className="font-display font-black text-[2.8rem] md:text-7xl text-black tracking-tight mb-0 leading-[0.92]">
              <span className="block uppercase">SOLUSI</span>
              <span className="block uppercase text-black">
                PENERAPAN
              </span>
            </h2>

            {/* Decorative emerald line under headline */}
            <div className="cmd-headline-line max-w-[200px]" />

            {/* Description */}
            <p className="font-sans font-medium text-sm md:text-base text-neutral-500 leading-relaxed max-w-3xl mt-5">
              {t.services.subtitle}
            </p>

            {/* Micro decoration — data readout line */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-[4px] h-[4px] rounded-full ${i < 4 ? 'bg-emerald-500/70' : 'bg-neutral-300/60'}`}
                  />
                ))}
              </div>
              <span
                className="text-[7px] text-neutral-400 tracking-[0.2em] uppercase font-bold"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                SYS.READY // V2.4.1
              </span>
              <span className="flex-1 h-px bg-neutral-200/50" />
              <span
                className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                ● ACTIVE
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── Cards Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {t.services.servicesList.map((service, idx) => (
            <CommandTerminalCard
              key={service.id}
              service={service}
              index={idx}
              lang={lang}
              viewDetailText={t.services.viewDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
