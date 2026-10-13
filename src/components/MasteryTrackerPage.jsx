import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Search,
  Filter,
  Flame,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  Check,
  BookOpen,
  X,
  Terminal,
  Workflow,
  Cpu,
  Zap,
  Shield,
  Target,
  Activity,
  Sliders,
  ChevronRight,
  Compass,
  GitBranch,
  Database,
  FileCode,
  Box,
  Package,
  Server,
  Brain,
  Flag,
  Share2
} from 'lucide-react';
import { MASTERY_LEVELS, PROGRESSION_TRACKS } from '../data/masteryLevels';
import { TOPICS_BY_ID } from '../data/topicsData';
import { celebrate } from '../utils/celebrate';
import { AnimatedCounter } from './AnimatedCounter';
import PyCosmosLogo from './PyCosmosLogo';

// Stage icons & bespoke theme accents for the 10 Progression Stages
const STAGE_CONFIGS = [
  { icon: Flame, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.35)', codename: 'Core Ignition' },
  { icon: Database, color: '#ffd43b', glow: 'rgba(255, 212, 59, 0.35)', codename: 'Memory Vault' },
  { icon: Workflow, color: '#34d399', glow: 'rgba(52, 211, 153, 0.35)', codename: 'Execution Flow' },
  { icon: FileCode, color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.35)', codename: 'System Interface' },
  { icon: Box, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)', codename: 'Object Architecture' },
  { icon: Cpu, color: '#fb923c', glow: 'rgba(251, 146, 60, 0.35)', codename: 'CPython Core' },
  { icon: Package, color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.35)', codename: 'Batteries Included' },
  { icon: Shield, color: '#4ade80', glow: 'rgba(74, 222, 128, 0.35)', codename: 'Production Hardening' },
  { icon: Brain, color: '#e879f9', glow: 'rgba(232, 121, 249, 0.35)', codename: 'Intelligence Mesh' },
  { icon: Flag, color: '#facc15', glow: 'rgba(250, 204, 21, 0.35)', codename: 'Apex Engineering' },
];

const CATEGORY_ITEMS = [
  { id: 'all', label: 'All Areas' },
  { id: 'Foundation', label: 'Foundation' },
  { id: 'Core Data Structures', label: 'Core Data Structures' },
  { id: 'Functions', label: 'Functions' },
  { id: 'Practical Python', label: 'Practical Python' },
  { id: 'OOP', label: 'OOP' },
  { id: 'Python Internals', label: 'Python Internals' },
  { id: 'Standard Library', label: 'Standard Library' },
  { id: 'Professional Python', label: 'Professional Python' },
  { id: 'Development', label: 'Development' },
  { id: 'Projects + Problem Solving', label: 'Projects & Problems' }
];

