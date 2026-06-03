'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Menu, Globe, ArrowRight, X } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationSet;
  isLoading?: boolean;
}

export default function Header({ lang, setLang, t, isLoading }: HeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll handler: scrolled state + progress bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = ['home', 'services', 'ratecard', 'portfolio', 'faq', 'about'];
    const observers: IntersectionObserver[] = [];
    const sectionVisibility: Record<string, number> = {};

    sectionIds.forEach((id) => {
      sectionVisibility[id] = 0;
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            sectionVisibility[id] = entry.intersectionRatio;
          });

          if (window.scrollY < 100) {
            setActiveSection('home');
            return;
          }

          let maxVisibility = 0;
          let mostVisible = 'home';
          for (const [sectionId, ratio] of Object.entries(sectionVisibility)) {
            if (ratio > maxVisibility) {
              maxVisibility = ratio;
              mostVisible = sectionId;
            }
          }
          setActiveSection(mostVisible);
        },
        {
          root: null,
          rootMargin: '-85px 0px 0px 0px',
          threshold: [0.2, 0.5],
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  const navItems = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.services, id: 'services' },
    { name: t.nav.ratecard, id: 'ratecard' },
    { name: t.nav.portfolio, id: 'portfolio' },
    { name: t.nav.faq, id: 'faq' },
    { name: t.nav.contact, id: 'about' },
  ];

  return (
    <>
      {/* #4 - Scroll Progress Indicator — Premium gradient with leading edge */}
      {!isLoading && (
        <div className="fixed top-0 left-0 h-[2.5px] z-[60]">
          {/* Background track */}
          <div className="absolute inset-0 w-screen bg-black/[0.04]" />
          {/* Progress fill with gradient */}
          <div
            className="relative h-full bg-gradient-to-r from-black via-neutral-800 to-black transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
          {/* Leading bright edge */}
          {scrollProgress > 0 && scrollProgress < 100 && (
            <div
              className="absolute top-0 h-full w-3 bg-white/40 blur-[2px] transition-[left] duration-150 ease-out"
              style={{ left: `${scrollProgress}%` }}
            />
          )}
        </div>
      )}

      <header
        id="main-nav-bar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 widget-3d border-b border-neutral-200/60'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* #1 - Logo + Brand — Tech + Sci-fi */}
          <div
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <Image
                src="/images/mizora-logo.png"
                alt="Mizora KZN"
                width={34}
                height={34}
                className="rounded-sm object-contain transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-md"
              />
              {/* Subtle ring on hover */}
              <div className="absolute -inset-1 rounded-sm border border-emerald-500/0 group-hover:border-emerald-500/20 transition-all duration-300 pointer-events-none" />
            </div>
            <div className="flex flex-col text-left">
              <span
                className="text-[#0A0A0A] text-sm tracking-[0.3em] font-medium leading-none"
                style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
              >
                MIZORA KZN
              </span>
              <span
                className="text-[#0A0A0A] text-[7px] tracking-[0.12em] uppercase leading-none font-semibold mt-1"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                AI Workflow Designer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {/* #7 - Nav items with tech hover + #3 - Active indicator */}
            <ul className="flex items-center gap-7">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`font-sans font-bold text-xs transition-all duration-200 cursor-pointer uppercase tracking-wider relative group flex items-center gap-1.5 ${
                      activeSection === item.id
                        ? 'text-[#0A0A0A]'
                        : 'text-neutral-500 hover:text-[#0A0A0A]'
                    }`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {/* Active dot indicator */}
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-[#0A0A0A] scale-100 nav-dot-heartbeat'
                        : 'bg-transparent scale-0 group-hover:bg-neutral-400 group-hover:scale-100'
                    }`} />
                    {item.name}
                    {/* Underline indicator — sharper tech style */}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] transition-all duration-300 ${
                      activeSection === item.id
                        ? 'w-full bg-[#0A0A0A]'
                        : 'w-0 bg-[#0A0A0A] group-hover:w-full'
                    }`} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Separator */}
            <div className="h-4 w-[1px] bg-neutral-200" />

            {/* #5 - Language toggle — polished with tech frame */}
            <div className="flex items-center gap-0.5 p-[3px] bg-neutral-100 border border-neutral-200 rounded-sm relative">
              {/* Corner dots for tech frame feel */}
              <span className="absolute -top-px -left-px w-1 h-1 border-t border-l border-neutral-300" />
              <span className="absolute -top-px -right-px w-1 h-1 border-t border-r border-neutral-300" />
              <span className="absolute -bottom-px -left-px w-1 h-1 border-b border-l border-neutral-300" />
              <span className="absolute -bottom-px -right-px w-1 h-1 border-b border-r border-neutral-300" />
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 rounded-xs font-mono text-[9px] font-bold tracking-wider transition-all cursor-pointer ${
                  lang === 'id' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-neutral-500 hover:text-[#0A0A0A]'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-xs font-mono text-[9px] font-bold tracking-wider transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-neutral-500 hover:text-[#0A0A0A]'
                }`}
              >
                EN
              </button>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 border border-[#0A0A0A] bg-[#0A0A0A] text-white hover:bg-transparent hover:text-[#0A0A0A] rounded-sm font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{t.nav.consultation}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </nav>

          {/* #6 - Mobile Sidebar — 3D Tech Sci-fi */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="p-1 px-2.5 border border-neutral-200 rounded-sm bg-white text-[#0A0A0A] font-mono text-[10px] tracking-widest flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs font-bold"
            >
              <Globe className="w-3 h-3 text-neutral-500" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="p-1.5 text-neutral-700 hover:text-[#0A0A0A] border border-neutral-200 rounded-sm bg-white active:scale-90 transition-transform cursor-pointer shadow-xs">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] sidebar-panel border-l border-white/[0.06] p-0 flex flex-col justify-between overflow-hidden [&>button:last-child]:hidden"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Subtle tech grid background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.015]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Top edge glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                {/* Left edge highlight for 3D depth */}
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />

                <div className="flex flex-col gap-6 px-6 relative z-10">

                  {/* Top bar: Brand + Close button */}
                  <div className="flex items-center justify-between pt-6 pb-1">
                    {/* Brand HUD panel */}
                    <div className="relative p-3 rounded-sm bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                      {/* Corner brackets */}
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-white/[0.15] pointer-events-none" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-white/[0.15] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-white/[0.15] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-white/[0.15] pointer-events-none" />

                      <div className="relative w-9 h-9 rounded-sm overflow-hidden bg-white/[0.06] border border-white/[0.1] p-1 shadow-[0_0_12px_rgba(255,255,255,0.03)]">
                        <Image
                          src="/images/mizora-logo.png"
                          alt="Mizora KZN"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="text-white text-xs tracking-[0.3em] font-medium leading-none"
                          style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
                        >
                          MIZORA KZN
                        </span>
                        <span
                          className="text-white/40 text-[6px] tracking-[0.12em] uppercase mt-1.5 font-medium"
                          style={{ fontFamily: '"JetBrains Mono", monospace' }}
                        >
                          AI Workflow Designer
                        </span>
                      </div>
                    </div>

                    {/* Close button — tech styled */}
                    <SheetClose asChild>
                      <button
                        className="sidebar-close-btn w-8 h-8 rounded-sm flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0"
                        aria-label="Close menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </SheetClose>
                  </div>

                  {/* Divider with gradient */}
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

                  {/* Nav items — 3D tech style */}
                  <nav aria-label="Main navigation">
                    <ul className="flex flex-col gap-0.5 text-left">
                      {navItems.map((item, index) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              scrollToSection(item.id);
                              setSheetOpen(false);
                            }}
                            className={`sidebar-nav-item font-sans font-bold text-[15px] text-left uppercase tracking-[0.15em] block w-full py-3.5 px-4 cursor-pointer rounded-sm flex items-center gap-3 border-l-2 ${
                              activeSection === item.id
                                ? 'sidebar-nav-item-active text-white border-l-white'
                                : 'sidebar-nav-item text-neutral-500 hover:text-neutral-300 border-l-transparent'
                            }`}
                            style={{ animationDelay: `${index * 40}ms` }}
                          >
                            {/* Active indicator dot */}
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              activeSection === item.id ? 'bg-white nav-dot-heartbeat' : 'bg-neutral-700'
                            }`} />
                            <span>{item.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Divider */}
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                  {/* Language toggle inside sheet — tech framed */}
                  <div className="flex items-center gap-1 p-[3px] bg-white/[0.03] border border-white/[0.07] rounded-sm w-fit relative">
                    <span className="absolute -top-px -left-px w-1 h-1 border-t border-l border-white/[0.12]" />
                    <span className="absolute -top-px -right-px w-1 h-1 border-t border-r border-white/[0.12]" />
                    <span className="absolute -bottom-px -left-px w-1 h-1 border-b border-l border-white/[0.12]" />
                    <span className="absolute -bottom-px -right-px w-1 h-1 border-b border-r border-white/[0.12]" />
                    <button
                      onClick={() => setLang('id')}
                      className={`px-3 py-1.5 rounded-xs font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                        lang === 'id' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      ID
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      className={`px-3 py-1.5 rounded-xs font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                        lang === 'en' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="px-6 pb-7 pt-4 relative z-10">
                  <button
                    onClick={() => {
                      scrollToSection('contact');
                      setSheetOpen(false);
                    }}
                    className="w-full py-4 text-center border border-white/[0.1] bg-white text-[#0A0A0A] font-sans font-bold text-xs tracking-widest uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
                  >
                    <span>{t.nav.consultation}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
