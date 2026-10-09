import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  Terminal,
  Cpu,
  Shield,
  Zap,
  Globe,
  Database,
  Code2,
  Workflow,
  Flame,
  Award
} from 'lucide-react';

const STAGE_ICONS = [
  Terminal,
  Code2,
  Layers,
  Cpu,
  Workflow,
  Database,
  Globe,
  Shield,
  Zap,
  Award
];

const STAGE_HOURS = ['6h', '10h', '14h', '18h', '22h', '16h', '20h', '25h', '30h', '35h'];

export default function RoadmapStepper({ categories, completedMap }) {
  const scrollRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  const handleSliderScrub = (e) => {
    const newIdx = parseInt(e.target.value, 10);
    setActiveStageIndex(newIdx);
    if (!scrollRef.current) return;
    const cardWidth = 290;
    scrollRef.current.scrollTo({
      left: newIdx * cardWidth,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  const scrollToLevel = (levelId, index) => {
    setActiveStageIndex(index);
    const el = document.getElementById(`level-section-${levelId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="kinetic-stage-carousel-container"
    >
      {/* ── TOP MISSION CONTROL HEADER ── */}
      <div className="stage-carousel-header">
        <div className="carousel-title-group">
          <div className="carousel-badge-icon">
            <Compass size={18} color="var(--py-blue-light)" />
          </div>
          <div>
            <h3 className="carousel-main-title">Curriculum Stages Stepper</h3>
            <p className="carousel-subtitle">Kinetic Stage Carousel • Swipe or scrub to jump directly to any curriculum stage</p>
          </div>
        </div>

        {/* CAROUSEL CHEVRON BUTTONS */}
        <div className="carousel-nav-controls">
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll stages left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll stages right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── HORIZONTAL KINETIC CAROUSEL TRACK ── */}
      <div
        className="stage-carousel-track"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {categories.map((cat, idx) => {
          let totalCount = 0;
          let doneCount = 0;
          cat.nodes.forEach((n) => {
            n.topicIds.forEach((id) => {
              totalCount += 1;
              if (completedMap[id]) doneCount += 1;
            });
          });
          const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
          const isCompleted = percent === 100;
          const isInProgress = percent > 0 && percent < 100;
          const StageIcon = STAGE_ICONS[idx % STAGE_ICONS.length];
          const estimatedHours = STAGE_HOURS[idx] || '12h';
          const stageColor = cat.color || '#38bdf8';
          const isSelected = activeStageIndex === idx;

          // Mini SVG ring circumference
          const radius = 17;
          const circ = 2 * Math.PI * radius;
          const strokeOffset = circ - (percent / 100) * circ;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`kinetic-stage-card ${isCompleted ? 'is-complete' : isInProgress ? 'is-in-flight' : ''} ${isSelected ? 'is-focused' : ''}`}
              onClick={() => scrollToLevel(cat.id, idx)}
              style={{
                '--stage-accent': stageColor
              }}
            >
              {/* WATERMARK EMBLEM */}
              <div className="stage-card-watermark">
                STAGE {idx < 9 ? `0${idx + 1}` : idx + 1}
              </div>

              {/* CARD TOP ROW: ICON & MINI RADIAL PROGRESS */}
              <div className="stage-card-top">
                <div
                  className="stage-card-icon-box"
                  style={{
                    background: `${stageColor}18`,
                    border: `1px solid ${stageColor}40`,
                    color: stageColor
                  }}
                >
                  <StageIcon size={20} />
                </div>

                <div className="stage-card-dial">
                  <svg width="42" height="42" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
                    <circle
                      cx="21"
                      cy="21"
                      r={radius}
                      fill="none"
                      stroke={stageColor}
                      strokeWidth="3.5"
                      strokeDasharray={circ}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 21 21)"
                    />
                  </svg>
                  <span className="dial-value-text" style={{ color: isCompleted ? '#22c55e' : stageColor }}>
                    {isCompleted ? '✓' : `${percent}%`}
                  </span>
                </div>
              </div>

              {/* STAGE TITLE & PILL */}
              <div className="stage-card-body">
                <div className="stage-index-badge">STAGE {idx + 1}</div>
                <h4 className="stage-card-title" title={cat.title}>
                  {cat.title.replace(/^Level \d+: /, '')}
                </h4>
              </div>

              {/* METADATA BAR (HOURS & TOPIC COUNT) */}
              <div className="stage-card-meta">
                <span className="stage-meta-pill">
                  <Layers size={11} />
                  <span>{doneCount}/{totalCount} topics</span>
                </span>
                <span className="stage-meta-pill">
                  <Clock size={11} />
                  <span>{estimatedHours}</span>
                </span>
              </div>

              {/* CARD BOTTOM ACTION FOOTER */}
              <div className="stage-card-footer">
                <span className="jump-cta-text">
                  {isCompleted ? 'Completed' : 'Explore Stage'}
                </span>
                <ArrowRight size={13} className="jump-cta-arrow" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── HORIZON SCRUBBER SLIDER TRACK ── */}
      <div className="stage-scrubber-panel">
        <div className="scrubber-label-row">
          <div className="scrubber-active-indicator">
            <Sliders size={13} color="var(--py-yellow)" />
            <span>Horizon Scrubber:</span>
            <strong className="scrubber-stage-name">
              Stage {activeStageIndex + 1} — {categories[activeStageIndex]?.title.replace(/^Level \d+: /, '')}
            </strong>
          </div>
          <span className="scrubber-counter-badge">
            {activeStageIndex + 1} / {categories.length}
          </span>
        </div>

        <div className="scrubber-slider-wrapper">
          <input
            type="range"
            min="0"
            max={categories.length - 1}
            value={activeStageIndex}
            onChange={handleSliderScrub}
            className="horizon-range-slider"
            aria-label="Scrub through stages"
          />
          <div className="scrubber-ticks-row">
            {categories.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`scrubber-tick-dot ${i === activeStageIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveStageIndex(i);
                  scrollToLevel(c.id, i);
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({ left: i * 290, behavior: 'smooth' });
                  }
                }}
                title={`Jump to Stage ${i + 1}`}
              >
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
