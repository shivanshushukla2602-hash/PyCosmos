import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollRevealSection
 * -------------------
 * High-performance, GPU-accelerated scroll reveal wrapper.
 * Smoothly fades and slides sections into view with a luxury spring ease as the user scrolls.
 */
export default function ScrollRevealSection({
  children,
  className = '',
  style = {},
  delay = 0,
  yOffset = 26
}) {
  return (
    <motion.section
      className={`scroll-reveal-section ${className}`}
      style={{
        ...style,
        willChange: 'opacity, transform'
      }}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.section>
  );
}
