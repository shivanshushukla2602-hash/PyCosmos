import React from 'react';

/**
 * PyCosmos Heart Shape Print
 * --------------------------
 * A clean, classic, vibrant red heart shape emblem:
 * - Rich vibrant ruby/crimson red gradient (#FF4D6D -> #E11D48 -> #BE123C)
 * - Subtle inner specular stroke
 * - Soft ambient red glow
 * - Pure heart geometry
 */
export default function HeartLogo({ size = 26, className = '', animated = true, color }) {
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
      title="Made with Love"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 2px 8px rgba(225, 29, 72, 0.35))'
        }}
      >
        <defs>
          <linearGradient id="pyHeartRed" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>

        {/* Pure Red Heart Fill */}
        <path
          d={heartPath}
          fill={color || "url(#pyHeartRed)"}
        />

        {/* Subtle Inner Highlight Stroke for dimensionality */}
        <path
          d={heartPath}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="0.6"
          fill="none"
        />
      </svg>
    </span>
  );
}
