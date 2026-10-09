import React from 'react';

export default function PageTransition({ children }) {
  return (
    <div className="page-transition-wrapper" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  );
}
