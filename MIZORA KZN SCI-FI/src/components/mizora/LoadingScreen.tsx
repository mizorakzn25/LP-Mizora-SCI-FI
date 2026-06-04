'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'MENGAKTIFKAN PROTOKOL KOGNITIF',
  'MEMUAT INTI NEURAL',
  'MENYINKRONKAN JARINGAN NODE',
  'MENGKALIBRASI ENGINE WORKFLOW',
  'SISTEM AKTIF',
];

const TYPING_SPEED = 30; // ms per character — fast hacker terminal feel
const PAUSE_BETWEEN_MESSAGES = 300; // ms pause after a message finishes typing
const INITIAL_DELAY = 400; // ms before first character appears

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percentage, setPercentage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Typewriter state
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalDuration = 5000; // Synced with typewriter: all 5 messages finish ~when progress hits 100%

  // Smooth percentage increment
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setHasStarted(true);
      startTimeRef.current = performance.now();

      const animate = (now: number) => {
        if (!startTimeRef.current) return;
        const elapsed = now - startTimeRef.current;
        const rawProgress = Math.min(elapsed / totalDuration, 1);
        const easedProgress = rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
        setPercentage(Math.round(easedProgress * 100));

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Typewriter engine — pre-schedule all timeouts upfront (no cascading effects)
  useEffect(() => {
    if (!hasStarted) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let t = INITIAL_DELAY;

    for (let msgIdx = 0; msgIdx < STATUS_MESSAGES.length; msgIdx++) {
      const msg = STATUS_MESSAGES[msgIdx];

      // Start new message: set index and reset chars
      const mi = msgIdx;
      timeouts.push(setTimeout(() => {
        setCurrentMsgIndex(mi);
        setDisplayedChars(0);
      }, t));

      // Type each character
      for (let charIdx = 0; charIdx < msg.length; charIdx++) {
        t += TYPING_SPEED;
        const ci = charIdx + 1;
        timeouts.push(setTimeout(() => {
          setDisplayedChars(ci);
        }, t));
      }

      // Pause after finishing this message
      t += PAUSE_BETWEEN_MESSAGES;
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [hasStarted]);

  // Track completion state derived from percentage
  const isComplete = percentage >= 100;

  // When percentage reaches 100, trigger exit with slide up
  useEffect(() => {
    if (isComplete) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 850);
        return () => clearTimeout(completeTimer);
      }, 600);
      return () => clearTimeout(exitTimer);
    }
  }, [isComplete, onComplete]);

  // Current typed text
  const currentMsg = STATUS_MESSAGES[currentMsgIndex] || '';
  const typedText = currentMsg.slice(0, displayedChars);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isExiting ? { y: '-100%' } : { y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Subtle radial glow from center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: hasStarted ? 0.08 : 0, scale: 1.2 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Main content container — optical center (slightly above math center) */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-lg sm:max-w-xl -mt-4">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-md overflow-hidden relative transition-all duration-500 ${isComplete ? 'shadow-[0_0_30px_rgba(255,255,255,0.15)]' : ''}`}>
            <Image
              src="/images/mizora-logo.png"
              alt="Mizora KZN"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Brand Name with Glitch Effect */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10"
        >
          <h1
            className="text-white text-xl sm:text-2xl md:text-3xl tracking-[0.4em] sm:tracking-[0.5em] font-medium text-center relative glitch-text"
            style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
            data-text="MIZORA KZN"
          >
            MIZORA KZN
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 sm:mt-4 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent origin-center"
          />
        </motion.div>

        {/* Percentage Counter with completion glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasStarted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <div className={`relative transition-all duration-500 ${isComplete ? 'scale-105' : ''}`}>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0.15, 0.3, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            )}
            <span
              className={`relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider tabular-nums transition-colors duration-500 ${isComplete ? 'text-white' : 'text-white/90'}`}
              style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
            >
              {percentage.toString().padStart(3, '0')}
            </span>
            <span
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light ml-1 transition-colors duration-500 ${isComplete ? 'text-white/50' : 'text-white/30'}`}
              style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}
            >
              %
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: hasStarted ? 1 : 0, scaleX: hasStarted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm origin-center mb-5 sm:mb-6"
        >
          <div className="relative h-[3px] sm:h-[3px] w-full rounded-full overflow-hidden bg-white/[0.06]">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[10px] rounded-full transition-[width] duration-100 ease-out"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))',
                filter: 'blur(6px)',
              }}
            />
            <div
              className="absolute top-0 left-0 h-full bg-white/90 rounded-full transition-[width] duration-100 ease-out"
              style={{ width: `${percentage}%` }}
            />
            {percentage > 0 && percentage < 100 && (
              <div
                className="absolute top-0 h-full w-3 bg-gradient-to-r from-white/80 to-transparent rounded-full transition-[left] duration-100 ease-out"
                style={{ left: `${percentage}%` }}
              />
            )}
            {isComplete && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </div>
        </motion.div>

        {/* Typewriter Status Text — hacker terminal aesthetic */}
        <div className="h-5 sm:h-6 flex items-center justify-center">
          <p
            className="text-white/70 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-center whitespace-nowrap"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            <span className="text-white/25 mr-1.5">&gt;</span>
            {typedText}
            {/* Blinking cursor */}
            <span className="typewriter-cursor">█</span>
          </p>
        </div>
      </div>

      {/* Bottom info bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-center justify-between px-5 sm:px-8 md:px-12"
      >
        <span
          className="text-white/20 text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          SECURE BOOT // SHA-256
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
          <span
            className="text-white/20 text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            NODE ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Top corner coordinates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute top-5 sm:top-8 left-5 sm:left-8 md:left-12"
      >
        <span
          className="text-white text-[7px] sm:text-[8px] tracking-[0.1em] sm:tracking-[0.15em]"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          LAT -6.2088 // LNG 106.8456
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute top-5 sm:top-8 right-5 sm:right-8 md:right-12"
      >
        <span
          className="text-white text-[7px] sm:text-[8px] tracking-[0.1em] sm:tracking-[0.15em]"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          v4.9.2 // BUILD {new Date().getFullYear()}
        </span>
      </motion.div>
    </motion.div>
  );
}
