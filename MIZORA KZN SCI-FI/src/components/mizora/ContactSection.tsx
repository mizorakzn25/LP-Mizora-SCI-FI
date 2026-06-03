'use client';

import React, { useState } from 'react';
import { MapPin, Clock, MessageSquare, Check, RefreshCw, SendHorizontal, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface ContactSectionProps {
  t: TranslationSet;
  lang: Language;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
  timestamp: string;
}

export default function ContactSection({ t, lang }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [service, setService] = useState('svc-01');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedInquiries, setSavedInquiries] = useState<Inquiry[]>(() => {
    try {
      const stored = localStorage.getItem('mizora_inquiries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleWhatsAppDirect = () => {
    const text = lang === 'id'
      ? `Halo Mizora Core Team, saya ingin menjadwalkan konsultasi kustom.`
      : `Hello Mizora Core Team, I would like to schedule a custom collaboration session.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/628111111111?text=${encoded}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (name.length < 2) newErrors.name = lang === 'id' ? 'Nama minimal 2 karakter' : 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = lang === 'id' ? 'Format email tidak valid' : 'Invalid email format';
    if (whatsapp.length < 8) newErrors.whatsapp = lang === 'id' ? 'Nomor WhatsApp minimal 8 digit' : 'WhatsApp number must be at least 8 characters';
    if (message.length < 10) newErrors.message = lang === 'id' ? 'Pesan minimal 10 karakter' : 'Message must be at least 10 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setStatus('submitting');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, service, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setWhatsapp('');
      setService('svc-01');
      setMessage('');
    } catch {
      setApiError(lang === 'id' ? 'Gagal mengirim pesan. Silakan coba lagi.' : 'Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#F8F8FA] border-b border-neutral-200/60 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-[0.25] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-neutral-200/30 opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20 pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-5 flex flex-col justify-end text-left">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-2 font-bold">09 // INQUIRY DISPATCH CORE</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black tracking-tighter uppercase leading-none">
              {t.contact.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end text-left">
            <p className="font-sans font-medium text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed max-w-2xl">
              {t.contact.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ScrollReveal yOffset={30}>
              <div className="p-6 bg-white border border-neutral-200 rounded-sm relative overflow-hidden widget-3d">
                <span className="font-mono text-[8.5px] text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                  {t.contact.availability}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 sci-fi-pulse shrink-0" />
                  <span className="font-sans font-black text-sm text-black tracking-tight uppercase">
                    {t.contact.availableStatus}
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-500 leading-relaxed max-w-sm mb-6">
                  {t.contact.responseGuarantee}
                </p>

                <button
                  onClick={handleWhatsAppDirect}
                  className="w-full py-3.5 bg-black text-white hover:bg-neutral-800 border border-black text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-none"
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-white" />
                  <span>{lang === 'id' ? 'KONSULTASI CHAT TELEMETRI' : 'COGNITIVE WHATSAPP DIRECT'}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={25} delay={0.1}>
              <div className="flex flex-col gap-4 font-sans text-xs text-neutral-600">
                <h4 className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-1">
                  {t.contact.contactInfoTitle}
                </h4>
                <div className="flex items-center gap-3 p-3.5 bg-white border border-neutral-200 rounded-sm shadow-2xs">
                  <MapPin className="w-4 h-4 text-black shrink-0" />
                  <span>{t.contact.location}</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-white border border-neutral-200 rounded-sm shadow-2xs">
                  <Clock className="w-4 h-4 text-black shrink-0" />
                  <span>RESPONSE SLA: ENCRYPTED WITHIN 4 BUSINESS HOURS</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} delay={0.15}>
              <div>
                <h4 className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-4">
                  AUTHENTICATED SOCIAL CREDENTIALS
                </h4>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/mizoramp" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="w-10 h-10 border border-neutral-200 hover:border-black hover:text-black rounded-sm bg-white flex items-center justify-center text-neutral-500 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://twitter.com/mizora_kzn" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="Twitter / X"
                    className="w-10 h-10 border border-neutral-200 hover:border-black hover:text-black rounded-sm bg-white flex items-center justify-center text-neutral-500 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/rendy-awan-mizora" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 border border-neutral-200 hover:border-black hover:text-black rounded-sm bg-white flex items-center justify-center text-neutral-500 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal yOffset={35} delay={0.15}>
              <div className="p-8 bg-white border border-neutral-200 rounded-sm shadow-xl relative widget-3d">
                <span className="absolute top-3.5 right-6 font-mono text-[7.5px] text-neutral-400 tracking-wider font-bold">
                  CIPHER: SHA-256 // END-TO-END SECURED
                </span>

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-8 border border-neutral-200 bg-neutral-50 rounded-sm text-center flex flex-col items-center justify-center min-h-[400px]"
                    >
                      <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center text-black mb-6 animate-pulse">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="font-sans font-black text-xl md:text-2xl text-black uppercase tracking-tight mb-3">
                        {lang === 'id' ? 'TRANSMISI SELESAI' : 'TRANSMISSION DELIVERED'}
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-neutral-600 leading-relaxed max-w-sm mb-8">
                        {t.contact.formSuccess}
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="px-6 py-2.5 border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors text-xs font-mono tracking-widest uppercase cursor-pointer bg-white"
                      >
                        {lang === 'id' ? '[ ULANGI TRANSMISI ]' : '[ TRANSMIT NEW SESSION ]'}
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} aria-label="Contact form" className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="form-name" className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                          {t.contact.formName} *
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.name; return next; }); }}
                          placeholder={t.contact.formPlaceholderName}
                          disabled={status === 'submitting'}
                          className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/50 focus:border-black font-sans text-sm outline-none text-black rounded-sm transition-colors placeholder:text-neutral-400"
                          aria-describedby={errors.name ? 'error-name' : undefined}
                        />
                        {errors.name && <span id="error-name" role="alert" className="text-red-500 font-mono text-[9px] mt-1">{errors.name}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 text-left">
                          <label htmlFor="form-email" className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                            {t.contact.formEmail} *
                          </label>
                          <input
                            id="form-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.email; return next; }); }}
                            placeholder={t.contact.formPlaceholderEmail}
                            disabled={status === 'submitting'}
                            className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/50 focus:border-black font-sans text-sm outline-none text-black rounded-sm transition-colors placeholder:text-neutral-400"
                            aria-describedby={errors.email ? 'error-email' : undefined}
                          />
                          {errors.email && <span id="error-email" role="alert" className="text-red-500 font-mono text-[9px] mt-1">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                          <label htmlFor="form-whatsapp" className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                            {t.contact.formWhatsApp} *
                          </label>
                          <input
                            id="form-whatsapp"
                            type="text"
                            required
                            value={whatsapp}
                            onChange={(e) => { setWhatsapp(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.whatsapp; return next; }); }}
                            placeholder={t.contact.formPlaceholderWhatsApp}
                            disabled={status === 'submitting'}
                            className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/50 focus:border-black font-sans text-sm outline-none text-black rounded-sm transition-colors placeholder:text-neutral-400"
                            aria-describedby={errors.whatsapp ? 'error-whatsapp' : undefined}
                          />
                          {errors.whatsapp && <span id="error-whatsapp" role="alert" className="text-red-500 font-mono text-[9px] mt-1">{errors.whatsapp}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="form-service" className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                          {t.contact.formService}
                        </label>
                        <select
                          id="form-service"
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          disabled={status === 'submitting'}
                          className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/50 focus:border-black font-sans text-sm outline-none text-black rounded-sm cursor-pointer transition-colors"
                        >
                          <option value="svc-01">Enterprise Cognitive Strategy (MACS Core)</option>
                          <option value="svc-02">High-Fidelity Interface Design (Swiss Grid)</option>
                          <option value="svc-03">Futuristic Visual Production (MAOVDS Core)</option>
                          <option value="svc-04">Sound & Audio Strategy (MASDM Core)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="form-message" className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                          {t.contact.formMessage} *
                        </label>
                        <textarea
                          id="form-message"
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => { setMessage(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.message; return next; }); }}
                          placeholder={t.contact.formPlaceholderMessage}
                          disabled={status === 'submitting'}
                          className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/50 focus:border-black font-sans text-sm outline-none text-black rounded-sm transition-colors placeholder:text-neutral-400 resize-none"
                          aria-describedby={errors.message ? 'error-message' : undefined}
                        />
                        {errors.message && <span id="error-message" role="alert" className="text-red-500 font-mono text-[9px] mt-1">{errors.message}</span>}
                      </div>

                      {apiError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 font-mono text-[10px]">
                          {apiError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-black hover:bg-neutral-800 text-white border border-black rounded-sm font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-none disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400"
                      >
                        {status === 'submitting' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{t.contact.formSubmitting}</span>
                          </>
                        ) : (
                          <>
                            <SendHorizontal className="w-4 h-4" />
                            <span>{t.contact.formSubmit}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
