import React from 'react';
import { motion } from 'framer-motion';

/**
 * PyCosmos Authentic Brand Logo
 * -----------------------------
 * Official Cosmic Python Emblem:
 * - Upper serpent: Python Blue with golden eye
 * - Lower serpent: Python Yellow with blue eye
 * - Center: Glowing golden star / cosmic spark
 * - Full circular celestial orb layout
 */
export default function PyCosmosLogo({
  size = 36,
  animated = true,
  className = '',
  withText = false,
  tagline = true,
  onBrandClick
}) {
  const mark = (
    <motion.div
      className={`pycosmos-brand-mark pyforge-brand-mark ${className}`}
      whileHover={animated ? { scale: 1.08, rotate: 2 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(55, 118, 171, 0.25)',
        background: '#0a1018'
      }}
      title="PyCosmos — A whole universe of Python in one place"
    >
      <img
        src="/favicon.png"
        alt="PyCosmos Logo"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );

  if (!withText) {
    return mark;
  }

  return (
    <div
      className="brand-logo-container"
      onClick={onBrandClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        cursor: onBrandClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {mark}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="brand-text-wrap" style={{ display: 'flex', alignItems: 'center', fontSize: '1.28rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <span className="brand-blue">Py</span>
          <span className="brand-yellow brand-shimmer-hover">Cosmos</span>
        </div>
        {tagline && (
          <span className="brand-tagline">
            Universe of Python
          </span>
        )}
      </div>
    </div>
  );
}

export { PyCosmosLogo };
