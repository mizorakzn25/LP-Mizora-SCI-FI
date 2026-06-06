'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const currentScrollY = window.scrollY;
        // Only update state if visibility actually changes
        const shouldShow = currentScrollY > 400;
        if (shouldShow !== lastScrollY.current > 400) {
          setIsVisible(shouldShow);
        }
        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-center justify-center gap-1 w-12 h-12 bg-black text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-neutral-800 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-colors duration-200 rounded-sm cursor-pointer"
          style={{ willChange: 'transform, opacity' }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-mono text-[8px] tracking-widest opacity-60">
            UPWARD
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
