import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const handleMouseMove = (e) => {
      if (!mediaQuery.matches) {
        // Capped mouse offset for subtle parallax shift (~15px max)
        const xOffset = (e.clientX - window.innerWidth / 2) * 0.02;
        const yOffset = (e.clientY - window.innerHeight / 2) * 0.02;
        setMousePos({ x: e.clientX, y: e.clientY, offsetX: xOffset, offsetY: yOffset });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxX = mousePos.offsetX || 0;
  const parallaxY = mousePos.offsetY || 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg-main)'
      }}
    >
      {/* 1. Layered Depth Gradient Mesh Blobs (Muted Blue, Muted Amber, Muted Purple) */}
      {!prefersReducedMotion && (
        <>
          {/* Blob 1: Muted Blue (25s loop) */}
          <motion.div
            animate={{
              x: [parallaxX, parallaxX + 50, parallaxX - 35, parallaxX],
              y: [parallaxY, parallaxY - 40, parallaxY + 45, parallaxY],
              scale: [1, 1.1, 0.92, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: '-10%',
              left: '8%',
              width: '560px',
              height: '560px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(48, 105, 152, 0.16) 0%, transparent 70%)',
              filter: 'blur(75px)'
            }}
          />

          {/* Blob 2: Python Yellow Glow (35s loop) */}
          <motion.div
            animate={{
              x: [-parallaxX, -parallaxX - 45, -parallaxX + 40, -parallaxX],
              y: [-parallaxY, -parallaxY + 45, -parallaxY - 35, -parallaxY],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: '32%',
              right: '6%',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 212, 59, 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />

          {/* Blob 3: Python Light Blue Accent (42s loop) */}
          <motion.div
            animate={{
              x: [parallaxX * 0.5, parallaxX * 0.5 + 30, parallaxX * 0.5 - 30, parallaxX * 0.5],
              y: [parallaxY * 0.5, parallaxY * 0.5 + 30, parallaxY * 0.5 - 30, parallaxY * 0.5]
            }}
            transition={{
              duration: 42,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              bottom: '-12%',
              left: '32%',
              width: '480px',
              height: '480px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(75, 139, 190, 0.14) 0%, transparent 70%)',
              filter: 'blur(85px)'
            }}
          />
        </>
      )}

      {/* 2. Subtle Fine Dot-Matrix Grid Overlay (~3.5% Opacity) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage: 'radial-gradient(rgba(240, 246, 252, 0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3. Soft Viewport Edge Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(9, 12, 18, 0.55) 100%)'
        }}
      />

      {/* 4. Cursor-Following Radial Glow (Desktop Capped Spotlight) */}
      {!prefersReducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(75, 139, 190, 0.08), rgba(232, 185, 35, 0.03), transparent 70%)`,
            transition: 'background 0.08s ease-out'
          }}
        />
      )}

      {/* Faint Noise Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
}