export default function MasteryTrackerPage({
  completedMap = {},
  onNavigateToTopic,
  subtopicStatusMap = {},
  onToggleSubtopicStatus,
  onShowToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeStageTrack, setActiveStageTrack] = useState(null);
  const [viewMode, setViewMode] = useState('deck'); // 'deck' | 'matrix' | 'tree'
  const [focusedLevelNum, setFocusedLevelNum] = useState(null);

  const handleFocusOnLevel = (targetLvl) => {
    if (!targetLvl) return;

    // Reset filters that could hide target level
    setSearchQuery('');
    setFilterCategory('all');
    setFilterStatus('all');
    setActiveStageTrack(null);
    setFocusedLevelNum(targetLvl.level);

    if (onShowToast) {
      onShowToast(`Focusing on Level ${targetLvl.level}: ${targetLvl.area}`);
    }

    setTimeout(() => {
      const el = document.getElementById(`level-card-${targetLvl.level}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const container = document.querySelector('.holocron-deck-container, .tracker-filter-cockpit');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);

    setTimeout(() => {
      setFocusedLevelNum(null);
    }, 4500);
  };

  // Compute status for each of the 27 levels:
  const getLevelStatus = (lvl) => {
    const total = lvl.topicIds.length;
    const completed = lvl.topicIds.filter((tId) => !!completedMap[tId]).length;

    if (completed === total && total > 0) return { status: 'completed', label: 'Completed', completedCount: completed, totalCount: total, percent: 100 };
    if (completed > 0) return { status: 'learning', label: 'In Progress', completedCount: completed, totalCount: total, percent: Math.round((completed / total) * 100) };
    return { status: 'not_started', label: 'Not Started', completedCount: 0, totalCount: total, percent: 0 };
  };

  const totalLevels = MASTERY_LEVELS.length; // 27
  const completedLevels = MASTERY_LEVELS.filter((lvl) => getLevelStatus(lvl).status === 'completed').length;
  const inProgressLevels = MASTERY_LEVELS.filter((lvl) => getLevelStatus(lvl).status === 'learning').length;
  const notStartedLevels = totalLevels - completedLevels - inProgressLevels;
  const overallPercent = Math.round((completedLevels / totalLevels) * 100);

  const categoryCounts = useMemo(() => {
    const counts = { all: totalLevels };
    MASTERY_LEVELS.forEach((lvl) => {
      counts[lvl.category] = (counts[lvl.category] || 0) + 1;
    });
    return counts;
  }, [totalLevels]);

  // Filter levels based on search, category, status, and activeStageTrack
  const filteredLevels = MASTERY_LEVELS.filter((lvl) => {
    const statusObj = getLevelStatus(lvl);

    // Status filter
    if (filterStatus === 'completed' && statusObj.status !== 'completed') return false;
    if (filterStatus === 'learning' && statusObj.status !== 'learning') return false;
    if (filterStatus === 'not_started' && statusObj.status !== 'not_started') return false;

    // Progression Stage Track Filter
    if (activeStageTrack !== null) {
      const track = PROGRESSION_TRACKS[activeStageTrack];
      if (track) {
        const [startTopicIdx, endTopicIdx] = track.range;
        const levelTopicNums = lvl.topicIds.map(tId => TOPICS_BY_ID[tId]?.topicNum).filter(n => n !== undefined);
        const overlaps = levelTopicNums.some(num => num >= startTopicIdx && num <= endTopicIdx);
        if (!overlaps) return false;
      }
    }

    // Category filter
    const matchesCategory = filterCategory === 'all' || lvl.category === filterCategory;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesArea = lvl.area.toLowerCase().includes(q);
    const matchesDesc = lvl.description.toLowerCase().includes(q);
    const matchesTopics = lvl.topicIds.some(tId => {
      const t = TOPICS_BY_ID[tId];
      return t ? t.title.toLowerCase().includes(q) : tId.toLowerCase().includes(q);
    });

    return matchesCategory && (matchesArea || matchesDesc || matchesTopics);
  });

  const nextTargetLevel = MASTERY_LEVELS.find((l) => getLevelStatus(l).status !== 'completed');

  // 6 ARCHITECTURAL PILLARS FOR SVG RADAR CHART
  const PILLARS = [
    { id: 'runtime', name: 'Runtime & Primitives', levels: [1, 2, 3, 4, 5], color: '#38bdf8' },
    { id: 'functional', name: 'Functions & Iterators', levels: [6, 7, 8], color: '#34d399' },
    { id: 'oop', name: 'OOP & Metaprogramming', levels: [9, 10, 11, 12, 13], color: '#ffd43b' },
    { id: 'async', name: 'Async & Concurrency', levels: [14, 15, 16, 17], color: '#f43f5e' },
    { id: 'internals', name: 'CPython Internals & GIL', levels: [18, 19, 20, 21, 22], color: '#c084fc' },
    { id: 'systems', name: 'Production Systems', levels: [23, 24, 25, 26, 27], color: '#60a5fa' }
  ];

  const pillarStats = PILLARS.map((p) => {
    const lvlObjects = MASTERY_LEVELS.filter((lvl) => p.levels.includes(lvl.level));
    const done = lvlObjects.filter((lvl) => getLevelStatus(lvl).status === 'completed').length;
    const total = lvlObjects.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ...p, done, total, percent };
  });

  const [activePillarHover, setActivePillarHover] = useState(null);

  // Radar chart SVG geometry
  const radarCX = 135;
  const radarCY = 135;
  const radarR = 92;

  const getHexPoints = (radiusRatio) => {
    const r = radarR * radiusRatio;
    return PILLARS.map((_, i) => {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      return `${radarCX + r * Math.cos(angle)},${radarCY + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const radarDataPoints = pillarStats.map((stat, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const r = radarR * (0.16 + (stat.percent / 100) * 0.84);
    const x = radarCX + r * Math.cos(angle);
    const y = radarCY + r * Math.sin(angle);
    const outerX = radarCX + (radarR + 18) * Math.cos(angle);
    const outerY = radarCY + (radarR + 18) * Math.sin(angle);
    return { x, y, outerX, outerY, angle, stat, i };
  });

  const radarPolygonStr = radarDataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // 4-Tier Belt Definition
  const TIERS = [
    {
      id: 'apprentice',
      tierNum: 1,
      title: 'Apprentice Voyager',
      range: 'L1 - L6',
      color: '#38bdf8',
      perk: 'CPython & Primitives Unlocked',
      minLevels: 0,
      levels: [1, 2, 3, 4, 5, 6],
      isUnlocked: true,
      isCurrent: completedLevels < 7
    },
    {
      id: 'architect',
      tierNum: 2,
      title: 'Systems Architect',
      range: 'L7 - L13',
      color: '#ffd43b',
      perk: 'OOP & Metaprogramming Cleared',
      minLevels: 7,
      levels: [7, 8, 9, 10, 11, 12, 13],
      isUnlocked: completedLevels >= 7,
      isCurrent: completedLevels >= 7 && completedLevels < 14
    },
    {
      id: 'grandmaster',
      tierNum: 3,
      title: 'Python Grandmaster',
      range: 'L14 - L20',
      color: '#34d399',
      perk: 'Async, Concurrency & GIL Cleared',
      minLevels: 14,
      levels: [14, 15, 16, 17, 18, 19, 20],
      isUnlocked: completedLevels >= 14,
      isCurrent: completedLevels >= 14 && completedLevels < 21
    },
    {
      id: 'paragon',
      tierNum: 4,
      title: 'Cosmic Paragon',
      range: 'L21 - L27',
      color: '#c084fc',
      perk: 'Full Bytecode & Architecture Mastered',
      minLevels: 21,
      levels: [21, 22, 23, 24, 25, 26, 27],
      isUnlocked: completedLevels >= 21,
      isCurrent: completedLevels >= 21
    }
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterStatus('all');
    setActiveStageTrack(null);
  };

  const isFilteringActive = searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || activeStageTrack !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mastery-tracker-page"
    >
      {/* 1. BESPOKE ARCHITECTURAL RADAR & TELEMETRY COMMAND BRIDGE */}
      <div className="radar-telemetry-command-banner">
        {/* TOP TITLE ROW */}
        <div className="command-banner-header">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}
          >
            <div style={{ position: 'relative' }}>
              <div className="hero-snake-bloom" style={{ width: '64px', height: '64px' }} />
              <PyCosmosLogo size={38} animated={true} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
              27-LEVEL PYTHON MASTERY MATRIX
            </span>
          </motion.div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0.1rem 0 0.4rem', color: 'var(--text-primary)' }}>
            Python <span className="forge-gradient-text">Mastery Tracker</span>
          </h1>
          <p style={{ maxWidth: '780px', lineHeight: 1.55, color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Systematic progression across all 27 technical milestones—from fundamental CPython execution mechanics to asynchronous concurrency and production architectures.
          </p>
        </div>

        {/* BESPOKE COMMAND DECK: RADAR MATRIX (LEFT) + TELEMETRY HUD (RIGHT) */}
        <div className="radar-telemetry-grid">
          {/* LEFT: 6-PILLAR INTERACTIVE SVG RADAR CHART */}
          <div className="radar-chart-card">
            <div className="radar-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Activity size={15} color="#38bdf8" />
                <span className="radar-card-title">6-Pillar Skill Radar Matrix</span>
              </div>
              <span className="radar-live-badge">TELEMETRY LIVE</span>
            </div>

            <div className="radar-svg-wrapper">
              <svg width="270" height="270" viewBox="0 0 270 270" className="radar-svg">
                <defs>
                  <linearGradient id="radarPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(48, 105, 152, 0.45)" />
                    <stop offset="50%" stopColor="rgba(255, 212, 59, 0.35)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0.4)" />
                  </linearGradient>
                  <radialGradient id="radarBaseGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(48, 105, 152, 0.08)" />
                    <stop offset="100%" stopColor="rgba(48, 105, 152, 0.01)" />
                  </radialGradient>
                </defs>

                {/* Base Background Hexagon */}
                <polygon points={getHexPoints(1.0)} fill="url(#radarBaseGrad)" stroke="#306998" strokeWidth="1.5" strokeOpacity="0.3" />

                {/* Inner Concentric Grid Hexagons */}
                <polygon points={getHexPoints(0.75)} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                <polygon points={getHexPoints(0.5)} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                <polygon points={getHexPoints(0.25)} fill="none" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />

                {/* Axis Spokes from center to outer vertices */}
                {radarDataPoints.map((pt, i) => (
                  <line
                    key={i}
                    x1={radarCX}
                    y1={radarCY}
                    x2={radarCX + radarR * Math.cos(pt.angle)}
                    y2={radarCY + radarR * Math.sin(pt.angle)}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeOpacity="0.35"
                  />
                ))}

                {/* Animated Dynamic Data Polygon */}
                <motion.polygon
                  points={radarPolygonStr}
                  fill="url(#radarPolyGrad)"
                  stroke="#306998"
                  strokeWidth="2.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ originX: `${radarCX}px`, originY: `${radarCY}px` }}
                />

                {/* Vertices & Hover Nodes */}
                {radarDataPoints.map((pt, i) => {
                  const isHovered = activePillarHover === i;
                  return (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 7 : 5}
                        fill={pt.stat.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ cursor: 'pointer', transition: 'r 0.2s ease', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                        onMouseEnter={() => setActivePillarHover(i)}
                        onMouseLeave={() => setActivePillarHover(null)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Pillar Legend Grid */}
            <div className="radar-pillars-legend">
              {pillarStats.map((p, i) => (
                <div
                  key={p.id}
                  className={`radar-pillar-item ${activePillarHover === i ? 'hovered' : ''}`}
                  onMouseEnter={() => setActivePillarHover(i)}
                  onMouseLeave={() => setActivePillarHover(null)}
                >
                  <div className="pillar-header-row">
                    <span className="pillar-dot" style={{ background: p.color }} />
                    <span className="pillar-name">{p.name}</span>
                    <span className="pillar-val">{p.percent}%</span>
                  </div>
                  <div className="pillar-bar-track">
                    <div
                      className="pillar-bar-fill"
                      style={{ width: `${Math.max(p.percent, 3)}%`, background: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: OVERALL HUD STATS & OBJECTIVES */}
          <div className="telemetry-hud-card">
            <div className="telemetry-top-stats">
              <div className="telemetry-stat-tile">
                <div className="stat-tile-top">
                  <span className="stat-tile-label">MASTERED MILESTONES</span>
                  <Award size={16} color="var(--py-blue)" />
                </div>
                <div className="stat-tile-val">
                  <span className="val-accent"><AnimatedCounter value={completedLevels} /></span>
                  <span className="val-total"> / {totalLevels}</span>
                </div>
                <div className="stat-progress-track">
                  <div className="stat-progress-fill" style={{ width: `${overallPercent}%`, background: 'var(--py-blue)' }} />
                </div>
                <div className="stat-tile-sub">{overallPercent}% Complete</div>
              </div>

              <div className="telemetry-stat-tile">
                <div className="stat-tile-top">
                  <span className="stat-tile-label">IN FLIGHT ACTIVE</span>
                  <Flame size={16} color="#b45309" />
                </div>
                <div className="stat-tile-val">
                  <span className="val-learning"><AnimatedCounter value={inProgressLevels} /></span>
                  <span className="val-total"> Active</span>
                </div>
                <div className="stat-progress-track">
                  <div className="stat-progress-fill" style={{ width: `${(inProgressLevels / totalLevels) * 100}%`, background: '#f59e0b' }} />
                </div>
                <div className="stat-tile-sub">{inProgressLevels} Levels in Progress</div>
              </div>
            </div>

            {/* NEXT LEVEL OBJECTIVE POD */}
            <div className="next-objective-pod">
              <div className="next-objective-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Target size={16} color="#b45309" />
                  <span className="target-badge-label">NEXT OBJECTIVE TARGET</span>
                </div>
                {nextTargetLevel && (
                  <span className="target-level-pill">Level {nextTargetLevel.level}</span>
                )}
              </div>

              {nextTargetLevel ? (
                <div className="target-pod-body">
                  <h4 className="target-topic-title">{nextTargetLevel.area}</h4>
                  <p className="target-topic-desc">{nextTargetLevel.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => handleFocusOnLevel(nextTargetLevel)}
                      className="target-jump-btn"
                      title={`Jump and focus directly on Level ${nextTargetLevel.level}`}
                    >
                      <span>Focus on Level {nextTargetLevel.level}</span>
                      <ArrowRight size={14} />
                    </button>
                    {nextTargetLevel.topicIds?.[0] && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTopic(nextTargetLevel.topicIds[0])}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#FFFFFF',
                          border: '1.5px solid rgba(48, 105, 152, 0.25)',
                          color: '#205075',
                          padding: '0.5rem 0.95rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.2s ease'
                        }}
                        title={`Start studying topic for Level ${nextTargetLevel.level}`}
                      >
                        <BookOpen size={13} color="#306998" />
                        <span>Start Topic</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="target-pod-body">
                  <h4 className="target-topic-title" style={{ color: '#16a34a' }}>All 27 Milestones Mastered!</h4>
                  <p className="target-topic-desc">You have achieved supreme Python engineering mastery across all domains.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── HOLOGRAPHIC 4-TIER BELT SHOWCASE ── */}
        <div className="holographic-tier-belt">
          <div className="tier-belt-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Award size={15} color="var(--py-yellow)" />
              <span className="tier-belt-title">Holographic Mastery Tier Belt</span>
            </div>
            <span className="tier-belt-sub">Unlocked automatically as you master the 27 levels</span>
          </div>

          <div className="tier-cards-track">
            {TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                whileHover={{ y: -3, scale: 1.015 }}
                className={`holographic-tier-card ${tier.isCurrent ? 'is-current' : tier.isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                style={{ '--tier-color': tier.color }}
              >
                <div className="tier-card-status-bar">
                  <span className="tier-range-badge">{tier.range}</span>
                  {tier.isCurrent && <span className="tier-current-tag">ACTIVE TIER</span>}
                  {!tier.isCurrent && tier.isUnlocked && <span className="tier-completed-tag">CLEARED ✓</span>}
                  {!tier.isUnlocked && <span className="tier-locked-tag">LOCKED</span>}
                </div>

                <div className="tier-card-body">
                  <div className="tier-card-icon-emblem" style={{ color: tier.color, background: `${tier.color}15`, border: `1px solid ${tier.color}35` }}>
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h5 className="tier-card-title">{tier.title}</h5>
                    <span className="tier-card-perk">{tier.perk}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. THE COSMIC EXPEDITION RAIL (UNIQUE INTERACTIVE ORBITAL PIPELINE)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="expedition-rail-section">
        <div className="expedition-rail-header">
          <div className="expedition-title-pack">
            <div className="expedition-crest">
              <Compass size={20} className="expedition-crest-icon" />
            </div>
            <div>
              <div className="expedition-kicker">INTERACTIVE EXPEDITION RAIL</div>
              <h2 className="expedition-title">10-Stage Architectural Pipeline</h2>
            </div>
          </div>
          <div className="expedition-header-actions">
            {activeStageTrack !== null ? (
              <button
                type="button"
                onClick={() => setActiveStageTrack(null)}
                className="expedition-reset-pill"
              >
                <span>Clear Stage Filter</span>
                <X size={13} />
              </button>
            ) : (
              <span className="expedition-guide-hint">Click any stage station to filter the 27 levels</span>
            )}
          </div>
        </div>

        {/* Continuous Connecting Expedition Track */}
        <div className="expedition-track-container">
          {/* Subtle background connecting laser line */}
          <div className="expedition-connecting-rail" />

          <div className="expedition-stations-scroll">
            {PROGRESSION_TRACKS.map((track, idx) => {
              const cfg = STAGE_CONFIGS[idx] || STAGE_CONFIGS[0];
              const IconComp = cfg.icon;
              const isSelected = activeStageTrack === idx;

              // Compute stage topic completion stats
              const [startTopicIdx, endTopicIdx] = track.range;
              const stageTopics = [];
              for (let t = startTopicIdx; t <= endTopicIdx; t++) {
                const found = Object.values(TOPICS_BY_ID).find(top => top.topicNum === t);
                if (found) stageTopics.push(found);
              }
              const stageDone = stageTopics.filter(t => !!completedMap[t.id]).length;
              const stagePercent = stageTopics.length > 0 ? Math.round((stageDone / stageTopics.length) * 100) : 0;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveStageTrack(isSelected ? null : idx)}
                  className={`expedition-station-node ${isSelected ? 'active-station' : ''}`}
                  style={{ '--stage-accent': cfg.color, '--stage-glow': cfg.glow }}
                >
                  <div className="station-orbit-ring">
                    <div className="station-icon-capsule">
                      <IconComp size={18} />
                    </div>
                    {stagePercent === 100 && (
                      <div className="station-mastered-beacon">✓</div>
                    )}
                  </div>

                  <div className="station-milestone-badge">STAGE {idx + 1}</div>
                  <h4 className="station-name">{track.name}</h4>
                  <div className="station-codename">{cfg.codename}</div>

                  <div className="station-progress-footer">
                    <div className="station-progress-bar-wrap">
                      <div
                        className="station-progress-bar-fill"
                        style={{ width: `${stagePercent}%`, background: cfg.color }}
                      />
                    </div>
                    <span className="station-progress-caption">{track.levels}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active Stage Mission Briefing Drawer (Expands when a stage is active) */}
        <AnimatePresence>
          {activeStageTrack !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="stage-briefing-drawer"
              style={{
                borderLeftColor: STAGE_CONFIGS[activeStageTrack]?.color || '#306998'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flex: 1, minWidth: 0 }}>
                {(() => {
                  const StageIcon = STAGE_CONFIGS[activeStageTrack]?.icon || Flame;
                  const stageCol = STAGE_CONFIGS[activeStageTrack]?.color || '#306998';
                  return (
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '13px',
                        background: `${stageCol}18`,
                        border: `1.5px solid ${stageCol}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stageCol,
                        flexShrink: 0
                      }}
                    >
                      <StageIcon size={22} />
                    </div>
                  );
                })()}
                <div className="briefing-content" style={{ minWidth: 0 }}>
                  <div className="briefing-pill-row">
                    <span
                      className="briefing-stage-chip"
                      style={{
                        background: `${STAGE_CONFIGS[activeStageTrack]?.color}15`,
                        color: STAGE_CONFIGS[activeStageTrack]?.color,
                        borderColor: `${STAGE_CONFIGS[activeStageTrack]?.color}40`
                      }}
                    >
                      STAGE {activeStageTrack + 1} ACTIVE
                    </span>
                    <span className="briefing-range-tag">
                      {PROGRESSION_TRACKS[activeStageTrack]?.levels}
                    </span>
                  </div>
                  <h3 className="briefing-title">{PROGRESSION_TRACKS[activeStageTrack]?.name}</h3>
                  <p className="briefing-desc">{PROGRESSION_TRACKS[activeStageTrack]?.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStageTrack(null)}
                className="briefing-dismiss-btn"
                title="Clear stage filter and view all stages"
              >
                <span>Show All Stages</span>
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          3. HIGH-TECH COCKPIT FILTER & VIEW CONTROLS
          ══════════════════════════════════════════════════════════════════ */}
      <div className="tracker-filter-cockpit">
        {/* Top Header Row: Search + Count Badge + View Switcher + Reset */}
        <div className="cockpit-top-bar">
          {/* Enhanced Search Input */}
          <div className="cockpit-search-box">
            <Search size={16} className="cockpit-search-icon" />
            <input
              type="text"
              placeholder="Search 27 levels by concept, topic, or keyword (e.g. OOP, Regex, Memory)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search mastery levels"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="cockpit-search-clear"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Controls Group */}
          <div className="cockpit-controls-group">
            {/* Live Count Pill */}
            <div className="cockpit-count-badge">
              <span className="count-dot" />
              <span>
                Showing <strong><AnimatedCounter value={filteredLevels.length} /></strong> of {totalLevels} Levels
              </span>
            </div>

            {/* Segmented View Switcher */}
            <div className="mastery-view-switcher" role="tablist" aria-label="View mode">
              <button
                type="button"
                className={`mastery-view-btn ${viewMode === 'deck' ? 'active' : ''}`}
                onClick={() => setViewMode('deck')}
                title="Holocron Deck View"
              >
                <LayoutGrid size={14} />
                <span>Holocron Deck</span>
              </button>
              <button
                type="button"
                className={`mastery-view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
                onClick={() => setViewMode('matrix')}
                title="Cyber HUD Table View"
              >
                <TableIcon size={14} />
                <span>Cyber HUD</span>
              </button>
              <button
                type="button"
                className={`mastery-view-btn ${viewMode === 'tree' ? 'active' : ''}`}
                onClick={() => setViewMode('tree')}
                title="Constellation Skill Tree"
              >
                <GitBranch size={14} />
                <span>Skill Tree</span>
              </button>
            </div>

            {/* Reset Filters Button */}
            {isFilteringActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="cockpit-reset-btn"
                title="Reset all active filters"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="cockpit-divider" />

        {/* Filter Rows Container */}
        <div className="cockpit-filter-rows">
          {/* Domain / Area Filter Row */}
          <div className="cockpit-filter-row">
            <div className="cockpit-row-label">
              <Layers size={13} />
              <span>Area / Domain</span>
            </div>
            <div className="cockpit-pills-list">
              {CATEGORY_ITEMS.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = filterCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cockpit-pill-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="cockpit-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mastery Status Filter Row */}
          <div className="cockpit-filter-row">
            <div className="cockpit-row-label">
              <Sliders size={13} />
              <span>Status</span>
            </div>
            <div className="cockpit-pills-list">
              <button
                type="button"
                className={`cockpit-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                <span>All Statuses</span>
                <span className="cockpit-pill-count">{totalLevels}</span>
              </button>
              <button
                type="button"
                className={`cockpit-pill-btn status-completed ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                <CheckCircle2 size={13} className="status-icon" color={filterStatus === 'completed' ? '#ffffff' : '#22c55e'} />
                <span>Completed</span>
                <span className="cockpit-pill-count">{completedLevels}</span>
              </button>
              <button
                type="button"
                className={`cockpit-pill-btn status-learning ${filterStatus === 'learning' ? 'active' : ''}`}
                onClick={() => setFilterStatus('learning')}
              >
                <Clock size={13} className="status-icon" color={filterStatus === 'learning' ? '#ffffff' : '#f59e0b'} />
                <span>In Progress</span>
                <span className="cockpit-pill-count">{inProgressLevels}</span>
              </button>
              <button
                type="button"
                className={`cockpit-pill-btn status-not-started ${filterStatus === 'not_started' ? 'active' : ''}`}
                onClick={() => setFilterStatus('not_started')}
              >
                <Circle size={12} className="status-icon" color={filterStatus === 'not_started' ? '#ffffff' : '#8b949e'} />
                <span>Not Started</span>
                <span className="cockpit-pill-count">{notStartedLevels}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Summary Strip */}
        {isFilteringActive && (
          <div className="cockpit-active-strip">
            <div className="active-strip-label">
              <Filter size={12} />
              <span>Active filters:</span>
            </div>
            <div className="active-tags-list">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="active-tag-chip"
                  title="Remove search query"
                >
                  <span>Search: "{searchQuery}"</span>
                  <X size={11} />
                </button>
              )}
              {filterCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className="active-tag-chip"
                  title="Clear domain filter"
                >
                  <span>Domain: {filterCategory}</span>
                  <X size={11} />
                </button>
              )}
              {filterStatus !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className="active-tag-chip"
                  title="Clear status filter"
                >
                  <span>
                    Status: {filterStatus === 'completed' ? 'Completed' : filterStatus === 'learning' ? 'In Progress' : 'Not Started'}
                  </span>
                  <X size={11} />
                </button>
              )}
              {activeStageTrack !== null && (
                <button
                  type="button"
                  onClick={() => setActiveStageTrack(null)}
                  className="active-tag-chip"
                  title="Clear stage filter"
                >
                  <span>Stage: {PROGRESSION_TRACKS[activeStageTrack]?.title || `Stage ${activeStageTrack + 1}`}</span>
                  <X size={11} />
                </button>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="clear-all-filters-btn"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          4. VIEW MODE 1: HOLOCRON DECK (GROUPED BY MASTERY TIERS)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'deck' && (
        <div className="holocron-deck-container">
          {filteredLevels.length === 0 ? (
            <div className="empty-mastery-state">
              <Search size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              <h3>No mastery levels match your search or filter</h3>
              <p>Try resetting filters or searching for terms like "Functions", "OOP", or "CPython".</p>
              <button onClick={resetFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            TIERS.map((tier) => {
              const tierLevels = filteredLevels.filter(lvl => tier.levels.includes(lvl.level));
              if (tierLevels.length === 0) return null;

              return (
                <div key={tier.id} className="holocron-tier-block">
                  <div className="tier-block-header">
                    <div className="tier-emblem-badge" style={{ background: `${tier.color}15`, borderColor: `${tier.color}44`, color: tier.color }}>
                      TIER {tier.tierNum}
                    </div>
                    <div>
                      <h3 className="tier-block-title">{tier.title}</h3>
                      <span className="tier-block-subtitle">{tier.perk} • ({tier.range})</span>
                    </div>
                  </div>

                  <div className="holocron-grid">
                    {tierLevels.map((lvl) => {
                      const statusObj = getLevelStatus(lvl);
                      const firstTopic = TOPICS_BY_ID[lvl.topicIds[0]];

                      return (
                        <motion.div
                          key={lvl.level}
                          id={`level-card-${lvl.level}`}
                          whileHover={{ y: -5, scale: 1.015 }}
                          className={`holocron-card status-${statusObj.status} ${focusedLevelNum === lvl.level ? 'is-focused-target' : ''}`}
                          style={{ '--card-accent': tier.color }}
                        >
                          <div className="holocron-card-top">
                            <div className="holocron-level-badge">
                              <span className="lvl-prefix">LVL</span>
                              <span className="lvl-num">{String(lvl.level).padStart(2, '0')}</span>
                            </div>

                            <span className={`holocron-status-tag ${statusObj.status}`}>
                              {statusObj.status === 'completed' && <Check size={11} />}
                              {statusObj.status === 'learning' && <Clock size={11} />}
                              {statusObj.status === 'not_started' && <Circle size={10} />}
                              <span>{statusObj.label}</span>
                            </span>
                          </div>

                          <div className="holocron-card-body">
                            <span className="holocron-cat-pill">{lvl.category}</span>
                            <h4 className="holocron-area-title">{lvl.area}</h4>
                            <p className="holocron-desc">{lvl.description}</p>

                            <div className="holocron-topic-chips">
                              {lvl.topicIds.map((tId) => {
                                const tObj = TOPICS_BY_ID[tId];
                                const isDone = !!completedMap[tId];
                                return (
                                  <button
                                    key={tId}
                                    type="button"
                                    onClick={() => onNavigateToTopic(tId)}
                                    className={`holocron-chip ${isDone ? 'is-done' : ''}`}
                                    title={`Study ${tObj ? tObj.title : tId}`}
                                  >
                                    {isDone && <Check size={10} />}
                                    <span>{tObj ? tObj.title : tId}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="holocron-card-footer">
                            <div className="holocron-progress-wrap">
                              <div
                                className="holocron-progress-fill"
                                style={{
                                  width: `${statusObj.percent}%`,
                                  background: statusObj.status === 'completed' ? '#22c55e' : statusObj.status === 'learning' ? 'var(--py-yellow)' : 'rgba(255, 255, 255, 0.1)'
                                }}
                              />
                            </div>

                            {firstTopic && (
                              <button
                                type="button"
                                onClick={() => onNavigateToTopic(firstTopic.id)}
                                className="holocron-study-btn"
                              >
                                <span>{statusObj.status === 'completed' ? 'Review Level' : 'Launch Study'}</span>
                                <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          5. VIEW MODE 2: CYBER HUD MATRIX (UPGRADED HIGH-TECH TABLE)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'matrix' && (
        <div className="tracker-table-container cyber-hud-table-wrapper">
          <table className="mastery-table cyber-hud-table">
            <thead>
              <tr>
                <th style={{ width: '90px', textAlign: 'center' }}>LEVEL</th>
                <th style={{ width: '220px' }}>AREA & DOMAIN</th>
                <th>SYLLABUS SCOPE & LESSONS COVERED</th>
                <th style={{ width: '150px', textAlign: 'center' }}>TELEMETRY STATUS</th>
                <th style={{ width: '140px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredLevels.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Search size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No mastery levels match your search or filter</div>
                    <button onClick={resetFilters} className="btn btn-secondary" style={{ marginTop: '0.75rem', padding: '0.35rem 0.85rem' }}>
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLevels.map((lvl) => {
                  const statusObj = getLevelStatus(lvl);
                  const firstTopic = TOPICS_BY_ID[lvl.topicIds[0]];

                  return (
                    <motion.tr
                      key={lvl.level}
                      id={`level-card-${lvl.level}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className={`status-row-${statusObj.status} cyber-hud-row ${focusedLevelNum === lvl.level ? 'is-focused-target' : ''}`}
                    >
                      <td className="level-col-cell">
                        <div className="cyber-level-capsule">
                          <span className="cyber-lvl-num">L{lvl.level}</span>
                        </div>
                      </td>

                      <td className="area-col-cell">
                        <strong className="cyber-area-title">{lvl.area}</strong>
                        <span className="cyber-cat-pill">{lvl.category}</span>
                      </td>

                      <td className="desc-col-cell">
                        <p className="level-desc-text">{lvl.description}</p>
                        <div className="level-topics-tags">
                          {lvl.topicIds.map((tId) => {
                            const tObj = TOPICS_BY_ID[tId];
                            const isDone = !!completedMap[tId];
                            return (
                              <button
                                key={tId}
                                type="button"
                                onClick={() => onNavigateToTopic(tId)}
                                className={`topic-tag-chip ${isDone ? 'done' : ''}`}
                                title={`Study ${tObj ? tObj.title : tId}`}
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  {isDone && <Check size={11} />}
                                  <span>{tObj ? tObj.title : tId}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      <td className="status-col-cell">
                        <div className={`cyber-beacon-pill ${statusObj.status}`}>
                          <span className="cyber-beacon-light" />
                          <span>{statusObj.label}</span>
                        </div>
                      </td>

                      <td className="action-col-cell">
                        {firstTopic && (
                          <button
                            type="button"
                            onClick={() => onNavigateToTopic(firstTopic.id)}
                            className="study-level-btn cyber-study-btn"
                          >
                            <span>{statusObj.status === 'completed' ? 'Review' : 'Study'}</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          6. VIEW MODE 3: CONSTELLATION SKILL TREE (INTERACTIVE NODE PATH)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'tree' && (
        <div className="constellation-tree-container">
          <div className="constellation-tree-header">
            <GitBranch size={18} color="var(--py-yellow)" />
            <span>Interactive Sequential Milestone Path (Level 01 → Level 27)</span>
          </div>

          <div className="constellation-nodes-track">
            {filteredLevels.map((lvl, index) => {
              const statusObj = getLevelStatus(lvl);
              const firstTopic = TOPICS_BY_ID[lvl.topicIds[0]];

              return (
                <div key={lvl.level} id={`level-card-${lvl.level}`} className={`constellation-node-wrapper ${focusedLevelNum === lvl.level ? 'is-focused-target' : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    onClick={() => firstTopic && onNavigateToTopic(firstTopic.id)}
                    className={`constellation-node-pill ${statusObj.status}`}
                    title={`${lvl.area} - ${statusObj.label}`}
                  >
                    <div className="node-num">L{lvl.level}</div>
                    <div className="node-area">{lvl.area}</div>
                    <div className="node-indicator">
                      {statusObj.status === 'completed' && '✓'}
                      {statusObj.status === 'learning' && '●'}
                      {statusObj.status === 'not_started' && '○'}
                    </div>
                  </motion.div>

                  {index < filteredLevels.length - 1 && (
                    <div className="constellation-link-beam" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
