import React from 'react';
import { motion } from 'framer-motion';

/**
 * PyCosmos Authentic Brand Logo
 * -----------------------------
 * A simplified two-snake Python mark forged into a stellar cosmic core:
 * - Upper snake: Python Blue (#3776AB) forming the classic Python head & upper curve
 * - Lower snake: Python Yellow (#FFD43B) forming the grounded lower curve
 * - Center interlocking geometry: Cosmic stellar core / spark
 * - Iconic Python eye dots on both segments
 * - Subtle shimmer & micro-interaction on hover
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
      whileHover={animated ? { scale: 1.06, rotate: 2 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
      title="PyCosmos — A whole universe of Python in one place"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Python Blue Gradient */}
          <linearGradient id="pycBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E95D4" />
            <stop offset="60%" stopColor="#3776AB" />
            <stop offset="100%" stopColor="#2B5B84" />
          </linearGradient>

          {/* Python Yellow Gradient */}
          <linearGradient id="pycYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE873" />
            <stop offset="45%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#E5B824" />
          </linearGradient>

          {/* Cosmic Spark Glow */}
          <filter id="pycSparkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Subtle Shimmer Mask */}
          <linearGradient id="pycShimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Back Glow */}
        <circle cx="50" cy="50" r="44" fill="#3776AB" opacity="0.12" />
        <circle cx="54" cy="54" r="28" fill="#FFD43B" opacity="0.14" />

        {/* ════ UPPER BLUE SNAKE ════ */}
        <path
          d="M 48 10
             C 32 10, 24 18, 24 30
             L 24 44
             L 52 44
             L 52 50
             L 18 50
             C 10 50, 4 56, 4 66
             L 4 48
             C 4 28, 18 10, 48 10
             Z"
          fill="url(#pycBlueGrad)"
        />
        {/* Extended striking head of blue snake */}
        <path
          d="M 48 10
             C 66 10, 76 18, 76 30
             L 76 44
             L 48 44
             C 38 44, 30 36, 30 26
             C 30 16, 38 10, 48 10
             Z"
          fill="url(#pycBlueGrad)"
        />

        {/* Blue Snake Eye / Golden Spark Dot */}
        <circle cx="42" cy="24" r="4.2" fill="#FFD43B" />
        <circle cx="42" cy="24" r="2.2" fill="#FFFFFF" />

        {/* ════ LOWER YELLOW SNAKE ════ */}
        <path
          d="M 52 90
             C 68 90, 76 82, 76 70
             L 76 56
             L 48 56
             L 48 50
             L 82 50
             C 90 50, 96 44, 96 34
             L 96 52
             C 96 72, 82 90, 52 90
             Z"
          fill="url(#pycYellowGrad)"
        />
        {/* Extended base foot of yellow snake */}
        <path
          d="M 52 90
             C 34 90, 24 82, 24 70
             L 24 56
             L 52 56
             C 62 56, 70 64, 70 74
             C 70 84, 62 90, 52 90
             Z"
          fill="url(#pycYellowGrad)"
        />

        {/* Yellow Snake Eye / Deep Blue Center Dot */}
        <circle cx="58" cy="76" r="4.2" fill="#2B5B84" />
        <circle cx="58" cy="76" r="2.2" fill="#3776AB" />

        {/* ════ CENTER COSMIC SPARK ACCENT ════ */}
        <polygon
          points="50,44 54,50 50,56 46,50"
          fill="#FFE873"
          filter="url(#pycSparkGlow)"
        />
        <circle cx="50" cy="50" r="1.8" fill="#FFFFFF" />
      </svg>
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
