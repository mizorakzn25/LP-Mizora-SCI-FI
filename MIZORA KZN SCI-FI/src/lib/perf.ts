/**
 * Performance utilities for Mizora KZN
 * Optimized for 120fps smooth animations
 */

import { useEffect, useRef, useState } from 'react';

// ─── GPU Acceleration Helper ───
// Forces element onto its own GPU compositor layer
export const gpuAccel: React.CSSProperties = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
};

// ─── Lightweight GPU transform (no extra layer creation) ───
export const gpuTransform: React.CSSProperties = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

// ─── RAF-based throttle for scroll/mousemove events ───
export function createRAFThrottle<T extends (...args: any[]) => void>(callback: T): T & { cancel: () => void } {
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;

  const throttled = ((...args: any[]) => {
    lastArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (lastArgs) callback(...lastArgs);
        lastArgs = null;
      });
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastArgs = null;
    }
  };

  return throttled;
}

// ─── RAF-based counter animation (replaces setInterval) ───
export function animateCounter(
  target: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  const startTime = performance.now();
  let rafId: number;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    onUpdate(current);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onUpdate(target);
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

// ─── Instant DOM transform setter (bypasses React render cycle) ───
export function setDOMTransform(el: HTMLElement | null, transform: string) {
  if (el) el.style.transform = transform;
}

// ─── Reduced motion check ───
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Intersection Observer Hook (trigger once) ───
// Lightweight intersection observer for pausing off-screen animations
export function useInViewOnce(threshold = 0.1) {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold, rootMargin: '50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// ─── RAF-based Scroll Position Tracker ───
// Throttled scroll tracking avoiding jank on fast scrolls
export function useScrollThrottle() {
  const scrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        scrollY.current = window.scrollY;
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return scrollY;
}

// ─── Framer Motion Spring Configs (optimized for 120fps) ───
export const springSnappy = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 };
export const springSmooth = { type: 'spring' as const, stiffness: 200, damping: 25, mass: 1 };
export const springGentle = { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1.2 };

// ─── Cubic Bezier Easing Curves ───
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuart = [0.25, 1, 0.5, 1] as const;

// ─── Batch DOM Updates ───
// Batches multiple DOM reads/writes to avoid layout thrashing
export function batchDOMUpdates(updates: (() => void)[]) {
  // Read phase - let the browser batch reads
  requestAnimationFrame(() => {
    // Write phase - batch all writes together
    for (const update of updates) {
      update();
    }
  });
}

// ─── Offscreen Detector ───
// Detect when element is off-screen to pause animations
export function createOffscreenDetector(
  element: HTMLElement,
  onScreen: () => void,
  offScreen: () => void
): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onScreen();
      } else {
        offScreen();
      }
    },
    { threshold: 0, rootMargin: '100px' }
  );

  observer.observe(element);
  return () => observer.disconnect();
}
