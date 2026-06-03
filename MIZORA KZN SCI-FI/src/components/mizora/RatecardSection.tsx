'use client';

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Check, FileText, Landmark, Clock, Users, TrendingUp } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface RatecardSectionProps {
  t: TranslationSet;
  lang: Language;
}

export default function RatecardSection({ t, lang }: RatecardSectionProps) {
  const [basicAddons, setBasicAddons] = useState<boolean[]>([false, false]);
  const [standardAddons, setStandardAddons] = useState<boolean[]>([false, false]);
  const [premiumAddons, setPremiumAddons] = useState<boolean[]>([false, false]);
  const [activeTab, setActiveTab] = useState<'pricelist' | 'invoice' | 'points'>('pricelist');

  const handleApplyClick = (pkgName: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const messageField = document.getElementById('form-message') as HTMLTextAreaElement;
      if (messageField) {
        messageField.value = lang === 'id' 
          ? `Halo Mizora Core Team, saya tertarik dengan paket ${pkgName}. Silakan jadwalkan konsultasi gratis.`
          : `Hello Mizora Core Team, I am interested in the ${pkgName} configuration. Please coordinate an enterprise consultation.`;
      }
      const headerOffset = 85;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const getNumericalBase = (priceStr: string) => {
    return parseFloat(priceStr.replace(/\./g, '').replace(/,/g, ''));
  };

  const formatPrice = (value: number) => {
    return lang === 'id' 
      ? value.toLocaleString('id-ID') 
      : value.toLocaleString('en-US');
  };

  const getAddonCost = (pkgId: string, index: number) => {
    if (lang === 'id') {
      if (pkgId === 'pkg-basic') return index === 0 ? 22000000 : 18000000;
      if (pkgId === 'pkg-standard') return index === 0 ? 30000000 : 25000000;
      return index === 0 ? 45000000 : 35000000;
    } else {
      if (pkgId === 'pkg-basic') return index === 0 ? 1500 : 1200;
      if (pkgId === 'pkg-standard') return index === 0 ? 2000 : 1600;
      return index === 0 ? 3000 : 2200;
    }
  };

  const getAddonLabel = (pkgId: string, index: number) => {
    if (pkgId === 'pkg-basic') {
      return index === 0 
        ? (lang === 'id' ? 'Sistem chat AI (+Rp 22jt)' : 'AI Proxy Chat Hub (+$1.5k)')
        : (lang === 'id' ? 'Lagu fokus audio (+Rp 18jt)' : 'Custom Solfeggio Audio (+$1.2k)');
    } else if (pkgId === 'pkg-standard') {
      return index === 0
        ? (lang === 'id' ? 'Garansi SLA bisnis (+Rp 30jt)' : 'Enterprise Operational SLA (+$2.0k)')
        : (lang === 'id' ? 'Visual session harian (+Rp 25jt)' : 'MALVCS Visual Capture Daily Session (+$1.6k)');
    } else {
      return index === 0
        ? (lang === 'id' ? 'Sesi desain onsite (+Rp 45jt)' : 'Onsite Physical Design Retreat (+$3.0k)')
        : (lang === 'id' ? 'Fine-tuning asisten kustom (+Rp 35jt)' : 'Sovereign Tuning Operations (+$2.2k)');
    }
  };

  const historicalProjects = [
    {
      name: lang === 'id' ? 'Portal Korporasi Aera' : 'Aera Corporate Ecosystem',
      client: 'Aera Labs Tokyo',
      type: lang === 'id' ? 'Full-Scale Platform' : 'Full-Scale Platform',
      price: lang === 'id' ? 'Rp 145.000.000' : '$9,600',
      status: lang === 'id' ? 'Sukses Direalisasi' : 'Success Deployed'
    },
    {
      name: lang === 'id' ? 'Arsitektur Desain Sartre' : 'Sartre Brand Design Architecture',
      client: 'Sartre Europe Tech',
      type: lang === 'id' ? 'Sistem Desain & Web' : 'Design System & Web app',
      price: lang === 'id' ? 'Rp 95.000.000' : '$6,300',
      status: lang === 'id' ? 'Selesai & SLA Aktif' : 'Signed & SLA Active'
    },
    {
      name: lang === 'id' ? 'Akses Sandbox Terrigen' : 'Terrigen Global Sandbox UI',
      client: 'Terrigen Corp SF',
      type: lang === 'id' ? 'Antarmuka Web 3D' : '3D Web Interfaces',
      price: lang === 'id' ? 'Rp 180.000.000' : '$12,000',
      status: lang === 'id' ? 'Sukses Migrasi' : 'Success Migrated'
    },
    {
      name: lang === 'id' ? 'Situs Khusus Tokyo.CG' : 'Tokyo CG Web Orchestrator',
      client: 'Tokyo Creative Group',
      type: lang === 'id' ? 'Portofolio Interaktif' : 'Interactive Portfolio',
      price: lang === 'id' ? 'Rp 75.000.000' : '$5,000',
      status: lang === 'id' ? 'Selesai & Berjalan' : 'Completed & Stable'
    }
  ];

  return (
    <section id="ratecard" className="relative py-24 md:py-32 bg-[#F8F8FA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute top-[40%] right-[-100px] w-96 h-96 bg-neutral-200/30 opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">05 // VALUE ARTIFACT MATRIX</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase">
              {t.ratecard.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.ratecard.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20 text-left">
          {t.ratecard.packages.map((pkg, idx) => {
            const basePriceNum = getNumericalBase(pkg.price);
            let addonSum = 0;
            const isBasic = pkg.id === 'pkg-basic';
            const isStandard = pkg.id === 'pkg-standard';
            const activeAddonsState = isBasic ? basicAddons : isStandard ? standardAddons : premiumAddons;
            const setAddonsState = isBasic ? setBasicAddons : isStandard ? setStandardAddons : setPremiumAddons;

            activeAddonsState.forEach((val, i) => {
              if (val) addonSum += getAddonCost(pkg.id, i);
            });

            const totalPriceNum = basePriceNum + addonSum;
            const totalPriceStr = formatPrice(totalPriceNum);

            return (
              <ScrollReveal yOffset={35} delay={idx * 0.1} key={pkg.id} className="h-full">
                <div
                  className={`p-8 rounded-sm flex flex-col justify-between border relative cursor-default transition-all duration-300 widget-3d h-full ${
                    isStandard 
                      ? 'bg-neutral-950 text-white border-neutral-900 shadow-2xl scale-[1.01] z-10' 
                      : 'bg-white text-black border-neutral-200/80 hover:border-black/30'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute top-[-11px] left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white border border-neutral-800 font-mono text-[8.5px] font-bold uppercase tracking-[0.2em] rounded-xs shadow-md z-20">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    <div className={`flex items-center justify-between border-b pb-6 mb-6 ${isStandard ? 'border-white/10' : 'border-neutral-100'}`}>
                      <div>
                        <span className="font-mono text-[8px] tracking-widest uppercase mb-1 font-bold opacity-60">PRICING_FILE_0{idx+1}</span>
                        <h3 className="font-sans font-black text-xl tracking-tight uppercase">{pkg.name}</h3>
                      </div>
                      <span className="font-mono text-[9px] uppercase font-extrabold tracking-wider bg-current/10 px-2 py-0.5 rounded-xs">[ {pkg.timeline} ]</span>
                    </div>

                    <div className="mb-6 flex items-baseline">
                      <span className="font-mono text-xs font-bold mr-1 opacity-70">
                        {lang === 'id' ? 'Rp' : 'Est. $'}
                      </span>
                      <span className="font-mono text-3xl md:text-4xl font-black tracking-tighter">
                        {totalPriceStr}
                      </span>
                      <span className="font-mono text-[9px] font-bold opacity-50 ml-2 tracking-wide uppercase">
                        / FIX
                      </span>
                    </div>

                    <p className={`font-sans text-xs leading-relaxed mb-6 pb-6 border-b ${isStandard ? 'text-neutral-400 border-white/10' : 'text-neutral-500 border-neutral-100'}`}>
                      {pkg.focus}
                    </p>

                    <div className="mb-8">
                      <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase mb-4 opacity-60">
                        {lang === 'id' ? 'CAKUPAN HASIL DESAIN' : 'CORE DELIVERABLES'}
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {pkg.deliverables.map((del, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 font-sans text-xs">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isStandard ? 'text-emerald-400' : 'text-black'}`} />
                            <span className={isStandard ? 'text-neutral-300' : 'text-neutral-700'}>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 py-4 border-t border-b my-6 font-sans text-xs ${isStandard ? 'border-white/10' : 'border-neutral-100'}`}>
                      <div>
                        <span className="font-mono text-[8px] opacity-50 uppercase block mb-1 font-bold">REVISIONS QUEUE</span>
                        <span className="font-extrabold">{pkg.revisions}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] opacity-50 uppercase block mb-1 font-bold">TIMELINE MATRIX</span>
                        <span className="font-extrabold">{pkg.timeline}</span>
                      </div>
                    </div>

                    <div className={`mb-6 p-4 rounded-sm border ${
                      isStandard ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200/60 text-black shadow-2xs'
                    }`}>
                      <h4 className="font-mono text-[9.5px] font-extrabold tracking-widest uppercase mb-3 flex items-center justify-between">
                        <span>{t.ratecard.addonsTitle}</span>
                        <span className="text-[8px] opacity-50 font-mono">CHOOSE // ADD</span>
                      </h4>
                      <div className="flex flex-col gap-3">
                        {[0, 1].map((addonIdx) => (
                          <label 
                            key={addonIdx} 
                            className="flex items-center justify-between gap-3 font-sans text-xs cursor-pointer select-none py-1 group"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={activeAddonsState[addonIdx]}
                                onChange={(e) => {
                                  const copy = [...activeAddonsState];
                                  copy[addonIdx] = e.target.checked;
                                  setAddonsState(copy);
                                }}
                                className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer w-3.5 h-3.5"
                              />
                              <span className={`opacity-80 group-hover:opacity-100 transition-opacity font-bold text-[11px] ${
                                isStandard ? 'text-neutral-300' : 'text-neutral-700'
                              }`}>
                                {getAddonLabel(pkg.id, addonIdx)}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyClick(pkg.name)}
                    className={`w-full py-3.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                      isStandard 
                        ? 'bg-white text-black hover:bg-neutral-200 border-white shadow-md' 
                        : 'bg-black text-white hover:bg-neutral-900 border-black shadow-xs'
                    }`}
                  >
                    <span>{t.ratecard.getStarted}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 hover:translate-x-0.5" />
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal yOffset={30}>
          <div className="p-1 bg-white border border-neutral-200 rounded-sm shadow-xl mt-12 overflow-hidden widget-3d">
            <div className="flex flex-col sm:flex-row border-b border-neutral-100 bg-neutral-50/50">
              <button
                onClick={() => setActiveTab('pricelist')}
                className={`flex-1 py-4 px-6 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'pricelist' ? 'bg-white text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black hover:bg-neutral-100/50'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>{lang === 'id' ? 'Daftar Project List Harga' : 'Project Cost Directory'}</span>
              </button>

              <button
                onClick={() => setActiveTab('invoice')}
                className={`flex-1 py-4 px-6 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'invoice' ? 'bg-white text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black hover:bg-neutral-100/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'id' ? 'Bukti Fisik / Mock Invoice' : 'Visual Spec & Mock Invoice'}</span>
              </button>

              <button
                onClick={() => setActiveTab('points')}
                className={`flex-1 py-4 px-6 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'points' ? 'bg-white text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black hover:bg-neutral-100/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'id' ? 'Penjelasan Point Komitmen' : 'Pillars Explanation'}</span>
              </button>
            </div>

            <div className="p-6 md:p-8 text-left bg-white">
              {activeTab === 'pricelist' && (
                <div className="overflow-x-auto">
                  <p className="font-sans text-xs text-neutral-500 mb-6 leading-relaxed">
                    {lang === 'id' 
                      ? 'Berikut adalah catatan riwayat realisasi pengerjaan sistem digital transparan oleh Rendy Awan / Mizora KZN bagi klien global kami.'
                      : 'Verified archival cost listing compiled from historical production records. 100% transparent standard billing matrix with zero hidden costs.'}
                  </p>
                  <table className="w-full text-left border-collapse font-sans text-xs min-w-[600px] mb-4">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[9px] tracking-wider uppercase font-extrabold pb-3">
                        <th className="py-3 pr-4">{lang === 'id' ? 'NAMA PROYEK' : 'PROJECT INITIATIVE'}</th>
                        <th className="py-3 px-4">{lang === 'id' ? 'KATEGORI KLIEN' : 'ORGANIZATION'}</th>
                        <th className="py-3 px-4">{lang === 'id' ? 'JENIS SISTEM' : 'ARCH TYPE'}</th>
                        <th className="py-3 px-4 text-right">{lang === 'id' ? 'TOTAL INVESTASI' : 'INVESTMENT FLAT'}</th>
                        <th className="py-3 pl-4 text-right">{lang === 'id' ? 'STATUS OPERASI' : 'OPERATION STATE'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {historicalProjects.map((proj, index) => (
                        <tr key={index} className="hover:bg-neutral-50/50 transition-all font-bold text-neutral-800">
                          <td className="py-3.5 pr-4 text-black font-extrabold">{proj.name}</td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-500">{proj.client}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-sm text-[10px]">
                              {proj.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-black text-sm">{proj.price}</td>
                          <td className="py-3.5 pl-4 text-right">
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-600 font-mono">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                              {proj.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'invoice' && (
                <div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-center">
                  <div className="md:col-span-5 flex flex-col justify-center gap-4">
                    <span className="font-mono text-[8.5px] text-neutral-400 tracking-[0.2em] font-bold uppercase block">SECURE BLOCK // RECEIPT SPECIMEN</span>
                    <h3 className="font-sans font-black text-xl text-black uppercase tracking-tight leading-tight">
                      {lang === 'id' ? 'SISTEM INVOICE TRANSPARAN MIZORA KZN' : 'MIZORA TRANSPARENT BILLING SYSTEM'}
                    </h3>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {lang === 'id'
                        ? 'Setiap penagihan diterbitkan melalui laporan rincian terintegrasi (SLA Invoice Ledger). Komponen biaya dipisahkan secara transparan.'
                        : 'Every contract is fully broken down inside a comprehensive cryptographic invoice spec. We eliminate generic package formulas to detail structural components directly.'}
                    </p>
                    <div className="p-4 bg-neutral-50 rounded-sm border border-neutral-200 text-xs text-neutral-600 font-mono space-y-2">
                      <div className="flex justify-between border-b border-neutral-200/60 pb-1.5 mb-1.5 font-bold text-black text-[10px]">
                        <span>ITEM DESCRIPTION</span>
                        <span>VALUE SPEC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>01 / DESIGN DIRECTION (UI/UX)</span>
                        <span>40% OF FLAT BASE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>02 / COPYWRITING & PHILOSOPHY</span>
                        <span>25% OF FLAT BASE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>03 / MACHINE CODE INTEGRATION</span>
                        <span>35% OF FLAT BASE</span>
                      </div>
                      <div className="flex justify-between font-bold text-black border-t border-neutral-200/65 pt-2">
                        <span>COMMITTED AGENCY FEE</span>
                        <span className="text-emerald-600">Rp 0 / NIL</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-sm p-5 bg-neutral-900 border border-neutral-800 text-white rounded-sm font-mono text-[10px] space-y-4 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-10 w-[1px] bg-white/10" />
                      <div className="absolute top-0 right-0 w-10 h-[1px] bg-white/10" />
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <div>
                          <p className="font-extrabold text-[11px] text-white tracking-widest">MIZORA_RECEIPT</p>
                          <p className="text-[7.5px] text-neutral-500">ID: #MZR-9082-KZN</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black tracking-widest uppercase">PAID // SECURED</span>
                      </div>
                      <div className="space-y-2 text-neutral-300">
                        <div className="flex justify-between">
                          <span>CLIENT COGNITION:</span>
                          <span className="text-white">AERA_LABS_TOKYO</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PROD SYSTEM:</span>
                          <span className="text-white">MACS // SYNTHESIS</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HASH METRIC:</span>
                          <span className="text-neutral-500 select-all">0x9F0..82EC</span>
                        </div>
                      </div>
                      <div className="border-t border-dashed border-white/10 pt-3 text-neutral-300 space-y-1.5">
                        <div className="flex justify-between">
                          <span>BASE FEE:</span>
                          <span className="text-white">Rp 95.000.000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SLA PREMIUM DIRECTED:</span>
                          <span className="text-white">Rp 0 (INCLUDED)</span>
                        </div>
                        <div className="flex justify-between text-white font-extrabold text-[11px] border-t border-white/10 pt-2 text-emerald-400">
                          <span>TOTAL SECURED:</span>
                          <span>Rp 95.000.000</span>
                        </div>
                      </div>
                      <div className="text-center text-[7px] text-neutral-500 pt-1 tracking-widest">
                        THANKS FOR CHOOSING MIZORA CYBERNETICS
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'points' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-neutral-50 border border-neutral-200/80 rounded-sm">
                    <div className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center text-white mb-3 shadow-sm">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-sans font-black text-xs uppercase tracking-wider text-black mb-2">
                      {lang === 'id' ? 'ESTIMASI WAKTU AKURAT' : 'PRECISE TIME ESTIMATES'}
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {lang === 'id'
                        ? 'Waktu pengerjaan ditetapkan secara transparan di awal kontrak. Proses validasi tiap tahapan disinkronisasi langsung menggunakan alur kerja production pipeline kami.'
                        : 'Delivery sprint times are locked in from day one. Stage progress syncs directly to our modular timeline pipeline to ensure zero friction or delay.'}
                    </p>
                  </div>

                  <div className="p-5 bg-neutral-50 border border-neutral-200/80 rounded-sm">
                    <div className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center text-white mb-3 shadow-sm">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-sans font-black text-xs uppercase tracking-wider text-black mb-2">
                      {lang === 'id' ? 'GARANSI RETUR & REVISI' : 'VALID REVISIONS MATRIX'}
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {lang === 'id'
                        ? 'Kami melakukan iterasi visual secara terstruktur. Jumlah revisi murni diuji sesuai dengan matriks parameter kebutuhan fungsional tanpa limit bertele-tele.'
                        : 'Visual iterations are structured under clear requirements constraints to protect clarity, maximizing speed and aesthetic authenticity.'}
                    </p>
                  </div>

                  <div className="p-5 bg-neutral-50 border border-neutral-200/80 rounded-sm">
                    <div className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center text-white mb-3 shadow-sm">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-sans font-black text-xs uppercase tracking-wider text-black mb-2">
                      {lang === 'id' ? 'TANPA MARK-UP AGENSI' : 'ZERO INTERMEDIARY FEES'}
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {lang === 'id'
                        ? 'Investasi diarahkan murni pada peningkatkan kualitas visual 3D, copywriting narasi mendalam, dan logic machine. Anda bekerja langsung dengan top engineer.'
                        : 'Billing is 100% focused on architectural engineering, 3D assets rendering, and narrative direction. No administrative sales mark-ups.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={25} delay={0.15}>
          <div className="p-6 border border-neutral-200/80 bg-white rounded-sm mt-10 text-center shadow-xs">
            <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest max-w-4xl mx-auto leading-relaxed font-bold">
              {t.ratecard.billingSubtitle}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
