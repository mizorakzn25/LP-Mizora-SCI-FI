'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Eye, X, BookOpen, Settings, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet, CaseStudy } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface PortfolioSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function PortfolioSection({ t, lang }: PortfolioSectionProps) {
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="relative py-24 md:py-32 bg-[#F8F8FA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-[30%] left-[-20px] w-96 h-96 bg-neutral-200/30 opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">06 // CHRONICLED INTELLIGENCE</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase">
              {t.portfolio.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.portfolio.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          {t.portfolio.projects.map((proj, idx) => (
            <ScrollReveal yOffset={35} delay={idx * 0.15} key={proj.id}>
              <div
                className="group cursor-pointer relative"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative overflow-hidden aspect-video w-full rounded-sm border border-neutral-200 bg-white p-2.5 mb-6 widget-3d">
                  <div className="absolute top-4 left-4 h-3 w-3 border-t border-l border-neutral-300 z-10" />
                  <div className="absolute top-4 right-4 h-3 w-3 border-t border-r border-neutral-300 z-10" />
                  <div className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-neutral-300 z-10" />
                  <div className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-neutral-300 z-10" />

                  <div className="overflow-hidden w-full h-full bg-neutral-50 rounded-xs flex items-center justify-center p-6 relative">
                    <Image 
                      src={proj.coverImg} 
                      alt={proj.title}
                      width={600}
                      height={340}
                      className="w-full h-full object-contain hover-img-refract relative z-10"
                      style={{ maxHeight: '170px' }}
                    />
                    <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <span className="font-mono text-[9px] text-white bg-black p-2.5 px-4 rounded-xs border border-neutral-800 flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'id' ? 'BUKA DOSEN STUDI KASUS' : 'OPEN COGNITIVE DOSSIER'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{proj.category}</span>
                  <span className="h-1 w-1 bg-neutral-300 rounded-full" />
                  <span className="font-mono text-[9px] text-neutral-500 font-bold tracking-wider uppercase">CLIENT: {proj.client}</span>
                </div>

                <h3 className="font-sans font-black text-xl md:text-2xl text-black tracking-tight uppercase group-hover:text-neutral-700 transition-colors mb-3">
                  {proj.title}
                </h3>

                <p className="font-sans text-neutral-600 text-xs md:text-sm leading-relaxed max-w-xl group-hover:text-neutral-800 transition-colors line-clamp-2">
                  {proj.story}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-black text-xs font-extrabold uppercase tracking-widest group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>{t.portfolio.viewCaseStudy}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black shrink-0" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 md:bg-black/40 md:backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Case study details"
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-neutral-300 rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left"
            >
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close case study"
                className="absolute top-4 right-4 md:right-6 md:top-6 p-1.5 text-neutral-500 hover:text-black border border-neutral-200 bg-white rounded-sm active:scale-92 cursor-pointer transition-transform z-10 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 border-b border-neutral-200 bg-neutral-50/80 relative overflow-hidden">
                <div className="absolute top-3 left-8 font-mono text-[8.5px] text-neutral-400 tracking-[0.2em] uppercase font-bold">MIZORA INTEL CASE-FILE</div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-6">
                  <div className="md:col-span-8">
                    <span className="font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-widest block mb-2">
                      {selectedProject.category}
                    </span>
                    <h2 className="font-sans font-black text-2xl md:text-3xl text-black tracking-tighter uppercase mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="font-mono text-xs text-neutral-500 font-bold">
                      {lang === 'id' ? 'MITRA REKANAN' : 'ENTERPRISE PATRON'}: <span className="text-black font-extrabold">{selectedProject.client}</span>
                    </p>
                  </div>

                  <div className="md:col-span-4 p-4 bg-white border border-neutral-200 rounded-xs font-mono text-[10px] text-neutral-600 flex flex-col gap-1.5 self-stretch justify-center shadow-xs">
                    <div>
                      <span className="text-black font-extrabold pr-1">YEAR:</span>
                      {selectedProject.metadata.year}
                    </div>
                    <div>
                      <span className="text-black font-extrabold pr-1">ROLE:</span>
                      {selectedProject.metadata.role}
                    </div>
                    <div>
                      <span className="text-black font-extrabold pr-1">TECH:</span>
                      {selectedProject.metadata.tech}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 bg-white">
                <div className="md:col-span-7 flex flex-col gap-6">
                  <div>
                    <h3 className="font-mono text-[9.5px] font-bold tracking-widest text-neutral-400 uppercase mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{lang === 'id' ? 'RIWAYAT & TANTANGAN' : 'THE HISTORIC CHALLENGE'}</span>
                    </h3>
                    <p className="font-sans text-neutral-600 text-xs md:text-sm leading-relaxed">
                      {selectedProject.story}
                    </p>
                  </div>

                  <div className="p-5 border-l-2 border-black bg-neutral-50 rounded-r-xs border border-neutral-200 border-l-0">
                    <h3 className="font-mono text-[9.5px] font-bold tracking-widest text-black uppercase mb-2">
                      {lang === 'id' ? 'SASARAN STRATEGIS' : 'THE CRITICAL OBJECTIVE'}
                    </h3>
                    <p className="font-sans text-neutral-500 text-xs leading-relaxed">
                      {selectedProject.objective}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[9.5px] font-bold tracking-widest text-neutral-400 uppercase mb-3 flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-neutral-500 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{lang === 'id' ? 'HASIL KOMPUTASI AKTIF' : 'COMPUTATIONAL RESULTS'}</span>
                    </h3>
                    <p className="font-sans text-neutral-600 text-xs md:text-sm leading-relaxed">
                      {selectedProject.result}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-6">
                  <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <h3 className="font-mono text-[9.5px] font-bold tracking-[0.25em] text-neutral-400 uppercase mb-4">
                      {lang === 'id' ? 'ALUR PROSES EKSEKUSI' : 'EXECUTION ARCHITECTURE'}
                    </h3>
                    <ul className="flex flex-col gap-4 font-sans text-xs">
                      {selectedProject.process.map((stepText, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-left">
                          <span className="font-mono text-black font-extrabold text-[11px]">0{sIdx+1}</span>
                          <span className="text-neutral-600 leading-relaxed font-bold uppercase text-[10px]">{stepText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 border border-neutral-200 bg-neutral-950 text-white rounded-xs relative overflow-hidden shadow-md">
                    <div className="absolute top-[4px] right-4 font-mono text-[6px] text-neutral-600 tracking-[0.25em] block uppercase font-bold">KPI_MONITOR</div>
                    <h3 className="font-mono text-[9.5px] font-bold tracking-widest text-white uppercase mb-4 opacity-70">
                      {lang === 'id' ? 'DAMPAK SIBERNETIK' : 'CYBERNETIC IMPACT'}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {selectedProject.impact.map((imp, impIdx) => (
                        <div key={impIdx} className="flex items-center gap-2.5 font-sans text-xs text-neutral-300 border-b border-white/5 pb-2 last:border-none last:pb-0">
                          <CircleDot className="w-3.5 h-3.5 text-white/50 shrink-0" />
                          <span className="uppercase font-extrabold text-[10px] tracking-wider">{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200 flex justify-end bg-neutral-50">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-sans font-extrabold text-xs uppercase tracking-widest rounded-sm active:scale-95 cursor-pointer transition-all duration-300 shadow-sm"
                >
                  {t.portfolio.closeCaseStudy}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
