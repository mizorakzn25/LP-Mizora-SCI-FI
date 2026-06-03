'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface FaqSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function FaqSection({ t, lang }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-[#FAFAFA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-[10%] right-[-100px] w-96 h-96 bg-neutral-200/30 opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        <div className="text-center mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 block font-bold">07 // REPEATED INTEL INQUIRIES</span>
          <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase mb-4 leading-none">
            {t.faq.sectionTitle}
          </h2>
          <p className="font-sans font-medium text-base text-neutral-500 tracking-tight leading-relaxed max-w-2xl mx-auto">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {t.faq.faqsList.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <ScrollReveal yOffset={25} delay={idx * 0.05} key={faq.id}>
                <div
                  className={`border rounded-sm transition-all duration-300 select-none overflow-hidden bg-white shadow-xs widget-3d ${
                    isOpen ? 'border-black/30 bg-neutral-50/10' : 'border-neutral-200/80 hover:border-black/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${faq.id}`}
                    className="w-full p-6 text-left flex items-center justify-between gap-6 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span className="font-mono text-xs font-black text-neutral-400">0{idx+1}</span>
                      <h3 className="font-sans font-black text-xs md:text-[14px] text-black tracking-tight uppercase leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-sm border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-black border-black text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                    }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div id={`faq-content-${faq.id}`} role="region" className="px-6 pb-6 pt-2 border-t border-neutral-100 text-left">
                          <p className="font-sans text-xs md:text-sm text-neutral-600 leading-relaxed max-w-3xl">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal yOffset={15} delay={0.2}>
          <div className="mt-12 text-center p-4 border border-dashed border-neutral-300 bg-white rounded-sm font-mono text-[9px] text-neutral-400 tracking-wider font-bold">
            {lang === 'id' 
              ? 'PUNYA PERTANYAAN KHUSUS LAINNYA? TRANSMISIKAN PESAN ANDA DI SECURE FORM KAMI DI BAWAH.' 
              : 'POSSESS SPECIFIC CORE QUERIES? INITIATE A TRANSMISSION IN THE SECURE AREA BELOW.'}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
