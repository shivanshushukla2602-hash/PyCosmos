import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';
import { MASTERY_LEVELS, PROGRESSION_TRACKS } from '../data/masteryLevels';
import { TOPICS_BY_ID } from '../data/topicsData';
import { celebrate } from '../utils/celebrate';
import { AnimatedCounter } from './AnimatedCounter';
import PyCosmosLogo from './PyCosmosLogo';

export default function MasteryTrackerPage({
  completedMap = {},
  onNavigateToTopic,
  subtopicStatusMap = {},
  onToggleSubtopicStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeStageTrack, setActiveStageTrack] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

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
  const overallPercent = Math.round((completedLevels / totalLevels) * 100);

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
        // Check if level's topics overlap with the track range
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
      color: '#f59e0b',
      perk: 'CPython & Primitives Unlocked',
      minLevels: 0,
      isUnlocked: true,
      isCurrent: completedLevels < 7
    },
    {
      id: 'architect',
      tierNum: 2,
      title: 'Systems Architect',
      range: 'L7 - L13',
      color: '#38bdf8',
      perk: 'OOP & Metaprogramming Cleared',
      minLevels: 7,
      isUnlocked: completedLevels >= 7,
      isCurrent: completedLevels >= 7 && completedLevels < 14
    },
    {
      id: 'grandmaster',
      tierNum: 3,
      title: 'Python Grandmaster',
      range: 'L14 - L20',
      color: '#ffd43b',
      perk: 'Async, Concurrency & GIL Cleared',
      minLevels: 14,
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
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                    <stop offset="50%" stopColor="rgba(255, 212, 59, 0.35)" />
                    <stop offset="100%" stopColor="rgba(192, 132, 252, 0.4)" />
                  </linearGradient>
                  <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Concentric Grid Hexagons */}
                <polygon points={getHexPoints(0.25)} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <polygon points={getHexPoints(0.5)} fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" strokeDasharray="3 3" />
                <polygon points={getHexPoints(0.75)} fill="none" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" />
                <polygon points={getHexPoints(1.0)} fill="none" stroke="rgba(56, 189, 248, 0.22)" strokeWidth="1.5" />

                {/* Axis Spokes from center to outer vertices */}
                {radarDataPoints.map((pt, i) => (
                  <line
                    key={i}
                    x1={radarCX}
                    y1={radarCY}
                    x2={radarCX + radarR * Math.cos(pt.angle)}
                    y2={radarCY + radarR * Math.sin(pt.angle)}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                ))}

                {/* Animated Dynamic Data Polygon */}
                <motion.polygon
                  points={radarPolygonStr}
                  fill="url(#radarPolyGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  filter="url(#radarGlow)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ originX: `${radarCX}px`, originY: `${radarCY}px` }}
                />

                {/* Vertices & Hover Nodes */}
                {radarDataPoints.map((pt, i) => {
                  const isHovered = activePillarHover === pt.stat.id;
                  return (
                    <g
                      key={pt.stat.id}
                      onMouseEnter={() => setActivePillarHover(pt.stat.id)}
                      onMouseLeave={() => setActivePillarHover(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill={pt.stat.color}
                        stroke="#0f172a"
                        strokeWidth="2"
                        style={{
                          transition: 'all 0.2s ease',
                          filter: isHovered ? `drop-shadow(0 0 6px ${pt.stat.color})` : 'none'
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Pillar Tooltip / Pill readout */}
              <div className="radar-pillars-chips">
                {pillarStats.map((p) => {
                  const isHovered = activePillarHover === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`radar-pillar-chip ${isHovered ? 'hovered' : ''}`}
                      onMouseEnter={() => setActivePillarHover(p.id)}
                      onMouseLeave={() => setActivePillarHover(null)}
                      style={{ '--chip-accent': p.color }}
                    >
                      <span className="chip-dot" style={{ background: p.color }} />
                      <span className="chip-name">{p.name}</span>
                      <strong className="chip-pct">{p.percent}%</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: COMMAND TELEMETRY METRICS & TARGET POD */}
          <div className="telemetry-hud-card">
            <div className="telemetry-top-stats">
              {/* Stat 1: Overall Mastery */}
              <div className="hud-metric-pod primary-pod">
                <div className="metric-pod-label">
                  <Sparkles size={13} color="var(--py-yellow)" />
                  <span>OVERALL MASTERY</span>
                </div>
                <div className="metric-pod-value highlight">
                  <AnimatedCounter value={overallPercent} />%
                </div>
                <div className="pod-linear-track">
                  <motion.div
                    className="pod-linear-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(90deg, #38bdf8, #ffd43b)' }}
                  />
                </div>
              </div>

              {/* Stat 2: Completed Levels */}
              <div className="hud-metric-pod">
                <div className="metric-pod-label">
                  <CheckCircle2 size={13} color="#22c55e" />
                  <span>LEVELS CLEARED</span>
                </div>
                <div className="metric-pod-value">
                  <AnimatedCounter value={completedLevels} />
                  <span className="metric-denom"> / {totalLevels}</span>
                </div>
                <span className="pod-subtext">{totalLevels - completedLevels} levels remaining</span>
              </div>

              {/* Stat 3: In-Flight */}
              <div className="hud-metric-pod">
                <div className="metric-pod-label">
                  <Clock size={13} color="#f59e0b" />
                  <span>ACTIVE IN-FLIGHT</span>
                </div>
                <div className="metric-pod-value">
                  <AnimatedCounter value={inProgressLevels} />
                </div>
                <span className="pod-subtext">Currently learning</span>
              </div>
            </div>

            {/* NEXT TARGET MISSION BOX */}
            <div className="hud-target-pod">
              <div className="target-pod-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Target size={15} color="var(--py-yellow)" />
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
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(nextTargetLevel.area);
                    }}
                    className="target-jump-btn"
                  >
                    <span>Focus on Level {nextTargetLevel.level}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="target-pod-body">
                  <h4 className="target-topic-title" style={{ color: '#22c55e' }}>All 27 Milestones Mastered!</h4>
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

      {/* 2. RECOMMENDED LEARNING PROGRESSION (10 MILESTONES) */}
      <div className="progression-milestones-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="section-title-row" style={{ margin: 0 }}>
            <TrendingUp size={22} style={{ color: 'var(--py-blue-light)' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recommended Progression Tracks</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click any stage card to filter the 27 levels below</span>
            </div>
          </div>

          {activeStageTrack !== null && (
            <button
              onClick={() => setActiveStageTrack(null)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '8px' }}
            >
              Show All Stages
            </button>
          )}
        </div>

        <div className="progression-cards-grid">
          {PROGRESSION_TRACKS.map((track, i) => {
            const isSelected = activeStageTrack === i;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStageTrack(isSelected ? null : i)}
                className={`progression-card ${isSelected ? 'active-filter' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="progression-card-header">
                  <span className="milestone-badge">Stage {i + 1}</span>
                  <span className="levels-range">{track.levels}</span>
                </div>
                <h3 className="track-name">{track.name}</h3>
                <p className="track-desc">{track.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROLS */}
      <div className="tracker-filter-bar">
        {/* Search input */}
        <div className="filter-search-box">
          <Search size={16} color="var(--py-blue-light)" />
          <input
            type="text"
            placeholder="Search level or concept (e.g. OOP, Regex, Memory, Decorators)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Switcher & Results Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing <strong style={{ color: 'var(--py-yellow)' }}><AnimatedCounter value={filteredLevels.length} /></strong> of {totalLevels} Levels
          </span>

          <div className="mastery-view-switcher">
            <button
              className={`mastery-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              className={`mastery-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>

          {isFilteringActive && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="filter-categories-pills" style={{ width: '100%', marginTop: '0.25rem' }}>
          {['all', 'Foundation', 'Core Data Structures', 'Functions', 'Practical Python', 'OOP', 'Python Internals', 'Standard Library', 'Professional Python', 'Development', 'Projects + Problem Solving'].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'All Areas' : cat}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="filter-categories-pills" style={{ width: '100%' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Status:
          </span>
          <button
            className={`pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Statuses
          </button>
          <button
            className={`pill-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            <CheckCircle2 size={12} color="#22c55e" />
            <span>Completed</span>
          </button>
          <button
            className={`pill-btn ${filterStatus === 'learning' ? 'active' : ''}`}
            onClick={() => setFilterStatus('learning')}
          >
            <Clock size={12} color="#f59e0b" />
            <span>In Progress</span>
          </button>
          <button
            className={`pill-btn ${filterStatus === 'not_started' ? 'active' : ''}`}
            onClick={() => setFilterStatus('not_started')}
          >
            <Circle size={11} color="#8b949e" />
            <span>Not Started</span>
          </button>
        </div>
      </div>

      {/* 4. MASTERY MATRIX: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="tracker-table-container">
          <table className="mastery-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Level</th>
                <th style={{ width: '220px' }}>Area & Domain</th>
                <th>Syllabus Scope & Lessons Covered</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '130px', textAlign: 'right' }}>Action</th>
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`status-row-${statusObj.status}`}
                    >
                      <td className="level-col-cell">
                        <span className="level-num-badge">L{lvl.level}</span>
                      </td>

                      <td className="area-col-cell">
                        <strong>{lvl.area}</strong>
                        <span className="area-cat-tag">{lvl.category}</span>
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
                        <span className={`status-pill ${statusObj.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          {statusObj.status === 'completed' ? <CheckCircle2 size={12} /> : statusObj.status === 'learning' ? <Clock size={12} /> : <Circle size={11} />}
                          <span>{statusObj.label}</span>
                        </span>
                      </td>

                      <td className="action-col-cell">
                        {firstTopic && (
                          <button
                            type="button"
                            onClick={() => onNavigateToTopic(firstTopic.id)}
                            className="study-level-btn"
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
      ) : (
        /* 5. MASTERY MATRIX: VISUAL CARD GRID VIEW */
        <div className="mastery-grid-view">
          {filteredLevels.map((lvl) => {
            const statusObj = getLevelStatus(lvl);
            const firstTopic = TOPICS_BY_ID[lvl.topicIds[0]];

            return (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mastery-grid-card status-${statusObj.status}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="level-num-badge">Level {lvl.level}</span>
                    <span className={`status-pill ${statusObj.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      {statusObj.status === 'completed' ? <CheckCircle2 size={12} /> : statusObj.status === 'learning' ? <Clock size={12} /> : <Circle size={11} />}
                      <span>{statusObj.label}</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {lvl.area}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--py-blue-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                    {lvl.category}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {lvl.description}
                  </p>

                  <div className="level-topics-tags" style={{ marginBottom: '1rem' }}>
                    {lvl.topicIds.map((tId) => {
                      const tObj = TOPICS_BY_ID[tId];
                      const isDone = !!completedMap[tId];
                      return (
                        <button
                          key={tId}
                          type="button"
                          onClick={() => onNavigateToTopic(tId)}
                          className={`topic-tag-chip ${isDone ? 'done' : ''}`}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {isDone && <Check size={11} />}
                            <span>{tObj ? tObj.title : tId}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {statusObj.completedCount} / {statusObj.totalCount} Lessons ({statusObj.percent}%)
                  </span>

                  {firstTopic && (
                    <button
                      type="button"
                      onClick={() => onNavigateToTopic(firstTopic.id)}
                      className="study-level-btn"
                    >
                      <span>{statusObj.status === 'completed' ? 'Review' : 'Study'}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
