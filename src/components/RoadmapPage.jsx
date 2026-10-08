import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  Compass,
  BookOpen,
  Cpu,
  Zap,
  Trophy,
  Check,
  Circle,
  X
} from 'lucide-react';
import { ROADMAP_CATEGORIES } from '../data/roadmapData';
import { TOPICS_BY_ID } from '../data/topicsData';
import RoadmapStepper from './RoadmapStepper';
import RoadmapProgressHeader from './RoadmapProgressHeader';
import { RoadmapNodeCard } from './RoadmapNodeCard';
import { ProgressRing } from './ProgressRing';
import { AnimatedCounter } from './AnimatedCounter';
import PyCosmosLogo from './PyCosmosLogo';

export default function RoadmapPage({
  completedMap = {},
  onSelectNode,
  onNavigateToTopic
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter Categories & Nodes
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ROADMAP_CATEGORIES.map(category => {
      // Check stage filter
      if (selectedStageFilter !== 'all' && category.id !== selectedStageFilter) {
        return null;
      }

      // Filter nodes inside category
      const matchedNodes = category.nodes.filter(node => {
        // Status filter check
        const completedCount = node.topicIds.filter(id => completedMap[id]).length;
        const totalCount = node.topicIds.length;
        const isComplete = completedCount === totalCount && totalCount > 0;
        const isInProgress = completedCount > 0 && !isComplete;
        const isNotStarted = completedCount === 0;

        if (statusFilter === 'completed' && !isComplete) return false;
        if (statusFilter === 'in-progress' && !isInProgress) return false;
        if (statusFilter === 'not-started' && !isNotStarted) return false;

        // Search query check
        if (!q) return true;

        const matchesTitle = node.title.toLowerCase().includes(q);
        const matchesSummary = node.summary.toLowerCase().includes(q);
        const matchesTopics = node.topicIds.some(id => {
          const t = TOPICS_BY_ID[id];
          return t ? t.title.toLowerCase().includes(q) : id.toLowerCase().includes(q);
        });

        return matchesTitle || matchesSummary || matchesTopics;
      });

      if (matchedNodes.length === 0) return null;

      return {
        ...category,
        nodes: matchedNodes
      };
    }).filter(Boolean);
  }, [searchQuery, selectedStageFilter, statusFilter, completedMap]);

  // Total matched nodes count
  const totalMatchedNodes = filteredCategories.reduce((acc, cat) => acc + cat.nodes.length, 0);
  const totalAllNodes = ROADMAP_CATEGORIES.reduce((acc, cat) => acc + cat.nodes.length, 0);

  const isFilteringActive = searchQuery.trim() !== '' || selectedStageFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStageFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="roadmap-container-redesigned">
      {/* 1. PAGE HERO HEADER WITH SNAKE EMBLEM & KINETIC BLOOM */}
      <div className="roadmap-hero-header">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}
        >
          <div style={{ position: 'relative' }}>
            <div className="hero-snake-bloom" style={{ width: '100px', height: '100px' }} />
            <PyCosmosLogo size={60} animated={true} />
          </div>
          <div style={{ marginTop: '0.45rem', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
            PYCOSMOS CURRICULUM ARCHITECTURE
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="roadmap-main-title"
        >
          Python <span className="forge-gradient-text">Preparation Roadmap</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="roadmap-main-subtitle"
        >
          Follow the structured 5-stage progression path from basic syntax up to high-performance system engineering. Master every core concept with verified hands-on practice.
        </motion.p>

        {/* Quick Curriculum Metric Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="roadmap-stat-chips-row"
        >
          <div className="roadmap-stat-chip" style={{ color: 'var(--py-blue-light)' }}>
            <Compass size={15} />
            <span>5 Progressive Stages</span>
          </div>
          <div className="roadmap-stat-chip" style={{ color: '#c084fc' }}>
            <Layers size={15} />
            <span>18 Core Milestone Nodes</span>
          </div>
          <div className="roadmap-stat-chip" style={{ color: '#2dd4bf' }}>
            <BookOpen size={15} />
            <span>51 In-depth Lessons</span>
          </div>
          <div className="roadmap-stat-chip" style={{ color: '#fb923c' }}>
            <Clock size={15} />
            <span>~65 Estimated Study Hours</span>
          </div>
        </motion.div>
      </div>

      {/* 2. OVERALL ROADMAP PROGRESS HEADER (BAR/DONUT BREAKDOWN) */}
      <RoadmapProgressHeader categories={ROADMAP_CATEGORIES} completedMap={completedMap} />

      {/* 3. TOP LEVEL STEPPER BAR */}
      <RoadmapStepper categories={ROADMAP_CATEGORIES} completedMap={completedMap} />

      {/* 4. INTERACTIVE SEARCH & STAGE FILTERS CONTROLLER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="roadmap-filter-card"
      >
        <div className="roadmap-filter-top-row">
          {/* Search Input Box */}
          <div className="roadmap-search-box">
            <Search size={18} color="var(--py-blue-light)" />
            <input
              type="text"
              placeholder="Search roadmap by concept, node name, or topic (e.g. 'memory', 'recursion', 'async')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="roadmap-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--py-yellow)' }}><AnimatedCounter value={totalMatchedNodes} /></strong> of {totalAllNodes} nodes
            </span>

            {isFilteringActive && (
              <button
                onClick={resetFilters}
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="roadmap-filter-pills-row">
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Stage:
          </span>

          <button
            onClick={() => setSelectedStageFilter('all')}
            className={`roadmap-filter-pill ${selectedStageFilter === 'all' ? 'active' : ''}`}
          >
            All Stages
          </button>

          {ROADMAP_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedStageFilter(cat.id)}
              className={`roadmap-filter-pill ${selectedStageFilter === cat.id ? 'active' : ''}`}
              style={{
                borderColor: selectedStageFilter === cat.id ? cat.color : undefined
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
              <span>Stage {idx + 1}: {cat.title.replace(/^Level \d+: /, '')}</span>
            </button>
          ))}
        </div>

        {/* Status Filter Pills Row */}
        <div className="roadmap-filter-pills-row" style={{ marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Status:
          </span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`roadmap-filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
          >
            All Nodes
          </button>

          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`roadmap-filter-pill ${statusFilter === 'in-progress' ? 'active' : ''}`}
          >
            <Clock size={12} color="#ffd43b" />
            <span>In Progress</span>
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`roadmap-filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
          >
            <CheckCircle2 size={12} color="#22c55e" />
            <span>Completed</span>
          </button>

          <button
            onClick={() => setStatusFilter('not-started')}
            className={`roadmap-filter-pill ${statusFilter === 'not-started' ? 'active' : ''}`}
          >
            <Circle size={11} color="#8b949e" />
            <span>Not Started</span>
          </button>
        </div>
      </motion.div>

      {/* 5. LEVEL SECTIONS & SERPENTINE TIMELINE */}
      <div className="roadmap-timeline-wrapper">
        {filteredCategories.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              margin: '2rem 0'
            }}
          >
            <Search size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Roadmap Nodes Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              No milestone nodes matched your current search query or status filter.
            </p>
            <button
              onClick={resetFilters}
              className="btn btn-yellow"
              style={{ padding: '0.65rem 1.5rem', borderRadius: '10px' }}
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((category, levelIdx) => {
            let catTotal = 0;
            let catDone = 0;
            category.nodes.forEach(n => {
              n.topicIds.forEach(id => {
                catTotal += 1;
                if (completedMap[id]) catDone += 1;
              });
            });
            const catPercent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
            const isStageDone = catPercent === 100 && catTotal > 0;

            return (
              <section
                key={category.id}
                id={`level-section-${category.id}`}
                className="roadmap-level-section"
                style={{ '--level-color': category.color }}
              >
                {/* LEVEL SECTION HEADER WITH SPACING & PROGRESS RING */}
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="roadmap-level-header-redesigned"
                >
                  <div className="level-header-left">
                    <div
                      className="level-tag-pill"
                      style={{
                        background: `${category.color}20`,
                        color: category.color,
                        border: `1.5px solid ${category.color}50`
                      }}
                    >
                      Stage {levelIdx + 1}
                      {isStageDone && <span style={{ marginLeft: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>• <CheckCircle2 size={11} /> COMPLETED</span>}
                    </div>
                    <h2 className="level-header-title">{category.title}</h2>
                    <p className="level-header-desc">{category.description}</p>
                  </div>

                  <div className="level-header-right">
                    <ProgressRing percentage={catPercent} size={76} stroke={7} color={category.color} />
                  </div>
                </motion.div>

                {/* VERTICAL TIMELINE CONTAINER */}
                <div className="timeline-cards-container">
                  {/* SVG CONNECTING PATH LINE */}
                  <svg className="timeline-svg-connector" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                      d="M 50 0 L 50 100"
                      stroke={category.color}
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.65 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </svg>

                  <div className="timeline-nodes-grid">
                    {category.nodes.map((node, nodeIdx) => {
                      const isRight = nodeIdx % 2 !== 0;

                      // Check node completion
                      const completedCount = node.topicIds.filter(id => completedMap[id]).length;
                      const totalCount = node.topicIds.length;
                      const isNodeDone = completedCount === totalCount && totalCount > 0;
                      const isNodeActive = completedCount > 0 && !isNodeDone;

                      return (
                        <div
                          key={node.id}
                          className={`timeline-card-wrapper ${isRight ? 'align-right' : 'align-left'}`}
                        >
                          {/* CENTER TIMELINE NODE BULLET */}
                          <div
                            className="timeline-center-bullet"
                            style={{
                              background: isNodeDone ? '#22c55e' : isNodeActive ? '#f59e0b' : category.color,
                              boxShadow: isNodeDone
                                ? '0 0 16px rgba(34, 197, 94, 0.6)'
                                : isNodeActive
                                ? '0 0 16px rgba(245, 158, 11, 0.6)'
                                : `0 0 12px ${category.color}80`
                            }}
                          >
                            {isNodeDone ? (
                              <Check size={14} color="#0d1117" strokeWidth={3} />
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#0d1117', fontWeight: 900 }}>
                                {nodeIdx + 1}
                              </span>
                            )}
                          </div>

                          <RoadmapNodeCard
                            node={node}
                            index={nodeIdx}
                            categoryColor={category.color}
                            completedMap={completedMap}
                            onNavigateToTopic={onNavigateToTopic}
                            isRightSide={isRight}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
