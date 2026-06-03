'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowUp,
  MapPin,
  Clock,
  Mail,
  Phone,
  Instagram,
  Music2,
  MessageCircle,
  ChevronRight,
  Cpu,
  Shield,
  Download,
  HardDrive,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';

interface FooterProps {
  t: TranslationSet;
  lang: Language;
}

const NAV_ITEMS = [
  { id: 'home', key: 'home' },
  { id: 'services', key: 'services' },
  { id: 'ratecard', key: 'ratecard' },
  { id: 'portfolio', key: 'portfolio' },
  { id: 'faq', key: 'faq' },
  { id: 'about', key: 'contact' },
];

const SERVICES = [
  { key: 'svc-01', labelEN: 'Enterprise Cognitive Strategy', labelID: 'Strategi Kognitif Enterprise' },
  { key: 'svc-02', labelEN: 'High-Fidelity Interface Design', labelID: 'Desain Interface High-Fidelity' },
  { key: 'svc-03', labelEN: 'Futuristic Visual Production', labelID: 'Produksi Visual Futuristik' },
  { key: 'svc-04', labelEN: 'Sound & Audio Strategy', labelID: 'Strategi Sound & Audio' },
];

export default function Footer({ t, lang }: FooterProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050508] border-t border-white/[0.04] relative overflow-hidden">
      {/* Top gradient glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

      {/* Subtle tech grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow from brand area */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none opacity-[0.03]"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* Column 1: Logo + Brand + Sub-headline — Tech + Sci-fi */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col">
            {/* Brand Block with tech frame */}
            <div className="relative mb-6">
              {/* Corner brackets decoration */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/[0.15] pointer-events-none" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/[0.15] pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/[0.15] pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/[0.15] pointer-events-none" />

              <div className="relative p-4 rounded-sm bg-white/[0.02] border border-white/[0.06]">
                {/* Logo + Brand Row */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-white/[0.06] border border-white/[0.1] p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.04)]">
                    <Image
                      src="/images/mizora-logo.png"
                      alt="Mizora KZN"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                    {/* Subtle inner glow ring */}
                    <div className="absolute inset-0 rounded-sm border border-white/[0.05] pointer-events-none" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-white text-sm tracking-[0.35em] font-medium leading-none mb-1.5"
                      style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
                    >
                      MIZORA KZN
                    </span>
                    {/* Tech label for tagline */}
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-2.5 h-2.5 text-emerald-500/70" />
                      <span
                        className="text-emerald-400/70 text-[8px] tracking-[0.15em] uppercase leading-none"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        AI Workflow & System Builder
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider line */}
                <div className="h-[1px] bg-gradient-to-r from-emerald-500/20 via-white/[0.08] to-transparent mb-3" />

                {/* Status indicator row */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span
                    className="text-white/[0.25] text-[7px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    SYSTEM ACTIVE // CORE ONLINE
                  </span>
                </div>

                {/* Sub-headline */}
                <p className="font-sans text-[13px] text-neutral-400 leading-relaxed">
                  AI Workflow Designer & System Builder. Membangun sistem berbasis AI untuk menyederhanakan operasional dan meningkatkan efisiensi bisnis.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://instagram.com/mizora_kzn"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 cursor-pointer group"
              >
                <Instagram className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://tiktok.com/@mizora_kzn"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 cursor-pointer group"
              >
                <Music2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://wa.me/628111111111"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="mailto:hello@mizorakzn.com"
                aria-label="Email"
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 cursor-pointer group"
              >
                <Mail className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigasi */}
          <div className="lg:col-span-2">
            <h4
              className="text-white text-[10px] tracking-[0.25em] uppercase mb-5 flex items-center gap-2"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <span className="w-2 h-[1px] bg-white/[0.15]" />
              {lang === 'id' ? 'Navigasi' : 'Navigation'}
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="font-sans text-sm text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    <span>{t.nav[item.key as keyof typeof t.nav]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Layanan */}
          <div className="lg:col-span-3">
            <h4
              className="text-white text-[10px] tracking-[0.25em] uppercase mb-5 flex items-center gap-2"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <span className="w-2 h-[1px] bg-white/[0.15]" />
              {lang === 'id' ? 'Layanan' : 'Services'}
            </h4>
            <ul className="flex flex-col gap-3">
              {SERVICES.map((svc) => (
                <li key={svc.key}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="font-sans text-sm text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    <span>{lang === 'id' ? svc.labelID : svc.labelEN}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Info & Kontak */}
          <div className="lg:col-span-3">
            <h4
              className="text-white text-[10px] tracking-[0.25em] uppercase mb-5 flex items-center gap-2"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <span className="w-2 h-[1px] bg-white/[0.15]" />
              {lang === 'id' ? 'Info & Kontak' : 'Info & Contact'}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-neutral-300 leading-snug">
                    {lang === 'id' ? 'Kota Bekasi, Jawa Barat' : 'Bekasi City, West Java'}
                  </p>
                  <p className="font-sans text-xs text-neutral-500">Indonesia</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-neutral-300 leading-snug">
                    {lang === 'id' ? 'Senin — Jumat' : 'Monday — Friday'}
                  </p>
                  <p className="font-sans text-xs text-neutral-500">08:00 — 22:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-500/60 shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-neutral-300 leading-snug">
                    {lang === 'id' ? 'Respon Cepat AI' : 'AI Quick Response'}
                  </p>
                  <p className="font-sans text-xs text-neutral-500">Mizora KZN</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <a
                  href="https://wa.me/628111111111"
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-sm text-neutral-300 hover:text-white transition-colors leading-snug"
                >
                  +62 811-1111-111
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <a
                  href="mailto:hello@mizorakzn.com"
                  className="font-sans text-sm text-neutral-300 hover:text-white transition-colors leading-snug"
                >
                  hello@mizorakzn.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        {/* Download Source Code Backup — Deploy-Ready */}
        <div className="mb-8 rounded-sm bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group/bkp">
          {/* Subtle animated scan line */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/bkp:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-pulse" />
          </div>

          {/* Header Row */}
          <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                <HardDrive className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sans font-semibold text-sm text-white">
                    {lang === 'id' ? 'Download Source Code Backup' : 'Download Source Code Backup'}
                  </span>
                  <span
                    className="text-[7px] tracking-[0.15em] uppercase text-emerald-400/60 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/10"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    DEPLOY-READY
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-500 leading-relaxed max-w-lg">
                  {lang === 'id'
                    ? 'Backup lengkap source code + konfigurasi deployment. 1 file ZIP siap upload ke GitHub, Vercel, Google AI Studio, dan platform lainnya — rebuild 100% di mana saja.'
                    : 'Complete source code backup + deployment configs. 1 ZIP file ready to upload to GitHub, Vercel, Google AI Studio, and other platforms — rebuild 100% anywhere.'}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                if (downloadState === 'loading') return;
                setDownloadState('loading');
                try {
                  const res = await fetch('/api/backup');
                  if (!res.ok) throw new Error('Backup failed');
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  // Extract filename from Content-Disposition header
                  const disposition = res.headers.get('Content-Disposition');
                  const fileNameMatch = disposition?.match(/filename["`]?=[^;"]*[`"]?([^;"]*)/);
                  a.download = fileNameMatch?.[1] || 'mizora-kzn-source.zip';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  setDownloadState('success');
                  setTimeout(() => setDownloadState('idle'), 4000);
                } catch (err) {
                  console.error('Download failed:', err);
                  setDownloadState('idle');
                }
              }}
              disabled={downloadState === 'loading'}
              className={`shrink-0 px-5 py-2.5 rounded-sm font-sans font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95 ${
                downloadState === 'success'
                  ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                  : downloadState === 'loading'
                    ? 'bg-white/[0.06] border border-white/[0.1] text-neutral-400 cursor-wait'
                    : 'bg-white/[0.04] border border-white/[0.1] text-neutral-300 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white'
              }`}
            >
              {downloadState === 'loading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'id' ? 'Memproses...' : 'Processing...'}</span>
                </>
              ) : downloadState === 'success' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Berhasil Download!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Download ZIP' : 'Download ZIP'}</span>
                </>
              )}
            </button>
          </div>

          {/* Platform badges row */}
          <div className="px-5 pb-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[7px] tracking-[0.15em] uppercase text-neutral-600 font-bold mr-1"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {lang === 'id' ? 'SIAP DEPLOY KE:' : 'DEPLOY TO:'}
              </span>
              {['GitHub', 'Vercel', 'Netlify', 'Railway', 'Google AI Studio'].map((platform) => (
                <span
                  key={platform}
                  className="text-[8px] tracking-[0.08em] text-neutral-500 bg-white/[0.03] border border-white/[0.06] px-2 py-1 rounded-sm font-medium"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Included items row */}
          <div className="px-5 pb-5 relative z-10 border-t border-white/[0.04] pt-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {lang === 'id' ? 'Semua Source Code' : 'All Source Code'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  .env.example
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  vercel.json
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  .gitignore
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  index.html
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] text-neutral-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  RESTORE-README.md
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Legal */}
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-neutral-600" />
            <p className="font-sans text-xs text-neutral-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Mizora KZN. {lang === 'id' ? 'Semua hak dilindungi.' : 'All rights reserved.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="font-sans text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
            </button>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <button
              onClick={() => scrollToSection('contact')}
              className="font-sans text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 border border-white/[0.08] hover:border-white/[0.2] rounded-md bg-white/[0.02] text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest active:scale-95 shrink-0 hover:bg-white/[0.05]"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
