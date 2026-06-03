'use client';

import { motion } from 'framer-motion';

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
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.1,
        margin: "-80px 0px -80px 0px"
      }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 0.5,
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
