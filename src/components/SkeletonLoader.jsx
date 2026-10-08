import React from 'react';

export default function SkeletonLoader({ height = '120px', width = '100%', count = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-loader"
          style={{ height, width }}
        />
      ))}
    </div>
  );
}
