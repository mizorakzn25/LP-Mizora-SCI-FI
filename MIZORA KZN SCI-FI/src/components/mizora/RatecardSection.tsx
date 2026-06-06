'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  X,
  Check,
  Clock,
  TrendingUp,
  Users,
  ChevronDown,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Language, TranslationSet, RatecardService, RatecardCategory } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

// ─── Props ───
interface RatecardSectionProps {
  t: TranslationSet;
  lang: Language;
}

// ─── Icon mapping for commitment cards ───
const COMMITMENT_ICONS: Record<string, React.ElementType> = {
  Clock,
  TrendingUp,
  Users,
};

// ─── Mono helper — JetBrains Mono ───
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

// ─── Spec Pill with accent dot ───
function SpecPill({
  children,
  accent,
  isHovered = false,
  className = '',
  style,
}: {
  children: React.ReactNode;
  accent?: string;
  isHovered?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`rc-spec-pill inline-flex items-center gap-1.5 font-mono text-[9px] font-bold px-3 py-1 rounded-full border border-white/[0.06] transition-colors duration-200 ${className}`}
      style={{
        background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
        ...style,
      }}
    >
      <span
        className="shrink-0 rounded-sm"
        style={{
          width: '2px',
          height: '6px',
          background: accent ? `${accent}4D` : 'rgba(255,255,255,0.30)',
        }}
      />
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RatecardSection({ t, lang }: RatecardSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('umkm');
  const [modalService, setModalService] = useState<RatecardService | null>(null);
  const [modalCategory, setModalCategory] = useState<RatecardCategory | null>(null);
  const [expandedPricing, setExpandedPricing] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isGridHovered, setIsGridHovered] = useState(false);

  const rc = t.ratecard;
  const categories = rc.categories;
  const activeCat = categories.find((c) => c.id === activeCategory) || categories[0];

  // ─── Cursor spotlight handler ───
  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [prefersReducedMotion]);

  // ─── Scroll to contact ───
  const handleApplyClick = useCallback(
    (serviceName: string, category: string) => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const messageField = document.getElementById('form-message') as HTMLTextAreaElement;
        if (messageField) {
          messageField.value =
            lang === 'id'
              ? `Halo Mizora Core Team, saya tertarik dengan layanan ${serviceName} (${category}). Silakan jadwalkan konsultasi.`
              : `Hello Mizora Core Team, I am interested in the ${serviceName} service (${category}). Please schedule a consultation.`;
        }
        const headerOffset = 85;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    },
    [lang]
  );

  // ─── Modal open/close ───
  const openModal = useCallback(
    (service: RatecardService, category: RatecardCategory) => {
      setModalService(service);
      setModalCategory(category);
      document.body.style.overflow = 'hidden';
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalService(null);
    setModalCategory(null);
    document.body.style.overflow = '';
  }, []);

  // ─── Animation variants ───
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.07 },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 8,
      transition: { duration: 0.15 },
    },
  };

  // ─── Stats counter animation ───
  const [statsVisible, setStatsVisible] = useState(false);
  const [statNumbers, setStatNumbers] = useState({ services: 0, categories: 0 });

  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1200;
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setStatNumbers({
        services: Math.floor(eased * 28),
        categories: Math.floor(eased * 6),
      });
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setStatNumbers({ services: 28, categories: 6 });
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [statsVisible]);

  // Separate featured service from the rest
  const featuredService = activeCat.services[0];
  const remainingServices = activeCat.services.slice(1);

  // Group project entries by category
  const projectByCategory = rc.projectEntries.reduce<Record<string, typeof rc.projectEntries>>((acc, entry) => {
    const catName = entry.category[lang];
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(entry);
    return acc;
  }, {});

  return (
    <section
      ref={sectionRef}
      id="ratecard"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: '#ECECF0' }}
    >
      {/* ─── Atmospheric background: noise texture ─── */}
      <div className="absolute inset-0 rc-noise-bg pointer-events-none" />

      {/* ─── 1. Dot grid background (Stripe/Vercel) ─── */}
      <div className="absolute inset-0 rc-dot-grid pointer-events-none" />

      {/* ─── 5. Floating micro-particles ─── */}
      {!prefersReducedMotion && (
        <>
          <span className="rc-particle rc-particle--1" />
          <span className="rc-particle rc-particle--2" />
          <span className="rc-particle rc-particle--3" />
          <span className="rc-particle rc-particle--4" />
          <span className="rc-particle rc-particle--5" />
        </>
      )}

      {/* ─── Atmospheric radial gradients ─── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 20% 20%, ${activeCat.color}0A, transparent)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 45% 35% at 80% 80%, rgba(0,0,0,0.02), transparent)',
        }}
      />

      {/* ─── Subtle conic gradient — slowly rotating radar sweep ─── */}
      <div
        className="absolute inset-0 pointer-events-none rc-conic-sweep"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${activeCat.color}03 60deg, transparent 120deg, transparent 360deg)`,
          opacity: 0.02,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-20 w-full">

        {/* ═══════════════════════════════════════════
            SECTION HEADER — Matching SECTOR_04 Style
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={30} delay={0}>
          <div className="mb-14 md:mb-18">
            {/* Terminal command line */}
            <div
              className="flex items-center gap-3 mb-5"
              ref={(el) => { if (el && !statsVisible) setStatsVisible(true); }}
            >
              <span className="text-emerald-600 text-[12px] font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>&gt;</span>
              <Mono className="text-[10px] text-black tracking-[0.2em] uppercase font-bold">
                SECTOR_05 // DIGITAL ARSENAL
              </Mono>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-black via-black/70 to-black/10" />
              <Mono className="text-[9px] text-emerald-600/70 tracking-[0.2em] uppercase font-bold">
                {statNumbers.services} {lang === 'id' ? 'LAYANAN' : 'SERVICES'}
              </Mono>
              <span className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1" style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }} />
            </div>

            {/* Headline — Orbitron font, black */}
            <h2 className="font-display font-black text-[2.8rem] md:text-7xl text-black tracking-tight mb-0 leading-[0.92]">
              <span className="block uppercase">MATRIX</span>
              <span className="block uppercase text-[2rem] md:text-5xl mt-1">PRODUK DIGITAL</span>
            </h2>
            <div className="cmd-headline-line max-w-[200px]" />

            {/* Sub-headline */}
            <p className="font-sans font-medium text-sm md:text-base text-neutral-500 leading-relaxed max-w-3xl mt-5">
              {rc.subtitle}
            </p>

            {/* Micro decoration */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className={`w-[4px] h-[4px] rounded-full ${i < 5 ? 'bg-emerald-500/70' : 'bg-neutral-300/60'}`} />
                ))}
              </div>
              <Mono className="text-[7px] text-neutral-400 tracking-[0.2em] uppercase font-bold">RATE.DATABASE // V5.0.0</Mono>
              <span className="flex-1 h-px bg-neutral-200/50" />
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 rc-stat-dot" />
                <Mono className="text-[7px] text-neutral-500 tracking-[0.15em] uppercase font-bold">
                  {statNumbers.categories} {lang === 'id' ? 'Kategori' : 'Categories'}
                </Mono>
              </span>
              <Mono className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold">● ACTIVE</Mono>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
            CATEGORY NAV — Pill Rail
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={12} className="mb-8 md:mb-12">
          <div className="flex items-center gap-0 overflow-x-auto rc-pill-scrollbar pb-1">
            {categories.map((cat, catIdx) => {
              const isActive = activeCategory === cat.id;
              return (
                <React.Fragment key={cat.id}>
                  {/* Separator between pills */}
                  {catIdx > 0 && (
                    <span
                      className="w-3 h-px shrink-0 mx-1.5"
                      style={{ background: 'rgba(0,0,0,0.12)' }}
                    />
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                        rc-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        text-[11px] whitespace-nowrap transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'text-white font-bold'
                          : 'text-neutral-400 font-semibold hover:text-neutral-600 hover:bg-neutral-200/60'
                        }
                      `}
                      style={isActive ? { background: cat.color, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' } : { background: 'transparent' }}
                    >
                      <span className="relative w-1.5 h-1.5 shrink-0">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ background: isActive ? 'white' : cat.color }}
                        />
                        {/* 6. Pulse ring on active category dot */}
                        {isActive && !prefersReducedMotion && (
                          <span
                            className="rc-pulse-ring"
                            style={{ background: 'white' }}
                          />
                        )}
                      </span>
                      <span>{cat.name}</span>
                    </button>
                    {/* Sliding bottom indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="rc-pill-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full"
                        style={{ background: cat.color }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
            SERVICE CONTENT AREA
        ═══════════════════════════════════════════ */}
        <div
          ref={gridRef}
          className="relative min-h-[200px] mb-12 md:mb-16"
          onMouseMove={handleGridMouseMove}
          onMouseEnter={() => setIsGridHovered(true)}
          onMouseLeave={() => setIsGridHovered(false)}
        >
          {/* Cursor spotlight — follows mouse */}
          {isGridHovered && !prefersReducedMotion && (
            <div
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(350px circle at ${cursorPos.x}px ${cursorPos.y}px, ${activeCat.color}05, transparent)`,
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {activeCat.id === 'tambahan' ? (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex flex-col items-center justify-center py-20 px-6 bg-[#0A0A0A] rounded-lg"
              >
                <Layers className="w-8 h-8 mb-4" style={{ color: activeCat.color, opacity: 0.5 }} />
                <h3 className="font-sans font-semibold text-base text-white tracking-tight mb-2">
                  {rc.comingSoonLabel}
                </h3>
                <p className="font-sans text-sm text-neutral-500 text-center max-w-sm leading-relaxed">
                  {lang === 'id'
                    ? 'Kategori layanan tambahan sedang dalam pengembangan.'
                    : 'Additional service categories are under development.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCat.id}
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4 md:space-y-5 relative z-10"
              >
                {/* ─── Featured Service Card ─── */}
                {featuredService && (
                  <motion.div variants={cardItemVariants}>
                    <FeaturedCard
                      service={featuredService}
                      category={activeCat}
                      lang={lang}
                      startingFromLabel={rc.startingFromLabel}
                      onDetail={() => openModal(featuredService, activeCat)}
                      onOrder={() => handleApplyClick(featuredService.name, activeCat.name)}
                    />
                  </motion.div>
                )}

                {/* ─── Regular Service Grid ─── */}
                {remainingServices.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {remainingServices.map((service, idx) => (
                      <motion.div key={service.code} variants={cardItemVariants}>
                        <ServiceCard
                          service={service}
                          category={activeCat}
                          index={idx + 1}
                          lang={lang}
                          startingFromLabel={rc.startingFromLabel}
                          onDetail={() => openModal(service, activeCat)}
                          onOrder={() => handleApplyClick(service.name, activeCat.name)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 10. Hash separator between service grid and terminal */}
        <div className="rc-hash-sep my-8 md:my-12" />

        {/* ═══════════════════════════════════════════
            BOTTOM PANEL — Dark Terminal
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={16}>
          <div className="rc-terminal-panel rounded-lg overflow-hidden relative">
            {/* Noise texture overlay */}
            <div className="absolute inset-0 rc-noise-bg pointer-events-none opacity-30" />

            {/* 7. Data stream lines in terminal */}
            {!prefersReducedMotion && (
              <>
                <div className="rc-data-stream" style={{ top: '25%' }} />
                <div className="rc-data-stream rc-data-stream--2" style={{ top: '55%' }} />
                <div className="rc-data-stream rc-data-stream--3" style={{ top: '80%' }} />
              </>
            )}

            {/* 8. Crosshair markers on terminal panel */}
            <span className="rc-crosshair rc-crosshair--tl">+</span>
            <span className="rc-crosshair rc-crosshair--br">+</span>

            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10"
              style={{ background: `${activeCat.color}1A` }}
            />

            {/* Background panel */}
            <div className="bg-[#0A0A0A] relative z-[1]">
              {/* ─── Commitment row (merged into top) ─── */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/[0.04]">
                {rc.commitments.map((commitment, idx) => {
                  const IconComponent = COMMITMENT_ICONS[commitment.icon] || Clock;
                  const accentColors = ['#06B6D4', '#F59E0B', '#10B981'];
                  const accent = accentColors[idx] || '#06B6D4';
                  return (
                    <div
                      key={idx}
                      className="rc-commitment-item relative flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors duration-200 md:border-r last:border-r-0 border-white/[0.04]"
                    >
                      {/* Left accent line on hover */}
                      <div
                        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 hover-show-accent transition-opacity duration-200"
                        style={{ background: `${accent}33` }}
                      />
                      <IconComponent className="w-4 h-4 shrink-0" style={{ color: accent, opacity: 0.7 }} />
                      <div className="min-w-0">
                        <span className="font-sans font-semibold text-xs text-white block leading-tight">
                          {commitment.title[lang]}
                        </span>
                        <span className="font-sans text-[11px] text-neutral-500 leading-tight block truncate">
                          {commitment.description[lang]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ─── Project List Accordion ─── */}
              <div className="p-5 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <h3 className="font-sans font-bold text-base text-white tracking-tight">
                    {rc.projectListTitle}
                  </h3>
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                </div>
                <p className="font-sans text-xs text-neutral-500 mb-6 leading-relaxed">
                  {rc.projectListSubtitle}
                </p>

                <div className="space-y-2">
                  {Object.entries(projectByCategory).map(([catName, entries]) => {
                    const entryCat = categories.find((c) => c.name === catName || c.label[lang] === catName);
                    const accentColor = entryCat?.color || '#64748B';
                    const isExpanded = expandedPricing === catName;

                    return (
                      <div key={catName} className="rc-accordion-item rounded-md overflow-hidden relative">
                        {/* Left accent line that animates in on expand */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300"
                          style={{
                            background: accentColor,
                            opacity: isExpanded ? 0.4 : 0,
                          }}
                        />
                        <button
                          onClick={() => setExpandedPricing(isExpanded ? null : catName)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accentColor }} />
                            <span className="font-sans font-semibold text-xs text-white">{catName}</span>
                            <Mono className="text-[9px] text-neutral-500">
                              {String(entries.length).padStart(2, '0')} {lang === 'id' ? 'layanan' : 'svc'}
                            </Mono>
                          </div>
                          <ChevronDown
                            className="w-3.5 h-3.5 text-neutral-500 transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 py-1">
                                {entries.map((entry, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between py-2.5 border-t border-white/[0.04] group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span
                                        className="rc-spec-pill font-mono text-[9px] font-bold px-3 py-1 rounded border border-white/[0.06] shrink-0"
                                        style={{ background: `${accentColor}12`, color: accentColor }}
                                      >
                                        {entry.code}
                                      </span>
                                      <span className="font-sans text-xs text-neutral-300 truncate group-hover:text-white transition-colors">
                                        {entry.service}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 ml-4">
                                      <span className="font-sans text-[11px] text-neutral-500">
                                        {entry.time[lang]}
                                      </span>
                                      <span className="font-mono text-xs text-white font-bold">
                                        {entry.price[lang]}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
            FOOTER NOTE — Minimal
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={12} delay={0.1} className="mt-6">
          <div className="flex items-center justify-center gap-2 py-3 px-4">
            <AlertTriangle className="w-3 h-3 text-amber-500/60 shrink-0" />
            <p className="font-mono text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest max-w-3xl leading-relaxed font-medium">
              {rc.billingNote}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* ═══════════════════════════════════════════
          DETAIL MODAL — Command Palette Style
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {modalService && modalCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97, y: prefersReducedMotion ? 0 : 8, transition: { duration: 0.12 } }}
              onClick={(e) => e.stopPropagation()}
              className="rc-cmd-palette relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg"
              style={{
                background: '#0A0A0A',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}
            >
              {/* Modal header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.06]"
                style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0"
                    style={{ background: `${modalCategory.color}15`, color: modalCategory.color }}
                  >
                    {modalCategory.prefix}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500 font-bold tracking-wider shrink-0">
                    {modalService.code}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 md:px-8 py-6 space-y-6 relative z-[1]">
                {/* Service name + description + price */}
                <div>
                  <h3 className="font-sans font-bold text-xl md:text-2xl text-white tracking-tight leading-tight mb-3">
                    {modalService.name}
                  </h3>
                  <p className="font-sans text-sm text-neutral-400 leading-relaxed mb-4">
                    {modalService.fullDesc[lang]}
                  </p>
                  {/* Price readout in modal */}
                  <div className="flex items-baseline gap-2 pt-3 border-t border-white/[0.06]">
                    <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-500">
                      {rc.startingFromLabel}
                    </span>
                    <span
                      className="font-mono text-lg font-bold tracking-tight"
                      style={{ color: modalCategory.color }}
                    >
                      {modalService.price[lang]}
                    </span>
                  </div>
                </div>

                {/* Specs grid — 2x3 */}
                <div>
                  <h4
                    className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
                    style={{ color: modalCategory.color }}
                  >
                    {rc.specificationsLabel}
                  </h4>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-px rounded-md overflow-hidden"
                    style={{ background: `${modalCategory.color}0D` }}
                  >
                    <SpecItem label={lang === 'id' ? 'Waktu' : 'Timeline'} value={modalService.specs.timeline[lang]} accent={modalCategory.color} />
                    <SpecItem label={lang === 'id' ? 'Halaman' : 'Pages'} value={modalService.specs.pages[lang]} accent={modalCategory.color} />
                    <SpecItem label="Tech Stack" value={modalService.specs.techStack} accent={modalCategory.color} />
                    <SpecItem label={lang === 'id' ? 'Revisi' : 'Revisions'} value={modalService.specs.revisions} accent={modalCategory.color} />
                    <SpecItem
                      label="Responsive"
                      value={modalService.specs.responsive ? '✓' : '✗'}
                      valueColor={modalService.specs.responsive ? '#10B981' : '#EF4444'}
                      accent={modalCategory.color}
                    />
                    <SpecItem
                      label="SEO"
                      value={modalService.specs.seo ? '✓' : '✗'}
                      valueColor={modalService.specs.seo ? '#10B981' : '#EF4444'}
                      accent={modalCategory.color}
                    />
                  </div>
                </div>

                {/* Deliverables list with checkmarks */}
                <div>
                  <h4
                    className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
                    style={{ color: modalCategory.color }}
                  >
                    {rc.includesLabel}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {modalService.deliverables[lang].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 py-2 px-3 bg-white/[0.02] rounded hover:bg-white/[0.04] transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 shrink-0" style={{ color: modalCategory.color }} />
                        <span className="font-sans text-xs text-neutral-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer — single CTA */}
              <div
                className="sticky bottom-0 z-10 px-6 md:px-8 py-4 border-t border-white/[0.06]"
                style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)' }}
              >
                <button
                  onClick={() => {
                    if (modalService && modalCategory) {
                      handleApplyClick(modalService.name, modalCategory.name);
                      closeModal();
                    }
                  }}
                  className="rc-ghost-btn w-full py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer text-white transition-all duration-200 group"
                  style={{
                    background: `linear-gradient(135deg, ${modalCategory.color}, ${modalCategory.color}CC)`,
                  }}
                >
                  <span>{rc.orderNowBtn}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURED SERVICE CARD — Hero Banner
   ═══════════════════════════════════════════════════════════════ */
interface FeaturedCardProps {
  service: RatecardService;
  category: RatecardCategory;
  lang: Language;
  startingFromLabel: string;
  onDetail: () => void;
  onOrder: () => void;
}

function FeaturedCard({ service, category, lang, startingFromLabel, onDetail, onOrder }: FeaturedCardProps) {
  const accent = category.color;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: deltaY * -1.5, y: deltaX * 1.5 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className="rc-featured-card group relative rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A0A0A 0%, #0D0D0D 50%, #080808 100%)',
        borderLeft: `3px solid ${accent}50`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0px)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        boxShadow: isHovered
          ? `0 0 60px ${accent}0A, 0 12px 32px rgba(0,0,0,0.3)`
          : '0 4px 20px rgba(0,0,0,0.18)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 2. Corner brackets — targeting reticle frame */}
      <div className="rc-corner-bracket rc-corner-bracket--tl" style={{ color: accent }} />
      <div className="rc-corner-bracket rc-corner-bracket--tr" style={{ color: accent }} />
      <div className="rc-corner-bracket rc-corner-bracket--bl" style={{ color: accent }} />
      <div className="rc-corner-bracket rc-corner-bracket--br" style={{ color: accent }} />

      {/* 3. Holo shimmer sweep on hover */}
      <div className={`rc-holo-shimmer${isHovered ? ' rc-holo-shimmer--active' : ''}`} />

      {/* 4. Scanline sweep — terminal radar */}
      {!prefersReducedMotion && <div className="rc-scanline" />}

      {/* Large watermark number — Orbitron font */}
      <span
        className="absolute top-2 right-4 pointer-events-none select-none transition-opacity duration-500"
        style={{
          fontFamily: '"Orbitron", "JetBrains Mono", monospace',
          fontSize: '120px',
          lineHeight: 1,
          color: accent,
          opacity: isHovered ? 0.12 : 0.06,
        }}
      >
        01
      </span>

      {/* Top accent edge — barely-there hint */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `${accent}26` }}
      />

      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent}08, transparent 70%)` }}
      />

      {/* Bottom border separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.04]" />

      <div className="flex flex-col md:flex-row relative z-10">
        {/* Left: 65% — Main content */}
        <div className="md:w-[65%] p-6 md:p-8">
          {/* Featured badge + Category prefix */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="font-mono text-[8px] font-bold px-2.5 py-1 rounded uppercase tracking-wider text-white"
              style={{ background: accent }}
            >
              ★ FEATURED
            </span>
            <span
              className="font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ background: `${accent}15`, color: accent }}
            >
              {category.prefix}
            </span>
            <span className="font-mono text-[10px] text-neutral-500 font-medium">
              {service.code}
            </span>
          </div>

          {/* Service name — NOT uppercase */}
          <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight leading-tight mb-3">
            {service.name}
          </h3>

          {/* Description */}
          <p className="font-sans text-[14px] text-neutral-400 leading-relaxed mb-5 max-w-lg">
            {service.desc[lang]}
          </p>

          {/* Key specs — 3 inline pills with accent dots */}
          <div className="flex items-center gap-2 mb-6">
            <SpecPill accent={accent}>
              {service.tags.timeline}
            </SpecPill>
            <SpecPill accent={accent}>
              {service.tags.scope} {lang === 'id' ? 'hal' : 'pgs'}
            </SpecPill>
            <SpecPill
              accent={accent}
              style={{ background: `${accent}12`, color: accent }}
            >
              {service.tags.tech}
            </SpecPill>
          </div>

          {/* Ghost CTA button with left accent on hover */}
          <button
            onClick={onDetail}
            className="rc-ghost-btn inline-flex items-center gap-1.5 text-[12px] font-semibold text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer group/btn"
            style={{
              borderLeft: isHovered ? `2px solid ${accent}40` : '2px solid transparent',
              paddingLeft: isHovered ? '10px' : '10px',
            }}
          >
            <span>{lang === 'id' ? 'Lihat Detail' : 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-[2px]" />
          </button>
        </div>

        {/* Right: 35% — Badges + CTA */}
        <div className="md:w-[35%] p-6 md:p-8 flex flex-col justify-between md:border-l border-white/[0.04]">
          <div className="space-y-4 mb-6">
            {/* Price display — terminal readout style */}
            <div className="space-y-1">
              <span className="font-mono text-[8px] font-bold tracking-[0.15em] uppercase text-neutral-500 block">
                {startingFromLabel}
              </span>
              <span
                className="font-mono text-2xl font-bold tracking-tight block leading-none"
                style={{ color: accent }}
              >
                {service.price[lang]}
              </span>
            </div>
            {/* Timeline badge */}
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-sans text-xs text-neutral-400">
                {service.specs.timeline[lang]}
              </span>
            </div>
            {/* Category badge */}
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: accent }}
              />
              <span className="font-sans text-xs text-neutral-400">
                {category.name}
              </span>
            </div>
          </div>

          {/* Order CTA */}
          <button
            onClick={onOrder}
            className="rc-ghost-btn w-full py-2.5 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-white/80 hover:text-white transition-all duration-200 group/btn"
            style={{ background: `${accent}18` }}
          >
            <span>{lang === 'id' ? 'Pesan Sekarang' : 'Order Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-[2px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SERVICE CARD — Premium Catalog
   ═══════════════════════════════════════════════════════════════ */
interface ServiceCardProps {
  service: RatecardService;
  category: RatecardCategory;
  index: number;
  lang: Language;
  startingFromLabel: string;
  onDetail: () => void;
  onOrder: () => void;
}

function ServiceCard({ service, category, index, lang, startingFromLabel, onDetail, onOrder }: ServiceCardProps) {
  const accent = category.color;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: deltaY * -1.5, y: deltaX * 1.5 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  // Zero-padded index for watermark
  const watermarkNum = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className="rc-service-card group relative rounded-lg bg-[#0A0A0A] overflow-hidden cursor-pointer"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-2px' : '0px'})`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isHovered
          ? `0 10px 28px rgba(0,0,0,0.24), 0 0 24px ${accent}08`
          : '0 2px 10px rgba(0,0,0,0.13)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onDetail}
    >
      {/* 3. Holo shimmer sweep on hover */}
      <div className={`rc-holo-shimmer${isHovered ? ' rc-holo-shimmer--active' : ''}`} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 rc-noise-bg pointer-events-none opacity-[0.03]" />

      {/* Left accent line — appears on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[1.5px] transition-opacity duration-300 z-10"
        style={{
          background: accent,
          opacity: isHovered ? 0.6 : 0,
        }}
      />

      {/* Top accent line — appears on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 z-10"
        style={{
          background: accent,
          opacity: isHovered ? 0.2 : 0,
        }}
      />

      {/* Index watermark number */}
      <span
        className="absolute top-3 right-3 pointer-events-none select-none"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '32px',
          lineHeight: 1,
          color: '#262626',
          opacity: 0.5,
        }}
      >
        {watermarkNum}
      </span>

      <div className="p-6 md:p-7 relative z-10">
        {/* Row 1: Category prefix badge + Service code */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ background: `${accent}12`, color: accent }}
          >
            {category.prefix}
          </span>
          <span className="font-mono text-[10px] text-neutral-500 font-bold">
            {service.code}
          </span>
        </div>

        {/* Row 2: Service name — NOT uppercase */}
        <h4 className="font-sans font-semibold text-[15px] text-white tracking-tight leading-snug mb-2">
          {service.name}
        </h4>

        {/* Row 3: Description — 2-line clamp */}
        <p className="font-sans text-[13px] text-neutral-500 leading-relaxed line-clamp-2 mb-4">
          {service.desc[lang]}
        </p>

        {/* Row 4: Key specs — 3 inline pills with accent dots */}
        <div className="flex items-center gap-1.5 mb-4">
          <SpecPill accent={accent} isHovered={isHovered}>
            {service.tags.timeline}
          </SpecPill>
          <SpecPill accent={accent} isHovered={isHovered}>
            {service.tags.scope} {lang === 'id' ? 'hal' : 'pgs'}
          </SpecPill>
          <SpecPill
            accent={accent}
            style={{ background: `${accent}10`, color: accent }}
          >
            {service.tags.tech}
          </SpecPill>
        </div>

        {/* Row 4.5: Price — terminal readout */}
        <div className="flex items-baseline gap-1.5 mb-4 pb-4 border-b border-white/[0.04]">
          <span className="font-mono text-[8px] font-bold tracking-[0.12em] uppercase text-neutral-500">
            {startingFromLabel}
          </span>
          <span
            className="font-mono text-sm font-bold tracking-tight"
            style={{ color: accent }}
          >
            {service.price[lang]}
          </span>
        </div>

        {/* Row 5: Ghost text button — accent on card hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onOrder(); }}
          className="rc-ghost-btn inline-flex items-center gap-1 text-[11px] font-semibold transition-colors duration-200 cursor-pointer group/btn"
          style={{ color: isHovered ? accent : '#737373' }}
        >
          <span>{lang === 'id' ? 'Pesan Sekarang' : 'Order Now'}</span>
          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-[2px]" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPEC ITEM — Modal spec display
   ═══════════════════════════════════════════════════════════════ */
interface SpecItemProps {
  label: string;
  value: string;
  accent: string;
  valueColor?: string;
}

function SpecItem({ label, value, accent, valueColor }: SpecItemProps) {
  return (
    <div className="px-3 py-2.5 bg-[#0A0A0A]">
      <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span
        className="font-sans text-sm font-semibold block"
        style={{ color: valueColor || 'white' }}
      >
        {value}
      </span>
    </div>
  );
}
