import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const totalHeight = (document.documentElement.scrollHeight || document.body.scrollHeight || 0) - window.innerHeight;
      
      const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)) : 0;
      setScrollProgress(progress);

      // Show button when user has scrolled down (e.g. beyond 320px)
      if (currentScrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // SVG circular progress calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-to-top-wrapper"
        >
          <button
            type="button"
            onClick={handleScrollToTop}
            className="scroll-to-top-btn"
            aria-label="Scroll back to top of the page"
            title="Back to Top"
          >
            {/* Circular Progress Ring */}
            <svg className="scroll-progress-ring" width="48" height="48" viewBox="0 0 48 48">
              <circle
                className="scroll-ring-track"
                cx="24"
                cy="24"
                r={radius}
                fill="none"
                strokeWidth="2.5"
              />
              <circle
                className="scroll-ring-fill"
                cx="24"
                cy="24"
                r={radius}
                fill="none"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
              />
            </svg>

            {/* Icon & Tooltip */}
            <span className="scroll-top-icon-wrap">
              <ArrowUp size={19} className="scroll-top-arrow" />
            </span>
            <span className="scroll-top-tooltip">Back to Top</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
