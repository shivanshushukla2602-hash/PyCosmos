import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Zap, CheckCircle2, ChevronRight, Activity, Orbit, Compass } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export default function RoadmapProgressHeader({ categories, completedMap }) {
  const [hoveredStage, setHoveredStage] = useState(null);

  let totalTopics = 0;
  let totalCompleted = 0;

  const levelStats = categories.map((cat, idx) => {
    let catTotal = 0;
    let catDone = 0;
    cat.nodes.forEach(n => {
      n.topicIds.forEach(id => {
        catTotal += 1;
        totalTopics += 1;
        if (completedMap[id]) {
          catDone += 1;
          totalCompleted += 1;
        }
      });
    });
    const percent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
    return {
      id: cat.id,
      levelNum: idx + 1,
      title: cat.title.replace(/^Level \d+: /, ''),
      color: cat.color || '#38bdf8',
      total: catTotal,
      done: catDone,
      percent
    };
  });

  const overallPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  // Rank title determination
  const rankTitle =
    overallPercent >= 90
      ? 'Galactic Master'
      : overallPercent >= 60
      ? 'Astro Architect'
      : overallPercent >= 30
      ? 'Cosmic Navigator'
      : overallPercent > 0
      ? 'Stellar Initiate'
      : 'Novice Voyager';

  // SVG Wave Graph coordinate calculations
  // ViewBox: 0 0 800 150
  const paddingX = 40;
  const width = 800;
  const chartHeight = 110;
  const baseY = 130;
  const availableWidth = width - paddingX * 2;
  const stepX = levelStats.length > 1 ? availableWidth / (levelStats.length - 1) : 0;

  // Points for total capacity curve (density)
  const maxTopicsInStage = Math.max(...levelStats.map(s => s.total), 8);
  const pointsTotal = levelStats.map((stat, i) => {
    const x = paddingX + i * stepX;
    // Map total topics to curve height (20% to 85% of chart height)
    const normalizedY = baseY - (stat.total / maxTopicsInStage) * (chartHeight * 0.85);
    return { x, y: normalizedY, stat };
  });

  // Points for user completed curve (velocity)
  const pointsDone = levelStats.map((stat, i) => {
    const x = paddingX + i * stepX;
    const progressRatio = stat.total > 0 ? stat.done / stat.total : 0;
    const maxY = baseY - (stat.total / maxTopicsInStage) * (chartHeight * 0.85);
    // Y is interpolated between baseY and maxY based on completion
    const y = baseY - (baseY - maxY) * progressRatio;
    return { x, y: stat.done > 0 ? y : baseY - 4, stat, progressRatio };
  });

  // Build smooth SVG bezier paths
  const createSmoothPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathTotalLine = createSmoothPath(pointsTotal);
  const pathTotalArea = `${pathTotalLine} L ${pointsTotal[pointsTotal.length - 1].x} ${baseY} L ${pointsTotal[0].x} ${baseY} Z`;

  const pathDoneLine = createSmoothPath(pointsDone);
  const pathDoneArea = `${pathDoneLine} L ${pointsDone[pointsDone.length - 1].x} ${baseY} L ${pointsDone[0].x} ${baseY} Z`;

  const scrollToStage = (stageId) => {
    const el = document.getElementById(`level-section-${stageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="cosmic-velocity-horizon-card"
    >
      {/* ── TOP TELEMETRY DECK: ORBITAL HUD & SUMMARY ── */}
      <div className="velocity-horizon-top">
        {/* LEFT: DUAL-RING ORBITAL HUD */}
        <div className="orbital-hud-wrapper">
          <div className="orbital-rings-stage">
            <svg width="124" height="124" viewBox="0 0 124 124" className="orbital-svg">
              {/* Outer decorative tracks */}
              <circle cx="62" cy="62" r="56" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="62" cy="62" r="48" fill="none" stroke="rgba(48, 105, 152, 0.2)" strokeWidth="6" />

              {/* Progress Outer Arc */}
              <motion.circle
                cx="62"
                cy="62"
                r="48"
                fill="none"
                stroke="url(#orbitGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - overallPercent / 100) }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                transform="rotate(-90 62 62)"
              />

              {/* Inner Orbit Line */}
              <circle cx="62" cy="62" r="37" fill="none" stroke="rgba(232, 185, 35, 0.15)" strokeWidth="2" />

              {/* Satellite Particle Rotating Orbit */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '62px', originY: '62px' }}
              >
                <circle cx="62" cy="14" r="4" fill="#ffd43b" style={{ filter: 'drop-shadow(0 0 6px #ffd43b)' }} />
              </motion.g>

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#ffd43b" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Metrics */}
            <div className="orbital-center-stat">
              <span className="orbital-percent-num">
                <AnimatedCounter value={overallPercent} />%
              </span>
              <span className="orbital-status-badge">MASTERY</span>
            </div>
          </div>

          {/* Telemetry Readout Details */}
          <div className="orbital-telemetry-text">
            <div className="orbital-rank-pill">
              <Sparkles size={13} className="sparkle-pulse" />
              <span>{rankTitle}</span>
              <span className="telemetry-dot" />
              <span>STAGE VELOCITY</span>
            </div>
            <h2 className="orbital-headline">
              <AnimatedCounter value={totalCompleted} /> of {totalTopics} Topics Conquered
            </h2>
            <p className="orbital-desc">
              {overallPercent === 100
                ? 'Mission Accomplished! You have mastered 100% of the entire Python architecture.'
                : `System trajectory active: ${totalTopics - totalCompleted} topics remaining across 10 structured mission stages.`}
            </p>
          </div>
        </div>

        {/* RIGHT: QUICK TELEMETRY CHIPS */}
        <div className="velocity-quick-stats">
          <div className="velocity-chip">
            <span className="chip-label">Curriculum Stages</span>
            <div className="chip-value-row">
              <span className="chip-val">10</span>
              <span className="chip-sub">Stages Total</span>
            </div>
            <div className="chip-mini-bar">
              <div
                className="chip-mini-fill"
                style={{ width: `${(levelStats.filter(s => s.percent === 100).length / 10) * 100}%`, background: 'var(--py-yellow)' }}
              />
            </div>
          </div>

          <div className="velocity-chip">
            <span className="chip-label">Active Velocity</span>
            <div className="chip-value-row">
              <span className="chip-val">{levelStats.filter(s => s.done > 0 && s.percent < 100).length}</span>
              <span className="chip-sub">In-Flight Stages</span>
            </div>
            <div className="chip-mini-bar">
              <div
                className="chip-mini-fill"
                style={{ width: `${Math.min(100, overallPercent + 15)}%`, background: '#38bdf8' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: INTERACTIVE SVG CURRICULUM VELOCITY WAVE CHART ── */}
      <div className="velocity-chart-wrapper">
        <div className="velocity-chart-header">
          <div className="chart-legend-row">
            <span className="chart-title-tag">
              <Activity size={14} color="#38bdf8" />
              <span>Curriculum Velocity Horizon & Topic Wave</span>
            </span>
            <div className="legend-pills-group">
              <span className="legend-chip total-chip">
                <span className="dot dot-total" /> Curriculum Density
              </span>
              <span className="legend-chip done-chip">
                <span className="dot dot-done" /> Topics Mastered
              </span>
            </div>
          </div>
          <span className="chart-hint-text">Hover any milestone node to inspect stage telemetry</span>
        </div>

        <div className="velocity-svg-container">
          <svg viewBox="0 0 800 150" className="velocity-wave-svg" preserveAspectRatio="none">
            <defs>
              {/* Total Capacity Gradient Fill */}
              <linearGradient id="totalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.22)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0.01)" />
              </linearGradient>

              {/* Mastered Velocity Gradient Fill */}
              <linearGradient id="doneAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 212, 59, 0.35)" />
                <stop offset="100%" stopColor="rgba(34, 197, 94, 0.02)" />
              </linearGradient>

              {/* Glowing Line Gradients */}
              <linearGradient id="totalLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="doneLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ffd43b" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="30" y1="40" x2="770" y2="40" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 6" />
            <line x1="30" y1="85" x2="770" y2="85" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 6" />
            <line x1="30" y1="130" x2="770" y2="130" stroke="rgba(255, 255, 255, 0.08)" />

            {/* Area 1: Total Curriculum Density */}
            <path d={pathTotalArea} fill="url(#totalAreaGrad)" />
            <path d={pathTotalLine} fill="none" stroke="url(#totalLineGrad)" strokeWidth="2" strokeDasharray="3 3" />

            {/* Area 2: User Completed Topics Wave */}
            {totalCompleted > 0 && (
              <>
                <motion.path
                  d={pathDoneArea}
                  fill="url(#doneAreaGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
                <motion.path
                  d={pathDoneLine}
                  fill="none"
                  stroke="url(#doneLineGrad)"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 212, 59, 0.45))' }}
                />
              </>
            )}

            {/* Milestone Nodes along the wave */}
            {pointsTotal.map((pt, idx) => {
              const isHovered = hoveredStage === pt.stat.levelNum;
              const isDone = pt.stat.percent === 100;
              const hasProgress = pt.stat.done > 0;
              const nodeColor = pt.stat.color;

              return (
                <g
                  key={pt.stat.levelNum}
                  className="wave-node-group"
                  onMouseEnter={() => setHoveredStage(pt.stat.levelNum)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => scrollToStage(pt.stat.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Vertical Guide Ray on hover */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1="20"
                      x2={pt.x}
                      y2="130"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                      opacity="0.8"
                    />
                  )}

                  {/* Base Anchor on horizon floor */}
                  <circle cx={pt.x} cy={baseY} r="3" fill="rgba(255, 255, 255, 0.2)" />

                  {/* Milestone Peak Node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 9 : 6}
                    fill={isDone ? '#22c55e' : hasProgress ? '#ffd43b' : '#0f172a'}
                    stroke={nodeColor}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{
                      transition: 'all 0.2s ease',
                      filter: isHovered || isDone ? `drop-shadow(0 0 8px ${nodeColor})` : 'none'
                    }}
                  />

                  {/* Stage Number Label beneath ground line */}
                  <text
                    x={pt.x}
                    y={baseY + 16}
                    textAnchor="middle"
                    fill={isHovered ? '#ffd43b' : 'rgba(255, 255, 255, 0.45)'}
                    fontSize="10"
                    fontWeight={isHovered ? '800' : '600'}
                  >
                    S{pt.stat.levelNum}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Telemetry Card */}
          <AnimatePresence>
            {hoveredStage !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="chart-hover-popover"
                style={{
                  left: `${((hoveredStage - 1) / (levelStats.length - 1)) * 88 + 6}%`
                }}
              >
                {(() => {
                  const s = levelStats[hoveredStage - 1];
                  return (
                    <div>
                      <div className="popover-header">
                        <span className="popover-badge" style={{ background: `${s.color}25`, color: s.color }}>
                          Stage {s.levelNum}
                        </span>
                        <span className="popover-percent">{s.percent}%</span>
                      </div>
                      <div className="popover-title">{s.title}</div>
                      <div className="popover-meta">
                        <span>{s.done} of {s.total} topics mastered</span>
                        <span className="popover-action">Click to view ↓</span>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM: CONSTELLATION NODES CHAIN ── */}
      <div className="constellation-nodes-bar">
        <div className="constellation-track-line" />
        <div className="constellation-nodes-scroll">
          {levelStats.map((stat, i) => {
            const romanNums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
            const isCompleted = stat.percent === 100;
            const isInProgress = stat.percent > 0 && !isCompleted;

            return (
              <motion.button
                key={stat.levelNum}
                type="button"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToStage(stat.id)}
                onMouseEnter={() => setHoveredStage(stat.levelNum)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`constellation-node-pill ${isCompleted ? 'is-complete' : isInProgress ? 'is-active' : ''}`}
                style={{
                  '--stage-accent': stat.color
                }}
              >
                <div className="node-pill-glyph">
                  {isCompleted ? (
                    <CheckCircle2 size={13} color="#22c55e" />
                  ) : (
                    <span>{romanNums[i] || stat.levelNum}</span>
                  )}
                </div>
                <div className="node-pill-info">
                  <span className="node-pill-stage">Stage {stat.levelNum}</span>
                  <span className="node-pill-progress">
                    {stat.done}/{stat.total}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
