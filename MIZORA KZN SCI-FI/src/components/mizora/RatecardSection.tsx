'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  X,
  Check,
  Clock,
  TrendingUp,
  Users,
  Layers,
  Zap,
  MonitorSmartphone,
  Search,
  Package,
  CalendarDays,
  Code2,
  Shield,
  MessageCircle,
  FileCheck,
  Star,
  ChevronLeft,
  ChevronRight,
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

// ─── Animation configs — Optimized for 60fps ───
// CRITICAL: Replaced spring with tween for overlay — spring causes oscillation = perceived lag
const TWEEN_OVERLAY = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 500, damping: 40 };
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const EASE_FAST = [0.25, 0.46, 0.45, 0.94] as const;

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

// ─── Hex to rgba helper — memoized via cache ───
const _rgbaCache = new Map<string, string>();
function hexToRgba(hex: string, alpha: number): string {
  const key = `${hex}-${alpha}`;
  const cached = _rgbaCache.get(key);
  if (cached) return cached;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const result = `rgba(${r},${g},${b},${alpha})`;
  _rgbaCache.set(key, result);
  return result;
}

// ─── Spec Pill ───
function SpecPill({
  children,
  accent,
  className = '',
  style,
}: {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`rc-spec-pill inline-flex items-center gap-1.5 font-mono text-[9px] font-bold px-3 py-1 rounded-full border border-white/[0.06] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        color: accent || 'rgba(255,255,255,0.65)',
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
//  COLLAPSED CARD CONTENT — Memoized for performance
//  Rendered inside the grid card when NOT expanded
// ═══════════════════════════════════════════════════════════════
interface CollapsedCardContentProps {
  service: RatecardService;
  category: RatecardCategory;
  lang: Language;
  startingFromLabel: string;
  onToggle: () => void;
}

const CollapsedCardContent = React.memo(function CollapsedCardContent({
  service,
  category,
  lang,
  startingFromLabel,
  onToggle,
}: CollapsedCardContentProps) {
  const accent = category.color;

  return (
    <>
      {/* Holo shimmer — visible on card surface */}
      <div className="rc-holo-shimmer" />

      {/* Top accent glow line — now visible */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accent}80 30%, ${accent} 50%, ${accent}80 70%, transparent 95%)`,
          opacity: 0.5,
        }}
      />

      {/* Card inner content */}
      <div className="relative z-10 p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider"
              style={{ background: `${accent}12`, color: accent }}
            >
              MZ-{category.prefix}
            </span>
            <span className="font-mono text-[11px] text-neutral-500 font-bold tracking-wider">
              {service.code}
            </span>
          </div>
        </div>

        {/* Service name + popularity badge */}
        <div className="flex items-start gap-2 mb-2">
          <h3
            className="font-sans text-white tracking-tight leading-tight flex-1"
            style={{ fontWeight: 600, fontSize: '0.9375rem' }}
          >
            {service.name}
          </h3>
          {/* Popularity badge — show for first 2 services per category */}
          {category.services.indexOf(service) < 2 && (
            <span
              className="shrink-0 inline-flex items-center gap-1 font-mono text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: `${accent}18`, color: accent }}
            >
              <Star className="w-2.5 h-2.5" />
              {category.services.indexOf(service) === 0
                ? (lang === 'id' ? 'Populer' : 'Popular')
                : (lang === 'id' ? 'Pilihan' : 'Choice')
              }
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className="font-sans leading-relaxed mb-4"
          style={{
            fontSize: '0.8125rem',
            color: '#737373',
            marginBottom: '1rem',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.desc[lang]}
        </p>

        {/* Spec pills — all use accent color for consistency */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <SpecPill
            accent={accent}
            style={{ background: `${accent}10`, color: accent }}
          >
            {service.tags.timeline}
          </SpecPill>
          <SpecPill
            accent={accent}
            style={{ background: `${accent}10`, color: accent }}
          >
            {service.tags.scope} {lang === 'id' ? 'hal' : 'pgs'}
          </SpecPill>
          <SpecPill
            accent={accent}
            style={{ background: `${accent}10`, color: accent }}
          >
            {service.tags.tech}
          </SpecPill>
        </div>

        {/* Price display — enhanced visual hierarchy */}
        <div className="mb-4 pb-4 border-b border-white/[0.04]">
          <span className="font-mono text-[8px] font-bold tracking-[0.12em] uppercase text-neutral-500 block mb-1">
            {startingFromLabel}
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono text-[1.5rem] font-bold tracking-tight block leading-none"
              style={{ color: accent, fontFamily: '"JetBrains Mono", monospace' }}
            >
              {service.price[lang]}
            </span>
          </div>
          <span className="font-mono text-[7px] font-bold tracking-[0.1em] uppercase text-neutral-500 block mt-0.5">
            {lang === 'id' ? 'INVESTASI DIGITAL' : 'DIGITAL INVESTMENT'}
          </span>
        </div>

        {/* CTA: Lihat Detail — CSS-only hover, no inline DOM manipulation */}
        <button
          onClick={onToggle}
          className="rc-cta-detail inline-flex items-center gap-1.5 text-[12px] font-semibold text-neutral-400 hover:text-white cursor-pointer group/btn"
        >
          <span>{lang === 'id' ? '→ Lihat Detail' : '→ View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-[2px]" />
        </button>
      </div>
    </>
  );
});

// ═══════════════════════════════════════════════════════════════
//  EXPANDED CARD CONTENT — Memoized for performance
//  Rendered inside the overlay card when expanded
//  All content pre-rendered, revealed via opacity
// ═══════════════════════════════════════════════════════════════
interface ExpandedCardContentProps {
  service: RatecardService;
  category: RatecardCategory;
  lang: Language;
  startingFromLabel: string;
  onToggle: () => void;
  onOrder: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  currentIndex: number;
  totalCount: number;
}

const ExpandedCardContent = React.memo(function ExpandedCardContent({
  service,
  category,
  lang,
  startingFromLabel,
  onToggle,
  onOrder,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: ExpandedCardContentProps) {
  const accent = category.color;
  const featureList = service.features?.[lang] ?? [];

  const specRows = useMemo(() => [
    { icon: Clock, label: lang === 'id' ? 'Waktu Kerja' : 'Working Time', value: service.specs.timeline[lang] },
    { icon: CalendarDays, label: lang === 'id' ? 'Halaman' : 'Pages', value: service.specs.pages[lang] },
    { icon: Code2, label: 'Tech Stack', value: service.specs.techStack },
    { icon: Zap, label: lang === 'id' ? 'Revisi' : 'Revisions', value: service.specs.revisions },
  ], [lang, service.specs]);

  return (
    <>
      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Card inner content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Header row with close button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider"
              style={{ background: `${accent}12`, color: accent }}
            >
              MZ-{category.prefix}
            </span>
            <span className="font-mono text-[11px] text-neutral-500 font-bold tracking-wider">
              {service.code}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile prev/next navigation — only visible on small screens */}
            <button
              onClick={onPrev ?? undefined}
              disabled={!onPrev}
              className={`sm:hidden w-9 h-9 rounded-md flex items-center justify-center cursor-pointer shrink-0 transition-colors duration-150 ${onPrev ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-700 cursor-not-allowed'}`}
              aria-label={lang === 'id' ? 'Sebelumnya' : 'Previous'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext ?? undefined}
              disabled={!onNext}
              className={`sm:hidden w-9 h-9 rounded-md flex items-center justify-center cursor-pointer shrink-0 transition-colors duration-150 ${onNext ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-700 cursor-not-allowed'}`}
              aria-label={lang === 'id' ? 'Selanjutnya' : 'Next'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Close button — 44px touch target for mobile accessibility */}
            <button
              onClick={onToggle}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors duration-150"
              aria-label={lang === 'id' ? 'Tutup' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Service name */}
        <h3
          className="font-sans text-white tracking-tight leading-tight mb-2"
          style={{ fontWeight: 800, fontSize: '1.25rem' }}
        >
          {service.name}
        </h3>

        {/* Description — single instance, no duplicate with Overview */}
        <p
          className="font-sans leading-relaxed mb-6"
          style={{
            fontSize: '0.875rem',
            color: '#a3a3a3',
            marginBottom: '1.5rem',
          }}
        >
          {service.fullDesc[lang]}
        </p>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ─── Left column: Features + Deliverables ─── */}
          <div className="space-y-6">
            {/* Feature checklist */}
            {featureList.length > 0 && (
              <div>
                <h4
                  className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <MonitorSmartphone className="w-3 h-3" />
                  {lang === 'id' ? 'Fitur Utama' : 'Key Features'}
                </h4>
                <div className="space-y-1.5">
                  {featureList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-2 px-3 bg-white/[0.02] rounded-md hover:bg-white/[0.04] transition-colors duration-200"
                    >
                      <Check className="w-4 h-4 shrink-0" style={{ color: accent }} />
                      <span className="font-sans text-xs text-neutral-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables list */}
            <div>
              <h4
                className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
                style={{ color: accent }}
              >
                <Package className="w-3 h-3" />
                {lang === 'id' ? 'Deliverables' : 'Deliverables'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {service.deliverables[lang].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 py-2 px-3 bg-white/[0.02] rounded-md hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                    <span className="font-sans text-xs text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right column: Specs + Price + CTA ─── */}
          <div className="space-y-6">
            {/* Timeline & Specs */}
            <div>
              <h4
                className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase mb-3 flex items-center gap-2"
                style={{ color: accent }}
              >
                <Clock className="w-3 h-3" />
                {lang === 'id' ? 'Timeline & Spesifikasi' : 'Timeline & Specs'}
              </h4>
              <div className="space-y-2">
                {specRows.map((spec, idx) => {
                  const IconComp = spec.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-2.5 px-4 bg-white/[0.02] rounded-md"
                    >
                      <IconComp className="w-4 h-4 shrink-0" style={{ color: accent, opacity: 0.7 }} />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase tracking-wider block">
                          {spec.label}
                        </span>
                        <span className="font-sans text-sm font-semibold text-white block">
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Responsive & SEO badges */}
                <div className="flex gap-2 mt-1">
                  {service.specs.responsive && (
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold px-2.5 py-1.5 rounded-full"
                      style={{ background: `${accent}12`, color: accent }}
                    >
                      <MonitorSmartphone className="w-3 h-3" />
                      Responsive
                    </span>
                  )}
                  {service.specs.seo && (
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold px-2.5 py-1.5 rounded-full"
                      style={{ background: `${accent}12`, color: accent }}
                    >
                      <Search className="w-3 h-3" />
                      SEO Ready
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.06]" />

            {/* Hero price */}
            <div>
              <span className="font-mono text-[8px] font-bold tracking-[0.15em] uppercase text-neutral-500 block mb-1">
                {startingFromLabel}
              </span>
              <span
                className="font-mono text-2xl md:text-3xl font-bold tracking-tight block leading-none mb-1"
                style={{ color: accent, fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
              >
                {service.price[lang]}
              </span>
              <span className="font-mono text-[8px] font-bold tracking-[0.12em] uppercase text-neutral-500 block">
                {lang === 'id' ? 'INVESTASI DIGITAL' : 'DIGITAL INVESTMENT'}
              </span>
            </div>

            {/* Strong CTA button */}
            <motion.button
              onClick={onOrder}
              className="w-full py-4 rounded-md text-sm font-extrabold flex items-center justify-center gap-2.5 cursor-pointer text-white transition-all duration-200"
              style={{
                background: accent,
                boxShadow: `0 0 20px ${accent}40`,
              }}
              whileHover={{ filter: 'brightness(1.1)', y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <ArrowRight className="w-4 h-4" />
              <span>{lang === 'id' ? 'PESAN SEKARANG' : 'ORDER NOW'}</span>
            </motion.button>

            {/* Trust elements — confidence boosters below CTA */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                <Shield className="w-3 h-3" style={{ color: accent, opacity: 0.6 }} />
                {lang === 'id' ? 'Garansi Revisi' : 'Revision Guarantee'}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                <MessageCircle className="w-3 h-3" style={{ color: accent, opacity: 0.6 }} />
                {lang === 'id' ? 'Konsultasi Gratis' : 'Free Consultation'}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                <FileCheck className="w-3 h-3" style={{ color: accent, opacity: 0.6 }} />
                {lang === 'id' ? 'NDA Tersedia' : 'NDA Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// ═══════════════════════════════════════════════════════════════
//  OVERLAY DIALOG — Portaled expanded card overlay
//  Extracted as separate component to avoid JSX parsing issues
//  with createPortal + AnimatePresence nesting
// ═══════════════════════════════════════════════════════════════
interface OverlayDialogProps {
  expandedCode: string | null;
  expandedService: RatecardService | null;
  activeCat: RatecardCategory;
  activeCatStyles: {
    borderColorExpanded: string;
    boxShadowExpanded: string;
  };
  lang: Language;
  startingFromLabel: string;
  onClose: () => void;
  onOrder: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  currentIndex: number;
  totalCount: number;
  isMounted: boolean;
}

function OverlayDialog({
  expandedCode,
  expandedService,
  activeCat,
  activeCatStyles,
  lang,
  startingFromLabel,
  onClose,
  onOrder,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
  isMounted,
}: OverlayDialogProps) {
  const scroll = useRef<HTMLDivElement>(null);

  if (!isMounted || !expandedCode || !expandedService) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={`dialog-${expandedCode}`}
        className="fixed inset-0 z-[9999]"
        role="dialog"
        aria-modal="true"
        aria-label={expandedService.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop — reduced blur from 8px to 3px for GPU perf */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_FAST }}
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={onClose}
        />

        {/* Centered expanded card — scale+opacity animation (no layoutId FLIP) */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
          {/* Prev navigation button — hidden on mobile, visible on sm+ */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="hidden sm:flex absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label={lang === 'id' ? 'Sebelumnya' : 'Previous'}
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
          )}

          <motion.div
            key={`expanded-${expandedCode}`}
            ref={scroll}
            className="relative rounded-[12px] overflow-y-auto pointer-events-auto rc-detail-scrollbar"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={TWEEN_OVERLAY}
            style={{
              background: '#080808',
              border: `1px solid ${activeCatStyles.borderColorExpanded}`,
              boxShadow: activeCatStyles.boxShadowExpanded,
              width: 'min(95vw, 1000px)',
              maxWidth: '1000px',
              maxHeight: '90vh',
              overscrollBehavior: 'contain',
            }}
          >
            <ExpandedCardContent
              service={expandedService}
              category={activeCat}
              lang={lang}
              startingFromLabel={startingFromLabel}
              onToggle={onClose}
              onOrder={onOrder}
              onPrev={onPrev}
              onNext={onNext}
              currentIndex={currentIndex}
              totalCount={totalCount}
            />
          </motion.div>

          {/* Next navigation button — hidden on mobile, visible on sm+ */}
          {onNext && (
            <button
              onClick={onNext}
              className="hidden sm:flex absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label={lang === 'id' ? 'Selanjutnya' : 'Next'}
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          )}

          {/* Service counter indicator */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <span
              className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RatecardSection({ t, lang }: RatecardSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('umkm');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  // Perf: Use ref instead of state for spotlight visibility — avoids re-renders
  const spotlightVisibleRef = useRef(false);

  // ─── Fix #1: SSR-safe portal mount via useSyncExternalStore ───
  const isMounted = useSyncExternalStore(
    () => () => {},   // subscribe (no-op, never changes)
    () => true,       // client snapshot
    () => false       // server snapshot
  );

  // ─── Magnetic pill refs ───
  const pillContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const rc = t.ratecard;
  const categories = rc.categories;
  const activeCat = categories.find((c) => c.id === activeCategory) || categories[0];

  // ─── Dynamic stats — derived from actual data, not hardcoded ───
  const totalServices = useMemo(() => categories.reduce((sum, c) => sum + c.services.length, 0), [categories]);
  const totalCategories = categories.length;

  // ─── Fix #8: Memoize computed style values ───
  const activeCatStyles = useMemo(() => ({
    borderColor: hexToRgba(activeCat.color, 0.1),
    borderColorExpanded: hexToRgba(activeCat.color, 0.3),
    boxShadow: `0 8px 20px rgba(0,0,0,0.2), 0 0 40px ${hexToRgba(activeCat.color, 0.06)}`,
    boxShadowExpanded: `0 20px 40px rgba(0,0,0,0.5), 0 0 100px ${hexToRgba(activeCat.color, 0.12)}`,
  }), [activeCat.color]);

  // ─── Derived: expanded service ───
  const expandedService = useMemo(() => {
    if (!expandedCode) return null;
    return activeCat.services.find((s) => s.code === expandedCode) || null;
  }, [expandedCode, activeCat.services]);

  // All services in active category (declared early for keyboard navigation)
  const allServices = activeCat.services;

  // ─── Fix #2: Robust scroll lock with wheel/touch block ───
  // When Detail View is open, NOTHING should scroll except the detail view itself.
  // body overflow:hidden alone isn't enough — wheel events on backdrop can still
  // propagate and scroll the page. We add a passive:false wheel listener on window
  // that blocks scrolling unless the target is inside the detail card.
  useEffect(() => {
    if (!expandedCode) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Block wheel events that aren't inside the detail card
    const blockScroll = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const detailCard = document.querySelector('.rc-detail-scrollbar');
      if (detailCard && !detailCard.contains(target)) {
        e.preventDefault();
      }
    };
    // Block touchmove events that aren't inside the detail card
    const blockTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const detailCard = document.querySelector('.rc-detail-scrollbar');
      if (detailCard && !detailCard.contains(target)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockTouch, { passive: false });

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockTouch);
    };
  }, [expandedCode]);

  // ─── Keyboard escape: close on Escape, navigate on ←/→ ───
  useEffect(() => {
    if (!expandedCode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedCode(null);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const idx = allServices.findIndex((s) => s.code === expandedCode);
        if (idx === -1) return;
        if (e.key === 'ArrowLeft' && idx > 0) {
          setExpandedCode(allServices[idx - 1].code);
        } else if (e.key === 'ArrowRight' && idx < allServices.length - 1) {
          setExpandedCode(allServices[idx + 1].code);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expandedCode, allServices]);

  // ─── Cursor spotlight via ref — NO setState on mousemove ───
  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || expandedCode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Direct DOM update — bypasses React render cycle
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, ${activeCat.color}05, transparent)`;
    }
  }, [prefersReducedMotion, activeCat.color, expandedCode]);

  // Perf: Ref-based grid hover (no re-render) — pure DOM, zero React state
  const handleGridMouseEnter = useCallback(() => {
    if (!prefersReducedMotion && !expandedCode) {
      spotlightVisibleRef.current = true;
      if (spotlightRef.current) spotlightRef.current.style.display = 'block';
    }
  }, [prefersReducedMotion, expandedCode]);

  const handleGridMouseLeave = useCallback(() => {
    spotlightVisibleRef.current = false;
    if (spotlightRef.current) spotlightRef.current.style.display = 'none';
  }, []);

  // ─── Magnetic pill effect ───
  const handlePillContainerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const mouseX = e.clientX;

    pillRefs.current.forEach((pillEl) => {
      const pillRect = pillEl.getBoundingClientRect();
      const pillCenterX = pillRect.left + pillRect.width / 2;
      const distX = mouseX - pillCenterX;
      const distance = Math.abs(distX);
      const threshold = 80;

      if (distance < threshold) {
        const factor = 1 - distance / threshold;
        const shiftX = distX > 0 ? Math.min(factor * 3, 3) : Math.max(factor * -3, -3);
        pillEl.style.transform = `translateX(${shiftX}px)`;
      } else {
        pillEl.style.transform = 'translateX(0px)';
      }
    });
  }, [prefersReducedMotion]);

  const handlePillContainerMouseLeave = useCallback(() => {
    pillRefs.current.forEach((pillEl) => {
      pillEl.style.transform = 'translateX(0px)';
    });
  }, []);

  // ─── Scroll to contact ───
  const handleApplyClick = useCallback(
    (serviceName: string, category: string) => {
      setExpandedCode(null); // Close expanded card first
      // Defer scroll to next frame so collapse animation starts
      requestAnimationFrame(() => {
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
      });
    },
    [lang]
  );

  // ─── Close expanded card ───
  const closeExpanded = useCallback(() => {
    setExpandedCode(null);
  }, []);

  // ─── Category change handler ───
  const handleCategoryChange = useCallback((catId: string) => {
    setActiveCategory(catId);
    setExpandedCode(null);
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
      opacity: 1, y: 0,
      transition: { duration: 0.4, ease: EASE_PREMIUM },
    },
    exit: {
      opacity: 0, y: prefersReducedMotion ? 0 : 8,
      transition: { duration: 0.15 },
    },
  };

  // ─── Fix #9: Stats counter animation via ref + DOM ───
  const [statsVisible, setStatsVisible] = useState(false);
  const statTerminalRef = useRef<HTMLSpanElement>(null); // Terminal line counter
  const statServicesRef = useRef<HTMLSpanElement>(null); // Micro decoration counter
  const statCatsRef = useRef<HTMLSpanElement>(null);
  const statFeeRef = useRef<HTMLSpanElement>(null);
  const feeFlashRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1200;
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const services = Math.floor(eased * totalServices);
      const cats = Math.floor(eased * totalCategories);

      // Direct DOM update — no React re-render
      if (statTerminalRef.current) statTerminalRef.current.textContent = String(services);
      if (statServicesRef.current) statServicesRef.current.textContent = String(services);
      if (statCatsRef.current) statCatsRef.current.textContent = String(cats);
      if (statFeeRef.current) statFeeRef.current.textContent = '0';

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        if (statTerminalRef.current) statTerminalRef.current.textContent = String(totalServices);
        if (statServicesRef.current) statServicesRef.current.textContent = String(totalServices);
        if (statCatsRef.current) statCatsRef.current.textContent = String(totalCategories);
        if (statFeeRef.current) statFeeRef.current.textContent = '0';
        // Flash effect
        if (feeFlashRef.current) {
          feeFlashRef.current.classList.add('rc-fee-flash');
          setTimeout(() => {
            if (feeFlashRef.current) feeFlashRef.current.classList.remove('rc-fee-flash');
          }, 400);
        }
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [statsVisible, totalServices, totalCategories]);

  // Perf: Stable callback map to avoid inline arrow functions breaking React.memo
  const toggleCallbacks = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const svc of allServices) {
      const code = svc.code;
      map.set(code, () => setExpandedCode((prev) => (prev === code ? null : code)));
    }
    return map;
  }, [allServices]);

  // Hide spotlight when expanded (ref-based, no re-render)
  useEffect(() => {
    if (expandedCode) {
      spotlightVisibleRef.current = false;
      if (spotlightRef.current) spotlightRef.current.style.display = 'none';
    }
  }, [expandedCode]);

  return (
    <section
      id="ratecard"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: '#ECECF0' }}
    >
      {/* ─── Atmospheric background: noise texture ─── */}
      <div className="absolute inset-0 rc-noise-bg pointer-events-none" />

      {/* ─── Dot grid background ─── */}
      <div className="absolute inset-0 rc-dot-grid pointer-events-none" />

      {/* ─── Floating micro-particles ─── */}
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

      {/* ─── Subtle conic gradient ─── */}
      <div
        className="absolute inset-0 pointer-events-none rc-conic-sweep"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${activeCat.color}03 60deg, transparent 120deg, transparent 360deg)`,
          opacity: 0.02,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 w-full">

        {/* ═══════════════════════════════════════════
            SECTION HEADER
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
                <span ref={statTerminalRef}>0</span> {lang === 'id' ? 'LAYANAN' : 'SERVICES'}
              </Mono>
              <span className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1" style={{ animation: 'cmd-cursor-blink 0.8s step-end infinite' }} />
            </div>

            {/* Headline */}
            <h2 className="font-display font-black text-[2.8rem] md:text-7xl text-black tracking-tight mb-0 leading-[0.92]">
              <span className="block uppercase">MATRIX</span>
              <span className="block uppercase text-[2rem] md:text-5xl mt-1">PRODUK DIGITAL</span>
            </h2>
            <div className="cmd-headline-line max-w-[200px]" />

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
                  <span ref={statServicesRef}>0</span> {lang === 'id' ? 'LAYANAN' : 'SERVICES'} &middot; <span ref={statCatsRef}>0</span> {lang === 'id' ? 'KATEGORI' : 'CATEGORIES'} &middot; <span ref={feeFlashRef}><span ref={statFeeRef}>0</span> HIDDEN FEE</span>
                </Mono>
              </span>
              <Mono className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold rc-active-blink">● ACTIVE</Mono>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
            CATEGORY NAV — SCI-FI Segmented Terminal Rail
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={12} className="mb-8 md:mb-12">
          {/* Terminal label bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[8px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              {lang === 'id' ? 'FILTER_KATEGORI' : 'CATEGORY_FILTER'}
            </span>
            <span className="flex-1 h-px bg-neutral-300/40" />
            <span className="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-neutral-400">
              {activeCat.services.length} {lang === 'id' ? 'LAYANAN' : 'SERVICES'}
            </span>
          </div>

          {/* SCI-FI Segmented pill rail */}
          <div
            ref={pillContainerRef}
            className="rc-cat-rail flex items-stretch gap-0 overflow-x-auto rc-pill-scrollbar"
            onMouseMove={handlePillContainerMouseMove}
            onMouseLeave={handlePillContainerMouseLeave}
            style={{
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '10px',
              padding: '3px',
              '--rc-accent': hexToRgba(activeCat.color, 0.22),
              '--rc-accent-hover': hexToRgba(activeCat.color, 0.35),
            } as React.CSSProperties}
          >
            {categories.map((cat, catIdx) => {
              const isActive = activeCategory === cat.id;
              return (
                <React.Fragment key={cat.id}>
                  {catIdx > 0 && (
                    <span
                      className="w-px self-stretch shrink-0 my-1.5"
                      style={{ background: isActive ? 'transparent' : 'rgba(0,0,0,0.08)' }}
                    />
                  )}
                  <button
                    ref={(el) => { if (el) pillRefs.current.set(cat.id, el); }}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`
                      rc-cat-pill relative flex items-center gap-2 px-3.5 py-2
                      text-[11px] whitespace-nowrap transition-all duration-250 cursor-pointer
                      rounded-[8px] shrink-0
                      ${isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-500 font-semibold hover:text-neutral-700 hover:bg-black/[0.04]'
                      }
                    `}
                    style={isActive ? {
                      background: cat.color,
                      boxShadow: `0 2px 8px ${cat.color}30, 0 0 0 1px ${cat.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    } : { background: 'transparent' }}
                  >
                    {/* Status indicator dot */}
                    <span
                      className="shrink-0 rounded-sm transition-all duration-250"
                      style={{
                        width: isActive ? '6px' : '4px',
                        height: isActive ? '6px' : '4px',
                        background: isActive ? 'white' : cat.color,
                        boxShadow: isActive ? '0 0 6px rgba(255,255,255,0.4)' : 'none',
                      }}
                    />
                    <span className="tracking-wide">{cat.label[lang]}</span>
                    {/* Service count badge */}
                    <span
                      className={`font-mono text-[9px] font-bold tracking-wider ${isActive ? 'text-white/60' : ''}`}
                      style={!isActive ? { color: cat.color, opacity: 0.5 } : {}}
                    >
                      {cat.services.length}
                    </span>
                    {/* Active scan-line effect */}
                    {isActive && (
                      <motion.div
                        layoutId="rc-pill-scanline"
                        className="absolute inset-0 rounded-[8px] pointer-events-none overflow-hidden"
                        transition={SPRING_SNAPPY}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.06) 100%)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Active category detail line */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className="w-2 h-2 rounded-full rc-active-blink"
              style={{ background: activeCat.color, boxShadow: `0 0 6px ${activeCat.color}60` }}
            />
            <span className="font-mono text-[8px] font-bold tracking-[0.15em] uppercase" style={{ color: activeCat.color }}>
              SECTOR_{activeCat.prefix}
            </span>
            <span className="flex-1 h-px" style={{ background: `${activeCat.color}20` }} />
            <span className="font-mono text-[7px] text-neutral-400 tracking-[0.15em] uppercase">
              {activeCat.services.length} {lang === 'id' ? 'ENTRI AKTIF' : 'ACTIVE ENTRIES'}
            </span>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
            SERVICE CONTENT AREA — GRID LAYER (always stable)
        ═══════════════════════════════════════════ */}
        <div
          className="relative min-h-[200px] mb-12 md:mb-16"
          onMouseMove={handleGridMouseMove}
          onMouseEnter={handleGridMouseEnter}
          onMouseLeave={handleGridMouseLeave}
        >
          {/* Perf: Cursor spotlight — always in DOM, visibility controlled via ref */}
          <div
            ref={spotlightRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              display: 'none',
              background: `radial-gradient(350px circle at 0px 0px, ${activeCat.color}05, transparent)`,
            }}
          />

          {/* Perf: Grid dim — CSS transition instead of AnimatePresence/motion.div */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none z-20 transition-opacity duration-200"
            style={{
              background: 'rgba(236,236,240,0.55)',
              opacity: expandedCode !== null ? 1 : 0,
            }}
          />

          <AnimatePresence mode="wait">
            {allServices.length === 0 ? (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                className="flex flex-col items-center justify-center py-20 px-6 bg-[#080808] rounded-lg"
              >
                <Layers className="w-8 h-8 mb-4" style={{ color: activeCat.color, opacity: 0.5 }} />
                <h3 className="font-sans font-semibold text-base text-white tracking-tight mb-2">
                  {rc.comingSoonLabel}
                </h3>
                <p className="font-sans text-sm text-neutral-500 text-center max-w-sm leading-relaxed">
                  {lang === 'id'
                    ? 'Kategori layanan ini sedang dalam pengembangan.'
                    : 'This service category is under development.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCat.id}
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative"
              >
                {allServices.map((service) => {
                  const isExpanded = expandedCode === service.code;
                  return (
                    <motion.div
                      key={service.code}
                      variants={cardItemVariants}
                      className="relative"
                      style={{ overflow: 'visible' }}
                    >
                      {/* When NOT expanded: render the card (no layoutId — uses scale+opacity for overlay instead) */}
                      {!isExpanded && (
                        <motion.div
                          className="relative rounded-[12px] overflow-hidden"
                          style={{
                            background: '#080808',
                            border: `1px solid ${activeCatStyles.borderColor}`,
                            boxShadow: activeCatStyles.boxShadow,
                          }}
                          whileHover={!expandedCode ? { y: -4, scale: 1.008 } : undefined}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        >
                          <CollapsedCardContent
                            service={service}
                            category={activeCat}
                            lang={lang}
                            startingFromLabel={rc.startingFromLabel}
                            onToggle={toggleCallbacks.get(service.code) ?? (() => {})}
                          />
                        </motion.div>
                      )}

                      {/* When expanded: invisible placeholder to maintain grid slot */}
                      {isExpanded && (
                        <div
                          className="rounded-[12px]"
                          style={{ background: '#080808', border: `1px solid ${activeCatStyles.borderColor}`, opacity: 0, pointerEvents: 'none' }}
                          aria-hidden="true"
                        >
                          <div className="p-6">
                            <div className="h-4 w-24 bg-white/5 rounded mb-3" />
                            <div className="h-3 w-40 bg-white/5 rounded mb-2" />
                            <div className="h-3 w-32 bg-white/5 rounded mb-4" />
                            <div className="h-8 w-full bg-white/5 rounded" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════
            OVERLAY DIALOG — Extracted component
        ═══════════════════════════════════════════ */}
        <OverlayDialog
          expandedCode={expandedCode}
          expandedService={expandedService}
          activeCat={activeCat}
          activeCatStyles={activeCatStyles}
          lang={lang}
          startingFromLabel={rc.startingFromLabel}
          onClose={closeExpanded}
          onOrder={() => handleApplyClick(expandedService?.name ?? '', activeCat.name)}
          onPrev={expandedCode && allServices.findIndex((s) => s.code === expandedCode) > 0
            ? () => {
                const idx = allServices.findIndex((s) => s.code === expandedCode);
                setExpandedCode(allServices[idx - 1].code);
              }
            : null
          }
          onNext={expandedCode && allServices.findIndex((s) => s.code === expandedCode) < allServices.length - 1
            ? () => {
                const idx = allServices.findIndex((s) => s.code === expandedCode);
                setExpandedCode(allServices[idx + 1].code);
              }
            : null
          }
          currentIndex={expandedCode ? allServices.findIndex((s) => s.code === expandedCode) : 0}
          totalCount={allServices.length}
          isMounted={isMounted}
        />

        {/* Hash separator */}
        <div className="rc-hash-sep my-8 md:my-12" />

        {/* ═══════════════════════════════════════════
            COMMITMENT SECTION
        ═══════════════════════════════════════════ */}
        <ScrollReveal yOffset={20} delay={0.1}>
          <div className="mt-8">
            <h3 className="font-sans text-sm font-bold text-neutral-500 tracking-wider uppercase mb-6">
              {lang === 'id' ? 'Komitmen Kami' : 'Our Commitment'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rc.commitments.map((commitment, idx) => {
                const IconComp = COMMITMENT_ICONS[commitment.icon] || Clock;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-white/40 rounded-lg border border-black/[0.04]"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${activeCat.color}12` }}
                    >
                      <IconComp className="w-4 h-4" style={{ color: activeCat.color }} />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-black mb-1">
                        {commitment.title[lang]}
                      </h4>
                      <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                        {commitment.description[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
