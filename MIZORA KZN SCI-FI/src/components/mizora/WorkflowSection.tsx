'use client';

import React, { useState } from 'react';
import { Network, Search, Compass, Sliders, CheckCircle2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface WorkflowSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function WorkflowSection({ t, lang }: WorkflowSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const getStepIcon = (index: number, isActive: boolean) => {
    const classes = `w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-500'}`;
    switch (index) {
      case 0: return <Search className={classes} />;
      case 1: return <Compass className={classes} />;
      case 2: return <Sliders className={classes} />;
      case 3: return <Award className={classes} />;
      default: return <CheckCircle2 className={classes} />;
    }
  };

  return (
    <section id="workflow" className="relative py-24 md:py-32 bg-[#FAFAFA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-[40%] left-[-150px] w-96 h-96 bg-neutral-200/35 opacity-25 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">04 // PRODUCTION PIPELINE</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase">
              {t.workflow.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-12 xl:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.workflow.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ScrollReveal yOffset={30}>
              <div className="flex flex-col gap-4">
                {t.workflow.steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(idx)}
                      className={`p-6 text-left border rounded-sm transition-all duration-300 cursor-pointer relative flex items-center justify-between gap-6 ${
                        isActive
                          ? 'bg-black border-black text-white shadow-xl scale-[1.01]'
                          : 'bg-white border-neutral-200/80 text-neutral-500 hover:border-black/30 hover:text-black shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-xs font-bold tracking-widest ${isActive ? 'text-white/70' : 'text-neutral-400'}`}>{step.id}</span>
                        <div>
                          <h3 className={`font-sans font-extrabold text-sm md:text-base tracking-tight uppercase ${isActive ? 'text-white' : 'text-black'}`}>
                            {step.title}
                          </h3>
                          <p className={`font-mono text-[9px] tracking-wider uppercase mt-1 font-bold ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                            {step.duration}
                          </p>
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white border-white text-black' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                      }`}>
                        {getStepIcon(idx, isActive)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6">
            <ScrollReveal yOffset={35} delay={0.1}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 bg-white border border-neutral-200 rounded-sm relative min-h-[380px] flex flex-col justify-between widget-3d"
                >
                  <span className="absolute top-3.5 right-6 font-mono text-[8.5px] text-neutral-400 tracking-wider font-bold">
                    PIPELINE_MODULE_ACTIVE // LOGIC_NODE_0{activeStep+1}
                  </span>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-black text-white font-black rounded-xs">
                        STAGE 0{activeStep+1}
                      </span>
                      <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest font-bold">
                        {t.workflow.steps[activeStep].duration}
                      </span>
                    </div>

                    <h3 className="font-sans font-black text-2xl text-black uppercase tracking-tight mb-4 leading-tight">
                      {t.workflow.steps[activeStep].title}
                    </h3>

                    <p className="font-sans text-neutral-600 text-xs md:text-sm leading-relaxed mb-8">
                      {t.workflow.steps[activeStep].description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100">
                    <h4 className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                      <Network className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{lang === 'id' ? 'HASIL KELUARAN (DELIVERABLES)' : 'EXPECTED WORKPLACE OUTCOMES'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {t.workflow.steps[activeStep].deliverables.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 p-3 bg-neutral-50 border border-neutral-200/80 rounded-xs hover:border-black/20 transition-all shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                          <span className="font-sans text-[11px] font-extrabold text-neutral-700 leading-tight uppercase">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal yOffset={20} delay={0.2}>
          <div className="hidden lg:grid grid-cols-4 gap-4 mt-16 p-4 border border-neutral-200 bg-white rounded-sm font-mono text-[9px] text-neutral-500 text-center shadow-xs">
            <div>
              <span className="text-black font-extrabold pr-1">NODE // DISCV:</span>
              MACS COGNITIVE MAPPING
            </div>
            <div>
              <span className="text-black font-extrabold pr-1">NODE // SYNTH:</span>
              MATLS SCHEMATIC DRAFTS
            </div>
            <div>
              <span className="text-black font-extrabold pr-1">NODE // EXEC:</span>
              MAUBS RESPONSIVE ASSEMBLY
            </div>
            <div>
              <span className="text-black font-extrabold pr-1">NODE // DELIV:</span>
              MALVCS QUALITY TELEMETRY
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
