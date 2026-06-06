'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/mizora/Header';
import HeroSection from '@/components/mizora/HeroSection';
import LoadingScreen from '@/components/mizora/LoadingScreen';
import ScrollToTopButton from '@/components/mizora/ScrollToTopButton';

import { Language } from '@/lib/mizora-types';
import { translations } from '@/lib/mizora-translations';


// Loading fallback component — static, no animation jank
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20" style={{ background: '#ECECF0' }}>
      <span className="font-mono text-[10px] text-neutral-400 tracking-[0.2em] uppercase">Loading...</span>
    </div>
  );
}

// Dynamic imports for heavy components - SSR disabled to reduce server memory usage
const EcosystemSection: any = dynamic(() => import('@/components/mizora/EcosystemSection'), { ssr: false, loading: () => <SectionLoader /> });
const ServicesSection: any = dynamic(() => import('@/components/mizora/ServicesSection'), { ssr: false, loading: () => <SectionLoader /> });
const WorkflowSection: any = dynamic(() => import('@/components/mizora/WorkflowSection'), { ssr: false, loading: () => <SectionLoader /> });
const ImplementationSection: any = dynamic(() => import('@/components/mizora/ImplementationSection'), { ssr: false, loading: () => <SectionLoader /> });
const RatecardSection: any = dynamic(() => import('@/components/mizora/RatecardSection'), { ssr: false, loading: () => <SectionLoader /> });
const PortfolioSection: any = dynamic(() => import('@/components/mizora/PortfolioSection'), { ssr: false, loading: () => <SectionLoader /> });
const FaqSection: any = dynamic(() => import('@/components/mizora/FaqSection'), { ssr: false, loading: () => <SectionLoader /> });
const AboutSection: any = dynamic(() => import('@/components/mizora/AboutSection'), { ssr: false, loading: () => <SectionLoader /> });
const ContactSection: any = dynamic(() => import('@/components/mizora/ContactSection'), { ssr: false, loading: () => <SectionLoader /> });
const Footer: any = dynamic(() => import('@/components/mizora/Footer'), { ssr: false, loading: () => <SectionLoader /> });

export default function Home() {
  const [lang, setLang] = useState<Language>('id');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const t = translations[lang];

  // Lock scroll during loading, unlock when done — uses CSS class for !important override
  useEffect(() => {
    const html = document.documentElement;
    if (isLoading) {
      html.classList.add('loading-active');
    } else {
      html.classList.remove('loading-active');
    }
    return () => {
      html.classList.remove('loading-active');
    };
  }, [isLoading]);

  // Safety net: force unlock scroll after max loading time (in case animation callback fails)
  useEffect(() => {
    const maxTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
      document.documentElement.classList.remove('loading-active');
    }, 9000);
    return () => clearTimeout(maxTimer);
  }, [isLoading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile && window.innerWidth < 480) {
      canvas.style.display = 'none';
      return;
    }

    let animationFrameId: number;
    let isAnimating = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodeCount = isMobile ? 15 : 40;
    const connectionDist = isMobile ? 100 : 130;
    const mouseDistThreshold = isMobile ? 120 : 180;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
        radius: Math.random() * 1.5 + 1,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isAnimating) {
          isAnimating = true;
          render();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            isAnimating = false;
            cancelAnimationFrame(animationFrameId);
          } else {
            if (!isAnimating) {
              isAnimating = true;
              render();
            }
          }
        });
      },
      { threshold: 0 }
    );

    intersectionObserver.observe(canvas);

    let lastRenderTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    // Pre-compute squared distance for faster comparison (avoids Math.hypot)
    const connectionDistSq = connectionDist * connectionDist;
    const mouseDistThresholdSq = mouseDistThreshold * mouseDistThreshold;

    const render = (timestamp?: number) => {
      if (!isAnimating) return;

      // FPS throttle for ALL devices to cap at targetFPS
      if (timestamp) {
        const delta = timestamp - lastRenderTime;
        if (delta < frameInterval) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }
        lastRenderTime = timestamp;
      }

      ctx.clearRect(0, 0, width, height);

      // Batch dots and lines separately to minimize context state switches
      // Phase 1: Draw all dots
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Phase 2: Draw all connection lines
      if (!isMobile) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectionDistSq) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
          // Mouse connection
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          if (mDistSq < mouseDistThresholdSq) {
            const mDist = Math.sqrt(mDistSq);
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.08 * (1 - mDist / mouseDistThreshold)})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="relative min-h-screen flex flex-col text-[#0A0A0A] selection:bg-black selection:text-white antialiased overflow-x-hidden" style={{ background: '#ECECF0', contain: 'layout style paint' }}>
        {/* Skip to content link for keyboard navigation */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:tracking-wider focus:uppercase focus:rounded-sm focus:shadow-lg"
        >
          Skip to Content
        </a>

        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40" 
          aria-hidden="true"
        />

        <Header lang={lang} setLang={setLang} t={t} isLoading={isLoading} />
        
        <main className="relative z-10 font-sans flex-1">
          <HeroSection t={t} lang={lang} isLoading={isLoading} />

          <section id="services">
            <EcosystemSection t={t} lang={lang} />
            <ServicesSection t={t} lang={lang} />
            <WorkflowSection t={t} lang={lang} />
            <ImplementationSection t={t} lang={lang} />
          </section>

          <RatecardSection t={t} lang={lang} />
          <PortfolioSection t={t} lang={lang} />
          <FaqSection t={t} lang={lang} />
          <AboutSection t={t} lang={lang} />
          <ContactSection t={t} lang={lang} />
        </main>

        <Footer t={t} lang={lang} />
        <ScrollToTopButton />
      </div>
    </>
  );
}
