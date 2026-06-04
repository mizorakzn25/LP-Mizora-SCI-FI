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

// Dynamic imports for heavy components - SSR disabled to reduce server memory usage
const EcosystemSection = dynamic(() => import('@/components/mizora/EcosystemSection'), { ssr: false });
const ServicesSection = dynamic(() => import('@/components/mizora/ServicesSection'), { ssr: false });
const WorkflowSection = dynamic(() => import('@/components/mizora/WorkflowSection'), { ssr: false });
const RatecardSection = dynamic(() => import('@/components/mizora/RatecardSection'), { ssr: false });
const PortfolioSection = dynamic(() => import('@/components/mizora/PortfolioSection'), { ssr: false });
const FaqSection = dynamic(() => import('@/components/mizora/FaqSection'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/mizora/AboutSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/mizora/ContactSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/mizora/Footer'), { ssr: false });

export default function Home() {
  const [lang, setLang] = useState<Language>('id');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const t = translations[lang];

  // Lock scroll during loading, unlock when done
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // Safety net: force unlock scroll after max loading time (in case animation callback fails)
  useEffect(() => {
    const maxTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }, 9000); // Safety net — must exceed total loading duration (~6.7s) + exit animation
    return () => clearTimeout(maxTimer);
  }, [isLoading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    // Skip canvas entirely on very small/low-end mobile devices
    if (isMobile && window.innerWidth < 480) {
      canvas.style.display = 'none';
      return;
    }

    let animationFrameId: number;
    let isAnimating = true;
    let width = (canvas.width = window.innerWidth);
    // Use viewport height instead of full page height for better performance
    let height = (canvas.height = window.innerHeight);

    // Aggressively reduce nodes on mobile
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

    // Only add mousemove listener on desktop
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Visibility API: pause animation when tab is not visible
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

    // IntersectionObserver: pause animation when canvas is not in viewport
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

    // Throttle render on mobile for battery savings
    let lastRenderTime = 0;
    const targetFPS = isMobile ? 24 : 60;
    const frameInterval = 1000 / targetFPS;

    const render = (timestamp?: number) => {
      if (!isAnimating) return;

      // Throttle frame rate on mobile
      if (isMobile && timestamp) {
        const delta = timestamp - lastRenderTime;
        if (delta < frameInterval) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }
        lastRenderTime = timestamp;
      }

      ctx.clearRect(0, 0, width, height);

      // Keep canvas at viewport size (not full page height)
      if (canvas.width !== window.innerWidth) {
        width = canvas.width = window.innerWidth;
      }
      if (canvas.height !== window.innerHeight) {
        height = canvas.height = window.innerHeight;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
      ctx.lineWidth = 0.5;

      nodes.forEach((node, idx) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Skip node-to-node connections on mobile for performance
        if (!isMobile) {
          for (let j = idx + 1; j < nodes.length; j++) {
            const otherNode = nodes[j];
            const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);

            if (dist < connectionDist) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        }

        // Mouse interaction (desktop only)
        const mouseDist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        if (mouseDist < mouseDistThreshold) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.08 * (1 - mouseDist / mouseDistThreshold)})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
        }
      });

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

      <div className="relative min-h-screen flex flex-col text-[#0A0A0A] selection:bg-black selection:text-white antialiased overflow-x-hidden" style={{ background: '#ECECF0' }}>
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

          {/* ─── FUD Section Separator ─── */}
          <div className="relative py-6 md:py-8 overflow-hidden" style={{ background: '#ECECF0' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              {/* Decorative line composition */}
              <div className="flex items-center gap-0">
                {/* Left segment — solid */}
                <div className="h-[2px] w-8 bg-black/80" />
                {/* Dot node */}
                <div className="w-1.5 h-1.5 rounded-full bg-black/60 shrink-0" />
                {/* Center long line — gradient fade */}
                <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-300 via-neutral-200 to-neutral-300" />
                {/* Center diamond */}
                <div className="w-2 h-2 rotate-45 border border-neutral-300 bg-white shrink-0 mx-3" />
                {/* Right long line — gradient fade */}
                <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-300 via-neutral-200 to-neutral-300" />
                {/* Dot node */}
                <div className="w-1.5 h-1.5 rounded-full bg-black/60 shrink-0" />
                {/* Right segment — solid */}
                <div className="h-[2px] w-8 bg-black/80" />
              </div>
              {/* Sub-labels */}
              <div className="flex items-center justify-between mt-2.5">
                <span className="font-mono text-[7px] tracking-[0.2em] uppercase font-bold text-neutral-400">BERANDA</span>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-6 bg-neutral-200" />
                  <span className="font-mono text-[7px] tracking-[0.2em] uppercase font-bold text-neutral-400">LAYANAN</span>
                </div>
              </div>
            </div>
          </div>

          <section id="services">
            <EcosystemSection t={t} lang={lang} />
            <ServicesSection t={t} lang={lang} />
          </section>
          <WorkflowSection t={t} lang={lang} />
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
