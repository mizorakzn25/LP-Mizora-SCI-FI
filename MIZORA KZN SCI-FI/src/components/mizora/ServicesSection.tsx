'use client';

import React from 'react';
import { Cpu, Layers, Film, Volume2, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface ServicesSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function ServicesSection({ t, lang }: ServicesSectionProps) {
  const renderServiceIcon = (iconName: string) => {
    const classes = "w-4 h-4 text-black";
    switch (iconName) {
      case 'Cpu': return <Cpu className={classes} />;
      case 'Layers': return <Layers className={classes} />;
      case 'Film': return <Film className={classes} />;
      case 'Volume2': return <Volume2 className={classes} />;
      default: return <Shield className={classes} />;
    }
  };

  const handleApplyClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 85;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-24 md:py-32 bg-[#FAFAFA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[5%] w-[350px] h-[350px] rounded-full bg-neutral-200/40 opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">03 // TACTICAL SERVICES MATRIX</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase">
              {t.services.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.services.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.services.servicesList.map((service, idx) => (
            <ScrollReveal yOffset={35} delay={idx * 0.08} key={service.id} className="h-full">
              <div className="p-8 bg-white border border-neutral-200 rounded-sm hover:border-black/30 transition-all duration-300 flex flex-col justify-between relative group widget-3d h-full">
                <div className="absolute top-0 right-0 h-4 w-[1px] bg-neutral-200 transition-all group-hover:bg-black/40" />
                <div className="absolute top-0 right-0 w-4 h-[1px] bg-neutral-200 transition-all group-hover:bg-black/40" />

                <div className="text-left w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-8 h-8 rounded-sm bg-neutral-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 border border-neutral-200">
                      {renderServiceIcon(service.iconName)}
                    </div>
                    <span className="font-mono text-[9px] text-neutral-400 tracking-wider font-extrabold uppercase">
                      SERVICE // ID: {service.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-sans font-black text-xl md:text-2xl text-black tracking-tight uppercase mb-3">
                    {service.name}
                  </h3>
                  
                  <p className="font-sans text-neutral-500 text-xs md:text-sm leading-relaxed mb-6">
                    {service.benefit}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-100 mb-8 w-full">
                    <div>
                      <h4 className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase mb-3 font-bold">
                        {lang === 'id' ? 'LINGKUP UTAMA' : 'DELIVERY SCOPE'}
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {service.scope.map((item, idy) => (
                          <li key={idy} className="flex items-start gap-2 font-sans text-xs text-neutral-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase mb-3 font-bold">
                        {lang === 'id' ? 'FITUR OPERASIONAL' : 'INTELLIGENT REPUTATION'}
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {service.features.map((feature, idz) => (
                          <span key={idz} className="p-2 border border-neutral-200 bg-neutral-50 rounded-xs font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-600 shadow-2xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto w-full">
                  <div className="text-left">
                    <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest block mb-0.5 font-bold">TARGET OUTCOME</span>
                    <span className="font-mono text-xs font-black text-black uppercase">{service.targetMetric}</span>
                  </div>

                  <button
                    onClick={handleApplyClick}
                    className="p-2.5 px-4 bg-black border border-black hover:bg-neutral-50 hover:text-black hover:border-neutral-300 text-white transition-all duration-300 text-[10px] font-extrabold rounded-sm flex items-center gap-1.5 uppercase tracking-widest group-hover:scale-[1.01] active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>{t.services.getQuote}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
