import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const handleMouseMove = (e) => {
      if (mediaQuery.matches || window.innerWidth <= 768) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const xOffset = (e.clientX - window.innerWidth / 2) * 0.02;
        const yOffset = (e.clientY - window.innerHeight / 2) * 0.02;
        setMousePos({ x: e.clientX, y: e.clientY, offsetX: xOffset, offsetY: yOffset });
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const parallaxX = mousePos.offsetX || 0;
  const parallaxY = mousePos.offsetY || 0;

  // Mobile / Small Screen: Static, ultra-lightweight hardware-accelerated CSS background
  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          background: 'var(--bg-main)',
          transform: 'translateZ(0)'
        }}
      >
        {/* Subtle static gradient orbs with zero CPU animation overhead */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '10%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(48, 105, 152, 0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '5%',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 212, 59, 0.08) 0%, transparent 70%)',
            filter: 'blur(45px)',
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }

  // Desktop: Full ambient depth experience with throttled parallax
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg-main)',
        transform: 'translateZ(0)'
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
              filter: 'blur(75px)',
              willChange: 'transform',
              transform: 'translateZ(0)'
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
              filter: 'blur(80px)',
              willChange: 'transform',
              transform: 'translateZ(0)'
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
              filter: 'blur(85px)',
              willChange: 'transform',
              transform: 'translateZ(0)'
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
    </div>
  );
}
