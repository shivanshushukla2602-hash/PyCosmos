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
  X
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
      {/* 1. HERO HEADER WITH SNAKE EMBLEM & METRICS */}
      <div className="tracker-hero-banner">
        <div className="tracker-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
          >
            <div style={{ position: 'relative' }}>
              <div className="hero-snake-bloom" style={{ width: '80px', height: '80px' }} />
              <PyCosmosLogo size={46} animated={true} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
              27-LEVEL PYTHON MASTERY MATRIX
            </span>
          </motion.div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.4rem' }}>
            Python <span className="forge-gradient-text">Mastery Tracker</span>
          </h1>
          <p style={{ maxWidth: '720px', lineHeight: 1.6 }}>
            Track your systematic progression across all 27 technical milestones—from fundamental CPython execution mechanics up to asynchronous concurrency and production AI/ML architectures.
          </p>

          {/* Quick Metrics Bar with AnimatedCounter */}
          <div className="tracker-metrics-row">
            <div className="tracker-stat-box" style={{ borderLeft: '4px solid var(--py-yellow)' }}>
              <span className="stat-label">Overall Mastery</span>
              <span className="stat-val highlight"><AnimatedCounter value={overallPercent} />%</span>
            </div>
            <div className="tracker-stat-box" style={{ borderLeft: '4px solid #22c55e' }}>
              <span className="stat-label">Completed Levels</span>
              <span className="stat-val"><AnimatedCounter value={completedLevels} /> / {totalLevels}</span>
            </div>
            <div className="tracker-stat-box" style={{ borderLeft: '4px solid #f59e0b' }}>
              <span className="stat-label">In-Flight Levels</span>
              <span className="stat-val"><AnimatedCounter value={inProgressLevels} /></span>
            </div>
            <div className="tracker-stat-box" style={{ borderLeft: '4px solid var(--py-blue-light)' }}>
              <span className="stat-label">Next Target</span>
              <span className="stat-val" style={{ fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nextTargetLevel ? `L${nextTargetLevel.level}: ${nextTargetLevel.area}` : 'All Mastered'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Forge Progress Bar */}
        <div className="global-progress-track">
          <div className="track-bar-bg" style={{ height: '12px' }}>
            <motion.div
              className="track-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
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
