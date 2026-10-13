import React from 'react';

/**
 * PyCosmos Python Heart Logo
 * -------------------------
 * A custom-crafted brand emblem combining the iconic Python dual-serpent identity
 * into a harmonious heart shape:
 * - Left lobe: Python Blue (#306998 -> #387EB8) with golden eye dot (#FFD43B)
 * - Right lobe: Python Yellow (#FFE873 -> #FFD43B / #E5A800) with blue eye dot (#306998)
 * - Center dividing seam & cosmic pulse effect
 */
export default function HeartLogo({ size = 26, className = '', animated = true }) {
  return (
    <span
      className={`pycosmos-heart-logo-wrap ${animated ? 'animated-heart-logo' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0
      }}
      title="PyCosmos Heart Logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 2px 6px rgba(48, 105, 152, 0.22))'
        }}
      >
        <defs>
          {/* Python Blue Gradient */}
          <linearGradient id="pyHeartBlue" x1="4" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4B8BBE" />
            <stop offset="55%" stopColor="#306998" />
            <stop offset="100%" stopColor="#205075" />
          </linearGradient>

          {/* Python Yellow Gradient */}
          <linearGradient id="pyHeartYellow" x1="28" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE873" />
            <stop offset="50%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#E5A800" />
          </linearGradient>
        </defs>

        {/* Left Serpent Lobe (Python Blue) */}
        <path
          d="M 16 8.5 C 16 4.2 11 3 7.5 6 C 3.2 9.5 3.8 16.5 16 27.5 Z"
          fill="url(#pyHeartBlue)"
        />

        {/* Right Serpent Lobe (Python Yellow) */}
        <path
          d="M 16 8.5 C 16 4.2 21 3 24.5 6 C 28.8 9.5 28.2 16.5 16 27.5 Z"
          fill="url(#pyHeartYellow)"
        />

        {/* Center Dimensional Seam */}
        <path
          d="M 16 8.5 L 16 27.5"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Yellow Eye on Blue Serpent */}
        <circle cx="9.4" cy="8.2" r="1.6" fill="#FFD43B" />
        <circle cx="9.4" cy="8.2" r="0.6" fill="#FFFFFF" opacity="0.85" />

        {/* Blue Eye on Yellow Serpent */}
        <circle cx="22.6" cy="8.2" r="1.6" fill="#306998" />
        <circle cx="22.6" cy="8.2" r="0.6" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </span>
  );
}
