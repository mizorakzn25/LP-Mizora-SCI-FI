'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { gpuAccel } from '@/lib/perf';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  yOffset = 30
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation entirely if reduced motion is preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.05,
        margin: "0px 0px -50px 0px"
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: delay
      }}
      style={gpuAccel}
      className={className}
    >
      {children}
    </motion.div>
  );
}
