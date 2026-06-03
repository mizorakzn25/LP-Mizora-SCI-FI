'use client';

import React from 'react';
import Image from 'next/image';
import { Binary, Target } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';
import { IMAGE_PATHS } from '@/lib/mizora-translations';
import ScrollReveal from './ScrollReveal';

interface AboutSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function AboutSection({ t, lang }: AboutSectionProps) {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#FAFAFA] overflow-hidden border-b border-neutral-200/60">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-neutral-200/40 opacity-30 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">08 // PROFILE IDENTIFIER</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase">
              {t.about.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.about.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <ScrollReveal yOffset={35}>
              <div className="relative p-1.5 bg-white border border-neutral-200 rounded-sm shadow-xl group w-full max-w-sm mb-8 hover:border-black/20 transition-all duration-300">
                <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-neutral-300" />
                <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-neutral-300" />
                <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-neutral-300" />
                <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-neutral-300" />

                <div className="overflow-hidden bg-[#FAFAFA] aspect-square flex items-center justify-center p-4 border border-neutral-100 rounded-xs">
                  <Image 
                    src={IMAGE_PATHS.sculptureBlack} 
                    alt="Mizora Procedural Black Sculpture" 
                    width={400}
                    height={400}
                    className="w-full h-full object-contain hover-img-refract"
                    style={{ maxHeight: '280px' }}
                  />
                </div>

                <div className="p-3 bg-white border-t border-neutral-100 flex items-center justify-between font-mono text-[9px] text-neutral-500">
                  <span>FILE: KZN_SPECIMEN_3D_METALLIC</span>
                  <span className="text-black font-bold">PROC_REVEAL</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={25} delay={0.1}>
              <div className="widget-3d p-6 rounded-sm max-w-sm text-left">
                <p className="font-serif italic text-neutral-700 text-sm md:text-base leading-relaxed mb-4">
                  {t.about.founderQuote}
                </p>
                <div className="h-[1px] w-12 bg-neutral-200 mb-3" />
                <div>
                  <p className="font-sans font-extrabold text-xs tracking-wider uppercase text-black">{t.about.founderName}</p>
                  <p className="font-mono text-[9px] text-neutral-400 tracking-wider uppercase mt-0.5 font-bold">{t.about.founderRole}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10 text-left">
            <ScrollReveal yOffset={30}>
              <div className="flex flex-col gap-5">
                <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-neutral-900 uppercase">
                  {lang === 'id' ? 'MENDOMINASI PRESTISE VISUAL & KATA NARATIF' : 'DOMINATING VISUAL PRESTIGE & NARRATIVE FORM'}
                </h3>
                <p className="font-sans text-neutral-600 text-sm md:text-base leading-relaxed">
                  {t.about.storyParagraph1}
                </p>
                <p className="font-sans text-neutral-600 text-sm md:text-base leading-relaxed">
                  {t.about.storyParagraph2}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <ScrollReveal yOffset={25} delay={0.1} className="h-full">
                <div className="p-6 bg-white border border-neutral-200 rounded-sm text-left group hover:border-black/30 transition-all duration-300 shadow-xs h-full flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-sm bg-neutral-950 flex items-center justify-center mb-4 text-white group-hover:scale-105 transition-transform duration-300">
                      <Binary className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-sans font-extrabold text-xs tracking-wider uppercase text-black mb-2">
                      {lang === 'id' ? 'INTEGRASI SIBERNETIK' : 'CYBERNETIC CO-PILOTS'}
                    </h4>
                    <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                      {lang === 'id' 
                        ? 'Memadukan kerangka kerja komputasi khusus untuk memangkas proses kerja manual agensi.' 
                        : 'Unifying custom mathematical processing nodes to eliminate administrative agency bloating.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal yOffset={25} delay={0.2} className="h-full">
                <div className="p-6 bg-white border border-neutral-200 rounded-sm text-left group hover:border-black/30 transition-all duration-300 shadow-xs h-full flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-sm bg-neutral-950 flex items-center justify-center mb-4 text-white group-hover:scale-105 transition-transform duration-300">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-sans font-extrabold text-xs tracking-wider uppercase text-black mb-2">
                      {lang === 'id' ? 'DESAIN SWISS PRESISI' : 'SWISS GRID STANDARDS'}
                    </h4>
                    <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                      {lang === 'id' 
                        ? 'Tata letak teoretis simetris dengan kepatuhan kontras sempurna standar miliaran dolar.' 
                        : 'Mathematical symmetric grids delivering unshakeable clarity and high conversion outcomes.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal yOffset={25} delay={0.3}>
              <div className="p-6 border-l-2 border-black bg-white rounded-r-sm shadow-sm border border-neutral-200 border-l-0">
                <h4 className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-400 mb-2">
                  {t.about.philosophyTitle}
                </h4>
                <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                  {t.about.philosophyText}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
