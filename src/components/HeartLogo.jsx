import React from 'react';

/**
 * PyCosmos Python Heart Shape Print
 * ---------------------------------
 * A clean, classic, elegant heart shape emblem:
 * - Left half: Authentic Python Blue (#4B8BBE -> #306998)
 * - Right half: Authentic Python Yellow (#FFE873 -> #FFD43B -> #E5A800)
 * - Fine center seam dividing the two lobes
 * - Subtle inner highlight stroke
 * - Pure heart geometry, no emoji eyes or circles
 */
export default function HeartLogo({ size = 26, className = '', animated = true }) {
  // Classic filled heart vector path (24x24 viewBox)
  const heartPath =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

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
      title="PyCosmos Python Heart"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 2px 6px rgba(48, 105, 152, 0.22))'
        }}
      >
        <defs>
          <linearGradient id="pyHeartBlue" x1="2" y1="3" x2="12" y2="21.35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4B8BBE" />
            <stop offset="60%" stopColor="#306998" />
            <stop offset="100%" stopColor="#205075" />
          </linearGradient>

          <linearGradient id="pyHeartYellow" x1="22" y1="3" x2="12" y2="21.35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE873" />
            <stop offset="50%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#E5A800" />
          </linearGradient>

          <clipPath id="pyHeartClipLeft">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>

          <clipPath id="pyHeartClipRight">
            <rect x="12" y="0" width="12" height="24" />
          </clipPath>
        </defs>

        {/* Left Lobe (Python Blue) */}
        <path
          d={heartPath}
          fill="url(#pyHeartBlue)"
          clipPath="url(#pyHeartClipLeft)"
        />

        {/* Right Lobe (Python Yellow) */}
        <path
          d={heartPath}
          fill="url(#pyHeartYellow)"
          clipPath="url(#pyHeartClipRight)"
        />

        {/* Delicate Center Seam */}
        <line
          x1="12"
          y1="5.1"
          x2="12"
          y2="21.35"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* Subtle Inner Highlight Stroke */}
        <path
          d={heartPath}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </span>
  );
}
